// Cycle calendar, Shopping list, Profile screens

const { useState: useState_S } = React;

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

// Shopping list — trip plan + sectioned ingredient list
function ShoppingList({ profile }) {
  const phase         = window.phaseForDay(profile.day, profile.length);
  const plan          = window.PLAN_BY_PHASE[phase.id];
  const plantsToday   = window.countPlantsToday(plan);
  const defaultMarket = profile.markets[0] || 'REWE';
  const defaultMarketObj = window.SUPERMARKETS.find(s => s.id === defaultMarket) || window.SUPERMARKETS[0];

  const all = [];
  Object.entries(plan).forEach(([slot, rid]) => {
    const r = window.recipeById(rid);
    if (!r) return;
    r.ingredients.forEach(ing => {
      const best = window.bestStoreFor(ing.item, profile.markets);
      all.push({ ...ing, slot, recipe: r.title, store: best });
    });
  });

  const sections = {
    'Produce':            all.filter(x => /spinach|kale|cucumber|fennel|asparagus|cilantro|dill|mint|beet|squash|avocado|lemon|cabbage|ginger/i.test(x.item)),
    'Proteins & seafood': all.filter(x => /cod|salmon|egg|lentil|chickpea|mung/i.test(x.item)),
    'Pantry & oils':      all.filter(x => /oil|ghee|tahini|capers|sourdough|sumac|cumin|turmeric|chili|seeds|pumpkin|sesame|sunflower|flax/i.test(x.item)),
    'Dairy & cultured':   all.filter(x => /butter|yogurt|kefir/i.test(x.item)),
  };
  Object.keys(sections).forEach(k => {
    const seen = new Set();
    sections[k] = sections[k].filter(x => seen.has(x.item) ? false : (seen.add(x.item), true));
  });
  const matched  = new Set(Object.values(sections).flat().map(x => x.item));
  const leftover = all.filter(x => !matched.has(x.item));
  if (leftover.length) sections['Other'] = leftover;

  const tripPlan = {};
  Object.values(sections).flat().forEach(x => { tripPlan[x.store] = (tripPlan[x.store] || 0) + 1; });

  const [checked, setChecked] = useState_S({});
  const total        = Object.values(sections).flat().length;
  const checkedCount = Object.values(checked).filter(Boolean).length;

  return (
    <div style={{ maxWidth: 1180, margin: '0 auto', padding: '64px 32px 120px' }}>

      <header style={{ marginBottom: 56 }}>
        <window.Eyebrow>Shopping list · today · {total} items · {checkedCount} in cart</window.Eyebrow>
        <h1 style={{ fontFamily: 'Instrument Serif, serif', fontSize: 72, lineHeight: 0.98, color: 'oklch(0.28 0.040 145)', margin: '18px 0 0', fontWeight: 400 }}>
          {Object.keys(tripPlan).length === 1
            ? <span>One stop · <em>{defaultMarketObj.name}</em>.</span>
            : <span>{Object.keys(tripPlan).length} <em>stops</em> on the way home.</span>
          }
        </h1>
      </header>

      {/* Trip row */}
      <div style={{ display: 'flex', gap: 48, padding: '0 0 28px', borderBottom: '1px solid oklch(0.86 0.025 95)', marginBottom: 48, flexWrap: 'wrap', alignItems: 'flex-start' }}>
        {Object.entries(tripPlan).map(([sid, n]) => {
          const s = window.SUPERMARKETS.find(x => x.id === sid) || defaultMarketObj;
          return (
            <div key={sid}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
                <span style={{ fontFamily: 'Instrument Serif, serif', fontSize: 44, lineHeight: 1, color: s.color }}>{n}</span>
                <span style={{ fontFamily: 'Instrument Serif, serif', fontSize: 20, color: 'oklch(0.28 0.040 145)', fontStyle: 'italic' }}>at {s.name}</span>
              </div>
              <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, color: 'oklch(0.54 0.035 135)', marginTop: 6, letterSpacing: '0.08em', textTransform: 'uppercase' }}>{s.distance}</div>
            </div>
          );
        })}
        <div style={{ flex: 1 }} />
        <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
          <window.Button variant="ghost" size="sm">⤓ PDF</window.Button>
          <window.Button variant="ghost" size="sm">→ Phone</window.Button>
        </div>
      </div>

      {/* Section grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '56px 64px' }}>
        {Object.entries(sections).filter(([_, items]) => items.length > 0).map(([sec, items]) => (
          <section key={sec}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 14, paddingBottom: 10, borderBottom: '1px solid oklch(0.86 0.025 95)' }}>
              <h3 style={{ fontFamily: 'Instrument Serif, serif', fontSize: 28, color: 'oklch(0.28 0.040 145)', margin: 0, fontWeight: 400 }}><em>{sec}</em></h3>
              <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10.5, color: 'oklch(0.54 0.035 135)', letterSpacing: '0.08em' }}>{items.length}</span>
            </div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {items.map((ing, i) => {
                const key  = `${sec}-${i}`;
                const on   = !!checked[key];
                const sObj = window.SUPERMARKETS.find(s => s.id === ing.store) || defaultMarketObj;
                return (
                  <li key={key} onClick={() => setChecked({ ...checked, [key]: !on })} style={{
                    display: 'flex', alignItems: 'center', gap: 16,
                    padding: '14px 0', cursor: 'pointer', opacity: on ? 0.4 : 1,
                    borderBottom: i === items.length - 1 ? 'none' : '1px solid oklch(0.92 0.020 95)',
                    transition: 'opacity 0.2s ease',
                  }}>
                    <div style={{
                      width: 18, height: 18, borderRadius: 999, flexShrink: 0,
                      border: on ? `1px solid ${phase.color}` : '1px solid oklch(0.74 0.025 100)',
                      background: on ? phase.color : 'transparent',
                      color: 'oklch(0.945 0.022 88)', fontSize: 10,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>{on && '✓'}</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontFamily: 'Instrument Serif, serif', fontSize: 19, color: 'oklch(0.28 0.040 145)', textDecoration: on ? 'line-through' : 'none' }}>
                        {window.brandFor(ing, ing.store)}
                      </div>
                      <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, color: 'oklch(0.54 0.035 135)', marginTop: 3, letterSpacing: '0.04em' }}>
                        {ing.amount} · {ing.item}
                      </div>
                    </div>
                    <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 9.5, color: sObj.color, letterSpacing: '0.1em', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
                      {sObj.name}
                    </span>
                  </li>
                );
              })}
            </ul>
          </section>
        ))}
      </div>

      {/* Footer: seed cycling + 30-plants goal */}
      <div style={{ marginTop: 72, paddingTop: 28, borderTop: '1px solid oklch(0.86 0.025 95)', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40 }}>
        <div>
          <window.Eyebrow>Don't forget · seed cycling</window.Eyebrow>
          <div style={{ fontFamily: 'Instrument Serif, serif', fontSize: 28, color: 'oklch(0.28 0.040 145)', marginTop: 6, fontStyle: 'italic' }}>
            {phase.seed}
          </div>
          <div style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 12.5, color: 'oklch(0.54 0.035 135)', marginTop: 6 }}>
            Drogerie bulk bins · dm or Rossmann
          </div>
        </div>
        <div style={{ padding: '22px 24px', borderRadius: 16, background: phase.soft, border: `1px solid ${phase.color}25` }}>
          <window.Eyebrow color={phase.color}>Plant diversity goal · 30/week</window.Eyebrow>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginTop: 10 }}>
            <span style={{ fontFamily: 'Instrument Serif, serif', fontSize: 42, color: 'oklch(0.58 0.09 140)', lineHeight: 1 }}>{plantsToday}</span>
            <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 13, color: 'oklch(0.46 0.035 135)' }}>
              plants today · {Math.round((plantsToday / 30) * 100)}% of weekly goal
            </span>
          </div>
          <div style={{ marginTop: 10, height: 5, borderRadius: 999, background: 'oklch(0.86 0.025 95)', overflow: 'hidden' }}>
            <div style={{ height: '100%', borderRadius: 999, background: 'oklch(0.58 0.09 140)', width: `${Math.min(Math.round((plantsToday / 30) * 100), 100)}%` }} />
          </div>
          <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 9.5, color: 'oklch(0.50 0.035 135)', marginTop: 6, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            {plantsToday >= 4
              ? 'Estrobolome well-fed · Keep adding variety all week'
              : `Add ${4 - plantsToday} more plant foods today`}
          </div>
          <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 12, lineHeight: 1.55, color: 'oklch(0.46 0.035 135)', margin: '10px 0 0' }}>
            Microbiome diversity is the foundation of hormonal health. The Estrobolome — gut bacteria that metabolise estrogen — thrives on variety. Aim for 30 distinct plant foods every week.
          </p>
        </div>
      </div>
    </div>
  );
}

// Profile / settings
function Profile({ profile, setProfile, go }) {
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

      {/* Health snapshot */}
      <window.HealthSnapshot profile={profile} />

      {/* AI Health Coach */}
      <window.HealthCoach profile={profile} />

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
          {window.STORE_CATEGORIES.map(cat => (
            <div key={cat.id}>
              <window.Eyebrow>{cat.label}</window.Eyebrow>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 10 }}>
                {window.SUPERMARKETS.filter(s => s.category === cat.id).map(s => {
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
          ))}
        </div>
      </Block>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '24px 0', borderTop: '1px solid oklch(0.86 0.025 95)', marginTop: 24 }}>
        <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 13, color: 'oklch(0.54 0.035 135)' }}>Changes save automatically.</span>
        <window.Button variant="ghost" onClick={() => go('home')}>Back to today →</window.Button>
      </div>
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
  return (
    <label style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <window.Eyebrow>{label}</window.Eyebrow>
      <input type={type} value={value} onChange={e => onChange(e.target.value)} style={inputStyle} />
    </label>
  );
}

Object.assign(window, { CycleCalendar, ShoppingList, Profile });
