import { createPool } from "mysql2/promise";
import "dotenv/config";

const pool = createPool({
    host: process.env.NODE_ENV != "production" ? process.env.DBHOST : "db",
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    port: process.env.NODE_ENV != "production" ? 2255 : 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
  });

export default pool;