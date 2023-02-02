const { body } = require('express-validator');
const { string } = require("i/lib/util");

const validacionLogin =[
    body('email').notEmpty().withMessage("introduce un mail valido").bail().isEmail().withMessage("debes completar el mail"),
    body('contrasena').notEmpty().withMessage("introducion contraseña valido").bail().isLength({min: 8}).withMessage("minimo de ocho caracteres"),
]