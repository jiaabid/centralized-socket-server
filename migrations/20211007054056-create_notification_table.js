'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('notifications', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      msg: {
        type: Sequelize.STRING,
        allowNull: true
      },
      data: {
        type: Sequelize.JSON,
        allowNull: true
      },
      reciever: {
        type: Sequelize.INTEGER,
        allowNull: false,

      },
      sender: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      type: {
        type: Sequelize.STRING,
        allowNull: true
      },
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE
    });
  },

  down: async (queryInterface, Sequelize) => {

    await queryInterface.dropTable('notifications');

  }
};
