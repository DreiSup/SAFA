import type React from "react"

const Skeleton = ({ w, h, style = {} }: { w?: string | number; h?: string | number; style?: React.CSSProperties }) => (
  <div style={{ width: w ?? "100%", height: h ?? 16, borderRadius: 6, background: "var(--s-bg-3)", ...style }} />
)

const CATS = [
  { name: "Vivienda",      pct: 89, flex: 980, color: "oklch(0.78 0.13 75)" },
  { name: "Comestibles",   pct: 69, flex: 412, color: "oklch(0.76 0.16 148)" },
  { name: "Transporte",    pct: 71, flex: 142, color: "oklch(0.7 0.15 220)" },
  { name: "Ocio",          pct: 87, flex: 218, color: "oklch(0.7 0.18 320)" },
  { name: "Suscripciones", pct: 87, flex: 87,  color: "oklch(0.78 0.13 75)" },
]

const card: React.CSSProperties = {
  background: "var(--s-bg-1)",
  border: "1px solid var(--s-border)",
  borderRadius: 10,
}

const label: React.CSSProperties = {
  fontSize: 11,
  color: "var(--s-fg-3)",
  letterSpacing: "0.12em",
  textTransform: "uppercase",
}

const Micro = () => {
  return (
    <div style={{ background: "var(--s-bg)", minHeight: "100%", color: "var(--s-fg)" }}>

      {/* ── TopBar ── */}
      <header style={{ padding: "20px 32px", borderBottom: "1px solid var(--s-border)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <div style={{ ...label, marginBottom: 4 }}>Micro · finanzas personales</div>
          <div style={{ fontSize: 22, fontWeight: 500, letterSpacing: "-0.02em" }}>Tu mes</div>
          <div style={{ fontSize: 13, color: "var(--s-fg-2)", marginTop: 2 }}>Ingresos, gastos y presupuesto.</div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {/* Month tabs */}
          <div style={{ display: "flex", gap: 4 }}>
            {["Mar", "Abr", "May"].map((m, i) => (
              <div key={m} style={{
                fontSize: 12, padding: "4px 12px", borderRadius: 6, cursor: "pointer",
                background: i === 1 ? "var(--s-bg-3)" : "transparent",
                color: i === 1 ? "var(--s-fg)" : "var(--s-fg-3)",
              }}>{m}</div>
            ))}
          </div>
          {/* Add button */}
          <div style={{
            fontSize: 13, padding: "6px 14px", borderRadius: 8, cursor: "pointer",
            border: "1px solid var(--s-border)", color: "var(--s-fg-2)",
          }}>+ Movimiento</div>
        </div>
      </header>

      <div style={{ padding: 32, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>

        {/* ── 1. Ingresos / Gastos / Ahorro / Distribución (span 2) ── */}
        <div style={{ ...card, padding: 24, gridColumn: "span 2" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1.4fr", gap: 32, alignItems: "center" }}>

            {/* Ingresos */}
            <div>
              <div style={label}>Ingresos</div>
              <Skeleton h={36} w="70%" style={{ marginTop: 8 }} />
              <Skeleton h={12} w="55%" style={{ marginTop: 6 }} />
            </div>

            {/* Gastos */}
            <div>
              <div style={label}>Gastos</div>
              <Skeleton h={36} w="70%" style={{ marginTop: 8 }} />
              <Skeleton h={12} w="55%" style={{ marginTop: 6 }} />
            </div>

            {/* Ahorro neto */}
            <div>
              <div style={label}>Ahorro neto</div>
              <Skeleton h={36} w="70%" style={{ marginTop: 8, background: "oklch(0.78 0.13 75 / 0.25)" }} />
              <Skeleton h={12} w="60%" style={{ marginTop: 6 }} />
            </div>

            {/* Distribución */}
            <div>
              <div style={{ ...label, marginBottom: 12 }}>Distribución</div>
              <div style={{ display: "flex", height: 12, borderRadius: 99, overflow: "hidden" }}>
                {CATS.map(c => (
                  <div key={c.name} style={{ flex: c.flex, background: c.color }} />
                ))}
                <div style={{ flex: 396, background: "var(--s-bg-3)" }} />
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 14, marginTop: 12, fontSize: 11, color: "var(--s-fg-2)" }}>
                {CATS.map(c => (
                  <span key={c.name} style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                    <span style={{ width: 8, height: 8, borderRadius: 2, background: c.color, flexShrink: 0 }} />
                    {c.name}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── 2. Saldo neto · tendencia ── */}
        <div style={{ ...card, padding: 22 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
            <div>
              <div style={{ fontSize: 13, fontWeight: 500 }}>Saldo neto · 30 días</div>
              <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginTop: 6 }}>
                <Skeleton h={22} w={100} />
                <Skeleton h={14} w={50} />
              </div>
            </div>
            <div style={{ display: "flex", gap: 4 }}>
              {["7D", "30D", "90D"].map((t, i) => (
                <div key={t} style={{
                  fontSize: 12, padding: "4px 10px", borderRadius: 6, cursor: "pointer",
                  background: i === 1 ? "var(--s-bg-3)" : "transparent",
                  color: i === 1 ? "var(--s-fg)" : "var(--s-fg-3)",
                }}>{t}</div>
              ))}
            </div>
          </div>
          {/* Chart area */}
          <Skeleton h={160} style={{ borderRadius: 8 }} />
        </div>

        {/* ── 3. Presupuestos ── */}
        <div style={{ ...card, padding: 22 }}>
          <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 18 }}>Presupuestos</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {CATS.map(c => (
              <div key={c.name}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6, fontSize: 12 }}>
                  <span>{c.name}</span>
                  <Skeleton w={90} h={13} />
                </div>
                <div style={{ height: 4, background: "var(--s-bg-3)", borderRadius: 99, overflow: "hidden" }}>
                  <div style={{ width: `${c.pct}%`, height: "100%", background: c.pct > 85 ? "var(--s-accent)" : c.color }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── 4. Movimientos (span 2) ── */}
        <div style={{ ...card, gridColumn: "span 2", overflow: "hidden" }}>
          <div style={{ padding: "16px 20px", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid var(--s-border)" }}>
            <div style={{ fontSize: 13, fontWeight: 500 }}>Movimientos</div>
            <div style={{ display: "flex", gap: 8 }}>
              {["Filtrar", "Exportar"].map(btn => (
                <div key={btn} style={{
                  fontSize: 12, padding: "4px 12px", borderRadius: 6, cursor: "pointer",
                  border: "1px solid var(--s-border)", color: "var(--s-fg-2)",
                }}>{btn}</div>
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
            gridTemplateColumns: "32px 1.4fr 1fr 0.8fr 0.6fr 0.8fr",
            gap: 12,
            borderBottom: "1px solid var(--s-border)",
          }}>
            <span />
            <span>Concepto</span>
            <span>Categoría</span>
            <span>Cuenta</span>
            <span>Fecha</span>
            <span style={{ textAlign: "right" }}>Importe</span>
          </div>

          {/* Rows */}
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} style={{
              padding: "13px 20px",
              display: "grid",
              gridTemplateColumns: "32px 1.4fr 1fr 0.8fr 0.6fr 0.8fr",
              gap: 12,
              alignItems: "center",
              borderBottom: i < 5 ? "1px solid var(--s-border)" : "none",
            }}>
              <div style={{ width: 26, height: 26, borderRadius: 7, background: "var(--s-bg-2)", border: "1px solid var(--s-border)", flexShrink: 0 }} />
              <Skeleton h={13} w="70%" />
              <Skeleton h={13} w="55%" />
              <Skeleton h={11} w="65%" />
              <Skeleton h={11} w="50%" />
              <Skeleton h={13} w="60%" style={{ marginLeft: "auto" }} />
            </div>
          ))}
        </div>

      </div>
    </div>
  )
}

export default Micro
