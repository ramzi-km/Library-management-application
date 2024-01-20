import { Schema, model } from 'mongoose';

const bookSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    author: {
      type: String,
      required: true,
    },
    coverImage: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    isbn: {
      type: String,
      required: true,
    },
    quantityAvailable: {
      type: Number,
      required: true,
    },
    borrowLimit: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

export default model('Book', bookSchema);
