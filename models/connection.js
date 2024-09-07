require('dotenv').config();
const mongoose = require('mongoose');

mongoose.connect(process.env.DATA); 

mongoose.connection
    .on('open', () => console.log('connected to mongoose'))
    .on('close', () => console.log('disconnected'))
    .on('error', (err) => console.log('error', err));

module.exports = mongoose;