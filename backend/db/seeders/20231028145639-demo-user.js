'use strict';

/** @type {import('sequelize-cli').Migration} */
const { User } = require('../models');
const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;
}

module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
   await User.bulkCreate([
    {
      firstName: 'Peter',
      lastName: 'Parker',
      email: 'peterparker@oscorp.io',
      username: 'PeterParker',
      hashedPassword: bcrypt.hashSync('spiderman')
    },
    {
      firstName: 'Miles',
      lastName: 'Morales',
      email: 'brooklynvisionary@bv.edu',
      username: 'MilesMorales',
      hashedPassword: bcrypt.hashSync('ny1andonly')
    },
    {
      firstName: 'Harry',
      lastName: 'Osborn',
      email: 'harryosborn@oscorp.io',
      username: 'EmilyMayFoundation',
      hashedPassword: bcrypt.hashSync('healtheworld')
    }
   ], { validate: true })
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    options.tableName = 'Users';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      username: { [Op.in]: ['PeterParker', 'MilesMorales', 'EmilyMayFoundation'] }
    }, {})
  }
};
