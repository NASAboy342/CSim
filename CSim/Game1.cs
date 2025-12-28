using System;
using System.Collections.Generic;
using System.Linq;
using CSim.Helper;
using CSim.Models;
using Microsoft.Xna.Framework;
using Microsoft.Xna.Framework.Graphics;
using Microsoft.Xna.Framework.Input;

namespace CSim;

public class Game1 : Game
{
    private GraphicsDeviceManager _graphics;
    private SpriteBatch _spriteBatch;
    private List<Particle> _particles = new List<Particle>();
    private Boundary _boundary;
    private SpriteFont _ingameFont;

    public Game1()
    {
        _graphics = new GraphicsDeviceManager(this);
        _graphics.PreferredBackBufferWidth = 1000;
        _graphics.PreferredBackBufferHeight = 1000;
        Content.RootDirectory = "Content";
        IsMouseVisible = true;
    }

    protected override void Initialize()
    {
        base.Initialize();
        var viewWidth = _graphics.PreferredBackBufferWidth;
        var viewHeight = _graphics.PreferredBackBufferHeight;
        _boundary = new Boundary(_graphics, new Vector2(2, 2), _graphics.PreferredBackBufferWidth - 5, _graphics.PreferredBackBufferHeight - 5);
        var random = new Random();
        // for (var i = 0; i < 5; i++)
        // {
        //     var newPaticle = new Particle(_particles.Count + 1, _graphics.GraphicsDevice, 30f, new Vector2(Convert.ToSingle(random.Next(0, viewWidth)), Convert.ToSingle(random.Next(0, viewHeight))), _boundary);
        //     newPaticle.Velocity = new Vector2(CustomeMath.GetFloatBetween(-0.5f, 0.5f), CustomeMath.GetFloatBetween(-0.5f, 0.5f));
        //     _particles.Add(newPaticle);
        // }

        var particle1 = new Particle(1, _graphics.GraphicsDevice, 30f, new Vector2(100 , 100), _boundary);
        // particle1.Velocity = new Vector2(0.4f, 0);
        // var particle2 = new Particle(2, _graphics.GraphicsDevice, 30f, new Vector2(500 , 500), _boundary);
        // particle2.Velocity = new Vector2(0.5f, 1);
        _particles.Add(particle1);
        // _particles.Add(particle2);
    }

    protected override void LoadContent()
    {
        _spriteBatch = new SpriteBatch(GraphicsDevice);
        _ingameFont = Content.Load<SpriteFont>("InGameFont");
    }

    protected override void Update(GameTime gameTime)
    {
        if (GamePad.GetState(PlayerIndex.One).Buttons.Back == ButtonState.Pressed || Keyboard.GetState().IsKeyDown(Keys.Escape))
            Exit();

        try
        {
            foreach (var particle in _particles)
            {
                particle.InteractPhysic(_particles, gameTime);
            }
        }
        catch (Exception ex)
        {
            System.Diagnostics.Debug.WriteLine($"Update Error: {ex.Message}\n{ex.StackTrace}");
            System.Console.WriteLine($"Update Error: {ex.Message}");
        }
        base.Update(gameTime);
    }

    protected override void Draw(GameTime gameTime)
    {
        try
        {
            if (GraphicsDevice == null || GraphicsDevice.IsDisposed)
            {
                System.Diagnostics.Debug.WriteLine("GraphicsDevice is null or disposed!");
                return;
            }
            
            GraphicsDevice.Clear(Color.Black);
            _spriteBatch.Begin();







            
            foreach (var particle in _particles)
            {
                if (particle.Texture2D != null && !particle.Texture2D.IsDisposed)
                {
                    particle.Draw(_spriteBatch);
                }
            }

            _spriteBatch.DrawString(_ingameFont, _particles.Sum(p => p.Speed).ToString(), new Vector2(10, 10), Color.White);








            _boundary.Draw(_spriteBatch);
            _spriteBatch.End();
        }
        catch (Exception ex)
        {
            System.Diagnostics.Debug.WriteLine($"Draw Error: {ex.Message}\n{ex.StackTrace}");
            System.Console.WriteLine($"Draw Error: {ex.Message}");
        }
        base.Draw(gameTime);
    }
}
