
const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
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



async function run() {
  

try{

    const categoriesOptionCollection = client.db('partexResell').collection('categoriesOption');
    const category = client.db('partexResell').collection('category');
    const bookingsCollection = client.db('partexResell').collection('booking');

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







