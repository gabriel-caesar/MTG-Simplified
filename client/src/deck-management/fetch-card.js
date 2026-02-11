export default async function fetchCard(name) {

  try {
    // fetching the card from Scryfall
    const response = await fetch(
      `https://api.scryfall.com/cards/named?exact=${name}`
    );
    if (!response.ok) {
      throw new Error(`Couldn't get a successful response`);
    }

    // awaiting the card data
    const data = await response.json();
  
    // maintaing only the card properties that we want
    const card = {
      name: data.name,
      power: data.power,
      toughness: data.toughness,
      'color': data['color_identity'],
      'legendary': data['frame_effects'],
      foil: data.foil,
      'image_uris': data['image_uris'],
      'mana_cost': data['mana_cost'],
      'id': data['mtgo_id'],
      'type': data['type_line'],
      description: data.flavor_text,
    };

    // if the card is a mana, we add a (activated) property to it
    if (card.name === 'Plains' || card.name === 'Swamp') {
      const landCard = {
        ...card,
        activated: false, // if mana was activated to deploy a card
        used: false, // if mana was used to deploy a card
      }
      return landCard;
    } else {
      if (card.type.match(/creature/i)) {
        return {
          ...card,
          enoughManaToDeploy: false,
          attack: false,
          defend: false,
        };
      } else {
        return {
          ...card,
          enoughManaToDeploy: false,
          cast: false,
        };
      }
    };

  } catch (error) {
    throw new Error(`Couldn't fetch card. ${error.message}`);
  };

};
