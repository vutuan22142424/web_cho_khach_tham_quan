import mongoose from 'mongoose';

const statusEventSchema = new mongoose.Schema({
  status:    { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  eventId:   { type: String },  // ← thêm dòng này
});

const commandHistorySchema = new mongoose.Schema({
  command_id:   { type: String, unique: true, index: true, required: true },
  events:       [statusEventSchema],
  latestStatus: { type: String },
  createdAt:    { type: Date, default: Date.now },
  updatedAt:    { type: Date, default: Date.now },
});

export default mongoose.models.CommandHistory ||
  mongoose.model('CommandHistory', commandHistorySchema, 'state');