function movePiece(e) {
    //Adds the functionality, when called, to move object until it's released
    const correct_target_piece = e.target.parentNode;
    const selected_piece_element = document.getElementById(correct_target_piece.id);
    console.warn(selected_piece_element)
    const selected_piece_object = PIECE_ARRAY.find((piece) => {
        return piece.getPieceId == selected_piece_element.dataset.piece_number &&
            piece.getPlayer == selected_piece_element.dataset.piece_player_color;
    });

    updatePieceZIndex(selected_piece_object);

    //Checks if this piece was placed in a cell. If so, that cell should now be 'empty'
    if (selected_piece_object.getCellId) {
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
                console.warn('Ojo, si ubicas fichas de distinto color de jugador se eliminan')
                arrayToBeSynchronized[index] = updatedObject;
            }
        }

        if (dataType === DATA_TYPES.CELL) {
            // This works only for cells
            if (element.cellId === updatedObject.cellId) {
                arrayToBeSynchronized[index] = updatedObject;
            }
        }

    });
    localStorage.setItem(DATA_TYPES.PIECE, JSON.stringify(PIECE_ARRAY))

};

function updatePieceZIndex(piece_object) {

    for (let piece of document.getElementsByClassName('piece')) {
        if (piece.dataset.piece_number == piece_object.getPieceId && piece.dataset.piece_player_color == piece_object.getPlayer) {
            piece.dataset.z_index = PIECE_ARRAY.length;
            piece.style.zIndex = `${PIECE_ARRAY.length}`;
            console.log(`nuevo zindex ${piece.dataset.z_index}`);
        } else {
            piece.dataset.z_index = piece.dataset.z_index - 1;
            piece.style.zIndex = `${piece.dataset.z_index}`;
        }
    }
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