import mongoose from 'mongoose';

const appointmentSchema = mongoose.Schema(
  {
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Customer',
      required: true,
    },
    specialistId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Specialist',
      required: true,
    },
    availabilityId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Availability',
      required: true,
    },
    startTime: {
      type: String,
      required: true,
    },
    endTime: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'canceled'],
      default: 'pending',
    },
    comments: {
      type: String,
      required: false,
    },
    customerName: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

const Appointment = mongoose.model('Appointment', appointmentSchema);

export default Appointment;
