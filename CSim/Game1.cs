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
    private List<Particle> particles = new List<Particle>();

    public Game1()
    {
        _graphics = new GraphicsDeviceManager(this);
        _graphics.PreferredBackBufferWidth = 1500;
        _graphics.PreferredBackBufferHeight = 700;
        Content.RootDirectory = "Content";
        IsMouseVisible = true;
    }

    protected override void Initialize()
    {
        base.Initialize();
        var viewWidth = _graphics.PreferredBackBufferWidth;
        var viewHeight = _graphics.PreferredBackBufferHeight;
        var random = new Random();
        for(var i = 0; i < 100; i++)
        {
            particles.Add(new Particle(_graphics.GraphicsDevice, 2f, new Vector2(Convert.ToSingle(random.Next(0, viewWidth)), Convert.ToSingle(random.Next(0, viewHeight)))));
        }
    }

    protected override void LoadContent()
    {
        _spriteBatch = new SpriteBatch(GraphicsDevice);
        _spriteBatch.Begin();
        foreach(var particle in particles)
        {
            particle.Draw(_spriteBatch);
        }
        _spriteBatch.End();
    }

    protected override void Update(GameTime gameTime)
    {
        if (GamePad.GetState(PlayerIndex.One).Buttons.Back == ButtonState.Pressed || Keyboard.GetState().IsKeyDown(Keys.Escape))
            Exit();



        base.Update(gameTime);
    }

    protected override void Draw(GameTime gameTime)
    {
        GraphicsDevice.Clear(Color.Black);
        _spriteBatch.Begin();

        foreach(var particle in particles)
        {
            particle.Draw(_spriteBatch);
        }

        _spriteBatch.End();
        base.Draw(gameTime);
    }
}
