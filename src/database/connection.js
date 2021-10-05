const sequelize = require('sequelize');

const sqlInstance = new sequelize('socket_server', 'root', '', {
    host: "127.0.0.1",
    dialect: "mysql"
});
const test = async () => {
    try {
        await sqlInstance.authenticate();
        console.log('Connection has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
}

module.exports = sqlInstance;
global.sql = sqlInstance;