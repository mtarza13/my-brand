const express = require('express');
const mongoose = require('mongoose');

// --- Configuration ---
const app = express();
const port = 3001;
// IMPORTANT: Replace 'your_database_name' with your actual database name.
const mongoURI = 'mongodb://localhost:27017/your_database_name'; 

// --- Database Connection Options ---
// We'll add a timeout to the connection attempt.
// If it can't connect in 5 seconds, it will fail with an error.
const connectOptions = {
  serverSelectionTimeoutMS: 5000 
};

// --- Database Connection ---
console.log('Attempting to connect to MongoDB...');
mongoose.connect(mongoURI, connectOptions)
  .then(() => {
    console.log('Successfully connected to MongoDB.');
    
    // Only start the server if the database connection is successful
    app.listen(port, () => {
      console.log(`Server is listening on http://localhost:${port}`);
    });
  })
  .catch(err => {
    // Now, if it times out, this error message will be displayed.
    console.error('\nCould not connect to MongoDB. Please ensure MongoDB is running and accessible.');
    console.error('Error details:', err.message);
    process.exit(1); 
  });

// --- Routes ---
app.get('/', (req, res) => {
  res.send('Hello World! Server is running and connected to the database.');
});

app.get('/db-status', (req, res) => {
  const state = mongoose.connection.readyState;
  let status = 'Unknown';
  switch (state) {
    case 0: status = 'Disconnected'; break;
    case 1: status = 'Connected'; break;
    case 2: status = 'Connecting'; break;
    case 3: status = 'Disconnecting'; break;
  }
  res.send(`Database connection status: ${status}`);
});
