using System;
using CSim.Helper;
using Microsoft.Xna.Framework;
using Microsoft.Xna.Framework.Graphics;

namespace CSim.Models;

public class Boundary : GameObjectBase
{
    public Boundary(GraphicsDeviceManager graphicsDeviceManager, Vector2 position, float width, float height)
    {
        Position = position;
        Width = width;
        Height = height;
        _graphicsDeviceManager = graphicsDeviceManager;
        UpdateTexture();
    }

    public override void UpdateTexture()
    {
        Texture = new CustomerShape(_graphicsDeviceManager.GraphicsDevice);
        Texture.Origin = Position;
        Texture.Width = Convert.ToInt32(Width);
        Texture.Height = Convert.ToInt32(Height);
        Texture.Fill = Color.Transparent;
        Texture.Stroke = Color.White;
        Texture.StrokeWidth = 2;
        Texture.X = Position.X;
        Texture.Y = Position.Y;
        Texture.CreateRectangleTexture();
    }

    public override void Draw(SpriteBatch spriteBatch)
    {
        if (Texture != null)
        {
            Texture.Draw(spriteBatch);
        }
    }

    internal Vector2 Clips(Vector2 position)
    {
        if(position.X < Position.X)
        {
            position.X = Position.X + Width;
        }
        if(position.X > Position.X + Width)
        {
            position.X = Position.X;
        }
        if(position.Y < Position.Y)
        {
            position.Y = Position.Y + Height;
        }
        if(position.Y > Position.Y + Height)
        {
            position.Y = Position.Y;
        }
        return position;
    }

    internal Vector2 FeelBoundary(Vector2 position, Vector2 velocity, float radius)
    {
        if (position.X - radius < Position.X)
        {
            velocity.X = MathF.Abs(velocity.X);
        }
        if (position.X + radius > Position.X + Width)
        {
            velocity.X = -MathF.Abs(velocity.X);
        }
        if (position.Y - radius < Position.Y)
        {
            velocity.Y = MathF.Abs(velocity.Y);
        }
        if (position.Y + radius > Position.Y + Height)
        {
            velocity.Y = -MathF.Abs(velocity.Y);
        }
        return velocity;
    }

    public float Width { get; set; }
    public float Height { get; set; }
}
