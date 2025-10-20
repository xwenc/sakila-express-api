"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
     */
    const languages = [
      "English",
      "Spanish",
      "French",
      "German",
      "Italian",
      "Mandarin",
      "Japanese",
    ];

    // 使用map将语言名称转换为完整的记录对象
    const languageRecords = languages.map((name) => ({
      name,
      created_at: Sequelize.literal("CURRENT_TIMESTAMP"),
      updated_at: Sequelize.literal("CURRENT_TIMESTAMP"),
    }));

    await queryInterface.bulkInsert("languages", languageRecords, {});

  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete("languages", null, {});
  },
};
