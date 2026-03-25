import { useRef, useCallback, useState, useEffect } from "react";

const STYLES = `
@import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=Playfair+Display:ital,wght@1,700;1,900&display=swap');

.tip-root *, .tip-root *::before, .tip-root *::after { box-sizing: border-box; }

.tip-root {
  --surface: #16161f;
  --border:  #2a2a3a;
  --accent:  #e8c84a;
  --text:    #f0ede8;
  --text-dim:#9896a8;
  --radius:  8px;
  font-family: 'DM Mono', monospace;
  user-select: none;
}

/* ── CURRENCY ROW ── */
.tip-currency-row {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 20px;
  justify-content: center;
}
.tip-currency-label {
  font-family: 'DM Mono', monospace;
  font-size: 10px;
  font-weight: 500;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--text-dim);
  margin-right: 4px;
  transition: opacity 300ms;
}
.tip-root[data-busy="true"] .tip-currency-label { opacity: 0.18; }

.tip-currency-btn {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 6px;
  color: var(--text-dim);
  cursor: pointer;
  font-family: 'DM Mono', monospace;
  font-size: 14px;
  font-weight: 500;
  width: 40px;
  height: 34px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: border-color 150ms, color 150ms, transform 100ms, opacity 300ms;
  padding: 0;
}
.tip-currency-btn:hover:not(:disabled) { border-color: var(--text-dim); color: var(--text); }
.tip-currency-btn.active               { border-color: var(--text); color: var(--text); box-shadow: 0 0 0 1px var(--text); }
.tip-currency-btn:active:not(:disabled){ transform: scale(0.92); }
.tip-currency-btn:disabled             { opacity: 0.18; cursor: default; }

/* ── AMOUNT CARDS ── */
.tip-amounts {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
  justify-content: center;
}
.tip-amount-card {
  background: var(--surface);
  border: 1.5px solid var(--border);
  border-radius: var(--radius);
  color: var(--text-dim);
  cursor: pointer;
  font-family: 'DM Mono', monospace;
  font-weight: 500;
  width: 68px;
  height: 56px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1px;
  transition: border-color 180ms, color 180ms, background 180ms, transform 120ms, box-shadow 200ms, opacity 300ms;
  padding: 0;
  position: relative;
}
.tip-amount-card__sym { font-size: 13px; line-height: 1; opacity: 0.55; }
.tip-amount-card__val { font-size: 20px; font-weight: 500; line-height: 1; letter-spacing: -0.02em; }
.tip-amount-card__dot { position: absolute; bottom: 3px; width: 4px; height: 4px; border-radius: 50%; background: currentColor; opacity: 0.4; }
.tip-amount-card:hover:not(:disabled) {
  border-color: var(--hover-color, var(--accent));
  color: var(--hover-color, var(--accent));
  background: rgba(255,255,255,0.06);
}
.tip-amount-card.selected {
  border-color: var(--sel-color);
  border-width: 2px;
  color: #0a0a0f;
  background: var(--sel-color);
  box-shadow: 0 0 20px -4px var(--sel-color);
}
.tip-amount-card.selected .tip-amount-card__sym { opacity: 0.65; }
.tip-amount-card.selected .tip-amount-card__dot { opacity: 0.7; }
.tip-amount-card:active:not(:disabled) { transform: scale(0.93); }
.tip-amount-card:disabled              { opacity: 0.22; cursor: default; }

/* ── BUTTON ── */
.tip-button-wrap {
  position: relative;
  display: inline-flex;
  flex-direction: column;
  align-items: center;
}
.tip-btn {
  background: none;
  border: none;
  cursor: pointer;
  font-family: 'DM Mono', monospace;
  font-size: 20px;
  font-weight: 500;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  height: 52px;
  width: 200px;
  position: relative;
  transform-origin: 50% 100%;
  transition: transform 60ms ease-in-out;
  -webkit-tap-highlight-color: transparent;
  outline: none;
  margin-bottom: -60px;
}
.tip-btn:active:not(:disabled)  { transform: rotate(3deg); }
.tip-btn.clicked                 { animation: tbShake 160ms ease-in-out 1; pointer-events: none; }
.tip-btn.clicked .tip-btn__text  { opacity: 0; transition: opacity 80ms linear 180ms; }
.tip-btn.clicked .tip-btn__bar   { height: 6px; width: 50%; transition: height 220ms ease-in-out 380ms, width 220ms ease-in-out 280ms; }
.tip-btn.shrink  .tip-btn__bar   { width: 0; transition: width 300ms ease-in; }

.tip-btn__bar {
  position: absolute;
  bottom: 0; left: 50%;
  transform: translateX(-50%);
  width: 100%; height: 100%;
  background: var(--bar-color, var(--accent));
  border-radius: var(--radius);
  transition: height 220ms ease-in-out 380ms, width 220ms ease-in-out 280ms;
  z-index: 2;
}
.tip-btn__text {
  position: relative;
  color: #0a0a0f;
  z-index: 3;
  opacity: 1;
  transition: opacity 80ms linear 480ms;
  white-space: nowrap;
}

/* ── THANK YOU ── */
.tip-thanks-block {
  margin-top: 74px;
  height: 52px;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
}
.tip-thanks-inner {
  font-family: 'Playfair Display', Georgia, serif;
  font-size: 26px;
  font-weight: 900;
  font-style: italic;
  letter-spacing: 0.02em;
  color: var(--thanks-color, var(--accent));
  opacity: 0;
  transform: translateY(12px) scale(0.88);
  transition: opacity 400ms cubic-bezier(0.22,1,0.36,1), transform 400ms cubic-bezier(0.22,1,0.36,1);
  text-shadow: 0 0 40px var(--thanks-glow, rgba(232,200,74,0.5));
  white-space: nowrap;
}
.tip-thanks-inner.visible { opacity: 1; transform: translateY(0) scale(1); }

/* ── COIN ── */
.tip-coin-wrap {
  position: absolute;
  bottom: -52px; left: 0;
  width: 100%;
  height: 300px;
  overflow: hidden;
  pointer-events: none;
}
.tip-coin {
  --front-y:0; --back-y:0; --mid-y:0;
  --coin-y:0; --coin-x:0; --coin-sc:0;
  --coin-rot:0; --shine-op:0.4; --shine-bg:50%;
  position: absolute;
  bottom: calc(var(--coin-y) * 1rem - var(--csize));
  right:  calc(var(--coin-x) * 34% + 16%);
  width:  var(--csize);
  height: var(--csize);
  transform: translateX(50%) scale(calc(0.4 + var(--coin-sc))) rotate(calc(var(--coin-rot) * -1deg));
  transition: opacity 200ms linear;
  z-index: 3;
}
.tip-coin__face, .tip-coin__mid, .tip-coin__back,
.tip-coin__shine, .tip-coin__edge,
.tip-coin__shadow-front, .tip-coin__shadow-back {
  border-radius: 50%;
  position: absolute;
  top: 0; left: 0;
  width: 100%; height: 100%;
}

/* GOLD */
.tip-coin.gold .tip-coin__face {
  background:
    radial-gradient(circle at 50% 50%, transparent 50%, rgba(140,110,30,.35) 54%, #c9a84c 54%),
    linear-gradient(210deg, #e8c84a 32%, transparent 32%),
    linear-gradient(150deg, #e8c84a 32%, transparent 32%),
    linear-gradient(to right, #e8c84a 22%, transparent 22%, transparent 78%, #e8c84a 78%),
    linear-gradient(to bottom, #faf0c0 44%, transparent 44%, transparent 65%, #faf0c0 65%, #faf0c0 71%, #c9a84c 71%),
    linear-gradient(to right, transparent 28%, #faf0c0 28%, #faf0c0 34%, #c9a84c 34%, #c9a84c 40%, #faf0c0 40%, #faf0c0 47%, #c9a84c 47%, #c9a84c 53%, #faf0c0 53%, #faf0c0 60%, #c9a84c 60%, #c9a84c 66%, #faf0c0 66%, #faf0c0 72%, transparent 72%);
  background-color: #d4a832;
  transform: translateY(calc(var(--front-y) * var(--thick) / 2)) scaleY(var(--front-sc));
}
.tip-coin.gold .tip-coin__mid {
  background: #b8922a;
  transform: translateY(calc(var(--mid-y) * var(--thick) / 2)) scaleY(var(--mid-sc));
}
.tip-coin.gold .tip-coin__back {
  background:
    radial-gradient(circle at 50% 50%, transparent 50%, rgba(140,110,30,.35) 54%, #c9a84c 54%),
    radial-gradient(circle at 50% 40%, #faf0c0 23%, transparent 23%),
    radial-gradient(circle at 50% 100%, #faf0c0 35%, transparent 35%);
  background-color: #d4a832;
  transform: translateY(calc(var(--back-y) * var(--thick) / 2)) scaleY(var(--back-sc));
}
.tip-coin.gold .tip-coin__edge { background: #b8922a; height: var(--thick); top: 50%; transform: translateY(-50%); border-radius: 0; z-index: 2; }

/* SILVER */
.tip-coin.silver .tip-coin__face {
  background:
    radial-gradient(circle at 50% 50%, transparent 50%, rgba(115,124,153,.35) 54%, #c2cadf 54%),
    linear-gradient(210deg, #8590b3 32%, transparent 32%),
    linear-gradient(150deg, #8590b3 32%, transparent 32%),
    linear-gradient(to right, #8590b3 22%, transparent 22%, transparent 78%, #8590b3 78%),
    linear-gradient(to bottom, #fcfaf9 44%, transparent 44%, transparent 65%, #fcfaf9 65%, #fcfaf9 71%, #8590b3 71%),
    linear-gradient(to right, transparent 28%, #fcfaf9 28%, #fcfaf9 34%, #8590b3 34%, #8590b3 40%, #fcfaf9 40%, #fcfaf9 47%, #8590b3 47%, #8590b3 53%, #fcfaf9 53%, #fcfaf9 60%, #8590b3 60%, #8590b3 66%, #fcfaf9 66%, #fcfaf9 72%, transparent 72%);
  background-color: #8590b3;
  transform: translateY(calc(var(--front-y) * var(--thick) / 2)) scaleY(var(--front-sc));
}
.tip-coin.silver .tip-coin__mid {
  background: #737c99;
  transform: translateY(calc(var(--mid-y) * var(--thick) / 2)) scaleY(var(--mid-sc));
}
.tip-coin.silver .tip-coin__back {
  background:
    radial-gradient(circle at 50% 50%, transparent 50%, rgba(115,124,153,.35) 54%, #c2cadf 54%),
    radial-gradient(circle at 50% 40%, #fcfaf9 23%, transparent 23%),
    radial-gradient(circle at 50% 100%, #fcfaf9 35%, transparent 35%);
  background-color: #8590b3;
  transform: translateY(calc(var(--back-y) * var(--thick) / 2)) scaleY(var(--back-sc));
}
.tip-coin.silver .tip-coin__edge { background: #737c99; height: var(--thick); top: 50%; transform: translateY(-50%); border-radius: 0; z-index: 2; }

/* COPPER */
.tip-coin.copper .tip-coin__face {
  background:
    radial-gradient(circle at 50% 50%, transparent 50%, rgba(140,80,30,.35) 54%, #c87941 54%),
    linear-gradient(210deg, #a0522d 32%, transparent 32%),
    linear-gradient(150deg, #a0522d 32%, transparent 32%),
    linear-gradient(to right, #a0522d 22%, transparent 22%, transparent 78%, #a0522d 78%),
    linear-gradient(to bottom, #e8a87c 44%, transparent 44%, transparent 65%, #e8a87c 65%, #e8a87c 71%, #a0522d 71%),
    linear-gradient(to right, transparent 28%, #e8a87c 28%, #e8a87c 34%, #a0522d 34%, #a0522d 40%, #e8a87c 40%, #e8a87c 47%, #a0522d 47%, #a0522d 53%, #e8a87c 53%, #e8a87c 60%, #a0522d 60%, #a0522d 66%, #e8a87c 66%, #e8a87c 72%, transparent 72%);
  background-color: #b5632a;
  transform: translateY(calc(var(--front-y) * var(--thick) / 2)) scaleY(var(--front-sc));
}
.tip-coin.copper .tip-coin__mid {
  background: #8b4513;
  transform: translateY(calc(var(--mid-y) * var(--thick) / 2)) scaleY(var(--mid-sc));
}
.tip-coin.copper .tip-coin__back {
  background:
    radial-gradient(circle at 50% 50%, transparent 50%, rgba(140,80,30,.35) 54%, #c87941 54%),
    radial-gradient(circle at 50% 40%, #e8a87c 23%, transparent 23%),
    radial-gradient(circle at 50% 100%, #e8a87c 35%, transparent 35%);
  background-color: #b5632a;
  transform: translateY(calc(var(--back-y) * var(--thick) / 2)) scaleY(var(--back-sc));
}
.tip-coin.copper .tip-coin__edge { background: #8b4513; height: var(--thick); top: 50%; transform: translateY(-50%); border-radius: 0; z-index: 2; }

/* shared coin layers */
.tip-coin__shadow-front {
  background: rgba(0,0,0,0.22); opacity: var(--front-y);
  transform: translateY(calc(var(--front-y) * var(--thick) / 2)) scaleY(var(--front-sc)); z-index: 4;
}
.tip-coin__shadow-back {
  background: rgba(0,0,0,0.22); opacity: var(--back-y);
  transform: translateY(calc(var(--back-y) * var(--thick) / 2)) scaleY(var(--back-sc)); z-index: 4;
}
.tip-coin__shine {
  background:
    radial-gradient(circle at 25% 65%, transparent 50%, rgba(255,255,255,0.9) 90%),
    linear-gradient(55deg, transparent calc(var(--shine-bg) + 0%), #fffde0 calc(var(--shine-bg) + 0%), transparent calc(var(--shine-bg) + 50%));
  opacity: var(--shine-op);
  transform: translateY(calc(var(--mid-y) * var(--thick) / -2)) scaleY(var(--mid-sc)) rotate(calc(var(--coin-rot) * 1deg));
  z-index: 10;
}

@keyframes sp-move {
  0%   { transform: translate(calc(-50% + 0px), 0px) scale(1); opacity: 1; }
  100% { transform: translate(calc(-50% + var(--dx)), calc(var(--dy) * -1)) scale(0); opacity: 0; }
}
@keyframes tbShake {
  0%   { transform: rotate(3deg);  }
  60%  { transform: rotate(-3deg); }
  100% { transform: rotate(0deg);  }
}
`;

// ─── Currencies ───────────────────────────────────────────────────────────────
const CURRENCIES = [
  { symbol: "$", code: "USD", glow: "rgba(232,200,74,0.45)",  sparkle: ["#e8c84a","#fff8d0","#ffd700"] },
  { symbol: "€", code: "EUR", glow: "rgba(140,180,255,0.40)", sparkle: ["#8cb4ff","#c8dcff","#ffffff"] },
  { symbol: "£", code: "GBP", glow: "rgba(160,255,140,0.38)", sparkle: ["#7ddc6e","#c8ffb8","#ffffff"] },
  { symbol: "¥", code: "JPY", glow: "rgba(255,160,160,0.38)", sparkle: ["#ff8080","#ffcccc","#ffffff"] },
  { symbol: "₿", code: "BTC", glow: "rgba(255,165,80,0.45)",  sparkle: ["#f7931a","#ffc87a","#fff0d0"] },
];

// ─── Tier by amount ───────────────────────────────────────────────────────────
function getTier(amount) {
  if (amount <= 1) return { variant:"copper", size:"3rem",   thick:"0.286rem", barColor:"#b5632a", selColor:"#b5632a", hoverColor:"#c87941", thanksColor:"#e8a87c" };
  if (amount <= 5) return { variant:"silver", size:"3.5rem", thick:"0.318rem", barColor:"#8590b3", selColor:"#8590b3", hoverColor:"#aab2cc", thanksColor:"#c2cadf" };
  return             { variant:"gold",   size:"4rem",   thick:"0.364rem", barColor:"#d4a832", selColor:"#d4a832", hoverColor:"#e8c84a", thanksColor:"#e8c84a" };
}

// ─── Sparkle burst ────────────────────────────────────────────────────────────
function spawnSparkles(wrapEl, colors) {
  const count = 22;
  for (let i = 0; i < count; i++) {
    const dot   = document.createElement("div");
    const angle = (i / count) * 360 + Math.random() * 16;
    const dist  = 28 + Math.random() * 40;
    const size  = 2 + Math.random() * 5;
    const dur   = 380 + Math.random() * 340;
    const color = colors[Math.floor(Math.random() * colors.length)];
    const dx    = Math.cos(angle * Math.PI / 180) * dist;
    const dy    = Math.sin(angle * Math.PI / 180) * dist * 0.5;
    dot.style.cssText = `
      position:absolute; border-radius:50%;
      width:${size}px; height:${size}px;
      background:${color};
      bottom:10px; left:50%;
      transform:translate(-50%,0);
      pointer-events:none; z-index:20;
      animation: sp-move ${dur}ms ease-out forwards;
      --dx:${dx}px; --dy:${dy}px;
    `;
    wrapEl.appendChild(dot);
    setTimeout(() => dot.remove(), dur + 60);
  }
}

// ─── Coin sound (harmonics = bell-like) ──────────────────────────────────────
function playCoinSound(ctx, pitch = 1) {
  if (!ctx || ctx.state !== "running") return;
  const t = ctx.currentTime;

  const partials = [
    { freq: 440,  gain: 0.5,  decay: 1.8  },
    { freq: 880,  gain: 0.25, decay: 1.2  },
    { freq: 1320, gain: 0.15, decay: 0.8  },
    { freq: 2200, gain: 0.08, decay: 0.4  },
    { freq: 3300, gain: 0.04, decay: 0.25 },
  ];

  partials.forEach(({ freq, gain, decay }) => {
    const osc = ctx.createOscillator();
    const env = ctx.createGain();
    osc.connect(env);
    env.connect(ctx.destination);

    osc.type = "sine";
    osc.frequency.setValueAtTime(freq * pitch, t);

    env.gain.setValueAtTime(0, t);
    env.gain.linearRampToValueAtTime(gain, t + 0.005);
    env.gain.exponentialRampToValueAtTime(0.001, t + decay);

    osc.start(t);
    osc.stop(t + decay + 0.05);
  });
}

// ─── Animation hook ───────────────────────────────────────────────────────────
function useCoinAnimation(coinRefs, count) {
  const rafs = useRef([]);

  const launch = useCallback((onShrink, onLanded, wrapEl, sparkleColors, audioCtx) => {
    rafs.current.forEach(cancelAnimationFrame);
    rafs.current = [];

    const delays = count === 1 ? [0] : count === 2 ? [0, 180] : [0, 150, 300];

    delays.forEach((delay, idx) => {
      const run = () => {
        const coin = coinRefs[idx]?.current;
        if (!coin) return;

        const maxCount = 90 + idx * 4;
        const maxFlip  = (Math.floor(Math.random() * 4) + 3) * Math.PI;
        const sideRot  = Math.floor(Math.random() * 5) * 90;
        const xDir     = idx === 0 ? 1 : idx === 1 ? 0.7 : 1.3;
        let n = 0;

        const loop = () => {
          n++;
          const t     = n / maxCount;
          const angle = -maxFlip * Math.pow(t - 1, 2) + maxFlip;

          coin.style.setProperty("--coin-y",   String(-14 * Math.pow(t * 2 - 1, 4) + 14));
          coin.style.setProperty("--coin-x",   String(t * xDir));
          coin.style.setProperty("--coin-sc",  String(t * 0.6));
          coin.style.setProperty("--coin-rot", String(t * sideRot));
          coin.style.setProperty("--front-sc", String(Math.max(Math.cos(angle), 0)));
          coin.style.setProperty("--front-y",  String(Math.sin(angle)));
          coin.style.setProperty("--mid-sc",   String(Math.abs(Math.cos(angle))));
          coin.style.setProperty("--mid-y",    String(Math.cos((angle + Math.PI / 2) % Math.PI)));
          coin.style.setProperty("--back-sc",  String(Math.max(Math.cos(angle - Math.PI), 0)));
          coin.style.setProperty("--back-y",   String(Math.sin(angle - Math.PI)));
          coin.style.setProperty("--shine-op", String(4 * Math.sin((angle + Math.PI / 2) % Math.PI) - 3.2));
          coin.style.setProperty("--shine-bg", (-40 * (Math.cos((angle + Math.PI / 2) % Math.PI) - 0.5)) + "%");

          if (n < maxCount) {
            if (n === maxCount - 22 && idx === 0) onShrink();
            rafs.current[idx] = requestAnimationFrame(loop);
          } else {
            if (wrapEl) spawnSparkles(wrapEl, sparkleColors);
            playCoinSound(audioCtx, 0.9 + idx * 0.12);
            setTimeout(() => { coin.style.opacity = "0"; }, 260);
            if (idx === delays.length - 1) setTimeout(onLanded, 300);
          }
        };

        rafs.current[idx] = requestAnimationFrame(loop);
      };

      if (delay === 0) run(); else setTimeout(run, delay);
    });
  }, [coinRefs, count]);

  const reset = useCallback(() => {
    rafs.current.forEach(cancelAnimationFrame);
    coinRefs.forEach(r => {
      if (!r?.current) return;
      ["--coin-y","--coin-x","--coin-sc","--coin-rot",
       "--front-sc","--front-y","--mid-sc","--mid-y",
       "--back-sc","--back-y","--shine-op","--shine-bg"
      ].forEach(p => r.current.style.removeProperty(p));
      r.current.style.opacity = "1";
    });
  }, [coinRefs]);

  return { launch, reset };
}

// ─── Coin element ─────────────────────────────────────────────────────────────
const CoinEl = ({ coinRef, variant, size, thick }) => (
  <div className={`tip-coin ${variant}`} ref={coinRef} style={{ "--csize": size, "--thick": thick }}>
    <div className="tip-coin__mid" />
    <div className="tip-coin__back" />
    <div className="tip-coin__face" />
    <div className="tip-coin__shadow-front" />
    <div className="tip-coin__shadow-back" />
    <div className="tip-coin__shine" />
    <div className="tip-coin__edge" />
  </div>
);

// ─── Main component ───────────────────────────────────────────────────────────
/**
 * TipButton
 *
 * Props:
 *   amounts          number[]             e.g. [1, 5, 10]
 *   currencies       string[]             symbols npr. ["$","€","£"]
 *   defaultCurrency  string               e.g. "$"
 *   label            string               override button's text
 *   thankYouMessage  string               a message after animation
 *   onTip            (amount, currency) => void
 *   coinCount        1 | 2 | 3
 */
export default function TipButton({
  amounts         = [1, 5, 10],
  currencies,
  defaultCurrency = "$",
  label,
  thankYouMessage = "Thank you!",
  onTip,
  coinCount       = 1,
}) {
  const audioCtxRef = useRef(null);

  useEffect(() => {
    // Inject CSS once
    const id = "tip-button-styles-v5";
    if (!document.getElementById(id)) {
      const s = document.createElement("style");
      s.id = id; s.textContent = STYLES;
      document.head.appendChild(s);
    }

    // Create and "wake up" AudioContext with the first pointerdown —
    // browser requests user gesture before allowing audio
    const prime = () => {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
      }
      if (audioCtxRef.current.state === "suspended") {
        audioCtxRef.current.resume();
      }
      document.removeEventListener("pointerdown", prime);
    };
    document.addEventListener("pointerdown", prime);
    return () => document.removeEventListener("pointerdown", prime);
  }, []);

  const available = currencies
    ? CURRENCIES.filter(c => currencies.includes(c.symbol))
    : CURRENCIES;

  const [currency, setCurrency] = useState(
    available.find(c => c.symbol === defaultCurrency) ?? available[0]
  );
  const [selected, setSelected] = useState(amounts[Math.floor(amounts.length / 2)]);
  const [phase,    setPhase]    = useState("idle");
  const [thanks,   setThanks]   = useState(false);

  const r1      = useRef(null), r2 = useRef(null), r3 = useRef(null);
  const wrapRef = useRef(null);
  const refs    = [r1, r2, r3].slice(0, coinCount);
  const tier    = getTier(selected);
  const btnLabel = label ?? `Tip ${currency.symbol}${selected}`;

  const { launch, reset } = useCoinAnimation(refs, coinCount);

  const handleClick = useCallback(() => {
    if (phase !== "idle") return;
    setPhase("clicked");
    setThanks(false);

    setTimeout(() => {
      launch(
        () => setPhase("shrink"),
        () => {
          setPhase("landed");
          setThanks(true);
          onTip?.(selected, currency.symbol);
          setTimeout(() => {
            setThanks(false);
            setTimeout(() => { setPhase("idle"); reset(); }, 500);
          }, 2400);
        },
        wrapRef.current,
        currency.sparkle,
        audioCtxRef.current
      );
    }, 50);
  }, [phase, launch, reset, onTip, selected, currency]);

  const phaseClass = phase === "idle" ? "" : phase === "shrink" ? "clicked shrink" : phase;
  const busy       = phase !== "idle" || thanks;

  return (
    <div
      className="tip-root"
      data-busy={busy ? "true" : undefined}
      style={{ display:"inline-flex", flexDirection:"column", alignItems:"center" }}
    >

      {/* Currency row */}
      <div className="tip-currency-row" role="group" aria-label="Select currency">
        <span className="tip-currency-label">Currency</span>
        {available.map(c => (
          <button
            key={c.code}
            className={`tip-currency-btn${currency.code === c.code ? " active" : ""}`}
            onClick={() => !busy && setCurrency(c)}
            disabled={busy}
            aria-pressed={currency.code === c.code}
            title={c.code}
          >
            {c.symbol}
          </button>
        ))}
      </div>

      {/* Amount cards */}
      <div className="tip-amounts" role="group" aria-label="Select tip amount">
        {amounts.map(a => {
          const t = getTier(a);
          return (
            <button
              key={a}
              className={`tip-amount-card${selected === a ? " selected" : ""}`}
              style={{ "--sel-color": t.selColor, "--hover-color": t.hoverColor }}
              onClick={() => !busy && setSelected(a)}
              aria-pressed={selected === a}
              disabled={busy}
            >
              <span className="tip-amount-card__sym">{currency.symbol}</span>
              <span className="tip-amount-card__val">{a}</span>
              <span className="tip-amount-card__dot" />
            </button>
          );
        })}
      </div>

      {/* Button + coin animation */}
      <div className="tip-button-wrap">
        <button
          className={`tip-btn ${phaseClass}`}
          onClick={handleClick}
          disabled={busy}
          style={{ visibility: thanks ? "hidden" : "visible" }}
          aria-label={btnLabel}
        >
          <div className="tip-btn__bar" style={{ "--bar-color": tier.barColor }} />
          <span className="tip-btn__text">{btnLabel}</span>
        </button>

        <div ref={wrapRef} className={`tip-coin-wrap${phase === "landed" ? " landed" : ""}`}>
          {refs.map((ref, i) => (
            <CoinEl key={i} coinRef={ref} variant={tier.variant} size={tier.size} thick={tier.thick} />
          ))}
        </div>
      </div>

      {/* Thank you */}
      <div className="tip-thanks-block" aria-live="polite">
        <span
          className={`tip-thanks-inner${thanks ? " visible" : ""}`}
          style={{ "--thanks-color": tier.thanksColor, "--thanks-glow": currency.glow }}
          aria-hidden={!thanks}
        >
          {thankYouMessage}
        </span>
      </div>

    </div>
  );
}

// ─── Example of use ──────────────────────────────────────────────────────────
// <TipButton
//   amounts={[1, 5, 10]}
//   currencies={["$", "€", "£"]}
//   defaultCurrency="$"
//   thankYouMessage="✦ Thank you! ✦"
//   coinCount={2}
//   onTip={(amount, currency) => console.log(currency, amount)}
// />
