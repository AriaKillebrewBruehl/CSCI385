//
// Program 1: object showcase
//
// showcase.js
//
// CSCI 385: Computer Graphics, Reed College, Spring 2022
//
// This is a sample `opengl.js` program that displays a tetrahedron
// made up of triangular facets, and also a cube and a cylinder.
//
// The OpenGL drawing part of the code occurs in drawScene and that
// function relies on drawObject to do its work. There is a global
// variable showWhich that can be changed by the user (by pressing
// number keys handled by handleKey). The drawObject code calls
// glBeginEnd to draw the chosen object.
//
// Your assignment is to add these models to the showcase code:
//
// - Sphere: A faceted model of the surface of a sphere.
// - Torus:A faceted model of the surface of a torus.
// - Revolution: Some other *surfaces of revolution*.
// - Programmer's choice: either of the following:
//    - Terrain: A faceted model of some gridded terrain.
//    - Pasta: A faceted mode of some shape of pasta.
//
// FOr each of these, you'll write functions that describe the
// object in 3-space, modify drawObject to draw them, and modify
// the keyboard handler code in handleKey to allow the user to
// select and configure them.
//
// This is all described in the web document
//
//   http://jimfix.github.io/csci385/assignments/showcase.md.html
//


//
let orientation = quatClass.for_rotation(0.0, new vector(1.0,0.0,0.0));
let mouseStart  = {x: 0.0, y: 0.0};
let mouseDrag   = false;

//
let showWhich = 1;
//
let smoothness = 24;

function makeCube() {
    /*
     * This describes the facets of a cube
     */

    glBegin(GL_TRIANGLES,"Cube",true);
    // front
    glColor3f(0.5,0.5,0.0);
    glVertex3f(-0.5,-0.5, 0.5);
    glVertex3f( 0.5,-0.5, 0.5);
    glVertex3f( 0.5, 0.5, 0.5);

    glVertex3f( 0.5, 0.5, 0.5);
    glVertex3f(-0.5, 0.5, 0.5);
    glVertex3f(-0.5,-0.5, 0.5);

    // back
    glColor3f(0.5,0.5,1.0);
    glVertex3f(-0.5,-0.5,-0.5);
    glVertex3f( 0.5,-0.5,-0.5);
    glVertex3f( 0.5, 0.5,-0.5);

    glVertex3f( 0.5, 0.5,-0.5);
    glVertex3f(-0.5, 0.5,-0.5);
    glVertex3f(-0.5,-0.5,-0.5);

    // left
    glColor3f(1.0,0.5,0.5);
    glVertex3f(-0.5,-0.5,-0.5);
    glVertex3f(-0.5, 0.5,-0.5);
    glVertex3f(-0.5, 0.5, 0.5);

    glVertex3f(-0.5, 0.5, 0.5);
    glVertex3f(-0.5,-0.5, 0.5);
    glVertex3f(-0.5,-0.5,-0.5);

    // right
    glColor3f(0.0,0.5,0.5);
    glVertex3f( 0.5,-0.5,-0.5);
    glVertex3f( 0.5, 0.5,-0.5);
    glVertex3f( 0.5, 0.5, 0.5);

    glVertex3f( 0.5, 0.5, 0.5);
    glVertex3f( 0.5,-0.5, 0.5);
    glVertex3f( 0.5,-0.5,-0.5);

    // top
    glColor3f(0.5,1.0,0.5);
    glVertex3f(-0.5, 0.5,-0.5);
    glVertex3f( 0.5, 0.5,-0.5);
    glVertex3f( 0.5, 0.5, 0.5);

    glVertex3f( 0.5, 0.5, 0.5);
    glVertex3f(-0.5, 0.5, 0.5);
    glVertex3f(-0.5, 0.5,-0.5);

    // bottom
    glColor3f(0.5,0.0,0.5);
    glVertex3f(-0.5,-0.5,-0.5);
    glVertex3f( 0.5,-0.5,-0.5);
    glVertex3f( 0.5,-0.5, 0.5);

    glVertex3f( 0.5,-0.5, 0.5);
    glVertex3f(-0.5,-0.5, 0.5);
    glVertex3f(-0.5,-0.5,-0.5);

    //
    glEnd();
}

function makeCylinder() {
    /*
     * This describes the facets of a 24-sided cylindrical
     * object.
     */

    const width = 1.0;
    numFacets = smoothness;
    const dAngle = 2.0 * Math.PI / numFacets;

    glBegin(GL_TRIANGLES, "Cylinder", true);

    // Produce the top.
    for (let i = 0; i < numFacets; i += 1) {
        const aTop = dAngle * i;
        const xTop0 = Math.cos(aTop);
        const yTop0 = Math.sin(aTop);
        const xTop1 = Math.cos(aTop + dAngle);
        const yTop1 = Math.sin(aTop + dAngle);
	if (i % 2 == 0) {
	    glColor3f(0.25, 0.50, 0.75);
	} else {
	    glColor3f(0.50, 0.75, 0.80);
	}
	glVertex3f(  0.0,   0.0, width / 2.0);
        glVertex3f(xTop0, yTop0, width / 2.0);
        glVertex3f(xTop1, yTop1, width / 2.0);
    }

    // Produce the sides.
    for (let i = 0; i < numFacets; i += 1) {
        const aMid = dAngle * i;
        const xMid0 = Math.cos(aMid);
        const yMid0 = Math.sin(aMid);
        const xMid1 = Math.cos(aMid + dAngle);
        const yMid1 = Math.sin(aMid + dAngle);

	glColor3f(0.25, 0.50, 0.75);
        glVertex3f(xMid0, yMid0,  width / 2.0);
        glVertex3f(xMid0, yMid0, -width / 2.0);
        glVertex3f(xMid1, yMid1, -width / 2.0);

	glColor3f(0.50, 0.75, 0.80);
        glVertex3f(xMid0, yMid0,  width / 2.0);
        glVertex3f(xMid1, yMid1, -width / 2.0);
        glVertex3f(xMid1, yMid1,  width / 2.0);

    }

    // Produce the bottom.
    for (let i = 0; i < numFacets; i += 1) {
        const aBottom = dAngle * i;
        const xBottom0 = Math.cos(aBottom);
        const yBottom0 = Math.sin(aBottom);
        const xBottom1 = Math.cos(aBottom + dAngle);
        const yBottom1 = Math.sin(aBottom + dAngle);
	if (i % 2 == 0) {
	    glColor3f(0.25, 0.50, 0.75);
	} else {
	    glColor3f(0.50, 0.75, 0.80);
	}
	glVertex3f(     0.0,      0.0, -width / 2.0);
        glVertex3f(xBottom0, yBottom0, -width / 2.0);
        glVertex3f(xBottom1, yBottom1, -width / 2.0);
    }

    glEnd();
}

function getY(i, numFacets) {
    let step = 1/numFacets;
    let X = i * step * 2;
    let Y = Math.sqrt(1 - X**2);
    return Y;
}

function makeSphere(){
    /*
     * This describes the facets of a sphere
     * object.
     */

    let width = 1.0;
    numFacets = smoothness;
    const dAngle = 2.0 * Math.PI / numFacets;

    glBegin(GL_TRIANGLES, "Sphere", true);

    for (let i = 0; i < numFacets / 2; i += 1) {
        for (let j = 0; j < numFacets; j += 1) {
            const aMid = dAngle * j;
            const xMid0 = Math.cos(aMid) * getY(i, numFacets);
            const yMid0 = Math.sin(aMid) * getY(i, numFacets);
            const xMid1 = Math.cos(aMid + dAngle) * getY(i, numFacets);
            const yMid1 = Math.sin(aMid + dAngle) * getY(i, numFacets);
            const xMid2 = Math.cos(aMid) * getY(i + 1, numFacets);
            const yMid2 = Math.sin(aMid) * getY(i + 1, numFacets);
            const xMid3 = Math.cos(aMid + dAngle) * getY(i + 1, numFacets);
            const yMid3 = Math.sin(aMid + dAngle) * getY(i + 1, numFacets);

        // red
        glColor3f(1.0, 0.00, 0.00);
            glVertex3f(xMid0, yMid0 ,  width / numFacets + (1/numFacets) * 2*i);
            glVertex3f(xMid0, yMid0 , -width / numFacets + (1/numFacets) * 2*i);
            glVertex3f(xMid1, yMid1 , -width / numFacets + (1/numFacets) * 2*i);
        // blue
        glColor3f(0.00, 0.00, 1.00);
            glVertex3f(xMid0, yMid0 ,  width / numFacets + (1/numFacets) * 2*i);
            glVertex3f(xMid1, yMid1 , -width / numFacets + (1/numFacets) * 2*i);
            glVertex3f(xMid1, yMid1 ,  width / numFacets + (1/numFacets) * 2*i);
        // green diag
        glColor3f(0.00, 1.00, 0.00);
            glVertex3f(xMid0, yMid0 ,  width / numFacets + (1/numFacets) * 2*i);
            glVertex3f(xMid1, yMid1 , width / numFacets + (1/numFacets) * 2*i);
            glVertex3f(xMid2, yMid2, - width / numFacets + (1/numFacets) * 2*(i+1));
        // black diag
        glColor3f(0.00, 0.00, 0.00);
            glVertex3f(xMid2, yMid2 , -width / numFacets + (1/numFacets) * 2*(i+1));
            glVertex3f(xMid3, yMid3 , -width / numFacets + (1/numFacets) * 2*(i+1));
            glVertex3f(xMid1, yMid1 ,  width / numFacets + (1/numFacets) * 2*i);
        // red lower
        glColor3f(1.0, 0.00, 0.00);
            glVertex3f(xMid0, yMid0 ,  width / numFacets - (1/numFacets) * 2*i);
            glVertex3f(xMid0, yMid0 , -width / numFacets - (1/numFacets) * 2*i);
            glVertex3f(xMid1, yMid1 , -width / numFacets - (1/numFacets) * 2*i);
        // blue lower
        glColor3f(0.00, 0.00, 1.00);
            glVertex3f(xMid0, yMid0 ,  width / numFacets - (1/numFacets) * 2*i);
            glVertex3f(xMid1, yMid1 , -width / numFacets - (1/numFacets) * 2*i);
            glVertex3f(xMid1, yMid1 ,  width / numFacets - (1/numFacets) * 2*i);
        // green diag lower
         glColor3f(0.00, 1.00, 0.00);
            glVertex3f(xMid0, yMid0 , -width / numFacets - (1/numFacets) * 2*i);
            glVertex3f(xMid1, yMid1 , -width / numFacets - (1/numFacets) * 2*i);
            glVertex3f(xMid2, yMid2, width / numFacets - (1/numFacets) * 2*(i+1));
        // black diag lower
        glColor3f(0.00, 0.00, 0.00);
            glVertex3f(xMid1, yMid1 , - width / numFacets - (1/numFacets) * 2*i);
            glVertex3f(xMid3, yMid3, - width / numFacets - (1/numFacets) * 2*i);
            glVertex3f(xMid2, yMid2 , - width / numFacets - (1/numFacets) * 2*i);

        }
    }
    glEnd();
}

function makeTaurus() {
    /*
     * This describes the facets of a taurus
     * object.
     */

    let width = 1.0;
    numFacets = smoothness;
    const dAngle = 2.0 * Math.PI / numFacets;

    glBegin(GL_TRIANGLES, "Taurus", true);

    // Produce the sides.
    for (let i = 0; i < numFacets; i += 1) {
        const aMid = dAngle * i;
        const xMid0 = Math.cos(aMid) * 0.25;
        const yMid0 = Math.sin(aMid) * 0.25;
        const xMid1 = Math.cos(aMid + dAngle) * 0.25;
        const yMid1 = Math.sin(aMid + dAngle) * 0.25;

	glColor3f(0.80, 0.50, 0.75);
        glVertex3f(xMid0, yMid0,  width / 2.0 );
        glVertex3f(xMid0, yMid0, -width / 2.0);
        glVertex3f(xMid1, yMid1, -width / 2.0);

	glColor3f(0.90, 0.75, 0.80);
        glVertex3f(xMid0, yMid0,  width / 2.0);
        glVertex3f(xMid1, yMid1, -width / 2.0);
        glVertex3f(xMid1, yMid1,  width / 2.0);

    }

    glEnd();

}


// function makeBand() {
//     const numFacets = 24;
//     glBegin(GL_TRIANGLE_STRIP, "Band", true);
//     for (let i = 0; i <= numFacets; i += 1) {
//         const a = 2.0 * Math.PI * i / numFacets;
//         let x = Math.cos(a);
//         let y = Math.sin(a);
// 	if (i % 2 == 0) {
// 	    glColor3f(1.0,1.0,1.0);
// 	} else {
// 	    glColor3f(1.0,1.0,1.0);
// 	}
//         glVertex3f( 2 * x,  2 * y, 0.5);
//         glVertex3f( x,  y,-0.5);
//     }
//     glEnd();
// }

function makeBand() {
    const numFacets = 24;
    glBegin(GL_TRIANGLE_STRIP, "Band", true);
    for (let i = 0; i <= numFacets; i += 1) {
        const a = 2.0 * Math.PI * i / numFacets;
        let x = Math.cos(a);
        let y = Math.sin(a);
        let dx = (1 / numFacets) * 1;
        let slope = 2.0 * Math.PI / 8;
	if (i % 2 == 0) {
	    glColor3f(1.0,1.0,1.0);
	} else {
	    glColor3f(0.0,0.0,0.0);
	}
        glVertex3f( x + dx,  y, 0);
        glVertex3f( x + dx,  y, (1 + dx) * Math.sin(slope));

    }
    glEnd();
}

function makeTetra() {

    // This describes the facets of a tetrahedron whose
    // vertices sit at 4 of the 8 corners of the
    // of the cube volume [-1,1] x [-1,1] x [-1,1].
    //
    // It's an example of GL_TRIANGLES.
    //

    // Draw all the triangular facets.
    glBegin(GL_TRIANGLES,"Tetra",true);

    // The three vertices are +-+ ++- -++ ---

    // all but ---
    glColor3f(1.0,1.0,0.0);
    glVertex3f( 1.0,-1.0, 1.0);
    glVertex3f( 1.0, 1.0,-1.0);
    glVertex3f(-1.0, 1.0, 1.0);
    // all but ++-
    glColor3f(0.0,1.0,1.0);
    glVertex3f( 1.0,-1.0, 1.0);
    glVertex3f(-1.0, 1.0, 1.0);
    glVertex3f(-1.0,-1.0,-1.0);
    // all but -++
    glColor3f(1.0,0.0,1.0);
    glVertex3f(-1.0,-1.0,-1.0);
    glVertex3f( 1.0, 1.0,-1.0);
    glVertex3f( 1.0,-1.0, 1.0);
    // all but +-+
    glColor3f(1.0,1.0,1.0);
    glVertex3f( 1.0, 1.0,-1.0);
    glVertex3f(-1.0,-1.0,-1.0);
    glVertex3f(-1.0, 1.0, 1.0);

    glEnd();
}

function makeQuarterSphere() {
//     /*
//      * This describes the facets of a sphere
//      * object.
//      */

//     let width = 1.0;
//     numFacets = smoothness;
//     const dAngle = 2.0 * Math.PI / numFacets;

//     glBegin(GL_TRIANGLES, "quarterSphere", true);

//     for (let i = 0; i < numFacets / 2; i += 1) {
//         for (let j = 0; j < numFacets; j += 1) {
//             const aMid = dAngle * j;
//             const xMid0 = Math.cos(aMid) * getY(i, numFacets);
//             const yMid0 = Math.sin(aMid) * getY(i, numFacets);
//             const xMid1 = Math.cos(aMid + dAngle) * getY(i, numFacets);
//             const yMid1 = Math.sin(aMid + dAngle) * getY(i, numFacets);
//             const xMid2 = Math.cos(aMid) * getY(i + 1, numFacets);
//             const yMid2 = Math.sin(aMid) * getY(i + 1, numFacets);
//             const xMid3 = Math.cos(aMid + dAngle) * getY(i + 1, numFacets);
//             const yMid3 = Math.sin(aMid + dAngle) * getY(i + 1, numFacets);

//         // red
//         glColor3f(1.0, 0.00, 0.00);
//             glVertex3f(xMid0, yMid0 ,  width / numFacets + (1/numFacets) * 2*i);
//             glVertex3f(xMid0, yMid0 , -width / numFacets + (1/numFacets) * 2*i);
//             glVertex3f(xMid1, yMid1 , -width / numFacets + (1/numFacets) * 2*i);
//         // blue
//         glColor3f(0.00, 0.00, 1.00);
//             glVertex3f(xMid0, yMid0 ,  width / numFacets + (1/numFacets) * 2*i);
//             glVertex3f(xMid1, yMid1 , -width / numFacets + (1/numFacets) * 2*i);
//             glVertex3f(xMid1, yMid1 ,  width / numFacets + (1/numFacets) * 2*i);
//         // green diag
//         glColor3f(0.00, 1.00, 0.00);
//             glVertex3f(xMid0, yMid0 ,  width / numFacets + (1/numFacets) * 2*i);
//             glVertex3f(xMid1, yMid1 , width / numFacets + (1/numFacets) * 2*i);
//             glVertex3f(xMid2, yMid2, - width / numFacets + (1/numFacets) * 2*(i+1));
//         // black diag
//         glColor3f(0.00, 0.00, 0.00);
//             glVertex3f(xMid2, yMid2 , -width / numFacets + (1/numFacets) * 2*(i+1));
//             glVertex3f(xMid3, yMid3 , -width / numFacets + (1/numFacets) * 2*(i+1));
//             glVertex3f(xMid1, yMid1 ,  width / numFacets + (1/numFacets) * 2*i);
//         }
//     }
//     glEnd();
}
function makeLasagne() {

    //glBeginEnd("quarterSphere");
}

function drawObject() {

    /*
     * Draw the object selected by the user.
     */

    if (showWhich == 1) {
	glBeginEnd("Tetra");
    }
    if (showWhich == 2) {
	glBeginEnd("Cube");
    }
    if (showWhich == 3) {
	glBeginEnd("Cylinder");
    }
    if (showWhich == 4) {
    glBeginEnd("Sphere");
    }
    if (showWhich == 5) {
        glBeginEnd("Taurus");
    }
    if (showWhich == 6) {
        glColor3f(0.4,0.2,0.5);
	    glBeginEnd("Band");
    }
    if (showWhich == 7) {
        makeLasagne();
    }

}

function drawScene() {
    /*
     * Issue GL calls to draw the scene.
     */

    // Clear the rendering information.
    glClearColor(0.2,0.2,0.3);
    glClear(GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT);
    glEnable(GL_DEPTH_TEST);

    // Clear the transformation stack.
    glMatrixMode(GL_MODELVIEW);
    glLoadIdentity();

    // Transform the object by a rotation.
    orientation.glRotatef();

    // Draw the object.
    glPushMatrix();
    glScalef(0.5,0.5,0.5);
    drawObject();
    glPopMatrix();

    // Render the scene.
    glFlush();

}

function handleKey(key, x, y) {
    /*
     * Handle a keypress.
     */

    //
    // Handle object selection.
    //
    console.log(key);
    if (key == '1') {
        showWhich = 1
    }
    //
    if (key == '2') {
        showWhich = 2
    }
    //
    if (key == '3') {
        showWhich = 3
    }
    //
    if (key == '4') {
        showWhich = 4
    }
    if(key == '5') {
        showWhich = 5;
    }
    if (key == '6') {
        showWhich = 6;
    }
    if (key == 'L') {
        showWhich = 7;
    }
    if (key == '+') {
        smoothness += 2;
        makeSmoother()
    }
    //
    if (key == '-') {
        smoothness -= 2;
        makeSmoother();
    }

    //

    glutPostRedisplay();
}

function worldCoords(mousex, mousey) {
    /*
     * Compute the world/scene coordinates associated with
     * where the mouse was clicked.
     */

    const pj = mat4.create();
    glGetFloatv(GL_PROJECTION_MATRIX,pj);
    const pj_inv = mat4.create();
    mat4.invert(pj_inv,pj);
    const vp = [0,0,0,0];
    glGetIntegerv(GL_VIEWPORT,vp);
    const mousecoords = vec4.fromValues(2.0*mousex/vp[2]-1.0,
					1.0-2.0*mousey/vp[3],
					0.0, 1.0);
    vec4.transformMat4(location,mousecoords,pj_inv);
    return {x:location[0], y:location[1]};
}

function handleMouseClick(button, state, x, y) {
    /*
     * Records the location of a mouse click in
     * world/scene coordinates.
     */

    // Start tracking the mouse for trackball motion.
    mouseStart  = worldCoords(x,y);
    mouseButton = button;
    if (state == GLUT_DOWN) {
	mouseDrag = true;
    } else {
	mouseDrag = false;
    }
    glutPostRedisplay()
}

function handleMouseMotion(x, y) {
    /*
     * Reorients the object based on the movement of a mouse drag.
     *
     * Uses last and current location of mouse to compute a trackball
     * rotation. This gets stored in the quaternion orientation.
     *
     */

    // Capture mouse's position.
    mouseNow = worldCoords(x,y)

    // Update object/light orientation based on movement.
    dx = mouseNow.x - mouseStart.x;
    dy = mouseNow.y - mouseStart.y;
    axis = (new vector(-dy,dx,0.0)).unit()
    angle = Math.asin(Math.min(Math.sqrt(dx*dx+dy*dy),1.0))
    orientation = quatClass.for_rotation(angle,axis).times(orientation);

    // Ready state for next mouse move.
    mouseStart = mouseNow;

    // Update window.
    glutPostRedisplay()
}

function resizeWindow(w, h) {
    /*
     * Register a window resize by changing the viewport.
     */
    glViewport(0, 0, w, h);
    glMatrixMode(GL_PROJECTION);
    glLoadIdentity();
    if (w > h) {
        glOrtho(-w/h, w/h, -1.0, 1.0, -1.0, 1.0);
    } else {
        glOrtho(-1.0, 1.0, -h/w * 1.0, h/w * 1.0, -1.0, 1.0);
    }
    glutPostRedisplay();
}

function makeSmoother() {
    makeCylinder();
    makeSphere();
    makeTaurus();
    makeBand();
    makeLasagne();
    makeQuarterSphere();
}

function main() {
    /*
     * The main procedure, sets up GL and GLUT.
     */

    // set up GL/UT, its canvas, and other components.
    glutInitDisplayMode(GLUT_SINGLE | GLUT_RGB | GLUT_DEPTH);
    glutInitWindowPosition(0, 20);
    glutInitWindowSize(360, 360);
    glutCreateWindow('object showcase' )
    resizeWindow(360, 360); // It seems to need this.

    // Build the renderable objects.
    makeTetra();
    makeCube();
    makeCylinder();
    makeSphere();
    makeTaurus();
    makeBand();
    makeLasagne();
    makeQuarterSphere();

    // Register interaction callbacks.
    glutKeyboardFunc(handleKey);
    glutReshapeFunc(resizeWindow);
    glutDisplayFunc(drawScene);
    glutMouseFunc(handleMouseClick)
    glutMotionFunc(handleMouseMotion)

    // Go!
    glutMainLoop();

    return 0;
}

glRun(main,true);
