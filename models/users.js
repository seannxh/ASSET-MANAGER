const mongoose = require('./connection');

const UserSchema = new mongoose.Schema({
    username: {type: String, require: true, unique: true},
    email: {type: String, require:true, unique:true},
    birthdate:{type: Date, require:true},
    password: {type: String, require: true},
});

const Users = mongoose.model('users', UserSchema);

module.exports = Users;