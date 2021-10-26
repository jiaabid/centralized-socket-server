const { Sequelize, DataTypes } = require("sequelize");
const sql = require("../database/connection")

const ChatUser = sql.define("chat_user", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      chat_id: {
        type: DataTypes.INTEGER,
        references: {
          model: "chats",
          key:'id'
        }
      },
      user_id:{
        type: DataTypes.INTEGER,
        // references: {
        //   model: "users",
        //   key:'id'
        // }  
      },
      createdAt:Sequelize.DATE,
      updatedAt:Sequelize.DATE

}, {
    tableName: 'chat_user',
    timestamps: true
});

module.exports = ChatUser;