import cloudinary from '../config/cloudinary.js';
//-------------------models-------------------//
import bookModel from '../models/bookModel.js';

export async function getAllBooks(req, res) {
  try {
    const books = await bookModel.find().lean();
    console.log(books);
    res.status(200).json({ books });
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
}

export async function addBook(req, res) {
  try {
    const {
      title,
      author,
      description,
      coverImage,
      quantityAvailable,
      borrowLimit,
      isbn,
    } = req.body;
    if (
      !title ||
      !author ||
      !description ||
      !coverImage ||
      !quantityAvailable ||
      !borrowLimit ||
      !isbn
    ) {
      return res.status(422).json({ message: 'Provide necessary information' });
    }
    const lowercaseTitle = title.toLowerCase();
    const findBook = await bookModel.findOne({
      $or: [{ title: lowercaseTitle }, { isbn }],
    });

    if (findBook) {
      return res.status(403).json({ message: 'Book already exists' });
    } else {
      const coverPhoto = await cloudinary.uploader.upload(coverImage, {
        folder: 'libraryManager',
      });
      const book = new bookModel({
        title: lowercaseTitle,
        author,
        description,
        coverImage: coverPhoto.secure_url,
        quantityAvailable,
        borrowLimit,
        isbn,
      });
      await book.save();
      const result = await bookModel.findOne(
        { isbn: isbn },
        {
          __v: 0,
        }
      );
      return res.status(200).json({ book: result });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Internal server error' });
  }
}
