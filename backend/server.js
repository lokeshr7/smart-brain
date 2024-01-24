const express = require('express')
const bcrypt = require('bcryptjs')
const cors = require('cors')
require('dotenv').config()

const db = require('knex')({
  client: 'sqlite3',
  connection: {
      filename: './smart-brain-db.db',
  },
  useNullAsDefault: true
});

const register = require('./controllers/register')
const signin = require('./controllers/signin')
const profile = require('./controllers/profile')
const image = require('./controllers/image')

const app = express()
app.use(express.json())
app.use(cors())

app.get('/', (req, res) => { res.send('It is working!') })
app.post('/signin', signin.handleSignin(db, bcrypt))
app.post('/register', (req, res) => { register.handleRegister(req, res, db, bcrypt) })
app.get('/profile/:id', (req, res) => { profile.handleProfileGet(req, res, db) })
app.put('/image', (req, res) => { image.handleImage(req, res, db) })
app.post('/imageurl', (req, res) => { image.handleApiCall(req, res) })

app.listen(process.env.PORT || 3001, () => {
  console.log(`The server is up and running on port ${process.env.PORT || 3001}`)
})