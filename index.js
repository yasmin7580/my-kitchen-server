const express = require('express');
const dotenv = require("dotenv")
const cors = require("cors")
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const { createRemoteJWKSet, jwtVerify } = require('jose-cjs');

dotenv.config()
const app = express();
const port = process.env.PORT || 8000;
app.use(cors())
app.use(express.json())



const uri = process.env.MONGODB_URI;

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

const JWKS = createRemoteJWKSet(new URL(`${process.env.CLIENT_URL}/api/auth/jwks`))
const verifyToken = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer")) {
        return res.status(401).json({ msg: "Unauthorized" })
    }
    const token = authHeader.split(" ")[1]
    console.log(token)
    if (!token) {
        return res.status(401).json({ msg: "Unauthorized" })
    }
    try {
        const { payload } = await jwtVerify(token, JWKS)
        req.user = payload
        console.log("data", payload)
        next()
    } catch (error) {
        console.log(error);
        return res.status(401).json({ msg: "Unauthorized" })
    }
}




async function run() {
    try {
        // await client.connect()

        const database = client.db("my-kitchen")
        const allRecipeCollection = database.collection("recipe")




        // all recipe api

        app.get("/recipes", async (req, res) => {
            const result = await allRecipeCollection.find().toArray()
            res.send(result)
        })

        app.post("/recipes", async (req, res) => {
            const recipe = req.body
            const result = await allRecipeCollection.insertOne(recipe)
            res.send(result)
        })


        // my recipe api
        app.get("/my-recipes", async (req, res) => {
            const userEmail = req.query
            const result = await recipesCollection.find(userEmail).toArray();
            res.send(result);
        });

        // update api
        app.patch("/recipes/:id", async (req, res) => {
            const { id } = req.params
            const data = req.body
            const query = { _id: new ObjectId(id) }
            const update = {
                $set: data
            }
            const result = await allRecipeCollection.updateOne(query, update)
            res.send(result)
        })


        // delete api
        app.delete("/recipe/:id", async (req, res) => {
            const { id } = req.params
            const query = { _id: new ObjectId(id) }
            const result = await allRecipeCollection.deleteOne(query)
            res.send(result)
        })


        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {

    }
}
run().catch(console.dir);









































app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.listen(port, () => {
    // console.log(`Example app listening on port ${port}`);
});