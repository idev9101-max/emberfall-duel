[![make.fun · best-card-game-20261122-1826](https://make.fun/badge/best-card-game-20261122-1826.svg)](https://make.fun/bounty/best-card-game-20261122-1826?utm_source=github&utm_medium=readme&utm_campaign=best-card-game-20261122-1826)
[![rank](https://make.fun/badge/best-card-game-20261122-1826/idev9101-max/emberfall-duel/rank.svg)](https://make.fun/bounty/best-card-game-20261122-1826/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=best-card-game-20261122-1826)
[![reward](https://make.fun/badge/best-card-game-20261122-1826/idev9101-max/emberfall-duel/reward.svg)](https://make.fun/bounty/best-card-game-20261122-1826?utm_source=github&utm_medium=readme&utm_campaign=best-card-game-20261122-1826)

# Emberfall Duel

An original 1v1 card battler set on a dying ember-world. Play as the Emberkeeper against an Ashen Rival, managing ember, summoning creatures, and casting spells to reduce the rival to 0 life.

## Run

Serve the `game/` directory with any static file server. The included dev server works:

```bash
node serve.ts
```

Then open `http://localhost:8080`.

## Game Rules

- **Start:** Both duelists begin at 20 life with a 20-card deck and 5-card hand.
- **Ember:** Gain +1 max ember each turn, up to 10, and refill ember at turn start.
- **Play:** Click cards in your hand to play them if you have enough ember. Creatures occupy the field (max 5). Spells resolve immediately.
- **Combat:** When you click **End Turn**, your creatures attack once each. Creatures with Shell must be attacked first. After attacks, the rival takes its turn and attacks back.
- **Win/Loss:** First duelist to reach 0 life loses. Victory and defeat have distinct screens.

## Cards

| Card | Cost | Type | Stats / Effect |
|------|------:|------|----------------|
| Cinder Imp | 1 | Creature | 2/1 |
| Ash Hound | 2 | Creature | 3/2 |
| Basalt Turtle | 2 | Creature | 1/4, Shell - rivals must attack it first |
| Flame Dart | 1 | Spell | Deal 3 damage to rival face |
| Kiln Golem | 4 | Creature | 4/4 |
| Soot Drake | 5 | Creature | 5/4 |
| Hearth Ward | 3 | Spell | Gain +5 armor |
| Magma Witch | 3 | Creature | 2/3, Strikes twice |
| Coalsprite | 1 | Creature | 1/1, Draw a card |
| Furnace Colossus | 6 | Creature | 6/6 |
| Smoke Veil | 2 | Spell | Rival loses 3 ember next turn |
| Pyre Bloom | 3 | Spell | Heal 5 |

## Debug / Test Hooks

- `?autoplay=1` - scripted play loop that starts the duel and plays/ends turns automatically.
- `window.__duel` - exposed for testing and screenshot staging:
  - `__duel.snapshot()` - current state snapshot.
  - `__duel.start()` - start/restart duel.
  - `__duel.playCard(uid)` - play a card from player hand.
  - `__duel.endTurn()` - end player turn and run rival turn.
  - `__duel.debugLife(playerLife, rivalLife)` - set life totals for staging.
  - `__duel.debugWin()` - force win screen.
  - `__duel.debugLoss()` - force loss screen.
  - `__duel.showScreen(name)` - show `title|table|win|loss`.
  - `__duel.render()` - re-render current state.

## Project Structure

```
game/
  index.html        # Game shell and screen markup
  style.css         # Felt table, card frames, animations, responsive layout
  src/
    cards.js        # Card definitions, deck recipe, card factory/shuffle
    duel.js         # Duel state machine, rules, combat, win/loss logic
    ai.js           # Rival play selection and turn execution
    render.js       # DOM rendering, card art SVGs, tooltips
    screens.js      # Screen switching
    audio.js        # Tiny WebAudio blips for play/attack/win/loss
    main.js         # Wiring, UI events, autoplay, debug hook
screenshots/        # Gameplay screenshots (PNG)
.makefun/owner.json # Owner metadata
```

## Notes

- No external libraries, no network requests, no external image assets.
- Card art is inline SVG/CSS; sound is generated with WebAudio oscillators.
- All names and visuals are original.
