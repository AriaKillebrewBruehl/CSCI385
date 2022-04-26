# CSCI 385 Program 5: Cycle Subdivide :motorcycle:

## Running the Simulation

To run the simulation and play the game clone the repo. In your terminal navigate to the directory and run the command `open cycle-subdivide.html`. Press `p` to subdivide the surface and use the `i`, `j`, `k`, and `l` keys to control the cycle.


![Initial Curve](./images/default.png)
</p>
<p align = "center">
Fig.1 - The default subdivision surface
</p>

## Design Overview

### Part 1 Loop Subdivision

First I wrote the subdivision code such that no smoothing was performed but the topology of the new vertices, edges, and faces was correct. This was fairly straight forward. The new vertices were calculated and `v.clone` was updated for the existing vertices and `e.split` was updated for the midpoints. The new faces were calculated by using these points, see below.

```
             v1.clone
                / \
               / 1 \
              /     \
      e1.split-------e0.split
            / \     / \
           / 2 \ 3 / 0 \
          /     \ /     \
  v2.split----e2.split---v0.clone
```

Once the topology was correct I recalculated the cloned vertices and the edge splits. The splits are are a weighted average of the 4 points that surround it (see below) given by the equation `s = 3/8 p0 + 3/8 p1 + 1/8 q0 + 1/8 q1`.

```
   q0
   / \
  /   \
 /     \
p0--s--p1
 \     /
  \   /
   \ /
    q1
```

The clones were more complicated since we need to know how many vertex neighbors the vertex has. This was determined with the following loop

``` java
        var k = 1;
        var first = v.edge.target;
        var current = v.edge.prev.twin;

        while (current.target != first) {
            k += 1;
            current = current.prev.twin;
        }
```

Beta was calculated as `var b = (5/8) - (3/8 + (1/4)*Math.cos(2*Math.PI/k))**2;`. Then the summation of the weighted averages of all the neighbors was calculated as follows

``` java
        var i = 1;
        var sumx = 0.0;
        var sumy = 0.0;
        var sumz = 0.0;
        current = v.edge;
        while (i <= k) {
            sumx += (b/k) * current.target.position.x;
            sumy += (b/k) * current.target.position.y;
            sumz += (b/k) * current.target.position.z;
            current = current.prev.twin;
            i+=1;
        }

        var sx = (1 - b) * v.position.x + sumx;
        var sy = (1 - b) * v.position.y + sumy;
        var sz = (1 - b) * v.position.z + sumz;
```

The smooth vertices were used as the vertex clones and edge splits to create a proper subdivision.