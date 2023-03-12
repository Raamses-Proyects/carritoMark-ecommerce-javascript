import { PRODUCTOSOBJ, ARRAYPRODUCTOS } from './constantes/index.js';
import { listaProductos } from './app.js';
import { sincronizarStorage, getItemLocalStorage, contadorCarrito } from './helpers/index.js';



// Eventos
window.onload = () => {
    seccionProductoIndividual(getItemLocalStorage(PRODUCTOSOBJ));
    contadorCarrito(getItemLocalStorage(ARRAYPRODUCTOS));
    listaProductos('.otros__contenido', 6);
}



// Componentes
function enlaceRegresar() {
    // Enlace para ' <= regresar'
    const contenedorVolver = document.createElement('div');
    contenedorVolver.classList.add('pagina-producto');
    const enlaceRegresar = document.createElement('a');
    enlaceRegresar.innerHTML = `&#8678; Volver`;
    enlaceRegresar.href = 'javascript: history.go(-1)';
    enlaceRegresar.classList.add('regresar');
    contenedorVolver.appendChild(enlaceRegresar)
    return contenedorVolver;
}

function imagenes(img, titulo) {
    const picture = document.createElement('picture');
    const sourceWebp = document.createElement('source');
    sourceWebp.srcset = `img/${img.replace('.png', '')}.webp`;
    sourceWebp.type = 'image/webp';
    const imagen = document.createElement('img');
    imagen.src = `img/${img}`;
    imagen.classList.add('producto__imagen');
    imagen.loading = 'lazy';
    imagen.width = '500';
    imagen.height = '300';
    imagen.alt = `imagen ${titulo}`;
    picture.appendChild(sourceWebp);
    picture.appendChild(imagen);
    return picture;
}

function datosProducto(titulo, descripcion, precio)  {
    const heading = document.createElement('h3');
    heading.classList.add('producto__heading');
    heading.textContent = titulo;
    const parrafoTexto = document.createElement('p');
    parrafoTexto.classList.add('producto__texto');
    parrafoTexto.textContent = descripcion;
    const parrafoPrecio = document.createElement('p')
    parrafoPrecio.classList.add('producto__precio');
    parrafoPrecio.textContent = precio;
    return { heading, parrafoTexto, parrafoPrecio }
}

function botonAgregar(simbolo) {

    const button = document.createElement('button');
    button.innerHTML = simbolo;
    button.classList.add('buttons-cantidad');

    if( simbolo === '+' ) {
        button.onclick = () => {
            let contador = 0;
            contador++;
            let valorActual = getCantidad();
            let nuevaCantidad = (valorActual + contador);
            document.querySelector('#cantidad').textContent = nuevaCantidad;
        }
    }
    else {
        button.onclick = () => {
            let contador = 0;
            contador++;
            let valorActual = getCantidad();
            let nuevaCantidad = (valorActual - contador);
            if( nuevaCantidad <= 0 ) {
                nuevaCantidad = 1;
            }
            document.querySelector('#cantidad').textContent = nuevaCantidad;
        }
    }
    return button;
}

function parrafoLabel(titulo) {
    const parrafo = document.createElement('p');
    parrafo.classList.add('producto__label');
    if( titulo !== '' ) {
        if(titulo.includes('Limón') || titulo.includes('Manzana') ) {
            parrafo.textContent = 'Cantidad en kg:';
        }
        else {
            parrafo.textContent = 'Cantidad:';
        }
    }
    return parrafo;
}

function parrafoCantidad(cantidad) {
    const parrafoCantidad = document.createElement('label');
    parrafoCantidad.classList.add('producto__label');
    parrafoCantidad.id = 'cantidad';
    parrafoCantidad.textContent = cantidad;
    return parrafoCantidad;
}

function getCantidadTextButton(id) {
    let cantidad = 1;
    let inputValue = 'Agregar al carrito';

    const carritoArray = getItemLocalStorage(ARRAYPRODUCTOS);
    const existe = carritoArray.some( (producto) => producto.id === id );
    if(existe) {
        inputValue = 'Actualizar Carrito';
        carritoArray.forEach( (producto) => {
            if(producto.id === id) {
                cantidad = producto.cantidad;
            }
        });
    }

    return {cantidad, inputValue};
}

function seccionProductoIndividual(productoObj) {
    const { id, categoria, descripcion, img, precio, titulo, href } = productoObj;
    

    // Obteniendo la cantidad y el value del button
    const { cantidad, inputValue } = getCantidadTextButton(id); 


    // Contenedor para agregar o quitar x cantidad de productos
    const contenedorCantidad = document.createElement('div');
    contenedorCantidad.classList.add('producto-contenido__cantidad');
    contenedorCantidad.appendChild(parrafoLabel(titulo));// Cantida || Cantidad en kg
    contenedorCantidad.appendChild(botonAgregar('&#8722;'));
    contenedorCantidad.appendChild(parrafoCantidad(cantidad));// contador cantidades parrafo
    contenedorCantidad.appendChild(botonAgregar('+'));
    // console.log(contenedorCantidad);
    

    // Boton - Agregar al carrito
    const agregarAlCarritoBtn = document.createElement('input');
    agregarAlCarritoBtn.classList.add('producto__button');
    agregarAlCarritoBtn.type = 'button';
    agregarAlCarritoBtn.value = inputValue;
    agregarAlCarritoBtn.onclick = () => {
        llenarArrayCarrito(productoObj);
    }
    // console.log(inputButton);
  

    // Agregando los datos del producto a su contenedor
    const productoContenido = document.createElement('div');
    productoContenido.classList.add('producto__contenido');
    const {heading, parrafoTexto, parrafoPrecio} = datosProducto(titulo, descripcion, precio);
    productoContenido.appendChild(heading);
    productoContenido.appendChild(parrafoTexto);
    productoContenido.appendChild(parrafoPrecio);
    productoContenido.appendChild(contenedorCantidad);
    productoContenido.appendChild(agregarAlCarritoBtn);
    // console.log(productoContenido);


    // Agregando imagenes y contenido del producto
    const grid = document.createElement('div');
    grid.classList.add('pagina-producto__grid');
    grid.append(imagenes(img, titulo));
    grid.append(productoContenido);
    const seccionProducto = document.createElement('section');
    seccionProducto.classList.add('pagina-producto');
    seccionProducto.appendChild(grid);
    // console.log(seccionProducto);


    // Agregando al HTML
    const seccionProductoIndividual = document.querySelector('.producto-individual');
    seccionProductoIndividual.appendChild(enlaceRegresar()); // Enlace para <= regresar
    seccionProductoIndividual.appendChild(seccionProducto); // Producto seleccionado
}



// Funciones
function llenarArrayCarrito (productoObj) {
    let carritoArray = getItemLocalStorage(ARRAYPRODUCTOS);

    // Si el producto ya existe, se le actualiza su cantidad por la que ingrese el usuario
    const existe = carritoArray.some( (producto) => producto.id === productoObj.id );
    if(existe) {

        // Si ya tiene productos
        carritoArray.map( (productoArr) => {
            if(productoArr.id === productoObj.id) {

                // Obteniendo el valor de la cantidad
                const cantidadUsuario = getCantidad();
                
                // Validando
                if(cantidadUsuario <= 0) {
                    alert('La cantidad tiene que ser mayor a cero');
                    return;
                }
                else if(!isNaN(cantidadUsuario) === false) {
                    alert('Tiene que ingresar la cantidad');
                    return;
                }

                // Moficando el valor que tenga la cantidad en el objeto por la cantidad nueva que haya ingresado el usuario
                productoArr.cantidad = cantidadUsuario;
                return productoArr;
            }
        });
    }
    else { // Si es el primer producto con ese Id

        // Obteniendo el valor de la cantidad del input
        const cantidad = getCantidad();

        // Validando
        if(cantidad <= 0) {
            alert('La cantidad tiene que ser mayor a cero');
            return;
        }
        else if(!isNaN(cantidad) === false) {
            alert('Tiene que ingresar una cantidad valida.');
            return;
        }

        // Llenado objeto con la cantidad
        productoObj.cantidad = cantidad; // creando y agregando valor a nuevo campo cantidad
        carritoArray = [ ...carritoArray, productoObj ];
    }

    sincronizarStorage(ARRAYPRODUCTOS, carritoArray);
    contadorCarrito(carritoArray);
}

const getCantidad = () => parseInt(document.querySelector('#cantidad').textContent);