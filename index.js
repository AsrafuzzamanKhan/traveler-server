const express = require("express");
const { MongoClient, ServerApiVersion } = require("mongodb");
const ObjectId = require("mongodb");

const cors = require("cors");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

// mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.6kqiq.mongodb.net/?retryWrites=true&w=majority

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.6kqiq.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function run() {
  try {
    client.connect();
    // await client.connect();
    const database = client.db("traveler");
    const usersCollection = client.db("traveler").collection("users");
    const packagesCollection = database.collection("packages");
    const bookingCollection = database.collection("booking");
    const activitiesCollection = database.collection("activities");

    // create users api
    app.post("/users", async (req, res) => {
      const user = req.body;
      const query = { email: user.email };
      const exixtingUser = await usersCollection.findOne(query);
      console.log("exixting user ", exixtingUser);
      if (exixtingUser) {
        return res.send({ message: "User All ready exist" });
      }
      const result = await usersCollection.insertOne(user);
      res.send(result);
    });
    // get all users

    app.get("/users", async (req, res) => {
      const result = await usersCollection.find().toArray();
      res.send(result);
    });

    // GET all package
    app.get("/packages", async (req, res) => {
      const cursor = packagesCollection.find({});
      const packages = await cursor.toArray();
      res.send(packages);
    });

    // POST add package
    app.post("/addPackage", async (req, res) => {
      const package = req.body;
      const result = await packagesCollection.insertOne(package);
      res.json(result);
    });

    // GET all Activities
    app.get("/activities", async (req, res) => {
      const cursor = activitiesCollection.find({});
      const activities = await cursor.toArray();
      res.send(activities);
    });

    // delete package

    app.delete("/packages/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await packagesCollection.deleteOne(query);
      res.send(result);
    });

    // GET single package

    app.get("/packageDetails/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const package = await packagesCollection.findOne(query);
      res.json(package);
    });

    // add booking api
    app.post("/booking", async (req, res) => {
      const booked = req.body;
      const result = await bookingCollection.insertOne(booked);
      res.json(result);
    });

    //get All user booking api

    app.get("/booking", async (req, res) => {
      const result = await bookingCollection.find({}).toArray();
      res.send(result);
    });

    // get my all booking
    app.get("/booking/:email", async (req, res) => {
      const result = await bookingCollection
        .find({
          email: req.params.email,
        })
        .toArray();
      res.send(result);
    });

    //update status
    app.put("/manageAllBooking/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const option = { upsert: true };
      const updateDoc = {
        $set: {
          status: "Approved",
        },
      };
      const result = await bookingCollection.updateOne(
        query,
        updateDoc,
        option
      );
      res.send(result);
    });

    // Delete user order

    app.delete("/manageAllBooking/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await bookingCollection.deleteOne(query);
      res.json(result);
    });
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

// default route
app.get("/", (req, res) => {
  res.send("New traveler 2024");
});

// listen port
app.listen(port, () => {
  console.log("Best Travel site ", port);
});
