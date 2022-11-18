/* eslint-disable prefer-regex-literals */
const UserSchema = require('../schemas/userSchema');

function regValidator(req, res, next) {
  const { username, password, password2 } = req.body;
  if (username.trim().length < 3) {
    return res
      .status(400)
      .json({ error: true, message: 'Vartotojo vardas turi būti bent 3 simbolių ilgio' });
  }
  if (password.trim().length < 3) {
    return res
      .status(400)
      .json({ error: true, message: 'Slaptažodis turi būti bent 3 simbolių ilgio' });
  }
  if (password !== password2) {
    return res.status(400).json({ error: true, message: 'Slaptažodžiai nesutampa' });
  }
  return next();
}

async function userValidator(req, res, next) {
  try {
    const { secret } = req.body;
    const user = await UserSchema.findOne({ secret });
    if (!user) throw new Error();
    next();
  } catch (error) {
    console.log('error on validator ===', error);
    res.status(401).json({ error: true, message: 'login for posting', data: [] });
  }
}

module.exports = { regValidator, userValidator };
