using System;
using CSim.World;
using Microsoft.Xna.Framework;
using Microsoft.Xna.Framework.Graphics;

namespace CSim.Rendering;

public sealed class WorldRenderer
{
    private readonly WorldManager _world;
    private readonly int _tileSize;

    private readonly Texture2D _pixel;
    private readonly Texture2D? _treeTexture;

    public WorldRenderer(WorldManager world, GraphicsDevice graphicsDevice, int tileSize, Texture2D? treeTexture)
    {
        _world = world;
        _tileSize = tileSize;

        _pixel = new Texture2D(graphicsDevice, 1, 1);
        _pixel.SetData(new[] { Color.White });

        _treeTexture = treeTexture;
    }

    public void Draw(SpriteBatch spriteBatch, Rectangle visibleWorld)
    {
        // Compute the range of tiles that intersect the visible world
        // rectangle so we don't draw tiles that are off-screen.
        var startX = Math.Max(0, visibleWorld.Left / _tileSize);
        var endX = Math.Min(_world.Width - 1, visibleWorld.Right / _tileSize);
        var startY = Math.Max(0, visibleWorld.Top / _tileSize);
        var endY = Math.Min(_world.Height - 1, visibleWorld.Bottom / _tileSize);

        for (var x = startX; x <= endX; x++)
        {
            for (var y = startY; y <= endY; y++)
            {
                var tile = _world.Tiles[x, y];
                var color = tile.Terrain switch
                {
                    TerrainType.Water => new Color(40, 90, 200),
                    TerrainType.Mountain => new Color(120, 120, 120),
                    _ => new Color(60, 160, 60)
                };

                var rect = new Rectangle(x * _tileSize, y * _tileSize, _tileSize, _tileSize);
                spriteBatch.Draw(_pixel, rect, color);

                if (tile.Resource != ResourceType.None && tile.ResourceAmount > 0)
                {
                    if (tile.Resource == ResourceType.Tree && _treeTexture != null)
                    {
                        // Draw the tree slightly larger than a single tile so it
                        // stands taller than a human-sized unit.
                        var size = (int)(_tileSize * 1.5f); // e.g., 12px for 8px tiles
                        if (size < _tileSize)
                        {
                            size = _tileSize;
                        }

                        var tx = rect.X + (_tileSize - size) / 2;
                        var ty = rect.Y + (_tileSize - size) / 2;
                        var treeRect = new Rectangle(tx, ty, size, size);
                        spriteBatch.Draw(_treeTexture, treeRect, Color.White);
                    }
                    else
                    {
                        Color resColor;
                        switch (tile.Resource)
                        {
                            case ResourceType.Tree:
                                resColor = new Color(20, 110, 20);
                                break;
                            case ResourceType.Rock:
                                resColor = new Color(150, 150, 150);
                                break;
                            case ResourceType.Fish:
                                resColor = new Color(180, 220, 255);
                                break;
                            default:
                                resColor = Color.White;
                                break;
                        }

                        var rSize = Math.Max(2, _tileSize / 2);
                        var rx = rect.X + (_tileSize - rSize) / 2;
                        var ry = rect.Y + (_tileSize - rSize) / 2;
                        var resRect = new Rectangle(rx, ry, rSize, rSize);
                        spriteBatch.Draw(_pixel, resRect, resColor);
                    }
                }
            }
        }
    }
}
