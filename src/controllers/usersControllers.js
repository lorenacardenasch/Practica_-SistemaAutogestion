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
    res.render ('users/login',{existe: false}); 
  },

/*Autenticacion perfil*/

  procesoLogin: (req, res) => {
    const errores = validationResult(req);
    if (errores.errors.length == 0) {
      db.Usuario.findOne({ where: { email: req.body.email }, include: [{association: 'Rol'}] })
      .then(function (usuario) {
        /* Se envia un mensaje de error si no se encuentra el usuario*/
        if (!usuario) {
          return res.render("users/login",{existe: true})}
        /* Si se encuentra el usuario*/
        if (bcrypt.compareSync(req.body.contrasena, usuario.contrasena)) {
          /* Crear session */
          req.session.userLogged = usuario;
          req.session.userLoggedAdmin = usuario.rol_id_FK;
          /* Crear cookie */
          if(req.body.remember){
            res.cookie("email", usuario.email, {
              maxAge: 600000 * 144,
              httpOnly: true,});}
          if (req.session.userLoggedAdmin == 2){
            res.render("users/perfilUser", {usuario : usuario})
          }
          if (req.session.userLoggedAdmin == 1){
            return res.render("users/perfilAdmin",{usuario : usuario});
          }   
        } else { 
          return res.render("users/login",{existe: true});} /* Se envia un mensaje de error por credenciales incorrectas */
      });
    }
  },

/* Render pagina registro */

  usuarioRegistro: async (req,res) => { 
    let rol = await db.Rol.findAll();
    res.render("users/registro", {existe: false}); },

  usuarioRegistroAdmin: async (req,res) => { 
    let rol = await db.Rol.findAll();
    res.render("users/registroAdmin", {existe: false,rol: rol}); },

/* Render pagina perfil*/

  perfilUser: async (req, res) => { 
    let usuario = await db.Usuario.findOne({where: {id: req.body.id}, include: [{association: 'Rol'}]});
    res.render("users/perfilUser", {usuario : usuario})},

    /* Render pagina perfil*/

  perfilAdmin: async (req, res) => { 
    let usuario = await db.Usuario.findOne({where: {id: req.params.id}, include: [{association: 'Rol'}]});
    res.render("users/perfilAdmin", {usuario : usuario})},

/*Editar perfil */

  editarPerfilUser: async (req,res) =>{
    let usuario = await db.Usuario.findOne({where: {id: req.params.id}, include: [{association: 'Rol'}]});
    res.render("users/editarPerfilUser", {usuario : usuario})},

/* Actualizar perfil de usuario*/
  actualizarPerfilUser: async (req,res) =>{
  const errores = validationResult(req);
  if (errores.errors.length == 0){
      let nuevosDatos = {
        contrasena: bcrypt.hashSync(req.body.contrasena, 10)
      }
      let actualizarUsuario = await db.Usuario.update(nuevosDatos, {where: {id: req.params.id}});
      let usuario = await db.Usuario.findOne({where: {id: req.params.id}, include: [{association: 'Rol'}]})
      res.render('users/perfilUser', {usuario : usuario})
    }
  },

/*Editar perfil */

  editarPerfilAdmin: async (req,res) =>{
    let usuario = await db.Usuario.findOne({where: {id: req.params.id}, include: [{association: 'Rol'}]});
    res.render("users/editarPerfilAdmin", {usuario : usuario})},

/* Actualizar perfil de usuario*/
  actualizarPerfilAdmin: async (req,res) =>{
    const errores = validationResult(req);
  if (errores.errors.length == 0){
    if(req.file.filename){
      group.image = req.file.filename;
      let nuevosDatos = {
        nombre: req.body.nombre,
        apellido: req.body.apellido,
        imagen: "/img/users/" + group.image,
        contrasena: bcrypt.hashSync(req.body.contrasena, 10)
      }
      let actualizarUsuario = await db.Usuario.update(nuevosDatos, {where: {id: req.params.id}});
      let usuario = await db.Usuario.findOne({where: {id: req.params.id}, include: [{association: 'Rol'}]})
      res.render("users/perfilAdmin", {usuario : usuario})
    }else{
      group.image = 'default.png';
      let nuevosDatos = {
        nombre: req.body.nombre,
        apellido: req.body.apellido,
        imagen: "/img/users/" + group.image,
        contrasena: bcrypt.hashSync(req.body.contrasena, 10)
      }
      let actualizarUsuario = await db.Usuario.update(nuevosDatos, {where: {id: req.params.id}});
      let usuario = await db.Usuario.findOne({where: {id: req.params.id}, include: [{association: 'Rol'}]})
      res.render("users/perfilAdmin", {usuario : usuario})
    }
  }
},

/*Crear usuario */
  crearUsuario: (req, res) => {
    let rolUsuario = req.body.rol_id_FK;
    if(req.body.rol_id_FK == undefined || req.body.rol_id_FK == null ){
      rolUsuario = 2
    }
    if (true) {
      db.Usuario.findOne({ where: { email: req.body.email } }).then(function (usuario) 
      {
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
              rol_id_FK:rolUsuario ,
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
              rol_id_FK: rolUsuario ,
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

  crearUsuarioAdmin: (req, res) => {
    if (true) {
      db.Usuario.findOne({ where: { email: req.body.email}})
      .then(function (usuario) {
        if (usuario) {
          return res.render("users/registroAdmin", {existe: true});
        } else {
          if(req.file.filename){
            group.image = req.file.filename;
            let usuarioNuevo = {
              nombre: req.body.nombre,
              apellido: req.body.apellido,
              email: req.body.email,
              contrasena: bcrypt.hashSync(req.body.contrasena, 10),
              imagen: "/img/users/" + group.image,
              rol_id_FK: req.body.rol,
            }
            db.Usuario.create(usuarioNuevo)
            .then(function () {
              return res.redirect('/listaUsuarios')});
          }else{
            let rol = db.Rol.findAll();
            group.image = 'default.png';
            let usuarioNuevo = {
              nombre: req.body.nombre,
              apellido: req.body.apellido,
              email: req.body.email,
              contrasena: bcrypt.hashSync(req.body.contrasena, 10),
              imagen: "/img/users/" + group.image,
              rol_id_FK: req.body.rol,
            }
            db.Usuario.create(usuarioNuevo)
            .then(function () {
              return  res.redirect('/listaUsuarios')});
          };
        }
      });
    } else {
      res.render('users/registro',{existe: true, errores : errores.mapped(), datosUsuarioViejo: req.body });
    }
  },

/*Eliminar Usuario*/

  eliminarUsuario: (req, res) => {
    db.Usuario.destroy({ where: { id: req.params.id } }).then(function (){
      return res.redirect("/listaUsuarios")
    })
    }, 

/*Información de usuarios*/

  informacionUsuarios : async(req, res) => {
    let usuario = await db.Usuario.findAll({ where: { rol_id_FK: 2 } });
        res.render("users/listaUsuarios", {usuario: usuario })},

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

