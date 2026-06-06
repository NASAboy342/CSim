using System;
using CSim.Enums;
using CSim.Helpers;
using Microsoft.Xna.Framework;
using Microsoft.Xna.Framework.Graphics;
namespace CSim.GameObjects;

public class UnitHuman : Unit
{
    public EnumHumanState State { get; set; } = EnumHumanState.Idle;
    public override void Draw(SpriteBatch spriteBatch, Texture2D pixel)
    {
        var rect = new Rectangle(Position.ToPoint(), new Point(Width, Height));
        spriteBatch.Draw(pixel, rect, Color.Brown);
    }

    public override void Update(GameTime gameTime, World world)
    {
        switch (State)
        {
            case EnumHumanState.Idle:
                WonderAroundToFindWork(gameTime, world);
                break;
            case EnumHumanState.Attacking:
                break;
            case EnumHumanState.Dead:
                break;
            default:
                throw new ArgumentOutOfRangeException();
        }
    }

    private void WonderAroundToFindWork(GameTime gameTime, World world)
    {
        WalkInRandomDirection(gameTime, world);

    }

    
    private void WalkInRandomDirection(GameTime gameTime, World world)
    {
        MovingdirectionInDegrees = CustomMath.WrapValue(MovingdirectionInDegrees + Random.Shared.Next(-10, 11), 0f, 360f);
        Speed = Random.Shared.Next(2, 10);
        MoveToNextPosition(MovingdirectionInDegrees, Speed, gameTime, world);
    }
}

