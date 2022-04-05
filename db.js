// Setup sqlite
const sqlite = require('sqlite3');
const db = new sqlite.Database('database.db')

// Create the DB tables if they don't exist

db.run(`
CREATE TABLE IF NOT EXISTS accounts (
    id INTEGER PRIMARY KEY,
    username TEXT,git add
    hashedPassword TEXT,
    CONSTRAINT uniqueUsername UNIQUE(username)
)
`);

db.run(`
CREATE TABLE IF NOT EXISTS cars (
    id INTEGER PRIMARY KEY,
    make TEXT,
    model TEXT
)
`);

db.run(`
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY,
    name TEXT,
    motto TEXT
)
`);

/*
// RUN THIS CODE TO POPULATE THE DATABASE

db.run(`
INSERT INTO cars (
    make,
    model
) VALUES ("Volvo", "V70"),
         ("SAAB", "9000"),
         ("Mercedes", "S")
`);

db.run(`
INSERT INTO users (
    name,
    motto
) VALUES ("Malvina", "YOLO"),
         ("Lorie", "Live Love Laugh"),
         ("Jack", "Get Out of My House")
`);
*/


/* ------- ACCOUNTS TABLE OPERATIONS -------*/

// Save account in database

module.exports.registerAccount = (userName, hashedPassword, callback) => {
    const query = `
    INSERT INTO accounts
    (username, hashedPassword)
    VALUES
    (?, ?)
    `

    const values = [
        userName, 
        hashedPassword
    ]

    db.run(query, values, callback)
}

// Get account from DB

exports.getAccountByUsername = function(username, callback) {
    const query = `
    SELECT * FROM accounts WHERE username = ?
    `
    const values = [username]
    db.get(query, values, callback)
}

/* ------- ACCOUNTS TABLE OPERATIONS END -------*/


/* ------- CARS TABLE OPERATIONS -------*/

// Insert cars in database (POST)

exports.insertCar = (make, model, callback) => {
    const query = `INSERT INTO cars (make, model) VALUES (?, ?)`
    const values = [make, model];
    db.run(query, values, callback);
}

// Getting all cars from DB (GET)

exports.getCars = (callback) => {
    const query = `SELECT * FROM cars`
    db.all(query, callback)
}

// Getting a single car (GET)

exports.getSingleCar = (id, callback) => {
    const query = `SELECT * FROM cars WHERE id = ?`
    const values = [id]
    db.get(query, values, callback)
}

// Updating a car (PATCH)

exports.updateCar = (make, model, id, callback) => {
    const query = `UPDATE cars SET 
    make = COALESCE(?,make), 
    model = COALESCE(?,model)
    WHERE id = ?`
    const values = [make, model, id]
    db.run(query, values, callback)
}

// Deleting a car (DELETE)

exports.deleteCar = (id, callback) => {
    const query = `DELETE FROM cars WHERE id = ?`
    const values = [id]
    db.run(query, values, callback)
}

/* ------- CARS TABLE OPERATIONS END -------*/


/* ------- USERS TABLE OPERATIONS -------*/

// Insert users in database (POST)

module.exports.insertUser = (name, motto, callback) => {
    const query = `INSERT INTO users (name, motto) VALUES (?, ?)`
    const values = [name, motto];
    db.run(query, values, callback);
}

// Getting all users from DB (GET)

exports.getUsers = (callback) => {
    const query = `SELECT * FROM users`
    db.all(query, callback)
}

// Getting a single user (GET)

exports.getSingleUser = (id, callback) => {
    const query = `SELECT * FROM users WHERE id = ?`
    const values = [id]
    db.get(query, values, callback)
}

// Updating a user (PATCH)

exports.updateUser = (name, motto, id, callback) => {
    const query = `UPDATE users SET 
    name = COALESCE(?,name), 
    motto = COALESCE(?,motto)
    WHERE id = ?`
    const values = [name, motto, id]
    db.run(query, values, callback)
}

// Deleting a user (DELETE)

exports.deleteUser = (id, callback) => {
    const query = `DELETE FROM users WHERE id = ?`
    const values = [id]
    db.run(query, values, callback)
}
/* ------- USERS TABLE OPERATIONS END -------*/



