function rolData(sequelize, Datatypes)
{
    let a = 'Rol';

    let b = {
        id:{type: Datatypes.INTEGER, primaryKey: true, autoIncrement: true},
        nombre:{type:Datatypes.STRING(50)},
    }
    let c = {camelCase: false, timestamps: false, tableName: 'Rol'};
    const Rol= sequelize.define(a,b,c)
    Rol.associate = function (modelos){
        Rol.hasMany(modelos.Usuario,
            {
        as: "Usuario",
        foreignKey: "rol_id_FK"
        });
    } 

    return Rol
}
module.exports = rolData;