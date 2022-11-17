const BOARD = document.getElementById('board');
let w = Math.min(window.innerWidth, window.innerHeight);
const RAD = w / 5;
const TAU = Math.PI * 2;

const LAYERS = 2;
const HEXHEIGHT = 60;
const HEXWIDTH = 104;

const CELLARRAY = [];


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