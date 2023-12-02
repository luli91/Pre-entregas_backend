const socket = io();

//capturo los datos que el cliente coloco en el formulario que esta en el archivo products.hbs

const form =document.querySelector("form")

form.addEventListener("submit", (e) => {
    e.preventDefault() //para que no recargue la pagina

    const formData = new FormData (form);

    console.log(formData.get(form));
//por consola veo las propiedades de la clase products que colcoque en el formulario
//enviamos este products a server (linea 44) mediante websocket
    const products = {
        title :formData.get("title"),
        description :formData.get("description"),
        price :Number (formData.get("price")),
        thumbnail:formData.get("thumbnail"),
        code :formData.get("code"),
        stock :Number (formData.get("stock")),
    };
//emito el websocket
    socket.emit("products_send", products);
    form.reset(); //borra los valores que se envian por input en el form
});

//obtenemos del evento el cual nos envian todos los products 

socket.on("products", (data) => {
    const products = document.querySelector("#products");
    console.log(data);
    const p = document.createElement("p");
    p.innerHTML = `${data.title} - ${data.description} - ${data.price} - ${data.thumbnail} - ${data.code} - ${data.stock} - <button id="button-${data.id}"> Eliminar </button>`;
    products.appendChild(p);
});

