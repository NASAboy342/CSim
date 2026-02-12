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

    public WorldRenderer(WorldManager world, GraphicsDevice graphicsDevice, int tileSize)
    {
        _world = world;
        _tileSize = tileSize;

        _pixel = new Texture2D(graphicsDevice, 1, 1);
        _pixel.SetData(new[] { Color.White });
    }

    public void Draw(SpriteBatch spriteBatch)
    {
        for (var x = 0; x < _world.Width; x++)
        {
            for (var y = 0; y < _world.Height; y++)
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
