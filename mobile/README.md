# Digital Banking Mobile

Cliente móvil Flutter para la solución técnica de banca digital. Consume `Banking.Api` mediante HTTP/JSON y mantiene en el backend todas las reglas financieras.

> Proyecto desarrollado como extensión voluntaria de una prueba técnica para Programador Backend. No representa un producto oficial, arquitectura interna ni aplicación de producción de Banco LAFISE.

## Alcance

La aplicación permite:

- crear un cliente y copiar su identificador;
- abrir una cuenta para un cliente registrado;
- copiar y consultar el `AccountNumber` generado por el backend;
- ver el saldo actual;
- realizar depósitos y retiros;
- presentar errores de fondos insuficientes sin perder el contexto;
- consultar el historial cronológico;
- ver y copiar el identificador completo de cada transacción;
- consultar `BalanceAfterTransaction`.

No incluye autenticación, transferencias, tarjetas, préstamos, pagos, remesas, ACH, múltiples monedas, biometría ni notificaciones porque esos casos de uso no existen en la API.

## Stack

- Flutter 3.38.5 y Dart 3.10.4;
- Riverpod para dependencias y estado asíncrono de consultas;
- Dio como cliente HTTP único;
- GoRouter para navegación declarativa;
- `intl` y `timezone` para formato `es-NI` y `America/Managua`;
- `flutter_test` y Mocktail para pruebas.

Freezed y `json_serializable` no se incorporaron: los contratos son pequeños, estables y el mapeo manual mantiene la solución directa.

## Arquitectura

```text
Presentation / Riverpod
          ↓
Repository interfaces
          ↓
Dio repository implementations
          ↓
BankingApiClient
          ↓ HTTP/JSON
Banking.Api
```

```text
lib/
├── app/                 # App, router, shell y providers
├── core/
│   ├── api/             # Cliente Dio central
│   ├── config/          # Base URL
│   ├── errors/          # ProblemDetails y errores seguros
│   ├── theme/           # Tokens y ThemeData
│   ├── utils/           # Formatos y validadores
│   └── widgets/         # Componentes reutilizables
└── features/
    ├── customers/       # Data, domain y presentation
    ├── accounts/        # Data, domain y presentation
    └── transactions/    # Data, domain y presentation
```

Las validaciones locales mejoran la entrada del formulario. Banking.Api continúa decidiendo si existe el cliente, cuál es el saldo, si un retiro es válido y qué movimientos se persisten.

### Propiedad de datos y reglas

- Mobile **no genera** `AccountNumber`.
- Mobile **no calcula** el saldo resultante de depósitos o retiros.
- Mobile **no decide** si hay fondos suficientes.
- Mobile **no persiste** movimientos.
- Tras una operación exitosa, Riverpod invalida saldo e historial y vuelve a consultar la API.
- Los importes recibidos pueden representarse en Dart para presentación, pero la aritmética y las decisiones financieras autoritativas permanecen en el backend con `decimal`.
- La referencia visible de una transacción puede abreviarse; el `transactionId` completo permanece en `BankTransaction` y el portapapeles recibe el identificador completo.

## Configurar Banking.Api

La aplicación lee una única variable de compilación: `API_BASE_URL`.

Si no se especifica, usa `http://10.0.2.2:5097` en Android y `http://127.0.0.1:5097` en las demás plataformas.

### Android Emulator

```powershell
flutter run --dart-define=API_BASE_URL=http://10.0.2.2:5097
```

### iOS Simulator

```bash
flutter run --dart-define=API_BASE_URL=http://127.0.0.1:5097
```

### Dispositivo físico

El teléfono y la computadora deben estar en la misma red. Banking.Api debe escuchar en una interfaz accesible y se pasa la IP local del equipo:

```powershell
flutter run --dart-define=API_BASE_URL=http://192.168.1.50:5097
```

No se debe usar `localhost` desde un dispositivo físico: allí apunta al propio teléfono.

## Ejecutar

1. Iniciar Banking.Api desde `backend/`.
2. Desde `mobile/`:

```powershell
flutter pub get
flutter run --dart-define=API_BASE_URL=http://10.0.2.2:5097
```

## Desarrollo local HTTP

- Android permite cleartext únicamente en `android/app/src/debug/AndroidManifest.xml`. La configuración release no se abre globalmente.
- iOS declara `NSAllowsLocalNetworking`; no habilita HTTP arbitrario hacia Internet.
- CORS no aplica a clientes nativos. No fue necesario modificar Banking.Api para la aplicación móvil.

## Endpoints consumidos

| Acción | Método y ruta |
|---|---|
| Crear cliente | `POST /api/customers` |
| Crear cuenta | `POST /api/accounts` |
| Consultar saldo | `GET /api/accounts/{accountNumber}/balance` |
| Depositar | `POST /api/accounts/{accountNumber}/deposits` |
| Retirar | `POST /api/accounts/{accountNumber}/withdrawals` |
| Historial | `GET /api/accounts/{accountNumber}/transactions` |

## Manejo de errores

`ApiErrorParser` normaliza `ProblemDetails` y `ValidationProblemDetails` como `ApiException` o `ValidationException`. La UI muestra título, detalle y validaciones útiles. No expone JSON crudo, SQL, stack traces ni nombres internos de excepciones.

Tras un depósito o retiro exitoso, Riverpod invalida las consultas de saldo e historial. La siguiente lectura vuelve a Banking.Api; la app no calcula el resultado localmente.

## Sistema visual

El sistema visual es una adaptación original inspirada en experiencias digitales públicas de LAFISE y en el sistema existente de la Web. No es un manual oficial.

- Plus Jakarta Sans incluida localmente bajo SIL Open Font License;
- verde vivo, cyan, aqua y superficies blancas;
- saldo como elemento principal;
- navegación inferior de baja densidad;
- depósito y retiro en bottom sheets;
- historial como lista financiera accesible;
- targets táctiles amplios, labels persistentes y estados disabled/loading.

La moneda se presenta visualmente como NIO / C$. El backend no persiste una propiedad `Currency`.

## Tests y calidad

```powershell
flutter analyze
flutter test
flutter build apk --debug
```

Cobertura de comportamiento (**19 tests**):

- 3 tests del parser de errores;
- 4 tests de formatos;
- 5 tests de validadores;
- 3 tests de repositorios/contratos;
- 4 widget/crash tests;


Se cubren `ProblemDetails`/`ValidationProblemDetails`, mensajes seguros de red, `es-NI`/`America/Managua`, validación de formularios, contratos de repositorio y widgets clave de búsqueda/detalle/shell.

Última validación, 18 de septiembre de 2026:

```text
flutter analyze: no issues found
flutter test: 19 passed
Android debug APK: build/app/outputs/flutter-apk/app-debug.apk
```

## iOS

El proyecto iOS está generado y configurado para desarrollo local. La compilación y firma requieren macOS con Xcode; no se intentó publicar ni configurar certificados desde el entorno Windows usado para esta implementación.
