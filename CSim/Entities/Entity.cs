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

    public float AgeYears { get; private set; }
    public float MaxAgeYears { get; private set; }

    public float Energy { get; private set; }
    public float MaxEnergy { get; private set; }

    public ResourceType CarriedResource { get; private set; } = ResourceType.None;
    public int CarriedAmount { get; private set; }
    public bool CarryingForConstruction { get; private set; }

    private static readonly Random Random = new();
    private float _baseSpeed;
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
                _baseSpeed = 22f;
                AttackInterval = 0.7f;
                MaxAgeYears = 60f;
                MaxEnergy = 100f;
                break;
            case RaceType.Orc:
                MaxHealth = 26f;
                Damage = 4f;
                _baseSpeed = 20f;
                AttackInterval = 0.8f;
                MaxAgeYears = 55f;
                MaxEnergy = 110f;
                break;
            case RaceType.Elf:
                MaxHealth = 18f;
                Damage = 3f;
                _baseSpeed = 26f;
                AttackInterval = 0.6f;
                MaxAgeYears = 70f;
                MaxEnergy = 95f;
                break;
            case RaceType.Dwarf:
                MaxHealth = 24f;
                Damage = 3.5f;
                _baseSpeed = 18f;
                AttackInterval = 0.8f;
                MaxAgeYears = 65f;
                MaxEnergy = 105f;
                break;
            default:
                MaxHealth = 20f;
                Damage = 3f;
                _baseSpeed = 20f;
                AttackInterval = 0.7f;
                MaxAgeYears = 60f;
                MaxEnergy = 100f;
                break;
        }

        Health = MaxHealth;
        Speed = _baseSpeed;
        AgeYears = 0f;
        Energy = MaxEnergy;
    }

    public void Update(GameTime gameTime)
    {
        var delta = (float)gameTime.ElapsedGameTime.TotalSeconds;

        // Aging over time; when exceeding max age, the unit dies.
        const float yearsPerSecond = 0.05f;
        AgeYears += delta * yearsPerSecond;
        if (AgeYears > MaxAgeYears)
        {
            Health = 0f;
        }

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

        // Aging slows movement speed.
        var ageRatio = MaxAgeYears > 0f ? MathHelper.Clamp(AgeYears / MaxAgeYears, 0f, 1f) : 0f;
        Speed = _baseSpeed * (1f - 0.4f * ageRatio);

        // Basic energy drain over time and with movement. Tuned so units
        // still have a chance to rest and eat, but will die if they stay
        // active too long without food.
        var movementFactor = _velocity.Length();
        UseEnergy(delta * (0.4f + 0.2f * movementFactor));

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

    public bool CanAttack => _attackCooldown <= 0f && Health > 0f && Energy > 5f;

    public void OnAttack()
    {
        _attackCooldown = AttackInterval;
        UseEnergy(5f);
    }

    public bool CanDoResourceAction => _resourceCooldown <= 0f && Health > 0f && Energy > 3f;

    public void OnResourceAction(float intervalSeconds)
    {
        _resourceCooldown = intervalSeconds;
        UseEnergy(2f);
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

    public void RegenerateEnergy(float amount)
    {
        if (amount <= 0f || Health <= 0f)
        {
            return;
        }

        Energy += amount;
        if (Energy > MaxEnergy)
        {
            Energy = MaxEnergy;
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
        CarryingForConstruction = false;
        return true;
    }

    public bool TryPickUpConstruction(ResourceType type, int amount)
    {
        if (IsCarryingResource || type == ResourceType.None || amount <= 0 || Health <= 0f)
        {
            return false;
        }

        CarriedResource = type;
        CarriedAmount = amount;
        CarryingForConstruction = true;
        return true;
    }

    public int DropResource()
    {
        var amount = CarriedAmount;
        CarriedAmount = 0;
        CarriedResource = ResourceType.None;
        CarryingForConstruction = false;
        return amount;
    }

    public float EnergyRatio => MaxEnergy > 0f ? MathHelper.Clamp(Energy / MaxEnergy, 0f, 1f) : 0f;

    private void UseEnergy(float amount)
    {
        if (amount <= 0f || Health <= 0f)
        {
            return;
        }

        Energy -= amount;
        if (Energy < 0f)
        {
            Energy = 0f;
        }

        // If an entity fully runs out of energy, it dies.
        if (Energy <= 0f && Health > 0f)
        {
            Health = 0f;
        }
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
