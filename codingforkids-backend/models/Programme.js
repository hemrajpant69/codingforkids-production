import mongoose from 'mongoose';

const programmeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: String,
  enrolled_students: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student'
  }]
}, { timestamps: true });

const Programme = mongoose.model('Programme', programmeSchema);
export default Programme;
