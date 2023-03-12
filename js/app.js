import { db } from './database/db.js';
import { ARRAYPRODUCTOS } from './constantes/index.js';
import { 
    sincronizarStorage, 
    getItemLocalStorage, 
    contadorCarrito, 
    buscador } from './helpers/index.js';



// Variables
const openModal = document.querySelector('#modal-open');
const closeModal = document.querySelector('.modal__close');
const formulario = document.querySelector('#formulario');



// Eventos
addEventListeners();
function addEventListeners() {
    document.addEventListener('DOMContentLoaded', () => {
        contadorCarrito(getItemLocalStorage(ARRAYPRODUCTOS));
        listaProductos('.productos__grid', db.length);
        buscador(db);

        // Modal
        openModal.addEventListener('click', modal);
        closeModal.addEventListener('click', modal);
        formulario.addEventListener('submit', submitFiltros);
    });
}



// Funciones
function getProducto(id) {
    // Obtener producto seleccionado para guardarlo en localStorage y mostrarlo en la pagina de producto-individual.html
    const datos = db.find( (producto) => producto.id === id );
    sincronizarStorage('productoObj', datos);
}
function modal() {
    // Agregando la clase de fijar para que la modal ocupe todo el contenido que tenga el sitio
    const agregarClaseFijar = document.querySelector('body > div');
    toggeter(agregarClaseFijar, 'fijar');

    // Quitando la clase que oculta el contenido que tendra la modal
    const contenidoModal = document.querySelector('.modal');
    toggeter(contenidoModal, 'display-none');
}
function toggeter(elemento, clase) {
    // Si tiene la clase la quita, si no la tiene la agrega
    if(!elemento.classList.contains(clase)) {
        elemento.classList.add(clase)
    }
    else {
        elemento.classList.remove(clase)
    }
    return elemento
}
function submitFiltros(e) {
    e.preventDefault();
    console.log('Submit...');
}



// Componentes
function imagenes(img, titulo) {
    // Agregando el Picture/imagenes
    const picture = document.createElement('picture');
    const sourceWebp = document.createElement('source');
    sourceWebp.classList.add('webp');
    sourceWebp.type = 'image/webp';
    sourceWebp.srcset = `img/${img.replace('.png', '')}.webp`;
    const imagen = document.createElement('img');
    imagen.classList.add('producto__imagen');
    imagen.loading = 'lazy';
    imagen.src = `img/${img}`;
    imagen.width = '500';
    imagen.height = '300';
    imagen.alt = `imagen de ${titulo}`;
    
    // Agregando a su contenedor
    picture.appendChild(sourceWebp);
    picture.appendChild(imagen);
    
    return picture;
}
function producto(titulo, descripcion, precio) {
    // Agregando el contenido/info del producto
    const divProductoContenido = document.createElement('div');
    divProductoContenido.classList.add('producto__contenido');
    const nombreProducto = document.createElement('h3');
    nombreProducto.classList.add('producto__heading');
    nombreProducto.textContent = titulo;
    const textoProducto = document.createElement('p');
    textoProducto.classList.add('producto__texto');
    textoProducto.textContent = descripcion;
    const precioProducto = document.createElement('p');
    precioProducto.classList.add('producto__precio');
    precioProducto.textContent = precio;
    
    // Agregando a su contenedor
    divProductoContenido.appendChild(nombreProducto);
    divProductoContenido.appendChild(textoProducto);
    divProductoContenido.appendChild(precioProducto);

    return divProductoContenido;
}
export function listaProductos(contenedor, numResultados) {
    // Generando lista de productos
    for(let i = 0; i < numResultados; i++) {
   
        // Enlace y contenedor Principal
        const enlaceContenedor = document.createElement('a');
        enlaceContenedor.href = 'producto-individual.html';


        // Contenedor de Producto
        const divProducto = document.createElement('div');
        divProducto.classList.add('producto');
        divProducto.dataset.id = db[i].id;


        // Agregando imagenes e info del producto 
        divProducto.appendChild(imagenes(db[i].img, db[i].titulo));
        divProducto.appendChild(producto(db[i].titulo, db[i].descripcion, db[i].precio));
        divProducto.onclick = () => {
            getProducto(db[i].id);
        }
       

        // Agregando al contenedor Principal
        enlaceContenedor.appendChild(divProducto);

        
        // Agregando al HTML
        const divProductosGrid = document.querySelector(contenedor);
        if( divProductosGrid !== null ) {
            divProductosGrid.appendChild(enlaceContenedor);
        }
    }

    /* Esta funcion se exportara a 
        carrito.js
        producto indidual.js
       para mostrar una seccion de la lista de productos */
}