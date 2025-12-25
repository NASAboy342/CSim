using System;
using Microsoft.Xna.Framework;
using Microsoft.Xna.Framework.Graphics;

namespace CSim.Helper;

public class CustomerShape
{
    private GraphicsDevice _graphicsDevice;

    public CustomerShape(GraphicsDevice graphicsDevice)
    {
        _graphicsDevice = graphicsDevice;
    }

    public int Radius { get; set; }
    public Color Fill { get; set; }
    public Vector2 Origin { get; set; }
    public int Width { get; set; }
    public int Height { get; set; }
    public Color Stroke { get; set; }
    public int StrokeWidth { get; internal set; }

    public Texture2D CreateCircleTexture()
    {
        var diameter = Radius * 2 + 1;
        var texture2D = new Texture2D(_graphicsDevice, diameter, diameter);
        Color[] colorData = new Color[diameter * diameter];

        for (int y = 0; y < diameter; y++)
        {
            for (int x = 0; x < diameter; x++)
            {
                int index = y * diameter + x;
                Vector2 pos = new Vector2(x - Radius, y - Radius);
                if (pos.Length() == Radius)
                {
                    colorData[index] = Fill;
                }
                else if (pos.Length() < Radius)
                {
                    colorData[index] = Fill;
                }
                else
                {
                    colorData[index] = Color.Transparent;
                }
            }
        }

        texture2D.SetData(colorData);
        return texture2D;
    }

    internal Texture2D CreateRectangleTexture()
    {
        var texture2D = new Texture2D(_graphicsDevice, Width, Height);
        Color[] colorData = new Color[Width * Height];

        for (int y = 0; y < Height; y++)
        {
            for (int x = 0; x < Width; x++)
            {
                int index = y * Width + x;
                if (x == 0 || x == Width - StrokeWidth || y == 0 || y == Height - StrokeWidth)
                {
                    colorData[index] = Stroke;
                }
                else
                {
                    colorData[index] = Fill;
                }
            }
        }

        texture2D.SetData(colorData);
        return texture2D;
    }
}
