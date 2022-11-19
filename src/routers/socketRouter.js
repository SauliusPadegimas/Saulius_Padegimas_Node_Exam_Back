/* eslint-disable comma-dangle */
/* eslint-disable brace-style */
/* eslint-disable consistent-return */
/* eslint-disable padded-blocks */
/* eslint-disable object-curly-newline */
const { userValidator, addItemValidator, dateValidator } = require('../middleware/validator');
const ItemSchema = require('../schemas/itemSchema');

module.exports = (io) => {
  io.on('connection', (socket) => {
    // &&& PRISIJUNGTI PRIE KAMBARIO
    socket.on('join', (roomId) => {
      socket.join(roomId);
    });
    // &&& ATSIJUNGTI NUO KAMBARIO
    socket.on('leave', (roomId) => {
      socket.leave(roomId);
    });
    // %%% PRIDĖTI PREKEI %%%
    socket.on('addItem', async (newItem, secret) => {
      // validuojam ar siuncia registruotas vartotojas
      const ifValidUser = await userValidator(secret);
      if (!ifValidUser) {
        return socket.emit('errorOnAddItem', 'duomenis gali siųsti tik prisijungęs vartotojas');
      }

      // validuojam ar nėra tusčių laukų
      const ifValidData = await addItemValidator(newItem);
      if (!ifValidData) {
        return socket.emit('errorOnAddItem', 'nepilnai užpildyti duomenys');
      }

      const { title, photo, bids, date } = newItem;
      const item = new ItemSchema({
        title,
        photo,
        bids,
        date,
      });
      try {
        const resp = await item.save();
        console.log('resp from mangoose ===', resp);
        const allItems = await ItemSchema.find();
        socket.emit('errorOnAddItem', false);
        io.emit('items', allItems);
      } catch (error) {
        console.log('error ===', error);
      }
    });

    socket.on('items', async (data) => {
      // gauti vieną prekę
      if (data) {
        const item = await ItemSchema.findById(data);
        socket.emit('oneItem', item);
      }

      // gauti visas prekes
      else {
        const allItems = await ItemSchema.find();
        console.log('allItems ===', allItems);
        socket.emit('items', allItems);
      }
    });

    // %%% PRIDĖTI STATYMĄ %%%
    socket.on('update', async (data) => {
      const { secret, id, price } = data;
      // validuojam ar siuncia registruotas vartotojas
      const ifValidUser = await userValidator(secret);
      if (!ifValidUser) {
        return socket.emit('errorOnUpdate', 'aukcione dalyvauti gali tik prisijungęs vartotojas');
      }
      const item = await ItemSchema.findById(id);
      const prevPrice = item.bids[0].price;

      if (price <= prevPrice) {
        return socket.emit('errorOnUpdate', 'galite siūlyti tik aukštesnę, negu esama kaina');
      }

      // validuojam ar nesibaigė statymų laikas
      const ifOnTime = dateValidator(item.date);
      if (!ifOnTime) {
        return socket.emit('errorOnUpdate', 'pasibaigė laikas');
      }

      const bidsArr = item.bids;
      const newBid = {
        user: ifValidUser.username,
        price,
      };
      bidsArr.unshift(newBid);

      const updatedItem = await ItemSchema.findByIdAndUpdate(
        id,
        { bids: bidsArr },
        {
          returnOriginal: false,
        }
      );
      socket.emit('errorOnUpdate', false);
      io.to(id).emit('oneItem', updatedItem);
      const allItems = await ItemSchema.find();
      socket.emit('items', allItems);
    });
  });
};
