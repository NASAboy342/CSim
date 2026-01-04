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
    public int StrokeWidth { get; set; }
    public Vector2 StartFrom { get; set; }
    public Vector2 EndAt { get; set; }

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
                    colorData[index] = new Color(Fill, 0.5f);

                }
                else if (pos.Length() < Radius)
                {
                    colorData[index] = new Color(Fill, 0.5f);
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

    internal Texture2D CreateLineTexture()
    {
        var length = (EndAt - StartFrom).Length();
        var texture2D = new Texture2D(_graphicsDevice, Convert.ToInt32(length*2) + StrokeWidth, Convert.ToInt32(length*2) + StrokeWidth);
        Color[] colorData = new Color[texture2D.Width*texture2D.Height];

        var mindleOfTexture = new Vector2(texture2D.Width / 2, texture2D.Height / 2);

        var startFrom = mindleOfTexture;
        var endAt = mindleOfTexture + (EndAt - StartFrom);

        var slope = (endAt.Y - startFrom.Y) / (endAt.X - startFrom.X);
        slope = float.IsNaN(slope) ? 0 : slope;
        var intercept = startFrom.Y - slope * startFrom.X;
            for (int x = 0; x < texture2D.Width; x++)
            {
                var lineY = slope * x + intercept;
                var targetIndex = GetColorIndex(texture2D.Width, Convert.ToInt32(lineY), x);
                colorData[targetIndex] = Stroke;
            } 
        texture2D.SetData(colorData);
        return texture2D;
    }

    private static int GetColorIndex(int width, int y, int x)
    {
        return y * width + x;
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
