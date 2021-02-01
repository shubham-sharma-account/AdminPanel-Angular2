const connection = require('../../connection');
const Sequelize = require('sequelize');
const { INTEGER } = require('sequelize');
const Model = Sequelize.Model;

class Person extends Model { }
//Person model
Person.init({
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        unique:true
    },
    role: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: 'user'
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false
    },
    email: {
        type: Sequelize.STRING,
        allowNull: false,
        primaryKey: true
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false
    },
    phone: {
        type: Sequelize.STRING,
        allowNull: false
    },
    date: {
        type: Sequelize.STRING,
        allowNull: false
    },
    gender: {
        type: Sequelize.STRING,
        allowNull: false
    },
    address1: {
        type: Sequelize.STRING,
        allowNull: false
    },
    address2: {
        type: Sequelize.STRING,
        allowNull: false
    },
    city: {
        type: Sequelize.STRING,
        allowNull: false
    },
    state: {
        type: Sequelize.STRING,
        allowNull: false
    },
    zip: {
        type: Sequelize.STRING,
        allowNull: false
    },
    status: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: 'Active'
    },
    createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
    },
    updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
    }
}, {
    sequelize: connection,
    modelName: 'angular2',
    timestamps: true
});

/* (async ()=>{
    await connection.sync({force: true});
})(); */

module.exports = { Person };