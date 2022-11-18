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

COLORARRAY.push(new Color(0, 'orange', '#ff5624'));
COLORARRAY.push(new Color(COLORARRAY.length, 'magenta', '#872996'));
COLORARRAY.push(new Color(COLORARRAY.length, 'green', '#44b94a'));
COLORARRAY.push(new Color(COLORARRAY.length, 'gray', '#c1cac8'));
COLORARRAY.push(new Color(COLORARRAY.length, 'yellow', '#ffe951'));
COLORARRAY.push(new Color(COLORARRAY.length, 'blue', '#162061'));

console.log(COLORARRAY);

class Color {
    constructor(id, name, color) {
        this.id = id;
        this.name = name;
        this.color = color;
    }
    get id() {
        return this.id;
    }
    get name() {
        return this.name;
    }
    get color() {
        return this.color;
    }
}

class Piece {
    constructor(pieceId, player) {
        this.pieceId = pieceId;
        this.player = player;
        //Define Colours depending on piece
        switch (pieceId) {
            case 1:
                this.color_top_left = COLORARRAY[0];
                this.color_top_right = COLORARRAY[0];
                this.color_middle_left = COLORARRAY[0];
                this.color_middle_right = COLORARRAY[0];
                this.color_bottom_left = COLORARRAY[0];
                this.color_bottom_right = COLORARRAY[0];
                break;
            case 2:
                this.color_top_left = COLORARRAY[0];
                this.color_top_right = COLORARRAY[0];
                this.color_middle_left = COLORARRAY[0];
                this.color_middle_right = COLORARRAY[0];
                this.color_bottom_left = COLORARRAY[0];
                this.color_bottom_right = COLORARRAY[0];
                break;
            case 3:
                this.color_top_left = COLORARRAY[0];
                this.color_top_right = COLORARRAY[0];
                this.color_middle_left = COLORARRAY[0];
                this.color_middle_right = COLORARRAY[0];
                this.color_bottom_left = COLORARRAY[0];
                this.color_bottom_right = COLORARRAY[0];
                break;
            case 4:
                this.color_top_left = COLORARRAY[0];
                this.color_top_right = COLORARRAY[0];
                this.color_middle_left = COLORARRAY[0];
                this.color_middle_right = COLORARRAY[0];
                this.color_bottom_left = COLORARRAY[0];
                this.color_bottom_right = COLORARRAY[0];
                break;
            case 5:
                this.color_top_left = COLORARRAY[0];
                this.color_top_right = COLORARRAY[0];
                this.color_middle_left = COLORARRAY[0];
                this.color_middle_right = COLORARRAY[0];
                this.color_bottom_left = COLORARRAY[0];
                this.color_bottom_right = COLORARRAY[0];
                break;
            case 6:
                this.color_top_left = COLORARRAY[0];
                this.color_top_right = COLORARRAY[0];
                this.color_middle_left = COLORARRAY[0];
                this.color_middle_right = COLORARRAY[0];
                this.color_bottom_right = COLORARRAY[0];
                this.color_bottom_left = COLORARRAY[0];
                break;
            case 7:
                this.color_top_left = COLORARRAY[0];
                this.color_top_right = COLORARRAY[0];
                this.color_middle_left = COLORARRAY[0];
                this.color_middle_right = COLORARRAY[0];
                this.color_bottom_right = COLORARRAY[0];
                this.color_bottom_left = COLORARRAY[0];
                break;
            case 8:
                this.color_top_left = COLORARRAY[0];
                this.color_top_right = COLORARRAY[0];
                this.color_middle_left = COLORARRAY[0];
                this.color_middle_right = COLORARRAY[0];
                this.color_bottom_right = COLORARRAY[0];
                this.color_bottom_left = COLORARRAY[0];
                break;
            case 9:
                this.color_top_left = COLORARRAY[0];
                this.color_top_right = COLORARRAY[0];
                this.color_middle_left = COLORARRAY[0];
                this.color_middle_right = COLORARRAY[0];
                this.color_bottom_right = COLORARRAY[0];
                this.color_bottom_left = COLORARRAY[0];
                break;
            case 10:
                this.color_top_left = COLORARRAY[0];
                this.color_top_right = COLORARRAY[0];
                this.color_middle_left = COLORARRAY[0];
                this.color_middle_right = COLORARRAY[0];
                this.color_bottom_right = COLORARRAY[0];
                this.color_bottom_left = COLORARRAY[0];
                break;
            case 11:
                this.color_top_left = COLORARRAY[0];
                this.color_top_right = COLORARRAY[0];
                this.color_middle_left = COLORARRAY[0];
                this.color_middle_right = COLORARRAY[0];
                this.color_bottom_right = COLORARRAY[0];
                this.color_bottom_left = COLORARRAY[0];
                break;
            case 12:
                this.color_top_left = COLORARRAY[0];
                this.color_top_right = COLORARRAY[0];
                this.color_middle_left = COLORARRAY[0];
                this.color_middle_right = COLORARRAY[0];
                this.color_bottom_right = COLORARRAY[0];
                this.color_bottom_left = COLORARRAY[0];
                break;
        }
        this.cellId = 0;
    }
    get getCellId(){
        return this.cellId;
    }
    get PieceId(){
        return this.pieceId;
    }
    get Player(){
        return this.player;
    }
    get color_top_left(){
        return this.color_top_left;
    }
    get color_top_right(){
        return this.color_top_left;
    }
    get color_middle_right(){
        return this.color_top_left;
    }
    get color_top_left(){
        return this.color_top_left;
    }
    get color_top_left(){
        return this.color_top_left;
    }
    get color_top_left(){
        return this.color_top_left;
    }

    set setCellId(newCell){
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