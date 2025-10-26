import { tapUsedManas } from './tap-cards.js';
import { uniqueId } from '../deck-management/utils.js';

// handles the deployment of creatures/spells
export function deployCreatureOrSpell(
  competitor,
  dispatch,
  card,
  gameTurn,
  setGameState,
  gameState
) {
  // if card is not a land
  if (!card.type.match(/land/i)) {
    // find card selected index in competitor's hands
    const cardSelectedIndex = competitor.hands.indexOf(card);
    // select the card object
    const selectedCard = competitor.hands[cardSelectedIndex];

    // adding a turn tracker, summoning sickness
    // and an unique instance id to avoid duplicate issues
    const cardToBeDeployed = {
      ...selectedCard,
      attackPhaseSickness: competitor.name !== 'Bot' ? true : false, // this fixes the summoning sickness for Player
      summoningSickness: true,
      deployedOnTurn: gameTurn,
      instanceId: uniqueId(),
    };
    // splice card out of the competitor's hands
    competitor.hands.splice(cardSelectedIndex, 1);

    // storing the updated battlefield array in a variable
    const updatedBattlefield = [...competitor.battlefield, cardToBeDeployed];
    // if the competitor reached the full battlefield capacity
    const maxBattlefieldCap = updatedBattlefield.length === 6;

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

    // pushing the message obj to the state log
    turnState.log.unshift({
      id: uniqueId(),
      type: 'Deploy creature',
      details: {
        creature: card,
      },
    });

    if (maxBattlefieldCap) {
      turnState.log.unshift({
        id: uniqueId(),
        type: 'Battlefield cap',
      });
    }

    // why overcomplicate this, right? I ran into the asynchronous problem with React batching updates
    // and making botPlays(), which is an expensive call stack, work with old gameState data, so
    // now I will update the state with this idea and return the uptaded gameState with the parent function
    // and when botPlays() call itself again in the call stack, it will have the most up to date gameState
    // appending one more log to the existing turnState, therefore not duplicating a state bubble in the game log
    const gameStateUpdater = prev => {
      if (isThereState) {
        // if there is already a turnState
        // filter the already existent and outdated turnState
        // and then append a brand new and updated turnState
        const updatedGameState = prev.filter(
          (state) => state.id !== turnState.id
        );
        return [turnState, ...updatedGameState];
      } else {
        // if it's creating a brand new state
        // brand new turnState being created
        return [turnState, ...prev];
      }
    }

    const updatedGameState = gameStateUpdater(gameState);

    setGameState(updatedGameState);

    // send an action to update competitor's hands
    dispatch({
      type: 'update_hands',
      payload: competitor.hands,
    });

    // send an action to include card to be deployed in the battlefield
    dispatch({
      type: 'update_battlefield',
      payload: updatedBattlefield,
    });

    // tap manas used
    tapUsedManas(card, dispatch, competitor);

    return updatedGameState;
  } else {
    return;
  }
}

// handles the deployment of mana
export function deployOneMana(competitor, dispatch) {
  // searches for a single mana card
  const manaToBeDeployed = competitor.hands.find((handCard) =>
    handCard.type.match(/land/i)
  );

  // searches the that mana index inside the hands array
  const manaIndex = competitor.hands.indexOf(manaToBeDeployed);

  // updated hands without the mana that was just deployed
  const updatedHands = competitor.hands.map((c, i) => {
    if (manaIndex === i) {
      return
    }
    return c
  }).filter(c => c !== undefined);

  // update the player's hands through an action
  dispatch({
    type: 'update_hands',
    payload: updatedHands,
  });

  // send the selected mana to the mana bar
  dispatch({
    type: 'deploy_mana',
    payload: [...competitor.mana_bar, manaToBeDeployed],
  });
}

export function deployPriority(deployableCards) {
  // placeholder to be assigned a value later on
  let c = null;
  // Priority 1: Legendary creatures
  const legendaryCreatures = deployableCards.filter(
    (card) => card.type.match(/creature/i) && card.legendary
  );

  // Priority 2: Regular creatures
  const regularCreatures = deployableCards.filter(
    (card) => card.type.match(/creature/i) && !card.legendary
  );

  // Priority 3: Spells
  const spells = deployableCards.filter(
    (card) => !card.type.match(/creature/i) && !card.type.match(/land/i)
  );

  // based on priority, assign the respective value to c
  if (legendaryCreatures.length > 0) {
    c = legendaryCreatures[0];
  } else if (regularCreatures.length > 0) {
    c = regularCreatures[0];
  } else if (spells.length > 0) {
    c = spells[0];
  }
  return c;
}
