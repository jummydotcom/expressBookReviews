const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

//console.log(typeof books);
public_users.post("/register", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;

  if (username && password)
  {
    if (!isValid(username, users)){
        //users.push({"username":username, "password":password});
        return res.status(200).json({message: "user registered. Now login"})
    } else {
        return res.status(404).json({message:"User already exist"})
    }
  }
  return res.status(404).json({message:"Unable to register user."})
  //return res.status(300).json({message: "Yet to be implemented"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  return  res.send(JSON.stringify(books,null,3));
  //return res.status(300).json({message: "Yet to be implemented"});
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  const isbn =req.params.isbn;
  return res.send(books[isbn])
  //return res.status(300).json({message: "Yet to be implemented"});
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    //Write your code here
    const author = req.params.author;
    let matchingBooks =[];
    const booksKeys = Object.keys(books);

    for(const Key of booksKeys){
        if ( books[Key].author === author){
            matchingBooks.push(books[Key])
        }
    }
    return res.send(matchingBooks)
    //return res.status(300).json({message: "Yet to be implemented"});
  });

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  const title = req.params.title;
  let matchingBooks =[];
  const booksKeys =Object.keys(books);

  for(const Key of booksKeys){
    if (books[Key].title === title){
        matchingBooks.push(books[Key])
    }
  }
  return res.send(matchingBooks);

  //return res.status(300).json({message: "Yet to be implemented"});
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  let matchingBooks =[];
  const booksKeys = Object.keys(books);

  for(const Key of booksKeys){
    if(books[Key].isbn === isbn){
        matchingBooks.push(books[Key].review)
    }
  }
  return res.send(matchingBooks);
  //return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.general = public_users;
