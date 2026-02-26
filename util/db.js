const Sequelize = require('sequelize');

const sequelize = new Sequelize('web_shop', 'margit', 'qwerty', {
    dialect: 'mysql',
    host: 'localhost'
});

module.exports = sequelize;