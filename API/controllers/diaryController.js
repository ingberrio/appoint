import asyncHandler from "express-async-handler";
import Diary from "../models/diaryModel.js";
import Specialist from "../models/specialistModel.js";

const getAllDiary = asyncHandler(async (req, res) => {
  const results = await Diary.find();
  return res.json(results);
});

const createDiary = asyncHandler(async (req, res) => {
  const { day, specialistId } = req.body;
  const diaryExists = await Diary.findOne({ day });

  if (diaryExists) {
    res.status(409);
    throw new Error("diary already exists");
  }
  const result = await Diary.create(req.body);
  if (result) {
    await Specialist.findByIdAndUpdate(
      specialistId,
      { $push: { diaryId: result._id } },
      { new: true }
    );
  }
  return res.status(201).json(result);
});

const removeDiary = asyncHandler(async (req, res) => {
  const { id } = req.params;
  await Diary.destroy({ where: { id } });
  return res.sendStatus(204);
});

const updateDiary = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const result = await Diary.update(req.body, {
    where: { id },
    returning: true,
  });
  if (req.body.specialistId) {
    await Specialist.findByIdAndUpdate(
      result.specialistId,
      { $pull: { diaryId: result._id } }
    );

    await Specialist.findByIdAndUpdate(
      req.body.specialistId,
      { $push: { diaryId: result._id } },
      { new: true }
    );

    result.specialistId = req.body.specialistId;
    await result.save();
  }
  if (result[0] === 0) return res.sendStatus(404);
  return res.json(result[1][0]);
});

export { 
    getAllDiary, 
    createDiary, 
    removeDiary, 
    updateDiary 
};
