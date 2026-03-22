import express from "express";
import authroutes from "./routes/auth.js";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: process.env.CLIENT_URL || "https://my-todo-fjao.onrender.com",
    credentials: true
}));

app.use("/api/auth", authroutes);

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});

