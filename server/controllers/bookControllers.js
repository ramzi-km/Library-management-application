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
export async function editBook(req, res) {
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
    const bookId = req.params.bookId;
    const findBook = await bookModel.findById(bookId);

    if (!findBook) {
      return res.status(404).json({ message: "Book doesn't exist" });
    }
    if (
      !title ||
      !author ||
      !description ||
      !coverImage ||
      !quantityAvailable ||
      !borrowLimit ||
      !isbn
    ) {
      return res.status(422).json({ message: 'All fields are required' });
    }

    const updatedBookData = {
      title: title.toLowerCase(),
      author,
      description,
      quantityAvailable,
      borrowLimit,
      isbn,
      coverImage:
        findBook.coverImage === coverImage
          ? coverImage
          : (
              await cloudinary.uploader.upload(coverImage, {
                folder: 'libraryManager',
              })
            ).secure_url,
    };

    const updatedBook = await bookModel.findByIdAndUpdate(
      bookId,
      updatedBookData,
      { new: true, runValidators: true }
    );

    return res.status(200).json({ book: updatedBook });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Internal server error' });
  }
}
