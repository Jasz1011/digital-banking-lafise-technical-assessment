# Digital Banking Backend

## Contexto

Solución de la prueba técnica para Programador Backend, contextualizada para una experiencia de banca digital en Nicaragua. Implementa el núcleo solicitado para clientes, cuentas y movimientos financieros con énfasis en integridad, trazabilidad y claridad de consumo.

Proyecto desarrollado como solución a una prueba técnica para Programador Backend. No representa un sistema oficial, arquitectura interna ni producto de producción de Banco LAFISE.

## Tecnologías

- .NET 10 y ASP.NET Core Web API
- Entity Framework Core 10
- SQLite
- xUnit
- Swagger / OpenAPI

## Arquitectura

La solución aplica Clean Architecture / N-Tier de forma pragmática:

- `Banking.Api`: controllers, HTTP, Swagger y manejo global de excepciones.
- `Banking.Application`: DTOs, servicios de aplicación, interfaces y coordinación de casos de uso.
- `Banking.Domain`: entidades, enum y reglas financieras sin dependencias de ASP.NET Core ni EF Core.
- `Banking.Infrastructure`: `DbContext`, configuraciones, repositorios, unidad de trabajo y migraciones.

```text
HTTP
  ↓
Controller
  ↓
Application Service
  ↓
Repository Interface
  ↓
EF Core Repository / Unit of Work
  ↓
SQLite
```

Los controllers no conocen `BankingDbContext` ni realizan cálculos de saldo.

## Funcionalidades

- Crear perfiles de clientes.
- Crear cuentas para clientes existentes.
- Consultar saldo por número de cuenta.
- Registrar depósitos.
- Registrar retiros con validación de fondos.
- Consultar el historial cronológico con saldo histórico por movimiento.

## Reglas de negocio

- El nombre completo y la fecha de nacimiento son obligatorios.
- La fecha de nacimiento no puede ser futura.
- Los ingresos mensuales y el saldo inicial no pueden ser negativos.
- Cada cuenta pertenece a un cliente existente.
- Depósitos y retiros requieren un monto mayor que cero.
- Un retiro requiere saldo suficiente.
- Un retiro rechazado no cambia el saldo ni crea una transacción.
- `BalanceAfterTransaction` se guarda al registrar cada movimiento y no se recalcula.

## Número de cuenta

El formato exacto es:

```text
ACC-YYYYMMDD-XXXX
```

`XXXX` contiene exactamente cuatro dígitos. El generador mantiene unicidad dentro del proceso para la fecha activa, el servicio consulta colisiones antes de guardar y SQLite aplica un índice `UNIQUE` como garantía final.

## Requisitos

- .NET SDK 10.0.100 o una versión posterior de .NET 10.
- Git.

Comprueba el SDK con:

```bash
dotnet --version
```

## Instalación

```bash
git clone <URL-del-repositorio>
cd digital-banking-lafise-technical-assessment/backend
dotnet tool restore
dotnet restore Banking.sln
```

## Base de datos

La herramienta `dotnet-ef` está declarada en el manifiesto local. Aplica las migraciones desde `backend/`:

```bash
dotnet ef database update \
  --project src/Banking.Infrastructure/Banking.Infrastructure.csproj \
  --startup-project src/Banking.Api/Banking.Api.csproj \
  --context BankingDbContext
```

La base local se crea en `backend/src/Banking.Api/banking.db` y está excluida de Git.

## Ejecutar

Desde `backend/`:

```bash
dotnet run --project src/Banking.Api/Banking.Api.csproj
```

## Swagger

Con el perfil HTTP predeterminado:

```text
http://localhost:5097/swagger
```

Swagger documenta requests, responses, estados HTTP y los errores relevantes de cada operación.

## Tests

```bash
dotnet test Banking.sln
```

La suite cubre el formato y unicidad básica del generador, validaciones de clientes y cuentas, creación de cuentas, colisiones, depósitos, retiros, fondos insuficientes e historial cronológico.

## Endpoints

| Método | Ruta | Resultado exitoso |
|---|---|---|
| `POST` | `/api/customers` | `201 Created` con el cliente |
| `POST` | `/api/accounts` | `201 Created` con la cuenta |
| `GET` | `/api/accounts/{accountNumber}/balance` | `200 OK` con el saldo |
| `POST` | `/api/accounts/{accountNumber}/deposits` | `200 OK` con el nuevo saldo |
| `POST` | `/api/accounts/{accountNumber}/withdrawals` | `200 OK` con el nuevo saldo |
| `GET` | `/api/accounts/{accountNumber}/transactions` | `200 OK` con el historial |

## Manejo de errores

`GlobalExceptionHandler` implementa `IExceptionHandler` y traduce excepciones a `ProblemDetails`:

- Datos o montos inválidos y fondos insuficientes: `400 Bad Request`.
- Cliente o cuenta inexistente: `404 Not Found`.
- número de cuenta duplicado o conflicto de concurrencia: `409 Conflict`.
- Error inesperado: `500 Internal Server Error` con detalle seguro.

Las respuestas no exponen stack traces, SQL ni detalles internos.

## Decisiones técnicas

- `decimal` representa todos los valores monetarios.
- Los DTOs evitan exponer entidades de persistencia.
- Repositorios específicos mantienen el acceso a datos fuera de controllers y servicios de dominio.
- Cada depósito o retiro ejecuta el cambio de saldo y la inserción de `Transaction` en una transacción de base de datos.
- `Version` es un token de concurrencia: EF Core detecta actualizaciones simultáneas y devuelve `409 Conflict`.
- El índice único de `AccountNumber` protege la integridad ante carreras o reinicios del proceso.
- Los identificadores son `Guid`; las marcas de tiempo se guardan en UTC y el componente de fecha del número de cuenta usa la fecha local del servidor.
- El saldo inicial crea el estado inicial de la cuenta; el historial contiene únicamente depósitos y retiros solicitados.

Para ejemplos de requests y responses, consulta [API_EXAMPLES.md](../docs/API_EXAMPLES.md).

