import { useState } from 'react'                                               
  import { Link, useLocation } from 'react-router-dom'
  import { Home, Activity, TrendingUp, BarChart2, Columns2, User, ChevronLeft,   
  ChevronRight } from 'lucide-react'                                             
   
  const NAV = [                                                                  
    { id: 'home',    label: 'Inicio',   icon: Home,       to: '/',
  enabled: true  },                                                              
    { id: 'micro',   label: 'Micro',    icon: Activity,   to: '/home',
  enabled: true  },                                                              
    { id: 'macro',   label: 'Macro',    icon: TrendingUp, to: '/markets',
  enabled: true  },                                                              
    { id: 'chart',   label: 'Gráficas', icon: BarChart2,  to: '/chart',
  enabled: true  },                                                              
    { id: 'compare', label: 'Comparar', icon: Columns2,   to: null,
  enabled: false },                                                              
    { id: 'profile', label: 'Perfil',   icon: User,       to: null,
  enabled: false },                                                              
  ]
                                                                                 
  function SafaMark() {                                 
    return (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="11" stroke="var(--s-accent)" strokeWidth="1.4"
   />
        <circle cx="12" cy="12" r="6"  stroke="var(--s-accent)" strokeWidth="1.4"
   />                                                                            
        <circle cx="12" cy="12" r="1.8" fill="var(--s-accent)" />
        <line x1="12" y1="2" x2="12" y2="6" stroke="var(--s-accent)"             
  strokeWidth="1.4" />                                                           
      </svg>
    )                                                                            
  }                                                     

  const Sidebar = () => {                                                        
    const [expanded, setExpanded] = useState(true)
    const { pathname } = useLocation()                                           
                                                        
    const isActive = (to: string | null) => {
      if (!to) return false
      return to === '/' ? pathname === '/' : pathname.startsWith(to)
    }                                                                            
   
    return (                                                                     
      <aside style={{                                   
        width: expanded ? 220 : 64, flexShrink: 0,
        borderRight: '1px solid var(--s-border)',                                
        background: 'var(--s-bg)',
        display: 'flex', flexDirection: 'column',                                
        transition: 'width 200ms ease',                 
        height: '100vh',                                                         
        overflow: 'hidden',
      }}>                                                                        
        {/* Logo */}                                    
        <div style={{
          padding: expanded ? '20px 18px' : '20px 0',
          display: 'flex', justifyContent: expanded ? 'space-between' : 'center',
   alignItems: 'center',                                                         
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>       
            <SafaMark />                                                         
            {expanded && <span style={{ fontWeight: 600, letterSpacing: '0.14em',
   fontSize: 13, color: 'var(--s-fg)' }}>SAFA</span>}                            
          </div>                                        
          {expanded && (                                                         
            <button onClick={() => setExpanded(false)} style={{ background:
  'transparent', border: 'none', cursor: 'pointer', color: 'var(--s-fg-3)',      
  display: 'flex', padding: 4, borderRadius: 6 }}>
              <ChevronLeft size={16} />                                          
            </button>                                                            
          )}
        </div>                                                                   
                                                        
        {/* Expand button cuando está colapsado */}
        {!expanded && (
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 
  8 }}>
            <button onClick={() => setExpanded(true)} style={{ background:       
  'transparent', border: 'none', cursor: 'pointer', color: 'var(--s-fg-3)',      
  display: 'flex', padding: 4, borderRadius: 6 }}>
              <ChevronRight size={16} />                                         
            </button>                                                            
          </div>
        )}                                                                       
                                                                               
        {expanded && (
          <div style={{ padding: '6px 18px 14px', fontSize: 10, color: 
  'var(--s-fg-3)', letterSpacing: '0.16em', textTransform: 'uppercase' }}>       
            Navegación
          </div>                                                                 
        )}                                                                     
                                                                                 
        {/* Nav */}
        <nav style={{ display: 'flex', flexDirection: 'column', gap: 2, padding: 
  expanded ? '0 10px' : '0 12px', flex: 1 }}>                                    
          {NAV.map(({ id, label, icon: Icon, to, enabled }) => {
            const active = isActive(to)                                          
            const item = (                                                     
              <span style={{
                display: 'flex', alignItems: 'center', gap: 12,                  
                padding: expanded ? '9px 10px' : '10px',
                justifyContent: expanded ? 'flex-start' : 'center',              
                borderRadius: 8,                                                 
                color: !enabled ? 'var(--s-fg-3)' : active ? 'var(--s-fg)' : 
  'var(--s-fg-2)',                                                               
                background: active ? 'var(--s-bg-2)' : 'transparent',          
                fontSize: 13, fontWeight: active ? 500 : 400,                    
                cursor: enabled ? 'pointer' : 'default',                       
                transition: 'all 120ms ease',                                    
                width: '100%',
              }}>                                                                
                <Icon size={16} strokeWidth={1.6} />                           
                {expanded && <span style={{ flex: 1 }}>{label}</span>}
                {expanded && active && <span style={{ width: 4, height: 4,       
  borderRadius: 99, background: 'var(--s-accent)', flexShrink: 0 }} />}          
                {expanded && !enabled && (                                       
                  <span style={{ fontSize: 9, color: 'var(--s-fg-3)', border:    
  '1px solid var(--s-border-strong)', padding: '1px 5px', borderRadius: 4 }}>    
                    Pronto
                  </span>                                                        
                )}                                                             
              </span>
            )

            return to && enabled                                                 
              ? <Link key={id} to={to} style={{ textDecoration: 'none' 
  }}>{item}</Link>                                                               
              : <div key={id}>{item}</div>                                     
          })}
        </nav>                                                                   
  
        {/* Audio mini-player placeholder */}                                    
        {expanded && (                                                         
          <div style={{ margin: '10px 12px', padding: 12, background: 
  'var(--s-bg-1)', border: '1px solid var(--s-border)', borderRadius: 10 }}>     
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 
  'space-between', marginBottom: 6 }}>                                           
              <span style={{ fontSize: 10, color: 'var(--s-accent)',           
  letterSpacing: '0.16em', textTransform: 'uppercase', fontWeight: 600 }}>Reporte
   · Hoy</span>                                                                
              <div style={{ width: 6, height: 6, borderRadius: '50%', background:
   'var(--s-accent)' }} />                                                     
            </div>
            <div style={{ fontSize: 12, color: 'var(--s-fg-2)', lineHeight: 1.3 
  }}>Disponible próximamente</div>                                               
          </div>
        )}                                                                       
                                                                               
        {/* User chip */}                                                        
        <div style={{
          margin: expanded ? 12 : '12px auto', marginTop: 8,                     
          padding: expanded ? '8px 10px' : 0,                                  
          borderRadius: 8,                                                       
          display: 'flex', alignItems: 'center', gap: 10,
          background: expanded ? 'var(--s-bg-1)' : 'transparent',                
          border: expanded ? '1px solid var(--s-border)' : 'none',             
        }}>                                                                      
          <div style={{ width: 28, height: 28, borderRadius: '50%', background: 
  'var(--s-bg-3)', display: 'flex', alignItems: 'center', justifyContent:        
  'center', fontSize: 11, fontWeight: 600, color: 'var(--s-fg-1)', flexShrink: 0,
   border: '1px solid var(--s-border-strong)' }}>                                
            A                                                                  
          </div>
          {expanded && (
            <div style={{ minWidth: 0, flex: 1 }}>
              <div style={{ fontSize: 12, fontWeight: 500, color: 'var(--s-fg)'  
  }}>Andrei</div>
              <div style={{ fontSize: 10, color: 'var(--s-fg-3)' }}>SAFA</div>   
            </div>                                                               
          )}
        </div>                                                                   
      </aside>                                                                 
    )
  }

  export default Sidebar