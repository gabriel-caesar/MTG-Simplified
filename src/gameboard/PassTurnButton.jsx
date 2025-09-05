import { useContext } from 'react';
import { gameboardContext } from './Gameboard';
import { globalContext } from '../App';
import {
  deployCreatureOrSpell,
  deployOneMana,
} from '../gameplay-actions/deploy-cards.js';
import { isEnoughMana } from '../gameplay-actions/mana.js';
import { untapCards } from '../gameplay-actions/tap-cards.js';

export default function PassTurnButton() {
  const {
    playerPassedTurn,
    setPlayerPassedTurn,
    originalToughness,
    setOriginalToughness,
    setOneManaPerTurn,
    setGameTurn,
    gameTurn,
    botRef,
  } = useContext(gameboardContext);

  const {
    player,
    dispatchPlayer,
    bot,
    dispatchBot,
    setButtonSound,
    buttonSound,
  } = useContext(globalContext);

  // bot decisions recursive function
  function botPlays(bot, hasDeployedMana = false) {
    // if there is mana in bot's hands and bot didn't deploy one mana yet, deploy it
    const isMana = bot.hands.find((card) => card.type.match(/land/i));
    if (isMana && !hasDeployedMana) {
      console.log('Deployed one mana.');
      deployOneMana(bot, dispatchBot);

      // wait for bot object to be updated
      setTimeout(() => {
        botPlays(botRef.current, true);
      }, 2000);

      return;
    }

    // activate all unused and deactivated manas
    const hasUnactivatedMana = bot.mana_bar.some(
      (mana) => !mana.activated && !mana.used
    );
    if (hasUnactivatedMana) {
      const updatedManaBar = bot.mana_bar.map((mana) => ({
        ...mana,
        activated: !mana.used ? true : mana.activated,
      }));

      dispatchBot({
        type: 'deploy_mana',
        payload: updatedManaBar,
      });
      console.log('Activated all my manas.');

      // wait for bot object to be updated
      setTimeout(() => {
        botPlays(botRef.current, hasDeployedMana);
      }, 2000);
      return;
    }

    // (enoughManaToDeploy === true) if bot has sufficient mana
    isEnoughMana(bot, dispatchBot);
    console.log('Checked for creatures or spells to deploy.');

    setTimeout(() => {
      const currentBot = botRef.current;
      const deployableCards = currentBot.hands.filter(
        (card) => card.enoughManaToDeploy && !card.type.match(/land/i)
      );

      console.log('Deployable cards found:', deployableCards.length);

      // base condition, where there are no deployable cards left
      if (deployableCards.length === 0 || currentBot.battlefield.length === 6) {
        console.log('Bot turn complete - no more deployable cards');
        setGameTurn((prev) => prev + 1); // updates game turn count
        setPlayerPassedTurn(false); // end bot turn (passes turn)
        resetPlayerForNewTurn(player, dispatchPlayer); // reset player for new turn
        return;
      }

      // Step 5: Deploy cards with priority system
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

      let cardToDeploy = null;

      if (legendaryCreatures.length > 0) {
        cardToDeploy = legendaryCreatures[0];
        console.log('Bot deploying legendary creature:', cardToDeploy.name);
      } else if (regularCreatures.length > 0) {
        cardToDeploy = regularCreatures[0];
        console.log('Bot deploying creature:', cardToDeploy.name);
      } else if (spells.length > 0) {
        cardToDeploy = spells[0];
        console.log('Bot deploying spell:', cardToDeploy.name);
      }

      if (cardToDeploy) {
        deployCreatureOrSpell(currentBot, dispatchBot, cardToDeploy, gameTurn);

        // wait for bot object to be updated
        setTimeout(() => {
          botPlays(botRef.current, hasDeployedMana);
        }, 2000);
      } else {
        // Fallback - end turn
        console.log('Bot turn complete - no valid cards to deploy');
        setPlayerPassedTurn(false);
      }
    }, 100);
  }

  // handles pass turn actions
  function passTurn() {
    // disables player actions
    setPlayerPassedTurn(true);

    // updates the turn count
    setGameTurn((prev) => prev + 1);

    // reset bot for new turn
    resetPlayerForNewTurn(bot, dispatchBot);

    // bot plays
    setTimeout(() => {
      botPlays(botRef.current, false);
    }, 100);
  }

  // reset competitor for a new turn
  function resetPlayerForNewTurn(competitor, dispatch) {
    // reset the permission to deploy one mana
    // per turn only when competitor is the player
    if (competitor.name !== 'Bot') setOneManaPerTurn(true);

    // resets mana used and activated
    competitor.mana_bar.forEach((mana) => {
      mana.activated = false;
      mana.used = false;
    });

    // untap defending or attacking cards from the previous turn
    untapCards(competitor, dispatch);

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
      const updatedHands = [...competitor.hands, cardToBeDrawn];

      // update hands and deck info
      dispatch({
        type: 'set_hands',
        payload: {
          hands: updatedHands,
          updated_deck: competitor.deck_card_objects,
          number_of_cards: competitor.deck_card_objects.length,
        },
      });

      // restoring battlefield cards' toughness from competitor
      if (originalToughness.length > 0) {
        const updatedBattlefield = competitor.battlefield.map((card) => {
          const found = originalToughness.find(
            (el) => el.id === card.instanceId
          );
          console.log('found:', found);
          return {
            ...card,
            defend: false, // untapping the card
            attack: false, // untapping the card
            toughness: found ? found.toughness : card.toughness,
          };
        });

        // dispatching the new updated battlefield
        dispatch({
          type: 'update_battlefield',
          payload: updatedBattlefield,
        });
      }

      // clear the card original toughness for the competitor which is getting reset
      const updatedOriginalToughness = originalToughness.filter((el) => {
        competitor.name === 'Bot'
          ? el.deck_name !== bot.deck_name
          : el.deck_name !== player.deck_name;
      });

      setOriginalToughness(updatedOriginalToughness);
    } else {
      console.log(`Deck ran out of cards for ${competitor.name}`);
      return;
    }
  }

  return (
    <button
      onClick={() => {
        setButtonSound(!buttonSound);
        passTurn(player, dispatchPlayer);
      }}
      className={`active:bg-amber-600 absolute right-0 top-80 z-3  rounded-sm text-lg font-bold p-2 border-2 transition-colors ${playerPassedTurn ? 'bg-gray-500' : 'bg-amber-300'}`}
      id='pass-turn-btn'
      aria-label='pass-turn-btn'
      disabled={playerPassedTurn ? true : false}
    >
      Pass Turn
    </button>
  );
}
