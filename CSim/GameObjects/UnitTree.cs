
using System;
using System.Collections.Generic;
using System.Linq;
using CSim.Enums;
using Microsoft.Xna.Framework;
using Microsoft.Xna.Framework.Graphics;

namespace CSim.GameObjects;
public class UnitTree : Unit
{
    public List<EnumResourceType> AvailableResources { get; set; } = new List<EnumResourceType>();
    public bool IsAlive => AvailableResources.Count > 0;

    public UnitTree()
    {
        Width = 10;
        Height = 10;
        GenerateAvailableResources();
    }

    private void GenerateAvailableResources()
    {
        AvailableResources.Add(EnumResourceType.Wood);
        AvailableResources.Add(EnumResourceType.Wood);
        AvailableResources.Add(EnumResourceType.Wood);
        AvailableResources.Add(EnumResourceType.Food);
        AvailableResources.Add(EnumResourceType.Food);
    }

    public override void Draw(SpriteBatch spriteBatch, Texture2D pixel)
    {
        var shadowposition = Position + new Vector2(3, 3);
        var shadow = new Rectangle(shadowposition.ToPoint(), new Point(Width, Height));
        spriteBatch.Draw(pixel, shadow, Color.DarkGreen);

        var leaves = new Rectangle(Position.ToPoint(), new Point(Width, Height));
        spriteBatch.Draw(pixel, leaves, Color.Green);
    }

    internal EnumResourceType GetResource()
    {
        if (AvailableResources.Count == 0)
        {
            return EnumResourceType.None;
        }
        var resource = AvailableResources.LastOrDefault();
        AvailableResources.RemoveAt(AvailableResources.Count - 1);
        return resource;
    }

    public override bool IsNeedToDelete()
    {
        return !IsAlive;
    }
}