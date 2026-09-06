# Gaytán Hutchinson — Sitio web

Sitio de la firma: consultoría financiera, fiscal y legal. Monterrey, N.L.

Sitio **estático** (HTML + CSS + JavaScript), sin proceso de build.
Se despliega en Vercel; cada `git push` a `main` lo redespliega automáticamente.

## Estructura

```
index.html            Home
privacidad.html        Aviso de Privacidad (con derechos ARCO)
avisolegal.html        Aviso Legal
indicadores.html       Tablero de indicadores económicos
comparables.html       Vitrina de la base de comparables

articles.js            Índice de artículos      (fuente de verdad)
tools.js               Índice de herramientas   (fuente de verdad)
indicadores.js         Datos económicos         (fuente de verdad)
comparables.js         Datos de comparables     (fuente de verdad)

articulos/             Hub + artículos + plantilla-articulo.html
herramientas/          Hub + calculadoras + plantilla-calculadora.html
formatos/              Archivos descargables (.docx/.xlsx/.pdf)
marca/                 Logos (SVG y PNG)

GUIA.md                Cómo publicar contenido (paso a paso)
DESPLIEGUE.md          Cómo desplegar en Vercel
vercel.json            Configuración de Vercel (URLs limpias)
```

## Cómo actualizar

La regla: **nunca se edita la home ni los hubs a mano.** Se edita el archivo
índice `.js` correspondiente y el sitio se arma solo.

- **Artículo:** agrega la entrada en `articles.js` + crea `articulos/<slug>.html`
  (copia de `plantilla-articulo.html`).
- **Plantilla descargable:** sube el archivo a `formatos/` + agrégala en `tools.js`.
- **Calculadora:** crea `herramientas/<slug>.html` (copia de `plantilla-calculadora.html`)
  + agrégala en `tools.js`.
- **Indicadores económicos:** edita `indicadores.js`.
- **Comparables:** edita `comparables.js`.

Luego: `git add . && git commit -m "…" && git push`. Vercel redespliega solo.

Detalle completo con ejemplos en **GUIA.md**.

## Pendientes de una sola vez

1. **Formspree:** reemplaza `TU_ID_AQUI` en `index.html` (boletín) y
   `herramientas/index.html` (descargas) por tu ID real, para captar correos.
2. **Formatos:** sube los archivos reales a `formatos/` y pon `ready: true` en `tools.js`.
3. **Avisos legales:** confirma los campos `[fecha]`, correo y jurisdicción en
   `privacidad.html` y `avisolegal.html`.
4. **Foto del hero:** sustituye la de stock por una real cuando la tengas.

## Notas

- Prueba el sitio siempre como carpeta completa (o en la URL de Vercel), no abriendo
  archivos sueltos: los índices `.js` son compartidos y necesitan estar junto a las páginas.
- Las carpetas `marca/` y los `plantilla-*.html` son de apoyo; puedes borrarlos del
  deploy si prefieres que no sean públicos.
