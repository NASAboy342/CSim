using System.Collections.Generic;
using Microsoft.Xna.Framework;

namespace CSim.Civilizations;

public sealed class KingdomManager
{
    private readonly List<Kingdom> _kingdoms = new();
    private int _nextId = 1;

    public IReadOnlyList<Kingdom> Kingdoms => _kingdoms;

    public Kingdom AssignTownToKingdom(Town town)
    {
        const float maxJoinRadius = 200f;
        var maxJoinRadiusSq = maxJoinRadius * maxJoinRadius;

        Kingdom? closest = null;
        var closestDistSq = maxJoinRadiusSq;

        foreach (var kingdom in _kingdoms)
        {
            if (kingdom.Race != town.Race)
            {
                continue;
            }

            foreach (var existingTown in kingdom.Towns)
            {
                var diff = existingTown.Position - town.Position;
                var distSq = diff.LengthSquared();

                if (distSq < closestDistSq)
                {
                    closestDistSq = distSq;
                    closest = kingdom;
                }
            }
        }

        if (closest != null)
        {
            closest.AddTown(town);
            return closest;
        }

        var newKingdom = new Kingdom(_nextId++, town.Race, town);
        _kingdoms.Add(newKingdom);
        return newKingdom;
    }

    public void RemoveTown(Town town)
    {
        for (var i = _kingdoms.Count - 1; i >= 0; i--)
        {
            var kingdom = _kingdoms[i];
            var hasTown = false;
            foreach (var existing in kingdom.Towns)
            {
                if (ReferenceEquals(existing, town))
                {
                    hasTown = true;
                    break;
                }
            }

            if (!hasTown)
            {
                continue;
            }

            kingdom.RemoveTown(town);

            if (kingdom.Towns.Count == 0)
            {
                _kingdoms.RemoveAt(i);
            }

            break;
        }
    }
}

