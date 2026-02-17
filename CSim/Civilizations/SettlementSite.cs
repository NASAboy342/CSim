using CSim.Entities;
using Microsoft.Xna.Framework;

namespace CSim.Civilizations;

public sealed class SettlementSite
{
    public Vector2 Position { get; }
    public RaceType Race { get; }

    public int RequiredBuildUnits { get; }
    public int Progress { get; private set; }

    public int MaxActiveBuilders { get; }
    private int _activeBuilders;

    public bool IsComplete => Progress >= RequiredBuildUnits;

    public SettlementSite(Vector2 position, RaceType race, int requiredBuildUnits = 6, int maxActiveBuilders = 4)
    {
        Position = position;
        Race = race;
        RequiredBuildUnits = requiredBuildUnits;
        MaxActiveBuilders = maxActiveBuilders;
    }

    public void AddBuildUnits(int amount)
    {
        if (amount <= 0)
        {
            return;
        }

        Progress += amount;
    }

    public bool TryReserveBuilder()
    {
        if (IsComplete)
        {
            return false;
        }

        if (_activeBuilders >= MaxActiveBuilders)
        {
            return false;
        }

        _activeBuilders++;
        return true;
    }

    public void ReleaseBuilder()
    {
        if (_activeBuilders > 0)
        {
            _activeBuilders--;
        }
    }
}
