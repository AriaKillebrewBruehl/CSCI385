# CSCI 385 Program 6: ONE-SHEET :kite:

## Running the Simulation

## Live Demo

Coming Soon!

## Design Overview

Part 1: Connecting the Masses :handshake:

In order to simulate the movement of the cloth each mass must be connected to its north, south, east, and west neighbors, its diagonal neighbors, and its north south east and west neighbors who are 2 away. When I first connected the masses I looped through the rows and columns and used `getMass(r, c)` to get each mass and connect it to its appropriate neighbors.

However I later realized that doing this would cause everything to be doubly connected. You would connect mass1 to its east neighbor mass2 and then connect mass2 to its west neighbor mass1. To prevent this I only connect each mass to its south and east neighbor, its northeast southeast neighbor, and its south and east neighbors two away.

```
  /mne
 /
m1---me
|\
| \mse
ms
```

Part 2: A Step in the Simulation :footprints:

A step in the simulation requires computing the masses position and velocity at time `t+h` given its position and velocity at time `t`. This is done following the standard algorithm

`P(t + h) = P(t) + hV(t)`
`V(t + h) = V(t) + hAcceleration`

However when this step is done we must have saved the previous positions and velocity by calling `saveState()` in the `update` function. `saveState()` simply sets `this.prevPosition` to `this.position` and `this.lastVelocity` to `this.velocity`. This function is also called in `reset()` so that when the user resets the simulation the saved states are correct.

Part 3: Acceleration :racing_car:

The `computeAcceleration` function find the acceleration of a mass. The force is computed by looping through all the springs attached to that mass and summing the force from the spring, the force of gravity, the force of wind and the drag (if the wind is blowing). Once the force is computed we divide force by the mass to get acceleration.

Part 4: Force of the Springs :fishing_pole_and_fish:



