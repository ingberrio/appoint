import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = mongoose.Schema(
    {
      userName: {
        type: String,
        required: true,
        trim: true,
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
      role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
      }
    },
    {
      timestamps: true,
    }
);

// Match user entered password to hashed password in database
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Encrypt password using bcrypt
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.toJSON = function () {
  const userObject = this.toObject();
  delete userObject.password; 
  return userObject;
};

const User = mongoose.model('User', userSchema);

export default User;