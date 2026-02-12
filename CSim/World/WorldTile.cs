namespace CSim.World;

public enum TerrainType
{
    Water,
    Grass,
    Mountain
}

public enum ResourceType
{
    None,
    Tree,
    Rock,
    Fish
}

public sealed class WorldTile
{
    public int X { get; }
    public int Y { get; }

    public TerrainType Terrain { get; set; }

    public ResourceType Resource { get; set; }
    public int ResourceAmount { get; set; }

    public WorldTile(int x, int y, TerrainType terrain)
    {
        X = x;
        Y = y;
        Terrain = terrain;
        Resource = ResourceType.None;
        ResourceAmount = 0;
    }
}
