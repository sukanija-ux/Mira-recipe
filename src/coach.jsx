// Health Snapshot + Groq-powered Health Coach (Llama 3.1 — free & open-source)

const { useState: useState_C, useEffect: useEffect_C, useRef: useRef_C } = React;

// ─── Health Snapshot ─────────────────────────────────────────────────────────

function HealthSnapshot({ profile }) {
  const phase         = window.phaseForDay(profile.day, profile.length);
  const proteinTarget = Math.round((profile.height - 100) * 1.5);
  const perMeal       = Math.round(proteinTarget / profile.meals);
  const plan          = window.PLAN_BY_PHASE[phase.id];
  const plantsToday   = window.countPlantsToday(plan);
  const stage         = window.lifeStageFor(profile.age);

  const cards = [
    {
      eyebrow: `Day ${profile.day} of ${profile.length}`,
      value: phase.name,
      sub: phase.headline,
      bg: phase.soft,
      bd: phase.color + '50',
      accent: phase.color,
    },
    {
      eyebrow: 'IR protein target',
      value: `${proteinTarget}g`,
      sub: `${perMeal}g per meal · ${profile.meals}× daily · 4–6h gaps`,
      bg: 'oklch(0.97 0.018 90)',
      bd: 'oklch(0.86 0.025 95)',
      accent: 'oklch(0.28 0.040 145)',
    },
    {
      eyebrow: 'Plant diversity · today',
      value: String(plantsToday),
      sub: plantsToday >= 4 ? 'Daily threshold met ✓' : `Add ${4 - plantsToday} more plant foods`,
      bg: 'oklch(0.97 0.018 90)',
      bd: plantsToday >= 4 ? 'oklch(0.72 0.10 138)' : 'oklch(0.86 0.025 95)',
      accent: 'oklch(0.58 0.09 140)',
    },
    {
      eyebrow: 'Life stage',
      value: stage.label,
      sub: 'Cycle-synced adjustments active',
      bg: 'oklch(0.97 0.018 90)',
      bd: 'oklch(0.86 0.025 95)',
      accent: 'oklch(0.28 0.040 145)',
    },
  ];

  return (
    <section style={{ marginBottom: 48 }}>
      <window.Eyebrow>Health snapshot · today</window.Eyebrow>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginTop: 16 }}>
        {cards.map((c, i) => (
          <div key={i} style={{ padding: '20px 22px', borderRadius: 16, background: c.bg, border: `1px solid ${c.bd}` }}>
            <window.Eyebrow color={c.accent}>{c.eyebrow}</window.Eyebrow>
            <div style={{ fontFamily: 'Instrument Serif, serif', fontSize: 34, lineHeight: 1.1, color: c.accent, margin: '10px 0 6px', fontWeight: 400 }}>
              {c.value}
            </div>
            <div style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 12.5, color: 'oklch(0.52 0.035 135)', lineHeight: 1.45 }}>
              {c.sub}
            </div>
          </div>
        ))}
      </div>

      {/* Gut + Ayurvedic notes */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginTop: 14 }}>
        <div style={{ padding: '18px 20px', borderRadius: 14, background: phase.soft, border: `1px solid ${phase.color}30` }}>
          <window.Eyebrow color={phase.color}>Gut focus · {phase.name} phase</window.Eyebrow>
          <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 13.5, lineHeight: 1.65, color: 'oklch(0.36 0.035 140)', margin: '8px 0 0' }}>
            {phase.gutFocus}
          </p>
        </div>
        <div style={{ padding: '18px 20px', borderRadius: 14, background: 'oklch(0.28 0.040 145)' }}>
          <window.Eyebrow color="oklch(0.76 0.08 88)">Ayurvedic lens · {phase.dosha}</window.Eyebrow>
          <p style={{ fontFamily: 'Instrument Serif, serif', fontSize: 14.5, lineHeight: 1.6, color: 'oklch(0.86 0.025 95)', margin: '8px 0 0', fontStyle: 'italic' }}>
            {phase.ayurvedicFocus}
          </p>
        </div>
      </div>
    </section>
  );
}

// ─── Health Coach ─────────────────────────────────────────────────────────────

const AI_URL   = 'https://text.pollinations.ai/openai';
const AI_MODEL = 'openai';  // free, no key required

function HealthCoach({ profile }) {
  const phase         = window.phaseForDay(profile.day, profile.length);
  const proteinTarget = Math.round((profile.height - 100) * 1.5);
  const perMeal       = Math.round(proteinTarget / profile.meals);

  const [messages,  setMessages]  = useState_C([]);
  const [input,     setInput]     = useState_C('');
  const [loading,   setLoading]   = useState_C(false);
  const [error,     setError]     = useState_C('');
  const endRef = useRef_C(null);

  useEffect_C(() => {
    if (messages.length) endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Build conditions context
  const conditionNotes = (profile.conditions || []).map(cid => {
    const c = (window.HEALTH_CONDITIONS || []).find(x => x.id === cid);
    return c ? c.coachNote : '';
  }).filter(Boolean);

  const systemPrompt = `You are Mira, a warm, evidence-based hormonal health and insulin resistance (IR) nutrition coach. You speak with calm authority and genuine empathy — like a knowledgeable friend who has read the research.

User profile:
- Name: ${profile.name}, Age: ${profile.age}, Height: ${profile.height}cm
- Cycle: Day ${profile.day} of ${profile.length} — currently in the **${phase.name} phase** (${phase.headline})
- IR protocol: ${proteinTarget}g protein/day · ${perMeal}g per meal · ${profile.meals} meals/day · 4–6h meal gaps
- Diet framework: ${profile.diet} · Preferred cuisines: ${(profile.cuisines || []).join(', ')}
- Exclusions: ${(profile.allergies || []).length ? profile.allergies.join(', ') : 'none'}
${conditionNotes.length ? `\nHealth conditions to factor in:\n${conditionNotes.map(n => '- ' + n).join('\n')}` : ''}

Current phase guidance (${phase.name} — Days ${phase.range[0]}–${phase.range[1]}):
- Hormonally: ${phase.body}
- Gut focus: ${phase.gutFocus}
- Ayurvedic lens (${phase.dosha}): ${phase.ayurvedicFocus}
- Prioritise: ${phase.needs.join(', ')}
- Minimise: ${phase.avoid.join(', ')}
- Seed cycling: ${phase.seed}
- Exercise today: ${phase.movement ? phase.movement.best.join(', ') + ' (' + phase.movement.intensity + ' intensity)' : ''}

Coaching principles:
- Keep answers concise — 2–4 short paragraphs unless asked to go deeper.
- Always connect advice to the user's current cycle phase, IR context, and any stated health conditions.
- Reference IR principles: protein-first meals, 4–6h gaps, no snacking, MMC gut-clearing window.
- Mention estrobolome and plant diversity (30 plants/week) where relevant.
- Seed cycling: flax + pumpkin D1–13, sesame + sunflower D14–28.
- Never diagnose or prescribe. For medical concerns, recommend their GP or a hormone specialist.
- If the user writes in a language other than English, respond in that language.`;

  const send = async () => {
    if (!input.trim() || loading) return;

    const userMsg = { role: 'user', content: input.trim() };
    const history = [...messages, userMsg];
    setMessages(history);
    setInput('');
    setLoading(true);
    setError('');

    try {
      const res = await fetch(AI_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: AI_MODEL,
          max_tokens: 1024,
          temperature: 0.7,
          messages: [
            { role: 'system', content: systemPrompt },
            ...history.map(m => ({ role: m.role, content: m.content })),
          ],
        }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.error?.message || `Error ${res.status} — please try again.`);
      }
      const data  = await res.json();
      const reply = data.choices?.[0]?.message?.content || '';
      setMessages([...history, { role: 'assistant', content: reply }]);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const suggestions = [
    `What should I eat today for the ${phase.name.toLowerCase()} phase?`,
    `How do I hit ${proteinTarget}g protein across ${profile.meals} meals?`,
    'Which gut-healing foods should I focus on this week?',
    ...(profile.conditions?.length ? [`How do I eat for my ${(profile.conditions || []).map(c => { const x = (window.HEALTH_CONDITIONS||[]).find(h=>h.id===c); return x ? x.label : c; }).join(' & ')}?`] : ['Explain seed cycling and why it matters.']),
  ];

  return (
    <section style={{ marginBottom: 56, padding: '32px 36px', borderRadius: 24, background: 'oklch(0.97 0.018 90)', border: '1px solid oklch(0.86 0.025 95)' }}>
      {/* Header */}
      <div style={{ marginBottom: 22 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <window.Eyebrow color={phase.color}>Health Coach · AI-powered · Free</window.Eyebrow>
        </div>
        <h2 style={{ fontFamily: 'Instrument Serif, serif', fontSize: 36, fontWeight: 400, color: 'oklch(0.28 0.040 145)', margin: '10px 0 5px' }}>
          Ask <em style={{ color: phase.color }}>anything</em> about your cycle & nutrition.
        </h2>
        <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 13, color: 'oklch(0.52 0.035 135)', lineHeight: 1.5 }}>
          Knows your {phase.name} phase, IR targets{profile.conditions?.length ? ', your health conditions' : ''}, and seed cycling. No account needed — just ask.
        </p>
      </div>

      {/* Message thread */}
      {messages.length > 0 && (
        <div style={{ maxHeight: 460, overflowY: 'auto', padding: '4px 0 16px', marginBottom: 14, display: 'flex', flexDirection: 'column', gap: 14 }}>
          {messages.map((m, i) => (
            <div key={i} style={{ display: 'flex', flexDirection: m.role === 'user' ? 'row-reverse' : 'row', gap: 10, alignItems: 'flex-start' }}>
              {m.role === 'assistant' && (
                <div style={{ width: 30, height: 30, borderRadius: 999, flexShrink: 0, background: phase.soft, border: `1px solid ${phase.color}50`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width="13" height="13" viewBox="0 0 22 22">
                    <circle cx="11" cy="11" r="9" fill="none" stroke={phase.color} strokeWidth="1.5" />
                    <circle cx="11" cy="11" r="4.5" fill="none" stroke={phase.color} strokeWidth="1.5" />
                    <circle cx="17" cy="7" r="2" fill={phase.color} />
                  </svg>
                </div>
              )}
              <div style={{
                maxWidth: '74%', padding: '11px 15px',
                borderRadius: m.role === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                background: m.role === 'user' ? 'oklch(0.28 0.040 145)' : 'white',
                border: m.role === 'user' ? 'none' : '1px solid oklch(0.88 0.022 95)',
                color: m.role === 'user' ? 'oklch(0.945 0.022 88)' : 'oklch(0.28 0.040 145)',
                fontFamily: 'DM Sans, sans-serif', fontSize: 14, lineHeight: 1.62,
                whiteSpace: 'pre-wrap',
              }}>
                {m.content}
              </div>
            </div>
          ))}

          {loading && (
            <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
              <div style={{ width: 30, height: 30, borderRadius: 999, background: phase.soft, border: `1px solid ${phase.color}50`, flexShrink: 0 }} />
              <div style={{ padding: '11px 15px', borderRadius: '16px 16px 16px 4px', background: 'white', border: '1px solid oklch(0.88 0.022 95)', display: 'flex', gap: 5, alignItems: 'center', height: 42 }}>
                {[0, 1, 2].map(j => (
                  <div key={j} style={{ width: 7, height: 7, borderRadius: 999, background: phase.color, opacity: 0.3 + j * 0.25 }} />
                ))}
              </div>
            </div>
          )}

          {error && (
            <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 12.5, color: 'oklch(0.58 0.14 35)', paddingLeft: 40 }}>
              ⚠ {error}
            </p>
          )}
          <div ref={endRef} />
        </div>
      )}

      {/* Suggestion chips */}
      {messages.length === 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 18 }}>
          {suggestions.map(s => (
            <button key={s} onClick={() => setInput(s)} style={{
              padding: '8px 13px', borderRadius: 999,
              background: phase.soft, border: `1px solid ${phase.color}35`,
              cursor: 'pointer', fontFamily: 'DM Sans, sans-serif', fontSize: 13,
              color: 'oklch(0.38 0.035 140)',
            }}>
              {s}
            </button>
          ))}
        </div>
      )}

      {/* Input row */}
      <div style={{ display: 'flex', gap: 10, alignItems: 'flex-end' }}>
        <textarea
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); } }}
          placeholder={`Ask about your ${phase.name.toLowerCase()} phase, IR meals, or gut health…`}
          rows={2}
          style={{
            flex: 1, padding: '12px 15px', borderRadius: 12,
            border: '1px solid oklch(0.84 0.025 95)',
            background: 'oklch(0.945 0.022 88)',
            fontFamily: 'DM Sans, sans-serif', fontSize: 14,
            color: 'oklch(0.28 0.040 145)', resize: 'none', lineHeight: 1.5,
            outline: 'none',
          }}
        />
        <window.Button onClick={send} disabled={loading || !input.trim()} variant="primary">
          {loading ? '…' : 'Send ↑'}
        </window.Button>
      </div>
      <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 9, color: 'oklch(0.64 0.020 130)', letterSpacing: '0.09em', marginTop: 8, textTransform: 'uppercase' }}>
        Enter to send · Shift+Enter for line break · Not medical advice
      </div>
    </section>
  );
}

Object.assign(window, { HealthSnapshot, HealthCoach });
