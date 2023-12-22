import asyncHandler from 'express-async-handler';
import Appointment from '../models/appointmentModel.js';

// @desc    Crear una nueva cita
// @route   POST /api/appointments
// @access  Private
const createAppointment = asyncHandler(async (req, res) => {
  const { customerId, specialistId, availabilityId, startTime, endTime } = req.body;

  const appointment = await Appointment.create({
    customerId,
    specialistId,
    availabilityId,
    startTime,
    endTime,
  });

  if (appointment) {
    res.status(201).json(appointment);
  } else {
    res.status(400);
    throw new Error('Invalid appointment data');
  }
});

// @desc    Obtener todas las citas de un especialista
// @route   GET /api/appointments/specialist/:id
// @access  Private
const getAppointmentsBySpecialist = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const appointments = await Appointment.find({ specialistId: id }).populate("specialistId").populate("customerId").populate("availabilityId") 


  if (appointments) {
    res.json(appointments);
  } else {
    res.status(404);
    throw new Error('No appointments found for the specialist');
  }
});

// @desc    Obtener todas las citas de un cliente
// @route   GET /api/appointments/customer/:id
// @access  Private
const getAppointmentsByCustomer = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const appointments = await Appointment.find({ customerId: id }).populate("availabilityId").populate("specialistId").populate({ path: "specialistId", populate: ["specialtyId", "cityId"] });


  if (appointments) {
    res.json(appointments);
  } else {
    res.status(404);
    throw new Error('No appointments found for the customer');
  }
});

// @desc    Obtener detalles de la cita
// @route   GET /api/appointments/:id
// @access  Private
const getAppointmentDetails = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const appointment = await Appointment.findById(id);

  if (appointment) {
    res.json(appointment);
  } else {
    res.status(404);
    throw new Error('Appointment not found');
  }
});

// @desc    Actualizar el estado de una cita
// @route   PUT /api/appointments/:id/status
// @access  Private
const updateAppointmentStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const appointment = await Appointment.findById(id);

  if (appointment) {
    appointment.status = status;
    const updatedAppointment = await appointment.save();
    res.json(updatedAppointment);
  } else {
    res.status(404);
    throw new Error('Appointment not found');
  }
});

// @desc    Eliminar una cita
// @route   DELETE /api/appointments/:id
// @access  Private
const deleteAppointment = asyncHandler(async (req, res) => {
  const { id } = req.params;
  console.log("entre!", id)
  const appointment = await Appointment.findById(id);

  if (appointment) {
    await appointment.deleteOne();
    res.json({ message: 'Appointment removed' });
  } else {
    res.status(404);
    throw new Error('Appointment not found');
  }
});

export {
  createAppointment,
  getAppointmentsBySpecialist,
  getAppointmentsByCustomer,
  getAppointmentDetails,
  updateAppointmentStatus,
  deleteAppointment,
};
