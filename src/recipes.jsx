// Recipe browse + recipe detail screens

const { useState: useState_R, useMemo: useMemo_R, useRef: useRef_R, useEffect: useEffect_R } = React;

// ── helpers ───────────────────────────────────────────────────────────────────

function dateKeyR(d) { return d.toISOString().slice(0, 10); }
function addDaysR(base, n) { const d = new Date(base); d.setDate(d.getDate() + n); return d; }
const DAY_LABELS_R  = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTH_LABELS_R = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

// ── Add-to-plan picker overlay ────────────────────────────────────────────────
// Opens from both RecipeBrowse cards and RecipeDetail.

function AddToPlanPicker({ recipe, profile, setProfile, onClose }) {
  const today    = new Date(); today.setHours(0,0,0,0);
  const todayKey = dateKeyR(today);
  const days     = Array.from({ length: 7 }, (_, i) => addDaysR(today, i));
  const mealSlots = profile.meals === 2 ? ['lunch', 'dinner'] : ['breakfast', 'lunch', 'dinner'];
  const [selected, setSelected] = useState_R(null); // { dk, meal }

  function save() {
    if (!selected) return;
    const plan = { ...profile.mealPlan };
    plan[selected.dk] = { ...(plan[selected.dk] || {}), [selected.meal]: recipe.id };
    setProfile({ ...profile, mealPlan: plan });
    onClose();
  }

  return (
    <div
      onClick={onClose}
      style={{ position: 'fixed', inset: 0, background: 'oklch(0.15 0.02 145 / 0.4)', zIndex: 300, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{ background: 'oklch(0.97 0.018 90)', borderRadius: 20, width: '100%', maxWidth: 520, boxShadow: '0 24px 64px oklch(0.15 0.04 145 / 0.22)', overflow: 'hidden' }}
      >
        {/* Header */}
        <div style={{ padding: '18px 22px 16px', borderBottom: '1px solid oklch(0.88 0.022 95)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <window.Eyebrow>Add to plan</window.Eyebrow>
            <div style={{ fontFamily: 'Instrument Serif, serif', fontSize: 22, color: 'oklch(0.28 0.040 145)', marginTop: 4, fontWeight: 400 }}>
              {recipe.title}
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 20, color: 'oklch(0.56 0.028 135)', lineHeight: 1, padding: '2px 4px' }}>×</button>
        </div>

        {/* Day × meal grid */}
        <div style={{ padding: '16px 22px 20px' }}>
          <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 12.5, color: 'oklch(0.54 0.028 135)', margin: '0 0 14px' }}>
            Pick a day and meal slot.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 6 }}>
            {days.map(d => {
              const dk      = dateKeyR(d);
              const isToday = dk === todayKey;
              const saved   = profile.mealPlan?.[dk] || {};
              return (
                <div key={dk}>
                  {/* Day label */}
                  <div style={{ textAlign: 'center', marginBottom: 6 }}>
                    <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 9, letterSpacing: '0.06em', color: isToday ? 'oklch(0.44 0.10 145)' : 'oklch(0.58 0.028 135)', textTransform: 'uppercase' }}>
                      {isToday ? 'Today' : DAY_LABELS_R[d.getDay()]}
                    </div>
                    <div style={{ fontFamily: 'Instrument Serif, serif', fontSize: 17, color: 'oklch(0.28 0.040 145)', lineHeight: 1.1 }}>
                      {d.getDate()}
                    </div>
                  </div>
                  {/* Meal slots */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                    {mealSlots.map(meal => {
                      const isSel   = selected?.dk === dk && selected?.meal === meal;
                      const hasOther = saved[meal] && saved[meal] !== recipe.id;
                      return (
                        <button
                          key={meal}
                          onClick={() => setSelected(isSel ? null : { dk, meal })}
                          title={hasOther ? `Replaces: ${window.recipeById(saved[meal])?.title}` : meal}
                          style={{
                            padding: '5px 0', borderRadius: 6, fontSize: 9.5,
                            fontFamily: 'JetBrains Mono, monospace', letterSpacing: '0.04em',
                            textTransform: 'uppercase', cursor: 'pointer',
                            background: isSel ? 'oklch(0.28 0.040 145)' : hasOther ? 'oklch(0.88 0.030 100)' : 'oklch(0.92 0.018 95)',
                            color: isSel ? 'white' : hasOther ? 'oklch(0.40 0.05 120)' : 'oklch(0.52 0.030 135)',
                            border: isSel ? '1px solid oklch(0.28 0.040 145)' : '1px solid transparent',
                          }}
                        >
                          {meal[0].toUpperCase()}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
          {selected && (
            <div style={{ marginTop: 14, fontFamily: 'DM Sans, sans-serif', fontSize: 12, color: 'oklch(0.52 0.030 135)' }}>
              {(() => {
                const d = days.find(x => dateKeyR(x) === selected.dk);
                const label = dateKeyR(d) === todayKey ? 'Today' : `${DAY_LABELS_R[d.getDay()]} ${d.getDate()} ${MONTH_LABELS_R[d.getMonth()]}`;
                return `Adding to ${label} · ${selected.meal.charAt(0).toUpperCase() + selected.meal.slice(1)}`;
              })()}
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{ padding: '12px 22px 18px', display: 'flex', justifyContent: 'flex-end', gap: 10, borderTop: '1px solid oklch(0.88 0.022 95)' }}>
          <button onClick={onClose} style={{ padding: '9px 18px', borderRadius: 10, background: 'none', border: '1px solid oklch(0.84 0.025 95)', cursor: 'pointer', fontFamily: 'DM Sans, sans-serif', fontSize: 13.5, color: 'oklch(0.46 0.032 135)' }}>
            Cancel
          </button>
          <button
            onClick={save}
            disabled={!selected}
            style={{ padding: '9px 20px', borderRadius: 10, background: selected ? 'oklch(0.28 0.040 145)' : 'oklch(0.84 0.022 95)', border: 'none', cursor: selected ? 'pointer' : 'default', fontFamily: 'DM Sans, sans-serif', fontSize: 13.5, fontWeight: 500, color: selected ? 'white' : 'oklch(0.60 0.028 135)' }}
          >
            Add to plan
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Week planner (slot picker uses existing RecipePicker-style inline search) ──

function WeekSlotPicker({ slot, onSelect, onClose, isIR, perMeal }) {
  const [query, setQuery] = useState_R('');
  const inputRef = useRef_R(null);
  useEffect_R(() => { inputRef.current?.focus(); }, []);
  let pool = isIR ? window.irFilterRecipes(window.RECIPES) : window.RECIPES;
  pool = pool.filter(r => (r.protein || 0) >= (perMeal || 0));
  const recipes = pool.filter(r =>
    !query || r.title.toLowerCase().includes(query.toLowerCase()) || (r.cuisine || '').toLowerCase().includes(query.toLowerCase())
  );
  return (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'oklch(0.15 0.02 145 / 0.45)', zIndex: 300, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div onClick={e => e.stopPropagation()} style={{ background: 'oklch(0.97 0.018 90)', borderRadius: 20, width: '100%', maxWidth: 460, maxHeight: '68vh', display: 'flex', flexDirection: 'column', overflow: 'hidden', boxShadow: '0 24px 64px oklch(0.15 0.04 145 / 0.25)' }}>
        <div style={{ padding: '16px 20px 12px', borderBottom: '1px solid oklch(0.88 0.022 95)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
            <window.Eyebrow>{slot.meal.charAt(0).toUpperCase() + slot.meal.slice(1)} · {slot.label}</window.Eyebrow>
            <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 18, color: 'oklch(0.54 0.030 135)', lineHeight: 1 }}>×</button>
          </div>
          <input ref={inputRef} value={query} onChange={e => setQuery(e.target.value)} placeholder="Search recipes…"
            style={{ width: '100%', padding: '8px 12px', borderRadius: 9, border: '1px solid oklch(0.84 0.025 95)', background: 'white', fontFamily: 'DM Sans, sans-serif', fontSize: 13.5, color: 'oklch(0.28 0.040 145)', outline: 'none' }} />
        </div>
        <div style={{ overflowY: 'auto', padding: '6px 10px 10px' }}>
          {slot.current && (
            <button onClick={() => onSelect(null)} style={{ width: '100%', textAlign: 'left', padding: '8px 10px', borderRadius: 7, background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'DM Sans, sans-serif', fontSize: 12, color: 'oklch(0.58 0.030 135)', marginBottom: 2 }}>
              ✕ Remove meal
            </button>
          )}
          {recipes.map(r => (
            <button key={r.id} onClick={() => onSelect(r.id)}
              style={{ width: '100%', textAlign: 'left', padding: '9px 10px', borderRadius: 9, background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'baseline', gap: 10 }}
              onMouseEnter={e => e.currentTarget.style.background = 'white'}
              onMouseLeave={e => e.currentTarget.style.background = 'none'}
            >
              <span style={{ fontFamily: 'Instrument Serif, serif', fontSize: 17, color: 'oklch(0.28 0.040 145)', flex: 1 }}>{r.title}</span>
              <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 9.5, color: 'oklch(0.56 0.028 135)', flexShrink: 0, letterSpacing: '0.05em' }}>{r.minutes}m · {r.protein}g P</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function WeekPlanner({ profile, setProfile, phase }) {
  const isIR      = (profile.conditions || []).includes('insulin-resistance');
  const perMeal   = Math.round(Math.round((profile.height - 100) * 1.5) / profile.meals);
  const today     = new Date(); today.setHours(0,0,0,0);
  const todayKey  = dateKeyR(today);
  const days      = Array.from({ length: 7 }, (_, i) => addDaysR(today, i));
  const mealSlots = profile.meals === 2 ? ['lunch', 'dinner'] : ['breakfast', 'lunch', 'dinner'];
  const [picker, setPicker] = useState_R(null);

  function setMeal(dk, meal, recipeId) {
    const plan = { ...profile.mealPlan };
    plan[dk]   = { ...(plan[dk] || {}), [meal]: recipeId };
    if (!recipeId) delete plan[dk][meal];
    if (Object.keys(plan[dk] || {}).length === 0) delete plan[dk];
    setProfile({ ...profile, mealPlan: plan });
  }

  return (
    <>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 8, marginBottom: 48 }}>
        {days.map(d => {
          const dk      = dateKeyR(d);
          const isToday = dk === todayKey;
          const saved   = profile.mealPlan?.[dk] || {};
          return (
            <div key={dk} style={{ borderRadius: 14, border: isToday ? `1.5px solid ${phase.color}` : '1px solid oklch(0.88 0.022 95)', background: isToday ? phase.soft : 'oklch(0.97 0.015 90)', padding: '12px 10px', minHeight: 120 }}>
              <div style={{ marginBottom: 10 }}>
                <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 9.5, letterSpacing: '0.08em', color: isToday ? phase.color : 'oklch(0.56 0.028 135)', textTransform: 'uppercase' }}>
                  {isToday ? 'Today' : DAY_LABELS_R[d.getDay()]}
                </div>
                <div style={{ fontFamily: 'Instrument Serif, serif', fontSize: 20, color: 'oklch(0.28 0.040 145)', lineHeight: 1.1, fontWeight: 400 }}>
                  {d.getDate()}
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                {mealSlots.map(meal => {
                  const rid    = saved[meal];
                  const recipe = rid ? window.recipeById(rid) : null;
                  return (
                    <button key={meal}
                      onClick={() => setPicker({ date: d, dateKey: dk, meal, label: `${DAY_LABELS_R[d.getDay()]} ${d.getDate()}`, current: rid })}
                      title={meal}
                      style={{ textAlign: 'left', padding: '5px 7px', borderRadius: 7, background: recipe ? 'white' : 'transparent', border: recipe ? '1px solid oklch(0.88 0.022 95)' : '1px dashed oklch(0.82 0.022 95)', cursor: 'pointer', width: '100%' }}
                      onMouseEnter={e => e.currentTarget.style.background = 'white'}
                      onMouseLeave={e => e.currentTarget.style.background = recipe ? 'white' : 'transparent'}
                    >
                      {recipe ? (
                        <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 11, color: 'oklch(0.30 0.038 145)', lineHeight: 1.3, display: 'block' }}>
                          {recipe.title.length > 18 ? recipe.title.slice(0, 17) + '…' : recipe.title}
                        </span>
                      ) : (
                        <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 9, color: 'oklch(0.66 0.020 135)', letterSpacing: '0.05em' }}>
                          {meal[0].toUpperCase()} +
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
        <WeekSlotPicker
          slot={picker}
          onSelect={id => { setMeal(picker.dateKey, picker.meal, id); setPicker(null); }}
          onClose={() => setPicker(null)}
          isIR={isIR}
          perMeal={perMeal}
        />
      )}
    </>
  );
}

// ── Recipe browse ─────────────────────────────────────────────────────────────

function RecipeBrowse({ profile, setProfile, openRecipe }) {
  const phase    = window.phaseForDay(profile.day, profile.length);
  const isIR     = (profile.conditions || []).includes('insulin-resistance');
  const perMeal  = Math.round(Math.round((profile.height - 100) * 1.5) / profile.meals);
  const [filter,     setFilter]     = useState_R('phase');
  const [meal,       setMeal]       = useState_R('all');
  const [cuisine,    setCuisine]    = useState_R('all');
  const [condFilter, setCondFilter] = useState_R('all');
  const [planRecipe, setPlanRecipe] = useState_R(null); // recipe object for AddToPlanPicker

  // Base pool: exclude high-starch (IR) and below-protein-target recipes
  const baseRecipes = useMemo_R(() => {
    let pool = isIR ? window.irFilterRecipes(window.RECIPES) : window.RECIPES;
    pool = pool.filter(r => (r.protein || 0) >= perMeal);
    return pool;
  }, [isIR, perMeal]);

  const conditionTags = useMemo_R(() => {
    const conditions = profile.conditions || [];
    const tags = new Set();
    (window.HEALTH_CONDITIONS || []).forEach(c => {
      if (conditions.includes(c.id)) c.tagBoost.forEach(t => tags.add(t));
    });
    return tags;
  }, [profile.conditions]);

  const list = useMemo_R(() => {
    return baseRecipes.filter(r => {
      if (filter === 'phase' && !r.phases.includes(phase.id)) return false;
      const meals = Array.isArray(r.meal) ? r.meal : [r.meal];
      if (meal !== 'all' && !meals.includes(meal)) return false;
      if (cuisine !== 'all' && r.cuisine !== cuisine) return false;
      if (condFilter === 'conditions' && conditionTags.size > 0) {
        if (!r.tags.some(t => conditionTags.has(t))) return false;
      }
      return true;
    });
  }, [baseRecipes, filter, meal, cuisine, condFilter, conditionTags, phase.id]);

  return (
    <div style={{ maxWidth: 1180, margin: '0 auto', padding: '64px 32px 120px' }}>

      {/* ── Meal prep calendar ── */}
      <div style={{ marginBottom: 16 }}>
        <window.Eyebrow>Meal prep · next 7 days</window.Eyebrow>
        <div style={{ marginTop: 14 }}>
          <WeekPlanner profile={profile} setProfile={setProfile} phase={phase} />
        </div>
      </div>

      <header style={{ marginBottom: isIR ? 24 : 56, paddingTop: 16, borderTop: '1px solid oklch(0.87 0.022 95)' }}>
        <window.Eyebrow>Recipe library · {list.length} of {baseRecipes.length} · ≥{perMeal}g protein per meal{isIR ? ' · starchy hidden' : ''}</window.Eyebrow>
        <h1 style={{ fontFamily: 'Instrument Serif, serif', fontSize: 72, lineHeight: 0.98, color: 'oklch(0.28 0.040 145)', margin: '18px 0 0', fontWeight: 400 }}>
          <em>Real</em> recipes, from real kitchens.
        </h1>
      </header>

      {/* IR notice */}
      {isIR && (
        <div style={{ marginBottom: 40, padding: '14px 18px', borderRadius: 12, background: 'oklch(0.96 0.030 55)', border: '1px solid oklch(0.88 0.06 55)', display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontSize: 16 }}>◈</span>
          <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 13, lineHeight: 1.5, color: 'oklch(0.36 0.07 50)', margin: 0 }}>
            <strong>Insulin Resistance mode on</strong> — recipes containing lentils, chickpeas, beans, rice, noodles, oats and other high-starch ingredients are hidden. To see all recipes, remove Insulin Resistance from your profile.
          </p>
        </div>
      )}

      {/* Filter rows */}
      <div style={{ marginBottom: 40, paddingBottom: 18, borderBottom: '1px solid oklch(0.86 0.025 95)' }}>
        <div style={{ display: 'flex', gap: 24, alignItems: 'center', marginBottom: 14, flexWrap: 'wrap' }}>
          {[{ id: 'phase', l: `✦ ${phase.name} phase` }, { id: 'all', l: 'All phases' }].map(b => (
            <FilterPill key={b.id} active={filter === b.id} color={filter === b.id && b.id === 'phase' ? phase.color : null} onClick={() => setFilter(b.id)}>{b.l}</FilterPill>
          ))}
          <span style={{ width: 1, height: 16, background: 'oklch(0.84 0.025 95)' }} />
          {['all', 'breakfast', 'lunch', 'dinner'].map(m => (
            <FilterPill key={m} active={meal === m} onClick={() => setMeal(m)}>
              {m === 'all' ? 'Any meal' : m.charAt(0).toUpperCase() + m.slice(1)}
            </FilterPill>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap', marginBottom: (profile.conditions || []).length > 0 ? 10 : 0 }}>
          <FilterPill active={cuisine === 'all'} onClick={() => setCuisine('all')}>All cuisines</FilterPill>
          {window.RECIPE_CUISINE_FILTERS.map(c => (
            <FilterPill key={c.id} active={cuisine === c.id} onClick={() => setCuisine(c.id)}>{c.label}</FilterPill>
          ))}
        </div>
        {(profile.conditions || []).length > 0 && (
          <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap', paddingTop: 10, borderTop: '1px dashed oklch(0.88 0.025 95)' }}>
            <FilterPill active={condFilter === 'all'} onClick={() => setCondFilter('all')}>All recipes</FilterPill>
            <FilterPill active={condFilter === 'conditions'} color={condFilter === 'conditions' ? 'oklch(0.58 0.09 140)' : null} onClick={() => setCondFilter('conditions')}>
              ✦ For your conditions
            </FilterPill>
            <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, color: 'oklch(0.60 0.035 135)', letterSpacing: '0.06em' }}>
              {(profile.conditions || []).map(cid => (window.HEALTH_CONDITIONS || []).find(x => x.id === cid)?.label).filter(Boolean).join(' · ')}
            </span>
          </div>
        )}
      </div>

      {/* Recipe grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 2 }}>
        {list.map(r => (
          <RecipeCard
            key={r.id}
            recipe={r}
            phase={phase}
            onOpen={() => openRecipe(r.id)}
            onPlan={e => { e.stopPropagation(); setPlanRecipe(r); }}
          />
        ))}
      </div>

      {planRecipe && (
        <AddToPlanPicker
          recipe={planRecipe}
          profile={profile}
          setProfile={setProfile}
          onClose={() => setPlanRecipe(null)}
        />
      )}
    </div>
  );
}

// ── Recipe card with quick actions ────────────────────────────────────────────

function RecipeCard({ recipe: r, phase, onOpen, onPlan }) {
  const [hovered, setHovered] = useState_R(false);

  return (
    <article
      onClick={onOpen}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        cursor: 'pointer', padding: '20px 22px', borderRadius: 14,
        background: hovered ? 'white' : 'oklch(0.97 0.015 90)',
        border: '1px solid oklch(0.88 0.022 95)',
        transition: 'background 0.15s',
        display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
      }}
    >
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
          <window.Eyebrow>{r.source}</window.Eyebrow>
          <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10.5, color: 'oklch(0.54 0.035 135)', letterSpacing: '0.06em' }}>
            {r.minutes}m · {r.protein}g P
          </span>
        </div>
        <h3 style={{ fontFamily: 'Instrument Serif, serif', fontSize: 26, lineHeight: 1.15, color: 'oklch(0.28 0.040 145)', margin: '6px 0 10px', fontWeight: 400 }}>
          {r.title}
        </h3>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 10 }}>
          {r.tags.filter(t => window.CARD_TAGS.includes(t)).slice(0, 3).map(tag => {
            const ts = window.tagStyle(tag);
            return (
              <span key={tag} style={{ display: 'inline-flex', alignItems: 'center', background: ts.bg, color: ts.fg, border: `1px solid ${ts.bd}`, padding: '4px 8px', borderRadius: 999, fontFamily: 'JetBrains Mono, monospace', fontSize: 9.5, letterSpacing: '0.08em', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
                {tag}
              </span>
            );
          })}
        </div>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
          {r.phases.map(p => <window.PhaseChip key={p} phaseId={p} />)}
        </div>
      </div>

      {/* Quick actions — slide up on hover */}
      <div style={{
        display: 'flex', gap: 8, marginTop: 14,
        opacity: hovered ? 1 : 0,
        transform: hovered ? 'translateY(0)' : 'translateY(4px)',
        transition: 'opacity 0.15s, transform 0.15s',
        pointerEvents: hovered ? 'auto' : 'none',
      }}>
        <button
          onClick={onPlan}
          style={{
            padding: '7px 14px', borderRadius: 8,
            background: 'oklch(0.28 0.040 145)', border: 'none',
            cursor: 'pointer', fontFamily: 'DM Sans, sans-serif', fontSize: 12.5, fontWeight: 500,
            color: 'white',
          }}
        >
          + Add to plan
        </button>
        <button
          onClick={e => { e.stopPropagation(); onOpen(); }}
          style={{
            padding: '7px 14px', borderRadius: 8,
            background: 'none', border: '1px solid oklch(0.84 0.025 95)',
            cursor: 'pointer', fontFamily: 'DM Sans, sans-serif', fontSize: 12.5,
            color: 'oklch(0.46 0.032 135)',
          }}
        >
          View recipe
        </button>
      </div>
    </article>
  );
}

function FilterPill({ active, onClick, children, color }) {
  const activeColor = color || 'oklch(0.28 0.040 145)';
  return (
    <button onClick={onClick} style={{
      background: active ? activeColor + '18' : 'none',
      border: active ? `1px solid ${activeColor}50` : '1px solid transparent',
      borderRadius: 999, padding: active ? '5px 12px' : '5px 0',
      cursor: 'pointer',
      fontFamily: 'DM Sans, sans-serif', fontSize: 13.5,
      color: active ? activeColor : 'oklch(0.56 0.030 130)',
      fontWeight: active ? 600 : 400,
      transition: 'all 0.15s ease',
    }}>{children}</button>
  );
}

// ── Recipe detail ─────────────────────────────────────────────────────────────

function RecipeDetail({ id, profile, setProfile, go, openRecipe }) {
  const r = window.recipeById(id);
  if (!r) return null;

  const market    = profile.markets[0] || 'REWE';
  const marketObj = window.SUPERMARKETS.find(s => s.id === market) || window.SUPERMARKETS[0];
  const phase     = window.phaseForDay(profile.day, profile.length);
  const phaseGood = r.phases.includes(phase.id);

  const [tab,       setTab]       = useState_R('ingredients');
  const [planOpen,  setPlanOpen]  = useState_R(false);

  const swatchHues = ['25','138','75','30','50','138','15'];

  return (
    <div>
      {planOpen && (
        <AddToPlanPicker
          recipe={r}
          profile={profile}
          setProfile={setProfile}
          onClose={() => setPlanOpen(false)}
        />
      )}

      {/* Back */}
      <div style={{ maxWidth: 1320, margin: '0 auto', padding: '20px 32px 0' }}>
        <button onClick={() => go('browse')} style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'DM Sans, sans-serif', fontSize: 13.5, color: 'oklch(0.46 0.035 135)' }}>
          ← All recipes
        </button>
      </div>

      {/* Phase badges */}
      <div style={{ maxWidth: 1320, margin: '0 auto', padding: '20px 32px 0', display: 'flex', gap: 8 }}>
        {phaseGood && <window.Badge tone="ink">Perfect for {phase.name}</window.Badge>}
        {r.meal === 'dinner' && <window.Badge tone="ink">Dinner · Zero starch</window.Badge>}
      </div>

      {/* Title block */}
      <div style={{ maxWidth: 1180, margin: '0 auto', padding: '40px 32px 28px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 32 }}>
          <div style={{ maxWidth: 760 }}>
            <window.Eyebrow>{r.source} · {r.author}</window.Eyebrow>
            <h1 style={{ fontFamily: 'Instrument Serif, serif', fontSize: 80, lineHeight: 0.98, color: 'oklch(0.28 0.040 145)', margin: '18px 0 0', fontWeight: 400 }}>
              {r.title}
            </h1>
            <div style={{ display: 'flex', gap: 36, marginTop: 28, fontFamily: 'Instrument Serif, serif', color: 'oklch(0.34 0.035 140)', flexWrap: 'wrap' }}>
              <span><em style={{ color: 'oklch(0.28 0.040 145)' }}>{r.minutes}</em> minutes</span>
              <span><em style={{ color: 'oklch(0.28 0.040 145)' }}>{r.servings}</em> servings</span>
              <span><em style={{ color: 'oklch(0.28 0.040 145)' }}>{r.protein}g</em> protein</span>
              <span><em style={{ color: 'oklch(0.28 0.040 145)' }}>{r.carbs}g</em> carbs</span>
              <span><em style={{ color: 'oklch(0.28 0.040 145)' }}>{r.fat}g</em> fat</span>
            </div>
            <div style={{ display: 'flex', gap: 7, flexWrap: 'wrap', marginTop: 20 }}>
              {r.tags.map(tag => {
                const ts = window.tagStyle(tag);
                return (
                  <span key={tag} style={{ display: 'inline-flex', alignItems: 'center', background: ts.bg, color: ts.fg, border: `1px solid ${ts.bd}`, padding: '5px 10px', borderRadius: 999, fontFamily: 'JetBrains Mono, monospace', fontSize: 10, letterSpacing: '0.08em', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
                    {tag}
                  </span>
                );
              })}
            </div>
          </div>
          {/* Single CTA — no save */}
          <div style={{ flexShrink: 0 }}>
            <window.Button variant="primary" size="md" onClick={() => setPlanOpen(true)}>+ Add to plan</window.Button>
          </div>
        </div>
      </div>

      {/* Body */}
      <div style={{ maxWidth: 1320, margin: '0 auto', padding: '36px 32px 96px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1.05fr 1.4fr', gap: 32 }}>

          {/* Left: ingredients / shop tabs */}
          <div>
            <div style={{ display: 'flex', gap: 4, marginBottom: 18, borderBottom: '1px solid oklch(0.86 0.025 95)' }}>
              {[{ id: 'ingredients', l: 'Ingredients' }, { id: 'shop', l: 'Shop the recipe' }].map(t => (
                <button key={t.id} onClick={() => setTab(t.id)} style={{
                  background: 'transparent', border: 'none', cursor: 'pointer',
                  padding: '12px 0', marginRight: 24,
                  fontFamily: 'DM Sans, sans-serif', fontSize: 14,
                  fontWeight: tab === t.id ? 600 : 400,
                  color: tab === t.id ? 'oklch(0.28 0.040 145)' : 'oklch(0.54 0.035 135)',
                  borderBottom: tab === t.id ? '2px solid oklch(0.28 0.040 145)' : '2px solid transparent',
                  marginBottom: -1,
                }}>{t.l}</button>
              ))}
            </div>

            {tab === 'ingredients' ? (
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 2 }}>
                {r.ingredients.map((ing, i) => (
                  <li key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 0', borderBottom: i === r.ingredients.length - 1 ? 'none' : '1px solid oklch(0.90 0.022 95)' }}>
                    <span style={{ fontFamily: 'Instrument Serif, serif', fontSize: 21, color: 'oklch(0.28 0.040 145)' }}>{ing.item}</span>
                    <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 12, color: 'oklch(0.46 0.035 135)', letterSpacing: '0.05em' }}>{ing.amount}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <div>
                <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 13.5, color: 'oklch(0.50 0.035 135)', lineHeight: 1.55, margin: '0 0 18px' }}>
                  Exact brand matches at <strong style={{ color: 'oklch(0.28 0.040 145)' }}>{marketObj.name}</strong>. Tap to swap.
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {r.ingredients.map((ing, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '12px 14px', borderRadius: 12, background: 'oklch(0.97 0.018 90)', border: '1px solid oklch(0.86 0.025 95)' }}>
                      <div style={{ width: 40, height: 40, borderRadius: 8, flexShrink: 0, background: `repeating-linear-gradient(135deg, oklch(0.88 0.04 ${swatchHues[i % swatchHues.length]}) 0 6px, oklch(0.84 0.05 ${swatchHues[i % swatchHues.length]}) 6px 12px)` }} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 14, fontWeight: 500, color: 'oklch(0.28 0.040 145)' }}>{window.brandFor(ing, market)}</div>
                        <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10.5, color: 'oklch(0.52 0.035 135)', marginTop: 2, letterSpacing: '0.05em' }}>{ing.item} · {ing.amount}</div>
                      </div>
                      <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, color: marketObj.color, letterSpacing: '0.1em', whiteSpace: 'nowrap' }}>
                        {marketObj.name.toUpperCase()}
                      </span>
                    </div>
                  ))}
                </div>
                <div style={{ marginTop: 18, padding: 20, borderRadius: 14, background: phase.soft, border: `1px solid ${phase.color}30` }}>
                  <window.Eyebrow color={phase.color}>Today's seed cycling add-on</window.Eyebrow>
                  <div style={{ fontFamily: 'Instrument Serif, serif', fontSize: 22, color: 'oklch(0.28 0.040 145)', marginTop: 8 }}>
                    <em>{phase.seed}</em>
                  </div>
                  <div style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 12.5, color: 'oklch(0.42 0.035 135)', marginTop: 6 }}>
                    Stir in at the end. Sold whole at {marketObj.name}.
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right: method */}
          <div>
            <window.Eyebrow>Method</window.Eyebrow>
            <ol style={{ listStyle: 'none', padding: 0, margin: '14px 0 0', display: 'flex', flexDirection: 'column', gap: 0 }}>
              {r.steps.map((s, i) => (
                <li key={i} style={{ display: 'flex', gap: 24, padding: '20px 0', borderBottom: i === r.steps.length - 1 ? 'none' : '1px solid oklch(0.90 0.022 95)' }}>
                  <span style={{ fontFamily: 'Instrument Serif, serif', fontSize: 36, color: 'oklch(0.62 0.11 35)', lineHeight: 1, flexShrink: 0, width: 48, fontStyle: 'italic' }}>
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <p style={{ fontFamily: 'Instrument Serif, serif', fontSize: 20, lineHeight: 1.45, color: 'oklch(0.31 0.040 145)', margin: 0 }}>
                    {s}
                  </p>
                </li>
              ))}
            </ol>
            {r.notes && (
              <div style={{ marginTop: 28, padding: 20, borderRadius: 14, background: 'oklch(0.28 0.040 145)', color: 'oklch(0.93 0.022 90)' }}>
                <window.Eyebrow color="oklch(0.74 0.045 100)">A note</window.Eyebrow>
                <p style={{ fontFamily: 'Instrument Serif, serif', fontSize: 20, lineHeight: 1.45, margin: '10px 0 0' }}>
                  <em>{r.notes}</em>
                </p>
              </div>
            )}
          </div>
        </div>

        {/* You might also try */}
        <div style={{ marginTop: 64, paddingTop: 32, borderTop: '1px solid oklch(0.86 0.025 95)' }}>
          <h3 style={{ fontFamily: 'Instrument Serif, serif', fontSize: 36, color: 'oklch(0.28 0.040 145)', margin: '0 0 24px', fontWeight: 400 }}>
            You might also <em>try</em>
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
            {window.RECIPES.filter(x => x.id !== r.id).slice(0, 3).map(x => (
              <window.Card key={x.id} padding={18} hover onClick={() => openRecipe(x.id)}>
                <window.Eyebrow>{x.source} · {x.minutes} min</window.Eyebrow>
                <h4 style={{ fontFamily: 'Instrument Serif, serif', fontSize: 20, lineHeight: 1.15, color: 'oklch(0.28 0.040 145)', margin: '6px 0 0', fontWeight: 400 }}>{x.title}</h4>
              </window.Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { RecipeBrowse, RecipeDetail });
