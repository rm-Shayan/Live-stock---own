import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import dns from "node:dns";
import cookieParser from "cookie-parser"
import routeAllcoaion from './src/routes/allocation.js';
import { connectDb } from './src/config/db.js';
import router from './src/routes/auth.js';
import routeBatch from './src/routes/Batch.js';
import receiveRoute from './src/routes/receiveRoute.js';
dns.setServers(["1.1.1.1", "8.8.8.8"]);
import slaughterRouter from './src/routes/slaughterRoute.js';
import processingRouter from './src/routes/processingRoute.js';
import inventoryRouter from './src/routes/inventoryRoute.js';

dotenv.config()
let app = express()


app.use(cors({
    origin: ["http://localhost:5173", "http://localhost:8081"],
    credentials: true
}))
app.use(express.json())
app.use(cookieParser())

app.get("/", (req, res) => {
    res.send("Welcome to Live Stock API");
})

app.use("/api", router)
app.use("/api", routeBatch)
app.use("/api", routeAllcoaion);
app.use("/api", receiveRoute);
app.use("/api", slaughterRouter);
app.use("/api", processingRouter);
app.use("/api", inventoryRouter);


connectDb().then(() => {
    console.log("Connected to database");

app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});

}).catch((err) => {
    console.error("Failed to connect to database", err);
    process.exit(1);
});
