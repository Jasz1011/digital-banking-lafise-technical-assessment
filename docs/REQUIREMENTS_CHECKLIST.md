# Requirements Checklist

Verificación realizada contra las tres páginas del PDF **Prueba Técnica: Programador Backend** y contra el estado actual de la entrega.

| Requirement | Status | Implementation | Files | Validation |
|---|---|---|---|---|
| Proyecto desde cero en .NET 10 | ✅ Verificado | Todos los proyectos usan `net10.0`; `global.json` fija el SDK compatible | `global.json`, `backend/**/*.csproj` | Build y tests ejecutados con .NET 10 |
| ASP.NET Core Web API | ✅ Verificado | API con controllers y rutas REST | `Banking.Api/Program.cs`, `Controllers/` | Build y smoke test HTTP |
| Clean Architecture / N-Tier | ✅ Verificado | Cuatro capas con referencias dirigidas | `Banking.sln`, proyectos `Banking.*` | Build completo sin ciclos |
| Repositorio Git y README de ejecución | ✅ Verificado | Repositorio publicado con Quick Start y documentación por componente | `README.md`, `backend/README.md`, `web/README.md`, `mobile/README.md` | Flujo de instalación y ejecución documentado |
| Perfil con nombre completo | ✅ Verificado | `Customer.FullName` y DTO de creación | `Customer.cs`, `CreateCustomerRequest.cs` | Unit e integration tests de vacío, espacios, Unicode y longitud |
| Perfil con fecha de nacimiento | ✅ Verificado | `DateOnly BirthDate` | `Customer.cs` | Tests de fecha faltante y futura |
| Perfil con sexo/género | ✅ Verificado | `Customer.Gender` obligatorio y longitud máxima 50 | `Customer.cs`, DTOs | Unit e integration tests |
| Perfil con ingresos mensuales | ✅ Verificado | `decimal MonthlyIncome`, no negativo | `Customer.cs` | Tests de negativo y cero |
| Cuenta pertenece a cliente registrado | ✅ Verificado | Validación mediante `ICustomerRepository` y FK | `BankAccountService.cs`, `BankAccountConfiguration.cs` | Tests de cliente existente/desconocido |
| Cuenta con saldo inicial | ✅ Verificado | `decimal InitialBalance`, no negativo | `BankAccount.cs`, `CreateBankAccountRequest.cs` | Tests de saldo válido, cero y negativo |
| Número de cuenta autogenerado y único | ✅ Verificado | Generador inyectable, control de colisiones e índice único | `AccountNumberGenerator.cs`, `BankAccountService.cs`, configuración EF | Unit tests + UNIQUE real en SQLite |
| Formato `ACC-YYYYMMDD-XXXX` | ✅ Verificado | Prefijo, fecha local y cuatro dígitos exactos | `AccountNumberGenerator.cs` | Seis tests específicos del generador |
| Consultar saldo por número único | ✅ Verificado | `GET /api/accounts/{accountNumber}/balance` | `AccountsController.cs`, `BankAccountService.cs` | Smoke test y consumo Web |
| Depósitos incrementan saldo | ✅ Verificado | Operación de dominio y servicio transaccional | `BankAccount.Deposit`, `TransactionService.cs` | Unit tests y flujo Web |
| Retiros disminuyen saldo | ✅ Verificado | Operación de dominio y servicio transaccional | `BankAccount.Withdraw`, `TransactionService.cs` | Unit tests y flujo Web |
| Fondos suficientes obligatorios | ✅ Verificado | `InsufficientFundsException` antes de modificar estado | `BankAccount.cs` | Unit + integration test HTTP 400 |
| Retiro insuficiente rechazado limpiamente | ✅ Verificado | ProblemDetails y estado intacto | `BankAccount.cs`, `GlobalExceptionHandler.cs` | Test confirma saldo, historial y saves intactos; Web presenta error amigable |
| Historial cronológico | ✅ Verificado | Query por `Timestamp` e `Id` | `TransactionRepository.cs` | Unit test y listado Web |
| Identificador único de transacción | ✅ Verificado | `Guid Transaction.Id` | `Transaction.cs` | API lo retorna y la Web lo muestra como referencia truncada con copia del valor completo |
| Tipo depósito/retiro | ✅ Verificado | Enum `TransactionType` serializado como texto | `TransactionType.cs`, `Program.cs` | Tests y UI |
| Monto y timestamp por movimiento | ✅ Verificado | `decimal Amount`, `DateTime Timestamp` UTC | `Transaction.cs` | Tests, API y UI |
| Saldo histórico posterior | ✅ Verificado | `BalanceAfterTransaction` persistido | `Transaction.cs`, configuración EF | Tests y UI |
| Controllers sin DbContext | ✅ Verificado | Solo inyectan servicios de aplicación | `Controllers/` | Revisión estática |
| Controllers reciben HTTP, invocan servicios y retornan DTOs | ✅ Verificado | Controllers delgados | `CustomersController.cs`, `AccountsController.cs` | Revisión y Swagger |
| Prueba específica del generador | ✅ Verificado | Seis pruebas de prefijo, fecha, longitud, dígitos, formato y unicidad | `AccountNumberGeneratorTests.cs` | 6/6 pasan |
| Manejo global sin try/catch repetitivo | ✅ Verificado | `IExceptionHandler` central | `GlobalExceptionHandler.cs`, `Program.cs` | Integration tests |
| Excepciones de negocio personalizadas | ✅ Verificado | Excepciones de dominio y aplicación | `Domain/Exceptions/`, `Application/Exceptions/` | Tests |
| JSON de error limpio y seguro | ✅ Verificado | ProblemDetails / ValidationProblemDetails sin stack trace ni SQL | `GlobalExceptionHandler.cs`, `Program.cs` | Integration tests |
| SQLite mediante EF Core | ✅ Verificado | Provider SQLite y `BankingDbContext` | `Banking.Infrastructure.csproj`, `BankingDbContext.cs` | Migración real |
| Índice UNIQUE físico de AccountNumber | ✅ Verificado | `HasIndex(...).IsUnique()` y migración | `BankAccountConfiguration.cs`, `InitialCreate.cs` | Integration test con SQLite error 19 |
| Persistencia atómica de saldo y movimiento | ✅ Verificado | Transacción explícita y un `SaveChanges` | `IBankingUnitOfWork.cs`, `BankingUnitOfWork.cs` | Tests y logs EF |
| Concurrencia razonable | ✅ Verificado | Token `Version` y traducción de `DbUpdateConcurrencyException` | entidad, configuración y UoW | Revisión y build |
| Repositories sin lógica de negocio | ✅ Verificado | Interfaces específicas y persistencia | `Abstractions/Persistence/`, `Repositories/` | Revisión de dependencias |
| Servicios de aplicación | ✅ Verificado | Servicios para cliente, cuenta y transacciones | `Application/Services/` | Unit tests |
| DTOs; entidades no expuestas | ✅ Verificado | Requests y responses explícitos | `Application/Customers`, `Accounts`, `Transactions` | Swagger y respuestas HTTP |
| `decimal` para dinero | ✅ Verificado | Balance, ingresos y montos usan `decimal` | Entidades y DTOs | Revisión estática |
| Async/await y CancellationToken | ✅ Verificado | I/O EF y controllers asíncronos con cancelación | Servicios, repositorios y controllers | Build |
| Dependency Injection | ✅ Verificado | `AddApplication()` y `AddInfrastructure()` | `DependencyInjection.cs`, `Program.cs` | API inicia correctamente |
| Swagger / OpenAPI | ✅ Verificado | UI, XML docs y status codes | `Program.cs`, controllers | `/swagger` |
| Migraciones EF Core | ✅ Verificado | `InitialCreate` y manifiesto local `dotnet-ef` | `Persistence/Migrations/`, `.config/dotnet-tools.json` | `dotnet ef database update` |
| Pruebas unitarias centrales | ✅ Verificado | Generador, clientes, cuentas, depósitos, retiros e historial | `Banking.UnitTests/` | 33/33 correctas |
| Pruebas de integración HTTP y persistencia | ✅ Verificado | `WebApplicationFactory`, migraciones y SQLite temporal | `Banking.IntegrationTests/` | 8/8 correctas |
| Web como extensión voluntaria | ✅ Verificado | React consume exclusivamente el contrato público del backend | `web/src/`, `web/README.md` | Flujo manual completo, lint y build |
| Web no duplica reglas financieras | ✅ Verificado | No genera cuenta, no calcula saldo ni autoriza retiros | `web/src/api/`, hooks y features | Revisión de flujo |
| Web responsive | ✅ Verificado | Navegación y composiciones adaptativas, dialogs/sheets | `web/src/`, `web/src/styles/index.css` | Validación manual desktop/mobile |
| Sin funcionalidades bancarias ficticias operables | ✅ Verificado | No expone transferencias, tarjetas, préstamos, ACH ni remesas | Web y Mobile | Inventario de rutas y acciones |
| Mobile como extensión voluntaria | ✅ Verificado | Flutter consume exclusivamente los seis endpoints públicos | `mobile/lib/`, `mobile/README.md` | `flutter analyze`, 19 tests y APK debug |
| Mobile no duplica reglas financieras | ✅ Verificado | Banking.Api genera cuenta, determina saldo, valida fondos y persiste movimientos | repositorios y providers móviles | Revisión de flujo y tests de repositorios |
| Mobile responsive y accesible | ✅ Verificado | Layouts acotados, scroll, targets táctiles y Semantics | presentation y core widgets | Análisis estático y widget test |
| Restore | ✅ Verificado | Paquetes restaurados | NuGet y package manifests | `dotnet restore`, `npm install` |
| Build frontend | ✅ Verificado | TypeScript + Vite | `web/` | `npm run build` correcto el 18-09-2026 |
| Lint frontend | ✅ Verificado | ESLint sin warnings permitidos | `web/` | `npm run lint` correcto el 18-09-2026 |
| Análisis y tests Mobile | ✅ Verificado | Flutter analyzer y pruebas de parser, formatos, validación, repositorios y widget | `mobile/test/` | 16 correctas el 18-09-2026 |
| Build Android | ✅ Verificado | APK de depuración | `mobile/android/` | `flutter build apk --debug` correcto el 18-09-2026 |
| Tests backend | ✅ Verificado | Suite xUnit unit + integration | `Banking.UnitTests`, `Banking.IntegrationTests` | 41 correctas, 0 fallidas, 0 omitidas el 18-09-2026 |

## Estado de entrega

El repositorio contiene el backend solicitado y las extensiones Web y Mobile funcionales, con documentación de ejecución y evidencia de validación. Los clientes adicionales no alteran el cumplimiento ni las reglas de la prueba técnica backend.
