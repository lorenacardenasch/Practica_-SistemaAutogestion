function guestMiddleware(req,res,next){
    if (req.session.userLogged){
        return res.redirect('/perfil/:id ')

    }
    next();
}
module.exports = guestMiddleware