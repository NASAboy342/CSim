using CSim.Civilizations;
using CSim.Entities;
using Microsoft.Xna.Framework;
using Microsoft.Xna.Framework.Graphics;

namespace CSim.Rendering;

public sealed class TownRenderer
{
    private readonly Texture2D _pixel;

    public TownRenderer(GraphicsDevice graphicsDevice)
    {
        _pixel = new Texture2D(graphicsDevice, 1, 1);
        _pixel.SetData(new[] { Color.White });
    }

    public void Draw(SpriteBatch spriteBatch, TownManager townManager)
    {
        foreach (var town in townManager.Towns)
        {
            var color = town.Race switch
            {
                RaceType.Human => new Color(220, 200, 80),
                RaceType.Orc => new Color(0, 120, 0),
                RaceType.Elf => new Color(140, 230, 140),
                RaceType.Dwarf => new Color(180, 140, 60),
                _ => Color.White
            };

            var rect = new Rectangle((int)town.Position.X - 5, (int)town.Position.Y - 5, 10, 10);
            spriteBatch.Draw(_pixel, rect, color);
        }
    }
}
