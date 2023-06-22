const prompt = require('prompt-sync')();
const MongoClient = require('mongodb').MongoClient;

class Politician {
  constructor(name, voteCount) {
    this.name = name;
    this.voteCount = voteCount;
  }
}

class NPartyPolitician {
  constructor(name) {
    this.name = name;
    this.politicians = [];
  }

  addPolitician(politician) {
    this.politicians.push(politician);
  }

  getMaxVoteCount() {
    let maxVoteCount = 0;
    let maxVotePolitician = null;

    for (const politician of this.politicians) {
      if (politician.voteCount > maxVoteCount) {
        maxVoteCount = politician.voteCount;
        maxVotePolitician = politician;
      }
    }

    return maxVotePolitician;
  }

  getMinVoteCount() {
    let minVoteCount = Infinity;
    let minVotePolitician = null;

    for (const politician of this.politicians) {
      if (politician.voteCount < minVoteCount) {
        minVoteCount = politician.voteCount;
        minVotePolitician = politician;
      }
    }

    return minVotePolitician;
  }
}

async function savePoliticianData(politicians) {
  const url = 'mongodb+srv://tarunsbsc22:tarun2003@cluster0.x0xgain.mongodb.net/see?retryWrites=true&w=majority';
  const dbName = 'politics';
  const collectionName = 'politicians';

  const client = new MongoClient(url);

  try {
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection(collectionName);

    // Delete existing documents in the collection
    await collection.deleteMany({});

    // Insert new documents
    await collection.insertMany(politicians);

    console.log('Politician data saved to MongoDB successfully.');
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.close();
  }
}

async function readPoliticianData() {
  const url = 'mongodb+srv://tarunsbsc22:tarun2003@cluster0.x0xgain.mongodb.net/see?retryWrites=true&w=majority';
  const dbName = 'politics';
  const collectionName = 'politicians';

  const client = new MongoClient(url);

  try {
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection(collectionName);

    // Find all documents in the collection
    const politicians = await collection.find().toArray();
    console.log('Politician data retrieved from MongoDB:');
    console.log(politicians);
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.close();
  }
}

async function updatePoliticianData(politicianName, newVoteCount) {
  const url = 'mongodb+srv://tarunsbsc22:tarun2003@cluster0.x0xgain.mongodb.net/see?retryWrites=true&w=majority';
  const dbName = 'politics';
  const collectionName = 'politicians';

  const client = new MongoClient(url);

  try {
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection(collectionName);

    // Update the vote count for the given politician
    const result = await collection.updateOne(
      { name: politicianName },
      { $set: { voteCount: newVoteCount } }
    );

    console.log('Politician data updated in MongoDB successfully.');
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.close();
  }
}

async function deletePoliticianData(politicianName) {
  const url = 'mongodb+srv://tarunsbsc22:tarun2003@cluster0.x0xgain.mongodb.net/see?retryWrites=true&w=majority';
  const dbName = 'politics';
  const collectionName = 'politicians';

  const client = new MongoClient(url);

  try {
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection(collectionName);

    // Delete the document for the given politician
    const result = await collection.deleteOne({ name: politicianName });

    console.log('Politician data deleted from MongoDB successfully.');
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.close();
  }
}

async function main() {
  const n = parseInt(prompt("Enter the number of party-politicians: "));
  const nPartyPolitician = new NPartyPolitician('N Party');

  for (let i = 0; i < n; i++) {
    const politicianName = prompt(`Enter politician's name ${i + 1}: `);
    const voteCount = parseInt(prompt(`Enter vote count for ${politicianName}: `));
    const politician = new Politician(politicianName, voteCount);
    nPartyPolitician.addPolitician(politician);
  }

  const politicians = nPartyPolitician.politicians;

  // Call the function to save politician data to MongoDB
  await savePoliticianData(politicians);

  // Call the function to read and display politician data from MongoDB
  await readPoliticianData();

  const politicianNameToUpdate = prompt("Enter the name of the politician to update: ");
  const newVoteCount = parseInt(prompt("Enter the new vote count: "));

  // Call the function to update politician data in MongoDB
  await updatePoliticianData(politicianNameToUpdate, newVoteCount);

  // Call the function to read and display updated politician data from MongoDB
  await readPoliticianData();

  const politicianNameToDelete = prompt("Enter the name of the politician to delete: ");

  // Call the function to delete politician data from MongoDB
  await deletePoliticianData(politicianNameToDelete);

  // Call the function to read and display updated politician data from MongoDB
  await readPoliticianData();
}

main();