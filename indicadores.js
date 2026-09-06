/* ============================================================
   INDICADORES ECONÓMICOS · Gaytán Hutchinson
   Única fuente de verdad del tablero /indicadores.

   CÓMO ACTUALIZAR (según frecuencia de cada dato):
   - Tipo de cambio: diario (Banxico FIX).           → 'panorama' y 'cambioTasas'
   - INPC / inflación: mensual (INEGI/Banxico).       → 'precios'
   - PIB: trimestral (INEGI).                          → 'actividad'
   - Tablas de ISR: anual o al reformarse (DOF).      → 'isrMensual'
   Cambia el valor y la fecha en 'actualizado'. El tablero se arma solo.

   Valores sembrados con datos reales al 2–4 jul 2026 (ACTUALÍZALOS).
   ============================================================ */
window.INDICADORES = {
  actualizado: "4 jul 2026",

  // Mosaicos principales (lo que se ve de un vistazo)
  panorama: [
    { label: "USD/MXN (FIX)",        valor: "17.56",  nota: "al 2 jul 2026" },
    { label: "Inflación anual",      valor: "3.55%",  nota: "1ª quincena jun 2026" },
    { label: "Tasa objetivo Banxico",valor: "6.50%",  nota: "jun 2026" },
    { label: "PIB trimestral",       valor: "−0.8%",  nota: "1T 2026" }
  ],

  // Pestaña: Tipo de cambio y tasas
  cambioTasas: [
    { nombre: "Tipo de cambio FIX (USD/MXN)", valor: "17.56",       nota: "2 jul 2026" },
    { nombre: "Tasa objetivo Banxico",         valor: "6.50%",       nota: "vigente" },
    { nombre: "TIIE a 28 días",                valor: "[actualizar]",nota: "" }
  ],

  // Pestaña: Precios
  precios: [
    { nombre: "INPC (índice base 2ª quinc. jul 2018)", valor: "[actualizar]", nota: "jun 2026" },
    { nombre: "Inflación mensual",                      valor: "[actualizar]", nota: "jun 2026" },
    { nombre: "Inflación anual",                        valor: "3.55%",        nota: "1ª quincena jun 2026" }
  ],

  // Pestaña: Actividad
  actividad: [
    { nombre: "PIB — variación trimestral", valor: "−0.8%",       nota: "1T 2026" },
    { nombre: "PIB — variación anual",       valor: "[actualizar]",nota: "1T 2026" }
  ],

  // Pestaña: Tablas ISR — SUSTITUYE por la tarifa vigente publicada en el DOF.
  // Tarifa mensual (retenciones, Art. 96 LISR). Columnas: límite inf, límite sup, cuota fija, % s/ excedente.
  isrMensual: {
    referencia: "Tarifa mensual · Art. 96 LISR",
    nota: "Ejemplo de estructura. Sustituye por la tarifa vigente del ejercicio (DOF).",
    filas: [
      { li: "0.01",      ls: "746.04",    cuota: "0.00",   pct: "1.92%" },
      { li: "746.05",    ls: "6,332.05",  cuota: "14.32",  pct: "6.40%" },
      { li: "6,332.06",  ls: "11,128.01", cuota: "371.83", pct: "10.88%" },
      { li: "11,128.02", ls: "…",         cuota: "…",      pct: "…" }
    ]
  }
};
