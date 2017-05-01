
exports.up = function(knex, Promise) {
  return knex.schema.table('tasks', function (table) {
    table.string('link');
    table.string('description');
  });
};

exports.down = function(knex, Promise) {
    return knex.schema.table('users', function (table) {
    table.dropColumn('link');
    table.dropColum('description');
  });
};
