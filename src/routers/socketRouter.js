/* eslint-disable padded-blocks */
/* eslint-disable object-curly-newline */
const ItemSchema = require('../schemas/itemSchema');

module.exports = (io) => {
  io.on('connection', (socket) => {
    socket.on('addItem', async (newItem) => {
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
        console.log('allItems ===', allItems);
        io.emit('items', allItems);
      } catch (error) {
        console.log('error ===', error);
      }
    });

    socket.on('items', async () => {
      const allItems = await ItemSchema.find();
      console.log('allItems ===', allItems);
      socket.emit('items', allItems);
    });

    //   socket.on('join', ({ sender, receiver }) => {
    //     let room = [sender, receiver];
    //     room = room.sort().join('&');
    //     socket.join(room);
    //     console.log(`${sender} have joined room: ${room}`);
    //     const usersMessages = messages.filter((x) => x.room === room);
    //     io.in(room).emit('message', { usersMessages, room });
    //   });
  });
};
