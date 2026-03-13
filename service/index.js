const express = require('express');
const app = express();

const port = process.argv.length > 2 ? process.argv[2] : 4000;

app.use(express.json());          
app.use(express.static('public'));

app.post('/api/auth/create', async (req, res) => {

  const { email, password } = req.body;

  // simple example user creation
  const user = {
    email: email,
    password: password
  };

  res.send({ email: user.email });
});


app.post('/api/auth/login', async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  if (!email || !password) {
    res.status(400).send({ msg: 'Missing email or password' });
    return;
  }

  res.send({ email: email });
});


app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});