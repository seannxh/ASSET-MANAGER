const express = require('express')
const Users = require('../models/users.js')
const bcrypt = require('bcryptjs')
const router = express.Router()

router.get('/signup', (req, res) => {
    console.log(req.body)
    res.render('user/signup.ejs', {errorMessage: null});
})

router.get('/login', (req, res) => {
    res.render('user/login.ejs')
})


router.post('/signup', async (req, res) => {
    try {
        req.body.password = await bcrypt.hash(req.body.password, await bcrypt.genSalt(10));
        
        await Users.create(req.body);
        
        res.redirect('/user/login');
    } catch (err) {
        if (err.code === 11000 && err.keyPattern && err.keyPattern.username) {
            return  res.render('user/signup.ejs', { errorMessage: 'Username already in use. Please choose another.' });
        }
        res.status(400).json(err);
    }
});


router.post("/login", async (req, res) => {
    
    try{
        const user = await Users.findOne({ username: req.body.username});
        if(!user){
            res.send("User doesnt exist");
        } else {
            const passwordsMatch = bcrypt.compareSync(req.body.password, user.password);
            if(passwordsMatch){
                req.session.username = req.body.username;
                req.session.loggedIn = true;
                console.log(req.session)
                res.redirect("/asset");
            } else {
                res.send("wrong password");
            }
        }
    } catch(err){
        res.status(400).json(err);
    }
});

router.get('/logout', (req, res) => {
  req.session.destroy((err) => {
      if (err) {
          console.error('Error destroying session:', err);
          res.status(500).send('Failed to log out');
      } else {
          res.redirect('/');
      }
  });
});

module.exports = router