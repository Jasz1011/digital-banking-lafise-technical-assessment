# Digital Banking Web

Experiencia web de la segunda fase de **Digital Banking Technical Assessment — LAFISE Nicaragua**. Presenta el alcance real de `Banking.Api` mediante una interfaz bancaria responsive: crear clientes y cuentas, consultar saldo, depositar, retirar y revisar movimientos.

> Proyecto desarrollado como extensión voluntaria de una prueba técnica. No representa un sistema oficial, arquitectura interna, producto de producción ni manual de marca de Banco LAFISE.

## Alcance

La web permite:

- crear un cliente;
- abrir una cuenta para un cliente existente;
- consultar una cuenta por `AccountNumber`;
- ver el saldo entregado por el servidor;
- depositar y retirar;
- presentar fondos insuficientes y otros errores de forma amigable;
- consultar movimientos con su `BalanceAfterTransaction` histórico.

No implementa autenticación, transferencias, tarjetas, préstamos, remesas, ACH, múltiples monedas ni información que la API actual no expone.

## Stack

- React 19 y TypeScript
- Vite
- React Router
- TanStack Query
- React Hook Form y Zod
- Axios
- Tailwind CSS
- Radix Dialog
- Lucide Icons
- Sonner

## Arquitectura

```text
src/
├── api/             cliente HTTP, endpoints y normalización de errores
├── app/             providers y rutas
├── components/      componentes reutilizables y composición de producto
├── features/        clientes, cuentas y transacciones
├── layouts/         navegación y estructura responsive
├── lib/             formatters, fechas, query keys y utilidades
├── pages/           pantallas asociadas a rutas
├── styles/          design tokens y estilos globales
└── types/           contratos TypeScript
```

```text
Page / Feature
      ↓
TanStack Query hook
      ↓
Typed API client
      ↓
Banking.Api
```

Las llamadas HTTP permanecen en `src/api/banking-api.ts`. Tras un depósito o retiro se invalidan las queries de saldo e historial, y ambos datos se solicitan nuevamente. El cliente no genera números de cuenta, no calcula saldos y no decide si existen fondos suficientes.

## Rutas

| Ruta | Propósito |
|---|---|
| `/` | Hero de producto y accesos rápidos |
| `/clientes/nuevo` | Crear cliente y continuar a apertura de cuenta |
| `/cuentas/nueva` | Crear cuenta y presentar su tarjeta financiera |
| `/cuentas/buscar` | Consultar por número de cuenta |
| `/cuentas/:accountNumber` | Ver saldo, operar e inspeccionar movimientos |

## Configuración

Requisitos:

- Node.js 24 o una versión compatible con Vite 8;
- npm;
- backend ejecutándose con .NET 10.

Desde `web/`:

```powershell
npm install
Copy-Item .env.example .env.local
```

Variable de entorno:

```dotenv
VITE_API_BASE_URL=http://localhost:5097
```

Si la variable no está definida, el cliente usa `http://localhost:5097` como valor local predeterminado. Los archivos `.env` reales están excluidos de Git.

## Ejecutar

Inicia la API desde `backend/`:

```powershell
dotnet run --project src/Banking.Api/Banking.Api.csproj
```

Luego inicia la web:

```powershell
cd web
npm run dev
```

Vite sirve la aplicación en `http://localhost:5173`.

## Calidad

```powershell
npm run lint
npm run build
```

El build valida TypeScript antes de generar `dist/`. Las páginas se cargan bajo demanda para dividir el JavaScript inicial.

## Manejo de datos y errores

`src/api/errors.ts` normaliza `ProblemDetails` y `ValidationProblemDetails`. Los formularios muestran título, detalle y errores útiles sin exponer JSON ni información interna.

Zod entrega respuesta inmediata en campos y formatos. El servidor conserva la validación definitiva de recursos, montos, fondos, concurrencia e integridad.

El formato monetario está centralizado en `formatCurrency()` con `es-NI` y `NIO`. Mostrar `C$` es una decisión contextual de presentación; no agrega una propiedad `Currency` al modelo.

Las fechas se presentan con `America/Managua`. El límite de fecha de nacimiento se obtiene con `getNicaraguaToday()`, evitando depender de `toISOString()` y su conversión a UTC.

## CORS local

En `Development`, `Banking.Api` aplica la política `DevelopmentFrontend` solo a:

- `http://localhost:5173`
- `http://127.0.0.1:5173`

No se usa `AllowAnyOrigin` y no se habilita una política abierta en producción.

## Dirección visual

La interfaz usa un **visual system inspired by publicly available LAFISE digital experiences**. Se estudiaron las páginas públicas de LAFISE y los assets públicos enlazados por ellas para abstraer su uso de fondos aqua, verde vivo, cyan, cards blancas, saldo protagonista, acciones rápidas y movimientos de baja densidad.

El home usa una composición propia construida con HTML y CSS. No incorpora capturas, fotografías ni código de los sitios de referencia. El header emplea un wordmark textual sencillo porque el repositorio no contiene un logo oficial autorizado.

Consulta [DESIGN_SYSTEM.md](DESIGN_SYSTEM.md) para ver tokens, componentes, responsive y accesibilidad.

## Referencias públicas

- [Grupo LAFISE](https://www.lafise.com/)
- [Banco LAFISE Nicaragua](https://www.lafise.com/blb/)
- [LAFISE Digital](https://digital.lafise.com/)
- [LAFISE Digital en App Store](https://apps.apple.com/ni/app/lafise-digital/id6575295212)
- [LAFISE Digital en Google Play](https://play.google.com/store/apps/details?id=com.lafise.lafiseone)

Los colores, componentes y composiciones de este proyecto son una adaptación original. No se describen como recursos oficiales ni se asume acceso a un sistema de diseño interno.
