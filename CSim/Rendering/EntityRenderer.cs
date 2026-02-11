using System.Collections.Generic;
using CSim.Entities;
using Microsoft.Xna.Framework;
using Microsoft.Xna.Framework.Graphics;

namespace CSim.Rendering;

public sealed class EntityRenderer
{
    private readonly Texture2D _pixel;

    public EntityRenderer(GraphicsDevice graphicsDevice)
    {
        _pixel = new Texture2D(graphicsDevice, 1, 1);
        _pixel.SetData(new[] { Color.White });
    }

    public void Draw(SpriteBatch spriteBatch, IEnumerable<Entity> entities)
    {
        foreach (var entity in entities)
        {
            var color = entity.Race switch
            {
                RaceType.Human => Color.Yellow,
                RaceType.Orc => new Color(0, 170, 0),
                RaceType.Elf => new Color(120, 255, 120),
                RaceType.Dwarf => new Color(200, 160, 80),
                _ => Color.White
            };

            var rect = new Rectangle((int)entity.Position.X - 3, (int)entity.Position.Y - 3, 6, 6);
            spriteBatch.Draw(_pixel, rect, color);
        }
    }
}
