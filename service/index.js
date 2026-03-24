const cookieParser = require('cookie-parser');
const bcrypt = require('bcryptjs');
const express = require('express');
const uuid = require('uuid');
const app = express();
const { connectToDatabase, getDB } = require('./db');

const authCookieName = 'token'

let users = []
let notes = []

const port = process.argv.length > 2 ? Number(process.argv[2]) : 4000

app.use(express.json())
app.use(cookieParser())
app.use(express.static('public'))

app.use((req, res, next) => {   //debugger
  console.log(`${req.method} ${req.url}`)
  next()
})

const apiRouter = express.Router()
app.use('/api', apiRouter)

apiRouter.post('/auth/create', async (req, res) => {
  const { email, password } = req.body || {}
  if (!email || !password) return res.status(400).send({ msg: 'Missing email or password' })
  if (await findUser('email', email)) return res.status(409).send({ msg: 'Existing user' })
  const user = await createUser(email, password)
  setAuthCookie(res, user.token)
  console.log('/auth/create reached')
  return res.send({ email: user.email })
})

apiRouter.post('/auth/login', async (req, res) => {
  console.log('/auth/login reached')
  const { email, password } = req.body || {}
  if (!email || !password) return res.status(400).send({ msg: 'Missing email or password' })
  const user = await findUser('email', email)
  if (user && (await bcrypt.compare(password, user.password))) {
    user.token = uuid.v4()
    setAuthCookie(res, user.token)
    return res.send({ email: user.email })
  }
  return res.status(401).send({ msg: 'Unauthorized' })
})

apiRouter.delete('/auth/logout', async (req, res) => {
  const user = await findUser('token', req.cookies?.[authCookieName])
  if (user) delete user.token
  res.clearCookie(authCookieName)
  return res.status(204).end()
})

async function verifyAuth(req, res, next) {
  const user = await findUser('token', req.cookies?.[authCookieName])
  if (user) return next()
    console.log('verifyauth?')
  return res.status(401).send({ msg: 'Unauthorized' })
}

apiRouter.get('/notes', verifyAuth, async (req, res) => {
  const db = getDB();
  const user = await findUser('token', req.cookies[authCookieName]);
  const userNotes = await db.collection('notes').find({ userId: user.email }).toArray();
  res.send(userNotes);
});

apiRouter.post('/notes', verifyAuth, async(req, res) => {
  const note = req.body
  if (!note || !note.text) {
    return res.status(400).send({ msg: 'Note text required' })
  }

  const db = getDB();
  const user = await findUser('token', req.cookies[authCookieName]);

  const newNote = {
    text: note.text,
    userId: user.email
  };

  await db.collection('notes').insertOne(newNote);

  const updatedNotes = await db.collection('notes').find({ userId: user.email }).toArray();
  res.send(updatedNotes);
})

app.use((err, _req, res, _next) => {
  console.error(err)
  res.status(500).send({ msg: 'Internal server error' })
})

app.use((_req, res) => {
  res.sendFile('index.html', { root: 'public' });
});

async function createUser(email, password) {
  const db = getDB();
  const passwordHash = await bcrypt.hash(password, 10);

  const user = {
    email,
    password: passwordHash,
    token: uuid.v4()
  };

  await db.collection('users').insertOne(user);
  return user;
}

async function findUser(field, value) {
  if (!value) return null;
  const db = getDB();
  return await db.collection('users').findOne({ [field]: value });
}

function setAuthCookie(res, token) {
  res.cookie(authCookieName, token, {
    maxAge: 1000 * 60 * 60 * 24 * 365,
    httpOnly: true,
    sameSite: 'strict',
    secure: process.env.NODE_ENV === 'production'
  })
}

connectToDatabase(); // udpate to say it connects

app.listen(port, () => console.log(`Backend listening on port ${port}`))