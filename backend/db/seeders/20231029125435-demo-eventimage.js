'use strict';

/** @type {import('sequelize-cli').Migration} */

const { EventImage } = require('../models');

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
    await EventImage.bulkCreate([
      {
        eventId: 1,
        url: "https://www.belvederecl.com/wp-content/uploads/2018/11/Meet-n-Greet.png",
        preview: true
      },
      {
        eventId: 2,
        url: "https://www.belvederecl.com/wp-content/uploads/2018/11/Meet-n-Greet.png",
        preview: true
      },
      {
        eventId: 3,
        url: "https://www.belvederecl.com/wp-content/uploads/2018/11/Meet-n-Greet.png",
        preview: true
      },
      {
        eventId: 4,
        url: "https://i.ytimg.com/vi/Ni_xNAgEBdA/maxresdefault.jpg",
        preview: true
      },
      {
        eventId: 5,
        url: "https://i.ytimg.com/vi/Ni_xNAgEBdA/maxresdefault.jpg",
        preview: true
      },
      {
        eventId: 6,
        url: "https://i.ytimg.com/vi/Ni_xNAgEBdA/maxresdefault.jpg",
        preview: true
      },
      {
        eventId: 7,
        url: "https://www.belvederecl.com/wp-content/uploads/2018/11/Meet-n-Greet.png",
        preview: true
      },
      {
        eventId: 8,
        url: "https://d1t295ks1d26ah.cloudfront.net/media/pictures/files/000/014/668/xlarge_desktop/24172731_1807982915880769_9176252435740566168_o.jpg?1513543436",
        preview: true
      },
      {
        eventId: 9,
        url: "https://i.ytimg.com/vi/12eRCxN0gVI/maxresdefault.jpg",
        preview: true
      },
      {
        eventId: 10,
        url: "https://assets.marthastewart.com/styles/wmax-520-highdpi/d18/ft050_ultimatero10/ft050_ultimatero10_xl.jpg?itok=A4wA7SH6",
        preview: true
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
    options.tableName = 'EventImages';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options);
    // return queryInterface.bulkDelete(options, {
    //   url: { [Op.in]: ["image url 1", "image url 2", "image url 3"]}
    // });
  }
};
