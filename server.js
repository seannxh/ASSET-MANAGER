require('dotenv').config(); 
const express = require('express');
const morgan = require('morgan');
const methodOverride = require('method-override'); 
const mongoose = require('mongoose');
const AssetRouter = require('./controllers/asset'); 
const UserRouter = require('./controllers/user'); 
const mongoStore = require('connect-mongo');
const session = require('express-session'); 

const path = require('path'); 
const PORT = process.env.PORT;
const app = express(); 

app.use(morgan('tiny'));
app.use(methodOverride('_method')); 
app.use(express.urlencoded({ extended: true })); 
app.use(express.static('public')); 

app.use(session({
    secret: process.env.SECRET,
    resave: false, 
    saveUninitialized: true, 
    cookie: { secure: false }
}));

app.set('view engine', 'ejs');

app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.render("home"); 
});

app.use('/user', UserRouter);

app.use('/asset', AssetRouter);


app.listen(PORT, () => {
    console.log(`Now listening to port: ${PORT}`);
});
