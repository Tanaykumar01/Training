import dotenv from "dotenv"
import connectDB from "./db/index.js";
import {app} from './app.js'
dotenv.config({
    path: './.env'
})
connectDB()
.then(() => {
    app.listen(process.env.PORT || 8000, () => {
        console.log(`⚙️ Server is running at port : ${process.env.PORT}`);
    })
    app.get('/', (req, res) => {
        res.send("Welcome to the TODO API");
    });
})
.catch((err) => {
    console.log("MONGO db connection failed !!! ", err);
})