exports.up = function(knex) {
  return knex.schema
    .createTable('importers', function (table) {
      table.increments('id');
      // date, name, organization, workspace, template
      table.datetime('date').defaultTo(knex.fn.now());
      table.string('name', 1000).notNullable();
      table.string('templateName', 1000);
      table.string('organizationId', 1000);
      table.string('workspaceId', 1000).notNullable();
      table.string('templateId', 1000);
    })
    .createTable('organizations', function (table) {
      table.increments('id');
      table.string('orgName', 1000).notNullable();
      table.json('workspaces').notNullable();
    })
    .createTable('templates', function (table) {
      table.increments('id');
      table.string('template_name');
      table.json('columns');
      table.json('validators');
      table.json('schema');
      table.datetime('created_at').defaultTo(knex.fn.now());
      table.string('baseTemplateId');
      table.string('collection_name');
      table.string('fileName');
    });
};

exports.down = function(knex) {
  return knex.schema
    .dropTable('importers')
    .dropTable('organizations')
    .dropTable('templates');
};

exports.config = { transaction: false };