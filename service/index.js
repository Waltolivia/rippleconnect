const express = require('express')
const cookieParser = require('cookie-parser')
const bcrypt = require('bcryptjs')
const { v4: uuidv4 } = require('uuid')

const app = express()
const authCookieName = 'token'

let users = []
let scores = []

const port = process.argv.length > 2 ? Number(process.argv[2]) : 3000

app.use(express.json())
app.use(cookieParser())
app.use(express.static('public'))

const apiRouter = express.Router()
app.use('/api', apiRouter)

apiRouter.post('/auth/create', async (req, res) => {
  const { email, password } = req.body || {}
  if (!email || !password) return res.status(400).send({ msg: 'Missing email or password' })
  if (await findUser('email', email)) return res.status(409).send({ msg: 'Existing user' })
  const user = await createUser(email, password)
  setAuthCookie(res, user.token)
  return res.send({ email: user.email })
})

apiRouter.post('/auth/login', async (req, res) => {
  const { email, password } = req.body || {}
  if (!email || !password) return res.status(400).send({ msg: 'Missing email or password' })
  const user = await findUser('email', email)
  if (user && (await bcrypt.compare(password, user.password))) {
    user.token = uuidv4()
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
  return res.status(401).send({ msg: 'Unauthorized' })
}

apiRouter.get('/scores', verifyAuth, (_req, res) => res.send(scores))
apiRouter.post('/score', verifyAuth, (req, res) => {
  scores = updateScores(req.body || {})
  res.send(scores)
})

app.use((err, _req, res, _next) => {
  console.error(err)
  res.status(500).send({ msg: 'Internal server error' })
})

async function createUser(email, password) {
  const passwordHash = await bcrypt.hash(password, 10)
  const user = { email, password: passwordHash, token: uuidv4() }
  users.push(user)
  return user
}

async function findUser(field, value) {
  if (!value) return null
  return users.find(u => u[field] === value) || null
}

function setAuthCookie(res, token) {
  res.cookie(authCookieName, token, {
    maxAge: 1000 * 60 * 60 * 24 * 365,
    httpOnly: true,
    sameSite: 'strict',
    secure: false
  })
}

function updateScores(newScore) {
  if (typeof newScore?.score !== 'number') return scores
  let inserted = false
  for (let i = 0; i < scores.length; i += 1) {
    if (newScore.score > scores[i].score) {
      scores.splice(i, 0, newScore)
      inserted = true
      break
    }
  }
  if (!inserted) scores.push(newScore)
  if (scores.length > 10) scores.length = 10
  return scores
}

app.listen(port, () => console.log(`Backend listening on port ${port}`))