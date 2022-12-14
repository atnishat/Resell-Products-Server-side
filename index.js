
const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const jwt = require('jsonwebtoken');
const { query } = require('express');
require('dotenv').config();
const port = process.env.PORT || 5000;


const app = express();

// middleware
app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.s1df2ul.mongodb.net/?retryWrites=true&w=majority`;
// console.log(uri);
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

function verifyJWT(req, res, next) {

    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).send('unauthorized access');
    }

    const token = authHeader.split(' ')[1];

    jwt.verify(token, process.env.ACCESS_TOKEN, function (err, decoded) {
        if (err) {
            return res.status(403).send({ message: 'forbidden access' })
        }
        req.decoded = decoded;
        next();
    })

}

async function run() {
  

try{

    const categoriesOptionCollection = client.db('partexResell').collection('categoriesOption');
    const category = client.db('partexResell').collection('category');
    const bookingsCollection = client.db('partexResell').collection('booking');
    const usersCollection = client.db('partexResell').collection('users');
    const productsCollection = client.db('partexResell').collection('products');

    app.get('/categoriesOption', async (req, res) => {
        const query = {};
        const options = await categoriesOptionCollection.find(query).toArray();
        res.send(options);
    });
   
 app.get('/category/:id', async (req, res) => {
        const id = req.params.id;
        const query = {id: id};
        const result = await category.find(query).toArray();
        res.send(result);
    });

    app.get('/bookings', verifyJWT, async (req, res) => {
        const email = req.query.email;
        const decodedEmail = req.decoded.email;

        if (email !== decodedEmail) {
            return res.status(403).send({ message: 'forbidden access' });
        }

        const query = { email: email };
        const bookings = await bookingsCollection.find(query).toArray();
        res.send(bookings);
    })

    app.get('/users', async (req, res) => {
        const query = {};
        const users = await usersCollection.find(query).toArray();
        res.send(users);
    });

    app.post('/bookings', async (req, res) => {
        const booking = req.body;
        const result = await bookingsCollection.insertOne(booking);
        res.send(result);
    })



    
    app.get('/jwt', async (req, res) => {
        const email = req.query.email;
        const query = { email: email };
        const user = await usersCollection.findOne(query);
        if (user) {
            const token = jwt.sign({ email }, process.env.ACCESS_TOKEN, { expiresIn: '5h' })
            return res.send({ accessToken: token });
        }
        // console.log(user);
        res.status(403).send({ accessToken: '' })
    });

            // user find
            app.get('/users/:email', async (req, res) => {
                const email = req.params.email;
                const query = { email }
                const user = await usersCollection.findOne(query);
                res.send({ isUser: user?.role !== 'admin' });
            })

       app.get('/users/admin/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email }
            const user = await usersCollection.findOne(query);
            res.send({ isAdmin: user?.role === 'admin' });
        })

    app.post('/users', async (req, res) => {
        const user = req.body;
        console.log(user);
        const result = await usersCollection.insertOne(user);
        res.send(result);
    });


    app.put('/users/admin/:id', verifyJWT, async (req, res) => {
        const decodedEmail = req.decoded.email;
        const query = { email: decodedEmail };
        const user = await usersCollection.findOne(query);

        if (user?.role !== 'admin') {
            return res.status(403).send({ message: 'forbidden access' })
        }

        const id = req.params.id;
        const filter = { _id: ObjectId(id) }
        const options = { upsert: true };
        const updatedDoc = {
            $set: {
                role: 'admin'
            }
        }
        const result = await usersCollection.updateOne(filter, updatedDoc, options);
        res.send(result);
    })


    app.get('/products', verifyJWT, async (req, res) => {
        const query = {};
        const doctors = await productsCollection.find(query).toArray();
        res.send(doctors);
    })



    app.post('/products', verifyJWT,  async (req, res) => {
        const doctor = req.body;
        const result = await productsCollection.insertOne(doctor);
        res.send(result);
    });


    app.delete('/products/:id', verifyJWT, async (req, res) => {
        const id = req.params.id;
        const filter = { _id: ObjectId(id) };
        const result = await productsCollection.deleteOne(filter);
        res.send(result);
    })



}

finally{

}

}

run().catch(console.log);

app.get('/', async (req, res) => {
    res.send('Partex resell products running');
})

app.listen(port, () => console.log(`Partex resell products running on ${port}`))







