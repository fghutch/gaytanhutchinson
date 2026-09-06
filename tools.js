/* ============================================================
   ÍNDICE DE HERRAMIENTAS · Gaytán Hutchinson
   Única fuente de verdad. La home y el hub /herramientas leen de aquí.

   PARA AGREGAR UNA HERRAMIENTA:
   - Calculadora: agrega un objeto con type:"calculadora".
       Si ya tiene página, pon ready:true y crea herramientas/<slug>.html
       (copia plantilla-calculadora.html). Si no, ready:false = "Próximamente".
   - Plantilla:   agrega un objeto con type:"plantilla".
       Coloca el archivo en /formatos/ y pon ready:true con el nombre en "file".

   Campos:
   - slug        : id / nombre de archivo (sin espacios ni acentos)
   - type        : "calculadora" | "plantilla"
   - title       : nombre visible
   - description : una línea
   - ready       : true si ya existe la página/archivo
   - (calculadora) cta   : texto del botón, ej. "Abrir calculadora"
   - (plantilla)  format : "Excel" | "Word" | "PDF"
   - (plantilla)  file   : ruta del archivo en /formatos/, ej. "modelo-dcf.xlsx"
   ============================================================ */
window.TOOLS = [
  {
    slug: "valuacion-multiplos",
    type: "calculadora",
    title: "Valuación por múltiplos de EBITDA",
    description: "Estima el rango de valor de tu empresa por sector, con ajuste por deuda neta.",
    cta: "Abrir calculadora",
    ready: true
  },
  {
    slug: "valuacion-intangibles",
    type: "calculadora",
    title: "Valuación de intangibles",
    description: "Estima el valor de una marca u otro intangible por el método de regalías evitadas.",
    cta: "Abrir calculadora",
    ready: true
  },
  {
    slug: "valuacion-maquinaria",
    type: "calculadora",
    title: "Valuación de maquinaria y equipo",
    description: "Estima el valor de un activo por el enfoque de costos, ajustado por edad y condición.",
    cta: "Abrir calculadora",
    ready: true
  },
  {
    slug: "carta-intencion",
    type: "plantilla",
    title: "Carta de intención (LOI)",
    description: "Plantilla editable para formalizar el interés en una transacción.",
    format: "Word",
    file: "carta-intencion.docx",
    ready: false
  },
  {
    slug: "checklist-due-diligence",
    type: "plantilla",
    title: "Checklist de due diligence",
    description: "Guía de puntos de revisión para preparar o auditar una operación.",
    format: "PDF",
    file: "checklist-due-diligence.pdf",
    ready: false
  },
  {
    slug: "modelo-dcf",
    type: "plantilla",
    title: "Modelo de flujo de caja descontado",
    description: "Hoja de cálculo con instrucciones para armar una valuación por DCF.",
    format: "Excel",
    file: "modelo-dcf.xlsx",
    ready: false
  }
];
