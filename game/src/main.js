import { createDuel } from './duel.js';
import { render } from './render.js';
import { showScreen } from './screens.js';
import { sfx, setSoundEnabled, soundEnabled, unlockAudio } from './audio.js';
import { runRivalTurn } from './ai.js';
import { startFx } from './fx.js';

const duel = createDuel((event) => {
  if (event === 'play') sfx.play();
  if (event === 'attack') sfx.attack();
  if (event === 'end') {
    if (duel.state.winner === 'win') sfx.win();
    if (duel.state.winner === 'loss') sfx.loss();
  }
});

const ui = {
  onPlayCard(uid) {
    if (duel.state.active !== 'player' || duel.state.winner) return;
    const ok = duel.playCard('player', uid);
    if (ok) {
      render(duel.state, ui);
      maybeAutoEndForAutoplay();
    }
  },
};

function maybeAutoEndForAutoplay() {
  // no-op during normal play; debug hook controls full flow
}

function start() {
  unlockAudio();
  duel.startGame();
  showScreen('table');
  render(duel.state, ui);
}

function wire() {
  document.getElementById('btn-start').addEventListener('click', start);
  document.getElementById('btn-win-again').addEventListener('click', start);
  document.getElementById('btn-loss-again').addEventListener('click', start);

  document.getElementById('btn-end-turn').addEventListener('click', async () => {
    if (duel.state.active !== 'player' || duel.state.winner) return;
    sfx.click();
    duel.endTurn('player');
    render(duel.state, ui);
    if (!duel.state.winner && duel.state.active === 'rival') {
      await runRivalTurn(duel, () => render(duel.state, ui));
      render(duel.state, ui);
      if (duel.state.winner) showEnd();
    } else if (duel.state.winner) {
      showEnd();
    }
  });

  document.getElementById('btn-sound').addEventListener('click', () => {
    setSoundEnabled(!soundEnabled());
    document.getElementById('btn-sound').textContent = `Sound: ${soundEnabled() ? 'On' : 'Off'}`;
  });

  // re-render on end event
  const origCheck = duel.checkWinner.bind(duel);
  duel.checkWinner = () => {
    const w = origCheck();
    if (w) showEnd();
    return w;
  };
}

function showEnd() {
  render(duel.state, ui);
  setTimeout(() => {
    if (duel.state.winner === 'win') showScreen('win');
    else if (duel.state.winner === 'loss') showScreen('loss');
  }, 450);
}

function setupAutoplay() {
  const params = new URLSearchParams(location.search);
  if (params.get('autoplay') !== '1') return;
  // Scripted flow: start, play cheap cards, end turns until win/loss.
  setTimeout(async () => {
    start();
    for (let i = 0; i < 30 && !duel.state.winner; i++) {
      if (duel.state.active !== 'player') { await wait(200); continue; }
      const playable = duel.state.player.hand
        .filter((c) => duel.canPlay('player', c.uid))
        .sort((a, b) => a.cost - b.cost || b.attack - a.attack);
      if (playable[0]) {
        duel.playCard('player', playable[0].uid);
        render(duel.state, ui);
        await wait(120);
        continue;
      }
      duel.endTurn('player');
      render(duel.state, ui);
      if (!duel.state.winner && duel.state.active === 'rival') {
        await runRivalTurn(duel, () => render(duel.state, ui), 120);
        render(duel.state, ui);
      }
      await wait(120);
    }
  }, 250);
}

function wait(ms) { return new Promise((r) => setTimeout(r, ms)); }

function exposeDebug() {
  window.__duel = {
    state: duel.state,
    snapshot: () => duel.snapshot(),
    start: () => start(),
    playCard: (uid) => { const ok = duel.playCard('player', uid); render(duel.state, ui); return ok; },
    endTurn: async () => {
      duel.endTurn('player');
      render(duel.state, ui);
      if (!duel.state.winner && duel.state.active === 'rival') await runRivalTurn(duel, () => render(duel.state, ui), 50);
      render(duel.state, ui);
    },
    debugLife: (p, r) => { duel.debugLife(p, r); render(duel.state, ui); },
    debugWin: () => { duel.state.rival.life = 0; duel.checkWinner(); render(duel.state, ui); showEnd(); },
    debugLoss: () => { duel.state.player.life = 0; duel.checkWinner(); render(duel.state, ui); showEnd(); },
    showScreen: (name) => showScreen(name),
    render: () => render(duel.state, ui),
  };
}

wire();
exposeDebug();
const fxCanvas = document.getElementById('fx');
if (fxCanvas) startFx(fxCanvas);
showScreen('title');
setupAutoplay();
