# LEFT RIGHT (${{TICKER}})

A one-screen cartoon meme-coin site. Two kids, **LEFTY** (red, left: a
blonde bob) and **RIGHTY** (blue, right: black hair and glasses), yell at
each other forever about nothing. *Which side are you on?* Visitors tick a ballot and fight the
other side in a small fighting game: combos, blocks, parries, a special,
best-of-3 rounds and an opponent that gets harder every match you win.

- **Always-on yelling.** Mouths flap in syllables, fists shake, the paper
  cutouts jitter, and eyes blink and follow your cursor. Their faces get
  redder for 30 seconds, then steam blows out of their ears and it starts
  over. Speech bubbles bicker about nothing.
- **Pick a side.** "Which side are you on?" Tick the LEFT or RIGHT ballot
  box (it gets its ✗), or click either half of the screen. You get
  confetti, a colour flash, and the whole page (accents, cursor) leans your
  colour. The pick is remembered in `localStorage`.
- **The fight.** You play your side; the computer plays the other. Punch,
  kick, hold to block, and a meter-powered special. Chains of hits make
  named combos, blocking just before a hit lands parries it, and the
  health bars, round timer and special meters sit in a proper fighting-game
  HUD. Best of 3 rounds, then *"Say the last word!"*: a giant "OK." lands
  on the loser. Win and the next opponent is a level harder. See
  [How to play](#how-to-play). The political flavour is all debate-club
  slang (talking points, filibusters, recounts); there are no parties,
  politicians, slogans or issues anywhere.
- **Standings bar.** It shows `TEAM_STATE`, which you edit by hand, with an
  optional live endpoint. Your own hits show as a clearly labelled striped
  slice and are never sent anywhere. Levels, wins and records are counted
  **in this browser only**.
- **PFP generator.** Builds a 1024×1024 PNG of your side's fighter with a
  LEFT / RIGHT badge. It's drawn in the browser and nothing is uploaded.
- **Milestones.** Six story beats under the bar. When one unlocks, both
  fighters throw a swing.
- **Extras.** Fist cursor in your colour. Sound is muted by default
  (synthesised crowd murmur, punch, kick, block, parry, the filibuster
  drone, round bell). Type **STOP** and both freeze and stare at you.
- **Paper grain.** A subtle noise texture on the flat colour backgrounds
  only (the split, the sections, the footer), never over the characters or
  text. Set `--grain-opacity` in `css/style.css` to `0` to turn it off.
- **Accessibility.** `prefers-reduced-motion` freezes everything into a
  static pose, with no shake or flash; the game still plays (the HUD,
  words and banners carry it). Works from 320px up: on phones the halves
  stack and the two face off across the diagonal. The round pauses itself
  when the Moves list is open, the tab is hidden, the fight is scrolled out
  of view, or nobody has pressed anything for 6 seconds.

Plain HTML, CSS and JavaScript. No build step, no framework, no backend.

## How to play

| Move | Keyboard | Touch / mouse |
| --- | --- | --- |
| Punch | `J` (or `F`) | Punch button, or tap the fight |
| Kick | `K` | Kick button |
| Block | hold `L` | hold the Block button |
| Filibuster (special) | `Space`, when your meter is full | Filibuster button |

- **Parry:** raise your block just before a hit lands (within 170 ms) and
  it's a **Gotcha!**: they're left wide open.
- **Combos:** land these in a row, each within 0.65 s of the last.

  | Combo | Input | Bonus |
  | --- | --- | --- |
  | Talking point | P P P P P | +10, stagger |
  | Flip-flop | P K P K | +9, knockback |
  | Moving goalposts | K K K | +8, knockback |
  | Hot take | P P K | +6, launch |
  | Soundbite | K P P | +6, stagger |
  | Counterpoint | block a hit, then P | +5, stagger |

- **Interruption:** hit them during their wind-up for +25%.
- **Point of order!:** stuck in a combo (3+ hits)? Press Block with a third
  of a meter to shove them off.
- **The opponent** shows a **!** before its attacks (a shorter warning each
  level), blocks when you're on the attack, reads you if you repeat one
  move ("HEARD IT."), counters what it blocks, parries from level 3, and
  strings longer combos as it climbs. Level names run Group chat, Comment
  section, Town hall, Family dinner, Panel show, Talk radio, Prime-time
  debate and The final debate, then Overtime forever.
- **Rounds:** 45 seconds, best of 3. On time the healthier side wins; a
  dead heat is a **Recount!** Winning a round without taking a scratch is a
  **Landslide!**

Tested with scripted players: button-mashing wins the first couple of
levels and stops working around level 4. From level 6 you need to block the
**!** and punish.

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
change them. Their own hits only add the striped "local" slice they see
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
| Which side gets which look (blonde bob / black hair and glasses), and optional hats | `TEAMS` in `js/rig.js`: swap `variant: 'gal'` / `'guy'`; `hat: 'beanie'`, `'cap'` or `null` |
| Speech-bubble lines | `LINES` in `js/idle.js` (both sides share them) |
| Health, round length, meter, parry window, combo window, idle pause | `GAME` in `js/fight.js` |
| Move damage and timing | `MOVES` in `js/fight.js` (the same for both sides) |
| Combos: names, inputs, bonuses | `COMBOS` in `js/fight.js` (the Moves list builds itself from it) |
| The opponent per level (reactions, blocking, parries, combos, damage) | `brain(level)` in `js/fight.js` |
| Level names | `STAGES` in `js/fight.js` |
| Paper grain strength | `--grain-opacity` in `css/style.css` (`0` = off) |
| Rage cycle length | `RAGE_SECONDS` in `js/idle.js` |
| Colours, type, spacing | tokens at the top of `css/style.css` |

## Files

| Path | What it is |
| --- | --- |
| `index.html` | The site: the one-screen fight (HUD, arena, move pad, Moves list), then HOW TO BUY, THE CROWD, FAQ, footer |
| `design-system.html` | Both fighters in every pose, rig map, colour tokens, type, components, effects, real PFPs |
| `css/style.css` | Tokens, components, layout |
| `js/rig.js` | The one SVG character rig (#char-body, #char-head, #char-hat, #char-eyes, #char-pupils, #char-brows, #char-mouth, #char-arm-l/-r, #char-legs), its poses and renderer |
| `js/idle.js` | The always-on yelling loop, blinks, cursor-following eyes, rage + steam, speech bubbles, STOP easter egg |
| `js/fight.js` | `TEAM_STATE` + live hook, side picking, the fighting game (moves, combos, rounds, the computer opponent), standings bar |
| `js/milestones.js` | `MILESTONES` + the star row |
| `js/pfp.js` | Canvas PFP generator |
| `js/sound.js` | Web Audio: crowd, punch, kick, block, parry, filibuster, bell, whoosh (muted by default, never autoplays) |
| `js/fx.js` | Brawl cloud, stars, confetti, the split background |
| `js/main.js` | Boot, copy contract, sound toggle, marquee, placeholder check |
| `js/vendor/gsap.min.js` | GSAP 3.13.0 fallback (same file cdnjs serves) |
| `assets/` | Favicon and the 1200×630 social image |

The two fighters are one rig: LEFTY is drawn facing right, and RIGHTY is the
same drawing mirrored and recoloured. Both share the same body, face, size
and animation set. Only the colour and hair differ: she has a blonde
shoulder-length bob, he has short black hair and glasses. The rig still
carries a beanie and a cap for anyone who wants hats back (off by
default). Everything moves with transforms and opacity only.

## Credits and licences

- Characters, art and sounds are original and made for this site (SVG and
  Web Audio). They're drawn in a flat cutout-cartoon style, and the site
  doesn't copy or reference any show, character, logo or brand. The fight
  vocabulary is original too: debate slang, no borrowed catchphrases from
  any game.
- [GSAP](https://gsap.com) 3.13.0 is free to use under GreenSock's standard
  licence.
- Bowlby One and Inter come via Google Fonts, under the SIL Open Font
  License.

${{TICKER}} is a meme coin with no utility and no expectation of profit.
Nothing on this site is financial advice. You can lose everything you put
in. This site is not affiliated with any political party, politician or
government agency.
