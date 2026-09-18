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

La web y la aplicación Flutter funcionan como clientes del contrato HTTP. No acceden a EF Core, no calculan saldos, no generan números de cuenta y no replican la validación definitiva de fondos.

## Persistencia e integridad

`BankingDbContext` configura las relaciones `Customer 1:N BankAccount` y `BankAccount 1:N Transaction`, claves foráneas, restricciones de validación e índice único de `AccountNumber`.

La unidad de trabajo abre una transacción para cada depósito o retiro. El saldo y el movimiento se confirman juntos; cualquier error revierte ambos cambios. `BalanceAfterTransaction` se persiste para conservar la evidencia histórica.

`BankAccount.Version` funciona como token de concurrencia optimista. Una actualización concurrente que use una versión obsoleta no sobrescribe el saldo y se traduce a `409 Conflict`.

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

Transferencias, autenticación, tarjetas, múltiples monedas y otros servicios futuros deben agregarse como nuevos casos de uso del backend antes de exponerse en clientes.
