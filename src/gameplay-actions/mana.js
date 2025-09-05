// calculates if there is enough amount of mana activated
// for creatures or spells to be deployed
export function isEnoughMana(competitor, dispatch) {
  
  // player or bot
  if (competitor.mana_bar.length > 0 && competitor.battlefield.length <= 5) {
    const updatedHands = competitor.hands.map((cs) => {
      // cs -> creature/spell
      if (!cs.type.match(/land/i)) {
        // if not a land and if the player has at least one mana deployed

        const mana_cost = cs.mana_cost;
        // filtered curly braces from mana_cost
        const noCurlyMana = mana_cost
          .split('')
          .filter((el) => el !== '{' && el !== '}');
        // numbers version of noCurlyMana
        const numberMana = noCurlyMana.filter((el) => el.match(/[0-9]/));
        // letters version of noCurlyMana
        const colorMana = noCurlyMana.filter((el) => el.match(/[^0-9]/i));
        // final card mana cost in numbers
        let finalManaCost = 0;
        if (numberMana.length > 0) {
          finalManaCost = parseInt(numberMana[0]) + colorMana.length;
        } else {
          finalManaCost = colorMana.length;
        }
        // final amount of activated manas in numbers
        const activatedManas = competitor.mana_bar.filter(
          (mana) => mana.activated && !mana.used
        ).length;

        // make the decision to set the card to be deployable or not
        if (activatedManas >= finalManaCost) {
          cs.enoughManaToDeploy = true;
        } else {
          cs.enoughManaToDeploy = false;
        }

        return cs; // return the creature with updated (enoughManaToDeploy)
      } else {
        return cs; // if land, just return it
      }
    });

    // update player's hands
    dispatch({
      type: 'update_hands',
      payload: updatedHands,
    });
  } else {
    return;
  }
}

// activates a mana for the desired competitor
export function activateMana(card, index, competitor, dispatch) {
  if (card.activated) {
    // if the competitor clicked an activated mana
    competitor.mana_bar[index].activated = false;
    dispatch({
      type: 'deploy_mana',
      payload: competitor.mana_bar,
    });
  } else {
    // mana being activated by the first time
    competitor.mana_bar[index].activated = true;
    dispatch({
      type: 'deploy_mana',
      payload: competitor.mana_bar,
    });
  }
}
