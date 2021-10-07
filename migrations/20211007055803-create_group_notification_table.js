'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('group_notification', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      notification: {
        type: Sequelize.STRING,
        
      },
      room: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "chats",
          key:'id'
        } 
      },
      sender:{
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "users",
          key:'id'
        } 
      },
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE
    });
  },

  down: async (queryInterface, Sequelize) => {

    await queryInterface.dropTable('group_notification');
   
  }
};
