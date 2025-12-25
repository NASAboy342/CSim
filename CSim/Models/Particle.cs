using System;
using System.Collections.Generic;
using CSim.Helper;
using Microsoft.Xna.Framework;
using Microsoft.Xna.Framework.Graphics;

namespace CSim.Models;

public class Particle: GameObjectBase
{
    public Particle(int id, GraphicsDevice graphicsDevice, float radius, Vector2 position, Boundary boundary)
    {
        Id = id;
        Radius = radius;
        Position = position;
        _graphicsDevice = graphicsDevice;
        _boundary = boundary;
        CreateTexture();
    }
    private Boundary _boundary;
    private GraphicsDevice _graphicsDevice;
    public int Id { get; set; }
    public float Radius { get; set; } = 1f;
    public float Speed { get; set; }
    
    public Color Color { get; set; } = Color.White;
    public float Mass => Radius * MathF.PI;
    public override void Draw(SpriteBatch spriteBatch)
    {
        CreateTexture();
        if (Texture2D != null)
        {
            spriteBatch.Draw(
                Texture2D,
                Position,
                Color.White
            );
        }
    }

    public override void CreateTexture()
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
            FeelGravity(particle);
            FeelCollision(particle, gameTime);
        }
        Move(gameTime);
        Position =_boundary.Clips(Position);
        CheckMaxVelocity();
    }

    private void CheckMaxVelocity()
    {
        var maxVelocity = 1f;
        if (Velocity.Length() > maxVelocity)
        {
            Velocity = Vector2.Normalize(Velocity) * maxVelocity;
        }
    }

    private void Move(GameTime gameTime)
    {
        Position = Vector2.Add(Position, Velocity * Convert.ToSingle(gameTime.ElapsedGameTime.Milliseconds));
    }

    private void FeelCollision(Particle otherParticle, GameTime gameTime)
    {
        if (IsCollided(otherParticle))
        {
            Color = Color.Red;

            // var overlap = (Radius + otherParticle.Radius) - Vector2.Distance(Position, otherParticle.Position);
            // var directionDegree = CustomeMath.GetDegreeBetweenTwoPoints(Position, otherParticle.Position);
            // Position = CustomeMath.GetNewPositionByAngleAndDistance(Position, CustomeMath.AddDegree(directionDegree, 180f), overlap / 2f);
            // otherParticle.Position = CustomeMath.GetNewPositionByAngleAndDistance(otherParticle.Position, directionDegree, overlap / 2f);
            

            var resultVelocity = Velocity + (((2 * otherParticle.Mass)/ (Mass + otherParticle.Mass))  *  ((Vector2.Subtract(otherParticle.Velocity, Velocity) * Vector2.Subtract(otherParticle.Position, Position)) / MathF.Pow( Math.Abs(Vector2.Distance(Position, otherParticle.Position)), 2)) * Vector2.Subtract(otherParticle.Position, Position));
            var resultOtherParticleVelocity = otherParticle.Velocity + (2 * Mass)/ (otherParticle.Mass + Mass)  *  Vector2.Subtract(Velocity, otherParticle.Velocity) * Vector2.Subtract(Position, otherParticle.Position) / MathF.Pow(MathF.Abs(Vector2.Distance(otherParticle.Position, Position)), 2) * Vector2.Subtract(Position, otherParticle.Position);

            Velocity = resultVelocity;
            otherParticle.Velocity = resultOtherParticleVelocity;


        }
        else Color = Color.White;
    }

    private bool IsCollided(Particle particle)
    {
        var distance = Vector2.Distance(Position, particle.Position);
        return distance <= Radius + particle.Radius;
    }

    private void FeelGravity(Particle particle)
    {
        var angleDegree = CustomeMath.GetDegreeBetweenTwoPoints(Position, particle.Position);
        var distance = Vector2.Distance(Position, particle.Position);
        //(G * m1 * m2) / d²
        // var g = 6.67430e-11f;
        // var g = 6.67430f;
        var g = 0.0667430f;
        var gravityForce = (g * Mass * particle.Mass) / MathF.Pow(distance, 2);
        Speed = gravityForce / Mass;
        Velocity = Velocity + Vector2.Subtract(CustomeMath.GetNewPositionByAngleAndDistance(Position, angleDegree, Speed), Position);
    }
}
