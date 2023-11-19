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
        url: "https://images.squarespace-cdn.com/content/v1/5a60f55d29f18717fce46ab8/1521651061197-FP3Q1NDNJSAQGIVMRON5/ke17ZwdGBToddI8pDm48kB6N0s8PWtX2k_eW8krg04V7gQa3H78H3Y0txjaiv_0fDoOvxcdMmMKkDsyUqMSsMWxHk725yiiHCCLfrh8O1z5QPOohDIaIeljMHgDF5CVlOqpeNLcJ80NK65_fV7S1URWK2DJDpV27WG7FD5VZsfFVodF6E_6KI51EW1dNf095hdyjf10zfCEVHp52s13p8g/meet+and+greet.jpg",
        preview: true
      },
      {
        eventId: 2,
        url: "https://images.squarespace-cdn.com/content/v1/5a60f55d29f18717fce46ab8/1521651061197-FP3Q1NDNJSAQGIVMRON5/ke17ZwdGBToddI8pDm48kB6N0s8PWtX2k_eW8krg04V7gQa3H78H3Y0txjaiv_0fDoOvxcdMmMKkDsyUqMSsMWxHk725yiiHCCLfrh8O1z5QPOohDIaIeljMHgDF5CVlOqpeNLcJ80NK65_fV7S1URWK2DJDpV27WG7FD5VZsfFVodF6E_6KI51EW1dNf095hdyjf10zfCEVHp52s13p8g/meet+and+greet.jpg",
        preview: true
      },
      {
        eventId: 3,
        url: "https://images.squarespace-cdn.com/content/v1/5a60f55d29f18717fce46ab8/1521651061197-FP3Q1NDNJSAQGIVMRON5/ke17ZwdGBToddI8pDm48kB6N0s8PWtX2k_eW8krg04V7gQa3H78H3Y0txjaiv_0fDoOvxcdMmMKkDsyUqMSsMWxHk725yiiHCCLfrh8O1z5QPOohDIaIeljMHgDF5CVlOqpeNLcJ80NK65_fV7S1URWK2DJDpV27WG7FD5VZsfFVodF6E_6KI51EW1dNf095hdyjf10zfCEVHp52s13p8g/meet+and+greet.jpg",
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
        url: "https://images.squarespace-cdn.com/content/v1/5a60f55d29f18717fce46ab8/1521651061197-FP3Q1NDNJSAQGIVMRON5/ke17ZwdGBToddI8pDm48kB6N0s8PWtX2k_eW8krg04V7gQa3H78H3Y0txjaiv_0fDoOvxcdMmMKkDsyUqMSsMWxHk725yiiHCCLfrh8O1z5QPOohDIaIeljMHgDF5CVlOqpeNLcJ80NK65_fV7S1URWK2DJDpV27WG7FD5VZsfFVodF6E_6KI51EW1dNf095hdyjf10zfCEVHp52s13p8g/meet+and+greet.jpg",
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
