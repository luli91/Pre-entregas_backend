const socket = io();

const chatbox = document.querySelector("#chatbox")
let user;

Swal.fire ({
    title: "Bienvenido",
    text:"Bienvenido al chat",
    input: "text",
    inputValidator: (value) => {
        return !value && "Necesitás identificarte";
    },
    allowOutsideClick : false,
}).then ((value) => {
    user = value.value
    console.log(user);
});

//aca tomo el valor del input y lo mando al servidor mediante websocket 
chatbox.addEventListener('keyup', (e)=> {
    if(e.key === 'Enter'){
        socket.emit("message", {
            user,
            message: e.target.value
        });
        chatbox.value="";
    }
});

socket.on("messages", (data)=> {
    const log = document.querySelector("#messages");
    let messages = "";

    data.forEach((message) => {
        messages += `<strong>${message.user}</strong>: ${message.message} <br />`;
    });
    log.innerHTML =messages;
    console.log(data);
})

// //capturo los datos que el cliente coloco en el formulario que esta en el archivo products.hbs

// const form =document.querySelector("form")

// form.addEventListener("submit", (e) => {
//     e.preventDefault() //para que no recargue la pagina

//     const formData = new FormData (form);

//     console.log(formData.get(form));
// //por consola veo las propiedades de la clase products que colcoque en el formulario
// //enviamos este products a server (linea 44) mediante websocket
//     const products = {
//         title :formData.get("title"),
//         description :formData.get("description"),
//         price :Number (formData.get("price")),
//         thumbnail:formData.get("thumbnail"),
//         code :formData.get("code"),
//         stock :Number (formData.get("stock")),
//     };
// //emito el websocket
//     socket.emit("products_send", products);
//     form.reset(); //borra los valores que se envian por input en el form
// });

// //obtenemos del evento el cual nos envian todos los products 

// socket.on("products", (data) => {
//     const products = document.querySelector("#products");
//     console.log(data);
//     data.forEach(product => {
//         const p = document.createElement("p");
//         p.innerHTML = `${product.title} - ${product.description} - ${product.price} - ${product.thumbnail} - ${product.code} - ${product.stock} - <button id="button-${product.id}"> Eliminar </button>`;
//         products.appendChild(p);
//     });
// });