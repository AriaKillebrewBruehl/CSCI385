//
// Program 2: make a scene
//
// scene.js
//
// CSCI 385: Computer Graphics, Reed College, Spring 2022
//
// This is a sample `opengl.js` program that displays a scene of a house,
// a waving arm and hand, and a recursively drawn Sierpinski carpet.
//
// The OpenGL drawing part of the code occurs in draw and that
// function relies on several helper functions to do its work.
// There is a `drawHouse`, a `drawWavingArm`, and a `drawSquarepinski`
// function to draw each figure.
//
// Your assignment is to change the three scenes to the following:
//
// - Scene: draw a scene different than the house
// - Recursive: draw a different fractal
// - Animation: draw a different animation of some articulated figure
//
// For each of these, you'll write functions that describe their
// components in 2-space and 3-space. Then in their `draw...` functions
// you'll use `glTranslatef`, `glRotatef`, and `glScalef` calls to
// place, orient, and scale each component that's drawn.
//
// Your drawings will be hierarchical and rely on a transformation
// stack to layout a component and its subcomponents. You'll use
// calls to `glPushMatrix` and `glPopMatrix` to control the stack,
// saving and restoring where you are working in the scene or figure.
//
// This is all described in the web document
//
//   http://jimfix.github.io/csci385/assignments/scene.html
//
let orientation = quatClass.for_rotation(0.0, new vector(1.0,0.0,0.0));
let mouseStart  = {x: 0.0, y: 0.0};
let mouseDrag   = false;

var recursiveLevels = 3;
var treeAngle1 = -30;
var treeAngle2 = -30;
var scene = "scene";
var sunLocation = {x: -1.5, y: 1.0};

var lastw = 800;
var lasth = 640;

// const variables for drawing
const randomX = [];
const randomY = [];
const randomScale = [];

// variables for luxo
let n = 12;
let r0 = 1;
let r1 = 0.35;
let lightOn = true;

function setLevel(level) {
    recursiveLevels = level;
    // Redraw.
    glutPostRedisplay();
}

function setAngle1(angle) {
    treeAngle1 = angle;
    // Redraw.
    glutPostRedisplay();
}

function setAngle2(angle) {
    treeAngle2 = angle;
    // Redraw.
    glutPostRedisplay();
}

function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
  }

// makeStar():
//
// Makes a unit regular star centered at the origin.
//
function makeStar() {
    const r0 = 0.1;
    const r1 = 0.5;

    const dAngle0 = 2.0 * Math.PI / 5;
    const dAngle1 = 2.0 * Math.PI / 10;

    glBegin(GL_TRIANGLES, "Star");
    console.log("hi");
    for (let j = 0; j < 5; j += 1) {
        const currentAngle0 = dAngle0 * j;
        const currentAngle1 = dAngle1 * (2 * j + 1);

        // standard star
        let u00 = r0 * Math.cos(currentAngle0);
        let v00 = r0 * Math.sin(currentAngle0);
        let w00 = 0;

        let u01 = r1 * Math.cos(currentAngle1);
        let v01 = r1 * Math.sin(currentAngle1);
        let w01 = 0;

        let u10 = 0;
        let v10 = 0;
        let w10 = 0;

        let u11 = r0 * Math.cos(currentAngle0 + 2 * dAngle1);
        let v11 = r0 * Math.sin(currentAngle0 + 2 * dAngle1);
        let w11 = 0;

        glVertex3f(u00, v00, w00);
        glVertex3f(u01, v01, w01);
        glVertex3f(u10, v10, w00);

        glVertex3f(u10, v10, w10);
        glVertex3f(u01, v01, w01);
        glVertex3f(u11, v11, w11);

    }

    glEnd();

}

// STAR
//
// Draws an star whose corner is at the origin
// and whose radius is along the +x and +y axes with unit length.
//
function STAR() {
    glBeginEnd("Star");
}

// ROCKET
//
// Below are a set of procedures for drawing a rocket
//
function ROCKET() {
    // Body
    glColor3f(0.0, 0.0, 0.0);
    glPushMatrix();
    glScalef(0.5, 0.5, 0.5);
    RECT()
    glPopMatrix();
    // Window
    glPushMatrix();
    glColor3f(1.0, 1.0, 1.0);
    glTranslatef(0.25, 0.60, 0.0);
    glScalef(0.2, 0.2, 0.2);
    DISK();
    glPopMatrix();
    // Top
    glPushMatrix();
    glColor3f(0.0, 0.0, 0.0);
    glTranslatef(0.25, 1.0 + Math.sqrt(2.0) / 2, 0.0);
    glScalef(0.5, 1.0, 0.0);
    glRotatef(-135,0.0,0.0,1.0)
    RTRI();
    glPopMatrix();
    // Flames
    glPushMatrix();
    glScalef(0.5, 0.75, 0.5);
    const flameColors = [[0.925, 0.403, 0.023], [0.925, 0.313, 0.023], [0.925, 0.494, 0.023]];
    for (let i = 0; i < 5; i+= 1) {
    if (i != 0) {
    glPushMatrix();
    glScalef(0.2, -1.0, 0.0);
    glTranslatef(i, 0.0, 0.0);
    glColor3f(flameColors[i % 3][0], flameColors[i % 3][1], flameColors[i % 3][2]);
    RTRI();
    glPopMatrix();

    glPushMatrix();
    glScalef(-0.2, -1.0, 0.0);
    glTranslatef(-i, 0.0, 0.0);
    glColor3f(flameColors[(i + 1) % 3][0], flameColors[(i + 1) % 3][1], flameColors[(i + 1) % 3][2]);
    RTRI();
    glPopMatrix();
    }
    }
    glPopMatrix();
}

function makeWireCube() {
    glBegin(GL_LINES, "WireCube");

    // front-back
    glVertex3f( 0.5, 0.5, 0.5);
    glVertex3f( 0.5, 0.5,-0.5);

    glVertex3f( 0.5,-0.5, 0.5);
    glVertex3f( 0.5,-0.5,-0.5);

    glVertex3f(-0.5,-0.5, 0.5);
    glVertex3f(-0.5,-0.5,-0.5);

    glVertex3f(-0.5, 0.5, 0.5);
    glVertex3f(-0.5, 0.5,-0.5);


    // side-side
    glVertex3f(-0.5, 0.5, 0.5);
    glVertex3f( 0.5, 0.5, 0.5);

    glVertex3f(-0.5, 0.5,-0.5);
    glVertex3f( 0.5, 0.5,-0.5);

    glVertex3f(-0.5,-0.5,-0.5);
    glVertex3f( 0.5,-0.5,-0.5);

    glVertex3f(-0.5,-0.5, 0.5);
    glVertex3f( 0.5,-0.5, 0.5);


    // down-up
    glVertex3f( 0.5,-0.5, 0.5);
    glVertex3f( 0.5, 0.5, 0.5);

    glVertex3f( 0.5,-0.5,-0.5);
    glVertex3f( 0.5, 0.5,-0.5);

    glVertex3f(-0.5,-0.5,-0.5);
    glVertex3f(-0.5, 0.5,-0.5);

    glVertex3f(-0.5,-0.5, 0.5);
    glVertex3f(-0.5, 0.5, 0.5);

    glEnd();
}

let animate = true;
let shoulder = 0.0;
let elbow = 0.0;
let wrist = 15 / Math.PI;

function drawWavingArm() {
    if (animate) {
	shoulder += 7.5/180.0 * Math.PI;
	elbow += 7.5/180.0 * Math.PI;
	wrist += 15/180.0 * Math.PI;
    }

    const length = 0.8;
    const width = 0.25;

    const shoulderAngle = 20.0 * Math.cos(shoulder) + 20;
    const elbowAngle = 40.0 * Math.sin(elbow) + 40.0;
    const wristAngle = -75.0 * Math.sin(wrist);

    glColor3f(0.5,0.6,0.2)

    glPushMatrix();
    glScalef(1.5,1.5,1.5);
    glTranslatef(-length * 1.5, -length * 1.25, 0.0);
    glRotatef(shoulderAngle, 0.0, 0.0, 1.0);

    // Upper arm.
    glPushMatrix();
    glTranslatef(length/2, 0.0, 0.0);
    glScalef(length, width, width);
    glBeginEnd("WireCube");
    glPopMatrix();

    glTranslatef(length, 0.0, 0.0);
    glRotatef(elbowAngle, 0.0, 0.0, 1.0);

    // Forearm.
    glPushMatrix();
    glTranslatef(1.5 * length/2, 0.0, 0.0);
    glScalef(1.4 * length, 0.8 * width, 0.8 * width);
    glBeginEnd("WireCube");
    glPopMatrix();

    glTranslatef(1.5 * length, 0.0, 0.0);
    glRotatef(wristAngle, 0.0, 0.0, 1.0);

    // Palm/hand.
    glPushMatrix();
    glTranslatef(width, 0.0, 0.0);
    glPushMatrix();
    glScalef(2*width, width, width/2);
    glBeginEnd("WireCube");
    glPopMatrix();

    // Fingers
    for (let f = 0; f < 4; f++) {
	glPushMatrix();
	glRotatef(f*15.0-15.0, 0.0, 0.0, 1.0);
	glTranslatef(width*2,0.0,0.0);
	glScalef(width*1.5,width/4,width/4);
	glBeginEnd("WireCube");
	glPopMatrix();
    }
    // Thumb
    glPushMatrix();
    glRotatef(90, 0.0, 0.0, 1.0);
    glTranslatef(width,0.0,0.0);
    glScalef(width,width/3,width/3);
    glBeginEnd("WireCube");
    glPopMatrix();

    glPopMatrix();
    glPopMatrix();
}

function makeWireNPolygon() {
    let dAngle = 2 * Math.PI / n;
    let r = 0.5;

    glBegin(GL_LINES, "WireNPolygon");

    // Produce the top and bottom.
    for (let i = 0; i < n; i += 1) {
        const a = dAngle * i;
        const x0 = r * Math.cos(a);
        const y0 = r * Math.sin(a);
        const x1 = r * Math.cos(a + dAngle);
        const y1 = r * Math.sin(a + dAngle);

    glVertex3f(x0, y0, 0.0);
    glVertex3f(x1, y1, 0.0);
    glVertex3f(x0, y0, 1.0);
    glVertex3f(x1, y1, 1.0);
    }

    // Sides
    for (let i = 0; i < n; i += 1) {
        const a = dAngle * i;
        const x0 = r * Math.cos(a);
        const y0 = r * Math.sin(a);

        glVertex3f(x0, y0, 0.0);
        glVertex3f(x0, y0, 1.0);
    }

    glEnd();
}

function makeWireNCone() {

    let dAngle = 2 * Math.PI / n;
    let r = 0.5;

    glBegin(GL_LINES, "WireNCone");

    for (let i = 0; i < n; i += 1) {
        const a  = dAngle * i;
        const x0 = r * Math.cos(a);
        const y0 = r * Math.sin(a);
        const x1 = r * Math.cos(a + dAngle);
        const y1 = r * Math.sin(a + dAngle);

    glVertex3f(x0, y0, 1.0);
    glVertex3f(x1, y1, 1.0);

    glVertex3f(0.0, 0.0, 0.0);
    glVertex3f(x0, y0, 1.0);
    }

    glEnd();

}

function makeWireTruncatedCone() {

    let dAngle = 2 * Math.PI / n;

    glBegin(GL_LINES, "WireNTruncatedCone");

    for (let i = 0; i < n; i += 1) {
        const a  = dAngle * i;
        const x0 = Math.cos(a);
        const y0 = Math.sin(a);
        const x1 = Math.cos(a + dAngle);
        const y1 = Math.sin(a + dAngle);

    // lower polygon
    glVertex3f(r0 * x0, r0 * y0, 0.0);
    glVertex3f(r0 * x1, r0 * y1, 0.0);

    // upper polygon
    glVertex3f(r1 * x0, r1 * y0, 1.0);
    glVertex3f(r1 * x1, r1 * y1, 1.0);

    // connect them
    glVertex3f(r1 * x0, r1 * y0, 1.0);
    glVertex3f(r0 * x0, r0 * y0, 0.0);

    }

    glEnd();

}

function SHADE() {
    glPushMatrix();
    glScalef(1.0, 1.0, 0.25);
    glBeginEnd("WireNCone");
    glPopMatrix();

    glPushMatrix();
    glTranslatef(0.0, 0.0, 0.25);
    glScalef(1.0, 1.0, 0.25);
    glBeginEnd("WireNPolygon");
    glPopMatrix();

    glPushMatrix();
    glScalef(1.0, 1.0, -1.0);
    glTranslatef(0.0, 0.0, -0.5);
    BULB(1.0, 0.35);
    glPopMatrix();

    if (lightOn) {
        glPushMatrix();
        //glScalef(1.0, 1.0, -1.0);
        glTranslatef(0.0, 0.0, 0.65);
        glBeginEnd("WireLightRays");
        glPopMatrix();
    }
}

function BASE() {
    glPushMatrix();
    glScalef(1.0, 1.0, 0.10);
    glBeginEnd("WireNPolygon");
    glPopMatrix();
}

function BULB(upper, lower) {
    r0 = upper;
    r1 = lower;
    glPushMatrix();
    glScalef(0.2, 0.2, 0.25);
    glBeginEnd("WireNTruncatedCone");
    glScalef(1.0, 1.0, -0.5);
    glBeginEnd("WireNTruncatedCone");
    glPopMatrix();
}

function KNOB() {
    glPushMatrix();
    glScalef(0.1, 0.1, 0.1);
    glBeginEnd("WireNPolygon");
    glPopMatrix();
}

function makeWireLightRays() {

    let dAngle = 2 * Math.PI / n;

    glBegin(GL_LINES, "WireLightRays");

    r0 = 0.1;
    r1 = 0.5;

    for (let i = 0; i < n; i += 1) {
        const a  = dAngle * i;
        const x0 = Math.cos(a);
        const y0 = Math.sin(a);

    // connect them
    glVertex3f(r1 * x0, r1 * y0, 1.0);
    glVertex3f(r0 * x0, r0 * y0, 0.0);

    }

    glEnd();

}
let jr_animate = true;
let base = 10.0;
let hinge = -60.0;
let shade = -30.0;

function drawLuxoJr() {


    // if (jr_animate) {
	// base += 1.5/180.0 * Math.PI;
	// hinge += 1.5/180.0 * Math.PI;
	// shade += 2.5/180.0 * Math.PI;
    // }

    const height = 1.5;
    const width = 0.15;
    const baseHeight = 0.1;

    // const baseAngle = 50.0 * Math.cos(base);
    // const hingeAngle = 50.0 * Math.sin(hinge);
    // const shadeAngle = -75.0 * Math.sin(shade);
    const baseAngle = base;
    const hingeAngle = hinge;
    const shadeAngle = -75.0 * Math.sin(shade);

    glColor3f(0.5,0.6,0.2)

    glPushMatrix();
    glTranslatef(-1.5, -1.5, 0.0);
    // Place base
    {
    glPushMatrix();
    glRotatef(90.0, 1.0, 0.0, 0.0);
    glScalef(1.2, 1.0, 1.2);
    BASE();
    glPopMatrix();
    }

    // Base to hinge segment
    {
    glPushMatrix();
    glRotatef(baseAngle, 0.0, 0.0, 1.0);
    glTranslatef(0.0, height / 2, 0.0);
    glScalef(width, height, width);
    glBeginEnd("WireCube");
    glTranslatef(0.0, 0.0, 0.5);
    KNOB();
    glPopMatrix();
    }

    // Hinge to shade
    {
    glPushMatrix();
    glRotatef(baseAngle, 0.0, 0.0, 1.0);
    glTranslatef(0.0, height, 0.0);
    glPushMatrix();
    glRotatef(hingeAngle, 0.0, 0.0, 1.0);
    glTranslatef(0.0, height / 2, 0.0);
    glScalef(width, height, width);
    glBeginEnd("WireCube");
    glPopMatrix();
    glPopMatrix();
    }

    // Shade and bulb
    {
    glPushMatrix();
    glRotatef(baseAngle, 0.0, 0.0, 1.0);
    glTranslatef(0.0, height, 0.0);
    glRotatef(hingeAngle, 0.0, 0.0, 1.0);
    glTranslatef(0.0, height, 0.0);
    glPushMatrix();
    glRotatef(90, 0.0, 1.0, 0.0);
    SHADE();
    glPopMatrix()
    }
    glPopMatrix();
}


// makeSquare():
//
// Makes a unit square centered at the origin.
//
function makeSquare() {
    glBegin(GL_TRIANGLES, "Square");
    glVertex3f(-0.5, 0.5, 0.0);
    glVertex3f(-0.5,-0.5, 0.0);
    glVertex3f( 0.5,-0.5, 0.0);
    glVertex3f(-0.5, 0.5, 0.0);
    glVertex3f( 0.5,-0.5, 0.0);
    glVertex3f( 0.5, 0.5, 0.0);
    glEnd();
}

// drawSquarepinski(levels):
//
// Draws the recursive figure of a Sierpinski square.  The integer
// parameter `levels` indicates how many recursive levels should be
// shown. 0 indicates that only a solid square gets drawn.
//
function drawSquarepinski(levels) {
    if (levels == 0) {
	glBeginEnd("Square");
    } else {
        glPushMatrix();
        glScalef(1/3, 1/3, 1/3);
        for (let i = -1; i <= 1; i++) {
            for (let j = -1; j <=1; j++) {
                if ((i != 0) || (j != 0)) {
                    glPushMatrix();
                    glTranslatef(i,j,0);
                    drawSquarepinski(levels-1);
                    glPopMatrix();
                }
            }
        }
        glPopMatrix();
    }
}

// TWIG():
//
// Makes a 0.25 x 2 rectangle centered at the origin.
//
function TWIG() {
    glPushMatrix();
    glColor3f(0.556, 0.419, 0.145);
    glTranslatef(-0.25, -1.50, 0.0);
    glScalef(0.25 / 2, 2.0, 0.0);
    BOX();
    glPopMatrix();
}
// drawRecursiveBranch(levels):
//
// Draws the recursive figure of a leaf.  The integer
// parameter `levels` indicates how many recursive levels should be
// shown. 0 indicates that only a solid rectangle gets drawn.
//
function drawRecursiveBranch(levels) {
    TWIG();
    if (levels == 0) {
        return
    } else {
        let thetas = [40, 40, 10];
        let dYs = [-0.25, 0.4, 0.9];
        glPushMatrix();
        glScalef(1/3, 1/3, 1/3);
        for (let i = 0; i < 3; i ++) {
            glPushMatrix();
            glRotatef(thetas[i], 0.0, 0.0, 1.0);
            glTranslatef(0.0, dYs[i] * 3, 0.0);
            glPushMatrix();
            glColor3f(0.556, 0.419, 0.145);
            glTranslatef(-0.25, -1.50, 0.0);
            glScalef(0.25 / 2, 2.0, 0.0);
            BOX();
            glPopMatrix();
            drawRecursiveBranch(levels - 1);
            glPopMatrix();
        }
        glPopMatrix();
    }
}

// RTRI
//
// Describes an isoceles right triangle whose corner is at the origin
// and whose sides are along the +x and +y axes with unit length.
//
function makeRTRI() {
    glBegin(GL_TRIANGLES,"RTRI");
    glVertex3f(0.0,0.0,0.0);
    glVertex3f(1.0,0.0,0.0);
    glVertex3f(0.0,1.0,0.0);
    glEnd();
}

// RTRI
//
// Draws an isoceles right triangle whose corner is at the origin
// and whose sides are along the +x and +y axes with unit length.
//
function RTRI() {
    glBeginEnd("RTRI");
}

// makeDISK
//
// Describes a unit disk centered at the origin.
//
function makeDISK() {
    glBegin(GL_TRIANGLES,"DISK");
    const sides = 100;
    const dtheta = 2.0 * Math.PI / sides;
    for (let i = 0; i < 100; i++) {
        const theta = i * dtheta;
        // draw a pie slice on the disk
        glVertex3f(0.0,0.0,0.0);
        glVertex3f(Math.cos(theta),
			Math.sin(theta),
			0.0);
        glVertex3f(Math.cos(theta + dtheta),
			Math.sin(theta + dtheta),
			0.0);
    }
    glEnd();
}

// DISK
//
// Draws a unit disk centered at the origin.
//
function DISK() {
    glBeginEnd("DISK");
}

// BOX
//
// Draws a unit square with lower-left corner at the origin.
//
function BOX() {
    RTRI();
    glPushMatrix();
    glTranslatef(1.0,1.0,0.0);
    glRotatef(180.0,0.0,0.0,1.0)
    RTRI();
    glPopMatrix();
}

// RECT
//
// Draws a 1x2 rectangle (1 wide, 2 high) with lower-left corner at the
// origin.
//
function RECT() {
    BOX()
    glPushMatrix()
    glTranslatef(0.0,1.0,0.0)
    BOX()
    glPopMatrix()

}

// HOUSE, etc.
//
// Below are a series of procedures that draw the elements of a
// scene containing a house, a tree, and the sun.
//
function WINDOW() {
    glColor3f(1.0,1.0,1.0)
    glPushMatrix()
    glScalef(0.2,0.2,0.2)
    BOX()
    glPopMatrix()
}

//
//
function DOOR() {
    glColor3f(0.6,0.6,0.8)
    glPushMatrix()
    glScalef(0.2,0.2,0.2)
    RECT()
    glPopMatrix()
}

//
//
function HOUSE() {
    glColor3f(0.5,0.125,0.125)

    BOX()

    glPushMatrix()
    glTranslatef(0.2,0.2,0.0)
    WINDOW()
    glPopMatrix()

    glPushMatrix()
    glTranslatef(0.2,0.6,0.0)
    WINDOW()
    glPopMatrix()

    glPushMatrix()
    glTranslatef(0.6,0.6,0.0)
    WINDOW()
    glPopMatrix()

    glPushMatrix()
    glTranslatef(0.6,0.0,0.0)
    DOOR()
    glPopMatrix()

    glColor3f(0.25,0.25,0.25)
    glPushMatrix()
    glTranslatef(0.5,1.5,0.0)
    glScalef(1.1,0.8,1.1)
    glRotatef(-135,0.0,0.0,1.0)
    RTRI()
    glPopMatrix()
}

//
//
function TREE() {
    glColor3f(0.5,0.5,0.25);

    glPushMatrix();

    // Trunk.
    glTranslatef(-0.5,0.0,0.0);
    BOX();
    glTranslatef(0.0,1.0,0.0);
    BOX();
    glTranslatef(0.0,1.0,0.0);
    BOX();
    glTranslatef(0.0,1.0,0.0);

    // Branch 1.
    glPushMatrix()
    glRotatef(treeAngle1,0.0,0.0,1.0);
    glScalef(0.3,0.6,0.3);
    RTRI();
    glPopMatrix();

    // Branch 2.
    glPushMatrix()
    glTranslatef(1.0,0.0,0.0);
    glRotatef(-90.0,0.0,0.0,1.0);
    glRotatef(treeAngle2,0.0,0.0,1.0);
    glScalef(0.3,0.6,0.3);
    RTRI();
    glPopMatrix();

    glPopMatrix();

    glColor4f(0.1,0.5,0.2,0.7);
    glPushMatrix()
    glTranslatef(0.0,3.0,0.01)
    glScalef(1.75,1.75,1.75)
    DISK()
    glPopMatrix()
}

function convertMouseToCurrent(mousex,mousey) {
    const pj = mat4.create();
    glGetFloatv(GL_PROJECTION_MATRIX, pj);
    const mv = mat4.create();
    glGetFloatv(GL_MODELVIEW_MATRIX, mv);
    const xform = mat4.create();
    mat4.multiply(xform, pj, mv);
    const xform_inv = mat4.create();
    mat4.invert(xform_inv,xform);
    const vp = [0,0,0,0];
    glGetIntegerv(GL_VIEWPORT, vp);
    const mousecoords = vec4.fromValues(2.0*mousex/vp[2]-1.0,
					1.0-2.0*mousey/vp[3],
					0.0, 1.0);
    vec4.transformMat4(location,mousecoords, xform_inv);
    return vec3.fromValues(location[0], location[1], location[3]);

}

//
//
function SUN() {
    glPushMatrix();
    glTranslatef(sunLocation.x, sunLocation.y,-2.0);

    glPushMatrix();
    glScalef(0.15,0.15,0.15);
    glColor3f(1.0,0.8,0.3);
    DISK()
    glPopMatrix();

    glPopMatrix();
}

function handleKey(key, x, y) {
    /*
     * Handle a keypress.
     */

    // Handle the h key.
    if (key == 's') {
        scene = "scene";
        // Redraw.
        glutPostRedisplay();
    }

    // Handle the o key
    if (key == 'o') {
        scene = "space";
        // Redraw.
        glutPostRedisplay();
    }

    // Handle the r key.
    if (key == 'r') {
        scene = "recursive";
        // Redraw.
        glutPostRedisplay();
    }

    // Handle the r key.
    if (key == 'l') {
        scene = "leaf";
        // Redraw.
        glutPostRedisplay();
    }

    // Handle the a key.
    if (key == 'a') {
	if (scene == "animation") {
	    animate = !animate;
	} else {
	    scene = "animation";
	    animate = true;
	}

        // Redraw.
        glutPostRedisplay();
    }

    // Handle the j key.
    if (key == 'j') {
	if (scene == "jr_animation") {
	    jr_animate = !animate;
	} else {
	    scene = "jr_animation";
	    jr_animate = true;
	}

        // Redraw.
        glutPostRedisplay();
    }

}

function drawHouse() {
    SUN();

    glPushMatrix();

    glTranslatef(0.0,-1.5,0.0);

    // Draw the yard.
    glColor3f(0.1,0.3,0.1);
    glPushMatrix();
    glTranslatef(5.0,0.0,0.0);
    glRotatef(180,0.0,0.0,1.0);
    glScalef(10.0,10.0,10.0);
    BOX();
    glPopMatrix();

    // Draw the house.
    HOUSE();

    // Plant a happy little tree.
    glPushMatrix();
    glTranslatef(-1.0,0.0,0.0);
    glScalef(0.25,0.25,0.25);
    TREE()
    glPopMatrix();

    glPopMatrix();
}

function drawSpace() {
    glPushMatrix();
    // // Draw initial stars
    for (let i = 0; i < 30; i += 1) {
        let randomColor = Math.random();
        glColor3f(0.937, 0.882, 0.0 + randomColor);
        glPushMatrix();
        glRotatef(180 * randomScale, 0.0, 0.0, 1.0);
        glTranslatef(randomX[i], randomY[i], 0.0);
        glScalef(randomScale[i], randomScale[i], randomScale[i]);
        STAR()
        glPopMatrix();
    }

    // Draw the planets
    // Neptunish
    glColor3f(0.027, 0.227, 0.552);
    glPushMatrix();
    glTranslatef(-1.5, 1.0, 0.0);
    glScalef(0.75, 0.75, 0.75);
    DISK();
    glPopMatrix();
    // Plutoish
    glColor3f(0.568, 0.564, 0.552);
    glPushMatrix();
    glTranslatef(1.5, -0.60, 0.0);
    glScalef(0.2, 0.2, 0.2);
    DISK();
    glPopMatrix();
    // Jupiterish
    glColor3f(0.921, 0.682, 0.215);
    glPushMatrix();
    glTranslatef(-0.50, -0.60, 0.0);
    DISK();
    // Jupiter Storm
    glColor3f(0.788, 0.317, 0.133);
    glTranslatef(-0.3, -0.40, 0.0);
    glScalef(0.5, 0.2, 0.0);
    DISK();
    glPopMatrix();

    // Draw more stars
    for (let i = 0; i < 10; i += 1) {
        let randomColor = Math.random();
        glColor3f(0.937, 0.882, 0.0 + randomColor);
        glPushMatrix();
        glTranslatef(randomX[(i + 5) % 10], randomY[(i) % 10], 0.0);
        glScalef(randomScale[i] * 2, randomScale[i] * 2, randomScale[i] * 2); // so new stars are not in position of initial stars
        STAR()
        glPopMatrix();
    }

    // Draw rocket
    glRotatef(45, 0, 0, 1);
    ROCKET();

    glPopMatrix();
}

function draw() {
    /*
     * Issue GL calls to draw the requested graphics.
     */

    // Clear the rendering information.
    if (scene == "scene") {
	glClearColor(0.8, 0.9, 1.0, 1.0);
    } else if (scene == "space") {
    glClearColor(0.560, 0.305, 0.592);
    } else if (scene == "leaf") {
        glClearColor(0.803, 0.972, 0.976);
    } else {
	glClearColor(0.4, 0.45, 0.5, 1.0);
    }
    glClearDepth(1.0);
    glClear(GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT)
    glEnable(GL_BLEND);
    glBlendFunc(GL_SRC_ALPHA, GL_ONE_MINUS_SRC_ALPHA);

    // Clear the transformation stack.
    glMatrixMode(GL_MODELVIEW);
    glLoadIdentity();

    if (scene == "scene") {
	drawHouse();
    } else if (scene == "space") {
    drawSpace();
    } else if (scene == "animation") {


	glPushMatrix();
	// Reorient according to the "trackball" motion of mouse drags.
	orientation.glRotatef();
	drawWavingArm();
	glPopMatrix();

    } else if (scene == "jr_animation") {


        glPushMatrix();
        // Reorient according to the "trackball" motion of mouse drags.
        orientation.glRotatef();
        drawLuxoJr();
        glPopMatrix();

    } else if (scene == "recursive") {

	glClearColor(0.5, 0.3, 0.55);
	glPushMatrix();
	glScalef(3.0,3.0,3.0);
	drawSquarepinski(recursiveLevels);
	glPopMatrix();

    } else if (scene == "leaf") {
    glPushMatrix();
    drawRecursiveBranch(1);
    glPopMatrix();

    }
    // Render the scene.
    glFlush();
}

function ortho(w,h) {
    glMatrixMode(GL_PROJECTION);
    glLoadIdentity();
    lastw = w;
    lasth = h;
    if (w > h) {
        glOrtho(-w/h*2.0, w/h*2.0, -2.0, 2.0, -2.0, 2.0);
    } else {
	glOrtho(-2.0, 2.0, -h/w * 2.0, h/w * 2.0, -2.0, 2.0);
    }
}

function resizeWindow(w, h) {
    /*
     * Register a window resize by changing the viewport.
     */
    glViewport(0, 0, w, h);
    ortho(w,h);
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

    if (scene == "scene") {
	sunLocation = mouseStart;
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

    // Ready state for next mouse move.
    mouseStart = mouseNow;

    if (scene == "animation") {
	axis = (new vector(-dy,dx,0.0)).unit()
	angle = Math.asin(Math.min(Math.sqrt(dx*dx+dy*dy),1.0))
	orientation = quatClass.for_rotation(angle,axis).times(orientation);
    }
    if (scene == "jr_animation") {
        axis = (new vector(-dy,dx,0.0)).unit()
        angle = Math.asin(Math.min(Math.sqrt(dx*dx+dy*dy),1.0))
        orientation = quatClass.for_rotation(angle,axis).times(orientation);
        }
    if (scene == "scene") {
	sunLocation = mouseStart;
    }

    // Update window.
    glutPostRedisplay()
}

function main() {
    glutInitDisplayMode(GLUT_SINGLE | GLUT_RGB | GLUT_DEPTH);
    glutInitWindowPosition(0, 20);
    glutInitWindowSize(800, 640);
    glutCreateWindow('A scene.');

    makeRTRI();
    makeDISK();
    makeSquare();
    makeWireCube();
    makeWireNPolygon();
    makeWireNCone();
    makeWireTruncatedCone();
    makeWireLightRays();
    makeStar();

    for (let i = 0; i < 10; i += 1) {
        randomX.push(getRandomArbitrary(-2, 2));
        randomY.push(getRandomArbitrary(-2, 2));
        randomScale.push(getRandomArbitrary(0.25, 0.50));
    }

    ortho(800,640);

    // Register interaction callbacks.
    glutKeyboardFunc(handleKey)
    glutReshapeFunc(resizeWindow)
    glutMouseFunc(handleMouseClick)
    glutMotionFunc(handleMouseMotion)

    glutDisplayFunc(draw);
    glutMainLoop();
}

glRun(main, true);
