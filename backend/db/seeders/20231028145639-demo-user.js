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
    },
    {
      firstName: 'Nathaniel',
      lastName: 'Richards',
      email: 'kang.the.conqueror@timetraveler.com',
      username: 'TimeMasterKang',
      hashedPassword: bcrypt.hashSync('ravonna')
    },
    {
      firstName: 'Victor',
      lastName: 'Timely',
      email: 'ceo@timelyindustries.com',
      username: 'Victor',
      hashedPassword: bcrypt.hashSync('SecureFuture$1901')
    },
    {
      firstName: 'Sylvie',
      lastName: 'Laufeydottir',
      email: 'sylvie@gmail.com',
      username: 'Enchantress',
      hashedPassword: bcrypt.hashSync('FreeTheTimeline')
    },
    {
      firstName: 'Mobius',
      lastName: 'Mobius',
      email: 'mobius.m.mobius@tva.org',
      username: 'TimeCop',
      hashedPassword: bcrypt.hashSync('4AllTimeAlways')
    },
    {
      firstName: 'Wanda',
      lastName: 'Maximoff',
      email: 'scarletmaximoff@protonmail.com',
      username: 'MotherFirst',
      hashedPassword: bcrypt.hashSync('tommy&billy')
    },
    {
      firstName: 'Loki',
      lastName: 'Odinson',
      email: 'kingloki@gmail.com',
      username: 'King Loki',
      hashedPassword: bcrypt.hashSync('gloriouspurpose')
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
    return queryInterface.bulkDelete(options);
    // return queryInterface.bulkDelete(options, {
    //   username: { [Op.in]: ['PeterParker', 'MilesMorales', 'EmilyMayFoundation'] }
    // }, {})
  }
};
