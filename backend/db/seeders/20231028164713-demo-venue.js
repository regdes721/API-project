'use strict';

/** @type {import('sequelize-cli').Migration} */

const { Venue } = require('../models');

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
   await Venue.bulkCreate([
    {
      groupId: 1,
      address: "30 W 46th Street",
      city: "New York",
      state: "NY",
      lat: 40.7565236,
      lng: -73.9805346
    },
    {
      groupId: 2,
      address: "330 Alexander Street",
      city: "Princeton",
      state: "NJ",
      lat: 40.3365689,
      lng: -74.6554635
    },
    {
      groupId: 3,
      address: "105 E 103rd Street",
      city: "New York",
      state: "NY",
      lat: 40.7910478,
      lng: -73.9489684
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
    options.tableName = 'Venues';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options);
    // return queryInterface.bulkDelete(options, {
    //   address: { [Op.in]: ["30 W 46th Street", "330 Alexander Street", "105 E 103rd Street"]}
    // });
  }
};
