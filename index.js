const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000

// middleware 
app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.wueeg5w.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const teamCollection = client.db('roamPlus').collection('team');
    const featureCollection = client.db('roamPlus').collection('choose')
    const FAQcollection = client.db('roamPlus').collection('faq');
    const serviceCollection = client.db('roamPlus').collection('services')

    // service data ----------------------
    app.get('/home-services', async (req, res) => {
      const cursor = serviceCollection.find().limit(4)
      const result = await cursor.toArray()
      res.send(result)
    })
    app.get('/services', async (req, res) => {
      const cursor = serviceCollection.find()
      const result = await cursor.toArray()
      res.send(result)
    })
    app.post('/services', async (req, res) => {
      const service = req.body;
      console.log(service);
      const result = await serviceCollection.insertOne(service)
      res.send(result)
    })

    app.get('/services/:id', async (req, res) => {
      const id = req.params.id
      const query = { _id: new ObjectId(id) };
      const result = await serviceCollection.findOne(query)
      res.send(result)
    })

    app.delete('/services/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await serviceCollection.deleteOne(query)
      res.send(result)
    })
    app.put('/services/:id', async (req, res) => {
      const id = req.params.id;
      const updateService = req.body
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updateSer = {
        $set: {
          service_name: updateService.service_name, 
          service_area: updateService.service_area, 
          price: updateService.price, 
          photoURL: updateService.photoURL, 
          discription: updateService.discription
        },
      }
      const result = await serviceCollection.updateOne(filter, updateSer, options)
      res.send(result)
    })

    app.get('/my-services', async (req, res) => {
      let query = {}
      if (req.query?.email) {
        query = { provider_email: req.query.email }
      }
      const cursor = serviceCollection.find(query)
      const result = await cursor.toArray()
      res.send(result)
    })




    // immutable data -------------------------
    app.get('/team', async (req, res) => {
      const cursor = teamCollection.find()
      const result = await cursor.toArray()
      res.send(result)
    })
    app.get('/feature', async (req, res) => {
      const cursor = featureCollection.find()
      const result = await cursor.toArray()
      res.send(result)
    })
    app.get('/faq', async (req, res) => {
      const cursor = FAQcollection.find()
      const result = await cursor.toArray()
      res.send(result)
    })

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);





app.get('/', (req, res) => {
  res.send('roam plus is running successfuly')
})

app.listen(port, () => {
  console.log(`roam plus is running from ${port}`);
})