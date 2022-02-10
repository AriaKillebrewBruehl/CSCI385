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
//
let scalar = 10;
//
let spiralRadius = 1.0;
//
let spiralHeight = 3.0;

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

function makeCylinder(smoothness) {
    /*
     * This describes the facets of a 24-sided cylindrical
     * object.
     */

    const width = 1.0;
    const numFacets = 24;
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

function makeTorus() {
    //
     // This describes the facets of a torus
     // object.
     //

    r = spiralRadius;
    let width = 1.0;
    numFacets = smoothness;
    const dAngle = 2.0 * Math.PI / numFacets;

    glBegin(GL_TRIANGLES, "Torus", true);

    for (let i = 0; i < numFacets; i += 1) {
        const aCenter = dAngle * i;
        const cx0 = r * Math.cos(aCenter);
        const cy = 0;
        const cz0 = r * Math.sin(aCenter);
        const cx1 = r * Math.cos(aCenter + dAngle);
        const cz1 = r * Math.sin(aCenter + dAngle);

        for (let j = 0; j < numFacets; j+= 1) {
            const r = 0.5;
            const aSide = dAngle * j;
            const u0 =  r * Math.cos(aSide);
            const v0 =  r * Math.sin(aSide);
            const w0 = 0;
            const u1 =  r * Math.cos(aSide + r);
            const v1 =  r * Math.sin(aSide + r);
            const w1 = 0;

            const x00 = Math.cos(aCenter) * u0 + Math.sin(aCenter) * w0;
            const y00 = v0;
            const z00 = Math.sin(aCenter) * u0 + Math.cos(aCenter) * w0;

            const x01 = Math.cos(aCenter) * u1 + Math.sin(aCenter) * w1;
            const y01 = v1;
            const z01 = Math.sin(aCenter) * u1+ Math.cos(aCenter) * w1;

            const x10 = Math.cos(aCenter + dAngle) * u0 + Math.sin(aCenter + dAngle) * w0;
            const y10 = v0;
            const z10 = Math.sin(aCenter + dAngle) * u0 + Math.cos(aCenter + dAngle) * w0;

            const x11 = Math.cos(aCenter + dAngle) * u1 + Math.sin(aCenter + dAngle) * w1;
            const y11 = v1;
            const z11 = Math.sin(aCenter + dAngle) * u1 + Math.cos(aCenter + dAngle) * w1;


            if (j % 2 ==  0) {
                glColor3f(0.00, 0.00, 0.00);
            } else {
                glColor3f(1.00, 1.0, 1.00);
            }

                // create side 1
                glColor3f(0.00, 0.00, 0.00);
                glVertex3f(cx0 + x00, cy + y00, cz0 + z00);
                glVertex3f(cx0 + x01, cy + y01, cz0 + z01);
                glVertex3f(cx1 + x10, cy + y10, cz1 + z10);
                // create side 2
                glColor3f(1.00, 1.0, 1.00);
                glVertex3f(cx0 + x01, cy + y01, cz0 + z01);
                glVertex3f(cx1 + x10, cy + y10, cz1 + z10);
                glVertex3f(cx1 + x11, cy + y11, cz1 + z11);
    }
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


function makeQuarterSphere(x, y, z, radius, len) {
    //
     //This describes the facets of a sphere
     // object.
     //

    numFacets = smoothness;
    const dAngle = 2.0 * Math.PI / numFacets;
    z = z - radius;


    glBegin(GL_TRIANGLES, "quarterSphere", true);

    for (let k = 0; k < (len / radius); k += 1) {
        let dx = len - 2 * radius * (k);


        for (let i = 0; i < numFacets / 2; i += 1) {
            for (let j = 0; j < numFacets / 2; j += 1) {
                const aMid = dAngle * j;
                const xMid0 = Math.cos(aMid) * getY(i, numFacets);
                const yMid0 = Math.sin(aMid) * getY(i, numFacets);
                const xMid1 = Math.cos(aMid + dAngle) * getY(i, numFacets);
                const yMid1 = Math.sin(aMid + dAngle) * getY(i, numFacets);
                const xMid2 = Math.cos(aMid) * getY(i + 1, numFacets);
                const yMid2 = Math.sin(aMid) * getY(i + 1, numFacets);
                const xMid3 = Math.cos(aMid + dAngle) * getY(i + 1, numFacets);
                const yMid3 = Math.sin(aMid + dAngle) * getY(i + 1, numFacets);
                let px0 = xMid0 * radius + dx + x;
                let py0 = yMid0 * radius + y;
                let pz0 = radius / numFacets + (1/numFacets) * 2*i * radius + z;
                let px1 = xMid1 * radius + dx + x;
                let py1 = yMid1 * radius + y;
                let pz1 = -radius / numFacets + (1/numFacets) * 2*i * radius + z;
                let px2 = xMid2 * radius + dx + x;
                let py2 = yMid2 * radius + y;
                let px3 = xMid3 * radius + dx + x;
                let py3 = yMid3 * radius + y;
                let pz3 = -radius / numFacets + (1/numFacets) * 2*(i+1) * radius + z;

                if (k % 2 == 0) {
                    px0 *= -1;  px1 *= -1;  px2 *= -1;  px3 *= -1;
                    py0 *= -1;  py1 *= -1;  py2 *= -1;  py3 *= -1;
                }

            // front side
            // red
            glColor3f(1.0, 0.00, 1.0);
                glVertex3f(px0, py0, pz0 );
                glVertex3f(px0, py0, pz1);
                glVertex3f(px1, py1, pz1);
            // blue
            glColor3f(1.0, 0.00, 1.0);
                glVertex3f(px0, py0, pz0);
                glVertex3f(px1, py1, pz1);
                glVertex3f(px1, py1, pz0);
            // green diag
            glColor3f(0.0, 0.00, 1.00);
                glVertex3f(px0, py0, pz0);
                glVertex3f(px1, py1, pz0);
                glVertex3f(px2, py2, pz3);
            // black diag
            glColor3f(1.0, 0.00, 1.00);
                glVertex3f(px2, py2, pz3);
                glVertex3f(px3, py3, pz3);
                glVertex3f(px1, py1, pz0);

            // back
            // red
            glColor3f(1.0, 0.00, 1.0);
                glVertex3f(px0, py0, -pz0 );
                glVertex3f(px0, py0, -pz1);
                glVertex3f(px1, py1, -pz1);
            // blue
            glColor3f(1.0, 0.00, 1.0);
                glVertex3f(px0, py0, -pz0);
                glVertex3f(px1, py1, -pz1);
                glVertex3f(px1, py1, -pz0);
            // green diag
            glColor3f(0.0, 0.00, 1.0);
                glVertex3f(px0, py0, -pz0);
                glVertex3f(px1, py1, -pz0);
                glVertex3f(px2, py2, -pz3);
            // black diag
            glColor3f(0.0, 0.00, 1.0);
                glVertex3f(px2, py2, -pz3);
                glVertex3f(px3, py3, -pz3);
                glVertex3f(px1, py1, -pz0);
            }
            const aMid  = dAngle * i;
            const aMid1 = dAngle * (i + 1);
            const xMid0 = Math.cos(aMid) * getY(0, numFacets);
            const zMid0 = Math.sin(aMid) * getY(0, numFacets);
            const xMid1 = Math.cos(aMid1) * getY(0, numFacets);
            const zMid1 = Math.sin(aMid1) * getY(0, numFacets);

            let pz = numFacets / 2 * radius * radius + z;
            let px0 = xMid0 * radius + dx + x;
            let pz0 = zMid0 * radius + y + z;
            let px1 = xMid1 * radius + dx + x;
            let pz1 = zMid1 * radius + y + z;


            if (k % 2 == 0) {
                px0 *= -1;  px1 *= -1;
            }

            // front side
            glColor3f(1.0, 0.00, 1.0);
                glVertex3f(px0, y, pz0);
                glVertex3f(px0, y, pz);
                glVertex3f(px1, y, pz1);

            glColor3f(1.0, 0.00, 1.0);
                glVertex3f(px0, y, pz);
                glVertex3f(px1, y, pz1);
                glVertex3f(px1, y, pz);

            // back side
            glColor3f(1.0, 0.00, 1.0);
                glVertex3f(px0, -y, -pz0);
                glVertex3f(px0, -y, -pz);
                glVertex3f(px1, -y, -pz1);

            glColor3f(1.00, 0.00, 1.00);
                glVertex3f(px0, -y, -pz);
                glVertex3f(px1, -y, -pz1);
                glVertex3f(px1, -y,-pz);
        }

    }
    glEnd();
}


function makeLasagneBase(len, width, height, radius) {

    glBegin(GL_TRIANGLES, "LasagneBase", true);

        // top
        glColor3f(1.0, 0.00, 1.0);
            glVertex3f(-(len / 2) - radius, height ,  width);
            glVertex3f(-(len / 2) - radius, height , -width);
            glVertex3f( (len / 2 )- radius, height , -width);

        glColor3f(1.0, 0.00, 1.0);
            glVertex3f( (len / 2) - radius, height ,  width);
            glVertex3f( (len / 2) - radius, height , -width);
            glVertex3f(-(len / 2) - radius, height ,  width);

        // bottom
        glColor3f(1.0, 0.00, 1.0);
            glVertex3f(-(len / 2) - radius, -height ,  width);
            glVertex3f(-(len / 2) - radius, -height , -width);
            glVertex3f( (len / 2) - radius, -height , -width);

        glColor3f(1.0, 0.00, 1.0);
            glVertex3f( (len / 2) - radius, -height ,  width);
            glVertex3f( (len / 2) - radius, -height , -width);
            glVertex3f(-(len / 2) - radius, -height ,  width);

        // front
        glColor3f(1.0, 0.00, 1.0);
            glVertex3f(-(len / 2) - radius,  height , width);
            glVertex3f(-(len / 2) - radius, -height , width);
            glVertex3f( (len / 2) - radius, -height , width);

        glColor3f(1.0, 0.00, 1.0);
            glVertex3f( (len / 2) - radius,  height ,  width);
            glVertex3f( (len / 2) - radius, -height ,  width);
            glVertex3f(-(len / 2) - radius,  height ,  width);

        // back
        glColor3f(1.0, 0.00, 1.0);
            glVertex3f(-(len / 2) - radius,  height , -width);
            glVertex3f(-(len / 2) - radius, -height , -width);
            glVertex3f( (len / 2) - radius, -height , -width);

        glColor3f(1.0, 0.00, 1.0);
            glVertex3f( (len / 2) - radius,  height ,  -width);
            glVertex3f( (len / 2) - radius, -height ,  -width);
            glVertex3f(-(len / 2) - radius,  height ,  -width);

        // left side
        glColor3f(1.0, 0.00, 1.0);
            glVertex3f(-(len / 2) - radius,  height , -width);
            glVertex3f(-(len / 2) - radius, -height , -width);
            glVertex3f(-(len / 2) - radius, -height , width);

         glColor3f(1.0, 0.00, 1.0);
            glVertex3f(-(len / 2) - radius,  height ,  -width);
            glVertex3f(-(len / 2) - radius,  height ,  width);
            glVertex3f(-(len / 2) - radius,  -height , width);

        // right side
        glColor3f(1.0, 0.00, 1.0);
            glVertex3f((len / 2) - radius,  height , -width);
            glVertex3f((len / 2) - radius, -height , -width);
            glVertex3f((len / 2) - radius, -height , width);

        glColor3f(1.0, 0.00, 1.0);
            glVertex3f((len / 2) - radius,  height ,  -width);
            glVertex3f((len / 2) - radius,  height ,  width);
            glVertex3f((len / 2) - radius,  -height , width);
    glEnd();

}

function makeLasagne() {
    const len = 2.0;
    const width = (len / 4);
    const height = 0.02;
    const radius = 0.05;
    makeQuarterSphere(0, 0, -width / 2, radius, len / 2);
    makeLasagneBase(len, width / 2, height, radius);
    glBeginEnd("quarterSphere");
    glBeginEnd("LasagneBase");

}

function makeRevolution() {
    r = spiralRadius;
    h = spiralHeight;
    console.log(h);
    numFacets = smoothness;
    const r0 = 0.20;
    const r1 = 0.05;
    let dy = 0;
    if (h > 0.5) {
        dy = 5 * r0 / numFacets;
    }

    const dAngle = 2.0 * Math.PI / numFacets;
    const dAngle0 = 2.0 * Math.PI / 5;
    const dAngle1 = 2.0 * Math.PI / 10;

    glBegin(GL_TRIANGLES, "Star", true);
    let y = -h/2;

    for (let k = 0; k < h; k += 1) {
    for (let i = 0; i < numFacets; i +=1) {
        y += dy;
        const aCenter = dAngle * i;
        const cx0 = r * Math.cos(aCenter);
        const cy0 = y;
        const cz0 = r * Math.sin(aCenter);
        const cx1 = r * Math.cos(aCenter + dAngle);
        const cy1 = y;
        const cz1 = r * Math.sin(aCenter + dAngle);

        for (let j = 0; j < 5; j += 1) {
            const dColor = 0.05 * j;
            const currentAngle0 = dAngle0 * j;
            const currentAngle1 = dAngle1 * (2 * j + 1);

            // standard star
            let u00 = r0 * Math.cos(currentAngle0);
            let v00 = r0 * Math.sin(currentAngle0);
            let w00 = 0;

            let u01 = r1 * Math.cos(currentAngle1);
            let v01 = r1 * Math.sin(currentAngle1);
            let w01 = 0;

            let u11 = r0 * Math.cos(currentAngle0 + 2 * dAngle1);
            let v11 = r0 * Math.sin(currentAngle0 + 2 * dAngle1);
            let w11 = 0;

            // rotated star
            // first star
            const x000 = Math.cos(aCenter) * u00 + Math.sin(aCenter) * w00;
            const y000 = v00;
            const z000 = Math.sin(aCenter) * u00 + Math.cos(aCenter) * w00;

            const x001 = Math.cos(aCenter) * u01 + Math.sin(aCenter) * w01;
            const y001 = v01;
            const z001 = Math.sin(aCenter) * u01 + Math.cos(aCenter) * w01;

            const x011 = Math.cos(aCenter) * u11 + Math.sin(aCenter) * w11;
            const y011 = v11;
            const z011 = Math.sin(aCenter) * u11 + Math.cos(aCenter) * w11;

            // second star
            const x100 = Math.cos(aCenter  + dAngle) * u00 + Math.sin(aCenter + dAngle) * w00;
            const y100 = v00;
            const z100 = Math.sin(aCenter + dAngle) * u00 + Math.cos(aCenter + dAngle) * w00;

            const x101 = Math.cos(aCenter + dAngle) * u01 + Math.sin(aCenter + dAngle) * w01;
            const y101 = v01;
            const z101 = Math.sin(aCenter + dAngle) * u01 + Math.cos(aCenter) * w01;

            const x111 = Math.cos(aCenter + dAngle) * u11 + Math.sin(aCenter + dAngle) * w11;
            const y111 = v11;
            const z111 = Math.sin(aCenter + dAngle) * u11 + Math.cos(aCenter + dAngle) * w11;


        if (i % 2 == 0) {
            glColor3f(0.70, 0.00, 0.70 + dColor);
        } else {
            glColor3f(1.0, 0.00, 0.70 + dColor);
        }
            glVertex3f(cx0 + x000, cy0 + y000, cz0 + z000);
            glVertex3f(cx1 + x100, cy1 + y100 + dy, cz1 + z100);
            glVertex3f(cx0 + x001, cy0 + y001, cz0 + z001);

            glVertex3f(cx1 + x100, cy1 + y100 + dy, cz1 + z100);
            glVertex3f(cx0 + x001, cy0 + y001, cz0 + z001);
            glVertex3f(cx1 + x101, cy1 + y101 + dy, cz1 + z101);

            glVertex3f(cx0 + x001, cy0 + y001, cz0 + z001);
            glVertex3f(cx0 + x011, cy0 + y011, cz0 + z011);
            glVertex3f(cx1 + x111, cy1 + y111 + dy, cz1 + z111);

            glVertex3f(cx1 + x101, cy1 + y101 + dy, cz1 + z101);
            glVertex3f(cx1 + x111, cy1 + y111 + dy, cz1 + z111);
            glVertex3f(cx0 + x001, cy0 + y001, cz0 + z001);
        }
    }
}

    glEnd();

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
    glBeginEnd("Torus");
    }
    if (showWhich == 6) {
    makeLasagne();
    }
    if (showWhich == 7) {
    glBeginEnd("Star");
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
    //
    if(key == '5') {
        showWhich = 5;
    }
    //
    if (key == 'l') {
        showWhich = 6;
    }
    //
    if (key == 's') {
        showWhich = 7;
    }
    //
    if (key == 'i') {
        smoothness += 20;
        makeSmoother()
    }
    //
    if (key == 'o') {
        smoothness -= 20;
        makeSmoother();
    }
    //
    if (key == 't') {
        spiralRadius -= 0.1;
        makeTighter();
    }
    //
    if (key == 'd') {
        spiralRadius += 0.1;
        makeTighter();
    }
    //
    if (key == 'h') {
        spiralHeight += 0.5;
        makeTaller();
    }
    //
    if (key == 'j') {
        spiralHeight -= 0.5;
        makeTaller();
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
    makeTorus();
    makeLasagne();
    makeRevolution();
}

function makeTighter() {
    makeTorus();
    makeRevolution();
}

function makeTaller() {
    makeRevolution();
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
    makeTorus();
    makeRevolution();
    makeLasagneBase();
    makeQuarterSphere(0, 0, -0.5, 0.1);

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
