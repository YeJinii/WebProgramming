const mongoose = require('mongoose');

const { Schema } = mongoose;
const msgSchema = new Schema({
  sender:{//발신자
    type: String,
  },
  receiver: {//수신자
    type: String,
  },
  createdAt: {//발송 날짜
    type: Date,
    default: Date.now,
  },
  content: {//본문
    type: String,
  },
});

module.exports = mongoose.model('Message', msgSchema);