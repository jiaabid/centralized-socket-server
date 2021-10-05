const { Sequelize, DataTypes } = require("sequelize");
const sql = require("../database/connection")

const TeamUser = sql.define("TeamUser", {
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
    team_id: {
        type: DataTypes.INTEGER,
        unique: true,
        references: {
            model: "teams",
            key: 'id'
        }

    },

    createdAt: Sequelize.DATE,
    updatedAt: Sequelize.DATE

}, {
    tableName: 'team_users',
    timestamps:true
});
// OnlineUser.create({
//     user_id: 1
// }).then(res=>console.log(res))

module.exports = TeamUser;