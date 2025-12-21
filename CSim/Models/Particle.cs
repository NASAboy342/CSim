using System;
using CSim.Helper;
using Microsoft.Xna.Framework;
using Microsoft.Xna.Framework.Graphics;

namespace CSim.Models;

public class Particle
{
    public Particle(GraphicsDevice graphicsDevice, float radius, Vector2 position)
    {
        Radius = radius;
        Position = position;
        CreateTexture(graphicsDevice);
    }
    public int Id { get; set;}
    public float Radius { get; set;} = 1f;
    public Vector2 Position { get; set;} = new Vector2(0, 0);
    public Color Color { get; set;} = Color.White;

    public Texture2D Texture2D { get; set;}
    public void Draw(SpriteBatch spriteBatch)
    {
        if (Texture2D != null)
        {
            spriteBatch.Draw(
                Texture2D,
                Position,
                Color.White
            );
        }
    }

    public void CreateTexture(GraphicsDevice graphicsDevice)
    {
        var circleTexture = new CustomerShape(graphicsDevice);
        circleTexture.Radius = Convert.ToInt32(Radius);
        circleTexture.Fill = Color;
        Texture2D = circleTexture.CreateCircleTexture();
    }
}
