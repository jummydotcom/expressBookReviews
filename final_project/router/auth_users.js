const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [
    {
        "username": "jummydboyy",
        "password": "manlike2019"
    }
];

const isValid = (username, password, users) => {
    return users.some(user => user.username === username && user.password === password);
}

const authenticatedUser = (username, password) => {
    return isValid(username, password, users);
}

//only registered users can login
regd_users.post("/login", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    if (!username || !password) {
        return res.status(404).json({ message: "Username and Password required" })
    }
    if (authenticatedUser(username, password)) {
        let accessToken = jwt.sign({
            data: username
        }, 'access', { expiresIn: 60 * 60 });

        req.session.authorization = {
            accessToken,
            username
        }
        return res.status(200).json({ message: "Logged in successfully" })
    } else {
        return res.status(401).json({ message: "Invalid username and password" });
    }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const review = req.query.review;
    const username = req.session.authorization.username;
    const password = users.find(user => user.username === username)?.password;

    if (!isbn || !review || !username || !password) {
        return res.status(404).json({ message: "isbn, review, and username are required" })
    }

    if (isValid(username, password, users)) {
        if (books[isbn].reviews[username]) {
            books[isbn].reviews[username] = review;
        } else {
            books[isbn].reviews[username] = review;
        }
        return res.status(200).json({ message: "Review added or modified successfully" })
    } else {
        return res.status(401).json({ message: "Invalid Username or password" })
    }
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const username = req.session.authorization.username;
    const password = users.find(user => user.username === username)?.password;

    if (!isbn || !username || !password) {
        return res.status(404).json({ message: "isbn, username, and password are required" });
    }

    if (isValid(username, password, users)) {
        console.log(books[isbn].reviews); // Log the reviews object
        if (books[isbn].reviews && books[isbn].reviews[username]) {
            delete books[isbn].reviews[username];
            console.log(books[isbn].reviews); // Log the reviews object after deletion
            return res.status(200).json({ message: "Review deleted successfully" });
        } else {
            return res.status(404).json({ message: "Review not found" });
        }
    } else {
        return res.status(401).json({ message: "Invalid username or password" });
    }
});


module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
