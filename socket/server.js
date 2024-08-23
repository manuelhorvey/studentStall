const { Server } = require('socket.io');

const io = new Server(8901, {
  cors: {
    origin: 'http://localhost:3001',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  },
});

let users = [];

const addUser = (userId, socketId) => {
  if (!users.some(user => user.userId === userId)) {
    users.push({ userId, socketId });
    console.log('User added:', { userId, socketId });
  } else {
    console.log('User already exists:', { userId, socketId });
  }
};

const removeUser = (socketId) => {
  users = users.filter(user => user.socketId !== socketId);
  console.log('User removed:', { socketId });
};

const getUser = (userId) => {
  console.log('Checking for user:', userId);
  return users.find(user => user.userId === userId);
};

io.on('connection', (socket) => {
  console.log('A user connected with socket ID:', socket.id);

  socket.on('addUser', (userId) => {
    console.log('Received userId for connection:', userId);
    addUser(userId, socket.id);
    io.emit('getUsers', users);
  });

  socket.on('sendMessage', ({ senderId, receiverId, text }) => {
    console.log(`Message received: senderId=${senderId}, receiverId=${receiverId}, text=${text}`);
    const receiver = getUser(receiverId);
    if (receiver) {
      io.to(receiver.socketId).emit('getMessage', {
        senderId,
        text,
      });
    } else {
      console.log(`User ${receiverId} is not connected.`);
    }
  });

  socket.on('disconnect', () => {
    console.log('User disconnected with socket ID:', socket.id);
    removeUser(socket.id);
    io.emit('getUsers', users);
  });
});
