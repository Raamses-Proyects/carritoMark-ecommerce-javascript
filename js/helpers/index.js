import { PRODUCTOSOBJ, ARRAYPRODUCTOS, CONTADOR } from '../constantes/index.js';

export function sincronizarStorage(nombre, array) {
    localStorage.setItem(nombre, JSON.stringify(array));
}

export function getItemLocalStorage(llave) {
    if( llave === PRODUCTOSOBJ   ) {
        return JSON.parse(localStorage.getItem(llave)) || {};
    }
    else if( llave === ARRAYPRODUCTOS ) {
        return JSON.parse(localStorage.getItem(llave)) || [];
    }
    else if( llave === CONTADOR ) {
        return JSON.parse(localStorage.getItem(llave)) || 0;
    }
}

export function contadorCarrito(carritoArray) {
    const contadorSpan = document.querySelector('.carrito__contador');
    const total = carritoArray.reduce( (acumulador, producto) => acumulador + producto.cantidad, 0 );
    sincronizarStorage(CONTADOR, total);
    contadorSpan.innerHTML = getItemLocalStorage(CONTADOR);
}

export const formatearCantidad = (cantidad) => {
    return cantidad.toLocaleString('en-US', {
        style: 'currency',
        currency: 'USD'
    });
}

export function buscador(arrayProductos) {

    // Variables
    const buscadorInput = document.querySelector('#buscador');
    const buscadorBtn = document.querySelector('.buscador__boton');
    const buscadorContenedor = document.querySelector('.buscador__coincidencias');


    // Evento (para obtener lo que el usuario escriba)
    buscadorInput.addEventListener('input', (e) => {
        let texto = e.target.value;

        // Mostrando el contenedor de las busquedas
        if( buscadorContenedor.classList.contains('display-none') ) {
            buscadorContenedor.classList.remove('display-none');
        }
    
     
        // Ocultando el contenedor de las busquedas
        if( texto === '' || texto.trim('') === '' ) { // Si el texto esta vacio o hay espacios en blanco
            buscadorContenedor.classList.add('display-none');

            // Quitando bordes 
            buscadorInput.classList.remove('remove-border-left');
            buscadorBtn.classList.remove('remove-border-right');
        }
        else { // Agregando los bordes
            buscadorInput.classList.add('remove-border-left');
            buscadorBtn.classList.add('remove-border-right');
        }

      
        // Filtrando la BD solo por las coincidencias que el usario escriba 
        let arrayFiltrado = arrayProductos.filter( (producto) => producto.nombre.includes((texto).toLowerCase()) );
        limpiarHTML('.buscador__coincidencias');
        if( arrayFiltrado.length > 0 ) {

            arrayFiltrado.forEach((producto) => { // Gerando los enlaces
                // Enlaces
                const enlace = document.createElement('a');
                enlace.classList.add('buscador__enlace');
                enlace.textContent = producto.nombre;
                enlace.href = producto.href;
                enlace.onclick = () => {
                    const datos = arrayFiltrado.find( (p) => p.id === producto.id );
                    sincronizarStorage('productoObj', datos);
                }
                
                // Agregando al HTML
                buscadorContenedor.appendChild(enlace);
            });
        }
        else { // si no se encontraron coincidencias de busqueda
            const parrafo = document.createElement('p');
            parrafo.classList.add('buscador__enlace');
            parrafo.textContent = 'Sin coincidencias';
            buscadorContenedor.appendChild(parrafo);
        }
    });
}

export function limpiarHTML(clase) {
    const contenedor = document.querySelector(clase);
    while( contenedor.firstChild ) {
        contenedor.removeChild(contenedor.firstChild);
    }
}