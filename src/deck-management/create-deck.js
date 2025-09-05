import fetchCard from './fetch-card';

export default async function createDeck(deck, setState) {
  try {
    const response = await fetch(`/decks/${deck}.json`); // reads the decks files from public folder
    if (!response.ok) return;
    const data = await response.json(); // return the data on it

    // creating an array for land cards containing its descriptions
    const landsArray = await Promise.all(
      data.lands.map(async (land) => {
        const landData = await fetchCard(land.type);
        const landObject = { ...land, ...landData };
        return landObject;
      })
    );

    // creating an array for creature cards containing its descriptions
    const creaturesArray = await Promise.all(
      data.creatures.map(async (creature) => {
        const creatureData = await fetchCard(creature.name);
        const cardObject = { ...creature, ...creatureData };
        return cardObject;
      })
    );

    // creating an array of spell cards containing its descriptions
    const spellsArray = await Promise.all(
      data.spells.map(async (spell) => {
        const spellData = await fetchCard(spell.name);
        const spellObject = { ...spell, ...spellData };
        return spellObject;
      })
    );

    let name = '';
    deck === 'angel-army'
      ? (name = 'Angel Army')
      : deck === 'vile-force'
        ? (name = 'Vile Force')
        : (name = 'The Resistance');

    // setting the cards to a setter function (any of the three decks)
    return setState({
      name: name,
      lands: landsArray,
      creatures: creaturesArray,
      spells: spellsArray,
    });
  } catch (error) {
    throw new Error(`Couldn't create deck. ${error.message}`);
  }
}
