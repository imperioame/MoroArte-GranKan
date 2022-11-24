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
        //hex.setAttribute('style', `top: ${window.innerHeight/2 - (HEX_HEIGHT/2) + center_Y}px; left: ${window.innerWidth/2 - (HEX_WIDTH / 2) + center_X}px`);
        hex.setAttribute('style', `top: ${center_Y}px; left: ${center_X}px`);
        hex.innerHTML = id;
        //hex.innerHTML = `xPos${center_X_rounded}-yPos${center_Y_rounded}`;

        saveToMemory(center_X_rounded, center_Y_rounded, id);
        BOARD.appendChild(hex);
    }
}

function saveToMemory(position_X, position_Y, id) {
    //Creates an object, asignes position and save to array
    let cell = new Cell(position_X, position_Y, id);
    //console.warn(cell.getCellId);
    //console.warn(cell.getPosX);
    //console.warn(cell.getPosY);
    CELL_ARRAY.length != 0 ? defineCellSurroundings(cell) : '';

    CELL_ARRAY.push(cell);
    //console.log(CELL_ARRAY);

}

function defineCellSurroundings(cellToBeSaved) {
    // checks all surroundings to set attributes
    // Does path tracing
    for (let direction = 1; direction <= 6; direction++) {
        // Direction is used as math factor.
        // Direction Datasheet:
        // 1 = top_right;
        // 2 = middle_right;
        // 3 = bottom_right;
        // 4 = bottom_left;
        // 5 = middle_left;
        // 6 = top_left;

        let dY = cellToBeSaved.getPosY;
        if (direction != 2 && direction != 5) {
            //console.log('NO es desplazamiento horizontal');
            dY = Math.round((cellToBeSaved.getPosY + (direction == 1 || direction == 6 ? -1 : 1) * HEX_HEIGHT) * 100) / 100;
        }
        let dX = Math.round((cellToBeSaved.getPosX + (direction < 4 ? 1 : -1) * HEX_WIDTH / 2) * 100) / 100;



        CELL_ARRAY.forEach(looped_cell => {
            //Checks if this cell's position is near (dx;dy)

            if (looped_cell.getPosX <= dX + HEX_WIDTH / 2 + 5 && looped_cell.getPosX >= dX - HEX_WIDTH / 2 - 5) {
                //console.log('validé dX')
                if (looped_cell.getPosY <= dY + HEX_WIDTH / 2 + 5 && looped_cell.getPosY >= dY - HEX_WIDTH / 2 - 5) {
                    //console.log('encontré una celda que es contigua a la celda que se está guardano.');
                    //saves in cellToBeSaved the proximity attribute corresponding to what DIRECTION defines
                    // It also saves OPPOSITE direction in looped_cell
                    // remember that this function detects proximity for pieces previously saved. That means if there was a match in the ifs statements, the looped_cell did not have saved the proximity information
                    switch (direction) {
                        case 1:
                            cellToBeSaved.setcell_top_right = looped_cell.getCellId;
                            looped_cell.setcell_bottom_left = cellToBeSaved.getCellId;
                            break;
                        case 2:
                            cellToBeSaved.setcell_middle_right = looped_cell.getCellId;
                            looped_cell.setcell_middle_left = cellToBeSaved.getCellId;
                            break;
                        case 3:
                            cellToBeSaved.setcell_bottom_right = looped_cell.getCellId;
                            looped_cell.setcell_top_left = cellToBeSaved.getCellId;
                            break;
                        case 4:
                            cellToBeSaved.setcell_bottom_left = looped_cell.getCellId;
                            looped_cell.setcell_top_right = cellToBeSaved.getCellId;
                            break;
                        case 5:
                            cellToBeSaved.setcell_middle_left = looped_cell.getCellId;
                            looped_cell.setcell_middle_right = cellToBeSaved.getCellId;
                            break;
                        case 6:
                            cellToBeSaved.setcell_top_left = looped_cell.getCellId;
                            looped_cell.setcell_bottom_right = cellToBeSaved.getCellId;
                            break;
                        default:
                            break;
                    }



                    //console.log(cellToBeSaved);
                    //console.log(looped_cell);

                }
            }
        });
    }
}

function checkEmptyPosition(position_X, position_Y) {
    //Checks if position in board is occupied, if so, reutns false
    let position_empty = true;

    for (let i = 0; i < CELL_ARRAY.length; i++) {
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

    console.error('Tenemos que consultar si el usuario ya jugó antes (es decir, verificar si existe algo en el localStorage. Si es así, no debemos cargar el tablero de cero, sino utilizar la data que se encuentra en el localStorage.');
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
    piece.className = `piece ${pieceObject.player == 'black' ? 'black_player_piece' : 'white_player_piece'}`;
    piece.id = `Player_${pieceObject.getPlayer}-Piece_${pieceObject.getPieceId}`;
    piece.dataset.piece_number = pieceObject.getPieceId;
    if (pieceObject.getPieceId == 5 || pieceObject.getPieceId == 16){
        piece.dataset.z_index = 24;
    }else{
        piece.dataset.z_index = PIECE_ARRAY.length - 1;  
    }
    piece.style.zIndex = piece.dataset.z_index;
    piece.dataset.piece_player_color = pieceObject.getPlayer;  

    let y_axis = Math.round(Math.random() * 100 + 10);
    let x_axis = Math.round(Math.random() * 100 + 10);
    piece.setAttribute('style', `bottom: ${y_axis}px; left: ${x_axis}px`);

    let image = document.createElement('img');
    image.src = pieceObject.getimgTitle;
    piece.appendChild(image);
    //piece.innerHTML = pieceObject.getPieceId;
    
    //Creates a transparent element to cover svg, and hosts functionality (onclicks)
    let coverDiv = document.createElement('div');
    coverDiv.className = 'cover_div';

    //Removes previous event listeners (if it had)
    //piece.replaceWith(piece.cloneNode(true));
    coverDiv.addEventListener("click", movePiece);

    piece.appendChild(coverDiv);


    //Place it in correspondent players aside
    let playerAside = pieceObject.getPlayer == 'black' ? document.getElementById('player1').getElementsByClassName('pieces_board')[0] : document.getElementById('player2').getElementsByClassName('pieces_board')[0];
    playerAside.appendChild(piece);
}

function initialize(max_layers) {
    let center_X = window.innerWidth / 2 - (HEX_WIDTH / 2);
    let center_Y = window.innerHeight / 2 - (HEX_HEIGHT / 2);
    recursiveHexagon(center_X, center_Y, max_layers, RAD);
    createPieces();
}

window.onload = function () {
    console.log('inicializando...');
    initialize(LAYERS);
    //console.log(CELL_ARRAY);
};