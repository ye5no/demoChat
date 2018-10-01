import mongoose, { Schema } from 'mongoose';
import bcrypt from 'bcrypt';
import uuid from 'uuid/v4';
import uniqueValidator from 'mongoose-unique-validator';

mongoose.plugin(uniqueValidator);

const schema = new Schema({
  username: {
    type: String,
    unique: 'User with username "{VALUE}" already exist',
    lowercase: true,
    required: 'Username is required',
    trim: true,
  },
  hash: {
    type: String,
    unique: 'Hash mast be unique',
  },
  password: {
    type: String,
    required: 'Password is required',
    trim: true,
  },
}, {
  timestamps: true,
});

schema.statics.createFields = ['username', 'password'];
schema.statics.publicFields = ['username'];

schema.pre('save', function(next) {
  if (this.isModified('password')) {
    const salt = bcrypt.genSaltSync(10);
    this.password = bcrypt.hashSync(this.password, salt);
  }
  if (!this.hash) this.hash = uuid();
  next();
});

schema.methods.comparePasswords = function(password) {
    return bcrypt.compareSync(password, this.password);
};

export default mongoose.model('user', schema);
