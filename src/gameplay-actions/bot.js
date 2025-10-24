import { tapCard } from './tap-cards';

// when player attacks, this function is triggered
export function botDefends(
  attackerCard,
  bot,
  dispatchBot,
  player,
  dispatchPlayer,
  setToEnlarge,
  setOriginalToughness, 
  gameWonBy, 
  setGameWonBy
) {
  const battlefield = bot.battlefield;

  // checking for existing regular creatures
  const areRegularCreatures = battlefield.some(
    (c) => /creature/i.test(c.type) && !c.legendary && !c.summoningSickness
  );
  // checking for existing legendary creatures
  const areLegendaryCreatures = battlefield.some(
    (c) => /creature/i.test(c.type) && c.legendary && !c.summoningSickness
  );

  // toughest regular or legendary creature
  let toughest = null;

  // defender card
  let defender = null;

  // priority conditions
  if (areRegularCreatures) {
    const toughnessValues = battlefield
      .filter((c) => c.toughness && !c.legendary && !c.attack && !c.defend && !c.summoningSickness)
      .map((c) => c.toughness);

    toughest = toughnessValues.length > 0 ? Math.max(...toughnessValues) : null;

    if (toughest !== null)
      defender = battlefield.find(
        (c) => c.toughness == toughest && !c.legendary
      );
  } else if (areLegendaryCreatures) {
    const toughnessValues = battlefield
      .filter((c) => c.toughness && c.legendary && !c.attack && !c.defend && !c.summoningSickness)
      .map((c) => c.toughness);

    toughest = toughnessValues.length > 0 ? Math.max(...toughnessValues) : null;

    if (toughest !== null)
      defender = battlefield.find((c) => c.toughness == toughest);
  }

  // take damage on hp
  if (toughest === null && defender === null) {
    setTimeout(() => {
      const updatedBotHP = bot.hp - attackerCard.power;

      dispatchBot({
        type: 'take_damage_on_hp',
        payload: updatedBotHP,
      });

      // if player killed bot
      if (updatedBotHP <= 0) {
        setGameWonBy(player.name);
        return; // terminate function execution
      }
    }, 2000);
    return;
  }

  // enlarge defender card 1s later
  setTimeout(() => setToEnlarge(defender.instanceId), 1000);

  // defender card gets tapped 0.8s later
  setTimeout(() => tapCard(bot, dispatchBot, defender, false, true), 1500);

  // defender returns to original size 0.8s later
  setTimeout(() => setToEnlarge(''), 2000);

  // calculations between attack and toughness power
  const finalCalcDefender =
    parseInt(defender.toughness) - parseInt(attackerCard.power);
  const finalCalcAttacker =
    parseInt(attackerCard.toughness) - parseInt(defender.power);

  const defenderDies = finalCalcDefender <= 0; // condition if defender card dies

  const attackerDies = finalCalcAttacker <= 0; // condition if attacker card dies

  // placeholder variables to be changed based on conditions below
  let updatedDefenderBattlefield = battlefield;
  let updatedDefenderGraveyard = bot.graveyard;
  let updatedPlayerBattlefield = player.battlefield;
  let updatedPlayerGraveyard = player.graveyard;

  setTimeout(() => {
    // hu... if defender dies?
    if (defenderDies) {
      // filtering the defender from the bot's battlefield
      updatedDefenderBattlefield = battlefield.filter(
        (c) => c.instanceId !== defender.instanceId
      );
      // dead creatures and used spells go to the top of the graveyard
      updatedDefenderGraveyard = [defender, ...bot.graveyard];
    } else {
      updatedDefenderBattlefield = battlefield.map((c) => ({
        ...c,
        defend: c.instanceId === defender.instanceId ? true : c.defend,
        toughness:
          c.instanceId === defender.instanceId
            ? finalCalcDefender
            : c.toughness,
      }));

      // keeping track of the card's original toughness
      // to restore it when the turn comes back to bot
      const toughnessObj = {
        // we need the deck name to reset the right objects
        // in resetPlayerForNewTurn function
        deck_name: bot.deck_name,
        toughness: defender.toughness,
        id: defender.instanceId,
      };
      setOriginalToughness((prev) => [...prev, toughnessObj]);
    }

    // hu... if attacker dies?
    if (attackerDies) {
      // filtering the defender from the player's battlefield
      updatedPlayerBattlefield = player.battlefield.filter(
        (c) => c.instanceId !== attackerCard.instanceId
      );
      // dead creatures and used spells go to the top of the graveyard
      updatedPlayerGraveyard = [attackerCard, ...player.graveyard];
    } else {
      updatedPlayerBattlefield = player.battlefield.map((c) => ({
        ...c,
        attack: c.instanceId === attackerCard.instanceId ? true : c.attack,
        toughness:
          c.instanceId === attackerCard.instanceId
            ? finalCalcAttacker
            : c.toughness,
      }));

      // keeping track of the card's original toughness
      // to restore it when the turn comes back to player
      setOriginalToughness((prev) => [
        ...prev,
        {
          deck_name: player.deck_name,
          toughness: attackerCard.toughness,
          id: attackerCard.instanceId,
        },
      ]);
    }

    // dispatching the update
    dispatchBot({
      type: 'card_died',
      payload: {
        updatedBattlefield: updatedDefenderBattlefield,
        updatedGraveyard: updatedDefenderGraveyard,
      },
    });

    // dispatching the update
    dispatchPlayer({
      type: 'card_died',
      payload: {
        updatedBattlefield: updatedPlayerBattlefield,
        updatedGraveyard: updatedPlayerGraveyard,
      },
    });
  }, 3500);
}

export function botDeployingCard(deployableCards) {
  let cardToDeploy = null;

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

  if (legendaryCreatures.length > 0) {
    cardToDeploy = legendaryCreatures[0];
  } else if (regularCreatures.length > 0) {
    cardToDeploy = regularCreatures[0];
  } else if (spells.length > 0) {
    cardToDeploy = spells[0];
  }

  return cardToDeploy;
}

export function botCardToAttack(attackableCards) {
  let cardToAttack = null;
  let mostPowerfulCreature = null;
  let mostPowerfulLegendaryCreature = null;

  // Priority 1: Legendary creatures
  const legendaryCreatures = attackableCards.filter(
    (card) => card.type.match(/creature/i) && card.legendary
  );

  if (legendaryCreatures.length > 0) {
    // take the max out of an array full of legendary creature power values
    const legendaryPower = Math.max(...legendaryCreatures.map((card) => Number(card.power)));

    // find that most powerful legendary creature
    mostPowerfulLegendaryCreature = legendaryCreatures.find(
      (legend) => legend.power == legendaryPower
    );
  }

  // Priority 2: Regular creatures
  const regularCreatures = attackableCards.filter(
    (card) => card.type.match(/creature/i) && !card.legendary
  );
  
  if (regularCreatures.length > 0) {
    // take the max out of an array full of regular creature power values
    const creaturePower = Math.max(...regularCreatures.map(card => Number(card.power)));

    // find that most powerful regular creature
    mostPowerfulCreature = regularCreatures.find(creature => creature.power == creaturePower);
  }
  
  // Priority 3: Spells
  const spells = attackableCards.filter(
    (card) => !card.type.match(/creature/i) && !card.type.match(/land/i)
  );

  if (mostPowerfulLegendaryCreature) {
    cardToAttack = mostPowerfulLegendaryCreature;
  } else if (mostPowerfulCreature) {
    cardToAttack = mostPowerfulCreature;
  } else if (spells.length > 0) {
    cardToAttack = spells[0];
  }

  return cardToAttack;
}
