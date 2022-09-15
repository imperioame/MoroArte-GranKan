import {Celda} from '../kan-data/kan-clases.mjs';

export function crearTablero(maincanvas){
    let svg = document.createElement('svg');
    svg.setAttribute("viewBox", "0 0 200 200");
    
    //Creo los arrays row/col
    let matrix = [];

    function maxCeldaPorFila(row, col){
        //Función que valida si la celda debe existir
        let validation;

        switch(row) {
            case 1:
                validation = col < 4;
                break;
            case 2:
                validation = col < 5;
                break;
            case 3:
                validation = col < 6;
                break;
            case 4:
                validation = col < 7;
                break;
            case 5:
                validation = col < 6;
                break;
            case 6:
                validation = col < 5;
                break;
            case 7:
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

        return validation;
    }


    //Genero la matriz en memoria
    for(let row = 0; row<7; row++){
        for(let col = 0; col<7; col++){
            if (maxCeldaPorFila(row, col)){
                matrix[row] = new Celda(row, col);
            }
        }
    }

    let polygon = document.createElement('polygon');
    polygon.setAttribute("points", "100,0 50,-87 -50,-87 -100,-0 -50,87 50,87");
    polygon.setAttribute("fill", "black");
    polygon.style = "fill: black";

    svg.appendChild(polygon);
    svg.classList = 'testClass';

    maincanvas.appendChild(svg);

}