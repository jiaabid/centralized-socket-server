'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('team_users', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      team_id: {
        type: Sequelize.INTEGER,
        unique:true,
        references: {
          model: "teams",
          key:'id'
        }
      },
      user_id:{
        type: Sequelize.INTEGER,
        unique:true,
        references: {
          model: "users",
          key:'id'
        }  
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
