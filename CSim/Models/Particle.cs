using System;
using System.Collections.Generic;
using CSim.Helper;
using Microsoft.Xna.Framework;
using Microsoft.Xna.Framework.Graphics;

namespace CSim.Models;

public class Particle
{
    public Particle(int id, GraphicsDevice graphicsDevice, float radius, Vector2 position)
    {
        Id = id;
        Radius = radius;
        Position = position;
        _graphicsDevice = graphicsDevice;
        DrawTexture();
    }
    private GraphicsDevice _graphicsDevice;
    public int Id { get; set; }
    public float Radius { get; set; } = 1f;
    public float Acceleration { get; set; }
    public Vector2 Position { get; set; } = new Vector2(0, 0);
    public Color Color { get; set; } = Color.White;
    public float Mass => Radius * MathF.PI;

    public Texture2D Texture2D { get; set; }
    public void Draw(SpriteBatch spriteBatch)
    {
        DrawTexture();
        if (Texture2D != null)
        {
            spriteBatch.Draw(
                Texture2D,
                Position,
                Color.White
            );
        }
    }

    public void DrawTexture()
    {
        var circleTexture = new CustomerShape(_graphicsDevice);
        circleTexture.Radius = Convert.ToInt32(Radius);
        circleTexture.Fill = Color;
        Texture2D = circleTexture.CreateCircleTexture();
    }

    internal void InteractPhysic(List<Particle> particles, GameTime gameTime)
    {
        foreach (var particle in particles)
        {
            if (Id == particle.Id) continue;
            FeelGravity(gameTime, particle);
            FeelCollision(particle, gameTime);
        }
    }

    private void FeelCollision(Particle particle, GameTime gameTime)
    {
        if (IsCollided(particle)) Color = Color.Red;
        else Color = Color.White;
    }

    private bool IsCollided(Particle particle)
    {
        var distance = Vector2.Distance(Position, particle.Position);
        return distance <= Radius + particle.Radius;
    }

    private void FeelGravity(GameTime gameTime, Particle particle)
    {
        var angleDegree = CustomeMath.GetDegreeBetweenTwoPoints(Position, particle.Position);
        var distance = Vector2.Distance(Position, particle.Position);
        //(G * m1 * m2) / d²
        // var g = 6.67430e-11f;
        var g = 6.67430f;
        var gravityForce = (g * Mass * particle.Mass) / MathF.Pow(distance, 2);
        Acceleration = gravityForce / Mass;
        Position = CustomeMath.GetNewPositionByAngleAndDistance(Position, angleDegree, Acceleration, gameTime);
    }
}
