# LEFT RIGHT (${{TICKER}})

**The internet's oldest argument. Now it has a coin.**

A cartoon meme-coin site, built the way the big narrative meme coins are:
one story, two characters, a poster for a hero, and everything else in
service of the joke. Two kids, **LEFTY** (red, left: a blonde bob) and
**RIGHTY** (blue, right: black hair and glasses), have been arguing since
the first comment section. Nobody remembers what about. *Which side are
you on?* Visitors tick a ballot and fight the other side in a small
fighting game right in the hero. The only enemy is the fence: **there is
no fence.**

## How the page is built

The meme-coin playbook (one-line hook, a rival, a name for the community,
the mascot everywhere, a poster hero, the lore, how to buy, joke
tokenomics, a joke roadmap, things to share, a way in), done with these
two:

1. **Poster hero: the fight.** Giant LEFT and RIGHT poster type behind the
   two of them (it steps back once you play), the hook, the two ballots,
   then Buy, the contract address (tap to copy) and Chart. The header is
   fixed: logo, ticker, section links, CA, Buy. It's see-through over the
   fight and turns ink once you scroll.
2. **The lore.** A four-panel comic (*gm / gm*, *ACTUALLY / WELL
   ACTUALLY*, *SOURCE? / TYPICAL*, then the coin) and a short manifesto:
   pineapple on pizza, tabs or spaces, GIF or JIF. They have never agreed
   on anything, except that there is no fence.
3. **Pick your side.** Team Left and Team Right cards (same layout, same
   number of traits, Join and Get the PFP on both), the VS, and the
   scoreboard. The red/blue seam runs between the cards. "Join Team …"
   picks that side and takes you back up to the fight.
4. **How to buy.** Four sticker steps (wallet, gas, swap, pick a side),
   Buy and Chart, the contract box. Then a tilted tape of group-chat
   slang.
5. **Tokenomics.** The total supply as one giant number, four stamps (tax,
   liquidity, contract, chain), each with a joke, the "argue-nomics"
   pizza (50% Left, 50% Right, 0% listening, labelled as a joke) and the
   real allocation card, which says "to be announced" until you fill it
   in.
6. **Roadmap.** Three phases (*Pick a side*, *Raise your voice*, *Never
   log off*), ticked off as they happen. Phases, not promises: no dates
   until they're real, no price talk ever.
7. **Memes.** Make a meme (the maker opens in a dialog), Get your PFP, a
   wall of eight ready-made memes (Save or Remix any of them) and an
   eight-piece sticker pack, four a side, saved as die-cut PNGs.
8. **Airdrops.** The crate-drop stash from the game and the token airdrop
   card.
9. **FAQ**, then **Join the argument** (the two of them peeking over a
   ledge, X and Telegram) and the footer with the disclaimer.

Everything below the fight is drawn from the same character rig as the
fight. `js/art.js` renders each pose once into a still image as it comes
near the screen, so the page adds no live animation that could cost the
fight a frame.

## Features

- **Always-on yelling.** Mouths flap in syllables, fists shake, the paper
  cutouts jitter, and eyes blink and follow your cursor. Their faces get
  redder for 30 seconds, then steam blows out of their ears and it starts
  over. Speech bubbles bicker about nothing.
- **Pick a side.** Tick the LEFT or RIGHT ballot box (it gets its ✗),
  click either half of the screen, or join a team further down. You get
  confetti, a colour flash, and the whole page (accents, cursor) leans
  your colour. The pick is remembered in `localStorage`.
- **The fight.** You play your side; the computer plays the other. Punch,
  kick, hold to block, and a meter-powered special. Chains of hits make
  named combos, blocking just before a hit lands parries it, and the
  health bars, round timer and special meters sit in a proper
  fighting-game HUD. Best of 3 rounds, then *"Say the last word!"*: a
  giant "OK." lands on the loser. Win and the next opponent is a level
  harder. See [How to play](#how-to-play). The political flavour is all
  debate-club slang (talking points, filibusters, recounts); there are no
  parties, politicians, slogans or issues anywhere.
- **Game feel.** Every hit freezes the frame for a beat (longer for bigger
  hits), sprays sparks the way the blow went, squashes the fighter it
  lands on and shakes their health bar. Combos punch the camera in, flash
  speed lines and heat the hit counter from yellow to orange to pink, with
  streak hype ("Trending!", "Viral!", "Ratio'd!"). Knockouts land in slow
  motion; winning a match rains confetti. Phones buzz on impact where the
  browser allows it. With sound on, each hit in a combo climbs a scale.
- **Uncluttered controls.** While you play: the four move buttons (icon +
  word, key in the corner) and three small icon buttons (moves list,
  switch sides, PFP). Your win/loss record lives in the Moves list.
- **Scoreboard.** It shows `TEAM_STATE`, which you edit by hand (it ships
  at 50/50), with an optional live endpoint. Your own hits show as a
  clearly labelled striped slice and are never sent anywhere. Levels,
  wins and records are counted **in this browser only**.
- **PFP generator.** Builds a 1024×1024 PNG of either fighter (in your
  drip) with a LEFT / RIGHT badge. It's drawn in the browser and nothing
  is uploaded.
- **Memes and stickers.** A meme maker with six formats (top/bottom,
  versus, "Nobody:", nah/yes, the stare, full steam), ready-made captions
  to shuffle, your own text, and Save PNG / Copy image. The fighters in
  the memes are the real rig, in your drip. The wall and the sticker pack
  are drawn only once the section is near the screen, so the fight never
  pays for them.
- **Airdrops, two kinds, kept apart.**
  - *Crate drops (the game):* your first round win, and every match win
    after that, parachutes a crate into the arena with a piece of drip
    (party hat, deal-with-it shades, gold chain, propeller cap, laser
    eyes, crown). It goes straight on your fighter, your PFP and your
    memes; the Airdrops section shows the stash and lets you swap.
    Cosmetic, worth nothing, kept in this browser.
  - *The token airdrop:* one card, with a status (`soon`, `live`,
    `ended`), who, when and the one official claim link, plus a stay-safe
    line (no DMs, never your seed phrase, never send to receive). Nothing
    on the page connects a wallet or pretends to claim.
- **Roadmap news.** Tick a roadmap item and redeploy: returning visitors
  get a toast ("Roadmap: … Done.") and both fighters throw a swing, once.
- **Extras.** Fist cursor in your colour. Sound is muted by default
  (synthesised crowd murmur, punch, kick, block, parry, the filibuster
  drone, combo blips, round bell); the speaker button wiggles once when
  the first round starts, and never plays anything by itself. Type
  **STOP** and both freeze and stare at you.
- **Paper grain.** A subtle noise texture on the flat colour backgrounds
  only, never over the characters or text. Set `--grain-opacity` in
  `css/style.css` to `0` to turn it off.
- **Accessibility.** `prefers-reduced-motion` freezes everything into a
  static pose, with no shake, flash, freeze frames, slow motion, sparks or
  scrolling tape; the game still plays (the HUD, words and banners carry
  it). Works from 320px up: on phones the halves stack and the two face
  off across the diagonal. The round pauses itself when a dialog is open,
  the tab is hidden, the fight is scrolled out of view, or nobody has
  pressed anything for 6 seconds.

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
| `{{CONTRACT_ADDRESS}}` | `index.html` (the header CA button, the CA pill in the hero, the How to buy box), `design-system.html` | Token contract address |
| `{{X_URL}}` | `index.html` | X profile URL |
| `{{TELEGRAM_URL}}` | `index.html` | Telegram group URL |
| `{{DEX_URL}}` | `index.html` (every Buy button) | Exchange / swap URL |
| `{{CHART_URL}}` | `index.html` (every Chart link) | The token's chart page |
| `{{SITE_URL}}` | `index.html` (`canonical`, `og:*`, `twitter:image`) | Live site origin without the trailing slash, e.g. `https://leftright.example`. Social cards need an absolute image URL |
| `{{TOTAL_SUPPLY}}`, `{{CHAIN}}`, `{{TAX}}` | `TOKENOMICS` in `js/coin.js` (and the stamps in `index.html`) | e.g. `1,000,000,000`, `Solana`, `0% buy / 0% sell` |
| `{{LP_STATUS}}`, `{{CONTRACT_STATUS}}` | `TOKENOMICS` in `js/coin.js` (and the stamps in `index.html`) | e.g. `Burned`, `Renounced`. Only what is true |
| `{{AIRDROP_ELIGIBILITY}}`, `{{AIRDROP_DATE}}`, `{{AIRDROP_URL}}` | `#airdrop-card` in `index.html` | Who qualifies, when, and the one official claim page. Leave the card on `data-status="soon"` until it's real |

One-liner (macOS: use `sed -i ''`):

```sh
sed -i 's/{{TICKER}}/LR/g; s#{{X_URL}}#https://x.com/yourhandle#g' index.html
```

## Editing the standings (`TEAM_STATE`)

In `js/fight.js`:

```js
const TEAM_STATE = { left: 50, right: 50 }; // 0–100 each
```

The bar shows these two numbers exactly as written. Visitors' clicks never
change them. Their own hits only add the striped "local" slice they see
themselves, and that slice is labelled as local.

**Going live later:** set `TEAM_STATE_ENDPOINT` (just below) to a URL that
returns `{ "left": 50, "right": 50 }`. The bar fetches it on load and every
`TEAM_STATE_POLL_MS` (60 s), and the label switches to "Standings updated
<time>". If the fetch fails, it keeps showing `TEAM_STATE`.

## Editing the roadmap

In `js/milestones.js`: three `PHASES` (their names) and the `MILESTONES`
under them:

```js
{ id: 'meme-war', phase: 2, label: 'The first meme war', done: false },
```

- `id`: unique, used to remember which ticks a visitor has already seen.
- `phase`: `1`, `2` or `3`.
- `label`: a short story beat. Never a price, never a return.
- `done`: `true` once it has happened.

Tick one (`done: true`) and redeploy. The first unticked item gets the
**Next** tag and its phase gets the yellow ring. Returning visitors who
haven't seen the tick get a toast, both fighters throw a swing, and the
box pops when the roadmap scrolls into view, once each.

## Tokenomics

In `js/coin.js`, fill in `TOKENOMICS` (supply, chain, tax, liquidity and
contract status go on the stamps), then the allocation:

```js
allocation: [
  { label: 'Liquidity pool', pct: 90 },
  { label: 'Community airdrop', pct: 5 },
  { label: 'Team (locked)', pct: 5 },
],
```

Up to five rows are drawn (more fold into "Other"). The colours are a fixed,
colour-blind-checked order (blue, red, amber, green, purple), each part is
labelled, and the legend doubles as the table. Only publish final numbers.
The pizza beside it is a drawing in `index.html`, captioned as a joke.

## The token airdrop card

In `index.html`, find `#airdrop-card`:

- `data-status="soon"`: the claim button is greyed out and says the link
  will appear there.
- `data-status="live"`: the button links to `{{AIRDROP_URL}}`.
- `data-status="ended"`: "Claim window closed".

Keep the stay-safe box. If anyone ever DMs your holders a "claim" link, this
is where they'll check.

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
| Crate drops: the items, their tiers and odds | `DRIP` and `WEIGHT` in `js/drops.js` |
| Meme formats and captions | `TEMPLATES` (and the wall's `WALL`) in `js/memes.js` |
| The sticker pack (who, pose, line) | `STICKERS` in `js/memes.js` (keep it four a side) |
| Lore comic, team cards, the heads around the page (pose, crop, face) | the `data-art`, `data-pose`, `data-view` and `data-state` attributes in `index.html` (see the top of `js/art.js`) |
| Marquee and tape words | `buildMarquees()` in `js/main.js` |
| Rage cycle length | `RAGE_SECONDS` in `js/idle.js` |
| Colours, type, spacing | tokens at the top of `css/style.css` |

## Files

| Path | What it is |
| --- | --- |
| `index.html` | The site: the fixed header, the one-screen fight (poster, HUD, arena, move pad, Moves list, meme maker dialog), then LORE, PICK YOUR SIDE, HOW TO BUY, TOKENOMICS, ROADMAP, MEMES, AIRDROPS, FAQ, JOIN, footer |
| `design-system.html` | Both fighters in every pose, rig map, colour tokens, type, components (scoreboard, section pieces, roadmap phase), effects, real PFPs |
| `css/style.css` | Tokens, components, layout |
| `js/rig.js` | The one SVG character rig (#char-body, #char-head, #char-hat, #char-eyes, #char-pupils, #char-brows, #char-mouth, #char-arm-l/-r, #char-legs), its poses and renderer |
| `js/idle.js` | The always-on yelling loop, blinks, cursor-following eyes, rage + steam, speech bubbles, STOP easter egg |
| `js/fight.js` | `TEAM_STATE` + live hook, side picking, the fighting game (moves, combos, rounds, the computer opponent), standings bar |
| `js/milestones.js` | `PHASES` + `MILESTONES`: the roadmap and its tick news |
| `js/drops.js` | Crate airdrops: the drip catalogue, the stash, the parachute drop; the token airdrop card's status |
| `js/memes.js` | Meme maker (in its dialog), meme wall and sticker pack (canvas) |
| `js/art.js` | Still pictures of the two fighters for the sections (rendered once, lazily) and die-cut stickers |
| `js/coin.js` | `TOKENOMICS`: the stamps + the allocation card |
| `js/pfp.js` | Canvas PFP generator (wears your drip) |
| `js/sound.js` | Web Audio: crowd, punch, kick, block, parry, filibuster, bell, whoosh (muted by default, never autoplays) |
| `js/fx.js` | Brawl cloud, stars, confetti, the split backgrounds |
| `js/main.js` | Boot, fixed header, copy contract, sound toggle, site menu, marquee and tape, PFP buttons, section splits, placeholder check |
| `js/vendor/gsap.min.js` | GSAP 3.13.0 fallback (same file cdnjs serves) |
| `assets/` | Favicon and the 1200×630 social image |

The two fighters are one rig: LEFTY is drawn facing right, and RIGHTY is the
same drawing mirrored and recoloured. Both share the same body, face, size
and animation set. Only the colour and hair differ: she has a blonde
shoulder-length bob, he has short black hair and glasses. The drip from
crate drops is part of the same rig (hat, face and neck slots), so it
moves with the character. Everything moves with transforms and opacity
only.

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
