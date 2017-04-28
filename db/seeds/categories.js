
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('categories').del()
    .then(function () {
      return Promise.all([
        // Inserts seed entries
        knex('categories').insert({id: 1, name: 'towatch'}),
        knex('categories').insert({id: 2, name: 'toEat'}),
        knex('categories').insert({id: 3, name: 'toRead'}),
        knex('categories').insert({id: 4, name: 'toBuy'})
      ]);
    });
};
