const express = require("express");
const mysql = require("mysql2");
const jwt = require("jsonwebtoken");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
const port = 5000;

const secretKey = "laravel";
app.use(cors());
// Middleware untuk memparsing request body sebagai JSON
app.use(bodyParser.json());

// Konfigurasi koneksi database
const db = mysql.createConnection({
  host: "localhost",
  user: "root", // ganti dengan user MySQL Anda
  password: "", // ganti dengan password MySQL Anda
  database: "db_website", // ganti dengan nama database Anda
});

// Koneksi ke database
db.connect((err) => {
  if (err) {
    console.error("Error connecting to the database:", err);
    return;
  }
  console.log("Connected to the database.");
});

app.post("/login"),
  (req, res) => {
    const { username, password } = req.body;
    const sql = "SELECT * FROM admin WHERE username = ? AND password = ?";
    db.query(sql, [username, password], (err, results) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      if (results.length > 0) {
        const user = results[0];
        const token = jwt.sign(
          { id: user.id, user: user.username },
          secretKey,
          { expiresIn: "24h" }
        );
        res.status(200).json({ success: true, token });
      } else {
        res.status(401).json({ success: false, message: "Invalid Credetials" });
      }
    });
  };

/* =========== ADMIN!!!! ==========*/

app.get("/admin", (req, res) => {
  const sql = "SELECT * FROM admin";
  db.query(sql, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
});

//Insert data
app.post("/admin", (req, res) => {
  const { nama, username, email, password } = req.body;

  if (!nama || !username || !email || !password) {
    return res
      .status(400)
      .send("nama, username, email, password an are required");
  }
  const query =
    "INSERT INTO admin (nama, username, email, password) VALUES (?, ?, ?, ?)";
  db.execute(query, [nama, username, email, password], (err, results) => {
    if (err) {
      console.error("Error executing query:", err);
      return res.status(500).send("Error inserting data");
    }
    res.status(201).send("Data inserted successfully");
  });
});

// Update data
app.put("/admin/:id", (req, res) => {
  const { id } = req.params;
  const { nama, username, email, password } = req.body;
  const query =
    "UPDATE admin SET nama = ?, username = ?, email = ?, password = ? WHERE id = ?";

  db.query(query, [nama, username, email, password, id], (err, result) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.send("User updated successfully!");
    }
  });
});

//Delete Data
app.delete("/admin/:id", (req, res) => {
  const { id } = req.params;
  const sql = "DELETE FROM admin WHERE id = ?";

  db.query(sql, [id], (err, result) => {
    if (err) {
      res.status(500).send(err);
    } else if (result.affectedRows === 0) {
      res.status(404).send("User not found");
    } else {
      res.send("User deleted successfully!");
    }
  });
});

//Read Datas
app.get("/admin/:id", (req, res) => {
  const { id } = req.params.id;
  const sql = "SELECT * FROM admin WHERE id = ?";

  db.query(sql, [id], (err, result) => {
    if (err) {
      res.status(500).send(err);
    } else if (result.length === 0) {
      res.status(404).send("User not found");
    } else {
      res.json(result[0]);
    }
  });
});

/* =========== KONTEN!!!! ==========*/

app.get("/content", (req, res) => {
  const sql = "SELECT * FROM content";
  db.query(sql, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
});

//Insert data
app.post("/content", (req, res) => {
  const { title, content, category } = req.body;

  if (!title || !content || !category) {
    return res.status(400).send("title, content, category an are required");
  }
  const query =
    "INSERT INTO content (title, content, category) VALUES (?, ?, ?)";
  db.execute(query, [title, content, category], (err, results) => {
    if (err) {
      console.error("Error executing query:", err);
      return res.status(500).send("Error inserting data");
    }
    res.status(201).send("Data inserted successfully");
  });
});

// Update data
app.put("/content/:id", (req, res) => {
  const { id } = req.params;
  const { title, content, category } = req.body;
  const sql =
    "UPDATE content SET title = ?, content = ?, category = ?  WHERE id = ?";

  db.query(sql, [title, content, category, id], (err, result) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.send("User updated successfully!");
    }
  });
});

//Delete Data
app.delete("/content/:id", (req, res) => {
  const { id } = req.params;
  const sql = "DELETE FROM content WHERE id = ?";

  db.query(sql, [id], (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(200).json({ message: "Data Berhasil Dihapus", data: result });
  });
});

//Read Datas
app.get("/content/:id", (req, res) => {
  const userId = req.params.id;
  const query = "SELECT * FROM content WHERE id = ?";

  db.query(query, [userId], (err, result) => {
    if (err) {
      res.status(500).send(err);
    } else if (result.length === 0) {
      res.status(404).send("User not found");
    } else {
      res.json(result[0]);
    }
  });
});

/* =========== MEMBER!!!! ==========*/

app.get("/member", (req, res) => {
  const sql = "SELECT * FROM member";
  db.query(sql, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
});

//Insert data
app.post("/member", (req, res) => {
  const { nama, username, email, password } = req.body;

  if (!nama || !username || !email || !password) {
    return res
      .status(400)
      .send("nama, username, email, password an are required");
  }
  const query =
    "INSERT INTO member (nama, username, email, password) VALUES (?, ?, ?, ?)";
  db.execute(query, [nama, username, email, password], (err, results) => {
    if (err) {
      console.error("Error executing query:", err);
      return res.status(500).send("Error inserting data");
    }
    res.status(201).send("Data inserted successfully");
  });
});

// Update data
app.put("/member/:id", (req, res) => {
  const { id } = req.params;
  const { nama, username, email, password } = req.body;
  const query =
    "UPDATE member SET nama = ?, username = ?, email = ?, password = ? WHERE id = ?";

  db.query(query, [nama, username, email, password, id], (err, result) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.send("User updated successfully!");
    }
  });
});

//Delete Data
app.delete("/member/:id", (req, res) => {
  const { id } = req.params;
  const sql = "DELETE FROM member WHERE id = ?";

  db.query(sql, [id], (err, result) => {
    if (err) {
      res.status(500).send(err);
    } else if (result.affectedRows === 0) {
      res.status(404).send("User not found");
    } else {
      res.send("User deleted successfully!");
    }
  });
});

//Read Datas
app.get("/member/:id", (req, res) => {
  const { id } = req.params.id;
  const sql = "SELECT * FROM members WHERE id = ?";

  db.query(sql, [id], (err, result) => {
    if (err) {
      res.status(500).send(err);
    } else if (result.length === 0) {
      res.status(404).send("User not found");
    } else {
      res.json(result[0]);
    }
  });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
