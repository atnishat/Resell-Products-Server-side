
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



    app.post('/bookings', async (req, res) => {
        const booking = req.body;
        // console.log(booking);
        // const query = {
        //     appointmentDate: booking.appointmentDate,
        //     email: booking.email,
        //     treatment: booking.treatment 
        // }
        // const alreadyBooked = await bookingsCollection.find(query).toArray();

        // if (alreadyBooked.length){
        //     const message = `You already have a booking on ${booking.appointmentDate}`
        //     return res.send({acknowledged: false, message})
        // }

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


    app.post('/users', async (req, res) => {
        const user = req.body;
        console.log(user);
        const result = await usersCollection.insertOne(user);
        res.send(result);
    });

















 // app.get('/categoriesOption/:id', async (req, res) => {
    //     const id = req.params.id;
    //     const query = {id: id};
    //     const result = await categoryOption.find(query).toArray();
    //     res.send(result);
    // });

    // app.get('/product', async (req, res) => {
    //     const id = req.params.id;
    //     const query = {_id: ObjectId(id)}
    //     const result = await categoryOption.find(query).toArray();
    //     res.send(result);
    // });

    //  app.get('/products/:id', async (req, res) => {
    //     const id = req.params.id;
    //     // console.log(id);
    //     const query = {categories_id :id }
    //     const catOptions = await categoryOption.find(query).toArray();
    //     res.send(catOptions);
    //  });


 



     // console.log(id);
        // const query = {categories_id: id}
 // console.log(query);
        // const result= await categoryOption.find(query).toArray()
    // const query = {_id: ObjectId(id)}
    // const result = await categoryOption.find(query).toArray();


}

finally{

}

}

run().catch(console.log);

app.get('/', async (req, res) => {
    res.send('Partex resell products running');
})

app.listen(port, () => console.log(`Partex resell products running on ${port}`))







