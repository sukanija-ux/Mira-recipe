// Recipe browse + recipe detail screens

const { useState: useState_R, useMemo: useMemo_R } = React;

// Recipe library with phase + meal + conditions filters
function RecipeBrowse({ profile, openRecipe }) {
  const phase   = window.phaseForDay(profile.day, profile.length);
  const [filter,     setFilter]     = useState_R('phase');
  const [meal,       setMeal]       = useState_R('all');
  const [cuisine,    setCuisine]    = useState_R('all');
  const [condFilter, setCondFilter] = useState_R('all');

  // Collect all boosted tags from user's conditions
  const conditionTags = useMemo_R(() => {
    const conditions = profile.conditions || [];
    const tags = new Set();
    (window.HEALTH_CONDITIONS || []).forEach(c => {
      if (conditions.includes(c.id)) c.tagBoost.forEach(t => tags.add(t));
    });
    return tags;
  }, [profile.conditions]);

  const list = useMemo_R(() => {
    return window.RECIPES.filter(r => {
      if (filter === 'phase' && !r.phases.includes(phase.id)) return false;
      const meals = Array.isArray(r.meal) ? r.meal : [r.meal];
      if (meal !== 'all' && !meals.includes(meal)) return false;
      if (cuisine !== 'all' && r.cuisine !== cuisine) return false;
      if (condFilter === 'conditions' && conditionTags.size > 0) {
        const matched = r.tags.some(t => conditionTags.has(t));
        if (!matched) return false;
      }
      return true;
    });
  }, [filter, meal, cuisine, condFilter, conditionTags, phase.id]);

  const tones = ['clay', 'sage', 'honey', 'plum', 'paper', 'clay'];

  return (
    <div style={{ maxWidth: 1180, margin: '0 auto', padding: '64px 32px 120px' }}>
      <header style={{ marginBottom: 56 }}>
        <window.Eyebrow>Recipe library · {list.length} of {window.RECIPES.length}</window.Eyebrow>
        <h1 style={{ fontFamily: 'Instrument Serif, serif', fontSize: 72, lineHeight: 0.98, color: 'oklch(0.28 0.040 145)', margin: '18px 0 0', fontWeight: 400 }}>
          <em>Real</em> recipes, from real kitchens.
        </h1>
      </header>

      {/* Filter rows */}
      <div style={{ marginBottom: 40, paddingBottom: 18, borderBottom: '1px solid oklch(0.86 0.025 95)' }}>
        {/* Row 1: Phase + Meal */}
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
        {/* Row 2: Cuisine */}
        <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap', marginBottom: (profile.conditions || []).length > 0 ? 10 : 0 }}>
          <FilterPill active={cuisine === 'all'} onClick={() => setCuisine('all')}>All cuisines</FilterPill>
          {window.RECIPE_CUISINE_FILTERS.map(c => (
            <FilterPill key={c.id} active={cuisine === c.id} onClick={() => setCuisine(c.id)}>{c.label}</FilterPill>
          ))}
        </div>
        {/* Row 3: Conditions filter — only shown if user has conditions set */}
        {(profile.conditions || []).length > 0 && (
          <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap', paddingTop: 10, borderTop: '1px dashed oklch(0.88 0.025 95)' }}>
            <FilterPill active={condFilter === 'all'} onClick={() => setCondFilter('all')}>All recipes</FilterPill>
            <FilterPill active={condFilter === 'conditions'} color={condFilter === 'conditions' ? 'oklch(0.58 0.09 140)' : null} onClick={() => setCondFilter('conditions')}>
              ✦ For your conditions
            </FilterPill>
            <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, color: 'oklch(0.60 0.035 135)', letterSpacing: '0.06em' }}>
              {(profile.conditions || []).map(cid => {
                const c = (window.HEALTH_CONDITIONS || []).find(x => x.id === cid);
                return c ? c.label : '';
              }).filter(Boolean).join(' · ')}
            </span>
          </div>
        )}
      </div>

      {/* Recipe list */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 2 }}>
        {list.map((r, i) => (
          <article key={r.id} onClick={() => openRecipe(r.id)} style={{ cursor: 'pointer', padding: '20px 22px', borderRadius: 14, background: 'oklch(0.97 0.015 90)', border: '1px solid oklch(0.88 0.022 95)', transition: 'background 0.15s' }}
            onMouseEnter={e => e.currentTarget.style.background = 'white'}
            onMouseLeave={e => e.currentTarget.style.background = 'oklch(0.97 0.015 90)'}
          >
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                <window.Eyebrow>{r.source}</window.Eyebrow>
                <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10.5, color: 'oklch(0.54 0.035 135)', letterSpacing: '0.06em' }}>
                  {r.minutes}M · {r.protein}G P
                </span>
              </div>
              <h3 style={{ fontFamily: 'Instrument Serif, serif', fontSize: 26, lineHeight: 1.15, color: 'oklch(0.28 0.040 145)', margin: '6px 0 10px', fontWeight: 400 }}>
                {r.title}
              </h3>
              {/* Tag badges */}
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 10 }}>
                {r.tags.filter(t => window.CARD_TAGS.includes(t)).slice(0, 3).map(tag => {
                  const ts = window.tagStyle(tag);
                  return (
                    <span key={tag} style={{
                      display: 'inline-flex', alignItems: 'center',
                      background: ts.bg, color: ts.fg, border: `1px solid ${ts.bd}`,
                      padding: '4px 8px', borderRadius: 999,
                      fontFamily: 'JetBrains Mono, monospace', fontSize: 9.5,
                      letterSpacing: '0.08em', textTransform: 'uppercase', whiteSpace: 'nowrap',
                    }}>{tag}</span>
                  );
                })}
              </div>
              <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
                {r.phases.map(p => <window.PhaseChip key={p} phaseId={p} />)}
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
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

// Recipe detail — Mobbin-inspired layout
function RecipeDetail({ id, profile, go, openRecipe }) {
  const r = window.recipeById(id);
  if (!r) return null;

  const market    = profile.markets[0] || 'REWE';
  const marketObj = window.SUPERMARKETS.find(s => s.id === market) || window.SUPERMARKETS[0];
  const phase     = window.phaseForDay(profile.day, profile.length);
  const phaseGood = r.phases.includes(phase.id);

  const [tab, setTab] = useState_R('ingredients');

  const swatchHues = ['25','138','75','30','50','138','15'];

  return (
    <div>
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
            {/* Tag badges */}
            <div style={{ display: 'flex', gap: 7, flexWrap: 'wrap', marginTop: 20 }}>
              {r.tags.map(tag => {
                const ts = window.tagStyle(tag);
                return (
                  <span key={tag} style={{
                    display: 'inline-flex', alignItems: 'center',
                    background: ts.bg, color: ts.fg, border: `1px solid ${ts.bd}`,
                    padding: '5px 10px', borderRadius: 999,
                    fontFamily: 'JetBrains Mono, monospace', fontSize: 10,
                    letterSpacing: '0.08em', textTransform: 'uppercase', whiteSpace: 'nowrap',
                  }}>{tag}</span>
                );
              })}
            </div>
          </div>
          <div style={{ display: 'flex', gap: 10, flexShrink: 0 }}>
            <window.Button variant="soft" size="md">♡ Save</window.Button>
            <window.Button variant="primary" size="md">+ Add to plan</window.Button>
          </div>
        </div>
      </div>

      {/* Body: ingredients (left) + method (right) */}
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
                  <li key={i} style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    padding: '14px 0',
                    borderBottom: i === r.ingredients.length - 1 ? 'none' : '1px solid oklch(0.90 0.022 95)',
                  }}>
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
                {/* Seed cycling add-on */}
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
                <li key={i} style={{
                  display: 'flex', gap: 24, padding: '20px 0',
                  borderBottom: i === r.steps.length - 1 ? 'none' : '1px solid oklch(0.90 0.022 95)',
                }}>
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
            {window.RECIPES.filter(x => x.id !== r.id).slice(0, 3).map((x, i) => (
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
