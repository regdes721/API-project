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
      groupId: 1,
      name: "Tennis Group First Meet and Greet",
      description: "Don't miss this fantastic opportunity to connect with the tennis community, learn more about the sport, and make new friends who share your love for tennis. Whether you're a casual fan or a die-hard enthusiast, this online tennis meet and greet is the perfect place to connect, learn, and have a great time.",
      type: "Online",
      capacity: 50,
      price: 0,
      startDate: "2023-11-19 20:00:00",
      endDate: "2023-11-19 22:00:00"
    },
    {
      groupId: 1,
      name: "Tennis Group Second Meet and Greet",
      description: "Don't miss this fantastic opportunity to connect with the tennis community, learn more about the sport, and make new friends who share your love for tennis. Whether you're a casual fan or a die-hard enthusiast, this online tennis meet and greet is the perfect place to connect, learn, and have a great time.",
      type: "Online",
      capacity: 50,
      price: 0,
      startDate: "2024-02-11 20:00:00",
      endDate: "2024-02-11 22:00:00"
    },
    {
      groupId: 1,
      name: "Tennis Group Third Meet and Greet",
      description: "Don't miss this fantastic opportunity to connect with the tennis community, learn more about the sport, and make new friends who share your love for tennis. Whether you're a casual fan or a die-hard enthusiast, this online tennis meet and greet is the perfect place to connect, learn, and have a great time.",
      type: "Online",
      capacity: 50,
      price: 0,
      startDate: "2024-04-21 20:00:00",
      endDate: "2024-04-21 22:00:00"
    },
    {
      groupId: 1,
      venueId: 1,
      name: "Tennis Singles",
      description: "Are you ready to sharpen your skills, break a sweat, and have a smashing time on the tennis court? We invite you to join our upcoming in-person tennis singles session, where you can showcase your talent, meet new players, and enjoy the thrill of the game!",
      type: 'In person',
      capacity: 30,
      price: 10,
      startDate: "2023-11-20 20:00:00",
      endDate: "2023-11-20 22:00:00"
    },
    {
      groupId: 1,
      venueId: 1,
      name: "Tennis Singles",
      description: "Are you ready to sharpen your skills, break a sweat, and have a smashing time on the tennis court? We invite you to join our upcoming in-person tennis singles session, where you can showcase your talent, meet new players, and enjoy the thrill of the game!",
      type: 'In person',
      capacity: 30,
      price: 10,
      startDate: "2023-11-27 20:00:00",
      endDate: "2023-11-27 22:00:00"
    },
    {
      groupId: 1,
      venueId: 1,
      name: "Tennis Singles",
      description: "Are you ready to sharpen your skills, break a sweat, and have a smashing time on the tennis court? We invite you to join our upcoming in-person tennis singles session, where you can showcase your talent, meet new players, and enjoy the thrill of the game!",
      type: 'In person',
      capacity: 30,
      price: 10,
      startDate: "2023-12-04 20:00:00",
      endDate: "2023-12-04 22:00:00"
    },
    {
      groupId: 1,
      name: "Tennis Group First Meet and Greet",
      description: "Don't miss this fantastic opportunity to connect with the tennis community, learn more about the sport, and make new friends who share your love for tennis. Whether you're a casual fan or a die-hard enthusiast, this online tennis meet and greet is the perfect place to connect, learn, and have a great time.",
      type: "Online",
      capacity: 50,
      price: 0,
      startDate: "2020-11-19 20:00:00",
      endDate: "2020-11-19 22:00:00"
    },
    {
      venueId: 2,
      groupId: 2,
      name: "Dinner at Chazz Palminteri",
      description: "Indulge in an exquisite culinary experience at our upscale Italian restaurant. Join us for an evening of sophistication, where the finest ingredients and traditional recipes come together to create a symphony of flavors. From delectable pasta dishes to mouthwatering desserts, our menu is a celebration of Italy's culinary heritage. Savor the ambiance, impeccable service, and a memorable dining experience that's perfect for special occasions or a romantic evening out. Join us and elevate your taste buds to a new level of Italian elegance. Buon appetito!",
      type: "In person",
      capacity: 12,
      price: 500.00,
      startDate: "2023-11-18 20:00:00",
      endDate: "2023-11-18 23:00:00"
    },
    {
      venueId: 3,
      groupId: 3,
      name: "NYPDL December Invitational",
      description: "Join the excitement of intellectual sparring at our Debate Club Tournament! Are you ready to articulate your ideas, challenge perspectives, and engage in thoughtful discourse? This is your chance to hone your public speaking skills, refine your argumentative prowess, and meet like-minded individuals who share your passion for debate. Whether you're a seasoned debater or a novice looking to dive into the world of rhetoric, our tournament offers a platform for growth and camaraderie. Take the stage, embrace the challenge, and let your voice be heard in this thrilling intellectual arena. Come be a part of our next debate showdown!",
      type: "Online",
      capacity: 60.00,
      price: 5,
      startDate: "2023-12-09 09:00:00",
      endDate: "2023-12-09 16:00:00"
    },
    {
      venueId: 4,
      groupId: 4,
      name: "Designing with Succulents",
      description: "Martha Stewart will share practical and appealing uses for succulents, and how to use these low-water lovelies to enhance gardens large and small.",
      type: "In person",
      capacity: 20,
      price: 19.99,
      startDate: "2023-11-11 12:00:00",
      endDate: "2023-11-11 14:00:00"
    },
    {
      venueId: 5,
      groupId: 2,
      name: "Dinner at Raoul's",
      description: "In a city that changes faster than you can go from uptown to down, Raoul's (open since the 1970s) is a stalwart—here long before SoHo was a brand name. Once inside, order a cocktail and admire the art-filled walls",
      type: "In person",
      capacity: 12,
      price: 100,
      startDate: "2023-12-16 20:00:00",
      endDate: "2023-12-16 23:00:00"
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
