import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const customerSchema = mongoose.Schema(
    {
      firstName: {
        type: String,
        required: true
      },
      lastName: {
        type: String,
        required: false
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
        match: [/\S+@\S+\.\S+/, 'Please use a valid email address'],
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
        maxlength: 2
      },
      role: {
        type: String,
        enum: ['customer', 'admin'],
        default: 'customer'
      },
      active: {
        type: Boolean,
        default: true,
      },
      cityId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'City',
      }
    },
    {
      timestamps: true,
    }
);

// Match user entered password to hashed password in database
customerSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Encrypt password using bcrypt
customerSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

customerSchema.methods.toJSON = function () {
  const customerObject = this.toObject();
  delete customerObject.password; 
  return customerObject;
};

const Customer = mongoose.model('Customer', customerSchema);

export default Customer;