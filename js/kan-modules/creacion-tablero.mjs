import {
    Celda
} from '../kan-data/kan-clases.mjs';

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

export function createDomCell(ObjectCelda, claseDeLaCelda = '') {
    //función que crea la celda en el DOM
    let grid = document.getElementById('hexGrid');

    let hex = document.createElement('div');
    hex.className = claseDeLaCelda;
    hex.id = `hex${ObjectCelda.getRow()}-${ObjectCelda.getCol()}`
    hex.dataset.row = ObjectCelda.getRow();
    hex.dataset.col = ObjectCelda.getCol();
    hex.innerHTML = `r${ObjectCelda.getRow()}-c${ObjectCelda.getCol()}`;




    grid.appendChild(hex);




    /*
    let svg = document.getElementById('hexGrid');


    let image = document.createElementNS('http://www.w3.org/2000/svg', 'image');
    image.setAttributeNS('http://www.w3.org/1999/xlink', 'href', './imgs/Assets_KAN_CeldaTablero.svg');
    image.setAttributeNS(null, 'x', `${ObjectCelda.getRow() * 80}`);
    image.setAttributeNS(null, 'y', `${ObjectCelda.getCol() * 80}`);
    image.setAttributeNS(null, 'width', `${ObjectCelda.getSizeX()}`);
    image.setAttributeNS(null, 'height', `${ObjectCelda.getSizeY()}`);
    image.setAttributeNS(null, "visibility", "visible");
    image.classList = 'hex';
    */
    /*image.setAttribute("transform", `translate(${ObjectCelda.getSizeX()/2},${ObjectCelda.getSizeY()/2}), rotate(45,${ObjectCelda.getSizeX()/2 + ObjectCelda.getRow() * 80},${ObjectCelda.getSizeY()/2 + ObjectCelda.getCol() * 80})`);*/

    /*
    svg.appendChild(image);
    */
}

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

    let clase = validacion == true ? 'hex-jumper' : 'hex';
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

    let matrix = [];

    //Genero la matriz en memoria
    for (let row = 0; row < 7; row++) {
        matrix[row] = [];
        for (let col = 0; col < 7; col++) {
            if (celdaDebeExistir(row, col)) {
                matrix[row][col] = new Celda(row, col, true);
                createDomCell(matrix[row][col], claseDeLaCelda(row, col));
            }


            /*
            // El siguiente código funcionaría usando claseCorrespondientePorCelda.
            // Esta lógica está pensada para crear una grilla cuadrada de celdas, y ocultar las que no corresponden.
            matrix[row][col] = new Celda(row, col, claseCorrespondientePorCelda(row, col) == 'hex');
            createDomCell(matrix[row][col], claseCorrespondientePorCelda(row, col));
            */
        }
    }
    console.log(matrix);
}