function createHex(center_X, center_Y, id) {
    //Creo el elemento y lo inserto en el dom con posición fijada.
    let center_X_rounded = Math.round(center_X * 100) / 100;
    let center_Y_rounded = Math.round(center_Y * 100) / 100;

    if (checkEmptyPosition(center_X_rounded, center_Y_rounded)) {
        let hex = document.createElement('div');
        hex.className = "hex-clip";
        //hex.id = `hex${center_X}-${center_Y}`;
        hex.id = id;
        hex.dataset.xPosition = center_X_rounded;
        hex.dataset.yPosition = center_Y_rounded;
        hex.setAttribute('style', `top: ${window.innerHeight/2 - (HEX_HEIGHT/2) + center_Y}px; left: ${window.innerWidth/2 - (HEX_WIDTH/2) + center_X}px`);
        hex.innerHTML = id;
        //hex.innerHTML = `xPos${center_X_rounded}-yPos${center_Y_rounded}`;

        saveToMemory(center_X_rounded, center_Y_rounded);


        /*
        // Fórmula para hacerlo con DIV + before y after
        let hex = document.createElement('div');
        hex.className = "hex";
        hex.id = `hex${center_X}-${center_Y}`;
        hex.dataset.xPosition = center_X;
        hex.dataset.yPosition = center_Y;
        //hex.innerHTML = `xPos${center_X}-yPos${center_Y}`;
        hex.setAttribute('style', `top: ${window.innerHeight/2 - (HEX_HEIGHT/2) + center_Y}px; left: ${window.innerWidth/2 - (HEX_WIDTH/2) + center_X}px`);
        */

        /*
            // Fórmula para hacerlo con ELEMENTOS UNICODE
            let hex = document.createElement('span');
            hex.className = "hex_unicode";
            hex.id = `hex${center_X}-${center_Y}`;
            hex.dataset.xPosition = center_X;
            hex.dataset.yPosition = center_Y;
            hex.innerHTML = '&#x2B22;';
            hex.setAttribute('style', `position: fixed; top: ${window.innerHeight/2 - (HEX_HEIGHT/2) + center_Y}px; left: ${window.innerWidth/2 - (HEX_WIDTH/2) + center_X}px;`);
        */


        BOARD.appendChild(hex);
    }
}

function saveToMemory(position_X, position_Y) {
    //Creates an object, asignes position and save to array
    let cell = new Cell();
    cell.setPosX = position_X;
    cell.setPosY = position_Y;

    CELL_ARRAY.push(cell);

}

function checkEmptyPosition(position_X, position_Y) {
    //Checks if position in board is occupied, if so, reutns false
    //console.log('entro a consultar posiciones duplicadas');
    //console.log(CELL_ARRAY.length);

    let position_empty = true;



    for (let i = 0; i < CELL_ARRAY.length; i++) {
        //console.log('consulto el array');
        //console.log(`Xpos; ${CELL_ARRAY[i].getPosX} YPos ${CELL_ARRAY[i].getPosY}`);
        if (CELL_ARRAY[i].getPosX == position_X && CELL_ARRAY[i].getPosY == position_Y) {
            position_empty = false;
            return position_empty;
        }
    }

    return position_empty;
}


let hexcount = 0;

function recursiveHexagon(center_X, center_Y, depth, r) {
    //Creates recursively all hexagons
    if (depth == 0) {
        createHex(center_X, center_Y, hexcount++);
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



function createPieces() {
    // Create all pieces in memory
    let piecenumber = 1;
    let playercolor = 'black';
    for (let i = 1; i <= 24; i++) {
        PIECE_ARRAY.push(new Piece(piecenumber, playercolor));
        if (piecenumber == 12) {
            piecenumber = 1;
            playercolor = 'white';
        } else {
            piecenumber++;
        }
        //Create piece in DOM and distribute it in aside
        createDomPiece(PIECE_ARRAY[PIECE_ARRAY.length - 1]);
    }
    //console.log(PIECE_ARRAY);
}

function createDomPiece(pieceObject) {
    //This creates a piece element and places it in the dom
    let piece = document.createElement('div');
    piece.className = "piece";
    piece.id = `Player_${pieceObject.getPlayer}-Piece_${pieceObject.getPieceId}`;


    let y_axis = Math.round(Math.random() * 100 + 10);
    let x_axis = Math.round(Math.random() * 100 + 10);
    piece.setAttribute('style', `bottom: ${y_axis}px; left: ${x_axis}px`);
    piece.innerHTML = pieceObject.getPieceId;
    //Removes previous event listeners (if it had)
    //piece.replaceWith(piece.cloneNode(true));
    piece.addEventListener("click", movePiece);


    //Place it in correspondent players aside
    let playerAside = pieceObject.getPlayer == 'black' ? document.getElementById('player1').getElementsByClassName('pieces_board')[0] : document.getElementById('player2').getElementsByClassName('pieces_board')[0];
    playerAside.appendChild(piece);
}

function movePiece(e) {
    //Adds the functionality, when called, to move object until it's released
    console.log('clicked piece');
    // selected_piece is defined in data.js
    selected_piece = document.getElementById(e.target.id);
    e.stopPropagation();
    selected_piece.style.position = 'fixed';
    const onMouseMove = (e) => {
        //Defines the function that allows piece to move to mouse
        selected_piece.style.left = e.pageX /* - HEX_WIDTH / 2 */ + 'px';
        selected_piece.style.top = e.pageY /* - HEX_HEIGHT / 2 */ + 'px';
    }

    function releasepiece(e) {
        //This removes the 'follow mouse' functionality when piece is selected
        // console.log('releasing piece');
        // console.log(e);
        e.stopPropagation();
        document.removeEventListener('mousemove', onMouseMove);

        console.log(e.target);

        if (e.target.className == 'hex-clip') {
            console.log('es una celda');
            // Clicked piece ID
            selected_piece.id;
            // Cell's ID
            e.target.id
            // Mouse position
            e.pageX
            e.pageY

        }
    }

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('click', releasepiece);
}


function initialize(max_layers) {
    let center_X = 0;
    let center_Y = 0;
    recursiveHexagon(center_X, center_Y, max_layers, RAD);
    createPieces();
}

window.onload = function () {
    console.log('inicializando...');
    initialize(LAYERS);
    //console.log(CELL_ARRAY);
};