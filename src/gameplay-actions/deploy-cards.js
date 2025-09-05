import { tapUsedManas } from './tap-cards.js';
import uniqueId from '../deck-management/unique-id';

// handles the deployment of creatures/spells
export function deployCreatureOrSpell(competitor, dispatch, card, gameTurn) {

  if (competitor.battlefield.length <= 5) {
    // if card is not a land
    if (!card.type.match(/land/i)) {
      // find card selected index in competitor's hands
      const cardSelectedIndex = competitor.hands.indexOf(card);
      // select the card object
      const selectedCard = competitor.hands[cardSelectedIndex];

      // adding a turn tracker and an unique instance id to avoid duplicate issues
      const cardToBeDeployed = {
        ...selectedCard,
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

  if (competitor.name !== 'Bot') {
    // unselect the current mana being deployed
  }
}
