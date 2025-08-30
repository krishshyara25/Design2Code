
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const { errorHandler } = require('./middleware/errorHandler');
const chatRoutes = require('./routes/chatRoute');
const generationRoutes = require('./routes/generationRoute'); 
const imageRoutes = require('./routes/imageRoute');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());

app.use(express.urlencoded({ extended: false }));
app.use(express.json({ limit: '10mb' })); 

app.use('/api/chat', chatRoutes);
app.use('/api/generate', generationRoutes); 
app.use('/api/upload', imageRoutes);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
