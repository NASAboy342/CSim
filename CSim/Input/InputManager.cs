using Microsoft.Xna.Framework;
using Microsoft.Xna.Framework.Input;

namespace CSim.Input;

public sealed class InputManager
{
    private MouseState _previousMouse;

    public bool LeftClicked { get; private set; }
    public bool RightClicked { get; private set; }
    public Point MousePosition { get; private set; }

    public void Update()
    {
        var mouse = Mouse.GetState();

        LeftClicked = mouse.LeftButton == ButtonState.Pressed && _previousMouse.LeftButton == ButtonState.Released;
        RightClicked = mouse.RightButton == ButtonState.Pressed && _previousMouse.RightButton == ButtonState.Released;
        MousePosition = mouse.Position;

        _previousMouse = mouse;
    }
}
