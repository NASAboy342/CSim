using System;

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
}