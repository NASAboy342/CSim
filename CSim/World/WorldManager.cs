using Microsoft.Xna.Framework;

namespace CSim.World;

public sealed class WorldManager
{
    public int Width { get; }
    public int Height { get; }

    public WorldTile[,] Tiles { get; }

    private readonly int _seaLevel;

    public WorldManager(int width, int height)
    {
        Width = width;
        Height = height;
        Tiles = new WorldTile[width, height];

        // Simple height-based generation placeholder
        _seaLevel = height / 3;
        Generate();
    }

    private void Generate()
    {
        for (var x = 0; x < Width; x++)
        {
            for (var y = 0; y < Height; y++)
            {
                var terrain = TerrainType.Grass;

                if (y > _seaLevel * 2)
                {
                    terrain = TerrainType.Water;
                }
                else if (y < _seaLevel / 2)
                {
                    terrain = TerrainType.Mountain;
                }

                Tiles[x, y] = new WorldTile(x, y, terrain);
            }
        }
    }

    public void Update(GameTime gameTime)
    {
        // Phase 1: no world dynamics yet
    }
}
