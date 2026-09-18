# Architecture

## Capas y dependencias

```text
Banking.Api ───────→ Banking.Application ←────── Banking.Infrastructure
                             ↓                           ↓
                       Banking.Domain ←──────────────────┘
```

- `Banking.Domain` contiene entidades, `TransactionType` y excepciones de dominio. No depende de frameworks externos.
- `Banking.Application` contiene contratos HTTP reutilizables, interfaces, servicios y casos de uso. Depende solo del dominio y de abstracciones de DI.
- `Banking.Infrastructure` implementa repositorios y unidad de trabajo con EF Core y SQLite.
- `Banking.Api` compone dependencias, expone controllers delgados y traduce excepciones a HTTP.

## Flujo de una solicitud

```text
Request → Controller → Application Service → Repository → EF Core → SQLite
                                                ↓
Response DTO ← Controller ← Application Service
```

Los controllers reciben DTOs, delegan y devuelven códigos HTTP. Las reglas sobre saldo, montos y fondos permanecen en dominio/aplicación.

## Persistencia e integridad

`BankingDbContext` configura las relaciones `Customer 1:N BankAccount` y `BankAccount 1:N Transaction`, claves foráneas, restricciones de validación e índice único de `AccountNumber`.

La unidad de trabajo abre una transacción para cada depósito o retiro. El saldo y el movimiento se confirman juntos; cualquier error revierte ambos cambios. `BalanceAfterTransaction` se persiste para conservar la evidencia histórica.

`BankAccount.Version` funciona como token de concurrencia optimista. Una actualización concurrente que use una versión obsoleta no sobrescribe el saldo y se traduce a `409 Conflict`.

## Errores

Los servicios lanzan excepciones específicas. `GlobalExceptionHandler`, basado en `IExceptionHandler`, genera `ProblemDetails` seguros y consistentes sin `try/catch` repetidos en controllers.

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

## Clientes futuros

React Web y Flutter Mobile consumirán `Banking.Api` mediante HTTPS/JSON. Ambos reutilizarán los mismos contratos y toda regla financiera seguirá ejecutándose en backend. Transferencias, monedas, autenticación y otros servicios futuros pueden agregarse como nuevos casos de uso sin acoplarlos a la presentación actual.
