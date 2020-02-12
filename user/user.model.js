const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: {
      type: String,
      unique: true
    },
    number: {
        type: String,
        unique: true
    },
    photo: {
      type: String
    }
})

  
module.exports = mongoose.model('User', userSchema);