'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('chat_message', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      chat_id: {
        type: Sequelize.INTEGER,
        references: {
          model: "chats",
          key: 'id'
        }
      },
      message_id: {
        type: Sequelize.INTEGER,
        references: {
          model: "messages",
          key: 'id'
        }
      },
      type: {
        type: Sequelize.ENUM(["single", "group"])
      },
      status: {
        type: Sequelize.BOOLEAN
      },
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE
    });
  },

  down: async (queryInterface, Sequelize) => {

    await queryInterface.dropTable('chat_message');
    /**
    * Add reverting commands here.
    *
    * Example:
    * await queryInterface.dropTable('chat_message');
    */
  }
};
