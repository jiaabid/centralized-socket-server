const { Sequelize, DataTypes } = require("sequelize");
const sql = require("../database/connection")

const OnlineUser = sql.define("Onlineuser", {
    id: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
        primaryKey: true
    },
    user_id: {
        type: DataTypes.INTEGER,
        unique: true,
        references: {
            model: "users",
            key: 'id'
        }

    },
    socket_id: {
        type: DataTypes.STRING
    },
    createdAt: Sequelize.DATE,
    updatedAt: Sequelize.DATE

}, {
    tableName: 'online_users',
    timestamps:true
});
// OnlineUser.create({
//     user_id: 1
// }).then(res=>console.log(res))

module.exports = OnlineUser;