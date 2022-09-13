import {crearTablero} from './kan-modules/creacion-tablero.mjs';

    const MAINCANVAS = document.getElementById('maincanvas')
    const MAIN = document.getElementById('main')


    function initialize(){
        let div = document.createElement('div');
        div.id = 'holamundo';
        let h1 = document.createElement('h1');
        
        h1.innerHTML = 'Hola Mundo';
        h1.classList = 'text-center'
        div.appendChild(h1);
        MAIN.appendChild(div);

    }


window.onload = function() {
    initialize();
    crearTablero(MAINCANVAS);
  };