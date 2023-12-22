
import mongoose from 'mongoose';

const diarySchema =  mongoose.Schema({
  day: {
    type: String,
    required: true
  },
  startTime: {
    type: String,
  },
  endTime: {
    type: String,
  },
  specialistId: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Specialist',
    },
  ],
  
});

const Diary = mongoose.model('Diary', diarySchema);

export default Diary;