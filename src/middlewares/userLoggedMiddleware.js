const { usuarioRegistro } = require("../controllers/usersControllers");

function userLoggedMiddleware(req,res,next){
    res.locals.isLogged = false;
    res.locals.isLoggedAdmin = false;
    if (req.session.userLogged){
        res.locals.isLogged = true;
    }
    if(req.session.userLoggedAdmin == 1){
        res.locals.isLoggedAdmin = true;
    }
    let emailInCookie = req.cookies.email
    next();
}
module.exports = userLoggedMiddleware;