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
}
