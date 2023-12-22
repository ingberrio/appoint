import asyncHandler from 'express-async-handler';
import Availability from '../models/abailabilityModel.js';

// @desc    Crear una nueva disponibilidad
// @route   POST /api/availability
// @access  Private
const createAvailability = asyncHandler(async (req, res) => {
  const { specialistId, dayOfWeek, specificHours } = req.body;

  const availability = await Availability.create({
    specialistId,
    dayOfWeek,
    specificHours,
  });

  if (availability) {
    res.status(201).json(availability);
  } else {
    res.status(400);
    throw new Error('Invalid availability data');
  }
});

// @desc    Obtener todas las disponibilidades de un especialista
// @route   GET /api/availability/specialist/:id
// @access  Private
const getAvailabilitiesBySpecialist = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const availabilities = await Availability.find({ specialistId: id }).populate('specialistId');

  if (availabilities) {
    res.json(availabilities);
  } else {
    res.status(404);
    throw new Error('No availabilities found for the specialist');
  }
});

// @desc    Eliminar una disponibilidad
// @route   DELETE /api/availability/:id
// @access  Private
const deleteAvailability = asyncHandler(async (req, res) => {
  const availabilityId = req.params.id; 

  // Verifica si la disponibilidad existe antes de intentar eliminar
  const existingAvailability = await Availability.findById(availabilityId);

  if (existingAvailability) {
    // Elimina la disponibilidad
    await Availability.findByIdAndDelete(availabilityId);

    res.status(200).json({ message: 'Availability deleted successfully' });
  } else {
    res.status(404);
    throw new Error('Availability not found');
  }
});


// @desc Actualiza la disponibilidad del especialista
// @route PUT /api/availability/:id
// @access Private
const updateAvailability = asyncHandler(async (req, res) => {
  const { specialistId, dayOfWeek, specificHours } = req.body;
  const availabilityId = req.params.id; // Suponiendo que el ID de la disponibilidad se pasa como un parámetro en la URL

  // Verifica si la disponibilidad existe antes de intentar actualizar
  const existingAvailability = await Availability.findById(availabilityId);

  if (existingAvailability) {
    // Actualiza los campos necesarios
    existingAvailability.specialistId = specialistId;
    existingAvailability.dayOfWeek = dayOfWeek;
    existingAvailability.specificHours = specificHours;

    // Guarda los cambios
    const updatedAvailability = await existingAvailability.save();

    res.status(200).json(updatedAvailability);
  } else {
    res.status(404);
    throw new Error('Availability not found');
  }
});

export { createAvailability, getAvailabilitiesBySpecialist, deleteAvailability, updateAvailability };
