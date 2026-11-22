export const CARD_DEFS = [
  {
    id: 'cinder-imp',
    name: 'Cinder Imp',
    cost: 1,
    type: 'creature',
    attack: 2,
    health: 1,
    text: 'A quick spark flung from the ember pits.',
    art: 'imp',
  },
  {
    id: 'ash-hound',
    name: 'Ash Hound',
    cost: 2,
    type: 'creature',
    attack: 3,
    health: 2,
    text: 'It hunts through smoke and cinders.',
    art: 'hound',
  },
  {
    id: 'basalt-turtle',
    name: 'Basalt Turtle',
    cost: 2,
    type: 'creature',
    attack: 1,
    health: 4,
    text: 'Shell: rivals must attack it first.',
    shell: true,
    art: 'turtle',
  },
  {
    id: 'flame-dart',
    name: 'Flame Dart',
    cost: 1,
    type: 'spell',
    text: 'Deal 3 damage to the rival face.',
    effect: { kind: 'damageFace', amount: 3, target: 'rival' },
    art: 'dart',
  },
  {
    id: 'kiln-golem',
    name: 'Kiln Golem',
    cost: 4,
    type: 'creature',
    attack: 4,
    health: 4,
    text: 'Fired clay given wrath and weight.',
    art: 'golem',
  },
  {
    id: 'soot-drake',
    name: 'Soot Drake',
    cost: 5,
    type: 'creature',
    attack: 5,
    health: 4,
    text: 'Its wings scatter choking black embers.',
    art: 'drake',
  },
  {
    id: 'hearth-ward',
    name: 'Hearth Ward',
    cost: 3,
    type: 'spell',
    text: 'Gain +5 armor.',
    effect: { kind: 'armor', amount: 5, target: 'self' },
    art: 'ward',
  },
  {
    id: 'magma-witch',
    name: 'Magma Witch',
    cost: 3,
    type: 'creature',
    attack: 2,
    health: 3,
    text: 'Strikes twice when attacking.',
    strikes: 2,
    art: 'witch',
  },
  {
    id: 'coalsprite',
    name: 'Coalsprite',
    cost: 1,
    type: 'creature',
    attack: 1,
    health: 1,
    text: 'Draw a card when played.',
    onPlay: { kind: 'draw', amount: 1 },
    art: 'sprite',
  },
  {
    id: 'furnace-colossus',
    name: 'Furnace Colossus',
    cost: 6,
    type: 'creature',
    attack: 6,
    health: 6,
    text: 'The old furnace walks again.',
    art: 'colossus',
  },
  {
    id: 'smoke-veil',
    name: 'Smoke Veil',
    cost: 2,
    type: 'spell',
    text: 'Rival loses 3 ember next turn.',
    effect: { kind: 'emberDrain', amount: 3, target: 'rival' },
    art: 'veil',
  },
  {
    id: 'pyre-bloom',
    name: 'Pyre Bloom',
    cost: 3,
    type: 'spell',
    text: 'Heal 5 life.',
    effect: { kind: 'heal', amount: 5, target: 'self' },
    art: 'bloom',
  },
];

export const CARD_MAP = Object.fromEntries(CARD_DEFS.map((c) => [c.id, c]));

const DECK_RECIPE = [
  ['cinder-imp', 2],
  ['ash-hound', 2],
  ['basalt-turtle', 2],
  ['flame-dart', 2],
  ['kiln-golem', 2],
  ['soot-drake', 1],
  ['hearth-ward', 1],
  ['magma-witch', 2],
  ['coalsprite', 2],
  ['furnace-colossus', 1],
  ['smoke-veil', 1],
  ['pyre-bloom', 2],
];

let uid = 1;
export function makeCard(id) {
  const def = CARD_MAP[id];
  return {
    uid: uid++,
    defId: def.id,
    name: def.name,
    cost: def.cost,
    type: def.type,
    attack: def.attack ?? 0,
    health: def.health ?? 0,
    maxHealth: def.health ?? 0,
    text: def.text,
    art: def.art,
    shell: !!def.shell,
    strikes: def.strikes || 1,
    effect: def.effect || null,
    onPlay: def.onPlay || null,
  };
}

export function buildDeck() {
  const deck = [];
  for (const [id, count] of DECK_RECIPE) {
    for (let i = 0; i < count; i++) deck.push(makeCard(id));
  }
  return deck;
}

export function resetCardUid() {
  uid = 1;
}

export function shuffle(arr, rng = Math.random) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}
