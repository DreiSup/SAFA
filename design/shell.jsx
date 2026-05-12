/* global React */

// ────────────────────────────────────────────────────────────────
// Tiny inline icons (stroke icons, lucide-style)
// ────────────────────────────────────────────────────────────────
const Ic = ({ d, size = 16, fill = false, stroke = "currentColor", sw = 1.6 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={fill ? stroke : "none"} stroke={stroke} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
    {typeof d === "string" ? <path d={d} /> : d}
  </svg>
);

const Icons = {
  home:    <Ic d="M3 11l9-8 9 8M5 10v10h14V10" />,
  micro:   <Ic d="M3 12h4l3-8 4 16 3-8h4" />,
  macro:   <Ic d="M3 17l6-6 4 4 8-9M21 6h-4M21 6v4" />,
  chart:   <Ic d="M4 20V8M10 20V4M16 20v-7M22 20H2" />,
  compare: <Ic d="M4 6h11M4 12h7M4 18h13M21 6h-2v12h2" />,
  user:    <Ic d="M4 21v-2a4 4 0 014-4h8a4 4 0 014 4v2M12 11a4 4 0 100-8 4 4 0 000 8z" />,
  audio:   <Ic d="M8 18a3 3 0 11-3-3h3v3zM21 14a3 3 0 11-3-3h3v3zM8 15V5l13-2v10" />,
  play:    <Ic d="M6 4l14 8-14 8z" fill />,
  pause:   <Ic d={<g><rect x="6" y="4" width="4" height="16" rx="1"/><rect x="14" y="4" width="4" height="16" rx="1"/></g>} fill />,
  search:  <Ic d="M21 21l-5-5M17 11a6 6 0 11-12 0 6 6 0 0112 0z" />,
  arrow:   <Ic d="M5 12h14M13 6l6 6-6 6" />,
  up:      <Ic d="M5 19l14-14M9 5h10v10" />,
  down:    <Ic d="M5 5l14 14M9 19h10V9" />,
  plus:    <Ic d="M12 5v14M5 12h14" />,
  check:   <Ic d="M5 12l4 4L19 7" />,
  expand:  <Ic d="M4 14v6h6M20 10V4h-6M20 4l-7 7M4 20l7-7" />,
  collapse:<Ic d="M14 4h6v6M10 20H4v-6M14 10l6-6M4 20l6-6" />,
  globe:   <Ic d="M12 22a10 10 0 100-20 10 10 0 000 20zM2 12h20M12 2a14 14 0 010 20M12 2a14 14 0 000 20" />,
  bell:    <Ic d="M6 8a6 6 0 1112 0c0 7 3 9 3 9H3s3-2 3-9M10 21a2 2 0 004 0" />,
  sun:     <Ic d={<g><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></g>} />,
  moon:    <Ic d="M21 12.8A9 9 0 1111.2 3a7 7 0 009.8 9.8z" />,
  trash:   <Ic d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2M6 6l1 14a2 2 0 002 2h6a2 2 0 002-2l1-14" />,
  link:    <Ic d="M10 14a5 5 0 007 0l3-3a5 5 0 00-7-7l-1 1M14 10a5 5 0 00-7 0l-3 3a5 5 0 007 7l1-1" />,
  speaker: <Ic d="M11 5L6 9H2v6h4l5 4zM15 9a4 4 0 010 6M18 6a8 8 0 010 12" />,
};

// ────────────────────────────────────────────────────────────────
// SAFA logo + wordmark
// ────────────────────────────────────────────────────────────────
function SafaMark({ size = 22 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="11" stroke="var(--accent)" strokeWidth="1.4" />
      <circle cx="12" cy="12" r="6" stroke="var(--accent)" strokeWidth="1.4" />
      <circle cx="12" cy="12" r="1.8" fill="var(--accent)" />
      <line x1="12" y1="2" x2="12" y2="6" stroke="var(--accent)" strokeWidth="1.4" />
    </svg>
  );
}
function SafaWordmark({ size = 22 }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <SafaMark size={size} />
      <span style={{ fontWeight: 600, letterSpacing: "0.14em", fontSize: size * 0.6 }}>SAFA</span>
    </div>
  );
}

// ────────────────────────────────────────────────────────────────
// Sparkline (deterministic from seed)
// ────────────────────────────────────────────────────────────────
function rand(seed) {
  let s = seed;
  return () => { s = (s * 9301 + 49297) % 233280; return s / 233280; };
}
function sparkPath(seed, w, h, points = 30, trend = 0) {
  const r = rand(seed);
  const vals = [];
  let v = 0.5;
  for (let i = 0; i < points; i++) {
    v += (r() - 0.5) * 0.18 + trend * 0.01;
    v = Math.max(0.05, Math.min(0.95, v));
    vals.push(v);
  }
  const pts = vals.map((y, i) => [(i / (points - 1)) * w, h - y * h]);
  return { line: pts.map((p, i) => (i ? "L" : "M") + p[0].toFixed(1) + " " + p[1].toFixed(1)).join(" "),
           area: "M0," + h + " " + pts.map(p => "L" + p[0].toFixed(1) + " " + p[1].toFixed(1)).join(" ") + " L" + w + "," + h + "Z",
           last: pts[pts.length - 1] };
}
function Spark({ seed = 1, w = 80, h = 24, color = "var(--pos)", trend = 0.3, fill = false }) {
  const { line, area } = sparkPath(seed, w, h, 30, trend);
  return (
    <svg width={w} height={h} style={{ display: "block" }}>
      {fill && <path d={area} fill={color} opacity="0.12" />}
      <path d={line} fill="none" stroke={color} strokeWidth="1.4" strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  );
}

// ────────────────────────────────────────────────────────────────
// Sidebar + audio mini-player
// ────────────────────────────────────────────────────────────────
function Sidebar({ active = "home", expanded = true, onNavigate }) {
  const nav = [
    { id: "home",    label: "Inicio",   icon: Icons.home },
    { id: "micro",   label: "Micro",    icon: Icons.micro },
    { id: "macro",   label: "Macro",    icon: Icons.macro },
    { id: "chart",   label: "Gráficas", icon: Icons.chart },
    { id: "compare", label: "Comparar", icon: Icons.compare },
    { id: "profile", label: "Perfil",   icon: Icons.user },
  ];
  const w = expanded ? 220 : 64;
  return (
    <aside style={{
      width: w, flexShrink: 0,
      borderRight: "1px solid var(--border)",
      background: "var(--bg)",
      display: "flex", flexDirection: "column",
      transition: "width 200ms ease",
      height: "100%",
    }}>
      <div style={{ padding: expanded ? "20px 18px" : "20px 0", display: "flex", justifyContent: expanded ? "flex-start" : "center" }}>
        {expanded ? <SafaWordmark size={20} /> : <SafaMark size={22} />}
      </div>

      {/* context label */}
      {expanded && (
        <div style={{ padding: "6px 18px 14px", fontSize: 10, color: "var(--fg-3)", letterSpacing: "0.16em", textTransform: "uppercase" }}>
          Navegación
        </div>
      )}

      <nav style={{ display: "flex", flexDirection: "column", gap: 2, padding: expanded ? "0 10px" : "0 12px", flex: 1 }}>
        {nav.map(n => {
          const isActive = n.id === active;
          return (
            <a key={n.id} onClick={() => onNavigate && onNavigate(n.id)}
              style={{
                display: "flex", alignItems: "center", gap: 12,
                padding: expanded ? "9px 10px" : "10px",
                justifyContent: expanded ? "flex-start" : "center",
                borderRadius: 8,
                color: isActive ? "var(--fg)" : "var(--fg-2)",
                background: isActive ? "var(--bg-2)" : "transparent",
                fontSize: 13, fontWeight: isActive ? 500 : 400,
                cursor: "pointer", transition: "all 120ms ease",
              }}>
              <span style={{ width: 16, height: 16, display: "flex", alignItems: "center" }}>{n.icon}</span>
              {expanded && <span>{n.label}</span>}
              {isActive && expanded && <span style={{ marginLeft: "auto", width: 4, height: 4, borderRadius: 99, background: "var(--accent)" }} />}
            </a>
          );
        })}
      </nav>

      {/* audio mini-player */}
      <AudioMiniPlayer expanded={expanded} onClick={() => onNavigate && onNavigate("audio")} active={active === "audio"} />

      {/* user chip */}
      <div style={{
        margin: expanded ? 12 : "12px auto", marginTop: 8,
        padding: expanded ? "8px 10px" : 0,
        borderRadius: 8,
        display: "flex", alignItems: "center", gap: 10,
        background: expanded ? "var(--bg-1)" : "transparent",
        border: expanded ? "1px solid var(--border)" : "none",
      }}>
        <div style={{
          width: 28, height: 28, borderRadius: "50%",
          background: "var(--bg-3)", display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 11, fontWeight: 600, color: "var(--fg-1)", flexShrink: 0,
          border: "1px solid var(--border-strong)",
        }}>MR</div>
        {expanded && (
          <div style={{ minWidth: 0, flex: 1 }}>
            <div style={{ fontSize: 12, fontWeight: 500, lineHeight: 1.2 }}>Mateo R.</div>
            <div style={{ fontSize: 10, color: "var(--fg-3)" }}>Plan Pro</div>
          </div>
        )}
      </div>
    </aside>
  );
}

function AudioMiniPlayer({ expanded, onClick, active }) {
  const [playing, setPlaying] = React.useState(true);
  const progress = 0.34;
  if (!expanded) {
    return (
      <button onClick={onClick} style={{
        margin: "0 auto 10px",
        width: 40, height: 40, borderRadius: 999,
        background: active ? "var(--accent)" : "var(--bg-2)",
        color: active ? "var(--accent-fg)" : "var(--accent)",
        border: "1px solid " + (active ? "transparent" : "var(--border-strong)"),
        display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer",
        position: "relative",
      }} title="Reporte de hoy">
        {Icons.audio}
        <span style={{ position: "absolute", top: -2, right: -2, width: 8, height: 8, borderRadius: 99, background: "var(--accent)" }} />
      </button>
    );
  }
  return (
    <div style={{
      margin: "10px 12px", padding: 12,
      background: active ? "var(--bg-2)" : "var(--bg-1)",
      border: "1px solid " + (active ? "var(--accent)" : "var(--border)"),
      borderRadius: 10,
    }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
        <span style={{ fontSize: 10, color: "var(--accent)", letterSpacing: "0.16em", textTransform: "uppercase", fontWeight: 600 }}>Reporte · Hoy</span>
        <span className="live-dot" />
      </div>
      <div onClick={onClick} style={{ fontSize: 12, color: "var(--fg)", lineHeight: 1.3, marginBottom: 10, cursor: "pointer" }}>
        Tu portafolio se mueve con el BTC hoy
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <button onClick={(e) => { e.stopPropagation(); setPlaying(p => !p); }} style={{
          width: 30, height: 30, borderRadius: 99, background: "var(--accent)", color: "var(--accent-fg)",
          border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
          flexShrink: 0,
        }}>{playing ? Icons.pause : Icons.play}</button>
        <div style={{ flex: 1 }}>
          <div style={{ height: 3, background: "var(--bg-3)", borderRadius: 99, overflow: "hidden" }}>
            <div style={{ width: (progress * 100) + "%", height: "100%", background: "var(--accent)" }} />
          </div>
          <div className="mono" style={{ fontSize: 9.5, color: "var(--fg-3)", marginTop: 4, display: "flex", justifyContent: "space-between" }}>
            <span>1:42</span><span>5:08</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────────────
// Top bar (used inside main app screens)
// ────────────────────────────────────────────────────────────────
function TopBar({ title, subtitle, right, breadcrumb }) {
  return (
    <header style={{
      padding: "20px 32px",
      borderBottom: "1px solid var(--border)",
      display: "flex", alignItems: "center", justifyContent: "space-between",
      gap: 24,
    }}>
      <div>
        {breadcrumb && <div style={{ fontSize: 11, color: "var(--fg-3)", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 4 }}>{breadcrumb}</div>}
        <h1 style={{ margin: 0, fontSize: 22, fontWeight: 500, letterSpacing: "-0.02em" }}>{title}</h1>
        {subtitle && <div style={{ fontSize: 13, color: "var(--fg-2)", marginTop: 2 }}>{subtitle}</div>}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>{right}</div>
    </header>
  );
}

// ────────────────────────────────────────────────────────────────
// Frame: full app shell (sidebar + content)
// ────────────────────────────────────────────────────────────────
function AppShell({ active, expanded = true, children, onNavigate }) {
  return (
    <div style={{
      width: "100%", height: "100%",
      display: "flex",
      background: "var(--bg)",
      color: "var(--fg)",
      overflow: "hidden",
    }}>
      <Sidebar active={active} expanded={expanded} onNavigate={onNavigate} />
      <main style={{ flex: 1, overflow: "auto", display: "flex", flexDirection: "column" }}>
        {children}
      </main>
    </div>
  );
}

// expose
Object.assign(window, { Icons, SafaMark, SafaWordmark, Spark, sparkPath, Sidebar, AudioMiniPlayer, TopBar, AppShell });
