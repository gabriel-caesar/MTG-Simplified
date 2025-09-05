// when competitor decides to attack/defend with a card
export function tapCard(
  competitor,
  dispatch,
  card,
  attacking = false,
  defending = false
) {
  const updatedBattlefield = competitor.battlefield.map((c) => {
    if (card.instanceId === c.instanceId) {
      return {
        ...c,
        attack: attacking,
        defend: defending,
      };
    }

    return c;
  });

  dispatch({
    type: 'update_battlefield',
    payload: updatedBattlefield,
  });
}

// helper function to tap manas after use
export function tapUsedManas(card, dispatch, player) {
  const noCurlyMana = card.mana_cost
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
  const activatedManas = player.mana_bar.filter(
    (mana) => mana.activated && !mana.used
  );

  // get only the manas used to deploy card
  const usedManas = activatedManas.slice(0, finalManaCost);
  // toggle their state to be used
  const updatedManaBar = usedManas.forEach((mana) => (mana.used = true));

  dispatch({
    type: 'deploy-mana',
    payload: updatedManaBar,
  });
}

// untap attacking of defending cards
export function untapCards(competitor, dispatch) {
  const battlefield = competitor.battlefield;

  // is the battlefield array empty?
  if (battlefield.length > 0) {
    const untappedCards = battlefield.map((card) => ({
      ...card,
      attack: card.attack ? false : card.attack,
      defend: card.defend ? false : card.defend,
    }));

    // updating the state
    dispatch({
      type: 'update_battlefield',
      payload: untappedCards,
    });
  }
}
