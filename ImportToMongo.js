const { MongoClient } = require('mongodb');
const fs = require('fs');

// Replace with your actual connection string
const uri = 'mongodb+srv://aayanpeerzade:ayan237@cluster0.fmawibu.mongodb.net/';
const client = new MongoClient(uri);

async function importData() {
  try {
    await client.connect();
    const database = client.db('college_predictor'); // replace with your DB name
    const collection = database.collection('cutoffs'); // replace with your collection name

    const data = JSON.parse(fs.readFileSync('./cutoff_data.json', 'utf-8'));

    if (!Array.isArray(data)) {
      console.error('JSON file should contain an array of objects.');
      return;
    }

    const result = await collection.insertMany(data);
    console.log(`✅ Successfully inserted ${result.insertedCount} documents.`);
  } catch (err) {
    console.error('❌ Import failed:', err);
  } finally {
    await client.close();
  }
}

importData();
