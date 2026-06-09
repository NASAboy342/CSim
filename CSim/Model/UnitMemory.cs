using System;
using CSim.Enums;
using CSim.GameObjects;

namespace CSim.Model;

public class UnitMemory
{
    public UnitTree ClosestTree { get; set; }
    public UnitHumanHouse ClosestHouse { get; set; }
    public EnumResourceType CarryingResource { get; set; } = EnumResourceType.None;
}
