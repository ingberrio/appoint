import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';
import User from '../models/userModel.js';
import Specialist from '../models/specialistModel.js';
import Customer from '../models/customerModel.js';

const protect = asyncHandler(async (req, res, next) => {
  const token = req.cookies.jwt;

  if (!token) {
    res.status(401);
    throw new Error('Not authorized, no token');
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = await User.findById(decoded.userId).select('-password');
    req.customer = await Customer.findById(decoded.customerId).select('-password');
    req.specialist = await Specialist.findById(decoded.specialistId).select('-password');


    next();
  } catch (error) {
    console.error(error);
    res.status(401);
    throw new Error('Not authorized, token failed');
  }
});

export { protect };