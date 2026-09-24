# LEFT RIGHT (${{TICKER}})

A one-screen cartoon meme-coin site. Two kids, **LEFTY** (red beanie, left)
and **RIGHTY** (blue cap and ponytail, right), yell at each other forever
about nothing. Visitors pick a side and join the brawl.

- **Always-on yelling.** Mouths flap in syllables, fists shake, the paper
  cutouts jitter, and eyes blink and follow your cursor. Their faces get
  redder for 30 seconds, then steam blows out of their ears and it starts
  over. Speech bubbles bicker about nothing.
- **Pick a side.** Use the big LEFT / RIGHT buttons, or click either half of
  the screen. You get confetti, a colour flash, and the whole page (accents,
  cursor) leans your colour. The pick is remembered in `localStorage`.
- **The brawl.** Mash **FIGHT** (or tap the arena, or press **F**). Each hit
  is a swing, a dust cloud, stars and screen shake. Fast mashing builds
  combos, and every 10th hit is a SUPER haymaker. Your hits push the seam
  into the other side's half while the other side punches back. Push them
  all the way for a **K.O.** They spin, see stars, and pop straight back up
  for the next round, because the fight never ends. Rounds, punches and
  combos are counted **in this browser only**.
- **Standings bar.** It shows `TEAM_STATE`, which you edit by hand, with an
  optional live endpoint. Your own punches show as a clearly labelled
  striped slice and are never sent anywhere.
- **PFP generator.** Builds a 1024×1024 PNG of your side's fighter with a
  LEFT / RIGHT badge. It's drawn in the browser and nothing is uploaded.
- **Milestones.** Six story beats under the bar. When one unlocks, both
  fighters throw a swing.
- **Extras.** Fist cursor in your colour. Sound is muted by default
  (synthesised crowd murmur, punch thwack, round bell). Type **STOP** and
  both freeze and stare at you.
- **Accessibility.** `prefers-reduced-motion` freezes everything into a
  static pose, with no shake or flash. Works from 375px up: on phones the
  halves stack and the two face off across the diagonal.

Plain HTML, CSS and JavaScript. No build step, no framework, no backend.

## Preview

Open `index.html` in a browser. Double-clicking works: there are no modules
and no `fetch` of local files. Or serve the folder:

```sh
python3 -m http.server 8080
# http://localhost:8080/            the site
# http://localhost:8080/design-system.html   characters, poses, tokens, components
```

## Deploy

Drag the whole folder onto Netlify's deploy drop zone (Netlify → Sites →
"Deploy manually"). Any static host works (Vercel, Cloudflare Pages, GitHub
Pages, S3). There's nothing to build.

GSAP loads from cdnjs with a subresource-integrity hash. If cdnjs is blocked
or the hash doesn't match, `js/main.js` loads the identical copy in
`js/vendor/gsap.min.js`. Fonts come from Google Fonts (Bowlby One + Inter).

## Placeholders

Find and replace these before launch. While any are left, the browser
console lists them (`[LEFT RIGHT] Replace before launch: …`).

| Placeholder | Where | What |
| --- | --- | --- |
| `{{TICKER}}` | `index.html` (title, meta, header, sections, disclaimer), `design-system.html` | Ticker without the `$`. The page already prints `$` in front, e.g. `${{TICKER}}` → `$LR` |
| `{{CONTRACT_ADDRESS}}` | `index.html` (`data-copy` on both COPY CONTRACT buttons + the HOW TO BUY box) | Token contract address |
| `{{X_URL}}` | `index.html` | X profile URL |
| `{{TELEGRAM_URL}}` | `index.html` | Telegram group URL |
| `{{DEX_URL}}` | `index.html` | Exchange / swap URL for the HOW TO BUY step |
| `{{SITE_URL}}` | `index.html` (`canonical`, `og:*`, `twitter:image`) | Live site origin without the trailing slash, e.g. `https://leftright.example`. Social cards need an absolute image URL |
| `{{MILESTONE_1_LABEL}}` … `{{MILESTONE_6_LABEL}}` | `js/milestones.js` | Six short story beats. Never price targets |

One-liner (macOS: use `sed -i ''`):

```sh
sed -i 's/{{TICKER}}/LR/g; s#{{X_URL}}#https://x.com/yourhandle#g' index.html
```

## Editing the standings (`TEAM_STATE`)

In `js/fight.js`:

```js
const TEAM_STATE = { left: 52, right: 48 }; // 0–100 each
```

The bar shows these two numbers exactly as written. Visitors' clicks never
change them. Their own punches only add the striped "local" slice they see
themselves, and that slice is labelled as local.

**Going live later:** set `TEAM_STATE_ENDPOINT` (just below) to a URL that
returns `{ "left": 52, "right": 48 }`. The bar fetches it on load and every
`TEAM_STATE_POLL_MS` (60 s), and the label switches to "Standings updated
<time>". If the fetch fails, it keeps showing `TEAM_STATE`.

## Adding and unlocking milestones

In `js/milestones.js`:

```js
{ id: 'm3', label: 'First meme war', timestamp: '2026-10-02T12:00:00Z', state: 'unlocked' },
```

- `id`: unique, used to remember which unlocks a visitor has already seen.
- `label`: short story beat.
- `timestamp`: ISO date, shown on hover once unlocked (`null` while locked).
- `state`: `'locked'` or `'unlocked'`.

Flip one to `'unlocked'` and redeploy. Each visitor who hasn't seen it gets
the star pop and both fighters throw a swing, once. The row is built to hold
six compact stars.

## Other knobs

| What | Where |
| --- | --- |
| Which fighter has the girl hair set | `TEAMS` in `js/rig.js`: swap `variant: 'guy'` / `'gal'` |
| Speech-bubble lines | `LINES` in `js/idle.js` (both sides share them) |
| Game difficulty (push per hit, combo window, the other side's speed, rest timer) | `GAME` in `js/fight.js` |
| Rage cycle length | `RAGE_SECONDS` in `js/idle.js` |
| Colours, type, spacing | tokens at the top of `css/style.css` |

## Files

| Path | What it is |
| --- | --- |
| `index.html` | The site: the one-screen brawl, then HOW TO BUY, THE CROWD, FAQ, footer |
| `design-system.html` | Both fighters in every pose, rig map, colour tokens, type, components, effects, real PFPs |
| `css/style.css` | Tokens, components, layout |
| `js/rig.js` | The one SVG character rig (#char-body, #char-head, #char-hat, #char-eyes, #char-pupils, #char-brows, #char-mouth, #char-arm-l/-r, #char-legs), its poses and renderer |
| `js/idle.js` | The always-on yelling loop, blinks, cursor-following eyes, rage + steam, speech bubbles, STOP easter egg |
| `js/fight.js` | `TEAM_STATE` + live hook, side picking, the brawl game, standings bar |
| `js/milestones.js` | `MILESTONES` + the star row |
| `js/pfp.js` | Canvas PFP generator |
| `js/sound.js` | Web Audio: crowd, thwack, bell, whoosh (muted by default, never autoplays) |
| `js/fx.js` | Brawl cloud, stars, confetti, the split background |
| `js/main.js` | Boot, copy contract, sound toggle, marquee, placeholder check |
| `js/vendor/gsap.min.js` | GSAP 3.13.0 fallback (same file cdnjs serves) |
| `assets/` | Favicon and the 1200×630 social image |

The two fighters are one rig: LEFTY is drawn facing right, and RIGHTY is the
same drawing mirrored and recoloured. Both share the same body, face, size
and animation set. Only the colour, hat (beanie + pom-pom / cap + brim) and
hair differ. Everything moves with transforms and opacity only.

## Credits and licences

- Characters, art and sounds are original and made for this site (SVG and
  Web Audio). They're drawn in a flat cutout-cartoon style, and the site
  doesn't copy or reference any show, character, logo or brand.
- [GSAP](https://gsap.com) 3.13.0 is free to use under GreenSock's standard
  licence.
- Bowlby One and Inter come via Google Fonts, under the SIL Open Font
  License.

${{TICKER}} is a meme coin with no utility and no expectation of profit.
Nothing on this site is financial advice. You can lose everything you put
in. This site is not affiliated with any political party, politician or
government agency.
