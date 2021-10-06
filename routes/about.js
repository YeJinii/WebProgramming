const express = require('express');

const router = express.Router();

router.get('/',(req,res)=>{
    res.render('home', {title: '홈으로 돌아가기'});
});

module.exports = router;