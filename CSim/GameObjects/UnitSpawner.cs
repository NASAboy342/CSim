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
        if (mouseState.LeftButton == ButtonState.Pressed && _isLastSpawnedDone && IsMouseInGameArea(mouseState))
        {
            _isLastSpawnedDone = false;
            switch (_uiToolBar.SelectedTool)
            {
                case EnumSelectableTool.Human:
                    SpawnHuman(mouseState);
                    break;
                case EnumSelectableTool.Tree:
                    SpawnTree(mouseState);
                    break;
                case EnumSelectableTool.HumanHouse:
                    SpawnHumanHouse(mouseState);
                    break;
                case EnumSelectableTool.Erase:
                    RemoveUnit(mouseState);
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

    private void RemoveUnit(MouseState mouseState)
    {
        var mousePos = mouseState.Position.ToVector2() + _camera.Offset;
        var unit = _world.GetUnitAtPosition(mousePos);
        if (unit != null)
        {
            _world.RemoveUnit(unit);
        }
    }

    private bool IsMouseInGameArea(MouseState mouseState)
    {
        var mouseX = mouseState.X + _camera.Offset.X;
        var mouseY = mouseState.Y + _camera.Offset.Y;

        return mouseX >= 0 && mouseX < _world.Width * _world.CellSize &&
               mouseY >= 50 && mouseY < _world.Height * _world.CellSize;
    }

    private void SpawnHumanHouse(MouseState mouseState)
    {
        var newHouse = new UnitHumanHouse();
        newHouse.Position = mouseState.Position.ToVector2();
        newHouse.Position += _camera.Offset;
        _world.AddUnit(newHouse);
    }

    private void SpawnTree(MouseState mouseState)
    {
        var newTree = new UnitTree();
        newTree.Position = mouseState.Position.ToVector2();
        newTree.Position += _camera.Offset;
        _world.AddUnit(newTree);
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
