using System;
using Microsoft.Xna.Framework;
using Microsoft.Xna.Framework.Graphics;

namespace CSim.Models;

public abstract class GameObjectBase
{
    public Texture2D Texture2D { get; set; }
    public Vector2 Velocity { get; set; } = new Vector2(0, 0);
    public Vector2 Position { get; set; } = new Vector2(0, 0);
    public GraphicsDeviceManager _graphicsDeviceManager;

    public abstract void Draw(SpriteBatch spriteBatch);
    public abstract void CreateTexture();
}
