# Testing Strategy

## Resumen

La estrategia combina pruebas rápidas de reglas y casos de uso con pruebas que recorren la API y la persistencia real.

| Métrica | Resultado |
|---|---:|
| Total | 41 |
| Unit tests | 33 |
| Integration tests | 8 |
| Passed | 41 |
| Failed | 0 |
| Skipped | 0 |

Resultado obtenido ejecutando `dotnet test Banking.sln` el 17 de septiembre de 2026.

## Unit Tests

Los unit tests están en `backend/tests/Banking.UnitTests`. Usan xUnit, repositorios en memoria, `InMemoryUnitOfWork`, un generador controlado y `MutableTimeProvider`. No levantan ASP.NET Core ni escriben en SQLite.

### AccountNumberGenerator — 6 tests

| Test | Qué prueba | Input principal | Resultado esperado | Por qué importa |
|---|---|---|---|---|
| `Generate_Always_StartsWithAccPrefix` | Prefijo obligatorio | Reloj fijo en 2026-09-17 | El valor empieza con `ACC-` | Mantiene el contrato público del número de cuenta. |
| `Generate_Always_ContainsCurrentDate` | Fecha incluida en el número | Fecha local fija 2026-09-17 | Contiene `20260917` | Confirma que `YYYYMMDD` corresponde al día de generación. |
| `Generate_Always_HasExpectedLength` | Longitud completa | Una generación | Exactamente 17 caracteres | Detecta separadores o dígitos faltantes. |
| `Generate_Always_HasExactlyFourTrailingDigits` | Longitud y naturaleza del sufijo | Una generación | Los últimos cuatro caracteres son dígitos | Garantiza el componente `XXXX`. |
| `Generate_Always_HasCompleteExpectedFormat` | Estructura completa | Fecha fija 2026-09-17 | Coincide con `^ACC-20260917-\d{4}$` | Verifica prefijo, guiones, fecha y sufijo en conjunto. |
| `Generate_RepeatedCalls_ProducesBasicUniqueness` | Unicidad dentro del generador | 100 llamadas en la misma fecha | Los 100 valores son diferentes | Comprueba el `HashSet` que evita repetir sufijos en el proceso. |

### Customer — 8 tests

| Test | Qué prueba | Input principal | Resultado esperado | Por qué importa |
|---|---|---|---|---|
| `Create_EmptyFullName_Throws` | Nombre obligatorio | `FullName = ""` | `DomainValidationException` | Evita perfiles sin nombre. |
| `Create_WhitespaceFullName_Throws` | Rechazo de espacios como nombre | `FullName = "   "` | `DomainValidationException` | Impide que un valor visualmente vacío pase la regla. |
| `Create_NameWithNicaraguanCharacters_Succeeds` | Soporte de caracteres válidos | `"  María-José O'Ñate  "` | Customer creado con nombre normalizado | Confirma que acentos, `ñ`, apóstrofe y guion no se rechazan y que se aplica `Trim`. |
| `Create_FutureBirthDate_Throws` | Fecha no futura | Día posterior a la fecha controlada | `DomainValidationException` | Protege la coherencia de la fecha de nacimiento. |
| `Create_MissingBirthDate_Throws` | Fecha obligatoria | `BirthDate = default` | `DomainValidationException` | Evita persistir una fecha no informada. |
| `Create_NegativeMonthlyIncome_Throws` | Ingreso no negativo | `MonthlyIncome = -0.01` | `DomainValidationException` | Protege la restricción mínima del perfil. |
| `Create_ZeroMonthlyIncome_Succeeds` | Límite inferior válido | `MonthlyIncome = 0` | Customer creado con ingreso cero | Distingue cero válido de un valor negativo. |
| `Create_EmptyGender_Throws` | Género obligatorio según la regla actual | `Gender = ""` | `DomainValidationException` | Confirma la invariante existente sin imponer valores de catálogo. |

### BankAccount — 7 tests

| Test | Qué prueba | Input principal | Resultado esperado | Por qué importa |
|---|---|---|---|---|
| `CreateAccount_ExistingCustomer_CreatesAccount` | Creación para customer registrado | Customer existente, saldo 500 | Cuenta agregada y un save | Verifica el caso de uso principal y la coordinación con persistencia. |
| `CreateAccount_UnknownCustomer_Throws` | Existencia obligatoria del customer | GUID no registrado, saldo 500 | `CustomerNotFoundException`; ninguna cuenta agregada | Evita cuentas sin propietario válido. |
| `CreateAccount_GeneratesAccountNumber` | Uso de la abstracción generadora | Generador stub devuelve `ACC-20260917-4821` | Response contiene ese número | Confirma que el servicio no fabrica ni hardcodea el número. |
| `CreateAccount_ValidInitialBalance_PersistsBalance` | Persistencia de saldo inicial | `InitialBalance = 12750.25` | Response y entidad conservan el importe | Protege la precisión y el valor de apertura. |
| `CreateAccount_ZeroInitialBalance_PersistsZeroBalance` | Saldo cero válido | `InitialBalance = 0` | Cuenta creada y persistida con cero | Comprueba el límite permitido por la regla `>= 0`. |
| `CreateAccount_FirstNumberCollides_GeneratesAnotherNumber` | Recuperación ante colisión previa | Primer candidato existente; segundo disponible | Se crea con el segundo candidato | Valida la comprobación de colisiones en Application. |
| `Create_NegativeInitialBalance_Throws` | Rechazo de saldo negativo en dominio | `InitialBalance = -0.01` | `DomainValidationException` | Impide abrir una cuenta con saldo inválido. |

### Deposits — 4 tests

| Test | Qué prueba | Input principal | Resultado esperado | Por qué importa |
|---|---|---|---|---|
| `Deposit_ValidAmount_IncreasesBalance` | Depósito válido completo | Saldo 1000; depósito 250 | Saldo 1250; transacción `Deposit`; `BalanceAfterTransaction = 1250`; un save | Verifica saldo, trazabilidad histórica y confirmación conjunta. |
| `Deposit_ZeroAmount_Throws` | Monto estrictamente positivo | Depósito 0 | `InvalidTransactionAmountException`; saldo e historial intactos | Evita movimientos sin valor. |
| `Deposit_NegativeAmount_Throws` | Rechazo de monto negativo | Depósito -100 | `InvalidTransactionAmountException`; saldo e historial intactos | Impide invertir el significado financiero del endpoint. |
| `Deposit_UnknownAccount_Throws` | Cuenta obligatoria | Número inexistente; depósito 100 | `BankAccountNotFoundException`; cero saves | Impide registrar movimientos huérfanos. |

### Withdrawals — 6 tests

| Test | Qué prueba | Input principal | Resultado esperado | Por qué importa |
|---|---|---|---|---|
| `Withdraw_ValidAmount_DecreasesBalance` | Retiro válido completo | Saldo 1000; retiro 350 | Saldo 650; transacción `Withdrawal`; saldo histórico 650 | Verifica el comportamiento financiero principal. |
| `Withdraw_ExactBalance_Succeeds` | Retiro del saldo completo | Saldo y retiro de 1000 | Saldo final e histórico iguales a cero | Confirma que la regla permite `Balance == Amount`. |
| `Withdraw_InsufficientFunds_Throws` | Protección contra sobregiro | Saldo 1000; retiro 1000.01 | `InsufficientFundsException`; saldo 1000; historial vacío; cero saves | Demuestra que el rechazo no deja efectos parciales. |
| `Withdraw_ZeroAmount_Throws` | Monto estrictamente positivo | Retiro 0 | `InvalidTransactionAmountException`; estado intacto | Evita movimientos sin valor. |
| `Withdraw_NegativeAmount_Throws` | Rechazo de monto negativo | Retiro -1 | `InvalidTransactionAmountException`; estado intacto | Impide que un retiro negativo incremente el saldo. |
| `Withdraw_UnknownAccount_Throws` | Cuenta obligatoria | Número inexistente; retiro 100 | `BankAccountNotFoundException`; saldo e historial existentes intactos; cero saves | Evita movimientos contra cuentas inexistentes. |

### Transaction History — 2 tests

| Test | Qué prueba | Input principal | Resultado esperado | Por qué importa |
|---|---|---|---|---|
| `GetHistory_AccountWithoutMovements_ReturnsEmptyCollection` | Historial válido sin movimientos | Cuenta existente recién creada | Colección vacía | Distingue una cuenta sin actividad de una cuenta inexistente. |
| `GetHistory_MultipleMovements_ReturnsChronologicalHistoricalBalances` | Orden y saldos históricos | Saldo 1000; depósito 500; un minuto después retiro 200 | `Deposit` antes de `Withdrawal`; montos 500/200; saldos 1500/1300 | Verifica orden cronológico, tipos, montos, timestamps y `BalanceAfterTransaction`. |

## Integration Tests

Los integration tests están en `backend/tests/Banking.IntegrationTests`. Cada test usa `BankingApiFactory`, basada en `WebApplicationFactory<Program>`, para ejecutar el pipeline real de ASP.NET Core.

La factory sustituye el registro de `BankingDbContext` por una conexión a un archivo SQLite temporal con nombre único. Antes de usar la API ejecuta `MigrateAsync`, por lo que tablas, claves, checks e índices proceden de las migraciones reales. Al finalizar elimina el archivo. No usa ni modifica `backend/src/Banking.Api/banking.db`.

| Test | Endpoint / escenario | Qué valida | Respuesta esperada | Infraestructura real utilizada |
|---|---|---|---|---|
| `PostCustomers_ValidRequest_ReturnsCreated` | `POST /api/customers` con nombre Unicode e ingreso cero | Model binding, controller, servicio, EF y respuesta | `201 Created` y `CustomerResponse` con los valores enviados | ASP.NET Core, DI, service, repository, EF Core, migración y SQLite temporal |
| `PostCustomers_InvalidJson_ReturnsBadRequest` | `POST /api/customers` con JSON truncado | Rechazo de JSON que no puede deserializarse | `400 Bad Request` con `ValidationProblemDetails` y título `Solicitud inválida` | Pipeline MVC, input formatter y configuración de validación real |
| `PostAccounts_MalformedCustomerId_ReturnsBadRequest` | `POST /api/accounts` con `customerId = "not-a-guid"` | Conversión y validación del contrato HTTP | `400 Bad Request` con `ValidationProblemDetails` | Model binding y respuesta automática configurada en `Program` |
| `GetBalance_UnknownAccount_ReturnsNotFoundProblemDetails` | `GET /api/accounts/ACC-20260917-9999/balance` | Consulta real, excepción de aplicación y traducción global | `404 Not Found`, título `Cuenta no encontrada` | Controller, service, repository EF, SQLite e `IExceptionHandler` |
| `PostWithdrawal_InsufficientFunds_ReturnsBadRequestProblemDetails` | Cuenta real con 100; `POST .../withdrawals` por 100.01 | Regla de fondos, rollback lógico y contrato de error | `400 Bad Request`, título `Fondos insuficientes` | Flujo HTTP completo, dominio, Unit of Work, EF, SQLite e exception handler |
| `SaveChanges_DuplicateAccountNumber_ThrowsUniqueConstraintViolation` | Dos cuentas con `ACC-20260917-4321` | Garantía física de unicidad, además de controles de aplicación | `DbUpdateException` con SQLite error 19 y extended error 2067 | `BankingDbContext`, migración `InitialCreate`, índice UNIQUE y SQLite real |
| `PostCustomers_FullNameExceedsConfiguredLength_ReturnsBadRequest` | `POST /api/customers` con nombre de 201 caracteres | `[MaxLength(200)]` del request | `400 Bad Request` y error asociado a `FullName` | Model validation real de ASP.NET Core |
| `PostCustomers_GenderExceedsConfiguredLength_ReturnsBadRequest` | `POST /api/customers` con género de 51 caracteres | `[MaxLength(50)]` del request | `400 Bad Request` y error asociado a `Gender` | Model validation real de ASP.NET Core |

### Aislamiento de la base

```text
BankingApiFactory
       ↓
WebApplicationFactory<Program>
       ↓
ASP.NET Core real
       ↓
Services y repositories reales
       ↓
EF Core + MigrateAsync
       ↓
SQLite temporal único
```

El aislamiento evita dependencia entre tests, no contamina la base de desarrollo y permite comprobar SQL, migraciones, foreign keys e índices del provider solicitado.

## Casos límite cubiertos

| Caso | Evidencia principal |
|---|---|
| String vacío | `Create_EmptyFullName_Throws`, `Create_EmptyGender_Throws` |
| Solo whitespace | `Create_WhitespaceFullName_Throws` |
| Unicode, acentos, `ñ`, apóstrofe y guion | `Create_NameWithNicaraguanCharacters_Succeeds`, `PostCustomers_ValidRequest_ReturnsCreated` |
| Fecha futura o faltante | `Create_FutureBirthDate_Throws`, `Create_MissingBirthDate_Throws` |
| Ingreso negativo o cero | `Create_NegativeMonthlyIncome_Throws`, `Create_ZeroMonthlyIncome_Succeeds` |
| Límites de longitud | `PostCustomers_FullNameExceedsConfiguredLength_ReturnsBadRequest`, `PostCustomers_GenderExceedsConfiguredLength_ReturnsBadRequest` |
| Saldo inicial negativo o cero | `Create_NegativeInitialBalance_Throws`, `CreateAccount_ZeroInitialBalance_PersistsZeroBalance` |
| Cuenta inexistente | `Deposit_UnknownAccount_Throws`, `Withdraw_UnknownAccount_Throws`, `GetBalance_UnknownAccount_ReturnsNotFoundProblemDetails` |
| Depósitos cero o negativos | `Deposit_ZeroAmount_Throws`, `Deposit_NegativeAmount_Throws` |
| Retiros cero o negativos | `Withdraw_ZeroAmount_Throws`, `Withdraw_NegativeAmount_Throws` |
| Retiro exacto | `Withdraw_ExactBalance_Succeeds` |
| Fondos insuficientes y estado intacto | `Withdraw_InsufficientFunds_Throws`, `PostWithdrawal_InsufficientFunds_ReturnsBadRequestProblemDetails` |
| Historial vacío | `GetHistory_AccountWithoutMovements_ReturnsEmptyCollection` |
| Historial cronológico | `GetHistory_MultipleMovements_ReturnsChronologicalHistoricalBalances` |
| `BalanceAfterTransaction` | Tests válidos de depósito, retiro e historial |
| Colisión de número de cuenta | `CreateAccount_FirstNumberCollides_GeneratesAnotherNumber` |
| UNIQUE real en SQLite | `SaveChanges_DuplicateAccountNumber_ThrowsUniqueConstraintViolation` |
| JSON inválido | `PostCustomers_InvalidJson_ReturnsBadRequest` |
| GUID mal formado | `PostAccounts_MalformedCustomerId_ReturnsBadRequest` |

## Unit vs Integration

Un **unit test** ejecuta una unidad de comportamiento en aislamiento. En esta solución sustituye repositories, Unit of Work, generador o reloj por dobles controlados. Es rápido, determinista y permite señalar con precisión qué regla falló, pero no demuestra que routing, model binding, EF, migraciones y SQLite funcionen juntos.

Un **integration test** ejecuta componentes reales a través de su frontera HTTP o de persistencia. Aquí arranca ASP.NET Core con `WebApplicationFactory`, usa los controllers y servicios registrados por `Program`, aplica migraciones y escribe en SQLite temporal. Tarda más, pero detecta fallos de configuración, serialización, status codes, mapping EF e integridad física que un unit test no puede observar.

Ambos niveles se complementan: los unit tests explican las reglas y los integration tests confirman que la aplicación ensamblada conserva esas reglas en sus fronteras reales.

## Nota sobre ProblemDetails y Content-Type

Los tests validan los cuerpos de error como `ProblemDetails` o `ValidationProblemDetails`, incluyendo status y títulos esperados.

Durante la auditoría se observó que algunas respuestas se serializan con `Content-Type: application/json`, aunque la estructura del cuerpo corresponde correctamente a ProblemDetails. Este hallazgo no se presenta como incumplimiento: la prueba exige JSON limpio y seguro junto con status HTTP correctos, y ambas condiciones se cumplen. No se modificó código de producción como parte de esta documentación.

## Cómo ejecutar

Desde `backend/`:

```bash
dotnet test Banking.sln
```

El comando restaura lo necesario, compila los proyectos y ejecuta las dos suites incluidas en la solución.

## Resultado actual

Última ejecución completa verificada:

```text
Banking.UnitTests
Passed: 33  Failed: 0  Skipped: 0  Total: 33

Banking.IntegrationTests
Passed: 8   Failed: 0  Skipped: 0  Total: 8

Total
Passed: 41  Failed: 0  Skipped: 0  Total: 41
```
