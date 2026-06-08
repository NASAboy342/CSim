using System;
using CSim.Enums;
using CSim.Helpers;
using Microsoft.Xna.Framework;
using Microsoft.Xna.Framework.Graphics;
namespace CSim.GameObjects;

public class UnitHuman : Unit
{
    public UnitTree ClosestTree;
    public UnitHumanHouse ClosestHouse;
    public EnumResourceType CarryingResource { get; set; } = EnumResourceType.None;

    public EnumHumanState State { get; set; } = EnumHumanState.Idle;
    public override void Draw(SpriteBatch spriteBatch, Texture2D pixel)
    {
        var rect = new Rectangle(Position.ToPoint(), new Point(Width, Height));
        spriteBatch.Draw(pixel, rect, Color.Brown);

        if (CarryingResource != EnumResourceType.None) DrawCarryingResource(spriteBatch, pixel);
    }

    private void DrawCarryingResource(SpriteBatch spriteBatch, Texture2D pixel)
    {
        var resourceRect = new Rectangle((Position + new Vector2(Width, 0)).ToPoint(), new Point(4, 4));
        spriteBatch.Draw(pixel, resourceRect, Color.DarkGray);
    }

    public override void Update(GameTime gameTime, World world)
    {
        switch (State)
        {
            case EnumHumanState.Idle:
                WonderAroundToFindWork(gameTime, world);
                break;
            case EnumHumanState.WalkingToTree:
                WalkToTree(gameTime, world);
                break;
            case EnumHumanState.CollectingResourceFromTree:
                CollectResourceFromTree(gameTime, world);
                break;
            case EnumHumanState.GoingToHouse:
                GoToHouse(gameTime, world);
                break;
            case EnumHumanState.SearchingForHouse:
                SearchForHouse(gameTime, world);
                break;
            case EnumHumanState.DroppingResourceToHouse:
                DropResourceToHouse(gameTime, world);
                break;
            default:
                throw new ArgumentOutOfRangeException();
        }
    }

    private void DropResourceToHouse(GameTime gameTime, World world)
    {
        if (ClosestHouse == null)
        {
            State = EnumHumanState.SearchingForHouse;
            return;
        }

        ClosestHouse.ReceiveResource(CarryingResource);

        CarryingResource = EnumResourceType.None;
        State = EnumHumanState.Idle;
    }

    private void SearchForHouse(GameTime gameTime, World world)
    {
        var localUnits = world.GetLocalUnits(Position);
        var houses = localUnits.FindAll(u => u is UnitHumanHouse);
        var closestHouse = CustomMath.FindClosestUnit(Position, houses);
        if (closestHouse != null){
            ClosestHouse = (UnitHumanHouse)closestHouse;
            State = EnumHumanState.GoingToHouse;
        } else {
            WonderAroundToFindWork(gameTime, world);
        }
    }

    private void GoToHouse(GameTime gameTime, World world)
    {   
        if (ClosestHouse == null)
        {
            State = EnumHumanState.SearchingForHouse;
            return;
        }

        var isHouseInRange = CustomMath.GetDistance(Position, ClosestHouse.Position) < 5f;
        if (isHouseInRange)
        {
            CarryingResource = EnumResourceType.None;
            State = EnumHumanState.DroppingResourceToHouse;
            return;
        }

        var directionToHouse = CustomMath.GetDirectionInDegrees(Position, ClosestHouse.Position);
        Speed = 5f;
        MoveToNextPosition(directionToHouse, Speed, gameTime, world);
    }

    private void CollectResourceFromTree(GameTime gameTime, World world)
    {
        if (CarryingResource != EnumResourceType.None)
        {
            State = EnumHumanState.GoingToHouse;
            return;
        }

        if (ClosestTree == null)
        {
            State = EnumHumanState.Idle;
            return;
        }

        CarryingResource = ClosestTree.GetResource();

        if (CarryingResource == EnumResourceType.None)
        {
            State = EnumHumanState.Idle;
            return;
        }

        State = EnumHumanState.GoingToHouse;
    }

    private void WalkToTree(GameTime gameTime, World world)
    {
        var isTreeInRange = CustomMath.GetDistance(Position, ClosestTree.Position) < 5f;
        if (isTreeInRange)
        {
            State = EnumHumanState.CollectingResourceFromTree;
            return;
        }
        var directionToTree = CustomMath.GetDirectionInDegrees(Position, ClosestTree.Position);
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
            ClosestTree = (UnitTree)closestTree;
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

