
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('dummydata').del()
    .then(function () {
      knex('categories').del()
      .then(function () {
        return Promise.all([
          // Inserts seed entries
          knex('categories').insert({name: 'towatch'}),
          knex('categories').insert({name: 'toEat'}),
          knex('categories').insert({name: 'toRead'}),
          knex('categories').insert({name: 'toBuy'})
        ]);
      });
    });
};
