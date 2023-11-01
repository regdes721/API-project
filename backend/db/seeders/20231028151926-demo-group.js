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
      about: "Join us for unforgettable evening dinners in the heart of New York City, where delicious cuisine meets vibrant city lights.",
      type: 'In person',
      private: true,
      city: "New York",
      state: "NY"
    },
    {
      organizerId: 2,
      name: "Brooklyn Visions Debate Club",
      about: "Elevate your voice and critical thinking at our dynamic school debate club. Join the discourse!",
      type: 'In person',
      private: true,
      city: "New York",
      state: "NY"
    },
    {
      organizerId: 3,
      name: "Community Garden Club",
      about: "Grow together, nurture nature! Join our vibrant community garden club and cultivate green spaces with us.",
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
    return queryInterface.bulkDelete(options);
    // return queryInterface.bulkDelete(options, {
    //   name: { [Op.in]: ["Evening Tennis on the Water", "Evening Dinners in NYC", "Brooklyn Visions Debate Club", "Community Garden Club"]}
    // });
  }
};
