using System;
using Microsoft.Xna.Framework;
using Microsoft.Xna.Framework.Graphics;
using Microsoft.Xna.Framework.Input;

namespace CSim.UI;

public class UIButton
{
    public Rectangle Bounds { get; }
    public string Label { get; }
    public Action OnClick { get; }
    public bool IsActive { get; set; } = false;

    public Color IdleColor { get; set; } = new Color(42, 42, 52);
    public Color HoverColor { get; set; } = new Color(72, 72, 90);
    public Color TextColor { get; set; } = Color.White;
    public string Id { get; }

    public UIButton(Rectangle bounds, string label, Action onClick, string id)
    {
        Bounds = bounds;
        Label = label;
        OnClick = onClick;
        Id = id;
    }

    public bool Contains(Point p)
    {
        return Bounds.Contains(p);
    }

    public void Draw(SpriteBatch spriteBatch, Texture2D pixel, SpriteFont font, MouseState mouse)
    {
        bool hovered = Contains(mouse.Position);
        spriteBatch.Draw(pixel, Bounds, hovered || IsActive ? HoverColor : IdleColor);

        var textSize = font.MeasureString(Label);
        var textPos = new Vector2(
            Bounds.X + (Bounds.Width - textSize.X) / 2f,
            Bounds.Y + (Bounds.Height - textSize.Y) / 2f);

        spriteBatch.DrawString(font, Label, textPos, TextColor);
    }
}