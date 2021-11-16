const { Sequelize, DataTypes } = require("sequelize");
const sql = require("../database/connection");


const Notifications = sql.define("notifications", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      msg: {
        type: DataTypes.STRING,
        allowNull: true
      },
      data: {
        type: DataTypes.JSON,
        allowNull: true
      },
      reciever: {
        type: DataTypes.INTEGER,
        allowNull: false,
        
      },
      sender:{
        type: DataTypes.INTEGER,
        allowNull: false,
     
      },
      type: {
        type: DataTypes.STRING,
        allowNull: true
      },
    createdAt: Sequelize.DATE,
    updatedAt: Sequelize.DATE

}, {
    tableName: 'notifications',
    timestamps: true
})

module.exports = Notifications;