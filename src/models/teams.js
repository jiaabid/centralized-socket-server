const { Sequelize, DataTypes } = require("sequelize");
const sql = require("../database/connection")

const Teams = sql.define("teams", {
    id: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING
    },
    createdAt: Sequelize.DATE,
    updatedAt: Sequelize.DATE


}, {
    tableName: 'teams',
    timestamps: true
});
// OnlineUser.create({
//     user_id: 1
// }).then(res=>console.log(res))

module.exports = Teams;