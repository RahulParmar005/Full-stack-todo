import pg, { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl:
        process.env.NODE_ENV === "productiion" ? {rejectUnauthorized: false} : false,

    // user: process.env.DB_USER,
    // host: process.env.DB_HOST,
    // database: process.env.DB_NAME,
    // password: process.env.DB_PASSWORD,
    // port: process.env.DB_PORT
});

pool.on("connect", () => {
    console.log("Connected to the Data Base");
});

pool.on("error", (err) => {
    console.error("Databaase error " + err);
});

export default pool;