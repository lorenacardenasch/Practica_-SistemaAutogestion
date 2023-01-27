//------------REQUERIMIENTOS-------------------------
const db = require("../database/models");
const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const { Association } = require("sequelize");
const { validationResult, check } = require("express-validator");

//------------OBJETO DEL CONTROLADOR------------------
const controladorProductos = {

  //------------MOSTRAR PAGINA PRINCIPAL---------------
  index: (req, res) => {
    db.Producto.findAll().then(function (producto) {
      res.render("home", { producto: producto });
    });
  },
  //------------MOSTRAR PAGINA CUIDADO PERSONAL---------------
  cuidadopersonal: (req, res) => {
    db.Producto.findAll({ where: { categoria_id_FK: 1 } }).then(function (
      producto
    ) {
      res.render("./products/cuidadoPersonalProducto", { producto: producto });
    });
  },
  //------------MOSTRAR PAGINA MAQUILLAJE---------------
  maquillaje: (req, res) => {
    db.Producto.findAll({ where: { categoria_id_FK: 2 } }).then(function (
      producto
    ) {
      res.render("./products/maquillajeProducto", { producto: producto });
    });
  },
  //------------MOSTRAR PAGINA FRAGANCIAS---------------
  fragancia: (req, res) => {
    db.Producto.findAll({ where: { categoria_id_FK: 3 } }).then(function (
      producto
    ) {
      res.render("./products/fraganciaProducto", { producto: producto });
    });
  },
  //------------MOSTRAR PAGINA ELECTRICOS---------------
  electrico: (req, res) => {
    db.Producto.findAll({ where: { categoria_id_FK: 4 } }).then(function (
      producto
    ) {
      res.render("./products/electricoProducto", { producto: producto });
    });
  },
  //------------MOSTRAR PAGINA DETALLE DE PRODUCTO---------------
  detalleProducto: async (req, res) => {
    let producto = await db.Producto.findOne({
      where: { id: req.params.id },
    }).then(function (producto) {
      if (producto) {
        console.log("Producto encontrado");
        res.render("./products/detalleProducto", { producto: producto });
      } else {
        res.send("Producto no encontrado");
      }
    });
  },
  //------------MOSTRAR PAGINA CARRITO DE COMPRAS---------------
  carritoProducto: (req, res) => {
    res.render("./products/carritoProducto");
  },
  //------------MOSTRAR PAGINA CREAR PRODUCTO---------------
  crearProducto: async (req, res) => {
    let categoria = await db.Categoria.findAll();
    let marca = await db.Marca.findAll();
    res.render("./products/crearProducto", { c: categoria, m: marca });
  },
  //------------PROCESO CREAR PRODUCTO---------------
  store: (req, res) => {
    // const errores = validationResult(req);
    const errors = validationResult(req);
    if (errors.isEmpty()) {
      db.Producto.findOne({ where: { nombre: req.body.nombre } }).then(
        function (producto) {
          if (producto) {
            console.log("El producto ya existe");
            return res.render("./products/crearProducto");
          } else {
            let productoNuevo = {
              nombre: req.body.nombre,
              precio: req.body.precio,
              descripcion: req.body.descripcion,
              imagen: "/img/products/" + req.file.filename,
              fecha_eliminación: req.body.fecha_eliminación,
              marca_id_FK: req.body.marca,
              categoria_id_FK: req.body.categoria,
            };
            db.Producto.create(productoNuevo).then(function (producto) {
              return res.redirect("/");
            });
          }
        }
      );
    } else {
      return res.status(422).json({ errors: errors.array() });
      // res.render("/crearProducto",{errores : errores.array()});;
    }
  },
  //------------MOSTRAR PAGINA EDITAR PRODUCTO---------------
  editarProducto: async (req, res) => {
    let categoria = await db.Categoria.findAll();
    let marca = await db.Marca.findAll();
    let producto = await db.Producto.findOne({
      where: { id: req.params.id },
    }).then(function (producto) {
      if (producto) {
        console.log("Producto encontrado");
        res.render("./products/editarProducto", {
          producto: producto,
          c: categoria,
          m: marca,
        });
      } else {
        res.send("Producto no encontrado");
      }
    });
  },
  //------------ACTUALIZAR PRODUCTO---------------
  actualizarProducto: async (req, res) => {
    let nuevosDatos = {
      nombre: req.body.nombre,
      precio: req.body.precio,
      descripcion: req.body.descripcion,
      imagen: "/img/products/" + req.file.filename,
      fecha_eliminación: req.body.fecha_eliminación,
      marca_id_FK: req.body.marca,
      categoria_id_FK: req.body.categoria,
    };
    let actualizarProducto = await db.Producto.update(nuevosDatos, {where: { id: req.params.id }});
    res.redirect("/");
  },
  //------------ELIMINAR PRODUCTO---------------
  eliminarProducto: (req, res) => {
    db.Producto.destroy({ where: { id: req.params.id } }).then(function (){})
  }, 
  /* Datos para API USUARIO */
  consultaProducto : async (req, res) => {
    db.Producto.findAll({include:[{association:'Marca'},{association:'Categoria'}] }).then(function(producto) {
      console.log(producto)
      let listaProducto = [];
      for (p of producto){
        let obj = {
          id: p.id,
          nombre: p.nombre,
          precio: p.precio,
          imagen: p.imagen,
          descripcion: p.descripcion,
          fecha_eliminacion: p.fecha_eliminacion,
          marca: p.Marca,
          categoria: p.Categoria
        }   

      listaProducto.push(obj)
      }
      return res.status(200).json({
        status: 200,
        message: "Product list Request was successfully",
        count_product: listaProducto.length,
        // count_by_category: countByCategory,
        products: listaProducto
      })
      }).catch (err => {
          return res.status(400).json({
              status: 400,
              message: "Bad Request",
              errors: err                   
          })
      })
  },
  consultaProductoID : async (req, res) => {
    db.Producto.findByPk(req.params.id).then(function(producto){
      let detalleProducto = {
        nombre: producto.nombre,
        precio: producto.precio,
        imagen: producto.imagen,
        descripcion: producto.descripcion,
        fecha_eliminacion: producto.fecha_eliminacion,
        // marca_id_FK : producto.marca,
        // categoria_id_FK: producto.categoria
      }
      return res.status(200).json({
        status: 200,
        message: "Respuesta satisfactoria",
        data: detalleProducto
    })
  }).catch (err => {
    return res.status(400).json({
        status: 400,
        message: "Bad Request",
        errors: err                   
    })
  })
  },

  consultaCategorias: async (req, res) => {
    db.Categoria.findAll().then(function(categoria) {
      let listaCategoria = [];
      for(const c of categoria) {
        let obj = {
          id: c.id,
          nombre:  c.nombre,
        }
        listaCategoria.push(obj)
      }
      return res.status(200).json({
        status: 200,
        message: "User list Request was successfully",
        count_categorias: listaCategoria.length,
        categorias : listaCategoria
      })    
    }).catch (err => {
        return res.status(400).json({
          status: 400,
          message: "Bad Request",
          errors: err                   
        })
      })
  }
}

//------------EXPORTAR MODULO CONTROLADOR PRODUCTOS------------------
module.exports = controladorProductos;

//----------------DATOS DEL JSON----------------------------------------
// const productosFilePath = path.join(__dirname,'../data/productos.json');
// const products = JSON.parse(fs.readFileSync(productosFilePath,'utf-8'));
