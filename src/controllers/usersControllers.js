/* Requerimientos*/
const fs = require("fs");
const path = require("path");
const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
/* Importar datos */
const db = require("../database/models");
const { group } = require("console");

/* Objeto controlador */
const controladorUsuarios = 
{

/* Render pagina Login */

  login: (req, res) => { 
    res.render ('users/login',{existe: false}); },

/* Render pagina registro */

  usuarioRegistro: async (req,res) => { 
    let rol = await db.Rol.findAll();
    res.render("users/registro", {existe: false,r: rol}); },

/* Render pagina perfil*/

  perfil: async (req, res) => { 
    let usuario = await db.Usuario.findOne({where: {id: req.params.id}, include: [{association: 'Rol'}]});
    res.render("users/perfil", {usuario : usuario})},

/*Editar perfil */
  editarPerfil: (req,res) =>{
    let usuario = db.Usuario.findOne({where: {id: req.params.id}}).then(function(usuario){
      return res.render("users/editarPerfil", {usuario:usuario});
    })
  },

  //------------------crear usuario-----------------

  crearUsuario: (req, res) => {
    const errores = validationResult(req);
    let rolUsuario = req.body.rol_id_FK;
    if(req.body.rol_id_FK == undefined || req.body.rol_id_FK == null ){
      rolUsuario = 2
    }
    if (errores.errors.length == 0) {
      db.Usuario.findOne({ where: { email: req.body.email } }).then(function (
        usuario
      ) {
        if (usuario) {
          return res.render("users/registro", {existe: true});
        } else {
          if(req.file.filename){
            group.image = req.file.filename;
            let usuarioNuevo = {
              nombre: req.body.nombre,
              apellido: req.body.apellido,
              email: req.body.email,
              contrasena: bcrypt.hashSync(req.body.contrasena, 10),
              imagen: "/img/users/" + group.image,
              rol_id_FK: rolUsuario,
            }
            db.Usuario.create(usuarioNuevo).then(function (usuario) {
              return res.render('users/login',{existe: false})
            });
          }else{
            group.image = 'default.png';
            let usuarioNuevo = {
              nombre: req.body.nombre,
              apellido: req.body.apellido,
              email: req.body.email,
              contrasena: bcrypt.hashSync(req.body.contrasena, 10),
              imagen: "/img/users/" + group.image,
              rol_id_FK: rolUsuario,
            }
            db.Usuario.create(usuarioNuevo).then(function (usuario) {
              return res.render('users/login',{existe: false})
            });
          };
        }
      });
    } else {
      res.render('users/registro',{ errores : errores.mapped(), datosUsuarioViejo: req.body });
    }
  },

  //------------------autenticación usuario-----------------

  procesoLogin: (req, res) => {
    const errores = validationResult(req);
    if (errores.errors.length == 0) {
      db.Usuario.findOne({ where: { email: req.body.email } })
      .then(function (usuario) {
        /* Se envia un mensaje de error si no se encuentra el usuario*/
        if (!usuario) {
          return res.render("users/login",{existe: true})}
        if (bcrypt.compareSync(req.body.contrasena, usuario.contrasena)) {
          /* Crear session */
          req.session.userLogged = usuario;
          req.session.userLoggedAdmin = usuario.rol_id_FK;
          /* Crear cookie */
          if(req.body.remember){
            res.cookie("email", usuario.email, {
              maxAge: 600000 * 144,
              httpOnly: true,
            });}
          return res.redirect(`/perfil/${usuario.id}`);
        } else { 
          return res.render("users/login",{existe: true});} /* Se envia un mensaje de error por contraseña incorrecta */
      });
    }
  },

/* Actualizar perfil de usuario*/

  actualizarPerfil: async (req,res) =>{
    const errores = validationResult(req);
    if (errores.errors.length == 0){
      if(req.file.filename){
        group.image = req.file.filename;
        let nuevosDatos = {
          nombre: req.body.nombre,
          apellido: req.body.apellido,
          imagen: "/img/users/" + group.image,
        }
        let actualizarUsuario = await db.Usuario.update(nuevosDatos, {where: {id: req.params.id}});
        let usuario = await db.Usuario.findOne({where: {id: req.params.id}})
        res.render("users/perfil", {usuario : usuario})
      }else{
        group.image = 'default.png';
        let nuevosDatos = {
          nombre: req.body.nombre,
          apellido: req.body.apellido,
          imagen: "/img/users/" + group.image,
        }
        let actualizarUsuario = await db.Usuario.update(nuevosDatos, {where: {id: req.params.id}});
        let usuario = await db.Usuario.findOne({where: {id: req.params.id}})
        res.render("users/perfil", {usuario : usuario})
      }
    }
  },

/*Eliminar Usuario*/

  eliminarUsuario: (req, res) => {
    db.Usuario.destroy({ where: { id: req.params.id } }).then(function (){})
    }, 

/*Información de usuarios*/

  informacionUsuarios : (req, res) => {
    db.Usuario.findAll().then(function (usuario) {
        res.render("users/listaUsuarios", { usuario: usuario });
      });
    },

/* Cerrar sesion*/

    logout: (req,res) =>{
      res.clearCookie('email');
      req.session.destroy();
      return (res.redirect("/"))
    },

/* API CANTIDAD DE USUARIOS*/

  consultaUsuarios : (req, res) => {
    db.Usuario.findAll().then(function(usuario) {
      let listaUsuario = [];
      for(const u of usuario) {
        let obj = {
          id: u.id,
          nombre:  u.nombre,
          apellido: u.apellido,
          email:  u.email,
          contrasena: u.contrasena,
          rol: u.rol,
          imagen: u.imagen,
        }
        listaUsuario.push(obj)
      }
      return res.status(200).json({
        status: 200,
        message: "User list Request was successfully",
        count_users: listaUsuario.length,
        users: listaUsuario
      })    
    }).catch (err => {
        return res.status(400).json({
          status: 400,
          message: "Bad Request",
          errors: err                   
        })
      })
    }
};

//------------EXPORTAR MODULO CONTROLADOR USUARIOS------------------
module.exports = controladorUsuarios;

