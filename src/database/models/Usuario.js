function usuarioData(sequelize, Datatypes)
{
    let a = 'Usuario';
    let b = {
        id:{type: Datatypes.INTEGER, primaryKey: true, autoIncrement: true},
        nombre:{type:Datatypes.STRING(50)},
        apellido:{type:Datatypes.STRING(50)},
        email:{type:Datatypes.STRING(50)},
        contrasena: {type:Datatypes.STRING(200)},
        imagen:{type:Datatypes.STRING(200)},
        rol_id_FK:{type: Datatypes.INTEGER},

    }

    let c = {camelCase: false, timestamps: false, tableName: 'Usuario'};
    const Usuario= sequelize.define(a,b,c);
    Usuario.associate = function (modelos){
        Usuario.belongsTo(modelos.Rol, {   
           as: "Rol",
           foreignKey: "rol_id_FK"
        });
    }
    return Usuario
}
module.exports = usuarioData;