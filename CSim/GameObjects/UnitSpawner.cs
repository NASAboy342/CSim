using System;
using CSim.Enums;
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
            switch (_uiToolBar.SelectedTool)
            {
                case EnumSelectableTool.Human:
                    SpawnHuman(mouseState);
                    break;
                default:
                    break;
            }
        }

        if (mouseState.LeftButton == ButtonState.Released)
        {
            _isLastSpawnedDone = true;
        }
    }

    private void SpawnUnit(MouseState mouseState)
    {
        var newUnit = new Unit();
        newUnit.Position = mouseState.Position.ToVector2();
        newUnit.Position += _camera.Offset;
        _world.AddUnit(newUnit);
    }

    private void SpawnHuman(MouseState mouseState)
    {
        var newHuman = new UnitHuman();
        newHuman.Position = mouseState.Position.ToVector2();
        newHuman.Position += _camera.Offset;
        _world.AddUnit(newHuman);
    }
}
