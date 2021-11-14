const { MongoClient } = require('mongodb');
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

async function run(){
    try{
        await client.connect()
        console.log('Connected to Db')

        const database = client.db('car_mart')
        const productCollection = database.collection('products')
         
        // GET PRODUCTS
        app.get('/products', async(req,res)=>{
            const cursor = productCollection.find({})
            const products = await cursor.toArray()
            console.log('hitted api')
            res.send(products)
        })
        
    }
    finally{
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