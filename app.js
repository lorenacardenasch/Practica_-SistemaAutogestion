//----------REQUERIMIENTOS-------------------------------------
const express = require("express"); //Traigo la libreria express
const app = express(); //Utilizo express
const path = require("path"); //traigo path
const methodOverride = require('method-override'); //utilizar el metodo put y delete 
const session = require('express-session');
const cookieParser = require("cookie-parser");
const multer= require("multer");
const {check} = require("express-validator");
const cors = require('cors');
//-------------------------IMPORTACION ENRUTADORES------------------------------------------------------
const usersRouters = require("./src/routes/usersRouters"); //se trae el enrutador
const userLoggedMiddleware = require('./src/middlewares/userLoggedMiddleware');
//----------------MIDDLEWARES-----------------------------------------------------------------
app.use(express.static(path.resolve(__dirname, './public')));//vuelve publica la carpeta public
app.use(express.urlencoded({extended:false})); // utilizar el metodo POST
app.use(express.json()); // utilizar el mtodo post
app.use(methodOverride('_method')); //utilizar el metodo put y delete 
app.use(session( {
  secret: "Este es mi secreto",
  resave: false,
  saveUninitialized: false} )); 
app.use(cookieParser());
app.use(cors());
app.get('/cookie',function(req, res){
  res.cookie(cookie_name , 'cookie_value').send('Cookie is set');
});
app.use(userLoggedMiddleware); //utilizo middleware
//-------------TEMPLATE ENGINE--------------------------------------------------------------------
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "./src/views")); // Define la ubicación de la carpeta de las Vistas
//-------------------------RUTAS------------------------------------------------------
app.use("/", usersRouters); // ruta global de productos
//-------------------SE CARGA EL PUERTO-------------------------------------------------
app.listen(process.env.PORT || 3001, function () {
  console.log("servidor corriendo en puerto 3001");
});
