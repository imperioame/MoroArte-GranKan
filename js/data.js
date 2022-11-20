const BOARD = document.getElementById('board');
let w = Math.min(window.innerWidth, window.innerHeight);
const RAD = w / 5;
const TAU = Math.PI * 2;

const LAYERS = 2;
const HEX_HEIGHT = 60;
const HEX_WIDTH = 104;

const CELL_ARRAY = [];

const PIECE_ARRAY = [];
const COLOR_ARRAY = [];

let selected_piece;

class Color {
    constructor(id, name, color) {
        this.id = id;
        this.name = name;
        this.color = color;
    }
    get getId() {
        return this.id;
    }
    get getName() {
        return this.name;
    }
    get getColor() {
        return this.color;
    }
}

// Define possible colors
COLOR_ARRAY.push(new Color(COLOR_ARRAY.length, 'orange', '#ff5624')); //0 - Naranja
COLOR_ARRAY.push(new Color(COLOR_ARRAY.length, 'magenta', '#872996')); //1 - Magenta
COLOR_ARRAY.push(new Color(COLOR_ARRAY.length, 'green', '#44b94a')); //2 - Verde
COLOR_ARRAY.push(new Color(COLOR_ARRAY.length, 'gray', '#c1cac8')); //3 - Gris
COLOR_ARRAY.push(new Color(COLOR_ARRAY.length, 'yellow', '#ffe951')); //4 - Amarillo
COLOR_ARRAY.push(new Color(COLOR_ARRAY.length, 'blue', '#162061')); //5 - azul

class Piece {
    constructor(pieceId, player) {
        this.pieceId = pieceId;
        this.player = player;
        this.cellId = 0;
        //Define Colours depending on piece
        //Pieces and color are defined and cannot be random. It must be like this.
        switch (pieceId) {
            case 1:
                this.setcolor_top_left = COLOR_ARRAY[0];
                this.setcolor_top_right = COLOR_ARRAY[1];
                this.setcolor_middle_left = COLOR_ARRAY[0];
                this.setcolor_middle_right = COLOR_ARRAY[1];
                this.setcolor_bottom_left = COLOR_ARRAY[2];
                this.setcolor_bottom_right = COLOR_ARRAY[3];
                break;
            case 2:
                this.setcolor_top_left = COLOR_ARRAY[0];
                this.setcolor_top_right = COLOR_ARRAY[4];
                this.setcolor_middle_left = COLOR_ARRAY[3];
                this.setcolor_middle_right = COLOR_ARRAY[4];
                this.setcolor_bottom_left = COLOR_ARRAY[2];
                this.setcolor_bottom_right = COLOR_ARRAY[0];
                break;
            case 3:
                this.setcolor_top_left = COLOR_ARRAY[0];
                this.setcolor_top_right = COLOR_ARRAY[4];
                this.setcolor_middle_left = COLOR_ARRAY[0];
                this.setcolor_middle_right = COLOR_ARRAY[2];
                this.setcolor_bottom_left = COLOR_ARRAY[3];
                this.setcolor_bottom_right = COLOR_ARRAY[1];
                break;
            case 4:
                this.setcolor_top_left = COLOR_ARRAY[5];
                this.setcolor_top_right = COLOR_ARRAY[5];
                this.setcolor_middle_left = COLOR_ARRAY[0];
                this.setcolor_middle_right = COLOR_ARRAY[1];
                this.setcolor_bottom_left = COLOR_ARRAY[2];
                this.setcolor_bottom_right = COLOR_ARRAY[3];
                break;
            case 5:
                this.setcolor_top_left = COLOR_ARRAY[3];
                this.setcolor_top_right = COLOR_ARRAY[2];
                this.setcolor_middle_left = COLOR_ARRAY[5];
                this.setcolor_middle_right = COLOR_ARRAY[1];
                this.setcolor_bottom_left = COLOR_ARRAY[4];
                this.setcolor_bottom_right = COLOR_ARRAY[0];
                break;
            case 6:
                this.setcolor_top_left = COLOR_ARRAY[5];
                this.setcolor_top_right = COLOR_ARRAY[3];
                this.setcolor_middle_left = COLOR_ARRAY[4];
                this.setcolor_middle_right = COLOR_ARRAY[1];
                this.setcolor_bottom_left = COLOR_ARRAY[2];
                this.setcolor_bottom_right = COLOR_ARRAY[4];
                break;
            case 7:
                this.setcolor_top_left = COLOR_ARRAY[5];
                this.setcolor_top_right = COLOR_ARRAY[4];
                this.setcolor_middle_left = COLOR_ARRAY[0];
                this.setcolor_middle_right = COLOR_ARRAY[1];
                this.setcolor_bottom_left = COLOR_ARRAY[2];
                this.setcolor_bottom_right = COLOR_ARRAY[0];
                break;
            case 8:
                this.setcolor_top_left = COLOR_ARRAY[5];
                this.setcolor_top_right = COLOR_ARRAY[4];
                this.setcolor_middle_left = COLOR_ARRAY[0];
                this.setcolor_middle_right = COLOR_ARRAY[1];
                this.setcolor_bottom_left = COLOR_ARRAY[2];
                this.setcolor_bottom_right = COLOR_ARRAY[0];
                break;
            case 9:
                this.setcolor_top_left = COLOR_ARRAY[2];
                this.setcolor_top_right = COLOR_ARRAY[2];
                this.setcolor_middle_left = COLOR_ARRAY[0];
                this.setcolor_middle_right = COLOR_ARRAY[1];
                this.setcolor_bottom_left = COLOR_ARRAY[5];
                this.setcolor_bottom_right = COLOR_ARRAY[0];
                break;
            case 10:
                this.setcolor_top_left = COLOR_ARRAY[5];
                this.setcolor_top_right = COLOR_ARRAY[4];
                this.setcolor_middle_left = COLOR_ARRAY[1];
                this.setcolor_middle_right = COLOR_ARRAY[0];
                this.setcolor_bottom_left = COLOR_ARRAY[3];
                this.setcolor_bottom_right = COLOR_ARRAY[0];
                break;
            case 11:
                this.setcolor_top_left = COLOR_ARRAY[5];
                this.setcolor_top_right = COLOR_ARRAY[4];
                this.setcolor_middle_left = COLOR_ARRAY[0];
                this.setcolor_middle_right = COLOR_ARRAY[1];
                this.setcolor_bottom_left = COLOR_ARRAY[2];
                this.setcolor_bottom_right = COLOR_ARRAY[0];
                break;
            case 12:
                this.setcolor_top_left = COLOR_ARRAY[5];
                this.setcolor_top_right = COLOR_ARRAY[3];
                this.setcolor_middle_left = COLOR_ARRAY[4];
                this.setcolor_middle_right = COLOR_ARRAY[1];
                this.setcolor_bottom_left = COLOR_ARRAY[2];
                this.setcolor_bottom_right = COLOR_ARRAY[4];
                break;
        }

    }
    get getCellId() {
        return this.cellId;
    }
    get getPieceId() {
        return this.pieceId;
    }
    get getPlayer() {
        return this.player;
    }
    get getcolor_top_left() {
        return this.color_top_left;
    }
    get getcolor_top_right() {
        return this.color_top_right;
    }
    get getcolor_middle_left() {
        return this.color_middle_left;
    }
    get getcolor_middle_right() {
        return this.color_middle_right;
    }
    get getcolor_bottom_left() {
        return this.color_bottom_left;
    }
    get getcolor_bottom_right() {
        return this.color_bottom_right;
    }

    set setcolor_top_left(newColor) {
        this.color_top_left = newColor;
    }
    set setcolor_top_right(newColor) {
        this.color_top_right = newColor;
    }
    set setcolor_middle_left(newColor) {
        this.color_middle_left = newColor;
    }
    set setcolor_middle_right(newColor) {
        this.color_middle_right = newColor;
    }
    set setcolor_bottom_left(newColor) {
        this.color_bottom_left = newColor;
    }
    set setcolor_bottom_right(newColor) {
        this.color_bottom_right = newColor;
    }

    set setCellId(newCell) {
        this.cellId = newCell;
    }
}


class Cell {
    constructor(posX, posY, cellId) {
        this.posX = posX;
        this.posY = posY;
        this.cellId = cellId;
        this.isEmpty = true;
        this.cell_top_left = null;
        this.cell_top_right = null;
        this.cell_middle_left = null;
        this.cell_middle_right = null;
        this.cell_bottom_left = null;
        this.cell_bottom_right = null;
    }

    get getPosX() {
        return this.posX;
    }
    get getPosY() {
        return this.posY;
    }
    get getIsEmpty() {
        return this.isEmpty;
    }
    get getCellId() {
        return this.cellId;
    }
    get getcell_top_left() {
        return this.cell_top_left;
    }
    get getcell_top_right() {
        return this.cell_top_right;
    }
    get getcell_middle_left() {
        return this.cell_middle_left;
    }
    get getcell_middle_right() {
        return this.cell_middle_right;
    }
    get getcell_bottom_left() {
        return this.cell_bottom_left;
    }
    get getcell_bottom_right() {
        return this.cell_bottom_right;
    }


    set setPosX(newPos) {
        this.posX = newPos;
    }
    set setPosY(newPos) {
        this.posY = newPos;
    }
    set setIsEmpty(newValue) {
        this.isEmpty = newValue;
    }
    set setCellId(newCellId) {
        this.cellId = newCellId;
    }
    set setcell_top_left(newCell) {
        this.cell_top_left = newCell;
    }
    set setcell_top_right(newCell) {
        this.cell_top_right = newCell;
    }
    set setcell_middle_left(newCell) {
        this.cell_middle_left = newCell;
    }
    set setcell_middle_right(newCell) {
        this.cell_middle_right = newCell;
    }
    set setcell_bottom_left(newCell) {
        this.cell_bottom_left = newCell;
    }
    set setcell_bottom_right(newCell) {
        this.cell_bottom_right = newCell;
    }
}