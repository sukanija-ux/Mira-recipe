// Today / Dashboard screen

const { useState: useState_DB, useRef: useRef_DB, useEffect: useEffect_DB } = React;

// ── helpers ──────────────────────────────────────────────────────────────────

function dateKey(d) {
  return d.toISOString().slice(0, 10); // 'YYYY-MM-DD'
}

function addDays(base, n) {
  const d = new Date(base);
  d.setDate(d.getDate() + n);
  return d;
}

const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MEAL_KEYS  = ['breakfast', 'lunch', 'dinner'];
const MEAL_SHORT = { breakfast: 'Breakfast', lunch: 'Lunch', dinner: 'Dinner' };

// ── Recipe picker overlay ─────────────────────────────────────────────────────

function RecipePicker({ slot, onSelect, onClose }) {
  const [query, setQuery] = useState_DB('');
  const inputRef = useRef_DB(null);

  useEffect_DB(() => { inputRef.current?.focus(); }, []);

  const recipes = window.RECIPES.filter(r =>
    !query || r.title.toLowerCase().includes(query.toLowerCase()) || (r.cuisine || '').toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div
      onClick={onClose}
      style={{ position: 'fixed', inset: 0, background: 'oklch(0.15 0.02 145 / 0.45)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{ background: 'oklch(0.97 0.018 90)', borderRadius: 20, width: '100%', maxWidth: 480, maxHeight: '70vh', display: 'flex', flexDirection: 'column', overflow: 'hidden', boxShadow: '0 24px 64px oklch(0.15 0.04 145 / 0.25)' }}
      >
        {/* Header */}
        <div style={{ padding: '18px 20px 14px', borderBottom: '1px solid oklch(0.88 0.022 95)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <window.Eyebrow>{MEAL_SHORT[slot.meal]} · {slot.label}</window.Eyebrow>
            <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'DM Sans, sans-serif', fontSize: 18, color: 'oklch(0.54 0.030 135)', lineHeight: 1 }}>×</button>
          </div>
          <input
            ref={inputRef}
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search recipes…"
            style={{ width: '100%', padding: '9px 12px', borderRadius: 10, border: '1px solid oklch(0.84 0.025 95)', background: 'white', fontFamily: 'DM Sans, sans-serif', fontSize: 13.5, color: 'oklch(0.28 0.040 145)', outline: 'none' }}
          />
        </div>
        {/* List */}
        <div style={{ overflowY: 'auto', padding: '8px 10px 12px' }}>
          {slot.current && (
            <button
              onClick={() => onSelect(null)}
              style={{ width: '100%', textAlign: 'left', padding: '9px 10px', borderRadius: 8, background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'DM Sans, sans-serif', fontSize: 12.5, color: 'oklch(0.58 0.030 135)', marginBottom: 4 }}
            >
              ✕ Remove saved meal
            </button>
          )}
          {recipes.map(r => (
            <button
              key={r.id}
              onClick={() => onSelect(r.id)}
              style={{ width: '100%', textAlign: 'left', padding: '10px 10px', borderRadius: 10, background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'baseline', gap: 10 }}
              onMouseEnter={e => e.currentTarget.style.background = 'white'}
              onMouseLeave={e => e.currentTarget.style.background = 'none'}
            >
              <span style={{ fontFamily: 'Instrument Serif, serif', fontSize: 17, color: 'oklch(0.28 0.040 145)', fontWeight: 400, flex: 1 }}>{r.title}</span>
              <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 9.5, color: 'oklch(0.56 0.028 135)', flexShrink: 0, letterSpacing: '0.05em' }}>{r.minutes}m · {r.protein}g P</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Week planner strip ────────────────────────────────────────────────────────

function WeekPlanner({ profile, setProfile, phase }) {
  const today     = new Date();
  today.setHours(0, 0, 0, 0);
  const todayKey  = dateKey(today);
  const days      = Array.from({ length: 7 }, (_, i) => addDays(today, i));
  const mealSlots = profile.meals === 2 ? ['lunch', 'dinner'] : MEAL_KEYS;

  const [picker, setPicker] = useState_DB(null); // { date, dateKey, meal, label, current }

  function setMeal(dk, meal, recipeId) {
    const plan = { ...profile.mealPlan };
    plan[dk]   = { ...(plan[dk] || {}), [meal]: recipeId };
    if (!recipeId) delete plan[dk][meal];
    if (Object.keys(plan[dk] || {}).length === 0) delete plan[dk];
    setProfile({ ...profile, mealPlan: plan });
  }

  return (
    <>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 8, marginBottom: 52 }}>
        {days.map(d => {
          const dk      = dateKey(d);
          const isToday = dk === todayKey;
          const saved   = profile.mealPlan?.[dk] || {};
          const dayPhase = window.phaseForDay(profile.day + (d - today) / 86400000, profile.length);

          return (
            <div
              key={dk}
              style={{
                borderRadius: 14,
                border: isToday ? `1.5px solid ${phase.color}` : '1px solid oklch(0.88 0.022 95)',
                background: isToday ? phase.soft : 'oklch(0.97 0.015 90)',
                padding: '12px 10px',
                minHeight: 120,
              }}
            >
              {/* Day header */}
              <div style={{ marginBottom: 10 }}>
                <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 9.5, letterSpacing: '0.08em', color: isToday ? phase.color : 'oklch(0.56 0.028 135)', textTransform: 'uppercase' }}>
                  {isToday ? 'Today' : DAY_LABELS[d.getDay()]}
                </div>
                <div style={{ fontFamily: 'Instrument Serif, serif', fontSize: 20, color: 'oklch(0.28 0.040 145)', lineHeight: 1.1, fontWeight: 400 }}>
                  {d.getDate()}
                </div>
              </div>

              {/* Meal slots */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                {mealSlots.map(meal => {
                  const rid     = saved[meal];
                  const recipe  = rid ? window.recipeById(rid) : null;
                  const label   = `${DAY_LABELS[d.getDay()]} ${d.getDate()}`;
                  return (
                    <button
                      key={meal}
                      onClick={() => setPicker({ date: d, dateKey: dk, meal, label, current: rid })}
                      title={meal}
                      style={{
                        textAlign: 'left', padding: '5px 7px', borderRadius: 7,
                        background: recipe ? 'white' : 'transparent',
                        border: recipe ? '1px solid oklch(0.88 0.022 95)' : '1px dashed oklch(0.82 0.022 95)',
                        cursor: 'pointer', width: '100%',
                      }}
                      onMouseEnter={e => e.currentTarget.style.background = 'white'}
                      onMouseLeave={e => e.currentTarget.style.background = recipe ? 'white' : 'transparent'}
                    >
                      {recipe ? (
                        <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 11, color: 'oklch(0.30 0.038 145)', lineHeight: 1.3, display: 'block' }}>
                          {recipe.title.length > 18 ? recipe.title.slice(0, 17) + '…' : recipe.title}
                        </span>
                      ) : (
                        <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 9, color: 'oklch(0.66 0.020 135)', letterSpacing: '0.05em' }}>
                          {meal.slice(0, 1).toUpperCase()} +
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {picker && (
        <RecipePicker
          slot={picker}
          onSelect={(id) => { setMeal(picker.dateKey, picker.meal, id); setPicker(null); }}
          onClose={() => setPicker(null)}
        />
      )}
    </>
  );
}

// ── Dashboard ─────────────────────────────────────────────────────────────────

function Dashboard({ profile, setProfile, go, openRecipe }) {
  const phase = window.phaseForDay(profile.day, profile.length);
  const plan  = window.PLAN_BY_PHASE[phase.id];
  const proteinTarget = Math.round((profile.height - 100) * 1.5);
  const perMeal       = Math.round(proteinTarget / profile.meals);

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

  const stage    = window.lifeStageFor(profile.age);
  const stageNote = stage.id !== 'reproductive' ? ` · ${stage.label} adjustments applied.` : '';
  const plantsToday = window.countPlantsToday(plan);
  const seasonal = window.seasonalVegFor ? window.seasonalVegFor(profile.country || 'Germany') : null;

  const carbLabel = phase.id === 'follicular' ? 'High' : phase.id === 'luteal' ? 'Slow' : 'Moderate';

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: '52px 32px 100px' }}>

      {/* ── Week planner ── */}
      <WeekPlanner profile={profile} setProfile={setProfile} phase={phase} />

      {/* ── Zone 1: Header ── */}
      <header style={{ marginBottom: 48 }}>
        <window.Eyebrow>Day {profile.day} of {profile.length} · {phase.name} phase</window.Eyebrow>
        <h1 style={{
          fontFamily: 'Instrument Serif, serif', fontSize: 60, lineHeight: 1.0,
          color: 'oklch(0.28 0.040 145)', margin: '14px 0 0', fontWeight: 400,
        }}>
          Good morning, <em style={{ color: phase.color }}>{profile.name}</em>.
        </h1>
        <p style={{
          fontFamily: 'Instrument Serif, serif', fontSize: 20, lineHeight: 1.45,
          color: 'oklch(0.48 0.032 135)', margin: '14px 0 0', maxWidth: 640, fontStyle: 'italic',
        }}>
          {phase.headline} You're in the {phase.name.toLowerCase()} phase — {phase.body.split('.')[0].toLowerCase()}.{stageNote}
        </p>
      </header>

      {/* ── Zone 2: Cycle ring + key numbers ── */}
      <section style={{
        display: 'grid', gridTemplateColumns: '200px 1fr',
        gap: 48, alignItems: 'center',
        marginBottom: 48, paddingBottom: 48,
        borderBottom: '1px solid oklch(0.87 0.022 95)',
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 10 }}>
          <button onClick={() => go('cycle')} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
            <window.HormoneRing day={profile.day} length={profile.length} size={188} label={false} />
          </button>
          <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 12, color: 'oklch(0.54 0.030 135)', lineHeight: 1.5, margin: 0 }}>
            Seed cycling · <em style={{ fontFamily: 'Instrument Serif, serif', fontSize: 13, color: 'oklch(0.38 0.038 145)' }}>{phase.seed}</em>
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 32 }}>
          <Stat
            label="Daily protein"
            value={`${proteinTarget}g`}
            sub={`${perMeal}g per meal · ${profile.meals}× a day`}
          />
          <Stat
            label="Meal spacing"
            value="4–6 h"
            sub="Leave 4–6 hours between meals. Avoid snacking to let your gut clear."
          />
          <Stat
            label="Carbs today"
            value={carbLabel}
            sub={carbLabel === 'High' ? 'Follicular peak — complex carbs welcome' : carbLabel === 'Slow' ? 'Luteal phase — keep to low-GI options' : 'Moderate — breakfast and lunch only'}
            accent={phase.color}
          />
        </div>
      </section>

      {/* ── Zone 3: Today's meals (most actionable — comes first) ── */}
      <section style={{ marginBottom: 52 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 22 }}>
          <h2 style={{
            fontFamily: 'Instrument Serif, serif', fontSize: 36,
            color: 'oklch(0.28 0.040 145)', margin: 0, fontWeight: 400,
          }}>
            Today's <em>meals</em>
          </h2>
          <button
            onClick={() => go('browse')}
            style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'DM Sans, sans-serif', fontSize: 13.5, color: 'oklch(0.50 0.035 135)' }}
          >
            Swap a meal →
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: `repeat(${mealsList.length}, 1fr)`, gap: 16 }}>
          {mealsList.map((m) => (
            <article
              key={m.key}
              onClick={() => openRecipe(m.r.id)}
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

      {/* ── Zone 4: Phase guidance — gut · ayurveda · movement in one row ── */}
      <section style={{ marginBottom: 48 }}>
        <window.Eyebrow style={{ marginBottom: 16 }}>Today's guidance · {phase.name} phase</window.Eyebrow>
        <div style={{ display: 'grid', gridTemplateColumns: phase.movement ? '1fr 1fr 1fr' : '1fr 1fr', gap: 16, marginTop: 14 }}>

          {/* Gut focus */}
          <div style={{ padding: '20px 22px', borderRadius: 16, background: phase.soft, border: `1px solid ${phase.color}28` }}>
            <window.Eyebrow color={phase.color}>Gut focus</window.Eyebrow>
            <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 13.5, lineHeight: 1.65, color: 'oklch(0.34 0.035 140)', margin: '10px 0 0' }}>
              {phase.gutFocus}
            </p>
          </div>

          {/* Ayurvedic lens */}
          <div style={{ padding: '20px 22px', borderRadius: 16, background: 'oklch(0.28 0.040 145)' }}>
            <window.Eyebrow color="oklch(0.76 0.08 88)">Ayurvedic · {phase.dosha}</window.Eyebrow>
            <p style={{ fontFamily: 'Instrument Serif, serif', fontSize: 15, lineHeight: 1.55, color: 'oklch(0.88 0.025 95)', margin: '10px 0 0', fontStyle: 'italic' }}>
              {phase.ayurvedicFocus}
            </p>
          </div>

          {/* Movement */}
          {phase.movement && (
            <div style={{ padding: '20px 22px', borderRadius: 16, background: 'oklch(0.97 0.018 90)', border: '1px solid oklch(0.87 0.022 95)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <window.Eyebrow>Movement</window.Eyebrow>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontFamily: 'Instrument Serif, serif', fontSize: 28, color: phase.color, lineHeight: 1, fontWeight: 400 }}>
                    {phase.movement.intensity}
                  </div>
                  <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 9, color: 'oklch(0.56 0.030 135)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                    {phase.movement.duration}
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, margin: '10px 0 8px' }}>
                {phase.movement.best.map(m => (
                  <span key={m} style={{ padding: '5px 10px', borderRadius: 999, background: phase.soft, border: `1px solid ${phase.color}30`, fontFamily: 'DM Sans, sans-serif', fontSize: 12, fontWeight: 500, color: 'oklch(0.34 0.04 140)' }}>
                    {m}
                  </span>
                ))}
              </div>
              <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 12.5, lineHeight: 1.6, color: 'oklch(0.46 0.032 140)', margin: '0' }}>
                {phase.movement.note}
              </p>
              {phase.movement.avoid.length > 0 && (
                <p style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 9.5, color: 'oklch(0.56 0.030 135)', marginTop: 8, letterSpacing: '0.05em' }}>
                  EASE OFF · {phase.movement.avoid.join(' · ')}
                </p>
              )}
            </div>
          )}
        </div>
      </section>

      {/* ── Zone 5: Seasonal veg footer ── */}
      <section style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
        gap: 40, paddingTop: 28,
        borderTop: '1px solid oklch(0.87 0.022 95)',
      }}>
        {seasonal && seasonal.veg && seasonal.veg.length > 0 ? (
          <div style={{ flex: 1 }}>
            <window.Eyebrow>In season · {seasonal.season} · {profile.country || 'your area'}</window.Eyebrow>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 10 }}>
              {seasonal.veg.map(v => (
                <span key={v.name} title={v.note} style={{
                  padding: '5px 12px', borderRadius: 999,
                  background: phase.soft, border: `1px solid ${phase.color}28`,
                  fontFamily: 'DM Sans, sans-serif', fontSize: 12.5, fontWeight: 500,
                  color: 'oklch(0.34 0.038 140)', cursor: 'default',
                }}>
                  {v.name}
                </span>
              ))}
            </div>
            <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 11.5, color: 'oklch(0.54 0.028 135)', marginTop: 8, lineHeight: 1.5 }}>
              Hover any veg for its hormonal benefit. · Today's meals include {plantsToday} plants — aim for 30 a week.
            </p>
          </div>
        ) : <div />}

        <button
          onClick={() => go('profile')}
          style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'DM Sans, sans-serif', fontSize: 13.5, color: 'oklch(0.50 0.035 135)', paddingTop: 4, flexShrink: 0 }}
        >
          Your profile →
        </button>
      </section>
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
