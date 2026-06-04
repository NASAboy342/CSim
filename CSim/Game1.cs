using System;
using CSim.GameObjects;
using CSim.UI;
using Microsoft.Xna.Framework;
using Microsoft.Xna.Framework.Graphics;
using Microsoft.Xna.Framework.Input;

namespace CSim;

public class Game1 : Game
{
    private GraphicsDeviceManager _graphics;
    private SpriteBatch _spriteBatch;

    private World _world;
    private Camera _camera;
    private Texture2D _pixel;
    private int _fPS = 0;
    private SpriteFont _font;
    private UIToolBar _uiToolBar;
    private UnitSpawner _unitSpawner;

    public Game1()
    {
        _graphics = new GraphicsDeviceManager(this);
        _graphics.PreferredBackBufferWidth = 1500;
        _graphics.PreferredBackBufferHeight = 800;
        Content.RootDirectory = "Content";
        IsMouseVisible = true;
    }

    protected override void Initialize()
    {
        // TODO: Add your initialization logic here

        base.Initialize();
    }

    protected override void LoadContent()
    {   
        _spriteBatch = new SpriteBatch(GraphicsDevice);

        _pixel = new Texture2D(GraphicsDevice, 1, 1);
        _pixel.SetData(new[] { Color.White });

        _world = new World();
        _camera = new Camera(GraphicsDevice.Viewport) { World = _world };
        _font = Content.Load<SpriteFont>("DefaultFont");
        _uiToolBar = new UIToolBar();
        _unitSpawner = new UnitSpawner(_world, _uiToolBar, _camera);
    }

    protected override void Update(GameTime gameTime)
    {
        if (GamePad.GetState(PlayerIndex.One).Buttons.Back == ButtonState.Pressed || Keyboard.GetState().IsKeyDown(Keys.Escape))
            Exit();

        _camera.Update(gameTime);
        _fPS = (int)(1 / gameTime.ElapsedGameTime.TotalSeconds);
        _uiToolBar.Update(Mouse.GetState());
        _unitSpawner.Update(Mouse.GetState());

        base.Update(gameTime);
    }

    protected override void Draw(GameTime gameTime)
    {
        GraphicsDevice.Clear(Color.Black);

        _spriteBatch.Begin(transformMatrix: _camera.Transform);
        _world.Draw(_spriteBatch, _pixel, _camera.ViewBounds);
        Drawtext($"FPS: {_fPS}");
        _spriteBatch.End();

        _spriteBatch.Begin();
        _uiToolBar.Draw(_spriteBatch, _pixel, _font, Mouse.GetState());
        _spriteBatch.End();

        base.Draw(gameTime);
    }

    private void Drawtext(string text = "", int x = 10, int y = 10)
    {
        _spriteBatch.DrawString(_font, text, new Vector2(-_camera.Transform.Translation.X + x, -_camera.Transform.Translation.Y + y), Color.White);
    }
}
