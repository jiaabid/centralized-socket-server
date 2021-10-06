'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('group_message', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      message: {
        type: Sequelize.STRING,
        allowNull: false
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

    await queryInterface.dropTable('group_message');
   
  }
};
