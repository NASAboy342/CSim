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
        for (var i = 0; i < 100; i++)
        {
            var newPaticle = new Particle(_particles.Count + 1, _graphics.GraphicsDevice, CustomeMath.GetFloatBetween(1f, 5f), new Vector2(Convert.ToSingle(random.Next(0, viewWidth)), Convert.ToSingle(random.Next(0, viewHeight))), _boundary);
            newPaticle.Velocity = new Vector2(CustomeMath.GetFloatBetween(-0.05f, 0.05f), CustomeMath.GetFloatBetween(-0.05f, 0.05f));
            _particles.Add(newPaticle);
        }

        // var particle1 = new Particle(1, _graphics.GraphicsDevice, 30f, new Vector2(100 , 200), _boundary);
        // particle1.Velocity = new Vector2(0.5f, 0.5f);
        // var particle2 = new Particle(2, _graphics.GraphicsDevice, 30f, new Vector2(400 , 200), _boundary);
        // particle2.Velocity = new Vector2(-0.4f, 0.5f);
        // _particles.Add(particle1);
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
                InteractPhysic(particle, _particles, gameTime);
                particle.UpdateTexture();
                particle.CreateVelocityTexture();
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
                if (particle.Texture != null && !particle.Texture.Texture2D.IsDisposed)
                {
                    particle.Draw(_spriteBatch);
                }
            }


            _spriteBatch.DrawString(_ingameFont, $"Total valocity: {_particles.Sum(p => p.Speed)}", new Vector2(10, 10), Color.White);
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

    internal void InteractPhysic(Particle thisParticle, List<Particle> particles, GameTime gameTime)
    {
        foreach (var particle in particles)
        {
            if (thisParticle.Id == particle.Id) continue;
            FeelGravity(thisParticle, particle);
            FeelCollision(thisParticle, particle, gameTime);
        }
        thisParticle.Move(gameTime);
        thisParticle.Velocity = _boundary.FeelBoundary(thisParticle.Position, thisParticle.Velocity, thisParticle.Radius);
        CheckMaxVelocity(thisParticle);
        ValidateValuesToPreventCorruption(thisParticle);
    }

    private void ValidateValuesToPreventCorruption(Particle thisParticle)
    {
        if (float.IsNaN(thisParticle.Position.X) || float.IsNaN(thisParticle.Position.Y) || float.IsInfinity(thisParticle.Position.X) || float.IsInfinity(thisParticle.Position.Y))
        {
            System.Diagnostics.Debug.WriteLine($"Particle {thisParticle.Id}: Invalid Position detected!");
            thisParticle.Position = new Vector2(500, 500);
            thisParticle.Velocity = Vector2.Zero;
        }
        if (float.IsNaN(thisParticle.Velocity.X) || float.IsNaN(thisParticle.Velocity.Y) || float.IsInfinity(thisParticle.Velocity.X) || float.IsInfinity(thisParticle.Velocity.Y))
        {
            System.Diagnostics.Debug.WriteLine($"Particle {thisParticle.Id}: Invalid Velocity detected!");
            thisParticle.Velocity = Vector2.Zero;
        }
    }

    private void CheckMaxVelocity(Particle particle)
    {
        var maxVelocity = 2f;
        if (particle.Velocity.Length() > maxVelocity)
        {
            particle.Velocity = Vector2.Normalize(particle.Velocity) * maxVelocity;
        }
    }
    private void FeelGravity(Particle thisParticle, Particle particle)
    {
        var distance = Vector2.Distance(thisParticle.Position, particle.Position);

        // Prevent division by zero or near-zero distances
        var minDistance = thisParticle.Radius + particle.Radius;
        if (distance < minDistance)
        {
            distance = minDistance;
        }

        var angleDegree = CustomeMath.GetDegreeBetweenTwoPoints(thisParticle.Position, particle.Position);
        //(G * m1 * m2) / d²
        // var g = 6.67430e-11f;
        // var g = 6.67430f;
        var g = 0.00667430f;
        var gravityForce = (g * thisParticle.Mass * particle.Mass) / MathF.Pow(distance, 2);
        var speed = gravityForce / thisParticle.Mass;
        thisParticle.Velocity = thisParticle.Velocity + Vector2.Subtract(CustomeMath.GetNewPositionByAngleAndDistance(thisParticle.Position, angleDegree, speed), thisParticle.Position);
    }
    private void FeelCollision(Particle thisParticle, Particle otherParticle, GameTime gameTime)
    {
        if (thisParticle.IsCollided(otherParticle))
        {
            thisParticle.Color = Color.Red;

            var overlap = (thisParticle.Radius + otherParticle.Radius) - Vector2.Distance(thisParticle.Position, otherParticle.Position);
            var directionDegree = CustomeMath.GetDegreeBetweenTwoPoints(thisParticle.Position, otherParticle.Position);
            thisParticle.Position = CustomeMath.GetNewPositionByAngleAndDistance(thisParticle.Position, CustomeMath.AddDegree(directionDegree, 180f), overlap / 2f);
            otherParticle.Position = CustomeMath.GetNewPositionByAngleAndDistance(otherParticle.Position, directionDegree, overlap / 2f);



            var velocityDiffForParticle1 = CalculateCollistion(thisParticle, otherParticle);
            var velocityDiffForParticle2 = CalculateCollistion(otherParticle, thisParticle);
            thisParticle.Velocity += velocityDiffForParticle1 * 0.9f;
            otherParticle.Velocity += velocityDiffForParticle2 * 0.9f;

        }
        else thisParticle.Color = Color.White;
    }

    private Vector2 CalculateCollistion(Particle particle1, Particle particle2)
    {
        var distance = Vector2.Distance(particle1.Position, particle2.Position);
        var minDistance = 0.1f;
        if (distance < minDistance)
            distance = minDistance;


        var mass = (2f * particle2.Mass) / (particle1.Mass + particle2.Mass);
        var velocityDiff = Vector2.Subtract(particle2.Velocity, particle1.Velocity);
        var positionDiff = Vector2.Subtract(particle2.Position, particle1.Position);
        var normalizedPositionDiff = Vector2.Normalize(positionDiff);

        var velocityAlongNormal = Vector2.Dot(velocityDiff, normalizedPositionDiff);

        return (mass * velocityAlongNormal) * normalizedPositionDiff;
    }

}
