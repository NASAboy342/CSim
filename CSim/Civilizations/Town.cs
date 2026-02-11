using CSim.Entities;
using Microsoft.Xna.Framework;

namespace CSim.Civilizations;

public sealed class Town
{
    public Vector2 Position { get; }
    public RaceType Race { get; }

    public int Population { get; private set; }

    private float _populationTimer;
    private float _spawnTimer;

    private const float PopulationGrowSeconds = 5f;
    private const float SpawnIntervalSeconds = 8f;
    private const int MinPopulationToSpawn = 6;

    private bool _spawnQueued;

    private float _colonizationTimer;
    private const float ColonizationIntervalSeconds = 25f;
    private const int MinPopulationToColonize = 12;
    private bool _colonizationQueued;

    public Town(Vector2 position, RaceType race, int initialPopulation)
    {
        Position = position;
        Race = race;
        Population = initialPopulation;
    }

    public void Update(GameTime gameTime)
    {
        var delta = (float)gameTime.ElapsedGameTime.TotalSeconds;

        _populationTimer += delta;
        _spawnTimer += delta;
        _colonizationTimer += delta;

        if (_populationTimer >= PopulationGrowSeconds)
        {
            _populationTimer -= PopulationGrowSeconds;
            Population++;
        }

        if (Population >= MinPopulationToSpawn && _spawnTimer >= SpawnIntervalSeconds)
        {
            _spawnTimer -= SpawnIntervalSeconds;
            _spawnQueued = true;
        }

        if (Population >= MinPopulationToColonize && _colonizationTimer >= ColonizationIntervalSeconds)
        {
            _colonizationTimer -= ColonizationIntervalSeconds;
            _colonizationQueued = true;
        }
    }

    public bool TryDequeueSpawnPosition(out Vector2 position)
    {
        if (_spawnQueued)
        {
            _spawnQueued = false;
            position = Position;
            return true;
        }

        position = Vector2.Zero;
        return false;
    }

    public bool TryDequeueColonizationRequest(out Vector2 position)
    {
        if (_colonizationQueued)
        {
            _colonizationQueued = false;
            position = Position;
            return true;
        }

        position = Vector2.Zero;
        return false;
    }
}
