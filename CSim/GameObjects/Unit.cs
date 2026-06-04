using System;
using Microsoft.Xna.Framework;
using Microsoft.Xna.Framework.Graphics;

namespace CSim.GameObjects;

public class Unit
{
    public string Id { get; set; }
    public Vector2 Position { get; set; }

    public Unit(string id = "")
    {
        Id = string.IsNullOrEmpty(id) ? Guid.NewGuid().ToString() : id;
    }

    public virtual void Update()
    {
        
    }

    public virtual void Draw()
    {
        
    }

    internal void Draw(SpriteBatch spriteBatch, Texture2D pixel)
    {
        var rect = new Rectangle(Position.ToPoint(), new Point(10, 10));
        spriteBatch.Draw(pixel, rect, Color.Red);
    }
}
