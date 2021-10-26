const { Sequelize, DataTypes } = require("sequelize");
const sql = require("../database/connection")

const NotificationUser = sql.define("notification_user", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  notification_id: {
    type: Sequelize.INTEGER,
    references: {
      model: "notifications",
      key: 'id'
    }
  },
  user_id: {
    type: Sequelize.INTEGER,
    // references: {
    //   model: "users",
    //   key: 'id'
    // }
  },
  
  status: {
    type: Sequelize.BOOLEAN,
    defaultValue:false
  },
  createdAt: Sequelize.DATE,
  updatedAt: Sequelize.DATE

}, {
  tableName: 'notification_user',
  timestamps: true
});

module.exports = NotificationUser;