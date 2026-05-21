// Dev-only tweaks panel — floating bottom-right, toggled via a gear button

const { useState: useState_T, useEffect: useEffect_T, useRef: useRef_T } = React;

// Global tweaks state persisted in sessionStorage for dev convenience
function useTweaks(defaults) {
  const [tweaks, setTweaks] = useState_T(() => {
    try {
      const saved = sessionStorage.getItem('mira-tweaks');
      return saved ? { ...defaults, ...JSON.parse(saved) } : { ...defaults };
    } catch {
      return { ...defaults };
    }
  });

  const setTweak = (key, value) => {
    setTweaks(prev => {
      const next = { ...prev, [key]: value };
      try { sessionStorage.setItem('mira-tweaks', JSON.stringify(next)); } catch {}
      return next;
    });
  };

  return [tweaks, setTweak];
}

// Container for the floating panel
function TweaksPanel({ title = 'Tweaks', children }) {
  const [open, setOpen] = useState_T(false);
  return (
    <div style={{ position: 'fixed', bottom: 24, right: 24, zIndex: 200 }}>
      {open && (
        <div style={{
          marginBottom: 12,
          background: 'oklch(0.97 0.018 90)',
          border: '1px solid oklch(0.86 0.025 95)',
          borderRadius: 16,
          padding: 20,
          width: 300,
          boxShadow: '0 8px 32px oklch(0.28 0.04 145 / 0.10)',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <window.Eyebrow>{title}</window.Eyebrow>
            <button onClick={() => setOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'oklch(0.50 0.035 135)', fontSize: 18, lineHeight: 1 }}>×</button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>{children}</div>
        </div>
      )}
      <button onClick={() => setOpen(o => !o)} style={{
        width: 44, height: 44, borderRadius: 999,
        background: 'oklch(0.28 0.040 145)',
        color: 'oklch(0.93 0.022 90)',
        border: 'none', cursor: 'pointer',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 18,
        boxShadow: '0 4px 16px oklch(0.28 0.04 145 / 0.25)',
        transition: 'transform 0.15s ease',
        float: 'right',
      }}
        onMouseDown={e => e.currentTarget.style.transform = 'scale(0.95)'}
        onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}
        onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
      >⚙</button>
    </div>
  );
}

function TweakSection({ label, children }) {
  return (
    <div>
      <window.Eyebrow>{label}</window.Eyebrow>
      <div style={{ marginTop: 10 }}>{children}</div>
    </div>
  );
}

function TweakSlider({ label, value, min, max, step = 1, onChange, unit = '' }) {
  return (
    <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'DM Sans, sans-serif', fontSize: 13, color: 'oklch(0.34 0.035 140)' }}>
        <span>{label}</span>
        <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11 }}>{value}{unit}</span>
      </div>
      <input type="range" min={min} max={max} step={step} value={value}
        onChange={e => onChange(Number(e.target.value))}
        style={{ width: '100%', accentColor: 'oklch(0.62 0.11 35)' }} />
    </label>
  );
}

function TweakSelect({ label, value, options, onChange }) {
  return (
    <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 13, color: 'oklch(0.34 0.035 140)' }}>{label}</span>
      <select value={value} onChange={e => onChange(e.target.value)} style={{
        padding: '8px 10px', borderRadius: 8,
        background: 'oklch(0.945 0.022 88)',
        border: '1px solid oklch(0.84 0.025 95)',
        fontFamily: 'DM Sans, sans-serif', fontSize: 13,
        color: 'oklch(0.28 0.040 145)', cursor: 'pointer',
      }}>
        {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </label>
  );
}

function TweakButton({ label, onClick }) {
  return (
    <button onClick={onClick} style={{
      padding: '10px 14px', borderRadius: 8,
      background: 'oklch(0.945 0.022 88)',
      border: '1px solid oklch(0.84 0.025 95)',
      fontFamily: 'DM Sans, sans-serif', fontSize: 13,
      color: 'oklch(0.28 0.040 145)', cursor: 'pointer', width: '100%', textAlign: 'left',
    }}>{label}</button>
  );
}

Object.assign(window, { useTweaks, TweaksPanel, TweakSection, TweakSlider, TweakSelect, TweakButton });
