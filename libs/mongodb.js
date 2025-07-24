import { MongoClient } from "mongodb";
import mongoose from "mongoose";

// TODO: сделать проверку на индексы в users

const MONGODB_URI = process.env.MONGODB_URI;
const MONGODB_DB = process.env.MONGODB_DB ?? "webdev-hw-api";

// check the MongoDB URI
if (!MONGODB_URI) {
  throw new Error("Define the MONGODB_URI environmental variable");
}

let cachedClient = null;
let cachedDb = null;

export async function connectToDatabase() {
  // check the cached.
  if (cachedClient && cachedDb) {
    // load from cache
    return {
      client: cachedClient,
      db: cachedDb,
    };
  }

  // set the connection options
  const opts = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  };

  // Connect to cluster
  let client = new MongoClient(MONGODB_URI, opts);
  await client.connect();
  let db = client.db(MONGODB_DB);

  // set cache
  cachedClient = client;
  cachedDb = db;

  return {
    client: cachedClient,
    db: cachedDb,
  };
}

let cachedMongooseClient = null;

export async function connectToMongoose() {
  // check the cached.
  if (cachedMongooseClient && cachedDb) {
    // load from cache
    return {
      client: cachedClient,
      db: cachedDb,
    };
  }

  // Connect to cluster
  cachedMongooseClient = await mongoose.connect(MONGODB_URI, {
    dbName: MONGODB_DB,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  return {
    mongooseClient: cachedMongooseClient,
  };
}
