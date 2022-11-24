function movePiece(e) {
    //Adds the functionality, when called, to move object until it's released
    const correct_target_piece = e.target.parentNode;
    const selected_piece_element = document.getElementById(correct_target_piece.id);
    const selected_piece_object = returnPieceObjectFromElementEquivalent(selected_piece_element);

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

function validPiecePlacing(clickedCellElement, movingPieceObject) {
    // Checks surrounding pieces and defines if this movement is correct.
    // returns true or false.

    //Firt. it checks if the user clicked a board cell. If so, continue checks
    if (clickedCellElement.className != 'hex-clip') {
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
        console.log('empty surroundings');
        return true;
    } else {
        // Then, it checks if surrounding pieces matches color with current piece
        const surroundingPiecesArray = orderSurroundingPieces(cell_data, piecesPlacedInSurroundingCellsArray);

        let validPlacing;
        surroundingPiecesArray.forEach((value, key) => {
            //Checks every direction, if this direction has a piece (not null), then matches colours form this piece, and clicked piece.
            //Remember that this comparison is done by checking OPPOSITE directions, e.g. clickedpiece.top_left with direction.bottom_right
            //If there's at least one NON MATCHING COLOUR, then this is an INVALID movement. Returns false.
            if (value != null) {
                const defined_getter = `getcolor_${key}`;
                const defined_oposite_getter = `getcolor_${getOppositeDirection(key)}`;
                validPlacing = movingPieceObject[defined_getter] == value[defined_oposite_getter];

                if (!validPlacing) {
                    return false;
                }
            }
        });

        console.log(validPlacing);

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

    console.log(surroundingPiecesArray);

    return surroundingPiecesArray;
}