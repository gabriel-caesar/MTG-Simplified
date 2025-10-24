import { botDefends } from './bot';

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

  // this will store the card with its attack/defend prop turned to true in the variable
  const updatedAttackingCard = updatedBattlefield.find(c => c.instanceId === card.instanceId);

  dispatch({
    type: 'update_battlefield',
    payload: updatedBattlefield,
  });

  return updatedAttackingCard;
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

// main attack function for player
export function playerAttacks(
  card,
  attacker,
  attackerDispatch,
  defender,
  defenderDispatch,
  setToEnlarge,
  setOriginalToughness,
  gameWonBy,
  setGameWonBy,
  setGameState,
  gameState
) {
  // if who's attacking is Bot
  const isBot = attacker.name === 'Bot';

  // tapping attacking card
  const updatedAttackingCard = tapCard(attacker, attackerDispatch, card, true, false);

  // placeholder for the deploy state
  // let turnState = null;
  // const isThereState = gameState.some(
  //   (state) => state.owner === competitor.name && state.turn === gameTurn
  // );

  // if (!isThereState) {
  //   // if there is no state yet created for this turn and competitor
  //   // creating a log state for cards being deployed
  //   turnState = {
  //     turn: gameTurn,
  //     log: [],
  //     owner: competitor.name,
  //     id: uniqueId(),
  //   };
  // } else {
  //   // if there is a state, find it
  //   turnState = gameState.find(
  //     (state) => state.owner === competitor.name && state.turn === gameTurn
  //   );
  // }

  // bot defends
  if (!isBot)
    botDefends(
      card,
      defender,
      defenderDispatch,
      attacker,
      attackerDispatch,
      setToEnlarge,
      setOriginalToughness, 
      gameWonBy, 
      setGameWonBy
    );
}

// casting a spell from a card in the battlefield
export default function castSpell(card, competitor, dispatch) {
  const updatedBattlefield = competitor.battlefield.map((c) => ({
    ...c,
    cast: c === card ? true : c.cast,
  }));

  dispatch({
    type: 'update_battlefield',
    payload: updatedBattlefield,
  });
}
