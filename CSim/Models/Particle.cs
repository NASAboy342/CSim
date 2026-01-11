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

    

    

    

    public void Move(GameTime gameTime)
    {
        Position = Vector2.Add(Position, Velocity * Convert.ToSingle(gameTime.ElapsedGameTime.TotalMilliseconds));
    }

    

    
    public bool IsCollided(Particle particle)
    {
        var distance = Vector2.Distance(Position, particle.Position);
        return distance <= Radius + particle.Radius;
    }

    
}
