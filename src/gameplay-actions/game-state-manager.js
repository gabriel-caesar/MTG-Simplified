import { uniqueId } from '../deck-management/utils';

export function gameStateManager(gameState, gameTurn, competitor) {
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

  return turnState;
}

// why overcomplicate this, right? I ran into the asynchronous problem with React batching updates
// and making botPlays(), which is an expensive call stack, work with old gameState data, so
// now I will update the state with this idea and return the uptaded gameState with the parent function
// and when botPlays() call itself again in the call stack, it will have the most up to date gameState
// appending one more log to the existing turnState, therefore not duplicating a state bubble in the game log
export function gameStateUpdater(
  prev,
  competitor,
  turnState,
  gameState,
  gameTurn
) {
  // is there an existing state already?
  const isThereState = gameState.some(
    (state) => state.owner === competitor.name && state.turn === gameTurn
  );

  if (isThereState) {
    // if there is already a turnState
    // filter the already existent and outdated turnState
    // and then append a brand new and updated turnState
    const updatedGameState = prev.filter((state) => state.id !== turnState.id);
    return [turnState, ...updatedGameState];
  } else {
    // if it's creating a brand new state
    // brand new turnState being created
    return [turnState, ...prev];
  }
}
