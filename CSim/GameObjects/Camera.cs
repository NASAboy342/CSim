using System;
using Microsoft.Xna.Framework;
using Microsoft.Xna.Framework.Graphics;
using Microsoft.Xna.Framework.Input;

namespace CSim.GameObjects;

public class Camera
{
    private Viewport _viewport;
    private Vector2 _offset = Vector2.Zero;
    private float _ySpeed = 0f;
    private float _xSpeed = 0f;
    private bool _isDetectInputX = false;
    private bool _isDetectInputY = false;
    private float _cameraAcceleration = 100f;

    public World World { get; set; }
    public Matrix Transform => Matrix.CreateTranslation(-_offset.X, -_offset.Y, 0);
    public Rectangle ViewBounds => new Rectangle((int)_offset.X, (int)_offset.Y, _viewport.Width, _viewport.Height);

    public Camera(Viewport viewport)
    {
        _viewport = viewport;
    }

    public void Update(GameTime gameTime)
    {
        float delta = (float)gameTime.ElapsedGameTime.TotalSeconds;
        var kb = Keyboard.GetState();
        ListenForInput(delta, kb);
        Move(delta);
        CheckWorldBound();
        SlowDownCamera(delta);
    }

    private void SlowDownCamera(float delta)
    {
        if (!_isDetectInputX) _xSpeed = _xSpeed > 0 ? Math.Max(0, _xSpeed - _cameraAcceleration * delta) : _xSpeed < 0 ? Math.Min(0, _xSpeed + _cameraAcceleration * delta) : 0f;
        if (!_isDetectInputY) _ySpeed = _ySpeed > 0 ? Math.Max(0, _ySpeed - _cameraAcceleration * delta) : _ySpeed < 0 ? Math.Min(0, _ySpeed + _cameraAcceleration * delta) : 0f;
    }

    private void Move(float delta)
    {
        _offset.X += _xSpeed * delta;
        _offset.Y += _ySpeed * delta;
    }

    private void CheckWorldBound()
    {
        if (World != null)
        {
            int worldPixelW = World.Width * World.CellSize;
            int worldPixelH = World.Height * World.CellSize;

            float clampedX = Math.Clamp(_offset.X, 0, Math.Max(0, worldPixelW - _viewport.Width));
            float clampedY = Math.Clamp(_offset.Y, 0, Math.Max(0, worldPixelH - _viewport.Height));

            if (clampedX != _offset.X) _xSpeed = 0f;
            if (clampedY != _offset.Y) _ySpeed = 0f;

            _offset.X = clampedX;
            _offset.Y = clampedY;
        }
    }

    private void ListenForInput(float delta, KeyboardState kb)
    {
        _isDetectInputX = false;
        _isDetectInputY = false;
        if (kb.IsKeyDown(Keys.W) || kb.IsKeyDown(Keys.Up)) {
            _ySpeed -= _cameraAcceleration * delta;
            _isDetectInputY = true;
        }
        if (kb.IsKeyDown(Keys.S) || kb.IsKeyDown(Keys.Down)) {
            _ySpeed += _cameraAcceleration * delta;
            _isDetectInputY = true;
        }
        if (kb.IsKeyDown(Keys.A) || kb.IsKeyDown(Keys.Left)) {
            _xSpeed -= _cameraAcceleration * delta;
            _isDetectInputX = true;
        }
        if (kb.IsKeyDown(Keys.D) || kb.IsKeyDown(Keys.Right)) {
            _xSpeed += _cameraAcceleration * delta;
            _isDetectInputX = true;
        }
    }
}
