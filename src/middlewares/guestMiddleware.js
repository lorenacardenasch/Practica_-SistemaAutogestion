/* Redirecciona al perfil en caso de no tener acceso */
function guestMiddleware(req,res,next){
    if (req.session.userLogged){
        return res.redirect(`/perfil/${req.session.userLogged.id}`);
    }
    next();
}
module.exports = guestMiddleware;