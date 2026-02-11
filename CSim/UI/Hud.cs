using System.Text;
using CSim.Civilizations;
using CSim.Entities;
using CSim.Powers;
using Microsoft.Xna.Framework;
using Microsoft.Xna.Framework.Graphics;

namespace CSim.UI;

public sealed class Hud
{
    private readonly SpriteFont _font;

    public Hud(SpriteFont font)
    {
        _font = font;
    }

    public void Draw(SpriteBatch spriteBatch, RaceType currentRace, TownManager townManager, int entityCount, ToolMode toolMode)
    {
        var sb = new StringBuilder();
        sb.Append("Race: ");
        sb.Append(currentRace);
        sb.Append("  Tool: ");
        sb.Append(toolMode);
        sb.Append("  Towns: ");
        sb.Append(townManager.Towns.Count);
        sb.Append("  Units: ");
        sb.Append(entityCount);
        sb.AppendLine();
        sb.Append("Controls: 1-4 race, Z spawn, X raise, C lower, V lightning, LMB apply tool, RMB found town (spawn), Esc quit");

        var text = sb.ToString();

        var shadowPos = new Vector2(9, 9);
        var textPos = new Vector2(8, 8);

        spriteBatch.DrawString(_font, text, shadowPos, Color.Black * 0.7f);
        spriteBatch.DrawString(_font, text, textPos, Color.White);
    }
}

