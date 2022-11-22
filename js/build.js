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


        /*
        // Fórmula para hacerlo con DIV + before y after
        let hex = document.createElement('div');
        hex.className = "hex";
        hex.id = `hex${center_X}-${center_Y}`;
        hex.dataset.xPosition = center_X;
        hex.dataset.yPosition = center_Y;
        //hex.innerHTML = `xPos${center_X}-yPos${center_Y}`;
        hex.setAttribute('style', `top: ${window.innerHeight/2 - (HEX_HEIGHT/2) + center_Y}px; left: ${window.innerWidth/2 - (HEX_WIDTH / 2) + center_X}px`);
        */

        /*
            // Fórmula para hacerlo con ELEMENTOS UNICODE
            let hex = document.createElement('span');
            hex.className = "hex_unicode";
            hex.id = `hex${center_X}-${center_Y}`;
            hex.dataset.xPosition = center_X;
            hex.dataset.yPosition = center_Y;
            hex.innerHTML = '&#x2B22;';
            hex.setAttribute('style', `position: fixed; top: ${window.innerHeight/2 - (HEX_HEIGHT/2) + center_Y}px; left: ${window.innerWidth/2 - (HEX_WIDTH / 2) + center_X}px;`);
        */


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


        //console.log(`Checking direction N°: ${direction}`);
        //console.log(`dx betweeng: ${dX - HEX_WIDTH / 2 - 5 } - ${dX + HEX_WIDTH / 2 + 5 }`);
        //console.log(`dy betweeng: ${dY - HEX_WIDTH / 2 - 5} - ${dY + HEX_WIDTH / 2 + 5}`);
        //console.log(`%c Current cell ID: ${cellToBeSaved.getCellId}`, 'color: #FF00FF;');



        CELL_ARRAY.forEach(looped_cell => {
            //Checks if this cell's position is near (dx;dy)

            //console.log('intento definir el surrounding');
            //console.log(`%c looped cell x pos: ${looped_cell.getPosX}`, 'color: #ff0000;');
            //console.log(`%c looped cell y pos: ${looped_cell.getPosY}`, 'color: #ff0000;');
            //console.log(`%c looped cell ID: ${looped_cell.getCellId}`, 'color: #FF00FF;');

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

    console.error('Tenemos que consultar si el usuario ya jugó antes (es decir, verificar si existe algo en el localStorage. Si es así, no debemos cargar el tablero de cero, sino utilizar la data que se encuentra en el localStorage.')
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

function movePiece(e) {
    //Adds the functionality, when called, to move object until it's released
    const correct_target_piece = e.target.parentNode;
    const selected_piece_element = document.getElementById(correct_target_piece.id);
    console.warn(selected_piece_element)
    const selected_piece_object = PIECE_ARRAY.find((piece) => {
        return piece.getPieceId == selected_piece_element.dataset.piece_number &&
            piece.getPlayer == selected_piece_element.dataset.piece_player_color;
    });
    console.log(selected_piece_object);

    //Disables piece movement over all other pieces. Cannot move more than one piece at a time.
    const allDomPieces = document.getElementsByClassName('piece');
    for (let i = 0; i < allDomPieces.length; i++) {
        allDomPieces[i].removeEventListener("click", movePiece);
    }

    //console.warn(selected_piece_object);
    e.stopPropagation();
    selected_piece_element.style.position = 'fixed';
    const onMouseMove = (e) => {
        //Defines the function that allows piece to move to mouse
        selected_piece_element.style.left = e.pageX /* - HEX_WIDTH / 2 */ + 'px';
        selected_piece_element.style.top = e.pageY /* - HEX_HEIGHT / 2 */ + 'px';
    }

    function releasepiece(e) {
        // This places a piece over a board cell. It does not validates if this movement can be done. For that, it calls the validation function
        // Also, it removes the 'follow mouse' functionality when piece is selected
        e.stopPropagation();
        document.removeEventListener('mousemove', onMouseMove);

        if (validPiecePlacing(e.target)) {
            // The movement is acceptable, it places the piece over the board cell

            //Saves cell id on piece.getCellId on piece OBJECT
            selected_piece_object.setCellId = CELL_ARRAY.find((cell) => cell.getCellId == e.target.id).getCellId;
            //Syncrhonices with PIECE_ARRAY
            sychronizeWithArray(PIECE_ARRAY, selected_piece_object, DATA_TYPES.PIECE);

            //Saves cell position on PIECE position on DOM/element
            selected_piece_element.style.left = e.target.dataset.xPosition + 'px';
            selected_piece_element.style.top = e.target.dataset.yPosition + 'px';

            //Sets cell "isempty" to false on cell OBJECT
            const selected_cell_object = CELL_ARRAY.find((cell) => cell.getCellId === selected_piece_object.getCellId);
            selected_cell_object.setIsEmpty = false;
            //Syncrhonices with CELL_ARRAY
            sychronizeWithArray(CELL_ARRAY, selected_cell_object, DATA_TYPES.CELL);

        } else {
            // cannot be placed here. it moves over to the the player's aside
        }

        document.removeEventListener('click', releasepiece);
        //Placing is done, enables movePiece again
        for (let i = 0; i < allDomPieces.length; i++) {
            allDomPieces[i].addEventListener("click", movePiece);
        }
    }

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('click', releasepiece);
}


function sychronizeWithArray(arrayToBeSynchronized, updatedObject, dataType) {
    //This function receives an array and an object that should be same type as array objects, finds it's own position in array and updates itself 
    arrayToBeSynchronized.forEach((element, index) => {
        if (dataType === DATA_TYPES.PIECE) {

            // This works only for pieces
            if (element.getPieceId === updatedObject.getPieceId &&
                element.getPlayer === updatedObject.getPlayer) {
                console.warn('Ojo, si ubicas fichas de distinto color de jugador se liminan')
                arrayToBeSynchronized[index] = updatedObject;
            }
        }

        if (dataType === DATA_TYPES.PIECE) {
            // This works only for cells
            if (element.cellId === updatedObject.cellId) {
                arrayToBeSynchronized[index] = updatedObject;
            }
        }

    });
    localStorage.setItem(DATA_TYPES.PIECE, JSON.stringify(PIECE_ARRAY))
    console.log(PIECE_ARRAY)

};


function validPiecePlacing(clickedElement) {
    // Checks surrounding pieces and defines if this movement is correct.
    // returns true or false.

    //Firt. it checks if the user clicked a board cell. If so, continue checks
    if (clickedElement.className != 'hex-clip') {
        return false;
    }

    //checks if this cell is empty.
    let cell_data = CELL_ARRAY.find((cell) => cell.getCellId == clickedElement.id);
    if (!cell_data.getIsEmpty) {
        return false;
    }

    const piecesPlacedInSurroundingCellsArray = checkSurroundingsPieces(cell_data);
    // Then, it checks if surroundings are empty, if so, it's an automatic true
    if (!piecesPlacedInSurroundingCellsArray.length) {
        console.log('empty surroundings');
        return true;
    } else {
        // Then, it checks if surrounding pieces matches color with current piece
        // surroundingPiecesArray

    }

    return true;
}

function checkSurroundingsPieces(cellObject) {
    //Recieves a cell and generates an array with the surroundings cell ids
    const ID_VALUES_TO_CHECK = [cellObject.cell_top_left, cellObject.cell_top_right, cellObject.cell_middle_left, cellObject.cell_middle_right, cellObject.cell_bottom_left, cellObject.cell_bottom_right];

    //Filters main cell array and gets only cells surrunding current cell
    const surroundingCellsArray = nonEmptyCellArray = CELL_ARRAY.filter((cellArrayElement) => {
        return ID_VALUES_TO_CHECK.some((idNumber) => {
            return cellArrayElement.getCellId == idNumber;
        })
    });

    // Filters this previous array and generates a new array with only NON empty cells
    const nonEmptyCellsArray = surroundingCellsArray.filter((cell) => cell.getIsEmpty === false);

    // Checks what pieces are placed in these surrounding cells
    const piecesPlacedInSurroundingCellsArray = PIECE_ARRAY.filter((piece) => {
        return nonEmptyCellsArray.some((cell) => {
            return piece.getCellId == cell.getCellId;
        })
    });

    //returns array with surroudning pieces
    //Returns an empty array if there are no surrounding pieces
    return piecesPlacedInSurroundingCellsArray;
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