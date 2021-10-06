const mongoose = require('mongoose');

const { Schema } = mongoose;
const { Types: { ObjectId } } = Schema;
const boardSchema = new Schema({
  title:{//제목
    type: String,
    required: true,
  },
  commenter: {//작성자
    type: ObjectId,
    required: true,
  },
  comment: {//본문
    type: String,
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
  }],
});

module.exports = mongoose.model('Board', boardSchema);