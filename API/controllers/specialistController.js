import asyncHandler from "express-async-handler";
import Specialist from "../models/specialistModel.js";
import generateToken from "../utils/generateToken.js";
import City from "../models/cityModel.js";
import Specialty from "../models/specialtyModel.js";


const getAllSpecialist = asyncHandler(async (req, res) => {
  const results = await Specialist.find()
  return res.json(results)
});

const authSpecialist = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const specialist = await Specialist.findOne({ email });
  
  if(specialist.active === true){
    if (specialist && (await specialist.matchPassword(password))) {
      generateToken(res, null, specialist._id);

      res.json({
        _id: specialist._id,
        firstName: specialist.firstName,
        lastName: specialist.lastName,
        description: specialist.description,
        phone: specialist.phone,
        email: specialist.email,
        birthday: specialist.birthday,
        age: specialist.age,
        role: specialist.role,
        active: specialist.active,
      });
    } else {
      res.status(401);
      throw new Error("Invalid email or password");
    }
  } else {
    throw new Error("the specialist does not exist");
  }
});

const registerSpecialist = asyncHandler(async (req, res) => {
  const { firstName, lastName, description, phone, email, password, birthday, age, role, active, specialtyId, cityId } = req.body;

  const specialistExists = await Specialist.findOne({ email });

  if (specialistExists) {
    res.status(400);
    throw new Error("email already exists");
  }

  const specialist = await Specialist.create({
    firstName,
    lastName,
    description,
    phone,
    email,
    password,
    birthday,
    age,
    role,
    active,
    specialtyId,
    cityId
  });

  if (specialist) {
    generateToken(res, null,specialist._id);

    await City.findByIdAndUpdate(
      cityId,
      { $push: { specialistId: specialist._id } },
      { new: true }
    );
    await Specialty.findByIdAndUpdate(
      specialtyId,
      { $push: { specialistId: specialist._id } },
      { new: true }
    );

    res.status(201).json({
      _id: specialist._id,
      firstName: specialist.firstName,
      lastName: specialist.lastName,
      description: specialist.description,
      phone: specialist.phone,
      email: specialist.email,
      birthday: specialist.birthday,
      age: specialist.age,
      role: specialist.role,
      active: specialist.active,
      specialtyId: specialist.specialtyId,
      cityId: specialist.cityId
    });
  } else {
    res.status(400);
    throw new Error("Invalid specialist data");
  }
});

const logoutSpecialist = (req, res) => {
  try {
    res.cookie("jwt", "", {
      httpOnly: true,
      expires: new Date(0),
    });

    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to logout" });
  }
};

// @desc    Get specialist profile
// @route   GET /api/specialists/profile
// @access  Private
const getSpecialistProfile = asyncHandler(async (req, res) => {
  const specialist = await Specialist.findById(req.specialist._id).populate('specialtyId').populate('cityId').populate('diaryId');
  if (specialist) {
    res.json({
      _id: specialist._id,
      firstName: specialist.firstName,
      lastName: specialist.lastName,
      description: specialist.description,
      phone: specialist.phone,
      email: specialist.email,
      birthday: specialist.birthday,
      age: specialist.age,
      role: specialist.role,
      active: specialist.active,
      specialtyId: specialist.specialtyId,
      cityId: specialist.cityId
    });
  } else {
    res.status(404);
    throw new Error("Specialist not found");
  }
});

const getOneSpecialist = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const specialist = await Specialist.findById(id).populate('specialtyId').populate('cityId').populate('diaryId');
  if (specialist) {
    res.json({
      _id: specialist._id,
      firstName: specialist.firstName,
      lastName: specialist.lastName,
      description: specialist.description,
      phone: specialist.phone,
      email: specialist.email,
      birthday: specialist.birthday,
      age: specialist.age,
      role: specialist.role,
      active: specialist.active,
      specialtyId: specialist.specialtyId,
      cityId: specialist.cityId
    });
  } else {
    res.status(404);
    throw new Error("specialist not found");
  }
});

// @desc    Update specialist profile
// @route   PUT /api/specialists/profile
// @access  Private
const updateSpecialistProfile = asyncHandler(async (req, res) => {
  const specialist = await Specialist.findById(req.specialist._id);

  if (specialist) {
    specialist.firstName = req.body.firstName || specialist.firstName;
    specialist.lastName = req.body.lastName || specialist.lastName;
    specialist.email = req.body.email || specialist.email;
    specialist.description = req.body.description || specialist.description;
    specialist.phone = req.body.phone || specialist.phone;
    specialist.birthday = req.body.birthday || specialist.birthday;
    specialist.age = req.body.age || specialist.age;
    specialist.password = req.body.password || specialist.password;

    
    const updatedSpecialist = await specialist.save();

    if (req.body.cityId) {
      await City.findByIdAndUpdate(
        specialist.cityId,
        { $pull: { specialistId: specialist._id } }
      );

      await City.findByIdAndUpdate(
        req.body.cityId,
        { $push: { specialistId: updatedSpecialist._id } },
        { new: true }
      );

      updatedSpecialist.cityId = req.body.cityId;
      await updatedSpecialist.save();
    }
    if (req.body.specialtyId) {
      await Specialty.findByIdAndUpdate(
        specialist.specialtyId,
        { $pull: { specialistId: specialist._id } }
      );

      await Specialty.findByIdAndUpdate(
        req.body.specialtyId,
        { $push: { specialistId: updatedSpecialist._id } },
        { new: true }
      );

      updatedSpecialist.specialtyId = req.body.specialtyId;
      await updatedSpecialist.save();
    }

    res.json({
      _id: updatedSpecialist._id,
      firstName: updatedSpecialist.firstName,
      lastName: updatedSpecialist.lastName,
      description: updatedSpecialist.description,
      phone: updatedSpecialist.phone,
      email: updatedSpecialist.email,
      birthday: updatedSpecialist.birthday,
      age: updatedSpecialist.age,
      role: updatedSpecialist.role,
      active: updatedSpecialist.active,
      specialtyId: updatedSpecialist.specialtyId,
      cityId: updatedSpecialist.cityId
    });
  } else {
    res.status(404);
    throw new Error("Specialist not found");
  }
});

const removeSpecialist = asyncHandler(async( req, res) => {
  const specialist = await Specialist.findById(req.specialist._id);
  if(specialist){
    specialist.active = false
    await specialist.save();

    logoutSpecialist(req, res);
    res.status(201);
  } else {
    res.status(404);
    throw new Error("account could not be removed");
  }
});

export {
  getAllSpecialist,
  getOneSpecialist,
  authSpecialist,
  registerSpecialist,
  logoutSpecialist,
  getSpecialistProfile,
  updateSpecialistProfile,
  removeSpecialist
};
