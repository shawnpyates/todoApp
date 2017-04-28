
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('dummydata').del()
    .then(function () {
      return Promise.all([
        // Inserts seed entries
        knex('dummydata').insert({ id: 1, name: 'Aliens' ,categories_id:1}),
        knex('dummydata').insert({ id: 2, name: 'Tim_Hortons', categories_id:2}),
        knex('dummydata').insert({ id: 3, name: 'Great_Expectations', categories_id:3}),
        knex('dummydata').insert({ id: 4, name: 'PS4', categories_id:4})
      ]);
    });
};
