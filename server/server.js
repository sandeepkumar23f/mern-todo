import express from "express";
import { connection, collectionName } from "./dbconfig.js";
import cors from "cors";
import { ObjectId } from "mongodb";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
const app = express();
app.use(express.json());
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}))
app.use(cookieParser())

app.post("/signup", async (req, res) => {
  const userData = req.body;
  if (userData.email && userData.password) {
    const db = await connection();
    const collection = await db.collection('users');
    const result = await collection.insertOne(userData)
    if(result){
      jwt.sign(userData, "Google", { expiresIn: "5d" }, (error, token) => {
      res.send({
        success: true,
        message: 'signup done',
        token
      })
    });
    }
  } else{
    res.send({
        success: false,
        message: "sign up not done"
    })
  }
});

app.post("/login", async (req, res) => {
  const userData = req.body;
  if (userData.email && userData.password) {
    const db = await connection();
    const collection = await db.collection('users');
    const result = await collection.findOne({email:userData.email,password:userData.password })
    if(result){
      jwt.sign(userData, "Google", { expiresIn: "5d" }, (error, token) => {
      res.send({
        success: true,
        message: 'login done',
        token
      })
    });
    } else{
      res.send({
        success: false,
        message: 'login failed'
      })
    }
  } else{
    res.send({
        success: false,
        message: "login not done"
    })
  }
});

app.post("/add-task", verifyJWTToken, async (req, res) => {
  try {
    const task = req.body;

    // Optional: simple validation
    if (!task.title || !task.description) {
      return res
        .status(400)
        .json({
          success: false,
          message: "Title and description are required",
        });
    }

    const db = await connection();
    const collection = db.collection(collectionName);
    const result = await collection.insertOne(task);

    if (result.acknowledged) {
      res
        .status(201)
        .json({ success: true, message: "New task added", result });
    } else {
      res.status(500).json({ success: false, message: "Task not added" });
    }
  } catch (err) {
    console.error("Error adding task:", err.message);
    res
      .status(500)
      .json({ success: false, message: "Server error", error: err.message });
  }
});



app.get("/tasks", verifyJWTToken, async (req, res) => {
  try {
    const db = await connection();
    console.log("cookies")
    const collection = db.collection(collectionName);

    // Fetch all tasks
    const tasks = await collection.find({}).toArray();

    res
      .status(200)
      .json({ success: true, message: "Task list fetched", tasks });
  } catch (err) {
    console.error("Error fetching tasks:", err.message);
    res
      .status(500)
      .json({ success: false, message: "Server error", error: err.message });
  }
});

app.get("/task/:id",verifyJWTToken, async (req, res) => {
  try {
    const db = await connection();
    const collection = db.collection(collectionName);
    const id = req.params.id;
    const tasks = await collection.findOne({ _id: new ObjectId(id) });

    res.status(200).json({ success: true, message: "Task fetched", tasks });
  } catch (err) {
    console.error("Error fetching tasks:", err.message);
    res
      .status(500)
      .json({ success: false, message: "Server error", error: err.message });
  }
});



app.put("/update-task", verifyJWTToken, async (req, res) => {
  try {
    const db = await connection();
    const collection = db.collection(collectionName);
    const { _id, ...fields } = req.body;
    const update = { $set: fields };

    console.log(fields);

    const tasks = await collection.updateOne(
      { _id: new ObjectId(_id) },
      update
    );

    res.status(200).json({ success: true, message: "Task updated", tasks });
  } catch (err) {
    console.error("Error updating task:", err.message);
    res
      .status(500)
      .json({ success: false, message: "Server error", error: err.message });
  }
});

app.delete("/delete/:id", verifyJWTToken, async (req, res) => {
  try {
    const db = await connection();
    const collection = db.collection(collectionName);
    const id = req.params.id;
    const tasks = await collection.deleteOne({ _id: new ObjectId(id) });

    res.status(200).json({ success: true, message: "Task deleted", tasks });
  } catch (err) {
    console.error("Error fetching tasks:", err.message);
    res
      .status(500)
      .json({ success: false, message: "Server error", error: err.message });
  }
});

function verifyJWTToken(req, res, next) {
  const token = req.cookies['token'];
  jwt.verify(token, 'Google', (error, decoded) => {
    if (error) {
      return res.send({
        message: "invalid token",
        success: false
      });
    }

    console.log(decoded);
    next();
  });
}
app.listen(5000, () => console.log("Server running on port 5000"));
