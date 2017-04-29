
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  // return knex('dummydata').del()
  //   .then(function () {
      return knex('categories').del()
      .then(function () {
        return Promise.all([
          // Inserts seed entries
          knex('categories').insert({name: 'towatch'}),
          knex('categories').insert({name: 'toEat'}),
          knex('categories').insert({name: 'toRead'}),
          knex('categories').insert({name: 'toBuy'}),
          knex('categories').insert({name: 'toWatchOrRead'}),
          knex('categories').insert({name: 'noMatch'})
        ]);
      });
};
