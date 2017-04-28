exports.up = function(knex, Promise) {
  return knex.schema.createTable('dummydata', function (table) {
    table.increments();
    table.string('name')
    table.integer('categories_id').unsigned();
    table.foreign('categories_id').references('id').inTable('categories');

  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('dummydata');
};
