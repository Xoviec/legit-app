import mysql from "mysql";

const connection = mysql.createConnection({
    host: "localhost",
    database: "legited",  // Poprawka w nazwie bazy danych
    user: "root",
    password: ""
});

export default connection;