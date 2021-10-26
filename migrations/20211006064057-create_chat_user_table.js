'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('chat_user', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      chat_id: {
        type: Sequelize.INTEGER,
        // references: {
        //   model: "chats",
        //   key:'id'
        // }
      },
      user_id:{
        type: Sequelize.INTEGER,
        // references: {
        //   model: "users",
        //   key:'id'
        // }  
      },
      createdAt:Sequelize.DATE,
      updatedAt:Sequelize.DATE
    });
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
};
