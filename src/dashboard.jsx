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
  const stage = window.lifeStageFor(profile.age);
  const stageNote = stage.id !== 'reproductive' ? ` · ${stage.label} adjustments applied.` : '';

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
            value={`${hoursSince.toFixed(1)}h ago`}
            sub={nextMealReady ? 'Ready when you are' : `${(4 - hoursSince).toFixed(1)}h until next`}
            accent={nextMealReady ? 'oklch(0.58 0.08 138)' : phase.color}
          />
          <Stat
            label="Carb permission"
            value={phase.id === 'follicular' ? 'High' : phase.id === 'luteal' ? 'Slow' : 'Moderate'}
            sub="Breakfast & lunch only"
          />
        </div>
      </section>

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
            <article key={m.key} onClick={() => openRecipe(m.r.id)} style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: 16 }}>
              <window.ImagePlot label={m.r.title} tone={tones[i % tones.length]} aspect="4/5" round={18} />
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

      {/* Seed cycling footer */}
      <section style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 28, borderTop: '1px solid oklch(0.86 0.025 95)' }}>
        <div>
          <window.Eyebrow>Today's seed cycling</window.Eyebrow>
          <div style={{ fontFamily: 'Instrument Serif, serif', fontSize: 28, color: 'oklch(0.28 0.040 145)', marginTop: 6, fontStyle: 'italic' }}>
            {phase.seed}
          </div>
        </div>
        <button onClick={() => go('shop')} style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'DM Sans, sans-serif', fontSize: 14, color: 'oklch(0.50 0.035 135)' }}>
          Shopping list →
        </button>
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
