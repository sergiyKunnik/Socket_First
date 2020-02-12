const Message = require('./message.model');
const mongoose = require('mongoose');

exports.create = async (text, userId) => {
  const newMessage = await Message.create({
    _id:  mongoose.Types.ObjectId(),
    text: text,
    user: userId,
    date: new Date()
  });
  return await Message.findOne({_id: newMessage._id}).populate('user');
}

exports.getAll = async () => {
  return await Message.find().populate('user').exec();
}


exports.deleteAll = async () => {
  return await Message.deleteMany();
}
