const { Sequelize, DataTypes } = require("sequelize");
const sql = require("../database/connection");
const Chats = require("./chat");
const ChatUser = require("./chatUser");

const User = sql.define("user", {
    id: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
        primaryKey:true
    },
    name: {
        type: DataTypes.STRING
    },
    createdAt:Sequelize.DATE,
    updatedAt:Sequelize.DATE
  
},{timestamps: true});

// User.belongsToMany(Chats,{through:"chat_user", foreignKey: "user_id"})
module.exports = User;