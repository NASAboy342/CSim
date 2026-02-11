using System.Collections.Generic;
using CSim.Civilizations;
using CSim.Entities;
using CSim.Input;
using CSim.Rendering;
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

    private RaceType _currentRace = RaceType.Human;

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

        base.Initialize();
    }

    protected override void LoadContent()
    {
        _spriteBatch = new SpriteBatch(GraphicsDevice);

        _worldRenderer = new WorldRenderer(_worldManager, GraphicsDevice, TileSize);
        _entityRenderer = new EntityRenderer(GraphicsDevice);
        _townRenderer = new TownRenderer(GraphicsDevice);

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

        if (_inputManager.LeftClicked)
        {
            _entities.Add(new Entity(_inputManager.MousePosition.ToVector2(), _currentRace));
        }

        if (_inputManager.RightClicked)
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
                }
            }
        }

        _worldManager.Update(gameTime);
        _townManager.Update(gameTime);

        foreach (var town in _townManager.Towns)
        {
            if (town.TryDequeueSpawnPosition(out var spawnPosition))
            {
                _entities.Add(new Entity(spawnPosition, town.Race));
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

        base.Update(gameTime);
    }

    protected override void Draw(GameTime gameTime)
    {
        GraphicsDevice.Clear(Color.CornflowerBlue);

        _spriteBatch.Begin(samplerState: SamplerState.PointClamp);
        _worldRenderer.Draw(_spriteBatch);
        _townRenderer.Draw(_spriteBatch, _townManager);
        _entityRenderer.Draw(_spriteBatch, _entities);
        _spriteBatch.End();

        base.Draw(gameTime);
    }
}
