using Microsoft.Xna.Framework;

namespace CSim.Entities;

public enum RaceType
{
    Human,
    Orc,
    Elf,
    Dwarf
}

public sealed class Entity
{
    public Vector2 Position;

    public float Speed = 20f;

    public RaceType Race { get; }

    public Entity(Vector2 position, RaceType race)
    {
        Position = position;
        Race = race;
    }

    public void Update(GameTime gameTime)
    {
        // Phase 2+: add simple wander or behavior based on race
    }
}
