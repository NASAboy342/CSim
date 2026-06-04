using System;
using System.Collections.Generic;
using CSim.Enums;
using Microsoft.Xna.Framework;
using Microsoft.Xna.Framework.Graphics;
using Microsoft.Xna.Framework.Input;

namespace CSim.UI;

public class UIToolBar
{
	private readonly List<UIButton> _buttons = new();
	private MouseState _prevMouse;
    public EnumSelectableTool SelectedTool { get; set; } = EnumSelectableTool.None;

	public UIToolBar()
	{
        Div(x: 100, y: 10, gap: 10, flex: "row", new List<Button>(){
            new Button("Human",() => SetSelectedTool(EnumSelectableTool.Human), Id: EnumSelectableTool.Human.ToString()),
            new Button("Human House",() => SetSelectedTool(EnumSelectableTool.HumanHouse), Id: EnumSelectableTool.HumanHouse.ToString()),
            new Button("Human Farm",() => SetSelectedTool(EnumSelectableTool.HumanFarm), Id: EnumSelectableTool.HumanFarm.ToString()),
            new Button("Inspect",() => SetSelectedTool(EnumSelectableTool.Inspect), Id: EnumSelectableTool.Inspect.ToString()),
            new Button("Erase",() => SetSelectedTool(EnumSelectableTool.Erase), Id: EnumSelectableTool.Erase.ToString()),
        });
	}

    private void Div(int x, int y, int gap, string flex, List<Button> buttons = null)
    {
        if (buttons == null)
        {
            buttons = new List<Button>();
        }

        int offsetX = 0;
        int offsetY = 0;

        foreach (var button in buttons)
        {
            _buttons.Add(new UIButton(new Rectangle(x + offsetX, y + offsetY, button.Width, button.Height), button.Label, button.Action, id: button.Id));

            if (flex == "row")
            {
                offsetX += button.Width + gap;
            }
            else if (flex == "column")
            {
                offsetY += button.Height + gap;
            }
        }
    }

    private void SetSelectedTool(EnumSelectableTool tool)
    {
        foreach (var button in _buttons)
        {
            if (button.Id == tool.ToString())
            {
                button.IsActive = true;
            }
            else
            {
                button.IsActive = false;
            }
        }
        SelectedTool = tool;
    }

    public void Update(MouseState mouse)
	{
		bool pressedThisFrame = mouse.LeftButton == ButtonState.Pressed && _prevMouse.LeftButton == ButtonState.Released;
		if (pressedThisFrame)
		{
			foreach (var button in _buttons)
			{
				if (button.Contains(mouse.Position))
				{
					button.OnClick?.Invoke();
					break;
				}
			}
		}

		_prevMouse = mouse;
	}

	public void Draw(SpriteBatch spriteBatch, Texture2D pixel, SpriteFont font, MouseState mouse)
	{
		foreach (var button in _buttons)
		{
			button.Draw(spriteBatch, pixel, font, mouse);
		}
	}

}

internal class Button
{
    public string Label { get; set; }
    public Action Action { get; set; }
    public int Width { get; set; } = 0;
    public int Height { get; set; } = 36;
    public string Id { get; set; }

    public Button(string label, Action action, int width = 0, int height = 0, string Id = null)
    {
        this.Label = label;
        this.Action = action;
        this.Id = Id;
        Width = width > 0 ? width : this.Label.Length * 10 + 20;
        Height = height > 0 ? height : this.Height;
    }
}