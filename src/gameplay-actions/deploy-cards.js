import { tapUsedManas } from './tap-cards.js';
import { uniqueId} from '../deck-management/utils.js';

// handles the deployment of creatures/spells
export function deployCreatureOrSpell(competitor, dispatch, card, gameTurn) {
  if (competitor.battlefield.length <= 5) {
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

      // send an action to update competitor's hands
      dispatch({
        type: 'update_hands',
        payload: competitor.hands,
      });

      // send an action to include card to be deployed in the battlefield
      dispatch({
        type: 'update_battlefield',
        payload: [...competitor.battlefield, cardToBeDeployed],
      });

      // tap manas used
      tapUsedManas(card, dispatch, competitor);
    } else {
      return;
    }
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

  // splice it out from the hands array
  competitor.hands.splice(manaIndex, 1); // mutating player.hands

  // update the player's hands through an action
  dispatch({
    type: 'update_hands',
    payload: competitor.hands,
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
