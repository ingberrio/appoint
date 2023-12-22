import mongoose from "mongoose";

const specialtySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    specialistId: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Specialist',
        },
      ],
    },
    {
        timestamps: true,
    }
);

const Specialty = mongoose.model('Specialty', specialtySchema);

export default Specialty;