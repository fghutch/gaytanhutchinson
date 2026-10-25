/* ============================================================
   Cotización en PDF · Estudio de precios de transferencia
   Arma la propuesta sobre la plantilla de Gaytán Hutchinson:
   portada con la empresa, carta con alcance y honorarios,
   y las páginas institucionales (firma, misión, servicios, contacto).

   Textos y condiciones editables en CONDICIONES (abajo).
   Requiere: pdf-lib.min.js y fontkit.umd.min.js (misma carpeta).
   ============================================================ */
(function () {
  var BASE = (function () {
    var s = document.currentScript && document.currentScript.src;
    return s ? s.replace(/[^\/]*$/, "") : "cotizacion/";
  })();

  var CONDICIONES = {
    ciudad: "Monterrey N.L.",
    anticipoPct: 0.5,
    vigenciaDias: 30,
    firmante: "Francisco Gaytán",
    cargo: "Socio"
  };

  var MESES = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];
  var AZUL = [30, 67, 157], NAVY = [27, 39, 82], FILA = [230, 236, 246];

  function loadScript(src) {
    return new Promise(function (ok, ko) {
      var s = document.createElement("script"); s.src = src; s.onload = ok; s.onerror = function () { ko(new Error("No se pudo cargar " + src)); };
      document.head.appendChild(s);
    });
  }
  function bytes(url) { return fetch(url).then(function (r) { if (!r.ok) throw new Error("No se pudo cargar " + url); return r.arrayBuffer(); }); }
  function money(n) { return "$" + n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }); }
  function moneyInt(n) { return "$" + Math.round(n).toLocaleString("en-US"); }
  // Las fuentes estándar de PDF solo codifican Latin-1; lo demás se sustituye.
  function wa(s) {
    return String(s == null ? "" : s).replace(/[−‐‑]/g, "-").replace(/[“”]/g, '"').replace(/[‘’]/g, "'")
      .replace(/[^\x20-\x7E\xA0-\xFF•—–…]/g, "?");
  }

  async function generar(d) {
    if (!window.PDFLib) await loadScript(BASE + "pdf-lib.min.js");
    if (!window.fontkit) await loadScript(BASE + "fontkit.umd.min.js");
    var P = window.PDFLib, rgb = function (c) { return P.rgb(c[0] / 255, c[1] / 255, c[2] / 255); };

    var res = await Promise.all([BASE + "portada.jpg", BASE + "membrete.jpg", BASE + "firma.jpg", BASE + "paginas-firma.pdf", BASE + "DMSans-Bold.ttf", BASE + "DMSans-Regular.ttf"].map(bytes));
    var doc = await P.PDFDocument.create();
    doc.registerFontkit(window.fontkit);
    var H = await doc.embedFont(P.StandardFonts.Helvetica), HB = await doc.embedFont(P.StandardFonts.HelveticaBold);
    var DMB = await doc.embedFont(res[4], { subset: true }), DMR = await doc.embedFont(res[5], { subset: true });
    var imgPortada = await doc.embedJpg(res[0]), imgMembrete = await doc.embedJpg(res[1]), imgFirma = await doc.embedJpg(res[2]);
    var inst = await P.PDFDocument.load(res[3]);

    var hoy = new Date();
    var fecha = MESES[hoy.getMonth()] + " " + hoy.getDate() + ", " + hoy.getFullYear() + ".";
    var ejercicio = hoy.getMonth() <= 4 ? hoy.getFullYear() - 1 : hoy.getFullYear();
    var folio = "PT-" + String(hoy.getFullYear()).slice(2) + String(hoy.getMonth() + 1).padStart(2, "0") + String(hoy.getDate()).padStart(2, "0") + "-" + Math.floor(1000 + Math.random() * 9000);
    var empresa = (d.empresa || "").trim() || "Su empresa";
    var W = 810;

    /* ---------- Portada ---------- */
    var pg = doc.addPage([W, W]);
    pg.drawImage(imgPortada, { x: 0, y: 0, width: W, height: W });
    // Empresa (donde iba el logotipo del cliente)
    var nameSize = 34, lines;
    function wrapDM(text, font, size, maxW) {
      var words = text.split(/\s+/), out = [], cur = "";
      words.forEach(function (w) { var t = cur ? cur + " " + w : w; if (font.widthOfTextAtSize(t, size) > maxW && cur) { out.push(cur); cur = w; } else cur = t; });
      if (cur) out.push(cur); return out;
    }
    do { lines = wrapDM(empresa, DMB, nameSize, 330); if (lines.length <= 3) break; nameSize -= 2; } while (nameSize > 18);
    var y = 810 - 92;
    lines.slice(0, 4).forEach(function (l) { pg.drawText(l, { x: 30, y: y, size: nameSize, font: DMB, color: rgb(NAVY) }); y -= nameSize * 1.12; });
    pg.drawText("ESTUDIO DE PRECIOS DE TRANSFERENCIA", { x: 31, y: y - 8, size: 11, font: DMB, color: rgb(AZUL) });
    pg.drawText("EJERCICIO FISCAL " + ejercicio, { x: 31, y: y - 24, size: 11, font: DMR, color: rgb(AZUL) });
    // Título en la franja azul
    ["Propuesta de Servicios", "Profesionales.", fecha].forEach(function (t, i) {
      pg.drawText(t, { x: 173, y: 206 - i * 30, size: 24, font: DMB, color: P.rgb(1, 1, 1) });
    });
    // Datos de contacto (donde iba la dirección)
    var cy = 92;
    [d.nombre, d.correo, d.tel].filter(function (x) { return x && x.trim(); }).forEach(function (t) {
      var s = t.trim().toUpperCase(); var w = DMB.widthOfTextAtSize(s, 8.6);
      pg.drawText(s, { x: 657 - w, y: cy, size: 8.6, font: DMB, color: P.rgb(0.1, 0.1, 0.1) }); cy -= 12.5;
    });
    pg.drawText("FOLIO " + folio, { x: 657 - DMR.widthOfTextAtSize("FOLIO " + folio, 8), y: cy - 2, size: 8, font: DMR, color: P.rgb(0.35, 0.35, 0.35) });

    /* ---------- Página institucional: Nuestra firma ---------- */
    var copied = await doc.copyPages(inst, inst.getPageIndices());
    doc.addPage(copied[0]);

    /* ---------- Carta ---------- */
    var L = 55, R = 755, TW = R - L, TOP = 690, BOT = 62, FS = 10.6, LH = 14.6;
    var page, cursor;
    function nuevaPagina() { page = doc.addPage([W, W]); page.drawImage(imgMembrete, { x: 0, y: 0, width: W, height: W }); cursor = TOP; }
    function need(h) { if (cursor - h < BOT) nuevaPagina(); }
    function tokens(text) { // **negritas**
      var out = [], segs = String(text).split("**");
      segs.forEach(function (seg, i) {
        var pegado = i > 0 && !/\s$/.test(segs[i - 1]) && segs[i - 1] !== "";
        seg.split(/(\s+)/).forEach(function (w, j) { if (w && !/^\s+$/.test(w)) out.push({ t: wa(w), b: i % 2 === 1, glue: pegado && j === 0 && out.length > 0 }); });
      });
      return out;
    }
    function para(text, o) {
      o = o || {}; var x0 = L + (o.indent || 0), maxW = TW - (o.indent || 0), size = o.size || FS, lh = o.lh || LH;
      var color = rgb(o.color || [0, 0, 0]), toks = tokens(text), lines = [], cur = [], curW = 0;
      var sp = function (b) { return (b ? HB : H).widthOfTextAtSize(" ", size); };
      toks.forEach(function (tk) {
        var f = (tk.b || o.bold) ? HB : H, w = f.widthOfTextAtSize(tk.t, size);
        if (tk.glue && cur.length) { var pv = cur[cur.length - 1]; pv.extra = (pv.extra || []).concat([{ t: tk.t, b: tk.b, w: w }]); pv.w += w; curW += w; return; }
        var add = cur.length ? sp(tk.b || o.bold) + w : w;
        if (curW + add > maxW && cur.length) { lines.push({ toks: cur, w: curW }); cur = [{ tk: tk, w: w }]; curW = w; }
        else { cur.push({ tk: tk, w: w }); curW += add; }
      });
      if (cur.length) lines.push({ toks: cur, w: curW, last: true });
      lines.forEach(function (ln, li) {
        need(lh);
        var gap = sp(o.bold), extra = 0;
        if (o.justify !== false && !ln.last && ln.toks.length > 1) extra = (maxW - ln.w) / (ln.toks.length - 1);
        var x = x0;
        if (o.align === "right") x = L + TW - ln.w;
        if (li === 0 && o.bullet) page.drawText("•", { x: x0 - 13, y: cursor - size, size: size, font: H, color: color });
        ln.toks.forEach(function (c) {
          var f0 = (c.tk.b || o.bold) ? HB : H, xx = x;
          page.drawText(c.tk.t, { x: xx, y: cursor - size, size: size, font: f0, color: color });
          xx += f0.widthOfTextAtSize(c.tk.t, size);
          (c.extra || []).forEach(function (e) { var fe = (e.b || o.bold) ? HB : H; page.drawText(e.t, { x: xx, y: cursor - size, size: size, font: fe, color: color }); xx += e.w; });
          x += c.w + gap + extra;
        });
        cursor -= lh;
      });
      cursor -= (o.after == null ? 6 : o.after);
    }
    function titulo(t) { need(LH * 3); cursor -= 6; para(t, { bold: true, after: 3, justify: false }); }
    function subt(t) { need(LH * 3); para(t, { bold: true, color: AZUL, after: 3, justify: false }); }
    function bullets(arr) { arr.forEach(function (b, i) { para(b, { indent: 31, bullet: true, after: i === arr.length - 1 ? 8 : 2 }); }); }
    function tabla(cols, rows, opts) {
      opts = opts || {}; var rh = 22, size = 10;
      need(rh * Math.min(rows.length + 1, 4));
      var all = [cols.map(function (c) { return c.t; })].concat(rows.map(function (r) { return r.cells; }));
      all.forEach(function (cells, ri) {
        need(rh);
        var head = ri === 0, r = rows[ri - 1] || {}, x = L, top = cursor;
        if (head) page.drawRectangle({ x: L, y: top - rh, width: TW, height: rh, color: rgb(AZUL) });
        else if (r.total) page.drawRectangle({ x: L, y: top - rh, width: TW, height: rh, color: rgb(FILA) });
        cols.forEach(function (c, ci) {
          var w = c.w * TW, txt = wa(cells[ci] == null ? "" : cells[ci]), f = (head || r.total) ? HB : H;
          var tw = f.widthOfTextAtSize(txt, size), tx = c.right ? x + w - 7 - tw : x + 7;
          page.drawText(txt, { x: tx, y: top - rh + 7, size: size, font: f, color: head ? P.rgb(1, 1, 1) : P.rgb(0, 0, 0) });
          page.drawRectangle({ x: x, y: top - rh, width: w, height: rh, borderColor: P.rgb(0, 0, 0), borderWidth: 0.6 });
          x += w;
        });
        cursor -= rh;
      });
      cursor -= 12;
    }

    nuevaPagina();
    // Encabezado
    var nombre = (d.nombre || "").trim(), headY = cursor;
    var izq = [nombre, empresa, d.giro ? "Giro: " + d.giro : ""].filter(Boolean);
    izq.forEach(function (t, i) { page.drawText(wa(t), { x: L, y: headY - FS - i * 15, size: 11.2, font: HB }); });
    var der = CONDICIONES.ciudad + " " + fecha; page.drawText(wa(der), { x: R - HB.widthOfTextAtSize(wa(der), 11.2), y: headY - FS, size: 11.2, font: HB });
    var fol = "Folio " + folio; page.drawText(fol, { x: R - H.widthOfTextAtSize(fol, 9.5), y: headY - FS - 15, size: 9.5, font: H, color: P.rgb(0.35, 0.35, 0.35) });
    cursor = headY - izq.length * 15 - 22;

    para("Agradecemos la oportunidad de presentar la presente propuesta de servicios profesionales a **" + empresa + " (El Cliente)**, reiterando nuestro compromiso de brindar un servicio de excelencia, con estricto apego a la normativa y legislación aplicable y los más altos estándares éticos y técnicos.", { after: 14 });

    titulo("I. OBJETIVO Y ALCANCE DE LOS SERVICIOS.");
    para("El objetivo de esta propuesta es elaborar el estudio de precios de transferencia de El Cliente por el ejercicio fiscal " + ejercicio + ", que sirva como documentación comprobatoria de que las operaciones celebradas con partes relacionadas se pactaron con precios y montos de contraprestaciones que habrían utilizado partes independientes en operaciones comparables, conforme a los artículos 76, fracciones IX y XII, 179 y 180 de la Ley del Impuesto sobre la Renta y a las Guías de Precios de Transferencia de la OCDE.");
    para("Con base en la información proporcionada por El Cliente, el estudio comprende las siguientes operaciones:", { after: 4 });
    bullets(d.ops.filter(function (o) { return o.base; }).map(function (o) {
      return "**" + o.nombre + "**" + (o.montoTxt ? " (monto anual aproximado: " + o.montoTxt + ")" : "") + ". Método previsto: " + o.largo + ".";
    }));
    var medida = d.ops.filter(function (o) { return !o.base; });
    if (medida.length) para("Las operaciones de " + medida.map(function (o) { return o.nombre.toLowerCase(); }).join(", ") + " requieren una revisión inicial de su naturaleza y documentación, y se cotizarán por separado.");

    subt("FASE I. ENTENDIMIENTO DE LAS OPERACIONES Y ANÁLISIS FUNCIONAL");
    bullets([
      "Entrevista con la administración de El Cliente para entender el grupo, sus operaciones con partes relacionadas y la forma en que se fijan los precios.",
      "Revisión de contratos, organigrama del grupo, estados financieros y balanza de comprobación del ejercicio.",
      "Identificación y cuantificación de las operaciones con partes relacionadas, conciliadas con la contabilidad y los CFDI.",
      "Análisis de las funciones realizadas, los activos utilizados y los riesgos asumidos por cada parte, y caracterización de las entidades."
    ]);
    subt("FASE II. ANÁLISIS ECONÓMICO");
    var f2 = [
      "Selección de la parte analizada y del método de precios de transferencia conforme al orden del artículo 180 de la LISR.",
      "Búsqueda de comparables con bitácora de criterios de aceptación y rechazo, y cálculo del rango intercuartil conforme al artículo 302 del Reglamento de la LISR.",
      "Evaluación de ajustes de comparabilidad y comparación de los resultados de El Cliente contra el rango de plena competencia."
    ];
    if (d.ops.some(function (o) { return o.id === "pres"; })) f2.push("Para los préstamos: calificación crediticia sintética del deudor y determinación del rango de tasas de interés de mercado (capítulo X de las Guías OCDE), y revisión de capitalización delgada y límite de intereses (artículo 28, fracciones XXVII y XXXII de la LISR).");
    if (d.ops.some(function (o) { return o.id === "arr"; })) f2.push("Para los arrendamientos: comparación de la renta pactada contra rentas de mercado de inmuebles o equipo comparables.");
    bullets(f2);
    subt("FASE III. INFORME Y CONCLUSIONES");
    bullets([
      "Redacción del estudio con resumen ejecutivo, análisis funcional, análisis económico, conclusiones y anexos.",
      "Cálculo del ajuste de precios de transferencia, en su caso, cuando algún resultado quede fuera del rango.",
      "Sesión de presentación de resultados y recomendaciones con la administración de El Cliente."
    ]);
    para("Estimamos concluir los trabajos en un plazo de " + (d.plazoDias || 10) + " días hábiles contados a partir de recibir la información completa, sujeto a la disponibilidad de la información y del personal de El Cliente.", { after: 14 });

    titulo("II. ENTREGABLES.");
    bullets([
      "Estudio de precios de transferencia del ejercicio " + ejercicio + " (documentación comprobatoria), en formato PDF.",
      "Anexos: bitácora de búsqueda de comparables, información financiera de los comparables y cálculo del rango intercuartil.",
      "Resumen ejecutivo con conclusiones y recomendaciones para el siguiente ejercicio.",
      "Cálculo del ajuste de precios de transferencia, en su caso.",
      "Sesión de presentación de resultados."
    ]);

    titulo("III. HONORARIOS Y FORMA DE PAGO.");
    para("Los honorarios del estudio son de **precio fijo** y se determinan con base en el número, el monto y la complejidad de las operaciones descritas en el Objetivo y Alcance. Se los haremos llegar por escrito en un plazo máximo de un día hábil, una vez revisada la información de El Cliente.");
    para("La forma de pago será un **anticipo del " + Math.round(CONDICIONES.anticipoPct * 100) + "%** a la aceptación de los honorarios y un **finiquito del " + Math.round((1 - CONDICIONES.anticipoPct) * 100) + "%** contra la entrega del estudio. Los honorarios causan el Impuesto al Valor Agregado.");
    para("En caso de que el alcance descrito requiera un esfuerzo mayor al estimado, el trabajo adicional se cotizará previamente y requerirá la autorización por escrito de El Cliente.");
    para("Los honorarios no incluyen viáticos, gastos asociados con papelería, mensajería, impresión de documentos, la presentación de la declaración informativa de operaciones con partes relacionadas, la atención a revisiones de la autoridad, litigio y derivados, así como ningún otro servicio o concepto que no sea mencionado dentro del Objetivo y Alcance de los servicios.", { after: 14 });

    titulo("IV. RESPONSABILIDADES DE EL CLIENTE.");
    bullets([
      "Designar un enlace responsable del proyecto y facilitar la disponibilidad del personal administrativo para la entrevista del análisis funcional.",
      "Proporcionar de manera oportuna la balanza de comprobación, los estados financieros, los contratos con partes relacionadas, el organigrama del grupo y el detalle o los CFDI de las operaciones.",
      "Revisar y validar el borrador del estudio dentro de los plazos acordados."
    ]);
    titulo("V. VIGENCIA.");
    para("La presente propuesta tendrá una vigencia de " + CONDICIONES.vigenciaDias + " días naturales contados a partir de la fecha de su emisión. Fue generada en línea con base en la información proporcionada en el diagnóstico.");
    para("Agradeciendo de antemano su atención, quedamos atentos a cualquier comentario. Será un gusto colaborar con usted.", { after: 16 });

    // Bloque de firma y aceptación
    need(230);
    var top = cursor, fw = 150, fh = fw * 355 / 440;
    page.drawImage(imgFirma, { x: L + 60, y: top - fh - 10, width: fw, height: fh });
    var ax = 385, ay = top - 4;
    page.drawText("Aceptación de conformidad:", { x: ax, y: ay - 10, size: 10, font: HB });
    var txtA = "MANIFIESTO QUE HE LEÍDO LOS TÉRMINOS Y LAS CONDICIONES DE ESTA PROPUESTA DE TRABAJO QUE ANTECEDE Y MANIFIESTO Y GARANTIZO QUE CUENTO CON AUTORIDAD SUFICIENTE PARA SUSCRIBIR LA PRESENTE EN NOMBRE Y REPRESENTACIÓN DE **" + empresa.toUpperCase() + "**" + (/\.$/.test(empresa) ? "" : ".");
    var saveL = L, saveTW = TW; L = ax; TW = R - ax; cursor = ay - 18; para(txtA, { size: 8.4, lh: 11.5, after: 10 });
    ["Nombre:", "Puesto:", "Firma:", "Fecha:"].forEach(function (t) {
      page.drawText(t, { x: ax, y: cursor - 10, size: 9.5, font: H });
      page.drawLine({ start: { x: ax + 46, y: cursor - 11 }, end: { x: ax + 250, y: cursor - 11 }, thickness: 0.6, color: P.rgb(0, 0, 0) });
      cursor -= 27;
    });
    L = saveL; TW = saveTW;

    /* ---------- Páginas institucionales ---------- */
    copied.slice(1).forEach(function (p) { doc.addPage(p); });

    doc.setTitle("Propuesta estudio de precios de transferencia · " + empresa);
    doc.setAuthor("Gaytán Hutchinson"); doc.setSubject("Folio " + folio); doc.setCreator("gaytanhutchinson.com");
    var out = await doc.save();
    return { bytes: out, folio: folio, nombreArchivo: "Propuesta_PT_" + empresa.replace(/[^A-Za-z0-9áéíóúñÁÉÍÓÚÑ]+/g, "_").replace(/^_|_$/g, "").slice(0, 60) + ".pdf" };
  }

  window.generarCotizacionPT = async function (d) {
    var r = await generar(d);
    var blob = new Blob([r.bytes], { type: "application/pdf" }), url = URL.createObjectURL(blob);
    var a = document.createElement("a"); a.href = url; a.download = r.nombreArchivo; document.body.appendChild(a); a.click();
    setTimeout(function () { URL.revokeObjectURL(url); a.remove(); }, 4000);
    return r.folio;
  };
})();
