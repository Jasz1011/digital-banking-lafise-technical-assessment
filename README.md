# Digital Banking Technical Assessment
## Backend Solution — LAFISE Nicaragua

Proyecto desarrollado como solución a una prueba técnica para Programador Backend. No representa un sistema oficial, arquitectura interna ni producto de producción de Banco LAFISE.

El backend corresponde al alcance solicitado en la prueba técnica. La web es una extensión voluntaria que demuestra el consumo real de la API sin duplicar reglas financieras.

## Estructura

- `backend/`: API en .NET 10 con ASP.NET Core, Entity Framework Core y SQLite.
- `web/`: cliente responsive en React y TypeScript para operar el alcance de la API.
- `mobile/`: fase futura prevista en Flutter y Dart.
- `docs/`: arquitectura, ejemplos de consumo, testing y trazabilidad de requisitos.

```text
Web
 ↓ HTTP/JSON
Banking.Api
 ↓
Banking.Application
 ↓
Banking.Domain
 ↑
Banking.Infrastructure
 ↓
SQLite
```

La web no genera números de cuenta, no calcula saldos y no decide si existen fondos suficientes. Esas reglas permanecen centralizadas en el backend.

## Quick start

### Requisitos

- .NET SDK 10
- Node.js 24 o una versión compatible con Vite 8
- npm
- Git

### 1. Clonar

```powershell
git clone https://github.com/Jasz1011/digital-banking-lafise-technical-assessment.git
cd digital-banking-lafise-technical-assessment
```

### 2. Backend

En una terminal:

```powershell
cd backend
dotnet tool restore
dotnet restore Banking.sln
dotnet ef database update --project src/Banking.Infrastructure/Banking.Infrastructure.csproj --startup-project src/Banking.Api/Banking.Api.csproj --context BankingDbContext
dotnet run --project src/Banking.Api/Banking.Api.csproj
```

API:

```text
http://localhost:5097
```

Swagger:

```text
http://localhost:5097/swagger
```

### 3. Web

En otra terminal, desde la raíz del repositorio:

```powershell
cd web
npm install
Copy-Item .env.example .env.local
npm run dev
```

Variable local:

```dotenv
VITE_API_BASE_URL=http://localhost:5097
```

Web:

```text
http://127.0.0.1:5173
```

También está permitido `http://localhost:5173` por la política CORS de desarrollo.

## Flujo funcional disponible

La interfaz permite recorrer el alcance del backend:

1. crear un cliente;
2. abrir una cuenta con saldo inicial;
3. consultar una cuenta por `AccountNumber`;
4. visualizar saldo;
5. registrar depósitos;
6. registrar retiros;
7. recibir un rechazo limpio por fondos insuficientes;
8. consultar el historial cronológico.

Cada movimiento muestra tipo, monto, fecha/hora, referencia de transacción y `BalanceAfterTransaction`.

No se implementan autenticación, transferencias, tarjetas, préstamos, remesas, ACH ni múltiples monedas porque no forman parte del backend de esta prueba.

## Validación

Frontend:

```powershell
cd web
npm run lint
npm run build
```

Backend:

```powershell
cd backend
dotnet test Banking.sln
```

Último resultado verificado el **18 de septiembre de 2026**:

```text
Total: 41
Passed: 41
Failed: 0
Skipped: 0
```

La suite contiene 33 unit tests y 8 integration tests.

## Documentación

- [Backend](backend/README.md)
- [Web](web/README.md)
- [Arquitectura](docs/ARCHITECTURE.md)
- [Ejemplos de API](docs/API_EXAMPLES.md)
- [Checklist de requisitos](docs/REQUIREMENTS_CHECKLIST.md)
- [Estrategia de testing](docs/TESTING.md)
- [Sistema visual Web](web/DESIGN_SYSTEM.md)
