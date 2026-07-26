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
// const verifyRole = async (req, res, next) => {
//     const authHeader = req.headers.authorization;
//     if (!authHeader || !authHeader.startsWith("Bearer")) {
//         return res.status(401).json({ msg: "Unauthorized" })
//     }
//     const token = authHeader.split(" ")[1]
//     console.log(token)
//     if (!token) {
//         return res.status(401).json({ msg: "Unauthorized" })
//     }
//     try {
//         const { payload } = await jwtVerify(token, JWKS)
//         console.log(payload)
//         if (payload.role === "founder") {
//             return next()
//         }
//         res.status(401).json({ message: "Unauthorized" })
//     } catch (error) {
//         console.log(error);
//         return res.status(401).json({ msg: "Unauthorized" })
//     }
// }



async function run() {
    try {
        await client.connect()

        const database = client.db("my-kitchen_db")
       
      
      

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