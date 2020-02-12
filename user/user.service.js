const User = require('./user.model');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.create = async (number, name, photo) => {
  try {
    return await User.create({
      _id:  mongoose.Types.ObjectId(),
      number: number,
      name: name,
      photo: photo
    });
  } catch (error) {
    console.log('error => ', error)
  }
}
exports.signIn = async (number) => {
  const user = await User.find({ number }).exec();
  if (user.length < 1) {
    return {
      message: 'Mail not found'
    };
  }
  const token = jwt.sign(
    {
      email: user[0].number,
      userId: user[0]._id
    },
    'test',
    {
      expiresIn: "12h"
    }
  );
  return {
    message: 'Auth successful',
    token: token,
  };
}

exports.getAll = async () => {
  return await User.find().exec();
}

exports.getNumbers = async () => {
  const users = await User.find().exec();
  const numbers = users.map(user => user.number);
  console.log('getNumbers => ', numbers)
  return numbers;
}

exports.getById= async (id) => {
  const user = await User.findOne({_id: id}).exec();
  return user;
}

exports.getPerson = async (number) => {
  const user = await User.findOne({number: {$ne: number}}).exec();
  return user;
}
exports.deleteAll = async () => {
  await User.deleteMany({})
}