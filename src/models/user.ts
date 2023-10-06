import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  userName: String,
  password: String,
  name: String,
  lastName: String,
  surName: String,
  role: String,
  groups: { type: mongoose.Schema.Types.ObjectId, ref: 'Group' }
});

export default mongoose.model('User', userSchema);
