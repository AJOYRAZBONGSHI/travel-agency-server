const express = require("express");
const { MongoClient } = require("mongodb");
const cors = require("cors");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.jj7fr.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function run() {
  try {
    await client.connect();
    const database = client.db("Travel_Agency");
    const placeCollection = database.collection("Tourist_Place");

    // add data with POST 
    app.post('/places',async(req,res)=>{
      console.log('hitting the post',req.body);
      res.send('added')
    })

    // GET Product API
    app.get("/places", async (req, res) => {
      const cursor = placeCollection.find({});
      const places = await cursor.toArray();
      res.send(places);
    });

    // use POST to get data by keys
    app.get("/place/keys", async (req, res) => {
      const keys = req.body;
      const query = { keys: { $in: keys } };
      const place = await placeCollection.find(query).toArray();
      res.json(place);
    });
  } finally {
    // await client.close;
  }
}

run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("travel-agency server running");
});

app.listen(port, () => {
  console.log("server is running at port", port);
});
