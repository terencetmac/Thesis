const { db } = require('../../db/config.js');

module.exports.new = (user) => {
  return db.one(
    'INSERT INTO users\
    (email, first_name, last_name, password, phone)\
    VALUES (${email}, ${first_name}, ${last_name}, ${password}, ${phone})\
    RETURNING user_id, email, first_name, last_name, phone, phone_verified',
    user)
}

module.exports.verifyPhone = (user_id, phone) => {
  return module.exports.update(user_id, 'phone_verified', phone);
}

module.exports.findByEmail = (email) => {
  return db.oneOrNone('SELECT * FROM users WHERE email = $1', [email])
}

module.exports.findByPhone = (phone) => {
  return db.oneOrNone('SELECT * FROM users WHERE phone = $1', [phone])
}

module.exports.update = (user_id, column, updatedValue) => {
  return db.query('UPDATE users SET $1~ = $2 WHERE user_id = $3 RETURNING *', [column, updatedValue, user_id]);
}

module.exports.delete = (user_id) => {
  return db.query('DELETE FROM users WHERE user_id = $1', [user_id]);
}