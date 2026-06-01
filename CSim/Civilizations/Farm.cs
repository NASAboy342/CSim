using System;
using CSim.Entities;
using CSim.World;
using Microsoft.Xna.Framework;

namespace CSim.Civilizations;

public sealed class Farm
{
    public const int DefaultRequiredWood = 6;
    public const int DefaultRequiredStone = 4;
    public const int DefaultWaterCapacity = 8;

    public Vector2 Position { get; }
    public Town Owner { get; }
    public RaceType Race => Owner.Race;

    public int RequiredWood { get; }
    public int RequiredStone { get; }
    public int WaterCapacity { get; }

    public int DeliveredWood { get; private set; }
    public int DeliveredStone { get; private set; }
    public int StoredWater { get; private set; }
    public int HarvestReady { get; private set; }

    public bool IsBuilt => DeliveredWood >= RequiredWood && DeliveredStone >= RequiredStone;
    public bool NeedsWater => IsBuilt && StoredWater < WaterCapacity;
    public bool HasHarvest => HarvestReady > 0;

    private float _cropTimer;

    private const float SecondsPerFood = 2.5f;
    private const int MaxHarvestBuffer = 12;

    public Farm(
        Vector2 position,
        Town owner,
        int requiredWood = DefaultRequiredWood,
        int requiredStone = DefaultRequiredStone,
        int waterCapacity = DefaultWaterCapacity)
    {
        Position = position;
        Owner = owner;
        RequiredWood = requiredWood;
        RequiredStone = requiredStone;
        WaterCapacity = waterCapacity;
    }

    public void Update(GameTime gameTime)
    {
        if (!IsBuilt || StoredWater <= 0)
        {
            return;
        }

        var delta = (float)gameTime.ElapsedGameTime.TotalSeconds;
        _cropTimer += delta;

        while (_cropTimer >= SecondsPerFood && StoredWater > 0)
        {
            _cropTimer -= SecondsPerFood;
            StoredWater--;

            if (HarvestReady < MaxHarvestBuffer)
            {
                HarvestReady++;
            }
        }
    }

    public bool NeedsMaterial(ResourceType type)
    {
        return type switch
        {
            ResourceType.Tree => DeliveredWood < RequiredWood,
            ResourceType.Rock => DeliveredStone < RequiredStone,
            _ => false
        };
    }

    public int AddConstructionMaterial(ResourceType type, int amount)
    {
        if (amount <= 0 || IsBuilt)
        {
            return 0;
        }

        return type switch
        {
            ResourceType.Tree => AddWood(amount),
            ResourceType.Rock => AddStone(amount),
            _ => 0
        };
    }

    public int AddWater(int amount)
    {
        if (amount <= 0 || !IsBuilt)
        {
            return 0;
        }

        var accepted = Math.Min(amount, WaterCapacity - StoredWater);
        StoredWater += accepted;
        return accepted;
    }

    public int TakeHarvest(int amount)
    {
        if (amount <= 0 || HarvestReady <= 0)
        {
            return 0;
        }

        var taken = Math.Min(amount, HarvestReady);
        HarvestReady -= taken;
        return taken;
    }

    private int AddWood(int amount)
    {
        var accepted = Math.Min(amount, RequiredWood - DeliveredWood);
        DeliveredWood += accepted;
        return accepted;
    }

    private int AddStone(int amount)
    {
        var accepted = Math.Min(amount, RequiredStone - DeliveredStone);
        DeliveredStone += accepted;
        return accepted;
    }
}