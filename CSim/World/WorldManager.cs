using System;
using Microsoft.Xna.Framework;

namespace CSim.World;

public sealed class WorldManager
{
    public int Width { get; }
    public int Height { get; }

    public WorldTile[,] Tiles { get; }

    private readonly int _seaLevel;
    private readonly Random _random = new();

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

                var tile = new WorldTile(x, y, terrain);

                var roll = _random.NextDouble();

                if (terrain == TerrainType.Grass)
                {
                    if (roll < 0.18)
                    {
                        tile.Resource = ResourceType.Tree;
                        tile.ResourceAmount = _random.Next(3, 8);
                    }
                }
                else if (terrain == TerrainType.Mountain)
                {
                    if (roll < 0.22)
                    {
                        tile.Resource = ResourceType.Rock;
                        tile.ResourceAmount = _random.Next(4, 10);
                    }
                }
                else if (terrain == TerrainType.Water)
                {
                    if (roll < 0.12)
                    {
                        tile.Resource = ResourceType.Fish;
                        tile.ResourceAmount = _random.Next(5, 12);
                    }
                }

                Tiles[x, y] = tile;
            }
        }
    }

    public void Update(GameTime gameTime)
    {
        // Phase 1: no world dynamics yet
    }
}
