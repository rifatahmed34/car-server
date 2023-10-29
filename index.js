const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const app = express();
const potr = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PSS}@cluster0.fubtnsw.mongodb.net/?retryWrites=true&w=majority`;

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

        const serviceCollection = client.db('carDB').collection('service');
        const bookingCollection = client.db('carDB').collection('bookings');

app.get('/service', async (req, res )=> {
    const cursor = serviceCollection.find();
    const result = await cursor.toArray();
    res.send(result);
})

app.get('/service/:id', async (req, res)=>{
   const id = req.params.id;
   const query = {_id: new ObjectId(id)};
   const options = {
    // Include only the `title` and `imdb` fields in the returned document
    projection: {  title: 1, img: 1, price: 1, service_id: 1 }
  };
   const result = await serviceCollection.findOne(query, options);
   res.send(result);
});
//  Delete Oparation
app.delete('/bookings/:id', async (req, res) => {
    const id = req.params.id;
    const query = {_id: new ObjectId(id)};
    const result = await bookingCollection.deleteOne(query)
    res.send(result);
})

// Update Oparation
app.patch('/bookings/:id', async (req, res) => {
    const id = req.params.id;
    const filter = {_id: new ObjectId(id)}
    const updateBookings = req.body;
    console.log(updateBookings);
    const updateDoc = {
        $set: {
            satus: updateBookings.status
        }
    }
    const result = bookingCollection.updateOne(filter, updateDoc);
    res.send(result);
    

})

//Boooking  
app.get('/boookings', async (req, res) => {
    console.log(req.query.email);
    let query = {};
    if(req.query?.email){
        query = {email: req.query.email}
    }
    const result = await bookingCollection.find().toArray();
    res.send(result);
})

app.post('/bookings', async (req, res)=> {
    const booking = req.body;
    // console.log(booking)
    const result = await bookingCollection.insertOne(booking);
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
    console.log('server is running')
})

app.listen(potr, (req, res) => {
    console.log(`car server is running on port ${potr}`)
})