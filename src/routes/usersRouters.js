/***Requerimientos***/
const express = require("express");
const router = express.Router();
const path = require("path");
const multer  = require('multer');
const usersControllers = require("../controllers/usersControllers");
const { body } = require('express-validator');
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

/***Validaciones***/

/***Validaciones Login***/

const validacionLogin =[
    body('email').notEmpty().withMessage("Ingrese un email valido").bail().isEmail().withMessage("Complete el email"),
    body('contrasena').notEmpty().withMessage("Ingrese una contraseña valida").bail().isLength({min: 8}).withMessage("Ingrese minimo 8 caracteres"),
]

/***Validaciones Registro**/
const validacionRegistro =[
    body('nombre').notEmpty().withMessage("Introduce un nombre valido").bail(),
    body('apellido').notEmpty().withMessage("Introduce un apellido valido").bail(),
    body('email').notEmpty().withMessage("Introduce un email valido").bail().isEmail().withMessage("debes escribir un formato valido"),
    body('contrasena').notEmpty().withMessage("introducion contraseña valido").bail().isLength({min: 8}).withMessage("minimo de ocho caracteres"),
    body('rol').notEmpty().withMessage("Elige un rol"),
/*     body("imagen").custom((value,{req}) => {
        let imagen = req.file;
        let imagenExtensiones = ['.jpg','.png', '.gif'];
        if (!imagen){
            throw new Error("Suba un archivo de imagen");
        }else{
            let imagenExtension = path.extname(file.originalname);
            if(!imagenExtensiones.includes(imagenExtension)){
                throw new Error('La extension de la imagen no es permitida.')
             }
        }
    return true; 
})*/
]
/***Validaciones EditarPerfil***/
const validacionEditarPerfil =[
    body('nombre').notEmpty().withMessage("Introduce un nombre valido").bail(),
    body('apellido').notEmpty().withMessage("Introduce un apellido valido").bail(),
    body('contrasena').notEmpty().withMessage("Ingrese una contraseña valida").bail().isLength({min: 8}).withMessage("Ingrese minimo 8 caracteres"),
/*     body("imagen").custom((value,{req}) => {
        let imagen = req.file;
        let imagenExtensiones = ['.jpg','.png', '.gif'];
        if (!imagen){
            throw new Error("Suba un archivo de imagen");
        }else{
            let imagenExtension = path.extname(file.originalname);
            if(!imagenExtensiones.includes(imagenExtension)){
                throw new Error('La extension de la imagen no es permitida.')
             }
        }
    return true; 
})*/
]
/***Rutas ***/

/*** Mostrar pagina de login***/
router.get("/", guestMiddleware, usersControllers.login);

/*** Autenticación del login***/
router.post("/",validacionLogin, usersControllers.procesoLogin);

/*** Cerrar sesión ***/
router.get("/logout", usersControllers.logout);

/***Mostrar pagina de registro y crear Usuario***/
router.get("/registro", validacionRegistro, usersControllers.usuarioRegistro);
router.post("/registro", uploadFile.single('imagen'),validacionRegistro, usersControllers.crearUsuario);

/*** Mostrar perfil de usuario y editar el perfil de usuario***/
router.get("/perfil/:id", usersControllers.perfil);
router.get("/editarPerfilUser/:id", usersControllers.editarPerfilUser);
router.put("/editarPerfilUser/:id", uploadFile.single('imagen'), usersControllers.actualizarPerfilUser);
router.get("/editarPerfilAdmin/:id", usersControllers.editarPerfilAdmin);
router.put("/editarPerfilAdmin/:id", uploadFile.single('imagen'), usersControllers.actualizarPerfilAdmin);

/***Eliminar Usuario ***/
router.delete("/:id", usersControllers.eliminarUsuario);

/*** Mostrar lista de usuarios ***/
router.get("/listaUsuarios", usersControllers.informacionUsuarios);

/*** Consulta usuarios***/
router.get("/consultaUsuarios", usersControllers.consultaUsuarios);

//-----------EXPORTAR MODULO---------------------------
module.exports = router;
