using NUnit.Framework;
using System.Collections.Generic;
using System.Linq;
using UnityEngine;

public class PipeSpawner : MonoBehaviour
{
    public GameObject pipePrefab; 
    public float spawnProbability; 
    public float pipeHightVariation;
    public GameObject objectThatLocatedAtTheMinimumDistanceFromThePipeSpawnPoint;
    public GameObject objectThatLocatedAtThePointWherePipeNeedToBeRemove;

    private List<GameObject> spawnedPipes = new List<GameObject>();
    // Start is called once before the first execution of Update after the MonoBehaviour is created
    void Start()
    {
        
    }

    // Update is called once per frame
    void Update()
    {
        CheckToSpawnNextPipe();
        CheckToDeletOutOfViewPipes();
    }

    private void CheckToDeletOutOfViewPipes()
    {
        if (IsPipeNotSpawnedYet())
        {
            return;
        }

        var oldestSpawnedPipe = spawnedPipes.FirstOrDefault();

        if (oldestSpawnedPipe.transform.position.x < objectThatLocatedAtThePointWherePipeNeedToBeRemove.transform.position.x)
        {
            DeletPipe(oldestSpawnedPipe);
        }
    }

    private void DeletPipe(GameObject oldestSpawnedPipe)
    {
        spawnedPipes.Remove(oldestSpawnedPipe);
        Destroy(oldestSpawnedPipe);
    }

    private void CheckToSpawnNextPipe()
    {
        if (IsCanSpawnNextPipe() && Random.value < spawnProbability)
        {
            SpwanPipe();
        }
    }

    private void SpwanPipe()
    {
        var variation = Random.Range(-1.0f, 1.0f) * pipeHightVariation;
        spawnedPipes.Add(Instantiate(pipePrefab, new Vector3(transform.position.x, transform.position.y + variation, transform.position.z), Quaternion.identity));
    }

    private bool IsCanSpawnNextPipe()
    {
        if (IsPipeNotSpawnedYet())
        {
            return true;
        }

        var lastSpawnedPipe = spawnedPipes.LastOrDefault();

        if (lastSpawnedPipe.transform.position.x < objectThatLocatedAtTheMinimumDistanceFromThePipeSpawnPoint.transform.position.x)
        {
            return true;
        }
        return false;
    }

    private bool IsPipeNotSpawnedYet()
    {
        return spawnedPipes.Count == 0;
    }
}
