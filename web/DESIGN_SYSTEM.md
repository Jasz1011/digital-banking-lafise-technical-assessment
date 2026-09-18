# Visual System Inspired by Publicly Available LAFISE Digital Experiences

Sistema visual original para la web de la prueba técnica. Fue elaborado mediante observación de experiencias públicas de LAFISE; no es un manual oficial y no supone acceso a recursos internos.

## Referencias revisadas

Revisión realizada el 18 de septiembre de 2026:

- [Grupo LAFISE](https://www.lafise.com/)
- [Banco LAFISE Nicaragua](https://www.lafise.com/blb/)
- [LAFISE Digital](https://digital.lafise.com/)
- [LAFISE Digital en App Store](https://apps.apple.com/ni/app/lafise-digital/id6575295212)
- [LAFISE Digital en Google Play](https://play.google.com/store/apps/details?id=com.lafise.lafiseone)

Los assets públicos enlazados por esos sitios muestran una experiencia luminosa con fondos aqua, superficies blancas, verde vivo, cyan y azul; la app prioriza saldo, acciones circulares y movimientos recientes. Este proyecto abstrae esos patrones mediante componentes propios y no distribuye los assets utilizados durante la investigación.

## Dirección visual

1. **Producto financiero:** el saldo, la cuenta y las acciones principales dominan la jerarquía.
2. **Ligereza:** blanco y fondos aqua sustituyen superficies oscuras o administrativas.
3. **Cercanía:** copy breve, radios amplios y acciones fáciles de reconocer.
4. **Baja densidad:** listas limpias, espacio generoso y pocos bordes visibles.
5. **Mobile first:** navegación inferior, sheets y targets táctiles amplios.

## Color tokens

These are **colors selected to visually align with publicly available LAFISE digital interfaces**. No se presentan como colores oficiales.

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
| `--border` | `#D9E8E1` | Controles y separadores necesarios |
| `--text-primary` | `#17342C` | Texto principal |
| `--text-secondary` | `#587068` | Texto de apoyo |
| `--success` | `#008B50` | Depósitos y confirmaciones |
| `--danger` | `#C53946` | Errores y confirmación de retiro |
| `--warning` | `#A56C12` | Advertencias |

Los gradientes se reservan para el hero, la tarjeta financiera y la composición de producto.

## Tipografía

Se conserva **Plus Jakarta Sans Variable**, instalada localmente con `@fontsource`.

- cuerpo y ayudas: 400–500;
- botones y labels: 500–600;
- títulos y saldos: 600–700;
- cantidades: cifras tabulares mediante `.financial-number`.

No se presenta como tipografía oficial. Se seleccionó por legibilidad y claridad en cifras financieras.

## Spacing

La escala usa una base de 4 px:

| Token | Valor |
|---|---:|
| `--space-1` | `4px` |
| `--space-2` | `8px` |
| `--space-3` | `12px` |
| `--space-4` | `16px` |
| `--space-5` | `20px` |
| `--space-6` | `24px` |
| `--space-8` | `32px` |
| `--space-10` | `40px` |
| `--space-12` | `48px` |

El espacio entre secciones supera al espacio interno de cada grupo para comunicar jerarquía sin depender de cajas.

## Navegación

En escritorio se usa un header superior blanco con wordmark textual, navegación central y acceso a consulta. La selección se indica mediante texto verde y una línea inferior discreta.

En móvil se conserva un header compacto y se usa navegación inferior con icono y texto. El significado nunca depende únicamente del icono.

## Cards

Las cards de acción usan fondo blanco, un único borde tenue y sombra casi imperceptible. El hover eleva cuatro píxeles y refuerza suavemente la sombra.

Se evita envolver cada dato en una card. Formularios y resultados se agrupan solo cuando existe una relación clara entre ellos.

## Financial cards

`.financial-card` combina verde, turquesa y geometría curva de baja opacidad. Se usa para:

- el saldo del detalle de cuenta;
- el resultado de apertura de cuenta.

La jerarquía es: contexto, saldo, número de cuenta y acción. Los números financieros usan cifras tabulares y el saldo puede ocultarse visualmente sin alterar datos.

## Transaction rows

Los movimientos forman una lista con separadores suaves:

- icono circular;
- tipo y fecha;
- signo y monto;
- saldo posterior.

Depósito usa flecha descendente, signo positivo, texto y verde. Retiro usa flecha ascendente, signo negativo, texto y azul. El color es un apoyo adicional.

## Forms

- labels persistentes;
- altura mínima de 52 px;
- radio de 16 px;
- foco cyan visible;
- hint o error asociado con `aria-describedby`;
- validación inmediata mediante Zod;
- botones principales verdes y redondeados.

La creación de cliente y cuenta usa composiciones centrales, superficies blancas y estados de éxito integrados. El identificador del cliente se presenta con lenguaje comprensible y acción para copiar.

## Modal y bottom sheet

Depósito y retiro comparten un componente Radix Dialog:

- en móvil aparece como bottom sheet;
- desde 640 px aparece centrado;
- muestra cuenta enmascarada y saldo actual;
- usa un campo monetario destacado;
- presenta errores del servidor dentro del flujo.

El saldo mostrado no se usa para decidir si un retiro es válido. Esa decisión continúa en el servidor.

## Estados

- **Loading:** skeletons suaves.
- **Empty:** mensaje breve y calmado.
- **Error:** título y detalle normalizados.
- **Success:** resultado contextual y toast corto.
- **Submitting:** spinner, label de progreso y botón deshabilitado.
- **Disabled:** menor contraste y sin interacción.

## Responsive

- **320–639 px:** cards apiladas, footer y navegación inferior, sheet de ancho completo.
- **640–1023 px:** más espacio, botones en fila y modal centrado.
- **1024 px o más:** hero en dos columnas, navegación superior y formularios con panel contextual.

El contenido tiene un ancho máximo de 76 rem y paddings laterales progresivos.

## Accesibilidad

- enlace para saltar al contenido;
- labels reales y mensajes asociados;
- foco visible;
- navegación completa por teclado;
- targets táctiles amplios;
- estados disabled;
- icono, texto y signo para movimientos;
- contraste revisado para texto funcional;
- `prefers-reduced-motion` reduce animaciones y transiciones.

## Moneda y fechas

`formatCurrency()` usa `Intl.NumberFormat` con `es-NI` y `NIO`, presentado como C$. Es una decisión visual contextual: el backend no contiene `Currency`.

Fechas y horas usan `America/Managua`. `getNicaraguaToday()` construye la fecha local mediante `Intl.DateTimeFormat.formatToParts`, evitando el desfase potencial de `toISOString()`.
