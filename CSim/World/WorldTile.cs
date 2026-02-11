namespace CSim.World;

public enum TerrainType
{
    Water,
    Grass,
    Mountain
}

public sealed class WorldTile
{
    public int X { get; }
    public int Y { get; }

    public TerrainType Terrain { get; set; }

    public WorldTile(int x, int y, TerrainType terrain)
    {
        X = x;
        Y = y;
        Terrain = terrain;
    }
}
