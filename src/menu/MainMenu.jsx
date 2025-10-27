import '../css/main_menu.css';
import { globalContext } from '../contexts/global-context.js';
import { useContext, useEffect, useState } from 'react';
import DeckSelection from './DeckSelection.jsx';
import EnterYourName from './EnterYourName.jsx';
import DeckDetails from './DeckDetails.jsx';

export default function MainMenu({ setBattleStarts, setBattlePrep, soundFXVolumeController }) {
  // getting the context states from App component (the root of the game)
  const { player, dispatchPlayer, startWebPage, dispatchBot, allDecks } = useContext(globalContext);

  const [playerName, setPlayerName] = useState(''); // holds the planer name

  const [deckSelection, setDeckSelection] = useState(false); // shows the three choices of decks

  const [deckDetails, setDeckDetails] = useState(false); // shows the clicked deck details

  const [liftWoodenSign, setLiftWoodenSign] = useState(false); // flag to signal sign to lift or descend

  const [deckSelected, setDeckSelected] = useState(''); // state that stores the player's deck choice

  // custom submit function
  function submitPlayerName(e) {
    e.preventDefault();

    if (playerName.trim().match(/^bot$/i)) return;

    // sending an action to create a brand new player object carrying its name
    dispatchPlayer({ type: 'create-player', payload: playerName.trim() });

    dispatchBot({ type: 'create-player' });

    setLiftWoodenSign(true); // chains goes up

    // time that the chain takes to lift up
    setTimeout(() => {
      setDeckSelection(true); // changes the wooden board content and dimensions
      setLiftWoodenSign(false); // after one second it turns the chain down
    }, 900); // animation is 1s, timeout is 0.9s
  }

  // go back function (backs to enter your name UI)
  function goBack(toName, toSelection) {
    setLiftWoodenSign(true); // chains goes up

    if (toName) {
      // time that the chain takes to lift up
      setTimeout(() => {
        setDeckSelection(false); // changes the wooden board content and dimensions
        setLiftWoodenSign(false); // after one second it turns the chain down
      }, 900); // animation is 1s, timeout is 0.9s
    }

    if (toSelection) {
      // time that the chain takes to lift up
      setTimeout(() => {
        setDeckDetails(false); // details kicks out
        setDeckSelection(true); // selection comes in
        setLiftWoodenSign(false); // after one second it turns the chain down
      }, 900); // animation is 1s, timeout is 0.9s
    }
  }

  // this function handles deck selection used on DeckSelection() component
  function handleDeckSelection(deck) {
    setLiftWoodenSign(true); // chains goes up

    // time that the chain takes to lift up
    setTimeout(() => {
      setDeckSelection(false); // three deck choices go away
      setDeckDetails(true); // selected deck details enters
      setDeckSelected(deck); // updating the state to the selected deck
      setLiftWoodenSign(false); // after 1s it turns the chain down
    }, 900); // animation is 1s, timeout is 0.9s
  }

  // tells the code to start the gameboard and updates the player object
  function toBattle(deck) {
    setLiftWoodenSign(true); // chains goes up

    setTimeout(() => {
      // Gameboard component and battle horn kicks in
      setBattleStarts(true);

      // screen gets darker
      setBattlePrep(true);

      // updating menu
      setLiftWoodenSign(false);
    }, 900); // animation is 1s, timeout is 0.9s

    // filtering the deck player chose
    const playerDeckChoice = allDecks.find(d => d.name === deck.name);
    const index = allDecks.indexOf(playerDeckChoice);
    allDecks.splice(index, 1);
    // randomly selects both of the remaining two choices of deck
    const botDeck = allDecks[Math.floor(Math.random() * 2)];

    // uptdating the bot deck
    dispatchBot({
      type: 'set_deck',
      payload: {
        name: botDeck.name,
        card_objects: {
          lands: botDeck.lands,
          creatures: botDeck.creatures,
          spells: botDeck.spells,
        },
      },
    });

    // updating the user deck
    dispatchPlayer({
      type: 'set_deck',
      payload: {
        name: deck.name,
        card_objects: {
          lands: deck.lands,
          creatures: deck.creatures,
          spells: deck.spells,
        },
      },
    });
  }

  // play the chain sound for the greeting container
  useEffect(() => {
    const chainSound = new Audio('/soundfxs/chain-drag.mp3');
    chainSound.volume = soundFXVolumeController;
    chainSound.currentTime = 0;
    chainSound.play();
    setTimeout(() => {
      chainSound.pause();
    }, 1200);
    // plays the sound if the start button is hit or if the lift sign state changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startWebPage, liftWoodenSign]);

  return (
    <div>
      <div
        className={`
          relative z-0 flex justify-center items-end 
          min-[2000px]:scale-200 min-[2000px]:translate-y-50
          ${deckSelection || deckDetails ? 'h-160' : 'h-120'}
        `}
        id='wrapper-for-chains'
        style={{
          animation: liftWoodenSign // tells the code to lift up or drag the wooden sign down
            ? 'bounce-out 1s linear'
            : 'bounce-in 1s linear',
        }}
      >
        {deckSelection ? (
          <DeckSelection
            player={player}
            goBack={goBack}
            handleDeckSelection={handleDeckSelection}
          />
        ) : deckDetails ? (
          <DeckDetails
            deck={deckSelected}
            goBack={goBack}
            toBattle={toBattle}
          />
        ) : (
          <EnterYourName
            submitPlayerName={submitPlayerName}
            playerName={playerName}
            setPlayerName={setPlayerName}
          />
        )}

        <div
          className={`
            myContainer absolute -z-1 
            ${deckSelection || deckDetails 
              ? 'top-0 right-65' 
              : 'top-0 right-1/2 translate-x-1/2'}
          `}
          id='vertical-chains'
        ></div>
      </div>
    </div>
  );
}