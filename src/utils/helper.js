const mongoose = require('mongoose');

async function testDbConnection() {
  try {
    await mongoose.connect(process.env.MONGO_DB);
    console.log('Connected to MongoDB'.bgBlue.bold);
  } catch (error) {
    console.log(`Error connecting to db ${error.message}`.bgRed.bold);
  }
}

module.exports = testDbConnection;
