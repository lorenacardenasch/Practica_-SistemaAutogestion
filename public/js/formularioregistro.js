const formulario = document.getElementById("formulario");
const boton = document.getElementById("añadirUsuario");

formulario.addEventListener("submit", function (e) {
  e.preventDefault();
  let errores = [];
  let campoNombre = document.querySelector("input.nombreUser");
  if (campoNombre.value == "" || campoNombre.value == null) {
    error.push("El campo debe estar completo");
  }

  let campoApellido = document.querySelector("input.apellidoUser");
  if (campoApellido.value == "" || campoApellido.value == null) {
    error.push("El campo debe estar completo");
  }
  let campoEmail = document.querySelector("input.emailLogin");
  if (campoEmail.value == "" || campoEmail.value == null) {
    error.push("El campo debe estar completo");
  }
  let campoPassword = document.querySelector("input.contrasenaLogin");
  if (campoPassword.value == "" || campoPassword.value == null) {
    error.push("El campo debe estar completo");
  }
  let campoSelct = document.querySelector("slect.categoriaUser");
  if (campoSelct.value == "" || campoSelct.value == null) {
    error.push("Seleccione un campo");
  }
  let campoImg = document.querySelector("input.imagenUser");
  if (campoImg.value == "" || campoImg.value == null) {
    error.push("Seleccione un campo");
  }
  if (errores.length > 0) {
    e.preventDefault();
    let ulerrores = document.querySelector("div.errores ul");
    for (let i = 0; i < errores.length; i++) {
      ulerrores.innerHTML += "<li>" + errores[i] + "</il>";
    }
  }
});

