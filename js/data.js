const BOARD = document.getElementById('board');
let w = Math.min(window.innerWidth, window.innerHeight);
const RAD = w / 5;
const TAU = Math.PI * 2;

const LAYERS = 2;
const HEXHEIGHT = 60;
const HEXWIDTH = 104;

const CELLARRAY = [];

const PIECEARRAY = [];
const COLORARRAY = [];

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
COLORARRAY.push(new Color(COLORARRAY.length, 'orange', '#ff5624')); //0 - Naranja
COLORARRAY.push(new Color(COLORARRAY.length, 'magenta', '#872996')); //1 - Magenta
COLORARRAY.push(new Color(COLORARRAY.length, 'green', '#44b94a')); //2 - Verde
COLORARRAY.push(new Color(COLORARRAY.length, 'gray', '#c1cac8')); //3 - Gris
COLORARRAY.push(new Color(COLORARRAY.length, 'yellow', '#ffe951')); //4 - Amarillo
COLORARRAY.push(new Color(COLORARRAY.length, 'blue', '#162061')); //5 - azul

class Piece {
    constructor(pieceId, player) {
        this.pieceId = pieceId;
        this.player = player;
        this.cellId = 0;
        //Define Colours depending on piece
        //Pieces and color are defined and cannot be random. It must be like this.
        switch (pieceId) {
            case 1:
                this.setcolor_top_left = COLORARRAY[0];
                this.setcolor_top_right = COLORARRAY[1];
                this.setcolor_middle_left = COLORARRAY[0];
                this.setcolor_middle_right = COLORARRAY[1];
                this.setcolor_bottom_left = COLORARRAY[2];
                this.setcolor_bottom_right = COLORARRAY[3];
                break;
            case 2:
                this.setcolor_top_left = COLORARRAY[0];
                this.setcolor_top_right = COLORARRAY[4];
                this.setcolor_middle_left = COLORARRAY[3];
                this.setcolor_middle_right = COLORARRAY[4];
                this.setcolor_bottom_left = COLORARRAY[2];
                this.setcolor_bottom_right = COLORARRAY[0];
                break;
            case 3:
                this.setcolor_top_left = COLORARRAY[0];
                this.setcolor_top_right = COLORARRAY[4];
                this.setcolor_middle_left = COLORARRAY[0];
                this.setcolor_middle_right = COLORARRAY[2];
                this.setcolor_bottom_left = COLORARRAY[3];
                this.setcolor_bottom_right = COLORARRAY[1];
                break;
            case 4:
                this.setcolor_top_left = COLORARRAY[5];
                this.setcolor_top_right = COLORARRAY[5];
                this.setcolor_middle_left = COLORARRAY[0];
                this.setcolor_middle_right = COLORARRAY[1];
                this.setcolor_bottom_left = COLORARRAY[2];
                this.setcolor_bottom_right = COLORARRAY[3];
                break;
            case 5:
                this.setcolor_top_left = COLORARRAY[3];
                this.setcolor_top_right = COLORARRAY[2];
                this.setcolor_middle_left = COLORARRAY[5];
                this.setcolor_middle_right = COLORARRAY[1];
                this.setcolor_bottom_left = COLORARRAY[4];
                this.setcolor_bottom_right = COLORARRAY[0];
                break;
            case 6:
                this.setcolor_top_left = COLORARRAY[5];
                this.setcolor_top_right = COLORARRAY[3];
                this.setcolor_middle_left = COLORARRAY[4];
                this.setcolor_middle_right = COLORARRAY[1];
                this.setcolor_bottom_left = COLORARRAY[2];
                this.setcolor_bottom_right = COLORARRAY[4];
                break;
            case 7:
                this.setcolor_top_left = COLORARRAY[5];
                this.setcolor_top_right = COLORARRAY[4];
                this.setcolor_middle_left = COLORARRAY[0];
                this.setcolor_middle_right = COLORARRAY[1];
                this.setcolor_bottom_left = COLORARRAY[2];
                this.setcolor_bottom_right = COLORARRAY[0];
                break;
            case 8:
                this.setcolor_top_left = COLORARRAY[5];
                this.setcolor_top_right = COLORARRAY[4];
                this.setcolor_middle_left = COLORARRAY[0];
                this.setcolor_middle_right = COLORARRAY[1];
                this.setcolor_bottom_left = COLORARRAY[2];
                this.setcolor_bottom_right = COLORARRAY[0];
                break;
            case 9:
                this.setcolor_top_left = COLORARRAY[2];
                this.setcolor_top_right = COLORARRAY[2];
                this.setcolor_middle_left = COLORARRAY[0];
                this.setcolor_middle_right = COLORARRAY[1];
                this.setcolor_bottom_left = COLORARRAY[5];
                this.setcolor_bottom_right = COLORARRAY[0];
                break;
            case 10:
                this.setcolor_top_left = COLORARRAY[5];
                this.setcolor_top_right = COLORARRAY[4];
                this.setcolor_middle_left = COLORARRAY[1];
                this.setcolor_middle_right = COLORARRAY[0];
                this.setcolor_bottom_left = COLORARRAY[3];
                this.setcolor_bottom_right = COLORARRAY[0];
                break;
            case 11:
                this.setcolor_top_left = COLORARRAY[5];
                this.setcolor_top_right = COLORARRAY[4];
                this.setcolor_middle_left = COLORARRAY[0];
                this.setcolor_middle_right = COLORARRAY[1];
                this.setcolor_bottom_left = COLORARRAY[2];
                this.setcolor_bottom_right = COLORARRAY[0];
                break;
            case 12:
                this.setcolor_top_left = COLORARRAY[5];
                this.setcolor_top_right = COLORARRAY[3];
                this.setcolor_middle_left = COLORARRAY[4];
                this.setcolor_middle_right = COLORARRAY[1];
                this.setcolor_bottom_left = COLORARRAY[2];
                this.setcolor_bottom_right = COLORARRAY[4];
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
    constructor() {
        this.posX = 0;
        this.posY = 0;
        this.isEmpty = true;
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

    set setPosX(newPos) {
        this.posX = newPos;
    }
    set setPosY(newPos) {
        this.posY = newPos;
    }

    set setIsEmpty(newValue) {
        this.isEmpty = newValue;
    }
}