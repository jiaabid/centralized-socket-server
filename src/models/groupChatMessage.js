const { Sequelize, DataTypes } = require("sequelize");
const sql = require("../database/connection")

const GroupChatMessage = sql.define("group_chat_message", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  chat_id: {
    type: DataTypes.INTEGER,
    references: {
      model: "chats",
      key: 'id'
    }
  },
  message_id: {
    type: DataTypes.INTEGER,
    references: {
      model: "messages",
      key: 'id'
    }
  },
  user_id: {
    type: DataTypes.INTEGER,
    references: {
      model: "users",
      key: 'id'
    }
  },
  status: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  createdAt: Sequelize.DATE,
  updatedAt: Sequelize.DATE

}, {
  tableName: 'group_chat_message',
  timestamps: true
});

module.exports = GroupChatMessage;