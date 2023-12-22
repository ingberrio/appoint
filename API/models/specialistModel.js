import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const specialistSchema = mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
    },
    description: {
      type: String,
    },
    phone: {
      type: String,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: [/\S+@\S+\.\S+/, "Please use a valid email address"],
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    birthday: {
      type: Date,
      //required: true,
    },
    age: {
      type: Number,
      maxlength: 2,
    },
    role: {
      type: String,
      enum: ["specialist", "admin"],
      default: "specialist",
    },
    active: {
      type: Boolean,
      default: true,
    },
    cityId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "City",
    },
    specialtyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Specialty",
    },
    diaryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Diary",
    },
    abailabilityId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Availability",
    },
  },
  {
    timestamps: true,
  }
);

// Match user entered password to hashed password in database
specialistSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Encrypt password using bcrypt
specialistSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

specialistSchema.methods.toJSON = function () {
  const specialistObject = this.toObject();
  delete specialistObject.password;
  return specialistObject;
};

const Specialist = mongoose.model("Specialist", specialistSchema);

export default Specialist;
