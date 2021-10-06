const mongoose = require('mongoose');

const { Schema } = mongoose;
const { Types: { ObjectId } } = Schema;
const gallerySchema = new Schema({
      img: {//사진
        type: String,
        required: true,
      },
      commenter: {//작성자
        type: ObjectId,
        required: true,
      },
      createdAt: {//작성일
        type: Date,
        default: Date.now,
      },
      content:{
        type: String,
      },
      hashtag: [{//해쉬태그
        type: String,
        required: false,
      }],
});

module.exports = mongoose.model('Gallery', gallerySchema);