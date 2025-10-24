// calculates if there is enough amount of mana activated
// for creatures or spells to be deployed
export function isEnoughMana(competitor, dispatch) {
  // player or bot (limiting battlefield for 6 cards max)
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

  // updating the mana activation state based if it is already activated or not
  const updatedManaBar = competitor.mana_bar.map((m, i) => {
      if (i === index) {
        return { ...m, activated: card.activated ? false : true }
      }
      return m
    })

  dispatch({
    type: 'deploy_mana',
    payload: updatedManaBar,
  });
}

// activates all manas at once
export function activateAllManas(competitor, dispatch) {
  const updatedManaBar = competitor.mana_bar.map((mana) => ({
    ...mana,
    activated: !mana.used ? true : mana.activated,
  }));

  dispatch({
    type: 'deploy_mana',
    payload: updatedManaBar,
  });
}

// deactivates all manas at once
export function deactivateAllManas(competitor, dispatch) {
  const updatedManaBar = competitor.mana_bar.map((mana) => ({
    ...mana,
    activated: !mana.used ? false : mana.activated,
  }));

  dispatch({
    type: 'deploy_mana',
    payload: updatedManaBar,
  });
}