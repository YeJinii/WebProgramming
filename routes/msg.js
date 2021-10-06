const express = require('express');
const path = require('path');
const fs = require('fs');

const User = require('../schemas/user');
const Msg = require('../schemas/msg');
const {isLoggedIn}=require('./middlewares');

const router = express.Router(); 

router.post('/', isLoggedIn, async (req, res, next) => {
    try {  
      await Msg.create({
        sender : req.user.email,
        receiver: req.body.receiver,
        content : req.body.content,
      });
      res.redirect('/msg');
    } catch (error) {
      console.error(error);
      next(error);
    }
});

router.get('/', async (req, res, next) => {
    try {
      let msg = await Msg.find().where('receiver').equals(req.user.email).sort({"createdAt":-1});
      res.render('msg', {
        title: 'NodeBird',
        twits: msg,
      });
    } catch (err) {
      console.error(err);
      next(err);
    }
});

module.exports = router;