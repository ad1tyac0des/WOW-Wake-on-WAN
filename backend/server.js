require('dotenv').config({
    path: '../.env'
})
const app = require('./src/app')
const connectDB = require('./src/db/db')

connectDB()

app.listen(3000, () => {
    console.log("Server is listening on port 3000")
})