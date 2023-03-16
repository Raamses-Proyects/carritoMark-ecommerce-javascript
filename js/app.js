import { db } from './database/db.js';
import { ARRAYPRODUCTOS } from './constantes/index.js';
import { 
    sincronizarStorage, 
    getItemLocalStorage, 
    contadorCarrito, 
    buscador,
    limpiarHTML,
    extraerPrecio } from './helpers/index.js';



// Variables
const openModal = document.querySelector('#modal-open');
const closeModal = document.querySelector('.modal__close');
const formulario = document.querySelector('#formulario');
const relevancia = document.querySelector('#relevancia');
const alimentosCheck = document.querySelector('#alimentos');
const electronicaCheck = document.querySelector('#electronica');
const hogarCheck = document.querySelector('#hogar');
const cuidadopersonalCheck = document.querySelector('#cuidadopersonal');
const listaBusquedasObj = {
    alimentos: '',
    electronica: '',
    hogar: '',
    cuidadopersonal: ''
}
let arrayFiltrado = [];
let order = '';



// Eventos
addEventListeners();
function addEventListeners() {
    document.addEventListener('DOMContentLoaded', () => {
        contadorCarrito(getItemLocalStorage(ARRAYPRODUCTOS));
        listaProductos('.productos__grid', db.length, db);
        buscador(db);

        // Modal
        openModal?.addEventListener('click', modal);
        closeModal?.addEventListener('click', modal);
        formulario?.addEventListener('submit', submitFiltros);
    });
}
alimentosCheck?.addEventListener('change', (e) => {
    if( e.target.checked ) {
        listaBusquedasObj.alimentos = e.target.value;
        return
    }
    listaBusquedasObj.alimentos = '';
});
electronicaCheck?.addEventListener('change', (e) => {
    if( e.target.checked ) {
        listaBusquedasObj.electronica = e.target.value;
        return
    }
    listaBusquedasObj.electronica = '';
});
hogarCheck?.addEventListener('change', (e) => {
    if( e.target.checked ) {
        listaBusquedasObj.hogar = e.target.value;
        return
    }
    listaBusquedasObj.hogar = '';
});
cuidadopersonalCheck?.addEventListener('change', (e) => {
    if( e.target.checked ) {
        listaBusquedasObj.cuidadopersonal = e.target.value;
        return
    }
    listaBusquedasObj.cuidadopersonal = '';
});
relevancia?.addEventListener('change', (e) => {
    order = e.target.value;
    validarFiltros();
});




// Funciones
function getProducto(id) {
    // Obtener producto seleccionado para guardarlo en localStorage y mostrarlo en la pagina de producto-individual.html
    const datos = db.find( (producto) => producto.id === id );
    sincronizarStorage('productoObj', datos);
}

function submitFiltros(e) {
    e.preventDefault();
    filtrarProductos(db);
    modal();
}

function filtrarProductos(array) {
    arrayFiltrado = array.filter( (producto) =>
    producto.categoria === listaBusquedasObj?.alimentos ||
    producto.categoria === listaBusquedasObj?.electronica ||
    producto.categoria === listaBusquedasObj?.hogar ||
    producto.categoria === listaBusquedasObj?.cuidadopersonal);
    validarFiltros();
}

function order_ASC_DESC(order, array) {
    // Ordernar los productos de manera ASC y DESC
    if(order !== '') {
        if( order === 'menor' ) {
            const arrayDBASC = [ ...array ];
            const arrayASC = arrayDBASC.sort((a, b) => extraerPrecio(a.precio) - extraerPrecio(b.precio)); // ordena el array por precio ascendente
            return arrayASC;
        }
        else if( order === 'mayor' ) {
            const arrayDBDESC = [ ...array ];
            const arrayDESC = arrayDBDESC.sort((a, b) => extraerPrecio(b.precio) - extraerPrecio(a.precio)); // ordena el array por precio descendente
            return arrayDESC;
        }
    }
    /*
        Estos ejemplos con sus fuentes fueron sacados del chat de la IA de Bing
        let personas = [
            {nombre: "Ana", edad: 25},
            {nombre: "Luis", edad: 30},
            {nombre: "Pedro", edad: 20}
        ];
    
        Si quieres ordenarlo por nombre alfabéticamente, puedes usar el método localeCompare() de los strings:
        personas.sort((a,b) => a.nombre.localeCompare(b.nombre)); // ordena el array por nombre ascendente

        Si quieres ordenarlo por nombre alfabéticamente en orden inverso, puedes usar el método reverse() después del sort():
        personas.sort((a,b) => a.nombre.localeCompare(b.nombre)).reverse(); // ordena el array por nombre descendente

        Links:
        https://www.delftstack.com/es/howto/javascript/sort-array-based-on-some-property-javascript/
        https://www.delftstack.com/es/howto/javascript/sort-array-based-on-some-property-javascript/
        https://quejava.com/como-ordenar-una-matriz-en-javascript/
        https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/Array/sort
        https://desarrolloweb.com/articulos/ordenacion-arrays-javascript-sort
    */
}

function validarFiltros() {
    limpiarHTML('.productos__grid');
    const filtrosVacios = Object.values(listaBusquedasObj).every((producto) => producto === '');
    if( filtrosVacios && order === '' ) { // reestableciendo, si no hay ningun filtro
        // console.log('reestableciendo, si no hay ningun filtro');
        listaProductos('.productos__grid', db.length, db);
    }
    else if( filtrosVacios && order !== '' ) { // sin filtros, pero con orden ASC o DESC
        // console.log('sin filtros, pero con orden ASC o DESC');
        const arrayFiltradoOrder = order_ASC_DESC(order, db);
        listaProductos('.productos__grid', arrayFiltradoOrder.length, arrayFiltradoOrder);
    }
    else if( !filtrosVacios && order === '' ) { // filtrando por categorias, pero sin orden ASC o DESC
        // console.log('filtrando por categorias, pero sin orden ASC o DESC');
        listaProductos('.productos__grid', arrayFiltrado.length, arrayFiltrado);
    }
    else if( !filtrosVacios && order !== '' ) { // filtrando por categorias y con orden ASC o DESC
        // console.log('filtrando por categorias y con orden ASC o DESC');
        const arrayFiltradoOrder = order_ASC_DESC(order, arrayFiltrado);
        listaProductos('.productos__grid', arrayFiltradoOrder.length, arrayFiltradoOrder);
    }
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
export function listaProductos(contenedor, numResultados, arrayProductos) {
    // Generando lista de productos
    for(let i = 0; i < numResultados; i++) {
   
        // Enlace y contenedor Principal
        const enlaceContenedor = document.createElement('a');
        enlaceContenedor.href = 'producto-individual.html';


        // Contenedor de Producto
        const divProducto = document.createElement('div');
        divProducto.classList.add('producto');
        divProducto.dataset.id = arrayProductos[i].id;


        // Agregando imagenes e info del producto 
        divProducto.appendChild(imagenes(arrayProductos[i].img, arrayProductos[i].titulo));
        divProducto.appendChild(producto(arrayProductos[i].titulo, arrayProductos[i].descripcion, arrayProductos[i].precio));
        divProducto.onclick = () => {
            getProducto(arrayProductos[i].id);
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



// Helpers
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