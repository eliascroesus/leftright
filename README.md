# LEFT RIGHT (${{TICKER}})

A single-screen cartoon meme-coin site. Two guys, LEFTY (red, left) and
RIGHTY (blue, right), yell at each other forever. You pick a side and join
the fight.

> Work in progress: built in six reviewed stages. The full README (deploy,
> placeholders, editing `TEAM_STATE`, adding milestones) arrives in stage 6.

## Preview

No build step. Open `design-system.html` directly in a browser, or serve the
folder:

```sh
python3 -m http.server 8080
# → http://localhost:8080/design-system.html
```

## Files so far

| Path | What it is |
| --- | --- |
| `design-system.html` | Both characters in every pose, colour tokens, type, components, effects |
| `css/style.css` | Design tokens and components |
| `js/rig.js` | The one SVG character rig (LEFTY / RIGHTY), its poses and renderer |
| `js/fx.js` | Brawl cloud, stars, confetti and the split background |
| `assets/favicon.svg` | Favicon |
