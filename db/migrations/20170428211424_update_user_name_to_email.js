
exports.up = function(knex, Promise) {
  return knex.schema.table('users', function (table) {
    table.renameColumn('name', 'email');
  });
};

exports.down = function(knex, Promise) {
    return knex.schema.table('users', function (table) {
    table.renameColumn('email', 'name');
  });
};
