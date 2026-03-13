const express = require('express');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcryptjs');
<<<<<<< ours
const uuid = require('uuid');
=======
const { v4: uuidv4 } = require('uuid');
>>>>>>> theirs

const app = express();
const authCookieName = 'token';

// In-memory storage (resets on server restart)
let users = [];
let scores = [];

// Backend port — make sure vite.config.js proxy points here
const port = process.argv.length > 2 ? process.argv[2] : 3000;

// Middleware
app.use(express.json());           // parse JSON bodies
app.use(cookieParser());           // parse cookies

// Serve static files if needed (sounds/images)
app.use(express.static('public'));

// API router
const apiRouter = express.Router();
app.use('/api', apiRouter);

// Create a new user
apiRouter.post('/auth/create', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).send({ msg: 'Missing email or password' });

  if (await findUser('email', email)) {
    return res.status(409).send({ msg: 'Existing user' });
  }

  const user = await createUser(email, password);
  setAuthCookie(res, user.token);
  res.send({ email: user.email });
});

// Login an existing user
apiRouter.post('/auth/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await findUser('email', email);

  if (user && await bcrypt.compare(password, user.password)) {
    user.token = uuid.v4();
    setAuthCookie(res, user.token);
    return res.send({ email: user.email });
  }

  res.status(401).send({ msg: 'Unauthorized' });
});

// Logout
apiRouter.delete('/auth/logout', async (req, res) => {
  const user = await findUser('token', req.cookies[authCookieName]);
  if (user) delete user.token;
  res.clearCookie(authCookieName);
  res.status(204).end();
});

// Verify authentication middleware
async function verifyAuth(req, res, next) {
  const user = await findUser('token', req.cookies[authCookieName]);
  if (user) return next();
  res.status(401).send({ msg: 'Unauthorized' });
}

// Scores API (authenticated)
apiRouter.get('/scores', verifyAuth, (_req, res) => res.send(scores));
apiRouter.post('/score', verifyAuth, (req, res) => {
  scores = updateScores(req.body);
  res.send(scores);
});

// Error handler
app.use((err, _req, res, _next) => {
  res.status(500).send({ type: err.name, message: err.message });
});

// Helper functions
async function createUser(email, password) {
  const passwordHash = await bcrypt.hash(password, 10);
  const user = { email, password: passwordHash, token: uuid.v4() };
  users.push(user);
  return user;
}

async function findUser(field, value) {
  if (!value) return null;
  return users.find(u => u[field] === value);
}

function setAuthCookie(res, token) {
  res.cookie(authCookieName, token, {
    maxAge: 1000 * 60 * 60 * 24 * 365,
    httpOnly: true,
    sameSite: 'strict',
    secure: false, // set true only in production with HTTPS
  });
}

function updateScores(newScore) {
  let inserted = false;
  for (let i = 0; i < scores.length; i++) {
    if (newScore.score > scores[i].score) {
      scores.splice(i, 0, newScore);
      inserted = true;
      break;
    }
  }
  if (!inserted) scores.push(newScore);
  if (scores.length > 10) scores.length = 10;
  return scores;
}

// Start server
app.listen(port, () => console.log(`Backend listening on port ${port}`));