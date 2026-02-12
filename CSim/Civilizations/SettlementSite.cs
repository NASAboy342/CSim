using CSim.Entities;
using Microsoft.Xna.Framework;

namespace CSim.Civilizations;

public sealed class SettlementSite
{
    public Vector2 Position { get; }
    public RaceType Race { get; }

    public int RequiredBuildUnits { get; }
    public int Progress { get; private set; }

    public bool IsComplete => Progress >= RequiredBuildUnits;

    public SettlementSite(Vector2 position, RaceType race, int requiredBuildUnits = 6)
    {
        Position = position;
        Race = race;
        RequiredBuildUnits = requiredBuildUnits;
    }

    public void AddBuildUnits(int amount)
    {
        if (amount <= 0)
        {
            return;
        }

        Progress += amount;
    }
}
