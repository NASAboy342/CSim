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
        CreateTexture();
    }

    public override void CreateTexture()
    {
        var customerShape = new CustomerShape(_graphicsDeviceManager.GraphicsDevice);
        customerShape.Origin = Position;
        customerShape.Width = Convert.ToInt32(Width);
        customerShape.Height = Convert.ToInt32(Height);
        customerShape.Fill = Color.Transparent;
        customerShape.Stroke = Color.White;
        customerShape.StrokeWidth = 2;
        var texture = customerShape.CreateRectangleTexture();
        Texture2D = texture;
    }

    public override void Draw(SpriteBatch spriteBatch)
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
