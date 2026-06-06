using System;
using System.Collections.Generic;
using CSim.GameObjects;
using Microsoft.Xna.Framework;

namespace CSim.Helpers;

public static class CustomMath
{
    public static float WrapValue(float value, float min, float max)
    {
        var range = max - min;
        if (range <= 0f)
        {
            throw new ArgumentOutOfRangeException(nameof(max), "max must be greater than min.");
        }

        var wrapped = (value - min) % range;
        if (wrapped < 0f)
        {
            wrapped += range;
        }

        return wrapped + min;
    }

    public static int WrapValue(int value, int min, int max)
    {
        var range = max - min;
        if (range <= 0)
        {
            throw new ArgumentOutOfRangeException(nameof(max), "max must be greater than min.");
        }

        var wrapped = (value - min) % range;
        if (wrapped < 0)
        {
            wrapped += range;
        }

        return wrapped + min;
    }

    internal static Unit FindClosestUnit(Vector2 position, List<Unit> units)
    {
        Unit closestUnit = null;
        float closestDistance = float.MaxValue;

        foreach (var unit in units)
        {
            float distance = Vector2.Distance(position, unit.Position);
            if (distance < closestDistance)
            {
                closestDistance = distance;
                closestUnit = unit;
            }
        }

        return closestUnit;
    }

    internal static float GetDirectionInDegrees(Vector2 position1, Vector2 position2)
    {
        var direction = position2 - position1;
        return MathHelper.ToDegrees((float)Math.Atan2(direction.Y, direction.X));
    }

    internal static float GetDistance(Vector2 position1, Vector2 position2)
    {
        return Vector2.Distance(position1, position2);
    }
}