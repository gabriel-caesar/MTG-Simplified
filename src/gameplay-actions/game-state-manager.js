export function gameStateManager(gameState) {
  // placeholder for the deploy state
  let turnState = null;
  const isThereState = gameState.some(
    (state) => state.owner === competitor.name && state.turn === gameTurn
  );

  if (!isThereState) {
    // if there is no state yet created for this turn and competitor
    // creating a log state for cards being deployed
    turnState = {
      turn: gameTurn,
      log: [],
      owner: competitor.name,
      id: uniqueId(),
    };
  } else {
    // if there is a state, find it
    turnState = gameState.find(
      (state) => state.owner === competitor.name && state.turn === gameTurn
    );
  }

  return turnState
}