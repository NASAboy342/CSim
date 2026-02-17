using System;
using System.Collections.Generic;
using System.IO;
using CSim.Civilizations;
using CSim.Entities;
using CSim.Input;
using CSim.Powers;
using CSim.Rendering;
using CSim.UI;
using CSim.World;
using CSim.Spatial;
using Microsoft.Xna.Framework;
using Microsoft.Xna.Framework.Graphics;
using Microsoft.Xna.Framework.Input;

namespace CSim;

public class Game1 : Game
{
    private GraphicsDeviceManager _graphics;
    private SpriteBatch _spriteBatch;

    private WorldManager _worldManager;
    private WorldRenderer _worldRenderer;

    private readonly List<Entity> _entities = new();
    private EntityRenderer _entityRenderer;
    private InputManager _inputManager = null!;

    private EntityQuadtree _entityQuadtree = null!;
    private readonly List<Entity> _entityQueryResults = new();
    private readonly List<Rectangle> _quadtreeDebugBounds = new();
    private Rectangle _quadtreeToggleButtonBounds;
    private bool _showQuadtree;

    private TownManager _townManager = null!;
    private TownRenderer _townRenderer = null!;

    private KingdomManager _kingdomManager = null!;

    private RaceType _currentRace = RaceType.Human;

    private Hud _hud = null!;

    private ToolMode _toolMode = ToolMode.Spawn;

    private readonly Random _random = new();

    private SpriteFont _font = null!;
    private Texture2D _uiPixel = null!;

    private sealed class ToolButton
    {
        public Rectangle Bounds;
        public ToolMode Mode;
        public string Label = string.Empty;
    }

    private sealed class RaceButton
    {
        public Rectangle Bounds;
        public RaceType Race;
        public string Label = string.Empty;
    }

    private readonly List<ToolButton> _toolButtons = new();
    private readonly List<RaceButton> _raceButtons = new();

    private readonly List<SettlementSite> _settlementSites = new();

    private Town? _selectedTown;
    private Entity? _selectedEntity;

    private Vector2 _cameraPosition;
    private float _cameraZoom = 1f;
    private const float MinCameraZoom = 0.5f;
    private const float MaxCameraZoom = 3f;

    private KeyboardState _previousKeyboard;

    private const int TileSize = 8;

    public Game1()
    {
        _graphics = new GraphicsDeviceManager(this);
        Content.RootDirectory = "Content";
        IsMouseVisible = true;
    }

    protected override void Initialize()
    {
        _graphics.PreferredBackBufferWidth = 1280;
        _graphics.PreferredBackBufferHeight = 720;
        _graphics.ApplyChanges();

        var tilesX = _graphics.PreferredBackBufferWidth / TileSize;
        var tilesY = _graphics.PreferredBackBufferHeight / TileSize;

        _worldManager = new WorldManager(tilesX, tilesY);
        _inputManager = new InputManager();
        _townManager = new TownManager();
        _kingdomManager = new KingdomManager();

        var worldPixelWidth = tilesX * TileSize;
        var worldPixelHeight = tilesY * TileSize;
        var worldBounds = new Rectangle(0, 0, worldPixelWidth, worldPixelHeight);
        _entityQuadtree = new EntityQuadtree(worldBounds);

        _cameraPosition = Vector2.Zero;
        _cameraZoom = 1f;

        base.Initialize();
    }

    protected override void LoadContent()
    {
        _spriteBatch = new SpriteBatch(GraphicsDevice);

        _worldRenderer = new WorldRenderer(_worldManager, GraphicsDevice, TileSize);
        _entityRenderer = new EntityRenderer(GraphicsDevice);
        _townRenderer = new TownRenderer(GraphicsDevice);

        _font = Content.Load<SpriteFont>("Fonts/Default");
        _hud = new Hud(_font);

        _uiPixel = new Texture2D(GraphicsDevice, 1, 1);
        _uiPixel.SetData(new[] { Color.White });

        CreateRaceButtons();
        CreateToolButtons();

        _quadtreeToggleButtonBounds = new Rectangle(8, 60, 96, 24);

        // Load entity textures for races that have custom sprites.
        TryLoadEntityTexture("Human.png", RaceType.Human);
        TryLoadEntityTexture("Orc.png", RaceType.Orc);

    }

    protected override void Update(GameTime gameTime)
    {
        var delta = (float)gameTime.ElapsedGameTime.TotalSeconds;

        if (GamePad.GetState(PlayerIndex.One).Buttons.Back == ButtonState.Pressed || Keyboard.GetState().IsKeyDown(Keys.Escape))
        {
            Exit();
        }

        _inputManager.Update();

        var keyboard = Keyboard.GetState();
        if (keyboard.IsKeyDown(Keys.D1)) _currentRace = RaceType.Human;
        if (keyboard.IsKeyDown(Keys.D2)) _currentRace = RaceType.Orc;
        if (keyboard.IsKeyDown(Keys.D3)) _currentRace = RaceType.Elf;
        if (keyboard.IsKeyDown(Keys.D4)) _currentRace = RaceType.Dwarf;

        if (keyboard.IsKeyDown(Keys.Z)) _toolMode = ToolMode.Spawn;
        if (keyboard.IsKeyDown(Keys.X)) _toolMode = ToolMode.RaiseLand;
        if (keyboard.IsKeyDown(Keys.C)) _toolMode = ToolMode.LowerLand;
        if (keyboard.IsKeyDown(Keys.V)) _toolMode = ToolMode.Lightning;
        if (keyboard.IsKeyDown(Keys.B)) _toolMode = ToolMode.Inspect;

        // Camera zoom controls (Q = zoom in, E = zoom out).
        const float zoomSpeed = 1.0f;
        if (keyboard.IsKeyDown(Keys.Q))
        {
            _cameraZoom += zoomSpeed * delta;
        }
        if (keyboard.IsKeyDown(Keys.E))
        {
            _cameraZoom -= zoomSpeed * delta;
        }
        _cameraZoom = MathHelper.Clamp(_cameraZoom, MinCameraZoom, MaxCameraZoom);

        // Camera movement with arrow keys.
        var camMoveDir = Vector2.Zero;
        if (keyboard.IsKeyDown(Keys.Left)) camMoveDir.X -= 1f;
        if (keyboard.IsKeyDown(Keys.Right)) camMoveDir.X += 1f;
        if (keyboard.IsKeyDown(Keys.Up)) camMoveDir.Y -= 1f;
        if (keyboard.IsKeyDown(Keys.Down)) camMoveDir.Y += 1f;

        if (camMoveDir != Vector2.Zero)
        {
            camMoveDir.Normalize();
            var camSpeed = 400f / _cameraZoom;
            _cameraPosition += camMoveDir * camSpeed * delta;
        }

        // Clamp camera to world bounds.
        var worldWidthPixels = _worldManager.Width * TileSize;
        var worldHeightPixels = _worldManager.Height * TileSize;
        var viewWidthWorld = GraphicsDevice.Viewport.Width / _cameraZoom;
        var viewHeightWorld = GraphicsDevice.Viewport.Height / _cameraZoom;
        var maxCamX = Math.Max(0f, worldWidthPixels - viewWidthWorld);
        var maxCamY = Math.Max(0f, worldHeightPixels - viewHeightWorld);
        _cameraPosition.X = MathHelper.Clamp(_cameraPosition.X, 0f, maxCamX);
        _cameraPosition.Y = MathHelper.Clamp(_cameraPosition.Y, 0f, maxCamY);

        // Toggle fullscreen with F11 on key press.
        if (keyboard.IsKeyDown(Keys.F11) && !_previousKeyboard.IsKeyDown(Keys.F11))
        {
            _graphics.ToggleFullScreen();
        }

        var mousePos = _inputManager.MousePosition;
        var mouseWorld = ScreenToWorld(mousePos);

        if (_inputManager.LeftClicked)
        {
            if (TryClickRaceBar(mousePos) || TryClickToolbar(mousePos))
            {
                // UI click consumed, don't also apply world tool this frame.
            }
            else
            {
                switch (_toolMode)
                {
                    case ToolMode.Spawn:
                        _entities.Add(new Entity(mouseWorld, _currentRace));
                        break;
                    case ToolMode.RaiseLand:
                        ApplyRaiseLowerLand(mouseWorld, true);
                        break;
                    case ToolMode.LowerLand:
                        ApplyRaiseLowerLand(mouseWorld, false);
                        break;
                    case ToolMode.Lightning:
                        ApplyLightning(mouseWorld);
                        break;
                    case ToolMode.Inspect:
                        ApplyInspect(mouseWorld);
                        break;
                }
            }
        }

        if (_inputManager.RightClicked && _toolMode == ToolMode.Spawn)
        {
            var tileX = (int)(mouseWorld.X / TileSize);
            var tileY = (int)(mouseWorld.Y / TileSize);

            if (tileX >= 0 && tileX < _worldManager.Width && tileY >= 0 && tileY < _worldManager.Height)
            {
                var tile = _worldManager.Tiles[tileX, tileY];
                if (tile.Terrain == TerrainType.Grass)
                {
                    var townPos = new Vector2((tileX + 0.5f) * TileSize, (tileY + 0.5f) * TileSize);
                    var town = new Town(townPos, _currentRace, initialPopulation: 5);
                    _townManager.AddTown(town);
                    _kingdomManager.AssignTownToKingdom(town);
                }
            }
        }

        _worldManager.Update(gameTime);
        _townManager.Update(gameTime);

        // Use index-based loops with a cached count so new towns
        // added during this frame don't invalidate enumeration.
        var townCount = _townManager.Towns.Count;
        for (var i = 0; i < townCount; i++)
        {
            var town = _townManager.Towns[i];
            if (town.TryDequeueSpawnPosition(out var spawnPosition))
            {
                _entities.Add(new Entity(spawnPosition, town.Race));
            }
        }

        townCount = _townManager.Towns.Count;
        for (var i = 0; i < townCount; i++)
        {
            var town = _townManager.Towns[i];
            if (town.TryDequeueColonizationRequest(out var basePosition))
            {
                TryCreateSettlementSiteNear(town, basePosition);
            }
        }

        RebuildEntityQuadtree();

        ResolveCombat();

        UpdateEntityBehaviors(gameTime);

        // Convert completed settlement sites into fully founded towns.
        for (var i = _settlementSites.Count - 1; i >= 0; i--)
        {
            var site = _settlementSites[i];
            if (!site.IsComplete)
            {
                continue;
            }

            var newTown = new Town(site.Position, site.Race, initialPopulation: 4);
            _townManager.AddTown(newTown);
            _kingdomManager.AssignTownToKingdom(newTown);
            _settlementSites.RemoveAt(i);
        }

        base.Update(gameTime);

        _previousKeyboard = keyboard;
    }

    protected override void Draw(GameTime gameTime)
    {
        GraphicsDevice.Clear(Color.CornflowerBlue);

        var cameraTransform = Matrix.CreateTranslation(-_cameraPosition.X, -_cameraPosition.Y, 0f) *
                              Matrix.CreateScale(_cameraZoom, _cameraZoom, 1f);

        // World rendering with camera transform.
        _spriteBatch.Begin(samplerState: SamplerState.PointClamp, transformMatrix: cameraTransform);
        _worldRenderer.Draw(_spriteBatch);
        _townRenderer.Draw(_spriteBatch, _townManager);
        DrawSettlementSites();
        _entityRenderer.Draw(_spriteBatch, _entities);
        if (_showQuadtree)
        {
            DrawQuadtreeDebug();
        }
        _spriteBatch.End();

        // UI rendering in screen space.
        _spriteBatch.Begin(samplerState: SamplerState.PointClamp);
        DrawRaceBar();
        DrawToolbar();
        _hud.Draw(_spriteBatch, _currentRace, _townManager, _entities.Count, _toolMode, _kingdomManager.Kingdoms.Count, _selectedTown, _selectedEntity);
        _spriteBatch.End();

        base.Draw(gameTime);
    }

    private void ApplyRaiseLowerLand(Vector2 worldPosition, bool raise)
    {
        var tileX = (int)(worldPosition.X / TileSize);
        var tileY = (int)(worldPosition.Y / TileSize);

        if (tileX < 0 || tileX >= _worldManager.Width || tileY < 0 || tileY >= _worldManager.Height)
        {
            return;
        }

        var tile = _worldManager.Tiles[tileX, tileY];

        if (raise)
        {
            tile.Terrain = tile.Terrain switch
            {
                TerrainType.Water => TerrainType.Grass,
                TerrainType.Grass => TerrainType.Mountain,
                _ => tile.Terrain
            };
        }
        else
        {
            tile.Terrain = tile.Terrain switch
            {
                TerrainType.Mountain => TerrainType.Grass,
                TerrainType.Grass => TerrainType.Water,
                _ => tile.Terrain
            };
        }
    }

    private void ApplyLightning(Vector2 position)
    {
        const float radius = 24f;
        var radiusSq = radius * radius;

        _entities.RemoveAll(e => Vector2.DistanceSquared(e.Position, position) <= radiusSq);
    }

    private void ResolveCombat()
    {
        const float attackRadius = 10f;
        var attackRadiusSq = attackRadius * attackRadius;

        for (var i = 0; i < _entities.Count; i++)
        {
            var attacker = _entities[i];

            if (!attacker.CanAttack || attacker.Health <= 0f)
            {
                continue;
            }

            Entity? bestTarget = null;
            var bestTargetDistSq = attackRadiusSq;
            var bestTargetHealth = float.MaxValue;

            Town? bestEnemyTown = null;
            var bestEnemyTownDistSq = attackRadiusSq;

            _entityQueryResults.Clear();

            var queryRect = new Rectangle(
                (int)(attacker.Position.X - attackRadius),
                (int)(attacker.Position.Y - attackRadius),
                (int)(attackRadius * 2f),
                (int)(attackRadius * 2f));

            _entityQuadtree.QueryRange(queryRect, _entityQueryResults);

            foreach (var candidate in _entityQueryResults)
            {
                if (ReferenceEquals(candidate, attacker))
                {
                    continue;
                }

                if (candidate.Race == attacker.Race || candidate.Health <= 0f)
                {
                    continue;
                }

                var distSq = Vector2.DistanceSquared(attacker.Position, candidate.Position);
                if (distSq > attackRadiusSq)
                {
                    continue;
                }

                if (distSq < bestTargetDistSq || (Math.Abs(distSq - bestTargetDistSq) < 0.01f && candidate.Health < bestTargetHealth))
                {
                    bestTargetDistSq = distSq;
                    bestTargetHealth = candidate.Health;
                    bestTarget = candidate;
                }
            }
            // If no enemy unit in range, try to damage an enemy town
            // within the same attack radius.
            if (bestTarget == null)
            {
                foreach (var town in _townManager.Towns)
                {
                    if (town.Race == attacker.Race || town.IsDestroyed)
                    {
                        continue;
                    }

                    var distSq = Vector2.DistanceSquared(attacker.Position, town.Position);
                    if (distSq > attackRadiusSq)
                    {
                        continue;
                    }

                    if (distSq < bestEnemyTownDistSq)
                    {
                        bestEnemyTownDistSq = distSq;
                        bestEnemyTown = town;
                    }
                }
            }

            if (bestTarget != null)
            {
                bestTarget.ApplyDamage(attacker.Damage);
                attacker.OnAttack();
            }
            else if (bestEnemyTown != null)
            {
                bestEnemyTown.ApplyDamage(attacker.Damage);
                attacker.OnAttack();
            }
        }

        _entities.RemoveAll(e => e.Health <= 0f);

        // Handle town destruction and resource salvage.
        for (var i = _townManager.Towns.Count - 1; i >= 0; i--)
        {
            var town = _townManager.Towns[i];
            if (!town.IsDestroyed)
            {
                continue;
            }

            // Find nearest surviving town of a different race to receive loot.
            Town? lootTarget = null;
            var bestDistSq = float.MaxValue;
            foreach (var other in _townManager.Towns)
            {
                if (other == town || other.IsDestroyed)
                {
                    continue;
                }

                if (other.Race == town.Race)
                {
                    continue;
                }

                var distSq = Vector2.DistanceSquared(other.Position, town.Position);
                if (distSq < bestDistSq)
                {
                    bestDistSq = distSq;
                    lootTarget = other;
                }
            }

            if (lootTarget != null)
            {
                town.TransferAllResourcesTo(lootTarget);
            }

            _kingdomManager.RemoveTown(town);
            _townManager.RemoveTown(town);
        }
    }

    private void ApplyInspect(Vector2 mouseWorld)
    {
        const float maxSelectDistance = 32f;
        var maxSelectDistanceSq = maxSelectDistance * maxSelectDistance;

        Town? bestTown = null;
        var bestTownDistSq = maxSelectDistanceSq;

        foreach (var town in _townManager.Towns)
        {
            var distSq = Vector2.DistanceSquared(mouseWorld, town.Position);
            if (distSq < bestTownDistSq)
            {
                bestTownDistSq = distSq;
                bestTown = town;
            }
        }

        Entity? bestEntity = null;
        var bestEntityDistSq = maxSelectDistanceSq;

        foreach (var entity in _entities)
        {
            var distSq = Vector2.DistanceSquared(mouseWorld, entity.Position);
            if (distSq < bestEntityDistSq)
            {
                bestEntityDistSq = distSq;
                bestEntity = entity;
            }
        }

        _selectedTown = bestTown;
        _selectedEntity = bestEntity;
    }

    private void TryCreateSettlementSiteNear(Town parentTown, Vector2 basePosition)
    {
        const int attempts = 8;
        const float minDistance = 80f;
        const float maxDistance = 200f;

        for (var i = 0; i < attempts; i++)
        {
            var angle = (float)(_random.NextDouble() * Math.PI * 2.0);
            var t = (float)_random.NextDouble();
            var distance = minDistance + t * (maxDistance - minDistance);

            var offset = new Vector2((float)Math.Cos(angle), (float)Math.Sin(angle)) * distance;
            var worldPos = basePosition + offset;

            var tileX = (int)(worldPos.X / TileSize);
            var tileY = (int)(worldPos.Y / TileSize);

            if (tileX < 0 || tileX >= _worldManager.Width || tileY < 0 || tileY >= _worldManager.Height)
            {
                continue;
            }

            var tile = _worldManager.Tiles[tileX, tileY];
            if (tile.Terrain != TerrainType.Grass)
            {
                continue;
            }

            var townPos = new Vector2((tileX + 0.5f) * TileSize, (tileY + 0.5f) * TileSize);
            var site = new SettlementSite(townPos, parentTown.Race);
            _settlementSites.Add(site);

            SpawnBuildersForSettlement(parentTown, site, 3);
            return;
        }
    }

    private void RebuildEntityQuadtree()
    {
        _entityQuadtree.Clear();

        for (var i = 0; i < _entities.Count; i++)
        {
            var entity = _entities[i];
            if (entity.Health <= 0f)
            {
                continue;
            }

            _entityQuadtree.Insert(entity);
        }
    }

    private void TryLoadEntityTexture(string fileName, RaceType race)
    {
        try
        {
            // Try a few likely locations relative to the executable so
            // textures keep working even if the working directory changes.
            var baseDir = AppContext.BaseDirectory;

            string[] candidatePaths =
            {
                Path.Combine(baseDir, "Assets", fileName),
                Path.Combine(baseDir, "..", "Assets", fileName),
                Path.Combine(baseDir, "..", "..", "Assets", fileName),
                Path.Combine(baseDir, "..", "..", "..", "Assets", fileName)
            };

            string? existing = null;
            foreach (var candidate in candidatePaths)
            {
                if (File.Exists(candidate))
                {
                    existing = candidate;
                    break;
                }
            }

            if (existing == null)
            {
                return;
            }

            using var stream = File.OpenRead(existing);
            var texture = Texture2D.FromStream(GraphicsDevice, stream);
            _entityRenderer.SetRaceTexture(race, texture);
        }
        catch
        {
            // Ignore texture load failures; units will fall back to colored squares.
        }
    }

    private Vector2 ScreenToWorld(Point screenPoint)
    {
        // Inverse of the camera transform used for world rendering.
        return _cameraPosition + screenPoint.ToVector2() / _cameraZoom;
    }

    private void UpdateEntityBehaviors(GameTime gameTime)
    {
        const float chaseRadius = 96f;
        var chaseRadiusSq = chaseRadius * chaseRadius;

        const float visionRadius = 140f;
        var visionRadiusSq = visionRadius * visionRadius;

        const float lowHealthThreshold = 3f;
        const float fleeDuration = 0.8f;
        const float chaseDuration = 0.4f;

        const float maxTownDistance = 220f;
        var maxTownDistanceSq = maxTownDistance * maxTownDistance;

        const float supportRadius = 64f;
        var supportRadiusSq = supportRadius * supportRadius;

        const float healRadius = 32f;
        var healRadiusSq = healRadius * healRadius;

        for (var i = 0; i < _entities.Count; i++)
        {
            var entity = _entities[i];

            SettlementSite? nearestSite = null;
            var nearestSiteDistSq = float.MaxValue;

            foreach (var site in _settlementSites)
            {
                if (site.Race != entity.Race || site.IsComplete)
                {
                    continue;
                }

                var distSqToSite = Vector2.DistanceSquared(entity.Position, site.Position);
                if (distSqToSite < nearestSiteDistSq)
                {
                    nearestSiteDistSq = distSqToSite;
                    nearestSite = site;
                }
            }

            Entity? nearestEnemy = null;
            var nearestEnemyDistSq = visionRadiusSq;

            var nearbyFriendCount = 0;
            var nearbyEnemyCount = 0;

            _entityQueryResults.Clear();

            var neighborRect = new Rectangle(
                (int)(entity.Position.X - visionRadius),
                (int)(entity.Position.Y - visionRadius),
                (int)(visionRadius * 2f),
                (int)(visionRadius * 2f));

            _entityQuadtree.QueryRange(neighborRect, _entityQueryResults);

            foreach (var other in _entityQueryResults)
            {
                if (ReferenceEquals(other, entity) || other.Health <= 0f)
                {
                    continue;
                }

                var distSq = Vector2.DistanceSquared(entity.Position, other.Position);

                if (other.Race == entity.Race)
                {
                    if (distSq <= supportRadiusSq)
                    {
                        nearbyFriendCount++;
                    }
                }
                else
                {
                    if (distSq < nearestEnemyDistSq)
                    {
                        nearestEnemyDistSq = distSq;
                        nearestEnemy = other;
                    }

                    if (distSq <= supportRadiusSq)
                    {
                        nearbyEnemyCount++;
                    }
                }
            }

            Town? nearestFriendlyTown = null;
            var nearestTownDistSq = maxTownDistanceSq;

            foreach (var town in _townManager.Towns)
            {
                if (town.Race != entity.Race)
                {
                    continue;
                }

                var distSq = Vector2.DistanceSquared(entity.Position, town.Position);
                if (distSq < nearestTownDistSq)
                {
                    nearestTownDistSq = distSq;
                    nearestFriendlyTown = town;
                }
            }

            var outnumbered = nearbyEnemyCount > nearbyFriendCount + 1;

            // Low energy units prefer to head back to town to rest.
            if (nearestFriendlyTown != null && entity.EnergyRatio < 0.25f && nearestEnemy == null)
            {
                var restDir = nearestFriendlyTown.Position - entity.Position;
                entity.SetDirectedMovement(restDir, chaseDuration);
            }

            // Healing and resting at town if close to a friendly town with food.
            // Only consume food when the unit is meaningfully low on health
            // or energy, so that towns can stack food for reproduction.
            if (nearestFriendlyTown != null && nearestTownDistSq <= healRadiusSq && nearestFriendlyTown.Food > 0 && entity.CanDoResourceAction)
            {
                var healthRatio = entity.MaxHealth > 0f ? entity.Health / entity.MaxHealth : 1f;
                var needsHeal = healthRatio < 0.7f;
                var needsEnergy = entity.EnergyRatio < 0.4f;

                if (needsHeal || needsEnergy)
                {
                    if (nearestFriendlyTown.TryConsumeFood(1))
                    {
                        if (needsHeal)
                        {
                            entity.Heal(8f);
                        }

                        if (needsEnergy)
                        {
                            entity.RegenerateEnergy(40f);
                        }

                        entity.OnResourceAction(2f);
                    }
                }
            }

            if (entity.Health <= lowHealthThreshold && nearestEnemy != null && nearestEnemyDistSq <= visionRadiusSq)
            {
                var fleeDir = entity.Position - nearestEnemy.Position;
                entity.SetDirectedMovement(fleeDir, fleeDuration);
            }
            else if (nearestEnemy != null && nearestEnemyDistSq <= chaseRadiusSq && !outnumbered)
            {
                var chaseDir = nearestEnemy.Position - entity.Position;
                entity.SetDirectedMovement(chaseDir, chaseDuration);
            }
            else if (nearestFriendlyTown != null && (nearestTownDistSq > maxTownDistanceSq * 0.5f || outnumbered))
            {
                var homeDir = nearestFriendlyTown.Position - entity.Position;
                entity.SetDirectedMovement(homeDir, chaseDuration);
            }

            // Gathering and hauling: if safe and near a friendly town, units will
            // walk out to resource tiles, pick up resources, then walk back and
            // deposit them into town storage. Some units may instead haul
            // construction materials from town to nearby settlement sites.
            if (nearestFriendlyTown != null && nearestEnemy == null)
            {
                // If carrying construction materials, prioritize heading to a
                // settlement site and contributing progress there.
                if (entity.IsCarryingResource && entity.CarryingForConstruction && nearestSite != null)
                {
                    if (nearestSiteDistSq <= healRadiusSq && entity.CanDoResourceAction)
                    {
                        var amount = entity.DropResource();
                        if (amount > 0)
                        {
                            nearestSite.AddBuildUnits(amount);
                            entity.OnResourceAction(2f);
                            nearestSite.ReleaseBuilder();
                        }
                    }
                    else
                    {
                        var toSite = nearestSite.Position - entity.Position;
                        entity.SetDirectedMovement(toSite, chaseDuration * 2f);
                    }
                }
                // Deposit harvested resources back into the town.
                else if (entity.IsCarryingResource)
                {
                    if (nearestTownDistSq <= healRadiusSq && entity.CanDoResourceAction)
                    {
                        var type = entity.CarriedResource;
                        var amount = entity.DropResource();
                        if (amount > 0 && type != ResourceType.None)
                        {
                            nearestFriendlyTown.AddResource(type, amount);
                            entity.OnResourceAction(2f);
                        }
                    }
                    else
                    {
                        // Head back toward town with carried resources.
                        var toTown = nearestFriendlyTown.Position - entity.Position;
                        entity.SetDirectedMovement(toTown, chaseDuration);
                    }
                }
                else if (entity.CanDoResourceAction)
                {
                    // If there is a nearby settlement site and we are close to the town,
                    // pick up some construction material from town storage and walk it out.
                    if (nearestSite != null && nearestTownDistSq <= healRadiusSq && nearestFriendlyTown.Food + nearestFriendlyTown.Wood + nearestFriendlyTown.Stone > 0)
                    {
                        if (nearestSite.TryReserveBuilder())
                        {
                            if (entity.TryPickUpConstruction(ResourceType.Rock, 1))
                            {
                                // Consume a generic unit of material; we don't distinguish
                                // types here for simplicity.
                                if (nearestFriendlyTown.Wood > 0)
                                {
                                    nearestFriendlyTown.ConsumeWood(1);
                                }
                                else if (nearestFriendlyTown.Stone > 0)
                                {
                                    nearestFriendlyTown.ConsumeStone(1);
                                }
                                else if (nearestFriendlyTown.Food > 0)
                                {
                                    nearestFriendlyTown.TryConsumeFood(1);
                                }

                                var toSite = nearestSite.Position - entity.Position;
                                entity.SetDirectedMovement(toSite, chaseDuration * 2f);
                                entity.OnResourceAction(3f);
                            }
                            else
                            {
                                // Failed to pick up construction; free the reservation.
                                nearestSite.ReleaseBuilder();
                            }
                        }
                    }
                    else
                    {
                        // Harvester role: gather from tiles near town and bring back.
                        var tileX = (int)(entity.Position.X / TileSize);
                        var tileY = (int)(entity.Position.Y / TileSize);

                        var onResource = false;
                        if (tileX >= 0 && tileX < _worldManager.Width && tileY >= 0 && tileY < _worldManager.Height)
                        {
                            var tile = _worldManager.Tiles[tileX, tileY];
                            if (tile.Resource != ResourceType.None && tile.ResourceAmount > 0)
                            {
                                // Pick up from the current tile.
                                if (entity.TryPickUpResource(tile.Resource, 1))
                                {
                                    tile.ResourceAmount -= 1;
                                    if (tile.ResourceAmount <= 0)
                                    {
                                        tile.Resource = ResourceType.None;
                                    }

                                    entity.OnResourceAction(3f);
                                    onResource = true;
                                }
                            }
                        }

                        // If we're near town and not already standing on a resource,
                        // walk out toward a nearby resource patch.
                        if (!onResource && nearestTownDistSq <= healRadiusSq)
                        {
                            if (TryFindNearbyResourceAroundTown(nearestFriendlyTown, out var targetWorldPos))
                            {
                                var toRes = targetWorldPos - entity.Position;
                                entity.SetDirectedMovement(toRes, chaseDuration * 2f);
                            }
                        }
                    }
                }
            }
        }

        foreach (var entity in _entities)
        {
            entity.Update(gameTime);
            entity.Position = Vector2.Clamp(
                entity.Position,
                Vector2.Zero,
                new Vector2(_graphics.PreferredBackBufferWidth - 1, _graphics.PreferredBackBufferHeight - 1));
        }
    }

    private void SpawnBuildersForSettlement(Town parentTown, SettlementSite site, int count)
    {
        for (var i = 0; i < count; i++)
        {
            if (!site.TryReserveBuilder())
            {
                break;
            }

            var builder = new Entity(parentTown.Position, parentTown.Race);

            // Mark as carrying construction material so AI will route them toward the site.
            builder.TryPickUpConstruction(ResourceType.Rock, 1);
            var toSite = site.Position - builder.Position;
            builder.SetDirectedMovement(toSite, 1.5f);

            _entities.Add(builder);
        }
    }

    private bool TryFindNearbyResourceAroundTown(Town town, out Vector2 worldPosition)
    {
        const int searchRadiusTiles = 20;

        var tileCenterX = (int)(town.Position.X / TileSize);
        var tileCenterY = (int)(town.Position.Y / TileSize);

        var bestDistSq = float.MaxValue;
        var found = false;
        worldPosition = town.Position;

        for (var dx = -searchRadiusTiles; dx <= searchRadiusTiles; dx++)
        {
            var tx = tileCenterX + dx;
            if (tx < 0 || tx >= _worldManager.Width)
            {
                continue;
            }

            for (var dy = -searchRadiusTiles; dy <= searchRadiusTiles; dy++)
            {
                var ty = tileCenterY + dy;
                if (ty < 0 || ty >= _worldManager.Height)
                {
                    continue;
                }

                var tile = _worldManager.Tiles[tx, ty];
                if (tile.Resource == ResourceType.None || tile.ResourceAmount <= 0)
                {
                    continue;
                }

                var worldPos = new Vector2((tx + 0.5f) * TileSize, (ty + 0.5f) * TileSize);
                var distSq = Vector2.DistanceSquared(worldPos, town.Position);
                if (distSq < bestDistSq)
                {
                    bestDistSq = distSq;
                    worldPosition = worldPos;
                    found = true;
                }
            }
        }

        return found;
    }

    private void CreateToolButtons()
    {
        _toolButtons.Clear();

        var x = 8;
        const int y = 32;
        const int width = 96;
        const int height = 24;
        const int gap = 4;

        void AddButton(ToolMode mode, string label)
        {
            _toolButtons.Add(new ToolButton
            {
                Mode = mode,
                Label = label,
                Bounds = new Rectangle(x, y, width, height)
            });
            x += width + gap;
        }

        AddButton(ToolMode.Spawn, "Spawn");
        AddButton(ToolMode.RaiseLand, "Raise");
        AddButton(ToolMode.LowerLand, "Lower");
        AddButton(ToolMode.Lightning, "Lightning");
        AddButton(ToolMode.Inspect, "Inspect");
    }

    private void CreateRaceButtons()
    {
        _raceButtons.Clear();

        var x = 8;
        const int y = 4;
        const int width = 80;
        const int height = 24;
        const int gap = 4;

        void AddButton(RaceType race, string label)
        {
            _raceButtons.Add(new RaceButton
            {
                Race = race,
                Label = label,
                Bounds = new Rectangle(x, y, width, height)
            });
            x += width + gap;
        }

        AddButton(RaceType.Human, "Human");
        AddButton(RaceType.Orc, "Orc");
        AddButton(RaceType.Elf, "Elf");
        AddButton(RaceType.Dwarf, "Dwarf");
    }

    private void DrawToolbar()
    {
        foreach (var button in _toolButtons)
        {
            var isSelected = button.Mode == _toolMode;
            var bgColor = isSelected ? new Color(80, 130, 220, 230) : new Color(30, 30, 40, 200);
            var borderColor = new Color(10, 10, 15, 255);

            // Background
            _spriteBatch.Draw(_uiPixel, button.Bounds, bgColor);

            // Border
            var b = button.Bounds;
            // Top
            _spriteBatch.Draw(_uiPixel, new Rectangle(b.X, b.Y, b.Width, 1), borderColor);
            // Bottom
            _spriteBatch.Draw(_uiPixel, new Rectangle(b.X, b.Bottom - 1, b.Width, 1), borderColor);
            // Left
            _spriteBatch.Draw(_uiPixel, new Rectangle(b.X, b.Y, 1, b.Height), borderColor);
            // Right
            _spriteBatch.Draw(_uiPixel, new Rectangle(b.Right - 1, b.Y, 1, b.Height), borderColor);

            // Label centered
            var size = _font.MeasureString(button.Label);
            var textPos = new Vector2(
                b.X + (b.Width - size.X) * 0.5f,
                b.Y + (b.Height - size.Y) * 0.5f);

            _spriteBatch.DrawString(_font, button.Label, textPos + new Vector2(1, 1), Color.Black * 0.7f);
            _spriteBatch.DrawString(_font, button.Label, textPos, Color.White);
        }

        // Quadtree debug toggle button
        var dbgBounds = _quadtreeToggleButtonBounds;
        var dbgSelected = _showQuadtree;
        var dbgBgColor = dbgSelected ? new Color(80, 130, 220, 220) : new Color(30, 30, 40, 180);
        var dbgBorderColor = new Color(10, 10, 15, 255);

        _spriteBatch.Draw(_uiPixel, dbgBounds, dbgBgColor);

        _spriteBatch.Draw(_uiPixel, new Rectangle(dbgBounds.X, dbgBounds.Y, dbgBounds.Width, 1), dbgBorderColor);
        _spriteBatch.Draw(_uiPixel, new Rectangle(dbgBounds.X, dbgBounds.Bottom - 1, dbgBounds.Width, 1), dbgBorderColor);
        _spriteBatch.Draw(_uiPixel, new Rectangle(dbgBounds.X, dbgBounds.Y, 1, dbgBounds.Height), dbgBorderColor);
        _spriteBatch.Draw(_uiPixel, new Rectangle(dbgBounds.Right - 1, dbgBounds.Y, 1, dbgBounds.Height), dbgBorderColor);

        const string dbgLabel = "Tree Grid";
        var dbgSize = _font.MeasureString(dbgLabel);
        var dbgTextPos = new Vector2(
            dbgBounds.X + (dbgBounds.Width - dbgSize.X) * 0.5f,
            dbgBounds.Y + (dbgBounds.Height - dbgSize.Y) * 0.5f);

        _spriteBatch.DrawString(_font, dbgLabel, dbgTextPos + new Vector2(1, 1), Color.Black * 0.7f);
        _spriteBatch.DrawString(_font, dbgLabel, dbgTextPos, Color.White);
    }

    private void DrawRaceBar()
    {
        foreach (var button in _raceButtons)
        {
            var isSelected = button.Race == _currentRace;
            var bgColor = isSelected ? new Color(80, 180, 120, 230) : new Color(30, 60, 40, 200);
            var borderColor = new Color(10, 20, 15, 255);

            var b = button.Bounds;

            // Background
            _spriteBatch.Draw(_uiPixel, b, bgColor);

            // Border
            _spriteBatch.Draw(_uiPixel, new Rectangle(b.X, b.Y, b.Width, 1), borderColor);
            _spriteBatch.Draw(_uiPixel, new Rectangle(b.X, b.Bottom - 1, b.Width, 1), borderColor);
            _spriteBatch.Draw(_uiPixel, new Rectangle(b.X, b.Y, 1, b.Height), borderColor);
            _spriteBatch.Draw(_uiPixel, new Rectangle(b.Right - 1, b.Y, 1, b.Height), borderColor);

            // Label centered
            var size = _font.MeasureString(button.Label);
            var textPos = new Vector2(
                b.X + (b.Width - size.X) * 0.5f,
                b.Y + (b.Height - size.Y) * 0.5f);

            _spriteBatch.DrawString(_font, button.Label, textPos + new Vector2(1, 1), Color.Black * 0.7f);
            _spriteBatch.DrawString(_font, button.Label, textPos, Color.White);
        }
    }

    private void DrawSettlementSites()
    {
        foreach (var site in _settlementSites)
        {
            var color = new Color(200, 200, 255, 220);
            var border = new Color(80, 80, 160, 255);

            var rect = new Rectangle((int)site.Position.X - 5, (int)site.Position.Y - 5, 10, 10);
            _spriteBatch.Draw(_uiPixel, rect, color);

            // Simple border
            _spriteBatch.Draw(_uiPixel, new Rectangle(rect.X, rect.Y, rect.Width, 1), border);
            _spriteBatch.Draw(_uiPixel, new Rectangle(rect.X, rect.Bottom - 1, rect.Width, 1), border);
            _spriteBatch.Draw(_uiPixel, new Rectangle(rect.X, rect.Y, 1, rect.Height), border);
            _spriteBatch.Draw(_uiPixel, new Rectangle(rect.Right - 1, rect.Y, 1, rect.Height), border);
        }
    }

    private void DrawQuadtreeDebug()
    {
        _quadtreeDebugBounds.Clear();
        _entityQuadtree.CollectNodeBounds(_quadtreeDebugBounds);

        var borderColor = new Color(0, 220, 0, 160);

        foreach (var rect in _quadtreeDebugBounds)
        {
            // Draw only the borders of each quadtree node to visualize the grid.
            _spriteBatch.Draw(_uiPixel, new Rectangle(rect.X, rect.Y, rect.Width, 1), borderColor);
            _spriteBatch.Draw(_uiPixel, new Rectangle(rect.X, rect.Bottom - 1, rect.Width, 1), borderColor);
            _spriteBatch.Draw(_uiPixel, new Rectangle(rect.X, rect.Y, 1, rect.Height), borderColor);
            _spriteBatch.Draw(_uiPixel, new Rectangle(rect.Right - 1, rect.Y, 1, rect.Height), borderColor);
        }
    }

    private bool TryClickToolbar(Point mousePosition)
    {
        foreach (var button in _toolButtons)
        {
            if (button.Bounds.Contains(mousePosition))
            {
                _toolMode = button.Mode;
                return true;
            }
        }

        if (_quadtreeToggleButtonBounds.Contains(mousePosition))
        {
            _showQuadtree = !_showQuadtree;
            return true;
        }

        return false;
    }

    private bool TryClickRaceBar(Point mousePosition)
    {
        foreach (var button in _raceButtons)
        {
            if (button.Bounds.Contains(mousePosition))
            {
                _currentRace = button.Race;
                return true;
            }
        }

        return false;
    }
}

