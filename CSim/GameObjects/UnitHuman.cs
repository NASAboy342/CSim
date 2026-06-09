using System;
using CSim.Enums;
using CSim.Helpers;
using CSim.Model;
using Microsoft.Xna.Framework;
using Microsoft.Xna.Framework.Graphics;
namespace CSim.GameObjects;

public class UnitHuman : Unit
{
    public UnitMemory Memory { get; set; } = new UnitMemory();
    public readonly bool IsMale = false;
    public int AgeInSecond { get; set; } = 0;
    public int ReproductionCooldownInSecond => 10;
    public int AgeSinceLastReproductionInSecond { get; set; } = 0;
    public float Health { get; set; } = 100;

    public EnumHumanState State { get; set; } = EnumHumanState.Idle;

    public UnitHuman()
    {
        IsMale = Random.Shared.Next(0, 2) == 0;
    }
    public override void Draw(SpriteBatch spriteBatch, Texture2D pixel)
    {
        var rect = new Rectangle(Position.ToPoint(), new Point(Width, Height));
        var color = IsMale ? Color.Brown : Color.Pink;
        spriteBatch.Draw(pixel, rect, color);

        if (Memory.CarryingResource != EnumResourceType.None) DrawCarryingResource(spriteBatch, pixel);

        DrawHealthBar(spriteBatch, pixel);
    }

    private void DrawHealthBar(SpriteBatch spriteBatch, Texture2D pixel)
    {
        var healthBarWidth = (int)(Width * (Health / 100));
        var healthBarRect = new Rectangle(Position.ToPoint() + new Point(0, -5), new Point(healthBarWidth, 3));
        spriteBatch.Draw(pixel, healthBarRect, Color.Green);
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
            case EnumHumanState.GoingToEat:
                GoToEat(gameTime, world);
                break;
            default:
                throw new ArgumentOutOfRangeException();
        }
        AgeInSecond += (int)gameTime.ElapsedGameTime.TotalSeconds;
    }

    private void GoToEat(GameTime gameTime, World world)
    {
        if (Memory.ClosestHouse == null)
        {
            State = EnumHumanState.Idle;
            return;
        }

        var isHouseInRange = CustomMath.GetDistance(Position, Memory.ClosestHouse.Position) < 5f;
        if (isHouseInRange)
        {
            var foodReceived = Memory.ClosestHouse.ProvideFood();
            if (foodReceived == EnumResourceType.Food)
            {
                AddHealth(100);
            }
            State = EnumHumanState.Idle;
        }
    }

    private void DropResourceToHouse(GameTime gameTime, World world)
    {
        if (Memory.ClosestHouse == null)
        {
            State = EnumHumanState.SearchingForHouse;
            return;
        }

        Memory.ClosestHouse.ReceiveResource(Memory.CarryingResource);

        Memory.CarryingResource = EnumResourceType.None;
        State = EnumHumanState.Idle;
    }

    private void SearchForHouse(GameTime gameTime, World world)
    {
        var localUnits = world.GetLocalUnits(Position);
        var houses = localUnits.FindAll(u => u is UnitHumanHouse);
        var closestHouse = CustomMath.FindClosestUnit(Position, houses);
        if (closestHouse != null){
            Memory.ClosestHouse = (UnitHumanHouse)closestHouse;
            State = EnumHumanState.GoingToHouse;
        } else {
            WonderAroundToFindWork(gameTime, world);
        }
    }

    private void GoToHouse(GameTime gameTime, World world)
    {   
        if (Memory.ClosestHouse == null)
        {
            State = EnumHumanState.SearchingForHouse;
            return;
        }

        var isHouseInRange = CustomMath.GetDistance(Position, Memory.ClosestHouse.Position) < 5f;
        if (isHouseInRange)
        {
            Memory.CarryingResource = EnumResourceType.None;
            State = EnumHumanState.DroppingResourceToHouse;
            return;
        }

        var directionToHouse = CustomMath.GetDirectionInDegrees(Position, Memory.ClosestHouse.Position);
        Speed = 5f;
        MoveToNextPosition(directionToHouse, Speed, gameTime, world);
    }

    private void CollectResourceFromTree(GameTime gameTime, World world)
    {
        if (Memory.CarryingResource != EnumResourceType.None)
        {
            State = EnumHumanState.GoingToHouse;
            return;
        }

        if (Memory.ClosestTree == null)
        {
            State = EnumHumanState.Idle;
            return;
        }

        Memory.CarryingResource = Memory.ClosestTree.GetResource();

        if (Memory.CarryingResource == EnumResourceType.None)
        {
            State = EnumHumanState.Idle;
            return;
        }

        State = EnumHumanState.GoingToHouse;
    }

    private void WalkToTree(GameTime gameTime, World world)
    {
        var isTreeInRange = CustomMath.GetDistance(Position, Memory.ClosestTree.Position) < 5f;
        if (isTreeInRange)
        {
            State = EnumHumanState.CollectingResourceFromTree;
            return;
        }
        var directionToTree = CustomMath.GetDirectionInDegrees(Position, Memory.ClosestTree.Position);
        Speed = 5f;
        MoveToNextPosition(directionToTree, Speed, gameTime, world);
    }

    public override void MoveToNextPosition(float directionDegrees, float speed, GameTime gameTime, World world)
    {
        base.MoveToNextPosition(directionDegrees, speed, gameTime, world);
        ReduceHealth(speed / 10);
    }

    private void WonderAroundToFindWork(GameTime gameTime, World world)
    {
        if (!IsMale) CheckIfCanReproduce(world);

        var freeWill = Random.Shared.Next(0, 3);
        switch (freeWill)
        {
            case 1:
                if (IsLowHealth()) State = EnumHumanState.GoingToEat;
                break;
            case 2:          
                SearchForResource(world);
                break;
            default:
                WalkInRandomDirection(gameTime, world);
                break;
        }
        
    }

    private bool IsLowHealth()
    {
        return Health <= 30;
    }

    private void CheckIfCanReproduce(World world)
    {
        if (IsHealthy() && AgeInSecond - AgeSinceLastReproductionInSecond >= ReproductionCooldownInSecond)
        {
            Reproduce(world);
            AgeSinceLastReproductionInSecond = AgeInSecond;
        }
    }

    private void Reproduce(World world)
    {
        var newUnit = new UnitHuman
        {
            Position = this.Position,
        };
        world.AddUnit(newUnit);
        ReduceHealth(50);
    }

    public bool IsHealthy()
    {
        return Health >= 95;
    }

    public bool IsFullHealth()
    {
        return Health >= 100;
    }

    public void AddHealth(float amount)
    {
        Health = Math.Min(Health + amount, 100);
    }

    public void ReduceHealth(float amount)
    {
        Health = Math.Max(Health - amount, 0);
    }


    private void SearchForResource(World world)
    {
        if(Memory.ClosestTree != null)
        {
            State = EnumHumanState.WalkingToTree;
            return;
        }

        var localUnits = world.GetLocalUnits(Position);
        var trees = localUnits.FindAll(u => u is UnitTree);
        var closestTree = CustomMath.FindClosestUnit(Position, trees);

        if (closestTree != null){
            Memory.ClosestTree = (UnitTree)closestTree;
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

