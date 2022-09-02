import {crearTablero} from './kan-modules/creacion-tablero.mjs';

    let maincanvas = document.getElementById('maincanvas')

window.onload = function() {
    crearTablero(maincanvas);
  };