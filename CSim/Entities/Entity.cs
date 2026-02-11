using System;
using Microsoft.Xna.Framework;

namespace CSim.Entities;

public enum RaceType
{
    Human,
    Orc,
    Elf,
    Dwarf
}

public sealed class Entity
{
    public Vector2 Position;

    public float Speed = 20f;

    public RaceType Race { get; }

    public float Health { get; private set; } = 10f;
    public float Damage { get; private set; } = 4f;

    private static readonly Random Random = new();
    private Vector2 _velocity;
    private float _directionTimer;

    private const float MinDirectionSeconds = 1f;
    private const float MaxDirectionSeconds = 3f;

    public Entity(Vector2 position, RaceType race)
    {
        Position = position;
        Race = race;
    }

    public void Update(GameTime gameTime)
    {
        var delta = (float)gameTime.ElapsedGameTime.TotalSeconds;

        _directionTimer -= delta;
        if (_directionTimer <= 0f)
        {
            PickNewDirection();
        }

        Position += _velocity * Speed * delta;
    }

    public void ApplyDamage(float amount)
    {
        Health -= amount;
    }

    private void PickNewDirection()
    {
        // Random unit circle direction
        var angle = (float)(Random.NextDouble() * Math.PI * 2.0);
        var dir = new Vector2((float)Math.Cos(angle), (float)Math.Sin(angle));

        if (dir.LengthSquared() < 0.001f)
        {
            dir = new Vector2(1f, 0f);
        }

        dir.Normalize();
        _velocity = dir;

        var range = MaxDirectionSeconds - MinDirectionSeconds;
        var t = (float)Random.NextDouble();
        _directionTimer = MinDirectionSeconds + t * range;
    }
}
