
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('dummydata').del()
    .then(function () {
      return Promise.all([
        // Inserts seed entries
        knex('dummydata').insert({ name: 'Aliens' ,categories_id:1}),
        knex('dummydata').insert({ name: 'Tim_Hortons', categories_id:2}),
        knex('dummydata').insert({ name: 'Great_Expectations', categories_id:3}),
        knex('dummydata').insert({ name: 'PS4', categories_id:4})
      ]);
    });
};
