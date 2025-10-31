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

// updates the turn state with new logs
export function gameStateUpdater(
  prev,
  turnState,
) {

  // checking for the existing state
  const isThereState = prev.some(
    (state) => state.id === turnState.id
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
