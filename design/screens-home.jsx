/* global React, Icons, Spark, sparkPath, TopBar, AppShell */

// shared bits
function Stat({ label, value, delta, deltaTone = "muted", mono = true, big = false }) {
  return (
    <div>
      <div style={{ fontSize: 11, color: "var(--fg-3)", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 8 }}>{label}</div>
      <div className={mono ? "mono tnum" : "tnum"} style={{ fontSize: big ? 48 : 22, fontWeight: 500, letterSpacing: "-0.02em", color: "var(--fg)", lineHeight: 1.05 }}>{value}</div>
      {delta && (
        <div className={deltaTone === "pos" ? "pos mono tnum" : deltaTone === "neg" ? "neg mono tnum" : "muted mono tnum"} style={{ fontSize: 12, marginTop: 6 }}>
          {delta}
        </div>
      )}
    </div>
  );
}

// Area chart for net worth
function AreaChart({ seed = 11, w = 720, h = 220, color = "var(--accent)", points = 60, trend = 0.4 }) {
  const { line, area, last } = sparkPath(seed, w, h, points, trend);
  // y-axis ticks
  return (
    <svg width="100%" height={h} viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" style={{ display: "block" }}>
      <defs>
        <linearGradient id={`grad-${seed}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.24" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      {[0.25, 0.5, 0.75].map(t => (
        <line key={t} x1="0" x2={w} y1={h*t} y2={h*t} stroke="var(--border)" strokeDasharray="2 4" />
      ))}
      <path d={area} fill={`url(#grad-${seed})`} />
      <path d={line} fill="none" stroke={color} strokeWidth="1.5" />
      <circle cx={last[0]} cy={last[1]} r="3" fill={color} />
      <circle cx={last[0]} cy={last[1]} r="6" fill={color} opacity="0.2" />
    </svg>
  );
}

// ────────────────────────────────────────────────────────────────
// 4. HOME
// ────────────────────────────────────────────────────────────────
function HomeScreen() {
  return (
    <>
      <TopBar
        breadcrumb="Inicio · 29 abr 2026"
        title="Buenos días, Mateo."
        subtitle="Tu mañana en una pasada."
        right={<>
          <button className="btn btn-ghost"><span style={{ width: 14, height: 14, display: "flex" }}>{Icons.bell}</span></button>
          <button className="btn btn-ghost">Sincronizar</button>
        </>}
      />

      <div style={{ padding: 32, display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 24, alignContent: "start" }}>
        {/* LEFT column */}
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          {/* net worth hero */}
          <div className="card" style={{ padding: 28 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
              <div style={{ fontSize: 11, color: "var(--fg-3)", letterSpacing: "0.16em", textTransform: "uppercase" }}>Patrimonio neto</div>
              <div className="tabs">
                <span className="tab">1S</span><span className="tab">1M</span><span className="tab active">3M</span><span className="tab">1A</span><span className="tab">Todo</span>
              </div>
            </div>
            <div className="mono tnum" style={{ fontSize: 64, fontWeight: 500, letterSpacing: "-0.03em", lineHeight: 1, color: "var(--fg)" }}>
              €148,302<span style={{ color: "var(--fg-3)" }}>.41</span>
            </div>
            <div style={{ marginTop: 12, display: "flex", alignItems: "center", gap: 14 }}>
              <span className="badge badge-pos mono tnum">▲ €4,218.10</span>
              <span className="pos mono tnum" style={{ fontSize: 13 }}>+2.92%</span>
              <span style={{ color: "var(--fg-3)", fontSize: 13 }}>en los últimos 30 días</span>
            </div>

            <div style={{ marginTop: 20 }}>
              <AreaChart seed={42} w={760} h={140} color="oklch(0.78 0.13 75)" trend={0.45} />
              <div className="mono" style={{ display: "flex", justifyContent: "space-between", color: "var(--fg-3)", fontSize: 10, letterSpacing: "0.1em", marginTop: 8 }}>
                <span>30 ENE</span><span>15 FEB</span><span>1 MAR</span><span>15 MAR</span><span>1 ABR</span><span>HOY</span>
              </div>
            </div>
          </div>

          {/* key stats row */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24, padding: "20px 4px" }}>
            <Stat label="Líquido" value="€38,420.00" delta="+€1,200 mes" deltaTone="pos" />
            <div style={{ borderLeft: "1px solid var(--border)", paddingLeft: 24 }}>
              <Stat label="Invertido" value="€102,980.41" delta="+2.4% (24h)" deltaTone="pos" />
            </div>
            <div style={{ borderLeft: "1px solid var(--border)", paddingLeft: 24 }}>
              <Stat label="Deuda" value="€6,902.00" delta="−€450 mes" deltaTone="pos" />
            </div>
          </div>

          {/* recent transactions */}
          <div className="card">
            <div style={{ padding: "16px 20px", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid var(--border)" }}>
              <div style={{ fontSize: 13, fontWeight: 500 }}>Movimientos recientes</div>
              <a className="btn btn-link" style={{ fontSize: 12 }}>Ver todo →</a>
            </div>
            <div className="row-divider">
              {[
                { t: "Mercadona", c: "Comestibles", a: "−€48.20", d: "Hoy · 09:12", tone: "" },
                { t: "Nómina · Acme S.A.", c: "Ingreso", a: "+€3,420.00", d: "Ayer", tone: "pos" },
                { t: "Compra BTC", c: "Inversión", a: "−€500.00", d: "Ayer", tone: "" },
                { t: "Spotify", c: "Suscripción", a: "−€10.99", d: "27 abr", tone: "" },
              ].map((r, i) => (
                <div key={i} style={{ padding: "14px 20px", display: "flex", alignItems: "center", gap: 14 }}>
                  <div style={{ width: 28, height: 28, borderRadius: 8, background: "var(--bg-2)", border: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, color: "var(--fg-2)", fontWeight: 600 }}>
                    {r.t.charAt(0)}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 500 }}>{r.t}</div>
                    <div style={{ fontSize: 11, color: "var(--fg-3)" }}>{r.c} · {r.d}</div>
                  </div>
                  <div className={`mono tnum ${r.tone}`} style={{ fontSize: 14, fontWeight: 500 }}>{r.a}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT column */}
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          {/* audio report card */}
          <div className="card" style={{ padding: 22, position: "relative", overflow: "hidden" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
              <div>
                <div style={{ fontSize: 10, letterSpacing: "0.16em", color: "var(--accent)", textTransform: "uppercase", fontWeight: 600 }}>Reporte de hoy</div>
                <div style={{ fontSize: 11, color: "var(--fg-3)", marginTop: 4 }} className="mono">29 · 04 · 2026 — 06:00 CET</div>
              </div>
              <span className="badge"><span className="live-dot" />Nuevo</span>
            </div>
            <div style={{ fontSize: 17, lineHeight: 1.35, fontWeight: 500, letterSpacing: "-0.01em", marginBottom: 16 }}>
              "Tu cartera abre con un <span className="pos">+1.2%</span>, impulsada por BTC. Tus gastos van <span style={{ color: "var(--accent)" }}>14% bajo presupuesto</span>."
            </div>
            <Waveform2 />
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 14 }}>
              <button className="btn btn-accent" style={{ width: 40, height: 40, padding: 0, borderRadius: 99 }}>{Icons.play}</button>
              <div className="mono tnum" style={{ flex: 1, fontSize: 12, color: "var(--fg-2)" }}>00:00 / 05:08</div>
              <button className="btn btn-ghost" style={{ height: 32, padding: "0 10px", fontSize: 12 }}>Transcripción</button>
            </div>
          </div>

          {/* top movers */}
          <div className="card">
            <div style={{ padding: "16px 20px", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid var(--border)" }}>
              <div style={{ fontSize: 13, fontWeight: 500 }}>Mercados <span style={{ color: "var(--fg-3)", fontWeight: 400, fontSize: 12 }}>en vivo</span></div>
              <span className="live-dot" />
            </div>
            <div className="row-divider">
              {[
                { t: "BTC",   n: "Bitcoin",      p: "67,420.18", d: "+1.84%", tone: "pos", seed: 7,  trend: 0.6 },
                { t: "SPY",   n: "S&P 500 ETF",  p: "528.91",    d: "+0.42%", tone: "pos", seed: 12, trend: 0.3 },
                { t: "ETH",   n: "Ethereum",     p: "3,142.50",  d: "−0.94%", tone: "neg", seed: 19, trend: -0.2 },
                { t: "AAPL",  n: "Apple Inc.",   p: "184.30",    d: "+0.18%", tone: "pos", seed: 23, trend: 0.1 },
              ].map((row, i) => (
                <div key={i} style={{ padding: "14px 20px", display: "grid", gridTemplateColumns: "1fr 90px 90px", gap: 14, alignItems: "center" }}>
                  <div>
                    <div className="mono" style={{ fontSize: 13, fontWeight: 500, letterSpacing: "0.04em" }}>{row.t}</div>
                    <div style={{ fontSize: 11, color: "var(--fg-3)" }}>{row.n}</div>
                  </div>
                  <Spark seed={row.seed} w={90} h={26} color={row.tone === "pos" ? "var(--pos)" : "var(--neg)"} trend={row.trend} />
                  <div style={{ textAlign: "right" }}>
                    <div className="mono tnum" style={{ fontSize: 13 }}>{row.p}</div>
                    <div className={"mono tnum " + row.tone} style={{ fontSize: 11 }}>{row.d}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* macro sentiment */}
          <div className="card" style={{ padding: 18 }}>
            <div style={{ fontSize: 11, color: "var(--fg-3)", letterSpacing: "0.16em", textTransform: "uppercase", marginBottom: 14 }}>Sentimiento del mercado</div>
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", height: 6, borderRadius: 99, overflow: "hidden" }}>
                  <div style={{ flex: 28, background: "var(--neg)" }} />
                  <div style={{ flex: 22, background: "var(--bg-3)" }} />
                  <div style={{ flex: 50, background: "var(--pos)" }} />
                </div>
                <div className="mono" style={{ display: "flex", justifyContent: "space-between", marginTop: 8, fontSize: 10, color: "var(--fg-3)" }}>
                  <span>NEG 28%</span><span>NEU 22%</span><span>POS 50%</span>
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div className="badge badge-pos">Optimista</div>
                <div className="mono tnum" style={{ fontSize: 11, color: "var(--fg-3)", marginTop: 6 }}>1,284 noticias</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function Waveform2({ bars = 50 }) {
  const heights = Array.from({ length: bars }, (_, i) => {
    const t = i / bars;
    const env = Math.sin(t * Math.PI) * 0.6 + 0.3;
    const noise = ((Math.sin(i * 1.7) + 1) / 2) * 0.7 + 0.3;
    return env * noise;
  });
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 2, height: 28 }}>
      {heights.map((h, i) => (
        <div key={i} style={{ flex: 1, height: Math.max(2, h * 28), background: i < bars * 0.22 ? "var(--accent)" : "var(--bg-3)", borderRadius: 1 }} />
      ))}
    </div>
  );
}

Object.assign(window, { HomeScreen, AreaChart, Stat, Waveform2 });
