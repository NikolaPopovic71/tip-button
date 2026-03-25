# TipButton — Animated Coin Flip Donate Button

A React component featuring a 3D CSS coin-flip animation triggered on click. No animation libraries, no canvas — pure CSS custom properties driven by a `requestAnimationFrame` physics loop.

Live demo: [ponitech-tip-button.netlify.app](https://ponitech-tip-button.netlify.app/) <!-- update after deploy -->

---

## Features

- **3D coin physics** — sin/cos wave functions simulate realistic coin rotation
- **3 coin variants** — copper ($1), silver ($5), gold ($10+) — selected automatically by tip amount
- **Multi-coin mode** — 1, 2, or 3 coins fly simultaneously with staggered timing
- **Amount pills** — pre-set tip amounts, fully configurable
- **Custom thank-you message** — replace the hardcoded string with any prop
- **`onTip` callback** — hook into Stripe, Lemon Squeezy, or any payment flow
- **Zero dependencies** — only React 18
- **Accessible** — `aria-label`, `aria-pressed`, `aria-live`, `disabled` during animation

---

## Quick start

```bash
git clone https://github.com/NikolaPopovic71/tip-button.git
cd tip-button
npm install
npm run dev
```

---

## Usage

```jsx
import TipButton from "./components/TipButton";

<TipButton
  amounts={[1, 5, 10]}
  currency="$"
  thankYouMessage="✦ Thank you! ✦"
  coinCount={2}
  onTip={(amount) => console.log("Tipped:", amount)}
/>
```

### Props

| Prop               | Type                  | Default              | Description                                      |
|--------------------|-----------------------|----------------------|--------------------------------------------------|
| `amounts`          | `number[]`            | `[1, 5, 10]`         | Tip amount options shown as pills                |
| `currency`         | `string`              | `"$"`                | Currency symbol prepended to amounts             |
| `label`            | `string`              | `"Tip $<selected>"` | Override the button label                        |
| `thankYouMessage`  | `string`              | `"✦ Thank you! ✦"`  | Message shown after the coin lands               |
| `coinCount`        | `1 \| 2 \| 3`        | `1`                  | Number of coins that fly on click                |
| `onTip`            | `(amount) => void`    | —                    | Callback fired when animation completes          |

### Coin variants (automatic)

| Amount  | Variant | Button color |
|---------|---------|--------------|
| ≤ $1    | Copper  | Brown        |
| ≤ $5    | Silver  | Blue-grey    |
| > $5    | Gold    | Gold         |

---

## Connecting a payment provider

Inside `App.jsx`, replace the `console.log` in `handleTip` with your provider's logic:

```js
// Lemon Squeezy
const handleTip = (amount) => {
  window.open(`https://your-store.lemonsqueezy.com/checkout?amount=${amount}`, "_blank");
};

// Stripe Payment Link
const handleTip = (amount) => {
  const links = { 1: "https://buy.stripe.com/xxx", 5: "https://buy.stripe.com/yyy" };
  window.open(links[amount], "_blank");
};
```

---

## Deploy to Netlify

### Option A — Netlify UI (recommended for first deploy)

1. Push this repo to GitHub
2. Go to [app.netlify.com](https://app.netlify.com) → **Add new site** → **Import an existing project**
3. Connect GitHub and select this repo
4. Netlify auto-detects `netlify.toml` — build command and publish dir are pre-filled
5. Click **Deploy site**

Every subsequent `git push` to `main` triggers an automatic redeploy.

### Option B — Netlify CLI

```bash
npm install -g netlify-cli
netlify login
netlify init      # link to existing site or create new
npm run build
netlify deploy --prod
```

---

## Project structure

```
tip-button/
├── public/
│   └── favicon.svg
├── src/
│   ├── components/
│   │   └── TipButton.jsx   ← the component (self-contained)
│   ├── App.jsx             ← demo wrapper
│   ├── main.jsx            ← React entry point
│   └── index.css           ← minimal reset + body centering
├── index.html
├── vite.config.js
├── package.json
├── netlify.toml
└── .gitignore
```

---

## Tech stack

- React 18
- Vite 5
- Pure CSS (no Tailwind, no styled-components)
- No animation libraries

---

## Credits

Original CSS coin concept from CodePen (author unknown). Rebuilt from scratch as a configurable, accessible React component with extended features.

---

## License

MIT — free to use in personal and commercial projects.
