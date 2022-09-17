export class Celda {
    //Una celda debe tener:
    // un identificador único
    // un índice de fila
    // uno de columna
    // la propiedad "vacío", como booleano.

    constructor(row,col){
        this.id = `r${row}-c${col}`
        this.row = row;
        this.col = col;
        this.sizex = 100;
        this.sizey = 100;
    }

    getRow(){
        return this.row;
    }

    getCol(){
        return this.col;
    }

    getEmpty(){
        return this.empty;
    }
    getSizeX(){
        return this.sizex;
    }
    getSizeY(){
        return this.sizey;
    }

    setRow(input){
        this.row = input;
    }

    setCol(input){
        this.col = input;
    }

    setEmpty(input){
        this.emtpy = input;
    }
    setSizeY(input){
        this.sizey = input;
    }
    setSizeX(input){
        this.sizex = input;
    }
}