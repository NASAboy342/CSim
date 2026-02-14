using System.Collections.Generic;
using CSim.Entities;
using Microsoft.Xna.Framework;

namespace CSim.Spatial;

public sealed class EntityQuadtree
{
    private sealed class Node
    {
        public Rectangle Bounds;
        public readonly List<Entity> Items = new();
        public Node[]? Children;

        public Node(Rectangle bounds)
        {
            Bounds = bounds;
        }
    }

    private readonly int _capacity;
    private readonly int _maxDepth;
    private readonly Node _root;

    public EntityQuadtree(Rectangle bounds, int capacity = 8, int maxDepth = 6)
    {
        _capacity = capacity;
        _maxDepth = maxDepth;
        _root = new Node(bounds);
    }

    public void Clear()
    {
        Clear(_root);
    }

    private static void Clear(Node node)
    {
        node.Items.Clear();
        if (node.Children == null)
        {
            return;
        }

        foreach (var child in node.Children)
        {
            Clear(child);
        }

        node.Children = null;
    }

    public void Insert(Entity entity)
    {
        Insert(_root, entity, 0);
    }

    private void Insert(Node node, Entity entity, int depth)
    {
        var px = (int)entity.Position.X;
        var py = (int)entity.Position.Y;

        if (!node.Bounds.Contains(px, py))
        {
            return;
        }

        if (node.Children == null)
        {
            if (node.Items.Count < _capacity || depth >= _maxDepth || node.Bounds.Width <= 2 || node.Bounds.Height <= 2)
            {
                node.Items.Add(entity);
                return;
            }

            Subdivide(node);
        }

        if (node.Children != null)
        {
            foreach (var child in node.Children)
            {
                if (child.Bounds.Contains(px, py))
                {
                    Insert(child, entity, depth + 1);
                    return;
                }
            }
        }

        node.Items.Add(entity);
    }

    private void Subdivide(Node node)
    {
        var halfWidth = node.Bounds.Width / 2;
        var halfHeight = node.Bounds.Height / 2;

        if (halfWidth <= 0 || halfHeight <= 0)
        {
            return;
        }

        var x = node.Bounds.X;
        var y = node.Bounds.Y;

        node.Children = new[]
        {
            new Node(new Rectangle(x, y, halfWidth, halfHeight)),                         // NW
            new Node(new Rectangle(x + halfWidth, y, halfWidth, halfHeight)),            // NE
            new Node(new Rectangle(x, y + halfHeight, halfWidth, halfHeight)),           // SW
            new Node(new Rectangle(x + halfWidth, y + halfHeight, halfWidth, halfHeight))// SE
        };
    }

    public void QueryRange(Rectangle range, List<Entity> results)
    {
        QueryRange(_root, range, results);
    }

    private static void QueryRange(Node node, Rectangle range, List<Entity> results)
    {
        if (!node.Bounds.Intersects(range))
        {
            return;
        }

        foreach (var entity in node.Items)
        {
            var px = (int)entity.Position.X;
            var py = (int)entity.Position.Y;
            if (range.Contains(px, py))
            {
                results.Add(entity);
            }
        }

        if (node.Children == null)
        {
            return;
        }

        foreach (var child in node.Children)
        {
            QueryRange(child, range, results);
        }
    }

    public void CollectNodeBounds(List<Rectangle> bounds)
    {
        CollectNodeBounds(_root, bounds);
    }

    private static void CollectNodeBounds(Node node, List<Rectangle> bounds)
    {
        bounds.Add(node.Bounds);

        if (node.Children == null)
        {
            return;
        }

        foreach (var child in node.Children)
        {
            CollectNodeBounds(child, bounds);
        }
    }
}
