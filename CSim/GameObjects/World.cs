using System;
using System.Collections.Generic;
using CSim.Enums;
using CSim.Helpers;
using CSim.Model;
using Microsoft.Xna.Framework;
using Microsoft.Xna.Framework.Graphics;

namespace CSim.GameObjects;

public class World
{
    public int Width { get; set; } = 500;
    public int Height { get; set; } = 500;
    public int CellSize { get; set; } = 8;
    public int Seed { get; set; } = 1337;
    public float Frequency { get; set; } = 0.02f;
    public List<List<int>> Terrain { get; set; } = new List<List<int>>();
    public List<Unit> Units { get; set; } = new List<Unit>();
    private List<Unit> PendingDeleteUnits { get; set; } = new List<Unit>();

    public World()
    {
        Seed = new Random().Next();
        GenerateTerrain();
        GenerateResources();
    }

    private void GenerateResources()
    {
        var totalTrees = 2000;
        for (int i = 0; i < totalTrees; i++)
        {
            var newTree = new UnitTree();
            newTree.Position = GetRandomPositionAboveWaterAndBelowRockyMount();
            Units.Add(newTree);
        }
    }

    private Vector2 GetRandomPositionAboveWaterAndBelowRockyMount()
    {
        while (true)
        {
            var newPosition = new Vector2(Random.Shared.Next(0, Width * CellSize), Random.Shared.Next(0, Height * CellSize));
            var terrainX = (int)(newPosition.X / CellSize);
            var terrainY = (int)(newPosition.Y / CellSize);

            var terrainType = GetTerrainType(Terrain[terrainX][terrainY]);

            if (terrainType.Type != EnumTerrainType.Water && terrainType.Type != EnumTerrainType.DeepWater && terrainType.Type != EnumTerrainType.Mountain && terrainType.Type != EnumTerrainType.Snow)
            {
                return newPosition;
            }
        }
    }

    private Vector2 GetRandomPositionAboveWater()
    {
        while (true)
        {
            var newPosition = new Vector2(Random.Shared.Next(0, Width * CellSize), Random.Shared.Next(0, Height * CellSize));
            var terrainX = (int)(newPosition.X / CellSize);
            var terrainY = (int)(newPosition.Y / CellSize);

            var terrainType = GetTerrainType(Terrain[terrainX][terrainY]);

            if (terrainType.Type != EnumTerrainType.Water && terrainType.Type != EnumTerrainType.DeepWater)
            {
                return newPosition;
            }
        }
    }

    public void GenerateTerrain()
    {
        Terrain.Clear();

        var noise = new FastNoiseLite(Seed);
        noise.SetNoiseType(FastNoiseLite.NoiseType.Perlin);
        noise.SetFrequency(Frequency);

        for (int x = 0; x < Width; x++)
        {
            Terrain.Add(new List<int>(Height));
            for (int y = 0; y < Height; y++)
            {
                float n = noise.GetNoise(x, y);
                int brightness = (int)Math.Clamp((n + 1f) * 50f, 0f, 100f);
                Terrain[x].Add(brightness);
            }
        }
    }

    public void Draw(SpriteBatch spriteBatch, Texture2D pixel, Rectangle viewBounds)
    {
        if (Terrain.Count == 0)
        {
            return;
        }

        DrawTerrain(spriteBatch, pixel, viewBounds);
        DrawAllUnits(spriteBatch, pixel, viewBounds);
    }

    private void DrawAllUnits(SpriteBatch spriteBatch, Texture2D pixel, Rectangle viewBounds)
    {
        foreach (var unit in Units)
        {
            var isUnitOutOfView = unit.Position.X + unit.Width < viewBounds.X || unit.Position.X > viewBounds.Right ||
                                    unit.Position.Y + unit.Height < viewBounds.Y || unit.Position.Y > viewBounds.Bottom;
            if (isUnitOutOfView) continue;
            unit.Draw(spriteBatch, pixel);
        }
    }

    private void DrawTerrain(SpriteBatch spriteBatch, Texture2D pixel, Rectangle viewBounds)
    {
        int gridWidth = Terrain.Count;
        int gridHeight = Terrain[0].Count;

        int startX = Math.Max(0, viewBounds.X / CellSize);
        int startY = Math.Max(0, viewBounds.Y / CellSize);
        int endX = Math.Min(gridWidth, (viewBounds.Right / CellSize) + 2);
        int endY = Math.Min(gridHeight, (viewBounds.Bottom / CellSize) + 2);

        for (int x = startX; x < endX; x++)
        {
            for (int y = startY; y < endY; y++)
            {
                var rect = new Rectangle(x * CellSize, y * CellSize, CellSize, CellSize);
                var elevation = Terrain[x][y];
                var terrainType = GetTerrainType(elevation);
                spriteBatch.Draw(pixel, rect, terrainType.Color);
            }
        }
    }

    private TerrainType GetTerrainType(int elevation)
    {
        if (elevation < 35)
        {
            return new TerrainType { Type = EnumTerrainType.DeepWater, Color = Color.DarkBlue };
        }
        else if (elevation < 40)
        {
            return new TerrainType { Type = EnumTerrainType.Water, Color = Color.Blue };
        }
        else if (elevation < 43)
        {
            return new TerrainType { Type = EnumTerrainType.Sand, Color = Color.SandyBrown };
        }
        else if (elevation < 60)
        {
            return new TerrainType { Type = EnumTerrainType.Grass, Color = Color.Green };
        }
        else if (elevation < 80)
        {
            return new TerrainType { Type = EnumTerrainType.Forest, Color = Color.DarkGreen };
        }
        else if (elevation < 83)
        {
            return new TerrainType { Type = EnumTerrainType.Mountain, Color = Color.Gray };
        }
        else
        {
            return new TerrainType { Type = EnumTerrainType.Snow, Color = Color.White };
        }
    }

    public void AddUnit(Unit newUnit)
    {
        Units.Add(newUnit);
    }

    internal void Update(GameTime gameTime)
    {
        foreach (var unit in Units)
        {
            unit.Update(gameTime, this);
            if (unit.IsNeedToDelete())
            {
                PendingDeleteUnits.Add(unit);
            }
        }

        foreach (var unit in PendingDeleteUnits)
        {
            Units.Remove(unit);
        }
        PendingDeleteUnits.Clear();
    }

    public List<Unit> GetLocalUnits(Vector2 position)
    {
        var localUnits = new List<Unit>();
        foreach (var unit in Units)
        {
            var isUnitLocal = CustomMath.GetDistance(position, unit.Position) < 100f;
            if (isUnitLocal)
            {
                localUnits.Add(unit);
            }
        }
        return localUnits;
    }

    internal Unit GetUnitAtPosition(Vector2 mousePos)
    {
        foreach (var unit in Units)
        {
            if (unit.IsMouseOverBound(mousePos))
            {
                return unit;
            }
        }
        return null;
    }

    internal void RemoveUnit(Unit unit)
    {
        Units.Remove(unit);
    }
}
