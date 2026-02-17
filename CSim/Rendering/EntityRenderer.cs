using System.Collections.Generic;
using CSim.Entities;
using Microsoft.Xna.Framework;
using Microsoft.Xna.Framework.Graphics;

namespace CSim.Rendering;

public sealed class EntityRenderer
{
    private readonly Texture2D _pixel;

    private Texture2D? _humanTexture;
    private Texture2D? _orcTexture;

    public EntityRenderer(GraphicsDevice graphicsDevice)
    {
        _pixel = new Texture2D(graphicsDevice, 1, 1);
        _pixel.SetData(new[] { Color.White });
    }

    public void SetRaceTexture(RaceType race, Texture2D texture)
    {
        switch (race)
        {
            case RaceType.Human:
                _humanTexture = texture;
                break;
            case RaceType.Orc:
                _orcTexture = texture;
                break;
        }
    }

    public void Draw(SpriteBatch spriteBatch, IEnumerable<Entity> entities)
    {
        foreach (var entity in entities)
        {
            var baseColor = entity.Race switch
            {
                RaceType.Human => Color.Yellow,
                RaceType.Orc => new Color(0, 170, 0),
                RaceType.Elf => new Color(120, 255, 120),
                RaceType.Dwarf => new Color(200, 160, 80),
                _ => Color.White
            };

            // Energy controls brightness: low energy is darker, high is brighter.
            var energyFactor = 0.4f + 0.6f * entity.EnergyRatio;
            if (energyFactor < 0f) energyFactor = 0f;
            if (energyFactor > 1f) energyFactor = 1f;

            var color = new Color(
                (byte)(baseColor.R * energyFactor),
                (byte)(baseColor.G * energyFactor),
                (byte)(baseColor.B * energyFactor));

            var rect = new Rectangle((int)entity.Position.X - 4, (int)entity.Position.Y - 4, 8, 8);

            Texture2D? texture = entity.Race switch
            {
                RaceType.Human => _humanTexture,
                RaceType.Orc => _orcTexture,
                _ => null
            };

            if (texture != null)
            {
                var origin = new Vector2(texture.Width * 0.5f, texture.Height * 0.5f);
                const float textureScale = 0.5f;
                spriteBatch.Draw(texture, entity.Position, null, color, 0f, origin, textureScale, SpriteEffects.None, 0f);
            }
            else
            {
                spriteBatch.Draw(_pixel, rect, color);
            }

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
