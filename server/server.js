const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));

const corsOptions = {
  origin: 'http://localhost:3001',
  credentials: true,
};

app.use(cors(corsOptions));

// Connect to MongoDB
mongoose.connect(process.env.MONGO, {
  useNewUrlParser: true, 
  useUnifiedTopology: true 
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.log('MongoDB connection error:', err));


// Import and use route modules
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const userProductRoutes = require('./routes/userProductRoutes');
const messageRoutes = require('./routes/messageRoutes');
const imagesRoutes = require('./routes/imageRoutes');
const conversationRoute = require('./routes/conversationRoutes');
const usersRoutes = require('./routes/usersRoutes');


app.use('/auth', authRoutes);
app.use('/products', productRoutes);
app.use('/categories', categoryRoutes);
app.use('/users', usersRoutes);
app.use('/user/products', userProductRoutes);
app.use('/messages', messageRoutes);
app.use("/conversations", conversationRoute);
app.use('/images',imagesRoutes);

// Error Handling Middleware
app.use((err, _req, res, _next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
