import mongoose from 'mongoose';
import cloudinary from '../config/cloudinary.js';
//-------------------models-------------------//
import bookModel from '../models/bookModel.js';
import transactionModel from '../models/transactionModel.js';
import userModel from '../models/userModel.js';

export async function getAllBooks(req, res) {
  try {
    let page = Number(req.query.page ?? 0);
    page = Math.max(page, 0);
    let search = req.query.searchText ?? '';
    search = search.trim();
    console.log(search);
    const totalBooks = await bookModel.countDocuments({
      $or: [
        { title: new RegExp(search, 'i') },
        { author: new RegExp(search, 'i') },
        { isbn: new RegExp(search, 'i') },
      ],
    });
    const perPage = 8;
    const lastPage = Math.max(Math.ceil(totalBooks / perPage) - 1, 0);
    page = Math.min(page, lastPage);
    const books = await bookModel
      .find({
        $or: [
          { title: new RegExp(search, 'i') },
          { author: new RegExp(search, 'i') },
          { isbn: new RegExp(search, 'i') },
        ],
      })
      .skip(page * perPage)
      .limit(perPage)
      .lean();
    res.status(200).json({ books, page, lastPage });
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
    const upperCaseTitle = title.toUpperCase();
    const findBook = await bookModel.findOne({
      $or: [{ title: upperCaseTitle }, { isbn }],
    });

    if (findBook) {
      return res.status(403).json({ message: 'Book already exists' });
    } else {
      const coverPhoto = await cloudinary.uploader.upload(coverImage, {
        folder: 'libraryManager',
      });
      const book = new bookModel({
        title: upperCaseTitle,
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
      title: title.toUpperCase(),
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

export async function borrowBook(req, res) {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    const userId = req.user._id.toString();
    const bookId = req.params.bookId;
    const { borrowQuantity } = req.body;
    const book = await bookModel.findById(bookId);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }
    if (book.quantityAvailable <= 2) {
      return res
        .status(400)
        .json({ message: 'Book is not currently available for borrowing' });
    }
    const userBorrowCount = await transactionModel.countDocuments({
      _id: userId,
      status: 'borrowed',
    });
    if (userBorrowCount >= 3) {
      return res
        .status(400)
        .json({ message: 'User has reached borrowing limit' });
    }
    const existingTransaction = await transactionModel.findOne({
      userId,
      bookId,
      status: 'borrowed',
    });

    if (existingTransaction) {
      return res
        .status(400)
        .json({ message: 'User has already borrowed this book' });
    }
    if (borrowQuantity > book.borrowLimit) {
      return res.status(400).json({
        message: `borrowing limit for this book is ${book.borrowLimit}`,
      });
    }
    const borrowDate = new Date();
    const newTransaction = new transactionModel({
      userId,
      bookId,
      borrowDate,
      borrowQuantity,
      status: 'borrowed',
    });
    await newTransaction.save();

    book.quantityAvailable -= borrowQuantity;
    await book.save();
    await session.commitTransaction();
    return res.status(200).json({
      message: 'Book borrowed successfully',
      transaction: newTransaction,
    });
  } catch (error) {
    await session.abortTransaction();
    console.log(error);
    return res.status(500).json({ message: 'Internal Server Error' });
  } finally {
    session.endSession();
  }
}

export async function returnBook(req, res) {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    const userId = req.user._id.toString();
    const transactionId = req.params.transactionId;

    const transaction = await transactionModel.findOne({
      _id: transactionId,
      userId: userId,
      status: 'borrowed',
    });

    if (!transaction) {
      return res
        .status(404)
        .json({ message: 'Transaction not found or book already returned' });
    }

    transaction.status = 'returned';
    transaction.returnDate = new Date();
    await transaction.save();

    const book = await bookModel.findById(transaction.bookId);
    book.quantityAvailable += transaction.borrowQuantity;
    await book.save();

    await session.commitTransaction();
    return res.status(200).json({
      message: 'Book returned successfully',
      returnedTransaction: transaction,
    });
  } catch (error) {
    await session.abortTransaction();
    console.log(error);
    return res.status(500).json({ message: 'Internal Server Error' });
  } finally {
    session.endSession();
  }
}
