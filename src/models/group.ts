import mongoose from 'mongoose';

const groupSchema = new mongoose.Schema({
  name: String,
  major: String,
  course: Number,
  studyForm: String,
  educationLevel: String,
  users: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
});

export default mongoose.model('Group', groupSchema);
