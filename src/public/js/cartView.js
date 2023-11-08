// Socket comunica con servidor
const socket = io();

socket.on('showCartById', data => { 
    container.innerHTML = ``;

    data.forEach(cart => {
        container.innerHTML += '<ul>';
        cart.products.forEach(product => {
            container.innerHTML += `
                <li>Product ID: ${product._id}</li>
                <li>Quantity: ${product.quantity}</li>
            `;
        });
        container.innerHTML += `<li>Cart ID: ${cart._id}</li></ul>`;
    });
});




