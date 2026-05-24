// Cycle calendar, Shopping list, Profile screens

const { useState: useState_S, useEffect: useEffect_S } = React;



// ─── Tracking mode selector ────────────────────────────────────────────────
const TRACKING_MODES = [
  { id: 'cycle',      label: 'Cycle',      sub: 'I track my monthly phases',       icon: '◯' },
  { id: 'pregnant',   label: 'Pregnant',   sub: 'I am currently pregnant',         icon: '○' },
  { id: 'postpartum', label: 'Postpartum', sub: 'I recently gave birth',           icon: '◌' },
  { id: 'menopause',  label: 'Menopause',  sub: 'I am in peri- or post-menopause', icon: '◉' },
];

function ModePicker({ mode, onChange }) {
  return (
    <div style={{ marginBottom: 56 }}>
      <window.Eyebrow>What describes you right now?</window.Eyebrow>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginTop: 16 }}>
        {TRACKING_MODES.map(m => {
          const active = mode === m.id;
          return (
            <button key={m.id} onClick={() => onChange(m.id)} style={{
              padding: '20px 18px', borderRadius: 16, cursor: 'pointer', textAlign: 'left',
              background: active ? 'oklch(0.28 0.040 145)' : 'oklch(0.97 0.018 90)',
              border: active ? '1.5px solid oklch(0.28 0.040 145)' : '1.5px solid oklch(0.86 0.025 95)',
              transition: 'all 0.18s ease',
            }}>
              {/* Radio dot */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                <div style={{
                  width: 16, height: 16, borderRadius: 999, flexShrink: 0,
                  border: `2px solid ${active ? 'oklch(0.76 0.08 88)' : 'oklch(0.72 0.025 100)'}`,
                  background: active ? 'oklch(0.76 0.08 88)' : 'transparent',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  {active && <div style={{ width: 6, height: 6, borderRadius: 999, background: 'oklch(0.22 0.030 145)' }} />}
                </div>
                <span style={{
                  fontFamily: 'JetBrains Mono, monospace', fontSize: 9.5, letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                  color: active ? 'oklch(0.76 0.08 88)' : 'oklch(0.56 0.030 130)',
                }}>{m.label}</span>
              </div>
              <div style={{
                fontFamily: 'DM Sans, sans-serif', fontSize: 13, lineHeight: 1.4,
                color: active ? 'oklch(0.82 0.022 90)' : 'oklch(0.46 0.035 135)',
              }}>{m.sub}</div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─── Pregnant view ──────────────────────────────────────────────────────────
function PregnantView({ profile, setProfile }) {
  const week = profile.pregnancyWeek || 12;
  const trimester = week <= 12 ? 1 : week <= 26 ? 2 : 3;
  const T = {
    1: {
      label: 'First Trimester', weeks: 'Weeks 1–12',
      color: 'oklch(0.62 0.08 230)', soft: 'oklch(0.93 0.025 230)',
      headline: 'Foundation & folate.',
      body: 'The embryo\'s neural tube forms in weeks 3–4 — folate is critical before most women know they\'re pregnant. Nausea peaks weeks 6–10; small, frequent, protein-rich meals reduce cortisol and stabilise blood sugar.',
      needs: ['Folate / Methylfolate', 'Iron', 'B6 (nausea)', 'Zinc', 'Magnesium', 'Choline'],
      avoid: ['Alcohol', 'High-mercury fish', 'Raw eggs', 'Soft cheeses', 'Liver pâté'],
      tips: 'Eat protein within 30 minutes of waking. Ginger (fresh or tea) reduces nausea by 40% in clinical trials. Keep meals small and warm.',
    },
    2: {
      label: 'Second Trimester', weeks: 'Weeks 13–26',
      color: 'oklch(0.58 0.09 140)', soft: 'oklch(0.93 0.030 140)',
      headline: 'Growth & iron.',
      body: 'Blood volume expands by 50%. Iron deficiency anaemia peaks here — pair iron-rich foods with Vitamin C. Baby\'s bones, brain, and organs are developing rapidly. Protein target increases by ~25g/day.',
      needs: ['Iron + Vitamin C', 'Calcium', 'DHA Omega-3', 'Protein +25g', 'Vitamin D', 'B12'],
      avoid: ['Processed meats', 'Raw fish (sushi)', 'Unpasteurised dairy', 'Excess caffeine'],
      tips: 'Eat leafy greens with lemon or bell pepper for iron absorption. Wild salmon and sardines are the safest omega-3 sources. Constipation peaks — aim for 30g fibre daily.',
    },
    3: {
      label: 'Third Trimester', weeks: 'Weeks 27–40+',
      color: 'oklch(0.76 0.10 88)', soft: 'oklch(0.94 0.040 88)',
      headline: 'DHA, collagen, prepare.',
      body: 'Baby\'s brain grows fastest in the last 10 weeks — DHA is the structural fat of brain tissue. Progesterone peaks causing heartburn and slow digestion. Smaller, more frequent meals are essential.',
      needs: ['DHA Omega-3', 'Collagen/Glycine', 'Magnesium', 'Calcium', 'Vitamin K2', 'Choline'],
      avoid: ['Large meals', 'Spicy food (heartburn)', 'Carbonated drinks', 'High-glycemic carbs'],
      tips: 'Eat smaller meals more frequently. Bone broth daily supports collagen for the birth canal. Dates from week 36 may help cervical ripening (3 trials show reduced induction rates).',
    },
  }[trimester];

  return (
    <div>
      <header style={{ marginBottom: 56 }}>
        <window.Eyebrow>Pregnant · {T.weeks}</window.Eyebrow>
        <h1 style={{ fontFamily: 'Instrument Serif, serif', fontSize: 72, lineHeight: 0.98, color: 'oklch(0.28 0.040 145)', margin: '18px 0 0', fontWeight: 400 }}>
          <em style={{ color: T.color }}>{T.label}.</em>
        </h1>
        <p style={{ fontFamily: 'Instrument Serif, serif', fontSize: 22, lineHeight: 1.45, color: 'oklch(0.46 0.035 135)', margin: '20px 0 0', maxWidth: 680, fontStyle: 'italic' }}>
          {T.headline} {T.body}
        </p>
      </header>

      {/* Week scrubber */}
      <section style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48, marginBottom: 56, padding: '32px', borderRadius: 20, background: T.soft, border: `1px solid ${T.color}40` }}>
        <div>
          <window.Eyebrow color={T.color}>Pregnancy week</window.Eyebrow>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, margin: '14px 0 20px' }}>
            <span style={{ fontFamily: 'Instrument Serif, serif', fontSize: 80, lineHeight: 1, color: T.color, fontWeight: 400 }}>{week}</span>
            <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 16, color: 'oklch(0.50 0.035 135)' }}>/ 42 weeks</span>
          </div>
          <input type="range" min={1} max={42} value={week}
            onChange={e => setProfile({ ...profile, pregnancyWeek: parseInt(e.target.value) })}
            style={{ width: '100%', accentColor: T.color }}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
            {['T1 (1–12)', 'T2 (13–26)', 'T3 (27–42)'].map((t, i) => (
              <span key={i} style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 9, color: 'oklch(0.54 0.035 135)', letterSpacing: '0.06em' }}>{t}</span>
            ))}
          </div>
        </div>
        <div>
          <window.Eyebrow>Quick tips for week {week}</window.Eyebrow>
          <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 14, lineHeight: 1.65, color: 'oklch(0.38 0.035 140)', margin: '12px 0 0' }}>{T.tips}</p>
        </div>
      </section>

      {/* Needs + Avoid grid */}
      <section style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 56 }}>
        <div style={{ padding: '24px 28px', borderRadius: 16, background: T.soft, border: `1px solid ${T.color}30` }}>
          <window.Eyebrow color={T.color}>Prioritise · {T.label}</window.Eyebrow>
          <div style={{ fontFamily: 'Instrument Serif, serif', fontSize: 20, lineHeight: 1.6, color: 'oklch(0.28 0.040 145)', margin: '12px 0 0' }}>
            {T.needs.join(' · ')}
          </div>
        </div>
        <div style={{ padding: '24px 28px', borderRadius: 16, background: 'oklch(0.28 0.040 145)' }}>
          <window.Eyebrow color="oklch(0.62 0.11 35)">Avoid during pregnancy</window.Eyebrow>
          <div style={{ fontFamily: 'Instrument Serif, serif', fontSize: 20, lineHeight: 1.6, color: 'oklch(0.78 0.025 95)', margin: '12px 0 0', fontStyle: 'italic' }}>
            {T.avoid.join(' · ')}
          </div>
        </div>
      </section>
      <div style={{ padding: '16px 20px', borderRadius: 12, background: 'oklch(0.94 0.040 88)', border: '1px solid oklch(0.78 0.090 88)50' }}>
        <window.Eyebrow color="oklch(0.40 0.090 80)">Always consult your midwife or OB</window.Eyebrow>
        <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 12.5, color: 'oklch(0.44 0.050 80)', margin: '6px 0 0', lineHeight: 1.5 }}>
          Nutritional needs during pregnancy are highly individual. These guidelines are evidence-based overviews — your healthcare provider should guide any specific supplementation or dietary restriction.
        </p>
      </div>
    </div>
  );
}

// ─── Postpartum view ────────────────────────────────────────────────────────
function PostpartumView({ profile, setProfile }) {
  const weeks = profile.postpartumWeek || 6;
  const bf    = profile.breastfeeding || false;

  const stage = weeks <= 2 ? {
    label: 'Immediate Recovery', color: 'oklch(0.62 0.11 35)', soft: 'oklch(0.93 0.035 40)',
    body: 'The uterus is contracting back. Blood loss is high — iron and collagen are the priority. Rest is medicine. Warm, easy-to-digest, deeply nourishing foods only.',
    needs: ['Iron + Vitamin C', 'Collagen / Bone broth', 'Magnesium', 'Zinc', 'B12', 'Warming soups'],
  } : weeks <= 8 ? {
    label: 'Early Postpartum', color: 'oklch(0.58 0.09 140)', soft: 'oklch(0.93 0.030 140)',
    body: 'Hormones are resetting rapidly. Postpartum hair loss peaks at weeks 3–6 (telogen effluvium) — biotin, iron, and zinc are critical. Gut motility is still slow.',
    needs: ['Biotin', 'Iron', 'Zinc', 'Vitamin D', 'Omega-3 DHA', 'Fiber for motility'],
  } : {
    label: 'Recovery & Rebuild', color: 'oklch(0.62 0.08 230)', soft: 'oklch(0.93 0.025 230)',
    body: 'Hormones are approaching pre-pregnancy baseline. Energy returns. This is the phase to rebuild microbiome diversity and restore muscle protein mass.',
    needs: ['High protein', 'Plant diversity (30/week)', 'Magnesium', 'B vitamins', 'Probiotics'],
  };

  return (
    <div>
      <header style={{ marginBottom: 56 }}>
        <window.Eyebrow>Postpartum · Week {weeks}</window.Eyebrow>
        <h1 style={{ fontFamily: 'Instrument Serif, serif', fontSize: 72, lineHeight: 0.98, color: 'oklch(0.28 0.040 145)', margin: '18px 0 0', fontWeight: 400 }}>
          <em style={{ color: stage.color }}>{stage.label}.</em>
        </h1>
        <p style={{ fontFamily: 'Instrument Serif, serif', fontSize: 22, lineHeight: 1.45, color: 'oklch(0.46 0.035 135)', margin: '20px 0 0', maxWidth: 680, fontStyle: 'italic' }}>
          {stage.body}
        </p>
      </header>

      {/* Week scrubber + breastfeeding */}
      <section style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 48, alignItems: 'start', marginBottom: 56, padding: '32px', borderRadius: 20, background: stage.soft, border: `1px solid ${stage.color}40` }}>
        <div>
          <window.Eyebrow color={stage.color}>Weeks since birth</window.Eyebrow>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, margin: '14px 0 20px' }}>
            <span style={{ fontFamily: 'Instrument Serif, serif', fontSize: 80, lineHeight: 1, color: stage.color, fontWeight: 400 }}>{weeks}</span>
            <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 16, color: 'oklch(0.50 0.035 135)' }}>weeks postpartum</span>
          </div>
          <input type="range" min={0} max={52} value={weeks}
            onChange={e => setProfile({ ...profile, postpartumWeek: parseInt(e.target.value) })}
            style={{ width: '100%', accentColor: stage.color }}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
            {['0 wk', '6 wk', '3 mo', '6 mo', '12 mo'].map((t, i) => (
              <span key={i} style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 9, color: 'oklch(0.54 0.035 135)', letterSpacing: '0.06em' }}>{t}</span>
            ))}
          </div>
        </div>

        {/* Breastfeeding toggle */}
        <div style={{ padding: '24px 28px', borderRadius: 16, background: 'oklch(0.28 0.040 145)', minWidth: 220 }}>
          <window.Eyebrow color="oklch(0.76 0.08 88)">Breastfeeding?</window.Eyebrow>
          <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
            {[{ v: true, l: 'Yes, nursing' }, { v: false, l: 'No / Weaning' }].map(opt => (
              <button key={String(opt.v)} onClick={() => setProfile({ ...profile, breastfeeding: opt.v })} style={{
                flex: 1, padding: '12px 10px', borderRadius: 10, cursor: 'pointer',
                background: bf === opt.v ? 'oklch(0.76 0.08 88)' : 'oklch(0.34 0.030 145)',
                border: 'none',
                fontFamily: 'DM Sans, sans-serif', fontSize: 12.5, fontWeight: bf === opt.v ? 600 : 400,
                color: bf === opt.v ? 'oklch(0.22 0.030 145)' : 'oklch(0.76 0.025 90)',
                transition: 'all 0.2s ease',
              }}>{opt.l}</button>
            ))}
          </div>
          {bf && (
            <div style={{ marginTop: 14, fontFamily: 'DM Sans, sans-serif', fontSize: 12, color: 'oklch(0.75 0.020 90)', lineHeight: 1.55 }}>
              +500 kcal/day · +25g protein · +200mg DHA · avoid alcohol & high-mercury fish
            </div>
          )}
        </div>
      </section>

      {/* Needs */}
      <section style={{ padding: '24px 28px', borderRadius: 16, background: stage.soft, border: `1px solid ${stage.color}30`, marginBottom: 24 }}>
        <window.Eyebrow color={stage.color}>Priority nutrients · {stage.label}</window.Eyebrow>
        <div style={{ fontFamily: 'Instrument Serif, serif', fontSize: 22, lineHeight: 1.6, color: 'oklch(0.28 0.040 145)', margin: '12px 0 0' }}>
          {bf ? [...stage.needs, 'Iodine', 'Choline (eggs, liver)'].join(' · ') : stage.needs.join(' · ')}
        </div>
      </section>
      <div style={{ padding: '16px 20px', borderRadius: 12, background: 'oklch(0.94 0.040 88)', border: '1px solid oklch(0.78 0.090 88)50' }}>
        <window.Eyebrow color="oklch(0.40 0.090 80)">Consult your midwife or health visitor</window.Eyebrow>
        <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 12.5, color: 'oklch(0.44 0.050 80)', margin: '6px 0 0', lineHeight: 1.5 }}>
          Postpartum recovery is highly individual. If you're experiencing postpartum depression, low milk supply, or unusual symptoms, please consult a healthcare professional.
        </p>
      </div>
    </div>
  );
}

// ─── Menopause view ─────────────────────────────────────────────────────────
function MenopauseView({ profile }) {
  const age = profile.age || 50;
  const isPeri = age < 52;
  const phase = {
    label: isPeri ? 'Perimenopause' : 'Postmenopause',
    color: isPeri ? 'oklch(0.76 0.10 88)' : 'oklch(0.62 0.08 230)',
    soft:  isPeri ? 'oklch(0.94 0.040 88)' : 'oklch(0.93 0.025 230)',
    body: isPeri
      ? 'Oestrogen fluctuates wildly — not declining linearly. Cycles become irregular. Insulin resistance worsens. Gut microbiome diversity drops. The Estrobolome is most influential here: fibre diversity directly determines how surplus oestrogen is cleared or recirculated.'
      : 'Oestrogen has settled at a new, lower baseline. Bone density loss accelerates for 5–7 years. Insulin resistance peaks. The focus shifts to phytoestrogens (gentle receptor support), calcium, Vitamin D, and muscle-preserving protein.',
    needs: isPeri
      ? ['Phytoestrogens (flax, soy)', 'Magnesium', 'Plant diversity 30+/wk', 'Omega-3', 'Adaptogens (ashwagandha)', 'Vitamin B6', 'Zinc']
      : ['Calcium + Vitamin D3 + K2', 'High protein (1.6–2g/kg)', 'Phytoestrogens', 'Omega-3 DHA', 'Creatine (muscle)', 'Magnesium'],
    avoid: ['Refined sugar (worsens IR)', 'Alcohol', 'Processed soy', 'Ultra-processed food'],
    gutNote: 'Menopause causes a measurable decline in Lactobacillus. 30+ plant foods/week, daily fermented foods, and flaxseed are the most evidence-based interventions to maintain Estrobolome function without oestrogen. This is when microbiome diversity matters most.',
  };

  return (
    <div>
      <header style={{ marginBottom: 56 }}>
        <window.Eyebrow>{phase.label} · Age {age}</window.Eyebrow>
        <h1 style={{ fontFamily: 'Instrument Serif, serif', fontSize: 72, lineHeight: 0.98, color: 'oklch(0.28 0.040 145)', margin: '18px 0 0', fontWeight: 400 }}>
          Nourish the <em style={{ color: phase.color }}>transition.</em>
        </h1>
        <p style={{ fontFamily: 'Instrument Serif, serif', fontSize: 22, lineHeight: 1.45, color: 'oklch(0.46 0.035 135)', margin: '20px 0 0', maxWidth: 700, fontStyle: 'italic' }}>
          {phase.body}
        </p>
      </header>

      <section style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 32 }}>
        <div style={{ padding: '24px 28px', borderRadius: 16, background: phase.soft, border: `1px solid ${phase.color}35` }}>
          <window.Eyebrow color={phase.color}>Prioritise · {phase.label}</window.Eyebrow>
          <div style={{ fontFamily: 'Instrument Serif, serif', fontSize: 19, lineHeight: 1.65, color: 'oklch(0.28 0.040 145)', margin: '12px 0 0' }}>
            {phase.needs.join(' · ')}
          </div>
        </div>
        <div style={{ padding: '24px 28px', borderRadius: 16, background: 'oklch(0.28 0.040 145)' }}>
          <window.Eyebrow color="oklch(0.62 0.11 35)">Avoid / minimise</window.Eyebrow>
          <div style={{ fontFamily: 'Instrument Serif, serif', fontSize: 19, lineHeight: 1.65, color: 'oklch(0.78 0.025 95)', margin: '12px 0 0', fontStyle: 'italic' }}>
            {phase.avoid.join(' · ')}
          </div>
        </div>
      </section>
      <div style={{ padding: '22px 26px', borderRadius: 16, background: phase.soft, border: `1px solid ${phase.color}25` }}>
        <window.Eyebrow color={phase.color}>Estrobolome & gut health</window.Eyebrow>
        <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 14, lineHeight: 1.65, color: 'oklch(0.36 0.035 140)', margin: '10px 0 0' }}>{phase.gutNote}</p>
      </div>
    </div>
  );
}

// ─── Cycle calendar — ring + 28-day strip + 4 phase chapters ───────────────
function CycleCalendar({ profile, go, setProfile }) {
  const phase = window.phaseForDay(profile.day, profile.length);
  const days  = [...Array(profile.length)].map((_, i) => i + 1);
  const mode  = profile.trackingMode || 'cycle';

  const changeMode = (m) => setProfile({ ...profile, trackingMode: m });

  return (
    <div style={{ maxWidth: 1180, margin: '0 auto', padding: '64px 32px 120px' }}>

      {/* Mode selector */}
      <ModePicker mode={mode} onChange={changeMode} />

      {/* Pregnant / Postpartum / Menopause content */}
      {mode === 'pregnant'   && <PregnantView   profile={profile} setProfile={setProfile} />}
      {mode === 'postpartum' && <PostpartumView profile={profile} setProfile={setProfile} />}
      {mode === 'menopause'  && <MenopauseView  profile={profile} />}

      {/* Cycle content (shown only when mode === 'cycle') */}
      {mode === 'cycle' && (<>

      <header style={{ marginBottom: 64 }}>
        <window.Eyebrow>Cycle calendar · {profile.length}-day cycle · Day {profile.day}</window.Eyebrow>
        <h1 style={{ fontFamily: 'Instrument Serif, serif', fontSize: 80, lineHeight: 0.98, color: 'oklch(0.28 0.040 145)', margin: '18px 0 0', fontWeight: 400 }}>
          Your <em style={{ color: phase.color }}>month</em>, mapped to your body.
        </h1>
      </header>

      {/* Ring + day strip */}
      <section style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: 64, alignItems: 'center', marginBottom: 96, paddingBottom: 64, borderBottom: '1px solid oklch(0.86 0.025 95)' }}>
        <window.HormoneRing day={profile.day} length={profile.length} size={300} label={false} />

        <div>
          <window.Eyebrow>Scrub the month</window.Eyebrow>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(14, 1fr)', gap: 4, marginTop: 14 }}>
            {days.map(d => {
              const p   = window.phaseForDay(d, profile.length);
              const cur = d === profile.day;
              return (
                <button key={d} onClick={() => setProfile({ ...profile, day: d })} style={{
                  aspectRatio: '1/1.4',
                  background: cur ? p.color : p.soft,
                  border: cur ? `1.5px solid ${p.color}` : '1px solid transparent',
                  borderRadius: 6, cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: 'JetBrains Mono, monospace', fontSize: 11,
                  fontWeight: cur ? 600 : 400,
                  color: cur ? 'oklch(0.945 0.022 88)' : 'oklch(0.40 0.04 50)',
                  padding: 0,
                }}>{d}</button>
              );
            })}
          </div>
          {/* Legend */}
          <div style={{ display: 'flex', gap: 28, marginTop: 22 }}>
            {window.PHASES.map(p => (
              <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ width: 8, height: 8, borderRadius: 999, background: p.color }} />
                <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 13, color: 'oklch(0.46 0.035 135)' }}>
                  {p.name} <span style={{ color: 'oklch(0.56 0.030 130)' }}>· D{p.range[0]}–{p.range[1]}</span>
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Four phase chapters */}
      <h2 style={{ fontFamily: 'Instrument Serif, serif', fontSize: 48, color: 'oklch(0.28 0.040 145)', margin: '0 0 56px', fontWeight: 400 }}>
        The <em>four phases</em>
      </h2>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 72 }}>
        {window.PHASES.map((p, i) => {
          const active = p.id === phase.id;
          return (
            <article key={p.id} style={{ display: 'grid', gridTemplateColumns: '180px 1fr 1fr', gap: 56, alignItems: 'flex-start', opacity: active ? 1 : 0.85 }}>
              {/* Number + meta */}
              <div>
                <div style={{ fontFamily: 'Instrument Serif, serif', fontSize: 88, lineHeight: 1, color: p.color, fontWeight: 400 }}>
                  0{i + 1}
                </div>
                <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10.5, letterSpacing: '0.14em', color: 'oklch(0.50 0.035 135)', marginTop: 14, textTransform: 'uppercase' }}>
                  Days {p.range[0]}–{p.range[1]}
                </div>
                <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10.5, letterSpacing: '0.14em', color: 'oklch(0.50 0.035 135)', marginTop: 4, textTransform: 'uppercase' }}>
                  {p.dosha}
                </div>
                {active && (
                  <div style={{ display: 'inline-block', marginTop: 14, padding: '6px 10px', borderRadius: 999, background: p.color, color: 'oklch(0.945 0.022 88)', fontFamily: 'JetBrains Mono, monospace', fontSize: 9.5, letterSpacing: '0.14em' }}>
                    YOU'RE HERE
                  </div>
                )}
              </div>

              {/* Headline + body + gut + ayurvedic */}
              <div>
                <window.Eyebrow color={p.color}>{p.name} phase</window.Eyebrow>
                <h3 style={{ fontFamily: 'Instrument Serif, serif', fontSize: 40, lineHeight: 1.1, color: 'oklch(0.28 0.040 145)', margin: '12px 0 18px', fontWeight: 400 }}>
                  <em>{p.headline}</em>
                </h3>
                <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 15, lineHeight: 1.6, color: 'oklch(0.42 0.035 135)', margin: '0 0 24px' }}>
                  {p.body}
                </p>
                {/* Gut focus */}
                <div style={{ padding: '18px 20px', borderRadius: 12, background: p.soft, border: `1px solid ${p.color}25`, marginBottom: 14 }}>
                  <window.Eyebrow color={p.color}>Gut & microbiome</window.Eyebrow>
                  <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 13.5, lineHeight: 1.6, color: 'oklch(0.38 0.035 140)', margin: '8px 0 0' }}>
                    {p.gutFocus}
                  </p>
                </div>
                {/* Ayurvedic focus */}
                <div style={{ padding: '18px 20px', borderRadius: 12, background: 'oklch(0.28 0.040 145)' }}>
                  <window.Eyebrow color="oklch(0.76 0.08 88)">Ayurvedic lens · {p.dosha}</window.Eyebrow>
                  <p style={{ fontFamily: 'Instrument Serif, serif', fontSize: 15, lineHeight: 1.6, color: 'oklch(0.86 0.025 95)', margin: '8px 0 0', fontStyle: 'italic' }}>
                    {p.ayurvedicFocus}
                  </p>
                </div>
              </div>

              {/* Add / Avoid / Seed */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
                <div>
                  <window.Eyebrow>Add</window.Eyebrow>
                  <div style={{ fontFamily: 'Instrument Serif, serif', fontSize: 19, color: 'oklch(0.28 0.040 145)', marginTop: 6, lineHeight: 1.5 }}>
                    {p.needs.join(' · ')}
                  </div>
                </div>
                <div>
                  <window.Eyebrow>Avoid</window.Eyebrow>
                  <div style={{ fontFamily: 'Instrument Serif, serif', fontSize: 19, color: 'oklch(0.52 0.035 135)', marginTop: 6, lineHeight: 1.5, fontStyle: 'italic' }}>
                    {p.avoid.join(' · ')}
                  </div>
                </div>
                <div>
                  <window.Eyebrow>Seed cycling</window.Eyebrow>
                  <div style={{ fontFamily: 'Instrument Serif, serif', fontSize: 19, color: 'oklch(0.28 0.040 145)', marginTop: 6, lineHeight: 1.5, fontStyle: 'italic' }}>
                    {p.seed}
                  </div>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      </>)} {/* end mode === 'cycle' */}
    </div>
  );
}


function Profile({ profile, setProfile, go, tweaks, setTweak }) {
  const proteinTarget = Math.round((profile.height - 100) * 1.5);

  const Block = ({ title, children }) => (
    <window.Card padding={28} style={{ marginBottom: 18 }}>
      <window.Eyebrow>{title}</window.Eyebrow>
      <div style={{ marginTop: 16 }}>{children}</div>
    </window.Card>
  );

  return (
    <div style={{ maxWidth: 980, margin: '0 auto', padding: '48px 32px 96px' }}>
      {/* Avatar + name */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 24, marginBottom: 36 }}>
        <div style={{ width: 96, height: 96, borderRadius: 999, background: 'oklch(0.86 0.060 40)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Instrument Serif, serif', fontSize: 44, color: 'oklch(0.30 0.06 30)' }}>
          {profile.name[0]}
        </div>
        <div>
          <window.Eyebrow>Profile</window.Eyebrow>
          <h1 style={{ fontFamily: 'Instrument Serif, serif', fontSize: 52, lineHeight: 1, color: 'oklch(0.28 0.040 145)', margin: '8px 0 0', fontWeight: 400 }}>
            <em>{profile.name}</em>
          </h1>
        </div>
      </div>

      {/* ─── Settings ─── */}
      <window.Eyebrow>Settings</window.Eyebrow>
      <div style={{ marginBottom: 24 }} />

      <Block title="Identity">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
          <FieldInput label="Display name" value={profile.name} onChange={v => setProfile({ ...profile, name: v })} />
          <FieldInput label="Age" type="number" value={profile.age} onChange={v => setProfile({ ...profile, age: parseInt(v) || 0 })} />
          <FieldInput label="Height (cm)" type="number" value={profile.height} onChange={v => setProfile({ ...profile, height: parseInt(v) || 0 })} />
        </div>
      </Block>

      <Block title="Heritage · hormonal baseline">
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {window.ETHNICITIES.map(e => {
            const on = profile.ethnicity === e.id;
            return (
              <button key={e.id} onClick={() => setProfile({ ...profile, ethnicity: e.id })} style={{
                padding: '10px 14px', borderRadius: 999,
                background: on ? 'oklch(0.28 0.040 145)' : 'oklch(0.945 0.022 88)',
                color: on ? 'oklch(0.945 0.022 88)' : 'oklch(0.34 0.035 140)',
                border: '1px solid oklch(0.84 0.025 95)',
                cursor: 'pointer', fontFamily: 'DM Sans, sans-serif', fontSize: 13,
              }}>{e.label}</button>
            );
          })}
        </div>
        <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 12.5, color: 'oklch(0.54 0.035 135)', marginTop: 14, lineHeight: 1.5 }}>
          {window.ETHNICITIES.find(e => e.id === profile.ethnicity)?.note} · Life stage:{' '}
          <em style={{ fontFamily: 'Instrument Serif, serif', fontSize: 14, color: 'oklch(0.34 0.035 140)' }}>{window.lifeStageFor(profile.age).label}</em>
        </p>
      </Block>

      <Block title="Cycle">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
          <FieldInput label="Current day" type="number" value={profile.day} onChange={v => setProfile({ ...profile, day: parseInt(v) || 1 })} />
          <FieldInput label="Average length" type="number" value={profile.length} onChange={v => setProfile({ ...profile, length: parseInt(v) || 28 })} />
          <label style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <window.Eyebrow>Meals per day</window.Eyebrow>
            <div style={{ display: 'flex', gap: 8 }}>
              {[2, 3].map(n => (
                <button key={n} onClick={() => setProfile({ ...profile, meals: n })} style={{
                  flex: 1, padding: 12, borderRadius: 10,
                  background: profile.meals === n ? 'oklch(0.28 0.040 145)' : 'oklch(0.945 0.022 88)',
                  color: profile.meals === n ? 'oklch(0.945 0.022 88)' : 'oklch(0.28 0.040 145)',
                  border: '1px solid oklch(0.84 0.025 95)', cursor: 'pointer',
                  fontFamily: 'Instrument Serif, serif', fontSize: 22,
                }}>{n}</button>
              ))}
            </div>
          </label>
        </div>
      </Block>

      <Block title="Calculated IR plan">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', border: '1px solid oklch(0.86 0.025 95)', borderRadius: 12, overflow: 'hidden' }}>
          {[
            { l: 'Daily protein', v: `${proteinTarget} g` },
            { l: 'Per meal',      v: `${Math.round(proteinTarget / profile.meals)} g` },
            { l: 'Meal gap',      v: '4–6 h' },
          ].map((c, i) => (
            <div key={i} style={{ padding: 18, borderRight: i < 2 ? '1px solid oklch(0.86 0.025 95)' : 'none', background: 'oklch(0.945 0.022 88)' }}>
              <window.Eyebrow>{c.l}</window.Eyebrow>
              <div style={{ fontFamily: 'Instrument Serif, serif', fontSize: 32, color: 'oklch(0.28 0.040 145)', marginTop: 6 }}>{c.v}</div>
            </div>
          ))}
        </div>
      </Block>

      <Block title="Dietary framework">
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {window.DIETS.map(d => (
            <button key={d.id} onClick={() => setProfile({ ...profile, diet: d.id })} style={{
              padding: '10px 16px', borderRadius: 999,
              background: profile.diet === d.id ? 'oklch(0.28 0.040 145)' : 'oklch(0.945 0.022 88)',
              color: profile.diet === d.id ? 'oklch(0.945 0.022 88)' : 'oklch(0.34 0.035 140)',
              border: '1px solid oklch(0.84 0.025 95)', cursor: 'pointer',
              fontFamily: 'DM Sans, sans-serif', fontSize: 13,
            }}>{d.name}</button>
          ))}
        </div>
      </Block>

      <Block title="Cuisines you reach for">
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {window.CUISINES.map(c => {
            const on = profile.cuisines.includes(c.id);
            return (
              <button key={c.id} onClick={() => setProfile({ ...profile, cuisines: on ? profile.cuisines.filter(x => x !== c.id) : [...profile.cuisines, c.id] })} style={{
                padding: '10px 14px', borderRadius: 999,
                background: on ? 'oklch(0.28 0.040 145)' : 'oklch(0.945 0.022 88)',
                color: on ? 'oklch(0.945 0.022 88)' : 'oklch(0.34 0.035 140)',
                border: '1px solid oklch(0.84 0.025 95)', cursor: 'pointer',
                fontFamily: 'DM Sans, sans-serif', fontSize: 13,
              }}>{c.name}</button>
            );
          })}
        </div>
      </Block>

      <Block title="Health conditions">
        <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 13, color: 'oklch(0.52 0.035 135)', lineHeight: 1.55, margin: '0 0 14px' }}>
          Select any that apply — recipes and coach advice will be tailored to your needs.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          {(window.HEALTH_CONDITIONS || []).map(c => {
            const on = (profile.conditions || []).includes(c.id);
            return (
              <button key={c.id} onClick={() => {
                const cur = profile.conditions || [];
                setProfile({ ...profile, conditions: on ? cur.filter(x => x !== c.id) : [...cur, c.id] });
              }} style={{
                padding: '14px 16px', borderRadius: 14, textAlign: 'left',
                background: on ? 'oklch(0.28 0.040 145)' : 'oklch(0.945 0.022 88)',
                border: on ? '1px solid oklch(0.28 0.040 145)' : '1px solid oklch(0.84 0.025 95)',
                cursor: 'pointer', display: 'flex', alignItems: 'flex-start', gap: 12,
              }}>
                <span style={{ fontSize: 18, lineHeight: 1.2, flexShrink: 0, color: on ? 'oklch(0.80 0.06 88)' : 'oklch(0.56 0.035 135)' }}>{c.icon}</span>
                <div>
                  <div style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 13.5, fontWeight: 600, color: on ? 'oklch(0.945 0.022 88)' : 'oklch(0.28 0.040 145)' }}>{c.label}</div>
                  <div style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 12, color: on ? 'oklch(0.74 0.025 90)' : 'oklch(0.54 0.035 135)', marginTop: 3 }}>{c.description}</div>
                </div>
              </button>
            );
          })}
        </div>
      </Block>

      <Block title="Exclusions">
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {window.ALLERGENS.map(a => {
            const on = profile.allergies.includes(a.id);
            return (
              <button key={a.id} onClick={() => setProfile({ ...profile, allergies: on ? profile.allergies.filter(x => x !== a.id) : [...profile.allergies, a.id] })} style={{
                padding: '10px 14px', borderRadius: 999,
                background: on ? 'oklch(0.93 0.035 40)' : 'oklch(0.945 0.022 88)',
                color: on ? 'oklch(0.40 0.08 35)' : 'oklch(0.46 0.035 135)',
                border: on ? '1px solid oklch(0.62 0.11 35)' : '1px solid oklch(0.84 0.025 95)',
                cursor: 'pointer', fontFamily: 'DM Sans, sans-serif', fontSize: 13,
              }}>{on ? '✕ ' : '+ '}{a.name}</button>
            );
          })}
        </div>
      </Block>

      <Block title="Stores near you">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          {window.STORE_CATEGORIES.map(cat => {
            const countryStores = window.storesForCountry(profile.country || 'Germany').filter(s => s.category === cat.id);
            if (!countryStores.length) return null;
            return (
            <div key={cat.id}>
              <window.Eyebrow>{cat.label}</window.Eyebrow>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 10 }}>
                {countryStores.map(s => {
                  const on = profile.markets.includes(s.id);
                  return (
                    <button key={s.id} onClick={() => setProfile({ ...profile, markets: on ? profile.markets.filter(x => x !== s.id) : [...profile.markets, s.id] })} style={{
                      padding: '10px 14px', borderRadius: 999,
                      background: on ? 'oklch(0.91 0.030 90)' : 'oklch(0.945 0.022 88)',
                      border: on ? '1px solid oklch(0.28 0.040 145)' : '1px solid oklch(0.84 0.025 95)',
                      cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10,
                      fontFamily: 'DM Sans, sans-serif',
                    }}>
                      <div style={{ width: 22, height: 22, borderRadius: 6, background: s.color, color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Instrument Serif, serif', fontSize: 12 }}>{s.name[0]}</div>
                      <span style={{ fontSize: 13, color: 'oklch(0.28 0.040 145)' }}>{s.name}</span>
                      {on && profile.markets[0] === s.id && <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 9, color: 'oklch(0.50 0.035 135)', letterSpacing: '0.08em' }}>· DEFAULT</span>}
                    </button>
                  );
                })}
              </div>
            </div>
            );
          })}
        </div>
      </Block>


      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '24px 0', borderTop: '1px solid oklch(0.86 0.025 95)', marginTop: 24 }}>
        <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 13, color: 'oklch(0.54 0.035 135)' }}>Changes save automatically.</span>
        <window.Button variant="ghost" onClick={() => go('home')}>Back to today →</window.Button>
      </div>

      {/* Dev tools — tucked at the very bottom */}
      {tweaks && setTweak && (
        <div style={{ marginTop: 24, paddingTop: 24, borderTop: '1px solid oklch(0.90 0.018 95)' }}>
          <window.TweaksPanel>
            <window.TweakSection label="Cycle">
              <window.TweakSlider
                label="Cycle day" value={tweaks.phaseDay} min={1} max={28}
                onChange={v => setTweak('phaseDay', v)}
                unit={` · ${window.phaseForDay(tweaks.phaseDay).name}`}
              />
            </window.TweakSection>
            <window.TweakSection label="Region">
              <window.TweakSelect
                label="Default store" value={tweaks.region}
                options={window.SUPERMARKETS.map(s => ({
                  value: s.id,
                  label: `${s.name} · ${window.STORE_CATEGORIES.find(c => c.id === s.category)?.label}`,
                }))}
                onChange={v => setTweak('region', v)}
              />
            </window.TweakSection>
            <window.TweakSection label="Diet">
              <window.TweakSelect
                label="Framework" value={tweaks.diet}
                options={window.DIETS.map(d => ({ value: d.id, label: d.name }))}
                onChange={v => setTweak('diet', v)}
              />
            </window.TweakSection>
            <window.TweakSection label="Flow">
              <window.TweakButton label="Replay onboarding →" onClick={() => setTweak('showOnboarding', true)} />
            </window.TweakSection>
          </window.TweaksPanel>
        </div>
      )}
    </div>
  );
}

const inputStyle = {
  padding: '12px 14px', borderRadius: 10,
  background: 'oklch(0.945 0.022 88)', border: '1px solid oklch(0.84 0.025 95)',
  fontFamily: 'DM Sans, sans-serif', fontSize: 15, color: 'oklch(0.28 0.040 145)',
  width: '100%',
};

function FieldInput({ label, value, onChange, type = 'text' }) {
  const [local, setLocal] = useState_S(String(value ?? ''));
  useEffect_S(() => { setLocal(String(value ?? '')); }, [value]);
  return (
    <label style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <window.Eyebrow>{label}</window.Eyebrow>
      <input
        type={type}
        value={local}
        onChange={e => setLocal(e.target.value)}
        onBlur={() => onChange(local)}
        style={inputStyle}
      />
    </label>
  );
}

Object.assign(window, { CycleCalendar, Profile });
