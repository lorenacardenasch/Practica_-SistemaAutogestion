const formulario= document.getElementById("formulario");
const boton= document.getElementsById("boton");
formulario.addEventListener("submit", function(e){
    e.preventDefault();
    let errores = [];
    let campoNombre=document.querySelector("input.nombre");
    if (campoNombre.value==""||campoNombre.value==null){
        error.push("El campo debe estar completo")
    };
    let campoCategoria=document.querySelector("select.categoria");
    if (ccampoCategoria.value==""||campoCategoria.value==null){
        error.push("El campo debe estar completo")
    };
    let campoMarca=document.querySelector("input.marca");
    if (campoMarca.value==""||campoMarca.value==null){
        error.push("El campo debe estar completo")
    };
    let campoPrecio=document.querySelector("input.precio");
    if (campoPrecio.value==""||campoPrecio.value==null){
        error.push("El campo debe estar completo")
    };
    let campodescripcion=document.querySelector("input.descripcion");
    if (campodescripcion.value==""||campodescripcion.value==null){
        error.push("Seleccione un campo")};
    let campoImg=document.querySelector("input.imagen");
        if (campoImg.value==""||campoImg.value==null){
            error.push("Seleccione un campo")};
    if (errores.length > 0 ){
        e.preventDefault();
        let ulerrores = document.querySelector("div.errores ul");
        for (let i=0;i<errores.length;i++){
            ulerrores.innerHTML += "<li>"+ errores[i]+"</il>"
        }
    }
})
