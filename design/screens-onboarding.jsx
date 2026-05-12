/* global React, Icons, SafaMark, SafaWordmark, Spark */

// ────────────────────────────────────────────────────────────────
// Onboarding shell — used by every step
// ────────────────────────────────────────────────────────────────
function OnbShell({ step, total = 10, eyebrow, title, subtitle, children, footerNote, primaryLabel = "Continuar", canBack = true, side = null }) {
  const pct = (step / total) * 100;
  return (
    <div style={{
      width: "100%", height: "100%", background: "var(--bg)", color: "var(--fg)",
      display: "flex", flexDirection: "column", position: "relative", overflow: "hidden",
    }}>
      {/* top bar */}
      <div style={{ padding: "20px 32px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid var(--border)" }}>
        <SafaWordmark size={18} />
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <span className="mono" style={{ fontSize: 11, color: "var(--fg-3)", letterSpacing: "0.16em" }}>
            PASO <span style={{ color: "var(--fg-1)" }}>{String(step).padStart(2,"0")}</span> / {total}
          </span>
          <button className="btn btn-link" style={{ fontSize: 12 }}>Saltar configuración</button>
        </div>
      </div>

      {/* progress */}
      <div style={{ height: 2, background: "var(--bg-2)" }}>
        <div style={{ height: "100%", width: pct + "%", background: "var(--accent)", transition: "width 240ms ease" }} />
      </div>

      {/* content */}
      <div style={{ flex: 1, display: "grid", gridTemplateColumns: side ? "1.1fr 0.9fr" : "1fr", overflow: "hidden" }}>
        <div style={{ overflow: "auto", padding: "56px 88px 24px", display: "flex", flexDirection: "column" }}>
          {eyebrow && <div style={{ fontSize: 11, color: "var(--accent)", letterSpacing: "0.18em", textTransform: "uppercase", fontWeight: 600, marginBottom: 18 }}>{eyebrow}</div>}
          <h1 style={{ margin: 0, fontSize: 44, fontWeight: 500, letterSpacing: "-0.03em", lineHeight: 1.05, maxWidth: 640 }}>{title}</h1>
          {subtitle && <p style={{ marginTop: 14, fontSize: 16, color: "var(--fg-2)", lineHeight: 1.5, maxWidth: 540 }}>{subtitle}</p>}
          <div style={{ marginTop: 36, flex: 1 }}>{children}</div>
        </div>
        {side && (
          <div style={{ borderLeft: "1px solid var(--border)", background: "var(--bg-1)", padding: 40, overflow: "auto", display: "flex", flexDirection: "column", justifyContent: "center" }}>
            {side}
          </div>
        )}
      </div>

      {/* footer */}
      <div style={{ padding: "20px 32px", borderTop: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ fontSize: 12, color: "var(--fg-3)" }}>{footerNote || "Puedes cambiar todo esto luego en tu perfil."}</div>
        <div style={{ display: "flex", gap: 10 }}>
          <button className="btn btn-ghost" disabled={!canBack} style={{ opacity: canBack ? 1 : 0.4 }}>← Atrás</button>
          <button className="btn btn-accent">{primaryLabel} →</button>
        </div>
      </div>
    </div>
  );
}

// reusable bits
function ChipPick({ label, sub, active, leading, trailing }) {
  return (
    <div style={{
      padding: "14px 16px",
      borderRadius: 10,
      border: "1px solid " + (active ? "var(--accent)" : "var(--border)"),
      background: active ? "var(--accent-dim)" : "var(--bg-1)",
      display: "flex", alignItems: "center", gap: 14,
      cursor: "pointer", transition: "all 120ms",
    }}>
      {leading}
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 14, fontWeight: 500, color: active ? "var(--fg)" : "var(--fg)" }}>{label}</div>
        {sub && <div style={{ fontSize: 12, color: "var(--fg-2)", marginTop: 2 }}>{sub}</div>}
      </div>
      {trailing}
      {active && (
        <span style={{ width: 18, height: 18, borderRadius: 99, background: "var(--accent)", color: "var(--accent-fg)", display: "flex", alignItems: "center", justifyContent: "center" }}>{Icons.check}</span>
      )}
    </div>
  );
}

function CoinIcon({ sym, color }) {
  return (
    <div style={{ width: 32, height: 32, borderRadius: 99, background: color || "var(--bg-2)", border: "1px solid var(--border-strong)", display: "flex", alignItems: "center", justifyContent: "center", color: "#0A0A0A", fontSize: 11, fontWeight: 700, letterSpacing: "0.04em" }}>
      {sym}
    </div>
  );
}

// ────────────────────────────────────────────────────────────────
// 1 · NAME
// ────────────────────────────────────────────────────────────────
function Onb01() {
  return (
    <OnbShell
      step={1} canBack={false}
      eyebrow="Bienvenido a SAFA"
      title={<>Antes de empezar,<br/>¿cómo te <span style={{ color: "var(--accent)", fontStyle: "italic", fontWeight: 400 }}>llamas?</span></>}
      subtitle="Tu reporte de cada mañana empezará con tu nombre. Solo el primero — para que suene natural."
      side={
        <div>
          <div style={{ fontSize: 11, color: "var(--accent)", letterSpacing: "0.18em", textTransform: "uppercase", fontWeight: 600, marginBottom: 16 }}>Vista previa del audio</div>
          <div className="card" style={{ padding: 22 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
              <span style={{ width: 8, height: 8, borderRadius: 99, background: "var(--accent)" }} />
              <span className="mono" style={{ fontSize: 11, color: "var(--fg-3)", letterSpacing: "0.12em" }}>EJEMPLO · 06:00 CET</span>
            </div>
            <div style={{ fontSize: 20, lineHeight: 1.4, fontWeight: 500, letterSpacing: "-0.01em" }}>
              "Buenos días, <span style={{ color: "var(--accent)" }}>Mateo</span>. Tu cartera abre con un +1.2%, impulsada por el BTC..."
            </div>
            <div style={{ marginTop: 16, display: "flex", alignItems: "center", gap: 10 }}>
              <button className="btn btn-accent" style={{ width: 36, height: 36, borderRadius: 99, padding: 0 }}>{Icons.play}</button>
              <div className="mono tnum" style={{ fontSize: 11, color: "var(--fg-3)" }}>00:00 / 00:08</div>
            </div>
          </div>
        </div>
      }
    >
      <div style={{ maxWidth: 480 }}>
        <label className="label">Tu nombre</label>
        <input className="input" style={{ height: 56, fontSize: 22, letterSpacing: "-0.01em" }} placeholder="Ej. Mateo" defaultValue="Mateo" />
        <div style={{ marginTop: 12, fontSize: 12, color: "var(--fg-3)" }}>Solo lo usamos en tu reporte de audio. No lo compartimos.</div>
      </div>
    </OnbShell>
  );
}

// ────────────────────────────────────────────────────────────────
// 2 · CRYPTOS
// ────────────────────────────────────────────────────────────────
function Onb02() {
  const popular = [
    { sym: "BTC",  name: "Bitcoin",   color: "oklch(0.78 0.13 75)",  active: true,  qty: "0.84" },
    { sym: "ETH",  name: "Ethereum",  color: "oklch(0.7 0.15 270)",  active: true,  qty: "8.50" },
    { sym: "SOL",  name: "Solana",    color: "oklch(0.7 0.18 320)",  active: true,  qty: "42.0" },
    { sym: "ADA",  name: "Cardano",   color: "oklch(0.7 0.15 220)",  active: false },
    { sym: "DOT",  name: "Polkadot",  color: "oklch(0.66 0.20 25)",  active: false },
    { sym: "MATIC",name: "Polygon",   color: "oklch(0.7 0.18 295)",  active: false },
    { sym: "LINK", name: "Chainlink", color: "oklch(0.72 0.16 240)", active: false },
    { sym: "AVAX", name: "Avalanche", color: "oklch(0.66 0.20 25)",  active: false },
  ];
  return (
    <OnbShell
      step={2}
      eyebrow="Cartera · cripto"
      title={<>¿Qué <span style={{ color: "var(--accent)", fontStyle: "italic", fontWeight: 400 }}>criptos</span> tienes?</>}
      subtitle="Selecciona las que ya tienes. Más adelante podrás conectar exchanges para sincronizar saldos automáticamente."
      footerNote="3 seleccionadas · Puedes saltarlo si aún no tienes ninguna."
    >
      <div style={{ maxWidth: 720 }}>
        <div style={{ position: "relative", marginBottom: 20 }}>
          <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "var(--fg-3)", display: "flex" }}>{Icons.search}</span>
          <input className="input" style={{ paddingLeft: 40, height: 44 }} placeholder="Busca BTC, ETH, SOL... (más de 8,000 criptos)" />
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <span style={{ fontSize: 11, color: "var(--fg-3)", letterSpacing: "0.16em", textTransform: "uppercase" }}>Populares</span>
          <span className="mono" style={{ fontSize: 11, color: "var(--fg-2)" }}>3 seleccionadas</span>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          {popular.map(c => (
            <ChipPick key={c.sym}
              active={c.active}
              leading={<CoinIcon sym={c.sym.charAt(0)} color={c.color} />}
              label={c.sym}
              sub={c.name}
              trailing={c.active ? (
                <input className="input mono tnum" defaultValue={c.qty} style={{ width: 80, height: 32, textAlign: "right", fontSize: 12, padding: "0 8px" }} />
              ) : null}
            />
          ))}
        </div>

        <button className="btn btn-link" style={{ marginTop: 18, fontSize: 13 }}>+ Añadir otra cripto</button>
      </div>
    </OnbShell>
  );
}

// ────────────────────────────────────────────────────────────────
// 3 · STOCKS / ETFs
// ────────────────────────────────────────────────────────────────
function Onb03() {
  const items = [
    { sym: "SPY",  name: "SPDR S&P 500 ETF",      type: "ETF",     active: true,  qty: "68" },
    { sym: "VWCE", name: "Vanguard FTSE All-World",type: "ETF",     active: true,  qty: "60" },
    { sym: "AAPL", name: "Apple Inc.",             type: "Acción",  active: true,  qty: "65" },
    { sym: "MSFT", name: "Microsoft Corp.",        type: "Acción",  active: false },
    { sym: "QQQ",  name: "Invesco QQQ",            type: "ETF",     active: false },
    { sym: "TSLA", name: "Tesla Inc.",             type: "Acción",  active: false },
    { sym: "GOOGL",name: "Alphabet",               type: "Acción",  active: false },
    { sym: "NVDA", name: "Nvidia",                 type: "Acción",  active: false },
  ];
  return (
    <OnbShell
      step={3}
      eyebrow="Cartera · acciones y ETFs"
      title={<>¿Y qué <span style={{ color: "var(--accent)", fontStyle: "italic", fontWeight: 400 }}>acciones o ETFs?</span></>}
      subtitle="Añade los que ya tienes. SAFA seguirá su precio y los incluirá en el reporte de cada día."
      footerNote="3 seleccionadas"
    >
      <div style={{ maxWidth: 760 }}>
        <div style={{ position: "relative", marginBottom: 20 }}>
          <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "var(--fg-3)", display: "flex" }}>{Icons.search}</span>
          <input className="input" style={{ paddingLeft: 40, height: 44 }} placeholder="Busca AAPL, SPY, VWCE..." />
        </div>

        <div className="tabs" style={{ marginBottom: 14 }}>
          <span className="tab active">Todo</span>
          <span className="tab">ETFs</span>
          <span className="tab">Acciones US</span>
          <span className="tab">Acciones EU</span>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          {items.map(c => (
            <ChipPick key={c.sym}
              active={c.active}
              leading={<div style={{ width: 32, height: 32, borderRadius: 8, background: "var(--bg-2)", border: "1px solid var(--border-strong)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 600 }}>{c.sym.charAt(0)}</div>}
              label={<>{c.sym} <span style={{ color: "var(--fg-3)", fontWeight: 400, fontSize: 11, marginLeft: 6 }}>{c.type}</span></>}
              sub={c.name}
              trailing={c.active ? (
                <input className="input mono tnum" defaultValue={c.qty} style={{ width: 60, height: 32, textAlign: "right", fontSize: 12, padding: "0 8px" }} />
              ) : null}
            />
          ))}
        </div>

        <button className="btn btn-link" style={{ marginTop: 18, fontSize: 13 }}>+ Añadir otro activo</button>
      </div>
    </OnbShell>
  );
}

// ────────────────────────────────────────────────────────────────
// 4 · CAPITAL TOTAL INVERTIDO
// ────────────────────────────────────────────────────────────────
function Onb04() {
  return (
    <OnbShell
      step={4}
      eyebrow="Capital total invertido"
      title={<>¿Cuánto tienes<br/><span style={{ color: "var(--accent)", fontStyle: "italic", fontWeight: 400 }}>invertido</span> en total?</>}
      subtitle="Una cifra aproximada nos basta. La usamos para calcular el peso de cada activo en tu cartera."
      side={
        <div>
          <div style={{ fontSize: 11, color: "var(--accent)", letterSpacing: "0.18em", textTransform: "uppercase", fontWeight: 600, marginBottom: 16 }}>Distribución estimada</div>
          <div className="card" style={{ padding: 22 }}>
            <div style={{ display: "flex", height: 10, borderRadius: 99, overflow: "hidden", marginBottom: 16 }}>
              <div style={{ flex: 38, background: "oklch(0.78 0.13 75)" }} />
              <div style={{ flex: 24, background: "oklch(0.76 0.16 148)" }} />
              <div style={{ flex: 18, background: "oklch(0.7 0.15 270)" }} />
              <div style={{ flex: 12, background: "oklch(0.7 0.18 320)" }} />
              <div style={{ flex: 8,  background: "var(--bg-3)" }} />
            </div>
            {[
              { l: "BTC",   v: "€38,000",  p: "38%", c: "oklch(0.78 0.13 75)" },
              { l: "SPY",   v: "€24,000",  p: "24%", c: "oklch(0.76 0.16 148)" },
              { l: "ETH",   v: "€18,000",  p: "18%", c: "oklch(0.7 0.15 270)" },
              { l: "AAPL",  v: "€12,000",  p: "12%", c: "oklch(0.7 0.18 320)" },
              { l: "VWCE",  v: "€8,000",   p: "8%",  c: "var(--bg-3)" },
            ].map(r => (
              <div key={r.l} style={{ display: "grid", gridTemplateColumns: "16px 1fr auto auto", gap: 12, alignItems: "center", padding: "8px 0", borderBottom: "1px solid var(--border)" }}>
                <span style={{ width: 8, height: 8, borderRadius: 2, background: r.c }} />
                <span className="mono" style={{ fontSize: 12 }}>{r.l}</span>
                <span className="mono tnum" style={{ fontSize: 12, color: "var(--fg-2)" }}>{r.v}</span>
                <span className="mono tnum" style={{ fontSize: 12, color: "var(--fg-3)", width: 32, textAlign: "right" }}>{r.p}</span>
              </div>
            ))}
          </div>
          <div style={{ fontSize: 11, color: "var(--fg-3)", marginTop: 12, lineHeight: 1.5 }}>Calculado a partir de las cantidades que indicaste y los precios actuales.</div>
        </div>
      }
    >
      <div style={{ maxWidth: 480 }}>
        <label className="label">Capital total invertido</label>
        <div style={{ position: "relative" }}>
          <span className="mono" style={{ position: "absolute", left: 18, top: "50%", transform: "translateY(-50%)", fontSize: 32, color: "var(--fg-3)", fontWeight: 500 }}>€</span>
          <input className="input mono tnum" style={{ height: 80, fontSize: 40, fontWeight: 500, paddingLeft: 56, letterSpacing: "-0.02em" }} defaultValue="100,000" />
        </div>
        <div style={{ display: "flex", gap: 8, marginTop: 16, flexWrap: "wrap" }}>
          {["€10K","€50K","€100K","€250K","€500K","€1M+"].map((p, i) => (
            <span key={p} className="badge" style={{
              cursor: "pointer", padding: "8px 14px", fontSize: 12,
              borderColor: i === 2 ? "var(--accent)" : "var(--border-strong)",
              color: i === 2 ? "var(--accent)" : "var(--fg-2)",
              background: i === 2 ? "var(--accent-dim)" : "var(--bg-2)",
            }}>{p}</span>
          ))}
        </div>
        <div style={{ marginTop: 24, padding: 14, border: "1px solid var(--border)", borderRadius: 10, background: "var(--bg-1)", fontSize: 12, color: "var(--fg-2)", lineHeight: 1.5 }}>
          🔒 Esta cifra solo se usa para cálculos en tu app. Nunca la compartimos.
        </div>
      </div>
    </OnbShell>
  );
}

// ────────────────────────────────────────────────────────────────
// 5 · TIME HORIZON
// ────────────────────────────────────────────────────────────────
function Onb05() {
  const opts = [
    { id: "short", title: "Corto plazo", sub: "Menos de 1 año", desc: "Reaccionar a movimientos del día. El reporte enfatiza volatilidad, momentum y noticias intra-día.",
      icon: "M3 12h18", active: false },
    { id: "mid", title: "Medio plazo", sub: "1 a 5 años", desc: "Equilibrio entre tendencias y movimientos cíclicos. Mezclamos análisis técnico y fundamental.",
      icon: "M3 12h18M12 3l3 9-3 9-3-9z", active: false },
    { id: "long", title: "Largo plazo", sub: "Más de 5 años", desc: "Invertir y olvidar. El reporte se enfoca en tendencias seculares, cambios macro y composición de cartera.",
      icon: "M3 12h18M12 3v18", active: true },
  ];
  return (
    <OnbShell
      step={5}
      eyebrow="Horizonte temporal"
      title={<>¿Inviertes a <span style={{ color: "var(--accent)", fontStyle: "italic", fontWeight: 400 }}>corto o largo</span> plazo?</>}
      subtitle="Esto cambia qué tan agresivo es el tono del reporte y qué métricas resaltamos cada día."
    >
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14, maxWidth: 980 }}>
        {opts.map(o => (
          <div key={o.id} style={{
            padding: 26,
            borderRadius: 12,
            border: "1.5px solid " + (o.active ? "var(--accent)" : "var(--border)"),
            background: o.active ? "var(--accent-dim)" : "var(--bg-1)",
            cursor: "pointer", position: "relative",
            display: "flex", flexDirection: "column", gap: 14,
            minHeight: 280,
          }}>
            {o.active && <span style={{ position: "absolute", top: 16, right: 16, width: 22, height: 22, borderRadius: 99, background: "var(--accent)", color: "var(--accent-fg)", display: "flex", alignItems: "center", justifyContent: "center" }}>{Icons.check}</span>}
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke={o.active ? "var(--accent)" : "var(--fg-2)"} strokeWidth="1.4" strokeLinecap="round">
              <path d={o.icon} />
            </svg>
            <div style={{ fontSize: 22, fontWeight: 500, letterSpacing: "-0.01em" }}>{o.title}</div>
            <div className="mono" style={{ fontSize: 11, color: o.active ? "var(--accent)" : "var(--fg-3)", letterSpacing: "0.12em", textTransform: "uppercase", marginTop: -8 }}>{o.sub}</div>
            <div style={{ fontSize: 13, color: "var(--fg-2)", lineHeight: 1.5 }}>{o.desc}</div>
          </div>
        ))}
      </div>
    </OnbShell>
  );
}

// ────────────────────────────────────────────────────────────────
// 6 · RISK TOLERANCE
// ────────────────────────────────────────────────────────────────
function Onb06() {
  const value = 7; // 1-10
  const labels = ["Conservador","Moderado","Agresivo"];
  const idx = value <= 3 ? 0 : value <= 7 ? 1 : 2;
  return (
    <OnbShell
      step={6}
      eyebrow="Tolerancia al riesgo"
      title={<>¿Cómo te sientes con la <span style={{ color: "var(--accent)", fontStyle: "italic", fontWeight: 400 }}>volatilidad?</span></>}
      subtitle="Imagina que tu cartera baja un 20% en un mes. ¿Cómo reaccionas? Esto afecta el tono y los avisos del reporte."
      side={
        <div>
          <div style={{ fontSize: 11, color: "var(--accent)", letterSpacing: "0.18em", textTransform: "uppercase", fontWeight: 600, marginBottom: 16 }}>Tu perfil</div>
          <div className="card" style={{ padding: 24 }}>
            <div style={{ fontSize: 36, fontWeight: 500, letterSpacing: "-0.02em" }}>{labels[idx]}</div>
            <div className="mono tnum" style={{ fontSize: 13, color: "var(--accent)", marginTop: 6 }}>Nivel {value} / 10</div>
            <div style={{ marginTop: 20, fontSize: 13, color: "var(--fg-2)", lineHeight: 1.6 }}>
              Aceptas movimientos amplios a cambio de retornos más altos. SAFA evitará alarmarte por caídas normales y solo te avisará en eventos extremos (&gt;15% en 24h).
            </div>
            <div style={{ marginTop: 22, paddingTop: 18, borderTop: "1px solid var(--border)" }}>
              <div style={{ fontSize: 11, color: "var(--fg-3)", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 10 }}>Asignación sugerida</div>
              <div style={{ display: "flex", height: 8, borderRadius: 99, overflow: "hidden", marginBottom: 10 }}>
                <div style={{ flex: 70, background: "var(--accent)" }} />
                <div style={{ flex: 22, background: "oklch(0.76 0.16 148)" }} />
                <div style={{ flex: 8,  background: "var(--bg-3)" }} />
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "var(--fg-2)" }}>
                <span>Renta variable 70%</span><span>Bonos 22%</span><span>Cash 8%</span>
              </div>
            </div>
          </div>
        </div>
      }
    >
      <div style={{ maxWidth: 580 }}>
        <div className="mono" style={{ fontSize: 88, fontWeight: 500, letterSpacing: "-0.04em", lineHeight: 1, color: "var(--accent)" }}>
          {value}<span style={{ fontSize: 36, color: "var(--fg-3)" }}> / 10</span>
        </div>

        {/* slider track */}
        <div style={{ marginTop: 36, position: "relative", height: 28 }}>
          <div style={{ position: "absolute", inset: "12px 0", background: "var(--bg-2)", borderRadius: 99 }} />
          <div style={{ position: "absolute", left: 0, top: 12, height: 4, width: ((value - 1) / 9 * 100) + "%", background: "var(--accent)", borderRadius: 99 }} />
          <div style={{ position: "absolute", left: ((value - 1) / 9 * 100) + "%", top: "50%", transform: "translate(-50%, -50%)", width: 22, height: 22, borderRadius: 99, background: "var(--accent)", border: "3px solid var(--bg)", boxShadow: "0 0 0 1px var(--accent)" }} />
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 12, fontSize: 11, color: "var(--fg-3)" }} className="mono">
          {[1,2,3,4,5,6,7,8,9,10].map(n => (
            <span key={n} style={{ color: n === value ? "var(--accent)" : "var(--fg-3)" }}>{n}</span>
          ))}
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 14, fontSize: 12, color: "var(--fg-2)" }}>
          <span>Vendo todo y duermo tranquilo</span>
          <span>Compro más en la caída</span>
        </div>

        <div style={{ marginTop: 32, display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>
          {labels.map((l, i) => (
            <div key={l} style={{
              padding: "10px 12px", borderRadius: 8,
              border: "1px solid " + (i === idx ? "var(--accent)" : "var(--border)"),
              background: i === idx ? "var(--accent-dim)" : "transparent",
              fontSize: 12, color: i === idx ? "var(--accent)" : "var(--fg-2)",
              textAlign: "center", fontWeight: i === idx ? 500 : 400,
            }}>{l} <span className="mono" style={{ opacity: 0.6, marginLeft: 6, fontSize: 11 }}>{i === 0 ? "1–3" : i === 1 ? "4–7" : "8–10"}</span></div>
          ))}
        </div>
      </div>
    </OnbShell>
  );
}

// ────────────────────────────────────────────────────────────────
// 7 · NET MONTHLY INCOME
// ────────────────────────────────────────────────────────────────
function Onb07() {
  return (
    <OnbShell
      step={7}
      eyebrow="Ingreso mensual neto"
      title={<>¿Cuánto entra cada mes,<br/><span style={{ color: "var(--accent)", fontStyle: "italic", fontWeight: 400 }}>después</span> de impuestos?</>}
      subtitle="Tu ingreso neto. Sirve para calcular tu tasa de ahorro y avisarte si tus gastos se acercan a tu salario."
      side={
        <div>
          <div style={{ fontSize: 11, color: "var(--accent)", letterSpacing: "0.18em", textTransform: "uppercase", fontWeight: 600, marginBottom: 16 }}>Lo que SAFA hará con esto</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {[
              { l: "Tasa de ahorro",  v: "55.4%", sub: "calculada automáticamente cada mes",         tone: "pos" },
              { l: "Capacidad de inversión", v: "€1,800/mes", sub: "máximo recomendado a invertir", tone: "" },
              { l: "Alertas",         v: "Activas",  sub: "te avisamos si gastas >70% del ingreso", tone: "accent" },
            ].map((r, i) => (
              <div key={i} className="card" style={{ padding: 18 }}>
                <div style={{ fontSize: 11, color: "var(--fg-3)", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 8 }}>{r.l}</div>
                <div className={"mono tnum " + (r.tone === "pos" ? "pos" : "")} style={{ fontSize: 22, fontWeight: 500, letterSpacing: "-0.01em", color: r.tone === "accent" ? "var(--accent)" : undefined }}>{r.v}</div>
                <div style={{ fontSize: 12, color: "var(--fg-2)", marginTop: 4 }}>{r.sub}</div>
              </div>
            ))}
          </div>
        </div>
      }
    >
      <div style={{ maxWidth: 480 }}>
        <label className="label">Ingreso mensual neto</label>
        <div style={{ position: "relative" }}>
          <span className="mono" style={{ position: "absolute", left: 18, top: "50%", transform: "translateY(-50%)", fontSize: 32, color: "var(--fg-3)", fontWeight: 500 }}>€</span>
          <input className="input mono tnum" style={{ height: 80, fontSize: 40, fontWeight: 500, paddingLeft: 56, letterSpacing: "-0.02em" }} defaultValue="3,420" />
          <span className="mono" style={{ position: "absolute", right: 18, top: "50%", transform: "translateY(-50%)", fontSize: 13, color: "var(--fg-3)", letterSpacing: "0.08em" }}>/MES</span>
        </div>

        <div style={{ marginTop: 22 }}>
          <div className="label">Frecuencia</div>
          <div className="tabs" style={{ display: "flex", width: "100%" }}>
            <span className="tab" style={{ flex: 1, textAlign: "center", padding: "10px 0", fontSize: 13 }}>Semanal</span>
            <span className="tab" style={{ flex: 1, textAlign: "center", padding: "10px 0", fontSize: 13 }}>Quincenal</span>
            <span className="tab active" style={{ flex: 1, textAlign: "center", padding: "10px 0", fontSize: 13 }}>Mensual</span>
            <span className="tab" style={{ flex: 1, textAlign: "center", padding: "10px 0", fontSize: 13 }}>Anual</span>
          </div>
        </div>

        <label style={{ display: "flex", alignItems: "flex-start", gap: 10, marginTop: 24, fontSize: 12, color: "var(--fg-2)" }}>
          <span style={{ width: 16, height: 16, borderRadius: 4, border: "1px solid var(--border-strong)", background: "var(--accent)", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", color: "var(--accent-fg)" }}>{Icons.check}</span>
          <span>Tengo ingresos variables (ej. autónomo, comisiones). SAFA usará un promedio móvil de 3 meses.</span>
        </label>
      </div>
    </OnbShell>
  );
}

// ────────────────────────────────────────────────────────────────
// 8 · BRIEFING HOUR
// ────────────────────────────────────────────────────────────────
function Onb08() {
  const hour = 6;
  const minute = 0;
  return (
    <OnbShell
      step={8}
      eyebrow="Hora del reporte"
      title={<>¿A qué hora quieres tu <span style={{ color: "var(--accent)", fontStyle: "italic", fontWeight: 400 }}>briefing?</span></>}
      subtitle="Cada día generamos tu informe automáticamente. Llega como notificación a esa hora."
      side={
        <div>
          <div style={{ fontSize: 11, color: "var(--accent)", letterSpacing: "0.18em", textTransform: "uppercase", fontWeight: 600, marginBottom: 16 }}>Tu rutina</div>
          {/* timeline */}
          <div className="card" style={{ padding: 22 }}>
            {[
              { t: "06:00", l: "Reporte SAFA", desc: "Te despiertas con un audio de 5 min", active: true, accent: true },
              { t: "08:00", l: "Apertura mercados EU",  desc: "Ya sabes qué pasó en la noche" },
              { t: "15:30", l: "Apertura US",            desc: "Reaccionas con contexto" },
              { t: "22:00", l: "Resumen de cierre",      desc: "Opcional · puedes activarlo luego" },
            ].map((row, i) => (
              <div key={i} style={{ display: "flex", gap: 14, padding: "12px 0", borderBottom: i < 3 ? "1px solid var(--border)" : "none" }}>
                <div className="mono tnum" style={{ fontSize: 13, fontWeight: 500, color: row.accent ? "var(--accent)" : "var(--fg-3)", width: 50, paddingTop: 2 }}>{row.t}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 500, color: row.active ? "var(--fg)" : "var(--fg-2)" }}>{row.l}</div>
                  <div style={{ fontSize: 11, color: "var(--fg-3)", marginTop: 2 }}>{row.desc}</div>
                </div>
                {row.active && <span className="badge badge-accent" style={{ fontSize: 10 }}>Tú</span>}
              </div>
            ))}
          </div>
        </div>
      }
    >
      <div style={{ maxWidth: 520 }}>
        {/* big time */}
        <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 28 }}>
          <span className="mono tnum" style={{ fontSize: 120, fontWeight: 500, letterSpacing: "-0.05em", lineHeight: 1, color: "var(--accent)" }}>{String(hour).padStart(2,"0")}</span>
          <span className="mono" style={{ fontSize: 80, fontWeight: 500, color: "var(--fg-3)", letterSpacing: "-0.05em" }}>:</span>
          <span className="mono tnum" style={{ fontSize: 120, fontWeight: 500, letterSpacing: "-0.05em", lineHeight: 1, color: "var(--fg)" }}>{String(minute).padStart(2,"0")}</span>
          <span className="mono" style={{ fontSize: 16, color: "var(--fg-3)", letterSpacing: "0.1em", marginLeft: 8 }}>CET</span>
        </div>

        {/* hour preset chips */}
        <div className="label">Sugerencias</div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 24 }}>
          {[
            { l: "05:30", n: "Madrugador" },
            { l: "06:00", n: "Mañana", on: true },
            { l: "07:00", n: "Camino al trabajo" },
            { l: "08:30", n: "Café" },
            { l: "12:00", n: "Almuerzo" },
            { l: "18:00", n: "Cierre del día" },
          ].map(p => (
            <span key={p.l} className="badge" style={{
              cursor: "pointer", padding: "8px 12px", fontSize: 12,
              borderColor: p.on ? "var(--accent)" : "var(--border-strong)",
              color: p.on ? "var(--accent)" : "var(--fg-2)",
              background: p.on ? "var(--accent-dim)" : "var(--bg-2)",
              display: "inline-flex", alignItems: "center", gap: 8,
            }}><span className="mono tnum">{p.l}</span><span style={{ opacity: 0.7 }}>{p.n}</span></span>
          ))}
        </div>

        <div className="label">Días de la semana</div>
        <div style={{ display: "flex", gap: 6 }}>
          {["L","M","X","J","V","S","D"].map((d, i) => (
            <div key={d} style={{
              flex: 1, height: 38,
              borderRadius: 8,
              border: "1px solid " + (i < 5 ? "var(--accent)" : "var(--border)"),
              background: i < 5 ? "var(--accent-dim)" : "var(--bg-2)",
              color: i < 5 ? "var(--accent)" : "var(--fg-3)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 13, fontWeight: 500, cursor: "pointer",
            }}>{d}</div>
          ))}
        </div>
      </div>
    </OnbShell>
  );
}

// ────────────────────────────────────────────────────────────────
// 9 · LANGUAGE
// ────────────────────────────────────────────────────────────────
function Onb09() {
  const langs = [
    { id: "es", flag: "🇪🇸", name: "Español", sample: "Buenos días, Mateo. Tu cartera abre con un +1.2%...", active: true },
    { id: "en", flag: "🇬🇧", name: "English",  sample: "Good morning, Mateo. Your portfolio is up 1.2%...", soon: false },
    { id: "pt", flag: "🇵🇹", name: "Português", sample: "Bom dia, Mateo. A tua carteira está a subir 1.2%...", soon: true },
    { id: "fr", flag: "🇫🇷", name: "Français",  sample: "Bonjour, Mateo. Ton portefeuille ouvre à +1.2%...", soon: true },
    { id: "de", flag: "🇩🇪", name: "Deutsch",   sample: "Guten Morgen, Mateo. Dein Portfolio liegt bei +1.2%...", soon: true },
    { id: "it", flag: "🇮🇹", name: "Italiano",  sample: "Buongiorno, Mateo. Il tuo portafoglio è in rialzo dell'1.2%...", soon: true },
  ];
  return (
    <OnbShell
      step={9}
      eyebrow="Idioma"
      title={<>¿En qué <span style={{ color: "var(--accent)", fontStyle: "italic", fontWeight: 400 }}>idioma</span> quieres SAFA?</>}
      subtitle="Tanto la interfaz como el reporte de audio. Puedes cambiarlo cuando quieras."
    >
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, maxWidth: 980 }}>
        {langs.map(l => (
          <div key={l.id} style={{
            padding: "20px 22px",
            borderRadius: 12,
            border: "1.5px solid " + (l.active ? "var(--accent)" : "var(--border)"),
            background: l.active ? "var(--accent-dim)" : "var(--bg-1)",
            opacity: l.soon ? 0.55 : 1,
            cursor: l.soon ? "not-allowed" : "pointer",
            display: "flex", alignItems: "center", gap: 18, position: "relative",
          }}>
            <div style={{ fontSize: 32 }}>{l.flag}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 17, fontWeight: 500, marginBottom: 4 }}>{l.name}</div>
              <div style={{ fontSize: 12, color: "var(--fg-2)", fontStyle: "italic", lineHeight: 1.4 }}>"{l.sample}"</div>
            </div>
            {l.active && <span style={{ width: 22, height: 22, borderRadius: 99, background: "var(--accent)", color: "var(--accent-fg)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{Icons.check}</span>}
            {l.soon && <span className="badge" style={{ fontSize: 9, position: "absolute", top: 12, right: 12 }}>Próximamente</span>}
          </div>
        ))}
      </div>

      <div style={{ marginTop: 28, display: "flex", alignItems: "center", gap: 12, padding: 16, border: "1px solid var(--border)", borderRadius: 10, background: "var(--bg-1)", maxWidth: 980 }}>
        <span style={{ width: 32, height: 32, borderRadius: 99, background: "var(--accent-dim)", color: "var(--accent)", display: "flex", alignItems: "center", justifyContent: "center" }}>{Icons.speaker}</span>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 13, fontWeight: 500 }}>Voz del narrador · Ricardo</div>
          <div style={{ fontSize: 12, color: "var(--fg-2)" }}>Voz IA · masculina · acento neutro</div>
        </div>
        <button className="btn btn-ghost" style={{ height: 32, fontSize: 12 }}>Cambiar voz</button>
        <button className="btn btn-accent" style={{ height: 32, padding: "0 14px", fontSize: 12 }}>{Icons.play} Probar</button>
      </div>
    </OnbShell>
  );
}

// ────────────────────────────────────────────────────────────────
// 10 · PRINCIPAL AIM
// ────────────────────────────────────────────────────────────────
function Onb10() {
  const aims = [
    { id: "wealth",  icon: "M12 2v20M5 9l7-7 7 7", label: "Construir patrimonio",      sub: "Crecimiento a largo plazo" },
    { id: "retire",  icon: "M3 21h18M5 21V8l7-5 7 5v13M9 21v-6h6v6", label: "Jubilarme antes",  sub: "FIRE / independencia financiera", active: true },
    { id: "passive", icon: "M12 1v22M17 5H9.5a3.5 3.5 0 100 7h5a3.5 3.5 0 110 7H6", label: "Generar ingresos pasivos", sub: "Dividendos y renta" },
    { id: "house",   icon: "M3 12l9-9 9 9M5 10v10h14V10", label: "Comprar una casa",        sub: "Objetivo a 3-5 años" },
    { id: "learn",   icon: "M2 17l10 5 10-5M2 12l10 5 10-5M12 2L2 7l10 5 10-5z", label: "Aprender a invertir",     sub: "Empezar con buen pie" },
    { id: "preserve",icon: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z", label: "Proteger lo que tengo", sub: "Mantener valor frente a inflación" },
  ];
  return (
    <OnbShell
      step={10}
      eyebrow="Tu objetivo principal"
      title={<>Y por último —<br/>¿cuál es tu <span style={{ color: "var(--accent)", fontStyle: "italic", fontWeight: 400 }}>meta?</span></>}
      subtitle="Solo una. La que más te motiva. SAFA orientará el reporte y los avisos hacia ese norte."
      primaryLabel="Empezar →"
      footerNote="Después de esto, generamos tu primer reporte personalizado."
    >
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, maxWidth: 980 }}>
        {aims.map(a => (
          <div key={a.id} style={{
            padding: 22, minHeight: 160,
            borderRadius: 12,
            border: "1.5px solid " + (a.active ? "var(--accent)" : "var(--border)"),
            background: a.active ? "var(--accent-dim)" : "var(--bg-1)",
            cursor: "pointer", position: "relative",
            display: "flex", flexDirection: "column", gap: 14,
          }}>
            {a.active && <span style={{ position: "absolute", top: 12, right: 12, width: 20, height: 20, borderRadius: 99, background: "var(--accent)", color: "var(--accent-fg)", display: "flex", alignItems: "center", justifyContent: "center" }}>{Icons.check}</span>}
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={a.active ? "var(--accent)" : "var(--fg-2)"} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
              <path d={a.icon} />
            </svg>
            <div>
              <div style={{ fontSize: 16, fontWeight: 500, letterSpacing: "-0.01em" }}>{a.label}</div>
              <div style={{ fontSize: 12, color: "var(--fg-2)", marginTop: 4 }}>{a.sub}</div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 32, padding: 20, border: "1px solid var(--accent)", borderRadius: 12, background: "var(--accent-dim)", display: "flex", alignItems: "center", gap: 18, maxWidth: 980 }}>
        <div style={{ width: 44, height: 44, borderRadius: 12, background: "var(--accent)", color: "var(--accent-fg)", display: "flex", alignItems: "center", justifyContent: "center" }}>{Icons.audio}</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 14, fontWeight: 500, color: "var(--fg)" }}>Tu primer reporte llega mañana a las 06:00</div>
          <div style={{ fontSize: 12, color: "var(--fg-2)", marginTop: 2 }}>Mientras tanto, ya puedes explorar tu home — todo está listo.</div>
        </div>
          <button className="btn" style={{ background: "var(--fg)", color: "#0A0A0A", height: 36 }}>Empezar →</button>
      </div>
    </OnbShell>
  );
}

Object.assign(window, { Onb01, Onb02, Onb03, Onb04, Onb05, Onb06, Onb07, Onb08, Onb09, Onb10 });
