const prompt = require('prompt-sync')();
const mongoose = require('mongoose');

// Define the Politician schema
const politicianSchema = new mongoose.Schema({
  name: String,
  voteCount: Number
});

// Define the Politician model
const Politician = mongoose.model('Politician', politicianSchema);

class NPartyPolitician {
  constructor(name) {
    this.name = name;
    this.politicians = [];
    this.maxVotePolitician = null; // Track the politician with the maximum vote count
  }

  addPolitician(politician) {
    this.politicians.push(politician);
    if (
      this.maxVotePolitician === null ||
      politician.voteCount > this.maxVotePolitician.voteCount
    ) {
      this.maxVotePolitician = politician;
    }
  }

  getMaxVotePolitician() {
    return this.maxVotePolitician;
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
  try {
    await Politician.deleteMany({}); // Delete existing documents

    // Insert new documents
    await Politician.insertMany(politicians);

    console.log('Politician data saved to MongoDB successfully.');
  } catch (error) {
    console.error('Error:', error);
  }
}

async function readPoliticianData() {
  try {
    const politicians = await Politician.find();
    console.log('Politician data retrieved from MongoDB:');
    console.log(politicians);
  } catch (error) {
    console.error('Error:', error);
  }
}

async function updatePoliticianData(politicianName, newVoteCount) {
  try {
    const result = await Politician.updateOne(
      { name: politicianName },
      { $set: { voteCount: newVoteCount } }
    );

    console.log('Politician data updated in MongoDB successfully.');
  } catch (error) {
    console.error('Error:', error);
  }
}

async function deletePoliticianData(politicianName) {
  try {
    const result = await Politician.deleteOne({ name: politicianName });

    console.log('Politician data deleted from MongoDB successfully.');
  } catch (error) {
    console.error('Error:', error);
  }
}

async function main() {
  await mongoose.connect('mongodb+srv://tarunsbsc22:tarun2003@cluster0.x0xgain.mongodb.net/see?retryWrites=true&w=majority'); // Connect to MongoDB

  const n = parseInt(prompt("Enter the number of party-politicians: "));
  const nPartyPolitician = new NPartyPolitician('N Party');

  for (let i = 0; i < n; i++) {
    const politicianName = prompt(`Enter politician's name ${i + 1}: `);
    const voteCount = parseInt(prompt(`Enter vote count for ${politicianName}: `));
    const politician = new Politician({ name: politicianName, voteCount });
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

  const maxVotePolitician = nPartyPolitician.getMaxVotePolitician();
  console.log(`Politician with the maximum vote count: ${maxVotePolitician.name}`);

  mongoose.disconnect(); // Disconnect from MongoDB
}

main();