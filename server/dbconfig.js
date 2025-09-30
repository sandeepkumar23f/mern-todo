import { MongoClient } from "mongodb";

const url = "mongodb+srv://todouser:todouser123@cluster0.f2gjwjm.mongodb.net/node-project?retryWrites=true&w=majority&appName=Cluster0";

const dbName = "todo-project";
export const collectionName = "todo";

const client = new MongoClient(url);

export const connection = async () => {
  const connect = await client.connect();
  console.log("MongoDB Connected!");
  return connect.db(dbName);
};
