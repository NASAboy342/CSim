using System;
using System.Collections.Generic;
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
        for (var i = 0; i < 100; i++)
        {
            _particles.Add(new Particle(_particles.Count + 1, _graphics.GraphicsDevice, 5f, new Vector2(Convert.ToSingle(random.Next(0, viewWidth)), Convert.ToSingle(random.Next(0, viewHeight))), _boundary));
        }

        // var particle1 = new Particle(1, _graphics.GraphicsDevice, 30f, new Vector2(300 , 300));
        // var particle2 = new Particle(2, _graphics.GraphicsDevice, 30f, new Vector2(500 , 500));
        // particles.Add(particle1);
        // particles.Add(particle2);
    }

    protected override void LoadContent()
    {
        _spriteBatch = new SpriteBatch(GraphicsDevice);
    }

    protected override void Update(GameTime gameTime)
    {
        if (GamePad.GetState(PlayerIndex.One).Buttons.Back == ButtonState.Pressed || Keyboard.GetState().IsKeyDown(Keys.Escape))
            Exit();

        foreach (var particle in _particles)
        {
            particle.InteractPhysic(_particles, gameTime);
        }
        base.Update(gameTime);
    }

    protected override void Draw(GameTime gameTime)
    {
            GraphicsDevice.Clear(Color.Black);
            _spriteBatch.Begin();
            foreach (var particle in _particles)
            {
                particle.Draw(_spriteBatch);
            }
            _boundary.Draw(_spriteBatch);
            _spriteBatch.End();
            base.Draw(gameTime);
    }
}
