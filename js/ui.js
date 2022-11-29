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


function showNotification(notification, type) {
    //This function creates a notification
    //'notification' parameter is the string or messege
    //'type' defines what kind of notif is.
    let gray_overlay = document.createElement('div');
    gray_overlay.id = 'gray_overlay';
    gray_overlay.addEventListener('click', closeNotification);

    let notification_element = document.createElement('div');
    notification_element.id = 'notifications';
    let notification_header = document.createElement('header');
    notification_header.id = 'notification_header';
    let notification_body = document.createElement('div');
    notification_body.id = 'notification_body';
    let notification_body_content = document.createElement('p');
    let notification_footer = document.createElement('div');
    notification_footer.id = 'notification_footer';

    let close_button = document.createElement('div');
    close_button.id = 'notification_close_button';
    close_button.innerHTML = 'X';
    close_button.addEventListener('click', closeNotification);





    if (type == NOTIFICATION_TYPES.VICTORY_MODAL) {
        notification_element.classList.add('notification_modal');
        notification_header.classList.add('notification_header_victory');
        notification_header.innerHTML = 'VICTORIA';

        notification_body_content.innerHTML = notification;

        let restart_button = document.createElement('button');
        restart_button.innerHTML = 'Reiniciar Juego';
        restart_button.addEventListener('click', reset_game);
        notification_footer.appendChild(restart_button);

    }

    notification_element.appendChild(notification_header);
    notification_element.appendChild(close_button);
    notification_body.appendChild(notification_body_content);
    notification_element.appendChild(notification_body);
    notification_element.appendChild(notification_footer);

    gray_overlay.appendChild(notification_element);
    document.getElementsByTagName('body')[0].appendChild(gray_overlay);
}

function closeNotification(e) {
    //destroys previosly generated notification
    e.stopPropagation();

    let notification_container = document.getElementById('gray_overlay');
    if (!notification_container) {
        console.error('Trying to close a notification that does not exist. This is an error.');
    }

    notification_container.remove();
}