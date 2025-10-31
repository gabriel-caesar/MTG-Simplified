import { tapUsedManas } from './tap-cards.js';
import { uniqueId } from '../deck-management/utils.js';
import { gameStateManager, gameStateUpdater } from './game-state-manager.js';

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

    // updated hands array without the card to be deployed
    const updatedHands = competitor.hands.map((c, i) => {
      if (i === cardSelectedIndex) {
        return
      } else {
        return c
      }
    }).filter(c => c !== undefined);

    // storing the updated battlefield array in a variable
    const updatedBattlefield = [...competitor.battlefield, cardToBeDeployed];

    // this function will return a brand new or an updated already existent game state
    let turnState = gameStateManager(gameState, gameTurn, competitor);

    // send an action to update competitor's hands
    dispatch({
      type: 'update_hands',
      payload: updatedHands,
    });

    // send an action to include card to be deployed in the battlefield
    dispatch({
      type: 'update_battlefield',
      payload: updatedBattlefield,
    });

    // tap manas used
    tapUsedManas(card, dispatch, competitor);

    // placeholder to be changed if turnState is not null
    let updatedGameState = gameState;

    // pushing the message obj to the state log
    if (turnState) {
      turnState.log.unshift({
        id: uniqueId(),
        type: card.power && card.toughness ? 'Deploy creature' : 'Deploy spell',
        details: {
          creature: card,
        },
      });

      // if the competitor reached the full battlefield capacity
      const maxBattlefieldCap = updatedBattlefield.length === 6;
      if (maxBattlefieldCap) {
        turnState.log.unshift({
          id: uniqueId(),
          type: 'Battlefield cap',
        });
      }

      // updating the game state
      updatedGameState = gameStateUpdater(
        gameState,
        turnState,
      );
      setGameState(updatedGameState);
    } else {
      console.error(`Something went wrong with turnState.`);
    }

    return updatedGameState;
  } else {
    return;
  }
}

// handles the deployment of mana
export function deployOneMana(
  competitor,
  dispatch,
  gameState,
  setGameState,
  gameTurn
) {
  // this function will return a brand new or an updated already existent game state
  let turnState = gameStateManager(gameState, gameTurn, competitor);

  // searches for a single mana card
  const manaToBeDeployed = competitor.hands.find((handCard) =>
    handCard.type.match(/land/i)
  );

  // searches the that mana index inside the hands array
  const manaIndex = competitor.hands.indexOf(manaToBeDeployed);

  // updated hands without the mana that was just deployed
  const updatedHands = competitor.hands
    .map((c, i) => {
      if (manaIndex === i) {
        return;
      }
      return c;
    })
    .filter((c) => c !== undefined);

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

  // prepending the mana log into the game log
  if (turnState) {
    turnState.log.unshift({
      id: uniqueId(),
      type: 'Deploy mana',
      details: {
        mana: manaToBeDeployed,
      },
    });

    // updating the game state
    const updatedGameState = gameStateUpdater(
      gameState,
      turnState,
    );
    setGameState(updatedGameState);
    
    // returning the most up to date game state so it 
    // gets incremented along the recursive botPlays() calls
    return updatedGameState;
  } else {
    console.error('Something went wrong with turnState');
  }
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
