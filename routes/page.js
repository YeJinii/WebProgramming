const express = require('express');
const {isLoggedIn, isNotLoggedIn}=require('./middlewares');

const router = express.Router(); 

router.use((req,res,next)=>{
    res.locals.user = req.user;
    res.locals.followerCount = 0;
    res.locals.followingCount = 0;
    res.locals.followerIdList = [];
    next();
});

router.get('/join', isNotLoggedIn,(req, res)=>{
    res.render('join', {title: '회원가입 - NodeBird'});
});

router.get('/about', (req,res)=>{
    res.render('about', {title: '소개 페이지 - NodeBird'});
});

router.get('/', (req,res)=> {
    res.render('main', {title: 'NodeBird'});
});

module.exports = router;