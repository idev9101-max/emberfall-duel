function scoreCard(card, state, rival) {
  if (card.type === 'spell') {
    if (card.effect?.kind === 'damageFace') {
      if (state.player.life <= card.effect.amount) return 1000;
      return 40 + card.effect.amount * 5;
    }
    if (card.effect?.kind === 'heal') return rival.life <= 8 ? 70 : 30;
    if (card.effect?.kind === 'armor') return rival.life <= 10 ? 65 : 35;
    if (card.effect?.kind === 'emberDrain') return state.player.maxEmber >= 4 ? 55 : 25;
    return 20;
  }
  let score = card.attack * 8 + card.health * 6 + card.cost * 2;
  if (card.shell) score += 18;
  if (card.strikes > 1) score += 12;
  if (card.onPlay?.kind === 'draw') score += 10;
  return score;
}

export function chooseRivalPlays(state) {
  const plays = [];
  const rival = state.rival;
  let guard = 0;
  while (guard++ < 20) {
    const playable = rival.hand.filter((c) => c.cost <= rival.ember && (c.type !== 'creature' || rival.field.length < 5));
    if (playable.length === 0) break;
    playable.sort((a, b) => scoreCard(b, state, rival) - scoreCard(a, state, rival));
    const chosen = playable[0];
    plays.push(chosen.uid);
    // simulate locally for planning
    rival.ember -= chosen.cost;
    rival.hand = rival.hand.filter((c) => c.uid !== chosen.uid);
    if (chosen.type === 'creature') {
      rival.field.push(chosen);
    } else if (chosen.effect?.kind === 'heal') {
      rival.life = Math.min(20, rival.life + chosen.effect.amount);
    } else if (chosen.effect?.kind === 'armor') {
      rival.armor += chosen.effect.amount;
    }
  }
  return plays;
}

export async function runRivalTurn(duel, render, delay = 550) {
  const state = duel.state;
  if (state.winner || state.active !== 'rival') return;
  const plan = chooseRivalPlays({
    player: JSON.parse(JSON.stringify(state.player)),
    rival: JSON.parse(JSON.stringify(state.rival)),
  });
  for (const uid of plan) {
    if (duel.state.winner || duel.state.active !== 'rival') break;
    const ok = duel.playCard('rival', uid);
    if (ok) {
      render();
      await wait(delay);
    }
  }
  if (!duel.state.winner && duel.state.active === 'rival') {
    await wait(350);
    duel.endTurn('rival');
    render();
  }
}

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
