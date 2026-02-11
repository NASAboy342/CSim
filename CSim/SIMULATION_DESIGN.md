# CSim World Sandbox – Design Draft

## 1. Vision and Inspiration

CSim is a 2D world sandbox and god-simulation game inspired by WorldBox – God Simulator. The goal is to let the player create and manipulate a living pixel world: spawn life, shape terrain, unleash disasters, and watch civilizations rise and fall.

This document captures a **feature baseline** inspired by WorldBox. It is not a clone; instead, it uses similar high-level ideas and adapts them to our own systems and names where needed.

---

## 2. Core Pillars

- **World as a Petri Dish**  
  A procedurally generated tile world with terrain, biomes, and resources that evolves over time.

- **Living Creatures and Civilizations**  
  Multiple fantasy races, animals, and monsters with needs, traits, and simple AI. Civilizations settle, expand, and wage war.

- **Player as a God**  
  The player has a toolbox of "powers" to create, protect, or destroy: spawn entities, change terrain, and trigger disasters.

- **Emergent Stories**  
  Systems interact to generate interesting outcomes: plagues, rebellions, empire collapses, and unexpected survivors.

- **Low Friction Sandbox**  
  No missions or resource grind; the player can experiment freely.

---

## 3. High-Level Feature Map (Baseline)

This section lists the major systems we treat as our **base feature set** (long-term goal). Implementation will be incremental.

### 3.1 World & Terrain

- **Procedural world generation**
  - Generate 2D maps of varying sizes (small/medium/large).
  - Height-based terrain: deep water, shallow water/coast, grasslands, hills, mountains.
  - Biomes based on temperature and moisture: desert, tundra, forest, jungle, etc. (later phase).

- **Terrain simulation**
  - Water spread and lakes/oceans.
  - Basic erosion or smoothing pass for nicer coastlines.

- **Resources (later phase)**
  - Tile attributes: fertility, ores/stone, wood density.
  - Resources affect growth speed of cities and army strength.

- **World metadata**
  - World name, age (ticks/years), seed.
  - Randomly generated kingdom/town names and flags.

### 3.2 Time & Simulation Loop

- Global simulation tick integrated into MonoGame's `Update` loop.
- Adjustable simulation speed (pause, normal, fast, very fast).
- Optional step-by-step (advance one tick) mode for debugging.

### 3.3 Races, Creatures, and Traits

- **Playable/world races (civilized)**
  - Humans
  - Orcs
  - Elves
  - Dwarves

- **Neutral/hostile creatures** (baseline selection)
  - Passive animals: sheep, cows, deer, fish.
  - Predators: wolves, bears.
  - Undead/monsters: skeletons, zombies.
  - High-tier monsters (later phase): dragons, demons, giant crab/kaiju-like creature.

- **Unit traits**
  - Basic stats: health, damage, speed, armor.
  - Personality traits: aggressive, peaceful, greedy, brave, cowardly, etc.
  - Needs: hunger, maybe happiness/loyalty (later phase).

- **Lifecycle**
  - Birth, aging, death.
  - Simple reproduction rules for races and animals.

### 3.4 Civilizations and Towns

- **Settlement formation**
  - When a small group of units of the same race is in suitable terrain, they may found a town.
  - Town has population, borders, and buildings.

- **Town growth**
  - Population grows over time (birth/death model).
  - Towns construct buildings (farms, houses, barracks, docks, etc.) as abstracted structures.

- **Civilizations**
  - Towns of the same race within proximity belong to a kingdom/civilization.
  - Civilizations have a capital, leader, culture name, and flag.

- **Expansion and colonization**
  - Towns expand their borders into nearby tiles.
  - Civilizations may send settlers by land or boat to found new towns on distant continents.

### 3.5 Diplomacy, Wars, and Armies

- **Relationship system**
  - Alliance / neutral / war states between kingdoms.
  - Relationship value influenced by racial differences, past wars, proximity, and random events.

- **Wars and rebellions**
  - Kingdoms can declare war based on relations, power balance, and traits (e.g., aggressive leader).
  - Towns can rebel and form new kingdoms if loyalty is low.

- **Armies**
  - Armies as grouped units with a destination and behavior (march, siege, defend).
  - Basic army UI / overview (later phase): list of armies per kingdom.

### 3.6 Religion and Culture (Later Phase)

- Abstract religion system:
  - Civilizations have a religion/cult that affects diplomacy and internal stability.
  - Shared religion might improve relations, different religions might cause tensions.

- Culture traits:
  - Civ-level traits (expansionist, isolationist, naval-focused, etc.).

### 3.7 Buildings and Technology (Simplified)

- **Buildings** (abstracted, no interior gameplay):
  - Houses – increase population capacity.
  - Farms – improve food production.
  - Barracks – train soldiers faster.
  - Ports/Shipyards – enable boats/naval units.

- **Technology progression (later)**
  - Generic tech levels that increase combat strength, building efficiency, and tools.

### 3.8 God Powers – Creation & Destruction

- **Creation powers**
  - Terrain brushes: raise land, lower land, add water, add mountains.
  - Nature brushes: plant trees, spawn ores, grow grass.
  - Life brushes: spawn specific races (human/orc/elf/dwarf), animals, monsters.

- **Destruction powers**
  - Direct damage: lightning strike, fireball, meteor.
  - Area disasters: tornado/hurricane (simplified), acid or toxic rain (damage over time), volcano (later phase).
  - Biological: plague/virus that spreads among units.
  - Special: nuke-style explosion with large radius (flash + damage + fire).

- **World-level manipulation**
  - Global events: long winter, drought, blessing (faster growth), curse (more disasters).

### 3.9 Player Tools and Interaction

- **Brush & tool system**
  - Toolbar with categories: world, life, civilizations, powers, tools.
  - Different brushes: point click, area (circle/square), continuous painting.

- **Selection & inspection**
  - Click/tap on a unit/town/tile to inspect its data (name, race, stats, traits, etc.).
  - Tool to highlight borders of kingdoms.

- **Divine manipulation tool**
  - Magnet-like tool to drag and drop units.
  - Possibly pick up and throw units or objects.

### 3.10 Visuals and UI

- **Rendering**
  - Pixel-style tiles for terrain and biomes.
  - Small animated sprites for units and simple building icons.

- **HUD/UI**
  - Top or side bar with simulation controls (pause, speed), brushes, and powers.
  - Info panel for selected object.
  - World stats: year, population, number of kingdoms, wars, etc.

- **Overlays** (later phase)
  - Biome overlay, kingdom borders, heatmap for population or resources.

### 3.11 Saving, Loading, and Sharing

- **Save/load**
  - Persist world state, including terrain, units, towns, and kingdoms.

- **Export/import** (later phase)
  - Export world seed and basic state to share.

---

## 4. Implementation Plan in CSim (MonoGame)

This section maps the features to a rough code architecture for the existing MonoGame project.

### 4.1 Project Structure Additions

Proposed new namespaces/folders under `CSim`:

- `World`  
  - `WorldManager` – owns map, time, global tick, and high-level updates.  
  - `WorldTile` – single tile (terrain type, biome, height, resource flags).  
  - `BiomeType`, `TerrainType` enums.

- `Entities`  
  - `Entity` (base class for all units/creatures).  
  - `Race`, `RaceType` enums (human, orc, elf, dwarf).  
  - `Creature` subclasses and data (animals, monsters).  
  - `Traits` / `TraitType`.

- `Civilizations`  
  - `Town`, `Kingdom`, `Army`.  
  - `DiplomacyManager` for relationships and wars.

- `Powers`  
  - `Power` base class and concrete powers (spawn unit, lightning, meteor, plague, etc.).  
  - `Brush` and `ToolCategory` definitions.

- `UI`  
  - `Hud` – toolbar, world stats, speed controls.  
  - `SelectionManager` – clicking and inspecting objects.  
  - Simple UI framework on top of MonoGame (buttons, panels, icons).

### 4.2 Game1 Responsibilities

`Game1` will remain the central MonoGame `Game` subclass but will be given clearer responsibilities:

- Own references to:
  - `WorldManager`
  - `SimulationController` (speed, pause, step)
  - `InputManager`
  - Renderers: `WorldRenderer`, `EntityRenderer`, `UIRenderer`

- Lifecycle hooks:
  - `Initialize()` – create managers and core systems.
  - `LoadContent()` – load tileset, sprites, fonts, and UI assets.
  - `Update()` – process input, advance simulation ticks based on speed.
  - `Draw()` – draw world, entities, overlays, and UI.

### 4.3 Data-Driven Content (Later Phase)

- Use JSON or similar for:
  - Race definitions and traits.  
  - Creature types.  
  - Powers and their parameters (damage, radius, cooldowns).

- Enables easier balancing and mod-like experimentation.

---

## 5. Phased Development Roadmap

We will not implement everything at once. Instead, we define clear phases.

### Phase 1 – World and Basic Life

- Tile-based world generation with simple terrain (water, grass, mountains).
- Spawn and render basic units (one race, simple animals).
- Basic god powers: spawn units, raise/lower land, lightning.
- Simple simulation loop (movement, basic combat).

### Phase 2 – Multiple Races and Towns

- Add four races and race-specific traits.
- Settlements (towns), population growth, simple buildings.
- Kingdoms and basic expansion.

### Phase 3 – Diplomacy and Wars

- Relationship system and war/peace.
- Armies as grouped units.
- Town rebellions and new kingdoms.

### Phase 4 – Advanced Powers and Disasters

- Plague, meteor, nukes, and global events.
- More monsters (dragons, demons, undead swarms).

### Phase 5 – Religion, Culture, and Overlays

- Basic religion system and cultural traits.
- Overlays (borders, resources, population heatmaps).

### Phase 6 – Saving/Loading and Polishing

- Save/load worlds.  
- Performance tuning, nicer art, sound, and UI polish.

---

## 6. Next Steps

Short-term concrete tasks to start implementing this design:

1. Implement a `WorldManager` with a simple tile grid and random terrain.
2. Create basic rendering of tiles and one unit type.
3. Add simple input tools: select a brush from a toolbar and place tiles/units.
4. Introduce a minimal `Entity` system and basic unit behavior (wander, attack nearby enemies).
5. Start wiring up a small subset of god powers (spawn life, lightning) to confirm the core sandbox feel.

This document will evolve as the implementation grows and as we adjust scope based on performance and gameplay feel.

---

## 7. Implementation Progress Log

- **Step 1 – Basic world and units (2026-02-11)**  
  - Added `WorldManager` and `WorldTile` with simple height-based terrain (water/grass/mountain).  
  - Implemented `WorldRenderer` to draw the tile grid.  
  - Introduced `Entity` and `EntityRenderer`; left-click spawns basic units.  
  - Wired everything into `Game1`'s `Initialize`, `LoadContent`, `Update`, and `Draw`.

- **Step 2 – Races, towns, and spawning (2026-02-11)**  
  - Extended `Entity` with `RaceType` and race-colored rendering.  
  - Added `Town`, `TownManager`, and `TownRenderer`; right-click on grass tiles founds towns of the selected race.  
  - Added `InputManager` support for right-clicks and numeric keys (1–4) to select race.  
  - Implemented simple town population growth and periodic settler spawning: towns periodically create new units of their race at the town position.
 
- **Step 3 – Basic unit wandering (2026-02-11)**  
  - Gave `Entity` a simple wandering AI: entities periodically pick a random direction and move at a constant speed.  
  - Clamped entity positions to the backbuffer so units remain within the visible world area.  
 
- **Step 4 – Minimal HUD (2026-02-11)**  
  - Added a `Fonts/Default.spritefont` asset and registered it in `Content.mgcb`.  
  - Introduced `Hud` in the `UI` namespace and wired it into `Game1.Draw`.  
  - HUD displays current race, number of towns, number of units, and a short summary of controls.  
 
- **Step 5 – Basic god tools (2026-02-11)**  
  - Added `ToolMode` enum and simple tool switching (Z/X/C/V) for Spawn, RaiseLand, LowerLand, and Lightning.  
  - Left-click now applies the current tool: spawning units, raising/lowering terrain tiles, or destroying nearby units with a lightning strike.  
  - Right-click to found towns is restricted to Spawn mode to avoid conflicts with other tools.  
 
- **Step 6 – Simple cross-race combat (2026-02-11)**  
  - Extended `Entity` with basic `Health` and `Damage` stats plus an `ApplyDamage` helper.  
  - Added a `ResolveCombat` step in `Game1.Update` that makes nearby units of different races deal damage to each other when within a small radius.  
  - Entities whose health reaches zero or below are removed from the world, allowing battles between races to naturally thin out units.  
 
- **Step 7 – Minimal kingdoms (2026-02-11)**  
  - Introduced `Kingdom` and `KingdomManager` to group towns into simple kingdoms. Each founded town currently creates its own kingdom.  
  - `Game1` now creates a kingdom whenever a town is founded and HUD displays the total kingdom count alongside towns and units.  
 
- **Step 8 – Shared kingdoms by proximity (2026-02-11)**  
  - Updated `KingdomManager` so that new towns join the nearest same-race kingdom within a certain world-radius, instead of always forming a new kingdom.  
  - When no nearby same-race kingdom exists, a new kingdom is still created; HUD kingdom count now better reflects clustered civilizations rather than one-kingdom-per-town.  
 
- **Step 9 – Simple kingdom expansion (2026-02-11)**  
  - Extended `Town` with a colonization timer and threshold so high-population towns periodically request to found colonies.  
  - `Game1` now responds to colonization requests by attempting to place new towns on nearby grass tiles at a random direction and distance, assigning them to the same kingdom.  
  - Result: kingdoms can slowly spread across the map as their core towns grow, without direct player input.  
 
- **Step 10 – Fix town list modification during iteration (2026-02-11)**  
  - Changed `Game1.Update` to iterate over towns using index-based loops with cached counts when processing spawn and colonization queues.  
  - This prevents `InvalidOperationException` errors caused by adding towns to the underlying list while it was being iterated.  
