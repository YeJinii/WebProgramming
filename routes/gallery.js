const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const Gallery = require('../schemas/gallery');
const User=require('../schemas/user');
const { isLoggedIn } = require('./middlewares');

const router = express.Router();

try {
  fs.readdirSync('uploads');
} catch (error) {
  console.error('uploads 폴더가 없어 uploads 폴더를 생성합니다.');
  fs.mkdirSync('uploads');
}

const upload = multer({
  storage: multer.diskStorage({
    destination(req, file, cb) {
      cb(null, 'uploads/');
    },
    filename(req, file, cb) {
      const ext = path.extname(file.originalname);
      cb(null, path.basename(file.originalname, ext) + Date.now() + ext);
    },
  }),
  limits: { fileSize: 5 * 1024 * 1024 },
});

router.post('/img', isLoggedIn, upload.single('img'), (req, res) => {
  console.log(req.file);
  res.json({ url: `/img/${req.file.filename}` });
});

router.post('/delete', async (req, res, next) => {
  console.log(req.body);
  const id = req.body.delete_post_id;
  try {
    console.log(id);
    await Gallery.deleteOne({'_id':id});
    return res.redirect('/gallery');
  } catch (error) {
    console.error(error);
    return next(error);
  }
});


const upload2 = multer();
router.post('/', isLoggedIn, upload2.none(), async (req, res, next) => {
  try {
    let hash=req.body.content.match(/#[^\s#]+/g);
    if(hash){
      for(let i=0; i<hash.length; i++){
        hash[i]=hash[i].slice(1).toLowerCase();
      }
    }
    await Gallery.create({
      createAt: req.body.Date,
      img: req.body.url,
      commenter: req.user.id,
      content : req.body.content,
      hashtag : hash,
    });

    res.redirect('/gallery');
  } catch (error) {
    console.error(error);
    next(error);
  }
});

const upload3 = multer();
router.post('/update', upload3.none(),async (req, res, next) => {
  console.log(req.body);
  const id = req.body.update_post_id;
  try {
    console.log(id);
    await Gallery.findByIdAndUpdate({'_id':id}, {
      $set:{
        img: req.body.url,
      }}).sort({"createdAt":-1});
    return res.redirect('/gallery');
    
  } catch (error) {
    console.error(error);
    return next(error);
  }
});

router.get('/', async (req, res, next) => {
  try {
    let gallery = await Gallery.find({}).sort({"createdAt":-1});
    for(let i=0; i<gallery.length; i++){
      let pick=await User.findOne({'_id':gallery[i].commenter}).sort({"createdAt":-1});
      gallery[i].username=pick.nick;
    }
    res.render('gallery', {
      title: 'NodeBird',
      twits: gallery,
    });
  } catch (err) {
    console.error(err);
    next(err);
  }
});

router.get('/update', isLoggedIn, (req,res)=>{
    update_id = req.query.update_post_id;
    res.render('gallery_update', {title: '갤러리 업데이트 - NodeBird', up_id : update_id});
});

router.get('/hash', async (req, res, next) => {
  let tag=req.query.hashtag;
  try {
    let gallery = await Gallery.find({'hashtag':{$in:[tag]}}).sort({"createdAt":-1});
    for(let i=0; i<gallery.length; i++){
      let pick=await User.findOne({'_id':gallery[i].commenter});
      gallery[i].username=pick.nick;
    }
    res.render('gallery', {
      title: 'NodeBird',
      twits: gallery,
    });
  } catch (err) {
    console.error(err);
    next(err);
  }
});

module.exports = router;