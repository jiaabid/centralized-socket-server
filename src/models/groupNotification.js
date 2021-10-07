const { Sequelize, DataTypes } = require("sequelize");
const sql = require("../database/connection");


const GroupNotifications = sql.define("group_notification", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      notification: {
        type:DataTypes.STRING,
        
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
        references: {
          model: "users",
          key:'id'
        } 
      },
    createdAt: Sequelize.DATE,
    updatedAt: Sequelize.DATE

}, {
    tableName: 'group_notification',
    timestamps: true
})

module.exports = GroupNotifications;