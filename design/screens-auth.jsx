/* global React, Icons, SafaMark, SafaWordmark, Spark, Sidebar, AudioMiniPlayer, TopBar, AppShell */

// ────────────────────────────────────────────────────────────────
// 1. LANDING
// ────────────────────────────────────────────────────────────────
function LandingScreen() {
  return (
    <div style={{ width: "100%", height: "100%", background: "var(--bg)", color: "var(--fg)", overflow: "hidden", position: "relative" }}>
      {/* minimal top */}
      <div style={{ position: "absolute", top: 28, left: 48, right: 48, display: "flex", justifyContent: "space-between", alignItems: "center", zIndex: 2 }}>
        <SafaWordmark size={20} />
        <div style={{ display: "flex", gap: 10 }}>
          <button className="btn btn-link" style={{ height: 36, padding: "0 12px" }}>Iniciar sesión</button>
          <button className="btn btn-primary">Crear cuenta</button>
        </div>
      </div>

      {/* hero */}
      <div style={{
        height: "100%",
        display: "grid",
        gridTemplateColumns: "1.05fr 1fr",
        alignItems: "center",
        padding: "0 96px",
        gap: 72,
      }}>
        {/* left: tagline */}
        <div>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "5px 11px", border: "1px solid var(--border-strong)", borderRadius: 999, fontSize: 11, color: "var(--fg-2)", letterSpacing: "0.04em", marginBottom: 28 }}>
            <span className="live-dot" /> Reporte de hoy disponible
          </div>
          <h1 style={{
            margin: 0, fontSize: 78, lineHeight: 0.96, fontWeight: 500,
            letterSpacing: "-0.04em",
          }}>
            Conecta tu dinero<br/>con el <span style={{ color: "var(--accent)", fontStyle: "italic", fontWeight: 400 }}>mercado.</span>
          </h1>
          <p style={{ marginTop: 28, fontSize: 17, lineHeight: 1.5, color: "var(--fg-2)", maxWidth: 460, fontWeight: 400 }}>
            SAFA escucha tus finanzas y los mercados globales — y cada mañana te entrega un informe de audio que une las dos historias.
          </p>
          <div style={{ marginTop: 44, display: "flex", gap: 12, alignItems: "center" }}>
            <button className="btn btn-accent btn-xl">Crear cuenta</button>
            <button className="btn btn-ghost btn-xl">Iniciar sesión</button>
          </div>
          <div style={{ marginTop: 56, display: "flex", gap: 32, color: "var(--fg-3)", fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase" }}>
            <span>Datos en vivo</span>
            <span>Cifrado E2E</span>
            <span>Disponible solo por invitación</span>
          </div>
        </div>

        {/* right: hero audio card */}
        <HeroAudioCard />
      </div>

      {/* corner ticker, very faint */}
      <div className="mono" style={{
        position: "absolute", bottom: 28, left: 96, right: 96,
        display: "flex", justifyContent: "space-between",
        fontSize: 11, color: "var(--fg-3)", letterSpacing: "0.06em",
      }}>
        <span>BTC <span style={{ color: "var(--fg-1)" }}>67,420.18</span> <span className="pos">+1.84%</span></span>
        <span>S&amp;P 500 <span style={{ color: "var(--fg-1)" }}>5,318.42</span> <span className="pos">+0.42%</span></span>
        <span>EUR/USD <span style={{ color: "var(--fg-1)" }}>1.0843</span> <span className="neg">−0.18%</span></span>
        <span>ORO <span style={{ color: "var(--fg-1)" }}>2,341.50</span> <span className="pos">+0.31%</span></span>
        <span style={{ color: "var(--fg-2)" }}>29 abr 2026 · 09:14 CET</span>
      </div>
    </div>
  );
}

function HeroAudioCard() {
  return (
    <div style={{
      background: "var(--bg-1)",
      border: "1px solid var(--border)",
      borderRadius: 16,
      padding: 28,
      position: "relative",
      overflow: "hidden",
    }}>
      {/* day label */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ width: 26, height: 26, borderRadius: 8, background: "var(--accent-dim)", color: "var(--accent)", display: "inline-flex", alignItems: "center", justifyContent: "center" }}>{Icons.audio}</span>
          <div>
            <div style={{ fontSize: 11, color: "var(--accent)", letterSpacing: "0.16em", textTransform: "uppercase", fontWeight: 600 }}>Tu reporte · 29 abr</div>
            <div style={{ fontSize: 11, color: "var(--fg-3)", marginTop: 2 }}>generado a las 06:00 CET</div>
          </div>
        </div>
        <span className="badge"><span className="live-dot" />En vivo</span>
      </div>

      <div style={{ fontSize: 26, lineHeight: 1.25, fontWeight: 500, letterSpacing: "-0.02em", color: "var(--fg)", marginBottom: 6 }}>
        "Buenos días, Mateo. Tu cartera abre con un <span style={{ color: "var(--pos)" }}>+1.2%</span> tras la subida del BTC, y tus gastos de abril cierran <span style={{ color: "var(--accent)" }}>14% bajo presupuesto</span>."
      </div>
      <div style={{ fontSize: 13, color: "var(--fg-3)", marginBottom: 28, fontStyle: "italic" }}>
        — extracto del informe
      </div>

      {/* waveform */}
      <Waveform />

      <div style={{ display: "flex", alignItems: "center", gap: 14, marginTop: 18 }}>
        <button className="btn btn-accent" style={{ width: 52, height: 52, borderRadius: 999, padding: 0 }}>{Icons.play}</button>
        <div className="mono tnum" style={{ display: "flex", flexDirection: "column", flex: 1 }}>
          <div style={{ fontSize: 13, color: "var(--fg)", letterSpacing: "0.04em" }}>00:00 / 05:08</div>
          <div style={{ fontSize: 11, color: "var(--fg-3)", marginTop: 4 }}>EPISODIO 142 · ESPAÑOL</div>
        </div>
        <button className="btn btn-ghost">Leer transcripción</button>
      </div>
    </div>
  );
}

function Waveform({ bars = 64, color = "var(--accent)" }) {
  // deterministic bars
  const heights = Array.from({ length: bars }, (_, i) => {
    const t = i / bars;
    const env = Math.sin(t * Math.PI) * 0.6 + 0.3;
    const noise = ((Math.sin(i * 1.7) + 1) / 2) * 0.7 + 0.3;
    return env * noise;
  });
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 2, height: 48 }}>
      {heights.map((h, i) => (
        <div key={i} style={{
          flex: 1,
          height: Math.max(2, h * 48),
          background: i < bars * 0.18 ? color : "var(--bg-3)",
          borderRadius: 1,
        }} />
      ))}
    </div>
  );
}

// ────────────────────────────────────────────────────────────────
// 2. LOGIN
// ────────────────────────────────────────────────────────────────
function LoginScreen() {
  return (
    <AuthShell title="Bienvenido de vuelta" subtitle="Inicia sesión para ver tu reporte de hoy">
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <div>
          <label className="label">Correo</label>
          <input className="input" placeholder="tu@correo.com" defaultValue="mateo@safa.app" />
        </div>
        <div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <label className="label">Contraseña</label>
            <a className="label" style={{ color: "var(--fg-2)", cursor: "pointer" }}>¿Olvidaste?</a>
          </div>
          <input className="input" type="password" placeholder="••••••••" defaultValue="••••••••••" />
        </div>
        <button className="btn btn-primary btn-lg" style={{ marginTop: 6 }}>Iniciar sesión</button>
        <div style={{ display: "flex", alignItems: "center", gap: 10, color: "var(--fg-3)", fontSize: 11, margin: "8px 0" }}>
          <div style={{ flex: 1, height: 1, background: "var(--border)" }} /> O <div style={{ flex: 1, height: 1, background: "var(--border)" }} />
        </div>
        <button className="btn btn-ghost btn-lg">Continuar con Google</button>
        <div style={{ textAlign: "center", fontSize: 13, color: "var(--fg-2)", marginTop: 12 }}>
          ¿No tienes cuenta? <a style={{ color: "var(--fg)", textDecoration: "underline", textDecorationColor: "var(--border-strong)", textUnderlineOffset: 3, cursor: "pointer" }}>Crear una</a>
        </div>
      </div>
    </AuthShell>
  );
}

// ────────────────────────────────────────────────────────────────
// 3. SIGN UP
// ────────────────────────────────────────────────────────────────
function SignUpScreen() {
  return (
    <AuthShell title="Crea tu cuenta" subtitle="Tres minutos. Empieza a escuchar tus finanzas.">
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <div>
          <label className="label">Nombre</label>
          <input className="input" placeholder="Mateo Ruiz" defaultValue="Mateo Ruiz" />
        </div>
        <div>
          <label className="label">Correo</label>
          <input className="input" placeholder="tu@correo.com" defaultValue="mateo@safa.app" />
        </div>
        <div>
          <label className="label">Contraseña</label>
          <input className="input" type="password" placeholder="Mínimo 10 caracteres" defaultValue="••••••••••••" />
          <div style={{ display: "flex", gap: 4, marginTop: 6 }}>
            {[0,1,2,3].map(i => (
              <div key={i} style={{ flex: 1, height: 3, background: i < 3 ? "var(--pos)" : "var(--bg-3)", borderRadius: 99 }} />
            ))}
          </div>
          <div style={{ fontSize: 11, color: "var(--fg-3)", marginTop: 6 }}>Fuerza: <span style={{ color: "var(--pos)" }}>fuerte</span></div>
        </div>
        <label style={{ display: "flex", alignItems: "flex-start", gap: 10, fontSize: 12, color: "var(--fg-2)", marginTop: 4 }}>
          <span style={{ width: 16, height: 16, borderRadius: 4, border: "1px solid var(--border-strong)", background: "var(--accent)", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", color: "var(--accent-fg)" }}>{Icons.check}</span>
          <span>Acepto los <a style={{ color: "var(--fg)" }}>Términos</a> y la <a style={{ color: "var(--fg)" }}>Política de privacidad</a> de SAFA.</span>
        </label>
        <button className="btn btn-accent btn-lg" style={{ marginTop: 6 }}>Crear cuenta</button>
        <div style={{ textAlign: "center", fontSize: 13, color: "var(--fg-2)", marginTop: 8 }}>
          ¿Ya tienes cuenta? <a style={{ color: "var(--fg)", textDecoration: "underline", textDecorationColor: "var(--border-strong)", textUnderlineOffset: 3, cursor: "pointer" }}>Iniciar sesión</a>
        </div>
      </div>
    </AuthShell>
  );
}

function AuthShell({ title, subtitle, children }) {
  return (
    <div style={{ width: "100%", height: "100%", background: "var(--bg)", color: "var(--fg)", display: "flex", flexDirection: "column", position: "relative" }}>
      {/* faint corner ticker */}
      <div style={{ position: "absolute", top: 28, left: 32, right: 32, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <SafaWordmark size={18} />
        <div className="mono" style={{ fontSize: 11, color: "var(--fg-3)", letterSpacing: "0.08em" }}>29 ABR 2026</div>
      </div>

      <div style={{ flex: 1, display: "grid", placeItems: "center", padding: "0 32px" }}>
        <div style={{ width: 380, padding: 32, background: "var(--bg-1)", border: "1px solid var(--border)", borderRadius: 14 }}>
          <h1 style={{ margin: 0, fontSize: 24, fontWeight: 500, letterSpacing: "-0.02em" }}>{title}</h1>
          {subtitle && <div style={{ fontSize: 13, color: "var(--fg-2)", marginTop: 6, marginBottom: 26 }}>{subtitle}</div>}
          {children}
        </div>
      </div>

      <div style={{ position: "absolute", bottom: 24, left: 32, right: 32, display: "flex", justifyContent: "space-between", color: "var(--fg-3)", fontSize: 11 }}>
        <span>© 2026 SAFA Capital</span>
        <span style={{ display: "flex", gap: 18 }}><span>Privacidad</span><span>Términos</span><span>Soporte</span></span>
      </div>
    </div>
  );
}

Object.assign(window, { LandingScreen, LoginScreen, SignUpScreen, Waveform, HeroAudioCard });
