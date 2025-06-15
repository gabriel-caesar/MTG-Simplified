export async function fetchCard(name) {

  try {
    const response = await fetch(
      `https://api.scryfall.com/cards/named?exact=${name}`
    );
    if (!response.ok) {
      throw new Error(`Couldn't get a successful response`);
    }

    const data = await response.json();
  
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
    }

    return card;
  } catch (error) {
    throw new Error(`Couldn't fetch card. ${error.message}`);
  }

}
