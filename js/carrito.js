import { ARRAYPRODUCTOS } from './constantes/index.js';
import { listaProductos } from './app.js';
import { 
        getItemLocalStorage, 
        contadorCarrito, 
        formatearCantidad, 
        sincronizarStorage, 
        limpiarHTML } from './helpers/index.js';



// Eventos
window.onload = () => {
    contadorCarrito(getItemLocalStorage(ARRAYPRODUCTOS));
    appCarrito(getItemLocalStorage(ARRAYPRODUCTOS));
    listaProductos('.otros__contenido', 6);
    ocultar(getItemLocalStorage(ARRAYPRODUCTOS).length);
}



// Funciones
function appCarrito(carritoArray) {
    if( carritoArray.length ) { // mostrar productos del carrito
        resumen(carritoArray);
        carritoProductos(carritoArray);
    }
    else { // si no hay ningun producto en el carrito
        carritoVacio();
    }
}



// -------------------- > Componentes < --------------------
// Componentes para el resumen de la compra ( Precio de lista, Subtotal:, Envio )
function precioLista(total) {
    // --------------- > Precio de lista < ---------------
    const productoInfoBloque = document.createElement('div');
    productoInfoBloque.classList.add('info');

    const parrafo = document.createElement('p');
    parrafo.classList.add('info__texto');
    parrafo.textContent = 'Precio de lista ';
    const span = document.createElement('span');
    span.classList.add('info__span');
    span.textContent = formatearCantidad(total);
    parrafo.appendChild(span);

    const parrafoDescuento = document.createElement('p');
    parrafoDescuento.classList.add('info__texto', 'color-oranje');
    parrafoDescuento.textContent = 'Ahorros en artículos: ';
    const spanDescuento = document.createElement('span');
    spanDescuento.classList.add('info__span', 'color-gris');
    spanDescuento.textContent = '-$50.00';
    parrafoDescuento.appendChild(spanDescuento);

    // Agregando a su contenedor
    productoInfoBloque.appendChild(parrafo);
    productoInfoBloque.appendChild(parrafoDescuento);

    return productoInfoBloque;
}
function subtotal(total) {
    // --------------- > Subtotal: < ---------------
    const productoInfoSubtotal = document.createElement('div');
    productoInfoSubtotal.classList.add('info');

    const parrafoSubtotal = document.createElement('p');
    parrafoSubtotal.classList.add('info__texto', 'black');
    parrafoSubtotal.textContent = 'Subtotal: ';
    const spanSubTotal = document.createElement('span');
    spanSubTotal.classList.add('info__span');
    spanSubTotal.textContent = formatearCantidad(total);
    parrafoSubtotal.appendChild(spanSubTotal);
    
    const parrafoIVA = document.createElement('p');
    parrafoIVA.classList.add('info__texto', 'text-min');
    parrafoIVA.textContent = 'Los precios incluyen IVA';

    // Agregando a su contenedor
    productoInfoSubtotal.appendChild(parrafoSubtotal);
    productoInfoSubtotal.appendChild(parrafoIVA);

    return productoInfoSubtotal;
}
function envio() {
    // --------------- > Envio: < ---------------
    const productoInfoEnvio = document.createElement('div');
    productoInfoEnvio.classList.add('info');

    const img = document.createElement('img');
    img.src = 'img/camion.svg';
    img.classList.add('info__svg');
    img.setAttribute('alt', 'logo camioncito');
    img.loading = 'lazy';

    const parrafoEnvio = document.createElement('p');
    parrafoEnvio.classList.add('info__texto', 'text-min');
    parrafoEnvio.textContent = 'El costo de envío se calcula con tu dirección';

    // Agregando a su contenedor
    productoInfoEnvio.appendChild(img);
    productoInfoEnvio.appendChild(parrafoEnvio);

    return productoInfoEnvio;
}
function boton() {
    // --------------- > Creando bloque de boton < ---------------
    const divButton = document.createElement('div');
    divButton.classList.add('info-contenedor__button');
    const inputButton = document.createElement('input');
    inputButton.type = 'button';
    inputButton.classList.add('info__button');
    inputButton.value = 'Continuar con la compra';
    divButton.appendChild(inputButton);
    return divButton;
}
function resumen(carritoArray) {

    // Obtener el total del valor del carrito de compras
    let total = 0;
    carritoArray.forEach((producto) => {
        const { cantidad, categoria, descripcion, href, id, img, precio, titulo } = producto;

        // Obteniendo el total
        let p = extraerPrecio(precio);
        const resultado = (p * cantidad);
        total = total + resultado;
    });


    // Contenedor del resumen del carrito 
    const productoContenedor = document.createElement('div');
    productoContenedor.classList.add('info-contenido');
    productoContenedor.appendChild(precioLista(total));
    productoContenedor.appendChild(subtotal(total));
    productoContenedor.appendChild(envio());


    // Agregar al HTML
    const productoInfo = document.querySelector('.productos-carrito__info');
    productoInfo.appendChild(productoContenedor);
    productoInfo.appendChild(boton());
}

// Componentes de los productos
function imagenProducto(img) {
    // Imagen de producto
    const picture = document.createElement('picture');
    const sourceWebp = document.createElement('source');
    sourceWebp.classList.add('webp');
    sourceWebp.srcset = `img/${img.replace('.png', '')}.webp`;
    sourceWebp.type = 'image/webp';

    const imgProducto = document.createElement('img');
    imgProducto.src = `img/${img}`;
    imgProducto.classList.add('producto-carrito__img');
    imgProducto.setAttribute('alt', 'imagen producto');

    picture.appendChild(sourceWebp);
    picture.appendChild(imgProducto);
    return picture;
}
function datosDelProducto(titulo, resultado, cantidad) {
    // Datos del producto
    const tituloProducto = document.createElement('h4');
    tituloProducto.classList.add('producto-carrito__heading');
    tituloProducto.textContent = titulo;

    const parrafoVendidoPor = document.createElement('p');
    parrafoVendidoPor.classList.add('producto-carrito__texto', 'text-min');
    parrafoVendidoPor.textContent = 'Vendido por ';
    const spanVendidoPor = document.createElement('span');
    spanVendidoPor.classList.add('producto-carrito__span');
    spanVendidoPor.textContent = 'CarritoMark';
    parrafoVendidoPor.appendChild(spanVendidoPor);

    const parrafoTotal = document.createElement('p');
    parrafoTotal.classList.add('producto-carrito__texto', 'black');
    parrafoTotal.textContent = 'Total: ';
    const spanTotal = document.createElement('span');
    spanTotal.classList.add('normal');
    spanTotal.textContent = formatearCantidad(resultado);
    parrafoTotal.appendChild(spanTotal);

    const parrafoCantidad = document.createElement('p');
    parrafoCantidad.classList.add('producto-carrito__texto', 'text-min');
    parrafoCantidad.textContent = 'Cantidad: ';
    const spanCantidad = document.createElement('span');
    spanCantidad.textContent = cantidad;
    parrafoCantidad.appendChild(spanCantidad);

    const buttonEliminar = document.createElement('input');
    buttonEliminar.type = 'button';
    buttonEliminar.classList.add('table__eliminar');
    buttonEliminar.value = 'x';

    return {
        tituloProducto,
        parrafoVendidoPor,
        parrafoTotal,
        parrafoCantidad,
        buttonEliminar
    }
}
function carritoProductos(carritoArray) {

    // Contenedor Global/Principal
    const contenedorProductos = document.querySelector('.productos-carrito__contenido');


    // Titulo de Carrito de compra
    const heading = document.createElement('h3');
    heading.classList.add('productos-carrito__heading');
    heading.textContent = 'Carrito de compra';
    contenedorProductos.appendChild(heading);


    // Generando los productos
    carritoArray.forEach((producto) => {
        const { cantidad, categoria, descripcion, href, id, img, precio, titulo } = producto;

        // Obteniendo el total de cada producto
        let p = extraerPrecio(precio);
        const resultado = (p * cantidad);


        // Agregando informacion de los productos a su contenedor
        const info = document.createElement('div');
        info.classList.add('producto-carrito__contenido');
        const { buttonEliminar, parrafoTotal, parrafoVendidoPor, parrafoCantidad, tituloProducto } = datosDelProducto(titulo, resultado, cantidad);
        info.appendChild(tituloProducto);
        info.appendChild(parrafoVendidoPor);
        info.appendChild(parrafoTotal);
        info.appendChild(parrafoCantidad);
        buttonEliminar.onclick = () => {
            eliminarProducto(id);
        }
        info.appendChild(buttonEliminar);


        // Bloque Principal de cada Producto
        const productoBloque = document.createElement('div');
        productoBloque.classList.add('producto-carrito');
        productoBloque.appendChild(imagenProducto(img));
        productoBloque.appendChild(info);


        // Agregando al HTML
        contenedorProductos.appendChild(productoBloque);
    });
}

// Componente del Carrito vacio
function carritoVacio() {
    const vacio = document.querySelector('.carrito-vacio');
    const titulo = document.createElement('h3');
    titulo.textContent = 'Tu carrito está vacío';
    const img = document.createElement('img');
    img.classList.add('carrito-vacio__img');
    img.src = 'img/sin-productos.png';
    img.loading = 'lazy';
    img.alt = 'carrito vacio';
    vacio.appendChild(titulo);
    vacio.appendChild(img);
}



// Funciones
function eliminarProducto(id) {
    // Obteniendo los productos
    let carritoArray = getItemLocalStorage(ARRAYPRODUCTOS);

    // Eliminando el producto
    carritoArray = carritoArray.filter((productoArray) => productoArray.id !== id);

    // Limpiando los productos anteriores
    limpiarHTML('.productos-carrito__info');
    limpiarHTML('.productos-carrito__contenido');

    // Actualizando el resumen y los productos del carrito 
    resumen(carritoArray);
    carritoProductos(carritoArray);

    // Actualizando el localStorage/o en este caso la BD
    sincronizarStorage(ARRAYPRODUCTOS, carritoArray);

    // Actualizando el numero/cantidad de productos que se ve en el carrito
    contadorCarrito(carritoArray);

    // Si el carrito llega a cero se restablece
    if(carritoArray.length === 0) {
        limpiarHTML('.productos-carrito__info');
        limpiarHTML('.productos-carrito__contenido');
        carritoVacio();
    }

    // Ocultando contenedores anteriores, que rompian el diseño dependiendo x situación
    ocultar(carritoArray.length);
}



// Helpers
function extraerPrecio(precio) {
    precio = precio.replace('$', '');
    precio = precio.replace(',', '');
    const precioFormateado = parseFloat(precio);
    return precioFormateado;
}
function ocultar(length) {
    const elemento1 = document.querySelector('.productos-carrito__info');
    const elemento2 = document.querySelector('.productos-carrito__contenido');
    const elemento3 = document.querySelector('.productos-carrito');

    if(length === 0) {
        elemento1.classList.add('display-none');
        elemento2.classList.add('display-none');
        elemento3.classList.remove('mt-5');
    }
    else {
        elemento1.classList.remove('display-none');
        elemento2.classList.remove('display-none');
        elemento3.classList.add('mt-5');
    } 
}