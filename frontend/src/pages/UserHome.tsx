import { useState, useEffect } from 'react'
import { financeService, type DashboardData, type Transaction } from '@/services/financeService'

const fmt = (n: number) =>
  n.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

const EnProceso = ({ title }: { title: string }) => (
  <div style={{ background: 'var(--s-bg-1)', border: '1px solid var(--s-border)', borderRadius: 10, padding: 20 }}>
    <div style={{ fontSize: 11, color: 'var(--s-fg-3)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 12 }}>{title}</div>
    <div style={{ fontSize: 13, color: 'var(--s-fg-3)', fontStyle: 'italic' }}>En proceso</div>
  </div>
)

const UserHome = () => {
  const [dashboard, setDashboard] = useState<DashboardData | null>(null)
  const [transactions, setTransactions] = useState<Transaction[]>([])

  const today = new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' })

  useEffect(() => {
    financeService.getDashboard().then(setDashboard).catch(console.error)
    financeService.getTransactions().then(setTransactions).catch(console.error)
  }, [])

  const recent = transactions.slice(-5).reverse()
  const topCats = dashboard?.desglose_por_categoria.slice(0, 3) ?? []

  return (
    <div style={{ background: 'var(--s-bg)', minHeight: '100%', color: 'var(--s-fg)', fontFamily: 'Inter, sans-serif' }}>

      {/* TopBar */}
      <header style={{ padding: '20px 32px', borderBottom: '1px solid var(--s-border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <div style={{ fontSize: 11, color: 'var(--s-fg-3)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 4 }}>
            Inicio · {today}
          </div>
          <h1 style={{ margin: 0, fontSize: 22, fontWeight: 500, letterSpacing: '-0.02em' }}>Buenos días, Andrei.</h1>
          <div style={{ fontSize: 13, color: 'var(--s-fg-2)', marginTop: 2 }}>Tu mañana en una pasada.</div>
        </div>
      </header>

      {/* Grid principal */}
      <div style={{ padding: 32, display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 24, alignContent: 'start' }}>

        {/* COLUMNA IZQUIERDA */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

          {/* Patrimonio neto */}
          <div style={{ background: 'var(--s-bg-1)', border: '1px solid var(--s-border)', borderRadius: 10, padding: 28 }}>
            <div style={{ fontSize: 11, color: 'var(--s-fg-3)', letterSpacing: '0.16em', textTransform: 'uppercase', marginBottom: 8 }}>
              Patrimonio neto
            </div>
            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 56, fontWeight: 500, letterSpacing: '-0.03em', lineHeight: 1, color: 'var(--s-fg)', fontVariantNumeric: 'tabular-nums' }}>
              {dashboard ? <>€{fmt(dashboard.balance_total)}</> : <span style={{ color: 'var(--s-fg-3)' }}>—</span>}
            </div>
          </div>

          {/* Stats por categoría */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)' }}>
            {topCats.length === 0
              ? [0, 1, 2].map(i => (
                  <div key={i} style={{ padding: '20px 4px', borderLeft: i > 0 ? '1px solid var(--s-border)' : 'none', paddingLeft: i > 0 ? 24 : 4 }}>
                    <div style={{ fontSize: 11, color: 'var(--s-fg-3)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 8 }}>—</div>
                    <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 22, fontWeight: 500 }}>—</div>
                  </div>
                ))
              : topCats.map((cat, i) => (
                  <div key={cat.categoria} style={{ padding: '20px 4px', borderLeft: i > 0 ? '1px solid var(--s-border)' : 'none', paddingLeft: i > 0 ? 24 : 4 }}>
                    <div style={{ fontSize: 11, color: 'var(--s-fg-3)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 8 }}>
                      {cat.categoria}
                    </div>
                    <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 22, fontWeight: 500, fontVariantNumeric: 'tabular-nums' }}>
                      €{fmt(cat.total)}
                    </div>
                  </div>
                ))
            }
          </div>

          {/* Transacciones recientes */}
          <div style={{ background: 'var(--s-bg-1)', border: '1px solid var(--s-border)', borderRadius: 10, overflow: 'hidden' }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--s-border)' }}>
              <div style={{ fontSize: 13, fontWeight: 500 }}>Movimientos recientes</div>
            </div>
            {recent.length === 0
              ? <div style={{ padding: 20, fontSize: 13, color: 'var(--s-fg-3)', fontStyle: 'italic' }}>Sin transacciones</div>
              : recent.map(tx => (
                  <div key={tx.id} style={{ padding: '14px 20px', display: 'flex', alignItems: 'center', gap: 14, borderTop: '1px solid var(--s-border)' }}>
                    <div style={{ width: 28, height: 28, borderRadius: 8, background: 'var(--s-bg-2)', border: '1px solid var(--s-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, color: 'var(--s-fg-2)', fontWeight: 600, flexShrink: 0 }}>
                      {tx.concepto.charAt(0).toUpperCase()}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13, fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{tx.concepto}</div>
                      <div style={{ fontSize: 11, color: 'var(--s-fg-3)' }}>{tx.categoria} · {tx.fecha}</div>
                    </div>
                    <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 14, fontWeight: 500, fontVariantNumeric: 'tabular-nums', color: tx.monto >= 0 ? 'var(--s-pos)' : 'var(--s-neg)', flexShrink: 0 }}>
                      {tx.monto >= 0 ? '+' : ''}€{fmt(tx.monto)}
                    </div>
                  </div>
                ))
            }
          </div>
        </div>

        {/* COLUMNA DERECHA */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <EnProceso title="Reporte de hoy" />
          <EnProceso title="Mercados en vivo" />
          <EnProceso title="Sentimiento del mercado" />
        </div>
      </div>
    </div>
  )
}

export default UserHome
