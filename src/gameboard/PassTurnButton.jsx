import { activateAllManas, isEnoughMana } from '../gameplay-actions/mana.js';
import { gameboardContext } from '../contexts/gameboard-context.js';
import { globalContext } from '../contexts/global-context.js';
import { botCardToAttack } from '../gameplay-actions/bot.js';
import { tapCard } from '../gameplay-actions/tap-cards.js';
import LoadingSpinner from './LoadingSpinner.jsx';
import { useContext } from 'react';
import {
  deployCreatureOrSpell,
  deployOneMana,
  deployPriority,
} from '../gameplay-actions/deploy-cards.js';

export default function PassTurnButton() {
  const {
    playerPassedTurn,
    setPlayerPassedTurn,
    originalToughness,
    setOriginalToughness,
    setCardBeingClicked,
    setOneManaPerTurn,
    setGameTurn,
    gameTurn,
    botRef,
    setBotAttackingCards,
    isBotAttacking,
    setIsBotAttacking,
    isPlayerAttacking,
    setLoadSpin,
    expandLog,
    setGameState,
    gameState,
    setExpandLog,
    toEnlarge,
    setOpenManaBar,
  } = useContext(gameboardContext);

  const {
    player,
    dispatchPlayer,
    bot,
    dispatchBot,
    setButtonSound,
    buttonSound,
  } = useContext(globalContext);

  // how many cards are allowed to be on the battlefield for each player
  const BATTLEFIELD_CARD_CAP = 6;

  // bot decisions recursive function
  function botPlays(bot, hasDeployedMana = false, newTurn, gameState) {
    // if there is mana in bot's hands and bot didn't deploy one mana yet, deploy it
    const isMana = bot.hands.find((card) => card.type.match(/land/i));
    if (isMana && !hasDeployedMana) {
      deployOneMana(bot, dispatchBot);

      // wait for bot object to be updated
      setTimeout(() => {
        botPlays(botRef.current, true, newTurn, gameState);
      }, 2000);

      return;
    }

    // activate all unused and deactivated manas
    const hasUnactivatedMana = bot.mana_bar.some(
      (mana) => !mana.activated && !mana.used
    );

    // default value is the bot's mana bar, otherwise, 
    // the updated mana bar from the activateAllManas()
    let updatedManaBar = bot.mana_bar;

    if (hasUnactivatedMana) {

      // activates all manas and return a fresh updated mana bar
      updatedManaBar = activateAllManas(bot, dispatchBot)

      // wait for bot object to be updated
      setTimeout(() => {
        botPlays(botRef.current, hasDeployedMana, newTurn, gameState);
      }, 2000);
      return;
    }

    // (enoughManaToDeploy === true) if bot has sufficient mana
    isEnoughMana(bot, dispatchBot, updatedManaBar);

    setTimeout(() => {
      // filter the current cards that can be deployed
      const deployableCards = botRef.current.hands.filter(
        (card) => card.enoughManaToDeploy && !card.type.match(/land/i)
      );

      // filter the current cards that can attack
      const attackableCards = botRef.current.battlefield.filter(
        (card) =>
          !card.summoningSickness &&
          !card.attack &&
          !card.defend &&
          card.type.match(/creature/i)
      );

      // base condition, where there are no attackable cards left on the battlefield
      if (attackableCards.length === 0) {
        // base condition, where there are no deployable cards left
        if (
          deployableCards.length === 0 ||
          botRef.current.battlefield.length === BATTLEFIELD_CARD_CAP
        ) {
          // if bot is attacking, turn the state true
          if (botRef.current.battlefield.some((c) => c.attack))
            setIsBotAttacking(true);
          setGameTurn((prev) => prev + 1); // updates game turn count
          setPlayerPassedTurn(false); // end bot turn (passes turn)
          resetPlayerForNewTurn(
            player,
            dispatchPlayer,
            !botRef.current.battlefield.some((creature) => creature.attack)
              ? true
              : false
          ); // reset player for new turn
          setLoadSpin(false);
          // if any bot creatures are attacking, remove player's creatures attack sickness

          return;
        }
      }

      // Step 5: Deploy cards with priority system
      const cardToDeploy = deployPriority(deployableCards);

      // Step 6: Cards to attack with priority system
      const cardToAttack = botCardToAttack(attackableCards);

      if (cardToDeploy && botRef.current.battlefield.length <= 5) {
        // if there is a card to deploy and battlefield space, call this function
        const updatedGameState = deployCreatureOrSpell(
          botRef.current,
          dispatchBot,
          cardToDeploy,
          newTurn,
          setGameState,
          gameState
        );

        // // wait for bot object to be updated
        setTimeout(() => {
          botPlays(botRef.current, hasDeployedMana, newTurn, updatedGameState);
        }, 2000);
      } else if (cardToAttack) {
        // else if was added in order to prevent dispatch overlap,
        // which was disabling the bot's ability to deploy creatures
        // due to event loop and mess up of the call stack under the hood

        // if there is a card to attack, call this function and it will return the updated attacking card
        const updatedAttackingCard = tapCard(
          botRef.current,
          dispatchBot,
          cardToAttack,
          true,
          false
        );

        // appending the most updated card that's attacking inside the array
        setBotAttackingCards((prev) => [...prev, updatedAttackingCard]);

        // // wait for bot object to be updated
        setTimeout(() => {
          botPlays(botRef.current, hasDeployedMana, newTurn, gameState);
        }, 200);
      }
    }, 100);
  }

  // handles pass turn actions
  function passTurn() {
    // closes mana bar if in narrow screen size
    setOpenManaBar('');

    // loading spinner in action
    setLoadSpin(true);

    // disables player actions
    setPlayerPassedTurn(true);

    // if there is a card being previewed, unselect it
    setCardBeingClicked('');

    // shrinks the game log if opened
    setExpandLog(false);

    // updates the turn count and making the update synchronous
    const newTurn = gameTurn + 1;
    setGameTurn(newTurn);

    // reset bot for new turn
    resetPlayerForNewTurn(bot, dispatchBot);

    // bot plays
    setTimeout(() => {
      botPlays(botRef.current, false, newTurn, gameState);
    }, 100);
  }

  // reset competitor for a new turn
  function resetPlayerForNewTurn(competitor, dispatch, attackPhase = false) { // attackPhase argument is only valid for the player
    
    // closes the narrow screen mana bar
    setOpenManaBar('');
    
    // reset the permission to deploy one mana
    // per turn only when competitor is the player
    if (competitor.name !== 'Bot') setOneManaPerTurn(true);
    let updatedBattlefield = null;

    // reset bot's attacking cards array
    if (competitor.name === 'Bot') setBotAttackingCards([]);

    // reseting manas to reset mana_bar
    const updatedManaBar = competitor.mana_bar.map((mana) => ({
      ...mana,
      activated: false,
      used: false,
    }));

    // updating the battlefield to untap attacking or
    // defending cards and removing summoning sickness
    updatedBattlefield = competitor.battlefield.map((card) => {
      if (card.type.match(/creature/i)) {
        return {
          ...card,
          defend: false, // untap cards
          // if there wasn't any creature attacking, 
          // untap player's attacking creature from the previous turn
          attack: attackPhase ? false : competitor.name === 'Bot' ? false : card.attack, 
          // if attackPhase is true, turn off attackPhaseSickness
          attackPhaseSickness: attackPhase ? false : card.attackPhaseSickness, 
          summoningSickness: card.summoningSickness
            ? false
            : card.summoningSickness,
        };
      }
      return card;
    });

    // card toughness are restored if creature didn't die after combat
    // restoring battlefield cards' toughness from competitor
    if (originalToughness.length > 0) {
      updatedBattlefield = updatedBattlefield.map((card) => {
        // up to this point updatedBattlefield updated card sickness and attack/defend properties
        const found = originalToughness.find((el) => el.id === card.instanceId);
        return {
          ...card,
          toughness: found ? found.toughness : card.toughness,
        };
      });
    }

    // clear the card original toughness for the competitor which is getting reset
    const updatedOriginalToughness = originalToughness.filter((el) => {
      competitor.name === 'Bot'
        ? el.deck_name !== bot.deck_name // supposed to "keep only player's cards"
        : el.deck_name !== player.deck_name; // supposed to "keep only bot's cards"
    });

    setOriginalToughness(updatedOriginalToughness);

    // variable placeholders for the dispatch function
    let updatedHands = competitor.hands;
    let updatedDeck = competitor.deck_card_objects;
    let updatedNumber = competitor.deck_card_objects.length;

    // checking if there are cards in the deck
    if (competitor.deck_current_cards > 0) {
      // picks a random card form the player's deck
      const cardToBeDrawn =
        competitor.deck_card_objects[
          Math.floor(Math.random() * competitor.deck_card_objects.length)
        ];
      // get the index of that card
      const drawnCardIndex =
        competitor.deck_card_objects.indexOf(cardToBeDrawn);
      // splice that card out from the deck
      competitor.deck_card_objects.splice(drawnCardIndex, 1);
      // build a updated array for the player's hands with the new drawn card
      updatedHands = [...competitor.hands, cardToBeDrawn];
      // updated deck object
      updatedDeck = competitor.deck_card_objects;
      // updated length of deck object
      updatedNumber = competitor.deck_card_objects.length;
    } else {
      console.log('No cards to be drawn');
    }

    // final dispatch to reset competitor
    dispatch({
      type: 'reset_competitor_for_new_turn',
      payload: {
        updatedHands: updatedHands,
        updatedDeck: updatedDeck,
        updatedNumber: updatedNumber,
        updatedBattlefield: updatedBattlefield,
        updatedManaBar: updatedManaBar,
      },
    });
  }

  return (
    <button
      onClick={() => {
        setButtonSound(!buttonSound);
        passTurn(player, dispatchPlayer);
      }}
      className={`
        active:bg-amber-600
        rounded-sm text-lg font-bold p-2 border-2 inset-shadow-button transition-colors 
        ${toEnlarge === '' || toEnlarge === null ? 'z-5' : 'z-3'}
        ${playerPassedTurn || isBotAttacking || isPlayerAttacking ? 'bg-gray-500' : 'bg-amber-300'}
      `}
      id='pass-turn-btn'
      aria-label='pass-turn-btn'
      disabled={
        playerPassedTurn || isBotAttacking || isPlayerAttacking ? true : false
      }
    >
      {playerPassedTurn ||
      isPlayerAttacking ||
      (isBotAttacking && !expandLog) ? (
        <LoadingSpinner />
      ) : (
        'Pass Turn'
      )}
    </button>
  );
}
