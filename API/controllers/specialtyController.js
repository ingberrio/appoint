import Specialty from "../models/specialtyModel.js";
import asyncHandler from "express-async-handler";
import Specialist from "../models/specialistModel.js";


// @desc    Create a new specialty
// @route   PUT /api/specialty
// @access  Private
const createSpecialty = asyncHandler(async (req, res) => {
    try {
        const { name } = req.body;
        // Convert to lowercase
        const lowerCaseName = name.toLowerCase();
        // Search in lower case if the specialty exists
        const existingSpecialty = await Specialty.findOne({ name: lowerCaseName });

        if (existingSpecialty) {
            res.status(400);
            throw new Error('The specialty already exists');
        }
        // Convert to lowercase before saving specialty
        const newSpecialty = new Specialty({ name: lowerCaseName });
        await newSpecialty.save();

        res.status(201).json({
            message: 'Successfully created specialty',
            _id: newSpecialty._id,
            specialty: newSpecialty.name
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


// Get all specialties
const getAllSpecialties = asyncHandler(async (req, res) => {
    try {
        const specialties = await Specialty.find();
        res.status(200).json({ specialties });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


// Get a specialty by ID
const getSpecialtyById = asyncHandler(async (req, res) => {
    try {
        const { id } = req.params;

        const specialty = await Specialty.findById(id);

        if (!specialty) {
            res.status(404);
            throw new Error('Specialty not found');
        }
        res.json({
            _id: specialty._id,
            name: specialty.name,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


// @desc    Update a specialty by ID
// @route   PUT /api/specialty/id
// @access  Private
const updateSpecialty = asyncHandler(async (req, res) => {
    try {
        const { id } = req.params;
        const { name } = req.body;

        const specialty = await Specialty.findById(id);

        if (!specialty) {
            res.status(404);
            throw new Error('Specialty not found');
        }
        // Check if the name is being updated
        if (name && name.toLowerCase() !== specialty.name.toLowerCase()) {
            const existingSpecialty = await Specialty.findOne({ name: name.toLowerCase() });

            if (existingSpecialty) {
                res.status(400);
                throw new Error('The specialty already exists');
            }
        }
        // Update the name if a new one is provided
        specialty.name = name ? name.toLowerCase() : specialty.name.toLowerCase();

        const updatedSpecialty = await specialty.save();

        res.json({
            message: 'Specialty updated',
            _id: updateSpecialty._id,
            specialty: updatedSpecialty.name
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


// @desc    Delete a specialty by ID
// @route   PUT /api/specialty/id
// @access  Private
const deleteSpecialty = asyncHandler(async (req, res) => {
    try {
        const { id } = req.params;
        const specialty = await Specialty.findByIdAndDelete(id);
        if (!specialty) {
            return res.status(404).json('Specialty not found');
        }
        res.status(200).json('Specialty successfully removed');
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


// Get Specialists by specialty
const getSpecialistsBySpecialty = asyncHandler(async (req, res) => {
    const { specialtyId  } = req.params;

    try {
        
        const specialists = await Specialist.find({ specialtyId, active: true }).populate('cityId specialtyId');
        if (!specialists) {
            res.status(404).json({ message: 'Specialty not found' });
            return;
        }

        res.status(200).json({ specialists });

    } catch (error) {
        res.status(500).json({ message: 'Error when searching for specialists by specialty id', error: error.message });
    }
});

export { 
    createSpecialty, 
    getAllSpecialties, 
    getSpecialtyById, 
    updateSpecialty, 
    deleteSpecialty,
    getSpecialistsBySpecialty
 };