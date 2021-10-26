const { Sequelize, DataTypes } = require("sequelize");
const sql = require("../database/connection")

const GroupMessages = sql.define("group_messages", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      message: {
        type: DataTypes.STRING,
        allowNull: false
      },
      room: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "chats",
          key:'id'
        } 
      },
      sender:{
        type: DataTypes.INTEGER,
        allowNull: false,
        // references: {
        //   model: "users",
        //   key:'id'
        // } 
      },
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE

}, {
    tableName: 'group_message',
    timestamps: true
});

module.exports = GroupMessages;