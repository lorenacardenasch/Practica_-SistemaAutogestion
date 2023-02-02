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