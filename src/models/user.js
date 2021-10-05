const { Sequelize, DataTypes } = require("sequelize");
const sql = require("../database/connection")

const User = sql.define("User", {
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

module.exports = User;