export async function playerDefends(
  bot,
  dispatchBot,
  player,
  dispatchPlayer,
  setOriginalToughness,
  playerDefenseDecisions,
  botAttackingCards,
  battlefieldCopy,
  setExpandLog,
  expandLog,
  setGameWonBy,
  gameWonBy,
) {
  const defenderCards = battlefieldCopy // has defend props
    .filter((c) => c.defend) // we need to find the defendant cards
    .map((c) => {
      return {
        ...c,
        attackerInstanceId: playerDefenseDecisions.find(
          (x) => x.defenderInstanceId === c.instanceId // we need to reference instance ids because of duplicates
        ).attackerInstanceId,
      };
    });

  const playerBattlefieldCopy = battlefieldCopy.map((card) => ({
    ...card,
    toughness: Number(card.toughness),
    power: Number(card.power),
  }));
  const botBattlefieldCopy = bot.battlefield.map((card) => ({
    ...card,
    toughness: Number(card.toughness),
    power: Number(card.power),
  }));

  // this loop calculates what card dies or still lives after battle
  for (let i = 0; i < defenderCards.length; i++) {
    const defenderReference = defenderCards[i];
    const attackerReference = botAttackingCards.find(
      (c) => c.instanceId === defenderReference.attackerInstanceId
    );

    const attackerIndex = botBattlefieldCopy.findIndex(
      (c) => c.instanceId === attackerReference.instanceId
    );
    const defenderIndex = playerBattlefieldCopy.findIndex(
      (c) => c.instanceId === defenderReference.instanceId
    );

    const playerCardCalc =
      playerBattlefieldCopy[defenderIndex].toughness -
      botBattlefieldCopy[attackerIndex].power;
    const botCardCalc =
      botBattlefieldCopy[attackerIndex].toughness -
      playerBattlefieldCopy[defenderIndex].power;

    // defender lived attacking blow
    if (playerCardCalc > 0) {
      // keeping track of the card's original toughness
      const toughnessObj = {
        deck_name: player.deck_name,
        toughness: playerBattlefieldCopy[defenderIndex].toughness,
        id: playerBattlefieldCopy[defenderIndex].instanceId,
      };
      setOriginalToughness((prev) => [...prev, toughnessObj]);
    }

    // attacker lived defending blow
    if (botCardCalc > 0) {
      // keeping track of the card's original toughness
      const toughnessObj = {
        deck_name: bot.deck_name,
        toughness: botBattlefieldCopy[attackerIndex].toughness,
        id: botBattlefieldCopy[attackerIndex].instanceId,
      };
      setOriginalToughness((prev) => [...prev, toughnessObj]);
    }

    playerBattlefieldCopy[defenderIndex].toughness -=
      botBattlefieldCopy[attackerIndex].power;
    botBattlefieldCopy[attackerIndex].toughness -=
      playerBattlefieldCopy[defenderIndex].power;
  }

  // getting the dead cards from the attack
  const botDeadCards = botBattlefieldCopy.filter((c) => c.toughness <= 0);
  const playerDeadCards = playerBattlefieldCopy.filter((c) => c.toughness <= 0);

  // placeholder values
  let updatedPlayerGraveyard = player.graveyard;
  let updatedBotGraveyard = bot.graveyard;

  // if there are dead cards, update the placeholder graveyard values
  if (botDeadCards.length > 0)
    updatedBotGraveyard = [...bot.graveyard, ...botDeadCards];
  if (playerDeadCards.length > 0)
    updatedPlayerGraveyard = [...player.graveyard, ...playerDeadCards];

  // getting the cards that survived the attack
  // and also spells that weren't cast yet
  const updatedBotBattlefield = botBattlefieldCopy.filter(
    (c) => c.toughness > 0 || !c.type.match(/creature/i)
  );
  let updatedPlayerBattlefield = playerBattlefieldCopy.filter(
    (c) => c.toughness > 0 || !c.type.match(/creature/i)
  );

  // if at the moment of the current player defending phase
  // there are attacking sickness on any creature, include them in the update
  if (
    updatedPlayerBattlefield.some((creature) => creature.attackPhaseSickness)
  ) {
    updatedPlayerBattlefield = removeAttackSickness(updatedPlayerBattlefield);
  }

  // if at the moment of the current player defending phase
  // there are attacking cards from the previous turn, untap them manually
  if (
    updatedPlayerBattlefield.some((creature) => creature.attack)
  ) {
    updatedPlayerBattlefield = untapAttackingCard(updatedPlayerBattlefield);
  }

  // if there is damage to HP, update it
  const isThereHpDamage = playerDefenseDecisions.some((obj) => obj.takeOnHp);

  // using async to have more control over order of execution
  // mocking a promise to be awaited on GameLog.jsx
  return new Promise((resolve) => {
    setExpandLog(!expandLog); // only shrinks game log after logic resolved

    // turning the defendant cards for the sake of the animation
    setTimeout(() => {
      dispatchPlayer({
        type: 'update_battlefield',
        payload: battlefieldCopy,
      });
    }, 1000);

    // final update batch to erase cards that were killed and calculate toughness loss
    setTimeout(() => {
      if (isThereHpDamage) {
        // filter decisions which takeOnHp is true and sum the attack power of attackers
        const totalDamage = playerDefenseDecisions
          .filter((obj) => obj.takeOnHp)
          .reduce((sum, obj) => {
            const attacker = botAttackingCards.find(
              (card) => card.instanceId === obj.attackerInstanceId
            );
            return attacker ? sum + Number(attacker.power) : sum;
          }, 0);

        // storing the damage taken on hp in a variable
        const updatedPlayerHP = player.hp - totalDamage;

        // update the HP minus damage
        dispatchPlayer({
          type: 'take_damage_on_hp',
          payload: updatedPlayerHP,
        });
        
        // if bot killed player
        if (updatedPlayerHP <= 0) {
          setGameWonBy('Bot')
          return; // terminate function execution
        }
      }

      dispatchBot({
        type: 'card_died',
        payload: {
          updatedBattlefield: updatedBotBattlefield,
          updatedGraveyard: updatedBotGraveyard,
        },
      });

      dispatchPlayer({
        type: 'card_died',
        payload: {
          updatedBattlefield: updatedPlayerBattlefield,
          updatedGraveyard: updatedPlayerGraveyard,
        },
      });

      resolve({ completed: true });
    }, 3000);
  });
}

// manually removes attack sickness when necessary
function removeAttackSickness(updatedPlayerBattlefield) {
  return updatedPlayerBattlefield.map((card) => ({
    ...card,
    attackPhaseSickness: card.attackPhaseSickness
      ? false
      : card.attackPhaseSickness,
  }));
}

// manually untaps the attacking creatures from the previous turn
function untapAttackingCard(updatedPlayerBattlefield) {
  return updatedPlayerBattlefield.map((card) => ({
    ...card,
    attack: card.attack
      ? false
      : card.attack,
  }));
}
