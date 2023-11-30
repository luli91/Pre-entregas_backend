const socket = io();

socket.on('new product', function(product) {
    // agrego el nuevo producto a la lista de productos
    var ul = document.getElementById('products');
    var li = document.createElement('li');
    li.appendChild(document.createTextNode(product));
    ul.appendChild(li);
});

socket.on('delete product', function(productId) {
    // elimino el producto de tu lista de productos
    var ul = document.getElementById('products');
    var li = document.getElementById(productId);
    ul.removeChild(li);
});
