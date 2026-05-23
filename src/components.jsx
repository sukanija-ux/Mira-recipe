// Shared UI components: HormoneRing, ImagePlot, Badge, Button, Card, TopNav, PhaseChip, MealGap, Eyebrow

const { useState, useEffect, useRef } = React;

// Image with real photo support — shows <img> when src is provided, striped placeholder otherwise
function ImagePlot({ src, label = 'food photograph', tone = 'paper', aspect = '4/3', round = 0, style = {}, children }) {
  const [imgFailed, setImgFailed] = useState(false);
  if (src && !imgFailed) {
    return (
      <div style={{
        aspectRatio: aspect, borderRadius: round, overflow: 'hidden',
        position: 'relative', flexShrink: 0,
        ...style,
      }}>
        <img
          src={src} alt={label}
          onError={() => setImgFailed(true)}
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
        />
        {children}
      </div>
    );
  }
  const palettes = {
    paper:  { bg: 'oklch(0.90 0.018 65)', stripe: 'oklch(0.86 0.022 60)', ink: 'oklch(0.38 0.04 45)' },
    sage:   { bg: 'oklch(0.86 0.050 140)', stripe: 'oklch(0.82 0.060 140)', ink: 'oklch(0.34 0.060 140)' },
    clay:   { bg: 'oklch(0.86 0.060 40)', stripe: 'oklch(0.82 0.070 40)', ink: 'oklch(0.36 0.080 35)' },
    honey:  { bg: 'oklch(0.88 0.070 88)', stripe: 'oklch(0.84 0.080 88)', ink: 'oklch(0.36 0.080 80)' },
    plum:   { bg: 'oklch(0.82 0.045 230)', stripe: 'oklch(0.78 0.050 230)', ink: 'oklch(0.34 0.070 230)' },
    ink:    { bg: 'oklch(0.30 0.02 40)', stripe: 'oklch(0.26 0.025 40)', ink: 'oklch(0.85 0.02 65)' },
  };
  const p = palettes[tone] || palettes.paper;
  return (
    <div style={{
      aspectRatio: aspect,
      background: `repeating-linear-gradient(135deg, ${p.bg} 0 14px, ${p.stripe} 14px 28px)`,
      borderRadius: round,
      display: 'flex', alignItems: 'flex-end', justifyContent: 'flex-start',
      padding: 14, position: 'relative', color: p.ink, overflow: 'hidden',
      ...style,
    }}>
      <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, letterSpacing: '0.06em', textTransform: 'uppercase', opacity: 0.7 }}>
        ↳ {label}
      </span>
      {children}
    </div>
  );
}

// Hormone ring — concentric circles with orbiting day marker
function HormoneRing({ day, length = 28, size = 220, label = true }) {
  const phase = window.phaseForDay(day, length);
  const angle = ((day - 1) / length) * 360 - 90;
  const rad = (angle * Math.PI) / 180;
  const orbitR = size * 0.42;
  const cx = size / 2 + Math.cos(rad) * orbitR;
  const cy = size / 2 + Math.sin(rad) * orbitR;

  const segments = window.PHASES.map((p) => {
    const startA = ((p.range[0] - 1) / 28) * 360 - 90;
    const endA   = (p.range[1] / 28) * 360 - 90;
    return { ...p, startA, endA };
  });

  const arc = (startA, endA, r) => {
    const sx = size / 2 + Math.cos((startA * Math.PI) / 180) * r;
    const sy = size / 2 + Math.sin((startA * Math.PI) / 180) * r;
    const ex = size / 2 + Math.cos((endA * Math.PI) / 180) * r;
    const ey = size / 2 + Math.sin((endA * Math.PI) / 180) * r;
    const large = endA - startA > 180 ? 1 : 0;
    return `M ${sx} ${sy} A ${r} ${r} 0 ${large} 1 ${ex} ${ey}`;
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle cx={size/2} cy={size/2} r={size*0.46} fill="none" stroke="oklch(0.86 0.015 65)" strokeWidth="0.5" />
        {segments.map((s) => (
          <path key={s.id} d={arc(s.startA, s.endA, size * 0.42)}
            stroke={s.color} strokeWidth={s.id === phase.id ? 2.5 : 1} fill="none" strokeLinecap="round"
            opacity={s.id === phase.id ? 1 : 0.35} />
        ))}
        {[...Array(length)].map((_, i) => {
          const a = (i / length) * 360 - 90;
          const x1 = size/2 + Math.cos((a * Math.PI) / 180) * (size * 0.36);
          const y1 = size/2 + Math.sin((a * Math.PI) / 180) * (size * 0.36);
          const x2 = size/2 + Math.cos((a * Math.PI) / 180) * (size * 0.385);
          const y2 = size/2 + Math.sin((a * Math.PI) / 180) * (size * 0.385);
          return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="oklch(0.28 0.040 145)" strokeWidth="0.5" opacity={i % 7 === 0 ? 0.7 : 0.25} />;
        })}
        <circle cx={size/2} cy={size/2} r={size*0.28} fill="none" stroke="oklch(0.82 0.018 65)" strokeWidth="0.5" />
        <circle cx={size/2} cy={size/2} r={size*0.16} fill={phase.soft} />
        <circle cx={size/2} cy={size/2} r={size*0.16} fill="none" stroke={phase.color} strokeWidth="0.75" opacity="0.4" />
        <circle cx={cx} cy={cy} r={6} fill={phase.color} />
        <circle cx={cx} cy={cy} r={11} fill="none" stroke={phase.color} strokeWidth="0.5" opacity="0.45" />
        <text x={size/2} y={size/2 - 6} textAnchor="middle" fontFamily="Instrument Serif, serif" fontSize={size * 0.22} fill="oklch(0.28 0.040 145)">
          {day}
        </text>
        <text x={size/2} y={size/2 + 14} textAnchor="middle" fontFamily="JetBrains Mono, monospace" fontSize={9} letterSpacing="0.12em" fill="oklch(0.46 0.035 135)">
          DAY · {phase.name.toUpperCase()}
        </text>
      </svg>
      {label && (
        <div style={{ textAlign: 'center', fontFamily: 'JetBrains Mono, monospace', fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'oklch(0.46 0.035 135)' }}>
          {phase.dosha} · {length}-day cycle
        </div>
      )}
    </div>
  );
}

// Small all-caps mono label
function Eyebrow({ children, color = 'oklch(0.50 0.035 135)' }) {
  return (
    <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase', color }}>
      {children}
    </span>
  );
}

// Badge pill
function Badge({ children, tone = 'paper', size = 'sm' }) {
  const tones = {
    paper: { bg: 'oklch(0.93 0.022 90)', fg: 'oklch(0.34 0.035 140)', bd: 'oklch(0.84 0.025 95)' },
    sage:  { bg: 'oklch(0.93 0.030 140)', fg: 'oklch(0.34 0.060 140)', bd: 'oklch(0.78 0.06 140)' },
    clay:  { bg: 'oklch(0.93 0.035 40)', fg: 'oklch(0.40 0.08 35)', bd: 'oklch(0.76 0.08 35)' },
    honey: { bg: 'oklch(0.94 0.040 88)', fg: 'oklch(0.40 0.090 80)', bd: 'oklch(0.78 0.090 88)' },
    plum:  { bg: 'oklch(0.93 0.025 230)', fg: 'oklch(0.36 0.080 230)', bd: 'oklch(0.78 0.060 230)' },
    ink:   { bg: 'oklch(0.28 0.040 145)', fg: 'oklch(0.93 0.022 90)', bd: 'oklch(0.28 0.040 145)' },
  };
  const t = tones[tone] || tones.paper;
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 6,
      background: t.bg, color: t.fg, border: `1px solid ${t.bd}`,
      padding: size === 'sm' ? '5px 9px' : '7px 12px', borderRadius: 999,
      fontFamily: 'JetBrains Mono, monospace', fontSize: size === 'sm' ? 10 : 12,
      letterSpacing: '0.08em', textTransform: 'uppercase', whiteSpace: 'nowrap',
    }}>{children}</span>
  );
}

// Primary button
function Button({ children, onClick, variant = 'primary', size = 'md', style = {}, disabled = false, type = 'button' }) {
  const styles = {
    primary: { bg: 'oklch(0.28 0.040 145)', fg: 'oklch(0.945 0.022 88)', bd: 'oklch(0.28 0.040 145)' },
    ghost:   { bg: 'transparent', fg: 'oklch(0.28 0.040 145)', bd: 'oklch(0.28 0.040 145)' },
    soft:    { bg: 'oklch(0.93 0.022 90)', fg: 'oklch(0.28 0.040 145)', bd: 'oklch(0.84 0.025 95)' },
    clay:    { bg: 'oklch(0.62 0.11 35)', fg: 'oklch(0.945 0.022 88)', bd: 'oklch(0.62 0.11 35)' },
  };
  const s = styles[variant];
  const sizes = { sm: { padding: '8px 14px', fontSize: 13 }, md: { padding: '12px 20px', fontSize: 14 }, lg: { padding: '16px 28px', fontSize: 15 } };
  return (
    <button type={type} onClick={onClick} disabled={disabled} style={{
      background: s.bg, color: s.fg, border: `1px solid ${s.bd}`,
      borderRadius: 999, ...sizes[size],
      fontFamily: 'DM Sans, sans-serif', fontWeight: 500, letterSpacing: '0.01em',
      cursor: disabled ? 'not-allowed' : 'pointer', opacity: disabled ? 0.4 : 1,
      display: 'inline-flex', alignItems: 'center', gap: 8,
      transition: 'transform 0.15s ease',
      ...style,
    }}
      onMouseDown={e => e.currentTarget.style.transform = 'scale(0.98)'}
      onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}
      onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
    >{children}</button>
  );
}

// Surface card
function Card({ children, style = {}, onClick, padding = 20, hover = false }) {
  const [h, setH] = useState(false);
  return (
    <div onClick={onClick}
      onMouseEnter={() => setH(true)}
      onMouseLeave={() => setH(false)}
      style={{
        background: 'oklch(0.97 0.018 90)',
        border: `1px solid ${hover && h ? 'oklch(0.65 0.04 50)' : 'oklch(0.86 0.025 95)'}`,
        borderRadius: 18, padding,
        cursor: onClick ? 'pointer' : 'default',
        transition: 'transform 0.2s ease, border-color 0.2s ease',
        transform: hover && h ? 'translateY(-2px)' : 'none',
        ...style,
      }}
    >{children}</div>
  );
}

// Sticky top navigation
function TopNav({ route, go, profile }) {
  const items = [
    { id: 'home',    label: 'Today' },
    { id: 'browse',  label: 'Recipes' },
    { id: 'cycle',   label: 'Cycle' },
    { id: 'profile', label: 'Profile' },
  ];
  return (
    <nav style={{
      position: 'sticky', top: 0, zIndex: 50,
      background: 'oklch(0.96 0.012 75 / 0.85)',
      backdropFilter: 'blur(20px) saturate(140%)',
      WebkitBackdropFilter: 'blur(20px) saturate(140%)',
      borderBottom: '1px solid oklch(0.86 0.025 95)',
    }}>
      <div style={{ maxWidth: 1320, margin: '0 auto', padding: '16px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 32 }}>
        <div onClick={() => go('home')} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10 }}>
          <svg width="22" height="22" viewBox="0 0 22 22">
            <circle cx="11" cy="11" r="9" fill="none" stroke="oklch(0.28 0.040 145)" strokeWidth="0.8" />
            <circle cx="11" cy="11" r="5" fill="none" stroke="oklch(0.28 0.040 145)" strokeWidth="0.8" />
            <circle cx="17" cy="7" r="2" fill="oklch(0.62 0.11 35)" />
          </svg>
          <span style={{ fontFamily: 'Instrument Serif, serif', fontSize: 22, color: 'oklch(0.28 0.040 145)', lineHeight: 1, marginTop: 2 }}>
            <em>Mira</em>
          </span>
        </div>
        <div style={{ display: 'flex', gap: 4 }}>
          {items.map((it) => (
            <button key={it.id} onClick={() => go(it.id)} style={{
              background: route === it.id ? 'oklch(0.28 0.040 145)' : 'transparent',
              color: route === it.id ? 'oklch(0.945 0.022 88)' : 'oklch(0.34 0.035 140)',
              border: 'none', cursor: 'pointer',
              padding: '8px 16px', borderRadius: 999,
              fontFamily: 'DM Sans, sans-serif', fontSize: 13.5, fontWeight: 500,
            }}>{it.label}</button>
          ))}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div
            onClick={() => go('profile')}
            title="View profile & health coach"
            style={{
              width: 36, height: 36, borderRadius: 999,
              background: 'oklch(0.86 0.060 40)',
              border: '1px solid oklch(0.78 0.06 30)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: 'Instrument Serif, serif', color: 'oklch(0.30 0.06 30)', fontSize: 17,
              cursor: 'pointer',
              transition: 'transform 0.15s ease, box-shadow 0.15s ease',
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.08)'; e.currentTarget.style.boxShadow = '0 2px 8px oklch(0.62 0.08 35 / 0.3)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = 'none'; }}
          >{profile.name[0]}</div>
        </div>
      </div>
    </nav>
  );
}

// Phase indicator dot + name
function PhaseChip({ phaseId, size = 'sm' }) {
  const phase = window.PHASES.find((p) => p.id === phaseId);
  if (!phase) return null;
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontFamily: 'JetBrains Mono, monospace', fontSize: size === 'sm' ? 10 : 12, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'oklch(0.35 0.03 50)' }}>
      <span style={{ width: 7, height: 7, borderRadius: 999, background: phase.color, display: 'inline-block' }} />
      {phase.name}
    </span>
  );
}

// Circular meal-gap timer
function MealGap({ hoursSince = 3.2, target = 5, size = 120 }) {
  const pct = Math.min(hoursSince / target, 1);
  const r = size / 2 - 6;
  const c = 2 * Math.PI * r;
  const color = pct >= 1 ? 'oklch(0.58 0.08 138)' : 'oklch(0.62 0.11 35)';
  return (
    <div style={{ position: 'relative', width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="oklch(0.86 0.025 95)" strokeWidth="2" />
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth="2"
          strokeDasharray={`${c * pct} ${c}`} strokeLinecap="round" transform={`rotate(-90 ${size/2} ${size/2})`} />
      </svg>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ fontFamily: 'Instrument Serif, serif', fontSize: size * 0.30, color: 'oklch(0.28 0.040 145)', lineHeight: 1 }}>
          {hoursSince.toFixed(1)}<span style={{ fontSize: size * 0.14, fontStyle: 'italic' }}>h</span>
        </span>
        <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 9, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'oklch(0.50 0.035 135)', marginTop: 2 }}>
          {pct >= 1 ? 'meal ready' : `${Math.max(0, target - hoursSince).toFixed(1)}h to go`}
        </span>
      </div>
    </div>
  );
}

Object.assign(window, { ImagePlot, HormoneRing, Eyebrow, Badge, Button, Card, TopNav, PhaseChip, MealGap });
