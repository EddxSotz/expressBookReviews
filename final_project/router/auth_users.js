const express = require('express');
const jwt = require('jsonwebtoken');
const books = require("./booksdb.js");
const regd_users = express.Router();

const users = [];

const isValid = (username)=>{ //returns boolean

  const userswithsamename = users.filter((user) => {
          return user.username === username;
      });

  if(userswithsamename.length > 0){
      return true;
  }else {
  return false;
  }
}

const authenticatedUser = (username,password)=>{ //returns boolean
  const validusers = users.filter((user) => {
        return (user.username === username && user.password === password);
    });

  if(validusers.length > 0){
      return true;
  }else {
      return false;
  }

}

//only registered users can login
regd_users.post("/login", (req,res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  if (authenticatedUser(username, password)) {
    const accessToken = jwt.sign({ username }, "access", { expiresIn: "1h" });
    req.session.authorization = { accessToken };
    return res.status(200).json({ message: "User successfully logged in" });
  } else {
    return res.status(401).json({ message: "Invalid login. Check username and password" });
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const { review } = req.body;
  const username = req.user.username;

  if (!review) {
    return res.status(400).json({ message: "Review content is required" });
  }

  if (books[isbn]) {
    books[isbn].reviews[username] = review;
    return res.status(200).json({ message: "Review added/updated successfully" });
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const username = req.user.username;

  if (books[isbn]) {
    delete books[isbn].reviews[username];
    return res.status(200).json({ message: "Review deleted successfully" });
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
