using CSim.Entities;
using Microsoft.Xna.Framework;

namespace CSim.Civilizations;

public sealed class Town
{
    public Vector2 Position { get; }
    public RaceType Race { get; }

    public int Population { get; private set; }

    public Town(Vector2 position, RaceType race, int initialPopulation)
    {
        Position = position;
        Race = race;
        Population = initialPopulation;
    }

    public void Update(GameTime gameTime)
    {
        // Phase 2+: add simple population growth
    }
}
