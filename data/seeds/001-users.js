const users = [
  { username: 'user', password:'$2a$08$5QmmHYtNTAuroUfZB0s04OgefCClNqyuI7SRO1RFehVK7o1BOY.U2' },
]

exports.seed = function(knex, Promise) {
  return knex('users')
    .truncate()
    .then(function() {
      return knex('users').insert(users);
    });
};

exports.users = users
