exports.up = function(knex, Promise) {
  return knex.schema.createTable('tasks', function (table) {
    table.increments();
    table.string('task_name');
    table.integer('categories_id').unsigned();
    table.foreign('categories_id').references('id').inTable('categories');
    table.date('due_date');
    table.string('priority');
    table.integer('user_id').unsigned();
    table.foreign('user_id').references('id').inTable('users');

  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('tasks');
};
