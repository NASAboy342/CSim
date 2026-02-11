using System.Collections.Generic;
using Microsoft.Xna.Framework;

namespace CSim.Civilizations;

public sealed class TownManager
{
    private readonly List<Town> _towns = new();

    public IReadOnlyList<Town> Towns => _towns;

    public void AddTown(Town town)
    {
        _towns.Add(town);
    }

    public void Update(GameTime gameTime)
    {
        foreach (var town in _towns)
        {
            town.Update(gameTime);
        }
    }
}
