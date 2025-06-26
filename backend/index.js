const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');

const app = express();
app.use(cors());

const uri = "mongodb://mongodb:27017";
const client = new MongoClient(uri);

client.connect().then(() => {
  const db = client.db("mydb");
  const sensors = db.collection("sensors");

  app.get('/sensors/:id', async (req, res) => {
    try {
      const sensor = await sensors.findOne({ _id: Number(req.params.id) });
      if (!sensor) return res.status(404).send({ error: 'Sensor not found' });
      res.send({ active: sensor.active });
    } catch (err) {
      console.error(err);
      res.status(500).send({ error: 'Server error' });
    }
  });

  app.listen(5000, () => {
    console.log('API listening on port 5000');
  });
}).catch(err => {
  console.error('Failed to connect to MongoDB', err);
});
