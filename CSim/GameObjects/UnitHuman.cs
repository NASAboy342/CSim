using System;
using CSim.Enums;
using CSim.Helpers;
using Microsoft.Xna.Framework;
using Microsoft.Xna.Framework.Graphics;
namespace CSim.GameObjects;

public class UnitHuman : Unit
{
    private UnitTree _closestTree;

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
            case EnumHumanState.WalkingToTree:
                WalkToTree(gameTime, world);
                break;
            default:
                throw new ArgumentOutOfRangeException();
        }
    }

    private void WalkToTree(GameTime gameTime, World world)
    {
        var isTreeInRange = CustomMath.GetDistance(Position, _closestTree.Position) < 5f;
        if (isTreeInRange)
        {
            State = EnumHumanState.Idle;
            return;
        }
        var directionToTree = CustomMath.GetDirectionInDegrees(Position, _closestTree.Position);
        Speed = 5f;
        MoveToNextPosition(directionToTree, Speed, gameTime, world);
    }

    private void WonderAroundToFindWork(GameTime gameTime, World world)
    {
        SearchForResource(world);
        WalkInRandomDirection(gameTime, world);
    }

    private void SearchForResource(World world)
    {
        var localUnits = world.GetLocalUnits(Position);
        var trees = localUnits.FindAll(u => u is UnitTree);
        var closestTree = CustomMath.FindClosestUnit(Position, trees);
        if (closestTree != null){
            _closestTree = (UnitTree)closestTree;
            State = EnumHumanState.WalkingToTree;
        }
    }

    private void WalkInRandomDirection(GameTime gameTime, World world)
    {
        MovingdirectionInDegrees = CustomMath.WrapValue(MovingdirectionInDegrees + Random.Shared.Next(-10, 11), 0f, 360f);
        Speed = Random.Shared.Next(2, 10);
        MoveToNextPosition(MovingdirectionInDegrees, Speed, gameTime, world);
    }
}

