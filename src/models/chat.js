const { Sequelize, DataTypes } = require("sequelize");
const sql = require("../database/connection");

const Chats = sql.define("chats", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        unique: true
    },
    startedAt: {
        type: DataTypes.DATE
      },
    createdAt: Sequelize.DATE,
    updatedAt: Sequelize.DATE

}, {
    tableName: 'chats',
    timestamps: true
});
// Chats.belongsToMany(User,{through:"chat_user", foreignKey: "chat_id"})

module.exports = Chats;