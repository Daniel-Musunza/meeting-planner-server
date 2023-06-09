const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs');

// Enable CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*'); // Update the origin to restrict access to specific domains
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

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



  const port = 3444;
  const hostname = '192.168.0.112'; // Replace with your server's IP address
  app.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
  });
  
