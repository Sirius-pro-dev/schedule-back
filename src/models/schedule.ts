import mongoose from 'mongoose';

const scheduleSchema = new mongoose.Schema({
  date: Date,
  time: { type: String, unique: true },
  disciplineName: String,
  classType: String,
  teacher: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  group: { type: mongoose.Schema.Types.ObjectId, ref: 'Group' },
  locationAddress: String,
  classRoom: String
});

export default mongoose.model('Schedule', scheduleSchema);
