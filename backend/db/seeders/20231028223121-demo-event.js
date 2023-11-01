'use strict';

/** @type {import('sequelize-cli').Migration} */

const { Event } = require('../models');

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
   await Event.bulkCreate([
    {
      venueId: 1,
      groupId: 1,
      name: "Dinner at Chazz Palminteri",
      description: "Indulge in an exquisite culinary experience at our upscale Italian restaurant. Join us for an evening of sophistication, where the finest ingredients and traditional recipes come together to create a symphony of flavors. From delectable pasta dishes to mouthwatering desserts, our menu is a celebration of Italy's culinary heritage. Savor the ambiance, impeccable service, and a memorable dining experience that's perfect for special occasions or a romantic evening out. Join us and elevate your taste buds to a new level of Italian elegance. Buon appetito!",
      type: "In person",
      capacity: 12,
      price: 500,
      startDate: "2023-11-18 20:00:00",
      endDate: "2023-11-18 23:00:00"
    },
    {
      venueId: 2,
      groupId: 2,
      name: "NYPDL December Invitational",
      description: "Join the excitement of intellectual sparring at our Debate Club Tournament! Are you ready to articulate your ideas, challenge perspectives, and engage in thoughtful discourse? This is your chance to hone your public speaking skills, refine your argumentative prowess, and meet like-minded individuals who share your passion for debate. Whether you're a seasoned debater or a novice looking to dive into the world of rhetoric, our tournament offers a platform for growth and camaraderie. Take the stage, embrace the challenge, and let your voice be heard in this thrilling intellectual arena. Come be a part of our next debate showdown!",
      type: "Online",
      capacity: 60,
      price: 5,
      startDate: "2023-12-09 09:00:00",
      endDate: "2023-12-09 16:00:00"
    },
    {
      venueId: 3,
      groupId: 3,
      name: "Designing with Succulents",
      description: "Martha Stewart will share practical and appealing uses for succulents, and how to use these low-water lovelies to enhance gardens large and small.",
      type: "In person",
      capacity: 20,
      price: 20,
      startDate: "2023-11-11 12:00:00",
      endDate: "2023-11-11 14:00:00"
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
    options.tableName = 'Events';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options);
    // return queryInterface.bulkDelete(options, {
    //   name: { [Op.in]: ["Dinner at Chazz Palminteri", "NYPDL December Invitational", "Designing with Succulents"]}
    // });
  }
};
