# Digital Banking Technical Assessment
## Backend Solution — LAFISE Nicaragua

Proyecto desarrollado como solución a una prueba técnica para Programador Backend. No representa un sistema oficial, arquitectura interna ni producto de producción de Banco LAFISE.

Este repositorio presenta la primera fase de una solución de banca digital contextualizada para Nicaragua. El alcance actual se limita al backend solicitado en la prueba técnica y prioriza integridad, consistencia, trazabilidad y separación de responsabilidades.

## Estructura

- `backend/`: implementación actual en .NET 10 con ASP.NET Core Web API, Entity Framework Core y SQLite.
- `web/`: fase futura prevista en React y TypeScript.
- `mobile/`: fase futura prevista en Flutter y Dart.
- `docs/`: arquitectura, ejemplos de consumo y trazabilidad de requisitos.

Las futuras aplicaciones Web y Mobile consumirán la misma API. Las reglas financieras permanecen centralizadas en el backend.

Consulta [backend/README.md](backend/README.md) para instalar, ejecutar y probar la solución.

Documentación complementaria:

- [Arquitectura](docs/ARCHITECTURE.md)
- [Ejemplos de API](docs/API_EXAMPLES.md)
- [Checklist de requisitos](docs/REQUIREMENTS_CHECKLIST.md)

