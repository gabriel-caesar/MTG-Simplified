// competitor object placeholder
export const competitorObject = {
  name: '',
  deck_name: '',
  deck_card_objects: [], // filtered between creatures, lands and spells (before battle starts)
  deck_current_cards: 21,
  hands: [],
  mana_bar: [],
  hp: 20,
  battlefield: [],
  graveyard: [],
};

// deck object placeholder
export const deckObject = {
  name: '',
  lands: [],
  creatures: [],
  spells: [],
};

// it can be deploy or combat states and is used for the Game Log
const actionState = {
  turn: 0,
  log: [], // messageObject
  owner: '', // competitor name
  id: '', // uniqueId
}

// objects that populate the log inside an action state
const messageObject = {
  id: '', // uniqueId
  type: '', // Creature clash | Creature deploy | Mana deploy
  details: {}
}