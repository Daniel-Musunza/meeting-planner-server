const express = require('express');
const cors = require('cors');
const app = express();
const path = require('path');
const fs = require('fs');

// Enable CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:8080');
  res.header('Access-Control-Allow-Methods', 'GET, POST, DELETE'); // Add 'DELETE' to the allowed methods
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});
// app.use(cors());


// Parse JSON bodies
app.use(express.json());

// Serve static files
app.use(express.static(path.join(__dirname)));

app.get("/", (request, response) => {
    response.json({ info: "Node.js, Express and meeting API" });
  });

// Define a route to serve data.json
app.get('/data.json', (req, res) => {
    res.sendFile(path.join(__dirname, 'data.json'));
  });
  
  app.post('/addreminder', (req, res) => {
    console.log('Received addreminder request');
    const newData = req.body;
  
    const dataPath = path.join(__dirname, 'data.json');
    fs.readFile(dataPath, 'utf8', (err, data) => {
      if (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to read data file' });
        return;
      }
  
      let jsonData;
      try {
        jsonData = JSON.parse(data);
      } catch (parseErr) {
        console.error(parseErr);
        res.status(500).json({ error: 'Failed to parse data file' });
        return;
      }
  
      jsonData.push(newData);
  
      const updatedData = JSON.stringify(jsonData);
      fs.writeFile(dataPath, updatedData, 'utf8', (writeErr) => {
        if (writeErr) {
          console.error(writeErr);
          res.status(500).json({ error: 'Failed to write data file' });
          return;
        }
  
        res.json({ message: 'Data added successfully', data: jsonData });
      });
    });
  });
// ...

app.delete('/api/data/delete/:id', (req, res) => {
  const id = req.params.id;
  console.log('Received delete request for task ID:', id);
  
  // Read the existing data from data.json
  fs.readFile('data.json', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Internal server error' });
    }

    let jsonData = JSON.parse(data);

    // Find the index of the data item with the specified id
    const index = jsonData.findIndex(item => item.id === id);

    if (index === -1) {
      return res.status(404).json({ error: 'Data not found' });
    }

    // Remove the data item from the array
    jsonData.splice(index, 1);

    // Write the updated data back to data.json
    fs.writeFile('data.json', JSON.stringify(jsonData), err => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Internal server error' });
      }

      // Return a success response
      res.json({ message: 'Data deleted successfully' });
    });
  });
});



  const port = 3444;
  const hostname = 'localhost'; // Replace with your server's IP address
  app.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
  });
  
