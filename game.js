const STORAGE_KEY = "tide-and-tackle-save-v1";
const CANVAS_WIDTH = 960;
const CANVAS_HEIGHT = 540;
const WATERLINE = 248;
const DOCK_ANCHOR = { x: 206, y: 246 };

const RARITIES = {
  common: { label: "Common", color: "#d8ecf5", rank: 0, valueFactor: 1 },
  uncommon: { label: "Uncommon", color: "#7fcf9b", rank: 1, valueFactor: 1.3 },
  rare: { label: "Rare", color: "#6bc3ff", rank: 2, valueFactor: 1.75 },
  epic: { label: "Epic", color: "#ff9d59", rank: 3, valueFactor: 2.4 },
  legendary: { label: "Legendary", color: "#ffe06b", rank: 4, valueFactor: 3.35 },
};

const FISH_SPECIES = [
  {
    id: "sunbleak",
    name: "Sunbleak",
    rarity: "common",
    habitats: ["pond"],
    baseValue: 6,
    difficulty: 0.78,
    minWeight: 0.4,
    maxWeight: 1.1,
    spawnWeight: 18,
    depthPreference: 0.28,
    depthTolerance: 0.24,
    shape: "round",
    movement: "glide",
    colors: ["#f4d26a", "#e89b2e"],
  },
  {
    id: "bluegill",
    name: "Bluegill",
    rarity: "common",
    habitats: ["pond"],
    baseValue: 8,
    difficulty: 0.93,
    minWeight: 0.7,
    maxWeight: 1.5,
    spawnWeight: 14,
    depthPreference: 0.38,
    depthTolerance: 0.22,
    shape: "round",
    movement: "sway",
    colors: ["#7fc4d8", "#3d7f9a"],
  },
  {
    id: "moss_carp",
    name: "Moss Carp",
    rarity: "uncommon",
    habitats: ["pond"],
    baseValue: 16,
    difficulty: 1.16,
    minWeight: 1.8,
    maxWeight: 4.4,
    spawnWeight: 9,
    depthPreference: 0.58,
    depthTolerance: 0.2,
    shape: "round",
    movement: "glide",
    colors: ["#92b16d", "#546f42"],
  },
  {
    id: "reed_catfish",
    name: "Reed Catfish",
    rarity: "rare",
    habitats: ["pond"],
    baseValue: 26,
    difficulty: 1.42,
    minWeight: 2.3,
    maxWeight: 5.5,
    spawnWeight: 4.2,
    depthPreference: 0.72,
    depthTolerance: 0.18,
    shape: "long",
    movement: "bottom",
    colors: ["#7d8f74", "#445145"],
  },
  {
    id: "mirror_koi",
    name: "Mirror Koi",
    rarity: "epic",
    habitats: ["pond"],
    baseValue: 48,
    difficulty: 1.72,
    minWeight: 3.1,
    maxWeight: 6.4,
    spawnWeight: 2.2,
    depthPreference: 0.8,
    depthTolerance: 0.14,
    shape: "round",
    movement: "sway",
    colors: ["#f2e7d2", "#de6e42"],
  },
  {
    id: "bronze_perch",
    name: "Bronze Perch",
    rarity: "common",
    habitats: ["river"],
    baseValue: 10,
    difficulty: 1.02,
    minWeight: 0.9,
    maxWeight: 2.1,
    spawnWeight: 13,
    depthPreference: 0.4,
    depthTolerance: 0.2,
    shape: "round",
    movement: "glide",
    colors: ["#c8a167", "#7f5f34"],
  },
  {
    id: "river_trout",
    name: "River Trout",
    rarity: "uncommon",
    habitats: ["river"],
    baseValue: 18,
    difficulty: 1.25,
    minWeight: 1.3,
    maxWeight: 3.6,
    spawnWeight: 9,
    depthPreference: 0.56,
    depthTolerance: 0.2,
    shape: "long",
    movement: "sway",
    colors: ["#b9d2cb", "#425e58"],
  },
  {
    id: "silver_pike",
    name: "Silver Pike",
    rarity: "rare",
    habitats: ["river"],
    baseValue: 34,
    difficulty: 1.58,
    minWeight: 2.4,
    maxWeight: 5.8,
    spawnWeight: 4.5,
    depthPreference: 0.76,
    depthTolerance: 0.18,
    shape: "long",
    movement: "dart",
    colors: ["#d6dddf", "#88959a"],
  },
  {
    id: "ember_salmon",
    name: "Ember Salmon",
    rarity: "rare",
    habitats: ["river"],
    baseValue: 42,
    difficulty: 1.67,
    minWeight: 2.9,
    maxWeight: 6.2,
    spawnWeight: 3.6,
    depthPreference: 0.68,
    depthTolerance: 0.18,
    shape: "long",
    movement: "dart",
    colors: ["#ec9a68", "#c84d34"],
  },
  {
    id: "glassfin_sturgeon",
    name: "Glassfin Sturgeon",
    rarity: "epic",
    habitats: ["river"],
    baseValue: 70,
    difficulty: 1.92,
    minWeight: 4.5,
    maxWeight: 9.8,
    spawnWeight: 1.9,
    depthPreference: 0.84,
    depthTolerance: 0.14,
    shape: "long",
    movement: "bottom",
    colors: ["#cfdfeb", "#69869b"],
  },
  {
    id: "tide_bass",
    name: "Tide Bass",
    rarity: "common",
    habitats: ["bay"],
    baseValue: 14,
    difficulty: 1.09,
    minWeight: 1.2,
    maxWeight: 3.0,
    spawnWeight: 14,
    depthPreference: 0.44,
    depthTolerance: 0.24,
    shape: "round",
    movement: "glide",
    colors: ["#9ebec1", "#3d6d73"],
  },
  {
    id: "coral_snapper",
    name: "Coral Snapper",
    rarity: "uncommon",
    habitats: ["bay"],
    baseValue: 26,
    difficulty: 1.33,
    minWeight: 1.8,
    maxWeight: 4.4,
    spawnWeight: 8,
    depthPreference: 0.56,
    depthTolerance: 0.22,
    shape: "round",
    movement: "sway",
    colors: ["#f1a07a", "#bf4e4c"],
  },
  {
    id: "barracuda",
    name: "Barracuda",
    rarity: "rare",
    habitats: ["bay"],
    baseValue: 52,
    difficulty: 1.76,
    minWeight: 3.4,
    maxWeight: 7.4,
    spawnWeight: 3.4,
    depthPreference: 0.74,
    depthTolerance: 0.17,
    shape: "long",
    movement: "dart",
    colors: ["#d0d5d7", "#687783"],
  },
  {
    id: "pearl_ray",
    name: "Pearl Ray",
    rarity: "epic",
    habitats: ["bay"],
    baseValue: 92,
    difficulty: 1.98,
    minWeight: 5.8,
    maxWeight: 12.4,
    spawnWeight: 1.6,
    depthPreference: 0.86,
    depthTolerance: 0.14,
    shape: "ray",
    movement: "glide",
    colors: ["#f2ebdd", "#bda892"],
  },
  {
    id: "moon_eel",
    name: "Moon Eel",
    rarity: "epic",
    habitats: ["sea"],
    baseValue: 120,
    difficulty: 2.03,
    minWeight: 4.2,
    maxWeight: 10.1,
    spawnWeight: 2,
    depthPreference: 0.82,
    depthTolerance: 0.16,
    shape: "eel",
    movement: "eel",
    colors: ["#d3d5f2", "#6d70c3"],
  },
  {
    id: "sapphire_tuna",
    name: "Sapphire Tuna",
    rarity: "rare",
    habitats: ["sea"],
    baseValue: 88,
    difficulty: 1.89,
    minWeight: 5.2,
    maxWeight: 11.6,
    spawnWeight: 2.8,
    depthPreference: 0.7,
    depthTolerance: 0.18,
    shape: "long",
    movement: "glide",
    colors: ["#8fc6ff", "#356b9e"],
  },
  {
    id: "abyss_grouper",
    name: "Abyss Grouper",
    rarity: "epic",
    habitats: ["sea"],
    baseValue: 150,
    difficulty: 2.14,
    minWeight: 8.4,
    maxWeight: 18.2,
    spawnWeight: 1.4,
    depthPreference: 0.9,
    depthTolerance: 0.1,
    shape: "round",
    movement: "bottom",
    colors: ["#6c7da2", "#2f3f60"],
  },
  {
    id: "storm_marlin",
    name: "Storm Marlin",
    rarity: "legendary",
    habitats: ["sea"],
    baseValue: 240,
    difficulty: 2.38,
    minWeight: 9.5,
    maxWeight: 20.5,
    spawnWeight: 0.8,
    depthPreference: 0.93,
    depthTolerance: 0.08,
    shape: "long",
    movement: "dart",
    colors: ["#f8e3a9", "#4f6f99"],
  },
];

const SPECIES_BY_ID = Object.fromEntries(FISH_SPECIES.map((fish) => [fish.id, fish]));

const LOCATIONS = [
  {
    id: "pond",
    name: "Willow Pond",
    unlockCost: 0,
    unlockLevel: 1,
    description: "Quick bites, forgiving fish, and a perfect place to learn the rhythm.",
    fishIds: ["sunbleak", "bluegill", "moss_carp", "reed_catfish", "mirror_koi"],
    waitFactor: 1.04,
    biteWindow: 1.08,
    rareBoost: 0,
    skyTop: "#f9dfa0",
    skyBottom: "#f3a662",
    waterTop: "#2f8e8a",
    waterBottom: "#185663",
    hill: "#617f5a",
    shore: "#4f6d50",
    accent: "#f3c76d",
  },
  {
    id: "river",
    name: "Copper Run",
    unlockCost: 140,
    unlockLevel: 2,
    description: "Sharper current, stronger fish, and better payouts if you can keep control.",
    fishIds: ["bronze_perch", "river_trout", "silver_pike", "ember_salmon", "glassfin_sturgeon"],
    waitFactor: 0.98,
    biteWindow: 1,
    rareBoost: 0.08,
    skyTop: "#f5d8a0",
    skyBottom: "#e58d56",
    waterTop: "#2d7b8f",
    waterBottom: "#153d58",
    hill: "#60768b",
    shore: "#4b5c61",
    accent: "#da8b52",
  },
  {
    id: "bay",
    name: "Sunset Bay",
    unlockCost: 420,
    unlockLevel: 4,
    description: "Open water with faster predators and a strong ceiling for cash.",
    fishIds: ["tide_bass", "coral_snapper", "barracuda", "pearl_ray"],
    waitFactor: 0.93,
    biteWindow: 0.94,
    rareBoost: 0.18,
    skyTop: "#f9d5a0",
    skyBottom: "#d96d4d",
    waterTop: "#2f8597",
    waterBottom: "#12394b",
    hill: "#7a6c7f",
    shore: "#5d4f5f",
    accent: "#f1a25e",
  },
  {
    id: "sea",
    name: "Twilight Sea",
    unlockCost: 1100,
    unlockLevel: 7,
    description: "Deep water, violent fights, and the kind of fish that pay for full endgame setups.",
    fishIds: ["moon_eel", "sapphire_tuna", "abyss_grouper", "storm_marlin"],
    waitFactor: 0.88,
    biteWindow: 0.88,
    rareBoost: 0.34,
    skyTop: "#f2c98d",
    skyBottom: "#8e5b6f",
    waterTop: "#2a708b",
    waterBottom: "#101f33",
    hill: "#514b6e",
    shore: "#41394e",
    accent: "#ffd28a",
  },
];

const LOCATIONS_BY_ID = Object.fromEntries(LOCATIONS.map((location) => [location.id, location]));

const RODS = [
  {
    id: "twig",
    name: "Twig Pole",
    price: 0,
    unlockLevel: 1,
    power: 1,
    control: 1,
    luck: 0.02,
    biteWindow: 1,
    description: "Crude, short, and cheap, but it lands starter fish just fine.",
  },
  {
    id: "riverglass",
    name: "Riverglass Rod",
    price: 95,
    unlockLevel: 2,
    power: 1.12,
    control: 1.18,
    luck: 0.06,
    biteWindow: 1.08,
    description: "Cleaner casts and a steadier fight band for the river tier.",
  },
  {
    id: "carbon",
    name: "Carbon Skipper",
    price: 260,
    unlockLevel: 4,
    power: 1.24,
    control: 1.34,
    luck: 0.14,
    biteWindow: 1.18,
    description: "Extends cast depth and makes midgame fish much easier to manage.",
  },
  {
    id: "stormcall",
    name: "Stormcall Rod",
    price: 780,
    unlockLevel: 6,
    power: 1.4,
    control: 1.55,
    luck: 0.28,
    biteWindow: 1.3,
    description: "A serious deep-water tool built for heavy pulls and expensive catches.",
  },
  {
    id: "aurora",
    name: "Aurora Rig",
    price: 1700,
    unlockLevel: 8,
    power: 1.58,
    control: 1.78,
    luck: 0.46,
    biteWindow: 1.42,
    description: "Top-end tackle that turns brutal fights into manageable money printers.",
  },
];

const RODS_BY_ID = Object.fromEntries(RODS.map((rod) => [rod.id, rod]));

const BAITS = [
  {
    id: "worms",
    name: "Worms",
    price: 0,
    unlockLevel: 1,
    biteSpeed: 1,
    rareChance: 0,
    quality: 1,
    description: "Reliable starter bait with no tricks and no downside.",
  },
  {
    id: "dough",
    name: "Dough Balls",
    price: 60,
    unlockLevel: 1,
    biteSpeed: 1.12,
    rareChance: 0.04,
    quality: 1.03,
    description: "Speeds up the bite and slightly boosts the value of routine catches.",
  },
  {
    id: "spinner",
    name: "Spinner Lure",
    price: 180,
    unlockLevel: 3,
    biteSpeed: 1.08,
    rareChance: 0.12,
    quality: 1.1,
    description: "Attracts more active predators and raises the odds of rare fish.",
  },
  {
    id: "glow",
    name: "Glow Jig",
    price: 520,
    unlockLevel: 5,
    biteSpeed: 1.18,
    rareChance: 0.22,
    quality: 1.18,
    description: "Great in darker water, with a strong pull toward higher-value fish.",
  },
  {
    id: "mythic",
    name: "Mythic Roe",
    price: 1250,
    unlockLevel: 7,
    biteSpeed: 1.22,
    rareChance: 0.38,
    quality: 1.28,
    description: "Expensive, but it turns deep casts into real trophy opportunities.",
  },
];

const BAITS_BY_ID = Object.fromEntries(BAITS.map((bait) => [bait.id, bait]));

const CREELS = [
  {
    id: "starter",
    name: "Starter Creel",
    price: 0,
    unlockLevel: 1,
    capacity: 5,
    description: "Just enough room for a short session.",
  },
  {
    id: "basket",
    name: "River Basket",
    price: 85,
    unlockLevel: 1,
    capacity: 7,
    description: "A simple upgrade that keeps you casting longer before cashing out.",
  },
  {
    id: "pack",
    name: "Angler Pack",
    price: 260,
    unlockLevel: 3,
    capacity: 10,
    description: "The point where selling stops interrupting your fishing loop.",
  },
  {
    id: "locker",
    name: "Deck Locker",
    price: 760,
    unlockLevel: 5,
    capacity: 14,
    description: "Built for long runs in the bay and high-value inventory stacks.",
  },
  {
    id: "icebox",
    name: "Ice Vault",
    price: 1600,
    unlockLevel: 7,
    capacity: 18,
    description: "Endgame storage for deep-water grind sessions.",
  },
];

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function lerp(start, end, amount) {
  return start + (end - start) * amount;
}

function rand(min, max) {
  return Math.random() * (max - min) + min;
}

function easeOutCubic(value) {
  return 1 - Math.pow(1 - value, 3);
}

function formatMoney(amount) {
  return `$${Math.round(amount).toLocaleString()}`;
}

function formatWeight(weight) {
  return `${weight.toFixed(1)} kg`;
}

function uniqueValidIds(values, lookup, fallback) {
  const ids = Array.isArray(values) ? values.filter((value) => lookup[value]) : [];
  const merged = [...ids, ...fallback].filter((value, index, array) => array.indexOf(value) === index);
  return merged;
}

function pickWeighted(items, getWeight) {
  const weighted = items
    .map((item) => ({ item, weight: Math.max(0, getWeight(item)) }))
    .filter((entry) => entry.weight > 0);

  const total = weighted.reduce((sum, entry) => sum + entry.weight, 0);

  if (total <= 0) {
    return items[Math.floor(Math.random() * items.length)] || null;
  }

  let roll = Math.random() * total;

  for (const entry of weighted) {
    roll -= entry.weight;

    if (roll <= 0) {
      return entry.item;
    }
  }

  return weighted[weighted.length - 1].item;
}

function createNewSave() {
  return {
    version: 1,
    money: 25,
    level: 1,
    xp: 0,
    rodId: "twig",
    ownedRods: ["twig"],
    baitId: "worms",
    ownedBaits: ["worms"],
    locationId: "pond",
    unlockedLocations: ["pond"],
    creelTier: 0,
    inventory: [],
    recentCatches: [],
    journal: {},
    totalCaught: 0,
    totalEarned: 0,
    streak: 0,
    longestStreak: 0,
    bestCatch: null,
    soundEnabled: true,
  };
}

class SoundBoard {
  constructor() {
    this.context = null;
    this.enabled = true;
  }

  ensureContext() {
    if (!this.context) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;

      if (!AudioContextClass) {
        return null;
      }

      this.context = new AudioContextClass();
    }

    return this.context;
  }

  unlock() {
    if (!this.enabled) {
      return;
    }

    const context = this.ensureContext();

    if (context && context.state === "suspended") {
      context.resume().catch(() => {});
    }
  }

  setEnabled(enabled) {
    this.enabled = enabled;

    if (enabled && this.context && this.context.state === "suspended") {
      this.context.resume().catch(() => {});
    }
  }

  pulse({ frequency, endFrequency, duration, type = "sine", volume = 0.03, when = 0 }) {
    if (!this.enabled) {
      return;
    }

    const context = this.ensureContext();

    if (!context || context.state !== "running") {
      return;
    }

    const now = context.currentTime + when;
    const oscillator = context.createOscillator();
    const gain = context.createGain();

    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, now);
    oscillator.frequency.exponentialRampToValueAtTime(Math.max(20, endFrequency || frequency), now + duration);

    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(volume, now + Math.min(0.03, duration * 0.45));
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    oscillator.connect(gain);
    gain.connect(context.destination);

    oscillator.start(now);
    oscillator.stop(now + duration + 0.02);
  }

  cast(power) {
    this.pulse({ frequency: 220 + power * 140, endFrequency: 130, duration: 0.18, type: "triangle", volume: 0.045 });
  }

  jig() {
    this.pulse({ frequency: 300, endFrequency: 220, duration: 0.08, type: "square", volume: 0.018 });
  }

  bite() {
    this.pulse({ frequency: 480, endFrequency: 340, duration: 0.16, type: "square", volume: 0.04 });
    this.pulse({ frequency: 720, endFrequency: 590, duration: 0.12, type: "triangle", volume: 0.018, when: 0.03 });
  }

  hook(perfectHook) {
    this.pulse({ frequency: perfectHook ? 620 : 520, endFrequency: 280, duration: 0.18, type: "sawtooth", volume: 0.05 });
  }

  catch(rarityRank, perfectHook) {
    const base = 430 + rarityRank * 70;
    this.pulse({ frequency: base, endFrequency: base * 1.15, duration: 0.12, type: "triangle", volume: 0.04 });
    this.pulse({ frequency: base * 1.3, endFrequency: base * 1.55, duration: 0.16, type: "sine", volume: perfectHook ? 0.05 : 0.03, when: 0.06 });
  }

  escape() {
    this.pulse({ frequency: 260, endFrequency: 120, duration: 0.2, type: "sawtooth", volume: 0.03 });
  }

  sell() {
    this.pulse({ frequency: 580, endFrequency: 730, duration: 0.09, type: "triangle", volume: 0.03 });
    this.pulse({ frequency: 730, endFrequency: 910, duration: 0.11, type: "triangle", volume: 0.026, when: 0.05 });
  }

  buy() {
    this.pulse({ frequency: 380, endFrequency: 560, duration: 0.12, type: "triangle", volume: 0.03 });
  }

  levelUp() {
    this.pulse({ frequency: 520, endFrequency: 760, duration: 0.18, type: "triangle", volume: 0.05 });
    this.pulse({ frequency: 780, endFrequency: 980, duration: 0.2, type: "triangle", volume: 0.04, when: 0.08 });
  }
}

class FishingGame {
  constructor() {
    this.canvas = document.getElementById("gameCanvas");
    this.ctx = this.canvas.getContext("2d");
    this.catchPreviewCtx = document.getElementById("catchPreviewCanvas").getContext("2d");
    this.sound = new SoundBoard();

    this.ui = {
      moneyValue: document.getElementById("moneyValue"),
      levelValue: document.getElementById("levelValue"),
      streakValue: document.getElementById("streakValue"),
      currentLocation: document.getElementById("currentLocation"),
      currentRod: document.getElementById("currentRod"),
      currentBait: document.getElementById("currentBait"),
      capacityValue: document.getElementById("capacityValue"),
      xpText: document.getElementById("xpText"),
      xpFill: document.getElementById("xpFill"),
      nextGoalText: document.getElementById("nextGoalText"),
      discoveredValue: document.getElementById("discoveredValue"),
      totalCaughtValue: document.getElementById("totalCaughtValue"),
      bestCatchValue: document.getElementById("bestCatchValue"),
      recentList: document.getElementById("recentList"),
      stateMessage: document.getElementById("stateMessage"),
      chargeMeter: document.getElementById("chargeMeter"),
      chargeFill: document.getElementById("chargeFill"),
      actionButton: document.getElementById("actionButton"),
      sellButton: document.getElementById("sellButton"),
      inventoryValue: document.getElementById("inventoryValue"),
      inventoryList: document.getElementById("inventoryList"),
      shopContent: document.getElementById("shopContent"),
      soundToggle: document.getElementById("soundToggle"),
      toastStack: document.getElementById("toastStack"),
      catchCard: document.getElementById("catchCard"),
      catchMeta: document.getElementById("catchMeta"),
      catchName: document.getElementById("catchName"),
      catchDetail: document.getElementById("catchDetail"),
      catchValueText: document.getElementById("catchValueText"),
    };

    this.save = this.loadGame();
    this.sound.setEnabled(this.save.soundEnabled);

    this.runtime = this.createRuntime();
    this.pointerHeld = false;
    this.keyHeld = false;
    this.uiDirty = true;
    this.lastTime = performance.now();

    this.bindEvents();
    this.refreshUI();
    this.updateActionState();

    requestAnimationFrame((timestamp) => this.loop(timestamp));
  }

  createRuntime() {
    return {
      phase: "idle",
      charge: 0.18,
      chargeDirection: 1,
      castDepth: 0.22,
      bobber: {
        visible: false,
        x: DOCK_ANCHOR.x,
        y: DOCK_ANCHOR.y,
        startX: DOCK_ANCHOR.x,
        startY: DOCK_ANCHOR.y,
        targetX: DOCK_ANCHOR.x,
        targetY: DOCK_ANCHOR.y,
        progress: 1,
        dip: 0,
        floatPhase: 0,
      },
      fishRoll: null,
      waitTimer: 0,
      waitTotal: 0,
      biteTimer: 0,
      biteTotal: 0,
      biteStartedAt: 0,
      jigCount: 0,
      reel: this.createReelState(),
      ripples: [],
      particles: [],
      jumps: [],
      waveTime: 0,
      catchCardTimer: 0,
      screenShake: 0,
      highlightTimer: 0,
    };
  }

  createReelState() {
    return {
      fishY: 0.5,
      fishVel: 0,
      targetY: 0.5,
      targetTimer: 0.2,
      reticleY: 0.54,
      reticleVel: 0,
      zoneSize: 0.24,
      progress: 35,
      elapsed: 0,
      controlTime: 0,
      hookQuality: 0,
      perfectHook: false,
      seed: Math.random() * Math.PI * 2,
    };
  }

  bindEvents() {
    const actionStart = (event) => {
      event.preventDefault();
      this.handleActionStart("pointer");
    };

    this.canvas.addEventListener("pointerdown", actionStart);
    this.ui.actionButton.addEventListener("pointerdown", actionStart);

    window.addEventListener("pointerup", () => {
      this.handleActionEnd("pointer");
    });

    window.addEventListener("pointercancel", () => {
      this.handleActionEnd("pointer");
    });

    window.addEventListener("keydown", (event) => {
      if (event.code === "Space") {
        event.preventDefault();

        if (!event.repeat) {
          this.handleActionStart("keyboard");
        }
      }

      if (event.code === "KeyS") {
        event.preventDefault();
        this.sellInventory();
      }
    });

    window.addEventListener("keyup", (event) => {
      if (event.code === "Space") {
        event.preventDefault();
        this.handleActionEnd("keyboard");
      }
    });

    window.addEventListener("blur", () => {
      this.handleActionEnd("pointer");
      this.handleActionEnd("keyboard");
    });

    this.ui.sellButton.addEventListener("click", () => this.sellInventory());
    this.ui.soundToggle.addEventListener("click", () => this.toggleSound());

    this.ui.shopContent.addEventListener("click", (event) => {
      const button = event.target.closest("button[data-kind]");

      if (!button) {
        return;
      }

      const { kind, id, action } = button.dataset;

      if (kind === "rod") {
        if (action === "buy") {
          this.buyRod(id);
        } else if (action === "equip") {
          this.equipRod(id);
        }
      }

      if (kind === "bait") {
        if (action === "buy") {
          this.buyBait(id);
        } else if (action === "equip") {
          this.equipBait(id);
        }
      }

      if (kind === "location") {
        if (action === "buy") {
          this.unlockLocation(id);
        } else if (action === "travel") {
          this.travelToLocation(id);
        }
      }

      if (kind === "creel" && action === "buy") {
        this.buyCreel(Number(id));
      }
    });
  }

  isHoldingAction() {
    return this.pointerHeld || this.keyHeld;
  }

  handleActionStart(source) {
    const wasHolding = this.isHoldingAction();

    if (source === "pointer") {
      this.pointerHeld = true;
    } else {
      this.keyHeld = true;
    }

    if (wasHolding) {
      return;
    }

    this.sound.unlock();

    if (this.runtime.phase === "idle") {
      this.beginCharge();
      return;
    }

    if (this.runtime.phase === "waiting") {
      this.jigLine();
      return;
    }

    if (this.runtime.phase === "bite") {
      this.hookFish();
    }
  }

  handleActionEnd(source) {
    const wasHolding = this.isHoldingAction();

    if (source === "pointer") {
      this.pointerHeld = false;
    } else {
      this.keyHeld = false;
    }

    if (!wasHolding || this.isHoldingAction()) {
      return;
    }

    if (this.runtime.phase === "charging") {
      this.castLine(this.runtime.charge);
    }
  }

  loadGame() {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);

      if (!raw) {
        return createNewSave();
      }

      return this.sanitizeSave(JSON.parse(raw));
    } catch {
      return createNewSave();
    }
  }

  sanitizeSave(data) {
    const save = createNewSave();
    const source = data && typeof data === "object" ? data : {};

    if (typeof source.money === "number") {
      save.money = Math.max(0, Math.round(source.money));
    }

    if (typeof source.level === "number") {
      save.level = clamp(Math.floor(source.level), 1, 99);
    }

    if (typeof source.xp === "number") {
      save.xp = Math.max(0, Math.floor(source.xp));
    }

    save.ownedRods = uniqueValidIds(source.ownedRods, RODS_BY_ID, ["twig"]);
    save.ownedBaits = uniqueValidIds(source.ownedBaits, BAITS_BY_ID, ["worms"]);
    save.unlockedLocations = uniqueValidIds(source.unlockedLocations, LOCATIONS_BY_ID, ["pond"]);
    save.rodId = save.ownedRods.includes(source.rodId) ? source.rodId : "twig";
    save.baitId = save.ownedBaits.includes(source.baitId) ? source.baitId : "worms";
    save.locationId = save.unlockedLocations.includes(source.locationId) ? source.locationId : "pond";
    save.creelTier = typeof source.creelTier === "number" ? clamp(Math.floor(source.creelTier), 0, CREELS.length - 1) : 0;
    save.totalCaught = typeof source.totalCaught === "number" ? Math.max(0, Math.floor(source.totalCaught)) : 0;
    save.totalEarned = typeof source.totalEarned === "number" ? Math.max(0, Math.floor(source.totalEarned)) : 0;
    save.streak = typeof source.streak === "number" ? Math.max(0, Math.floor(source.streak)) : 0;
    save.longestStreak = typeof source.longestStreak === "number" ? Math.max(0, Math.floor(source.longestStreak)) : 0;
    save.soundEnabled = source.soundEnabled !== false;

    if (source.bestCatch && SPECIES_BY_ID[source.bestCatch.speciesId]) {
      save.bestCatch = {
        speciesId: source.bestCatch.speciesId,
        name: source.bestCatch.name || SPECIES_BY_ID[source.bestCatch.speciesId].name,
        value: Math.max(0, Math.round(source.bestCatch.value || 0)),
        weight: Number(source.bestCatch.weight) || 0,
      };
    }

    save.inventory = Array.isArray(source.inventory)
      ? source.inventory
          .filter((entry) => entry && SPECIES_BY_ID[entry.speciesId])
          .map((entry) => ({
            id: entry.id || `${Date.now()}-${Math.random().toString(16).slice(2)}`,
            speciesId: entry.speciesId,
            name: entry.name || SPECIES_BY_ID[entry.speciesId].name,
            rarity: entry.rarity || SPECIES_BY_ID[entry.speciesId].rarity,
            grade: entry.grade || "Clean",
            weight: Number(entry.weight) || SPECIES_BY_ID[entry.speciesId].minWeight,
            value: Math.max(0, Math.round(entry.value || 0)),
            xp: Math.max(0, Math.round(entry.xp || 0)),
            locationId: entry.locationId || "pond",
            qualityScore: clamp(Number(entry.qualityScore) || 0, 0, 1),
            perfectHook: Boolean(entry.perfectHook),
          }))
          .slice(0, CREELS[save.creelTier].capacity)
      : [];

    save.recentCatches = Array.isArray(source.recentCatches)
      ? source.recentCatches
          .filter((entry) => entry && SPECIES_BY_ID[entry.speciesId])
          .slice(0, 6)
          .map((entry) => ({
            speciesId: entry.speciesId,
            name: entry.name || SPECIES_BY_ID[entry.speciesId].name,
            value: Math.max(0, Math.round(entry.value || 0)),
            rarity: entry.rarity || SPECIES_BY_ID[entry.speciesId].rarity,
            grade: entry.grade || "Clean",
            weight: Number(entry.weight) || SPECIES_BY_ID[entry.speciesId].minWeight,
          }))
      : [];

    if (source.journal && typeof source.journal === "object") {
      for (const [speciesId, record] of Object.entries(source.journal)) {
        if (!SPECIES_BY_ID[speciesId] || !record || typeof record !== "object") {
          continue;
        }

        save.journal[speciesId] = {
          count: Math.max(0, Math.floor(record.count || 0)),
          bestWeight: Math.max(0, Number(record.bestWeight) || 0),
          bestValue: Math.max(0, Math.round(record.bestValue || 0)),
        };
      }
    }

    return save;
  }

  saveGame() {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(this.save));
    } catch {
      return;
    }
  }

  getCurrentRod() {
    return RODS_BY_ID[this.save.rodId];
  }

  getCurrentBait() {
    return BAITS_BY_ID[this.save.baitId];
  }

  getCurrentLocation() {
    return LOCATIONS_BY_ID[this.save.locationId];
  }

  getCurrentCreel() {
    return CREELS[this.save.creelTier];
  }

  getInventoryValue() {
    return this.save.inventory.reduce((sum, entry) => sum + entry.value, 0);
  }

  getXpRequired(level = this.save.level) {
    return Math.round(60 + Math.pow(level - 1, 1.35) * 55);
  }

  canOpenMenu() {
    if (this.runtime.phase !== "idle") {
      this.spawnToast("Finish the current cast first.", "#ff9d59");
      return false;
    }

    return true;
  }

  gainXp(amount) {
    let remaining = Math.max(0, Math.round(amount));

    while (remaining > 0) {
      const requirement = this.getXpRequired();
      const needed = requirement - this.save.xp;

      if (remaining < needed) {
        this.save.xp += remaining;
        remaining = 0;
        break;
      }

      remaining -= needed;
      this.save.xp = 0;
      this.save.level += 1;

      const bonusMoney = 18 + this.save.level * 6;
      this.save.money += bonusMoney;
      this.spawnToast(`Level ${this.save.level} reached. Bonus ${formatMoney(bonusMoney)}.`, "#ffe06b");
      this.sound.levelUp();
    }
  }

  spawnToast(message, accent = "#ef9c36") {
    const toast = document.createElement("div");
    toast.className = "toast";
    toast.textContent = message;
    toast.style.setProperty("--toast-accent", accent);
    this.ui.toastStack.appendChild(toast);

    requestAnimationFrame(() => {
      toast.classList.add("show");
    });

    window.setTimeout(() => {
      toast.classList.remove("show");
      window.setTimeout(() => toast.remove(), 180);
    }, 2300);
  }

  toggleSound() {
    this.save.soundEnabled = !this.save.soundEnabled;
    this.sound.setEnabled(this.save.soundEnabled);
    this.uiDirty = true;
    this.saveGame();
  }

  beginCharge() {
    if (this.save.inventory.length >= this.getCurrentCreel().capacity) {
      this.spawnToast("Creel full. Sell your catch or buy more space.", "#ff9d59");
      return;
    }

    this.runtime.phase = "charging";
    this.runtime.charge = 0.18;
    this.runtime.chargeDirection = 1;
    this.runtime.highlightTimer = 0.1;
    this.updateActionState();
  }

  castLine(power) {
    const rod = this.getCurrentRod();
    const effectivePower = clamp(power * rod.power, 0.16, 1);
    const castDepth = clamp(0.16 + effectivePower * 0.72, 0.16, 0.98);
    const targetX = lerp(370, 844, castDepth);
    const targetY = lerp(332, 276, castDepth) + Math.sin(castDepth * Math.PI) * 10;

    this.runtime.phase = "casting";
    this.runtime.castDepth = castDepth;
    this.runtime.bobber.visible = true;
    this.runtime.bobber.startX = DOCK_ANCHOR.x;
    this.runtime.bobber.startY = DOCK_ANCHOR.y;
    this.runtime.bobber.targetX = targetX;
    this.runtime.bobber.targetY = targetY;
    this.runtime.bobber.x = DOCK_ANCHOR.x;
    this.runtime.bobber.y = DOCK_ANCHOR.y;
    this.runtime.bobber.progress = 0;
    this.runtime.bobber.dip = 0;
    this.runtime.fishRoll = this.rollFish(castDepth);
    this.runtime.waitTimer = 0;
    this.runtime.waitTotal = 0;
    this.runtime.biteTimer = 0;
    this.runtime.biteTotal = 0;
    this.runtime.jigCount = 0;
    this.sound.cast(power);
    this.updateActionState();
  }

  rollFish(depth) {
    const rod = this.getCurrentRod();
    const bait = this.getCurrentBait();
    const location = this.getCurrentLocation();
    const pool = location.fishIds.map((id) => SPECIES_BY_ID[id]);
    const rarityBoost = bait.rareChance + rod.luck + location.rareBoost;

    const species = pickWeighted(pool, (candidate) => {
      const rarity = RARITIES[candidate.rarity];
      const depthDistance = Math.abs(depth - candidate.depthPreference);
      const depthFit = clamp(1 - depthDistance / candidate.depthTolerance, 0, 1);
      const rarityFactor = 1 + rarityBoost * (rarity.rank * 0.75 + 0.2);
      const deepPenalty = depth < candidate.depthPreference - candidate.depthTolerance * 1.1 ? 0.28 : 1;
      return candidate.spawnWeight * (0.35 + depthFit * 1.6) * rarityFactor * deepPenalty;
    });

    const rarity = RARITIES[species.rarity];
    const weightBias = clamp(0.4 + depth * 0.35 + rod.luck * 0.45, 0, 1);
    const weightRoll = Math.pow(Math.random(), 1.05 - weightBias * 0.32);
    const weight = lerp(species.minWeight, species.maxWeight, weightRoll);
    const sizeRatio = (weight - species.minWeight) / Math.max(0.01, species.maxWeight - species.minWeight);
    const baseValue = species.baseValue * weight * rarity.valueFactor * (0.94 + sizeRatio * 0.45) * bait.quality;
    const waitTime = rand(1.9, 4.5) * location.waitFactor / bait.biteSpeed / (1 + depth * 0.08);
    const biteDuration = clamp((0.96 - species.difficulty * 0.1) * rod.biteWindow * location.biteWindow, 0.34, 1.12);

    return {
      species,
      rarity,
      weight,
      baseValue,
      waitTime,
      biteDuration,
      patternSeed: Math.random() * Math.PI * 2,
      depth,
    };
  }

  jigLine() {
    if (!this.runtime.fishRoll) {
      return;
    }

    this.runtime.jigCount += 1;
    this.runtime.waitTimer = Math.max(0.12, this.runtime.waitTimer - 0.24 * this.getCurrentBait().biteSpeed);
    this.runtime.bobber.dip = Math.max(this.runtime.bobber.dip, 6);
    this.spawnRipple(this.runtime.bobber.x, this.runtime.bobber.y + 7, 22, 0.45);
    this.sound.jig();

    if (this.runtime.jigCount >= 4 && Math.random() < 0.08 * this.runtime.jigCount) {
      this.loseFish("You overworked the lure and spooked the fish.");
    }
  }

  startBite() {
    this.runtime.phase = "bite";
    this.runtime.biteTimer = this.runtime.fishRoll.biteDuration;
    this.runtime.biteTotal = this.runtime.fishRoll.biteDuration;
    this.runtime.biteStartedAt = performance.now();
    this.runtime.bobber.dip = 14;
    this.runtime.highlightTimer = 0.16;
    this.spawnRipple(this.runtime.bobber.x, this.runtime.bobber.y + 9, 28, 0.55);
    this.sound.bite();
    this.updateActionState();
  }

  hookFish() {
    if (!this.runtime.fishRoll) {
      return;
    }

    const species = this.runtime.fishRoll.species;
    const rod = this.getCurrentRod();
    const reactionTime = performance.now() - this.runtime.biteStartedAt;
    const perfectHook = reactionTime <= 180;
    const hookQuality = clamp(1 - reactionTime / (this.runtime.biteTotal * 1000), 0, 1);

    this.runtime.phase = "reeling";
    this.runtime.reel = {
      fishY: clamp(0.34 + Math.random() * 0.44, 0.1, 0.9),
      fishVel: 0,
      targetY: clamp(0.3 + Math.random() * 0.4, 0.1, 0.9),
      targetTimer: rand(0.18, 0.34),
      reticleY: 0.58,
      reticleVel: 0,
      zoneSize: clamp(0.3 - species.difficulty * 0.055 + (rod.control - 1) * 0.09, 0.11, 0.29),
      progress: 30 + hookQuality * 18 + (perfectHook ? 10 : 0),
      elapsed: 0,
      controlTime: 0,
      hookQuality,
      perfectHook,
      seed: this.runtime.fishRoll.patternSeed,
    };

    if (perfectHook) {
      this.spawnToast("Perfect hook.", "#ffe06b");
    }

    this.runtime.screenShake = 0.28;
    this.sound.hook(perfectHook);
    this.updateActionState();
  }

  resetLine() {
    this.runtime.phase = "idle";
    this.runtime.bobber.visible = false;
    this.runtime.fishRoll = null;
    this.runtime.waitTimer = 0;
    this.runtime.waitTotal = 0;
    this.runtime.biteTimer = 0;
    this.runtime.biteTotal = 0;
    this.runtime.biteStartedAt = 0;
    this.runtime.jigCount = 0;
    this.runtime.reel = this.createReelState();
    this.updateActionState();
  }

  buildCatchData() {
    const roll = this.runtime.fishRoll;
    const reel = this.runtime.reel;
    const species = roll.species;
    const rarity = RARITIES[species.rarity];
    const controlRatio = clamp(reel.controlTime / Math.max(reel.elapsed, 0.01), 0, 1);
    const qualityScore = clamp(reel.hookQuality * 0.44 + controlRatio * 0.56, 0, 1);
    const grade = qualityScore >= 0.88 ? "Trophy" : qualityScore >= 0.72 ? "Prime" : qualityScore >= 0.54 ? "Clean" : "Scrappy";
    const streakMultiplier = 1 + this.save.streak * 0.05;
    const qualityMultiplier = 1 + qualityScore * 0.35 + (reel.perfectHook ? 0.08 : 0);
    const value = Math.round(roll.baseValue * qualityMultiplier * streakMultiplier);
    const xp = Math.round(value * 0.65 + rarity.rank * 8 + qualityScore * 14);

    return {
      id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
      speciesId: species.id,
      name: species.name,
      rarity: species.rarity,
      grade,
      weight: Number(roll.weight.toFixed(1)),
      value,
      xp,
      locationId: this.save.locationId,
      qualityScore,
      perfectHook: reel.perfectHook,
    };
  }

  registerCatch(catchData) {
    this.save.inventory.unshift(catchData);
    this.save.inventory = this.save.inventory.slice(0, this.getCurrentCreel().capacity);
    this.save.recentCatches.unshift(catchData);
    this.save.recentCatches = this.save.recentCatches.slice(0, 6);
    this.save.totalCaught += 1;
    this.save.streak = Math.min(this.save.streak + 1, 7);
    this.save.longestStreak = Math.max(this.save.longestStreak, this.save.streak);

    const journalEntry = this.save.journal[catchData.speciesId] || { count: 0, bestWeight: 0, bestValue: 0 };
    journalEntry.count += 1;
    journalEntry.bestWeight = Math.max(journalEntry.bestWeight, catchData.weight);
    journalEntry.bestValue = Math.max(journalEntry.bestValue, catchData.value);
    this.save.journal[catchData.speciesId] = journalEntry;

    if (!this.save.bestCatch || catchData.value > this.save.bestCatch.value) {
      this.save.bestCatch = {
        speciesId: catchData.speciesId,
        name: catchData.name,
        value: catchData.value,
        weight: catchData.weight,
      };
    }

    this.gainXp(catchData.xp);
    this.showCatchCard(catchData);
  }

  landFish() {
    const catchData = this.buildCatchData();
    const rarity = RARITIES[catchData.rarity];

    this.registerCatch(catchData);
    this.spawnToast(`${catchData.grade} ${catchData.name} for ${formatMoney(catchData.value)}.`, rarity.color);
    this.sound.catch(rarity.rank, catchData.perfectHook);
    this.spawnRipple(this.runtime.bobber.x, this.runtime.bobber.y + 8, 34, 0.7);
    this.spawnCelebration(this.runtime.bobber.x, this.runtime.bobber.y - 6, rarity.color);
    this.runtime.screenShake = 0.34;
    this.uiDirty = true;
    this.saveGame();
    this.resetLine();
  }

  loseFish(message) {
    this.save.streak = 0;
    this.runtime.screenShake = 0.12;
    this.spawnToast(message, "#ff8a70");
    this.sound.escape();
    this.uiDirty = true;
    this.saveGame();
    this.resetLine();
  }

  showCatchCard(catchData) {
    const rarity = RARITIES[catchData.rarity];
    const location = LOCATIONS_BY_ID[catchData.locationId];

    this.ui.catchMeta.textContent = `${rarity.label} Catch`;
    this.ui.catchName.textContent = catchData.name;
    this.ui.catchDetail.textContent = `${formatWeight(catchData.weight)} • ${catchData.grade} • ${location.name}`;
    this.ui.catchValueText.textContent = `${formatMoney(catchData.value)} value • ${catchData.xp} XP`;
    this.ui.catchCard.classList.remove("hidden");
    this.drawCatchPreview(catchData);
    this.runtime.catchCardTimer = 2.5;
  }

  hideCatchCard() {
    this.ui.catchCard.classList.add("hidden");
  }

  drawCatchPreview(catchData) {
    const species = SPECIES_BY_ID[catchData.speciesId];
    const ctx = this.catchPreviewCtx;

    ctx.clearRect(0, 0, 200, 90);

    const gradient = ctx.createLinearGradient(0, 0, 200, 90);
    gradient.addColorStop(0, "rgba(226, 245, 241, 0.94)");
    gradient.addColorStop(1, "rgba(184, 220, 213, 0.94)");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 200, 90);

    for (let i = 0; i < 4; i += 1) {
      ctx.strokeStyle = `rgba(255, 255, 255, ${0.2 - i * 0.03})`;
      ctx.beginPath();
      ctx.moveTo(0, 16 + i * 16);
      ctx.bezierCurveTo(60, 8 + i * 14, 140, 24 + i * 10, 200, 12 + i * 18);
      ctx.stroke();
    }

    this.drawFishShape(ctx, 114, 46, 100, 36, species, true, false);
  }

  sellInventory() {
    if (!this.canOpenMenu()) {
      return;
    }

    if (!this.save.inventory.length) {
      this.spawnToast("Your creel is empty.", "#6bc3ff");
      return;
    }

    const total = this.getInventoryValue();
    this.save.money += total;
    this.save.totalEarned += total;
    this.save.inventory = [];
    this.saveGame();
    this.sound.sell();
    this.spawnToast(`Sold your creel for ${formatMoney(total)}.`, "#76b88d");
    this.uiDirty = true;
  }

  buyRod(id) {
    if (!this.canOpenMenu()) {
      return;
    }

    const rod = RODS_BY_ID[id];

    if (!rod || this.save.ownedRods.includes(id)) {
      return;
    }

    if (this.save.level < rod.unlockLevel) {
      this.spawnToast(`Reach level ${rod.unlockLevel} to unlock ${rod.name}.`, "#ff9d59");
      return;
    }

    if (this.save.money < rod.price) {
      this.spawnToast(`Need ${formatMoney(rod.price)} for ${rod.name}.`, "#ff9d59");
      return;
    }

    this.save.money -= rod.price;
    this.save.ownedRods.push(id);
    this.save.rodId = id;
    this.saveGame();
    this.sound.buy();
    this.spawnToast(`${rod.name} added to your rig.`, "#ffe06b");
    this.uiDirty = true;
  }

  equipRod(id) {
    if (!this.canOpenMenu()) {
      return;
    }

    if (!this.save.ownedRods.includes(id)) {
      return;
    }

    this.save.rodId = id;
    this.saveGame();
    this.spawnToast(`${RODS_BY_ID[id].name} equipped.`, "#6bc3ff");
    this.uiDirty = true;
  }

  buyBait(id) {
    if (!this.canOpenMenu()) {
      return;
    }

    const bait = BAITS_BY_ID[id];

    if (!bait || this.save.ownedBaits.includes(id)) {
      return;
    }

    if (this.save.level < bait.unlockLevel) {
      this.spawnToast(`Reach level ${bait.unlockLevel} to unlock ${bait.name}.`, "#ff9d59");
      return;
    }

    if (this.save.money < bait.price) {
      this.spawnToast(`Need ${formatMoney(bait.price)} for ${bait.name}.`, "#ff9d59");
      return;
    }

    this.save.money -= bait.price;
    this.save.ownedBaits.push(id);
    this.save.baitId = id;
    this.saveGame();
    this.sound.buy();
    this.spawnToast(`${bait.name} unlocked and equipped.`, "#ffe06b");
    this.uiDirty = true;
  }

  equipBait(id) {
    if (!this.canOpenMenu()) {
      return;
    }

    if (!this.save.ownedBaits.includes(id)) {
      return;
    }

    this.save.baitId = id;
    this.saveGame();
    this.spawnToast(`${BAITS_BY_ID[id].name} equipped.`, "#6bc3ff");
    this.uiDirty = true;
  }

  unlockLocation(id) {
    if (!this.canOpenMenu()) {
      return;
    }

    const location = LOCATIONS_BY_ID[id];

    if (!location || this.save.unlockedLocations.includes(id)) {
      return;
    }

    if (this.save.level < location.unlockLevel) {
      this.spawnToast(`Reach level ${location.unlockLevel} to reach ${location.name}.`, "#ff9d59");
      return;
    }

    if (this.save.money < location.unlockCost) {
      this.spawnToast(`Need ${formatMoney(location.unlockCost)} to unlock ${location.name}.`, "#ff9d59");
      return;
    }

    this.save.money -= location.unlockCost;
    this.save.unlockedLocations.push(id);
    this.save.locationId = id;
    this.saveGame();
    this.sound.buy();
    this.spawnToast(`${location.name} unlocked.`, "#ffe06b");
    this.uiDirty = true;
  }

  travelToLocation(id) {
    if (!this.canOpenMenu()) {
      return;
    }

    if (!this.save.unlockedLocations.includes(id)) {
      return;
    }

    this.save.locationId = id;
    this.saveGame();
    this.spawnToast(`Travelled to ${LOCATIONS_BY_ID[id].name}.`, "#6bc3ff");
    this.uiDirty = true;
  }

  buyCreel(index) {
    if (!this.canOpenMenu()) {
      return;
    }

    const creel = CREELS[index];

    if (!creel || index <= this.save.creelTier) {
      return;
    }

    if (this.save.level < creel.unlockLevel) {
      this.spawnToast(`Reach level ${creel.unlockLevel} to unlock ${creel.name}.`, "#ff9d59");
      return;
    }

    if (this.save.money < creel.price) {
      this.spawnToast(`Need ${formatMoney(creel.price)} for ${creel.name}.`, "#ff9d59");
      return;
    }

    this.save.money -= creel.price;
    this.save.creelTier = index;
    this.saveGame();
    this.sound.buy();
    this.spawnToast(`${creel.name} ready. Capacity ${creel.capacity}.`, "#ffe06b");
    this.uiDirty = true;
  }

  getNextGoalText() {
    const rodTarget = RODS.find((rod) => !this.save.ownedRods.includes(rod.id) && this.save.level >= rod.unlockLevel);
    const baitTarget = BAITS.find((bait) => !this.save.ownedBaits.includes(bait.id) && this.save.level >= bait.unlockLevel);
    const locationTarget = LOCATIONS.find((location) => !this.save.unlockedLocations.includes(location.id) && this.save.level >= location.unlockLevel);
    const creelTarget = CREELS.find((creel, index) => index > this.save.creelTier && this.save.level >= creel.unlockLevel);

    const immediateTargets = [
      rodTarget ? { price: rodTarget.price, text: `${rodTarget.name} costs ${formatMoney(rodTarget.price)}.` } : null,
      baitTarget ? { price: baitTarget.price, text: `${baitTarget.name} costs ${formatMoney(baitTarget.price)}.` } : null,
      locationTarget ? { price: locationTarget.unlockCost, text: `${locationTarget.name} unlocks for ${formatMoney(locationTarget.unlockCost)}.` } : null,
      creelTarget ? { price: creelTarget.price, text: `${creelTarget.name} expands you to ${creelTarget.capacity} slots for ${formatMoney(creelTarget.price)}.` } : null,
    ].filter(Boolean);

    if (immediateTargets.length) {
      immediateTargets.sort((left, right) => left.price - right.price);
      const cheapest = immediateTargets[0];
      const shortfall = Math.max(0, cheapest.price - this.save.money);

      if (shortfall > 0) {
        return `${cheapest.text} You are ${formatMoney(shortfall)} short.`;
      }

      return `${cheapest.text} You can afford it now.`;
    }

    const lockedTargets = [
      RODS.find((rod) => !this.save.ownedRods.includes(rod.id)),
      BAITS.find((bait) => !this.save.ownedBaits.includes(bait.id)),
      LOCATIONS.find((location) => !this.save.unlockedLocations.includes(location.id)),
      CREELS.find((creel, index) => index > this.save.creelTier),
    ].filter(Boolean);

    if (lockedTargets.length) {
      lockedTargets.sort((left, right) => left.unlockLevel - right.unlockLevel);
      const next = lockedTargets[0];
      return `Reach level ${next.unlockLevel} to unlock ${next.name}.`;
    }

    return "You own the full kit. Chase streaks and trophy fish for bigger sell-offs.";
  }

  refreshUI() {
    const location = this.getCurrentLocation();
    const rod = this.getCurrentRod();
    const bait = this.getCurrentBait();
    const creel = this.getCurrentCreel();
    const xpRequired = this.getXpRequired();
    const xpPercent = clamp((this.save.xp / xpRequired) * 100, 0, 100);
    const discoveredCount = Object.keys(this.save.journal).length;

    this.ui.moneyValue.textContent = formatMoney(this.save.money);
    this.ui.levelValue.textContent = String(this.save.level);
    this.ui.streakValue.textContent = `${this.save.streak + 1}x`;
    this.ui.currentLocation.textContent = location.name;
    this.ui.currentRod.textContent = rod.name;
    this.ui.currentBait.textContent = bait.name;
    this.ui.capacityValue.textContent = `${this.save.inventory.length}/${creel.capacity}`;
    this.ui.xpText.textContent = `${this.save.xp} / ${xpRequired}`;
    this.ui.xpFill.style.width = `${xpPercent}%`;
    this.ui.nextGoalText.textContent = this.getNextGoalText();
    this.ui.discoveredValue.textContent = `${discoveredCount} / ${FISH_SPECIES.length}`;
    this.ui.totalCaughtValue.textContent = String(this.save.totalCaught);
    this.ui.bestCatchValue.textContent = this.save.bestCatch
      ? `${this.save.bestCatch.name} • ${formatMoney(this.save.bestCatch.value)}`
      : "None yet";
    this.ui.inventoryValue.textContent = formatMoney(this.getInventoryValue());
    this.ui.soundToggle.textContent = `Sound: ${this.save.soundEnabled ? "On" : "Off"}`;

    this.renderInventory();
    this.renderRecent();
    this.renderShop();

    this.uiDirty = false;
  }

  renderInventory() {
    if (!this.save.inventory.length) {
      this.ui.inventoryList.innerHTML = '<li class="placeholder">Catch a few fish and stack value before selling.</li>';
      return;
    }

    this.ui.inventoryList.innerHTML = this.save.inventory
      .map((entry) => {
        const rarity = RARITIES[entry.rarity];

        return `
          <li class="inventory-item">
            <div>
              <div class="inventory-title"><span class="rarity-dot" style="background:${rarity.color}"></span>${entry.grade} ${entry.name}</div>
              <div class="inventory-meta">${formatWeight(entry.weight)} • ${rarity.label}</div>
            </div>
            <strong>${formatMoney(entry.value)}</strong>
          </li>
        `;
      })
      .join("");
  }

  renderRecent() {
    if (!this.save.recentCatches.length) {
      this.ui.recentList.innerHTML = '<li class="placeholder">Your best recent catches will show up here.</li>';
      return;
    }

    this.ui.recentList.innerHTML = this.save.recentCatches
      .map((entry) => {
        const rarity = RARITIES[entry.rarity];

        return `
          <li class="recent-item">
            <div class="recent-title"><span class="rarity-dot" style="background:${rarity.color}"></span>${entry.name}</div>
            <div class="recent-meta">${entry.grade} • ${formatWeight(entry.weight)} • ${formatMoney(entry.value)}</div>
          </li>
        `;
      })
      .join("");
  }

  renderShop() {
    const rodSection = this.renderShopSection("Rods", RODS.slice(1), "rod");
    const baitSection = this.renderShopSection("Bait", BAITS.slice(1), "bait");
    const locationSection = this.renderShopSection("Locations", LOCATIONS.slice(1), "location");
    const creelItems = CREELS.slice(1).map((creel, index) => ({ ...creel, index: index + 1 }));
    const creelSection = this.renderShopSection("Creels", creelItems, "creel");
    this.ui.shopContent.innerHTML = `${rodSection}${baitSection}${locationSection}${creelSection}`;
  }

  renderShopSection(title, items, kind) {
    const content = items
      .map((item) => {
        const buttonState = this.getShopButtonState(kind, item);
        const price = kind === "location" ? item.unlockCost : item.price;
        const labelPrice = price ? formatMoney(price) : "Owned";
        const description = item.description;
        const tags = this.getShopTags(kind, item)
          .map((tag) => `<span class="shop-tag">${tag}</span>`)
          .join("");

        return `
          <article class="shop-item">
            <div>
              <div class="shop-topline">
                <div>
                  <div class="shop-title">${item.name}</div>
                  <div class="shop-meta">${labelPrice}</div>
                </div>
                <span class="status-pill ${buttonState.statusClass}">${buttonState.statusLabel}</span>
              </div>
              <div class="shop-description">${description}</div>
            </div>
            <div class="shop-tags">${tags}</div>
            <div class="shop-actions">
              <span class="shop-meta">${buttonState.hint}</span>
              <button class="button small ${buttonState.buttonClass}" type="button" data-kind="${kind}" data-id="${buttonState.idValue}" data-action="${buttonState.action}" ${buttonState.disabled ? "disabled" : ""}>${buttonState.label}</button>
            </div>
          </article>
        `;
      })
      .join("");

    return `
      <section class="shop-section">
        <h3>${title}</h3>
        ${content}
      </section>
    `;
  }

  getShopButtonState(kind, item) {
    if (kind === "rod") {
      if (this.save.rodId === item.id) {
        return {
          label: "Equipped",
          action: "equip",
          disabled: true,
          statusLabel: "Equipped",
          statusClass: "equipped",
          hint: "Current rod",
          buttonClass: "ghost",
          idValue: item.id,
        };
      }

      if (this.save.ownedRods.includes(item.id)) {
        return {
          label: "Equip",
          action: "equip",
          disabled: false,
          statusLabel: "Owned",
          statusClass: "",
          hint: `Level ${item.unlockLevel}`,
          buttonClass: "secondary",
          idValue: item.id,
        };
      }

      if (this.save.level < item.unlockLevel) {
        return {
          label: `Level ${item.unlockLevel}`,
          action: "buy",
          disabled: true,
          statusLabel: "Locked",
          statusClass: "locked",
          hint: "Level gate",
          buttonClass: "ghost",
          idValue: item.id,
        };
      }

      return {
        label: `Buy ${formatMoney(item.price)}`,
        action: "buy",
        disabled: false,
        statusLabel: "Available",
        statusClass: "",
        hint: this.save.money >= item.price ? "Affordable" : "Save up",
        buttonClass: "primary",
        idValue: item.id,
      };
    }

    if (kind === "bait") {
      if (this.save.baitId === item.id) {
        return {
          label: "Equipped",
          action: "equip",
          disabled: true,
          statusLabel: "Equipped",
          statusClass: "equipped",
          hint: "Current bait",
          buttonClass: "ghost",
          idValue: item.id,
        };
      }

      if (this.save.ownedBaits.includes(item.id)) {
        return {
          label: "Equip",
          action: "equip",
          disabled: false,
          statusLabel: "Owned",
          statusClass: "",
          hint: `Level ${item.unlockLevel}`,
          buttonClass: "secondary",
          idValue: item.id,
        };
      }

      if (this.save.level < item.unlockLevel) {
        return {
          label: `Level ${item.unlockLevel}`,
          action: "buy",
          disabled: true,
          statusLabel: "Locked",
          statusClass: "locked",
          hint: "Level gate",
          buttonClass: "ghost",
          idValue: item.id,
        };
      }

      return {
        label: `Buy ${formatMoney(item.price)}`,
        action: "buy",
        disabled: false,
        statusLabel: "Available",
        statusClass: "",
        hint: this.save.money >= item.price ? "Affordable" : "Save up",
        buttonClass: "primary",
        idValue: item.id,
      };
    }

    if (kind === "location") {
      if (this.save.locationId === item.id) {
        return {
          label: "Here",
          action: "travel",
          disabled: true,
          statusLabel: "Fishing",
          statusClass: "equipped",
          hint: `Level ${item.unlockLevel}`,
          buttonClass: "ghost",
          idValue: item.id,
        };
      }

      if (this.save.unlockedLocations.includes(item.id)) {
        return {
          label: "Travel",
          action: "travel",
          disabled: false,
          statusLabel: "Unlocked",
          statusClass: "",
          hint: `Level ${item.unlockLevel}`,
          buttonClass: "secondary",
          idValue: item.id,
        };
      }

      if (this.save.level < item.unlockLevel) {
        return {
          label: `Level ${item.unlockLevel}`,
          action: "buy",
          disabled: true,
          statusLabel: "Locked",
          statusClass: "locked",
          hint: "Level gate",
          buttonClass: "ghost",
          idValue: item.id,
        };
      }

      return {
        label: `Unlock ${formatMoney(item.unlockCost)}`,
        action: "buy",
        disabled: false,
        statusLabel: "Available",
        statusClass: "",
        hint: this.save.money >= item.unlockCost ? "Affordable" : "Save up",
        buttonClass: "primary",
        idValue: item.id,
      };
    }

    if (kind === "creel") {
      if (item.index === this.save.creelTier) {
        return {
          label: "Current",
          action: "buy",
          disabled: true,
          statusLabel: "Equipped",
          statusClass: "equipped",
          hint: `${item.capacity} slots`,
          buttonClass: "ghost",
          idValue: String(item.index),
        };
      }

      if (item.index < this.save.creelTier) {
        return {
          label: "Owned",
          action: "buy",
          disabled: true,
          statusLabel: "Owned",
          statusClass: "",
          hint: `${item.capacity} slots`,
          buttonClass: "ghost",
          idValue: String(item.index),
        };
      }

      if (this.save.level < item.unlockLevel) {
        return {
          label: `Level ${item.unlockLevel}`,
          action: "buy",
          disabled: true,
          statusLabel: "Locked",
          statusClass: "locked",
          hint: `${item.capacity} slots`,
          buttonClass: "ghost",
          idValue: String(item.index),
        };
      }

      return {
        label: `Buy ${formatMoney(item.price)}`,
        action: "buy",
        disabled: false,
        statusLabel: "Available",
        statusClass: "",
        hint: this.save.money >= item.price ? `${item.capacity} slots` : "Save up",
        buttonClass: "primary",
        idValue: String(item.index),
      };
    }

    return {
      label: "Unavailable",
      action: "buy",
      disabled: true,
      statusLabel: "Locked",
      statusClass: "locked",
      hint: "",
      buttonClass: "ghost",
      idValue: "",
    };
  }

  getShopTags(kind, item) {
    if (kind === "rod") {
      return [`Cast ${(item.power * 100 - 100).toFixed(0)}%`, `Control ${(item.control * 100 - 100).toFixed(0)}%`, `Luck ${(item.luck * 100).toFixed(0)}%`];
    }

    if (kind === "bait") {
      return [`Bite ${(item.biteSpeed * 100 - 100).toFixed(0)}%`, `Rare ${(item.rareChance * 100).toFixed(0)}%`, `Value ${(item.quality * 100 - 100).toFixed(0)}%`];
    }

    if (kind === "location") {
      return [item.description.split(",")[0], `Rare +${Math.round(item.rareBoost * 100)}%`, `Req Lv ${item.unlockLevel}`];
    }

    return [`Capacity ${item.capacity}`, `Req Lv ${item.unlockLevel}`];
  }

  updateActionState() {
    const phase = this.runtime.phase;

    if (phase === "charging") {
      this.ui.stateMessage.textContent = "Release on the sweet spot to cast farther and deeper.";
      this.ui.actionButton.textContent = "Release to Cast";
      this.ui.chargeMeter.classList.add("visible");
    } else if (phase === "casting") {
      this.ui.stateMessage.textContent = "Line in the air.";
      this.ui.actionButton.textContent = "Casting";
      this.ui.chargeMeter.classList.remove("visible");
    } else if (phase === "waiting") {
      this.ui.stateMessage.textContent = "Wait for the bite, or tap lightly to jig the lure.";
      this.ui.actionButton.textContent = "Tap to Jig";
      this.ui.chargeMeter.classList.remove("visible");
    } else if (phase === "bite") {
      this.ui.stateMessage.textContent = "Strike now.";
      this.ui.actionButton.textContent = "Hook";
      this.ui.chargeMeter.classList.remove("visible");
    } else if (phase === "reeling") {
      this.ui.stateMessage.textContent = "Hold to lift the reel band and keep the fish inside it.";
      this.ui.actionButton.textContent = "Hold to Reel";
      this.ui.chargeMeter.classList.remove("visible");
    } else if (this.save.inventory.length >= this.getCurrentCreel().capacity) {
      this.ui.stateMessage.textContent = "Creel full. Sell or upgrade before the next cast.";
      this.ui.actionButton.textContent = "Creel Full";
      this.ui.chargeMeter.classList.remove("visible");
    } else {
      this.ui.stateMessage.textContent = "Hold the button or space bar, then release to cast.";
      this.ui.actionButton.textContent = "Hold to Cast";
      this.ui.chargeMeter.classList.remove("visible");
    }
  }

  spawnRipple(x, y, maxRadius, life = 0.6) {
    this.runtime.ripples.push({ x, y, radius: 2, maxRadius, life, maxLife: life });
  }

  spawnCelebration(x, y, color) {
    for (let index = 0; index < 16; index += 1) {
      const angle = rand(-Math.PI, 0);
      const speed = rand(28, 86);
      this.runtime.particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: rand(2, 5),
        life: rand(0.45, 0.9),
        maxLife: 0.9,
        color,
        gravity: 110,
      });
    }
  }

  spawnAmbientJump() {
    const location = this.getCurrentLocation();
    const species = SPECIES_BY_ID[pickWeighted(location.fishIds, () => 1)];
    this.runtime.jumps.push({
      x: rand(430, 900),
      progress: 0,
      duration: rand(0.7, 1.35),
      arc: rand(18, 42),
      species,
      direction: Math.random() > 0.5 ? 1 : -1,
      baseY: rand(326, 400),
    });
  }

  loop(timestamp) {
    const deltaSeconds = Math.min(0.033, (timestamp - this.lastTime) / 1000);
    this.lastTime = timestamp;
    this.update(deltaSeconds);
    this.render();

    if (this.uiDirty) {
      this.refreshUI();
    }

    this.updateActionState();
    requestAnimationFrame((nextTimestamp) => this.loop(nextTimestamp));
  }

  update(deltaSeconds) {
    this.runtime.waveTime += deltaSeconds;
    this.runtime.highlightTimer = Math.max(0, this.runtime.highlightTimer - deltaSeconds);
    this.runtime.screenShake = Math.max(0, this.runtime.screenShake - deltaSeconds * 1.2);
    this.runtime.bobber.dip = Math.max(0, this.runtime.bobber.dip - deltaSeconds * 28);

    if (this.runtime.phase === "charging") {
      this.updateCharging(deltaSeconds);
    }

    if (this.runtime.phase === "casting") {
      this.updateCasting(deltaSeconds);
    }

    if (this.runtime.phase === "waiting") {
      this.updateWaiting(deltaSeconds);
    }

    if (this.runtime.phase === "bite") {
      this.updateBite(deltaSeconds);
    }

    if (this.runtime.phase === "reeling") {
      this.updateReeling(deltaSeconds);
    }

    if (this.runtime.catchCardTimer > 0) {
      this.runtime.catchCardTimer -= deltaSeconds;

      if (this.runtime.catchCardTimer <= 0) {
        this.hideCatchCard();
      }
    }

    this.updateAmbient(deltaSeconds);
    this.updateRipples(deltaSeconds);
    this.updateParticles(deltaSeconds);
    this.updateJumps(deltaSeconds);
  }

  updateCharging(deltaSeconds) {
    this.runtime.charge += this.runtime.chargeDirection * deltaSeconds * 1.2;

    if (this.runtime.charge >= 1) {
      this.runtime.charge = 1;
      this.runtime.chargeDirection = -1;
    }

    if (this.runtime.charge <= 0.16) {
      this.runtime.charge = 0.16;
      this.runtime.chargeDirection = 1;
    }

    this.ui.chargeFill.style.width = `${this.runtime.charge * 100}%`;
  }

  updateCasting(deltaSeconds) {
    this.runtime.bobber.progress = clamp(this.runtime.bobber.progress + deltaSeconds / 0.58, 0, 1);
    const t = easeOutCubic(this.runtime.bobber.progress);
    this.runtime.bobber.x = lerp(this.runtime.bobber.startX, this.runtime.bobber.targetX, t);
    this.runtime.bobber.y = lerp(this.runtime.bobber.startY, this.runtime.bobber.targetY, t) - Math.sin(t * Math.PI) * (82 + this.runtime.castDepth * 36);

    if (this.runtime.bobber.progress >= 1) {
      this.runtime.phase = "waiting";
      this.runtime.waitTimer = this.runtime.fishRoll.waitTime;
      this.runtime.waitTotal = this.runtime.fishRoll.waitTime;
      this.runtime.bobber.x = this.runtime.bobber.targetX;
      this.runtime.bobber.y = this.runtime.bobber.targetY;
      this.runtime.bobber.floatPhase = 0;
      this.spawnRipple(this.runtime.bobber.x, this.runtime.bobber.y + 7, 30, 0.7);
      this.updateActionState();
    }
  }

  updateWaiting(deltaSeconds) {
    this.runtime.waitTimer -= deltaSeconds;
    this.runtime.bobber.floatPhase += deltaSeconds * 2.4;

    if (this.runtime.waitTimer <= 0) {
      this.startBite();
      return;
    }

    if (Math.random() < deltaSeconds * 2.2) {
      this.spawnRipple(this.runtime.bobber.x + rand(-2, 2), this.runtime.bobber.y + 8, rand(14, 22), 0.35);
    }
  }

  updateBite(deltaSeconds) {
    this.runtime.biteTimer -= deltaSeconds;
    this.runtime.bobber.floatPhase += deltaSeconds * 9;
    this.runtime.bobber.dip = 8 + Math.sin(this.runtime.waveTime * 22) * 4;

    if (this.runtime.biteTimer <= 0) {
      this.loseFish("Missed the bite.");
    }
  }

  updateReeling(deltaSeconds) {
    const reel = this.runtime.reel;
    const rod = this.getCurrentRod();
    const fish = this.runtime.fishRoll.species;
    const holding = this.isHoldingAction();

    reel.elapsed += deltaSeconds;
    reel.reticleVel += (holding ? -(3 + rod.control * 0.45) : 2.7) * deltaSeconds;
    reel.reticleVel *= holding ? 0.92 : 0.98;
    reel.reticleY = clamp(reel.reticleY + reel.reticleVel * deltaSeconds, 0.08, 0.92);

    reel.targetTimer -= deltaSeconds;

    if (reel.targetTimer <= 0) {
      let nextTarget = rand(0.12, 0.88);

      if (fish.movement === "bottom") {
        nextTarget = rand(0.58, 0.9);
      }

      if (fish.movement === "sway") {
        nextTarget = 0.5 + Math.sin(this.runtime.waveTime * 1.4 + reel.seed) * 0.28;
      }

      if (fish.movement === "eel") {
        nextTarget = 0.48 + Math.sin(this.runtime.waveTime * 2.1 + reel.seed) * 0.32;
      }

      if (fish.movement === "dart") {
        nextTarget = clamp(reel.fishY + rand(-0.34, 0.34), 0.1, 0.9);
      }

      reel.targetY = clamp(nextTarget, 0.08, 0.92);
      reel.targetTimer = rand(0.14, 0.4) / (1 + fish.difficulty * 0.16);
    }

    const seek = reel.targetY - reel.fishY;
    reel.fishVel += seek * (4.3 + fish.difficulty * 2.5) * deltaSeconds;
    reel.fishVel += Math.sin(this.runtime.waveTime * (2.4 + fish.difficulty) + reel.seed) * 0.45 * deltaSeconds;

    if (fish.movement === "dart" && Math.random() < deltaSeconds * (1.4 + fish.difficulty * 0.3)) {
      reel.fishVel += rand(-1.2, 1.2);
    }

    reel.fishVel *= 0.89;
    reel.fishY = clamp(reel.fishY + reel.fishVel * deltaSeconds, 0.08, 0.92);

    const overlap = Math.abs(reel.fishY - reel.reticleY) <= reel.zoneSize / 2;

    if (overlap) {
      reel.controlTime += deltaSeconds;
      reel.progress += (18 + rod.control * 5 + reel.hookQuality * 6) * deltaSeconds;

      if (Math.random() < deltaSeconds * 12) {
        this.runtime.particles.push({
          x: 820,
          y: 136 + reel.fishY * 216,
          vx: rand(-12, 12),
          vy: rand(-20, 20),
          size: rand(1.5, 3),
          life: 0.3,
          maxLife: 0.3,
          color: "#e9f6f2",
          gravity: 0,
        });
      }
    } else {
      reel.progress -= (13 + fish.difficulty * 8 - (rod.control - 1) * 2) * deltaSeconds;
    }

    reel.progress = clamp(reel.progress, 0, 100);

    if (reel.progress >= 100) {
      this.landFish();
      return;
    }

    if (reel.progress <= 0) {
      this.loseFish("The fish shook free.");
    }
  }

  updateAmbient(deltaSeconds) {
    if (Math.random() < deltaSeconds * 0.22) {
      this.spawnAmbientJump();
    }
  }

  updateRipples(deltaSeconds) {
    this.runtime.ripples = this.runtime.ripples.filter((ripple) => {
      ripple.life -= deltaSeconds;
      ripple.radius = lerp(ripple.radius, ripple.maxRadius, deltaSeconds * 4.8);
      return ripple.life > 0;
    });
  }

  updateParticles(deltaSeconds) {
    this.runtime.particles = this.runtime.particles.filter((particle) => {
      particle.life -= deltaSeconds;
      particle.x += particle.vx * deltaSeconds;
      particle.y += particle.vy * deltaSeconds;
      particle.vy += particle.gravity * deltaSeconds;
      return particle.life > 0;
    });
  }

  updateJumps(deltaSeconds) {
    this.runtime.jumps = this.runtime.jumps.filter((jump) => {
      jump.progress += deltaSeconds / jump.duration;

      if (jump.progress >= 1) {
        this.spawnRipple(jump.x, jump.baseY + 6, 18, 0.4);
        return false;
      }

      return true;
    });
  }

  render() {
    const location = this.getCurrentLocation();
    const ctx = this.ctx;
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    const shake = this.runtime.screenShake * 9;
    const offsetX = shake > 0 ? Math.sin(this.runtime.waveTime * 70) * shake : 0;
    const offsetY = shake > 0 ? Math.cos(this.runtime.waveTime * 80) * shake * 0.5 : 0;

    ctx.save();
    ctx.translate(offsetX, offsetY);

    this.drawSky(location);
    this.drawBackdrop(location);
    this.drawWater(location);
    this.drawAmbientJumps();
    this.drawFishShadow();
    this.drawRipples();
    this.drawDock(location);
    this.drawLineAndBobber();
    this.drawParticles();
    this.drawChargingGuide();

    if (this.runtime.phase === "reeling") {
      this.drawReelHud();
    }

    ctx.restore();
  }

  drawSky(location) {
    const ctx = this.ctx;
    const gradient = ctx.createLinearGradient(0, 0, 0, WATERLINE);
    gradient.addColorStop(0, location.skyTop);
    gradient.addColorStop(1, location.skyBottom);
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, CANVAS_WIDTH, WATERLINE + 10);

    const sunX = location.id === "sea" ? 760 : location.id === "bay" ? 800 : 720;
    const sunY = location.id === "sea" ? 82 : 92;
    const sunRadius = location.id === "sea" ? 44 : 36;
    const sunGradient = ctx.createRadialGradient(sunX, sunY, 8, sunX, sunY, 90);
    sunGradient.addColorStop(0, "rgba(255, 252, 220, 0.92)");
    sunGradient.addColorStop(0.5, "rgba(246, 201, 110, 0.58)");
    sunGradient.addColorStop(1, "rgba(246, 201, 110, 0)");
    ctx.fillStyle = sunGradient;
    ctx.beginPath();
    ctx.arc(sunX, sunY, 90, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "rgba(255, 255, 255, 0.16)";
    for (let index = 0; index < 3; index += 1) {
      const x = 140 + index * 230 + Math.sin(this.runtime.waveTime * 0.18 + index) * 20;
      const y = 72 + index * 26;
      ctx.beginPath();
      ctx.ellipse(x, y, 62, 18, 0, 0, Math.PI * 2);
      ctx.ellipse(x + 40, y + 6, 48, 16, 0, 0, Math.PI * 2);
      ctx.ellipse(x - 34, y + 6, 40, 14, 0, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  drawBackdrop(location) {
    const ctx = this.ctx;

    ctx.fillStyle = location.hill;
    ctx.beginPath();
    ctx.moveTo(0, 210);
    ctx.quadraticCurveTo(120, 150, 240, 192);
    ctx.quadraticCurveTo(340, 126, 480, 194);
    ctx.quadraticCurveTo(620, 132, 760, 196);
    ctx.quadraticCurveTo(860, 168, 960, 206);
    ctx.lineTo(960, 300);
    ctx.lineTo(0, 300);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = location.shore;
    ctx.beginPath();
    ctx.moveTo(0, 240);
    ctx.quadraticCurveTo(160, 220, 320, 246);
    ctx.quadraticCurveTo(500, 214, 650, 252);
    ctx.quadraticCurveTo(770, 226, 960, 248);
    ctx.lineTo(960, 320);
    ctx.lineTo(0, 320);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = "rgba(255, 255, 255, 0.08)";
    ctx.fillRect(0, WATERLINE - 10, CANVAS_WIDTH, 3);
  }

  drawWater(location) {
    const ctx = this.ctx;
    const waterGradient = ctx.createLinearGradient(0, WATERLINE, 0, CANVAS_HEIGHT);
    waterGradient.addColorStop(0, location.waterTop);
    waterGradient.addColorStop(1, location.waterBottom);
    ctx.fillStyle = waterGradient;
    ctx.fillRect(0, WATERLINE, CANVAS_WIDTH, CANVAS_HEIGHT - WATERLINE);

    for (let index = 0; index < 9; index += 1) {
      const y = WATERLINE + 16 + index * 28;
      const alpha = 0.05 + index * 0.01;
      ctx.strokeStyle = `rgba(229, 244, 240, ${alpha})`;
      ctx.lineWidth = 2;
      ctx.beginPath();

      for (let x = 0; x <= CANVAS_WIDTH; x += 20) {
        const wave = Math.sin(x * 0.02 + this.runtime.waveTime * 1.4 + index * 0.8) * (3 + index * 0.3);

        if (x === 0) {
          ctx.moveTo(x, y + wave);
        } else {
          ctx.lineTo(x, y + wave);
        }
      }

      ctx.stroke();
    }

    const shimmer = ctx.createLinearGradient(0, WATERLINE, 0, CANVAS_HEIGHT);
    shimmer.addColorStop(0, "rgba(255, 248, 214, 0.16)");
    shimmer.addColorStop(1, "rgba(255, 248, 214, 0)");
    ctx.fillStyle = shimmer;
    ctx.fillRect(0, WATERLINE, CANVAS_WIDTH, 120);
  }

  drawDock(location) {
    const ctx = this.ctx;

    ctx.fillStyle = "#775533";
    ctx.fillRect(0, 278, 250, 28);
    ctx.fillRect(182, 240, 22, 100);
    ctx.fillRect(70, 248, 18, 92);
    ctx.fillRect(232, 266, 20, 86);

    ctx.fillStyle = "rgba(40, 28, 20, 0.18)";
    for (let plank = 0; plank < 8; plank += 1) {
      ctx.fillRect(plank * 32, 278, 4, 28);
    }

    ctx.fillStyle = location.accent;
    ctx.fillRect(0, 306, 250, 12);

    ctx.fillStyle = "#22343f";
    ctx.beginPath();
    ctx.arc(134, 220, 18, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillRect(120, 236, 28, 56);
    ctx.fillRect(114, 246, 12, 44);
    ctx.fillRect(146, 246, 10, 44);
    ctx.fillRect(109, 290, 12, 42);
    ctx.fillRect(144, 290, 10, 40);

    const rodLift = this.runtime.phase === "reeling" ? -20 : this.runtime.phase === "charging" ? -12 - this.runtime.charge * 10 : -10;
    ctx.strokeStyle = "#1b1e25";
    ctx.lineWidth = 5;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(148, 248);
    ctx.quadraticCurveTo(186, 220 + rodLift, 230, 176 + rodLift);
    ctx.stroke();
  }

  drawChargingGuide() {
    if (this.runtime.phase !== "charging") {
      return;
    }

    const ctx = this.ctx;
    const rod = this.getCurrentRod();
    const depth = clamp(0.16 + this.runtime.charge * rod.power * 0.72, 0.16, 0.98);
    const targetX = lerp(370, 844, depth);
    const targetY = lerp(332, 276, depth) + Math.sin(depth * Math.PI) * 10;

    ctx.save();
    ctx.strokeStyle = "rgba(255, 255, 255, 0.55)";
    ctx.setLineDash([8, 8]);
    ctx.beginPath();
    ctx.moveTo(DOCK_ANCHOR.x, DOCK_ANCHOR.y);
    ctx.quadraticCurveTo((DOCK_ANCHOR.x + targetX) / 2, 140 - this.runtime.charge * 22, targetX, targetY);
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.strokeStyle = "rgba(255, 232, 151, 0.85)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(targetX, targetY + 6, 16 + this.runtime.charge * 8, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  }

  drawLineAndBobber() {
    if (!this.runtime.bobber.visible && this.runtime.phase !== "charging") {
      return;
    }

    const ctx = this.ctx;
    const bobberX = this.runtime.phase === "charging"
      ? lerp(DOCK_ANCHOR.x, 280, this.runtime.charge * 0.22)
      : this.runtime.bobber.x;
    const bobberY = this.runtime.phase === "charging"
      ? lerp(DOCK_ANCHOR.y, 208, this.runtime.charge * 0.18)
      : this.runtime.bobber.y + Math.sin(this.runtime.waveTime * 4 + this.runtime.bobber.floatPhase) * 1.8 + this.runtime.bobber.dip;

    ctx.strokeStyle = "rgba(244, 249, 246, 0.8)";
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.moveTo(230, 176 + (this.runtime.phase === "reeling" ? -16 : 0));
    ctx.quadraticCurveTo((230 + bobberX) / 2, 128 - this.runtime.castDepth * 34, bobberX, bobberY);
    ctx.stroke();

    if (this.runtime.phase === "charging") {
      return;
    }

    ctx.save();
    ctx.translate(bobberX, bobberY);
    ctx.fillStyle = "#fff5ef";
    ctx.beginPath();
    ctx.ellipse(0, 0, 6, 9, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = this.runtime.phase === "bite" ? "#ffe06b" : "#e9634c";
    ctx.beginPath();
    ctx.arc(0, -4, 5, Math.PI, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  drawFishShadow() {
    if (!this.runtime.fishRoll || (this.runtime.phase !== "waiting" && this.runtime.phase !== "bite")) {
      return;
    }

    const ctx = this.ctx;
    const approach = this.runtime.phase === "bite"
      ? 1
      : 1 - this.runtime.waitTimer / Math.max(this.runtime.waitTotal, 0.01);
    const x = this.runtime.bobber.x - 42 + Math.sin(this.runtime.waveTime * 2.8 + this.runtime.fishRoll.patternSeed) * 18 * (1 - approach * 0.5);
    const y = this.runtime.bobber.y + 52 + Math.cos(this.runtime.waveTime * 2.2 + this.runtime.fishRoll.patternSeed) * 4;
    const scale = 0.58 + this.runtime.fishRoll.species.difficulty * 0.08;

    ctx.save();
    ctx.globalAlpha = 0.08 + approach * 0.14;
    ctx.fillStyle = "#071d26";
    this.drawFishShape(ctx, x, y, 88 * scale, 28 * scale, this.runtime.fishRoll.species, true, true);
    ctx.restore();
  }

  drawRipples() {
    const ctx = this.ctx;

    for (const ripple of this.runtime.ripples) {
      const alpha = ripple.life / ripple.maxLife;
      ctx.strokeStyle = `rgba(230, 246, 241, ${alpha * 0.45})`;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.ellipse(ripple.x, ripple.y, ripple.radius, ripple.radius * 0.4, 0, 0, Math.PI * 2);
      ctx.stroke();
    }
  }

  drawParticles() {
    const ctx = this.ctx;

    for (const particle of this.runtime.particles) {
      ctx.globalAlpha = particle.life / particle.maxLife;
      ctx.fillStyle = particle.color;
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.globalAlpha = 1;
  }

  drawAmbientJumps() {
    const ctx = this.ctx;

    for (const jump of this.runtime.jumps) {
      const progress = jump.progress;
      const x = jump.x + jump.direction * Math.sin(progress * Math.PI) * 20;
      const y = jump.baseY - Math.sin(progress * Math.PI) * jump.arc;
      ctx.save();
      ctx.globalAlpha = Math.sin(progress * Math.PI) * 0.45;
      ctx.fillStyle = "#0d2531";
      this.drawFishShape(ctx, x, y, 42, 14, jump.species, jump.direction < 0, true);
      ctx.restore();
    }
  }

  drawReelHud() {
    const ctx = this.ctx;
    const reel = this.runtime.reel;
    const fish = this.runtime.fishRoll.species;
    const panelX = 760;
    const panelY = 98;
    const panelWidth = 160;
    const panelHeight = 312;
    const barX = panelX + 64;
    const barY = panelY + 34;
    const barHeight = 220;

    ctx.fillStyle = "rgba(255, 250, 238, 0.82)";
    this.drawRoundedRect(ctx, panelX, panelY, panelWidth, panelHeight, 20, true);
    ctx.strokeStyle = "rgba(255, 255, 255, 0.65)";
    ctx.stroke();

    ctx.fillStyle = "#1c2430";
    ctx.font = '700 16px "Trebuchet MS", "Gill Sans", sans-serif';
    ctx.fillText("Fight", panelX + 18, panelY + 28);
    ctx.font = '600 12px "Trebuchet MS", "Gill Sans", sans-serif';
    ctx.fillStyle = "rgba(28, 36, 48, 0.65)";
    ctx.fillText(fish.name, panelX + 18, panelY + 48);

    ctx.fillStyle = "rgba(28, 36, 48, 0.1)";
    this.drawRoundedRect(ctx, barX, barY, 30, barHeight, 16, true);

    const reticleY = barY + reel.reticleY * barHeight;
    const zoneHeight = reel.zoneSize * barHeight;
    ctx.fillStyle = "rgba(118, 184, 141, 0.55)";
    this.drawRoundedRect(ctx, barX + 4, reticleY - zoneHeight / 2, 22, zoneHeight, 11, true);

    const fishY = barY + reel.fishY * barHeight;
    ctx.fillStyle = RARITIES[fish.rarity].color;
    ctx.beginPath();
    ctx.arc(barX + 15, fishY, 8, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "rgba(28, 36, 48, 0.18)";
    ctx.beginPath();
    ctx.arc(barX + 15, fishY, 13, 0, Math.PI * 2);
    ctx.stroke();

    ctx.fillStyle = "rgba(28, 36, 48, 0.12)";
    this.drawRoundedRect(ctx, panelX + 18, panelY + 270, 124, 14, 9, true);
    const fillGradient = ctx.createLinearGradient(panelX + 18, panelY + 270, panelX + 142, panelY + 270);
    fillGradient.addColorStop(0, "#f0c04d");
    fillGradient.addColorStop(1, "#ea7f31");
    ctx.fillStyle = fillGradient;
    this.drawRoundedRect(ctx, panelX + 18, panelY + 270, 124 * (reel.progress / 100), 14, 9, true);

    ctx.fillStyle = "rgba(28, 36, 48, 0.72)";
    ctx.fillText(`Tension ${Math.round(reel.progress)}%`, panelX + 18, panelY + 298);
  }

  drawFishShape(ctx, x, y, length, height, species, flip = false, silhouette = false) {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(flip ? -1 : 1, 1);

    const bodyColor = silhouette ? ctx.fillStyle : species.colors[0];
    const accentColor = silhouette ? ctx.fillStyle : species.colors[1];

    if (species.shape === "ray") {
      ctx.fillStyle = bodyColor;
      ctx.beginPath();
      ctx.moveTo(-length * 0.36, 0);
      ctx.quadraticCurveTo(-length * 0.08, -height * 0.72, length * 0.22, 0);
      ctx.quadraticCurveTo(-length * 0.08, height * 0.72, -length * 0.36, 0);
      ctx.fill();
      ctx.strokeStyle = accentColor;
      ctx.lineWidth = silhouette ? 2 : 1.6;
      ctx.beginPath();
      ctx.moveTo(length * 0.22, 0);
      ctx.lineTo(length * 0.52, height * 0.08);
      ctx.stroke();
      ctx.restore();
      return;
    }

    if (species.shape === "eel") {
      ctx.strokeStyle = bodyColor;
      ctx.lineWidth = height * 0.56;
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(-length * 0.44, 0);
      ctx.bezierCurveTo(-length * 0.22, -height * 0.6, length * 0.04, height * 0.5, length * 0.42, 0);
      ctx.stroke();
      ctx.strokeStyle = accentColor;
      ctx.lineWidth = height * 0.18;
      ctx.beginPath();
      ctx.moveTo(-length * 0.18, -height * 0.08);
      ctx.bezierCurveTo(-length * 0.03, -height * 0.2, length * 0.14, height * 0.18, length * 0.32, -height * 0.04);
      ctx.stroke();
      ctx.restore();
      return;
    }

    ctx.fillStyle = bodyColor;
    ctx.beginPath();
    ctx.ellipse(-length * 0.06, 0, length * (species.shape === "round" ? 0.34 : 0.42), height * 0.48, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(-length * 0.42, 0);
    ctx.lineTo(-length * 0.62, -height * 0.3);
    ctx.lineTo(-length * 0.62, height * 0.3);
    ctx.closePath();
    ctx.fill();

    if (!silhouette) {
      ctx.fillStyle = accentColor;
      ctx.beginPath();
      ctx.ellipse(length * 0.04, 0, length * 0.18, height * 0.16, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(-length * 0.04, -height * 0.42);
      ctx.lineTo(length * 0.06, -height * 0.72);
      ctx.lineTo(length * 0.16, -height * 0.3);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = "#17222d";
      ctx.beginPath();
      ctx.arc(length * 0.18, -height * 0.08, 2.6, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  }

  drawRoundedRect(ctx, x, y, width, height, radius, fillOnly = false) {
    const safeRadius = Math.min(radius, width / 2, height / 2);
    ctx.beginPath();
    ctx.moveTo(x + safeRadius, y);
    ctx.arcTo(x + width, y, x + width, y + height, safeRadius);
    ctx.arcTo(x + width, y + height, x, y + height, safeRadius);
    ctx.arcTo(x, y + height, x, y, safeRadius);
    ctx.arcTo(x, y, x + width, y, safeRadius);
    ctx.closePath();

    if (fillOnly) {
      ctx.fill();
    }
  }
}

window.addEventListener("DOMContentLoaded", () => {
  new FishingGame();
});