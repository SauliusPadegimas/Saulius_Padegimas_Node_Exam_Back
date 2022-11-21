# NODE.JS EXAM. BACK END

Here are some snips of assignment requirements implemented.

## Registration / Login
Password hashed

```javascript
async function hashString(input) {
  const hashedString = await bcrypt.hash(input, 10);
  return hashedString;
}
async function compareHash(input, hash) {
  const result = bcrypt.compare(input, hash);
  return result;
}
```

Form inputs validation

```javascript
  if (username.trim().length < 3) {
    return res.status(400)
      .json({ error: true, message: 'Vartotojo vardas turi būti bent 3 simbolių ilgio' });
  }
  if (password.trim().length < 3) {
    return res.status(400)
      .json({ error: true, message: 'Slaptažodis turi būti bent 3 simbolių ilgio' });
  }
  if (password !== password2) {
    return res.status(400).json({ error: true, message: 'Slaptažodžiai nesutampa' });
  }
  return next();
}
```
If username is not taken in MongoDB. 

```javascript
  if (error.code === 11000) {
      res
        .status(409)
        .json({ error: true, message: `Vartotojo vardas ${error.keyValue.username} užimtas` });
```
If login data is correct

```javascript
const user = await UserSchema.findOne({ username });
    if (!user) throw new Error('Blogi prisijungimo duomenys');
    const hashedpass = user.password;
    const result = await compareHash(password, hashedpass);
    if (!result) throw new Error('Blogi prisijungimo duomenys');
```
## Bidding
If user is authorized

```javascript
async function userValidator(secret) {
  const user = await UserSchema.findOne({ secret });
  return user;
}
const ifValidUser = await userValidator(secret);
if (!ifValidUser) {
   return socket.emit('errorOnUpdate', 'aukcione dalyvauti gali tik prisijungęs vartotojas');
      }
```
If upload data is complete
```javascript
  const { title, photo, bids, date } = newItem;
  if (!!title.trim() && !!photo.trim() && !!bids && !!date) {
    return true;
  }
  return false;
```
If bidding price is correct
```javascript
   if (price <= prevPrice) {
        return socket.emit('errorOnUpdate', 'galite siūlyti tik aukštesnę, negu esama kaina');
      }
```
If bidding time is not over
```javascript
function dateValidator(endDate) {
  const endTime = new Date(endDate).getTime();
  const timeNow = new Date().getTime();
  const timeLeft = endTime - timeNow;
  if (timeLeft <= 0) {
    return false;
  }
  return true;
}
```


## Socket rooms 

```javascript
    socket.on('join', (roomId) => {
      socket.join(roomId);
    });

< .... >

    socket.on('leave', (roomId) => {
      socket.leave(roomId);
    });

< .... >

   io.to(roomId).emit('oneItem', updatedItem);
```
