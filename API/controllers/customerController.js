import asyncHandler from "express-async-handler";
import Customer from "../models/customerModel.js";
import generateToken from "../utils/generateToken.js";
import City from "../models/cityModel.js";

// @desc    List customers
// @route   POST /api/customers
// @access  Public
const getAllCustomer = asyncHandler(async (req, res) => {
  const results = await Customer.find();
  return res.json(results);
});

// @desc    Auth customer & get token
// @route   POST /api/customers/auth
// @access  Public
const authCustomer = asyncHandler(async (req, res) => {
  // Get values - destructure
  const { email, password } = req.body;

  const customer = await Customer.findOne({ email });
  
  if(customer.active === true){
    if (customer && (await customer.matchPassword(password))) {
      generateToken(res, null, null, customer._id);

      res.json({
        _id: customer._id,
        firstName: customer.firstName,
        lastName: customer.lastName,
        description: customer.description,
        phone: customer.phone,
        email: customer.email,
        birthday: customer.birthday,
        age: customer.age,
        role: customer.role,
        active: customer.active,
      });
    } else {
      res.status(401);
      throw new Error("Invalid email or password");
    }
  } else {
    throw new Error("the customer does not exist");
  }
});

// @desc    Register a new specialsit
// @route   POST /api/cutomers
// @access  Public
const registerCustomer = asyncHandler(async (req, res) => {
  const { firstName, lastName, description, phone, email, password, birthday, age, role, active, cityId } = req.body;

  const customerExists = await Customer.findOne({ email });

  if (customerExists) {
    res.status(400);
    throw new Error("Customer email already exists");
  }

  const customer = await Customer.create({
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
    cityId
  });

  if (customer) {
    generateToken(res, null, null, customer._id);

    await City.findByIdAndUpdate(
      cityId,
      { $push: { customer: Customer._id } },
      { new: true }
    );

    res.status(201).json({
      _id: customer._id,
      firstName: customer.firstName,
      lastName: customer.lastName,
      description: customer.description,
      phone: customer.phone,
      email: customer.email,
      birthday: customer.birthday,
      age: customer.age,
      role: customer.role,
      active: customer.active,
      cityId: customer.cityId
    });
  } else {
    res.status(400);
    throw new Error("Invalid customer data");
  }
});

// @desc    Logout specialsit / clear cookie
// @route   POST /api/specialsits/logout
// @access  Public
const logoutCustomer = (req, res) => {
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
const getCustomerProfile = asyncHandler(async (req, res) => {
  const customer = await Customer.findById(req.customer._id).populate('cityId');
  if (customer) {
    res.json({
      _id: customer._id,
      firstName: customer.firstName,
      lastName: customer.lastName,
      description: customer.description,
      phone: customer.phone,
      email: customer.email,
      birthday: customer.birthday,
      age: customer.age,
      role: customer.role,
      active: customer.active,
      cityId: customer.cityId
    });
  } else {
    res.status(404);
    throw new Error("Customer not found");
  }
});

// @desc    Update specialist profile
// @route   PUT /api/specialists/profile
// @access  Private
const updateCustomerProfile = asyncHandler(async (req, res) => {
  const customer = await Customer.findById(req.customer._id);

  if (customer) {
    customer.firstName = req.body.firstName || customer.firstName;
    customer.lastName = req.body.lastName || customer.lastName;
    customer.email = req.body.email || customer.email;
    customer.description = req.body.description || customer.description;
    customer.phone = req.body.phone || customer.phone;
    customer.birthday = req.body.birthday || customer.birthday;
    customer.age = req.body.age || customer.age;

    if (req.body.password) {
      customer.password = req.body.password;
    }

    const updatedCustomer = await customer.save();

    if (req.body.cityId) {
      await City.findByIdAndUpdate(
        customer.cityId,
        { $pull: { customer: customer._id } }
      );

      await City.findByIdAndUpdate(
        req.body.cityId,
        { $push: { customers: updatedCustomer._id } },
        { new: true }
      );

      updatedCustomer.cityId = req.body.cityId;
      await updatedCustomer.save();
    }
    

    res.json({
      _id: updatedCustomer._id,
      firstName: updatedCustomer.firstName,
      lastName: updatedCustomer.lastName,
      description: updatedCustomer.description,
      phone: updatedCustomer.phone,
      email: updatedCustomer.email,
      birthday: updatedCustomer.birthday,
      age: updatedCustomer.age,
      role: updatedCustomer.role,
      active: updatedCustomer.active,
      cityId: updatedCustomer.cityId
    });
  } else {
    res.status(404);
    throw new Error("Customer not found");
  }
});

const removeCustomer = asyncHandler(async( req, res) => {
  const customer = await Customer.findById(req.customer._id);
  if(customer){
    customer.active = false
    await customer.save();

    logoutCustomer(req, res);
    res.status(201);
  } else {
    res.status(404);
    throw new Error("account could not be removed");
  }
});

export {
  getAllCustomer,
  authCustomer,
  registerCustomer,
  logoutCustomer,
  getCustomerProfile,
  updateCustomerProfile,
  removeCustomer
};
