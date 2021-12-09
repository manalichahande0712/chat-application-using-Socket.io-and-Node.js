const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const chatSchema = new Schema(
  {
    sender: {
      type: String
    },
    message: {
      type: String
    },
    time:{
      
    }

  },
   
);

module.exports = mongoose.model('Chat', chatSchema);
