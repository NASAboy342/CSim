using System.Collections.Generic;
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

        base.Initialize();
    }

    protected override void LoadContent()
    {
        _spriteBatch = new SpriteBatch(GraphicsDevice);

        _worldRenderer = new WorldRenderer(_worldManager, GraphicsDevice, TileSize);
        _entityRenderer = new EntityRenderer(GraphicsDevice);

    }

    protected override void Update(GameTime gameTime)
    {
        if (GamePad.GetState(PlayerIndex.One).Buttons.Back == ButtonState.Pressed || Keyboard.GetState().IsKeyDown(Keys.Escape))
        {
            Exit();
        }

        _inputManager.Update();

        if (_inputManager.LeftClicked)
        {
            _entities.Add(new Entity(_inputManager.MousePosition.ToVector2()));
        }

        _worldManager.Update(gameTime);

        foreach (var entity in _entities)
        {
            entity.Update(gameTime);
        }

        base.Update(gameTime);
    }

    protected override void Draw(GameTime gameTime)
    {
        GraphicsDevice.Clear(Color.CornflowerBlue);

        _spriteBatch.Begin(samplerState: SamplerState.PointClamp);
        _worldRenderer.Draw(_spriteBatch);
        _entityRenderer.Draw(_spriteBatch, _entities);
        _spriteBatch.End();

        base.Draw(gameTime);
    }
}
