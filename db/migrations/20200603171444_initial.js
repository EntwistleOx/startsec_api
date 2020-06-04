const Knex = require('knex');

const tableNames = require('../../src/constants/tableNames');

function addDefaultColumns(table) {
  table.timestamps(false, true);
  table.datetime('deleted_at');
}

/**
 * @param {Knex} knex
 */
exports.up = async (knex) => {
  await Promise.all([
    knex.schema.createTable(tableNames.region, (table) => {
      table.increments().notNullable();
      table.string('name').notNullable().unique();
      addDefaultColumns(table);
    }),
    knex.schema.createTable(tableNames.role, (table) => {
      table.increments().notNullable();
      table.date('name').notNullable().unique();
      addDefaultColumns(table);
    }),
  ]);

  await knex.schema.createTable(tableNames.company_address, (table) => {
    table.increments().notNullable();
    table.string('street_address').notNullable();
    addDefaultColumns(table);
    table
      .integer('region_id')
      .unsigned()
      .references('id')
      .inTable('region')
      .onDelete('cascade');
  });

  await knex.schema.createTable(tableNames.company, (table) => {
    table.increments().notNullable();
    table.string('rut', 12).notNullable().unique();
    table.string('corporate_name', 30).notNullable().unique();
    table.string('phone_number', 15).notNullable().unique();
    addDefaultColumns(table);
    table
      .integer('company_address_id')
      .unsigned()
      .references('id')
      .inTable('company')
      .onDelete('cascade');
  });

  await knex.schema.createTable(tableNames.management, (table) => {
    table.increments().notNullable();
    table.string('name').notNullable().unique();
    table.integer('parent_id').unsigned().notNullable();
    addDefaultColumns(table);
    table
      .integer('company_id')
      .unsigned()
      .references('id')
      .inTable('company')
      .onDelete('cascade');
  });

  await knex.schema.createTable(tableNames.user, (table) => {
    table.increments().notNullable();
    table.string('name').notNullable();
    table.string('rut', 12).notNullable().unique();
    table.string('email', 254).notNullable().unique();
    table.string('password', 127).notNullable();
    table.enu('genre', ['Female', 'Male', 'Other']).notNullable();
    table.boolean('active').notNullable();
    addDefaultColumns(table);
    table
      .integer('company_id')
      .unsigned()
      .references('id')
      .inTable('company')
      .onDelete('cascade');
    table
      .integer('management_id')
      .unsigned()
      .references('id')
      .inTable('management')
      .onDelete('cascade');
    table
      .integer('role_id')
      .unsigned()
      .references('id')
      .inTable('role')
      .onDelete('cascade');
  });

  await knex.schema.createTable(tableNames.monitor, (table) => {
    table.increments().notNullable();
    table.datetime('date').notNullable();
    table.string('status', 10).notNullable();
    table.string('active_app', 15).notNullable();
    addDefaultColumns(table);
    table
      .integer('user_id')
      .unsigned()
      .references('id')
      .inTable('user')
      .onDelete('cascade');
  });
};

/**
 * @param {Knex} knex
 */
exports.down = async (knex) => {
  await Promise.all(
    [
      tableNames.monitor,
      tableNames.user,
      tableNames.management,
      tableNames.company,
      tableNames.company_address,
      tableNames.role,
      tableNames.region,
    ].map((tableName) => knex.schema.dropTableIfExists(tableName))
  );
};
