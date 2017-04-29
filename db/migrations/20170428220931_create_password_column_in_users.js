
exports.up = function(knex, Promise) {
  return knex.schema.table('users', function (table) {
    table.string('password');
  });
};

exports.down = function(knex, Promise) {
    return knex.schema.table('users', function (table) {
    table.dropColumn('password');
  });
};
