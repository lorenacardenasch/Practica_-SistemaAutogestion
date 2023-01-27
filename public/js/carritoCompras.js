let boton = document.getElementById("agregarCarrito");
let botonEliminar = document.getElementById("eliminarProducto");
botonEliminar.addEventListener("click",function(){
    Swal.fire({
        title: '¿Esta seguro que desea eliminar el producto?',
        showDenyButton: true,
        showCancelButton: true,
        confirmButtonText: 'Guardar',
        denyButtonText: `Descartar`,
    }).then((result) => {
        /* Read more about isConfirmed, isDenied below */
        if (result.isConfirmed) {
          Swal.fire('El producto ha sido eliminado!', '', 'success')
        } else if (result.isDenied) {
          Swal.fire('Los cambios no han sido guardados', '', 'info')
        }
    })
})

boton.addEventListener("click",function(){
    let imagen = document.getElementById("imagenProducto").src;
    let nombre = document.getElementById("nombreProducto").innerHTML
    let precio = document.getElementById("precioProducto").innerHTML;
    let cantidad = document.getElementById("cantidadProducto").value;
    let productoNuevo = {
        imagen: imagen,
        nombre: nombre,
        precio: precio,
        cantidad: cantidad
    }
    let productos = JSON.parse(localStorage.getItem("carrito"));
    if(productos == undefined || productos == null){
        productos =[];   
    }
    productos.push(productoNuevo);
    localStorage.setItem("carrito", JSON.stringify(productos))
    Swal.fire(
        'Correcto!',
        'El producto ha sido agregado al carrito!',
        'success'
    ) 
})