const express = require('express');
const app = express()
const port = process.env.PORT || 5000;
const cors = require('cors')
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');



// middlewear

app.use(cors());
app.use(express.json());




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.faflb.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        await client.connect()
        const productCollection = client.db('WearHouse').collection('product')

        // get all product 
        app.get('/product', async (req, res) => {
            const query = {}
            const cursor = productCollection.find(query)
            const result = await cursor.toArray()
            res.send(result)
        });

        // get single product
        app.get('/product/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: ObjectId(id) }
            const result = await productCollection.findOne(query);
            res.send(result)
        });

        // add products 

        app.post('/product', async (req, res) => {
            const newProduct = req.body
            const result = await productCollection.insertOne(newProduct)
            res.send(result)
        })

        // delete single product

        app.delete('/product/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const result = await productCollection.deleteOne(query)
            res.send(result)
        });

        // update product
        app.put('/product/:id', async (req, res) => {
            const id = req.params.id;
            const updatUser = req.body;
            const filter = { _id: ObjectId(id) }
            const option = { upsert: true };
            const updateDoc = {
                $set: {
                    quantity: updatUser.quantity,
                    price: updatUser.price,
                    img: updatUser.img,
                    description: updatUser.description,
                    supplierName: updatUser.supplierName,
                    name: updatUser.name

                }
            };
            const result = await productCollection.updateOne(filter, updateDoc, option)
            res.send(result);
        });
        /////////////////// my items //////////////////////

        app.post('/addItem', async (req, res) => {
            const newService = req.body;
            const result = await productCollection.insertOne(newService);
            res.send(result);
        });

        // delete item

        app.delete('/myItem/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const result = await productCollection.deleteOne(query)
            res.send(result)
        })

        app.get("/myItem/:email", async (req, res) => {
            const email = req.params;
            const cursor = productCollection.find(email)
            const products = await cursor.toArray()
            res.send(products)
        })


    }
    finally {

    }
}

run().catch(console.dir)


app.get('/', (req, res) => {
    res.send('its running bro')
})

app.listen(port, () => {
    console.log('listenig  to port', port);
})
