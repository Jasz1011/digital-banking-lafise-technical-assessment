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

Última ejecución completa verificada el **18 de septiembre de 2026** mediante:

```powershell
cd backend
dotnet test Banking.sln
```

Resultado:

```text
Total: 41
Passed: 41
Failed: 0
Skipped: 0
```

## Unit Tests

Los unit tests están en `backend/tests/Banking.UnitTests`. Usan xUnit, repositorios en memoria, `InMemoryUnitOfWork`, generadores controlados y `MutableTimeProvider`. No levantan ASP.NET Core, no ejecutan HTTP y no escriben en SQLite.

Su objetivo es verificar reglas y casos de uso de forma rápida, determinista y aislada.

| Grupo | Tests | Qué valida |
|---|---:|---|
| `AccountNumberGeneratorTests` | 6 | prefijo `ACC-`, fecha actual, longitud 17, cuatro dígitos finales, formato completo y unicidad básica en 100 generaciones |
| `CustomerValidationTests` | 8 | nombre vacío/espacios, caracteres Unicode, fecha futura/faltante, ingreso negativo/cero y género obligatorio |
| `BankAccountServiceTests` | 6 | cliente existente/desconocido, generación del número, saldo inicial válido/cero y reintento ante colisión |
| `BankAccountValidationTests` | 1 | rechazo de saldo inicial negativo en dominio |
| `DepositTests` | 4 | depósito válido, monto cero, negativo y cuenta inexistente |
| `WithdrawalTests` | 6 | retiro válido, retiro del saldo exacto, fondos insuficientes, monto cero, negativo y cuenta inexistente |
| `TransactionHistoryTests` | 2 | historial vacío y orden cronológico con `BalanceAfterTransaction` |
| **Total** | **33** | |

### Qué demuestran los unit tests

- Un depósito válido aumenta el saldo, crea un movimiento `Deposit`, conserva monto y `BalanceAfterTransaction` y solicita un único guardado.
- Un retiro válido disminuye el saldo y un retiro por el saldo exacto puede dejar la cuenta en cero.
- Fondos insuficientes lanzan `InsufficientFundsException` antes de persistir: el saldo queda intacto, no se agrega movimiento y `SaveCount` permanece en cero.
- Montos cero o negativos se rechazan antes de modificar estado.
- Una cuenta inexistente no produce escritura.
- El historial devuelve movimientos en orden cronológico y conserva el saldo histórico posterior a cada operación.

Total: **33 unit tests**.
## Integration Tests

Los integration tests están en `backend/tests/Banking.IntegrationTests`. Cada test usa `BankingApiFactory`, basada en `WebApplicationFactory<Program>`, para ejecutar el pipeline real de ASP.NET Core.

La factory sustituye el registro de `BankingDbContext` por una conexión a un archivo SQLite temporal con nombre único. Antes de usar la API ejecuta `MigrateAsync`, por lo que tablas, claves, checks e índices proceden de las migraciones reales. Al finalizar elimina el archivo. No usa ni modifica `backend/src/Banking.Api/banking.db`.

Los 8 escenarios verifican:

- `POST /api/customers` válido → `201 Created`;
- JSON inválido → `400 Bad Request`;
- `customerId` mal formado → `400 Bad Request`;
- cuenta inexistente → `404 Not Found` con ProblemDetails;
- retiro sin fondos → `400 Bad Request` con ProblemDetails;
- restricción física `UNIQUE` de `AccountNumber` en SQLite;
- `FullName` superior al máximo → `400 Bad Request`;
- `Gender` superior al máximo → `400 Bad Request`.

### Aislamiento

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

## Sobre el log del test UNIQUE

La prueba `SaveChanges_DuplicateAccountNumber_ThrowsUniqueConstraintViolation` provoca deliberadamente una violación del índice único.

Por eso, durante `dotnet test`, puede aparecer un log parecido a:

```text
SQLite Error 19: 'UNIQUE constraint failed: BankAccounts.AccountNumber'
```

Ese mensaje es **esperado dentro del escenario de integración**. No representa una falla de la suite. La referencia definitiva es el resumen final: 41 correctas, 0 fallidas.

## Frontend

La Web se valida por separado:

```powershell
cd web
npm run lint
npm run build
```

Última validación del 18 de septiembre de 2026:

- ESLint finalizó sin errores ni warnings permitidos.
- TypeScript validó `tsconfig.app.json` y `tsconfig.node.json`.
- Vite transformó 2173 módulos y completó el build de producción correctamente.

La validación manual recorrió:

1. creación de cliente;
2. creación de cuenta;
3. consulta de saldo;
4. depósito;
5. retiro;
6. retiro con fondos insuficientes;
7. historial cronológico;
8. referencia única de transacción;
9. saldo histórico posterior;
10. responsive desktop/mobile.

## Mobile tests

La aplicación Flutter tiene **19 tests** en `mobile/test/` y se valida además con `flutter analyze` y `flutter build apk --debug`.

| Área | Tests | Qué cubre |
|---|---:|---|
| `api_error_parser_test.dart` | 3 | ProblemDetails, ValidationProblemDetails y mensaje seguro sin filtrar detalles de conexión |
| `formatters_test.dart` | 4 | moneda NIO/C$, zona `America/Managua`, normalización/máscara de cuenta y parsing monetario |
| `validators_test.dart` | 5 | cliente, fecha, género, GUID, formato `ACC-YYYYMMDD-XXXX` y montos |
| `repositories_test.dart` | 3 | contrato JSON y mapeo de customer, account y transactions |
| Widget/crash tests | 4 | detalle, búsqueda, validación inline y shell sin excepciones de render |
| **Total** | **19** | |

Estos tests no sustituyen al backend. Verifican que Mobile respete contratos, formatee correctamente, presente errores seguros y no falle en widgets clave.

Última validación documentada:

```text
flutter analyze: no issues found
flutter test: 19 passed
flutter build apk --debug: correcto
```

## Unit vs Integration

Un **unit test** ejecuta una unidad de comportamiento en aislamiento. Es rápido y determinista, pero no demuestra que routing, model binding, EF, migraciones y SQLite funcionen juntos.

Un **integration test** ejecuta componentes reales a través de la frontera HTTP o de persistencia. Aquí arranca ASP.NET Core con `WebApplicationFactory`, usa controllers y servicios reales, aplica migraciones y escribe en SQLite temporal.

Ambos niveles se complementan: los unit tests explican las reglas y los integration tests confirman que la aplicación ensamblada conserva esas reglas en sus fronteras reales.

## Nota sobre ProblemDetails y Content-Type

Los tests validan cuerpos de error como `ProblemDetails` o `ValidationProblemDetails`, incluyendo status y títulos esperados.

Algunas respuestas pueden serializarse con `Content-Type: application/json` aunque la estructura corresponda correctamente a ProblemDetails. La prueba técnica exige JSON limpio y seguro junto con status HTTP correctos, condiciones que se cumplen.

## Resultado actual

```text
Banking.UnitTests
Passed: 33  Failed: 0  Skipped: 0  Total: 33

Banking.IntegrationTests
Passed: 8   Failed: 0  Skipped: 0  Total: 8

Total
Passed: 41  Failed: 0  Skipped: 0  Total: 41
```
