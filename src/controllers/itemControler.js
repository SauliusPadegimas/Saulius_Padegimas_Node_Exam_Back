/* eslint-disable object-curly-newline */
const ItemSchema = require('../schemas/itemSchema');

async function saveItem(req, res) {
  const { title, photo, user, price, date } = req.body;
  const item = new ItemSchema({
    title,
    photo,
    bids: [{ user, price }],
    date,
  });
  try {
    const resp = await item.save();
    console.log('resp ===', resp);
    res.status(201).json({ error: false, message: 'pst saved', data: resp });
  } catch (error) {
    console.log('error ===', error);
    res.send(400).json({ error: true, message: 'error while connecting to DB', data: error });
  }
}

async function getItems(req, res) {
  const items = await ItemSchema.find();
  res.json(items);
}
async function getItem(req, res) {
  const { id } = req.params;
  const item = await ItemSchema.findById(id);
  res.json(item);
}

module.exports = { saveItem, getItems, getItem };
