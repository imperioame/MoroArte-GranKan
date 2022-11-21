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
        // This places a piece over a board cell. It does not validates if this movement can be done. For that, it calls the validation function
        // Also, it removes the 'follow mouse' functionality when piece is selected
        e.stopPropagation();
        document.removeEventListener('mousemove', onMouseMove);

        if (validPiecePlacing(e.target)) {
            // The movement is acceptable, it places the piece over the board cell
            // Clicked piece ID
            selected_piece.id;


            // Cell's ID
            e.target.id


            // Mouse position
            e.pageX
            e.pageY


            //Saves the cell id in piece info
            selected_piece.setCellId = e.target.id;
            console.log(`the piece was placed and new cell id is ${e.target.id}`);


        } else {
            // cannot be placed here. it moves over to the the player's aside
        }

    }

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('click', releasepiece);
}

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

    // Then, it checks if surroundings are empty, if so, it's an automatic true
    if (checkIfSurroundingsAreEmpty(cell_data)) {
        console.log('empty surroundings');
        return true;
    } else {
        // Then, it checks if surrounding pieces matches color with current piece
    }

    return true;
}

function checkIfSurroundingsAreEmpty(cellObject) {
    //Recieves a cell and generates an array with the surroundings id
    const ID_VALUES_TO_CHECK = [cellObject.cell_top_left, cellObject.cell_top_right, cellObject.cell_middle_left, cellObject.cell_middle_right, cellObject.cell_bottom_left, cellObject.cell_bottom_right];

    //Filters main cell array and gets only cells surrunding current cell
    const filteredArray = CELL_ARRAY.filter((cellArrayElement) => {
        return ID_VALUES_TO_CHECK.some((idNumber) => {
            return cellArrayElement.getCellId === idNumber;
        })
    });

    return filteredArray.some((element) => element.getIsEmpty);
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