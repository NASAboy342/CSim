using System.Collections.Generic;
using CSim.Entities;

namespace CSim.Civilizations;

public sealed class Kingdom
{
    public int Id { get; }
    public RaceType Race { get; }

    private readonly List<Town> _towns = new();
    public IReadOnlyList<Town> Towns => _towns;

    public Kingdom(int id, RaceType race, Town capital)
    {
        Id = id;
        Race = race;
        _towns.Add(capital);
    }

    public void AddTown(Town town)
    {
        _towns.Add(town);
    }

    public void RemoveTown(Town town)
    {
        _towns.Remove(town);
    }
}
