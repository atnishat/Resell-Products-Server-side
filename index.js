
const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config();
const port = process.env.PORT || 5000;


const app = express();

// middleware
app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.s1df2ul.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri);
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });










async function run() {
  

try{

    const categoriesOptionCollection = client.db('partexResell').collection('categoriesOption');

    app.get('/categoriesOption', async (req, res) => {
        const query = {};
        const options = await categoriesOptionCollection.find(query).toArray();
        res.send(options);
    });






}

finally{

}

}

run().catch(console.log);

app.get('/', async (req, res) => {
    res.send('Partex resell products running');
})

app.listen(port, () => console.log(`Partex resell products running on ${port}`))







