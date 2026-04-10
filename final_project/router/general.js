const express = require('express');
const books = require("./booksdb.js");
const isValid = require("./auth_users.js").isValid;
const users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  const { username, password } = req.query;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  if (isValid(username)) {
    return res.status(409).json({ message: "Username already exists" });
  }

  users.push({ username, password });
  return res.status(201).json({ message: "User registered successfully" });

});

// Get the book list available in the shop
public_users.get('/', (_req, res) => {
  const bookList = new Promise((resolve, _reject) => {
    resolve(books);
  });

  bookList.then((bookData) => {
    res.send(JSON.stringify(bookData, null, 4));
  }).catch((error) => {
    res.status(500).json({ message: "Error retrieving book list", error });
  });
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',(req, res) => { 
  const isbn = req.params.isbn;
  const bookDetails = new Promise((resolve, reject) => {
    if (books[isbn]) {
      resolve(books[isbn]);
    } else {
      reject({ message: "Book not found" });
    }
  });

  bookDetails.then((bookData) => {
    res.send(JSON.stringify(bookData, null, 4));
  }).catch((error) => {
    res.status(404).json(error);
  });  
});
  
// Get book details based on author
public_users.get('/author/:author',(req, res) => {
  const author = req.params.author;
  const filteredBooks = Object.values(books).filter(book => book.author === author);

  const bookDetails = new Promise((resolve, reject) => {
    if (filteredBooks.length > 0) {
      resolve(filteredBooks);
    } else {
      reject({ message: "No books found for the specified author" });
    }
  });

  bookDetails.then((bookData) => {
    res.send(JSON.stringify(bookData, null, 4));
  }).catch((error) => {
    res.status(404).json(error);
  });  
});

// Get all books based on title
public_users.get('/title/:title',(req, res) => {
  const title = req.params.title;
  const filteredBooks = Object.values(books).filter(book => book.title === title);
  
  const bookDetails = new Promise((resolve, reject) => {
    if (filteredBooks.length > 0) {
      resolve(filteredBooks);
    } else {
      reject({ message: "No books found for the specified title" });
    }
  });

  bookDetails.then((bookData) => {
    res.send(JSON.stringify(bookData, null, 4));
  }).catch((error) => {
    res.status(404).json(error);
  });
});

//  Get book review
public_users.get('/review/:isbn', (req, res) => {
  const isbn = req.params.isbn;
  res.send(JSON.stringify(books[isbn].reviews, null, 4));
});

module.exports.general = public_users;
