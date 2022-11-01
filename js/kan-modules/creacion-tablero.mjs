import {
    Celda
} from '../kan-data/kan-clases.mjs';

import {
    recursiveHexagon
} from './hex-recursion.mjs';

export function createDOMBoard(maincanvas) {
    let div = document.createElement('div');
    div.id = 'hexGrid';
    maincanvas.appendChild(div);


    /*
    let svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', `0 0 ${window.innerWidth} ${window.innerHeight}`);
    svg.setAttribute('width', `100`);
    svg.setAttribute('height', `100`);
    svg.setAttribute('xmlns', `http://www.w3.org/2000/svg`);
    //svg.setAttribute("transform", `rotate(30)`);
    svg.id = 'hexGrid';

    maincanvas.appendChild(svg);
    */
}

export function createDomCell(cX, cY) {
    let maincanvas = document.getElementById('maincanvas');

    let hex = document.createElement('div');
    hex.className = 'hex';
    hex.id = `hex${cX}-${cY}`;
    hex.dataset.xPosition = cX;
    hex.dataset.yPosition = cY;
    hex.innerHTML = `xPos${cX}-yPos${cY}`;

    //le doy la posición por position:fixed
    let w = Math.min(window.innerWidth, window.innerHeight);
    hex.setAttribute('style', `position: fixed; top: ${w-2*80-cY}px; left: ${w-2*80-cX}px`);
    // Me está faltando encontrarle el verdadero tamaño al objeto

    maincanvas.appendChild(hex);
}
/*
export function createDomCellObsolete(ObjectCelda, claseDeLaCelda = '') {
    //función que crea la celda en el DOM
    let grid = document.getElementById('hexGrid');

    let hex = document.createElement('div');
    hex.className = claseDeLaCelda;
    hex.id = `hex${ObjectCelda.getRow()}-${ObjectCelda.getCol()}`
    hex.dataset.row = ObjectCelda.getRow();
    hex.dataset.col = ObjectCelda.getCol();
    hex.innerHTML = `r${ObjectCelda.getRow()}-c${ObjectCelda.getCol()}`;




    grid.appendChild(hex);
}
*/
export function celdaDebeExistir(row, col) {
    //Función que valida si la celda debe existir
    let validacion;
    row++;
    col++;

    switch (row) {
        case 1:
            validacion = col < 3 || col > 6;
            break;
        case 2:
            validacion = col < 2 || col > 6;
            break;
        case 3:
            validacion = col < 2;
            break;
        case 4:
            ///En fila 4 son todos positivos    
            validacion = false;
            break;
        case 5:
            validacion = col < 2 || col > 6;
            break;
        case 6:
            validacion = col < 2 || col > 6;
            break;
        case 7:
            validacion = col < 4;
            break;
        default:
            validacion = false;
    }

    return !validacion;
}

export function claseDeLaCelda(row, col) {
    let claseAdicional;
    row++;
    col++;

    switch (row) {
        case 1:
            claseAdicional = col == 6 ? 'jump-row' : '';
            break;
        case 2:
            claseAdicional = col == 6 ? 'jump-row' : '';
            break;
        case 3:
            claseAdicional = col == 2 ? 'jump-row' : '';
            break;
            /*        case 4:
                        ///En fila 4 son todos positivos    
                        claseAdicional = false;
                        break;
            */
        case 5:
            claseAdicional = col == 6 ? 'jump-row' : '';
            break;
        case 6:
            claseAdicional = col == 6 ? 'jump-row' : '';
            break;
        case 7:
            claseAdicional = col == 4 ? 'jump-row' : '';
            break;
        default:
            claseAdicional = '';
    }

    return `hex ${claseAdicional}`
}

export function claseCorrespondientePorCelda(row, col) {
    //Función que valida si la celda debe existir
    let validacion;
    row++;
    col++;

    switch (row) {
        case 1:
            validacion = col < 3 || col > 6;
            break;
        case 2:
            validacion = col < 2 || col > 6;
            break;
        case 3:
            validacion = col < 2;
            break;
            /*
            el caso 4 son todos positivos, pasa por el default;
            case 4:
                validacion = col < 7;
                break;
                */
        case 5:
            validacion = col < 2 || col > 6;
            break;
        case 6:
            validacion = col < 2 || col > 6;
            break;
        case 7:
            validacion = col < 4;
            break;
        default:
            validacion = false;
    }

    let clase = validacion == true ? 'emptyHex' : 'hex';
    console.log(`fila ${row}, columna ${col}: clase ${clase}`);
    return clase;

    /*
    Hay una lógica matemática más precisa para definir cual es el máximo de celdas por fila, pero no la estoy logrando pensar.
    if(row <= 4){
        //Esto está bien
        validacion = col == 3 + row
    }else {
        //Esto no está bien.
        validacion = col == row - 3
    }*/

}

export function crearTablero() {
    //Función uqe desarrolla el tablero
    /*
        let matrix = [];

        //Genero la matriz en memoria
        for (let row = 0; row < 7; row++) {
            matrix[row] = [];
            for (let col = 0; col < 7; col++) {

                // El siguiente código funcionaría usando claseCorrespondientePorCelda.
                // Esta lógica está pensada para crear una grilla cuadrada de celdas, y ocultar las que no corresponden.
                matrix[row][col] = new Celda(row, col, claseCorrespondientePorCelda(row, col) == 'hex');
                createDomCell(matrix[row][col], claseCorrespondientePorCelda(row, col));
            }
        }

        console.log(matrix);
        */

    // creo los hexágonos, llamando a la func recursiveHexagon de hex-recursion.mjs
    let maxRecursionDepth = 2;
    let w = Math.min(window.innerWidth, window.innerHeight);
    let rad = w / 5;
    recursiveHexagon(0, 0, maxRecursionDepth, rad);

}