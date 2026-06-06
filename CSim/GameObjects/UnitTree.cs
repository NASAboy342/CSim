
using Microsoft.Xna.Framework;
using Microsoft.Xna.Framework.Graphics;

namespace CSim.GameObjects;
public class UnitTree : Unit
{

    public override void Update(GameTime gameTime, World world)
    {
        Width = 10;
        Height = 10;
    }

    public override void Draw(SpriteBatch spriteBatch, Texture2D pixel)
    {
        var shadowposition = Position + new Vector2(3, 3);
        var shadow = new Rectangle(shadowposition.ToPoint(), new Point(Width, Height));
        spriteBatch.Draw(pixel, shadow, Color.DarkGreen);

        var leaves = new Rectangle(Position.ToPoint(), new Point(Width, Height));
        spriteBatch.Draw(pixel, leaves, Color.Green);
    }
}