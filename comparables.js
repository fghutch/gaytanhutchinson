/* ============================================================
   BASE DE COMPARABLES · Gaytán Hutchinson
   Datos de la vitrina /comparables. La 'muestra' es ilustrativa
   (empresas reales, públicas); la base completa vive detrás del servicio.
   ============================================================ */
window.COMPARABLES = {
  escala: [
    { label: "Emisoras",       valor: "42,000" },
    { label: "Mercados",       valor: "79" },
    { label: "Regiones",       valor: "6" },
    { label: "Sectores (SIC)", valor: "Todos" }
  ],
  regiones: [
    { nombre: "Norteamérica",             bolsas: "NYSE · Nasdaq · TSX" },
    { nombre: "México",                   bolsas: "BMV · BIVA" },
    { nombre: "Latinoamérica",            bolsas: "B3 · BVC · BCS" },
    { nombre: "Europa",                   bolsas: "LSE · Euronext · XETRA · SIX" },
    { nombre: "Asia-Pacífico",            bolsas: "TSE · HKEX · KRX · TWSE" },
    { nombre: "Medio Oriente y África",   bolsas: "Tadawul · JSE" }
  ],
  // Muestra ilustrativa (empresas reales cotizadas). La base completa incluye ~42,000.
  muestra: [
    { empresa: "Apple",              pais: "EE.UU.",   bolsa: "Nasdaq",   region: "Norteamérica",           sector: "Tecnología" },
    { empresa: "Walmart",            pais: "EE.UU.",   bolsa: "NYSE",     region: "Norteamérica",           sector: "Comercio" },
    { empresa: "JPMorgan Chase",     pais: "EE.UU.",   bolsa: "NYSE",     region: "Norteamérica",           sector: "Financiero" },
    { empresa: "Pfizer",             pais: "EE.UU.",   bolsa: "NYSE",     region: "Norteamérica",           sector: "Salud" },
    { empresa: "Caterpillar",        pais: "EE.UU.",   bolsa: "NYSE",     region: "Norteamérica",           sector: "Industrial" },
    { empresa: "Shopify",            pais: "Canadá",   bolsa: "TSX",      region: "Norteamérica",           sector: "Tecnología" },

    { empresa: "Walmart de México",  pais: "México",   bolsa: "BMV",      region: "México",                 sector: "Comercio" },
    { empresa: "FEMSA",              pais: "México",   bolsa: "BMV",      region: "México",                 sector: "Alimentos y bebidas" },
    { empresa: "Grupo Bimbo",        pais: "México",   bolsa: "BMV",      region: "México",                 sector: "Alimentos y bebidas" },
    { empresa: "Cemex",              pais: "México",   bolsa: "BMV",      region: "México",                 sector: "Materiales" },
    { empresa: "Grupo Financiero Banorte", pais: "México", bolsa: "BMV", region: "México",                 sector: "Financiero" },
    { empresa: "América Móvil",      pais: "México",   bolsa: "BMV",      region: "México",                 sector: "Tecnología" },

    { empresa: "Petrobras",          pais: "Brasil",   bolsa: "B3",       region: "Latinoamérica",          sector: "Energía" },
    { empresa: "Vale",               pais: "Brasil",   bolsa: "B3",       region: "Latinoamérica",          sector: "Materiales" },
    { empresa: "Itaú Unibanco",      pais: "Brasil",   bolsa: "B3",       region: "Latinoamérica",          sector: "Financiero" },
    { empresa: "Ecopetrol",          pais: "Colombia", bolsa: "BVC",      region: "Latinoamérica",          sector: "Energía" },

    { empresa: "Nestlé",             pais: "Suiza",    bolsa: "SIX",      region: "Europa",                 sector: "Alimentos y bebidas" },
    { empresa: "LVMH",               pais: "Francia",  bolsa: "Euronext", region: "Europa",                 sector: "Consumo" },
    { empresa: "SAP",                pais: "Alemania", bolsa: "XETRA",    region: "Europa",                 sector: "Tecnología" },
    { empresa: "Shell",              pais: "R. Unido", bolsa: "LSE",      region: "Europa",                 sector: "Energía" },
    { empresa: "Siemens",            pais: "Alemania", bolsa: "XETRA",    region: "Europa",                 sector: "Industrial" },
    { empresa: "AstraZeneca",        pais: "R. Unido", bolsa: "LSE",      region: "Europa",                 sector: "Salud" },

    { empresa: "Toyota",             pais: "Japón",    bolsa: "TSE",      region: "Asia-Pacífico",          sector: "Automotriz" },
    { empresa: "TSMC",               pais: "Taiwán",   bolsa: "TWSE",     region: "Asia-Pacífico",          sector: "Tecnología" },
    { empresa: "Samsung Electronics",pais: "Corea",    bolsa: "KRX",      region: "Asia-Pacífico",          sector: "Tecnología" },
    { empresa: "Alibaba",            pais: "China",    bolsa: "HKEX",     region: "Asia-Pacífico",          sector: "Comercio" },
    { empresa: "Toyota Industries",  pais: "Japón",    bolsa: "TSE",      region: "Asia-Pacífico",          sector: "Industrial" },

    { empresa: "Saudi Aramco",       pais: "A. Saudita",bolsa: "Tadawul", region: "Medio Oriente y África", sector: "Energía" },
    { empresa: "Naspers",            pais: "Sudáfrica",bolsa: "JSE",      region: "Medio Oriente y África", sector: "Tecnología" },
    { empresa: "Al Rajhi Bank",      pais: "A. Saudita",bolsa: "Tadawul", region: "Medio Oriente y África", sector: "Financiero" }
  ]
};
