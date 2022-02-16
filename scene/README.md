# CSCI 385 Program 2: Scene

## Running the Scene

To run the scene and see the various components in action clone this repo, open the and run the command `open scene.html`. The program will then open in your browser!

## Live Demo

Coming soon!

## Part 1: Drawing

![Drawing](./images/drawing.png)
### Design

Before I started the drawing I generated 3 random lists, `randomX`, `randomY`, and `randomScale`. This was done in `main()` rather than `drawSpace()` since the image is redraw approximately 60 times per second, so doing these calculations in `drawSpace()` made the stars look like they moving all over the page.

The stars are drawn twice to give a sense of dimension to the image. In the first loop the color, positioning, and size is given by
``` javaScript
        let randomColor = Math.random();
        glColor3f(0.937, 0.882, 0.0 + randomColor);
        glPushMatrix();
        glRotatef(180 * randomScale, 0.0, 0.0, 1.0);
        glTranslatef(randomX[i], randomY[i], 0.0);
        glScalef(randomScale[i], randomScale[i], randomScale[i]);

        STAR()
        glPopMatrix();
```

After the planet and rocket is drawn more stars are place, the positioning and scale is modified so the new stars are not in the same position as the originals:
```javaScript
        let randomColor = Math.random();
        glColor3f(0.937, 0.882, 0.0 + randomColor);
        glPushMatrix();
        glTranslatef(randomX[(i + 5) % 10], randomY[(i) % 10], 0.0);
        glScalef(randomScale[i] * 2, randomScale[i] * 2, randomScale[i] * 2); // so new stars are not in position of initial stars
        STAR()
        glPopMatrix();
```

The planets are simply scaled circles and the rocket is a combination of a square, a circle, and some triangles.

## Part 2: Recursive Drawing

## Part 3: Animation