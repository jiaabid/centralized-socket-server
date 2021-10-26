'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('group_chat_message', {
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
      user_id: {
        type: Sequelize.INTEGER,
        // references: {
        //   model: "users",
        //   key: 'id'
        // }
      },
        status: {
          type: Sequelize.BOOLEAN
        },
        createdAt: Sequelize.DATE,
        updatedAt: Sequelize.DATE
      });
  },

  down: async (queryInterface, Sequelize) => {

    await queryInterface.dropTable('group_chat_message');

  }
};
