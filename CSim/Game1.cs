using System;
using System.Collections.Generic;
using CSim.Civilizations;
using CSim.Entities;
using CSim.Input;
using CSim.Powers;
using CSim.Rendering;
using CSim.UI;
using CSim.World;
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

    private TownManager _townManager = null!;
    private TownRenderer _townRenderer = null!;

    private KingdomManager _kingdomManager = null!;

    private RaceType _currentRace = RaceType.Human;

    private Hud _hud = null!;

    private ToolMode _toolMode = ToolMode.Spawn;

    private readonly Random _random = new();

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

        base.Initialize();
    }

    protected override void LoadContent()
    {
        _spriteBatch = new SpriteBatch(GraphicsDevice);

        _worldRenderer = new WorldRenderer(_worldManager, GraphicsDevice, TileSize);
        _entityRenderer = new EntityRenderer(GraphicsDevice);
        _townRenderer = new TownRenderer(GraphicsDevice);

        var font = Content.Load<SpriteFont>("Fonts/Default");
        _hud = new Hud(font);

    }

    protected override void Update(GameTime gameTime)
    {
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

        if (_inputManager.LeftClicked)
        {
            switch (_toolMode)
            {
                case ToolMode.Spawn:
                    _entities.Add(new Entity(_inputManager.MousePosition.ToVector2(), _currentRace));
                    break;
                case ToolMode.RaiseLand:
                    ApplyRaiseLowerLand(_inputManager.MousePosition, true);
                    break;
                case ToolMode.LowerLand:
                    ApplyRaiseLowerLand(_inputManager.MousePosition, false);
                    break;
                case ToolMode.Lightning:
                    ApplyLightning(_inputManager.MousePosition.ToVector2());
                    break;
            }
        }

        if (_inputManager.RightClicked && _toolMode == ToolMode.Spawn)
        {
            var tileX = _inputManager.MousePosition.X / TileSize;
            var tileY = _inputManager.MousePosition.Y / TileSize;

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
                TryFoundColonyNear(town, basePosition);
            }
        }

        ResolveCombat();

        foreach (var entity in _entities)
        {
            entity.Update(gameTime);
            entity.Position = Vector2.Clamp(
                entity.Position,
                Vector2.Zero,
                new Vector2(_graphics.PreferredBackBufferWidth - 1, _graphics.PreferredBackBufferHeight - 1));
        }

        base.Update(gameTime);
    }

    protected override void Draw(GameTime gameTime)
    {
        GraphicsDevice.Clear(Color.CornflowerBlue);

        _spriteBatch.Begin(samplerState: SamplerState.PointClamp);
        _worldRenderer.Draw(_spriteBatch);
        _townRenderer.Draw(_spriteBatch, _townManager);
        _entityRenderer.Draw(_spriteBatch, _entities);
        _hud.Draw(_spriteBatch, _currentRace, _townManager, _entities.Count, _toolMode, _kingdomManager.Kingdoms.Count);
        _spriteBatch.End();

        base.Draw(gameTime);
    }

    private void ApplyRaiseLowerLand(Point mousePosition, bool raise)
    {
        var tileX = mousePosition.X / TileSize;
        var tileY = mousePosition.Y / TileSize;

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
        const float attackRadius = 8f;
        var attackRadiusSq = attackRadius * attackRadius;

        for (var i = 0; i < _entities.Count; i++)
        {
            var a = _entities[i];
            for (var j = i + 1; j < _entities.Count; j++)
            {
                var b = _entities[j];

                if (a.Race == b.Race)
                {
                    continue;
                }

                if (Vector2.DistanceSquared(a.Position, b.Position) <= attackRadiusSq)
                {
                    a.ApplyDamage(b.Damage);
                    b.ApplyDamage(a.Damage);
                }
            }
        }

        _entities.RemoveAll(e => e.Health <= 0f);
    }

    private void TryFoundColonyNear(Town parentTown, Vector2 basePosition)
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
            var town = new Town(townPos, parentTown.Race, initialPopulation: 4);
            _townManager.AddTown(town);
            _kingdomManager.AssignTownToKingdom(town);
            return;
        }
    }
}

