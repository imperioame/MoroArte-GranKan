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

        e.stopPropagation();
        if (!e.target.classList.contains('hex-clip') && !e.target.classList.contains('rotation_buttons')) {
            console.log('estoy sacandole mousemove y releasepiece')
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
            checkWinCondition(selected_piece_object);


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

        return validPlacing;
    }
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

    return surroundingPiecesArray;
}



function addRotationButtons() {
    //Buttons are not present, here they will be created, assigned functionality, and placed
    let rotate_left_button_element = document.createElement('div');
    rotate_left_button_element.id = 'rotate_left';
    rotate_left_button_element.classList.add('rotation_buttons');
    rotate_left_button_element.innerHTML = 'Rotate <br> left';
    rotate_left_button_element.addEventListener('click', rotatePieceLeft);
    CONTROLS_SELECTION.appendChild(rotate_left_button_element);

    let rotate_right_button_element = document.createElement('div');
    rotate_right_button_element.id = 'rotate_right';
    rotate_right_button_element.classList.add('rotation_buttons');
    rotate_right_button_element.innerHTML = 'Rotate <br> right';
    rotate_right_button_element.addEventListener('click', rotatePieceRight);
    CONTROLS_SELECTION.appendChild(rotate_right_button_element);
}

function removeRotationButtons() {
    //Removes the buttons that allows rotation.
    const CONTROLS_SELECTION = document.getElementById('controls');
    CONTROLS_SELECTION.removeChild(document.getElementById('rotate_right'));
    CONTROLS_SELECTION.removeChild(document.getElementById('rotate_left'));
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


function checkWinCondition(placed_piece_object){
    //This function checks if the current movement made the player win.
    //First, it checks the flower, since it doesnt need all pieces, just 7 to be made.
    let playerwon_by_gran_kan_flower = checkGranKanFlower(placed_piece_object);
    if (playerwon_by_gran_kan_flower){
        console.warn(`${placed_piece_object.getPlayer} player won by gran kan flower`);
        return true;

    }

    const player = selected_piece_object.getPlayer;


    const at_least_one_piece_not_placed = PIECE_ARRAY.some((piece) => piece.getCellId == null && piece.getPlayer == placed_piece_object.getPlayer);

    const cell = CELL_ARRAY.find((cell) => cell.getCellId == placed_piece_object.getCellId);

    console.log(checkSurroundingsPieces(cell));

    if (at_least_one_piece_not_placed){
        return false;
    }
    
    const at_least_one_surrounding_pieces_does_not_match_player = checkSurroundingsPieces(cell).some((piece) => piece.getPlayer != placed_piece_object.getPlayer);
    console.warn(at_least_one_surrounding_pieces_does_not_match_player);
    if (at_least_one_surrounding_pieces_does_not_match_player){
        return false;
    }

    console.warn(`${placed_piece_object.getPlayer} player won by all pieces`);
    return true;

}


function checkGranKanFlower(piece){
    //Checks if all placed pieces made the "Gran Kan flower".
    //The condition of Gran Kan flower is that 7 pieces must be clustered together, 
    //it must include the Qudak piece,
    // There must be a center piece, and the remaining 6 pieces surrounding that piece.
    let granKanMade = false;
    let cellObject = CELL_ARRAY.find((cell) => cell.getCellId == piece.getCellId);

    console.log('entro a validar flor gran kan')

    const surrounding_pieces = checkSurroundingsPieces(cellObject);
    surrounding_pieces.some((recursive_piece) => {
        const recursive_cell_object = CELL_ARRAY.find((recursive_cell) => recursive_cell.getCellId == recursive_piece.getCellId);
        const recursive_surrounding = checkSurroundingsPieces(recursive_cell_object);
        console.log(recursive_surrounding);
        if (recursive_surrounding.length == 6){
            //it needs to check if the qudak is included
            if(recursive_surrounding.some((piece) => piece.getPieceId == 5) || recursive_piece.getPieceId == 5){
                granKanMade = true;
            }
        }
        return granKanMade;
    });
    return granKanMade;
}