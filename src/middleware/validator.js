/* eslint-disable object-curly-newline */
/* eslint-disable prefer-regex-literals */
const UserSchema = require('../schemas/userSchema');

// funkcija validuoja registracijos formą, naudojamas su REST routeriu
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

// funkcija tikrina, ar duomenis siuncia registruotas vartotojas.
// Naudojama su socket routais, todel grazina ne next(), o vartotoją arba false.
async function userValidator(secret) {
  const user = await UserSchema.findOne({ secret });
  return user;
}

// funkcija tikrina, ar nera tusciu duomenu lauku.
// Naudojama su socket routais, todel grazina ne next(), o tiesiog Boolean.
async function addItemValidator(newItem) {
  const { title, photo, bids, date } = newItem;
  if (!!title.trim() && !!photo.trim() && !!bids && !!date) {
    return true;
  }
  return false;
}

// tikrina ar nesibaigė likęs laikas
function dateValidator(endDate) {
  const endTime = new Date(endDate).getTime();
  const timeNow = new Date().getTime();
  const timeLeft = endTime - timeNow;
  if (timeLeft <= 0) {
    return false;
  }
  return true;
}

module.exports = { regValidator, userValidator, addItemValidator, dateValidator };
