const bcrypt = require('bcryptjs');

const hash = (password) => {
  return bcrypt.hashSync(password, 11);
}

const comparePassword = (password, hashing) => {
  return bcrypt.compareSync(password, hashing)
}

module.exports = {hash, comparePassword}