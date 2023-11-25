'use strict';

/** @type {import('sequelize-cli').Migration} */

const { GroupImage } = require('../models');

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
   await GroupImage.bulkCreate([
    {
      groupId: 1,
      url: "https://www.london-se1.co.uk/news/images/040628_tennis2.jpg",
      preview: true
    },
    {
      groupId: 1,
      url: "false url 1",
      preview: false
    },
    {
      groupId: 2,
      url: "https://i.pinimg.com/originals/4d/f2/ed/4df2ed84facac8afc41ab92fbc73d8fb.jpg",
      preview: true
    },
    {
      groupId: 2,
      url: "false url 2",
      preview: false
    },
    {
      groupId: 3,
      url: "https://i.pinimg.com/originals/c7/9b/6e/c79b6e8231d754125078b9f7d62adf4f.png",
      preview: true
    },
    {
      groupId: 3,
      url: "false url 3",
      preview: false
    },
    {
      groupId: 4,
      url: "https://apartmentseo.com/wp-content/uploads/2021/05/shutterstock_1043427073.jpg",
      preview: true
    },
    {
      groupId: 4,
      url: "false url 4",
      preview: false
    },
    {
      groupId: 5,
      url: "https://www.cardinalpeak.com/wp-content/uploads/2021/01/machine-learning.jpg",
      preview: true
    },
    {
      groupId: 5,
      url: "false url 5",
      preview: false
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
    options.tableName = 'GroupImages';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options);
    // return queryInterface.bulkDelete(options, {
    //   url: { [Op.in]: ["image url 1", "image url 2", "image url 3"]}
    // });
  }
};
