class Party {
  constructor(name) {
    this.name = name;
    this.politicians = [];
  }

  addPolitician(politician) {
    this.politicians.push(politician);
  }

  getPoliticians() {
    return this.politicians;
  }
}

class Politician {
  constructor(name, party) {
    this.name = name;
    this.party = party;
  }

  getParty() {
    return this.party;
  }
}

function createPartyPoliticians() {
  const partyA = new Party("Party A");

  const politician1 = new Politician("John Doe", partyA);
  const politician2 = new Politician("Jane Smith", partyA);

  partyA.addPolitician(politician1);
  partyA.addPolitician(politician2);

  return partyA;
}

function main() {
  const party = createPartyPoliticians();
  const politicians = party.getPoliticians();

  console.log(`Party: ${party.name}`);
  console.log(`Number of politicians: ${politicians.length}`);
  console.log("Politicians:");
  politicians.forEach((politician) => {
    console.log(`${politician.name} (${politician.getParty().name})`);
  });
}

main();
