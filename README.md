# Digital Banking Technical Assessment
## Backend Solution — LAFISE Nicaragua

Proyecto desarrollado como solución a una prueba técnica para Programador Backend. No representa un sistema oficial, arquitectura interna ni producto de producción de Banco LAFISE.

Este repositorio presenta una solución de banca digital contextualizada para Nicaragua. El backend corresponde al alcance solicitado en la prueba técnica; la web es una extensión voluntaria que demuestra su consumo sin duplicar reglas financieras.

## Estructura

- `backend/`: API en .NET 10 con ASP.NET Core, Entity Framework Core y SQLite.
- `web/`: cliente responsive en React y TypeScript para operar el alcance público de la API.
- `mobile/`: fase futura prevista en Flutter y Dart.
- `docs/`: arquitectura, ejemplos de consumo y trazabilidad de requisitos.

La Web y la futura aplicación Mobile consumen la misma API. Las reglas financieras permanecen centralizadas en el backend.

Consulta [backend/README.md](backend/README.md) para instalar, ejecutar y probar la solución.

Consulta [web/README.md](web/README.md) para configurar y ejecutar el cliente web.

Documentación complementaria:

- [Arquitectura](docs/ARCHITECTURE.md)
- [Ejemplos de API](docs/API_EXAMPLES.md)
- [Checklist de requisitos](docs/REQUIREMENTS_CHECKLIST.md)
- [Estrategia de testing](docs/TESTING.md)
- [Sistema visual Web](web/DESIGN_SYSTEM.md)

