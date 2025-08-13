import '../css/gameboard.css';
import '../css/scroll_bars.css';
import '../css/main_menu.css';
import 'mana-font/css/mana.min.css'; // npm install mana-font for mtg mana icons
import { useContext, useState, useEffect, createContext, useRef } from 'react';
import { globalContext } from './App';
import { IoMdArrowDropup, IoMdArrowDropdown } from 'react-icons/io';
import { MdOutlineStar } from 'react-icons/md';
import { FaGripfire } from 'react-icons/fa';
import {
  GiMountaintop,
  GiBroadsword,
  GiCrossedSwords,
  GiBoltSpellCast,
  GiReturnArrow,
} from 'react-icons/gi';
import { Cog, Expand, X } from 'lucide-react';

// a local file context to link states and functions to other components
const gameboardContext = createContext(null);

function Gameboard({
  setBattleStarts,
  setLeaveBattlefield,
  setPlayMainTheme,
  playMainTheme,
}) {
  const {
    battlePrep,
    player,
    dispatchPlayer,
    appTheme,
    buttonSound,
    setButtonSound,
    bot,
    dispatchBot,
  } = useContext(globalContext);

  // opens the menu from clicking the cog button
  const [openMenu, setOpenMenu] = useState(false);

  // wooden sign for the menu
  const [liftWoodenSign, setLiftWoodenSign] = useState(true);

  // confirmation state for quiting the game
  const [areYouSureQuit, setAreYouSureQuit] = useState(false);

  // erases the UI before quiting
  const [eraseUI, setEraseUI] = useState(false);

  // if false, player already deployed one mana
  const [oneManaPerTurn, setOneManaPerTurn] = useState(true);

  // state to serve as a prop for card component
  const [cardBeingClicked, setCardBeingClicked] = useState('');

  // state that will disable every playing tool from player while bot plays
  const [playerPassedTurn, setPlayerPassedTurn] = useState(false);

  // reference of bot state for the recursive botPlays() function
  const botRef = useRef(bot);

  // reference of player state for the recursive botPlays() function
  const playerRef = useRef(player);

  // what card is being currently enlarged in the battlefield
  const [toEnlarge, setToEnlarge] = useState('/');

  // keeps track of turn the game is currently in
  const [gameTurn, setGameTurn] = useState(1);

  // keeping track of the original card toughness
  const [originalToughness, setOriginalToughness] = useState([]);

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
    if (!competitor.name !== 'Bot') setOneManaPerTurn(true);

    // resets mana used and activated
    competitor.mana_bar.forEach((mana) => {
      mana.activated = false;
      mana.used = false;
    });

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
          console.log('found:', found)
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

  // helper function to tap manas after use
  function tapUsedManas(card, dispatch, player) {
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

  // unique id generator
  function uniqueId() {
    let id = [];
    let counter = 0;
    for (let i = 0; i < 20; i++) {
      if (counter % 2 === 0) {
        id.push(Math.floor(Math.random() * 10)); // generating numbers from 0 to 9
        counter++;
      } else {
        id.push(String.fromCharCode(Math.floor(Math.random() * 26) + 97)); // generating letters from a to z
        counter++;
      }
    }
    return id.join(''); // turning the array into string
  }

  // handles the deployment of creatures/spells
  function deployCreatureOrSpell(competitor, dispatch, card) {
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

        // unselect card from hands
        setCardBeingClicked('');
      } else {
        return;
      }
    } else {
      return;
    }
  }

  // handles the deployment of mana
  function deployOneMana(competitor, dispatch) {
    // player or bot

    if (competitor.name !== 'Bot') {
      // buttons sound is played
      setButtonSound(!buttonSound);
    }

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
      setCardBeingClicked('');
    }

    setOneManaPerTurn(false); // limit of one mana deployed per turn
  }

  // function to reverse the component to deck selection
  function handleQuit() {
    setLiftWoodenSign(true); // lift the wooden sign

    setTimeout(() => {
      // waiting the wooden sign lift

      setEraseUI(true); // erase battlefield for transition

      setLeaveBattlefield(true); // dark screen transition fades-in
    }, 900);

    setTimeout(() => {
      // wait the dark screen transition

      setLeaveBattlefield(false); // dark screen transition fades-out

      setBattleStarts(false); // transitions from Gameboard to MainMenu

      setEraseUI(false); // erases the battlefield UI

      setPlayMainTheme(!playMainTheme); // plays main theme
    }, 3000);
  }

  // calculates if there is enough amount of mana activated
  // for creatures or spells to be deployed
  function isEnoughMana(competitor, dispatch) {
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
        deployCreatureOrSpell(currentBot, dispatchBot, cardToDeploy);

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

  // when competitor decides to attack/defend with a card
  function tapCard(competitor, dispatch, card, attacking = false, defending = false) {
    const updatedBattlefield = competitor.battlefield.map(c => {
      if (card.instanceId === c.instanceId) {
        return {
          ...c,
          attack: attacking,
          defend: defending,
        }
      }

      return c
    })

    dispatch({
      type: 'update_battlefield',
      payload: updatedBattlefield,
    });
  }

  // when player attacks, this function is triggered
  function botDefends(attacker) {
    const battlefield = bot.battlefield;

    // checking for existing regular creatures
    const areRegularCreatures = battlefield.some(
      (c) => /creature/i.test(c.type) && !c.legendary
    );
    // checking for existing legendary creatures
    const areLegendaryCreatures = battlefield.some(
      (c) => /creature/i.test(c.type) && c.legendary
    );

    // toughest regular or legendary creature
    let toughest = null;

    // defender card
    let defender = null;

    // priority conditions
    if (areRegularCreatures) {

      const toughnessValues = battlefield
        .filter((c) => c.toughness && !c.legendary && !c.attack && !c.defend)
        .map((c) => c.toughness);

      toughest = toughnessValues.length ? Math.max(...toughnessValues) : null;

      defender = battlefield.find(
        (c) => c.toughness == toughest && !c.legendary
      );

    } else if (areLegendaryCreatures) {

      const toughnessValues = battlefield
        .filter((c) => c.toughness && c.legendary && !c.attack && !c.defend)
        .map((c) => c.toughness);

      toughest = toughnessValues.length ? Math.max(...toughnessValues) : null;

      defender = battlefield.find((c) => c.toughness == toughest);

    }

    if (toughest === null && defender === null) {
      // take damage on hp
      return;
    }

    // enlarge defender card 1s later
    setTimeout(() => setToEnlarge(defender.instanceId), 1000);

    // defender card gets tapped 0.8s later
    setTimeout(() => tapCard(bot, dispatchBot, defender, false, true), 1500);

    // defender returns to original size 0.8s later
    setTimeout(() => setToEnlarge(null), 2000);

    const finalCalcDefender =
      parseInt(defender.toughness) - parseInt(attacker.power);
    const finalCalcAttacker =
      parseInt(attacker.toughness) - parseInt(defender.power);

    const defenderDies = finalCalcDefender <= 0;

    const attackerDies = finalCalcAttacker <= 0;

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
          toughness: c.instanceId === defender.instanceId ? finalCalcDefender : c.toughness,
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
          (c) => c.instanceId !== attacker.instanceId
        );
        // dead creatures and used spells go to the top of the graveyard
        updatedPlayerGraveyard = [attacker, ...player.graveyard];
      } else {
        updatedPlayerBattlefield = player.battlefield.map((c) => ({
          ...c,
          attack: c.instanceId === attacker.instanceId ? true : c.attack,
          toughness: c.instanceId === attacker.instanceId ? finalCalcAttacker : c.toughness,
        }));

        // keeping track of the card's original toughness
        // to restore it when the turn comes back to player
        setOriginalToughness((prev) => [
          ...prev,
          {
            deck_name: player.deck_name,
            toughness: attacker.toughness,
            id: attacker.instanceId,
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
    }, 2500);

  }

  // updates botRef to a new version of bot everytime bot state is updated
  // using regular bot wouldn't work for recursive, so then we use a useRef
  useEffect(() => {
    botRef.current = bot;
  }, [bot]);

  useEffect(() => {
    playerRef.current = player;
  }, [player]);

  // play the chain sound for the greeting container
  useEffect(() => {
    const chainSound = new Audio('/soundfxs/chain-drag.mp3');
    chainSound.volume = 0.3;
    chainSound.currentTime = 0;
    chainSound.play();
    setTimeout(() => {
      chainSound.pause();
    }, 1200);
    // plays the sound if the start button is hit or if the lift sign state changes
  }, [liftWoodenSign]);

  // every time player clicks a card to preview it,
  // the code calculates if there is enough mana to deploy it
  useEffect(() => {
    isEnoughMana(player, dispatchPlayer);
  }, [cardBeingClicked]);

  return (
    <gameboardContext.Provider
      value={{
        oneManaPerTurn,
        setOneManaPerTurn,
        deployOneMana,
        deployCreatureOrSpell,
        cardBeingClicked,
        setCardBeingClicked,
        isEnoughMana,
        playerPassedTurn,
        setPlayerPassedTurn,
        toEnlarge,
        setToEnlarge,
        botDefends,
        tapCard,
      }}
    >
      {!eraseUI && (
        <>
          <div
            className={`w-full h-0.5 absolute top-86.5 ${appTheme === 'vile' ? 'bg-gray-400' : 'bg-black'} z-3`}
          ></div>
          <nav
            className={`absolute top-83.5 right-155 radialGradient rounded-sm w-80 flex justify-center items-center border-2 ${appTheme === 'vile' ? 'border-gray-400' : 'border-black'} z-3 overflow-hidden`}
          >
            <h1 className='fontUncial text-center'>
              {battlePrep
                ? 'The battle horn is blown...'
                : !playerPassedTurn
                  ? `${player.name}'s turn`
                  : `Bot's turn`}
            </h1>
            <span
              className={`absolute bg-gray-900 text-amber-400 right-0 hover:cursor-pointer hover:bg-amber-400 hover:text-gray-900 transition-all border-r-transparent rounded-tr-sm rounded-br-sm border-l-2 border-gray-900`}
              id='expandLog'
            >
              <Expand />
            </span>
            <span
              className={`absolute bg-gray-900 text-amber-400 left-0 border-l-transparent rounded-tr-sm rounded-bl-sm border-r-2 border-gray-900 w-5 text-center text-lg bottom-0 font-bold height-full fontUncial`}
              id='gameTurnNumber'
            >
              {gameTurn}
            </span>
          </nav>
          {!battlePrep && (
            <div className='flex flex-col w-full h-full overflow-hidden'>
              <Bot />
              <button
                onClick={() => {
                  setButtonSound(!buttonSound);
                  passTurn(player, dispatchPlayer);
                }}
                className={`active:bg-amber-600 absolute right-0 top-80 z-3  rounded-sm text-lg font-bold p-2 border-2 transition-colors ${playerPassedTurn ? 'bg-gray-500' : 'bg-amber-300'}`}
                id='pass-btn'
                disabled={playerPassedTurn ? true : false}
              >
                Pass Turn
              </button>
              {openMenu && (
                <div
                  className='absolute left-190 z-10 flex justify-center items-end bg-amber-400'
                  id='wrapper-for-chains'
                  style={{
                    animation: !liftWoodenSign // tells the code to lift up or drag the wooden sign down
                      ? 'bounce-in 1s linear'
                      : 'bounce-out 1s linear',
                  }}
                >
                  <div
                    className='absolute w-100 h-60 top-50 z-6 flex flex-col justify-center items-center'
                    id='woodenSign'
                  >
                    <h1 className='text-amber-400 text-2xl fontUncial'>
                      {areYouSureQuit ? 'Leave the battlefield?' : 'Menu'}
                    </h1>
                    {!areYouSureQuit ? (
                      <>
                        <button
                          onClick={() => {
                            setButtonSound(!buttonSound);
                            setLiftWoodenSign(true);
                            setTimeout(() => setOpenMenu(false), 900);
                          }}
                          className='active:opacity-50 my-4 bg-amber-300 rounded-sm text-lg font-bold px-2 border-2 w-60 transition-colors'
                          id='resume-btn'
                        >
                          Resume
                        </button>
                        <button
                          className='active:opacity-50 bg-amber-300 rounded-sm text-lg font-bold px-2 border-2 w-60 transition-colors'
                          id='quit-btn'
                          onClick={() => {
                            setButtonSound(!buttonSound);
                            setAreYouSureQuit(true);
                          }}
                        >
                          Quit
                        </button>
                      </>
                    ) : (
                      <div className='active:opacity-50 flex flex-col justify-center items-center'>
                        <button
                          onClick={() => {
                            setButtonSound(!buttonSound);
                            handleQuit();
                          }}
                          className='active:opacity-50 my-4 bg-amber-300 rounded-sm text-lg font-bold px-2 w-60 border-2 transition-all'
                          id='yes-btn'
                        >
                          Yes
                        </button>
                        <button
                          onClick={() => {
                            setButtonSound(!buttonSound);
                            setAreYouSureQuit(false);
                          }}
                          className='active:opacity-50 bg-amber-300 rounded-sm text-lg font-bold px-2 w-60 border-2 transition-colors'
                          id='no-btn'
                        >
                          No
                        </button>
                      </div>
                    )}
                  </div>
                  <div className='absolute -top-50' id='vertical-chains'></div>
                </div>
              )}
              <button
                className='active:bg-amber-600 absolute top-81.5 z-3 bg-amber-300 rounded-sm text-3xl font-bold p-2 border-2 transition-colors'
                id='settings-btn'
                onClick={() => {
                  setButtonSound(!buttonSound);
                  if (liftWoodenSign) {
                    setOpenMenu(!openMenu);
                    setLiftWoodenSign(false);
                  } else {
                    setLiftWoodenSign(true);
                    setTimeout(() => setOpenMenu(false), 900);
                  }
                }}
              >
                <Cog />
              </button>
              <Player />
            </div>
          )}
        </>
      )}
    </gameboardContext.Provider>
  );
}

// players battlefield component
function Player() {
  const {
    player,
    setButtonSound,
    buttonSound,
    cardSound,
    setCardSound,
    manaSound,
    setManaSound,
    dispatchPlayer,
  } = useContext(globalContext);

  const {
    cardBeingClicked,
    setCardBeingClicked,
    isEnoughMana,
    playerPassedTurn,
  } = useContext(gameboardContext);

  // state that opens and closes the graveyard/hp container
  const [openGraveyard, setOpenGraveyard] = useState(false);

  // state that opens and closes the player's hands container
  const [openHands, setOpenHands] = useState(false);

  // activates a mana
  function activateMana(card, index) {
    if (card.activated) {
      // if the player clicked an activated mana
      player.mana_bar[index].activated = false;
      dispatchPlayer({
        type: 'deploy_mana',
        payload: player.mana_bar,
      });
    } else {
      // mana being activated by the first time
      player.mana_bar[index].activated = true;
      dispatchPlayer({
        type: 'deploy_mana',
        payload: player.mana_bar,
      });
    }
  }

  return (
    <>
      <div className='w-full h-full relative'>
        <Battlefield competitor={player} isBot={false} />
        <div
          className={`${player.deck_name === 'Angel Army' ? 'angel-deck' : player.deck_name === 'Vile Force' ? 'vile-deck' : 'human-deck'} ${openHands ? 'top-1' : 'top-78.5'} absolute rounded-tr-sm w-80 h-85.5 border-r-2 transition-all z-4`}
          id='playerHandsContainer'
        >
          <span
            className='active:opacity-50 bg-gray-900 absolute h-8.5 flex items-center justify-center right-0 border-2 border-black text-amber-400 text-2xl rounded-t-sm hover:cursor-pointer hover:bg-amber-400 hover:text-black transition-colors'
            id='drawer-knob'
            onClick={() => {
              setButtonSound(!buttonSound);
              setOpenHands(!openHands);
              if (openHands) setCardBeingClicked('');
            }}
          >
            {openHands ? <IoMdArrowDropdown /> : <IoMdArrowDropup />}
          </span>
          <h1 className='text-center text-2xl rounded-tr-sm radialGradient border-2 border-r-0 fontUncial'>
            {player.name}'s hands
          </h1>

          <div
            className='bg-amber-400 w-full flex justify-between items-center px-4 border-b-2'
            id='deck-name-ui'
          >
            <p className='font-bold text-lg'>Deck: {player.deck_name}</p>
            <p className='font-bold text-2xl'>
              {player.deck_current_cards} cards
            </p>
          </div>

          <ul
            className='flex flex-col p-2 overflow-y-auto h-69.5'
            id='cardsContainer'
          >
            {player.hands.map((card, index) => {
              return (
                <button
                  className={`flex w-full justify-between items-center border-t-2 border-b-2 ${playerPassedTurn ? 'hover:cursor-not-allowed' : 'hover:cursor-pointer'} hover:border-b-black hover:border-t-black rounded-sm px-2 py-1 transition-all ${cardBeingClicked === card ? 'bg-amber-50 border-t-black border-b-black' : 'border-t-transparent border-b-transparent'}`}
                  key={index}
                  onClick={() => {
                    // if clicked in an already selected card, unselect it
                    cardBeingClicked !== card
                      ? setCardBeingClicked(card)
                      : setCardBeingClicked('');
                    setCardSound(!cardSound);
                  }}
                  disabled={playerPassedTurn ? true : false}
                >
                  <li className='font-bold text-lg flex items-center'>
                    {card.type.match(/legendary/i) ? (
                      <>
                        <MdOutlineStar className='text-blue-400 mr-1' />
                        {card.name}
                      </>
                    ) : card.type.match(/^creature —/i) ? (
                      <>
                        <GiBroadsword className='mr-1' />
                        {card.name}
                      </>
                    ) : card.type.match(/land/i) ? (
                      <>
                        <GiMountaintop className='mr-1' />
                        {card.name}
                      </>
                    ) : (
                      <>
                        <FaGripfire className='mr-1' />
                        {card.name}
                      </>
                    )}
                  </li>

                  {!card.type.match(/basic land/i) && ( // if card is not a land
                    <p className='flex justify-center items-center'>
                      <CardMana mana_cost={card.mana_cost} />
                    </p>
                  )}
                </button>
              );
            })}
            {player.battlefield.length >= 6 && (
              <p className='text-lg font-bold text-center text-black radialGradient border-2 rounded-sm mt-2'>
                Your battlefield reached its full capacity of cards
              </p>
            )}
          </ul>

          {cardBeingClicked && <CardPreview card={cardBeingClicked} />}
        </div>

        <div id='mana-bar-wrapper' className='absolute right-101 top-74.5'>
          <h1 className='-top-8.5 absolute rounded-t-sm fontUncial bg-gradient-to-bl from-blue-700 to-gray-900 text-amber-400 border-amber-400 text-2xl w-40 text-center border-2'>
            Mana bar
          </h1>
          <div
            className='w-200 h-12 border-2 border-amber-400 border-b-0 bg-gradient-to-bl from-blue-700 to-gray-900  rounded-t-sm p-1 flex justify-start items-center overflow-x-auto overflow-y-hidden'
            id='mana-bar'
          >
            {player.mana_bar.map((card, index) => {
              return (
                <button
                  className={`flex justify-between items-center rounded-sm mr-2 w-22 p-1 font-bold text-lg  border-2 transition-all ${card.activated && 'activatedMana'} ${
                    card.used
                      ? 'hover:cursor-not-allowed cardTapped'
                      : card.name === 'Plains'
                        ? 'white-card-background text-black hover:cursor-pointer hover:opacity-70'
                        : 'black-card-background text-amber-200 hover:cursor-pointer hover:opacity-70'
                  }`}
                  id='mana-btn'
                  onClick={() => {
                    activateMana(card, index);
                    isEnoughMana(player, dispatchPlayer); // updates if there is enough mana for cards in hand
                    setManaSound(!manaSound);
                  }}
                  key={index}
                  disabled={playerPassedTurn ? true : card.used ? true : false}
                >
                  <p>{card.name}</p>

                  <p>
                    {card.color[0] === 'W' ? (
                      <i class='ms ms-w ms-cost ms-shadow'></i>
                    ) : (
                      <i class='ms ms-b ms-cost ms-shadow'></i>
                    )}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        <div
          className={`${openGraveyard ? 'top-17' : 'top-78.5'} absolute flex right-0 border-l-2 rounded-tl-sm transition-all`}
        >
          <div
            className={`${player.deck_name === 'Angel Army' ? 'angel-deck' : player.deck_name === 'Vile Force' ? 'vile-deck' : 'human-deck'} w-80 h-70 border-r-2 rounded-tl-sm`}
            id='playerGraveyardContainer'
          >
            <span
              className='active:opacity-50 bg-gray-900 absolute h-8.5 flex justify-center items-center border-2 border-black text-amber-400 text-2xl rounded-t-sm hover:cursor-pointer hover:bg-amber-400 hover:text-black transition-colors'
              id='drawer-knob'
              onClick={() => {
                setButtonSound(!buttonSound);
                setOpenGraveyard(!openGraveyard);
              }}
            >
              {openGraveyard ? <IoMdArrowDropdown /> : <IoMdArrowDropup />}
            </span>
            <h1 className='text-center text-2xl rounded-tl-sm radialGradient border-2 border-l-0 border-r-0 fontUncial'>
              Graveyard
            </h1>
          </div>
          <div
            className={`${player.deck_name === 'Vile Force' ? 'bg-gradient-to-b from-green-600 to-green-950' : 'bg-gradient-to-b from-red-600 to-red-950'} ${openGraveyard ? 'items-center' : 'items-start'} border-t-2  flex justify-center`}
            id='playerHPContainer'
          >
            <h1 className='text-center text-2xl fontUncial'>{player.hp}hp</h1>
          </div>
        </div>
      </div>
    </>
  );
}

// bot battlefield component
function Bot() {
  const { bot, setButtonSound, buttonSound } = useContext(globalContext);

  // state that opens and closes the graveyard/hp container
  const [openGraveyard, setOpenGraveyard] = useState(false);

  // state that opens and closes the bot's hands container
  const [openHands, setOpenHands] = useState(false);

  return (
    <div className='w-full h-full relative'>
      <Battlefield competitor={bot} isBot={true} />
      <div
        className={`${bot.deck_name === 'Angel Army' ? 'angel-deck' : bot.deck_name === 'Vile Force' ? 'vile-deck' : 'human-deck'} absolute flex flex-col items-end justify-end rounded-br-sm w-80 ${openHands ? 'h-85.5' : 'h-8.5'} top-0 border-r-2 overflow-auto transition-all z-4`}
        id='botHandsContainer'
      >
        <span
          className='active:opacity-50 bg-gray-900 absolute h-8.5 flex justify-center items-center border-2 border-black border-t-transparent text-amber-400 text-2xl rounded-b-sm hover:cursor-pointer hover:bg-amber-400 hover:text-black transition-colors right-0'
          id='drawer-knob'
          onClick={() => {
            setButtonSound(!buttonSound);
            setOpenHands(!openHands);
          }}
        >
          {!openHands ? <IoMdArrowDropdown /> : <IoMdArrowDropup />}
        </span>

        <ul
          className='flex flex-col p-2 overflow-y-auto h-69.5 w-full'
          id='cardsContainer'
        >
          {bot.hands.map((card, index) => {
            return (
              <div
                className={`flex w-full justify-start items-center border-t-2 border-b-2 hover:cursor-not-allowed hover:border-b-black hover:border-t-black rounded-sm px-2 py-1 transition-all border-t-transparent border-b-transparent`}
                key={index}
              >
                <li className='font-bold text-lg flex items-center'>
                  {card.type.match(/legendary/i) ? (
                    <>
                      <MdOutlineStar className='text-blue-400 mr-1' />
                      Unknown
                    </>
                  ) : card.type.match(/^creature —/i) ? (
                    <>
                      <GiBroadsword className='mr-1' />
                      Unknown
                    </>
                  ) : card.type.match(/land/i) ? (
                    <>
                      <GiMountaintop className='mr-1' />
                      Unknown
                    </>
                  ) : (
                    <>
                      <FaGripfire className='mr-1' />
                      Unknown
                    </>
                  )}
                </li>
              </div>
            );
          })}
        </ul>

        <div
          className='bg-amber-400 w-full flex justify-between items-center px-4 border-t-2'
          id='deck-name-ui'
        >
          <p className='font-bold text-lg'>Deck: {bot.deck_name}</p>
          <p className='font-bold text-2xl'>{bot.deck_current_cards} cards</p>
        </div>

        <h1 className='text-center w-full text-2xl rounded-br-sm radialGradient border-2 border-r-0 fontUncial'>
          {bot.deck_name === 'Angel Army'
            ? `Gisela's hands`
            : bot.deck_name === 'Vile Force'
              ? `Rakdos' hands`
              : `Tajic's hands`}
        </h1>
      </div>

      <div id='mana-bar-wrapper' className='absolute right-0 top-0.4'>
        <h1 className='right-101 top-11.5 absolute rounded-b-sm fontUncial bg-gradient-to-bl from-gray-900 to-blue-700 text-amber-400 border-amber-400 text-2xl w-40 text-center border-2'>
          Mana bar
        </h1>
        <div
          className='w-200 h-12 border-2 border-amber-400 border-t-0 bg-gradient-to-bl from-gray-900 to-blue-700 absolute right-101 top-0 rounded-b-sm p-1 flex overflow-x-auto overflow-y-hidden'
          id='mana-bar'
        >
          {bot.mana_bar.map((card, index) => {
            return (
              <button
                className={`flex justify-between items-center rounded-sm mr-2 w-22 p-1 font-bold text-lg  border-2 transition-all ${card.activated && 'activatedMana'} ${
                  card.used
                    ? 'hover:cursor-not-allowed cardTapped'
                    : card.name === 'Plains'
                      ? 'white-card-background text-black hover:cursor-pointer hover:opacity-70'
                      : 'black-card-background text-amber-200 hover:cursor-pointer hover:opacity-70'
                }`}
                id='mana-btn'
                key={index}
              >
                <p>{card.name}</p>

                <p>
                  {card.color[0] === 'W' ? (
                    <i class='ms ms-w ms-cost ms-shadow'></i>
                  ) : (
                    <i class='ms ms-b ms-cost ms-shadow'></i>
                  )}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      <div className='absolute flex right-0 border-l-2 rounded-bl-sm'>
        <div
          className={`${bot.deck_name === 'Angel Army' ? 'angel-deck' : bot.deck_name === 'Vile Force' ? 'vile-deck' : 'human-deck'} flex items-end w-80 ${!openGraveyard ? 'h-8.5' : 'h-70'} border-r-2 rounded-bl-sm transition-all`}
          id='botGraveyardContainer'
        >
          <span
            className='active:opacity-50 bg-gray-900 absolute h-8.5 flex justify-center items-center border-2 border-black border-t-transparent text-amber-400 text-2xl rounded-b-sm hover:cursor-pointer hover:bg-amber-400 hover:text-black transition-colors'
            id='drawer-knob'
            onClick={() => {
              setButtonSound(!buttonSound);
              setOpenGraveyard(!openGraveyard);
            }}
          >
            {!openGraveyard ? <IoMdArrowDropdown /> : <IoMdArrowDropup />}
          </span>
          <h1 className='w-full text-center text-2xl rounded-bl-sm radialGradient border-2 border-l-0 border-r-0 fontUncial'>
            Graveyard
          </h1>
        </div>
        <div
          className={`${bot.deck_name === 'Vile Force' ? 'bg-gradient-to-b from-green-600 to-green-950' : 'bg-gradient-to-b from-red-600 to-red-950'} border-b-2  flex justify-center items-center`}
          id='botHPContainer'
        >
          <h1 className='text-center text-2xl fontUncial'>{bot.hp}hp</h1>
        </div>
      </div>
    </div>
  );
}

// battlefield where cards are deployed to
function Battlefield({ competitor, isBot }) {
  const { toEnlarge, setToEnlarge, tapCard, botDefends } =
    useContext(gameboardContext);

  const { player, dispatchPlayer, buttonSound, setButtonSound } =
    useContext(globalContext);

  const [openAttackMenu, setOpenAttackMenu] = useState(false);

  // casting a spell from a card in the battlefield
  function cardCastSpell(card) {
    const updatedBattlefield = player.battlefield.map((c) => ({
      ...c,
      cast: c === card ? true : c.cast,
    }));

    dispatchPlayer({
      type: 'update_battlefield',
      payload: updatedBattlefield,
    });
  }

  // main attack function for player
  function attack(card) {

    // tapping attacking card
    tapCard(player, dispatchPlayer, card, true, false);

    // card goes back to its original size
    setTimeout(() => {
      setToEnlarge(null);
    }, 800);

    // bot defends
    botDefends(card);
  }

  return (
    <div
      className={`absolute ${isBot && 'top-1.5'} left-30 w-320 h-85 p-5 flex justify-center`}
    >
      {competitor.battlefield.map((card, index) => (
        <div
          id='cardContainer'
          className={`rounded-lg p-1 mx-2 cardTransition transition-all relative
            flex flex-col justify-start items-center
            ${card.attack || card.defend ? 'creatureTurn' : ''}
            ${
              card.color[0] === 'W'
                ? 'white-card-background text-black'
                : 'black-card-background text-amber-200 border-black'
            }
            ${
              toEnlarge === card.instanceId
                ? `z-10 w-80 large border-8 ${!isBot ? '-top-60' : 'top-10'} hover:cursor-default`
                : 'z-4 border-4 w-40 small top-0 hover:cursor-pointer'
            }
            ${isBot && 'mt-14'}`}
          key={index}
          onClick={() => {
            setOpenAttackMenu(false);
            setToEnlarge(toEnlarge === card.instanceId ? '' : card.instanceId);
          }}
        >
          <h1
            className={`${toEnlarge === card.instanceId && 'text-lg'} text-center font-bold`}
            id='cardNameHeader'
          >
            {card.name}
          </h1>
          <img
            src={card.image_uris.art_crop}
            alt='card-image'
            className={`border-2 ${toEnlarge === card.instanceId ? 'w-80 h-60' : 'w-40 h-30'}`}
          />

          <p
            className={`${toEnlarge === card.instanceId ? 'text-lg' : 'text-xs'} font-bold my-1 text-center`}
          >
            {card.type}
          </p>

          {toEnlarge !== card.instanceId && (
            <>
              <h1
                className={`text-center font-bold ${card.power ? 'text-3xl' : 'text-xs'} mt-1 overflow-hidden hover:overflow-auto h-15`}
                id='battlefieldCardDesc'
              >
                {card.power
                  ? `${card.power}/${card.toughness}`
                  : card.description}
              </h1>
              <div className='absolute right-10 bottom-2 opacity-20 text-7xl'>
                {card.color[0] === 'W' ? (
                  <i class='ms ms-w'></i>
                ) : (
                  <i class='ms ms-b'></i>
                )}
              </div>
            </>
          )}

          {toEnlarge === card.instanceId && (
            <>
              <div
                className={`border-2 flex justify-center p-2 w-full h-35 overflow-auto relative transition-all
                ${
                  card.color[0] !== 'W' ? 'black-card-desc' : 'white-card-desc'
                }`}
                id='battlefieldCardDesc'
              >
                <p className='font-bold text-lg'>
                  {card.ability ? card.ability : card.description}
                </p>
                <div className='absolute right-22 bottom-0.5 opacity-20 text-9xl'>
                  {card.color[0] === 'W' ? (
                    <i class='ms ms-w'></i>
                  ) : (
                    <i class='ms ms-b'></i>
                  )}
                </div>
              </div>

              <div
                id='bottomBarContainer'
                className='flex w-full justify-between items-center text-2xl mt-2'
              >
                {!isBot ? (
                  openAttackMenu ? (
                    <div
                      className={`radialGradient border-2 ${card.type.match(/creature/i) ? 'border-gray-900' : 'border-gray-400'} text-gray-900 flex justify-between items-center rounded-sm`}
                    >
                      <button
                        className='hover:cursor-pointer hover:bg-gray-900 hover:text-amber-400 hover:border-gray-900 border-2 border-transparent h-8 transition-all bg-transparent font-bold rounded-l-sm w-22'
                        onClick={(e) => {
                          e.stopPropagation(); // doesn't let the click propagate to the card itself
                          {
                            card.type.match(/creature/i)
                              ? attack(card)
                              : spell(card);
                          }
                        }}
                      >
                        {card.type.match(/creature/i) ? 'Attack' : 'Cast'}
                      </button>
                      <button
                        className='hover:cursor-pointer hover:bg-gray-900 hover:text-amber-400 hover:border-gray-900 border-2 border-transparent h-8 transition-all bg-transparent rounded-r-sm w-10 flex justify-center items-center'
                        onClick={(e) => {
                          e.stopPropagation(); // doesn't let the click propagate to the card itself
                          setButtonSound(!buttonSound);
                          setOpenAttackMenu(false);
                        }}
                      >
                        <X />
                      </button>
                    </div>
                  ) : (
                    <button
                      className={`border-2 w-10 flex items-center justify-center radialGradient text-gray-900 hover:cursor-pointer   hover:opacity-50 transition-all rounded-sm`}
                      onClick={(e) => {
                        e.stopPropagation(); // doesn't let the click propagate to the card itself
                        setButtonSound(!buttonSound);
                        setOpenAttackMenu(true);
                      }}
                    >
                      {card.type.match(/creature/i) ? (
                        <GiCrossedSwords />
                      ) : (
                        <GiBoltSpellCast />
                      )}
                    </button>
                  )
                ) : (
                  ''
                )}
                <h1 className='font-bold text-3xl'>
                  {card.power && `${card.power}/${card.toughness}`}
                </h1>
              </div>
            </>
          )}
        </div>
      ))}
    </div>
  );
}

// function to display in the UI the amount of mana cost for cards
function CardMana({ mana_cost }) {
  return (
    <>
      {mana_cost.includes('{1}') && (
        <i class='ms ms-1 ms-cost ms-shadow'></i> // mana icon
      )}
      {mana_cost.includes('{2}') && (
        <i class='ms ms-2 ms-cost ms-shadow'></i> // mana icon
      )}
      {mana_cost.includes('{3}') && (
        <i class='ms ms-3 ms-cost ms-shadow'></i> // mana icon
      )}
      {mana_cost.includes('{6}') && (
        <i class='ms ms-6 ms-cost ms-shadow'></i> // mana icon
      )}
      {mana_cost.includes('{W}{W}') ? ( // mana icon
        <>
          <i class='ms ms-w ms-cost ms-shadow'></i>
          <i class='ms ms-w ms-cost ms-shadow'></i>
        </>
      ) : mana_cost.includes('{W}') ? ( // mana icon
        <>
          <i class='ms ms-w ms-cost ms-shadow'></i>
        </>
      ) : mana_cost.includes('{B}{B}') ? ( // mana icon
        <>
          <i class='ms ms-b ms-cost ms-shadow'></i>
          <i class='ms ms-b ms-cost ms-shadow'></i>
        </>
      ) : (
        mana_cost.includes('{B}') && <i class='ms ms-b ms-cost ms-shadow'></i> // mana icon
      )}
    </>
  );
}

function CardPreview({ card }) {
  // card is the only prop because it comes from the Player's deck directly

  // getting important data from Gameboard context
  const { oneManaPerTurn, deployOneMana, deployCreatureOrSpell } =
    useContext(gameboardContext);

  const { player, dispatchPlayer } = useContext(globalContext);

  return (
    <div
      className={`${card.color[0] === 'W' ? 'white-card-background text-black' : 'black-card-background text-amber-200'} absolute -top-60 left-80 flex flex-col justify-start items-center rounded-2xl p-2 w-90 h-140 z-10 shadowing border-10 border-black`}
      id='cardPreviewContainer'
    >
      <span className='rounded-t-sm w-full flex justify-between items-center px-1'>
        <h1
          className={`${card.color[0] === 'W' ? 'text-black' : 'text-amber-200'} font-bold text-lg text-center `}
        >
          {card.name}
        </h1>
        <p className='flex justify-center items-center'>
          <CardMana mana_cost={card.mana_cost} />
        </p>
      </span>

      <img
        className='w-80 h-50 border-4 my-1'
        src={card.image_uris.art_crop}
        alt='card-image'
      />

      <div className='flex w-full'>
        <p
          className={`${card.color[0] === 'W' ? 'text-black' : 'text-amber-200'} font-bold text-lg`}
        >
          {card.type}
        </p>
      </div>

      <div
        className={`absolute ${card.type.match(/land/i) ? 'opacity-80' : 'opacity-10'} text-9xl bottom-25`}
        id='colorSymbol'
      >
        {card.color[0] === 'W' ? (
          <i class='ms ms-w'></i>
        ) : (
          <i class='ms ms-b'></i>
        )}
      </div>

      <div
        className={`my-2 border-4 ${card.color[0] === 'W' ? 'white-card-desc text-black' : 'black-card-desc text-amber-200'} font-bold text-lg p-2 w-80 h-50`}
        id='cardDescription'
      >
        {card.ability
          ? card.ability
          : card.description && `~${card.description}`}
      </div>

      <span className='flex justify-between items-center px-1 font-bold text-lg w-full'>
        <button
          className={`active:opacity-80 border-2 hover:opacity-60  transition-all text-black px-2 
            ${
              card.type.match(/land/i)
                ? oneManaPerTurn
                  ? 'radialGradient hover:cursor-pointer'
                  : 'bg-gradient-to-b from-blue-950 to-gray-500 hover:cursor-not-allowed'
                : card.enoughManaToDeploy
                  ? 'radialGradient hover:cursor-pointer'
                  : 'bg-gradient-to-b from-blue-950 to-gray-500 hover:cursor-not-allowed'
            }`}
          id='deploy-btn'
          disabled={
            // FIX THIS AND MANA COST
            card.type.match(/land/i)
              ? oneManaPerTurn
                ? false
                : true
              : card.enoughManaToDeploy
                ? false
                : true
          }
          onClick={
            card.type.match(/land/i)
              ? () => deployOneMana(player, dispatchPlayer)
              : () => deployCreatureOrSpell(player, dispatchPlayer, card)
          }
        >
          Deploy Card
        </button>
        {card.power && card.toughness && (
          <p className='text-3xl font-bold'>
            {card.power}/{card.toughness}
          </p>
        )}
      </span>
    </div>
  );
}

export default Gameboard;
