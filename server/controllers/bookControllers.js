//-------------------models-------------------//
import bookModel from '../models/bookModel.js';

export async function getAllBooks(req, res) {
  try {
    const books = await bookModel.find().lean();
    res.status(200).json({ books });
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
}

export async function addBook(req, res) {
  try {
    // const books = await bookModel.find().lean();
    // res.status(200).json({ books });
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
}
