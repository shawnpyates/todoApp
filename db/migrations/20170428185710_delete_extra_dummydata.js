
exports.up = function(knex, Promise) {
  return knex('dummydata').where('name', null).del();


};

exports.down = function(knex, Promise) {
  return null ;
};
