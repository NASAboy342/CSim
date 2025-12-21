using System;
using Microsoft.Xna.Framework;

namespace CSim.Helper;

public class CustomeMath
{
    public static float GetRedianBetweenTwoPoints(Vector2 position1, Vector2 position2)
    {
        Vector2 dir = position2 - position1;
        return MathF.Atan2(dir.Y, dir.X);
    }

    public static float GetDegreeBetweenTwoPoints(Vector2 position1, Vector2 position2)
    {
        float angleRad = GetRedianBetweenTwoPoints(position1, position2);
        float angleDeg = angleRad * (180f / MathF.PI);
        // Normalize to [0, 360)
        angleDeg = (angleDeg % 360f + 360f) % 360f;
        return angleDeg;
    }

    public static Vector2 GetNewPositionByAngleAndDistance(Vector2 position, float angleDegree, float acceleration, GameTime gameTime)
    {
        float angleRad = DegreeToRadian(angleDegree);

        Vector2 direction = new Vector2(
            MathF.Cos(angleRad),
            MathF.Sin(angleRad)
        );

        Vector2 newPosition = new Vector2(
            position.X + direction.X * acceleration * (float)gameTime.ElapsedGameTime.TotalMilliseconds, 
            position.Y + direction.Y * acceleration * (float)gameTime.ElapsedGameTime.TotalMilliseconds
            );
        return newPosition;
    }

    public static float DegreeToRadian(float angleDegree)
    {
        return angleDegree * MathF.PI / 180f;
    }
}
