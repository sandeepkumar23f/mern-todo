import express from "express";
import { connection, collectionName } from "./dbconfig.js";
import cors from "cors";
import { ObjectId } from "mongodb";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
const app = express();
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(cookieParser());

// SIGNUP
app.post("/signup", async (req, res) => {
  const userData = req.body;
  if (userData.email && userData.password) {
    const db = await connection();
    const collection = await db.collection("users");
    const result = await collection.insertOne(userData);
    if (result) {
      const tokenData = { _id: result.insertedId, email: userData.email }; 
      jwt.sign(tokenData, "Google", { expiresIn: "5d" }, (error, token) => {
        if (error)
          return res.status(500).send({ success: false, message: "JWT error" });
        res.cookie("token", token, {
          httpOnly: true,
          secure: false, // set to true in production with HTTPS
          sameSite: "lax",
          maxAge: 5 * 24 * 60 * 60 * 1000, // 5 days
        });
        res.send({ success: true, message: "signup done" });
      });
    }
  } else {
    res.send({
      success: false,
      message: "sign up not done",
    });
  }
});

// LOGIN
app.post("/login", async (req, res) => {
  const userData = req.body;
  if (userData.email && userData.password) {
    const db = await connection();
    const collection = await db.collection("users");
    const result = await collection.findOne({
      email: userData.email,
      password: userData.password,
    });
    if (result) {
      const tokenData = { _id: result._id, email: result.email }; 
      jwt.sign(tokenData, "Google", { expiresIn: "5d" }, (error, token) => {
        if (error)
          return res.status(500).send({ success: false, message: "JWT error" });
        res.cookie("token", token, {
          httpOnly: true,
          secure: false,
          sameSite: "lax",
          maxAge: 5 * 24 * 60 * 60 * 1000, // 5 days
        });
        res.send({ success: true, message: "signup done" });
      });
    } else {
      res.send({
        success: false,
        message: "login failed",
      });
    }
  } else {
    res.send({
      success: false,
      message: "login not done",
    });
  }
});

app.post("/add-task", verifyJWTToken, async (req, res) => {
  try {
    const task = {
      ...req.body,
      userId: new ObjectId(req.user._id),
      createdAt: new Date(),
    };

    if (!task.title || !task.description) {
      return res.status(400).json({
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
    const collection = db.collection(collectionName);

    const tasks = await collection
      .find({ userId: new ObjectId(req.user._id) }) 
      .toArray();

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

app.get("/task/:id", verifyJWTToken, async (req, res) => {
  try {
    const db = await connection();
    const collection = db.collection(collectionName);
    const id = req.params.id;
    const task = await collection.findOne({
      _id: new ObjectId(id),
      userId: new ObjectId(req.user._id),
    });

    if (!task) {
      return res
        .status(404)
        .json({ success: false, message: "Task not found" });
    }

    res.status(200).json({ success: true, message: "Task fetched", task });
  } catch (err) {
    console.error("Error fetching task:", err.message);
    res
      .status(500)
      .json({ success: false, message: "Server error", error: err.message });
  }
});

app.put("/update-task/:id", verifyJWTToken, async (req, res) => {
  try {
    const db = await connection();
    const collection = db.collection(collectionName);
    const id = req.params.id;
    const { title, description } = req.body;

    const update = { $set: { title, description } };
    const result = await collection.updateOne(
      { _id: new ObjectId(id), userId: new ObjectId(req.user._id) }, 
      update
    );

    if (result.modifiedCount > 0) {
      res
        .status(200)
        .json({ success: true, message: "Task updated successfully" });
    } else {
      res
        .status(404)
        .json({ success: false, message: "Task not found or no changes made" });
    }
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

    const result = await collection.deleteOne({
      _id: new ObjectId(id),
      userId: new ObjectId(req.user._id),
    });

    if (result.deletedCount > 0) {
      res.status(200).json({ success: true, message: "Task deleted" });
    } else {
      res.status(404).json({ success: false, message: "Task not found" });
    }
  } catch (err) {
    console.error("Error deleting task:", err.message);
    res
      .status(500)
      .json({ success: false, message: "Server error", error: err.message });
  }
});

function verifyJWTToken(req, res, next) {
  const token = req.cookies["token"];
  if (!token) {
    return res.status(401).json({ success: false, message: "No token found" });
  }

  jwt.verify(token, "Google", (error, decoded) => {
    if (error) {
      return res.status(403).json({ message: "invalid token", success: false });
    }

    req.user = decoded;
    next();
  });
}

app.listen(5000, () => console.log("Server running on port 5000"));
