import {
    Celda
} from '../kan-data/kan-clases.mjs';

export function createDOMBoard(maincanvas) {
    let svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', `0 0 ${window.innerWidth} ${window.innerHeight}`);
    svg.setAttribute('width', `100`);
    svg.setAttribute('height', `100`);
    svg.setAttribute('xmlns', `http://www.w3.org/2000/svg`);
    //svg.setAttribute("transform", `rotate(30)`);
    svg.id = 'mainSVG';

    maincanvas.appendChild(svg);
}

export function createDomCell(ObjectCelda) {
    //función que crea la celda en el DOM

    let svg = document.getElementById('mainSVG');


    let image = document.createElementNS('http://www.w3.org/2000/svg','image');
    image.setAttributeNS('http://www.w3.org/1999/xlink', 'href', './imgs/Assets_KAN_CeldaTablero.svg');
    image.setAttributeNS(null,'x', `${ObjectCelda.getRow() * 80}`);
    image.setAttributeNS(null,'y', `${ObjectCelda.getCol() * 80}`);
    image.setAttributeNS(null,'width', `${ObjectCelda.getSizeX()}`);
    image.setAttributeNS(null,'height', `${ObjectCelda.getSizeY()}`);
    image.setAttributeNS(null, "visibility", "visible");
    image.setAttribute("transform", `translate(${ObjectCelda.getSizeX()/2},${ObjectCelda.getSizeY()/2}), rotate(45,${ObjectCelda.getSizeX()/2 + ObjectCelda.getRow() * 80},${ObjectCelda.getSizeY()/2 + ObjectCelda.getCol() * 80})`);

    /*
    let circle = document.createElement('circle');
    circle.setAttribute('cx', '-50');
    circle.setAttribute('cy', '-50');
    circle.setAttribute('r', '30');
    circle.style = 'fill:red';
    
    svg.appendChild(circle);
    */

    svg.appendChild(image);

}


export function maxCeldaPorFila(row, col) {
    //Función que valida si la celda debe existir
    let validation;

    switch (row) {
        case 0:
            validation = col < 4;
            break;
        case 1:
            validation = col < 5;
            break;
        case 2:
            validation = col < 6;
            break;
        case 3:
            validation = col < 7;
            break;
        case 4:
            validation = col < 6;
            break;
        case 5:
            validation = col < 5;
            break;
        case 6:
            validation = col < 4;
            break;
        default:
            validation = false;
    }

    /*
    Hay una lógica matemática más precisa para definir cual es el máximo de celdas por fila, pero no la estoy logrando pensar.
    if(row <= 4){
        //Esto está bien
        validation = col == 3 + row
    }else {
        //Esto no está bien.
        validation = col == row - 3
    }*/

    console.log(`fila ${row}, columna ${col}: validado ${validation}`);
    return validation;
}

export function crearTablero() {
    //Función uqe desarrolla el tablero

    let matrix = [];

    //Genero la matriz en memoria
    for (let row = 0; row < 7; row++) {
        matrix[row] = [];
        for (let col = 0; col < 7; col++) {
            if (maxCeldaPorFila(row, col)) {
                matrix[row][col] = new Celda(row, col);
                createDomCell(matrix[row][col]);
            }
        }
    }
    console.log(matrix);
}