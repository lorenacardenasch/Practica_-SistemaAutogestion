const formulario = document.getElementById("formulario");
const boton = document.getElementsById("boton");
formulario.addEventListener("submit", function (e) {
  e.preventDefault();
  let errores = [];
  let campoEmail = document.querySelector("input.emailLogin");
  if (campoNombre.value == "" || campoNombre.value == null) {
    error.push("El campo debe estar completo");
  }
  let campoPassword = document.querySelector("input.contrasenaLogin");
  if (campoPassword.value == "" || campoPassword.value == null) {
    error.push("El campo debe estar completo");
  }
  if (errores.length > 0) {
    e.preventDefault();
    let ulerrores = document.querySelector("div.errores ul");
    for (let i = 0; i < errores.length; i++) {
      ulerrores.innerHTML += "<li>" + errores[i] + "</il>";
    }
  }
});


