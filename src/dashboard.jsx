// Today / Dashboard screen

const { useState: useState_DB } = React;

function Dashboard({ profile, setProfile, go, openRecipe }) {
  const phase = window.phaseForDay(profile.day, profile.length);
  const plan  = window.PLAN_BY_PHASE[phase.id];
  const proteinTarget = Math.round((profile.height - 100) * 1.5);
  const perMeal       = Math.round(proteinTarget / profile.meals);
  const isIR          = (profile.conditions || []).includes('insulin-resistance');

  // Pool meeting the protein floor (used for all fallback substitutions)
  const proteinSafePool = window.RECIPES.filter(r => (r.protein || 0) >= perMeal);
  // IR dinner pool: no starch + protein floor
  const irDinnerPool = isIR
    ? window.irFilterRecipes(window.RECIPES).filter(r => (r.protein || 0) >= perMeal)
    : null;

  function safeRecipe(id, mealKey) {
    const r       = window.recipeById(id);
    const starchy = window.STARCHY_IDS?.has(id);
    const tooLow  = (r?.protein || 0) < perMeal;
    // For IR, only block starchy at dinner; breakfast & lunch are fine
    const irBlock = isIR && starchy && mealKey === 'dinner';
    if (!irBlock && !tooLow) return r;
    // Pick substitution pool: IR dinner or general protein pool
    const pool = irBlock ? irDinnerPool : proteinSafePool;
    return pool?.find(x => x.phases?.includes(phase.id)) || pool?.[0] || r;
  }

  const mealsList = profile.meals === 2
    ? [
        { key: 'lunch',  label: 'Lunch',  time: '12:30', r: safeRecipe(plan.lunch,  'lunch') },
        { key: 'dinner', label: 'Dinner', time: '18:30', r: safeRecipe(plan.dinner, 'dinner') },
      ]
    : [
        { key: 'breakfast', label: 'Breakfast', time: '08:00', r: safeRecipe(plan.breakfast, 'breakfast') },
        { key: 'lunch',     label: 'Lunch',     time: '13:00', r: safeRecipe(plan.lunch,     'lunch') },
        { key: 'dinner',    label: 'Dinner',    time: '19:00', r: safeRecipe(plan.dinner,    'dinner') },
      ];

  const stage     = window.lifeStageFor(profile.age);
  const stageNote = stage.id !== 'reproductive' ? ` · ${stage.label} adjustments applied.` : '';
  const plantsToday = window.countPlantsToday(plan);
  const seasonal  = window.seasonalVegFor ? window.seasonalVegFor(profile.country || 'Germany') : null;
  const carbLabel = phase.id === 'follicular' ? 'High' : phase.id === 'luteal' ? 'Slow' : 'Moderate';

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: '52px 32px 100px' }}>

      {/* ── Header ── */}
      <header style={{ marginBottom: 48 }}>
        <window.Eyebrow>Day {profile.day} of {profile.length} · {phase.name} phase</window.Eyebrow>
        <h1 style={{ fontFamily: 'Instrument Serif, serif', fontSize: 60, lineHeight: 1.0, color: 'oklch(0.28 0.040 145)', margin: '14px 0 0', fontWeight: 400 }}>
          Good morning, <em style={{ color: phase.color }}>{profile.name}</em>.
        </h1>
        <p style={{ fontFamily: 'Instrument Serif, serif', fontSize: 20, lineHeight: 1.45, color: 'oklch(0.48 0.032 135)', margin: '14px 0 0', maxWidth: 640, fontStyle: 'italic' }}>
          {phase.headline} You're in the {phase.name.toLowerCase()} phase — {phase.body.split('.')[0].toLowerCase()}.{stageNote}
        </p>
      </header>

      {/* ── Cycle ring + key numbers ── */}
      <section style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: 48, alignItems: 'center', marginBottom: 48, paddingBottom: 48, borderBottom: '1px solid oklch(0.87 0.022 95)' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 10 }}>
          <button onClick={() => go('cycle')} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
            <window.HormoneRing day={profile.day} length={profile.length} size={188} label={false} />
          </button>
          <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 12, color: 'oklch(0.54 0.030 135)', lineHeight: 1.5, margin: 0 }}>
            Seed cycling · <em style={{ fontFamily: 'Instrument Serif, serif', fontSize: 13, color: 'oklch(0.38 0.038 145)' }}>{phase.seed}</em>
          </p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 32 }}>
          <Stat label="Daily protein" value={`${proteinTarget}g`} sub={`${perMeal}g per meal · ${profile.meals}× a day`} />
          <Stat label="Meal spacing" value="4–6 h" sub="Leave 4–6 hours between meals. Avoid snacking to let your gut clear." />
          <Stat
            label="Carbs today" value={carbLabel} accent={phase.color}
            sub={carbLabel === 'High' ? 'Follicular peak — complex carbs welcome' : carbLabel === 'Slow' ? 'Luteal phase — keep to low-GI options' : 'Moderate — breakfast and lunch only'}
          />
        </div>
      </section>

      {/* ── Today's meals ── */}
      <section style={{ marginBottom: 52 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 22 }}>
          <h2 style={{ fontFamily: 'Instrument Serif, serif', fontSize: 36, color: 'oklch(0.28 0.040 145)', margin: 0, fontWeight: 400 }}>
            Today's <em>meals</em>
          </h2>
          <button onClick={() => go('browse')} style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'DM Sans, sans-serif', fontSize: 13.5, color: 'oklch(0.50 0.035 135)' }}>
            Swap a meal →
          </button>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: `repeat(${mealsList.length}, 1fr)`, gap: 16 }}>
          {mealsList.map((m) => (
            <article key={m.key} onClick={() => openRecipe(m.r.id)}
              style={{ cursor: 'pointer', padding: '18px 20px', borderRadius: 16, background: 'oklch(0.97 0.015 90)', border: '1px solid oklch(0.88 0.022 95)', transition: 'background 0.15s' }}
              onMouseEnter={e => e.currentTarget.style.background = 'white'}
              onMouseLeave={e => e.currentTarget.style.background = 'oklch(0.97 0.015 90)'}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                <window.Eyebrow>{m.label} · {m.time}</window.Eyebrow>
                <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, color: 'oklch(0.56 0.030 135)', letterSpacing: '0.06em', flexShrink: 0, marginLeft: 8 }}>
                  {m.r.minutes}m · {m.r.protein}g P
                </span>
              </div>
              <h3 style={{ fontFamily: 'Instrument Serif, serif', fontSize: 24, lineHeight: 1.2, color: 'oklch(0.28 0.040 145)', margin: '0 0 8px', fontWeight: 400 }}>
                {m.r.title}
              </h3>
              {m.r.tags && m.r.tags.slice(0, 2).map(t => (
                <span key={t} style={{ display: 'inline-block', marginRight: 6, padding: '2px 8px', borderRadius: 999, background: phase.soft, border: `1px solid ${phase.color}28`, fontFamily: 'DM Sans, sans-serif', fontSize: 11, color: 'oklch(0.42 0.035 140)' }}>
                  {t}
                </span>
              ))}
            </article>
          ))}
        </div>
      </section>

      {/* ── Phase guidance ── */}
      <section style={{ marginBottom: 52 }}>
        <window.Eyebrow>Today's guidance · {phase.name} phase</window.Eyebrow>

        {/* Gut + Ayurvedic — two different visual registers */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginTop: 16 }}>
          {/* Gut: plain prose, tinted, no card frame */}
          <div style={{ padding: '22px 24px', borderRadius: 16, background: phase.soft }}>
            <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 13.5, lineHeight: 1.7, color: 'oklch(0.32 0.038 145)', margin: 0 }}>
              <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 9.5, letterSpacing: '0.08em', color: phase.color, display: 'block', marginBottom: 8, textTransform: 'uppercase' }}>Gut</span>
              {phase.gutFocus}
            </p>
          </div>

          {/* Ayurvedic: dark, quote-like, serif — deliberately different register */}
          <div style={{ padding: '22px 24px', borderRadius: 16, background: 'oklch(0.26 0.042 145)' }}>
            <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 9.5, letterSpacing: '0.08em', color: 'oklch(0.68 0.07 88)', display: 'block', marginBottom: 10, textTransform: 'uppercase' }}>{phase.dosha}</span>
            <p style={{ fontFamily: 'Instrument Serif, serif', fontSize: 16, lineHeight: 1.6, color: 'oklch(0.87 0.022 95)', margin: 0, fontStyle: 'italic' }}>
              {phase.ayurvedicFocus}
            </p>
          </div>
        </div>

        {/* Movement — horizontal strip, not a third card */}
        {phase.movement && (
          <div style={{ marginTop: 12, padding: '16px 20px', borderRadius: 14, border: '1px solid oklch(0.87 0.022 95)', display: 'grid', gridTemplateColumns: 'auto 1fr auto', gap: 24, alignItems: 'center' }}>
            {/* Intensity + duration */}
            <div style={{ borderRight: '1px solid oklch(0.88 0.022 95)', paddingRight: 24 }}>
              <div style={{ fontFamily: 'Instrument Serif, serif', fontSize: 32, color: phase.color, lineHeight: 1, fontWeight: 400 }}>{phase.movement.intensity}</div>
              <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 9, color: 'oklch(0.58 0.028 135)', marginTop: 4, letterSpacing: '0.08em', textTransform: 'uppercase' }}>{phase.movement.duration}</div>
            </div>

            {/* Activities + note */}
            <div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 8 }}>
                {phase.movement.best.map(m => (
                  <span key={m} style={{ padding: '4px 10px', borderRadius: 999, background: phase.soft, border: `1px solid ${phase.color}28`, fontFamily: 'DM Sans, sans-serif', fontSize: 12, fontWeight: 500, color: 'oklch(0.34 0.04 140)' }}>{m}</span>
                ))}
              </div>
              <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 12.5, lineHeight: 1.6, color: 'oklch(0.48 0.030 140)', margin: 0 }}>{phase.movement.note}</p>
            </div>

            {/* Ease off */}
            {phase.movement.avoid.length > 0 && (
              <div style={{ borderLeft: '1px solid oklch(0.88 0.022 95)', paddingLeft: 24, maxWidth: 180 }}>
                <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 8.5, color: 'oklch(0.60 0.025 135)', letterSpacing: '0.07em', marginBottom: 6, textTransform: 'uppercase' }}>Ease off</div>
                {phase.movement.avoid.map(a => (
                  <div key={a} style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 12, color: 'oklch(0.50 0.030 135)', lineHeight: 1.5 }}>{a}</div>
                ))}
              </div>
            )}
          </div>
        )}
      </section>

      {/* ── Seasonal veg cards ── */}
      {seasonal && seasonal.veg && seasonal.veg.length > 0 && (
        <section style={{ marginBottom: 48, paddingBottom: 48, borderBottom: '1px solid oklch(0.87 0.022 95)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 20 }}>
            <div>
              <window.Eyebrow>In season · {seasonal.season}</window.Eyebrow>
              <h2 style={{ fontFamily: 'Instrument Serif, serif', fontSize: 28, color: 'oklch(0.28 0.040 145)', margin: '8px 0 0', fontWeight: 400 }}>
                What to buy in <em>{profile.country || 'your area'}</em> right now
              </h2>
            </div>
            <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 12, color: 'oklch(0.58 0.025 135)', flexShrink: 0 }}>
              {plantsToday} plants in today's meals · aim for 30/week
            </span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
            {seasonal.veg.map(v => {
              const info = window.VEG_INFO?.[v.name];
              return (
                <div key={v.name} style={{ padding: '20px 22px', borderRadius: 16, background: 'white', border: '1px solid oklch(0.88 0.022 95)', display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {/* Name + tagline */}
                  <div>
                    <div style={{ fontFamily: 'Instrument Serif, serif', fontSize: 22, color: 'oklch(0.24 0.042 145)', fontWeight: 400, lineHeight: 1.1 }}>{v.name}</div>
                    {info?.tagline && (
                      <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 9.5, color: phase.color, letterSpacing: '0.07em', textTransform: 'uppercase', marginTop: 5 }}>
                        {info.tagline}
                      </div>
                    )}
                  </div>
                  {/* Short note — always shown */}
                  <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 12.5, lineHeight: 1.6, color: 'oklch(0.40 0.032 145)', margin: 0 }}>
                    {v.note}
                  </p>
                  {/* Extended benefits from VEG_INFO */}
                  {info?.benefits && (
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 7, borderTop: '1px solid oklch(0.91 0.018 95)', paddingTop: 10 }}>
                      {info.benefits.map((b, i) => (
                        <li key={i} style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                          <span style={{ color: phase.color, fontSize: 11, marginTop: 2, flexShrink: 0 }}>→</span>
                          <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 12, lineHeight: 1.55, color: 'oklch(0.46 0.030 140)' }}>{b}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                  {/* Phase tags */}
                  {info?.phases && (
                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 2 }}>
                      {info.phases.map(p => <window.PhaseChip key={p} phaseId={p} />)}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* ── Footer ── */}
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <button onClick={() => go('profile')} style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'DM Sans, sans-serif', fontSize: 13.5, color: 'oklch(0.50 0.035 135)' }}>
          Your profile →
        </button>
      </div>
    </div>
  );
}

function Stat({ label, value, sub, accent }) {
  return (
    <div>
      <window.Eyebrow>{label}</window.Eyebrow>
      <div style={{ fontFamily: 'Instrument Serif, serif', fontSize: 42, lineHeight: 1.05, color: accent || 'oklch(0.28 0.040 145)', margin: '8px 0 5px', fontWeight: 400 }}>
        {value}
      </div>
      <div style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 12.5, lineHeight: 1.5, color: 'oklch(0.52 0.032 135)' }}>{sub}</div>
    </div>
  );
}

Object.assign(window, { Dashboard });
