import mongoose, { Schema } from 'mongoose';

const schema = new Schema({
  message: String,
  from: {
	  type: String,
	  required: 'Message sender require',
  },
  to: {
    type: String,
    required: 'Message spender require',
  },
}, {
  timestamps: true,
});

export default mongoose.model('message', schema);
