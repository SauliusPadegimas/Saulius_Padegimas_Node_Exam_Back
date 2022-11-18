const { uid } = require('uid');
const { hashString, compareHash } = require('../utils/hash');
const UserSchema = require('../schemas/userSchema');

async function saveUser(req, res) {
  const { username, password } = req.body;
  const hashedPass = await hashString(password);
  const secret = uid();
  const user = new UserSchema({
    username,
    password: hashedPass,
    secret,
  });
  try {
    const resp = await user.save();
    console.log('resp from mondodb ===', resp);
    const { username: savedUsername } = resp;
    res.status(201).json({
      error: false,
      message: `Naujas vartotojas ${savedUsername} sukurtas. Dabar galite prisijungti`,
    });
  } catch (error) {
    console.log('error ===', error);
    if (error.code === 11000) {
      res
        .status(409)
        .json({ error: true, message: `Vartotojo vardas ${error.keyValue.username} užimtas` });
    } else {
      res.status(400).json({ error: true, message: 'duomenų bazės klaida' });
    }
  }
}

async function getUsers(req, res) {
  const users = await UserSchema.find();
  res.json({ error: false, data: users });
}

async function getUser(req, res) {
  const { secret } = req.params;
  try {
    const user = await UserSchema.findOne({ secret });
    res.json({ error: false, username: user.username });
  } catch (error) {
    res.status(404).json({ error: true, message: 'user not found' });
  }
}

async function loginUser(req, res) {
  const { username, password } = req.body;
  try {
    const user = await UserSchema.findOne({ username });
    if (!user) throw new Error('Blogi prisijungimo duomenys');
    const hashedpass = user.password;
    const result = await compareHash(password, hashedpass);
    if (!result) throw new Error('Blogi prisijungimo duomenys');
    res.send({ error: false, secret: user.secret });
  } catch (error) {
    res.status(400).json({ error: true, message: error.message });
  }
}

module.exports = {
  saveUser,
  getUsers,
  loginUser,
  getUser,
};
