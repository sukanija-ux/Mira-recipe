# Mira — Hormonal & IR Meal Planner

> A beautifully designed, science-backed meal planner built around your cycle, insulin resistance protocol, and gut health.

**[→ Open the app](https://sukanija-ux.github.io/Mira-recipe/)**

---

## What is Mira?

Mira is a personal nutrition tool for women who want to eat in sync with their hormonal cycle. It combines cycle-phase eating, insulin resistance (IR) principles, Ayurvedic food wisdom, and gut microbiome science into a single daily dashboard.

No calorie counting. No restriction. Just the right foods at the right time.

---

## Features

### 🌙 Cycle-phase meal planning
Recipes and daily plans shift automatically based on your cycle day — menstrual, follicular, ovulatory, and luteal phases each have tailored nutrition targets, gut focus notes, and Ayurvedic guidance.

### 🥗 68 global recipes across 14 cuisines
A curated library spanning Mediterranean, Japanese, Korean, Ethiopian, Vietnamese, Lebanese, Turkish, Peruvian, Nigerian, Sri Lankan, Greek, Brazilian, Moroccan, and more — all sourced from real recipe websites with attribution.

### 💊 Insulin resistance protocol
Every meal is designed around IR principles: protein-first eating, 4–6 hour meal gaps, MMC gut-clearing windows, seed cycling, and blood sugar management built into the recipe selection.

### 🌿 Health condition tailoring
Select any conditions that apply — PCOS, insulin resistance, anemia, hypothyroidism, endometriosis, perimenopause, hormonal anxiety, or digestive sensitivity — and the recipe browser filters to your needs automatically.

### 🏃 Daily movement recommendations
Each phase comes with exercise guidance matched to your hormonal state: intensity, duration, best activities, and what to ease off.

### 🌱 30-plants-a-week tracker
Tracks plant diversity across today's meals and shows weekly progress toward the gut-health goal of 30 distinct plants per week.

### 🗓 Cycle calendar
Visual cycle wheel showing your current phase, phase characteristics, gut focus, Ayurvedic lens, seed cycling, and movement for every day of your cycle.

### 👤 Full profile customisation
- Dietary framework (omnivore, pescatarian, vegetarian, vegan, etc.)
- Cuisine preferences
- Allergies and exclusions
- Health conditions
- Life stage (reproductive, pregnant, postpartum, perimenopause)
- Local supermarkets (German store network pre-loaded)

---

## Recipe library highlights

| Cuisine | Example recipes |
|---|---|
| 🇯🇵 Japanese | Miso Salmon, Soba Noodle Bowl |
| 🇰🇷 Korean | Doenjang Jjigae, Japchae |
| 🇪🇹 Ethiopian | Misir Wat |
| 🇲🇦 Moroccan | Harira, Spiced Lentil Soup |
| 🇱🇧 Lebanese | Lentil Tabbouleh, Fatteh |
| 🇵🇪 Peruvian | Ají de Gallina, Sopa de Quinoa |
| 🇳🇬 Nigerian | Egusi Soup |
| 🇱🇰 Sri Lankan | Parippu Dhal, Fish Curry |
| 🇬🇷 Greek | Spanakopita, Chickpea Patties |
| 🇧🇷 Brazilian | Feijoada, Galinhada |
| 🇻🇳 Vietnamese | Pho Ga |
| 🇹🇷 Turkish | Mercimek Çorbası, Kisir |
| 🇲🇽 Mexican | Chicken Burrito Bowl |
| 🫐 Mediterranean | 15+ recipes |

---

## Tech stack

| Layer | Choice |
|---|---|
| UI | React 18 (UMD, no build step) |
| Styling | Inline styles with OKLCH colour space |
| Fonts | Instrument Serif · DM Sans · JetBrains Mono |
| Hosting | GitHub Pages |
| Build | None — Babel standalone in-browser transpilation |

No backend. No database. No authentication. Everything runs in the browser and state persists in `localStorage`.

---

## Local development

```bash
git clone https://github.com/sukanija-ux/Mira-recipe.git
cd Mira-recipe

# Serve with any static server, e.g.:
npx serve .
# or
python3 -m http.server 3456
```

Then open `http://localhost:3456`.

No npm install required.

---

## Project structure

```
Mira-recipe/
├── index.html          # Entry point — loads all scripts
└── src/
    ├── data.jsx        # All recipe data, phases, PLANS, health conditions
    ├── components.jsx  # Shared UI: HormoneRing, Badge, Button, TopNav…
    ├── dashboard.jsx   # Today screen — plan, stats, movement card
    ├── recipes.jsx     # Recipe browse + detail views
    ├── screens.jsx     # Cycle calendar + Profile
    ├── onboarding.jsx  # 6-step first-run flow
    ├── tweaks-panel.jsx# Dev panel for rapid cycle-day testing
    └── app.jsx         # Root — routing and profile state
```

---

## Science behind the design

- **Estrobolome** — the gut microbiome's role in estrogen metabolism and detoxification
- **Seed cycling** — flax + pumpkin (days 1–13) and sesame + sunflower (days 14–28) to support estrogen and progesterone
- **MMC window** — the migrating motor complex activates after 4–6 hours without food, clearing the gut
- **30 plants/week** — diversity metric from the American Gut Project linked to microbiome richness
- **IR protocol** — protein-first eating, low-GI carbs timed to follicular/ovulatory phases, no snacking

---

## Contributing

This is a personal project shared for testing and feedback. If you'd like to suggest a recipe, report a bug, or improve the science notes — open an issue or PR.

---

*Not medical advice. Always consult a healthcare professional for personalised guidance.*
