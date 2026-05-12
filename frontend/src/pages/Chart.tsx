import type React from "react"

const Skeleton = ({ w, h, style = {} }: { w?: string | number; h?: string | number; style?: React.CSSProperties }) => (
  <div
    style={{
      width: w ?? "100%",
      height: h ?? 16,
      borderRadius: 6,
      background: "var(--s-bg-3)",
      ...style,
    }}
  />
)

const LiveDot = () => (
  <span style={{
    display: "inline-block",
    width: 6,
    height: 6,
    borderRadius: "50%",
    background: "var(--s-pos)",
    flexShrink: 0,
  }} />
)

const Chart = () => {
  return (
    <div style={{
      padding: 32,
      display: "grid",
      gridTemplateColumns: "1.6fr 1fr",
      gap: 24,
      alignContent: "start",
    }}>

      {/* ── 1. Portfolio hero ── */}
      <div style={{ background: "var(--s-bg-1)", border: "1px solid var(--s-border)", borderRadius: 10, padding: 28 }}>
        <div style={{ fontSize: 11, color: "var(--s-fg-3)", letterSpacing: "0.16em", textTransform: "uppercase" }}>
          Valor del portafolio
        </div>
        <Skeleton h={64} w="60%" style={{ marginTop: 10 }} />
        <div style={{ marginTop: 12, display: "flex", alignItems: "center", gap: 12 }}>
          <Skeleton w={100} h={24} />
          <Skeleton w={80} h={16} />
        </div>
        <Skeleton h={120} style={{ marginTop: 20 }} />
      </div>

      {/* ── 2. Sentimiento ── */}
      <div style={{ background: "var(--s-bg-1)", border: "1px solid var(--s-border)", borderRadius: 10, padding: 22 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
          <div style={{ fontSize: 11, color: "var(--s-fg-3)", letterSpacing: "0.16em", textTransform: "uppercase" }}>
            Sentimiento agregado
          </div>
          <span style={{ fontSize: 11, color: "var(--s-fg-3)" }}>FinBERT · 24h</span>
        </div>
        <Skeleton h={38} w="50%" />
        <Skeleton h={14} w="70%" style={{ marginTop: 8 }} />
        <div style={{ marginTop: 20 }}>
          <div style={{ height: 8, borderRadius: 99, overflow: "hidden", display: "flex" }}>
            <div style={{ flex: 28, background: "var(--s-neg)" }} />
            <div style={{ flex: 22, background: "var(--s-bg-3)" }} />
            <div style={{ flex: 50, background: "var(--s-pos)" }} />
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8 }}>
            <Skeleton w={40} h={10} />
            <Skeleton w={40} h={10} />
            <Skeleton w={40} h={10} />
          </div>
        </div>
        <Skeleton h={14} style={{ marginTop: 18 }} />
        <Skeleton h={14} w="85%" style={{ marginTop: 6 }} />
      </div>

      {/* ── 3. Tickers en vivo ── */}
      <div style={{ background: "var(--s-bg-1)", border: "1px solid var(--s-border)", borderRadius: 10, gridColumn: "span 2" }}>
        <div style={{
          padding: "16px 20px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: "1px solid var(--s-border)",
        }}>
          <span style={{ fontSize: 13, fontWeight: 500 }}>Tickers en vivo</span>
          <LiveDot />
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr" }}>
          {["BTC · Bitcoin", "SPX · S&P 500"].map((label, i) => (
            <div key={i} style={{
              padding: 22,
              borderRight: i === 0 ? "1px solid var(--s-border)" : "none",
              display: "flex",
              flexDirection: "column",
              gap: 14,
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 12, color: "var(--s-fg-3)", marginBottom: 8 }}>{label}</div>
                  <Skeleton h={36} w="55%" />
                  <Skeleton h={14} w="30%" style={{ marginTop: 6 }} />
                </div>
                <div style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  fontSize: 11,
                  color: "var(--s-fg-3)",
                  border: "1px solid var(--s-border)",
                  borderRadius: 6,
                  padding: "4px 8px",
                }}>
                  <LiveDot /> Live
                </div>
              </div>
              <Skeleton h={40} />
            </div>
          ))}
        </div>
      </div>

      {/* ── 4. Posiciones ── */}
      <div style={{ background: "var(--s-bg-1)", border: "1px solid var(--s-border)", borderRadius: 10, gridColumn: "span 2" }}>
        <div style={{
          padding: "16px 20px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: "1px solid var(--s-border)",
        }}>
          <span style={{ fontSize: 13, fontWeight: 500 }}>Posiciones</span>
          <div style={{ display: "flex", gap: 4 }}>
            {["Todo", "Cripto", "ETFs", "Acciones"].map((tab, i) => (
              <div key={tab} style={{
                fontSize: 12,
                padding: "4px 12px",
                borderRadius: 6,
                background: i === 0 ? "var(--s-bg-3)" : "transparent",
                color: i === 0 ? "var(--s-fg)" : "var(--s-fg-3)",
                cursor: "pointer",
              }}>
                {tab}
              </div>
            ))}
          </div>
        </div>

        {/* Column headers */}
        <div style={{
          padding: "8px 20px",
          fontSize: 10,
          color: "var(--s-fg-3)",
          letterSpacing: "0.16em",
          textTransform: "uppercase",
          display: "grid",
          gridTemplateColumns: "1.2fr 1fr 1fr 1.2fr 0.8fr 1fr",
          gap: 12,
          borderBottom: "1px solid var(--s-border)",
        }}>
          <span>Activo</span>
          <span>Precio</span>
          <span>24h</span>
          <span>30 días</span>
          <span>Asignación</span>
          <span style={{ textAlign: "right" }}>Valor</span>
        </div>

        {/* Rows */}
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} style={{
            padding: "14px 20px",
            display: "grid",
            gridTemplateColumns: "1.2fr 1fr 1fr 1.2fr 0.8fr 1fr",
            gap: 12,
            alignItems: "center",
            borderBottom: i < 4 ? "1px solid var(--s-border)" : "none",
          }}>
            {/* Activo */}
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{
                width: 32,
                height: 32,
                borderRadius: 8,
                background: "var(--s-bg-2)",
                border: "1px solid var(--s-border)",
                flexShrink: 0,
              }} />
              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                <Skeleton w={40} h={13} />
                <Skeleton w={60} h={11} />
              </div>
            </div>
            <Skeleton w={70} h={13} />
            <Skeleton w={50} h={13} />
            {/* 30d sparkline */}
            <Skeleton h={28} />
            {/* Allocation bar */}
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ flex: 1, height: 4, background: "var(--s-bg-3)", borderRadius: 99, overflow: "hidden" }}>
                <div style={{ width: `${20 + i * 12}%`, height: "100%", background: "var(--s-accent)" }} />
              </div>
            </div>
            {/* Valor */}
            <div style={{ textAlign: "right", display: "flex", flexDirection: "column", gap: 4, alignItems: "flex-end" }}>
              <Skeleton w={80} h={13} />
              <Skeleton w={55} h={11} />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Chart
