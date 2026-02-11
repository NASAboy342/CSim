using System.Collections.Generic;

namespace CSim.Civilizations;

public sealed class KingdomManager
{
    private readonly List<Kingdom> _kingdoms = new();
    private int _nextId = 1;

    public IReadOnlyList<Kingdom> Kingdoms => _kingdoms;

    public Kingdom AddKingdomForTown(Town town)
    {
        var kingdom = new Kingdom(_nextId++, town.Race, town);
        _kingdoms.Add(kingdom);
        return kingdom;
    }
}
