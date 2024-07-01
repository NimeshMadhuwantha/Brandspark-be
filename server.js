import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';

const app = express();
const PORT = 5000;
const URL = "mongodb+srv://nethhari:Chemma%40mongodb@cluster0.6co1avu.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

app.use(bodyParser.json());

mongoose.connect(URL)
/*    .then(() => {
        console.log("Connected")
    })
    .catch((e) => {
        console.log("DB error", e)
    })  */

app.listen(PORT, () => console.log("Server is up"));