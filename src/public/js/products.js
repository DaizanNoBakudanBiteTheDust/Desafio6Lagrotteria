// Socket comunica con servidor
const socket = io();

//acá pondré los productos que me pasa el cliente
const container = document.getElementById('container');

socket.on('showProducts', data => {
    container.innerHTML = ``

    data.forEach(product => {
        container.innerHTML += `
            <ul>
                <li>titulo: ${product.titulo}</li> 
                <li>descripcion: ${product.descripcion}</li>
                <li>code: ${product.code}</li>
                <li>precio: ${product.precio}</li>
                <li>thumbnail: ${product.status}</li>
                <li>stock: ${product.stock}</li>
                <li>category: ${product.category}</li>
                <li>id: ${product._id}</li>
            </ul>
        `
    });

})
