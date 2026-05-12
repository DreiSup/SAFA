/* global React, Icons, Spark, sparkPath, TopBar, AreaChart, Stat */

// ────────────────────────────────────────────────────────────────
// 5. MICRO — finanzas personales
// ────────────────────────────────────────────────────────────────
function MicroScreen() {
  const cats = [
    { name: "Vivienda",     spent: 980,  budget: 1100, color: "oklch(0.78 0.13 75)" },
    { name: "Comestibles",  spent: 412,  budget: 600,  color: "oklch(0.76 0.16 148)" },
    { name: "Transporte",   spent: 142,  budget: 200,  color: "oklch(0.7 0.15 220)" },
    { name: "Ocio",         spent: 218,  budget: 250,  color: "oklch(0.7 0.18 320)" },
    { name: "Suscripciones",spent: 87,   budget: 100,  color: "oklch(0.78 0.13 75)" },
  ];
  return (
    <>
      <TopBar
        breadcrumb="Micro · finanzas personales"
        title="Tu mes en abril"
        subtitle="Ingresos, gastos y presupuesto."
        right={<>
          <div className="tabs"><span className="tab">Mar</span><span className="tab active">Abr</span><span className="tab dim">May</span></div>
          <button className="btn btn-ghost"><span style={{width:14,height:14,display:"flex"}}>{Icons.plus}</span> Movimiento</button>
        </>}
      />
      <div style={{ padding: 32, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
        {/* Income vs expenses */}
        <div className="card" style={{ padding: 24, gridColumn: "span 2" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1.4fr", gap: 32, alignItems: "center" }}>
            <div>
              <div style={{ fontSize: 11, color: "var(--fg-3)", letterSpacing: "0.12em", textTransform: "uppercase" }}>Ingresos</div>
              <div className="mono tnum" style={{ fontSize: 36, fontWeight: 500, marginTop: 8, letterSpacing: "-0.02em" }}>€4,820</div>
              <div className="mono tnum pos" style={{ fontSize: 12, marginTop: 4 }}>+€100 vs marzo</div>
            </div>
            <div>
              <div style={{ fontSize: 11, color: "var(--fg-3)", letterSpacing: "0.12em", textTransform: "uppercase" }}>Gastos</div>
              <div className="mono tnum" style={{ fontSize: 36, fontWeight: 500, marginTop: 8, letterSpacing: "-0.02em" }}>€2,148</div>
              <div className="mono tnum pos" style={{ fontSize: 12, marginTop: 4 }}>−€312 vs marzo</div>
            </div>
            <div>
              <div style={{ fontSize: 11, color: "var(--fg-3)", letterSpacing: "0.12em", textTransform: "uppercase" }}>Ahorro neto</div>
              <div className="mono tnum" style={{ fontSize: 36, fontWeight: 500, marginTop: 8, letterSpacing: "-0.02em", color: "var(--accent)" }}>€2,672</div>
              <div className="mono tnum" style={{ fontSize: 12, marginTop: 4, color: "var(--fg-2)" }}>55.4% tasa de ahorro</div>
            </div>
            {/* stacked bar */}
            <div>
              <div style={{ fontSize: 11, color: "var(--fg-3)", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 12 }}>Distribución</div>
              <div style={{ display: "flex", height: 12, borderRadius: 99, overflow: "hidden" }}>
                <div style={{ flex: 980, background: "oklch(0.78 0.13 75)" }} />
                <div style={{ flex: 412, background: "oklch(0.76 0.16 148)" }} />
                <div style={{ flex: 142, background: "oklch(0.7 0.15 220)" }} />
                <div style={{ flex: 218, background: "oklch(0.7 0.18 320)" }} />
                <div style={{ flex: 396, background: "var(--bg-3)" }} />
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 14, marginTop: 12, fontSize: 11, color: "var(--fg-2)" }}>
                {cats.map(c => (
                  <span key={c.name} style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                    <span style={{ width: 8, height: 8, borderRadius: 2, background: c.color }} /> {c.name}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Trend chart */}
        <div className="card" style={{ padding: 22 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
            <div>
              <div style={{ fontSize: 13, fontWeight: 500 }}>Saldo neto · 30 días</div>
              <div className="mono tnum" style={{ fontSize: 22, fontWeight: 500, marginTop: 6 }}>€2,672 <span className="pos" style={{ fontSize: 12 }}>+€420</span></div>
            </div>
            <div className="tabs"><span className="tab">7D</span><span className="tab active">30D</span><span className="tab">90D</span></div>
          </div>
          <AreaChart seed={88} w={500} h={160} color="oklch(0.78 0.13 75)" trend={0.4} />
        </div>

        {/* Budgets */}
        <div className="card" style={{ padding: 22 }}>
          <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 18 }}>Presupuestos</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {cats.map(c => {
              const pct = Math.min(100, (c.spent / c.budget) * 100);
              const over = c.spent / c.budget > 0.85;
              return (
                <div key={c.name}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6, fontSize: 12 }}>
                    <span>{c.name}</span>
                    <span className="mono tnum" style={{ color: "var(--fg-2)" }}>€{c.spent} <span style={{ color: "var(--fg-3)" }}>/ €{c.budget}</span></span>
                  </div>
                  <div style={{ height: 4, background: "var(--bg-3)", borderRadius: 99, overflow: "hidden" }}>
                    <div style={{ width: pct + "%", height: "100%", background: over ? "var(--accent)" : c.color, transition: "width 200ms" }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Transactions */}
        <div className="card" style={{ gridColumn: "span 2" }}>
          <div style={{ padding: "16px 20px", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid var(--border)" }}>
            <div style={{ fontSize: 13, fontWeight: 500 }}>Movimientos · abril</div>
            <div style={{ display: "flex", gap: 10 }}>
              <button className="btn btn-ghost" style={{ height: 30, fontSize: 12 }}>Filtrar</button>
              <button className="btn btn-ghost" style={{ height: 30, fontSize: 12 }}>Exportar</button>
            </div>
          </div>
          <div style={{ padding: "8px 20px", fontSize: 10, color: "var(--fg-3)", letterSpacing: "0.16em", textTransform: "uppercase", display: "grid", gridTemplateColumns: "32px 1.4fr 1fr 0.8fr 0.6fr 0.8fr", gap: 12, borderBottom: "1px solid var(--border)" }}>
            <span></span><span>Concepto</span><span>Categoría</span><span>Cuenta</span><span>Fecha</span><span style={{ textAlign: "right" }}>Importe</span>
          </div>
          <div className="row-divider">
            {[
              { t: "Mercadona", c: "Comestibles", acct: "BBVA · 1234", a: "−€48.20", d: "29 abr" },
              { t: "Nómina · Acme S.A.", c: "Ingreso", acct: "BBVA · 1234", a: "+€3,420.00", d: "28 abr", tone: "pos" },
              { t: "Compra BTC", c: "Inversión", acct: "Kraken", a: "−€500.00", d: "28 abr" },
              { t: "Spotify", c: "Suscripción", acct: "Revolut", a: "−€10.99", d: "27 abr" },
              { t: "Repsol", c: "Transporte", acct: "Revolut", a: "−€62.40", d: "26 abr" },
              { t: "Alquiler · Calle Goya", c: "Vivienda", acct: "BBVA · 1234", a: "−€980.00", d: "25 abr" },
            ].map((r, i) => (
              <div key={i} style={{ padding: "13px 20px", display: "grid", gridTemplateColumns: "32px 1.4fr 1fr 0.8fr 0.6fr 0.8fr", gap: 12, alignItems: "center", fontSize: 13 }}>
                <div style={{ width: 26, height: 26, borderRadius: 7, background: "var(--bg-2)", border: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, color: "var(--fg-2)", fontWeight: 600 }}>{r.t.charAt(0)}</div>
                <div style={{ fontWeight: 500 }}>{r.t}</div>
                <div style={{ color: "var(--fg-2)" }}>{r.c}</div>
                <div className="mono" style={{ color: "var(--fg-3)", fontSize: 11 }}>{r.acct}</div>
                <div className="mono" style={{ color: "var(--fg-3)", fontSize: 11 }}>{r.d}</div>
                <div className={"mono tnum " + (r.tone || "")} style={{ textAlign: "right", fontWeight: 500 }}>{r.a}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

// ────────────────────────────────────────────────────────────────
// 6. MACRO — mercados
// ────────────────────────────────────────────────────────────────
function MacroScreen() {
  const holdings = [
    { sym: "BTC",  name: "Bitcoin",       price: "67,420.18",  ch: "+1.84%", tone: "pos", alloc: 38, qty: "0.847", val: "€57,113.20", seed: 7, trend: 0.5 },
    { sym: "SPY",  name: "S&P 500 ETF",   price: "528.91",     ch: "+0.42%", tone: "pos", alloc: 24, qty: "68.0",  val: "€35,966.00", seed: 12, trend: 0.3 },
    { sym: "ETH",  name: "Ethereum",      price: "3,142.50",   ch: "−0.94%", tone: "neg", alloc: 18, qty: "8.580", val: "€26,962.65", seed: 19, trend: -0.2 },
    { sym: "AAPL", name: "Apple Inc.",    price: "184.30",     ch: "+0.18%", tone: "pos", alloc: 12, qty: "65.0",  val: "€11,979.50", seed: 23, trend: 0.1 },
    { sym: "VWCE", name: "Vanguard FTSE", price: "118.42",     ch: "+0.08%", tone: "pos", alloc: 8,  qty: "60.0",  val: "€7,105.20",  seed: 31, trend: 0.2 },
  ];
  return (
    <>
      <TopBar
        breadcrumb="Macro · mercados e inversiones"
        title="Tu portafolio"
        subtitle="En vivo, sincronizado con cinco fuentes."
        right={<>
          <span className="badge"><span className="live-dot" />En vivo · 09:14</span>
          <button className="btn btn-ghost">Añadir activo</button>
        </>}
      />
      <div style={{ padding: 32, display: "grid", gridTemplateColumns: "1.6fr 1fr", gap: 24, alignContent: "start" }}>
        {/* Portfolio hero */}
        <div className="card" style={{ padding: 28 }}>
          <div style={{ fontSize: 11, color: "var(--fg-3)", letterSpacing: "0.16em", textTransform: "uppercase" }}>Valor del portafolio</div>
          <div className="mono tnum" style={{ fontSize: 64, fontWeight: 500, letterSpacing: "-0.03em", lineHeight: 1, marginTop: 10 }}>
            €139,126<span style={{ color: "var(--fg-3)" }}>.55</span>
          </div>
          <div style={{ marginTop: 12, display: "flex", alignItems: "center", gap: 14 }}>
            <span className="badge badge-pos mono tnum">▲ €1,892.30</span>
            <span className="pos mono tnum" style={{ fontSize: 13 }}>+1.38% (24h)</span>
            <span style={{ color: "var(--fg-3)", fontSize: 13 }}>desde apertura</span>
          </div>
          <div style={{ marginTop: 20 }}>
            <AreaChart seed={101} w={760} h={120} color="oklch(0.76 0.16 148)" trend={0.4} />
          </div>
        </div>

        {/* Sentiment */}
        <div className="card" style={{ padding: 22 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
            <div style={{ fontSize: 11, color: "var(--fg-3)", letterSpacing: "0.16em", textTransform: "uppercase" }}>Sentimiento agregado</div>
            <span style={{ fontSize: 11, color: "var(--fg-3)" }} className="mono">FinBERT · 24h</span>
          </div>
          <div style={{ fontSize: 38, fontWeight: 500, letterSpacing: "-0.02em" }}>Optimista</div>
          <div className="mono tnum" style={{ fontSize: 12, color: "var(--fg-2)", marginTop: 6 }}>+0.42 score · 1,284 noticias</div>

          {/* meter */}
          <div style={{ marginTop: 20 }}>
            <div style={{ height: 8, borderRadius: 99, overflow: "hidden", display: "flex" }}>
              <div style={{ flex: 28, background: "var(--neg)" }} />
              <div style={{ flex: 22, background: "var(--bg-3)" }} />
              <div style={{ flex: 50, background: "var(--pos)" }} />
            </div>
            <div className="mono" style={{ display: "flex", justifyContent: "space-between", marginTop: 8, fontSize: 10, color: "var(--fg-3)" }}>
              <span>NEG 28%</span><span>NEU 22%</span><span>POS 50%</span>
            </div>
          </div>

          <div style={{ marginTop: 18, fontSize: 12, color: "var(--fg-2)", lineHeight: 1.5 }}>
            Las noticias sobre <span style={{ color: "var(--fg)" }}>política monetaria de la Fed</span> y <span style={{ color: "var(--fg)" }}>resultados de Apple</span> están dominando el sentimiento de hoy.
          </div>
        </div>

        {/* Live tickers */}
        <div className="card" style={{ gridColumn: "span 2" }}>
          <div style={{ padding: "16px 20px", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid var(--border)" }}>
            <div style={{ fontSize: 13, fontWeight: 500 }}>Tickers en vivo</div>
            <span className="live-dot" />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", divider: 0 }}>
            {[
              { sym: "BTC", name: "Bitcoin · USD", price: "67,420.18", ch: "+1.84%", tone: "pos", seed: 7, trend: 0.6 },
              { sym: "SPX", name: "S&P 500", price: "5,318.42", ch: "+0.42%", tone: "pos", seed: 12, trend: 0.3 },
            ].map((t, i) => (
              <div key={i} style={{ padding: 22, borderRight: i === 0 ? "1px solid var(--border)" : "none", display: "flex", flexDirection: "column", gap: 14 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div>
                    <div className="mono" style={{ fontSize: 12, color: "var(--fg-3)", letterSpacing: "0.06em" }}>{t.sym} · {t.name}</div>
                    <div className="mono tnum" style={{ fontSize: 36, fontWeight: 500, letterSpacing: "-0.02em", marginTop: 6 }}>{t.price}</div>
                    <div className={"mono tnum " + t.tone} style={{ fontSize: 13, marginTop: 4 }}>{t.ch} · 24h</div>
                  </div>
                  <span className="badge"><span className="live-dot" />Live</span>
                </div>
                <Spark seed={t.seed} w={400} h={40} color={t.tone === "pos" ? "var(--pos)" : "var(--neg)"} trend={t.trend} fill />
              </div>
            ))}
          </div>
        </div>

        {/* Holdings */}
        <div className="card" style={{ gridColumn: "span 2" }}>
          <div style={{ padding: "16px 20px", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid var(--border)" }}>
            <div style={{ fontSize: 13, fontWeight: 500 }}>Posiciones</div>
            <div className="tabs"><span className="tab active">Todo</span><span className="tab">Cripto</span><span className="tab">ETFs</span><span className="tab">Acciones</span></div>
          </div>
          <div style={{ padding: "8px 20px", fontSize: 10, color: "var(--fg-3)", letterSpacing: "0.16em", textTransform: "uppercase", display: "grid", gridTemplateColumns: "1.2fr 1fr 1fr 1.2fr 0.8fr 1fr", gap: 12, borderBottom: "1px solid var(--border)" }}>
            <span>Activo</span><span>Precio</span><span>24h</span><span>30 días</span><span>Asignación</span><span style={{ textAlign: "right" }}>Valor</span>
          </div>
          <div className="row-divider">
            {holdings.map(h => (
              <div key={h.sym} style={{ padding: "14px 20px", display: "grid", gridTemplateColumns: "1.2fr 1fr 1fr 1.2fr 0.8fr 1fr", gap: 12, alignItems: "center" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ width: 32, height: 32, borderRadius: 8, background: "var(--bg-2)", border: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 600 }}>{h.sym.charAt(0)}</div>
                  <div>
                    <div className="mono" style={{ fontSize: 13, fontWeight: 500, letterSpacing: "0.04em" }}>{h.sym}</div>
                    <div style={{ fontSize: 11, color: "var(--fg-3)" }}>{h.name}</div>
                  </div>
                </div>
                <div className="mono tnum" style={{ fontSize: 13 }}>€{h.price}</div>
                <div className={"mono tnum " + h.tone} style={{ fontSize: 13 }}>{h.ch}</div>
                <Spark seed={h.seed} w={140} h={28} color={h.tone === "pos" ? "var(--pos)" : "var(--neg)"} trend={h.trend} />
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{ flex: 1, height: 4, background: "var(--bg-3)", borderRadius: 99, overflow: "hidden" }}>
                    <div style={{ width: h.alloc + "%", height: "100%", background: "var(--accent)" }} />
                  </div>
                  <span className="mono tnum" style={{ fontSize: 11, color: "var(--fg-2)", width: 32, textAlign: "right" }}>{h.alloc}%</span>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div className="mono tnum" style={{ fontSize: 13, fontWeight: 500 }}>{h.val}</div>
                  <div className="mono" style={{ fontSize: 11, color: "var(--fg-3)" }}>{h.qty} {h.sym}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

Object.assign(window, { MicroScreen, MacroScreen });
