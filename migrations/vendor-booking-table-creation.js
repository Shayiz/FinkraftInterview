"use strict";
const Sequelize = require("sequelize");
module.exports = {
  up: async ({ context: { queryInterface } }) => {
    await queryInterface.createTable("vendor", {
      id: {
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
      },
      vendorName: {
        type: Sequelize.STRING,
      },
      vendorLocation: {
        type: Sequelize.STRING,
      },
      active: { type: Sequelize.BOOLEAN, defaultValue: true },
      createdAt: {
        type: Sequelize.DATE,
      },
      updatedAt: {
        type: Sequelize.DATE,
      },
    });
    await queryInterface.createTable("booking", {
      id: {
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
      },
      bookingId: {
        type: Sequelize.STRING,
      },
      customerName: {
        type: Sequelize.STRING,
      },
      bookingDate: {
        type: Sequelize.DATE,
      },
      amount: {
        type: Sequelize.DOUBLE,
      },
      vendorId: {
        type: Sequelize.UUID,
        references: {
          model: "vendor",
          key: "id",
          deferrable: Sequelize.Deferrable.INITIALLY_IMMEDIATE,
        },
      },
      active: { type: Sequelize.BOOLEAN, defaultValue: true },
      createdAt: {
        type: Sequelize.DATE,
      },
      updatedAt: {
        type: Sequelize.DATE,
      },
    });
  },
  down: async ({ context: { queryInterface } }) => {
    await queryInterface.dropTable("booking");
    await queryInterface.dropTable("vendor");
  },
};
