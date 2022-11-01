import {
    createDomCell
} from "./creacion-tablero.mjs";

// Este snipet es de P5, tomado de https://editor.p5js.org/fran.piaggio/sketches/s5TY_5Nos
// lo hizo FPiaggio.


/**************************************/
// Saco las funciones generadoras de acá, y las llamo desde creacion-tablero.mjs
/**************************************/

/*
let w = Math.min(window.innerWidth, window.innerHeight);
let maxRecursionDepth = 2;
let rad = w / 5;
*/

/*
function draw() {
    //background(0);
    // Centra
    translate(w / 2, w / 2)

    //stroke(255)
    //noFill()
    //strokeWeight(1)

    recursiveHexagon(0, 0, maxRecursionDepth, rad)
    noLoop()
}
*/
/*
function drawHexagon(cX, cY, r) {
    
    createDomCell(matrix[row][col]);
    
    beginShape()

    // acá están todos los vértices.
    for (let a = TAU / 12; a < TAU + TAU / 12; a += TAU / 6) {
        var x1 = cX + r * cos(a)
        var y1 = cY + r * sin(a)

        vertex(x1, y1)
    }
    endShape(CLOSE)
}
*/
export function recursiveHexagon(cX, cY, depth, r) {
    if (depth == 0) {
        createDomCell(cX, cY);
        //drawHexagon(cX, cY, r)
    } else {
        recursiveHexagon(cX, cY, depth - 1, r / 2)
        for (let a = 0; a < Math.PI * 2; a += Math.PI * 2 / 6) {
            var x = cX + r * Math.cos(a)
            var y = cY + r * Math.sin(a)

            if (depth > 0) {
                recursiveHexagon(x, y, depth - 1, r / 2)
            }
        }
    }
}