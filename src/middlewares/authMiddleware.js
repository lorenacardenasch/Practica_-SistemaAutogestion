/* Redirecciona a login en caso de no haber iniciado sesión */
function authMiddleware(req, res, next) {
    req.session.userLogged
    if (!req.session.userLogged || req.session.userLogged.id != req.params.id) {
        return res.redirect('/')
    }
    next()
}
module.exports = authMiddleware;