const { Sequelize, DataTypes } = require("sequelize");
const sql = require("../database/connection")

const Messages = sql.define("messages", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      message: {
        type: DataTypes.STRING,
        allowNull: false
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
    tableName: 'messages',
    timestamps: true
});

module.exports = Messages;