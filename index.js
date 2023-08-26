const express = require('express')
const cors = require('cors')
const errorMiddleware = require('./middleware/error-middleware')

const app = express()

// Config JSON response
app.use(express.json())

// Public folder for images
app.use(express.static('public'))

// Routes
const PetRoutes = require('./routes/PetRoutes')
const UserRoutes = require('./routes/UserRoutes')

app.use('/pets', PetRoutes)
app.use('/users', UserRoutes)

app.use(errorMiddleware)

app.listen(3000)
