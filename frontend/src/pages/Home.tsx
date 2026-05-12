import type React from "react"

const Skeleton = ({ w, h, style = {} }: { w?: string | number; h?: string | number; style?: React.CSSProperties }) => (
  <div style={{ width: w ?? "100%", height: h ?? 16, borderRadius: 6, background: "var(--s-bg-3)", ...style }} />
)

const LiveDot = () => (
  <span style={{ display: "inline-block", width: 6, height: 6, borderRadius: "50%", background: "var(--s-pos)", flexShrink: 0 }} />
)

const card: React.CSSProperties = {
  background: "var(--s-bg-1)",
  border: "1px solid var(--s-border)",
  borderRadius: 10,
}

const label: React.CSSProperties = {
  fontSize: 11,
  color: "var(--s-fg-3)",
  letterSpacing: "0.16em",
  textTransform: "uppercase",
}

function Waveform() {
  const bars = 50
  const heights = Array.from({ length: bars }, (_, i) => {
    const t = i / bars
    const env = Math.sin(t * Math.PI) * 0.6 + 0.3
    const noise = ((Math.sin(i * 1.7) + 1) / 2) * 0.7 + 0.3
    return env * noise
  })
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 2, height: 28 }}>
      {heights.map((h, i) => (
        <div key={i} style={{
          flex: 1,
          height: Math.max(2, h * 28),
          background: i < bars * 0.22 ? "var(--s-accent)" : "var(--s-bg-3)",
          borderRadius: 1,
        }} />
      ))}
    </div>
  )
}

const TICKERS = ["BTC · Bitcoin", "SPY · S&P 500 ETF", "ETH · Ethereum", "AAPL · Apple Inc."]

const Home = () => {
  return (
    <div style={{ background: "var(--s-bg)", minHeight: "100%", color: "var(--s-fg)" }}>

      {/* ── TopBar ── */}
      <header style={{ padding: "20px 32px", borderBottom: "1px solid var(--s-border)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <div style={{ ...label, marginBottom: 4 }}>Inicio</div>
          <div style={{ fontSize: 22, fontWeight: 500, letterSpacing: "-0.02em" }}>Buenos días, Andrei.</div>
          <div style={{ fontSize: 13, color: "var(--s-fg-2)", marginTop: 2 }}>Tu mañana en una pasada.</div>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <div style={{ fontSize: 13, padding: "6px 14px", borderRadius: 8, border: "1px solid var(--s-border)", color: "var(--s-fg-2)", cursor: "pointer" }}>
            Sincronizar
          </div>
        </div>
      </header>

      <div style={{ padding: 32, display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 24, alignContent: "start" }}>

        {/* ══ COLUMNA IZQUIERDA ══ */}
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>

          {/* ── 1. Patrimonio neto hero ── */}
          <div style={{ ...card, padding: 28 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
              <div style={label}>Patrimonio neto</div>
              <div style={{ display: "flex", gap: 4 }}>
                {["1S", "1M", "3M", "1A", "Todo"].map((t, i) => (
                  <div key={t} style={{
                    fontSize: 12, padding: "4px 10px", borderRadius: 6, cursor: "pointer",
                    background: i === 2 ? "var(--s-bg-3)" : "transparent",
                    color: i === 2 ? "var(--s-fg)" : "var(--s-fg-3)",
                  }}>{t}</div>
                ))}
              </div>
            </div>

            {/* Big number */}
            <Skeleton h={64} w="65%" style={{ marginTop: 4 }} />

            {/* Badge row */}
            <div style={{ marginTop: 12, display: "flex", alignItems: "center", gap: 14 }}>
              <Skeleton w={110} h={24} style={{ borderRadius: 99 }} />
              <Skeleton w={55} h={16} />
              <Skeleton w={130} h={14} />
            </div>

            {/* Chart area */}
            <Skeleton h={140} style={{ marginTop: 20, borderRadius: 8 }} />

            {/* Date axis */}
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8 }}>
              {["30 ENE", "15 FEB", "1 MAR", "15 MAR", "1 ABR", "HOY"].map(d => (
                <span key={d} style={{ fontSize: 10, color: "var(--s-fg-3)", fontFamily: "JetBrains Mono, monospace", letterSpacing: "0.1em" }}>{d}</span>
              ))}
            </div>
          </div>

          {/* ── 2. Key stats row ── */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 0, padding: "20px 4px" }}>
            {[
              { lbl: "Líquido" },
              { lbl: "Invertido", border: true },
              { lbl: "Deuda", border: true },
            ].map(s => (
              <div key={s.lbl} style={{ paddingLeft: s.border ? 24 : 0, borderLeft: s.border ? "1px solid var(--s-border)" : "none" }}>
                <div style={{ fontSize: 11, color: "var(--s-fg-3)", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 8 }}>{s.lbl}</div>
                <Skeleton h={22} w="80%" />
                <Skeleton h={12} w="55%" style={{ marginTop: 8 }} />
              </div>
            ))}
          </div>

          {/* ── 3. Movimientos recientes ── */}
          <div style={{ ...card, overflow: "hidden" }}>
            <div style={{ padding: "16px 20px", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid var(--s-border)" }}>
              <div style={{ fontSize: 13, fontWeight: 500 }}>Movimientos recientes</div>
              <span style={{ fontSize: 12, color: "var(--s-fg-3)", cursor: "pointer" }}>Ver todo →</span>
            </div>
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} style={{ padding: "14px 20px", display: "flex", alignItems: "center", gap: 14, borderBottom: i < 3 ? "1px solid var(--s-border)" : "none" }}>
                <div style={{ width: 28, height: 28, borderRadius: 8, background: "var(--s-bg-2)", border: "1px solid var(--s-border)", flexShrink: 0 }} />
                <div style={{ flex: 1 }}>
                  <Skeleton h={13} w="55%" />
                  <Skeleton h={11} w="40%" style={{ marginTop: 5 }} />
                </div>
                <Skeleton h={14} w={70} />
              </div>
            ))}
          </div>
        </div>

        {/* ══ COLUMNA DERECHA ══ */}
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>

          {/* ── 4. Reporte de hoy ── */}
          <div style={{ ...card, padding: 22, overflow: "hidden" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
              <div>
                <div style={{ fontSize: 10, letterSpacing: "0.16em", color: "var(--s-accent)", textTransform: "uppercase", fontWeight: 600 }}>
                  Reporte de hoy
                </div>
                <Skeleton h={11} w={130} style={{ marginTop: 6 }} />
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11, color: "var(--s-fg-3)", border: "1px solid var(--s-border)", borderRadius: 6, padding: "4px 8px" }}>
                <LiveDot /> Nuevo
              </div>
            </div>

            {/* Audio preview text */}
            <Skeleton h={14} style={{ marginBottom: 6 }} />
            <Skeleton h={14} w="85%" style={{ marginBottom: 6 }} />
            <Skeleton h={14} w="60%" style={{ marginBottom: 16 }} />

            {/* Waveform */}
            <Waveform />

            {/* Controls */}
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 14 }}>
              <div style={{ width: 40, height: 40, borderRadius: "50%", background: "var(--s-accent)", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width={14} height={14} viewBox="0 0 24 24" fill="var(--s-accent-fg)"><path d="M6 4l14 8-14 8z" /></svg>
              </div>
              <div style={{ flex: 1, fontFamily: "JetBrains Mono, monospace", fontSize: 12, color: "var(--s-fg-2)" }}>00:00 / 05:08</div>
              <div style={{ fontSize: 12, padding: "4px 12px", borderRadius: 6, border: "1px solid var(--s-border)", color: "var(--s-fg-2)", cursor: "pointer" }}>
                Transcripción
              </div>
            </div>
          </div>

          {/* ── 5. Mercados en vivo ── */}
          <div style={{ ...card, overflow: "hidden" }}>
            <div style={{ padding: "16px 20px", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid var(--s-border)" }}>
              <div style={{ fontSize: 13, fontWeight: 500 }}>
                Mercados <span style={{ color: "var(--s-fg-3)", fontWeight: 400, fontSize: 12 }}>en vivo</span>
              </div>
              <LiveDot />
            </div>
            {TICKERS.map((ticker, i) => (
              <div key={i} style={{ padding: "14px 20px", display: "grid", gridTemplateColumns: "1fr 90px 90px", gap: 14, alignItems: "center", borderBottom: i < TICKERS.length - 1 ? "1px solid var(--s-border)" : "none" }}>
                <div>
                  <div style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 13, fontWeight: 500, letterSpacing: "0.04em" }}>
                    {ticker.split(" · ")[0]}
                  </div>
                  <div style={{ fontSize: 11, color: "var(--s-fg-3)", marginTop: 2 }}>{ticker.split(" · ")[1]}</div>
                </div>
                <Skeleton h={26} style={{ borderRadius: 4 }} />
                <div style={{ textAlign: "right" }}>
                  <Skeleton h={13} w="80%" style={{ marginLeft: "auto" }} />
                  <Skeleton h={11} w="50%" style={{ marginTop: 4, marginLeft: "auto" }} />
                </div>
              </div>
            ))}
          </div>

          {/* ── 6. Sentimiento del mercado ── */}
          <div style={{ ...card, padding: 18 }}>
            <div style={{ ...label, marginBottom: 14 }}>Sentimiento del mercado</div>
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", height: 6, borderRadius: 99, overflow: "hidden" }}>
                  <div style={{ flex: 28, background: "var(--s-neg)" }} />
                  <div style={{ flex: 22, background: "var(--s-bg-3)" }} />
                  <div style={{ flex: 50, background: "var(--s-pos)" }} />
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8, fontSize: 10, color: "var(--s-fg-3)", fontFamily: "JetBrains Mono, monospace" }}>
                  <span>NEG 28%</span><span>NEU 22%</span><span>POS 50%</span>
                </div>
              </div>
              <div style={{ textAlign: "right", flexShrink: 0 }}>
                <div style={{ fontSize: 12, padding: "3px 10px", borderRadius: 6, background: "oklch(0.76 0.16 148 / 0.15)", color: "var(--s-pos)", border: "1px solid oklch(0.76 0.16 148 / 0.3)" }}>
                  Optimista
                </div>
                <Skeleton h={11} w={70} style={{ marginTop: 8, marginLeft: "auto" }} />
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

export default Home
