const express = require('express');
const path=require('path');
const fs= require('fs');

const Board = require('../schemas/board');
const User = require('../schemas/user');
const {isLoggedIn}=require('./middlewares');

const router = express.Router();

router.post('/', isLoggedIn, async (req, res, next) => {
    try {
      let hash=req.body.content.match(/#[^\s#]+/g);
      if(hash){
        for(let i=0; i<hash.length; i++){
          hash[i]=hash[i].slice(1).toLowerCase();
        }
      }
      await Board.create({
        title: req.body.title,
        comment: req.body.comment,
        commenter: req.user.id,
        content : req.body.content,
        hashtag : hash,
      });
      res.redirect('/board');
    } catch (error) {
      console.error(error);
      next(error);
    }
});
router.get('/', async (req, res, next) => {
    try {
      let board = await Board.find({}).sort({"createdAt":-1});
      for(let i=0; i<board.length; i++){
          let pick=await User.findOne({'_id':board[i].commenter});
          board[i].username=pick.nick;
      }
      res.render('board', {
        title: 'NodeBird',
        twits: board,
      });
    } catch (err) {
      console.error(err);
      next(err);
    }
});

router.get('/search_id',isLoggedIn, async (req, res, next) => {
  try{
    let user = await User.find().where('email').equals(req.query.writer).sort({"createdAt":-1});
    let board = await Board.find().where('commenter').equals(user[0]['_id'])
    for(let i=0; i<board.length; i++){
      let pick=await User.findOne({'_id':board[i].commenter});
      board[i].username=pick.nick;
    }
    res.render('board', {
      title: 'NodeBird',
      twits: board,
    });
  } catch(err){
    console.error(err);
    next(err);
  }
});

router.get('/search_content',isLoggedIn, async (req, res, next) => {
  try{
    let board = await Board.find({content:{$regex:req.query.search}});
    for(let i=0; i<board.length; i++){
      let pick=await User.findOne({'_id':board[i].commenter});
      board[i].username=pick.nick;
    }
    res.render('board', {
      title: 'NodeBird',
      twits: board,
    });
  } catch(err){
    console.error(err);
    next(err);
  }
});


router.post('/delete',isLoggedIn, async (req, res, next) => {
  console.log(req.body);
  const id = req.body.delete_post_id;
  try {
    await Board.deleteOne({'_id':id});
    return res.redirect('/board');
  } catch (error) {
    console.error(error);
    return next(error);
  }
});

router.get('/hash', async (req, res, next) => {
  let tag=req.query.hashtag;
  try {
    let board = await Board.find({'hashtag':{$in:[tag]}}).sort({"createdAt":-1});
    for(let i=0; i<board.length; i++){
      let pick=await User.findOne({'_id':board[i].commenter});
      board[i].username=pick.nick;
    }
    res.render('board', {
      title: 'NodeBird',
      twits: board,
    });
  } catch (err) {
    console.error(err);
    next(err);
  }
});

router.post('/update', async (req, res, next) => {
  console.log(req.body);
  const id = req.body.update_post_id;
  try {
    const hash=req.body.content.match(/#[^\s#]+/g);
    await Board.findByIdAndUpdate({'_id':id}, {
      $set:{
        title: req.body.title,
        comment: req.body.comment,
        content : req.body.content,
        hashtag : hash,
      }}).sort({"createdAt":-1});
    return res.redirect('/board');
    
  } catch (error) {
    console.error(error);
    return next(error);
  }
});

router.get('/update', isLoggedIn, (req,res)=>{
  let update_id = req.query.update_post_id;
  res.render('board_update', {title: '게시판 업데이트 - NodeBird', up_id : update_id});
});  

module.exports = router;