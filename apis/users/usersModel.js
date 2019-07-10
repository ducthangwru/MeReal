const mongoose = require('mongoose');
const userSchema = require('./usersSchema');
let usersModel = mongoose.model('users', userSchema, 'users');

module.exports = usersModel