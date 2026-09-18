# Architecture

## Capas y dependencias

```text
Banking.Api ───────→ Banking.Application ←────── Banking.Infrastructure
                             ↓                           ↓
                       Banking.Domain ←──────────────────┘
```

- `Banking.Domain` contiene entidades, `TransactionType` y excepciones de dominio. No depende de frameworks externos.
- `Banking.Application` contiene contratos, interfaces, servicios y casos de uso. Depende del dominio.
- `Banking.Infrastructure` implementa repositorios y unidad de trabajo con EF Core y SQLite.
- `Banking.Api` compone dependencias, expone controllers delgados y traduce excepciones a HTTP.

## Flujo de una solicitud

```text
React Web ─┐
           ├─ HTTP/JSON
Flutter ───┘
           ↓
Request → Controller → Application Service → Repository → EF Core → SQLite
                                                ↓
Response DTO ← Controller ← Application Service
    ↓
React Web / Flutter
```

Los controllers reciben DTOs, delegan y devuelven códigos HTTP. Las reglas sobre saldo, montos y fondos permanecen en dominio/aplicación.

## Organización de controllers

Los endpoints se agrupan por **recurso y responsabilidad**, no en un único controller monolítico ni en un controller por endpoint:

- `CustomersController` concentra las operaciones HTTP relacionadas con clientes y depende únicamente de `ICustomerService`.
- `AccountsController` concentra cuentas, saldo y movimientos asociados a una cuenta y delega en `IBankAccountService` e `ITransactionService`.

Esta separación mantiene alta cohesión y aplica el principio de responsabilidad única (SRP). También evita mezclar en una misma clase responsabilidades de clientes, cuentas y movimientos.

Los controllers permanecen deliberadamente delgados: no usan `BankingDbContext`, no acceden directamente a EF Core, no generan números de cuenta y no implementan reglas financieras. Su responsabilidad es traducir HTTP hacia servicios de aplicación y devolver DTOs/status codes.

La web y la aplicación Flutter funcionan como clientes del contrato HTTP. No acceden a EF Core, no calculan saldos, no generan números de cuenta y no replican la validación definitiva de fondos.

## Persistencia e integridad

`BankingDbContext` configura las relaciones `Customer 1:N BankAccount` y `BankAccount 1:N Transaction`, claves foráneas, restricciones de validación e índice único de `AccountNumber`.

La unidad de trabajo abre una transacción para cada depósito o retiro. El saldo y el movimiento se confirman juntos; cualquier error revierte ambos cambios. `BalanceAfterTransaction` se persiste para conservar la evidencia histórica.

`BankAccount.Version` funciona como token de concurrencia optimista. Una actualización concurrente que use una versión obsoleta no sobrescribe el saldo y se traduce a `409 Conflict`.

## Decisiones de diseño y ownership de reglas

- **`decimal` para dinero:** balance, ingresos y montos se representan con `decimal` en el backend para evitar errores binarios de punto flotante en reglas financieras.
- **DTOs en las fronteras:** las entidades de dominio/persistencia no se exponen directamente por HTTP.
- **Repository + Unit of Work:** los repositorios encapsulan persistencia y la unidad de trabajo coordina el commit transaccional.
- **Atomicidad:** depósito/retiro y creación del movimiento se confirman como una sola operación de base de datos.
- **`BalanceAfterTransaction`:** se persiste en cada movimiento para conservar el estado histórico exacto en el momento de la operación, sin reconstruirlo a partir del saldo actual.
- **Concurrencia optimista:** `BankAccount.Version` permite detectar escrituras simultáneas obsoletas; el conflicto se traduce a `409 Conflict`.
- **Unicidad por capas:** el generador evita repeticiones básicas en proceso, el servicio comprueba colisiones y SQLite aplica el índice `UNIQUE` como garantía final.
- **Backend como fuente de verdad:** Web y Mobile pueden validar formato para UX, pero Banking.Api decide existencia, saldo, fondos suficientes, número de cuenta y persistencia.

## Errores

Los servicios lanzan excepciones específicas. `GlobalExceptionHandler`, basado en `IExceptionHandler`, genera `ProblemDetails` seguros y consistentes sin `try/catch` repetidos en controllers.

Los clientes normalizan esas respuestas y las presentan como mensajes de contexto. El rechazo de fondos insuficientes no altera el saldo ni agrega una transacción.

## Integration testing

Los integration tests recorren la aplicación completa con infraestructura aislada:

```text
WebApplicationFactory
        ↓
ASP.NET Core real
        ↓
Application Services
        ↓
EF Core
        ↓
SQLite temporal
```

`BankingApiFactory` sustituye únicamente la conexión de base de datos por un archivo temporal único y ejecuta `MigrateAsync`. Controllers, servicios, repositorios, manejo de errores y migraciones son los mismos de la aplicación. Estos tests no leen ni modifican la `banking.db` de desarrollo.

## Clientes

La aplicación React ya consume `Banking.Api` mediante HTTP/JSON y demuestra el flujo completo solicitado: clientes, cuentas, saldo, depósitos, retiros e historial.

La aplicación Flutter consume los mismos seis endpoints mediante un cliente Dio central. Sus repositorios mapean los contratos y Riverpod administra consultas de saldo e historial. Después de una operación, invalida ambas consultas para volver a obtener la verdad desde Banking.Api.

```text
Flutter Presentation / Riverpod
              ↓
Repository interfaces
              ↓
Dio implementations → Banking.Api
```

### Fuente de verdad en clientes

Tras un depósito o retiro, ninguno de los clientes calcula el nuevo saldo de forma autoritativa. Web invalida sus queries de TanStack Query y Mobile invalida los providers de saldo e historial; ambos vuelven a consultar `Banking.Api`.

La referencia de transacción puede abreviarse visualmente, pero el `TransactionId` completo se conserva en el modelo y es el valor que se copia al portapapeles.

Transferencias, autenticación, tarjetas, múltiples monedas y otros servicios futuros deben agregarse como nuevos casos de uso del backend antes de exponerse en clientes.
