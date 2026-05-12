/* global React, Icons, Spark, sparkPath, TopBar, AreaChart, Waveform2 */

// ────────────────────────────────────────────────────────────────
// 7. CHART — gráfica universal (candlesticks)
// ────────────────────────────────────────────────────────────────
function Candles({ seed = 5, w = 1000, h = 320, count = 80, trend = 0.4 }) {
  let s = seed;
  const r = () => { s = (s * 9301 + 49297) % 233280; return s / 233280; };
  let price = 60000;
  const candles = [];
  for (let i = 0; i < count; i++) {
    const drift = (r() - 0.5) * 1200 + trend * 80;
    const open = price;
    const close = price + drift;
    const high = Math.max(open, close) + r() * 700;
    const low  = Math.min(open, close) - r() * 700;
    candles.push({ open, close, high, low });
    price = close;
  }
  const min = Math.min(...candles.map(c => c.low));
  const max = Math.max(...candles.map(c => c.high));
  const pad = (max - min) * 0.05;
  const yMin = min - pad, yMax = max + pad;
  const yScale = v => h - ((v - yMin) / (yMax - yMin)) * h;
  const cw = w / count;
  const bw = cw * 0.62;

  return (
    <svg width="100%" height={h} viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" style={{ display: "block" }}>
      {[0.2, 0.4, 0.6, 0.8].map(t => (
        <line key={t} x1="0" x2={w} y1={h*t} y2={h*t} stroke="var(--border)" strokeDasharray="2 4" />
      ))}
      {candles.map((c, i) => {
        const x = i * cw + cw / 2;
        const up = c.close >= c.open;
        const color = up ? "var(--pos)" : "var(--neg)";
        const yO = yScale(c.open), yC = yScale(c.close), yH = yScale(c.high), yL = yScale(c.low);
        return (
          <g key={i}>
            <line x1={x} x2={x} y1={yH} y2={yL} stroke={color} strokeWidth="1" opacity="0.85" />
            <rect x={x - bw/2} y={Math.min(yO, yC)} width={bw} height={Math.max(2, Math.abs(yC - yO))} fill={color} />
          </g>
        );
      })}
    </svg>
  );
}

function ChartScreen() {
  return (
    <>
      <TopBar
        breadcrumb="Gráficas"
        title="BTC / USD"
        subtitle="Bitcoin · 1d · Coinbase"
        right={<>
          <span className="badge"><span className="live-dot" />En vivo</span>
          <button className="btn btn-ghost">Añadir a favoritos</button>
          <button className="btn btn-ghost">Comparar</button>
        </>}
      />
      <div style={{ padding: 32, display: "flex", flexDirection: "column", gap: 24 }}>
        {/* search bar */}
        <div className="card" style={{ padding: "12px 16px", display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ width: 16, height: 16, color: "var(--fg-3)", display: "flex" }}>{Icons.search}</span>
          <input className="input" style={{ background: "transparent", border: "none", height: 24, padding: 0, fontSize: 14 }}
                 placeholder="Busca cualquier activo — BTC, SPY, AAPL, ETH..." defaultValue="BTC" />
          <div style={{ display: "flex", gap: 6 }}>
            {["BTC","SPY","AAPL","ETH"].map((s,i) => (
              <span key={s} className="badge" style={{ borderColor: i===0 ? "var(--accent)" : "var(--border-strong)", color: i===0 ? "var(--accent)" : "var(--fg-2)" }}>{s}</span>
            ))}
          </div>
        </div>

        {/* price + interval */}
        <div className="card" style={{ padding: 24 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 18 }}>
            <div>
              <div className="mono" style={{ fontSize: 12, color: "var(--fg-3)", letterSpacing: "0.08em" }}>BTC · USD</div>
              <div className="mono tnum" style={{ fontSize: 56, fontWeight: 500, letterSpacing: "-0.03em", marginTop: 4, lineHeight: 1 }}>67,420.18</div>
              <div style={{ marginTop: 8, display: "flex", alignItems: "center", gap: 12 }}>
                <span className="badge badge-pos mono tnum">▲ 1,218.30</span>
                <span className="pos mono tnum">+1.84%</span>
                <span style={{ fontSize: 12, color: "var(--fg-3)" }}>24h</span>
              </div>
            </div>
            <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
              <div className="tabs">
                <span className="tab">1m</span><span className="tab">5m</span><span className="tab">1h</span>
                <span className="tab active">1d</span><span className="tab">1S</span><span className="tab">1M</span>
              </div>
              <div className="tabs">
                <span className="tab active">Velas</span><span className="tab">Línea</span><span className="tab">Área</span>
              </div>
            </div>
          </div>

          {/* candlestick chart */}
          <div style={{ position: "relative" }}>
            <Candles seed={11} w={1140} h={340} count={90} trend={0.5} />
            {/* y-axis labels */}
            <div className="mono" style={{ position: "absolute", right: 0, top: 0, height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", paddingTop: 4, paddingBottom: 4, fontSize: 10, color: "var(--fg-3)" }}>
              <span>72,000</span><span>68,000</span><span>64,000</span><span>60,000</span><span>56,000</span>
            </div>
          </div>
          {/* x-axis */}
          <div className="mono" style={{ display: "flex", justifyContent: "space-between", color: "var(--fg-3)", fontSize: 10, marginTop: 12, letterSpacing: "0.08em" }}>
            <span>30 ENE</span><span>15 FEB</span><span>1 MAR</span><span>15 MAR</span><span>1 ABR</span><span>15 ABR</span><span>HOY</span>
          </div>
        </div>

        {/* OHLC stats */}
        <div className="card" style={{ padding: "20px 24px", display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 24 }}>
          {[
            { l: "APERTURA", v: "66,202.00" },
            { l: "MÁXIMO",   v: "67,890.50", tone: "pos" },
            { l: "MÍNIMO",   v: "65,940.10", tone: "neg" },
            { l: "CIERRE",   v: "67,420.18" },
            { l: "VOLUMEN",  v: "28.4B"  },
            { l: "CAP. MERCADO", v: "1.32T" },
          ].map((s, i) => (
            <div key={i} style={{ borderLeft: i ? "1px solid var(--border)" : "none", paddingLeft: i ? 24 : 0 }}>
              <div style={{ fontSize: 10, color: "var(--fg-3)", letterSpacing: "0.16em", marginBottom: 8 }}>{s.l}</div>
              <div className={"mono tnum " + (s.tone || "")} style={{ fontSize: 18, fontWeight: 500 }}>{s.v}</div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

// ────────────────────────────────────────────────────────────────
// 8. COMPARE — comparar inversiones
// ────────────────────────────────────────────────────────────────
function CompareScreen() {
  const assets = [
    { sym: "BTC",  name: "Bitcoin",       color: "oklch(0.78 0.13 75)",  ret: "+18.4%", abs: "+€8,920", alloc: "38%", on: true,  seed: 7,  trend: 0.6 },
    { sym: "SPY",  name: "S&P 500 ETF",   color: "oklch(0.76 0.16 148)", ret: "+6.2%",  abs: "+€2,100", alloc: "24%", on: true,  seed: 12, trend: 0.3 },
    { sym: "ETH",  name: "Ethereum",      color: "oklch(0.7 0.15 220)",  ret: "−3.1%",  abs: "−€840",   alloc: "18%", on: true,  seed: 19, trend: -0.2 },
    { sym: "AAPL", name: "Apple Inc.",    color: "oklch(0.7 0.18 320)",  ret: "+2.4%",  abs: "+€280",   alloc: "12%", on: true,  seed: 23, trend: 0.1 },
    { sym: "VWCE", name: "Vanguard FTSE", color: "oklch(0.74 0.10 260)", ret: "+4.8%",  abs: "+€330",   alloc: "8%",  on: false, seed: 31, trend: 0.2 },
  ];
  return (
    <>
      <TopBar
        breadcrumb="Comparar"
        title="Comparar inversiones"
        subtitle="Rendimiento en los últimos 12 meses."
        right={<>
          <div className="tabs"><span className="tab active">Patrimonio total</span><span className="tab">Por activo</span></div>
          <button className="btn btn-ghost">Exportar CSV</button>
        </>}
      />
      <div style={{ padding: 32, display: "flex", flexDirection: "column", gap: 24 }}>
        <div className="card" style={{ padding: 24 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 18 }}>
            <div>
              <div style={{ fontSize: 11, color: "var(--fg-3)", letterSpacing: "0.16em", textTransform: "uppercase" }}>Rendimiento total</div>
              <div className="mono tnum" style={{ fontSize: 48, fontWeight: 500, letterSpacing: "-0.02em", marginTop: 6, lineHeight: 1 }}>+€10,790</div>
              <div className="pos mono tnum" style={{ fontSize: 14, marginTop: 8 }}>+12.8% YTD · vs benchmark <span style={{ color: "var(--fg-2)" }}>+6.2%</span></div>
            </div>
            <div className="tabs">
              <span className="tab">3M</span><span className="tab">6M</span><span className="tab active">12M</span><span className="tab">YTD</span><span className="tab">Todo</span>
            </div>
          </div>

          {/* multi-line chart */}
          <div style={{ position: "relative" }}>
            <svg width="100%" height={300} viewBox="0 0 1100 300" preserveAspectRatio="none" style={{ display: "block" }}>
              {[0.2, 0.4, 0.6, 0.8].map(t => (
                <line key={t} x1="0" x2="1100" y1={300*t} y2={300*t} stroke="var(--border)" strokeDasharray="2 4" />
              ))}
              {assets.filter(a => a.on).map(a => {
                const { line } = sparkPath(a.seed, 1100, 300, 60, a.trend);
                return <path key={a.sym} d={line} fill="none" stroke={a.color} strokeWidth="1.6" />;
              })}
            </svg>
            {/* legend in chart */}
            <div style={{ position: "absolute", top: 12, left: 12, display: "flex", flexDirection: "column", gap: 6, padding: 12, background: "var(--bg-1)", border: "1px solid var(--border)", borderRadius: 8 }}>
              {assets.filter(a => a.on).map(a => (
                <div key={a.sym} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 11 }}>
                  <span style={{ width: 10, height: 2, background: a.color, borderRadius: 99 }} />
                  <span className="mono" style={{ width: 36 }}>{a.sym}</span>
                  <span className="mono tnum" style={{ color: "var(--fg-2)" }}>{a.ret}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="mono" style={{ display: "flex", justifyContent: "space-between", color: "var(--fg-3)", fontSize: 10, marginTop: 12, letterSpacing: "0.08em" }}>
            <span>MAY 25</span><span>JUL 25</span><span>SEP 25</span><span>NOV 25</span><span>ENE 26</span><span>MAR 26</span><span>HOY</span>
          </div>
        </div>

        {/* asset selector + table */}
        <div className="card">
          <div style={{ padding: "16px 20px", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid var(--border)" }}>
            <div style={{ fontSize: 13, fontWeight: 500 }}>Activos comparados</div>
            <button className="btn btn-link" style={{ fontSize: 12 }}>Seleccionar todo</button>
          </div>
          <div style={{ padding: "8px 20px", fontSize: 10, color: "var(--fg-3)", letterSpacing: "0.16em", textTransform: "uppercase", display: "grid", gridTemplateColumns: "32px 1.6fr 1fr 1fr 1fr 0.8fr", gap: 12, borderBottom: "1px solid var(--border)" }}>
            <span></span><span>Activo</span><span>Retorno</span><span>Absoluto</span><span>Asignación</span><span style={{ textAlign: "right" }}>12 meses</span>
          </div>
          <div className="row-divider">
            {assets.map(a => {
              const tone = a.ret.startsWith("+") ? "pos" : "neg";
              return (
                <div key={a.sym} style={{ padding: "13px 20px", display: "grid", gridTemplateColumns: "32px 1.6fr 1fr 1fr 1fr 0.8fr", gap: 12, alignItems: "center" }}>
                  <div style={{
                    width: 18, height: 18, borderRadius: 5,
                    border: "1.5px solid " + (a.on ? a.color : "var(--border-strong)"),
                    background: a.on ? a.color : "transparent",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    color: a.on ? "#000" : "transparent",
                  }}>{a.on && Icons.check}</div>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <span style={{ width: 8, height: 8, borderRadius: 99, background: a.color }} />
                    <div>
                      <div className="mono" style={{ fontSize: 13, fontWeight: 500, letterSpacing: "0.04em" }}>{a.sym}</div>
                      <div style={{ fontSize: 11, color: "var(--fg-3)" }}>{a.name}</div>
                    </div>
                  </div>
                  <div className={"mono tnum " + tone} style={{ fontSize: 14, fontWeight: 500 }}>{a.ret}</div>
                  <div className={"mono tnum " + tone} style={{ fontSize: 13 }}>{a.abs}</div>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ width: 80, height: 4, background: "var(--bg-3)", borderRadius: 99, overflow: "hidden" }}>
                      <div style={{ width: a.alloc, height: "100%", background: a.color }} />
                    </div>
                    <span className="mono tnum" style={{ fontSize: 11, color: "var(--fg-2)" }}>{a.alloc}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "flex-end" }}>
                    <Spark seed={a.seed} w={120} h={28} color={a.color} trend={a.trend} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}

// ────────────────────────────────────────────────────────────────
// 9. AUDIO REPORT — full screen
// ────────────────────────────────────────────────────────────────
function AudioScreen() {
  return (
    <>
      <TopBar
        breadcrumb="Reporte de audio · Episodio 142"
        title="Tu cartera se mueve con el BTC hoy"
        subtitle="Generado a las 06:00 CET · Ricardo (voz IA)"
        right={<>
          <button className="btn btn-ghost">Compartir</button>
          <button className="btn btn-ghost">Descargar</button>
          <button className="btn btn-ghost">Histórico</button>
        </>}
      />
      <div style={{ padding: 32, display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 24, alignContent: "start" }}>
        {/* Left: player */}
        <div className="card" style={{ padding: 32, display: "flex", flexDirection: "column", gap: 24 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div className="mono" style={{ fontSize: 11, letterSpacing: "0.16em", color: "var(--accent)", fontWeight: 600 }}>EPISODIO 142 · 29 ABR 2026</div>
            <span className="badge"><span className="live-dot" />Recién publicado</span>
          </div>

          {/* full waveform */}
          <BigWaveform />

          {/* progress */}
          <div>
            <div style={{ height: 4, background: "var(--bg-3)", borderRadius: 99, position: "relative" }}>
              <div style={{ position: "absolute", left: 0, top: 0, height: "100%", width: "32%", background: "var(--accent)", borderRadius: 99 }} />
              <div style={{ position: "absolute", left: "32%", top: "50%", transform: "translate(-50%, -50%)", width: 12, height: 12, borderRadius: 99, background: "var(--accent)", border: "2px solid var(--bg-1)" }} />
            </div>
            <div className="mono tnum" style={{ display: "flex", justifyContent: "space-between", marginTop: 8, fontSize: 11, color: "var(--fg-3)" }}>
              <span>01:38</span>
              <span>05:08</span>
            </div>
          </div>

          {/* controls */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 24 }}>
            <button className="btn btn-ghost" style={{ width: 44, height: 44, padding: 0, borderRadius: 99, fontSize: 12 }}>−15</button>
            <button className="btn btn-accent" style={{ width: 64, height: 64, padding: 0, borderRadius: 99 }}>{Icons.pause}</button>
            <button className="btn btn-ghost" style={{ width: 44, height: 44, padding: 0, borderRadius: 99, fontSize: 12 }}>+15</button>
            <div style={{ width: 1, height: 28, background: "var(--border)" }} />
            <button className="btn btn-ghost" style={{ height: 36, padding: "0 14px", fontSize: 12 }}>1.0×</button>
            <button className="btn btn-ghost" style={{ width: 36, height: 36, padding: 0 }}><span style={{ width: 14, height: 14, display: "flex" }}>{Icons.speaker}</span></button>
          </div>

          {/* connected data points */}
          <div style={{ borderTop: "1px solid var(--border)", paddingTop: 24, display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
            <DataPoint label="BTC HOY" value="+1.84%" tone="pos" sub="67,420 USD" />
            <DataPoint label="S&P 500" value="+0.42%" tone="pos" sub="5,318.42" />
            <DataPoint label="SENTIMIENTO" value="Optimista" tone="accent" sub="+0.42 score" />
          </div>
        </div>

        {/* Right: transcript */}
        <div className="card" style={{ padding: 24, display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ fontSize: 13, fontWeight: 500 }}>Transcripción</div>
            <div className="tabs"><span className="tab active">ES</span><span className="tab dim">EN</span></div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 18, fontSize: 13.5, lineHeight: 1.65, color: "var(--fg-1)" }}>
            <Para time="00:00" active>
              Buenos días, Mateo. Son las seis de la mañana del <em>veintinueve de abril</em>. Tu cartera abre con un <span className="pos">+1.2%</span>, impulsada principalmente por el movimiento del Bitcoin durante la noche.
            </Para>
            <Para time="00:32" active>
              El BTC subió un <span className="pos">+1.84%</span> en las últimas veinticuatro horas, hasta los 67,420 dólares — y como representa el <span style={{ color: "var(--accent)" }}>38% de tu cartera</span>, ése es el motor del alza de hoy.
            </Para>
            <Para time="01:14">
              En el lado macro, el S&P 500 también abre verde tras los resultados de Apple. El sentimiento agregado de las noticias de hoy es optimista, con un score FinBERT de +0.42.
            </Para>
            <Para time="01:48">
              En tus finanzas personales, abril cierra con buenas noticias: tus gastos van un 14% bajo presupuesto, y tu tasa de ahorro mensual es del 55%, por encima de tu objetivo del 40%.
            </Para>
            <Para time="02:30" muted>
              Una nota: tu suscripción de Spotify se renueva mañana. Y por último — el oro mantiene los 2,341 dólares...
            </Para>
          </div>
        </div>
      </div>
    </>
  );
}

function BigWaveform({ bars = 90 }) {
  const heights = Array.from({ length: bars }, (_, i) => {
    const t = i / bars;
    const env = Math.sin(t * Math.PI) * 0.55 + 0.35;
    const noise = ((Math.sin(i * 1.7) + Math.cos(i * 0.9) + 2) / 4) * 0.6 + 0.4;
    return env * noise;
  });
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 3, height: 96 }}>
      {heights.map((h, i) => (
        <div key={i} style={{
          flex: 1, height: Math.max(3, h * 96),
          background: i < bars * 0.32 ? "var(--accent)" : "var(--bg-3)",
          borderRadius: 1.5,
        }} />
      ))}
    </div>
  );
}

function Para({ time, active, muted, children }) {
  return (
    <div style={{ display: "flex", gap: 14, opacity: muted ? 0.45 : 1 }}>
      <div className="mono" style={{ fontSize: 11, color: active ? "var(--accent)" : "var(--fg-3)", paddingTop: 4, width: 44, flexShrink: 0, letterSpacing: "0.04em" }}>{time}</div>
      <div style={{ flex: 1, color: active ? "var(--fg)" : "var(--fg-2)" }}>{children}</div>
    </div>
  );
}

function DataPoint({ label, value, tone, sub }) {
  const cls = tone === "pos" ? "pos" : tone === "neg" ? "neg" : tone === "accent" ? "" : "";
  const color = tone === "accent" ? "var(--accent)" : undefined;
  return (
    <div>
      <div style={{ fontSize: 10, color: "var(--fg-3)", letterSpacing: "0.16em", marginBottom: 6 }}>{label}</div>
      <div className={"mono tnum " + cls} style={{ fontSize: 22, fontWeight: 500, color, letterSpacing: "-0.01em" }}>{value}</div>
      <div className="mono" style={{ fontSize: 11, color: "var(--fg-3)", marginTop: 2 }}>{sub}</div>
    </div>
  );
}

// ────────────────────────────────────────────────────────────────
// 10. PROFILE
// ────────────────────────────────────────────────────────────────
function ProfileScreen() {
  return (
    <>
      <TopBar
        breadcrumb="Perfil"
        title="Configuración"
        subtitle="Tu cuenta y preferencias."
      />
      <div style={{ padding: 32, display: "grid", gridTemplateColumns: "240px 1fr", gap: 32, alignContent: "start" }}>
        {/* left rail */}
        <nav style={{ display: "flex", flexDirection: "column", gap: 4, position: "sticky", top: 32 }}>
          {[
            { l: "Cuenta",        active: true },
            { l: "Preferencias" },
            { l: "Cuentas conectadas" },
            { l: "Notificaciones" },
            { l: "Seguridad" },
            { l: "Plan y facturación" },
            { l: "Zona de peligro", danger: true },
          ].map((i, k) => (
            <a key={k} style={{
              padding: "9px 12px", borderRadius: 8, fontSize: 13,
              color: i.active ? "var(--fg)" : i.danger ? "var(--neg)" : "var(--fg-2)",
              background: i.active ? "var(--bg-2)" : "transparent",
              cursor: "pointer",
            }}>{i.l}</a>
          ))}
        </nav>

        <div style={{ display: "flex", flexDirection: "column", gap: 24, maxWidth: 720 }}>
          {/* avatar */}
          <div className="card" style={{ padding: 24, display: "flex", alignItems: "center", gap: 20 }}>
            <div style={{ width: 64, height: 64, borderRadius: 99, background: "var(--bg-3)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, fontWeight: 600, border: "1px solid var(--border-strong)" }}>MR</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 17, fontWeight: 500 }}>Mateo Ruiz</div>
              <div style={{ fontSize: 13, color: "var(--fg-2)" }}>mateo@safa.app</div>
              <div style={{ fontSize: 11, color: "var(--fg-3)", marginTop: 4 }}>Miembro desde febrero 2025 · Plan Pro</div>
            </div>
            <button className="btn btn-ghost">Cambiar foto</button>
          </div>

          {/* details */}
          <Section title="Detalles de la cuenta">
            <Field label="Nombre" value="Mateo Ruiz" />
            <Field label="Correo" value="mateo@safa.app" />
            <Field label="Teléfono" value="+34 612 ··· 482" />
          </Section>

          {/* preferences */}
          <Section title="Preferencias" subtitle="Cambia el aspecto y el idioma de SAFA.">
            <ToggleRow
              label="Idioma"
              hint="El reporte y la interfaz."
              left={{ label: "Español", icon: Icons.globe, active: true }}
              right={{ label: "English", icon: Icons.globe, soon: true }}
            />
            <ToggleRow
              label="Tema"
              hint="Disponible para escritorio."
              left={{ label: "Oscuro", icon: Icons.moon, active: true }}
              right={{ label: "Claro", icon: Icons.sun, soon: true }}
            />
          </Section>

          {/* connected accounts */}
          <Section title="Cuentas conectadas" subtitle="SAFA lee solo lectura. Nunca movemos tu dinero.">
            <ConnRow name="BBVA" sub="Cuenta corriente · ··1234" status="ok" />
            <ConnRow name="Revolut" sub="Cuenta personal · EUR" status="ok" />
            <ConnRow name="Kraken" sub="API · trading habilitado" status="ok" />
            <ConnRow name="Interactive Brokers" sub="Sin conectar" status="off" />
          </Section>

          {/* danger */}
          <div className="card" style={{ padding: 24, borderColor: "oklch(0.66 0.20 25 / 0.4)" }}>
            <div style={{ fontSize: 13, fontWeight: 500, color: "var(--neg)", letterSpacing: "0.02em" }}>Zona de peligro</div>
            <div style={{ marginTop: 16, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ fontSize: 14, fontWeight: 500 }}>Eliminar cuenta</div>
                <div style={{ fontSize: 12, color: "var(--fg-2)", marginTop: 4 }}>Borra todos tus datos, transacciones, y reportes. Esta acción no se puede deshacer.</div>
              </div>
              <button className="btn" style={{ background: "transparent", color: "var(--neg)", border: "1px solid oklch(0.66 0.20 25 / 0.4)" }}>{Icons.trash} Eliminar</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function Section({ title, subtitle, children }) {
  return (
    <div className="card">
      <div style={{ padding: "18px 22px", borderBottom: "1px solid var(--border)" }}>
        <div style={{ fontSize: 13, fontWeight: 500 }}>{title}</div>
        {subtitle && <div style={{ fontSize: 12, color: "var(--fg-2)", marginTop: 4 }}>{subtitle}</div>}
      </div>
      <div className="row-divider">{children}</div>
    </div>
  );
}
function Field({ label, value }) {
  return (
    <div style={{ padding: "14px 22px", display: "grid", gridTemplateColumns: "180px 1fr auto", gap: 16, alignItems: "center" }}>
      <div style={{ fontSize: 12, color: "var(--fg-2)" }}>{label}</div>
      <div style={{ fontSize: 14 }}>{value}</div>
      <button className="btn btn-link" style={{ fontSize: 12 }}>Editar</button>
    </div>
  );
}
function ToggleRow({ label, hint, left, right }) {
  const Cell = ({ o }) => (
    <div style={{
      flex: 1,
      padding: "12px 14px",
      borderRadius: 8,
      border: "1px solid " + (o.active ? "var(--accent)" : "var(--border)"),
      background: o.active ? "var(--accent-dim)" : "var(--bg-2)",
      display: "flex", alignItems: "center", gap: 10,
      opacity: o.soon ? 0.5 : 1,
      cursor: o.soon ? "not-allowed" : "pointer",
      position: "relative",
    }}>
      <span style={{ width: 14, height: 14, display: "flex", color: o.active ? "var(--accent)" : "var(--fg-2)" }}>{o.icon}</span>
      <span style={{ fontSize: 13, color: o.active ? "var(--accent)" : "var(--fg-1)", fontWeight: o.active ? 500 : 400 }}>{o.label}</span>
      {o.soon && <span style={{ marginLeft: "auto", fontSize: 9, color: "var(--fg-3)", letterSpacing: "0.12em", textTransform: "uppercase" }}>Próximamente</span>}
    </div>
  );
  return (
    <div style={{ padding: "16px 22px" }}>
      <div style={{ display: "grid", gridTemplateColumns: "180px 1fr", gap: 16 }}>
        <div>
          <div style={{ fontSize: 12, color: "var(--fg-2)" }}>{label}</div>
          {hint && <div style={{ fontSize: 11, color: "var(--fg-3)", marginTop: 4 }}>{hint}</div>}
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <Cell o={left} />
          <Cell o={right} />
        </div>
      </div>
    </div>
  );
}
function ConnRow({ name, sub, status }) {
  return (
    <div style={{ padding: "14px 22px", display: "grid", gridTemplateColumns: "32px 1fr auto auto", gap: 14, alignItems: "center" }}>
      <div style={{ width: 28, height: 28, borderRadius: 7, background: "var(--bg-2)", border: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 600 }}>{name.charAt(0)}</div>
      <div>
        <div style={{ fontSize: 13, fontWeight: 500 }}>{name}</div>
        <div style={{ fontSize: 11, color: "var(--fg-3)" }}>{sub}</div>
      </div>
      {status === "ok"
        ? <span className="badge badge-pos">Conectado</span>
        : <span className="badge">Desconectado</span>}
      <button className="btn btn-link" style={{ fontSize: 12 }}>{status === "ok" ? "Gestionar" : "Conectar"}</button>
    </div>
  );
}

Object.assign(window, { ChartScreen, CompareScreen, AudioScreen, ProfileScreen });
