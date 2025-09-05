// casting a spell from a card in the battlefield
export default function castSpell(card, competitor, dispatch) {
  const updatedBattlefield = competitor.battlefield.map((c) => ({
    ...c,
    cast: c === card ? true : c.cast,
  }));

  dispatch({
    type: 'update_battlefield',
    payload: updatedBattlefield,
  });
}
