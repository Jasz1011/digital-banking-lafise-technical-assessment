# Requirements Checklist

Verificación realizada contra las tres páginas del PDF **Prueba Técnica: Programador Backend** y contra las precisiones de alcance de esta entrega.

| Requirement | Status | Implementation | Files | Validation |
|---|---|---|---|---|
| Proyecto desde cero en .NET 10 | ✅ Verificado | Todos los proyectos usan `net10.0`; `global.json` admite feature bands de .NET 10 | `global.json`, `backend/**/*.csproj` | SDK 10.0.401 / runtime 10.0.12 usados en build |
| ASP.NET Core Web API | ✅ Verificado | API con controllers y rutas REST | `Banking.Api/Program.cs`, `Controllers/` | Build y smoke test HTTP |
| Clean Architecture / N-Tier | ✅ Verificado | Cuatro capas con referencias dirigidas | `Banking.sln`, proyectos `Banking.*` | Build completo sin ciclos |
| Repositorio Git y README de ejecución | ✅ Verificado | Repositorio local inicializado y documentación ejecutable | `.git/`, `README.md`, `backend/README.md` | `git status`; comandos verificados localmente |
| Perfil con nombre completo | ✅ Verificado | `Customer.FullName` y DTO de creación | `Customer.cs`, `CreateCustomerRequest.cs` | Unit test de nombre vacío y smoke test |
| Perfil con fecha de nacimiento | ✅ Verificado | `DateOnly BirthDate` | `Customer.cs` | Tests de fecha faltante y futura |
| Perfil con sexo/género | ✅ Verificado | `Customer.Gender` obligatorio | `Customer.cs`, DTOs | Smoke test de creación |
| Perfil con ingresos mensuales | ✅ Verificado | `decimal MonthlyIncome`, no negativo | `Customer.cs` | Unit test de valor negativo |
| Cuenta pertenece a cliente registrado | ✅ Verificado | Validación mediante `ICustomerRepository` y FK | `BankAccountService.cs`, `BankAccountConfiguration.cs` | Tests de cliente existente/desconocido; FK inspeccionada |
| Cuenta con saldo inicial | ✅ Verificado | `decimal InitialBalance`, no negativo | `BankAccount.cs`, `CreateBankAccountRequest.cs` | Tests de persistencia y valor negativo |
| Número de cuenta autogenerado y único | ✅ Verificado | Generador inyectable, control de colisiones e índice único | `AccountNumberGenerator.cs`, `BankAccountService.cs`, configuración EF | Tests, PRAGMA SQLite y duplicado físico rechazado |
| Formato `ACC-YYYYMMDD-XXXX` | ✅ Verificado | Prefijo, fecha local y cuatro dígitos exactos | `AccountNumberGenerator.cs` | Seis tests del generador y smoke regex |
| Consultar saldo por número único | ✅ Verificado | `GET /api/accounts/{accountNumber}/balance` | `AccountsController.cs`, `BankAccountService.cs` | Smoke test antes y después de movimientos |
| Depósitos incrementan saldo | ✅ Verificado | Operación de dominio y servicio transaccional | `BankAccount.Deposit`, `TransactionService.cs` | Tests válido/cero/negativo y smoke test |
| Retiros disminuyen saldo | ✅ Verificado | Operación de dominio y servicio transaccional | `BankAccount.Withdraw`, `TransactionService.cs` | Tests válido, saldo exacto, cero y negativo |
| Fondos suficientes obligatorios | ✅ Verificado | `InsufficientFundsException` antes de modificar estado | `BankAccount.cs`, excepción de dominio | Unit test y respuesta HTTP 400 |
| Retiro insuficiente rechazado limpiamente | ✅ Verificado | Rollback y ProblemDetails | `BankingUnitOfWork.cs`, `GlobalExceptionHandler.cs` | Saldo quedó 11,650 e historial quedó en 2 movimientos |
| Historial cronológico | ✅ Verificado | Query ordenado por `Timestamp`, luego `Id` | `TransactionRepository.cs` | Unit test y smoke test cronológico |
| Identificador único de transacción | ✅ Verificado | `Guid Transaction.Id` | `Transaction.cs` | Historial HTTP devolvió dos IDs |
| Tipo depósito/retiro | ✅ Verificado | Enum `TransactionType` serializado como texto | `TransactionType.cs`, `Program.cs` | Tests y JSON `Deposit`, `Withdrawal` |
| Monto y timestamp por movimiento | ✅ Verificado | `decimal Amount`, `DateTime Timestamp` UTC | `Transaction.cs` | Tests y smoke test |
| Saldo histórico posterior | ✅ Verificado | `BalanceAfterTransaction` persistido al crear el movimiento | `Transaction.cs`, configuración EF | Tests y smoke: 12,500 / 11,650 |
| Controllers sin DbContext | ✅ Verificado | Solo inyectan servicios de aplicación | `Controllers/` | Búsqueda estática sin referencias EF/DbContext |
| Controllers reciben HTTP, invocan servicios y retornan DTOs | ✅ Verificado | Controllers delgados | `CustomersController.cs`, `AccountsController.cs` | Revisión de código y Swagger |
| Al menos una prueba específica del generador | ✅ Verificado | Seis pruebas de prefijo, fecha, longitud, dígitos, formato y unicidad | `AccountNumberGeneratorTests.cs` | xUnit |
| Manejo global sin try/catch repetitivo | ✅ Verificado | `IExceptionHandler` central | `GlobalExceptionHandler.cs`, `Program.cs` | 400/404 verificados por HTTP |
| Excepciones de negocio personalizadas | ✅ Verificado | Excepciones de dominio y aplicación | `Domain/Exceptions/`, `Application/Exceptions/` | Tests y smoke test |
| JSON de error limpio y seguro | ✅ Verificado | RFC ProblemDetails sin stack trace ni SQL | `GlobalExceptionHandler.cs` | Cuerpos 400 y 404 inspeccionados |
| SQLite mediante EF Core | ✅ Verificado | Provider SQLite y `BankingDbContext` | `Banking.Infrastructure.csproj`, `BankingDbContext.cs` | Migración aplicada a SQLite real |
| Índice UNIQUE físico de AccountNumber | ✅ Verificado | `HasIndex(...).IsUnique()` y migración | `BankAccountConfiguration.cs`, `InitialCreate.cs` | PRAGMA indicó unique=1; duplicado produjo constraint failure |
| Relaciones 1:N y claves foráneas | ✅ Verificado | Customer→Accounts y Account→Transactions | Configuraciones EF | PRAGMA confirmó ambas FKs |
| Persistencia atómica de saldo y movimiento | ✅ Verificado | Transacción explícita y un `SaveChanges` | `IBankingUnitOfWork.cs`, `BankingUnitOfWork.cs` | Smoke test y logs EF del flujo |
| Concurrencia razonable | ✅ Verificado | Token `Version` y traducción de `DbUpdateConcurrencyException` | `BankAccount.cs`, configuración y unidad de trabajo | Compilación y revisión de SQL con condición de versión |
| Repositories sin lógica de negocio | ✅ Verificado | Interfaces específicas y queries/persistencia | `Abstractions/Persistence/`, `Repositories/` | Revisión de dependencias |
| Servicios de aplicación | ✅ Verificado | Servicios para cliente, cuenta y transacciones | `Application/Services/` | 25 unit tests sobre comportamiento |
| DTOs; entidades no expuestas | ✅ Verificado | Requests y responses explícitos | `Application/Customers`, `Accounts`, `Transactions` | Swagger y respuestas HTTP |
| Semántica HTTP | ✅ Verificado | 201, 200, 400, 404 y 409 documentados | Controllers y exception handler | Smoke test 201/200/400/404 |
| `decimal` para dinero | ✅ Verificado | Balance, ingresos y montos usan `decimal` | Entidades y DTOs | Revisión estática |
| Async/await y CancellationToken | ✅ Verificado | I/O EF y controllers asíncronos con cancelación | Servicios, repositorios y controllers | Build y smoke test |
| Dependency Injection | ✅ Verificado | `AddApplication()` y `AddInfrastructure()` | `DependencyInjection.cs`, `Program.cs` | API inició correctamente |
| SOLID razonable | ✅ Verificado | SRP, inversión de dependencias e interfaces por consumidor | Proyectos Domain/Application/Infrastructure | Revisión arquitectónica |
| Swagger / OpenAPI | ✅ Verificado | UI, XML docs y status codes | `Program.cs`, controllers | `/swagger/v1/swagger.json` devolvió 200 |
| Migraciones EF Core | ✅ Verificado | `InitialCreate` y manifiesto local `dotnet-ef` | `Persistence/Migrations/`, `.config/dotnet-tools.json` | `dotnet ef database update` exitoso |
| Pruebas unitarias centrales | ✅ Verificado | Generador, validaciones, cuentas, depósitos, retiros e historial | `Banking.UnitTests/` | 25/25 correctas |
| README y documentación profesional | ✅ Verificado | Contexto, ejecución, arquitectura, ejemplos y checklist | `README.md`, `backend/README.md`, `docs/` | Revisión de enlaces y comandos |
| Disclaimer de prueba técnica | ✅ Verificado | Aclara que no es producto ni arquitectura oficial | README raíz y backend | Revisión documental |
| Web y Mobile sin implementación | ✅ Verificado | Solo README de fase futura y consumo de Banking.Api | `web/README.md`, `mobile/README.md` | Estructura revisada |
| Sin funcionalidades fuera de fase | ✅ Verificado | No hay frontend, autenticación, transferencias ni infraestructura adicional | Repositorio completo | Inventario de archivos |
| Restore | ✅ Verificado | Paquetes restaurados desde NuGet | `NuGet.Config`, archivos de proyecto | `dotnet restore` exitoso |
| Build | ✅ Verificado | Compilación Release con warnings como errores | Toda la solución | 0 advertencias, 0 errores |
| Tests | ✅ Verificado | Suite xUnit determinista | `Banking.UnitTests` | 25 correctas, 0 fallidas |
| Migration test | ✅ Verificado | Esquema creado desde migración | `InitialCreate` | Tablas, FKs, UNIQUE e historial inspeccionados |
| Smoke test | ✅ Verificado | Flujo completo HTTP | API completa | Todos los pasos requeridos exitosos |

## Entrega en GitHub

El repositorio local queda preparado y con historial de commits. La publicación en una cuenta u organización de GitHub requiere el remote y las credenciales del propietario de la entrega.
