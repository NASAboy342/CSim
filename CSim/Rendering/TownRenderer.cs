using CSim.Civilizations;
using CSim.Entities;
using Microsoft.Xna.Framework;
using Microsoft.Xna.Framework.Graphics;

namespace CSim.Rendering;

public sealed class TownRenderer
{
    private readonly Texture2D _pixel;

    private readonly Texture2D? _humanHouseTexture;
    private readonly Texture2D? _orcHouseTexture;

    public TownRenderer(GraphicsDevice graphicsDevice, Texture2D? humanHouseTexture, Texture2D? orcHouseTexture)
    {
        _pixel = new Texture2D(graphicsDevice, 1, 1);
        _pixel.SetData(new[] { Color.White });

        _humanHouseTexture = humanHouseTexture;
        _orcHouseTexture = orcHouseTexture;
    }

    public void Draw(SpriteBatch spriteBatch, TownManager townManager)
    {
        foreach (var town in townManager.Towns)
        {
            // Draw houses in a 16x16 rect centered on the town position,
            // making them larger than units but not overwhelming.
            var rect = new Rectangle((int)town.Position.X - 8, (int)town.Position.Y - 8, 16, 16);

            Texture2D? houseTexture = null;
            switch (town.Race)
            {
                case RaceType.Human:
                    houseTexture = _humanHouseTexture;
                    break;
                case RaceType.Orc:
                    houseTexture = _orcHouseTexture;
                    break;
            }

            if (houseTexture != null)
            {
                // Draw the house texture scaled into the town marker rect.
                spriteBatch.Draw(houseTexture, rect, Color.White);
            }
            else
            {
                var color = town.Race switch
                {
                    RaceType.Human => new Color(220, 200, 80),
                    RaceType.Orc => new Color(0, 120, 0),
                    RaceType.Elf => new Color(140, 230, 140),
                    RaceType.Dwarf => new Color(180, 140, 60),
                    _ => Color.White
                };

                spriteBatch.Draw(_pixel, rect, color);
            }
        }
    }
}
