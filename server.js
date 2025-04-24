const express = require("express");
const path = require("path");
const mysql = require("mysql2");
const app = express();
const port = 3000;

// Database connection
const pool = mysql.createPool({
  connectionLimit: 10,
  host: "localhost",
  user: "root",
  password: "root",
  database: "bookportal3",
  port: 3306,
});

// Test database connection
pool.getConnection((err, connection) => {
  if (err) {
    console.error("Error connecting to the database:", err);
    return;
  }
  console.log("Successfully connected to the database!");
  connection.release();
});

// Serve static files
app.use(express.static(path.join(__dirname, "")));
app.use("/HTML", express.static(path.join(__dirname, "HTML")));
app.use("/CSS", express.static(path.join(__dirname, "CSS")));
app.use("/JavaScript", express.static(path.join(__dirname, "JavaScript")));
app.use("/Media", express.static(path.join(__dirname, "Media")));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve contactUs.html for root path
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "HTML", "contactUs.html"));
});

// Handle contact form submission
app.post("/submit-contact", (req, res) => {
  console.log("Received data:", req.body);
  const {
    Fname,
    Lname,
    gender,
    mobile,
    DB,
    email,
    language,
    message = "",
  } = req.body;

  // Backend validation (simple)
  if (!Fname || !Lname || !gender || !mobile || !DB || !email || !language) {
    console.log("Missing required fields!");
    return res.status(400).json({ errors: "Missing required fields." });
  }

  const insertQuery = `
    INSERT INTO ContactUs 
    (Fname, Lname, gender, mobile, DB, email, language, message) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;
  const values = [Fname, Lname, gender, mobile, DB, email, language, message];

  pool.query(insertQuery, values, (err, results) => {
    if (err) {
      console.error("Database insert error:", err.message, err.sql);
      return res.status(500).json({ errors: `Database error: ${err.message}` });
    }
    console.log("Data saved successfully!", results);
    // Return Fname and email in the response
    res.status(200).json({ message: "Success", Fname, email });
  });
});

// Start server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});