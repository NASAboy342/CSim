using System;
using Microsoft.Xna.Framework;
using Microsoft.Xna.Framework.Graphics;

namespace CSim.GameObjects;

public class World
{
    public int Width { get; set; } = 2000;
    public int Height { get; set; } = 1000;
    public int CellSize { get; set; } = 8;

    public void Draw(SpriteBatch spriteBatch, Texture2D pixel, Rectangle viewBounds)
    {
        int startX = Math.Max(0, viewBounds.X / CellSize);
        int startY = Math.Max(0, viewBounds.Y / CellSize);
        int endX   = Math.Min(Width,  (viewBounds.Right  / CellSize) + 2);
        int endY   = Math.Min(Height, (viewBounds.Bottom / CellSize) + 2);

        for (int x = startX; x < endX; x++)
        {
            for (int y = startY; y < endY; y++)
            {
                var rect = new Rectangle(x * CellSize, y * CellSize, CellSize - 1, CellSize - 1);
                spriteBatch.Draw(pixel, rect, Color.ForestGreen);
            }
        }
    }
}
