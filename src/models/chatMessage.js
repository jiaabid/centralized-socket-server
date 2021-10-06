const { Sequelize, DataTypes } = require("sequelize");
const sql = require("../database/connection")

const ChatMessage = sql.define("chat_message", {
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
      message_id:{
        type: DataTypes.INTEGER,
        references: {
          model: "messages",
          key:'id'
        }  
      },
      createdAt:Sequelize.DATE,
      updatedAt:Sequelize.DATE

}, {
    tableName: 'chat_message',
    timestamps: true
});

module.exports = ChatMessage;