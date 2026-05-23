// 6-step onboarding: Location → Diet → Cuisines → Allergies → Profile → Hormonal profile

const { useState: useState_OB, useEffect: useEffect_OB } = React;

// Local-buffered text input — only pushes to parent onBlur, prevents focus loss
function OBInput({ value, onChange, placeholder, style = {} }) {
  const [local, setLocal] = useState_OB(String(value ?? ''));
  useEffect_OB(() => setLocal(String(value ?? '')), [value]);
  return (
    <input
      value={local}
      onChange={e => setLocal(e.target.value)}
      onBlur={() => onChange(local)}
      placeholder={placeholder}
      style={style}
    />
  );
}

// Local-buffered number input
function OBNumber({ value, onChange, min, max, style = {} }) {
  const [local, setLocal] = useState_OB(String(value ?? ''));
  useEffect_OB(() => setLocal(String(value ?? '')), [value]);
  return (
    <input
      type="number" min={min} max={max}
      value={local}
      onChange={e => setLocal(e.target.value)}
      onBlur={() => onChange(local)}
      style={style}
    />
  );
}

function Onboarding({ profile, setProfile, complete }) {
  const [step, setStep] = useState_OB(0);
  const steps = [
    { id: 'location',  title: 'Where do you live?',        sub: 'So we can match recipes to brands actually on your local shelves.' },
    { id: 'diet',      title: 'How do you eat?',           sub: 'Your baseline framework. We layer cycle phase and IR rules on top.' },
    { id: 'cuisines',  title: 'What do you reach for?',    sub: 'Pick the kitchens that already feel like home — recipes will lean here first.' },
    { id: 'allergies', title: 'What does your body avoid?', sub: 'Allergens and sensitivities — strict exclusion on every recipe.' },
    { id: 'profile',   title: 'Your profile',              sub: 'Your name and height let us personalise your greeting and calculate your daily protein target.' },
    { id: 'cycle',     title: 'Your hormonal profile',     sub: "Age and heritage subtly shift your IR baseline. Your cycle phase decides today's meals." },
  ];
  const cur = steps[step];

  return (
    <div style={{ minHeight: '100vh', background: 'oklch(0.945 0.022 88)', display: 'flex' }}>
      {/* Left pane */}
      <aside style={{
        flex: '0 0 38%', minHeight: '100vh',
        background: 'oklch(0.90 0.030 88)',
        borderRight: '1px solid oklch(0.83 0.025 95)',
        padding: '48px 56px',
        display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
        position: 'sticky', top: 0, height: '100vh', overflow: 'hidden',
      }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <svg width="22" height="22" viewBox="0 0 22 22">
            <circle cx="11" cy="11" r="9" fill="none" stroke="oklch(0.28 0.040 145)" strokeWidth="0.8" />
            <circle cx="11" cy="11" r="5" fill="none" stroke="oklch(0.28 0.040 145)" strokeWidth="0.8" />
            <circle cx="17" cy="7" r="2" fill="oklch(0.62 0.11 35)" />
          </svg>
          <span style={{ fontFamily: 'Instrument Serif, serif', fontSize: 24, color: 'oklch(0.28 0.040 145)' }}>
            <em>Mira</em>
          </span>
        </div>

        {/* Headline */}
        <div>
          <window.Eyebrow>Set-up · 6 steps</window.Eyebrow>
          <h1 style={{ fontFamily: 'Instrument Serif, serif', fontSize: 64, lineHeight: 1.02, color: 'oklch(0.28 0.040 145)', margin: '24px 0 18px', fontWeight: 400 }}>
            A meal plan that knows<br />
            <em style={{ color: 'oklch(0.55 0.10 35)' }}>what month it is</em><br />
            inside your body.
          </h1>
          <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 15, lineHeight: 1.6, color: 'oklch(0.46 0.035 135)', maxWidth: 420 }}>
            Mira plans meals against your insulin sensitivity, your cycle phase, and the actual products sitting on a shelf within a kilometre of your kitchen.
          </p>
        </div>

        {/* Step rail */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {steps.map((s, i) => (
            <div key={s.id} style={{ display: 'flex', gap: 14, alignItems: 'center', opacity: i === step ? 1 : (i < step ? 0.7 : 0.35) }}>
              <div style={{
                width: 28, height: 28, borderRadius: 999,
                background: i <= step ? 'oklch(0.28 0.040 145)' : 'transparent',
                color: i <= step ? 'oklch(0.945 0.022 88)' : 'oklch(0.46 0.035 135)',
                border: '1px solid oklch(0.28 0.040 145)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: 'JetBrains Mono, monospace', fontSize: 11,
              }}>
                {i < step ? '✓' : String(i + 1).padStart(2, '0')}
              </div>
              <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 14, color: 'oklch(0.28 0.040 145)' }}>{s.title}</span>
            </div>
          ))}
        </div>
      </aside>

      {/* Right pane */}
      <main style={{ flex: 1, padding: '56px 64px', overflowY: 'auto', maxHeight: '100vh' }}>
        <div style={{ maxWidth: 640, margin: '0 auto' }}>
          <window.Eyebrow>Step {step + 1} of {steps.length}</window.Eyebrow>
          <h2 style={{ fontFamily: 'Instrument Serif, serif', fontSize: 44, lineHeight: 1.1, color: 'oklch(0.28 0.040 145)', margin: '18px 0 12px', fontWeight: 400 }}>
            {cur.title}
          </h2>
          <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 15, lineHeight: 1.6, color: 'oklch(0.48 0.035 135)', marginBottom: 36 }}>
            {cur.sub}
          </p>

          {cur.id === 'location'  && <LocationStep  profile={profile} setProfile={setProfile} />}
          {cur.id === 'diet'      && <DietStep      profile={profile} setProfile={setProfile} />}
          {cur.id === 'cuisines'  && <CuisinesStep  profile={profile} setProfile={setProfile} />}
          {cur.id === 'allergies' && <AllergiesStep profile={profile} setProfile={setProfile} />}
          {cur.id === 'profile'   && <ProfileStep   profile={profile} setProfile={setProfile} />}
          {cur.id === 'cycle'     && <CycleStep     profile={profile} setProfile={setProfile} />}

          {/* Back / Continue */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 44, paddingTop: 24, borderTop: '1px solid oklch(0.86 0.025 95)' }}>
            <button onClick={() => setStep(Math.max(0, step - 1))} disabled={step === 0} style={{
              background: 'none', border: 'none', cursor: step === 0 ? 'default' : 'pointer',
              color: 'oklch(0.50 0.035 135)', fontFamily: 'DM Sans, sans-serif', fontSize: 14,
              opacity: step === 0 ? 0.3 : 1, padding: 0,
            }}>← Back</button>
            <window.Button onClick={() => { if (step === steps.length - 1) complete(); else setStep(step + 1); }}>
              {step === steps.length - 1 ? 'Enter Mira →' : 'Continue →'}
            </window.Button>
          </div>
        </div>
      </main>
    </div>
  );
}

// Step 1 — Location + store picker
function LocationStep({ profile, setProfile }) {
  const [activeCat, setActiveCat] = useState_OB('supermarket');
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.4fr', gap: 16 }}>
        <div>
          <window.Eyebrow>Country</window.Eyebrow>
          <div style={{ marginTop: 10, display: 'flex', flexDirection: 'column', gap: 8 }}>
            {['Germany', 'United Kingdom', 'United States'].map((c) => (
              <button key={c} onClick={() => setProfile({ ...profile, country: c })} style={{
                padding: '12px 14px', borderRadius: 10,
                background: profile.country === c ? 'oklch(0.28 0.040 145)' : 'oklch(0.97 0.018 90)',
                color: profile.country === c ? 'oklch(0.945 0.022 88)' : 'oklch(0.34 0.035 140)',
                border: profile.country === c ? '1px solid oklch(0.28 0.040 145)' : '1px solid oklch(0.84 0.025 95)',
                fontFamily: 'DM Sans, sans-serif', fontSize: 14, cursor: 'pointer', textAlign: 'left',
              }}>{c}</button>
            ))}
          </div>
        </div>
        <div>
          <window.Eyebrow>Postal code</window.Eyebrow>
          <OBInput value={profile.zip} onChange={v => setProfile({ ...profile, zip: v })}
            placeholder="e.g. 10115"
            style={{
              marginTop: 10, width: '100%', padding: '12px 14px', borderRadius: 10,
              background: 'oklch(0.97 0.018 90)', border: '1px solid oklch(0.84 0.025 95)',
              fontFamily: 'DM Sans, sans-serif', fontSize: 15, color: 'oklch(0.28 0.040 145)',
            }} />
          <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 12, color: 'oklch(0.52 0.035 135)', marginTop: 8 }}>
            Berlin Mitte · 14 stores within 2.5 km
          </p>
        </div>
      </div>

      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <window.Eyebrow>Stores near you · pick the ones you actually shop</window.Eyebrow>
          <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, letterSpacing: '0.1em', color: 'oklch(0.50 0.035 135)' }}>
            {profile.markets.length} SELECTED
          </span>
        </div>
        <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 13, color: 'oklch(0.50 0.035 135)', marginTop: 6, marginBottom: 14 }}>
          We map every ingredient to the closest in-stock brand. Drogerie covers seeds, oils, and supplements.
        </p>

        {/* Category tabs */}
        <div style={{ display: 'flex', gap: 4, borderBottom: '1px solid oklch(0.86 0.025 95)', marginBottom: 14 }}>
          {window.STORE_CATEGORIES.map((c) => {
            const total = window.SUPERMARKETS.filter(s => s.category === c.id).length;
            const sel   = profile.markets.filter(m => window.SUPERMARKETS.find(s => s.id === m)?.category === c.id).length;
            return (
              <button key={c.id} onClick={() => setActiveCat(c.id)} style={{
                background: 'transparent', border: 'none', cursor: 'pointer',
                padding: '10px 0', marginRight: 22,
                fontFamily: 'DM Sans, sans-serif', fontSize: 13.5,
                fontWeight: activeCat === c.id ? 600 : 400,
                color: activeCat === c.id ? 'oklch(0.28 0.040 145)' : 'oklch(0.54 0.035 135)',
                borderBottom: activeCat === c.id ? '2px solid oklch(0.28 0.040 145)' : '2px solid transparent',
                marginBottom: -1, display: 'inline-flex', alignItems: 'center', gap: 8,
              }}>
                {c.label}
                <span style={{
                  fontFamily: 'JetBrains Mono, monospace', fontSize: 10,
                  background: sel > 0 ? 'oklch(0.28 0.040 145)' : 'oklch(0.91 0.022 95)',
                  color: sel > 0 ? 'oklch(0.945 0.022 88)' : 'oklch(0.50 0.035 135)',
                  padding: '2px 7px', borderRadius: 999,
                }}>{sel > 0 ? `${sel}/${total}` : total}</span>
              </button>
            );
          })}
        </div>

        <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 12.5, color: 'oklch(0.52 0.035 135)', marginBottom: 12 }}>
          {window.STORE_CATEGORIES.find(c => c.id === activeCat)?.sub}
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {window.SUPERMARKETS.filter(s => s.category === activeCat).map((s) => {
            const on = profile.markets.includes(s.id);
            return (
              <button key={s.id} onClick={() => setProfile({
                ...profile,
                markets: on ? profile.markets.filter(x => x !== s.id) : [...profile.markets, s.id],
              })} style={{
                padding: '14px 16px', borderRadius: 12,
                background: on ? 'oklch(0.91 0.030 90)' : 'oklch(0.97 0.018 90)',
                border: on ? '1px solid oklch(0.28 0.040 145)' : '1px solid oklch(0.84 0.025 95)',
                cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                fontFamily: 'DM Sans, sans-serif', textAlign: 'left',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  <div style={{ width: 36, height: 36, borderRadius: 10, background: s.color, color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Instrument Serif, serif', fontSize: 17 }}>
                    {s.name[0]}
                  </div>
                  <div>
                    <div style={{ fontSize: 14.5, color: 'oklch(0.28 0.040 145)', fontWeight: 500 }}>{s.name}</div>
                    <div style={{ fontSize: 12, color: 'oklch(0.50 0.035 135)', marginTop: 2 }}>{s.tag}</div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, letterSpacing: '0.06em', color: 'oklch(0.52 0.035 135)', textTransform: 'uppercase' }}>{s.distance}</span>
                  <div style={{
                    width: 22, height: 22, borderRadius: 999,
                    background: on ? 'oklch(0.28 0.040 145)' : 'transparent',
                    border: on ? 'none' : '1px solid oklch(0.74 0.025 100)',
                    color: 'oklch(0.945 0.022 88)', fontSize: 12,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>{on && '✓'}</div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// Step 2 — Diet framework (single select)
function DietStep({ profile, setProfile }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {window.DIETS.map((d) => {
        const on = profile.diet === d.id;
        return (
          <button key={d.id} onClick={() => setProfile({ ...profile, diet: d.id })} style={{
            padding: '18px 20px', borderRadius: 14,
            background: on ? 'oklch(0.91 0.030 90)' : 'oklch(0.97 0.018 90)',
            border: on ? '1px solid oklch(0.28 0.040 145)' : '1px solid oklch(0.84 0.025 95)',
            cursor: 'pointer', textAlign: 'left', fontFamily: 'DM Sans, sans-serif',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 24,
          }}>
            <div>
              <div style={{ fontSize: 16, color: 'oklch(0.28 0.040 145)', fontWeight: 500 }}>{d.name}</div>
              <div style={{ fontSize: 13, color: 'oklch(0.50 0.035 135)', marginTop: 4 }}>{d.desc}</div>
            </div>
            <div style={{
              width: 22, height: 22, borderRadius: 999, flexShrink: 0,
              background: on ? 'oklch(0.28 0.040 145)' : 'transparent',
              border: on ? 'none' : '1px solid oklch(0.74 0.025 100)',
              color: 'oklch(0.945 0.022 88)', fontSize: 12,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>{on && '✓'}</div>
          </button>
        );
      })}
    </div>
  );
}

// Step 3 — Cuisines (multi-select grid)
function CuisinesStep({ profile, setProfile }) {
  const toggle = (id) => {
    const on = profile.cuisines.includes(id);
    setProfile({ ...profile, cuisines: on ? profile.cuisines.filter(x => x !== id) : [...profile.cuisines, id] });
  };
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 14 }}>
        <window.Eyebrow>Pick as many as you like</window.Eyebrow>
        <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, letterSpacing: '0.1em', color: 'oklch(0.50 0.035 135)' }}>
          {profile.cuisines.length} SELECTED
        </span>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10 }}>
        {window.CUISINES.map((c) => {
          const on = profile.cuisines.includes(c.id);
          return (
            <button key={c.id} onClick={() => toggle(c.id)} style={{
              padding: '16px 18px', borderRadius: 14,
              background: on ? 'oklch(0.91 0.030 90)' : 'oklch(0.97 0.018 90)',
              border: on ? '1px solid oklch(0.28 0.040 145)' : '1px solid oklch(0.84 0.025 95)',
              cursor: 'pointer', textAlign: 'left', fontFamily: 'DM Sans, sans-serif',
              display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 14,
            }}>
              <div>
                <div style={{ fontFamily: 'Instrument Serif, serif', fontSize: 22, color: 'oklch(0.28 0.040 145)', fontWeight: 400, lineHeight: 1.1 }}>{c.name}</div>
                <div style={{ fontSize: 12.5, color: 'oklch(0.52 0.035 135)', marginTop: 6, lineHeight: 1.4 }}>{c.hint}</div>
              </div>
              <div style={{
                width: 22, height: 22, borderRadius: 999, flexShrink: 0, marginTop: 4,
                background: on ? 'oklch(0.28 0.040 145)' : 'transparent',
                border: on ? 'none' : '1px solid oklch(0.74 0.025 100)',
                color: 'oklch(0.945 0.022 88)', fontSize: 12,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>{on && '✓'}</div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// Step 4 — Allergies & sensitivities
function AllergiesStep({ profile, setProfile }) {
  const toggle = (id) => {
    const on = profile.allergies.includes(id);
    setProfile({ ...profile, allergies: on ? profile.allergies.filter(x => x !== id) : [...profile.allergies, id] });
  };

  const renderGroup = (title, group) => (
    <div>
      <window.Eyebrow>{title}</window.Eyebrow>
      <div style={{ marginTop: 12, display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8 }}>
        {window.ALLERGENS.filter(a => a.group === group).map(a => {
          const on = profile.allergies.includes(a.id);
          return (
            <button key={a.id} onClick={() => toggle(a.id)} style={{
              padding: '12px 14px', borderRadius: 10,
              background: on ? 'oklch(0.93 0.035 40)' : 'oklch(0.97 0.018 90)',
              border: on ? '1px solid oklch(0.62 0.11 35)' : '1px solid oklch(0.84 0.025 95)',
              color: on ? 'oklch(0.40 0.08 35)' : 'oklch(0.34 0.035 140)',
              fontFamily: 'DM Sans, sans-serif', fontSize: 13.5,
              cursor: 'pointer', textAlign: 'left',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8,
            }}>
              <span>{a.name}</span>
              {on && <span style={{ fontSize: 11 }}>✕ excluded</span>}
            </button>
          );
        })}
      </div>
    </div>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {renderGroup('Major allergens', 'major')}
      {renderGroup('Digestive sensitivities', 'digestive')}
    </div>
  );
}

// Step 5 — Name + height profile
function ProfileStep({ profile, setProfile }) {
  const proteinTarget = profile.height > 100 ? Math.round((profile.height - 100) * 1.5) : null;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
      {/* Name */}
      <div>
        <window.Eyebrow>Your name</window.Eyebrow>
        <OBInput
          value={profile.name}
          onChange={v => setProfile({ ...profile, name: v })}
          placeholder="e.g. Sofia"
          style={{
            marginTop: 12, width: '100%', padding: '18px 20px', borderRadius: 14,
            background: 'oklch(0.97 0.018 90)', border: '1px solid oklch(0.84 0.025 95)',
            fontFamily: 'Instrument Serif, serif', fontSize: 36, color: 'oklch(0.28 0.040 145)',
            outline: 'none',
          }}
        />
        <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 13, color: 'oklch(0.52 0.035 135)', marginTop: 8 }}>
          Used in your daily greeting and plan summaries.
        </p>
      </div>

      {/* Height */}
      <div>
        <window.Eyebrow>Height</window.Eyebrow>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 12 }}>
          <div style={{ padding: '20px 20px', borderRadius: 14, background: 'oklch(0.97 0.018 90)', border: '1px solid oklch(0.84 0.025 95)' }}>
            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, letterSpacing: '0.14em', color: 'oklch(0.54 0.035 135)', textTransform: 'uppercase' }}>Centimetres</div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginTop: 10 }}>
              <OBNumber
                value={profile.height} min={140} max={210}
                onChange={v => setProfile({ ...profile, height: parseInt(v) || 0 })}
                style={{ width: 90, padding: 0, background: 'transparent', border: 'none', fontFamily: 'Instrument Serif, serif', fontSize: 52, color: 'oklch(0.28 0.040 145)', outline: 'none' }}
              />
              <span style={{ fontFamily: 'Instrument Serif, serif', fontSize: 22, color: 'oklch(0.52 0.035 135)', fontStyle: 'italic' }}>cm</span>
            </div>
          </div>
          <div style={{ padding: '20px 20px', borderRadius: 14, background: proteinTarget ? 'oklch(0.28 0.040 145)' : 'oklch(0.97 0.018 90)', border: '1px solid oklch(0.84 0.025 95)', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, letterSpacing: '0.14em', color: proteinTarget ? 'oklch(0.72 0.045 100)' : 'oklch(0.54 0.035 135)', textTransform: 'uppercase' }}>Daily protein target</div>
            {proteinTarget ? (
              <>
                <div style={{ fontFamily: 'Instrument Serif, serif', fontSize: 52, color: 'oklch(0.945 0.022 88)', lineHeight: 1, marginTop: 10 }}>
                  {proteinTarget}<span style={{ fontSize: 22, fontStyle: 'italic', color: 'oklch(0.74 0.045 100)' }}>g</span>
                </div>
                <div style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 12.5, color: 'oklch(0.74 0.045 100)', marginTop: 6 }}>
                  {Math.round(proteinTarget / (profile.meals || 3))}g per meal · IR formula
                </div>
              </>
            ) : (
              <div style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 13, color: 'oklch(0.54 0.035 135)', marginTop: 10 }}>Enter your height to calculate</div>
            )}
          </div>
        </div>
        <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 13, color: 'oklch(0.52 0.035 135)', marginTop: 10, lineHeight: 1.5 }}>
          Mira uses the IR formula <em style={{ fontFamily: 'Instrument Serif, serif', fontSize: 15 }}>(height − 100) × 1.5</em> — higher than standard guidelines because insulin resistance requires more protein to preserve muscle while improving sensitivity.
        </p>
      </div>
    </div>
  );
}

// Step 6 — Hormonal profile
function CycleStep({ profile, setProfile }) {
  const stage = window.lifeStageFor(profile.age);
  const eth = window.ETHNICITIES.find(e => e.id === profile.ethnicity);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
      {/* Age + heritage */}
      <div>
        <window.Eyebrow>Context</window.Eyebrow>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.6fr', gap: 14, marginTop: 12 }}>
          <div style={{ padding: 20, borderRadius: 14, background: 'oklch(0.97 0.018 90)', border: '1px solid oklch(0.84 0.025 95)' }}>
            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, letterSpacing: '0.14em', color: 'oklch(0.54 0.035 135)', textTransform: 'uppercase' }}>Age</div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginTop: 8 }}>
              <OBNumber value={profile.age} min={14} max={80}
                onChange={v => setProfile({ ...profile, age: parseInt(v) || 0 })}
                style={{ width: 80, padding: 0, background: 'transparent', border: 'none', fontFamily: 'Instrument Serif, serif', fontSize: 44, color: 'oklch(0.28 0.040 145)', outline: 'none' }} />
              <span style={{ fontFamily: 'Instrument Serif, serif', fontSize: 16, color: 'oklch(0.52 0.035 135)', fontStyle: 'italic' }}>{stage.label.toLowerCase()}</span>
            </div>
            <div style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 12.5, color: 'oklch(0.54 0.035 135)', marginTop: 8, lineHeight: 1.45 }}>{stage.note}</div>
          </div>
          <div style={{ padding: 20, borderRadius: 14, background: 'oklch(0.97 0.018 90)', border: '1px solid oklch(0.84 0.025 95)' }}>
            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, letterSpacing: '0.14em', color: 'oklch(0.54 0.035 135)', textTransform: 'uppercase' }}>Heritage · optional</div>
            <select value={profile.ethnicity} onChange={(e) => setProfile({ ...profile, ethnicity: e.target.value })} style={{
              marginTop: 8, width: '100%', padding: 0, background: 'transparent', border: 'none',
              fontFamily: 'Instrument Serif, serif', fontSize: 22, color: 'oklch(0.28 0.040 145)', outline: 'none', cursor: 'pointer',
            }}>
              {window.ETHNICITIES.map(e => <option key={e.id} value={e.id}>{e.label}</option>)}
            </select>
            <div style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 12.5, color: 'oklch(0.54 0.035 135)', marginTop: 8, lineHeight: 1.45 }}>{eth?.note}</div>
          </div>
        </div>
      </div>

      {/* Cycle day + length sliders */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <div>
          <window.Eyebrow>Current cycle day</window.Eyebrow>
          <div style={{ marginTop: 12, padding: 24, borderRadius: 14, background: 'oklch(0.97 0.018 90)', border: '1px solid oklch(0.84 0.025 95)' }}>
            <div style={{ fontFamily: 'Instrument Serif, serif', fontSize: 56, color: 'oklch(0.28 0.040 145)', lineHeight: 1 }}>Day {profile.day}</div>
            <input type="range" min="1" max={profile.length} value={profile.day}
              onChange={(e) => setProfile({ ...profile, day: parseInt(e.target.value) })}
              style={{ width: '100%', marginTop: 16, accentColor: 'oklch(0.55 0.10 35)' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'JetBrains Mono, monospace', fontSize: 10, color: 'oklch(0.50 0.035 135)', letterSpacing: '0.1em' }}>
              <span>1</span><span>{profile.length}</span>
            </div>
          </div>
        </div>
        <div>
          <window.Eyebrow>Average length</window.Eyebrow>
          <div style={{ marginTop: 12, padding: 24, borderRadius: 14, background: 'oklch(0.97 0.018 90)', border: '1px solid oklch(0.84 0.025 95)' }}>
            <div style={{ fontFamily: 'Instrument Serif, serif', fontSize: 56, color: 'oklch(0.28 0.040 145)', lineHeight: 1 }}>
              {profile.length} <span style={{ fontSize: 24, fontStyle: 'italic', color: 'oklch(0.50 0.035 135)' }}>days</span>
            </div>
            <input type="range" min="21" max="40" value={profile.length}
              onChange={(e) => setProfile({ ...profile, length: parseInt(e.target.value) })}
              style={{ width: '100%', marginTop: 16, accentColor: 'oklch(0.55 0.10 35)' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'JetBrains Mono, monospace', fontSize: 10, color: 'oklch(0.50 0.035 135)', letterSpacing: '0.1em' }}>
              <span>21</span><span>40</span>
            </div>
          </div>
        </div>
      </div>

      {/* Live ring preview */}
      <div style={{ display: 'flex', justifyContent: 'center', padding: '12px 0' }}>
        <window.HormoneRing day={profile.day} length={profile.length} size={220} />
      </div>

      {/* Irregular toggle */}
      <button onClick={() => setProfile({ ...profile, irregular: !profile.irregular })} style={{
        padding: '14px 18px', borderRadius: 12,
        background: profile.irregular ? 'oklch(0.91 0.030 90)' : 'oklch(0.97 0.018 90)',
        border: profile.irregular ? '1px solid oklch(0.28 0.040 145)' : '1px solid oklch(0.84 0.025 95)',
        cursor: 'pointer', textAlign: 'left', fontFamily: 'DM Sans, sans-serif', fontSize: 13.5,
      }}>
        <div style={{ fontWeight: 500, color: 'oklch(0.28 0.040 145)' }}>Irregular, amenorrhea, or menopause?</div>
        <div style={{ fontSize: 12, color: 'oklch(0.50 0.035 135)', marginTop: 4 }}>
          We'll sync to the moon instead. New Moon = Follicular framework.
        </div>
      </button>

      {/* Meals per day */}
      <div>
        <window.Eyebrow>Meals per day</window.Eyebrow>
        <div style={{ marginTop: 12, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          {[2, 3].map((n) => {
            const on = profile.meals === n;
            return (
              <button key={n} onClick={() => setProfile({ ...profile, meals: n })} style={{
                padding: '22px 18px', borderRadius: 14,
                background: on ? 'oklch(0.28 0.040 145)' : 'oklch(0.97 0.018 90)',
                color: on ? 'oklch(0.945 0.022 88)' : 'oklch(0.28 0.040 145)',
                border: on ? '1px solid oklch(0.28 0.040 145)' : '1px solid oklch(0.84 0.025 95)',
                cursor: 'pointer', textAlign: 'left', fontFamily: 'DM Sans, sans-serif',
              }}>
                <div style={{ fontFamily: 'Instrument Serif, serif', fontSize: 36, lineHeight: 1 }}>{n}</div>
                <div style={{ fontSize: 13, marginTop: 8, opacity: 0.8 }}>
                  {n === 2 ? 'Two meals · longer fasting window' : 'Three meals · breakfast, lunch, dinner'}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { Onboarding });
