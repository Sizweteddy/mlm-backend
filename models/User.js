const mongoose = require('mongoose'),
  { Schema } = mongoose,
  bcrypt = require('bcryptjs'),
  jwt = require('jsonwebtoken');

const MongooseSchema = new Schema({
  name: {
    type: String,
    required: [true, 'Please enter a name!'],
  },
  email: {
    type: String,
    unique: true,
    required: [true, 'Please enter an email address!'],
    match: [
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      'Please enter a valid email address',
    ],
  },
  password: {
    type: String,
    required: [true, 'Please enter a password'],
    select: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Encrypting password
MongooseSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Creating jwt
MongooseSchema.methods.getSignedJwtToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

//Comparing passwords
MongooseSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', MongooseSchema);
