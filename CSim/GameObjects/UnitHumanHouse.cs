using System;
using System.Collections.Generic;
using System.Linq;
using CSim.Enums;
using Microsoft.Xna.Framework;
using Microsoft.Xna.Framework.Graphics;

namespace CSim.GameObjects;

public class UnitHumanHouse : Unit
{
    public List<EnumResourceType> StoredResources { get; set; } = new List<EnumResourceType>();
    public UnitHumanHouse()
    {
        Width = 16;
        Height = 16;
    }

    public override void Draw(SpriteBatch spriteBatch, Texture2D pixel)
    {
        spriteBatch.Draw(pixel, new Rectangle((int)Position.X, (int)Position.Y, Width, Height), Color.Brown);
    }

    internal void ReceiveResource(EnumResourceType carryingResource)
    {
        StoredResources.Add(carryingResource);
    }

    internal EnumResourceType ProvideFood()
    {
        if (StoredResources.Where(r => r == EnumResourceType.Food).Count() == 0) return EnumResourceType.None;

        var resource = StoredResources.First(r => r == EnumResourceType.Food);
        StoredResources.Remove(resource);
        return resource;
    }
}
