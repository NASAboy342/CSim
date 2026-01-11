using System;
using System.Collections.Generic;
using CSim.Helper;
using Microsoft.Xna.Framework;
using Microsoft.Xna.Framework.Graphics;

namespace CSim.Models;

public class Particle : GameObjectBase
{
    public Particle(int id, GraphicsDevice graphicsDevice, float radius, Vector2 position, Boundary boundary)
    {
        Id = id;
        Radius = radius;
        Position = position;
        _graphicsDevice = graphicsDevice;
        _boundary = boundary;
        UpdateTexture();
        CreateVelocityTexture();
    }
    private Boundary _boundary;
    private GraphicsDevice _graphicsDevice;
    public int Id { get; set; }
    public float Radius { get; set; } = 1f;
    public float Speed => (Velocity.Length());

    public Color Color { get; set; } = Color.White;
    public float Mass => Radius * MathF.PI;
    public CustomerShape VelocityTexture { get; set; }
    public override void Draw(SpriteBatch spriteBatch)
    {
        if (Texture != null)
        {
            Texture.Draw(spriteBatch);
            // VelocityTexture.Draw(spriteBatch);
        }
    }

    public override void UpdateTexture()
    {
        Texture = new CustomerShape(_graphicsDevice);
        Texture.Radius = Convert.ToInt32(Radius);
        Texture.Fill = Color.White; // Always create white texture, use color tint when drawing
        Texture.X = Position.X;
        Texture.Y = Position.Y;
        Texture.isStartFromCenter = true;
        Texture.CreateCircleTexture();
    }

    public void CreateVelocityTexture()
    {
        VelocityTexture = new CustomerShape(_graphicsDevice);
        VelocityTexture.StrokeWidth = 2;
        VelocityTexture.StartFrom = Position;
        VelocityTexture.EndAt = new Vector2(Position.X + Velocity.X * 50f, Position.Y + Velocity.Y * 50f); // Scale velocity for better visibility
        VelocityTexture.Stroke = Color.Red;
        VelocityTexture.isStartFromCenter = true;
        VelocityTexture.CreateLineTexture();
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
        Velocity = _boundary.FeelBoundary(Position, Velocity, Radius);
        CheckMaxVelocity();
        ValidateValuesToPreventCorruption();
    }

    private void ValidateValuesToPreventCorruption()
    {
        if (float.IsNaN(Position.X) || float.IsNaN(Position.Y) || float.IsInfinity(Position.X) || float.IsInfinity(Position.Y))
        {
            System.Diagnostics.Debug.WriteLine($"Particle {Id}: Invalid Position detected!");
            Position = new Vector2(500, 500);
            Velocity = Vector2.Zero;
        }
        if (float.IsNaN(Velocity.X) || float.IsNaN(Velocity.Y) || float.IsInfinity(Velocity.X) || float.IsInfinity(Velocity.Y))
        {
            System.Diagnostics.Debug.WriteLine($"Particle {Id}: Invalid Velocity detected!");
            Velocity = Vector2.Zero;
        }
    }

    private void CheckMaxVelocity()
    {
        var maxVelocity = 2f;
        if (Velocity.Length() > maxVelocity)
        {
            Velocity = Vector2.Normalize(Velocity) * maxVelocity;
        }
    }

    private void Move(GameTime gameTime)
    {
        Position = Vector2.Add(Position, Velocity * Convert.ToSingle(gameTime.ElapsedGameTime.TotalMilliseconds));
    }

    private void FeelCollision(Particle otherParticle, GameTime gameTime)
    {
        if (IsCollided(otherParticle))
        {
            Color = Color.Red;

            var overlap = (Radius + otherParticle.Radius) - Vector2.Distance(Position, otherParticle.Position);
            var directionDegree = CustomeMath.GetDegreeBetweenTwoPoints(Position, otherParticle.Position);
            Position = CustomeMath.GetNewPositionByAngleAndDistance(Position, CustomeMath.AddDegree(directionDegree, 180f), overlap / 2f);
            otherParticle.Position = CustomeMath.GetNewPositionByAngleAndDistance(otherParticle.Position, directionDegree, overlap / 2f);



            var velocityDiffForParticle1 = CalculateCollistion(this, otherParticle);
            var velocityDiffForParticle2 = CalculateCollistion(otherParticle, this);
            this.Velocity += velocityDiffForParticle1 * 0.9f;
            otherParticle.Velocity += velocityDiffForParticle2 * 0.9f;

        }
        else Color = Color.White;
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

        // Calculate the velocity component along the collision normal
        var velocityAlongNormal = Vector2.Dot(velocityDiff, normalizedPositionDiff);
        
        // Impulse is applied only along the collision normal, not tangentially
        return (mass * velocityAlongNormal) * normalizedPositionDiff;
    }

    private bool IsCollided(Particle particle)
    {
        var distance = Vector2.Distance(Position, particle.Position);
        return distance <= Radius + particle.Radius;
    }

    private void FeelGravity(Particle particle)
    {
        var distance = Vector2.Distance(Position, particle.Position);

        // Prevent division by zero or near-zero distances
        var minDistance = Radius + particle.Radius;
        if (distance < minDistance)
        {
            distance = minDistance;
        }

        var angleDegree = CustomeMath.GetDegreeBetweenTwoPoints(Position, particle.Position);
        //(G * m1 * m2) / d²
        // var g = 6.67430e-11f;
        // var g = 6.67430f;
        var g = 0.00667430f;
        var gravityForce = (g * Mass * particle.Mass) / MathF.Pow(distance, 2);
        var speed = gravityForce / Mass;
        Velocity = Velocity + Vector2.Subtract(CustomeMath.GetNewPositionByAngleAndDistance(Position, angleDegree, speed), Position);
    }
}
