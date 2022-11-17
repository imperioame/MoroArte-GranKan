const BOARD = document.getElementById('board');
let w = Math.min(window.innerWidth, window.innerHeight);
const RAD = w / 5;
const HEXRAD = 52;
const HEXHEIGHT = 60;
const HEXWIDTH = 104;
const TAU = Math.PI * 2;
const HEXMARGIN = 3;



function createHex(center_X, center_Y) {
    //Creo el elemento y lo inserto en el dom con posición fijada.
    let center_X_rounded = Math.round(center_X * 100) / 100;
    let center_Y_rounded = Math.round(center_Y * 100) / 100;

    let hex = document.createElement('div');
    hex.className = "hex-clip";
    hex.id = `hex${center_X}-${center_Y}`;
    hex.dataset.xPosition = center_X_rounded;
    hex.dataset.yPosition = center_Y_rounded;
    hex.setAttribute('style', `top: ${window.innerHeight/2 - (HEXHEIGHT/2) + center_Y}px; left: ${window.innerWidth/2 - (HEXWIDTH/2) + center_X}px`);
    hex.innerHTML = `xPos${center_X_rounded}-yPos${center_Y_rounded}`;
    
    /*
    // Fórmula para hacerlo con DIV + before y after
    let hex = document.createElement('div');
    hex.className = "hex";
    hex.id = `hex${center_X}-${center_Y}`;
    hex.dataset.xPosition = center_X;
    hex.dataset.yPosition = center_Y;
    //hex.innerHTML = `xPos${center_X}-yPos${center_Y}`;
    hex.setAttribute('style', `top: ${window.innerHeight/2 - (HEXHEIGHT/2) + center_Y}px; left: ${window.innerWidth/2 - (HEXWIDTH/2) + center_X}px`);
    */

    /*
        // Fórmula para hacerlo con ELEMENTOS UNICODE
        let hex = document.createElement('span');
        hex.className = "hex_unicode";
        hex.id = `hex${center_X}-${center_Y}`;
        hex.dataset.xPosition = center_X;
        hex.dataset.yPosition = center_Y;
        hex.innerHTML = '&#x2B22;';
        hex.setAttribute('style', `position: fixed; top: ${window.innerHeight/2 - (HEXHEIGHT/2) + center_Y}px; left: ${window.innerWidth/2 - (HEXWIDTH/2) + center_X}px;`);
    */


    BOARD.appendChild(hex);
    console.log('generé una celda');
}

function saveToMemHex() {
    //Creo el objeto en memoria

}



function recursiveHexagon(center_X, center_Y, depth, r) {
    //Crea secuencialmente todos los hexágonos
    if (depth == 0) {
        createHex(center_X, center_Y);
    } else {
        recursiveHexagon(center_X, center_Y, depth - 1, r / 2)
        for (let a = 0; a < TAU; a += TAU / 6) {
            let x = center_X + r * Math.cos(a);
            let y = center_Y + r * Math.sin(a);

            if (depth > 0) {
                recursiveHexagon(x, y, depth - 1, r / 2);
            }
        }
    }
}



function initialize(max_layers) {
    let center_X = 0;
    let center_Y = 0;
    recursiveHexagon(center_X, center_Y, max_layers, RAD);
    /*
    for (let layer = 0; layer <= max_layers; layer++) {
        console.log('ingresé a generar una celda');
        //por cada capa, pongo todos los hexágonos
        saveToMemHex();
        
    }
    */
}

window.onload = function () {
    console.log('inicializando...');
    let layers = 2;
    initialize(layers);
};