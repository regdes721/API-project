'use strict';

const { Group } = require('../models');

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;
}
/** @type {import('sequelize-cli').Migration} */
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
   await Group.bulkCreate([
    // {
    //   organizerId: 1,
    //   name: "Evening Tennis on the Water",
    //   about: "Enjoy rounds of tennis with a tight-nit group of people on the water facing the Brooklyn Bridge. Singles or doubles.",
    //   type: 'In person',
    //   private: true,
    //   city: "New York",
    //   state: "NY"
    // },
    {
      organizerId: 3,
      name: "Evening Dinners in NYC",
      about: "Join us for exquisite evening dinners in NYC!",
      type: 'In person',
      private: true,
      city: "New York",
      state: "NY"
    },
    {
      organizerId: 2,
      name: "Brooklyn Visions Debate Club",
      about: "Unlock your voice at our dynamic school debate club!",
      type: 'In person',
      private: true,
      city: "New York",
      state: "NY"
    },
    {
      organizerId: 3,
      name: "Community Garden Club",
      about: "Cultivate community bonds in our Garden Club.",
      type: 'In person',
      private: false,
      city: "New York",
      state: "NY"
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
    options.tableName = 'Groups';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      name: { [Op.in]: ["Evening Dinners in NYC", "Brooklyn Visions Debate Club", "Community Garden Club"]}
    });
  }
};
