using System;
using Microsoft.Xna.Framework;
using Microsoft.Xna.Framework.Graphics;

namespace CSim.GameObjects;

public class Unit
{
    public string Id { get; set; }
    public Vector2 Position { get; set; }
    public float Speed { get; set; } = 0f;
    

    public int Width {get; set; } = 5;
    public int Height {get; set; } = 5;

    public float MovingdirectionInDegrees { get; set; } = Random.Shared.Next(0, 360);

    public Unit(string id = "")
    {
        Id = string.IsNullOrEmpty(id) ? Guid.NewGuid().ToString() : id;
    }

    public virtual void Update(GameTime gameTime, World world)
    {
        
    }

    public virtual void Draw(SpriteBatch spriteBatch, Texture2D pixel)
    {
        var rect = new Rectangle(Position.ToPoint(), new Point(Width, Height));
        spriteBatch.Draw(pixel, rect, Color.Red);
    }

    public void MoveToNextPosition(float directionDegrees, float speed, GameTime gameTime, World world)
    {
        if (world is null)
        {
            return;
        }

        var radians = MathHelper.ToRadians(directionDegrees);
        var direction = new Vector2((float)Math.Cos(radians), (float)Math.Sin(radians));
        var delta = direction * speed * (float)gameTime.ElapsedGameTime.TotalSeconds;
        var nextPosition = Position + delta;

        var worldWidthInPixels = world.Width * world.CellSize;
        var worldHeightInPixels = world.Height * world.CellSize;
        var maxX = Math.Max(0f, worldWidthInPixels - Width);
        var maxY = Math.Max(0f, worldHeightInPixels - Height);

        Position = new Vector2(
            Math.Clamp(nextPosition.X, 0f, maxX),
            Math.Clamp(nextPosition.Y, 0f, maxY)
        );
    }
}
