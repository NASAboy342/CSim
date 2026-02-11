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
            }
        }
    }
}
