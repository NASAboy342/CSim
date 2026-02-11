using Microsoft.Xna.Framework;

namespace CSim.Entities;

public sealed class Entity
{
    public Vector2 Position;

    public float Speed = 20f;

    public Entity(Vector2 position)
    {
        Position = position;
    }

    public void Update(GameTime gameTime)
    {
        // Phase 1: simple idle/wander placeholder can be added later
    }
}
