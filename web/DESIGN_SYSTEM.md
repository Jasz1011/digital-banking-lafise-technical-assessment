# Visual System Inspired by Publicly Available LAFISE Digital Experiences

Sistema visual original para la web de la prueba técnica. Fue elaborado mediante observación de experiencias públicas de LAFISE; no es un manual oficial y no supone acceso a recursos internos.

## Referencias revisadas

Revisión realizada el 18 de septiembre de 2026:

- [Grupo LAFISE](https://www.lafise.com/)
- [Banco LAFISE Nicaragua](https://www.lafise.com/blb/)
- [LAFISE Digital](https://digital.lafise.com/)
- [LAFISE Digital en App Store](https://apps.apple.com/ni/app/lafise-digital/id6575295212)
- [LAFISE Digital en Google Play](https://play.google.com/store/apps/details?id=com.lafise.lafiseone)

El proyecto abstrae patrones públicos de fondos aqua, superficies blancas, verde vivo, cyan, saldo protagonista, acciones rápidas y movimientos de baja densidad mediante componentes propios.

## Dirección visual

1. **Producto financiero:** saldo, cuenta y acciones principales dominan la jerarquía.
2. **Ligereza:** blanco y fondos aqua sustituyen superficies oscuras o administrativas.
3. **Cercanía:** copy breve, radios amplios y acciones fáciles de reconocer.
4. **Baja densidad:** listas limpias, espacio generoso y pocos bordes visibles.
5. **Mobile first:** navegación inferior, sheets y targets táctiles amplios.

## Color tokens

Los colores fueron seleccionados para alinearse visualmente con experiencias digitales públicas de LAFISE. No se presentan como colores oficiales.

| Token | Valor | Uso |
|---|---:|---|
| `--brand-primary` | `#009D4E` | CTA, indicadores y acciones principales |
| `--brand-primary-dark` | `#007A3D` | Texto de marca, hover y profundidad |
| `--brand-primary-deep` | `#005B35` | Contraste verde fuerte |
| `--brand-secondary` | `#00A8A8` | Turquesa de apoyo |
| `--brand-cyan` | `#31C4DF` | Superficies financieras y acentos |
| `--brand-blue` | `#1478C8` | Retiros y detalles informativos |
| `--brand-mint` | `#E8F8EF` | Fondos verdes suaves |
| `--cyan-soft` | `#E6F8FC` | Fondos cyan suaves |
| `--blue-soft` | `#EAF3FC` | Fondos azules suaves |
| `--surface` | `#FFFFFF` | Formularios, cards y movimientos |
| `--surface-soft` | `#F5FAF8` | Fondo general |
| `--border` | `#D9E8E1` | Controles y separadores |
| `--text-primary` | `#17342C` | Texto principal |
| `--text-secondary` | `#587068` | Texto de apoyo |
| `--success` | `#008B50` | Depósitos y confirmaciones |
| `--danger` | `#C53946` | Errores y confirmación de retiro |

## Tipografía

Se usa **Plus Jakarta Sans Variable**, instalada localmente con `@fontsource`.

- cuerpo y ayudas: 400–500;
- botones y labels: 500–600;
- títulos y saldos: 600–700;
- cantidades: cifras tabulares mediante `.financial-number`.

No se presenta como tipografía oficial.

## Navegación

En escritorio se usa un header superior blanco con wordmark textual, navegación central y acceso a consulta.

En móvil se conserva un header compacto y navegación inferior con icono y texto. El significado nunca depende únicamente del icono.

## Financial cards

`.financial-card` combina verde, turquesa y geometría curva de baja opacidad. Se usa para el saldo del detalle de cuenta y el resultado de apertura.

La jerarquía es: contexto, saldo, número de cuenta y acción.

## Transaction rows

Cada movimiento incluye:

- icono circular;
- tipo;
- fecha/hora;
- referencia de transacción truncada;
- acción de copiar el identificador completo;
- signo y monto;
- saldo posterior.

Depósito usa signo positivo y verde. Retiro usa signo negativo y azul. El color es un apoyo adicional, no la única señal.

## Forms

- labels persistentes;
- altura mínima de 52 px;
- radio amplio;
- foco cyan visible;
- hint o error asociado;
- validación inmediata mediante Zod;
- botones principales verdes y redondeados.

La creación de cliente y cuenta usa composiciones centrales con estados de éxito integrados.

## Modal y bottom sheet

Depósito y retiro comparten un componente Radix Dialog:

- en móvil aparece como bottom sheet;
- desde 640 px aparece centrado;
- muestra cuenta y saldo actual;
- usa un campo monetario destacado;
- presenta errores del servidor dentro del flujo.

El saldo mostrado no decide si un retiro es válido. Esa decisión continúa en el servidor.

## Estados

- **Loading:** skeletons suaves.
- **Empty:** mensaje breve.
- **Error:** título y detalle normalizados.
- **Success:** resultado contextual y toast corto.
- **Submitting:** progreso y botón deshabilitado.
- **Disabled:** menor contraste y sin interacción.

## Responsive

- **320–639 px:** cards apiladas, navegación inferior y bottom sheet.
- **640–1023 px:** más espacio, botones en fila y modal centrado.
- **1024 px o más:** hero en dos columnas, navegación superior y formularios con panel contextual.

## Accesibilidad

- enlace para saltar al contenido;
- labels reales y mensajes asociados;
- foco visible;
- navegación por teclado;
- targets táctiles amplios;
- estados disabled;
- icono, texto y signo para movimientos;
- `prefers-reduced-motion` reduce animaciones.

## Moneda y fechas

`formatCurrency()` usa `Intl.NumberFormat` con `es-NI` y `NIO`, presentado como C$. Es una decisión visual contextual: el backend no contiene `Currency`.

Fechas y horas usan `America/Managua`. `getNicaraguaToday()` construye la fecha local mediante `Intl.DateTimeFormat.formatToParts`.
