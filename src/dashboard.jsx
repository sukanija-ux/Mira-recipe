// Today / Dashboard screen

const { useState: useState_DB, useEffect: useEffect_DB } = React;

function Dashboard({ profile, go, openRecipe }) {
  const phase = window.phaseForDay(profile.day, profile.length);
  const plan  = window.PLAN_BY_PHASE[phase.id];
  const proteinTarget = Math.round((profile.height - 100) * 1.5);
  const perMeal       = Math.round(proteinTarget / profile.meals);

  const [hoursSince, setHoursSince] = useState_DB(3.2);
  useEffect_DB(() => {
    const t = setInterval(() => setHoursSince(h => h + 1 / 60), 1000);
    return () => clearInterval(t);
  }, []);

  const mealsList = profile.meals === 2
    ? [
        { key: 'lunch',  label: 'Lunch',  time: '12:30', r: window.recipeById(plan.lunch) },
        { key: 'dinner', label: 'Dinner', time: '18:30', r: window.recipeById(plan.dinner) },
      ]
    : [
        { key: 'breakfast', label: 'Breakfast', time: '08:00', r: window.recipeById(plan.breakfast) },
        { key: 'lunch',     label: 'Lunch',     time: '13:00', r: window.recipeById(plan.lunch) },
        { key: 'dinner',    label: 'Dinner',    time: '19:00', r: window.recipeById(plan.dinner) },
      ];

  const nextMealReady = hoursSince >= 4;
  const mmcActive     = hoursSince >= 4;
  const stage = window.lifeStageFor(profile.age);
  const stageNote = stage.id !== 'reproductive' ? ` · ${stage.label} adjustments applied.` : '';

  const plantsToday   = window.countPlantsToday(plan);
  const weeklyPct     = Math.round((plantsToday / 30) * 100);

  const tones = ['clay', 'sage', 'honey', 'plum'];

  return (
    <div style={{ maxWidth: 1180, margin: '0 auto', padding: '64px 32px 120px' }}>

      {/* Header */}
      <header style={{ marginBottom: 64 }}>
        <window.Eyebrow>Day {profile.day} of {profile.length} · {phase.name} phase</window.Eyebrow>
        <h1 style={{ fontFamily: 'Instrument Serif, serif', fontSize: 80, lineHeight: 0.98, color: 'oklch(0.28 0.040 145)', margin: '18px 0 0', fontWeight: 400 }}>
          Good morning, <em style={{ color: phase.color }}>{profile.name}</em>.
        </h1>
        <p style={{ fontFamily: 'Instrument Serif, serif', fontSize: 26, lineHeight: 1.35, color: 'oklch(0.46 0.035 135)', margin: '22px 0 0', maxWidth: 720, fontStyle: 'italic' }}>
          {phase.headline} You're in the {phase.name.toLowerCase()} phase — {phase.body.split('.')[0].toLowerCase()}.{stageNote}
        </p>
      </header>

      {/* Ring + stats */}
      <section style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: 64, alignItems: 'center', marginBottom: 80, paddingBottom: 64, borderBottom: '1px solid oklch(0.86 0.025 95)' }}>
        <button onClick={() => go('cycle')} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
          <window.HormoneRing day={profile.day} length={profile.length} size={260} label={false} />
        </button>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 48 }}>
          <Stat label="Daily protein" value={`${proteinTarget}g`} sub={`${perMeal}g per meal · ${profile.meals}× a day`} />
          <Stat
            label="Last meal"
            value={`${hoursSince.toFixed(1)}h`}
            sub={mmcActive
              ? `MMC gut-clearing window active · ${hoursSince.toFixed(1)}h fasted`
              : `${(4 - hoursSince).toFixed(1)}h until MMC window opens`}
            accent={mmcActive ? 'oklch(0.58 0.08 138)' : phase.color}
          />
          <Stat
            label="Carb permission"
            value={phase.id === 'follicular' ? 'High' : phase.id === 'luteal' ? 'Slow' : 'Moderate'}
            sub="Breakfast & lunch only"
          />
        </div>
      </section>

      {/* Gut & Ayurvedic focus for today's phase */}
      <section style={{ marginBottom: 32, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
        <div style={{ padding: 28, borderRadius: 18, background: phase.soft, border: `1px solid ${phase.color}30` }}>
          <window.Eyebrow color={phase.color}>Gut focus · {phase.name}</window.Eyebrow>
          <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 14.5, lineHeight: 1.65, color: 'oklch(0.34 0.035 140)', margin: '12px 0 0' }}>
            {phase.gutFocus}
          </p>
        </div>
        <div style={{ padding: 28, borderRadius: 18, background: 'oklch(0.28 0.040 145)', color: 'oklch(0.93 0.022 90)' }}>
          <window.Eyebrow color="oklch(0.76 0.08 88)">Ayurvedic lens · {phase.dosha}</window.Eyebrow>
          <p style={{ fontFamily: 'Instrument Serif, serif', fontSize: 16, lineHeight: 1.55, color: 'oklch(0.88 0.025 95)', margin: '12px 0 0', fontStyle: 'italic' }}>
            {phase.ayurvedicFocus}
          </p>
        </div>
      </section>

      {/* Movement card */}
      {phase.movement && (
        <section style={{ marginBottom: 64 }}>
          <div style={{ padding: '28px 32px', borderRadius: 18, background: 'oklch(0.97 0.018 90)', border: '1px solid oklch(0.86 0.025 95)', display: 'grid', gridTemplateColumns: '1fr auto', gap: 32, alignItems: 'start' }}>
            <div>
              <window.Eyebrow>Today's movement · {phase.name} phase</window.Eyebrow>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 14 }}>
                {phase.movement.best.map(m => (
                  <span key={m} style={{
                    padding: '7px 14px', borderRadius: 999,
                    background: phase.soft, border: `1px solid ${phase.color}35`,
                    fontFamily: 'DM Sans, sans-serif', fontSize: 13.5, fontWeight: 500,
                    color: 'oklch(0.32 0.04 140)',
                  }}>{m}</span>
                ))}
              </div>
              <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 13.5, lineHeight: 1.65, color: 'oklch(0.44 0.035 140)', margin: '14px 0 0', maxWidth: 680 }}>
                {phase.movement.note}
              </p>
              {phase.movement.avoid.length > 0 && (
                <p style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10.5, color: 'oklch(0.54 0.035 135)', marginTop: 10, letterSpacing: '0.05em' }}>
                  EASE OFF · {phase.movement.avoid.join(' · ')}
                </p>
              )}
            </div>
            <div style={{ textAlign: 'right', flexShrink: 0 }}>
              <div style={{ fontFamily: 'Instrument Serif, serif', fontSize: 48, color: phase.color, lineHeight: 1, fontWeight: 400 }}>
                {phase.movement.intensity}
              </div>
              <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, color: 'oklch(0.54 0.035 135)', marginTop: 6, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                {phase.movement.duration}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Today's plan */}
      <section style={{ marginBottom: 80 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 32 }}>
          <h2 style={{ fontFamily: 'Instrument Serif, serif', fontSize: 44, color: 'oklch(0.28 0.040 145)', margin: 0, fontWeight: 400 }}>
            Today's <em>plan</em>
          </h2>
          <button onClick={() => go('browse')} style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'DM Sans, sans-serif', fontSize: 14, color: 'oklch(0.50 0.035 135)' }}>
            Swap a meal →
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: `repeat(${mealsList.length}, 1fr)`, gap: 24 }}>
          {mealsList.map((m, i) => (
            <article key={m.key} onClick={() => openRecipe(m.r.id)} style={{ cursor: 'pointer', padding: '20px 22px', borderRadius: 18, background: 'oklch(0.97 0.015 90)', border: '1px solid oklch(0.88 0.022 95)' }}
              onMouseEnter={e => e.currentTarget.style.background = 'white'}
              onMouseLeave={e => e.currentTarget.style.background = 'oklch(0.97 0.015 90)'}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <window.Eyebrow>{m.label} · {m.time}</window.Eyebrow>
                  <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10.5, color: 'oklch(0.54 0.035 135)', letterSpacing: '0.06em' }}>
                    {m.r.minutes}M · {m.r.protein}G P
                  </span>
                </div>
                <h3 style={{ fontFamily: 'Instrument Serif, serif', fontSize: 26, lineHeight: 1.15, color: 'oklch(0.28 0.040 145)', margin: 0, fontWeight: 400 }}>
                  {m.r.title}
                </h3>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Seed cycling + 30-plants footer */}
      <section style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 40, paddingTop: 28, borderTop: '1px solid oklch(0.86 0.025 95)', alignItems: 'center' }}>
        <div>
          <window.Eyebrow>Today's seed cycling</window.Eyebrow>
          <div style={{ fontFamily: 'Instrument Serif, serif', fontSize: 28, color: 'oklch(0.28 0.040 145)', marginTop: 6, fontStyle: 'italic' }}>
            {phase.seed}
          </div>
        </div>
        <div>
          <window.Eyebrow>Plant diversity · 30/week goal</window.Eyebrow>
          <div style={{ marginTop: 10, display: 'flex', alignItems: 'baseline', gap: 10 }}>
            <span style={{ fontFamily: 'Instrument Serif, serif', fontSize: 42, color: 'oklch(0.58 0.09 140)', lineHeight: 1 }}>{plantsToday}</span>
            <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 13.5, color: 'oklch(0.50 0.035 135)' }}>plants today · {weeklyPct}% of weekly goal</span>
          </div>
          <div style={{ marginTop: 8, height: 4, borderRadius: 999, background: 'oklch(0.88 0.025 95)', overflow: 'hidden' }}>
            <div style={{ height: '100%', borderRadius: 999, background: 'oklch(0.58 0.09 140)', width: `${Math.min(weeklyPct, 100)}%`, transition: 'width 0.4s ease' }} />
          </div>
          <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 9.5, color: 'oklch(0.54 0.035 135)', marginTop: 5, letterSpacing: '0.08em' }}>
            {plantsToday >= 4 ? 'GREAT DAY · 4+ PLANTS THRESHOLD MET' : `ADD ${4 - plantsToday} MORE PLANTS TODAY`}
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <button onClick={() => go('profile')} style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'DM Sans, sans-serif', fontSize: 14, color: 'oklch(0.50 0.035 135)' }}>
            Your profile →
          </button>
        </div>
      </section>
    </div>
  );
}

function Stat({ label, value, sub, accent }) {
  return (
    <div>
      <window.Eyebrow>{label}</window.Eyebrow>
      <div style={{ fontFamily: 'Instrument Serif, serif', fontSize: 48, lineHeight: 1, color: accent || 'oklch(0.28 0.040 145)', margin: '10px 0 6px', fontWeight: 400 }}>
        {value}
      </div>
      <div style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 13, color: 'oklch(0.52 0.035 135)' }}>{sub}</div>
    </div>
  );
}

Object.assign(window, { Dashboard });
