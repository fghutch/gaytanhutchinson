#!/usr/bin/env python3
"""
Rangos de comparables desde SEC EDGAR (dominio público).

Descarga los "frames" XBRL anuales de la SEC (todas las emisoras de EE.UU. por
concepto y año), obtiene el SIC oficial de cada emisora y calcula, por empresa,
los indicadores ponderados de 3 años que usa un estudio de precios de
transferencia:
  - MO    margen de operación            = utilidad de operación / ventas
  - MCT   margen sobre costos totales    = utilidad de operación / (ventas - utilidad de operación)
  - Berry razón Berry                    = utilidad bruta / gastos de operación

Guarda datos ANÓNIMOS (sin nombre, ticker ni CIK) en data/comparables-eeuu.json;
la página herramientas/rangos-comparables.html calcula el rango intercuartil
(art. 302 RLISR) en el navegador con los filtros del usuario.

Lo corre .github/workflows/comparables-edgar.yml cada semana.
La SEC pide identificar al solicitante en el User-Agent y no exceder 10 solicitudes por segundo.
"""
import datetime as dt
import json
import os
import sys
import time
import urllib.error
import urllib.request

UA = "Gaytan Hutchinson francisco@gaytanhutchinson.com"
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, "data", "comparables-eeuu.json")
CACHE = os.path.join(ROOT, "data", "sec-sic-cache.json")
MOCK = os.environ.get("EDGAR_MOCK_DIR")  # pruebas sin red

CONCEPTOS = {
    "rev": ["Revenues", "RevenueFromContractWithCustomerExcludingAssessedTax",
            "RevenueFromContractWithCustomerIncludingAssessedTax", "SalesRevenueNet"],
    "oi": ["OperatingIncomeLoss"],
    "cogs": ["CostOfRevenue", "CostOfGoodsAndServicesSold", "CostOfGoodsSold", "CostOfServices"],
}
BOLSAS = {"NYSE", "Nasdaq", "NYSE American", "NYSE MKT", "NYSE Arca", "CBOE"}


def get_json(url, intentos=4):
    if MOCK:
        nombre = url.split("/api/")[-1].replace("/", "_") if "/api/" in url else url.rsplit("/", 1)[-1]
        ruta = os.path.join(MOCK, nombre)
        if not os.path.exists(ruta):
            return None
        with open(ruta) as f:
            return json.load(f)
    for i in range(intentos):
        try:
            req = urllib.request.Request(url, headers={"User-Agent": UA, "Accept-Encoding": "identity"})
            with urllib.request.urlopen(req, timeout=60) as r:
                return json.load(r)
        except urllib.error.HTTPError as e:
            if e.code == 404:
                return None
            time.sleep(2 * (i + 1))
        except Exception:
            time.sleep(2 * (i + 1))
    return None


def frames(concepto, anio):
    d = get_json(f"https://data.sec.gov/api/xbrl/frames/us-gaap/{concepto}/USD/CY{anio}.json")
    time.sleep(0.15)
    return {row["cik"]: row["val"] for row in (d or {}).get("data", [])}


def main():
    hoy = dt.date.today()
    ult = hoy.year - 1  # último año calendario completo
    anios = list(range(ult - 3, ult + 1))
    ventanas = [(ult - 2, ult), (ult - 3, ult - 1)]

    # 1) Datos por concepto y año (el primer concepto con dato gana, en orden de prioridad)
    datos = {k: {a: {} for a in anios} for k in CONCEPTOS}
    for k, lista in CONCEPTOS.items():
        for a in anios:
            for c in lista:
                for cik, val in frames(c, a).items():
                    datos[k][a].setdefault(cik, val)
        print(k, {a: len(datos[k][a]) for a in anios}, flush=True)

    # 2) Universo: emisoras con ventas y utilidad de operación en la ventana más reciente
    w0 = range(ventanas[0][0], ventanas[0][1] + 1)
    universo = [cik for cik in datos["oi"][ult] if all(cik in datos["rev"][a] and cik in datos["oi"][a] for a in w0)]
    print("universo", len(universo), flush=True)

    # 3) SIC oficial y bolsa (con caché para no repetir solicitudes)
    cache = {}
    if os.path.exists(CACHE):
        with open(CACHE) as f:
            cache = json.load(f)
    nuevos = 0
    for cik in universo:
        k = str(cik)
        if k in cache:
            continue
        s = get_json(f"https://data.sec.gov/submissions/CIK{cik:010d}.json")
        time.sleep(0.12)
        if not s:
            continue
        cache[k] = {"sic": s.get("sic") or "", "bolsa": sorted(set(x for x in (s.get("exchanges") or []) if x))}
        nuevos += 1
        if nuevos % 500 == 0:
            print("sic", nuevos, flush=True)
    os.makedirs(os.path.dirname(CACHE), exist_ok=True)
    with open(CACHE, "w") as f:
        json.dump(cache, f, separators=(",", ":"))

    # 4) Indicadores ponderados por empresa
    def ventana(cik, a0, a1):
        rev = oi = gp = opex = 0.0
        perdidas = 0
        berry_ok = True
        for a in range(a0, a1 + 1):
            r, o = datos["rev"][a].get(cik), datos["oi"][a].get(cik)
            if r is None or o is None or r <= 0:
                return None
            rev += r; oi += o; perdidas += o < 0
            c = datos["cogs"][a].get(cik)
            if c is None:
                berry_ok = False
            else:
                gp += r - c; opex += (r - c) - o
        costos = rev - oi
        if costos <= 0:
            return None
        mo, mct = oi / rev, oi / costos
        if abs(mct) > 5:  # cifras inconsistentes
            return None
        berry = round(gp / opex, 4) if berry_ok and opex > 0 and 0 < gp / opex < 20 else None
        return [round(rev / (a1 - a0 + 1) / 1e6, 1), perdidas, round(mo, 4), round(mct, 4), berry]

    filas = []
    for cik in universo:
        info = cache.get(str(cik))
        if not info or not str(info.get("sic", "")).isdigit():
            continue
        if not BOLSAS.intersection(info.get("bolsa", [])):
            continue  # solo emisoras listadas en bolsa
        sic = int(info["sic"])
        if sic == 6770:  # empresas de propósito específico (SPAC)
            continue
        v = [ventana(cik, a0, a1) for a0, a1 in ventanas]
        if v[0] is None:
            continue
        filas.append([sic] + v)

    salida = {
        "generado": hoy.isoformat(),
        "fuente": "SEC EDGAR, frames XBRL (us-gaap, USD)",
        "ventanas": [f"{a0}-{a1}" for a0, a1 in ventanas],
        "campos": ["sic", "[ventas promedio USD mm, años con pérdida, MO, MCT, Berry]"],
        "empresas": filas,
    }
    with open(OUT, "w") as f:
        json.dump(salida, f, separators=(",", ":"))
    print("empresas", len(filas), "->", OUT, flush=True)
    if not filas:
        sys.exit("Sin datos: revisar acceso a la SEC")


if __name__ == "__main__":
    main()
