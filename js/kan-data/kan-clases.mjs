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
        this.empty = true;
    }

    get row(){
        return this.row;
    }

    get col(){
        return this.col;
    }

    get empty(){
        return this.empty;
    }

    set row(row){
        this.row = row;
    }

    set col(col){
        this.col = col;
    }

    set empty(value){
        this.emtpy = value;
    }

}