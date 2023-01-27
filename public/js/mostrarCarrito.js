let contenedorProductos = document.querySelector(".productos");
let contenedorTotal = document.querySelector(".total");
let productos = JSON.parse(localStorage.getItem("carrito"));
let totalCarrito = 0;

let boton = document.getElementById("LimpiarCarrito");

boton.addEventListener("click",function(){
    localStorage.clear()
})

for (let p of productos){
    let div1 = document.createElement("div");
    div1.setAttribute("class", "productos-item");
    contenedorProductos.appendChild(div1);
    
    let imagenCarro = document.createElement("img");
    imagenCarro.setAttribute("class", "imagenCarro");
    imagenCarro.src = p.imagen;
    div1.appendChild(imagenCarro);
        
    let nombreCarro = document.createElement("p");
    nombreCarro.setAttribute("class", "nombreCarro");
    nombreCarro.innerText = p.nombre;
    div1.appendChild(nombreCarro);
    
    let precioCarro = document.createElement("p");
    precioCarro.setAttribute("class", "precioCarro");
    precioCarro.innerText = p.precio;
    div1.appendChild(precioCarro);

    let cantidadCarro = document.createElement("p")
    cantidadCarro.setAttribute("class", "cantidadCarro");
    cantidadCarro.innerText = p.cantidad;
    div1.appendChild(cantidadCarro);
    
    let totalProducto = document.createElement("p");
    totalProducto.setAttribute("class", "totalProducto");
    totalProducto.innerText = parseInt(p.cantidad)* parseInt(p.precio);
    div1.appendChild(totalProducto);
    totalProducto= parseInt(p.cantidad)* parseInt(p.precio);
    totalCarrito = totalCarrito + totalProducto;
}

let div2 = document.createElement("div");
div2.setAttribute("class", "totalProducto");
contenedorTotal.appendChild(div2);
let totalmostrar = document.createElement("p");
totalmostrar.innerText= totalCarrito;
div2.appendChild(totalmostrar);

