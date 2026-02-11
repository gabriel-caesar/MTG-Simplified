import openDeckObject from './open-deck-object';

export default function drawSevenCards(competitor, dispatch) {
  // turns the quantity oriented object to raw 21 object cards array/deck
  let deck_21_cards = openDeckObject(competitor);

  let hands_cards = []; // temporary array to hold 7 cards

  const map = new Map(); // map to keep track of already drawn cards from the deck

  // while loop to ensure that 7 cards are drawn to player's hands
  while (hands_cards.length < 7) {
    const randomIndex = Math.floor(Math.random() * 20); // random number from 0 to 20
    if (!map.has(randomIndex.toString())) {
      map.set(randomIndex.toString());
      hands_cards.push(deck_21_cards[randomIndex]);
    }
  }

  // removing the card objects from the deck that are now in the player's hands
  for (let i = 0; i < hands_cards.length; i++) {
    const filterIndex = deck_21_cards.indexOf(hands_cards[i]);

    deck_21_cards.splice(filterIndex, 1);
  }

  // dispatching all the updated deck and hand info
  dispatch({
    type: 'set_hands',
    payload: {
      hands: hands_cards.sort(),
      updated_deck: deck_21_cards.sort(),
      number_of_cards: deck_21_cards.length,
    },
  });
}
