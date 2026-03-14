/* ═══════════════════════════════════════════════════════════
   GALACTIC DOMINION — Foundation Era  |  game.js
   Part 1: PRNG, Constants, Data Tables
   ═══════════════════════════════════════════════════════════ */
'use strict';

// ─── SEEDED PRNG (Mulberry32) ────────────────────────────────
let _seed = 0;
function seedRng(s) { _seed = s >>> 0; }
function rand() {
  _seed += 0x6D2B79F5;
  let t = _seed;
  t = Math.imul(t ^ (t >>> 15), t | 1);
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
}
function randInt(min, max) { return Math.floor(rand() * (max - min + 1)) + min; }
function pick(arr) { return arr[Math.floor(rand() * arr.length)]; }
function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// ─── GALAXY SIZE CONFIG ──────────────────────────────────────
const GALAXY_SIZES = {
  small:  { systems: 120, factions: 6,  w: 2400, h: 2400 },
  medium: { systems: 250, factions: 10, w: 3600, h: 3600 },
  large:  { systems: 500, factions: 16, w: 5200, h: 5200 },
  epic:   { systems: 1000,factions: 24, w: 8000, h: 8000 },
};

const SPEED_MS = { slow: 8000, normal: 5000, fast: 2500 };

// ─── SHIP STATS ──────────────────────────────────────────────
const SHIP = {
  frigate:     { attack:8,   defense:5,  hp:10, speed:3, creditCost:20,  mineralCost:10, label:'Frigate' },
  destroyer:   { attack:22,  defense:15, hp:28, speed:2, creditCost:50,  mineralCost:25, label:'Destroyer' },
  cruiser:     { attack:60,  defense:50, hp:80, speed:2, creditCost:150, mineralCost:60, label:'Cruiser' },
  dreadnought: { attack:180, defense:150,hp:250,speed:1, creditCost:400, mineralCost:150,label:'Dreadnought' },
};
const SHIP_KEYS = ['frigate','destroyer','cruiser','dreadnought'];

// ─── STAR TYPES ──────────────────────────────────────────────
const STAR_TYPES = [
  { name:'Yellow Dwarf', color:'#fff9c4', glowColor:'#ffe082', radius:5, freq:30, creditMod:1.0, mineralMod:1.0, foodMod:1.2, researchMod:1.0 },
  { name:'Red Giant',    color:'#ef9a9a', glowColor:'#e57373', radius:8, freq:15, creditMod:0.8, mineralMod:1.4, foodMod:0.6, researchMod:0.9 },
  { name:'Blue Star',    color:'#90caf9', glowColor:'#64b5f6', radius:6, freq:12, creditMod:1.2, mineralMod:0.8, foodMod:0.8, researchMod:1.5 },
  { name:'White Dwarf',  color:'#f5f5f5', glowColor:'#eeeeee', radius:3, freq:18, creditMod:0.9, mineralMod:1.1, foodMod:0.9, researchMod:1.2 },
  { name:'Pulsar',       color:'#ce93d8', glowColor:'#ba68c8', radius:4, freq:8,  creditMod:0.7, mineralMod:0.9, foodMod:0.4, researchMod:2.0 },
  { name:'Neutron Star', color:'#b0bec5', glowColor:'#90a4ae', radius:3, freq:7,  creditMod:0.6, mineralMod:1.8, foodMod:0.2, researchMod:1.4 },
  { name:'Orange Giant', color:'#ffcc80', glowColor:'#ffa726', radius:7, freq:10, creditMod:1.1, mineralMod:1.2, foodMod:1.0, researchMod:0.8 },
];

// ─── PLANET TYPES ────────────────────────────────────────────
const PLANET_TYPES = [
  { name:'Terran',       icon:'🌍', creditMod:1.5, mineralMod:0.8, foodMod:2.0, researchMod:1.2, rare:false },
  { name:'Desert',       icon:'🏜', creditMod:0.8, mineralMod:1.6, foodMod:0.3, researchMod:0.7, rare:false },
  { name:'Ocean',        icon:'🌊', creditMod:1.2, mineralMod:0.5, foodMod:1.8, researchMod:1.0, rare:false },
  { name:'Volcanic',     icon:'🌋', creditMod:0.5, mineralMod:2.5, foodMod:0.1, researchMod:0.8, rare:false },
  { name:'Frozen',       icon:'❄', creditMod:0.6, mineralMod:1.3, foodMod:0.4, researchMod:1.1, rare:false },
  { name:'Gas Giant',    icon:'🪐', creditMod:0.4, mineralMod:0.6, foodMod:0.0, researchMod:0.5, rare:false },
  { name:'Jungle',       icon:'🌿', creditMod:1.0, mineralMod:0.7, foodMod:2.2, researchMod:1.5, rare:false },
  { name:'Barren',       icon:'⬜', creditMod:0.3, mineralMod:1.1, foodMod:0.1, researchMod:0.4, rare:false },
  { name:'Crystal',      icon:'💎', creditMod:2.0, mineralMod:1.8, foodMod:0.2, researchMod:1.8, rare:true  },
  { name:'Precursor',    icon:'🔮', creditMod:1.5, mineralMod:1.0, foodMod:0.5, researchMod:3.0, rare:true  },
];

// ─── FACTION COLORS (24 distinct) ───────────────────────────
const FACTION_COLORS = [
  '#4fc3f7','#ef5350','#66bb6a','#ffa726','#ab47bc',
  '#26c6da','#ff7043','#9ccc65','#ec407a','#5c6bc0',
  '#26a69a','#d4e157','#f06292','#42a5f5','#ff8f00',
  '#00e676','#aa00ff','#ff1744','#00b0ff','#76ff03',
  '#ffd740','#e040fb','#40c4ff','#69f0ae',
];

// ─── NAME POOLS ──────────────────────────────────────────────
const SYSTEM_NAMES = [
  'Trantor','Terminus','Helicon','Anacreon','Smyrno','Daribow','Askone',
  'Korell','Kalgan','Siwenna','Florinia','Santanni','Vincetori','Rossem',
  'Tazenda','Arcadia','Lyonesse','Vega Prime','Orion Reach','Cygnus Deep',
  'Procyon','Arcturus','Deneb','Altair','Rigel','Sirius','Betelgeuse',
  'Castor','Pollux','Aldebaran','Spica','Antares','Fomalhaut','Capella',
  'Merak','Dubhe','Algorab','Zavijava','Zaniah','Vindemiatrix','Tureis',
  'Mira','Algol','Mirach','Sheratan','Hamal','Mesartim','Botein','Segin',
  'Navi','Schedar','Achird','Caph','Ruchbah','Iota Cas','Alfirk','Sadira',
  'Vox Maxima','Eternal Reach','Deep Horizon','Shattered Vale','Nexus Point',
  'Iron Gate','Storm Veil','Pale Ember','Dark Meridian','Twilight Forge',
  'The Expanse','Void Anchor','Ember Crown','Shining Bastion','Last Light',
  'Grey Frontier','Crimson Tide','Silent Shore','Fractured Ring','Apex Node',
  'Helios Gate','Aether Cross','Nether Deep','Solar Vein','Warp Junction',
  'Echo Drift','Phantom Ridge','Gravitas','Tesseract','Axiom','Entropy Vale',
  'Paradox Rim','Event Node','Quantum Shore','Singularity','Praxis',
  'Logos Prime','Ethos Deep','Pathos Reach','Kairos','Chronos',
  'Hyperion','Prometheus','Epimetheus','Theia','Phoebe','Rhea',
  'Oberon','Titania','Umbriel','Ariel','Miranda','Caliban','Sycorax',
  'Io Prime','Ganymede Major','Callisto Deep','Europa Reach','Amalthea',
  'Ananke','Carme','Elara','Himalia','Leda','Lysithea','Pasiphae','Sinope',
  'Adrastea','Metis','Thebe','Amalthea','Eos','Helene','Telesto','Calypso',
  'Dione','Tethys','Mimas','Enceladus','Hyperion','Iapetus','Phoebe II',
  'Arche','Autonoe','Hegemone','Helike','Mneme','Aoede','Thelxinoe',
  'Megaclite','Taygete','Chaldene','Harpalyke','Kalyke','Iocaste','Erinome',
  'Isonoe','Praxidike','Aitne','Thyone','Euanthe','Hegemone II','Philophrosyne',
  'Eupheme','Helike II','Orthosie','Sponde','Kale','Pasithee','Hegemone III',
  'Ananke II','Herse','Dia','Ersa','Pandia','Philophrosyne II',
  'Aesacus','Ajax Prime','Anchises Deep','Antenor','Astyanax','Caieta',
  'Crantor','Eurybates','Hektor','Iphitus','Paris Gate','Polydoros',
  'Sarpedon','Troilus','Deiphobus','Glaucus','Hicetaon','Meges',
];

const WARLORD_NAMES = [
  'Hari Seldon','Salvor Hardin','Hober Mallow','The Mule','Bayta Darell',
  'Arkady Darell','Preem Palver','Quoriana','Golan Trevize','Janov Pelorat',
  'Bliss Fallom','Stor Gendibal','Quoriana Agranov','Delarmi','Kendow',
  'Linge Chen','Raych Seldon','Dors Venabili','R. Daneel Olivaw','Cleon II',
  'Zephyros','Valdris','Marek Vorn','Ilara Kesk','Thrax','Brennan',
  'Cordova','Yevgenia','Talos','Kaela','Morrigan','Stentor','Vayne',
  'Duskara','Orin Fell','Sable Cross','Iron Voss','Mirela','Harkon',
  'The Architect','Praxis','Axiom','Vector Prime','Null','Sigma',
];

const FACTION_NAMES = [
  'Foundation Compact','Imperial Remnants','Outer Reaches Alliance','Iron Concordat',
  'Stellar Hegemony','Void Brotherhood','Crimson Dominion','The Enclave',
  'Merchant Princes','Technocratic Union','Silent Order','Warp Collective',
  'Apex Confederation','Fracture League','Pale Empire','Deep Core Authority',
  'Nether Syndicate','Solarian Pact','Vanguard Coalition','Eternal Throne',
  'Horizon Mandate','Last Bastion','Nova Republic','Precursor Cult',
];

// ─── AI PERSONALITIES ────────────────────────────────────────
// weights: expand, attack, defend, trade, research, spy, ally
const AI_PERSONALITIES = {
  militarist: { label:'Militarist', wExpand:0.6,wAttack:0.9,wDefend:0.7,wTrade:0.2,wResearch:0.3,wSpy:0.3,wAlly:0.2, fleetBias:2.0, desc:'Conquest-focused, builds large fleets, declares war readily.' },
  economist:  { label:'Economist',  wExpand:0.5,wAttack:0.3,wDefend:0.5,wTrade:0.9,wResearch:0.6,wSpy:0.4,wAlly:0.6, fleetBias:0.7, desc:'Trade-focused, builds wealth, prefers negotiation.' },
  scientist:  { label:'Scientist',  wExpand:0.4,wAttack:0.2,wDefend:0.4,wTrade:0.5,wResearch:1.0,wSpy:0.5,wAlly:0.5, fleetBias:0.8, desc:'Technology-first, achieves breakthroughs, avoids early conflict.' },
  diplomat:   { label:'Diplomat',   wExpand:0.4,wAttack:0.2,wDefend:0.6,wTrade:0.7,wResearch:0.5,wSpy:0.3,wAlly:1.0, fleetBias:0.6, desc:'Alliance builder, manipulates relationships, united fronts.' },
  shadow:     { label:'Shadow',     wExpand:0.5,wAttack:0.5,wDefend:0.4,wTrade:0.4,wResearch:0.6,wSpy:1.0,wAlly:0.4, fleetBias:0.9, desc:'Espionage-driven, backstabs allies, hidden operations.' },
  expansionist:{ label:'Expansionist',wExpand:1.0,wAttack:0.5,wDefend:0.3,wTrade:0.4,wResearch:0.5,wSpy:0.2,wAlly:0.3,fleetBias:1.2, desc:'Rapid coloniser, stretches borders, thin defense.' },
};
const PERSONALITY_KEYS = Object.keys(AI_PERSONALITIES);

// ─── TECHNOLOGY TREE (5 branches × 5 tiers) ─────────────────
// effect: object applied to faction.techMods on research completion
const TECH_TREE = [
  // ── MILITARY BRANCH ──
  { id:'mil1', branch:'Military', name:'Improved Targeting',    tier:1, cost:60,  prereq:null,   icon:'🎯', effect:{ attackBonus:0.10 }, desc:'Fleet attack +10%.' },
  { id:'mil2', branch:'Military', name:'Heavy Armor Plating',   tier:2, cost:120, prereq:'mil1', icon:'🛡', effect:{ defenseBonus:0.15 }, desc:'Fleet defense +15%.' },
  { id:'mil3', branch:'Military', name:'Warp Drives',           tier:3, cost:200, prereq:'mil2', icon:'⚡', effect:{ speedBonus:1 },      desc:'All fleets +1 speed.' },
  { id:'mil4', branch:'Military', name:'Plasma Weaponry',       tier:4, cost:320, prereq:'mil3', icon:'🔥', effect:{ attackBonus:0.25 }, desc:'Fleet attack +25%.' },
  { id:'mil5', branch:'Military', name:'Singularity Cannons',   tier:5, cost:500, prereq:'mil4', icon:'💥', effect:{ attackBonus:0.40, defenseBonus:0.20 }, desc:'Devastating firepower.' },
  // ── ECONOMY BRANCH ──
  { id:'eco1', branch:'Economy',  name:'Trade Protocols',       tier:1, cost:60,  prereq:null,   icon:'📈', effect:{ tradeMod:0.20 },    desc:'Trade routes yield +20%.' },
  { id:'eco2', branch:'Economy',  name:'Mineral Extraction',    tier:2, cost:120, prereq:'eco1', icon:'⛏', effect:{ mineralMod:0.20 },  desc:'Mineral production +20%.' },
  { id:'eco3', branch:'Economy',  name:'Agricultural Networks', tier:3, cost:200, prereq:'eco2', icon:'🌾', effect:{ foodMod:0.30 },     desc:'Food production +30%.' },
  { id:'eco4', branch:'Economy',  name:'Megacorporations',      tier:4, cost:320, prereq:'eco3', icon:'🏦', effect:{ creditMod:0.30 },   desc:'Credit income +30%.' },
  { id:'eco5', branch:'Economy',  name:'Galactic Reserve',      tier:5, cost:500, prereq:'eco4', icon:'💰', effect:{ creditMod:0.50, tradeMod:0.30 }, desc:'Dominant economic engine.' },
  // ── SCIENCE BRANCH ──
  { id:'sci1', branch:'Science',  name:'Advanced Archives',     tier:1, cost:60,  prereq:null,   icon:'📚', effect:{ researchMod:0.20 }, desc:'Research output +20%.' },
  { id:'sci2', branch:'Science',  name:'Quantum Computing',     tier:2, cost:120, prereq:'sci1', icon:'💻', effect:{ researchMod:0.30 }, desc:'Research output +30%.' },
  { id:'sci3', branch:'Science',  name:'Psychohistory Basics',  tier:3, cost:200, prereq:'sci2', icon:'📊', effect:{ eventNegMitigation:0.30 }, desc:'Reduce negative event impact 30%.' },
  { id:'sci4', branch:'Science',  name:'Precursor Analysis',    tier:4, cost:320, prereq:'sci3', icon:'🔬', effect:{ researchMod:0.40, allBonus:0.10 }, desc:'All production +10%.' },
  { id:'sci5', branch:'Science',  name:'Psychohistory Mastery', tier:5, cost:500, prereq:'sci4', icon:'🌌', effect:{ researchMod:0.50, eventNegMitigation:0.60 }, desc:'Near-perfect future prediction.' },
  // ── DIPLOMACY BRANCH ──
  { id:'dip1', branch:'Diplomacy',name:'Diplomatic Protocols',  tier:1, cost:60,  prereq:null,   icon:'🤝', effect:{ repGain:0.20 },     desc:'Reputation gains +20%.' },
  { id:'dip2', branch:'Diplomacy',name:'Cultural Broadcasts',   tier:2, cost:120, prereq:'dip1', icon:'📡', effect:{ influenceMod:0.25 },desc:'Influence output +25%.' },
  { id:'dip3', branch:'Diplomacy',name:'Intelligence Networks', tier:3, cost:200, prereq:'dip2', icon:'🕵', effect:{ spySuccess:0.15 },  desc:'Espionage success +15%.' },
  { id:'dip4', branch:'Diplomacy',name:'Galactic Council Seat', tier:4, cost:320, prereq:'dip3', icon:'⚖', effect:{ allianceBonus:1 },  desc:'Can maintain +1 alliance.' },
  { id:'dip5', branch:'Diplomacy',name:'Hegemonic Authority',   tier:5, cost:500, prereq:'dip4', icon:'👑', effect:{ influenceMod:0.50, repGain:0.40 }, desc:'Galaxy-wide influence dominance.' },
  // ── ESPIONAGE BRANCH ──
  { id:'esp1', branch:'Espionage',name:'Shadow Operatives',     tier:1, cost:60,  prereq:null,   icon:'🥷', effect:{ agentSlots:1 },     desc:'+1 agent slot.' },
  { id:'esp2', branch:'Espionage',name:'Cipher Technology',     tier:2, cost:120, prereq:'esp1', icon:'🔐', effect:{ spyDefense:0.20 },  desc:'Enemy spy detection +20%.' },
  { id:'esp3', branch:'Espionage',name:'Infiltration Mastery',  tier:3, cost:200, prereq:'esp2', icon:'🎭', effect:{ spySuccess:0.25, agentSlots:1 }, desc:'Spy success +25%, +1 slot.' },
  { id:'esp4', branch:'Espionage',name:'Deep Cover Networks',   tier:4, cost:320, prereq:'esp3', icon:'🌐', effect:{ spySuccess:0.35 },  desc:'All spy operations +35% success.' },
  { id:'esp5', branch:'Espionage',name:'Psychic Operatives',    tier:5, cost:500, prereq:'esp4', icon:'🧠', effect:{ spySuccess:0.50, agentSlots:2 }, desc:'Near-undetectable operatives.' },
];

// ─── GALACTIC EVENTS POOL ────────────────────────────────────
const EVENTS_POOL = [
  { id:'supernova',       weight:2,  icon:'💥', title:'Supernova',
    condition: (G,sys) => sys && sys.starType && sys.starType.name !== 'Pulsar',
    text: (sys) => `The star of ${sys.name} has gone supernova! All development and production destroyed.`,
    effect: (G,sys) => { sys.development = 0; sys.garrison = {f:0,d:0,c:0,dn:0}; addLog(G, `SUPERNOVA at ${sys.name}!`, 'important'); }
  },
  { id:'trade_boom',      weight:10, icon:'📈', title:'Trade Boom',
    condition: (G,sys) => sys && sys.owner !== null,
    text: (sys) => `Unprecedented trade flows through ${sys.name}. Credits surge across the sector.`,
    effect: (G,sys) => { if(sys.owner!==null) G.factions[sys.owner].credits += 200; addLog(G, `Trade boom at ${sys.name}.`, 'diplo'); }
  },
  { id:'rebellion',       weight:8,  icon:'⚔', title:'Colonial Rebellion',
    condition: (G,sys) => sys && sys.owner !== null && sys.owner !== G.playerIdx,
    text: (sys) => `The population of ${sys.name} has risen in rebellion against their overlords!`,
    effect: (G,sys) => { sys.owner = null; sys.colonized = false; sys.garrison = {f:0,d:0,c:0,dn:0}; addLog(G, `Rebellion! ${sys.name} is now independent.`, 'important'); }
  },
  { id:'plague',          weight:6,  icon:'☣', title:'Galactic Plague',
    condition: (G,sys) => sys && sys.owner !== null,
    text: (sys) => `A virulent plague breaks out across ${sys.name}, devastating food and population.`,
    effect: (G,sys) => { sys.baseFood = Math.max(0, (sys.baseFood||0) - 2); addLog(G, `Plague strikes ${sys.name}.`, 'important'); }
  },
  { id:'alien_artifact',  weight:4,  icon:'🔮', title:'Alien Artifact Found',
    condition: (G,sys) => sys && sys.owner !== null,
    text: (sys) => `Precursor artifacts discovered at ${sys.name}. Research teams are studying the find.`,
    effect: (G,sys) => { if(sys.owner!==null) G.factions[sys.owner].researchPoints += 150; addLog(G, `Alien artifact found at ${sys.name}! +150 RP.`, 'research'); }
  },
  { id:'mineral_vein',    weight:9,  icon:'⛏', title:'Rich Mineral Strike',
    condition: (G,sys) => sys,
    text: (sys) => `A massive mineral vein has been discovered beneath ${sys.name}.`,
    effect: (G,sys) => { sys.baseMinerals = (sys.baseMinerals||1) + 3; addLog(G, `Mineral strike at ${sys.name}! +3 minerals/turn permanently.`, 'research'); }
  },
  { id:'economic_crash',  weight:5,  icon:'📉', title:'Economic Crash',
    condition: (G,sys) => G.factions.some(f=>f.alive && f.credits > 500),
    text: (sys) => `Galactic credit markets collapse! All factions lose significant wealth.`,
    effect: (G,sys) => { G.factions.forEach(f=>{ if(f.alive) f.credits = Math.max(50, Math.floor(f.credits*0.6)); }); addLog(G, `ECONOMIC CRASH! All factions lose 40% credits.`, 'important'); }
  },
  { id:'pirate_raid',     weight:10, icon:'🏴‍☠', title:'Pirate Raid',
    condition: (G,sys) => sys && sys.owner !== null,
    text: (sys) => `Pirates have raided ${sys.name}, plundering resources and destroying infrastructure.`,
    effect: (G,sys) => { if(sys.owner!==null) { G.factions[sys.owner].credits = Math.max(0, G.factions[sys.owner].credits-80); sys.development = Math.max(0, sys.development-1); } addLog(G, `Pirate raid on ${sys.name}.`, 'combat'); }
  },
  { id:'tech_breakthrough',weight:5, icon:'⚛', title:'Scientific Breakthrough',
    condition: (G,sys) => sys && sys.owner !== null,
    text: (sys) => `Scientists at ${sys.name} achieve a breakthrough, accelerating research dramatically.`,
    effect: (G,sys) => { if(sys.owner!==null) G.factions[sys.owner].researchPoints += 250; addLog(G, `Breakthrough at ${sys.name}! +250 RP.`, 'research'); }
  },
  { id:'wormhole_opens',  weight:4,  icon:'🌀', title:'Wormhole Discovered',
    condition: (G,sys) => G.systems.length > 5,
    text: (sys) => `A stable wormhole has been discovered, connecting distant star systems!`,
    effect: (G,sys) => { const a = G.systems[randInt(0,G.systems.length-1)]; const b = G.systems[randInt(0,G.systems.length-1)]; if(a.id!==b.id){ a.wormholeTo = b.id; b.wormholeTo = a.id; addLog(G, `Wormhole connects ${a.name} ↔ ${b.name}!`, 'important'); } }
  },
  { id:'political_crisis', weight:6, icon:'⚖', title:'Political Crisis',
    condition: (G,sys) => G.factions.filter(f=>f.alive).length > 3,
    text: (sys) => `Political upheaval ripples across the galaxy. Alliances are strained.`,
    effect: (G,sys) => { G.factions.forEach(f=>{ if(f.alive && !f.isPlayer){ Object.keys(f.relations).forEach(k=>{ if(f.relations[k]>0) f.relations[k] = Math.max(0, f.relations[k]-1); }); } }); addLog(G, `Political crisis strains all alliances.`, 'diplo'); }
  },
  { id:'colonist_wave',   weight:8,  icon:'🚀', title:'Colonist Wave',
    condition: (G,sys) => sys && sys.owner !== null,
    text: (sys) => `A wave of colonists floods into ${sys.name}, rapidly developing infrastructure.`,
    effect: (G,sys) => { sys.development = Math.min(10, (sys.development||0)+2); addLog(G, `Colonist wave boosts ${sys.name} development.`, 'diplo'); }
  },
  { id:'solar_storm',     weight:7,  icon:'☀', title:'Solar Storm',
    condition: (G,sys) => sys,
    text: (sys) => `A massive solar storm disrupts communications and fleet navigation near ${sys.name}.`,
    effect: (G,sys) => { G.fleets.filter(f=>f.systemId===sys.id && f.status==='moving').forEach(f=>{ f.turnsLeft += 2; }); addLog(G, `Solar storm delays fleets near ${sys.name}.`, 'important'); }
  },
  { id:'defection',       weight:4,  icon:'🔄', title:'Military Defection',
    condition: (G,sys) => sys && sys.owner !== null && sys.owner !== G.playerIdx,
    text: (sys) => `A senior military commander at ${sys.name} defects, taking ships with them.`,
    effect: (G,sys) => { const f = G.fleets.find(fl=>fl.systemId===sys.id && fl.owner===sys.owner); if(f){ f.frigates = Math.max(0, f.frigates-2); f.destroyers = Math.max(0, f.destroyers-1); } addLog(G, `Defection at ${sys.name}! Fleet weakened.`, 'important'); }
  },
  { id:'good_harvest',    weight:10, icon:'🌾', title:'Abundant Harvest',
    condition: (G,sys) => sys && sys.owner !== null,
    text: (sys) => `Exceptional conditions produce massive food surpluses across ${sys.name}.`,
    effect: (G,sys) => { if(sys.owner!==null) G.factions[sys.owner].food += 100; addLog(G, `Abundant harvest at ${sys.name}! +100 food.`, 'diplo'); }
  },
];

// ─── VICTORY CONDITIONS ──────────────────────────────────────
const VICTORY_CONDITIONS = {
  domination:  { label:'Galactic Domination',  check: (G,pf) => countSystems(G,pf.id) / G.systems.length >= 0.70 },
  economic:    { label:'Economic Supremacy',   check: (G,pf) => { const others = G.factions.filter(f=>f.alive&&f.id!==pf.id); return others.length>0 && pf.credits - Math.max(...others.map(f=>f.credits)) >= 10000; } },
  scientific:  { label:'Scientific Supremacy', check: (G,pf) => pf.techResearched.length >= TECH_TREE.length },
  diplomatic:  { label:'Galactic Council',     check: (G,pf) => Object.values(pf.relations).filter(v=>v>=2).length >= 5 },
  survival:    { label:'Last Warlord Standing',check: (G,pf) => G.factions.filter(f=>f.alive).length === 1 && pf.alive },
};

// ─── GLOBAL GAME STATE ──────────────────────────────────────
let G = null;   // set by initNewGame()
let UI = {};    // UI element cache, filled in boot()

function countSystems(G, factionId) {
  return G.systems.filter(s => s.owner === factionId).length;
}

/* ═══════════════════════════════════════════════════════════
   Part 2: Galaxy Generation & Faction Initialisation
   ═══════════════════════════════════════════════════════════ */

// ─── PICK WEIGHTED STAR TYPE ─────────────────────────────────
function pickStarType() {
  const total = STAR_TYPES.reduce((s, t) => s + t.freq, 0);
  let r = rand() * total;
  for (const t of STAR_TYPES) { r -= t.freq; if (r <= 0) return t; }
  return STAR_TYPES[0];
}

// ─── PICK PLANET TYPE ────────────────────────────────────────
function pickPlanetType() {
  const rares = PLANET_TYPES.filter(p => p.rare);
  const common = PLANET_TYPES.filter(p => !p.rare);
  return rand() < 0.08 ? pick(rares) : pick(common);
}

// ─── GENERATE PLANETS FOR A SYSTEM ──────────────────────────
function generatePlanets(starType) {
  const count = randInt(1, 5);
  const planets = [];
  const usedNames = new Set();
  const suffixes = ['I','II','III','IV','V'];
  for (let i = 0; i < count; i++) {
    const type = pickPlanetType();
    const suffix = suffixes[i];
    planets.push({ name: suffix, type: type.name, icon: type.icon,
      creditMod: type.creditMod, mineralMod: type.mineralMod,
      foodMod: type.foodMod, researchMod: type.researchMod });
  }
  return planets;
}

// ─── COMPUTE BASE RESOURCES FOR A SYSTEM ────────────────────
function calcBaseResources(system) {
  const st = system.starType;
  let cr = 0, min = 0, food = 0, rp = 0, inf = 1;
  for (const p of system.planets) {
    cr   += 3 * p.creditMod   * st.creditMod;
    min  += 3 * p.mineralMod  * st.mineralMod;
    food += 3 * p.foodMod     * st.foodMod;
    rp   += 2 * p.researchMod * st.researchMod;
  }
  // floor and add small base
  system.baseCredits  = Math.max(1, Math.floor(cr));
  system.baseMinerals = Math.max(0, Math.floor(min));
  system.baseFood     = Math.max(0, Math.floor(food));
  system.baseResearch = Math.max(0, Math.floor(rp));
  system.baseInfluence = inf;
}

// ─── POISSON-DISC-LIKE SCATTER ───────────────────────────────
// Simple dart-throwing; fast enough for ≤1000 systems
function scatterSystems(count, W, H, minDist) {
  const cells = [];
  const grid = {};
  const cellSize = minDist;
  function key(cx, cy) { return `${cx},${cy}`; }
  function neighbors(x, y) {
    const cx = Math.floor(x / cellSize), cy = Math.floor(y / cellSize);
    const pts = [];
    for (let dx = -2; dx <= 2; dx++)
      for (let dy = -2; dy <= 2; dy++) {
        const k = key(cx + dx, cy + dy);
        if (grid[k]) pts.push(...grid[k]);
      }
    return pts;
  }
  let attempts = 0;
  const maxAttempts = count * 80;
  while (cells.length < count && attempts < maxAttempts) {
    attempts++;
    const x = minDist + rand() * (W - minDist * 2);
    const y = minDist + rand() * (H - minDist * 2);
    const near = neighbors(x, y);
    let valid = true;
    for (const n of near) {
      const dx = n.x - x, dy = n.y - y;
      if (dx * dx + dy * dy < minDist * minDist) { valid = false; break; }
    }
    if (valid) {
      const pt = { x, y };
      cells.push(pt);
      const ck = key(Math.floor(x / cellSize), Math.floor(y / cellSize));
      if (!grid[ck]) grid[ck] = [];
      grid[ck].push(pt);
    }
  }
  return cells;
}

// ─── BUILD TRADE ROUTE GRAPH ─────────────────────────────────
// Connects each system to its nearest neighbours within maxDist
function buildTradeRoutes(systems, maxDist) {
  const maxDistSq = maxDist * maxDist;
  for (const sys of systems) sys.tradeRoutes = [];
  for (let i = 0; i < systems.length; i++) {
    const a = systems[i];
    // find up to 4 nearest within maxDist
    const candidates = [];
    for (let j = 0; j < systems.length; j++) {
      if (i === j) continue;
      const b = systems[j];
      const dx = a.x - b.x, dy = a.y - b.y;
      const dSq = dx * dx + dy * dy;
      if (dSq <= maxDistSq) candidates.push({ id: b.id, dSq });
    }
    candidates.sort((a, b) => a.dSq - b.dSq);
    const links = candidates.slice(0, 4).map(c => c.id);
    for (const lid of links) {
      if (!a.tradeRoutes.includes(lid)) a.tradeRoutes.push(lid);
      const b = systems.find(s => s.id === lid);
      if (b && !b.tradeRoutes.includes(a.id)) b.tradeRoutes.push(a.id);
    }
  }
  // Ensure full connectivity via spanning tree (simplified: connect isolated clusters)
  ensureConnected(systems);
}

function ensureConnected(systems) {
  // BFS from system 0; any unreached gets linked to nearest reached
  const reached = new Set([0]);
  const queue = [0];
  while (queue.length) {
    const cur = queue.shift();
    for (const nb of systems[cur].tradeRoutes) {
      if (!reached.has(nb)) { reached.add(nb); queue.push(nb); }
    }
  }
  for (let i = 0; i < systems.length; i++) {
    if (!reached.has(i)) {
      // find nearest reached system
      let best = -1, bestDSq = Infinity;
      for (const ri of reached) {
        const dx = systems[i].x - systems[ri].x;
        const dy = systems[i].y - systems[ri].y;
        const dSq = dx * dx + dy * dy;
        if (dSq < bestDSq) { bestDSq = dSq; best = ri; }
      }
      if (best >= 0) {
        systems[i].tradeRoutes.push(best);
        systems[best].tradeRoutes.push(i);
        reached.add(i);
      }
    }
  }
}

// ─── GALAXY GENERATION ──────────────────────────────────────
function generateGalaxy(cfg) {
  const { systemCount, W, H } = cfg;
  const minDist = Math.max(60, Math.floor(Math.min(W, H) / Math.sqrt(systemCount) * 0.85));
  const positions = scatterSystems(systemCount, W, H, minDist);

  const usedNames = new Set();
  function uniqueName() {
    const pool = [...SYSTEM_NAMES];
    shuffle(pool);
    for (const n of pool) { if (!usedNames.has(n)) { usedNames.add(n); return n; } }
    const fallback = `System-${randInt(1000,9999)}`;
    usedNames.add(fallback);
    return fallback;
  }

  const systems = positions.map((pos, idx) => {
    const starType = pickStarType();
    const planets = generatePlanets(starType);
    const sys = {
      id: idx,
      name: uniqueName(),
      x: pos.x,
      y: pos.y,
      starType,
      planets,
      owner: null,          // faction id or null
      colonized: false,
      development: 0,       // 0-10
      garrison: { f:0, d:0, c:0, dn:0 },
      tradeRoutes: [],
      wormholeTo: null,
      baseCredits: 0, baseMinerals: 0, baseFood: 0, baseResearch: 0, baseInfluence: 0,
    };
    calcBaseResources(sys);
    return sys;
  });

  const tradeMaxDist = Math.max(200, minDist * 2.8);
  buildTradeRoutes(systems, tradeMaxDist);

  return systems;
}

// ─── STARTING GARRISON ──────────────────────────────────────
function startingGarrison(style) {
  if (style === 'militarist') return { f:4, d:2, c:1, dn:0 };
  if (style === 'economist')  return { f:2, d:1, c:0, dn:0 };
  if (style === 'scientist')  return { f:2, d:1, c:0, dn:0 };
  if (style === 'diplomat')   return { f:2, d:1, c:0, dn:0 };
  if (style === 'espionage')  return { f:3, d:1, c:0, dn:0 };
  return { f:2, d:1, c:0, dn:0 };
}

// ─── STARTING RESOURCES ──────────────────────────────────────
function startingResources(style) {
  const base = { credits:300, minerals:150, food:100, researchPoints:0, influence:20 };
  if (style === 'militarist') { base.minerals += 100; base.credits += 50; }
  if (style === 'economist')  { base.credits += 250; base.influence += 30; }
  if (style === 'scientist')  { base.researchPoints += 120; base.credits += 80; }
  if (style === 'diplomat')   { base.influence += 80; base.credits += 100; }
  if (style === 'espionage')  { base.credits += 100; base.minerals += 50; }
  return base;
}

// ─── ASSIGN STARTING SYSTEMS ─────────────────────────────────
// Spreads faction capitals as far apart as possible using greedy max-min distance
function assignStartingSystems(systems, factionCount) {
  const assignments = []; // [{capitalId, extraIds[]}]
  const assigned = new Set();

  // Place capitals: first is random, rest are maximally distant from all previous
  let first = randInt(0, systems.length - 1);
  assigned.add(first);
  const capitals = [first];

  for (let i = 1; i < factionCount; i++) {
    let best = -1, bestMinDist = -1;
    for (let j = 0; j < systems.length; j++) {
      if (assigned.has(j)) continue;
      let minD = Infinity;
      for (const cap of capitals) {
        const dx = systems[j].x - systems[cap].x;
        const dy = systems[j].y - systems[cap].y;
        const d = Math.sqrt(dx * dx + dy * dy);
        if (d < minD) minD = d;
      }
      if (minD > bestMinDist) { bestMinDist = minD; best = j; }
    }
    if (best < 0) best = randInt(0, systems.length - 1);
    capitals.push(best);
    assigned.add(best);
  }

  // For each capital, find 2 nearby unassigned systems as starting extras
  for (const cap of capitals) {
    const extras = [];
    // Sort all unassigned by distance to capital
    const candidates = systems
      .filter(s => !assigned.has(s.id))
      .map(s => {
        const dx = s.x - systems[cap].x, dy = s.y - systems[cap].y;
        return { id: s.id, d: Math.sqrt(dx * dx + dy * dy) };
      })
      .sort((a, b) => a.d - b.d);
    for (const c of candidates) {
      if (extras.length >= 2) break;
      extras.push(c.id);
      assigned.add(c.id);
    }
    assignments.push({ capitalId: cap, extraIds: extras });
  }
  return assignments;
}

// ─── FLEET CREATION HELPER ───────────────────────────────────
let _fleetIdCounter = 0;
function createFleet(owner, systemId, composition, name) {
  return {
    id: _fleetIdCounter++,
    name: name || `Fleet ${_fleetIdCounter}`,
    owner,
    systemId,
    targetId: null,
    turnsLeft: 0,
    status: 'idle',   // 'idle' | 'moving' | 'combat'
    morale: 100,
    experience: 0,
    frigates:     composition.f  || 0,
    destroyers:   composition.d  || 0,
    cruisers:     composition.c  || 0,
    dreadnoughts: composition.dn || 0,
  };
}

// ─── FLEET STRENGTH ──────────────────────────────────────────
function fleetStrength(fleet, techMods) {
  const atk = (techMods && techMods.attackBonus)  ? 1 + techMods.attackBonus  : 1;
  const def = (techMods && techMods.defenseBonus) ? 1 + techMods.defenseBonus : 1;
  const avg = (atk + def) / 2;
  return (
    fleet.frigates     * SHIP.frigate.attack    * atk +
    fleet.destroyers   * SHIP.destroyer.attack  * atk +
    fleet.cruisers     * SHIP.cruiser.attack    * atk +
    fleet.dreadnoughts * SHIP.dreadnought.attack * atk
  ) * (fleet.morale / 100) * avg;
}

function garrisonStrength(garrison, techMods) {
  return fleetStrength({
    frigates: garrison.f, destroyers: garrison.d,
    cruisers: garrison.c, dreadnoughts: garrison.dn,
    morale: 100, experience: 0
  }, techMods) * 1.2; // defenders get 20% bonus
}

function fleetTotalShips(fleet) {
  return fleet.frigates + fleet.destroyers + fleet.cruisers + fleet.dreadnoughts;
}

// ─── INIT FACTIONS ───────────────────────────────────────────
function initFactions(systems, cfg) {
  const { factionCount, playerStyle, difficulty, sizeKey } = cfg;
  const sysAssignments = assignStartingSystems(systems, factionCount);

  const diffMulti = { easy:0.7, normal:1.0, hard:1.3, psychohistory:1.6 };
  const aiMod = diffMulti[difficulty] || 1.0;

  const factions = [];
  const usedColors = new Set();
  const usedFactionNames = new Set();
  const usedWarlordNames = new Set();

  function uniqueFrom(pool, used) {
    const shuffled = shuffle([...pool]);
    for (const v of shuffled) { if (!used.has(v)) { used.add(v); return v; } }
    return pool[0];
  }

  for (let i = 0; i < factionCount; i++) {
    const isPlayer = (i === 0);
    const style = isPlayer ? playerStyle : pick(PERSONALITY_KEYS);
    const personality = AI_PERSONALITIES[style] || AI_PERSONALITIES.militarist;
    const colorIdx = i % FACTION_COLORS.length;
    const color = FACTION_COLORS[colorIdx];
    const res = startingResources(isPlayer ? playerStyle : style);
    const { capitalId, extraIds } = sysAssignments[i];
    const warlordName = isPlayer
      ? (cfg.playerName || 'Hari Seldon')
      : uniqueFrom(WARLORD_NAMES, usedWarlordNames);
    const factionName = uniqueFrom(FACTION_NAMES, usedFactionNames);

    const faction = {
      id: i,
      name: factionName,
      warlordName,
      isPlayer,
      alive: true,
      style,
      personality,
      color,
      credits:       res.credits,
      minerals:      res.minerals,
      food:          res.food,
      researchPoints: res.researchPoints * (isPlayer ? 1 : aiMod),
      influence:     res.influence,
      // deltas for HUD display
      deltaCredits: 0, deltaMinerals: 0, deltaFood: 0, deltaResearch: 0, deltaInfluence: 0,
      // tech
      techResearched: [],
      currentResearch: null,
      researchProgress: 0,
      techMods: { attackBonus:0, defenseBonus:0, speedBonus:0, tradeMod:0,
                  mineralMod:0, foodMod:0, creditMod:0, researchMod:0,
                  influenceMod:0, repGain:0, spySuccess:0, spyDefense:0,
                  agentSlots:2, allianceBonus:0, eventNegMitigation:0, allBonus:0 },
      // diplomacy: map factionId -> -2(war) | -1(hostile) | 0(neutral) | 1(trade pact) | 2(alliance)
      relations: {},
      reputation: 50,  // 0-100 galaxy-wide rep
      // espionage
      agents: [],
      // AI memory
      aiMemory: { hostileActsFromPlayer: 0, lastDecision: null, threatLevel: 0, coalitionTarget: null },
      capitalId,
    };

    // Apply per-style AI resource multiplier
    if (!isPlayer) {
      faction.credits       = Math.floor(faction.credits       * aiMod);
      faction.minerals      = Math.floor(faction.minerals      * aiMod);
    }

    // Colonize starting systems
    for (const sysId of [capitalId, ...extraIds]) {
      const sys = systems[sysId];
      sys.owner = i;
      sys.colonized = true;
      sys.development = sysId === capitalId ? 5 : 2;
      sys.garrison = startingGarrison(style);
    }
    // Starting fleet at capital
    faction.startingFleetId = null; // assigned below
    factions.push(faction);
  }

  // Build starting fleets after all factions created
  const fleets = [];
  for (const faction of factions) {
    const garr = startingGarrison(faction.style);
    const fleetComp = {
      f:  Math.max(0, garr.f  - 1),
      d:  Math.max(0, garr.d  - 1),
      c:  0, dn: 0
    };
    if (fleetTotalShips(fleetComp) < 1) fleetComp.f = 1;
    const fl = createFleet(faction.id, faction.capitalId, fleetComp,
      `${faction.warlordName}'s Vanguard`);
    fleets.push(fl);
    faction.startingFleetId = fl.id;
  }

  // Init relations (all neutral)
  for (const fa of factions) {
    for (const fb of factions) {
      if (fa.id !== fb.id) fa.relations[fb.id] = 0;
    }
  }

  return { factions, fleets };
}

// ─── INIT NEW GAME ────────────────────────────────────────────
function initNewGame(cfg) {
  // cfg: { sizeKey, playerName, playerStyle, difficulty, victoryCondition, speedKey }
  const sizeDef = GALAXY_SIZES[cfg.sizeKey] || GALAXY_SIZES.medium;
  seedRng(cfg.seed || (Date.now() & 0xFFFFFFFF));

  const systems = generateGalaxy({
    systemCount: sizeDef.systems,
    W: sizeDef.w,
    H: sizeDef.h,
  });

  const { factions, fleets } = initFactions(systems, {
    factionCount:   sizeDef.factions,
    playerStyle:    cfg.playerStyle || 'militarist',
    difficulty:     cfg.difficulty || 'normal',
    sizeKey:        cfg.sizeKey,
    playerName:     cfg.playerName || 'Hari Seldon',
  });

  _fleetIdCounter = fleets.length;

  G = {
    version: 1,
    turn: 1,
    systems,
    factions,
    fleets,
    playerIdx: 0,
    victoryCondition: cfg.victoryCondition || 'domination',
    speedMs: SPEED_MS[cfg.speedKey] || SPEED_MS.normal,
    galaxyW: sizeDef.w,
    galaxyH: sizeDef.h,
    events: [],           // log entries
    pendingEvents: [],    // queued modal events
    pendingDiploOffer: null,
    paused: false,
    selectedSystemId: null,
    selectedFleetId: null,
    simRunning: false,
    gameOver: false,
    winner: null,
    nebulaSeeds: Array.from({ length: 12 }, () => ({ x: rand(), y: rand(), r: rand(), c: randInt(0,3) })),
  };

  addLog(G, `Simulation initialised. Galaxy contains ${systems.length} star systems across ${factions.length} factions.`, 'important');
  addLog(G, `Your faction: ${factions[0].name} — Warlord ${factions[0].warlordName}.`, 'diplo');

  return G;
}

function addLog(G, text, type = 'normal') {
  G.events.push({ turn: G.turn, text, type });
  if (G.events.length > 200) G.events.shift();
  pushNotif(G.turn, text, type);
}

// ─── NOTIFICATION FEED ────────────────────────────────────────
let _notifUnread = 0;

function pushNotif(turn, text, type) {
  const list = document.getElementById('notif-list');
  if (!list) return;

  const item = document.createElement('div');
  item.className = 'notif-item';
  item.innerHTML = `<span class="notif-turn">T${turn ?? '?'}</span>`
                 + `<span class="notif-text ${type || 'normal'}">${text}</span>`;
  // column-reverse means prepend = newest on top
  list.appendChild(item);

  // keep at most 120 entries
  while (list.children.length > 120) list.removeChild(list.firstChild);

  // badge
  _notifUnread++;
  const badge = document.getElementById('notif-count');
  if (badge) badge.textContent = _notifUnread > 99 ? '99+' : _notifUnread;
}

function wireNotifFeed() {
  const toggle = document.getElementById('notif-toggle');
  const list   = document.getElementById('notif-list');
  const header = document.getElementById('notif-header');
  const badge  = document.getElementById('notif-count');

  toggle?.addEventListener('click', () => {
    const collapsed = list.classList.toggle('collapsed');
    toggle.innerHTML = collapsed ? '&#9650;' : '&#9660;';
    if (!collapsed) {
      // reset unread count when opened
      _notifUnread = 0;
      if (badge) badge.textContent = '0';
    }
  });

  // clicking the header also resets the badge
  header?.addEventListener('click', (e) => {
    if (e.target === toggle || e.target === document.getElementById('notif-clear')) return;
    if (!list.classList.contains('collapsed')) {
      _notifUnread = 0;
      if (badge) badge.textContent = '0';
    }
  });

  document.getElementById('notif-clear')?.addEventListener('click', () => {
    if (list) list.innerHTML = '';
    _notifUnread = 0;
    if (badge) badge.textContent = '0';
  });
}

/* ═══════════════════════════════════════════════════════════
   Part 3: Economy, Trade, Technology, Events, Victory
   ═══════════════════════════════════════════════════════════ */

// ─── TRADE ROUTE BONUS ───────────────────────────────────────
// A route is "active" if both endpoint systems are owned (by any faction)
// It multiplies resource output by tradeMod if same owner, or smaller bonus if allied
function calcTradeBonus(G, system, faction) {
  const tradeMod = 1 + (faction.techMods.tradeMod || 0);
  if (!system.colonized || system.owner === null) return 0;
  let activeRoutes = 0;
  for (const nbId of system.tradeRoutes) {
    const nb = G.systems[nbId];
    if (!nb || nb.owner === null) continue;
    if (nb.owner === system.owner) {
      activeRoutes += 1.0;
    } else {
      const rel = faction.relations[nb.owner];
      if (rel >= 1) activeRoutes += 0.4; // trade pact / alliance gives partial bonus
    }
  }
  if (system.wormholeTo !== null) {
    const wh = G.systems[system.wormholeTo];
    if (wh && wh.owner === system.owner) activeRoutes += 1.5;
  }
  return activeRoutes * 0.12 * tradeMod; // each active route = +12% base yield
}

// ─── RESOURCES PER TURN FOR ONE SYSTEM ──────────────────────
function systemYield(G, system, faction) {
  if (!system.colonized || system.owner !== faction.id) return null;
  const m = faction.techMods;
  const all   = 1 + (m.allBonus || 0);
  const devMod = 1 + system.development * 0.08; // each dev level +8%
  const trade  = 1 + calcTradeBonus(G, system, faction);
  return {
    credits:  Math.floor(system.baseCredits  * (1 + (m.creditMod  || 0)) * all * devMod * trade),
    minerals: Math.floor(system.baseMinerals * (1 + (m.mineralMod || 0)) * all * devMod),
    food:     Math.floor(system.baseFood     * (1 + (m.foodMod    || 0)) * all * devMod),
    research: Math.floor(system.baseResearch * (1 + (m.researchMod|| 0)) * all * devMod),
    influence:Math.floor(system.baseInfluence* (1 + (m.influenceMod||0))* all),
  };
}

// ─── FLEET MAINTENANCE COST ──────────────────────────────────
function maintenanceCost(G, factionId) {
  let cost = 0;
  for (const fl of G.fleets) {
    if (fl.owner !== factionId) continue;
    cost += fl.frigates     * 1;
    cost += fl.destroyers   * 3;
    cost += fl.cruisers     * 8;
    cost += fl.dreadnoughts * 20;
  }
  // Also garrison maintenance (half fleet rate)
  for (const sys of G.systems) {
    if (sys.owner !== factionId) continue;
    const g = sys.garrison;
    cost += g.f * 0.5 + g.d * 1.5 + g.c * 4 + g.dn * 10;
  }
  return Math.floor(cost);
}

// ─── APPLY ECONOMY FOR ALL FACTIONS ─────────────────────────
function applyEconomy(G) {
  for (const faction of G.factions) {
    if (!faction.alive) continue;

    let totCr = 0, totMin = 0, totFood = 0, totRp = 0, totInf = 0;
    for (const sys of G.systems) {
      const y = systemYield(G, sys, faction);
      if (!y) continue;
      totCr  += y.credits;
      totMin += y.minerals;
      totFood+= y.food;
      totRp  += y.research;
      totInf += y.influence;
    }

    // Deduct fleet maintenance from credits
    const maint = maintenanceCost(G, faction.id);
    totCr -= maint;

    // Apply
    faction.deltaCredits  = totCr;
    faction.deltaMinerals = totMin;
    faction.deltaFood     = totFood;
    faction.deltaResearch = totRp;
    faction.deltaInfluence= totInf;

    faction.credits       = Math.max(0, faction.credits       + totCr);
    faction.minerals      = Math.max(0, faction.minerals      + totMin);
    faction.food          = Math.max(0, faction.food          + totFood);
    faction.researchPoints= Math.max(0, faction.researchPoints+ totRp);
    faction.influence     = Math.max(0, faction.influence     + totInf);

    // Food starvation: if food < 0 over time reduce random system development
    if (faction.food <= 0 && G.systems.some(s => s.owner === faction.id)) {
      faction.food = 0;
      const ownedSystems = G.systems.filter(s => s.owner === faction.id && s.development > 0);
      if (ownedSystems.length > 0) {
        const victim = pick(ownedSystems);
        victim.development = Math.max(0, victim.development - 1);
        if (faction.isPlayer) addLog(G, `Starvation! ${victim.name} development reduced.`, 'important');
      }
    }

    // Bankruptcy: if credits went deeply negative, lose a random fleet
    if (faction.credits <= 0 && rand() < 0.25) {
      const fls = G.fleets.filter(f => f.owner === faction.id && f.status === 'idle');
      if (fls.length > 0) {
        const lost = pick(fls);
        G.fleets.splice(G.fleets.indexOf(lost), 1);
        if (faction.isPlayer) addLog(G, `Bankruptcy! Fleet "${lost.name}" disbands.`, 'important');
      }
    }
  }
}

// ─── TECHNOLOGY SYSTEM ──────────────────────────────────────
function getTechById(id) { return TECH_TREE.find(t => t.id === id); }

function unlockedTechs(faction) {
  // Returns techs available to research now (prereq met, not yet researched, not currently researching)
  return TECH_TREE.filter(t =>
    !faction.techResearched.includes(t.id) &&
    t.id !== faction.currentResearch &&
    (t.prereq === null || faction.techResearched.includes(t.prereq))
  );
}

function applyTechEffect(faction, tech) {
  const e = tech.effect;
  const m = faction.techMods;
  if (e.attackBonus)          m.attackBonus          = (m.attackBonus         || 0) + e.attackBonus;
  if (e.defenseBonus)         m.defenseBonus         = (m.defenseBonus        || 0) + e.defenseBonus;
  if (e.speedBonus)           m.speedBonus           = (m.speedBonus          || 0) + e.speedBonus;
  if (e.tradeMod)             m.tradeMod             = (m.tradeMod            || 0) + e.tradeMod;
  if (e.mineralMod)           m.mineralMod           = (m.mineralMod          || 0) + e.mineralMod;
  if (e.foodMod)              m.foodMod              = (m.foodMod             || 0) + e.foodMod;
  if (e.creditMod)            m.creditMod            = (m.creditMod           || 0) + e.creditMod;
  if (e.researchMod)          m.researchMod          = (m.researchMod         || 0) + e.researchMod;
  if (e.influenceMod)         m.influenceMod         = (m.influenceMod        || 0) + e.influenceMod;
  if (e.repGain)              m.repGain              = (m.repGain             || 0) + e.repGain;
  if (e.spySuccess)           m.spySuccess           = (m.spySuccess          || 0) + e.spySuccess;
  if (e.spyDefense)           m.spyDefense           = (m.spyDefense          || 0) + e.spyDefense;
  if (e.agentSlots)           m.agentSlots           = (m.agentSlots          || 2) + e.agentSlots;
  if (e.allianceBonus)        m.allianceBonus        = (m.allianceBonus       || 0) + e.allianceBonus;
  if (e.eventNegMitigation)   m.eventNegMitigation   = (m.eventNegMitigation  || 0) + e.eventNegMitigation;
  if (e.allBonus)             m.allBonus             = (m.allBonus            || 0) + e.allBonus;
}

function advanceTech(G) {
  for (const faction of G.factions) {
    if (!faction.alive || !faction.currentResearch) continue;
    const tech = getTechById(faction.currentResearch);
    if (!tech) { faction.currentResearch = null; continue; }

    faction.researchProgress += faction.deltaResearch > 0 ? faction.deltaResearch : 1;

    if (faction.researchProgress >= tech.cost) {
      // Research complete
      faction.techResearched.push(tech.id);
      faction.researchProgress = 0;
      applyTechEffect(faction, tech);
      if (faction.isPlayer) {
        addLog(G, `Research complete: ${tech.name}! ${tech.desc}`, 'research');
        G.pendingEvents.push({ type:'tech', tech });
      } else {
        addLog(G, `${faction.name} researches ${tech.name}.`, 'research');
      }
      // Auto-queue next tech in same branch if available
      const nextInBranch = TECH_TREE.find(t =>
        t.branch === tech.branch &&
        !faction.techResearched.includes(t.id) &&
        (t.prereq === null || faction.techResearched.includes(t.prereq))
      );
      faction.currentResearch = nextInBranch ? nextInBranch.id : null;
    }
  }
}

// Player sets research target
function setResearch(faction, techId) {
  if (faction.techResearched.includes(techId)) return false;
  const tech = getTechById(techId);
  if (!tech) return false;
  if (tech.prereq && !faction.techResearched.includes(tech.prereq)) return false;
  faction.currentResearch = techId;
  faction.researchProgress = 0;
  return true;
}

// AI auto-assigns research by personality
function aiPickResearch(faction) {
  if (faction.currentResearch) return;
  const p = faction.personality;
  const available = unlockedTechs(faction);
  if (available.length === 0) return;

  // Weight by personality branch preferences
  const branchWeights = {
    Military:  p.wAttack * 2 + p.wDefend,
    Economy:   p.wTrade  * 2 + p.wExpand,
    Science:   p.wResearch * 3,
    Diplomacy: p.wAlly   * 2 + p.wTrade,
    Espionage: p.wSpy    * 3,
  };
  let best = null, bestScore = -1;
  for (const t of available) {
    const score = (branchWeights[t.branch] || 1) * (rand() * 0.4 + 0.8);
    if (score > bestScore) { bestScore = score; best = t; }
  }
  if (best) { faction.currentResearch = best.id; faction.researchProgress = 0; }
}

// ─── DEVELOPMENT GROWTH ──────────────────────────────────────
function applyDevelopment(G) {
  for (const sys of G.systems) {
    if (!sys.colonized || sys.owner === null) continue;
    if (sys.development >= 10) continue;
    const faction = G.factions[sys.owner];
    if (!faction || !faction.alive) continue;
    // Base 10% chance per turn to grow + food surplus helps
    const growChance = 0.10 + (faction.food > 200 ? 0.05 : 0);
    if (rand() < growChance && faction.minerals >= 5) {
      sys.development++;
      faction.minerals -= 5;
    }
  }
}

// ─── GALACTIC EVENTS ─────────────────────────────────────────
function triggerEvents(G) {
  // Roll for 0, 1 or 2 events per turn based on turn number
  const numRolls = G.turn < 10 ? 1 : G.turn < 30 ? 2 : 3;
  for (let roll = 0; roll < numRolls; roll++) {
    if (rand() > 0.35) continue; // ~35% chance per roll

    // Build weighted pool
    const pool = [];
    for (const ev of EVENTS_POOL) {
      // Pick a random system that satisfies the condition
      let candidateSys = null;
      const colonised = G.systems.filter(s => s.colonized);
      const all = G.systems;
      // Try colonised first, then any
      const trials = [...shuffle([...colonised]), ...shuffle([...all])];
      for (const s of trials) {
        if (ev.condition(G, s)) { candidateSys = s; break; }
      }
      // Some events don't need a system
      if (!candidateSys && ev.condition(G, null)) candidateSys = null;
      if (candidateSys !== undefined) {
        pool.push({ ev, sys: candidateSys, weight: ev.weight });
      }
    }
    if (pool.length === 0) continue;

    // Weighted random pick
    const totalW = pool.reduce((s, p) => s + p.weight, 0);
    let r = rand() * totalW;
    let chosen = pool[0];
    for (const p of pool) { r -= p.weight; if (r <= 0) { chosen = p; break; } }

    // Mitigate negative events for player if they have psychohistory tech
    const playerFaction = G.factions[G.playerIdx];
    const mitigation = playerFaction.techMods.eventNegMitigation || 0;
    const isNegative = ['supernova','rebellion','plague','economic_crash','pirate_raid','solar_storm','defection','political_crisis'].includes(chosen.ev.id);
    if (isNegative && rand() < mitigation) continue;

    // Apply the event
    chosen.ev.effect(G, chosen.sys);

    // Queue for player notification modal
    G.pendingEvents.push({
      type: 'galactic',
      icon: chosen.ev.icon,
      title: chosen.ev.title,
      body: chosen.ev.text(chosen.sys),
    });
  }
}

// ─── VICTORY CHECK ───────────────────────────────────────────
function checkVictory(G) {
  if (G.gameOver) return;
  const playerFaction = G.factions[G.playerIdx];
  const vc = VICTORY_CONDITIONS[G.victoryCondition];

  // Check player victory
  if (playerFaction.alive && vc && vc.check(G, playerFaction)) {
    G.gameOver = true;
    G.winner = G.playerIdx;
    addLog(G, `VICTORY! ${playerFaction.warlordName} achieves ${vc.label}!`, 'important');
    return;
  }

  // Check player elimination
  if (!playerFaction.alive) {
    G.gameOver = true;
    G.winner = -1;
    addLog(G, `DEFEAT. ${playerFaction.warlordName} has been eliminated.`, 'important');
    return;
  }

  // Check AI victory (any condition)
  for (const faction of G.factions) {
    if (!faction.alive || faction.isPlayer) continue;
    for (const [vcKey, vcDef] of Object.entries(VICTORY_CONDITIONS)) {
      if (vcDef.check(G, faction)) {
        G.gameOver = true;
        G.winner = faction.id;
        G.winnerCondition = vcKey;
        addLog(G, `DEFEAT. ${faction.name} achieves ${vcDef.label}!`, 'important');
        return;
      }
    }
  }

  // Survival: if only 1 faction alive
  const alive = G.factions.filter(f => f.alive);
  if (alive.length === 1) {
    G.gameOver = true;
    G.winner = alive[0].id;
    G.winnerCondition = 'domination';
    const isPlayer = alive[0].id === G.playerIdx;
    if (isPlayer) addLog(G, `VICTORY! Last warlord standing!`, 'important');
    else           addLog(G, `DEFEAT. ${alive[0].name} is the last power standing.`, 'important');
  }
}

// ─── FACTION ELIMINATION CHECK ───────────────────────────────
function checkEliminations(G) {
  for (const faction of G.factions) {
    if (!faction.alive) continue;
    const ownedCount = G.systems.filter(s => s.owner === faction.id).length;
    const fleetCount = G.fleets.filter(f => f.owner === faction.id).length;
    if (ownedCount === 0 && fleetCount === 0) {
      faction.alive = false;
      addLog(G, `${faction.name} has been eliminated from the galaxy!`, 'important');
      G.fleets = G.fleets.filter(f => f.owner !== faction.id);
    }
  }
}

/* ═══════════════════════════════════════════════════════════
   Part 4: Combat & Fleet Movement
   ═══════════════════════════════════════════════════════════ */

// ─── TRANSIT TIME BETWEEN SYSTEMS ────────────────────────────
function transitTurns(G, fromId, toId, speedBonus) {
  const a = G.systems[fromId], b = G.systems[toId];
  if (!a || !b) return 3;
  const dx = a.x - b.x, dy = a.y - b.y;
  const dist = Math.sqrt(dx * dx + dy * dy);
  const baseSpeed = 200; // world-units per turn
  const speed = baseSpeed * (1 + (speedBonus || 0));
  return Math.max(1, Math.ceil(dist / speed));
}

// ─── PLAYER / AI ISSUES A FLEET MOVE ORDER ───────────────────
function orderFleetMove(G, fleetId, targetSystemId) {
  const fleet = G.fleets.find(f => f.id === fleetId);
  if (!fleet || fleet.status === 'moving') return false;
  const from = G.systems[fleet.systemId];
  const to   = G.systems[targetSystemId];
  if (!from || !to) return false;

  const faction = G.factions[fleet.owner];
  const spd = faction ? (faction.techMods.speedBonus || 0) : 0;
  fleet.targetId  = targetSystemId;
  fleet.turnsLeft = transitTurns(G, fleet.systemId, targetSystemId, spd);
  fleet.status    = 'moving';
  addLog(G, `Fleet "${fleet.name}" en route to ${to.name} (${fleet.turnsLeft} turns).`, 'normal');
  return true;
}

// ─── APPLY FLEET ATTRITION (morale, long transit) ────────────
function applyAttrition(fleet) {
  if (fleet.status !== 'moving') return;
  // Long transits slowly sap morale
  if (fleet.turnsLeft > 4 && rand() < 0.15) {
    fleet.morale = Math.max(40, fleet.morale - randInt(2, 6));
  }
}

// ─── SCALE LOSSES FROM A FIGHT ───────────────────────────────
// loserRatio: 0..1 — proportion of loser strength lost
function applyLosses(fleet, loserRatio) {
  const scaledRatio = Math.min(0.95, loserRatio);
  fleet.frigates     = Math.floor(fleet.frigates     * (1 - scaledRatio));
  fleet.destroyers   = Math.floor(fleet.destroyers   * (1 - scaledRatio));
  fleet.cruisers     = Math.floor(fleet.cruisers     * (1 - scaledRatio));
  fleet.dreadnoughts = Math.floor(fleet.dreadnoughts * (1 - scaledRatio));
  fleet.morale       = Math.max(20, fleet.morale - Math.floor(loserRatio * 50));
}

function applyWinnerLosses(fleet, winnerRatio) {
  // Winner only loses a fraction
  const ratio = Math.min(0.40, winnerRatio * 0.35);
  fleet.frigates     = Math.floor(fleet.frigates     * (1 - ratio));
  fleet.destroyers   = Math.floor(fleet.destroyers   * (1 - ratio));
  fleet.cruisers     = Math.floor(fleet.cruisers     * (1 - ratio));
  fleet.dreadnoughts = Math.floor(fleet.dreadnoughts * (1 - ratio));
  fleet.experience   = Math.min(100, fleet.experience + randInt(5, 15));
  fleet.morale       = Math.min(100, fleet.morale + 5);
}

function applyLossesToGarrison(garrison, ratio) {
  const r = Math.min(0.95, ratio);
  garrison.f  = Math.floor(garrison.f  * (1 - r));
  garrison.d  = Math.floor(garrison.d  * (1 - r));
  garrison.c  = Math.floor(garrison.c  * (1 - r));
  garrison.dn = Math.floor(garrison.dn * (1 - r));
}

// ─── BATTLE RESOLUTION ───────────────────────────────────────
// Returns: 'attacker' | 'defender'
function resolveBattle(G, attackerFleet, defenderSystem) {
  const atkFaction = G.factions[attackerFleet.owner];
  const defFactionId = defenderSystem.owner;
  const defFaction = defFactionId !== null ? G.factions[defFactionId] : null;

  // Calculate strengths
  let atkStr = fleetStrength(attackerFleet, atkFaction ? atkFaction.techMods : {});
  let defStr = garrisonStrength(defenderSystem.garrison, defFaction ? defFaction.techMods : {});

  // Experience bonus
  atkStr *= (1 + attackerFleet.experience * 0.003);

  // Random variance ±20%
  atkStr *= (0.80 + rand() * 0.40);
  defStr *= (0.80 + rand() * 0.40);

  const atkWins = atkStr >= defStr;
  const strengthRatio = atkWins
    ? Math.min(1, defStr / Math.max(1, atkStr))   // how relatively hard the win was
    : Math.min(1, atkStr / Math.max(1, defStr));  // how badly attacker lost

  const atkName = atkFaction ? atkFaction.name : 'Unknown';
  const defName = defFaction ? defFaction.name : 'Independents';

  if (atkWins) {
    // Attacker captures the system
    applyWinnerLosses(attackerFleet, strengthRatio);
    applyLossesToGarrison(defenderSystem.garrison, 0.95); // defenders nearly wiped

    const oldOwner = defenderSystem.owner;
    defenderSystem.owner = attackerFleet.owner;
    defenderSystem.colonized = true;

    // Transfer garrison strength: winning fleet stays as new garrison
    defenderSystem.garrison = {
      f:  attackerFleet.frigates,
      d:  attackerFleet.destroyers,
      c:  attackerFleet.cruisers,
      dn: attackerFleet.dreadnoughts,
    };
    // The fleet is consumed into the garrison
    G.fleets = G.fleets.filter(f => f.id !== attackerFleet.id);

    addLog(G, `⚔ BATTLE: ${atkName} captures ${defenderSystem.name} from ${defName}!`, 'combat');

    // Reputation hit for attacker if it was an allied system
    if (atkFaction && defFaction && atkFaction.relations[defFactionId] >= 2) {
      atkFaction.reputation = Math.max(0, atkFaction.reputation - 20);
      addLog(G, `${atkName} betrayed their ally ${defName}! Reputation -20.`, 'important');
    }
    // Declare war automatically
    if (atkFaction && defFaction) {
      setRelation(G, atkFaction.id, defFactionId, -2);
    }

    return 'attacker';
  } else {
    // Defender holds; attacker fleet badly damaged
    applyLosses(attackerFleet, strengthRatio * 0.85);
    applyLossesToGarrison(defenderSystem.garrison, strengthRatio * 0.30);

    addLog(G, `⚔ BATTLE: ${defName} repels ${atkName}'s attack on ${defenderSystem.name}!`, 'combat');

    // If attacker fleet is wiped out, remove it
    if (fleetTotalShips(attackerFleet) === 0) {
      G.fleets = G.fleets.filter(f => f.id !== attackerFleet.id);
      addLog(G, `Fleet "${attackerFleet.name}" was destroyed!`, 'combat');
    } else {
      // Retreat back to origin
      attackerFleet.status = 'idle';
      attackerFleet.targetId = null;
    }

    return 'defender';
  }
}

// ─── RESOLVE FLEET ARRIVAL ───────────────────────────────────
function resolveArrival(G, fleet) {
  const targetSys = G.systems[fleet.targetId];
  if (!targetSys) { fleet.status = 'idle'; fleet.targetId = null; return; }

  fleet.systemId = fleet.targetId;
  fleet.targetId = null;
  fleet.status   = 'idle';
  fleet.turnsLeft = 0;

  if (targetSys.owner === null) {
    // Uninhabited — colonise it
    targetSys.owner = fleet.owner;
    targetSys.colonized = true;
    targetSys.development = 1;
    // Fleet becomes garrison
    targetSys.garrison = { f: fleet.frigates, d: fleet.destroyers, c: fleet.cruisers, dn: fleet.dreadnoughts };
    G.fleets = G.fleets.filter(f => f.id !== fleet.id);
    const fac = G.factions[fleet.owner];
    addLog(G, `${fac ? fac.name : '?'} colonises ${targetSys.name}.`, 'normal');
  } else if (targetSys.owner === fleet.owner) {
    // Friendly — merge into garrison
    targetSys.garrison.f  += fleet.frigates;
    targetSys.garrison.d  += fleet.destroyers;
    targetSys.garrison.c  += fleet.cruisers;
    targetSys.garrison.dn += fleet.dreadnoughts;
    G.fleets = G.fleets.filter(f => f.id !== fleet.id);
  } else {
    // Enemy or neutral with garrison — battle
    const defHasForce = (targetSys.garrison.f + targetSys.garrison.d +
                         targetSys.garrison.c + targetSys.garrison.dn) > 0;
    if (defHasForce || targetSys.owner !== null) {
      resolveBattle(G, fleet, targetSys);
    } else {
      // Empty enemy system — auto-capture
      const old = targetSys.owner;
      targetSys.owner = fleet.owner;
      targetSys.colonized = true;
      targetSys.garrison = { f: fleet.frigates, d: fleet.destroyers, c: fleet.cruisers, dn: fleet.dreadnoughts };
      G.fleets = G.fleets.filter(f => f.id !== fleet.id);
      const fac = G.factions[fleet.owner];
      const oldFac = old !== null ? G.factions[old] : null;
      addLog(G, `${fac ? fac.name : '?'} seizes undefended ${targetSys.name}.`, 'combat');
      if (fac && oldFac) setRelation(G, fac.id, old, -2);
    }
  }
}

// ─── ADVANCE ALL FLEETS ONE TURN ─────────────────────────────
function moveFleets(G) {
  // Snapshot moving fleets (resolveArrival can mutate G.fleets)
  const moving = G.fleets.filter(f => f.status === 'moving');
  for (const fleet of moving) {
    applyAttrition(fleet);
    fleet.turnsLeft--;
    if (fleet.turnsLeft <= 0) {
      resolveArrival(G, fleet);
    }
  }
}

// ─── PLAYER BUILDS A FLEET ───────────────────────────────────
function buildFleet(G, factionId, systemId, comp) {
  const faction = G.factions[factionId];
  const sys = G.systems[systemId];
  if (!faction || !sys || sys.owner !== factionId) return { ok: false, msg: 'Invalid system.' };

  const totalCr  = (comp.f||0)*SHIP.frigate.creditCost   + (comp.d||0)*SHIP.destroyer.creditCost
                 + (comp.c||0)*SHIP.cruiser.creditCost    + (comp.dn||0)*SHIP.dreadnought.creditCost;
  const totalMin = (comp.f||0)*SHIP.frigate.mineralCost  + (comp.d||0)*SHIP.destroyer.mineralCost
                 + (comp.c||0)*SHIP.cruiser.mineralCost   + (comp.dn||0)*SHIP.dreadnought.mineralCost;
  const totalShips = (comp.f||0)+(comp.d||0)+(comp.c||0)+(comp.dn||0);

  if (totalShips === 0) return { ok: false, msg: 'Select at least one ship.' };
  if (faction.credits  < totalCr)  return { ok: false, msg: `Need ${totalCr} credits (have ${faction.credits}).` };
  if (faction.minerals < totalMin) return { ok: false, msg: `Need ${totalMin} minerals (have ${faction.minerals}).` };

  faction.credits  -= totalCr;
  faction.minerals -= totalMin;

  const fl = createFleet(factionId, systemId, comp,
    `${faction.warlordName}'s Fleet ${G.fleets.filter(f=>f.owner===factionId).length + 1}`);
  G.fleets.push(fl);

  addLog(G, `${faction.name} builds a new fleet at ${sys.name}.`, 'normal');
  return { ok: true, fleet: fl };
}

// ─── COLONISE FROM GARRISON ──────────────────────────────────
// Launches a small colonisation fleet from a system's garrison
function launchColonisationFleet(G, factionId, fromSystemId, toSystemId) {
  const sys = G.systems[fromSystemId];
  const faction = G.factions[factionId];
  if (!sys || sys.owner !== factionId) return false;
  const g = sys.garrison;
  const totalGarrison = g.f + g.d + g.c + g.dn;
  if (totalGarrison < 2) return false; // need at least 2 ships to spare

  // Take half the garrison as the colonisation fleet (min 1 frigate)
  const take = { f: Math.max(1, Math.floor(g.f / 2)), d: Math.floor(g.d / 2),
                 c: Math.floor(g.c / 2), dn: Math.floor(g.dn / 2) };
  g.f  -= take.f;  g.d  -= take.d;  g.c  -= take.c;  g.dn -= take.dn;

  const fl = createFleet(factionId, fromSystemId, take,
    `${faction.warlordName}'s Colonists`);
  const spd = faction.techMods.speedBonus || 0;
  fl.targetId  = toSystemId;
  fl.turnsLeft = transitTurns(G, fromSystemId, toSystemId, spd);
  fl.status    = 'moving';
  G.fleets.push(fl);

  const to = G.systems[toSystemId];
  addLog(G, `${faction.name} launches colonisation fleet toward ${to ? to.name : '?'}.`, 'normal');
  return true;
}

/* ═══════════════════════════════════════════════════════════
   Part 5: Diplomacy & Espionage
   ═══════════════════════════════════════════════════════════ */

// ─── RELATION HELPERS ────────────────────────────────────────
// rel: -2=war, -1=hostile, 0=neutral, 1=trade pact, 2=alliance
function setRelation(G, aId, bId, value) {
  const a = G.factions[aId], b = G.factions[bId];
  if (!a || !b) return;
  a.relations[bId] = value;
  b.relations[aId] = value;
}

function getRelation(G, aId, bId) {
  const a = G.factions[aId];
  if (!a) return 0;
  return a.relations[bId] !== undefined ? a.relations[bId] : 0;
}

function relationLabel(val) {
  if (val >=  2) return 'Alliance';
  if (val >=  1) return 'Trade Pact';
  if (val >=  0) return 'Neutral';
  if (val >= -1) return 'Hostile';
  return 'WAR';
}

function relationColor(val) {
  if (val >=  2) return '#66bb6a';
  if (val >=  1) return '#4fc3f7';
  if (val >=  0) return '#ffa726';
  if (val >= -1) return '#ef9a9a';
  return '#ef5350';
}

// ─── REPUTATION CHANGE ───────────────────────────────────────
function changeReputation(G, factionId, delta) {
  const f = G.factions[factionId];
  if (!f) return;
  const boost = f.techMods.repGain || 0;
  f.reputation = Math.max(0, Math.min(100, f.reputation + delta * (1 + boost)));
}

// ─── DIPLOMACY: PROPOSE ──────────────────────────────────────
// type: 'alliance' | 'trade_pact' | 'non_aggression' | 'peace' | 'war'
function proposeDiplomacy(G, fromId, toId, type) {
  const from = G.factions[fromId], to = G.factions[toId];
  if (!from || !to || !from.alive || !to.alive) return false;

  if (toId === G.playerIdx) {
    // Queue it as a pending offer for the player to respond to via modal
    G.pendingDiploOffer = { fromId, toId, type, turn: G.turn };
    return true;
  }
  // AI-to-AI: evaluate immediately
  const accepted = aiEvaluateDiploOffer(G, fromId, toId, type);
  applyDiploOutcome(G, fromId, toId, type, accepted);
  return accepted;
}

// ─── DIPLOMACY: AI EVALUATION ────────────────────────────────
function aiEvaluateDiploOffer(G, fromId, toId, type) {
  const from = G.factions[fromId], to = G.factions[toId];
  if (!from || !to) return false;
  const p = to.personality;
  const currentRel = getRelation(G, fromId, toId);
  const fromPower  = countSystems(G, fromId);
  const toPower    = countSystems(G, toId);
  const fromRep    = from.reputation;

  // Base acceptance scores per type
  let score = 0;
  switch (type) {
    case 'alliance':
      score = p.wAlly * 60
        + (fromRep - 50) * 0.4
        + (fromPower < toPower ? 20 : -10)  // prefer allying equals/stronger
        + (currentRel >= 1 ? 20 : 0)         // existing trade helps
        + (to.aiMemory.hostileActsFromPlayer && fromId === G.playerIdx ? -40 : 0);
      break;
    case 'trade_pact':
      score = p.wTrade * 70
        + (fromRep - 40) * 0.3
        + (currentRel >= 0 ? 10 : -20)
        + (to.aiMemory.hostileActsFromPlayer && fromId === G.playerIdx ? -20 : 0);
      break;
    case 'non_aggression':
      score = 40
        + (fromPower > toPower * 1.5 ? 30 : 0)  // accept when weaker
        + p.wDefend * 20
        + (to.aiMemory.hostileActsFromPlayer && fromId === G.playerIdx ? -30 : 0);
      break;
    case 'peace':
      score = currentRel === -2
        ? 30 + (fromPower > toPower ? 40 : 0) + p.wDefend * 20 // accept peace if losing
        : 20;
      break;
    case 'war':
      // AI rarely declares war unless aggressive
      score = p.wAttack * 40 + (fromPower > toPower * 1.3 ? 30 : -20);
      break;
  }

  // Add randomness
  score += (rand() - 0.5) * 25;
  return score >= 50;
}

// ─── DIPLOMACY: APPLY OUTCOME ────────────────────────────────
function applyDiploOutcome(G, fromId, toId, type, accepted) {
  const from = G.factions[fromId], to = G.factions[toId];
  if (!from || !to) return;

  if (!accepted) {
    addLog(G, `${to.name} rejects ${from.name}'s ${type} offer.`, 'diplo');
    changeReputation(G, fromId, -3);
    return;
  }

  switch (type) {
    case 'alliance':
      setRelation(G, fromId, toId, 2);
      changeReputation(G, fromId, 8);
      changeReputation(G, toId, 8);
      addLog(G, `⚑ ALLIANCE: ${from.name} and ${to.name} form an alliance!`, 'diplo');
      break;
    case 'trade_pact':
      if (getRelation(G, fromId, toId) < 1) setRelation(G, fromId, toId, 1);
      changeReputation(G, fromId, 4);
      changeReputation(G, toId, 4);
      addLog(G, `${from.name} and ${to.name} establish a trade pact.`, 'diplo');
      break;
    case 'non_aggression':
      if (getRelation(G, fromId, toId) < 0) setRelation(G, fromId, toId, 0);
      addLog(G, `${from.name} and ${to.name} sign a non-aggression pact.`, 'diplo');
      break;
    case 'peace':
      setRelation(G, fromId, toId, 0);
      changeReputation(G, fromId, 5);
      changeReputation(G, toId, 5);
      addLog(G, `${from.name} and ${to.name} end hostilities.`, 'diplo');
      break;
    case 'war':
      setRelation(G, fromId, toId, -2);
      changeReputation(G, fromId, -12);
      addLog(G, `☠ WAR DECLARED: ${from.name} declares war on ${to.name}!`, 'combat');
      // Notify allies
      for (const faction of G.factions) {
        if (!faction.alive || faction.id === fromId || faction.id === toId) continue;
        if (getRelation(G, faction.id, toId) >= 2) {
          // Allied with defender — may join
          if (rand() < 0.35) {
            setRelation(G, faction.id, fromId, -2);
            addLog(G, `${faction.name} joins the war against ${from.name} in defense of ${to.name}!`, 'combat');
          }
        }
      }
      break;
  }
}

// ─── PLAYER DECLARES WAR ─────────────────────────────────────
function playerDeclareWar(G, targetId) {
  const from = G.factions[G.playerIdx], to = G.factions[targetId];
  if (!from || !to || !to.alive) return;
  applyDiploOutcome(G, G.playerIdx, targetId, 'war', true);
  from.aiMemory && (from.aiMemory.hostileActsFromPlayer = (from.aiMemory.hostileActsFromPlayer||0) + 5);
  to.aiMemory.hostileActsFromPlayer = (to.aiMemory.hostileActsFromPlayer||0) + 5;
}

// ─── PLAYER PROPOSES DIPLOMACY ───────────────────────────────
function playerProposeDiplomacy(G, targetId, type) {
  return proposeDiplomacy(G, G.playerIdx, targetId, type);
}

// ─── ESPIONAGE: AGENT OPERATIONS ─────────────────────────────
// Agent ops: INTEL | SABOTAGE | INCITE_REBELLION | ASSASSINATE
const ESP_OPS = {
  INTEL: {
    label: 'Gather Intel',
    cost: 50,
    turnsRequired: 3,
    baseSuccess: 0.70,
    desc: 'Reveal target system resources and garrison.',
    onSuccess: (G, agent) => {
      const sys = G.systems[agent.targetSystemId];
      if (!sys) return;
      agent.intelResult = {
        name: sys.name, owner: sys.owner,
        garrison: { ...sys.garrison },
        baseCredits: sys.baseCredits, baseMinerals: sys.baseMinerals,
      };
      addLog(G, `Intel op complete: ${sys.name} — garrison and resources revealed.`, 'espionage');
    },
  },
  SABOTAGE: {
    label: 'Sabotage',
    cost: 120,
    turnsRequired: 4,
    baseSuccess: 0.50,
    desc: 'Destroy target system resources and development.',
    onSuccess: (G, agent) => {
      const sys = G.systems[agent.targetSystemId];
      if (!sys || sys.owner === null) return;
      const target = G.factions[sys.owner];
      if (target) target.credits = Math.max(0, target.credits - randInt(80, 200));
      sys.development = Math.max(0, sys.development - randInt(1, 3));
      addLog(G, `Sabotage at ${sys.name}! Credits lost, development reduced.`, 'espionage');
    },
  },
  INCITE_REBELLION: {
    label: 'Incite Rebellion',
    cost: 200,
    turnsRequired: 6,
    baseSuccess: 0.35,
    desc: 'Cause a rebellion, freeing the system from its owner.',
    onSuccess: (G, agent) => {
      const sys = G.systems[agent.targetSystemId];
      if (!sys || sys.owner === null || sys.owner === agent.owner) return;
      const oldOwner = G.factions[sys.owner];
      sys.owner = null;
      sys.colonized = false;
      sys.garrison = { f:0, d:0, c:0, dn:0 };
      sys.development = Math.max(0, sys.development - 2);
      addLog(G, `REBELLION at ${sys.name}! System breaks free from ${oldOwner ? oldOwner.name : '?'}!`, 'espionage');
    },
  },
  ASSASSINATE: {
    label: 'Assassinate Agent',
    cost: 80,
    turnsRequired: 3,
    baseSuccess: 0.55,
    desc: 'Hunt down and eliminate an enemy agent.',
    onSuccess: (G, agent) => {
      const targetFaction = G.factions[agent.targetFactionId];
      if (!targetFaction) return;
      const enemyAgents = targetFaction.agents.filter(a => a.targetSystemId === agent.targetSystemId);
      if (enemyAgents.length > 0) {
        const victim = pick(enemyAgents);
        targetFaction.agents = targetFaction.agents.filter(a => a.id !== victim.id);
        addLog(G, `Agent eliminated in ${G.systems[agent.targetSystemId]?.name || '?'}.`, 'espionage');
      }
    },
  },
};

let _agentIdCounter = 0;
function createAgent(owner, targetSystemId, targetFactionId, opKey) {
  const op = ESP_OPS[opKey];
  return {
    id: _agentIdCounter++,
    owner,
    targetSystemId,
    targetFactionId,
    op: opKey,
    turnsLeft: op.turnsRequired,
    status: 'active',  // 'active' | 'complete' | 'blown'
    intelResult: null,
  };
}

function deployAgent(G, factionId, targetSystemId, opKey) {
  const faction = G.factions[factionId];
  if (!faction || !faction.alive) return { ok: false, msg: 'Invalid faction.' };
  const op = ESP_OPS[opKey];
  if (!op) return { ok: false, msg: 'Unknown operation.' };
  const maxSlots = faction.techMods.agentSlots || 2;
  if (faction.agents.length >= maxSlots) return { ok: false, msg: `Max ${maxSlots} agents deployed.` };
  if (faction.credits < op.cost) return { ok: false, msg: `Need ${op.cost} credits.` };

  const sys = G.systems[targetSystemId];
  if (!sys) return { ok: false, msg: 'Invalid target.' };

  faction.credits -= op.cost;
  const targetFactionId = sys.owner !== null ? sys.owner : -1;
  const agent = createAgent(factionId, targetSystemId, targetFactionId, opKey);
  faction.agents.push(agent);

  addLog(G, `${faction.name} deploys agent to ${sys.name} (${op.label}).`, 'espionage');
  return { ok: true, agent };
}

// ─── PROCESS ESPIONAGE EACH TURN ─────────────────────────────
function processEspionage(G) {
  for (const faction of G.factions) {
    if (!faction.alive) continue;
    const completed = [];
    const active = [];

    for (const agent of faction.agents) {
      if (agent.status !== 'active') { completed.push(agent); continue; }

      agent.turnsLeft--;

      // Detection check each turn
      const targetSys = G.systems[agent.targetSystemId];
      const defFaction = targetSys && targetSys.owner !== null ? G.factions[targetSys.owner] : null;
      const detectBase = 0.08;  // 8% per turn base
      const defBonus   = defFaction ? (defFaction.techMods.spyDefense || 0) : 0;
      const atkBonus   = faction.techMods.spySuccess || 0;
      const detectChance = Math.max(0, detectBase + defBonus - atkBonus);

      if (rand() < detectChance) {
        // Agent blown
        agent.status = 'blown';
        changeReputation(G, faction.id, -8);
        if (defFaction) {
          setRelation(G, faction.id, defFaction.id,
            Math.min(-1, getRelation(G, faction.id, defFaction.id) - 1));
          addLog(G, `${faction.name}'s agent caught in ${targetSys.name}! Relations with ${defFaction.name} worsen.`, 'espionage');
        } else {
          addLog(G, `${faction.name}'s agent exposed in ${targetSys ? targetSys.name : '?'}.`, 'espionage');
        }
        completed.push(agent);
        continue;
      }

      if (agent.turnsLeft <= 0) {
        // Attempt the operation
        const op = ESP_OPS[agent.op];
        const successBase = op.baseSuccess + atkBonus - defBonus * 0.5;
        if (rand() < Math.max(0.05, Math.min(0.95, successBase))) {
          op.onSuccess(G, agent);
          agent.status = 'complete';
        } else {
          addLog(G, `${faction.name}'s ${op.label} operation in ${targetSys ? targetSys.name : '?'} failed.`, 'espionage');
          agent.status = 'complete';
        }
        completed.push(agent);
      } else {
        active.push(agent);
      }
    }
    faction.agents = active;  // remove finished agents
  }
}

// ─── AI ESPIONAGE DECISION ────────────────────────────────────
function aiDeployAgents(G, faction) {
  const p = faction.personality;
  if (rand() > p.wSpy * 0.6) return;
  const maxSlots = faction.techMods.agentSlots || 2;
  if (faction.agents.length >= maxSlots) return;

  // Pick a target: prefer player systems or strongest rival
  const rivals = G.factions.filter(f => f.alive && f.id !== faction.id);
  if (rivals.length === 0) return;

  rivals.sort((a, b) => countSystems(G, b.id) - countSystems(G, a.id));
  const target = rand() < 0.5 ? G.factions[G.playerIdx] : rivals[0];
  if (!target || !target.alive) return;

  const targetSystems = G.systems.filter(s => s.owner === target.id);
  if (targetSystems.length === 0) return;

  const targetSys = pick(targetSystems);
  const ops = Object.keys(ESP_OPS);
  // Weight ops by personality
  const weighted = ops.map(k => ({
    k,
    w: k === 'INTEL'             ? 0.5 :
       k === 'SABOTAGE'          ? p.wAttack * 0.7 :
       k === 'INCITE_REBELLION'  ? p.wSpy * 0.9 :
       k === 'ASSASSINATE'       ? p.wSpy * 0.5 : 0.2,
  }));
  const totalW = weighted.reduce((s, o) => s + o.w, 0);
  let r = rand() * totalW;
  let chosenOp = weighted[0].k;
  for (const o of weighted) { r -= o.w; if (r <= 0) { chosenOp = o.k; break; } }

  if (faction.credits >= ESP_OPS[chosenOp].cost) {
    deployAgent(G, faction.id, targetSys.id, chosenOp);
  }
}

/* ═══════════════════════════════════════════════════════════
   Part 6: AI Decision Engine
   ═══════════════════════════════════════════════════════════ */

// ─── UTILITY HELPERS ─────────────────────────────────────────
function aiSystemThreatLevel(G, faction) {
  // How many enemy fleets are near faction's systems?
  let threat = 0;
  const ownedIds = new Set(G.systems.filter(s => s.owner === faction.id).map(s => s.id));
  for (const sys of G.systems) {
    if (!ownedIds.has(sys.id)) continue;
    for (const nbId of sys.tradeRoutes) {
      const nb = G.systems[nbId];
      if (!nb || nb.owner === faction.id) continue;
      const rel = getRelation(G, faction.id, nb.owner !== null ? nb.owner : -1);
      if (rel <= -1) threat += 2;
      else if (rel === 0) threat += 0.5;
    }
    // Fleets moving toward us
    for (const fl of G.fleets) {
      if (fl.owner === faction.id) continue;
      if (fl.targetId === sys.id) {
        const rel = getRelation(G, faction.id, fl.owner);
        if (rel <= -1) threat += 5;
      }
    }
  }
  faction.aiMemory.threatLevel = threat;
  return threat;
}

function aiFactionPower(G, factionId) {
  const sys = countSystems(G, factionId) * 10;
  const fls = G.fleets.filter(f => f.owner === factionId).reduce((s, f) => s + fleetTotalShips(f), 0);
  const f = G.factions[factionId];
  const res = f ? (f.credits + f.minerals * 0.5) * 0.01 : 0;
  return sys + fls + res;
}

// ─── CANDIDATE ACTION BUILDERS ───────────────────────────────
function aiCandidateExpand(G, faction) {
  // Find nearest unowned system reachable from a border system
  const owned = G.systems.filter(s => s.owner === faction.id);
  const candidates = [];
  for (const sys of owned) {
    const g = sys.garrison;
    if (g.f + g.d + g.c + g.dn < 2) continue; // need ships to spare
    for (const nbId of sys.tradeRoutes) {
      const nb = G.systems[nbId];
      if (!nb || nb.colonized) continue;
      const dx = sys.x - nb.x, dy = sys.y - nb.y;
      const dist = Math.sqrt(dx*dx + dy*dy);
      // Score: closer + richer is better
      const richness = nb.baseCredits + nb.baseMinerals + nb.baseFood + nb.baseResearch;
      candidates.push({ type:'expand', fromSysId: sys.id, toSysId: nb.id,
        score: (richness * 5) - dist * 0.02 });
    }
  }
  return candidates;
}

function aiCandidateAttack(G, faction) {
  const p = faction.personality;
  const owned = G.systems.filter(s => s.owner === faction.id);
  const candidates = [];
  for (const sys of owned) {
    const g = sys.garrison;
    const atkShips = g.f + g.d + g.c + g.dn;
    if (atkShips < 3) continue;
    for (const nbId of sys.tradeRoutes) {
      const nb = G.systems[nbId];
      if (!nb || nb.owner === null || nb.owner === faction.id) continue;
      const rel = getRelation(G, faction.id, nb.owner);
      if (rel >= 2 && rand() > 0.05) continue; // don't attack allies except rarely
      const defStr = garrisonStrength(nb.garrison, G.factions[nb.owner]?.techMods || {});
      const atkStr = garrisonStrength(g, faction.techMods);
      if (atkStr < defStr * 0.8) continue; // skip if clearly outmatched
      const richness = nb.baseCredits + nb.baseMinerals + nb.baseFood + nb.baseResearch;
      const warBonus = rel === -2 ? 20 : 0;
      candidates.push({ type:'attack', fromSysId: sys.id, toSysId: nb.id,
        score: (atkStr / Math.max(1, defStr)) * 20 * p.fleetBias + richness * 2 + warBonus });
    }
  }
  return candidates;
}

function aiCandidateDefend(G, faction) {
  const candidates = [];
  for (const sys of G.systems) {
    if (sys.owner !== faction.id) continue;
    // Check for incoming enemy fleets
    const incoming = G.fleets.filter(f =>
      f.targetId === sys.id && f.owner !== faction.id &&
      getRelation(G, faction.id, f.owner) <= -1
    );
    if (incoming.length === 0) continue;
    // Find nearby friendly system with garrison to reinforce from
    for (const nbId of sys.tradeRoutes) {
      const nb = G.systems[nbId];
      if (!nb || nb.owner !== faction.id) continue;
      const g = nb.garrison;
      if (g.f + g.d + g.c + g.dn >= 3) {
        candidates.push({ type:'defend', fromSysId: nb.id, toSysId: sys.id, score: 60 });
      }
    }
  }
  return candidates;
}

function aiCandidateDiplomacy(G, faction) {
  const p = faction.personality;
  const candidates = [];
  for (const other of G.factions) {
    if (!other.alive || other.id === faction.id) continue;
    const rel = getRelation(G, faction.id, other.id);
    const otherPower = aiFactionPower(G, other.id);
    const myPower    = aiFactionPower(G, faction.id);

    // Alliance proposal
    if (rel < 2 && rel >= 0) {
      // Prefer allying against dominant power
      const playerPower = aiFactionPower(G, G.playerIdx);
      const allyVsPlayerBonus = otherPower < playerPower * 0.7 ? 15 : 0;
      candidates.push({ type:'diplo', target: other.id, offer:'alliance',
        score: p.wAlly * 30 + allyVsPlayerBonus + (rand()-0.5)*10 });
    }
    // Trade pact
    if (rel === 0) {
      candidates.push({ type:'diplo', target: other.id, offer:'trade_pact',
        score: p.wTrade * 25 + (rand()-0.5)*10 });
    }
    // Peace
    if (rel === -2 && myPower < otherPower * 0.8) {
      candidates.push({ type:'diplo', target: other.id, offer:'peace',
        score: 35 + p.wDefend * 20 + (rand()-0.5)*10 });
    }
    // War declaration
    if (rel >= 0 && myPower > otherPower * 1.4) {
      candidates.push({ type:'diplo', target: other.id, offer:'war',
        score: p.wAttack * 30 - 20 + (rand()-0.5)*15 });
    }
  }
  return candidates;
}

function aiCandidateBuildFleet(G, faction) {
  const p = faction.personality;
  // Only build if we have enough resources and the threat/ambition warrants it
  const threat = faction.aiMemory.threatLevel || 0;
  const owned  = countSystems(G, faction.id);
  const fleetCount = G.fleets.filter(f => f.owner === faction.id).length;
  const maxFleets  = Math.max(2, Math.floor(owned * 0.6));
  if (fleetCount >= maxFleets) return [];

  const richest = G.systems
    .filter(s => s.owner === faction.id)
    .sort((a, b) => b.development - a.development)[0];
  if (!richest) return [];

  // Composition scaled to personality and resources
  const creditBudget = Math.floor(faction.credits * 0.4);
  const minBudget    = Math.floor(faction.minerals * 0.4);
  if (creditBudget < 40 || minBudget < 20) return [];

  let comp = { f:0, d:0, c:0, dn:0 };
  let cr = creditBudget, mn = minBudget;
  // Militarists favour heavies, others build cheaper
  if (p.fleetBias >= 1.5 && cr >= SHIP.cruiser.creditCost && mn >= SHIP.cruiser.mineralCost) {
    comp.c = 1; cr -= SHIP.cruiser.creditCost; mn -= SHIP.cruiser.mineralCost;
  }
  while (cr >= SHIP.destroyer.creditCost && mn >= SHIP.destroyer.mineralCost && comp.d < 3) {
    comp.d++; cr -= SHIP.destroyer.creditCost; mn -= SHIP.destroyer.mineralCost;
  }
  while (cr >= SHIP.frigate.creditCost && mn >= SHIP.frigate.mineralCost && comp.f < 5) {
    comp.f++; cr -= SHIP.frigate.creditCost; mn -= SHIP.frigate.mineralCost;
  }
  if (comp.f + comp.d + comp.c + comp.dn === 0) return [];

  const score = p.wAttack * 20 + threat * 3 + (rand()-0.5)*10;
  return [{ type:'build', systemId: richest.id, comp, score }];
}

// ─── COALITION LOGIC ─────────────────────────────────────────
// If any single power (including player) controls >40% of systems,
// other factions increase willingness to ally against them
function applyCoalitionPressure(G) {
  const total = G.systems.length;
  const threshold = total * 0.40;
  for (const faction of G.factions) {
    if (!faction.alive) continue;
    const owned = countSystems(G, faction.id);
    if (owned < threshold) continue;
    // This faction is dominant — others should form coalitions
    for (const other of G.factions) {
      if (!other.alive || other.id === faction.id) continue;
      const rel = getRelation(G, other.id, faction.id);
      // Mark the dominant faction as coalition target
      other.aiMemory.coalitionTarget = faction.id;
      // Non-enemies get a nudge toward war if they're strong enough
      if (rel >= 0) {
        const otherOwned = countSystems(G, other.id);
        if (otherOwned > 5 && rand() < 0.08) {
          setRelation(G, other.id, faction.id, rel - 1);
          addLog(G, `${other.name} grows hostile toward the dominant ${faction.name}.`, 'diplo');
        }
      }
    }
  }
}

// ─── PICK BEST ACTION ────────────────────────────────────────
function aiSelectAction(G, faction) {
  const p = faction.personality;
  const allCandidates = [
    ...aiCandidateExpand(G, faction).map(c => ({ ...c, score: c.score * p.wExpand })),
    ...aiCandidateAttack(G, faction).map(c => ({ ...c, score: c.score * p.wAttack })),
    ...aiCandidateDefend(G, faction).map(c => ({ ...c, score: c.score * p.wDefend })),
    ...aiCandidateDiplomacy(G, faction).map(c => ({ ...c, score: c.score * p.wAlly })),
    ...aiCandidateBuildFleet(G, faction).map(c => ({ ...c, score: c.score })),
  ];
  if (allCandidates.length === 0) return null;
  // Sort descending, pick from top 3 with some randomness
  allCandidates.sort((a, b) => b.score - a.score);
  const topN = allCandidates.slice(0, Math.min(3, allCandidates.length));
  return pick(topN);
}

// ─── EXECUTE AI ACTION ───────────────────────────────────────
function aiExecuteAction(G, faction, action) {
  if (!action) return;
  faction.aiMemory.lastDecision = action.type;

  switch (action.type) {
    case 'expand':
      launchColonisationFleet(G, faction.id, action.fromSysId, action.toSysId);
      break;

    case 'attack': {
      // Launch attack fleet from garrison
      const sys = G.systems[action.fromSysId];
      if (!sys || sys.owner !== faction.id) break;
      const g = sys.garrison;
      const half = { f: Math.ceil(g.f/2), d: Math.ceil(g.d/2), c: Math.ceil(g.c/2), dn: Math.ceil(g.dn/2) };
      if (half.f + half.d + half.c + half.dn < 1) break;
      g.f -= half.f; g.d -= half.d; g.c -= half.c; g.dn -= half.dn;
      const fl = createFleet(faction.id, action.fromSysId, half,
        `${faction.warlordName}'s Strike Force`);
      const spd = faction.techMods.speedBonus || 0;
      fl.targetId  = action.toSysId;
      fl.turnsLeft = transitTurns(G, action.fromSysId, action.toSysId, spd);
      fl.status    = 'moving';
      G.fleets.push(fl);
      // If not at war, declare it
      const targetOwner = G.systems[action.toSysId]?.owner;
      if (targetOwner !== null && targetOwner !== undefined &&
          getRelation(G, faction.id, targetOwner) > -2) {
        playerDeclareWar(G, targetOwner); // abuse name — works for AI too
        applyDiploOutcome(G, faction.id, targetOwner, 'war', true);
      }
      break;
    }

    case 'defend': {
      // Move half garrison from source to threatened system
      const src = G.systems[action.fromSysId];
      if (!src || src.owner !== faction.id) break;
      const g = src.garrison;
      const take = { f: Math.ceil(g.f/2), d: Math.ceil(g.d/2), c: Math.ceil(g.c/2), dn: Math.ceil(g.dn/2) };
      if (take.f + take.d + take.c + take.dn < 1) break;
      g.f -= take.f; g.d -= take.d; g.c -= take.c; g.dn -= take.dn;
      const fl = createFleet(faction.id, action.fromSysId, take,
        `${faction.warlordName}'s Relief Force`);
      const spd = faction.techMods.speedBonus || 0;
      fl.targetId  = action.toSysId;
      fl.turnsLeft = transitTurns(G, action.fromSysId, action.toSysId, spd);
      fl.status    = 'moving';
      G.fleets.push(fl);
      break;
    }

    case 'diplo':
      proposeDiplomacy(G, faction.id, action.target, action.offer);
      break;

    case 'build':
      buildFleet(G, faction.id, action.systemId, action.comp);
      break;
  }
}

// ─── MAIN AI TURN ────────────────────────────────────────────
function runAI(G) {
  applyCoalitionPressure(G);
  for (const faction of G.factions) {
    if (!faction.alive || faction.isPlayer) continue;
    // Update threat level
    aiSystemThreatLevel(G, faction);
    // Research
    aiPickResearch(faction);
    // Espionage
    aiDeployAgents(G, faction);
    // Main action (up to 2 per turn for harder difficulties)
    const action = aiSelectAction(G, faction);
    aiExecuteAction(G, faction, action);
    // Second action on aggressive difficulties
    if (rand() < 0.4) {
      const action2 = aiSelectAction(G, faction);
      if (action2 && action2.type !== (action?.type)) {
        aiExecuteAction(G, faction, action2);
      }
    }
  }
}

/* ═══════════════════════════════════════════════════════════
   Part 7: Canvas Rendering & UI Panels
   ═══════════════════════════════════════════════════════════ */

// ─── CAMERA STATE ────────────────────────────────────────────
const CAM = { x: 0, y: 0, scale: 1.0 };
const CAM_MIN_SCALE = 0.18;
const CAM_MAX_SCALE = 3.0;
let canvas, ctx;
let _rafId = null;
let _isDragging = false;
let _dragStart = { x: 0, y: 0 };
let _camAtDragStart = { x: 0, y: 0 };

function worldToScreen(wx, wy) {
  return {
    x: (wx - CAM.x) * CAM.scale + canvas.width / 2,
    y: (wy - CAM.y) * CAM.scale + canvas.height / 2,
  };
}
function screenToWorld(sx, sy) {
  return {
    x: (sx - canvas.width  / 2) / CAM.scale + CAM.x,
    y: (sy - canvas.height / 2) / CAM.scale + CAM.y,
  };
}

function fitGalaxy() {
  if (!G || !canvas) return;
  const pad = 80;
  const scaleX = (canvas.width  - pad * 2) / G.galaxyW;
  const scaleY = (canvas.height - pad * 2) / G.galaxyH;
  CAM.scale = Math.min(scaleX, scaleY, CAM_MAX_SCALE);
  CAM.x = G.galaxyW / 2;
  CAM.y = G.galaxyH / 2;
}

// ─── NEBULA BACKGROUND ───────────────────────────────────────
function drawNebula() {
  if (!G) return;
  for (const ns of G.nebulaSeeds) {
    const wx = ns.x * G.galaxyW;
    const wy = ns.y * G.galaxyH;
    const { x, y } = worldToScreen(wx, wy);
    const r = ns.r * 600 * CAM.scale;
    const colors = [
      ['rgba(20,30,80,0)','rgba(20,30,80,0.18)'],
      ['rgba(60,10,80,0)','rgba(60,10,80,0.14)'],
      ['rgba(10,50,60,0)','rgba(10,50,60,0.16)'],
      ['rgba(5,20,50,0)','rgba(5,20,50,0.20)'],
    ];
    const [outer, inner] = colors[ns.c % colors.length];
    const grad = ctx.createRadialGradient(x, y, 0, x, y, r);
    grad.addColorStop(0, inner);
    grad.addColorStop(1, outer);
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fillStyle = grad;
    ctx.fill();
  }
}

// ─── DRAW TRADE ROUTES ───────────────────────────────────────
function drawTradeRoutes() {
  if (!G) return;
  ctx.save();
  const drawn = new Set();
  for (const sys of G.systems) {
    for (const nbId of sys.tradeRoutes) {
      const key = sys.id < nbId ? `${sys.id}-${nbId}` : `${nbId}-${sys.id}`;
      if (drawn.has(key)) continue;
      drawn.add(key);
      const nb = G.systems[nbId];
      const a = worldToScreen(sys.x, sys.y);
      const b = worldToScreen(nb.x, nb.y);
      // Color: both same owner = faction color, else dim
      let color = 'rgba(255,255,255,0.04)';
      if (sys.owner !== null && sys.owner === nb.owner) {
        const fc = G.factions[sys.owner];
        color = fc ? hexToRgba(fc.color, 0.18) : 'rgba(255,255,255,0.08)';
      } else if (sys.owner !== null && nb.owner !== null) {
        const relA = getRelation(G, sys.owner, nb.owner);
        if (relA >= 1) color = 'rgba(100,200,255,0.10)';
      }
      ctx.beginPath();
      ctx.moveTo(a.x, a.y);
      ctx.lineTo(b.x, b.y);
      ctx.strokeStyle = color;
      ctx.lineWidth = 1;
      ctx.stroke();
    }
  }
  ctx.restore();
}

// ─── DRAW WORMHOLES ──────────────────────────────────────────
function drawWormholes() {
  if (!G) return;
  const drawn = new Set();
  ctx.save();
  for (const sys of G.systems) {
    if (sys.wormholeTo === null) continue;
    const key = sys.id < sys.wormholeTo ? `${sys.id}-${sys.wormholeTo}` : `${sys.wormholeTo}-${sys.id}`;
    if (drawn.has(key)) continue;
    drawn.add(key);
    const nb = G.systems[sys.wormholeTo];
    if (!nb) continue;
    const a = worldToScreen(sys.x, sys.y);
    const b = worldToScreen(nb.x, nb.y);
    const mx = (a.x + b.x) / 2, my = (a.y + b.y) / 2;
    const cpx = mx + (b.y - a.y) * 0.3, cpy = my - (b.x - a.x) * 0.3;
    ctx.beginPath();
    ctx.moveTo(a.x, a.y);
    ctx.quadraticCurveTo(cpx, cpy, b.x, b.y);
    ctx.strokeStyle = 'rgba(200,100,255,0.5)';
    ctx.lineWidth = 1.5;
    ctx.setLineDash([4, 6]);
    ctx.stroke();
    ctx.setLineDash([]);
  }
  ctx.restore();
}

// ─── DRAW STAR SYSTEMS ───────────────────────────────────────
function drawSystems() {
  if (!G) return;
  const showLabels = CAM.scale > 0.55;
  ctx.save();
  for (const sys of G.systems) {
    const { x, y } = worldToScreen(sys.x, sys.y);
    // Cull off-screen
    if (x < -30 || x > canvas.width + 30 || y < -30 || y > canvas.height + 30) continue;

    const starR   = Math.max(2, sys.starType.radius * CAM.scale);
    const isSelected = G.selectedSystemId === sys.id;

    // Glow
    const glowR = starR * 3.5;
    const grad = ctx.createRadialGradient(x, y, 0, x, y, glowR);
    let baseColor = sys.starType.glowColor;
    if (sys.owner !== null) {
      baseColor = G.factions[sys.owner]?.color || baseColor;
    }
    grad.addColorStop(0, hexToRgba(baseColor, sys.colonized ? 0.55 : 0.15));
    grad.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.beginPath();
    ctx.arc(x, y, glowR, 0, Math.PI * 2);
    ctx.fillStyle = grad;
    ctx.fill();

    // Core star dot
    ctx.beginPath();
    ctx.arc(x, y, starR, 0, Math.PI * 2);
    ctx.fillStyle = sys.owner !== null
      ? (G.factions[sys.owner]?.color || sys.starType.color)
      : sys.starType.color;
    ctx.fill();

    // Selection ring
    if (isSelected) {
      ctx.beginPath();
      ctx.arc(x, y, starR + 5, 0, Math.PI * 2);
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 1.5;
      ctx.stroke();
      // Second pulsing ring
      const pulse = 0.5 + 0.5 * Math.sin(Date.now() * 0.004);
      ctx.beginPath();
      ctx.arc(x, y, starR + 9 + pulse * 3, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(79,195,247,${0.4 + pulse * 0.3})`;
      ctx.lineWidth = 1;
      ctx.stroke();
    }

    // Gold dashed ring for player's home capital
    const playerFaction = G.factions[G.playerIdx];
    if (playerFaction && sys.id === playerFaction.capitalId) {
      const pulse2 = 0.5 + 0.5 * Math.sin(Date.now() * 0.0018);
      ctx.beginPath();
      ctx.arc(x, y, starR + 15 + pulse2 * 3, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(255,215,0,${0.4 + pulse2 * 0.3})`;
      ctx.lineWidth = 1.5;
      ctx.setLineDash([5, 4]);
      ctx.stroke();
      ctx.setLineDash([]);
    }

    // Development indicator (tiny dots below star)
    if (sys.colonized && sys.development > 0 && CAM.scale > 0.4) {
      const devW = Math.min(sys.development, 10) * 2.5 * CAM.scale;
      ctx.fillStyle = G.factions[sys.owner]?.color || '#aaa';
      ctx.globalAlpha = 0.6;
      ctx.fillRect(x - devW / 2, y + starR + 3, devW, 2);
      ctx.globalAlpha = 1;
    }

    // Labels
    if (showLabels) {
      ctx.font = `${Math.max(9, 11 * CAM.scale)}px 'Segoe UI', sans-serif`;
      ctx.fillStyle = sys.owner !== null
        ? (G.factions[sys.owner]?.color || '#ccc')
        : 'rgba(160,180,200,0.6)';
      ctx.textAlign = 'center';
      ctx.fillText(sys.name, x, y - starR - 5);
    }
  }
  ctx.restore();
}

// ─── DRAW FLEET INDICATORS ───────────────────────────────────
function drawFleets() {
  if (!G) return;
  const t = Date.now();
  ctx.save();
  for (const fl of G.fleets) {
    if (fl.status !== 'moving' || fl.targetId === null) continue;
    const from = G.systems[fl.systemId];
    const to   = G.systems[fl.targetId];
    if (!from || !to) continue;

    const total = transitTurns(G, fl.systemId, fl.targetId,
      G.factions[fl.owner]?.techMods.speedBonus || 0);
    const progress = Math.max(0, Math.min(1, 1 - (fl.turnsLeft / total)));

    const ax = from.x + (to.x - from.x) * progress;
    const ay = from.y + (to.y - from.y) * progress;
    const { x, y } = worldToScreen(ax, ay);

    const fc = G.factions[fl.owner];
    const color = fc ? fc.color : '#fff';

    // Animated trail
    const pulse = 0.5 + 0.5 * Math.sin(t * 0.006 + fl.id);
    ctx.beginPath();
    ctx.arc(x, y, Math.max(3, 5 * CAM.scale), 0, Math.PI * 2);
    ctx.fillStyle = hexToRgba(color, 0.3 + pulse * 0.4);
    ctx.fill();

    // Solid center
    ctx.beginPath();
    ctx.arc(x, y, Math.max(2, 3 * CAM.scale), 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();

    // Transit line
    const sa = worldToScreen(from.x, from.y);
    const sb = worldToScreen(to.x, to.y);
    ctx.beginPath();
    ctx.moveTo(sa.x, sa.y);
    ctx.lineTo(sb.x, sb.y);
    ctx.strokeStyle = hexToRgba(color, 0.15);
    ctx.lineWidth = 1;
    ctx.setLineDash([3, 5]);
    ctx.stroke();
    ctx.setLineDash([]);
  }
  ctx.restore();
}

// ─── MAIN RENDER LOOP ────────────────────────────────────────
function renderGalaxy() {
  if (!canvas || !ctx || canvas.width === 0 || canvas.height === 0) return;
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Background
  ctx.fillStyle = '#070b14';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  drawNebula();
  drawTradeRoutes();
  drawWormholes();
  drawSystems();
  drawFleets();
}

function startRenderLoop() {
  function loop() {
    renderGalaxy();
    _rafId = requestAnimationFrame(loop);
  }
  if (_rafId) cancelAnimationFrame(_rafId);
  _rafId = requestAnimationFrame(loop);
}

function stopRenderLoop() {
  if (_rafId) { cancelAnimationFrame(_rafId); _rafId = null; }
}

// ─── CANVAS EVENT HANDLERS ───────────────────────────────────
function initMapEvents() {
  canvas.addEventListener('mousedown', onMapMouseDown);
  canvas.addEventListener('mousemove', onMapMouseMove);
  canvas.addEventListener('mouseup',   onMapMouseUp);
  canvas.addEventListener('wheel',     onMapWheel, { passive: false });
  canvas.addEventListener('click',     onMapClick);
  canvas.addEventListener('contextmenu', e => e.preventDefault());
}

function onMapMouseDown(e) {
  if (e.button === 2 || e.button === 1) {
    _isDragging = true;
    _dragStart = { x: e.clientX, y: e.clientY };
    _camAtDragStart = { x: CAM.x, y: CAM.y };
    canvas.style.cursor = 'grabbing';
  }
}
function onMapMouseMove(e) {
  if (_isDragging) {
    const dx = (e.clientX - _dragStart.x) / CAM.scale;
    const dy = (e.clientY - _dragStart.y) / CAM.scale;
    CAM.x = _camAtDragStart.x - dx;
    CAM.y = _camAtDragStart.y - dy;
  }
  // Tooltip
  showTooltipAt(e.clientX, e.clientY);
}
function onMapMouseUp(e) {
  _isDragging = false;
  canvas.style.cursor = 'crosshair';
}
function onMapWheel(e) {
  e.preventDefault();
  const factor = e.deltaY < 0 ? 1.12 : 0.89;
  const newScale = Math.max(CAM_MIN_SCALE, Math.min(CAM_MAX_SCALE, CAM.scale * factor));
  // Zoom toward mouse position
  const rect = canvas.getBoundingClientRect();
  const mx = e.clientX - rect.left;
  const my = e.clientY - rect.top;
  const wx = (mx - canvas.width  / 2) / CAM.scale + CAM.x;
  const wy = (my - canvas.height / 2) / CAM.scale + CAM.y;
  CAM.scale = newScale;
  CAM.x = wx - (mx - canvas.width  / 2) / CAM.scale;
  CAM.y = wy - (my - canvas.height / 2) / CAM.scale;
}
function onMapClick(e) {
  if (!G) return;
  const rect = canvas.getBoundingClientRect();
  const sx = e.clientX - rect.left;
  const sy = e.clientY - rect.top;
  const { x: wx, y: wy } = screenToWorld(sx, sy);

  // Find nearest system within 20 screen pixels
  let best = null, bestD = Infinity;
  for (const sys of G.systems) {
    const { x, y } = worldToScreen(sys.x, sys.y);
    const d = Math.hypot(x - sx, y - sy);
    if (d < bestD) { bestD = d; best = sys; }
  }
  if (best && bestD < 20) {
    G.selectedSystemId = best.id;
    renderRightPanel(best);
  } else {
    G.selectedSystemId = null;
    showRpPlaceholder();
  }
}

function showTooltipAt(clientX, clientY) {
  if (!G) return;
  const tt = UI.tooltip;
  const rect = canvas.getBoundingClientRect();
  const sx = clientX - rect.left, sy = clientY - rect.top;
  let best = null, bestD = Infinity;
  for (const sys of G.systems) {
    const { x, y } = worldToScreen(sys.x, sys.y);
    const d = Math.hypot(x - sx, y - sy);
    if (d < bestD) { bestD = d; best = sys; }
  }
  if (best && bestD < 22) {
    const owner = best.owner !== null ? G.factions[best.owner]?.name : 'Uncolonised';
    const ownerColor = best.owner !== null ? (G.factions[best.owner]?.color || '#aaa') : '#666';
    tt.innerHTML = `<div class="tooltip-name">${best.name}</div>
      <div class="tooltip-owner" style="color:${ownerColor}">${owner}</div>
      <div class="tooltip-res">${best.starType.name} · ${best.planets.length} planets</div>
      <div class="tooltip-res">Dev: ${best.development}/10</div>`;
    tt.style.left = (clientX - rect.left + 14) + 'px';
    tt.style.top  = (clientY - rect.top  + 14) + 'px';
    tt.classList.remove('hidden');
  } else {
    tt.classList.add('hidden');
  }
}

// ─── TOP BAR HUD ─────────────────────────────────────────────
function renderTopBar() {
  if (!G) return;
  const pf = G.factions[G.playerIdx];
  UI.topbarFactionName.textContent = pf.name.toUpperCase();
  UI.topbarTurnNum.textContent = G.turn;

  const res = [
    ['credits',  pf.credits,       pf.deltaCredits,   UI.hudCredits,  UI.hudCreditsDelta],
    ['minerals', pf.minerals,      pf.deltaMinerals,  UI.hudMinerals, UI.hudMineralsDelta],
    ['food',     pf.food,          pf.deltaFood,      UI.hudFood,     UI.hudFoodDelta],
    ['research', pf.researchPoints,pf.deltaResearch,  UI.hudResearch, UI.hudResearchDelta],
    ['influence',pf.influence,     pf.deltaInfluence, UI.hudInfluence,UI.hudInfluenceDelta],
  ];
  for (const [, val, delta, el, deltaEl] of res) {
    el.textContent = Math.floor(val);
    deltaEl.textContent = (delta >= 0 ? '+' : '') + Math.floor(delta);
    deltaEl.className = 'res-delta' + (delta < 0 ? ' neg' : '');
  }
  UI.hudSystems.textContent = countSystems(G, G.playerIdx);
  UI.hudFleets.textContent  = G.fleets.filter(f => f.owner === G.playerIdx).length;
  // Update pause button to reflect current state
  if (UI.btnPause) {
    const paused = G.paused || G.modalPaused;
    UI.btnPause.textContent = paused ? '▶' : '‖';
    UI.btnPause.title       = paused ? 'Resume (Space)' : 'Pause (Space)';
    UI.btnPause.classList.toggle('btn-hud-active', paused);
  }
}

// ─── LEFT PANEL RENDERING ────────────────────────────────────
function renderLeftPanel() {
  if (!G) return;
  const activeTab = document.querySelector('.lp-tab.active')?.dataset.tab || 'overview';
  switch (activeTab) {
    case 'overview':  renderEmpireTab(); break;
    case 'fleets':    renderFleetsTab(); break;
    case 'diplomacy': renderDiplomacyTab(); break;
    case 'tech':      renderTechTab(); break;
    case 'espionage': renderEspionageTab(); break;
    case 'events':    renderEventsTab(); break;
  }
}

// ─── VICTORY PROGRESS HELPER ─────────────────────────────────
function victoryProgressInfo(G, pf) {
  switch (G.victoryCondition) {
    case 'domination': {
      const owned  = countSystems(G, pf.id);
      const needed = Math.ceil(G.systems.length * 0.70);
      return { label: 'Domination', detail: `${owned} / ${needed} systems`, pct: Math.min(100, Math.floor(owned / needed * 100)) };
    }
    case 'economic': {
      const others   = G.factions.filter(f => f.alive && f.id !== pf.id);
      const maxOther = others.length ? Math.max(...others.map(f => f.credits)) : 0;
      const gap      = Math.max(0, pf.credits - maxOther);
      return { label: 'Economic', detail: `+${Math.floor(gap).toLocaleString()} / 10,000 credit lead`, pct: Math.min(100, Math.floor(gap / 10000 * 100)) };
    }
    case 'scientific': {
      const done = pf.techResearched.length;
      return { label: 'Scientific', detail: `${done} / ${TECH_TREE.length} technologies`, pct: Math.floor(done / TECH_TREE.length * 100) };
    }
    case 'diplomatic': {
      const alls = Object.values(pf.relations).filter(v => v >= 2).length;
      return { label: 'Diplomatic', detail: `${alls} / 5 alliances`, pct: Math.min(100, Math.floor(alls / 5 * 100)) };
    }
    case 'survival': {
      const total = G.factions.length;
      const alive = G.factions.filter(f => f.alive && f.id !== pf.id).length;
      const pct   = total > 1 ? Math.floor((total - 1 - alive) / (total - 1) * 100) : 100;
      return { label: 'Survival', detail: `${alive} rival${alive !== 1 ? 's' : ''} remaining`, pct };
    }
    default: return { label: 'Domination', detail: '', pct: 0 };
  }
}

// ─── EMPIRE ALERTS HELPER ────────────────────────────────────
function getEmpireAlerts(G, pf) {
  const alerts = [];
  const myIds    = new Set(G.systems.filter(s => s.owner === G.playerIdx).map(s => s.id));
  const incoming = G.fleets.filter(f => f.owner !== G.playerIdx && f.targetId !== null && myIds.has(f.targetId));
  if (incoming.length)
    alerts.push({ level:'danger', icon:'&#128680;', text:`${incoming.length} enemy fleet${incoming.length > 1 ? 's' : ''} approaching your territory!`, tab: null });
  if (!pf.currentResearch)
    alerts.push({ level:'warn',   icon:'&#128300;', text:'No research active &mdash; open TECH tab', tab:'tech' });
  const idle = G.fleets.filter(f => f.owner === G.playerIdx && f.status === 'idle').length;
  if (idle)
    alerts.push({ level:'info',   icon:'&#128640;', text:`${idle} idle fleet${idle > 1 ? 's' : ''} &mdash; issue movement orders`, tab:'fleets' });
  const unclaimed = G.systems.filter(s => s.owner === null).length;
  if (unclaimed)
    alerts.push({ level:'info',   icon:'&#11088;',  text:`${unclaimed} unclaimed systems to colonise`, tab:'fleets' });
  const wars = Object.entries(pf.relations).filter(([, v]) => v <= -2).length;
  if (wars)
    alerts.push({ level:'warn',   icon:'&#9876;&#65039;',  text:`At war with ${wars} faction${wars > 1 ? 's' : ''}`, tab:'diplomacy' });
  if (!alerts.length)
    alerts.push({ level:'good', icon:'&#9989;', text:'Empire running smoothly', tab: null });
  return alerts;
}

function renderEmpireTab() {
  const pf      = G.factions[G.playerIdx];
  const owned   = countSystems(G, pf.id);
  const total   = G.systems.length;
  const fleetCount = G.fleets.filter(f => f.owner === pf.id).length;
  const allies  = Object.entries(pf.relations).filter(([, v]) => v >= 2).length;
  const wars    = Object.entries(pf.relations).filter(([, v]) => v <= -2).length;

  UI.empireStats.innerHTML = [
    ['Style',       pf.personality.label],
    ['Systems',     `${owned} / ${total} (${Math.floor(owned / total * 100)}%)`],
    ['Fleets',      fleetCount],
    ['Reputation',  pf.reputation],
    ['Allies',      allies],
    ['At War',      wars],
    ['Researching', pf.currentResearch ? getTechById(pf.currentResearch)?.name : '<span style="color:#ef9a9a">None — open TECH!</span>'],
    ['Tech',        `${pf.techResearched.length} / ${TECH_TREE.length} researched`],
  ].map(([l, v]) =>
    `<div class="empire-stat"><span class="label">${l}</span><span class="val">${v}</span></div>`
  ).join('');

  // Power ranking
  const ranked = [...G.factions]
    .filter(f => f.alive)
    .sort((a, b) => aiFactionPower(G, b.id) - aiFactionPower(G, a.id));
  UI.powerRanking.innerHTML = ranked.map((f, i) => {
    const isMe = f.id === G.playerIdx;
    return `<div class="pr-row${isMe ? ' pr-player' : ''}">
      <span class="pr-rank">${i + 1}</span>
      <span class="pr-dot" style="background:${f.color}"></span>
      <span class="pr-name">${isMe ? '&#9733; ' : ''}${f.name}</span>
      <span class="pr-score">${Math.floor(aiFactionPower(G, f.id))}</span>
    </div>`;
  }).join('');

  // Victory progress
  if (UI.victoryProgress) {
    const vp = victoryProgressInfo(G, pf);
    const barCol = vp.pct >= 80 ? '#66bb6a' : vp.pct >= 50 ? '#f9a825' : '#4fc3f7';
    UI.victoryProgress.innerHTML =
      `<div class="vc-progress">
        <div class="vc-label">${vp.label}: ${vp.detail} <span class="vc-pct">${vp.pct}%</span></div>
        <div class="vc-bar-outer"><div class="vc-bar-inner" style="width:${vp.pct}%;background:${barCol}"></div></div>
      </div>`;
  }

  // Action alerts
  if (UI.empireAlerts) {
    const alerts = getEmpireAlerts(G, pf);
    UI.empireAlerts.innerHTML = alerts.map(a =>
      `<div class="alert-row ${a.level}"${a.tab ? ` data-tab="${a.tab}"` : ''}>${a.icon} ${a.text}</div>`
    ).join('');
    UI.empireAlerts.querySelectorAll('[data-tab]').forEach(el => {
      el.addEventListener('click', () =>
        document.querySelector(`.lp-tab[data-tab="${el.dataset.tab}"]`)?.click()
      );
    });
  }
}

function renderFleetsTab() {
  const myFleets = G.fleets.filter(f => f.owner === G.playerIdx);
  if (myFleets.length === 0) {
    UI.fleetList.innerHTML = '<div style="color:var(--text-dim);font-size:11px;padding:6px">No fleets. Build one!</div>';
    return;
  }
  UI.fleetList.innerHTML = myFleets.map(fl => {
    const loc = G.systems[fl.systemId]?.name || '?';
    const dest = fl.targetId !== null ? G.systems[fl.targetId]?.name : null;
    const statusClass = fl.status === 'idle' ? 'idle' : fl.status === 'combat' ? 'combat' : '';
    const comp = shipCompSummary(fl);
    return `<div class="fleet-row" data-fleet="${fl.id}">
      <div class="fleet-name">${fl.name}</div>
      <div class="fleet-loc">${dest ? `${loc} → ${dest} (${fl.turnsLeft}t)` : loc}</div>
      <div class="fleet-comp">${comp}</div>
      <div class="fleet-status ${statusClass}">${fl.status.toUpperCase()}</div>
    </div>`;
  }).join('');

  // Bind move clicks
  UI.fleetList.querySelectorAll('.fleet-row').forEach(row => {
    row.addEventListener('click', () => {
      const fid = parseInt(row.dataset.fleet);
      openMoveFleetModal(fid);
    });
  });
}

function shipCompSummary(fl) {
  const parts = [];
  if (fl.frigates)     parts.push(`${fl.frigates}F`);
  if (fl.destroyers)   parts.push(`${fl.destroyers}D`);
  if (fl.cruisers)     parts.push(`${fl.cruisers}C`);
  if (fl.dreadnoughts) parts.push(`${fl.dreadnoughts}DN`);
  return parts.join(' · ') || 'Empty';
}

function renderDiplomacyTab() {
  const pf = G.factions[G.playerIdx];
  UI.diplomacyList.innerHTML = G.factions
    .filter(f => f.id !== G.playerIdx && f.alive)
    .sort((a, b) => (pf.relations[b.id] || 0) - (pf.relations[a.id] || 0))
    .map(f => {
      const rel = pf.relations[f.id] ?? 0;
      const color = relationColor(rel);
      const label = relationLabel(rel);
      return `<div class="diplo-row">
        <span class="diplo-dot" style="background:${f.color}"></span>
        <span class="diplo-name">${f.name}</span>
        <span class="diplo-status" style="color:${color}">${label}</span>
        <div class="diplo-actions">
          ${rel < 2 && rel >= 0 ? `<button class="btn-diplo" data-fid="${f.id}" data-type="alliance">Ally</button>` : ''}
          ${rel === 0 ? `<button class="btn-diplo" data-fid="${f.id}" data-type="trade_pact">Trade</button>` : ''}
          ${rel >= 0 ? `<button class="btn-diplo war" data-fid="${f.id}" data-type="war">War</button>` : ''}
          ${rel === -2 ? `<button class="btn-diplo" data-fid="${f.id}" data-type="peace">Peace</button>` : ''}
        </div>
      </div>`;
    }).join('');

  UI.diplomacyList.querySelectorAll('.btn-diplo').forEach(btn => {
    btn.addEventListener('click', () => {
      const fid  = parseInt(btn.dataset.fid);
      const type = btn.dataset.type;
      if (type === 'war') { playerDeclareWar(G, fid); }
      else                { playerProposeDiplomacy(G, fid, type); }
      renderDiplomacyTab();
    });
  });
}

function renderTechTab() {
  const pf = G.factions[G.playerIdx];
  const branches = [...new Set(TECH_TREE.map(t => t.branch))];
  UI.techTree.innerHTML = branches.map(branch => {
    const techs = TECH_TREE.filter(t => t.branch === branch);
    return `<div class="tech-branch">
      <div class="tech-branch-title">${branch.toUpperCase()}</div>
      ${techs.map(t => {
        const done      = pf.techResearched.includes(t.id);
        const active    = pf.currentResearch === t.id;
        const locked    = t.prereq && !pf.techResearched.includes(t.prereq);
        const progress  = active ? Math.floor(pf.researchProgress / t.cost * 100) : 0;
        const cls       = done ? 'researched' : active ? 'researching' : locked ? 'locked' : '';
        return `<div class="tech-item ${cls}" data-tech="${t.id}" title="${t.desc}">
          <span class="tech-icon">${t.icon}</span>
          <span class="tech-name">${t.name}${active ? ` (${progress}%)` : ''}</span>
          <span class="tech-cost">${done ? '✓' : locked ? '🔒' : t.cost+'RP'}</span>
        </div>`;
      }).join('')}
    </div>`;
  }).join('');

  UI.techTree.querySelectorAll('.tech-item:not(.researched):not(.locked):not(.researching)').forEach(el => {
    el.addEventListener('click', () => {
      const tid = el.dataset.tech;
      if (setResearch(pf, tid)) {
        addLog(G, `Research started: ${getTechById(tid)?.name}.`, 'research');
        renderTechTab();
      }
    });
  });
}

function renderEspionageTab() {
  const pf = G.factions[G.playerIdx];
  const maxSlots = pf.techMods.agentSlots || 2;
  let html = `<div class="empire-stat"><span class="label">Agents Active</span><span class="val">${pf.agents.length}/${maxSlots}</span></div>`;

  if (pf.agents.length > 0) {
    html += pf.agents.map(a => {
      const op = ESP_OPS[a.op];
      const sys = G.systems[a.targetSystemId];
      return `<div class="esp-slot">
        <div class="esp-slot-title">${sys ? sys.name : '?'}</div>
        <div class="esp-slot-op">${op?.label || a.op}</div>
        <div class="esp-slot-status">${a.turnsLeft} turns remaining</div>
      </div>`;
    }).join('');
  }

  // Deploy new agent buttons
  if (pf.agents.length < maxSlots) {
    html += `<div class="lp-section-title" style="margin-top:8px">DEPLOY AGENT</div>`;
    const opKeys = Object.keys(ESP_OPS);
    html += opKeys.map(k => {
      const op = ESP_OPS[k];
      return `<button class="btn-action" style="margin-bottom:5px" data-op="${k}">
        ${op.label} (${op.cost}Cr)
      </button>`;
    }).join('');
  }

  UI.espionagePanel.innerHTML = html;
  UI.espionagePanel.querySelectorAll('[data-op]').forEach(btn => {
    btn.addEventListener('click', () => {
      openDeployAgentModal(btn.dataset.op);
    });
  });
}

function renderEventsTab() {
  const recent = [...G.events].reverse().slice(0, 60);
  UI.eventLog.innerHTML = recent.map(e =>
    `<div class="event-entry">
      <div class="event-turn">Turn ${e.turn}</div>
      <div class="event-text ${e.type}">${e.text}</div>
    </div>`
  ).join('');
}

// ─── RIGHT PANEL ─────────────────────────────────────────────
function showRpPlaceholder() {
  UI.rpPlaceholder.classList.remove('hidden');
  UI.rpSystem.classList.add('hidden');
}

function renderRightPanel(sys) {
  if (!sys) { showRpPlaceholder(); return; }
  UI.rpPlaceholder.classList.add('hidden');
  UI.rpSystem.classList.remove('hidden');

  const owner = sys.owner !== null ? G.factions[sys.owner] : null;
  const pf    = G.factions[G.playerIdx];
  const rel   = owner && owner.id !== G.playerIdx
    ? getRelation(G, G.playerIdx, owner.id) : null;

  UI.rpSysName.textContent  = sys.name;
  UI.rpSysOwner.textContent = owner
    ? `${owner.name} — ${owner.warlordName}${rel !== null ? ` (${relationLabel(rel)})` : ''}`
    : 'Uncolonised';
  UI.rpSysOwner.style.color = owner ? owner.color : '#666';
  UI.rpSysType.textContent  = `${sys.starType.name} · Development ${sys.development}/10`;

  // Planets
  UI.rpPlanets.innerHTML = sys.planets.map(p =>
    `<div class="planet-row">
      <span class="planet-icon">${p.icon}</span>
      <span class="planet-name">${sys.name} ${p.name}</span>
      <span class="planet-type">${p.type}</span>
    </div>`
  ).join('');

  // Resources
  const y = sys.colonized && owner
    ? systemYield(G, sys, owner)
    : { credits: sys.baseCredits, minerals: sys.baseMinerals, food: sys.baseFood, research: sys.baseResearch, influence: sys.baseInfluence };
  UI.rpRes.innerHTML = [
    ['◈ Credits',  y.credits],
    ['⬡ Minerals', y.minerals],
    ['❋ Food',     y.food],
    ['⚛ Research', y.research],
    ['✦ Influence',y.influence],
  ].map(([l,v]) =>
    `<div class="res-row"><span class="res-label">${l}</span><span class="res-val">+${v}/turn</span></div>`
  ).join('');

  // Garrison
  const g = sys.garrison;
  UI.rpGarrison.innerHTML = `<div class="garrison-row">Garrison: ${shipCompSummary({
    frigates: g.f, destroyers: g.d, cruisers: g.c, dreadnoughts: g.dn
  }) || 'None'}</div>`;

  // In-transit fleets
  const incoming = G.fleets.filter(f => f.targetId === sys.id);
  if (incoming.length) {
    UI.rpGarrison.innerHTML += incoming.map(fl => {
      const fc = G.factions[fl.owner];
      return `<div class="garrison-row" style="color:${fc?.color||'#aaa'}">`
        + `${fc?.name||'?'}: ${shipCompSummary(fl)} (${fl.turnsLeft}t)</div>`;
    }).join('');
  }

  // Actions
  UI.rpActions.innerHTML = '';
  const actions = [];
  if (sys.owner === G.playerIdx) {
    // Own system
    actions.push({ label:'Deploy Fleet Here', fn: () => openMoveFleetToSystem(sys.id) });
    if (!sys.colonized) {
      actions.push({ label:'Colonise', fn: () => { /* handled by fleet */ } });
    }
  } else if (sys.owner === null) {
    actions.push({ label:'Colonise System', fn: () => openColoniseModal(sys.id) });
  } else {
    // Enemy or neutral
    if (pf.relations[sys.owner] >= 0) {
      actions.push({ label:'Propose Alliance', fn: () => { playerProposeDiplomacy(G, sys.owner, 'alliance'); renderDiplomacyTab(); } });
      actions.push({ label:'Propose Trade Pact', fn: () => { playerProposeDiplomacy(G, sys.owner, 'trade_pact'); renderDiplomacyTab(); } });
    }
    actions.push({ label:'DECLARE WAR', danger: true, fn: () => { playerDeclareWar(G, sys.owner); renderDiplomacyTab(); } });
    actions.push({ label:'Deploy Attack Fleet', fn: () => openAttackModal(sys.id) });
  }
  const grid = document.createElement('div');
  grid.className = 'action-grid';
  actions.forEach(a => {
    const btn = document.createElement('button');
    btn.className = 'btn-rp-action' + (a.danger ? ' danger' : '');
    btn.textContent = a.label;
    btn.addEventListener('click', a.fn);
    grid.appendChild(btn);
  });
  UI.rpActions.appendChild(grid);
}

// ─── TICKER ──────────────────────────────────────────────────
function updateTicker() {
  if (!G || G.events.length === 0) return;
  const recent = G.events.slice(-5).map(e => e.text).join('   ✦   ');
  UI.tickerText.textContent = recent + '   ✦   ' + recent;
}

// ─── COLOR UTILITY ───────────────────────────────────────────
function hexToRgba(hex, alpha) {
  if (!hex || hex[0] !== '#') return `rgba(150,150,150,${alpha})`;
  const r = parseInt(hex.slice(1,3),16);
  const g = parseInt(hex.slice(3,5),16);
  const b = parseInt(hex.slice(5,7),16);
  return `rgba(${r},${g},${b},${alpha})`;
}

// ─── CANVAS RESIZE ───────────────────────────────────────────
function resizeCanvas() {
  if (!canvas) return;
  const container = document.getElementById('map-container');
  canvas.width  = container.clientWidth;
  canvas.height = container.clientHeight;
}

// ─── OPEN MODAL HELPERS (stubs used by UI; fully wired in Part 8) ──
function openMoveFleetModal(fleetId)      { G.selectedFleetId = fleetId; showModal('modal-move-fleet'); populateMoveFleetModal(fleetId); }
function openMoveFleetToSystem(sysId)     { populateMoveFleetModalForTarget(sysId); showModal('modal-move-fleet'); }
function openColoniseModal(targetSysId)   { openAttackModal(targetSysId); }
function openAttackModal(targetSysId)     { populateMoveFleetModalForTarget(targetSysId); showModal('modal-move-fleet'); }
function openDeployAgentModal(opKey)      { activeAgentOp = opKey; populateDeployAgentModal(opKey); showModal('modal-move-fleet'); }

/* ═══════════════════════════════════════════════════════════
   Part 8: Modals, Save/Load, Simulation Loop & Boot
   ═══════════════════════════════════════════════════════════ */

// ─── TECH LOOKUP HELPER ──────────────────────────────────────
function getTechById(id) {
  return TECH_TREE.find(t => t.id === id) || null;
}

// ─── MODAL SYSTEM ────────────────────────────────────────────
function showModal(id) {
  document.querySelectorAll('.modal-overlay').forEach(m => m.classList.add('hidden'));
  const el = document.getElementById(id);
  if (el) el.classList.remove('hidden');
  if (G) G.modalPaused = true;
}
function hideAllModals() {
  document.querySelectorAll('.modal-overlay').forEach(m => m.classList.add('hidden'));
  if (G) G.modalPaused = false;
}

// ─── BUILD FLEET MODAL ───────────────────────────────────────
function openBuildFleetModal(systemId) {
  const pf = G.factions[G.playerIdx];
  const sys = G.systems[systemId];
  if (!sys || sys.owner !== G.playerIdx) return;
  G.buildTargetSystemId = systemId;

  document.getElementById('bfm-system-name').textContent = sys.name;
  document.getElementById('bfm-credits').textContent = Math.floor(pf.credits);
  document.getElementById('bfm-minerals').textContent = Math.floor(pf.minerals);

  // Reset counts
  ['frigate','destroyer','cruiser','dreadnought'].forEach(t => {
    const el = document.getElementById(`bfm-count-${t}`);
    if (el) el.textContent = '0';
  });
  updateBuildFleetCost();
  showModal('modal-build-fleet');
}

function getBuildComp() {
  return {
    f:  parseInt(document.getElementById('bfm-count-frigate')?.textContent     || 0),
    d:  parseInt(document.getElementById('bfm-count-destroyer')?.textContent   || 0),
    c:  parseInt(document.getElementById('bfm-count-cruiser')?.textContent     || 0),
    dn: parseInt(document.getElementById('bfm-count-dreadnought')?.textContent || 0),
  };
}

function updateBuildFleetCost() {
  const comp = getBuildComp();
  const totalCr = comp.f  * SHIP.frigate.creditCost
               +  comp.d  * SHIP.destroyer.creditCost
               +  comp.c  * SHIP.cruiser.creditCost
               +  comp.dn * SHIP.dreadnought.creditCost;
  const totalMn = comp.f  * SHIP.frigate.mineralCost
               +  comp.d  * SHIP.destroyer.mineralCost
               +  comp.c  * SHIP.cruiser.mineralCost
               +  comp.dn * SHIP.dreadnought.mineralCost;
  const el = document.getElementById('bfm-total-cost');
  if (el) el.textContent = `Cost: ${totalCr} Cr | ${totalMn} Min`;
}

function wireBuildFleetModal() {
  const modal = document.getElementById('modal-build-fleet');
  if (!modal) return;

  ['frigate','destroyer','cruiser','dreadnought'].forEach(type => {
    modal.querySelector(`#bfm-inc-${type}`)?.addEventListener('click', () => {
      const el = document.getElementById(`bfm-count-${type}`);
      el.textContent = parseInt(el.textContent) + 1;
      updateBuildFleetCost();
    });
    modal.querySelector(`#bfm-dec-${type}`)?.addEventListener('click', () => {
      const el = document.getElementById(`bfm-count-${type}`);
      el.textContent = Math.max(0, parseInt(el.textContent) - 1);
      updateBuildFleetCost();
    });
  });

  modal.querySelector('#bfm-confirm')?.addEventListener('click', () => {
    const comp = getBuildComp();
    const total = comp.f + comp.d + comp.c + comp.dn;
    if (total === 0) return;
    const result = buildFleet(G, G.playerIdx, G.buildTargetSystemId, comp);
    if (result.ok) {
      addLog(G, `Fleet built at ${G.systems[G.buildTargetSystemId].name}.`, 'fleet');
      hideAllModals();
    } else {
      document.getElementById('bfm-error').textContent = result.msg || 'Insufficient resources!';
    }
  });
  modal.querySelector('#bfm-cancel')?.addEventListener('click', hideAllModals);
}

// ─── MOVE FLEET MODAL ────────────────────────────────────────
let _moveFleetTarget = null;

function populateMoveFleetModal(fleetId) {
  const fl = G.fleets.find(f => f.id === fleetId);
  const pf = G.factions[G.playerIdx];
  if (!fl || fl.owner !== G.playerIdx) return;

  const modal = document.getElementById('modal-move-fleet');
  modal.querySelector('#mfm-title').textContent = `Move: ${fl.name}`;
  modal.querySelector('#mfm-fleet-info').textContent =
    `At: ${G.systems[fl.systemId]?.name || '?'} | ${shipCompSummary(fl)}`;

  populateMoveTargetList(fl.systemId);
}

function populateMoveFleetModalForTarget(targetSysId) {
  const pf = G.factions[G.playerIdx];
  const myFleets = G.fleets.filter(f => f.owner === G.playerIdx && f.status === 'idle');
  if (myFleets.length === 0) {
    addLog(G, 'No idle fleets available to send.', 'warn');
    return;
  }

  const modal = document.getElementById('modal-move-fleet');
  modal.querySelector('#mfm-title').textContent = `Send Fleet to ${G.systems[targetSysId]?.name || '?'}`;
  modal.querySelector('#mfm-fleet-info').textContent = 'Select a fleet to send:';

  const list = modal.querySelector('#mfm-target-list');
  if (list) {
    list.innerHTML = myFleets.map(fl =>
      `<div class="move-target-row" data-fleet="${fl.id}" data-target="${targetSysId}">
        ${fl.name} — at ${G.systems[fl.systemId]?.name || '?'} | ${shipCompSummary(fl)}
      </div>`
    ).join('');
    list.querySelectorAll('.move-target-row').forEach(row => {
      row.addEventListener('click', () => {
        const fid = parseInt(row.dataset.fleet);
        const tid = parseInt(row.dataset.target);
        orderFleetMove(G, fid, tid);
        addLog(G, `Fleet ordered to ${G.systems[tid]?.name || '?'}.`, 'fleet');
        hideAllModals();
      });
    });
  }
  showModal('modal-move-fleet');
}

function populateMoveTargetList(fromSysId) {
  const modal    = document.getElementById('modal-move-fleet');
  const list     = modal?.querySelector('#mfm-target-list');
  if (!list) return;
  const reachable = G.systems.filter(s => s.id !== fromSysId);
  list.innerHTML = reachable
    .sort((a, b) => {
      const da = Math.hypot(a.x - G.systems[fromSysId].x, a.y - G.systems[fromSysId].y);
      const db = Math.hypot(b.x - G.systems[fromSysId].x, b.y - G.systems[fromSysId].y);
      return da - db;
    })
    .slice(0, 20)
    .map(s => {
      const owner  = s.owner !== null ? G.factions[s.owner]?.name : 'Uncolonised';
      const rel    = s.owner !== null && s.owner !== G.playerIdx
        ? ` (${relationLabel(getRelation(G, G.playerIdx, s.owner))})` : '';
      return `<div class="move-target-row" data-target="${s.id}">
        <span>${s.name}</span>
        <span style="color:${s.owner ? G.factions[s.owner]?.color : '#555'}">${owner}${rel}</span>
      </div>`;
    }).join('');

  list.querySelectorAll('.move-target-row').forEach(row => {
    row.addEventListener('click', () => {
      if (!G.selectedFleetId) return;
      const tid = parseInt(row.dataset.target);
      orderFleetMove(G, G.selectedFleetId, tid);
      addLog(G, `Fleet ordered to ${G.systems[tid]?.name || '?'}.`, 'fleet');
      hideAllModals();
    });
  });
}

function wireMoveFleetModal() {
  const modal = document.getElementById('modal-move-fleet');
  modal?.querySelector('#mfm-cancel')?.addEventListener('click', hideAllModals);
}

// ─── DEPLOY AGENT MODAL (reuses move-fleet slot or a custom one) ─
let activeAgentOp = null;

function populateDeployAgentModal(opKey) {
  const op = ESP_OPS[opKey];
  if (!op) return;
  const modal = document.getElementById('modal-move-fleet');
  modal.querySelector('#mfm-title').textContent = `Deploy Agent: ${op.label}`;
  modal.querySelector('#mfm-fleet-info').textContent =
    `Cost: ${op.cost} Cr | Success: ${Math.round(op.baseSuccess*100)}% | Duration: ${op.turnsRequired} turns`;

  const pf = G.factions[G.playerIdx];
  const list = modal.querySelector('#mfm-target-list');
  if (!list) return;
  const enemySystems = G.systems.filter(s =>
    s.owner !== null && s.owner !== G.playerIdx &&
    getRelation(G, G.playerIdx, s.owner) <= 0
  ).slice(0, 20);

  list.innerHTML = enemySystems.map(s => {
    const owner = G.factions[s.owner];
    return `<div class="move-target-row" data-sys="${s.id}">
      <span>${s.name}</span>
      <span style="color:${owner?.color||'#aaa'}">${owner?.name||'?'}</span>
    </div>`;
  }).join('');

  if (!enemySystems.length) {
    list.innerHTML = '<div style="color:var(--text-dim);padding:8px">No valid targets.</div>';
  }

  list.querySelectorAll('.move-target-row').forEach(row => {
    row.addEventListener('click', () => {
      const sysId = parseInt(row.dataset.sys);
      const result = deployAgent(G, G.playerIdx, sysId, activeAgentOp);
      if (result.ok) {
        addLog(G, `Agent deployed to ${G.systems[sysId].name} for ${ESP_OPS[activeAgentOp].label}.`, 'espionage');
      } else {
        addLog(G, `Cannot deploy agent: ${result.msg}`, 'warn');
      }
      hideAllModals();
    });
  });
}

// ─── DIPLOMACY OFFER MODAL ───────────────────────────────────
function showDiploOfferModal(fromId, type) {
  const from = G.factions[fromId];
  const modal = document.getElementById('modal-diplo-offer');
  if (!modal || !from) return;
  modal.querySelector('#dmo-from-name').textContent = from.name;
  modal.querySelector('#dmo-leader-name').textContent = from.warlordName;
  modal.querySelector('#dmo-offer-type').textContent = type.replace(/_/g,' ').toUpperCase();
  modal.dataset.fromId = fromId;
  modal.dataset.offerType = type;
  showModal('modal-diplo-offer');
}

function wireDiploOfferModal() {
  const modal = document.getElementById('modal-diplo-offer');
  if (!modal) return;
  modal.querySelector('#dmo-accept')?.addEventListener('click', () => {
    const fromId = parseInt(modal.dataset.fromId);
    const type   = modal.dataset.offerType;
    applyDiploOutcome(G, fromId, G.playerIdx, type, true);
    addLog(G, `You accepted the ${type.replace(/_/g,' ')} offer from ${G.factions[fromId]?.name}.`, 'diplomacy');
    hideAllModals();
  });
  modal.querySelector('#dmo-reject')?.addEventListener('click', () => {
    const fromId = parseInt(modal.dataset.fromId);
    const type   = modal.dataset.offerType;
    applyDiploOutcome(G, fromId, G.playerIdx, type, false);
    addLog(G, `You rejected the ${type.replace(/_/g,' ')} offer from ${G.factions[fromId]?.name}.`, 'diplomacy');
    hideAllModals();
  });
}

// ─── EVENT NOTIFICATION (feed only, no modal) ───────────────
function showEventModal(event) {
  // No longer shows a blocking modal — all events go to the notification feed.
  // pushNotif is called by addLog; here we handle pendingEvents that may have
  // a custom title/body not yet logged.
  const text = event.title
    ? `[${event.title}] ${event.body || event.text || ''}`
    : (event.body || event.text || 'Galactic event occurred.');
  pushNotif(G ? G.turn : '?', text, event.type || 'normal');
}

function wireEventModal() {
  // Modal no longer used for events; kept as no-op so boot() wiring doesn't error.
}

// ─── VICTORY / DEFEAT MODALS ─────────────────────────────────
function showVictoryModal(condition) {
  stopRenderLoop();
  const modal = document.getElementById('modal-victory');
  if (!modal) return;
  modal.querySelector('#vic-condition').textContent = condition.toUpperCase().replace(/_/g,' ');
  modal.querySelector('#vic-turn').textContent = G.turn;
  showModal('modal-victory');
}

function showDefeatModal() {
  stopRenderLoop();
  const modal = document.getElementById('modal-defeat');
  if (!modal) return;
  let reason;
  if (G && G.winner != null && G.winner >= 0) {
    const wf = G.factions.find(f => f.id === G.winner);
    const vcLabel = VICTORY_CONDITIONS[G.winnerCondition]?.label || 'Total Domination';
    reason = wf
      ? `${wf.name} achieved ${vcLabel} on turn ${G.turn}. The galaxy is theirs.`
      : 'Another power now dominates the galaxy.';
  } else {
    reason = 'Your faction has been eliminated. The galaxy moves on without you.';
  }
  const reasonEl = modal.querySelector('#def-reason');
  if (reasonEl) reasonEl.textContent = reason;
  showModal('modal-defeat');
}

function wireVictoryModal() {
  document.getElementById('modal-victory')
    ?.querySelector('#vic-main-menu')
    ?.addEventListener('click', () => { hideAllModals(); showScreen('screen-menu'); });
}
function wireDefeatModal() {
  document.getElementById('modal-defeat')
    ?.querySelector('#def-main-menu')
    ?.addEventListener('click', () => { hideAllModals(); showScreen('screen-menu'); });
}

// ─── GAME MENU MODAL ─────────────────────────────────────────
function wireGameMenuModal() {
  const modal = document.getElementById('modal-game-menu');
  if (!modal) return;
  modal.querySelector('#gmm-save')?.addEventListener('click',      () => { saveGame(); hideAllModals(); });
  modal.querySelector('#gmm-load')?.addEventListener('click',      () => { loadGame(); hideAllModals(); });
  modal.querySelector('#gmm-menu')?.addEventListener('click',      () => { hideAllModals(); showScreen('screen-menu'); });
  modal.querySelector('#gmm-howto')?.addEventListener('click',     () => { hideAllModals(); showScreen('screen-howto'); });
  modal.querySelector('#gmm-close')?.addEventListener('click',     hideAllModals);
  modal.querySelector('#gmm-speed-slow')?.addEventListener('click',  () => { G.speedMs = SPEED_MS.slow;   G.paused = false; startSimulation(); hideAllModals(); });
  modal.querySelector('#gmm-speed-normal')?.addEventListener('click',() => { G.speedMs = SPEED_MS.normal; G.paused = false; startSimulation(); hideAllModals(); });
  modal.querySelector('#gmm-speed-fast')?.addEventListener('click',  () => { G.speedMs = SPEED_MS.fast;   G.paused = false; startSimulation(); hideAllModals(); });
  modal.querySelector('#gmm-speed-pause')?.addEventListener('click', () => { G.paused = !G.paused; updateUI(); });
}

// ─── SAVE / LOAD ─────────────────────────────────────────────
const SAVE_KEY = 'galactic_dominion_save';

function saveGame() {
  if (!G) return;
  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify(G));
    addLog(G, 'Game saved.', 'system');
  } catch (e) {
    console.warn('Save failed:', e);
  }
}

function loadGame() {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) { addLog(G, 'No save found.', 'warn'); return; }
    G = JSON.parse(raw);
    // Re-attach star type objects (they're serialised as plain objects)
    for (const sys of G.systems) {
      const st = STAR_TYPES.find(s => s.name === sys.starType.name);
      if (st) sys.starType = st;
    }
    fitGalaxy();
    startSimulation();
    addLog(G, 'Game loaded.', 'system');
  } catch (e) {
    console.warn('Load failed:', e);
  }
}

// ─── MASTER TURN FUNCTION ────────────────────────────────────
function processTurn() {
  if (!G || G.paused || G.modalPaused || G.gameOver) return;

  applyEconomy(G);
  advanceTech(G);
  applyDevelopment(G);
  moveFleets(G);
  processEspionage(G);
  applyCoalitionPressure(G);

  triggerEvents(G);

  runAI(G);
  checkEliminations(G);
  checkVictory(G);
  G.turn++;

  // Drain all pending events into the notification feed — no modal blocking
  if (G.pendingEvents && G.pendingEvents.length > 0) {
    while (G.pendingEvents.length > 0) {
      const ev = G.pendingEvents.shift();
      showEventModal(ev);
    }
  }

  // Flush pending diplomacy offer modal
  if (G.pendingDiploOffer) {
    showDiploOfferModal(G.pendingDiploOffer.fromId, G.pendingDiploOffer.type);
    G.pendingDiploOffer = null;
  }

  if (G.gameOver) {
    if (G.winner === G.playerIdx) {
      showVictoryModal(G.victoryCondition || 'domination');
    } else {
      showDefeatModal();
    }
  }

  updateUI();
}

function updateUI() {
  if (!G) return;
  renderTopBar();
  renderLeftPanel();
  if (G.selectedSystemId !== null) {
    const sys = G.systems[G.selectedSystemId];
    if (sys) renderRightPanel(sys);
  }
  updateTicker();
  // Tab notification badges
  const pf = G.factions[G.playerIdx];
  const badgeFleets = document.getElementById('badge-fleets');
  const badgeTech   = document.getElementById('badge-tech');
  const badgeDiplo  = document.getElementById('badge-diplo');
  if (badgeFleets) {
    const n = G.fleets.filter(f => f.owner === G.playerIdx && f.status === 'idle').length;
    badgeFleets.textContent = n || '';
    badgeFleets.style.display = n ? 'inline-block' : 'none';
  }
  if (badgeTech) {
    const needsResearch = !pf.currentResearch;
    badgeTech.textContent = needsResearch ? '!' : '';
    badgeTech.style.display = needsResearch ? 'inline-block' : 'none';
  }
  if (badgeDiplo) {
    const hasPending = !!G.pendingDiploOffer;
    badgeDiplo.textContent = hasPending ? '!' : '';
    badgeDiplo.style.display = hasPending ? 'inline-block' : 'none';
  }
}

// ─── SIMULATION LOOP ─────────────────────────────────────────
let _simInterval = null;

function startSimulation() {
  if (_simInterval) clearInterval(_simInterval);
  _simInterval = setInterval(() => processTurn(), G.speedMs || 1500);
  startRenderLoop();
  updateUI();
}

function stopSimulation() {
  if (_simInterval) { clearInterval(_simInterval); _simInterval = null; }
  stopRenderLoop();
}

// ─── SCREEN MANAGER ──────────────────────────────────────────
function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => {
    s.classList.remove('active');
    s.classList.add('hidden');
  });
  const el = document.getElementById(id);
  if (el) {
    el.classList.remove('hidden');
    el.classList.add('active');
  }
}

// ─── COLLECT UI ELEMENT REFERENCES ───────────────────────────
function collectUI() {
  UI.topbarFactionName = document.getElementById('topbar-faction-name');
  UI.topbarTurnNum     = document.getElementById('turn-number');
  UI.hudCredits        = document.getElementById('hud-credits');
  UI.hudCreditsDelta   = document.getElementById('hud-credits-delta');
  UI.hudMinerals       = document.getElementById('hud-minerals');
  UI.hudMineralsDelta  = document.getElementById('hud-minerals-delta');
  UI.hudFood           = document.getElementById('hud-food');
  UI.hudFoodDelta      = document.getElementById('hud-food-delta');
  UI.hudResearch       = document.getElementById('hud-research');
  UI.hudResearchDelta  = document.getElementById('hud-research-delta');
  UI.hudInfluence      = document.getElementById('hud-influence');
  UI.hudInfluenceDelta = document.getElementById('hud-influence-delta');
  UI.hudSystems        = document.getElementById('hud-systems');
  UI.hudFleets         = document.getElementById('hud-fleets');
  UI.btnPause          = document.getElementById('btn-pause');

  UI.empireStats    = document.getElementById('empire-stats');
  UI.powerRanking   = document.getElementById('power-ranking');
  UI.fleetList      = document.getElementById('fleet-list');
  UI.diplomacyList  = document.getElementById('diplomacy-list');
  UI.techTree       = document.getElementById('tech-tree');
  UI.espionagePanel = document.getElementById('espionage-panel');
  UI.eventLog       = document.getElementById('event-log');

  UI.rpPlaceholder  = document.getElementById('rp-placeholder');
  UI.rpSystem       = document.getElementById('rp-system');
  UI.rpSysName      = document.getElementById('rp-sys-name');
  UI.rpSysOwner     = document.getElementById('rp-sys-owner');
  UI.rpSysType      = document.getElementById('rp-sys-type');
  UI.rpPlanets      = document.getElementById('rp-planets');
  UI.rpRes          = document.getElementById('rp-res');
  UI.rpGarrison     = document.getElementById('rp-garrison');
  UI.rpActions      = document.getElementById('rp-actions');

  UI.tickerText     = document.getElementById('ticker-text');
  UI.tooltip        = document.getElementById('map-tooltip');
  UI.victoryProgress = document.getElementById('victory-progress');
  UI.empireAlerts    = document.getElementById('empire-alerts');
}

// ─── LEFT PANEL TAB SWITCHING ────────────────────────────────
function wireLeftPanelTabs() {
  document.querySelectorAll('.lp-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.lp-tab').forEach(t => t.classList.remove('active'));
      document.querySelectorAll('.lp-pane').forEach(p => {
        p.classList.remove('active');
        p.classList.add('hidden');
      });
      tab.classList.add('active');
      const paneId = 'pane-' + tab.dataset.tab;
      const pane = document.getElementById(paneId);
      if (pane) {
        pane.classList.remove('hidden');
        pane.classList.add('active');
      }
      renderLeftPanel();
    });
  });
}

// ─── MAP CONTROL BUTTONS ─────────────────────────────────────
function wireMapControls() {
  document.getElementById('map-zoom-in') ?.addEventListener('click', () => {
    CAM.scale = Math.min(CAM_MAX_SCALE, CAM.scale * 1.3);
  });
  document.getElementById('map-zoom-out')?.addEventListener('click', () => {
    CAM.scale = Math.max(CAM_MIN_SCALE, CAM.scale * 0.77);
  });
  document.getElementById('map-fit')     ?.addEventListener('click', fitGalaxy);
}

// ─── NEW GAME SETUP FLOW ─────────────────────────────────────
function wireSetupScreen() {
  document.getElementById('btn-start-game')?.addEventListener('click', () => {
    const sizeKey = document.getElementById('setup-galaxy-size')?.value || 'medium';
    const seed    = document.getElementById('setup-seed')?.value?.trim() || '';
    const leader  = document.getElementById('setup-leader-name')?.value?.trim() || 'Commander';
    const faction = document.getElementById('setup-faction-name')?.value?.trim() || 'The Dominion';
    const aiDiff  = document.getElementById('setup-ai-difficulty')?.value || 'normal';
    const speedKey = document.getElementById('setup-speed')?.value || 'slow';
    const playerStyle    = document.getElementById('setup-player-style')?.value || 'militarist';
    const victoryCondition = document.getElementById('setup-victory')?.value || 'domination';

    const numericSeed = seed === ''
      ? Math.floor(Math.random() * 1e9)
      : Math.abs([...seed].reduce((h, c) => (h << 5) - h + c.charCodeAt(0), 0)) || 42;

    const cfg = {
      seed:             numericSeed,
      sizeKey:          sizeKey,
      playerName:       leader,
      playerStyle:      playerStyle,
      difficulty:       aiDiff,
      victoryCondition: victoryCondition,
      speedKey:         speedKey,
      // store these for faction rename after init
      _factionName:     faction,
      _leaderName:      leader,
    };

    startNewGame(cfg);
  });
  document.getElementById('btn-back-to-menu')?.addEventListener('click', () => {
    showScreen('screen-menu');
  });
  document.getElementById('btn-random-seed')?.addEventListener('click', () => {
    document.getElementById('setup-seed').value = Math.floor(Math.random() * 1e9);
  });
}

function startNewGame(cfg) {
  showScreen('screen-loading');
  // Use setTimeout to let the loading screen paint before heavy work
  setTimeout(() => {
    G = initNewGame(cfg);
    G.speedMs = SPEED_MS[cfg.speedKey] || SPEED_MS.slow;   // start slow so the player can orient
    G.paused       = true;           // start paused — player presses ▶ when ready
    G.modalPaused  = false;

    // Personalise player faction with chosen name/leader
    const pf = G.factions[G.playerIdx];
    if (cfg._factionName) pf.name       = cfg._factionName;
    if (cfg._leaderName)  pf.warlordName = cfg._leaderName;

    // Auto-select home system so player immediately has context
    G.selectedSystemId = pf.capitalId;

    collectUI();
    showScreen('screen-game');

    // Show welcome overlay on first launch
    const wo = document.getElementById('welcome-overlay');
    if (wo) wo.classList.remove('hidden');

    canvas = document.getElementById('galaxy-canvas');
    ctx    = canvas.getContext('2d');
    resizeCanvas();
    fitGalaxy();
    initMapEvents();
    startSimulation();
  }, 80);
}

// ─── MAIN MENU ───────────────────────────────────────────────
function wireMainMenu() {
  document.getElementById('btn-new-game')?.addEventListener('click',  () => showScreen('screen-setup'));
  document.getElementById('btn-load-game')?.addEventListener('click', () => {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) { alert('No saved game found.'); return; }
    showScreen('screen-loading');
    setTimeout(() => {
      loadGame();
      collectUI();
      showScreen('screen-game'); // must be visible before measuring canvas dimensions
      canvas = document.getElementById('galaxy-canvas');
      ctx    = canvas.getContext('2d');
      resizeCanvas();
      fitGalaxy();
      initMapEvents();
    }, 80);
  });
  document.getElementById('btn-how-to-play')?.addEventListener('click',() => showScreen('screen-howto'));
  document.getElementById('btn-howto-back')?.addEventListener('click', () => showScreen('screen-menu'));
}

// ─── IN-GAME BUTTONS ─────────────────────────────────────────
function wireInGameButtons() {
  // Build fleet button (topbar or right panel)
  document.getElementById('btn-build-fleet')?.addEventListener('click', () => {
    const sysId = G.selectedSystemId;
    if (sysId === null || G.systems[sysId]?.owner !== G.playerIdx) {
      addLog(G, 'Select one of your systems first.', 'warn');
      return;
    }
    openBuildFleetModal(sysId);
  });

  // Save shortcut
  document.getElementById('btn-save-game')?.addEventListener('click', saveGame);

  // Game menu button
  document.getElementById('btn-game-menu')?.addEventListener('click', () => showModal('modal-game-menu'));

  // Welcome overlay dismiss
  document.getElementById('welcome-ok')?.addEventListener('click', () => {
    const wo = document.getElementById('welcome-overlay');
    if (wo) wo.classList.add('hidden');
  });

  // Escape key
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') hideAllModals();
    if (e.key === 's' && e.ctrlKey) { e.preventDefault(); saveGame(); }
    if (e.key === ' ') { if (G) { G.paused = !G.paused; updateUI(); } }
  });

  // Pause/speed controls (topbar if present)
  document.getElementById('btn-pause')?.addEventListener('click', () => {
    if (G) { G.paused = !G.paused; updateUI(); }
  });
  document.getElementById('btn-speed-slow')?.addEventListener  ('click', () => { if (G) { G.speedMs = SPEED_MS.slow;   G.paused = false; startSimulation(); updateUI(); } });
  document.getElementById('btn-speed-normal')?.addEventListener('click', () => { if (G) { G.speedMs = SPEED_MS.normal; G.paused = false; startSimulation(); updateUI(); } });
  document.getElementById('btn-speed-fast')?.addEventListener  ('click', () => { if (G) { G.speedMs = SPEED_MS.fast;   G.paused = false; startSimulation(); updateUI(); } });
}

// ─── RESIZE OBSERVER ─────────────────────────────────────────
function wireResizeObserver() {
  const container = document.getElementById('map-container');
  if (!container) return;
  const ro = new ResizeObserver(() => {
    resizeCanvas();
    if (G && canvas && canvas.width > 0) fitGalaxy();
  });
  ro.observe(container);
}

// ─── LOADING SCREEN ANIMATION ────────────────────────────────
function animateLoadingBar(duration, onDone) {
  const bar = document.getElementById('loading-bar');
  const txt = document.getElementById('loading-text');
  if (!bar) { onDone && onDone(); return; }
  const msgs = [
    'Initialising psychohistory engine...',
    'Generating star systems...',
    'Placing warlord factions...',
    'Calculating trade routes...',
    'Populating event horizon...',
    'Briefing AI commanders...',
    'Launching civilisations...',
  ];
  let pct = 0;
  let mIdx = 0;
  const step = () => {
    pct += Math.random() * 18 + 2;
    if (pct > 100) pct = 100;
    bar.style.width = pct + '%';
    if (txt) txt.textContent = msgs[Math.min(mIdx++, msgs.length - 1)];
    if (pct < 100) setTimeout(step, duration / 10);
    else { setTimeout(() => onDone && onDone(), 200); }
  };
  setTimeout(step, 50);
}

// ─── BOOT ────────────────────────────────────────────────────
function boot() {
  showScreen('screen-loading');
  animateLoadingBar(600, () => {
    showScreen('screen-menu');
  });

  wireMainMenu();
  wireSetupScreen();
  wireInGameButtons();
  wireMapControls();
  wireLeftPanelTabs();
  wireBuildFleetModal();
  wireMoveFleetModal();
  wireDiploOfferModal();
  wireEventModal();
  wireVictoryModal();
  wireDefeatModal();
  wireGameMenuModal();
  wireResizeObserver();
  wireNotifFeed();
}

// ─── STAR TYPE GLOW COLORS (patch to add missing field) ──────
// Ensure every starType has a glowColor for the renderer
STAR_TYPES.forEach(st => {
  if (!st.glowColor) st.glowColor = st.color;
});

document.addEventListener('DOMContentLoaded', boot);
