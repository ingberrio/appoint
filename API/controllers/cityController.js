import asyncHandler from "express-async-handler";
import City from "../models/cityModel.js";

const getAllCity = asyncHandler(async (req, res) => {
  const results = await City.find();
  return res.json(results);
});

const registerCity = asyncHandler(async (req, res) => {
  const { name } = req.body;

  const city = await City.create({
    name,
  });
  if (city) {
    res.status(201).json({
      _id: city._id,
      name: city.name,
    });
  } else {
    res.status(400);
    throw new Error("Invalid city data");
  }
});

const getOneCity = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const city = await City.findById(id);
  if (city) {
    res.json({
      _id: city._id,
      name: city.name,
    });
  } else {
    res.status(404);
    throw new Error("City not found");
  }
});

const updateCity = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const city = await City.findById(id);
  if (city) {
    city.name = req.body.name || city.name;
    city.specialistId = req.body.specialistId || city.specialistId;

    const updatedCity = await city.save();
    res.json({
      _id: updatedCity._id,
      name: updatedCity.name,
      specialistId: updatedCity.specialistId
    });
  } else {
    res.status(404);
    throw new Error("Specialist not found");
  }
});

const removeCity = asyncHandler(async (req, res) => {
  const { id } = req.params;
  await City.destroy({ where: { id } });
  return res.sendStatus(204);
});

export { 
    getAllCity, 
    registerCity, 
    getOneCity,
    updateCity, 
    removeCity
};
