import { Schema, model } from 'mongoose';

const tempUserSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
    otpData: {
      type: {
        otpValue: {
          type: String,
        },
        expirationTime: {
          type: Number,
        },
      },
    },
  },
  { timestamps: true }
);

export default model('Tempuser', tempUserSchema);
