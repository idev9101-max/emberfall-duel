const ART_SVG = {
  imp: `<svg viewBox="0 0 64 64"><path d="M32 10 L38 22 L52 20 L44 32 L54 44 L38 42 L32 54 L26 42 L10 44 L20 32 L12 20 L26 22 Z" fill="#ff7040"/><circle cx="26" cy="30" r="3" fill="#2b0b05"/><circle cx="38" cy="30" r="3" fill="#2b0b05"/><path d="M24 38 Q32 44 40 38" stroke="#2b0b05" stroke-width="2" fill="none"/></svg>`,
  hound: `<svg viewBox="0 0 64 64"><path d="M10 42 L18 24 L30 18 L40 22 L54 34 L50 46 L12 46 Z" fill="#c44a2a"/><path d="M18 24 L10 14 L22 20" fill="#ff8a50"/><circle cx="36" cy="30" r="2.5" fill="#1d0906"/><path d="M40 38 L50 40 L40 42" fill="#ffb070"/></svg>`,
  turtle: `<svg viewBox="0 0 64 64"><ellipse cx="32" cy="36" rx="22" ry="14" fill="#5a4a42"/><path d="M14 34 Q32 18 50 34" fill="#7a6558" stroke="#d9b26c" stroke-width="2"/><path d="M32 22 V48 M20 28 L44 44 M44 28 L20 44" stroke="#d9b26c" stroke-width="1.5"/><circle cx="50" cy="36" r="4" fill="#6b564a"/></svg>`,
  dart: `<svg viewBox="0 0 64 64"><path d="M32 6 L38 24 L58 32 L38 40 L32 58 L26 40 L6 32 L26 24 Z" fill="#ff5a2a"/><path d="M32 16 L35 28 L48 32 L35 36 L32 48 L29 36 L16 32 L29 28 Z" fill="#ffd07a"/></svg>`,
  golem: `<svg viewBox="0 0 64 64"><rect x="18" y="14" width="28" height="18" rx="4" fill="#8a5a3a"/><rect x="14" y="30" width="36" height="24" rx="5" fill="#70462d"/><rect x="22" y="36" width="8" height="8" fill="#ff9a40"/><rect x="34" y="36" width="8" height="8" fill="#ff9a40"/></svg>`,
  drake: `<svg viewBox="0 0 64 64"><path d="M8 40 L24 24 L32 28 L40 24 L56 40 L44 38 L32 52 L20 38 Z" fill="#503040"/><path d="M32 28 L32 52" stroke="#ff7040" stroke-width="2"/><circle cx="27" cy="30" r="2" fill="#ff9a5a"/><circle cx="37" cy="30" r="2" fill="#ff9a5a"/></svg>`,
  ward: `<svg viewBox="0 0 64 64"><path d="M32 8 L50 16 V32 C50 44 42 52 32 58 C22 52 14 44 14 32 V16 Z" fill="#a44a1d" stroke="#ffd27a" stroke-width="2"/><path d="M32 18 V46 M22 30 H42" stroke="#ffd27a" stroke-width="3"/></svg>`,
  witch: `<svg viewBox="0 0 64 64"><path d="M32 10 C24 10 18 16 18 24 C18 30 22 34 26 36 L22 54 H42 L38 36 C42 34 46 30 46 24 C46 16 40 10 32 10 Z" fill="#922f45"/><path d="M18 24 L32 4 L46 24" fill="#d94d2a"/><circle cx="27" cy="25" r="2.5" fill="#ffd27a"/><circle cx="37" cy="25" r="2.5" fill="#ffd27a"/></svg>`,
  sprite: `<svg viewBox="0 0 64 64"><circle cx="32" cy="28" r="12" fill="#ff8b3d"/><path d="M32 40 L24 54 L32 48 L40 54 Z" fill="#ffb347"/><circle cx="28" cy="26" r="2" fill="#2b0b05"/><circle cx="36" cy="26" r="2" fill="#2b0b05"/></svg>`,
  colossus: `<svg viewBox="0 0 64 64"><rect x="20" y="8" width="24" height="16" rx="3" fill="#7a3d22"/><rect x="14" y="24" width="36" height="30" rx="4" fill="#5b2d1b"/><path d="M24 32 H40 V44 H24 Z" fill="#ff6a2a"/><rect x="10" y="28" width="6" height="18" rx="2" fill="#6b3520"/><rect x="48" y="28" width="6" height="18" rx="2" fill="#6b3520"/></svg>`,
  veil: `<svg viewBox="0 0 64 64"><path d="M12 20 Q32 8 52 20 V44 Q32 56 12 44 Z" fill="#5a4a57"/><path d="M20 26 Q32 20 44 26 M20 34 Q32 28 44 34 M20 42 Q32 36 44 42" stroke="#b8a8c0" stroke-width="2" fill="none"/></svg>`,
  bloom: `<svg viewBox="0 0 64 64"><circle cx="32" cy="32" r="8" fill="#ffd27a"/><path d="M32 8 L36 22 L32 26 L28 22 Z" fill="#ff7040"/><path d="M56 32 L42 36 L38 32 L42 28 Z" fill="#ff7040"/><path d="M32 56 L28 42 L32 38 L36 42 Z" fill="#ff7040"/><path d="M8 32 L22 28 L26 32 L22 36 Z" fill="#ff7040"/><path d="M48 16 L38 24 L34 22 L40 14 Z" fill="#ff8a40"/><path d="M48 48 L40 50 L38 46 L46 40 Z" fill="#ff8a40"/><path d="M16 48 L18 40 L22 42 L24 50 Z" fill="#ff8a40"/><path d="M16 16 L24 14 L26 18 L18 24 Z" fill="#ff8a40"/></svg>`,
};

function artMarkup(art) {
  return ART_SVG[art] || ART_SVG.imp;
}

function cardInner(card, opts = {}) {
  const inHand = !!opts.inHand;
  const playable = !!opts.playable;
  const typeClass = card.type === 'spell' ? 'spell-card' : 'creature-card';
  const shellBadge = card.shell ? '<span class="badge shell-badge">Shell</span>' : '';
  const strikesBadge = card.strikes > 1 ? '<span class="badge strike-badge">x2</span>' : '';
  const drawBadge = card.onPlay?.kind === 'draw' ? '<span class="badge draw-badge">Draw</span>' : '';
  const stats = card.type === 'creature'
    ? `<div class="card-stats">
        <span class="stat atk"><svg viewBox="0 0 16 16" class="ico"><path d="M8 1 L10 5 L14 5 L11 8 L12 13 L8 10 L4 13 L5 8 L2 5 L6 5 Z" fill="currentColor"/></svg>${card.attack}</span>
        <span class="stat hp"><svg viewBox="0 0 16 16" class="ico"><path d="M8 14 C3 10 1 7 3 4 C4.5 2 7 2.5 8 4 C9 2.5 11.5 2 13 4 C15 7 13 10 8 14 Z" fill="currentColor"/></svg>${card.health}</span>
      </div>`
    : `<div class="card-stats spell-stats"><span class="stat spell-label">SPELL</span></div>`;
  return `
    <div class="card ${typeClass} ${inHand ? 'hand-card' : 'field-card'} ${playable ? 'playable' : ''} ${card.health <= 0 ? 'dead' : ''}" data-uid="${card.uid}" data-card-id="${card.defId}">
      <div class="card-cost">${card.cost}</div>
      <div class="card-frame">
        <div class="card-name">${card.name}</div>
        <div class="card-art art-${card.art}">${artMarkup(card.art)}</div>
        <div class="card-type-line">${card.type === 'creature' ? 'Creature' : 'Spell'} ${shellBadge}${strikesBadge}${drawBadge}</div>
        <div class="card-text">${card.text}</div>
        ${stats}
      </div>
    </div>`;
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

export function render(state, ui) {
  document.getElementById('rival-life').textContent = state.rival.life;
  document.getElementById('rival-armor').textContent = state.rival.armor;
  document.getElementById('rival-ember').textContent = `${state.rival.ember}/${state.rival.maxEmber}`;
  document.getElementById('rival-hand-count').textContent = state.rival.hand.length;
  document.getElementById('rival-deck-count').textContent = state.rival.deck.length;

  document.getElementById('player-life').textContent = state.player.life;
  document.getElementById('player-armor').textContent = state.player.armor;
  document.getElementById('player-ember').textContent = `${state.player.ember}/${state.player.maxEmber}`;

  const turnBanner = document.getElementById('turn-banner');
  if (state.winner) {
    turnBanner.textContent = state.winner === 'win' ? 'Victory' : 'Defeat';
  } else if (state.active === 'player') {
    turnBanner.textContent = 'Your Ember Rises';
    turnBanner.className = 'turn-banner player-turn';
  } else {
    turnBanner.textContent = "Rival's Ember Burns";
    turnBanner.className = 'turn-banner rival-turn';
  }

  const rivalField = document.getElementById('rival-field');
  rivalField.innerHTML = state.rival.field.map((c) => cardInner(c)).join('');

  const playerField = document.getElementById('player-field');
  playerField.innerHTML = state.player.field.map((c) => cardInner(c)).join('');

  const hand = document.getElementById('player-hand');
  hand.innerHTML = state.player.hand.map((c) => {
    const playable = state.active === 'player' && !state.winner && c.cost <= state.player.ember && (c.type !== 'creature' || state.player.field.length < 5);
    return cardInner(c, { inHand: true, playable });
  }).join('');

  const log = document.getElementById('turn-log');
  log.innerHTML = state.log.slice(0, 8).map((e) => `<li><span class="log-turn">T${e.turn}</span> ${escapeHtml(e.msg)}</li>`).join('');

  const endBtn = document.getElementById('btn-end-turn');
  endBtn.disabled = state.active !== 'player' || !!state.winner;
  endBtn.textContent = state.active === 'player' ? 'End Turn' : 'Rival Turn...';

  bindCardHandlers(ui, state);
}

function bindCardHandlers(ui, state) {
  document.querySelectorAll('#player-hand .hand-card').forEach((el) => {
    const uid = Number(el.dataset.uid);
    el.addEventListener('click', () => ui.onPlayCard(uid));
    el.addEventListener('mouseenter', (e) => showTooltip(e.currentTarget, uid, state));
    el.addEventListener('mouseleave', hideTooltip);
  });
  document.querySelectorAll('.field-card').forEach((el) => {
    const uid = Number(el.dataset.uid);
    el.addEventListener('mouseenter', (e) => showTooltip(e.currentTarget, uid, state));
    el.addEventListener('mouseleave', hideTooltip);
  });
}

function findCard(state, uid) {
  for (const p of [state.player, state.rival]) {
    for (const zone of [p.hand, p.field]) {
      const c = zone.find((x) => x.uid === uid);
      if (c) return c;
    }
  }
  return null;
}

function showTooltip(target, uid, state) {
  const card = findCard(state, uid);
  const tip = document.getElementById('tooltip');
  if (!card || !tip) return;
  const stats = card.type === 'creature' ? `Atk ${card.attack} / HP ${card.health}${card.maxHealth && card.maxHealth !== card.health ? ` (max ${card.maxHealth})` : ''}` : 'Spell';
  tip.innerHTML = `<div class="tip-name">${card.name}</div><div class="tip-meta">Cost ${card.cost} Ember &middot; ${stats}</div><div class="tip-text">${card.text}</div>`;
  tip.classList.remove('hidden');
  const rect = target.getBoundingClientRect();
  const tipRect = tip.getBoundingClientRect();
  let left = rect.left + rect.width / 2 - 140;
  let top = rect.top - 10;
  if (left < 8) left = 8;
  if (left + 280 > window.innerWidth - 8) left = window.innerWidth - 288;
  if (top < 100) top = rect.bottom + 8;
  else top = rect.top - (tip.offsetHeight || 120) - 8;
  tip.style.left = `${left}px`;
  tip.style.top = `${Math.max(8, top)}px`;
}

function hideTooltip() {
  document.getElementById('tooltip')?.classList.add('hidden');
}
