const { MongoClient } = require('mongodb');
var ObjectId = require('mongodb').ObjectId;
const express = require('express')
const cors = require('cors')
const app = express()
require('dotenv').config()
const port = process.env.PORT || 5000

// Middleware
app.use(cors())
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.tecyb.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
  try {
    await client.connect()
    console.log('Connected to Db')
    // Check comment
    const database = client.db('car_mart')
    const productCollection = database.collection('products')
    const reviewCollection = database.collection('review')
    const orderCollection = database.collection('orders')
    const userCollection = database.collection('users')
    
    // GET PRODUCTS
    app.get('/products', async (req, res) => {
      const cursor = productCollection.find({})
      const products = await cursor.toArray()
      console.log('hitted api')
      res.json(products)
    })
    // Add products
    app.post('/products', async(req,res)=>{
      const product = req.body
      const result = await productCollection.insertOne(product)
      res.json(result)
    })

    // GET SPECIFIC PRODUCT
    app.get('/products/:id', async (req, res) => {
      const id = req.params.id
      console.log('getting id', id)
      const query = { _id: ObjectId(id) }
      const product = await productCollection.findOne(query)
      res.json(product)
    })

    // GET Review
    app.get('/review', async (req, res) => {
      const cursor = reviewCollection.find({})
      const review = await cursor.toArray()
      res.json(review) //not res.send
    })

    // Post Review
    app.post('/review', async (req, res) => {
      const review = req.body;
      const result = await reviewCollection.insertOne(review)
      res.json(result)
    })

    // Get Orders
    app.get('/orders', async (req, res) => {
      const email = req.query.email
      let query = {}
      if (email) {
        query = { email: email }
      }
      const cursor = orderCollection.find(query)
      const orders = await cursor.toArray()
      res.json(orders)
    })

    // Post Orders
    app.post('/orders', async (req, res) => {
      const order = req.body
      const ans = await orderCollection.insertOne(order)
      res.json(ans)
    })

    // Delete Orders
    app.delete('/orders/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await orderCollection.deleteOne(query);
      res.json(result);
    })
    // Delete products 
    app.delete('/products/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await productCollection.deleteOne(query);
      res.json(result);
    })

    // Add user
    app.post('/users', async (req, res) => {
      const user = req.body
      const result = await userCollection.insertOne(user)
      res.json(result)
    })

    // Upsert user in database
    app.put('/users', async (req, res) => {
      const user = req.body
      const query = { email: user.email }
      const options = { upsert: true }
      const updateDoc = { $set: user }
      const result = await userCollection.updateOne(query, updateDoc, options)
      res.json(result)
    })

    // Add admin role
    app.put('/users/admin', async (req, res) => {
      const user = req.body
      console.log('put', user)
      const filter = { email: user.email }
      const updateDoc = { $set: { role: 'admin' } }
      const result = await userCollection.updateOne(filter, updateDoc)
      res.json(result)
    })

    // Check admin role
    app.get('/users/:email', async (req, res) => {
      const email = req.params.email;
      const query = { email: email };
      const user = await userCollection.findOne(query);
      let isAdmin = false;
      if (user?.role === 'admin') {
        isAdmin = true;
      }
      res.json({ admin: isAdmin });
    })

  }
  finally {
    // await client.close()
  }
}
run().catch(console.dir)

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening at :${port}`)
})