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
    public Texture2D Texture2D { get; set; }
    public float X { get; set; }
    public float Y { get; set; }
    public bool isStartFromCenter { get; set; } = false;

    public Texture2D CreateCircleTexture()
    {
        if (Texture2D != null)
        {
            Texture2D.Dispose();
        }
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
        Texture2D = texture2D;
        return texture2D;
    }

    internal Texture2D CreateLineTexture()
    {
        if (Texture2D != null)
        {
            Texture2D.Dispose();
        }
        var length = (EndAt - StartFrom).Length();
        var texture2D = new Texture2D(_graphicsDevice, Convert.ToInt32(length * 2) + StrokeWidth, Convert.ToInt32(length * 2) + StrokeWidth);
        Color[] colorData = new Color[texture2D.Width * texture2D.Height];

        var mindleOfTexture = new Vector2(texture2D.Width / 2, texture2D.Height / 2);

        var startFrom = mindleOfTexture;
        var endAt = mindleOfTexture + (EndAt - StartFrom);

        var slope = (endAt.Y - startFrom.Y) / (endAt.X - startFrom.X);
        slope = float.IsNaN(slope) ? 0 : slope;
        var intercept = startFrom.Y - slope * startFrom.X;
        var deltaX = endAt.X - startFrom.X;
        if (deltaX < 0)
        {
            for (int x = texture2D.Width / 2; x > deltaX + (texture2D.Width / 2); x--)
            {
                var lineY = slope * x + intercept;
                var targetIndex = GetColorIndex(texture2D.Width, Convert.ToInt32(lineY), x);
                colorData[targetIndex] = Stroke;
            }
        }
        else
        {
            for (int x = texture2D.Width / 2; x < deltaX + (texture2D.Width / 2); x++)
            {
                var lineY = slope * x + intercept;
                var targetIndex = GetColorIndex(texture2D.Width, Convert.ToInt32(lineY), x);
                colorData[targetIndex] = Stroke;
            }
        }
        // for (int y = 0; y < texture2D.Height; y++)
        // {
        //     for (int x = 0; x < texture2D.Width; x++)
        //     {
        //         int index = y * texture2D.Width + x;
        //         if (x == 0 || x == texture2D.Width - StrokeWidth || y == 0 || y == texture2D.Height - StrokeWidth)
        //         {
        //             colorData[index] = Stroke;
        //         }
        //     }
        // }

        texture2D.SetData(colorData);
        Texture2D = texture2D;
        return texture2D;
    }

    private static int GetColorIndex(int width, int y, int x)
    {
        return y * width + x;
    }

    internal Texture2D CreateRectangleTexture()
    {
        if (Texture2D != null)
        {
            Texture2D.Dispose();
        }
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
        Texture2D = texture2D;
        return texture2D;
    }

    public void Draw(SpriteBatch spriteBatch)
    {
        var x = StartFrom.X == 0 ? X : StartFrom.X;
        var y = StartFrom.Y == 0 ? Y : StartFrom.Y;

        if (isStartFromCenter)
        {
            x -= Texture2D.Width / 2;
            y -= Texture2D.Height / 2;
        }

        spriteBatch.Draw(Texture2D, new Vector2(x, y), Color.White);
    }
}
