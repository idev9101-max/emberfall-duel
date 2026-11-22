import { buildDeck, shuffle } from './cards.js';

export const MAX_LIFE = 20;
export const MAX_EMBER = 10;
export const HAND_LIMIT = 7;

function makePlayer(name, isAI = false) {
  return {
    name,
    isAI,
    life: MAX_LIFE,
    armor: 0,
    maxEmber: 0,
    ember: 0,
    emberDrainNext: 0,
    deck: shuffle(buildDeck()),
    hand: [],
    field: [],
    fatigue: 0,
  };
}

function cloneCardForLog(card) {
  return { name: card.name, uid: card.uid };
}

export function createDuel(emit) {
  const state = {
    turn: 1,
    active: 'player',
    phase: 'title',
    winner: null,
    log: [],
    player: makePlayer('You'),
    rival: makePlayer('Rival', true),
    lastActionId: 0,
  };

  function log(msg) {
    state.log.unshift({ id: ++state.lastActionId, turn: state.turn, msg });
    if (state.log.length > 40) state.log.length = 40;
    emit?.('log', msg);
  }

  function opponentOf(side) {
    return side === 'player' ? state.rival : state.player;
  }

  function sideObj(side) {
    return side === 'player' ? state.player : state.rival;
  }

  function draw(side, n = 1) {
    const p = sideObj(side);
    for (let i = 0; i < n; i++) {
      if (p.deck.length === 0) {
        p.fatigue += 1;
        dealDamage(side, p.fatigue, `${p.name} suffers fatigue ${p.fatigue}`);
        continue;
      }
      const card = p.deck.shift();
      if (p.hand.length >= HAND_LIMIT) {
        log(`${p.name} burns ${card.name} (hand full).`);
      } else {
        p.hand.push(card);
        if (side === 'player') log(`You draw ${card.name}.`);
        else log(`Rival draws a card.`);
      }
    }
  }

  function dealDamage(side, amount, reason) {
    const p = sideObj(side);
    let remaining = amount;
    if (p.armor > 0) {
      const absorbed = Math.min(p.armor, remaining);
      p.armor -= absorbed;
      remaining -= absorbed;
    }
    if (remaining > 0) p.life -= remaining;
    if (reason) log(reason);
    checkWinner();
  }

  function heal(side, amount) {
    const p = sideObj(side);
    const before = p.life;
    p.life = Math.min(MAX_LIFE, p.life + amount);
    log(`${p.name === 'You' ? 'You heal' : 'Rival heals'} ${p.life - before} life.`);
  }

  function gainArmor(side, amount) {
    const p = sideObj(side);
    p.armor += amount;
    log(`${p.name === 'You' ? 'You gain' : 'Rival gains'} ${amount} armor.`);
  }

  function applyEmberDrain(side, amount) {
    const p = sideObj(side);
    p.emberDrainNext += amount;
    log(`${p.name === 'You' ? 'You will lose' : 'Rival will lose'} ${amount} ember next turn.`);
  }

  function checkWinner() {
    if (state.winner) return state.winner;
    const playerDead = state.player.life <= 0;
    const rivalDead = state.rival.life <= 0;
    if (playerDead && rivalDead) {
      state.winner = 'loss'; // tie goes to rival for drama
    } else if (rivalDead) {
      state.winner = 'win';
    } else if (playerDead) {
      state.winner = 'loss';
    }
    if (state.winner) {
      state.phase = state.winner;
      log(state.winner === 'win' ? 'The rival flame collapses.' : 'Your flame gutters out.');
      emit?.('end', state.winner);
    }
    return state.winner;
  }

  function startGame() {
    state.turn = 1;
    state.active = 'player';
    state.phase = 'play';
    state.winner = null;
    state.log = [];
    state.lastActionId = 0;
    state.player = makePlayer('You');
    state.rival = makePlayer('Rival', true);
    for (let i = 0; i < 5; i++) draw('player');
    for (let i = 0; i < 5; i++) draw('rival');
    beginTurn('player');
    emit?.('start', snapshot());
  }

  function beginTurn(side) {
    if (state.winner) return;
    state.active = side;
    const p = sideObj(side);
    p.maxEmber = Math.min(MAX_EMBER, p.maxEmber + 1);
    p.ember = p.maxEmber;
    if (p.emberDrainNext > 0) {
      const drain = Math.min(p.ember, p.emberDrainNext);
      p.ember -= drain;
      log(`${p.name === 'You' ? 'Smoke Veil drains' : 'Smoke Veil drains'} ${drain} ember from ${p.name === 'You' ? 'you' : 'the rival'}.`);
      p.emberDrainNext = 0;
    }
    if (!(state.turn === 1 && side === 'player')) {
      draw(side, 1);
    }
    log(`${p.name === 'You' ? 'Your' : "Rival's"} turn begins (${p.ember}/${p.maxEmber} ember).`);
    emit?.('turn', side);
  }

  function canPlay(side, cardUid) {
    if (state.winner || state.phase !== 'play') return false;
    if (state.active !== side) return false;
    const p = sideObj(side);
    const card = p.hand.find((c) => c.uid === cardUid);
    if (!card) return false;
    if (card.cost > p.ember) return false;
    if (card.type === 'creature' && p.field.length >= 5) return false;
    return true;
  }

  function playCard(side, cardUid) {
    if (!canPlay(side, cardUid)) return false;
    const p = sideObj(side);
    const idx = p.hand.findIndex((c) => c.uid === cardUid);
    const card = p.hand.splice(idx, 1)[0];
    p.ember -= card.cost;
    log(`${p.name === 'You' ? 'You play' : 'Rival plays'} ${card.name}.`);

    if (card.type === 'spell') {
      resolveSpell(side, card);
    } else {
      p.field.push(card);
      if (card.onPlay) resolveEffect(side, card.onPlay, card);
    }
    emit?.('play', { side, card: cloneCardForLog(card) });
    checkWinner();
    return true;
  }

  function resolveSpell(side, card) {
    if (card.effect) resolveEffect(side, card.effect, card);
  }

  function resolveEffect(side, effect, sourceCard) {
    const self = side;
    const rival = side === 'player' ? 'rival' : 'player';
    const targetSide = effect.target === 'self' ? self : effect.target === 'rival' ? rival : self;
    switch (effect.kind) {
      case 'damageFace':
        dealDamage(targetSide, effect.amount, `${sourceCard.name} deals ${effect.amount} damage to ${sideObj(targetSide).name === 'You' ? 'you' : 'the rival'}.`);
        break;
      case 'heal':
        heal(targetSide, effect.amount);
        break;
      case 'armor':
        gainArmor(targetSide, effect.amount);
        break;
      case 'emberDrain':
        applyEmberDrain(targetSide, effect.amount);
        break;
      case 'draw':
        draw(self, effect.amount);
        break;
      default:
        break;
    }
  }

  function getShells(side) {
    return sideObj(side).field.filter((c) => c.shell && c.health > 0);
  }

  function creaturesAttack(attackerSide) {
    if (state.winner) return;
    const attacker = sideObj(attackerSide);
    const defenderSide = attackerSide === 'player' ? 'rival' : 'player';
    const defender = sideObj(defenderSide);
    const creatures = attacker.field.slice();
    for (const creature of creatures) {
      if (state.winner) break;
      if (!attacker.field.find((c) => c.uid === creature.uid) || creature.health <= 0) continue;
      const strikes = creature.strikes || 1;
      for (let s = 0; s < strikes; s++) {
        if (state.winner) break;
        if (!attacker.field.find((c) => c.uid === creature.uid) || creature.health <= 0) break;
        const shells = getShells(defenderSide);
        if (shells.length > 0) {
          const target = shells[0];
          target.health -= creature.attack;
          log(`${creature.name} hits ${target.name} for ${creature.attack}.`);
          if (target.health <= 0) {
            defender.field = defender.field.filter((c) => c.uid !== target.uid);
            log(`${target.name} crumbles.`);
          }
        } else {
          dealDamage(defenderSide, creature.attack, `${creature.name} strikes ${defender.name === 'You' ? 'you' : 'the rival'} for ${creature.attack}.`);
        }
        emit?.('attack', { attacker: creature.name, side: attackerSide });
      }
    }
    cleanupDead();
    checkWinner();
  }

  function cleanupDead() {
    state.player.field = state.player.field.filter((c) => c.health > 0);
    state.rival.field = state.rival.field.filter((c) => c.health > 0);
  }

  function endTurn(side) {
    if (state.winner || state.phase !== 'play') return false;
    if (state.active !== side) return false;
    log(`${side === 'player' ? 'You end' : 'Rival ends'} the turn.`);
    creaturesAttack(side);
    if (state.winner) return true;
    if (side === 'player') {
      state.turn += 1;
      beginTurn('rival');
      emit?.('rivalStart');
    } else {
      beginTurn('player');
    }
    emit?.('update', snapshot());
    return true;
  }

  function snapshot() {
    return JSON.parse(JSON.stringify({
      turn: state.turn,
      active: state.active,
      phase: state.phase,
      winner: state.winner,
      log: state.log,
      player: state.player,
      rival: state.rival,
    }));
  }

  function debugLife(playerLife, rivalLife) {
    if (typeof playerLife === 'number') state.player.life = playerLife;
    if (typeof rivalLife === 'number') state.rival.life = rivalLife;
    checkWinner();
    emit?.('update', snapshot());
    return snapshot();
  }

  function debugWin() {
    state.rival.life = 0;
    checkWinner();
    emit?.('update', snapshot());
  }

  function debugLoss() {
    state.player.life = 0;
    checkWinner();
    emit?.('update', snapshot());
  }

  return {
    state,
    startGame,
    playCard,
    canPlay,
    endTurn,
    draw,
    snapshot,
    debugLife,
    debugWin,
    debugLoss,
    checkWinner,
  };
}
