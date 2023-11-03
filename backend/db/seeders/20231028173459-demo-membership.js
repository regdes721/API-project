'use strict';

/** @type {import('sequelize-cli').Migration} */

const { Membership } = require('../models');

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
   await Membership.bulkCreate([
    {
      userId: 3,
      groupId: 1,
      status: "co-host"
    },
    {
      userId: 4,
      groupId: 1,
      status: 'member'
    },
    {
      userId: 5,
      groupId: 1,
      status: 'co-host'
    },
    {
      userId: 6,
      groupId: 1,
      status: 'pending'
    },
    {
      userId: 8,
      groupId: 1,
      status: 'member'
    },
    {
      userId: 3,
      groupId: 2,
      status: "co-host"
    },
    {
      userId: 4,
      groupId: 2,
      status: 'pending'
    },
    {
      userId: 5,
      groupId: 2,
      status: 'member'
    },
    {
      userId: 9,
      groupId: 2,
      status: 'pending'
    },
    {
      userId: 1,
      groupId: 3,
      status: "pending"
    },
    {
      userId: 2,
      groupId: 3,
      status: "member"
    },
    {
      userId: 4,
      groupId: 3,
      status: "member"
    },
    {
      userId: 1,
      groupId: 4,
      status: "member"
    },
    {
      userId: 3,
      groupId: 4,
      status: "co-host"
    },
    {
      userId: 8,
      groupId: 4,
      status: "member"
    },
   ], { validate: true })
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    options.tableName = 'Memberships';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options);
    // return queryInterface.bulkDelete(options, {
    //   userId: { [Op.in]: [1, 2, 3]}
    // });
  }
};
