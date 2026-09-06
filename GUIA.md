# Guía de publicación · Gaytán Hutchinson

**Regla de oro:** cada tipo de contenido tiene un archivo índice (`.js`) que es su única fuente de verdad. Editas ese archivo —y a veces creas o subes un archivo más— y la home, los hubs y los enlaces se actualizan solos.

| Contenido | Archivo índice | ¿Requiere crear/subir algo más? |
|---|---|---|
| Artículos | `articles.js` | Sí: la página del artículo |
| Calculadoras | `tools.js` | Sí: la página de la calculadora |
| Plantillas (descargables) | `tools.js` | Sí: el archivo en `/formatos/` |
| Indicadores económicos | `indicadores.js` | No |
| Base de comparables | `comparables.js` | No |

Después de cualquier cambio: **sube los archivos a Vercel** (o haz commit/push) y el sitio se actualiza.

---

## 1. Publicar un artículo

**Paso 1 — Agrégalo al índice.** En `articles.js`, agrega un objeto **al inicio** de la lista (el más reciente va primero):

```js
{
  slug: "nombre-sin-acentos-ni-espacios",
  title: "Título del artículo",
  excerpt: "Resumen de una o dos líneas.",
  category: "Fiscal",          // Valuación | Fiscal | M&A | Patrimonial | (o una nueva)
  date: "2026-07-10",          // AAAA-MM-DD
  minutes: 7
}
```

**Paso 2 — Crea la página.** Copia `articulos/plantilla-articulo.html` como `articulos/<slug>.html` (mismo slug). Dentro:
- Cambia lo que está entre `[corchetes]`: `<title>`, descripción, categoría, título, fecha y minutos.
- Escribe el cuerpo dentro de `<div class="prose">`.
- Abajo, en el script, pon `CURRENT_SLUG` igual al slug del archivo.

**Listo.** Se actualizan solos: el módulo "Publicaciones" de la home, el hub `/articulos`, los filtros por categoría y el "Sigue leyendo".

> Si usas una **categoría nueva**, su filtro aparece automáticamente en el hub. No hay que configurar nada.

---

## 2. Agregar una plantilla descargable (Word, Excel, PDF)

**Paso 1 — Sube el archivo.** Coloca el `.docx`, `.xlsx` o `.pdf` en la carpeta `formatos/`.

**Paso 2 — Agrégala al índice.** En `tools.js`, agrega un objeto:

```js
{
  slug: "carta-intencion",
  type: "plantilla",
  title: "Carta de intención (LOI)",
  description: "Plantilla editable para formalizar el interés.",
  format: "Word",                 // Word | Excel | PDF
  file: "carta-intencion.docx",   // nombre del archivo en /formatos/
  ready: true                     // true = ya disponible
}
```

**Listo.** Aparece en el hub de herramientas y en la home, con captura de correo antes de descargar.

> Para que los correos se guarden, conecta tu cuenta de **Formspree** (ver sección "Pendientes").

---

## 3. Agregar una calculadora

**Paso 1 — Crea la página.** Copia `herramientas/plantilla-calculadora.html` como `herramientas/<slug>.html`. Dentro:
- Cambia lo que está entre `[corchetes]` (título, descripción, etc.).
- Ajusta los campos del panel "Tus datos" y los resultados.
- En el script, cambia la fórmula en la función `calc()`.

**Paso 2 — Agrégala al índice.** En `tools.js`:

```js
{
  slug: "ahorro-isr",
  type: "calculadora",
  title: "Ahorro de ISR",
  description: "Qué hace la calculadora, en una línea.",
  cta: "Abrir calculadora",
  ready: true
}
```

> Si la dejas con `ready: false`, aparece como "Próximamente" y no enlaza (útil para anunciarla antes de terminarla).

---

## 4. Actualizar datos económicos (Indicadores)

Edita **solo** `indicadores.js`. Cambia los valores y la fecha en `actualizado`. Cada dato tiene su frecuencia:

| Dato | Frecuencia | Dónde se edita |
|---|---|---|
| Tipo de cambio | Diario | `panorama` y `cambioTasas` |
| INPC / inflación | Mensual | `precios` |
| PIB | Trimestral | `actividad` |
| Tablas de ISR | Anual (o al reformarse) | `isrMensual` |

**Listo.** El tablero `/indicadores` se arma solo.

> **Tipo de cambio automático (opcional):** si quieres que el dólar se actualice solo cada día, se conecta la API del SIE de Banxico mediante una función serverless en Vercel. Es un paso adicional; mientras tanto se actualiza a mano.

---

## 5. Actualizar la base de comparables (vitrina)

Edita `comparables.js`: `escala` (las cifras grandes), `regiones` y `muestra` (las empresas de ejemplo). La base completa de ~42,000 emisoras **no vive en el sitio** —es tu activo y se trabaja dentro de cada proyecto—.

---

## Después de publicar: desplegar

- **En Vercel / Cloudflare:** sube los archivos nuevos o modificados (o haz commit/push). El sitio se actualiza en segundos.
- **Vista previa local:** abre el sitio como **carpeta completa**. Los archivos `.js` compartidos deben estar junto a los `.html`; si abres un archivo suelto, las listas dinámicas aparecen vacías.

---

## Pendientes técnicos (una sola vez)

1. **Formspree:** crea una cuenta gratis y reemplaza `TU_ID_AQUI` por tu ID real en el formulario del boletín (`index.html`) y en las descargas (`herramientas/index.html`). Así se capturan los correos.
2. **Archivos de plantillas:** sube los `.docx/.xlsx/.pdf` reales a `formatos/` y pon `ready: true` en `tools.js`.
3. **Avisos legales:** confirma los campos marcados `[fecha]`, correo y jurisdicción en `privacidad.html` y `avisolegal.html`.
4. **Foto del hero:** cuando tengas una foto real (tuya, de tu equipo o tu oficina), sustituye la de stock en el hero de `index.html`.
