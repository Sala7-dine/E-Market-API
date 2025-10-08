import express from "express";
import connectDB from "./config/db.js";
import dotenv from "dotenv";
import productData from "./routes/productRoutes.js";


const app = express();

dotenv.config();


const Port = process.env.PORT || 3000;
const MongoUri = process.env.MONGO_URI;

app.use(express.json());

await connectDB(MongoUri);


// app.get('/' , (req , res) => {
//     res.send("API CONNECTED SUCCESSFULLY");
// })

app.use('/api/products' , productData);


app.listen(Port , () => {
    console.log("server successfully connect to http://localhost:3000");
});
