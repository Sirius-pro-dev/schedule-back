import mongoose from 'mongoose';

const scheduleSchema = new mongoose.Schema({
    date: Date,
    time: String,
    disciplineName: String,
    classType: String,
    users: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    group: { type: mongoose.Schema.Types.ObjectId, ref: 'Group' },
    locationAddress: String,
    classRoom: String
});

export default mongoose.model('Schedule', scheduleSchema);