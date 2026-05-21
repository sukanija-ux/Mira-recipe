// Data: cycle phases, recipes, brand mapping, stores, diets, cuisines, allergens

const PHASES = [
  {
    id: 'menstrual',
    name: 'Menstrual',
    range: [1, 5],
    dosha: 'Vata',
    color: 'oklch(0.62 0.11 35)',
    soft: 'oklch(0.93 0.035 40)',
    headline: 'Warm, ground, replenish.',
    body: 'Estrogen and progesterone are at baseline. The body is shedding tissue and losing iron. Digestion (Agni) runs low — favor warm, cooked, deeply nourishing meals over raw or cold.',
    gutFocus: 'Gut lining is most vulnerable. Prioritise bone broths, long-simmered legumes, and collagen-rich foods rich in L-glutamine to repair the intestinal mucosa. Avoid raw salads and cold drinks — they suppress Agni and worsen cramping. Slow gut motility can alternate with urgency; warm, easy-to-digest meals reduce this variability.',
    ayurvedicFocus: 'Vata dominates — the wind/space element governs movement and the nervous system. Ground it with heavy, unctuous, warm foods. Ghee is medicine. Mung dal is the ideal reset meal. Avoid all dry, rough, cold, or raw textures. Spice gently with cumin, ginger, and black pepper to rekindle digestive fire.',
    needs: ['Iron', 'Zinc', 'L-Glutamine', 'Warming spices', 'Bone broth'],
    avoid: ['Raw salads', 'Cold drinks', 'Dry crackers', 'Cruciferous raw veg'],
    carbState: 'Moderate, clean, comforting carbs allowed at breakfast & lunch.',
    seed: '1 tbsp ground flax + 1 tbsp pumpkin',
  },
  {
    id: 'follicular',
    name: 'Follicular',
    range: [6, 13],
    dosha: 'Kapha',
    color: 'oklch(0.58 0.09 140)',
    soft: 'oklch(0.93 0.030 140)',
    headline: 'Light, vibrant, fermented.',
    body: 'Estrogen rises to build the uterine lining. Insulin sensitivity is at its monthly peak — the body handles clean complex carbs exceptionally well. Feed the estrobolome.',
    gutFocus: 'The Estrobolome — the subset of gut bacteria that metabolise and eliminate used estrogen — is the focus. Feed it with diverse plant fibers and fermented foods (sauerkraut, kefir, kimchi). Cruciferous vegetables (broccoli, sprouts, rocket) support liver Phase II detoxification of estrogen. Target 30+ distinct plant foods this week to maximise microbiome diversity.',
    ayurvedicFocus: 'Kapha dominates — heavy, stable, moist earth energy. Counter it with light, vibrant, slightly bitter, and lightly spiced foods. Use warming ginger and cinnamon to keep digestion crisp without overheating. Spring-like foods mirror this phase: sprouts, micro-greens, light grains.',
    needs: ['Fermented foods', 'Cruciferous veg', 'Sprouts', 'Vibrant plant diversity'],
    avoid: ['Heavy, oily foods', 'Excess dairy', 'Refined grains'],
    carbState: 'Highest tolerance for vibrant, clean complex carbs.',
    seed: '1 tbsp ground flax + 1 tbsp pumpkin',
  },
  {
    id: 'ovulatory',
    name: 'Ovulatory',
    range: [14, 17],
    dosha: 'Pitta (entry)',
    color: 'oklch(0.76 0.10 88)',
    soft: 'oklch(0.94 0.040 88)',
    headline: 'Cool, antioxidant, bright.',
    body: 'Estrogen peaks and drops; LH triggers ovulation. Heat can accumulate — balance with cooling herbs (cilantro, mint, fennel) and high-antioxidant produce.',
    gutFocus: 'High antioxidant density clears systemic inflammation that peaks at ovulation. Prioritise soluble and insoluble fibers to bind to deactivated hormones in the bowel and prevent them from being reabsorbed (enterohepatic recirculation). Flaxseed, psyllium, and resistant starches are excellent here.',
    ayurvedicFocus: 'Pitta begins to rise — the fire element governs transformation. Excess heat can manifest as inflammation, skin breakouts, or irritability. Cool the system with cilantro, mint, fennel, cucumber, and lime. Avoid excessively spicy, sour, or pungent foods. Bitter greens (rocket, dandelion) support liver bile flow.',
    needs: ['Vitamin E', 'Antioxidants', 'Cooling herbs', 'Bitter greens', 'Soluble fiber'],
    avoid: ['Overly spicy foods', 'Excess heat', 'Alcohol'],
    carbState: 'Moderate carbs at breakfast & lunch.',
    seed: '1 tbsp sesame + 1 tbsp sunflower',
  },
  {
    id: 'luteal',
    name: 'Luteal',
    range: [18, 28],
    dosha: 'Pitta + Vata',
    color: 'oklch(0.62 0.08 230)',
    soft: 'oklch(0.93 0.025 230)',
    headline: 'Slow, magnesium, steady.',
    body: 'Progesterone peaks. Critical IR factor: progesterone increases insulin resistance and provokes carb cravings. Do not aggressively restrict — provide slow-burning, high-fiber, low-glycemic carbs to steady serotonin without spiking insulin.',
    gutFocus: 'Progesterone slows smooth muscle contraction, directly slowing intestinal motility — bloating and constipation are common. Counter this with high-magnesium foods (spinach, pumpkin seeds, raw cacao), soluble fiber (chia, flax, psyllium), and Vitamin B6-rich foods. Carminative spices (fennel, cardamom, ginger) relieve gas and bloating mechanically.',
    ayurvedicFocus: 'Pitta and Vata both rise — fire creates inflammation and wind creates anxiety and bloating. Warm, grounding, gently spiced foods are medicine: cinnamon for blood sugar, turmeric for inflammation, fenugreek for insulin sensitivity, cardamom and ginger for bloating. Slow-cooked squash, legumes, and warm grain dishes anchor both doshas.',
    needs: ['Magnesium', 'Vitamin B6', 'Cinnamon', 'Turmeric', 'Soluble fiber', 'Slow carbs'],
    avoid: ['Refined sugar', 'Late-night carbs', 'Aggressive restriction', 'Raw cold foods'],
    carbState: 'Complex, high-fiber, slow-burning carbs at breakfast & lunch (squash, quinoa, legumes).',
    seed: '1 tbsp sesame + 1 tbsp sunflower',
  },
];

function phaseForDay(day, length = 28) {
  const d = ((day - 1) % length) + 1;
  const pct = d / length;
  if (pct <= 5 / 28) return PHASES[0];
  if (pct <= 13 / 28) return PHASES[1];
  if (pct <= 17 / 28) return PHASES[2];
  return PHASES[3];
}

// Plant food count = distinct whole plant ingredients per recipe (for 30-plant/week goal)
const RECIPES = [
  {
    id: 'r-warming-mung-dal',
    title: 'Golden Mung Dal with Charred Greens',
    source: 'Sallys Welt',
    author: 'Sally Özcan',
    sourceUrl: 'https://sallys-blog.de/rezepte/indisches-linsen-curry-mit-warmem-tomaten-salat',
    imageUrl: 'https://source.unsplash.com/featured/800x600/?mung,dal,lentil,turmeric,soup',
    minutes: 35,
    servings: 2,
    protein: 32,
    carbs: 38,
    fat: 18,
    meal: 'lunch',
    phases: ['menstrual', 'luteal'],
    plantCount: 6,
    tags: ['Ayurvedic-spiced', 'Gut-healing', 'Warming', 'Gluten-free'],
    ingredients: [
      { item: 'Split yellow mung dal', amount: '150 g', brand: { REWE: 'REWE Bio Mung Dal', Edeka: 'Edeka Bio Hülsenfrüchte', Alnatura: 'Alnatura Mungbohnen' } },
      { item: 'Ghee', amount: '2 tbsp', brand: { REWE: 'REWE Bio Ghee', Edeka: 'GUT&GÜNSTIG Butterschmalz', Alnatura: 'Alnatura Ghee' } },
      { item: 'Fresh ginger', amount: '15 g', brand: { REWE: 'REWE Bio Ingwer', Edeka: 'Edeka Bio Ingwer', Alnatura: 'Alnatura Ingwer' } },
      { item: 'Turmeric', amount: '1 tsp', brand: { REWE: 'REWE Bio Kurkuma', Edeka: 'Edeka Kurkuma', Alnatura: 'Alnatura Bio Kurkuma' } },
      { item: 'Cumin seeds', amount: '1 tsp', brand: { REWE: 'REWE Bio Kreuzkümmel', Edeka: 'Edeka Kreuzkümmel', Alnatura: 'Alnatura Kreuzkümmel' } },
      { item: 'Lacinato kale', amount: '1 bunch', brand: { REWE: 'REWE Bio Schwarzkohl', Edeka: 'Edeka Bio Grünkohl', Alnatura: 'Alnatura Grünkohl' } },
      { item: 'Cilantro', amount: '½ bunch', brand: { REWE: 'REWE Bio Koriander', Edeka: 'Edeka Bio Koriander', Alnatura: 'Alnatura Koriander' } },
    ],
    steps: [
      'Rinse the mung dal until the water runs clear. Soak 15 minutes while you prep.',
      'Melt ghee in a heavy pot over medium heat. Add cumin seeds; let them sputter 30 seconds.',
      'Grate in the ginger, add turmeric, and stir 20 seconds — until the kitchen smells like a temple.',
      'Drain the dal and add it with 600 ml of just-boiled water. Simmer covered, 25 minutes, until soft.',
      'Strip the kale, tear into large pieces, and char in a dry cast-iron pan until edges blister.',
      'Spoon dal into warm bowls. Top with kale, cilantro, a final drizzle of ghee, and a crack of black pepper.',
    ],
    notes: 'Stir 1 tbsp ground flax + 1 tbsp pumpkin seeds in at the end during Menstrual or Follicular phase. Mung dal is the single most Ayurvedic gut-reset food — deeply nourishing, easy to digest, and anti-inflammatory.',
  },
  {
    id: 'r-roasted-squash',
    title: 'Roasted Kabocha, Tahini, Sumac',
    source: 'Kitchen Stories',
    author: 'Hanna Reder',
    sourceUrl: 'https://www.kitchenstories.com/en/recipes/mashed-kabocha-squash-a046',
    imageUrl: 'https://source.unsplash.com/featured/800x600/?roasted,kabocha,squash,tahini',
    minutes: 45,
    servings: 2,
    protein: 28,
    carbs: 42,
    fat: 22,
    meal: 'lunch',
    phases: ['luteal'],
    plantCount: 5,
    tags: ['Seasonal', 'Magnesium-rich', 'Gut-healing', 'Vegan', 'Gluten-free'],
    ingredients: [
      { item: 'Kabocha squash', amount: '½', brand: { REWE: 'REWE Bio Hokkaido', Edeka: 'Edeka Bio Kürbis', Alnatura: 'Alnatura Hokkaido-Kürbis' } },
      { item: 'Extra virgin olive oil', amount: '3 tbsp', brand: { REWE: 'REWE Bio Olivenöl Nativ Extra', Edeka: 'BIO WERTKOST Olivenöl', Alnatura: 'Alnatura Olivenöl Nativ Extra' } },
      { item: 'Tahini', amount: '3 tbsp', brand: { REWE: 'REWE Bio Tahini', Edeka: 'Bio Sesammus', Alnatura: 'Alnatura Sesammus' } },
      { item: 'Cooked chickpeas', amount: '250 g', brand: { REWE: 'REWE Bio Kichererbsen', Edeka: 'Edeka Bio Kichererbsen', Alnatura: 'Alnatura Kichererbsen' } },
      { item: 'Sumac', amount: '1 tsp', brand: { REWE: 'Just Spices Sumach', Edeka: 'Ankerkraut Sumach', Alnatura: 'Alnatura Sumach' } },
      { item: 'Lacto-fermented red cabbage', amount: '4 tbsp', brand: { REWE: 'Schwarzwaldhof Sauerkraut', Edeka: 'Mildessa Rotkohl', Alnatura: 'Alnatura Rotkrautsalat' } },
    ],
    steps: [
      'Heat the oven to 220°C. Slice the kabocha into half-moons; toss with olive oil and salt.',
      'Roast 25 minutes, flipping once, until the skin blisters and the flesh collapses to a fork.',
      'Whisk tahini with lemon, a pinch of salt, and warm water until it falls in ribbons.',
      'Warm chickpeas in a dry skillet with sumac and a little olive oil, 3 minutes.',
      'Plate the squash, spoon tahini, scatter chickpeas, finish with fermented cabbage.',
    ],
    notes: 'The lacto-fermented cabbage adds a live probiotic hit that directly feeds the Estrobolome. Tahini is sesame in whole form — your luteal seed cycling built into the recipe.',
  },
  {
    id: 'r-folli-bowl',
    title: 'Sprouted Lentil & Beet Probiotic Bowl',
    source: 'REWE Rezepte',
    author: 'REWE Küche',
    sourceUrl: 'https://www.rewe.de/rezepte/rote-linsen-salat-mit-roter-beete/',
    imageUrl: 'https://source.unsplash.com/featured/800x600/?lentil,beet,grain,bowl,healthy',
    minutes: 25,
    servings: 2,
    protein: 30,
    carbs: 40,
    fat: 14,
    meal: 'lunch',
    phases: ['follicular'],
    plantCount: 7,
    tags: ['Estrobolome', 'Probiotic', 'Gut-healing', 'Fermented', 'Gluten-free', 'Vegetarian'],
    ingredients: [
      { item: 'Sprouted green lentils', amount: '200 g', brand: { REWE: 'REWE Bio Linsen', Edeka: 'Edeka Bio Berglinsen', Alnatura: 'Alnatura Berglinsen' } },
      { item: 'Roasted beets', amount: '2 medium', brand: { REWE: 'REWE Bio Rote Bete', Edeka: 'Edeka Bio Rote Bete', Alnatura: 'Alnatura Rote Bete' } },
      { item: 'Kefir dressing', amount: '4 tbsp', brand: { REWE: 'Andechser Bio Kefir', Edeka: 'Söbbeke Kefir', Alnatura: 'Andechser Natur Kefir' } },
      { item: 'Dill', amount: '½ bunch', brand: { REWE: 'REWE Bio Dill', Edeka: 'Edeka Bio Dill', Alnatura: 'Alnatura Dill' } },
      { item: 'Pumpkin seeds', amount: '2 tbsp', brand: { REWE: 'REWE Bio Kürbiskerne', Edeka: 'Seeberger Kürbiskerne', Alnatura: 'Alnatura Kürbiskerne' } },
    ],
    steps: [
      'Cook lentils in salted water 18 minutes until tender but holding shape. Drain and cool slightly.',
      'Roast or use jarred beets; cut into chunky wedges.',
      'Whisk kefir with lemon, mustard, dill, salt, pepper.',
      'Toss lentils with half the dressing; plate with beets, more dressing, toasted pumpkin seeds.',
    ],
    notes: 'Kefir introduces live Lactobacillus directly to the gut. Beets contain betaine, which supports liver methylation and estrogen detox. The pumpkin seeds deliver your follicular-phase flax/pumpkin seed cycling dose.',
  },
  {
    id: 'r-dinner-cod',
    title: 'Pan-Seared Cod, Brown Butter Greens',
    source: 'Kitchen Stories',
    author: 'Ruby Goss',
    sourceUrl: 'https://www.kitchenstories.com/en/recipes/5-ingredient-one-pan-tomato-braised-cod',
    imageUrl: 'https://source.unsplash.com/featured/800x600/?pan,seared,cod,fish,asparagus',
    minutes: 20,
    servings: 2,
    protein: 36,
    carbs: 8,
    fat: 26,
    meal: 'dinner',
    phases: ['menstrual', 'follicular', 'ovulatory', 'luteal'],
    plantCount: 4,
    tags: ['Dinner-safe', 'Zero starch', 'Low-FODMAP', 'Gluten-free', 'Dairy-free option'],
    ingredients: [
      { item: 'Cod fillet', amount: '300 g', brand: { REWE: 'REWE Beste Wahl Kabeljau', Edeka: 'EDEKA Kabeljaufilet', Alnatura: 'followfish Kabeljau' } },
      { item: 'Cultured butter', amount: '40 g', brand: { REWE: 'REWE Bio Süßrahmbutter', Edeka: 'Kerrygold Butter', Alnatura: 'Alnatura Bio Butter' } },
      { item: 'Asparagus', amount: '300 g', brand: { REWE: 'REWE Bio Grünspargel', Edeka: 'Edeka Grünspargel', Alnatura: 'Alnatura Grünspargel' } },
      { item: 'Spinach', amount: '200 g', brand: { REWE: 'REWE Bio Babyspinat', Edeka: 'Edeka Bio Spinat', Alnatura: 'Alnatura Babyspinat' } },
      { item: 'Lemon', amount: '1', brand: { REWE: 'REWE Bio Zitrone', Edeka: 'Edeka Bio Zitrone', Alnatura: 'Alnatura Bio-Zitrone' } },
      { item: 'Capers', amount: '1 tbsp', brand: { REWE: 'REWE Feine Welt Kapern', Edeka: 'Edeka Kapern', Alnatura: 'Alnatura Kapern' } },
    ],
    steps: [
      'Pat the cod dry, season with sea salt. Rest 10 minutes.',
      'Brown butter in a heavy skillet until it smells nutty. Pour off into a bowl, leaving a film.',
      'Sear cod skin-side down 4 minutes; flip 2 minutes. Rest on a warm plate.',
      'In the same pan, blister asparagus 3 minutes, then wilt spinach off the heat.',
      'Plate cod over greens. Spoon brown butter, capers, a wide squeeze of lemon.',
    ],
    notes: 'The prebiotic fiber in asparagus feeds Bifidobacterium overnight — a clean insulin-flat dinner that does gut-repair work while you sleep. Zero starch keeps overnight insulin entirely flat.',
  },
  {
    id: 'r-ovu-salmon',
    title: 'Slow-Roast Salmon, Cucumber, Fennel',
    source: 'Sallys Welt',
    author: 'Sally Özcan',
    sourceUrl: 'https://sallys-blog.de/rezepte/green-secret-sauce',
    imageUrl: 'https://source.unsplash.com/featured/800x600/?slow,roasted,salmon,fennel,cucumber',
    minutes: 30,
    servings: 2,
    protein: 34,
    carbs: 12,
    fat: 24,
    meal: 'dinner',
    phases: ['ovulatory'],
    plantCount: 5,
    tags: ['Antioxidant', 'Cooling', 'Gluten-free', 'Zero starch', 'Low-FODMAP'],
    ingredients: [
      { item: 'Wild salmon', amount: '300 g', brand: { REWE: 'REWE Bio Lachsfilet', Edeka: 'followfish Lachs', Alnatura: 'followfish Lachsfilet' } },
      { item: 'Cucumber', amount: '1', brand: { REWE: 'REWE Bio Gurke', Edeka: 'Edeka Bio Salatgurke', Alnatura: 'Alnatura Salatgurke' } },
      { item: 'Fennel bulb', amount: '1', brand: { REWE: 'REWE Bio Fenchel', Edeka: 'Edeka Bio Fenchel', Alnatura: 'Alnatura Fenchel' } },
      { item: 'Greek yogurt', amount: '4 tbsp', brand: { REWE: 'REWE Bio Joghurt Griechischer Art', Edeka: 'MEVGAL Joghurt', Alnatura: 'Andechser Natur Joghurt' } },
      { item: 'Mint', amount: '½ bunch', brand: { REWE: 'REWE Bio Minze', Edeka: 'Edeka Bio Minze', Alnatura: 'Alnatura Minze' } },
    ],
    steps: [
      'Heat oven to 140°C. Rub salmon with olive oil, salt, lemon zest. Roast 22 minutes.',
      'Shave fennel and cucumber paper-thin on a mandoline. Salt lightly; drain 5 minutes.',
      'Stir yogurt with mint, lemon juice, a pinch of cumin.',
      'Plate the slow salmon; pile shaved salad alongside; spoon yogurt across the warm fish.',
    ],
    notes: 'Fennel is the ultimate carminative — it reduces bloating and spasm by relaxing smooth intestinal muscle. Mint and cucumber are classic Pitta-cooling herbs. Omega-3s in wild salmon reduce the LH-surge inflammation.',
  },
  {
    id: 'r-breakfast-eggs',
    title: 'Soft-Folded Eggs, Avocado, Sourdough Crumb',
    source: 'Kitchen Stories',
    author: 'Xueci Cheng',
    sourceUrl: 'https://www.kitchenstories.com/en/recipes/tiktoks-viral-pesto-eggs-2-ways-en',
    imageUrl: 'https://source.unsplash.com/featured/800x600/?scrambled,eggs,avocado,sourdough,toast',
    minutes: 12,
    servings: 1,
    protein: 26,
    carbs: 18,
    fat: 28,
    meal: 'breakfast',
    phases: ['menstrual', 'follicular', 'ovulatory', 'luteal'],
    plantCount: 3,
    tags: ['Quick', 'Protein-forward', 'Glucose-blunted', 'Vegetarian'],
    ingredients: [
      { item: 'Pasture eggs', amount: '3', brand: { REWE: 'REWE Bio Eier Freiland', Edeka: 'EDEKA Bio Eier', Alnatura: 'Alnatura Bio Eier' } },
      { item: 'Avocado', amount: '½', brand: { REWE: 'REWE Bio Avocado', Edeka: 'Edeka Bio Avocado', Alnatura: 'Alnatura Avocado' } },
      { item: 'Sourdough', amount: '1 slice', brand: { REWE: 'REWE Feine Welt Sauerteig', Edeka: 'Mestemacher Sauerteigbrot', Alnatura: 'Alnatura Sauerteigbrot' } },
      { item: 'Cultured butter', amount: '15 g', brand: { REWE: 'REWE Bio Süßrahmbutter', Edeka: 'Kerrygold Butter', Alnatura: 'Alnatura Bio Butter' } },
      { item: 'Chili flakes', amount: '½ tsp', brand: { REWE: 'Just Spices Chili', Edeka: 'Ankerkraut Chili', Alnatura: 'Alnatura Chiliflocken' } },
    ],
    steps: [
      'Toast the sourdough until deep gold; tear into rough crumb.',
      'Whisk eggs with sea salt. Melt butter over low heat — really low.',
      'Pour the eggs in; pull them slowly with a silicone spatula. Take them off while still wet.',
      'Slide onto a plate, fan avocado, scatter sourdough crumb and chili.',
    ],
    notes: 'Fat and protein eaten first blunts the glucose curve of any carb that follows. The avocado provides prebiotic fiber and potassium. Sourdough fermentation pre-digests some of the gluten and phytic acid.',
  },
];

const PLAN_BY_PHASE = {
  menstrual:  { breakfast: 'r-breakfast-eggs', lunch: 'r-warming-mung-dal', dinner: 'r-dinner-cod' },
  follicular: { breakfast: 'r-breakfast-eggs', lunch: 'r-folli-bowl',       dinner: 'r-dinner-cod' },
  ovulatory:  { breakfast: 'r-breakfast-eggs', lunch: 'r-folli-bowl',       dinner: 'r-ovu-salmon' },
  luteal:     { breakfast: 'r-breakfast-eggs', lunch: 'r-roasted-squash',   dinner: 'r-dinner-cod' },
};

const recipeById = (id) => RECIPES.find((r) => r.id === id);

// Count total distinct plant foods across today's recipes
function countPlantsToday(plan) {
  const plants = new Set();
  Object.values(plan).forEach(rid => {
    const r = recipeById(rid);
    if (r) r.ingredients.filter(ing =>
      !/cod|salmon|egg|butter|ghee|kefir|yogurt/i.test(ing.item)
    ).forEach(ing => plants.add(ing.item));
  });
  return plants.size;
}

const DIETS = [
  { id: 'omnivore',      name: 'Flexible Omnivore',       desc: 'No animal protein restrictions.' },
  { id: 'flexitarian',   name: 'Flexitarian',             desc: 'Mostly plants. Occasional high-quality meat or fish.' },
  { id: 'pescatarian',   name: 'Pescatarian',             desc: 'Vegetarian foundation plus fish and seafood.' },
  { id: 'vegetarian',    name: 'Vegetarian',              desc: 'No meat, poultry, or fish. Dairy and eggs allowed.' },
  { id: 'vegan',         name: 'Vegan',                   desc: 'Strictly plant-based. No dairy, eggs, or honey.' },
  { id: 'keto',          name: 'Keto / Strict Low-Carb',  desc: 'Lower carbohydrate threshold across all meals.' },
  { id: 'mediterranean', name: 'Mediterranean',           desc: 'Olive oil, lean protein, colorful whole foods.' },
];

const ETHNICITIES = [
  { id: 'european',    label: 'European',                   note: 'Standard IR thresholds.' },
  { id: 'south-asian', label: 'South Asian',               note: 'Higher PCOS + IR prevalence — stricter carb tail at dinner.' },
  { id: 'east-asian',  label: 'East Asian',                note: 'Lower BMI threshold for IR; emphasize fermented + warming foods.' },
  { id: 'middle-east', label: 'Middle Eastern / N. African', note: 'Strong response to Mediterranean fats; watch refined carbs.' },
  { id: 'african',     label: 'African / Afro-Caribbean',  note: 'Higher gestational IR; emphasize magnesium + fiber.' },
  { id: 'latina',      label: 'Latina / Hispanic',         note: 'Genetic IR predisposition — front-load protein early.' },
  { id: 'mixed',       label: 'Mixed / Other',             note: 'Tailored to your inputs, not heritage averages.' },
  { id: 'prefer-not',  label: 'Prefer not to say',         note: 'We use the standard IR plan.' },
];

function lifeStageFor(age) {
  if (age < 20) return { id: 'teen',         label: 'Adolescent',         note: 'Hormones still establishing.' };
  if (age < 35) return { id: 'reproductive', label: 'Reproductive',       note: 'Standard 4-phase cycle syncing.' };
  if (age < 45) return { id: 'peri-early',   label: 'Early perimenopause', note: 'Cycles may shorten; insulin sensitivity drops gradually.' };
  if (age < 55) return { id: 'peri-late',    label: 'Perimenopause',      note: 'Variable cycles; magnesium + protein become critical.' };
  return              { id: 'post',           label: 'Postmenopause',      note: 'Moon-phase framework. Higher protein floor.' };
}

const CUISINES = [
  { id: 'mediterranean', name: 'Mediterranean',          hint: 'Olive oil, fish, tomatoes, herbs' },
  { id: 'middle-east',   name: 'Middle Eastern',         hint: 'Tahini, sumac, lamb, lemon' },
  { id: 'south-asian',   name: 'Indian / Ayurvedic',     hint: 'Dal, ghee, warming spices' },
  { id: 'east-asian',    name: 'East Asian',             hint: 'Miso, ginger, sesame, tofu' },
  { id: 'sea',           name: 'Southeast Asian',        hint: 'Lemongrass, fish sauce, herbs' },
  { id: 'levantine',     name: 'Levantine / Persian',    hint: 'Pomegranate, dill, yogurt' },
  { id: 'n-african',     name: 'North African',          hint: 'Harissa, preserved lemon, ras el hanout' },
  { id: 'german',        name: 'German / Central European', hint: 'Sauerkraut, rye, root vegetables' },
  { id: 'french',        name: 'French',                 hint: 'Butter, herbs de Provence, fish' },
  { id: 'mexican',       name: 'Mexican / Latin',        hint: 'Beans, lime, cilantro, mole' },
  { id: 'nordic',        name: 'Nordic',                 hint: 'Dill, salmon, rye, fermented' },
  { id: 'ethiopian',     name: 'Ethiopian',              hint: 'Berbere, teff, lentils, greens' },
];

const ALLERGENS = [
  { id: 'gluten',     name: 'Gluten / Celiac',              group: 'major' },
  { id: 'dairy',      name: 'Dairy / Milk',                 group: 'major' },
  { id: 'egg',        name: 'Egg',                          group: 'major' },
  { id: 'peanut',     name: 'Peanut',                       group: 'major' },
  { id: 'treenut',    name: 'Tree Nut',                     group: 'major' },
  { id: 'soy',        name: 'Soy',                          group: 'major' },
  { id: 'fish',       name: 'Fish & Shellfish',             group: 'major' },
  { id: 'sesame',     name: 'Sesame',                       group: 'major' },
  { id: 'lactose',    name: 'Lactose (lactose-free dairy OK)', group: 'digestive' },
  { id: 'fodmap',     name: 'Low-FODMAP',                   group: 'digestive' },
  { id: 'histamine',  name: 'Histamine',                    group: 'digestive' },
  { id: 'nightshade', name: 'Nightshade',                   group: 'digestive' },
];

const SUPERMARKETS = [
  { id: 'REWE',     name: 'REWE',           tag: 'Full-range · Bio line',       category: 'supermarket', distance: '0.4 km · Torstraße',          color: 'oklch(0.55 0.13 25)' },
  { id: 'Edeka',    name: 'Edeka',          tag: 'Full-range · regional',       category: 'supermarket', distance: '0.7 km · Linienstraße',        color: 'oklch(0.55 0.12 250)' },
  { id: 'Kaufland', name: 'Kaufland',       tag: 'Hypermarket · K-Bio',         category: 'supermarket', distance: '1.2 km · Alexanderplatz',       color: 'oklch(0.55 0.13 22)' },
  { id: 'AldiNord', name: 'ALDI Nord',      tag: 'Discount · ALDI Bio',         category: 'discount',    distance: '0.5 km · Brunnenstraße',        color: 'oklch(0.55 0.13 248)' },
  { id: 'AldiSued', name: 'ALDI Süd',       tag: 'Discount · ALDI Bio',         category: 'discount',    distance: '0.9 km · Friedrichstraße',      color: 'oklch(0.55 0.13 248)' },
  { id: 'Lidl',     name: 'Lidl',           tag: 'Discount · Bio Organic',      category: 'discount',    distance: '0.6 km · Rosenthaler Pl.',      color: 'oklch(0.58 0.13 50)' },
  { id: 'Penny',    name: 'Penny',          tag: 'Discount · Naturgut Bio',     category: 'discount',    distance: '0.8 km · Auguststraße',         color: 'oklch(0.58 0.12 30)' },
  { id: 'Netto',    name: 'Netto',          tag: 'Discount · BioBio',           category: 'discount',    distance: '1.4 km · Schönhauser',          color: 'oklch(0.55 0.13 35)' },
  { id: 'Alnatura', name: 'Alnatura',       tag: 'Bio supermarket',             category: 'organic',     distance: '1.1 km · Rosa-Luxemburg',       color: 'oklch(0.55 0.10 145)' },
  { id: 'Denns',    name: "Denn's BioMarkt", tag: 'Bio supermarket',            category: 'organic',     distance: '1.6 km · Kastanienallee',       color: 'oklch(0.50 0.10 145)' },
  { id: 'Bioco',    name: 'BIO COMPANY',    tag: 'Berlin bio chain',            category: 'organic',     distance: '0.5 km · Brunnenstraße',        color: 'oklch(0.52 0.11 140)' },
  { id: 'dm',       name: 'dm-drogerie',    tag: 'Drogerie · dmBio',            category: 'drugstore',   distance: '0.3 km · Torstraße',            color: 'oklch(0.55 0.13 75)' },
  { id: 'Rossmann', name: 'Rossmann',       tag: 'Drogerie · enerBiO',          category: 'drugstore',   distance: '0.6 km · Friedrichstraße',      color: 'oklch(0.50 0.14 22)' },
  { id: 'Mueller',  name: 'Müller',         tag: 'Drogerie · health & beauty',  category: 'drugstore',   distance: '1.5 km · Hackescher Markt',     color: 'oklch(0.55 0.13 18)' },
];

const STORE_CATEGORIES = [
  { id: 'supermarket', label: 'Supermarkets',       sub: 'Full-range, weekly shop' },
  { id: 'discount',    label: 'Discounters',        sub: 'Lower-priced staples + house-brand Bio' },
  { id: 'organic',     label: 'Organic specialists', sub: 'Whole foods, bulk bins, fresh produce' },
  { id: 'drugstore',   label: 'Drogerie',            sub: 'Seeds, oils, supplements, dry pantry' },
];

const STORE_BRAND = {
  REWE: 'REWE Bio', Edeka: 'EDEKA Bio', Kaufland: 'K-Bio',
  AldiNord: 'GUT BIO', AldiSued: 'GUT BIO', Lidl: 'Bio Organic',
  Penny: 'Naturgut Bio', Netto: 'BioBio',
  Alnatura: 'Alnatura', Denns: "Denn's", Bioco: 'BIO COMPANY',
  dm: 'dmBio', Rossmann: 'enerBiO', Mueller: 'Bio Primo',
};

const _cap = (s) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : s);

function brandFor(ing, market) {
  if (ing.brand && ing.brand[market]) return ing.brand[market];
  const prefix = STORE_BRAND[market];
  if (!prefix) return ing.item;
  return `${prefix} ${_cap(ing.item)}`;
}

function bestStoreFor(item, profileMarkets) {
  const isSeedOrSupp = /seeds|sesame|sunflower|flax|pumpkin|tahini|sumac|cumin|turmeric|chili/i.test(item);
  const isFresh      = /spinach|kale|cucumber|fennel|asparagus|cilantro|dill|mint|beet|squash|avocado|lemon|cabbage|ginger|onion|sprout/i.test(item);
  const isProtein    = /cod|salmon|egg|lentil|chickpea|mung/i.test(item);
  const cats = isSeedOrSupp ? ['drugstore', 'organic', 'supermarket']
             : isFresh      ? ['organic', 'supermarket', 'discount']
             : isProtein    ? ['supermarket', 'organic', 'discount']
                            : ['supermarket', 'organic', 'discount', 'drugstore'];
  for (const cat of cats) {
    const hit = profileMarkets.find(m => SUPERMARKETS.find(s => s.id === m)?.category === cat);
    if (hit) return hit;
  }
  return profileMarkets[0];
}

// Tag display config — color per tag family
const TAG_STYLES = {
  'Gut-healing':       { bg: 'oklch(0.91 0.05 145)', fg: 'oklch(0.32 0.08 145)', bd: 'oklch(0.78 0.07 145)' },
  'Ayurvedic-spiced':  { bg: 'oklch(0.93 0.04 55)',  fg: 'oklch(0.38 0.08 50)',  bd: 'oklch(0.78 0.08 50)' },
  'Seasonal':          { bg: 'oklch(0.93 0.04 88)',  fg: 'oklch(0.38 0.08 80)',  bd: 'oklch(0.78 0.08 88)' },
  'Probiotic':         { bg: 'oklch(0.91 0.05 145)', fg: 'oklch(0.32 0.08 145)', bd: 'oklch(0.78 0.07 145)' },
  'Estrobolome':       { bg: 'oklch(0.91 0.05 145)', fg: 'oklch(0.32 0.08 145)', bd: 'oklch(0.78 0.07 145)' },
  'Fermented':         { bg: 'oklch(0.91 0.05 145)', fg: 'oklch(0.32 0.08 145)', bd: 'oklch(0.78 0.07 145)' },
  'Zero starch':       { bg: 'oklch(0.92 0.03 230)', fg: 'oklch(0.36 0.07 230)', bd: 'oklch(0.76 0.06 230)' },
  'Dinner-safe':       { bg: 'oklch(0.92 0.03 230)', fg: 'oklch(0.36 0.07 230)', bd: 'oklch(0.76 0.06 230)' },
  'Magnesium-rich':    { bg: 'oklch(0.93 0.04 88)',  fg: 'oklch(0.38 0.08 80)',  bd: 'oklch(0.78 0.08 88)' },
  'Antioxidant':       { bg: 'oklch(0.93 0.04 88)',  fg: 'oklch(0.38 0.08 80)',  bd: 'oklch(0.78 0.08 88)' },
  'Cooling':           { bg: 'oklch(0.92 0.03 230)', fg: 'oklch(0.36 0.07 230)', bd: 'oklch(0.76 0.06 230)' },
  'Protein-forward':   { bg: 'oklch(0.93 0.035 40)', fg: 'oklch(0.40 0.08 35)',  bd: 'oklch(0.76 0.08 35)' },
  'Glucose-blunted':   { bg: 'oklch(0.93 0.035 40)', fg: 'oklch(0.40 0.08 35)',  bd: 'oklch(0.76 0.08 35)' },
  'Gluten-free':       { bg: 'oklch(0.93 0.022 90)', fg: 'oklch(0.34 0.035 140)', bd: 'oklch(0.84 0.025 95)' },
  'Vegan':             { bg: 'oklch(0.91 0.05 145)', fg: 'oklch(0.32 0.08 145)', bd: 'oklch(0.78 0.07 145)' },
  'Vegetarian':        { bg: 'oklch(0.91 0.05 145)', fg: 'oklch(0.32 0.08 145)', bd: 'oklch(0.78 0.07 145)' },
  'Low-FODMAP':        { bg: 'oklch(0.93 0.022 90)', fg: 'oklch(0.34 0.035 140)', bd: 'oklch(0.84 0.025 95)' },
  'Warming':           { bg: 'oklch(0.93 0.04 55)',  fg: 'oklch(0.38 0.08 50)',  bd: 'oklch(0.78 0.08 50)' },
  'Quick':             { bg: 'oklch(0.93 0.022 90)', fg: 'oklch(0.34 0.035 140)', bd: 'oklch(0.84 0.025 95)' },
};

const tagStyle = (tag) => TAG_STYLES[tag] || { bg: 'oklch(0.93 0.022 90)', fg: 'oklch(0.34 0.035 140)', bd: 'oklch(0.84 0.025 95)' };

// Primary display tags shown on cards (exclude noisy ones)
const CARD_TAGS = ['Gut-healing', 'Ayurvedic-spiced', 'Seasonal', 'Probiotic', 'Fermented', 'Zero starch', 'Gluten-free', 'Low-FODMAP', 'Vegan', 'Vegetarian', 'Magnesium-rich', 'Antioxidant', 'Cooling', 'Warming'];

Object.assign(window, {
  PHASES, phaseForDay,
  RECIPES, recipeById, PLAN_BY_PHASE, countPlantsToday,
  DIETS, ALLERGENS, ETHNICITIES, CUISINES, lifeStageFor,
  SUPERMARKETS, STORE_CATEGORIES, STORE_BRAND,
  brandFor, bestStoreFor,
  TAG_STYLES, tagStyle, CARD_TAGS,
});
