const { Sequelize, DataTypes } = require("sequelize");
const sql = require("../database/connection");


const Notifications = sql.define("notifications", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      notification: {
        type: DataTypes.STRING,
       
      },
      reciever: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "users",
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
    tableName: 'notifications',
    timestamps: true
})

module.exports = Notifications;