using System;
using CSim.World;
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

    public float Speed { get; private set; }

    public RaceType Race { get; }

    public float Health { get; private set; }
    public float MaxHealth { get; private set; }
    public float Damage { get; private set; }

    public float AttackInterval { get; private set; }

    public ResourceType CarriedResource { get; private set; } = ResourceType.None;
    public int CarriedAmount { get; private set; }

    private static readonly Random Random = new();
    private Vector2 _velocity;
    private float _directionTimer;
    private float _attackCooldown;
    private float _resourceCooldown;

    private const float MinDirectionSeconds = 1f;
    private const float MaxDirectionSeconds = 3f;

    public Entity(Vector2 position, RaceType race)
    {
        Position = position;
        Race = race;

        switch (race)
        {
            case RaceType.Human:
                MaxHealth = 20f;
                Damage = 3f;
                Speed = 22f;
                AttackInterval = 0.7f;
                break;
            case RaceType.Orc:
                MaxHealth = 26f;
                Damage = 4f;
                Speed = 20f;
                AttackInterval = 0.8f;
                break;
            case RaceType.Elf:
                MaxHealth = 18f;
                Damage = 3f;
                Speed = 26f;
                AttackInterval = 0.6f;
                break;
            case RaceType.Dwarf:
                MaxHealth = 24f;
                Damage = 3.5f;
                Speed = 18f;
                AttackInterval = 0.8f;
                break;
            default:
                MaxHealth = 20f;
                Damage = 3f;
                Speed = 20f;
                AttackInterval = 0.7f;
                break;
        }

        Health = MaxHealth;
    }

    public void Update(GameTime gameTime)
    {
        var delta = (float)gameTime.ElapsedGameTime.TotalSeconds;

        _attackCooldown -= delta;
        if (_attackCooldown < 0f)
        {
            _attackCooldown = 0f;
        }

        _resourceCooldown -= delta;
        if (_resourceCooldown < 0f)
        {
            _resourceCooldown = 0f;
        }

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

    public bool CanAttack => _attackCooldown <= 0f && Health > 0f;

    public void OnAttack()
    {
        _attackCooldown = AttackInterval;
    }

    public bool CanDoResourceAction => _resourceCooldown <= 0f && Health > 0f;

    public void OnResourceAction(float intervalSeconds)
    {
        _resourceCooldown = intervalSeconds;
    }

    public void SetDirectedMovement(Vector2 direction, float durationSeconds)
    {
        if (direction.LengthSquared() < 0.0001f || durationSeconds <= 0f)
        {
            return;
        }

        direction.Normalize();
        _velocity = direction;
        _directionTimer = durationSeconds;
    }

    public void Heal(float amount)
    {
        if (amount <= 0f || Health <= 0f)
        {
            return;
        }

        Health += amount;
        if (Health > MaxHealth)
        {
            Health = MaxHealth;
        }
    }

    public bool IsCarryingResource => CarriedAmount > 0 && CarriedResource != ResourceType.None;

    public bool TryPickUpResource(ResourceType type, int amount)
    {
        if (IsCarryingResource || type == ResourceType.None || amount <= 0 || Health <= 0f)
        {
            return false;
        }

        CarriedResource = type;
        CarriedAmount = amount;
        return true;
    }

    public int DropResource()
    {
        var amount = CarriedAmount;
        CarriedAmount = 0;
        CarriedResource = ResourceType.None;
        return amount;
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
