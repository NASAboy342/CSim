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

        // Base reference used when shaping continents; not a fixed band
        // anymore but kept as a rough scale for elevation.
        _seaLevel = height / 3;
        Generate();
    }

    private void Generate()
    {
        // Build a coarse random height grid and bilinearly interpolate it
        // to create smooth, continent-like elevation. Then combine that
        // with latitude so higher latitudes tend to be higher ground.

        const int controlStep = 16; // tiles between control points
        var controlWidth = Width / controlStep + 3;
        var controlHeight = Height / controlStep + 3;
        var controlHeights = new float[controlWidth, controlHeight];

        for (var gx = 0; gx < controlWidth; gx++)
        {
            for (var gy = 0; gy < controlHeight; gy++)
            {
                // Random base height for this control point.
                controlHeights[gx, gy] = (float)_random.NextDouble();
            }
        }

        for (var x = 0; x < Width; x++)
        {
            for (var y = 0; y < Height; y++)
            {
                // Map tile into control grid space.
                var fx = x / (float)controlStep;
                var fy = y / (float)controlStep;

                var ix = (int)fx;
                var iy = (int)fy;
                var tx = fx - ix;
                var ty = fy - iy;

                if (ix < 0) ix = 0;
                if (iy < 0) iy = 0;
                if (ix >= controlWidth - 1) ix = controlWidth - 2;
                if (iy >= controlHeight - 1) iy = controlHeight - 2;

                var h00 = controlHeights[ix, iy];
                var h10 = controlHeights[ix + 1, iy];
                var h01 = controlHeights[ix, iy + 1];
                var h11 = controlHeights[ix + 1, iy + 1];

                var hx0 = MathHelper.Lerp(h00, h10, tx);
                var hx1 = MathHelper.Lerp(h01, h11, tx);
                var noiseHeight = MathHelper.Lerp(hx0, hx1, ty);

                // Latitude term: top of the map tends to be higher
                // (mountains), lower part closer to sea level.
                var latitude = 1f - (float)y / Height;

                // Blend noise and latitude into a final elevation.
                var elevation = latitude * 0.6f + noiseHeight * 0.4f;

                var terrain = TerrainType.Grass;

                if (elevation < 0.35f)
                {
                    terrain = TerrainType.Water;
                }
                else if (elevation > 0.7f)
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
        // Slow resource regeneration: trees can slowly grow back on grass,
        // and fish populations can slowly increase in water.

        var delta = (float)gameTime.ElapsedGameTime.TotalSeconds;

        // We don't want to touch every tile every frame with heavy logic, so
        // use low probabilities and cheap checks.
        for (var x = 0; x < Width; x++)
        {
            for (var y = 0; y < Height; y++)
            {
                var tile = Tiles[x, y];

                // Tree regrowth on grass: very small chance for an empty
                // grass tile to sprout a new tree, and existing trees can
                // very slowly gain more resource units.
                if (tile.Terrain == TerrainType.Grass)
                {
                    if (tile.Resource == ResourceType.None)
                    {
                        // About a 0.01% chance per second for a tree to grow
                        // on an empty grass tile.
                        if (_random.NextDouble() < 0.0001 * delta)
                        {
                            tile.Resource = ResourceType.Tree;
                            tile.ResourceAmount = _random.Next(2, 5);
                        }
                    }
                    else if (tile.Resource == ResourceType.Tree && tile.ResourceAmount > 0)
                    {
                        // Existing trees very slowly regenerate wood/food.
                        if (_random.NextDouble() < 0.0002 * delta)
                        {
                            tile.ResourceAmount += 1;
                            if (tile.ResourceAmount > 10)
                            {
                                tile.ResourceAmount = 10;
                            }
                        }
                    }
                }

                // Fish population recovery in water.
                if (tile.Terrain == TerrainType.Water)
                {
                    if (tile.Resource == ResourceType.Fish && tile.ResourceAmount > 0)
                    {
                        // Existing fish schools slowly grow.
                        if (_random.NextDouble() < 0.0003 * delta)
                        {
                            tile.ResourceAmount += 1;
                            if (tile.ResourceAmount > 15)
                            {
                                tile.ResourceAmount = 15;
                            }
                        }
                    }
                    else if (tile.Resource == ResourceType.None)
                    {
                        // Very rare chance for a new fish school to appear
                        // on an empty water tile.
                        if (_random.NextDouble() < 0.00005 * delta)
                        {
                            tile.Resource = ResourceType.Fish;
                            tile.ResourceAmount = _random.Next(3, 7);
                        }
                    }
                }
            }
        }
    }
}
