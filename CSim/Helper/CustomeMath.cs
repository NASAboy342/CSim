using System;
using Microsoft.Xna.Framework;

namespace CSim.Helper;

public class CustomeMath
{
    public static float GetRedianBetweenTwoPoints(Vector2 position1, Vector2 position2)
    {
        Vector2 dir = Vector2.Subtract(position2, position1);
        var angle = MathF.Atan2(dir.Y, dir.X);
        if (angle < 0)
        {
            angle += MathF.PI * 2;
        }
        return angle;
    }

    public static float GetDegreeBetweenTwoPoints(Vector2 position1, Vector2 position2)
    {
        float angleRad = GetRedianBetweenTwoPoints(position1, position2);
        float angleDeg = angleRad * (180f / MathF.PI);
        return angleDeg;
    }

    public static Vector2 GetNewPositionByAngleAndDistance(Vector2 position, float angleDegree, float distance)
    {
        float angleRad = DegreeToRadian(angleDegree);

        Vector2 direction = new Vector2(
            MathF.Cos(angleRad),
            MathF.Sin(angleRad)
        );

        Vector2 newPosition = new Vector2(
            position.X + direction.X * distance, 
            position.Y + direction.Y * distance
            );
        return newPosition;
    }

    public static float DegreeToRadian(float angleDegree)
    {
        return angleDegree * MathF.PI / 180f;
    }

    internal static float AddDegree(float directionDegree, float v)
    {
        return (directionDegree + v) % 360f;
    }

    internal static float GetFloatBetween(float v1, float v2)
    {
        var random = new Random();
        var min = MathF.Min(v1, v2);
        var max = MathF.Max(v1, v2);
        var result = Convert.ToSingle(random.NextDouble() * (max - min) + min);
        return result;
    }
}