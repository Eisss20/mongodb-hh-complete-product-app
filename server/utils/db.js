import { MongoClient } from "mongodb";


/// เชื่อมต่อ DB คล้ายกับ connection pool 
const connectionString = "mongodb://127.0.0.1:27017"


export const client = new MongoClient(connectionString, {
    useUnifiedTopology: true,  /// สามารถกำหนด condition ในการเชื่อมต่อ Pool ได้
  });
  
  await client.connect();
  export const db = client.db("practice-mongo"); /// ชื่อ database
