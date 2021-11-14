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

const uri = `mongodb+srv://carMart:8vWlQdfxvoUwMcsl@cluster0.tecyb.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
  try {
    await client.connect()
    console.log('Connected to Db')

    const database = client.db('car_mart')
    const productCollection = database.collection('products')
    const reviewCollection = database.collection('review')
    const orderCollection = database.collection('orders')

    // GET PRODUCTS
    app.get('/products', async (req, res) => {
      const cursor = productCollection.find({})
      const products = await cursor.toArray()
      console.log('hitted api')
      res.send(products)
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
      console.log('hitted api review')
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