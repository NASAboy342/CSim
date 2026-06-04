using System;
using CSim.UI;
using Microsoft.Xna.Framework.Input;

namespace CSim.GameObjects;

public class UnitSpawner
{
    private World _world;
    private UIToolBar _uiToolBar;
    private Camera _camera;
    private bool _isLastSpawnedDone = true;

    public UnitSpawner(World world, UIToolBar uiToolBar, Camera camera)
    {
        _world = world;
        _uiToolBar = uiToolBar;
        _camera = camera;
    }

    public void Update(MouseState mouseState)
    {
        if (mouseState.LeftButton == ButtonState.Pressed && _isLastSpawnedDone)
        {
            _isLastSpawnedDone = false;
            var newUnit = new Unit();
            newUnit.Position = mouseState.Position.ToVector2();
            newUnit.Position += _camera.Offset;
            _world.AddUnit(newUnit);
        }

        if (mouseState.LeftButton == ButtonState.Released)
        {
            _isLastSpawnedDone = true;
        }
    }
}
