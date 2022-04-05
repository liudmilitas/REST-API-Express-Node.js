const express = require('express');

const db = require('./db.js');
const utils = require('./utils.js');


function getId(list){
    const lastItem = list.slice(-1)[0];

    let id = (lastItem?.id)
    id = id ? id+1 : 1;

    return id;
}

const app = express();

app.use(express.json())

app.get('/', (req, res) => {
    res.send("Hej du")
})

// middleware

// Get user from token if logged in 
app.use((req, res, next) => {
    const token = req.headers.authorization

    if(token && utils.verifyJWT(token)) {
        const tokenData = utils.decodeJWT(token)
        req.user = tokenData
        req.user.isLoggedIn = true
    } else {
        req.user = {isLoggedIn: false}
    }
    next()
})

// Force login middleware
const forceAuthorize = (req, res, next) => {
    if (req.user.isLoggedIn) {
        next()
    } else {
        res.sendStatus(401)
    }
}

// middleware end

// ----- CARS -----

app.get('/cars', forceAuthorize, (req, res) => {
    db.getCars((err, cars) => {
        if (err) {
            res.status(400).json({"error":err.message});
            return;
        }
        res.send(cars)
    })
})

app.get('/cars/:id', forceAuthorize, (req, res) => {
    const id = parseInt(req.params.id)

    db.getSingleCar(id, (err, row) => {
        if (err) {
            res.status(400).json({"error":err.message});
            return;
        }
          res.send({row})
    })
    
})

app.post('/cars', forceAuthorize, (req, res) => {
    db.getCars((err, cars) => {
        const id = getId(cars)
        db.insertCar(req.body.make, req.body.model, () => res.send({id}))
        res.sendStatus(200)
    })
})

app.patch('/cars/:id', forceAuthorize, (req, res) => {
    const id = parseInt(req.params.id)
    let updatedCar = {
        id: id,
        make: req.body.make,
        model: req.body.model
    }
    db.updateCar(updatedCar.make, updatedCar.model, id, (err, row) => res.send({id}))
})

app.delete('/cars/:id', forceAuthorize, (req, res) => {
    const id = parseInt(req.params.id);
    db.deleteCar(id, (err) => {
        if (err){
            res.status(400).json({"error": res.message})
            return;
        }
    res.sendStatus(200)
})
})
// ----- /CARS -----


// ----- USERS -----

app.get('/users', forceAuthorize, (req, res) => {
    db.getUsers((err, users) => {
        if (err) {
            res.status(400).json({"error":err.message});
            return;
        }
        res.send(users)
    })
})

app.get('/users/:id', forceAuthorize, (req, res) => {
    const id = parseInt(req.params.id)

    db.getSingleUser(id, (err, row) => {
        if (err) {
            res.status(400).json({"error":err.message});
            return;
        }
          res.send({row})
    })
    
})

app.post('/users', forceAuthorize, (req, res) => {
    db.getUsers((err, users) => {
        const id = getId(users)
        db.insertUser(req.body.name, req.body.motto, () => res.send({id}))
        res.sendStatus(200)
    })
})

app.patch('/users/:id', forceAuthorize, (req, res) => {
    const id = parseInt(req.params.id)
    let updatedUser = {
        id: id,
        name: req.body.name,
        motto: req.body.motto
    }
    db.updateUser(updatedUser.name, updatedUser.motto, id, (err, row) => res.send({id}))
})

app.delete('/users/:id', forceAuthorize, (req, res) => {
    const id = parseInt(req.params.id);
    db.deleteUser(id, (err) => {
        if (err){
            res.status(400).json({"error": res.message})
            return;
        }
    res.sendStatus(200)
})
})
//

// ----- /USERS -----


// LOGIN AND REGISTERING

// Register new user

app.post('/register', (req, res) => {
    const {username, password} = req.body;
    const hashedPassword = utils.hashPassword(password)

    db.registerAccount(username, hashedPassword, (error) => {
        if(error) {
            console.log(error);
            res.status(500).send(error)
        } else {
            res.sendStatus(200)
        }
    })
})

// Logging in User

app.post('/login', (req, res) => {
    const {username, password} = req.body

    db.getAccountByUsername(username, (error, account) => {
        if(error) {
            res.status(500).send(error);
        } else if (account) {
            const hashedPassword = account.hashedPassword
            const correctPassword = utils.comparePassword(password, hashedPassword)

            if(correctPassword){
                const jwtToken = utils.getJWTToken(account)
                res.send(jwtToken)
            } else {
                res.sendStatus(404)
            }
        } else {
            res.sendStatus(404)
        }
    })
})



app.listen(8000, () => {
    console.log("http://localhost:8000/")
})