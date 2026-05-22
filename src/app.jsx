// Root: routing, profile state, tweaks panel wiring

const { useState, useEffect } = React;

const DEFAULTS = {
  phaseDay:       22,
  region:         'REWE',
  diet:           'omnivore',
  showOnboarding: false,
};

function App() {
  const [tweaks, setTweak] = window.useTweaks(DEFAULTS);
  const [route,    setRoute]    = useState('home');
  const [recipeId, setRecipeId] = useState(null);

  const [profile, setProfile] = useState({
    name:      'Anya',
    country:   'Germany',
    zip:       '10115',
    markets:   ['REWE', 'Alnatura', 'dm'],
    diet:      tweaks.diet,
    cuisines:  ['mediterranean', 'south-asian'],
    allergies: [],
    day:       tweaks.phaseDay,
    length:    28,
    meals:     3,
    height:    168,
    age:       34,
    ethnicity: 'european',
    irregular: false,
    trackingMode:   'cycle',   // 'cycle' | 'pregnant' | 'postpartum' | 'menopause'
    pregnancyWeek:  12,
    postpartumWeek: 6,
    breastfeeding:  false,
  });

  const [onboarded, setOnboarded] = useState(!tweaks.showOnboarding);

  // Sync tweaks → profile
  useEffect(() => {
    setProfile(p => ({
      ...p,
      day:     tweaks.phaseDay,
      diet:    tweaks.diet,
      markets: [tweaks.region, ...p.markets.filter(m => m !== tweaks.region)],
    }));
  }, [tweaks.phaseDay, tweaks.diet, tweaks.region]);

  useEffect(() => {
    setOnboarded(!tweaks.showOnboarding);
  }, [tweaks.showOnboarding]);

  const go = (r) => {
    setRoute(r);
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const openRecipe = (id) => {
    setRecipeId(id);
    setRoute('recipe');
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  if (!onboarded) {
    return (
      <window.Onboarding
        profile={profile}
        setProfile={setProfile}
        complete={() => {
          setOnboarded(true);
          setTweak('showOnboarding', false);
        }}
      />
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: 'oklch(0.945 0.022 88)', color: 'oklch(0.28 0.040 145)' }}>
      <window.TopNav route={route} go={go} profile={profile} />

      {route === 'home'    && <window.Dashboard     profile={profile} go={go} openRecipe={openRecipe} />}
      {route === 'browse'  && <window.RecipeBrowse  profile={profile} openRecipe={openRecipe} />}
      {route === 'recipe'  && recipeId && <window.RecipeDetail id={recipeId} profile={profile} go={go} openRecipe={openRecipe} />}
      {route === 'cycle'   && <window.CycleCalendar profile={profile} go={go} setProfile={setProfile} />}
      {route === 'shop'    && <window.ShoppingList  profile={profile} go={go} />}
      {route === 'profile' && <window.Profile       profile={profile} setProfile={setProfile} go={go} />}

      {/* Dev tweaks panel */}
      <window.TweaksPanel title="Tweaks">
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
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
