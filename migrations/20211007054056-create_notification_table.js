'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('notifications', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      notification: {
        type: Sequelize.STRING,
        allowNull: false
      },
      reciever: {
        type: Sequelize.INTEGER,
        allowNull: false,
        // references: {
        //   model: "users",
        //   key:'id'
        // } 
      },
      sender:{
        type: Sequelize.INTEGER,
        allowNull: false,
        // references: {
        //   model: "users",
        //   key:'id'
        // } 
      },
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE
    });
  },

  down: async (queryInterface, Sequelize) => {

    await queryInterface.dropTable('notifications');
   
  }
};
