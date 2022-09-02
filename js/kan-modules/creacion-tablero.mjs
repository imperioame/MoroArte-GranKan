export function crearTablero(maincanvas){
    let svg = document.createElement('svg');
    svg.setAttribute("viewBox", "0 0 200 200");
    
    let polygon = document.createElement('polygon');
    polygon.setAttribute("points", "100,0 50,-87 -50,-87 -100,-0 -50,87 50,87");
    polygon.setAttribute("fill", "black");
    
    svg.appendChild(polygon);
    svg.classList = 'testClass';

    maincanvas.appendChild(svg);

}