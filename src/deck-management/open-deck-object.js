export default function openDeckObject(competitor) {
  // used to iterate through every cards without going through properties (creatures, spells...)
  const deck_9_cards = [
    ...competitor.deck_card_objects.creatures,
    ...competitor.deck_card_objects.lands,
    ...competitor.deck_card_objects.spells,
  ];

  // extracting every card that quantity > 1 and filtering the undefined results
  const deck_16_cards = deck_9_cards
    .map((card) => {
      const tmp = [];

      if (card.quantity > 1) {
        for (let i = 0; i < card.quantity; i++) {
          tmp.push({ ...card, quantity: 1 });
        }
      } else {
        return;
      }
      return tmp;
    })
    .filter((card) => card !== undefined);

  // extracting every card that quantity === 1 and filtering the undefined results
  const deck_7_cards = deck_9_cards
    .map((card) => {
      if (card.quantity === 1) {
        return { ...card, quantity: 1 };
      } else {
        return;
      }
    })
    .filter((card) => card !== undefined);

  let deck_21_cards = []; // full raw deck

  // since we have arrays of objects in deck_16_arrays, the arrays need to be spread into the raw deck
  for (let i = 0; i < deck_16_cards.length; i++) {
    deck_21_cards.push(...deck_16_cards[i]);
  }

  // final spread for the raw deck
  return [...deck_21_cards, ...deck_7_cards];
}
