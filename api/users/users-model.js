const db = require('../../data/dbConfig.js');

function findBy(filter) {
  return db('users as u')
    .select('u.id', 'u.username', 'u.password')
    .where(filter);
  }

function findById(user_id) {
  return db('users as u')
    .select('u.id', 'u.username', 'u.password')
    .where('u.id', user_id)
    .first();
  }
async function add({ username, password }) {
  let created_user_id
  await db.transaction(async trx => {
    const [id] = await trx('users').insert({ username, password })
    created_user_id = id
  })
  return findById(created_user_id)
}

module.exports = {
  add,
  findBy,
  findById,
};
