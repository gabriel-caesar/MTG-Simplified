// reducer function to purely change state (player)
export default function playerReducer(state, action) {
  switch (action.type) {
    case 'create-player': // creates a brand new instance of player
      return {
        name: action.payload,
        deck_name: '',
        deck_card_objects: [], // filtered between creatures, lands and spells (before battle starts)
        deck_current_cards: 21,
        hands: [],
        mana_bar: [],
        hp: 1,
        battlefield: [],
        graveyard: [],
      };
    case 'set_deck': // sets a brand new deck for the player
      return {
        ...state,
        deck_name: action.payload.name,
        deck_card_objects: action.payload.card_objects,
      };
    case 'set_hands': // draws seven cards to the players hands
      return {
        ...state,
        hands: action.payload.hands,
        deck_card_objects: action.payload.updated_deck,
        deck_current_cards: action.payload.number_of_cards,
      };
    case 'update_hands': // deploys one mana to the mana bar
      return {
        ...state,
        hands: action.payload,
      };
    case 'deploy_mana':
      return {
        ...state,
        mana_bar: action.payload,
      };
    case 'update_battlefield':
      return {
        ...state,
        battlefield: action.payload,
      };
    case 'card_died':
      return {
        ...state,
        battlefield: action.payload.updatedBattlefield,
        graveyard: action.payload.updatedGraveyard,
      };
    case 'take_damage_on_hp':
      return {
        ...state,
        hp: action.payload,
      };
    case 'reset_competitor_for_new_turn':
      return {
        ...state,
        hands: action.payload.updatedHands,
        deck_card_objects: action.payload.updatedDeck,
        deck_current_cards: action.payload.updatedNumber,
        battlefield: action.payload.updatedBattlefield,
        mana_bar: action.payload.updatedManaBar,
      };
    default:
      return state;
  }
}
