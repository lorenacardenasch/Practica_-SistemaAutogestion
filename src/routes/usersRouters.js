/***Requerimientos***/
const express = require("express");
const router = express.Router();
const path = require("path");
const multer  = require('multer');
const usersControllers = require("../controllers/usersControllers");
const validationLogin = require("../middlewares/validationLogin");
const guestMiddleware = require('../middlewares/guestMiddleware');
const authMiddleware = require('../middlewares/authMiddleware.js')
const { string } = require("i/lib/util");

/***Multer***/
const multerDiskStorage = multer.diskStorage({
    destination: function(req, file, cb) {       // request, archivo y callback que almacena archivo en destino
     cb(null, path.join(__dirname,'../../public/img/users'));    // Ruta donde almacenamos el archivo
    },
    filename: function(req, file, cb) {          // request, archivo y callback que almacena archivo en destino
     let imageName = Date.now() + path.extname(file.originalname);   // milisegundos y extensión de archivo original
     cb(null, imageName);         
    }
});

const uploadFile = multer({ storage: multerDiskStorage,limits:{fileSize:1000000},
    fileFilter :(req, file, cb) => {
        let type = file.mimetype.startsWith('image/');
        type?cb(null, true):cb(new Error('No es un archivo tipo imagen'));
    }
});

/***Rutas ***/

/*** Mostrar pagina de login***/
router.get("/",guestMiddleware, usersControllers.login);

/*** Autenticación del login***/
router.post("/", usersControllers.procesoLogin);

/*** Cerrar sesión ***/
router.get("/logout", usersControllers.logout);

/***Mostrar pagina de registro y crear Usuario***/
router.get("/registro", usersControllers.usuarioRegistro);
router.post("/registro", uploadFile.single('imagen'), usersControllers.crearUsuario);

/*** Mostrar perfil de usuario y editar el perfil de usuario***/
router.get("/perfil/:id",authMiddleware, usersControllers.perfil);
router.get("/editarPerfil/:id",authMiddleware,usersControllers.editarPerfil);
router.put("/editarPerfil/:id", uploadFile.single('imagen'), usersControllers.actualizarPerfil);

/***Eliminar Usuario ***/
router.delete("/:id", usersControllers.eliminarUsuario);

/*** Mostrar lista de usuarios ***/
router.get("/listaUsuarios", authMiddleware, usersControllers.informacionUsuarios);


// /*** Consulta usuarios***/
router.get("/consultaUsuarios", usersControllers.consultaUsuarios);

//-----------EXPORTAR MODULO---------------------------
module.exports = router;
