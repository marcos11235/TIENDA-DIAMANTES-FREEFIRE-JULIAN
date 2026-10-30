import { PlayerVerificationResult } from '../types';

// Curated verified nicknames for known sample IDs
const KNOWN_PLAYERS: Record<string, Partial<PlayerVerificationResult>> = {
  '1289471928': {
    nickname: '亗ＴＯＸＩＣＯ亗',
    region: 'LATAM (Sudamérica)',
    level: 74,
    likes: 18450,
    guildName: 'LOS_DIOSES™',
  },
  '8492019482': {
    nickname: '꧁ঔৣ☬NOOB_PRO☬ঔৣ꧂',
    region: 'EE.UU. / Norteamérica',
    level: 68,
    likes: 9210,
    guildName: 'FUEGO_ROYALE',
  },
  '3910482019': {
    nickname: '⚡Vampiro_FF亗',
    region: 'LATAM (Sudamérica)',
    level: 79,
    likes: 31200,
    guildName: 'CLAN_LEGENDARIO',
  },
  '5519402847': {
    nickname: '✿S U P R E M A✿',
    region: 'Brasil',
    level: 63,
    likes: 12400,
    guildName: 'VALQUIRIAS',
  },
  '9948271044': {
    nickname: '乂K I L L E R乂',
    region: 'LATAM (Sudamérica)',
    level: 71,
    likes: 15300,
    guildName: 'ELITE_SQUAD',
  },
};

const NICK_PREFIXES = ['亗', '꧁', '⚡', '✿', '乂', '✪', '†', '★', '★Vip★', 'FF_'];
const NICK_ROOTS = [
  'Ghost', 'Shadow', 'Furia', 'Sniper', 'Titan', 'Draco', 'Cobra', 'Spartan',
  'Diablo', 'Fénix', 'Vortex', 'Alok', 'Chrono', 'Lobo', 'Kakaroto', 'Rey'
];
const NICK_SUFFIXES = ['亗', '꧂', '™', '亗FF', '✓', 'PRO', '999', 'xX'];

// Deterministic hash based on ID digits
function deterministicHash(id: string): number {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = (hash << 5) - hash + id.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

export async function verifyPlayerId(playerId: string): Promise<PlayerVerificationResult> {
  const cleanId = playerId.trim().replace(/\D/g, '');

  if (!cleanId || cleanId.length < 6 || cleanId.length > 12) {
    throw new Error('El ID de jugador debe contener entre 6 y 12 dígitos numéricos válidos.');
  }

  // Artificial network latency simulation for realistic API feel (400ms - 800ms)
  await new Promise((resolve) => setTimeout(resolve, 550));

  if (KNOWN_PLAYERS[cleanId]) {
    const known = KNOWN_PLAYERS[cleanId];
    return {
      playerId: cleanId,
      nickname: known.nickname || 'Jugador FF',
      region: known.region || 'LATAM (Sudamérica)',
      level: known.level || 65,
      likes: known.likes || 8500,
      guildName: known.guildName,
      verifiedAt: new Date().toISOString(),
    };
  }

  // Generate deterministic details based on numeric ID
  const hash = deterministicHash(cleanId);
  const pIndex = hash % NICK_PREFIXES.length;
  const rIndex = (hash >> 3) % NICK_ROOTS.length;
  const sIndex = (hash >> 6) % NICK_SUFFIXES.length;
  const level = 35 + (hash % 45); // Level between 35 and 79
  const likes = 800 + (hash % 24500);

  const regions: PlayerVerificationResult['region'][] = [
    'LATAM (Sudamérica)',
    'EE.UU. / Norteamérica',
    'LATAM (Sudamérica)',
    'Brasil',
  ];
  const region = regions[hash % regions.length];

  const generatedNickname = `${NICK_PREFIXES[pIndex]}${NICK_ROOTS[rIndex]}_${sIndex > 4 ? cleanId.slice(-3) : ''}${NICK_SUFFIXES[sIndex]}`;

  return {
    playerId: cleanId,
    nickname: generatedNickname,
    region,
    level,
    likes,
    guildName: `Clan #${cleanId.slice(0, 4)}`,
    verifiedAt: new Date().toISOString(),
  };
}
