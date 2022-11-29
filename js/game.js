let selected_piece_element;
let selected_piece_object;

function movePiece(e) {
    //Adds the functionality, when called, to move object until it's released
    const correct_target_piece = e.target.parentNode;
    selected_piece_element = document.getElementById(correct_target_piece.id);
    selected_piece_object = returnPieceObjectFromElementEquivalent(selected_piece_element);

    updatePieceZIndex(selected_piece_object);
    addRotationButtons();

    //Checks if this piece was placed in a cell. If so, that cell should now be 'empty'
    if (selected_piece_object.getCellId != null) {
        let cell_where_piece_was_placed = CELL_ARRAY.find((cell) => cell.getCellId === selected_piece_object.getCellId);
        cell_where_piece_was_placed.setIsEmpty = true;
        selected_piece_object.setCellId = null;
        sychronizeWithArray(PIECE_ARRAY, selected_piece_object, DATA_TYPES.PIECE);
        sychronizeWithArray(CELL_ARRAY, cell_where_piece_was_placed, DATA_TYPES.CELL);
    }

    //Disables piece movement over all other pieces. Cannot move more than one piece at a time.
    const allDomPieces = document.getElementsByClassName('cover_div');
    for (let i = 0; i < allDomPieces.length; i++) {
        allDomPieces[i].removeEventListener("click", movePiece);
    }

    e.stopPropagation();
    selected_piece_element.style.position = 'fixed';
    const onMouseMove = (e) => {
        //Defines the function that allows piece to move to mouse
        selected_piece_element.style.left = e.pageX /* - HEX_WIDTH / 2 */ + 'px';
        selected_piece_element.style.top = e.pageY /* - HEX_HEIGHT / 2 */ + 'px';
    }

    function releasepiece(e) {
        // This places a piece over a board cell. It does not validates if this movement can be done. For that, it calls the validation function

        e.stopPropagation();
        if (!e.target.classList.contains('hex-clip') && !e.target.classList.contains('rotation_buttons')) {
            // If it's not a board cell, then the piece is dropped, but not snapped to any cell.
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('click', releasepiece);
            //Placing is done, enables movePiece again
            for (let i = 0; i < allDomPieces.length; i++) {
                allDomPieces[i].addEventListener("click", movePiece);
            }
            removeRotationButtons();
            return;
        }

        if (validPiecePlacing(e.target, selected_piece_object)) {
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


            // Movement done, it removes the 'follow mouse' functionality when piece is selected
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('click', releasepiece);
            //Placing is done, enables movePiece again
            for (let i = 0; i < allDomPieces.length; i++) {
                allDomPieces[i].addEventListener("click", movePiece);
            }

            //Checks if it's win condition
            let win_message = checkWinCondition(selected_piece_object);
            if (win_message) {
                showNotification(win_message, NOTIFICATION_TYPES.VICTORY_MODAL);
                console.warn(win_message);
            }


            removeRotationButtons();
        } else {
            //Cannot be placed here. The current cell is highghted in red. li
            const selected_cell = document.getElementById(e.target.id);
            if (selected_cell.classList.contains('hex-clip')) {
                selected_cell.classList.remove("invalidPiecePlacement");
                selected_cell.classList.add("invalidPiecePlacement");
            }
        }


    }

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('click', releasepiece);
}

function validPiecePlacing(clickedCellElement, movingPieceObject) {
    // Checks surrounding pieces and defines if this movement is correct.
    // returns true or false.
    //Firt. it checks if the user clicked a board cell. If so, continue checks
    if (!clickedCellElement.classList.contains('hex-clip')) {
        return false;
    }

    //checks if this cell is empty.
    let cell_data = CELL_ARRAY.find((cell) => cell.getCellId == clickedCellElement.id);
    if (!cell_data.getIsEmpty) {
        return false;
    }

    const piecesPlacedInSurroundingCellsArray = checkSurroundingsPieces(cell_data);
    // Then, it checks if surroundings are empty, if so, it's an automatic true
    if (!piecesPlacedInSurroundingCellsArray.length) {
        return true;
    } else {
        // Then, it checks if surrounding pieces matches color with current piece
        const surroundingPiecesArray = orderSurroundingPieces(cell_data, piecesPlacedInSurroundingCellsArray);

        let validPlacing = true;
        surroundingPiecesArray.forEach((value, key) => {
            //Checks every direction, if this direction has a piece (not null), then matches colours form this piece, and clicked piece.
            //Remember that this comparison is done by checking OPPOSITE directions, e.g. clickedpiece.top_left with direction.bottom_right
            //If there's at least one NON MATCHING COLOUR, then this is an INVALID movement. Returns false.
            if (value != null && validPlacing) {
                const defined_getter = `getcolor_${key}`;
                const defined_oposite_getter = `getcolor_${getOppositeDirection(key)}`;
                validPlacing = movingPieceObject[defined_getter] == value[defined_oposite_getter];
            }
        });

        //If placing was valid, checks if it should remove an adversary piece
        if (validPlacing) {
            checkAndRemoveSurroundedPiece(selected_piece_object, piecesPlacedInSurroundingCellsArray);
        }

        return validPlacing;
    }
}

function checkSurroundingsPieces(cellObject) {
    //Recieves a cell and generates an array with the surroundings cell ids
    const ID_VALUES_TO_CHECK = [cellObject.getcell_top_left, cellObject.getcell_top_right, cellObject.getcell_middle_left, cellObject.getcell_middle_right, cellObject.getcell_bottom_left, cellObject.getcell_bottom_right];

    //Filters main cell array and gets only cells surrunding current cell
    const surroundingCellsArray = CELL_ARRAY.filter((cellArrayElement) => {
        return ID_VALUES_TO_CHECK.some((cell_id_Number) => {
            return cellArrayElement.getCellId == cell_id_Number;
        });
    });

    // Filters this previous array and generates a new array with only NON empty cells
    const nonEmptyCellsArray = surroundingCellsArray.filter((cell) => cell.getIsEmpty == false);

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

function orderSurroundingPieces(cellObject, piecesArray) {
    //Recieves a pre-filtered array and a cell, and sorts the elements in the array according to position relative to cell.
    //Returns new associative array with correct positions (relative to cell) 

    const surroundingPiecesArray = new Map([
        [DIRECTION_TYPES.TOP_LEFT, piecesArray.find((piece) => piece.getCellId === cellObject.getcell_top_left) || null],
        [DIRECTION_TYPES.TOP_RIGHT, piecesArray.find((piece) => piece.getCellId === cellObject.getcell_top_right) || null],
        [DIRECTION_TYPES.MIDDLE_LEFT, piecesArray.find((piece) => piece.getCellId === cellObject.getcell_middle_left) || null],
        [DIRECTION_TYPES.MIDDLE_RIGHT, piecesArray.find((piece) => piece.getCellId === cellObject.getcell_middle_right) || null],
        [DIRECTION_TYPES.BOTTOM_LEFT, piecesArray.find((piece) => piece.getCellId === cellObject.getcell_bottom_left) || null],
        [DIRECTION_TYPES.BOTTOM_RIGHT, piecesArray.find((piece) => piece.getCellId === cellObject.getcell_bottom_right) || null],
    ]);

    return surroundingPiecesArray;
}


function rotatePieceRight() {
    //This function rotates a piece
    if (!selected_piece_element && !selected_piece_object) {
        console.error("Trying to rotate something that's not corretly saved");
        return;
    }

    //First rotates its color properties
    let auxiliary_color = selected_piece_object.getcolor_top_right;
    selected_piece_object.setcolor_top_right = selected_piece_object.getcolor_top_left;
    selected_piece_object.setcolor_top_left = selected_piece_object.getcolor_middle_left;
    selected_piece_object.setcolor_middle_left = selected_piece_object.getcolor_bottom_left;
    selected_piece_object.setcolor_bottom_left = selected_piece_object.getcolor_bottom_right;
    selected_piece_object.setcolor_bottom_right = selected_piece_object.getcolor_middle_right;
    selected_piece_object.setcolor_middle_right = auxiliary_color;

    //Then, rotates the element
    selected_piece_element.dataset.rotation = parseInt(selected_piece_element.dataset.rotation) + 60;
    selected_piece_element.style.transform = `rotate(${selected_piece_element.dataset.rotation}deg)`;

    sychronizeWithArray(PIECE_ARRAY, selected_piece_object, DATA_TYPES.PIECE);
}

function rotatePieceLeft() {
    //This function rotates a piece
    if (!selected_piece_element && !selected_piece_object) {
        console.error("Trying to rotate something that's not corretly saved");
        return;
    }

    //First rotates its color properties
    let auxiliary_color = selected_piece_object.getcolor_top_right;
    selected_piece_object.setcolor_top_right = selected_piece_object.getcolor_middle_right;
    selected_piece_object.setcolor_middle_right = selected_piece_object.getcolor_bottom_right;
    selected_piece_object.setcolor_bottom_right = selected_piece_object.getcolor_bottom_left;
    selected_piece_object.setcolor_bottom_left = selected_piece_object.getcolor_middle_left;
    selected_piece_object.setcolor_middle_left = selected_piece_object.getcolor_top_left;
    selected_piece_object.setcolor_top_left = auxiliary_color;

    //Then, rotates the element
    selected_piece_element.dataset.rotation = parseInt(selected_piece_element.dataset.rotation) - 60;
    selected_piece_element.style.transform = `rotate(${selected_piece_element.dataset.rotation}deg)`;

    sychronizeWithArray(PIECE_ARRAY, selected_piece_object, DATA_TYPES.PIECE);
}


function checkWinCondition(placed_piece_object) {
    //This function checks if the current movement made the player win.
    //If true, returns win message.
    //First, it checks the flower, since it doesnt need all pieces, just 7 to be made.
    console.log('checking win condition');
    let playerwon_by_gran_kan_flower = checkGranKanFlower(placed_piece_object);
    if (playerwon_by_gran_kan_flower) {
        return `${placed_piece_object.getPlayer} player won by gran kan flower`;

    }

    const at_least_one_piece_not_placed = PIECE_ARRAY.some((piece) => piece.getCellId == null && piece.getPlayer == placed_piece_object.getPlayer);

    const cell = CELL_ARRAY.find((cell) => cell.getCellId == placed_piece_object.getCellId);

    if (at_least_one_piece_not_placed) {
        return false;
    }

    const at_least_one_surrounding_pieces_does_not_match_player = checkSurroundingsPieces(cell).some((piece) => piece.getPlayer != placed_piece_object.getPlayer);
    if (at_least_one_surrounding_pieces_does_not_match_player) {
        return false;
    }

    return `${placed_piece_object.getPlayer} player won by placing all pieces`;

}


function checkGranKanFlower(piece) {
    //Checks if all placed pieces made the "Gran Kan flower".
    //The condition of Gran Kan flower is that 7 pieces must be clustered together, 
    const placed_pieces = PIECE_ARRAY.filter((filtered_piece) => filtered_piece.getPlayer == piece.getPlayer && filtered_piece.getCellId != null).length;
    if (placed_pieces < 7) {
        // Not enough pieces placed. 
        // Since the following algorithm is memory intensive, it's preferable to skip if this condition is not matched.
        return false;
    }

    // There must be a center piece, and the remaining 6 pieces surrounding that piece.
    let granKanMade = false;
    let cellObject = CELL_ARRAY.find((cell) => cell.getCellId == piece.getCellId);

    console.log('entro a validar flor gran kan');

    //Gets an array based an all surrounding pieces.
    const surrounding_pieces = checkSurroundingsPieces(cellObject);
    console.log('surrounding pieces ');
    console.log(surrounding_pieces);

    let different_player = surrounding_pieces.some((piece) => piece.getPlayer != cellObject.getPlayer);
    if (surrounding_pieces.length == 6 && !different_player) {
        //Player is placing center piece.
        return true;
    }

    surrounding_pieces.some((surrounding_piece) => {
        //Checks for each surrounding piece it's surroundings
        const surrounding_piece_cell_position_object = CELL_ARRAY.find((recursive_cell) => recursive_cell.getCellId == surrounding_piece.getCellId);
        const surroundings_pieces_of_surrounding_cell = checkSurroundingsPieces(surrounding_piece_cell_position_object);
        console.log(`checking cell: ${surrounding_piece_cell_position_object.getCellId}`);
        console.log('surrounding pieces of surrounding cells');
        console.log(surroundings_pieces_of_surrounding_cell);

        //Checks if all pieces are of the same player
        let different_player = surroundings_pieces_of_surrounding_cell.some((piece) => piece.getPlayer != surrounding_piece.getPlayer);
        if (different_player) {
            return false;
        }

        if (surroundings_pieces_of_surrounding_cell.length == 6) {
            // Remember that the length is calculated by surrounding cells. It doesnt aknowledge self. 
            // It's 6 surrounding pieces + self. 

            granKanMade = true;

            /*
            //It doesn't need to include the Qudak piece, if the rules change, uncomment this
            if (surroundings_pieces_of_surrounding_cell.some((piece) => piece.getPieceId == 5) || surrounding_piece.getPieceId == 5) {
                granKanMade = true;
            }
            */
        }
        return granKanMade;
    });
    return granKanMade;
}

function checkAndRemoveSurroundedPiece(piece_to_be_placed, surrounding_pieces) {
    //This function checks if there's any player surrounding an adversary piece
    console.log('goint to check if should remove adversary piece');
    console.log('surrounding pieces array:');
    console.log(surrounding_pieces);

    //It first checks for all surrounding pieces, if THEY are surrounded.
    let surrounded_piece_to_be_removed;
    surrounding_pieces.forEach((surrounding_piece) => {
        let cell_object = CELL_ARRAY.find((cell) => cell.getCellId == surrounding_piece.getCellId);

        const its_surroundings = checkSurroundingsPieces(cell_object);
        console.warn(its_surroundings);
        let surrounding_enemies_array = its_surroundings.filter((its_surrounding_piece) => its_surrounding_piece.getPlayer != surrounding_piece.getPlayer);

        let how_many_surrounding_enemies = surrounding_enemies_array.length;
        if (!how_many_surrounding_enemies) {
            console.log('surrounding_enemies_array is empty. No enemies surround this piece')
            //nothing here. should return
            return;
        }

        //Up to this point, the "piece_to_be_placed" is not placed.
        //So it doesnt get checked to be added. Must be done manually
        if (surrounding_enemies_array[0].getPlayer == piece_to_be_placed.getPlayer) {
            how_many_surrounding_enemies++;
        }

        if (how_many_surrounding_enemies >= 2) {
            //piece surrounded by enemies.
            surrounded_piece_to_be_removed = surrounding_piece;
        }
    });

    if (!surrounded_piece_to_be_removed) {
        console.warn('nothing found');
        //nothig to do
        return;
    }

    //found a surrounded piece. Should remove from board
    let cell_where_piece_was_placed = CELL_ARRAY.find((cell) => cell.getCellId === surrounded_piece_to_be_removed.getCellId);
    cell_where_piece_was_placed.setIsEmpty = true;
    surrounded_piece_to_be_removed.setCellId = null;
    sychronizeWithArray(PIECE_ARRAY, surrounded_piece_to_be_removed, DATA_TYPES.PIECE);
    sychronizeWithArray(CELL_ARRAY, cell_where_piece_was_placed, DATA_TYPES.CELL);

    const piece_element = returnPieceElementFromObjectEquivalent(surrounded_piece_to_be_removed);
    if (!piece_element) {
        console.error('Could not find piece in board. This is an error');
        return;
    }

    piece_element.style.position = 'absolute';
    piece_element.style.top = document.getElementsByClassName('pieces_board')[0].offsetHeight / 2 - HEX_HEIGHT + document.querySelectorAll('#player1 h2')[0].offsetHeight;

    if (surrounded_piece_to_be_removed.getPlayer == PLAYERS.BLACK) {
        piece_element.style.left = `${HEX_WIDTH}px`;
    } else {
        piece_element.style.right = `${HEX_WIDTH}px`;
    }

    console.warn('piece removed');


    /*
        //Checks if at least there are two same player pieces
        const two_same_player_pieces = surrounding_pieces.some((surrounding_piece) => surrounding_piece.getPlayer == piece_to_be_placed.getPlayer);

        if (!two_same_player_pieces) {
            console.error('NOT two_same_player_pieces');
            return false;
        }

        //Checks if there's an adversary player piece
        const surrounding_adversary_piece = surrounding_pieces.find((surrounding_piece) => surrounding_piece.getPlayer != piece_to_be_placed.getPlayer)

        if (!surrounding_adversary_piece) {
            console.error('NOT surrounding_adversary_piece')
            return false;
        }

        //Get's adversary piece surroundings 
        const surroundings_of_surrounding_adversary_piece = checkSurroundingsPieces(surrounding_adversary_piece);

        //Checks if the adversary piece is surrounded by player
        const surrounded_piece = surroundings_of_surrounding_adversary_piece.filter((surrounding_piece) => surrounding_piece.getPlayer == piece_to_be_placed.getPlayer);

        if (!surrounded_piece.length) {
            console.error('NOT surrounded_piece.length');
            return false;
        }

        //found a surrounded piece. Should remove from board
        let cell_where_piece_was_placed = CELL_ARRAY.find((cell) => cell.getCellId === surrounded_piece.getCellId);
        cell_where_piece_was_placed.setIsEmpty = true;
        surrounded_piece.setCellId = null;
        sychronizeWithArray(PIECE_ARRAY, surrounded_piece, DATA_TYPES.PIECE);
        sychronizeWithArray(CELL_ARRAY, cell_where_piece_was_placed, DATA_TYPES.CELL);

        const piece_element = returnPieceElementFromObjectEquivalent(surrounded_piece);
        if (!piece_element) {
            console.error('Could not find piece in board. This is an error');
            return;
        }

        piece_element.style.position = 'absolute';
        piece_element.style.top = document.getElementsByClassName('pieces_board')[0].offsetHeight / 2 - HEX_HEIGHT + document.querySelectorAll('#player1 h2')[0].offsetHeight;

        if (surrounded_piece.getPlayer == PLAYERS.BLACK) {
            piece_element.style.left = `${HEX_WIDTH}px`;
        } else {
            piece_element.style.right = `${HEX_WIDTH}px`;
        }

        console.warn('piece removed');
    */
}