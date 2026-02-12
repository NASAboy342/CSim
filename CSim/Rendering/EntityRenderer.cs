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

            if (entity.IsCarryingResource)
            {
                var carryRect = new Rectangle(rect.X + 1, rect.Y + 1, rect.Width - 2, rect.Height - 2);
                var carryColor = new Color(60, 40, 10, 230);
                spriteBatch.Draw(_pixel, carryRect, carryColor);
            }

            if (entity.MaxHealth > 0f)
            {
                var hpRatio = MathHelper.Clamp(entity.Health / entity.MaxHealth, 0f, 1f);

                if (hpRatio < 1f)
                {
                    var barWidth = 10;
                    var barHeight = 2;
                    var barX = (int)entity.Position.X - barWidth / 2;
                    var barY = rect.Y - barHeight - 1;

                    var backRect = new Rectangle(barX, barY, barWidth, barHeight);
                    spriteBatch.Draw(_pixel, backRect, new Color(30, 30, 30, 220));

                    var filledWidth = (int)(barWidth * hpRatio);
                    if (filledWidth > 0)
                    {
                        var hpColor = Color.Lerp(Color.Red, Color.LimeGreen, hpRatio);
                        var fillRect = new Rectangle(barX, barY, filledWidth, barHeight);
                        spriteBatch.Draw(_pixel, fillRect, hpColor);
                    }
                }
            }
        }
    }
}
