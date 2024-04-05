const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [
    {
        "username":"jummydboyy",
        "password":"manlike2019"
    }
];

const isValid = (username, users)=>{ //returns boolean
//write code to check is the username is valid
return users.some(user => user.username === username);
}

const authenticatedUser = (username,password)=>{
     //returns boolean
     //write code to check if username and password match the one we have in records.
     return users.some(user => user.username === username && user.password === password)

}

//only registered users can login
regd_users.post("/login", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;

    if (!username || !password){
        return res.status(404).json({message:"Username and Password required"})
    }
    if (authenticatedUser(username, password)){
        let accessToken = jwt.sign({
            data: username
        }, 'access', {expiresIn: 60 * 60});

        req.session.authorization = {
            accessToken,
            username
        }
       
    }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const isbn =req.params.isbn;
    const review = req.query.review;
    const username = req.session.authorization.username;

    if(!isbn || !review || !username){
        return res.status(404).json({message:"isbn, review, and username are required"})
    }

    if (isValid(username, users)){
        if  (books[isbn].reviews[username]){
            books[isbn].reviews[username] = review;
        }
        else {
            books[isbn].reviews[username] = review;
        }
        return res.status(200).json({message:"Review added or modified successfully"})
    } 
    else {
        return res.status(401).json({message:"Invalid Username or password"})
    }

  //Write your code here
  //return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
