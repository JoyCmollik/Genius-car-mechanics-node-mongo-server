const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

// mongodb making a client
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.6vvik.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
});

async function run() {
	try {
		// first connect the client
		await client.connect();

		// making the database and collection
		const database = client.db('carMechanic');
		const servicesCollection = database.collection('services');

		// GET API
		app.get('/services', async (req, res) => {
			const cursor = servicesCollection.find({});
			const result = await cursor.toArray();
			res.send(result);
		});

		app.get('/services/:id', async (req, res) => {
			const id = req.params.id;
			console.log('got the params id', id);
			const query = {
				_id: ObjectId(id),
			};

			const result = await servicesCollection.findOne(query);
			res.send(result);
		});

		// POST API
		app.post('/services', async (req, res) => {
			const service = req.body;
			console.log(service);
			const result = await servicesCollection.insertOne(service);
			res.send(result);
		});
	} finally {
		// await client.close();
	}
}

run().catch(console.dir);

app.get('/', (req, res) => {
	res.send('Your server is running fine');
});

app.listen(port, () => {
	console.log('server running on port: ', port);
});
