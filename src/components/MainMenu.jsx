import '../css/main_menu.css';
import { useContext, useEffect, useState } from 'react';
import { globalContext } from './App';
import {
  GiCurlyWing,
  GiVikingShield,
  GiDevilMask,
  GiMountaintop,
  GiBroadsword,
  GiBookmarklet,
} from 'react-icons/gi';
import { MdOutlineStar } from 'react-icons/md';
import { FaGripfire } from 'react-icons/fa';

function MainMenu({ setBattleStarts, setBattlePrep }) {
  // getting the context states from App component (the root of the game)
  const { player, dispatchPlayer, startWebPage } = useContext(globalContext);

  const [playerName, setPlayerName] = useState(''); // holds the planer name

  const [deckSelection, setDeckSelection] = useState(false); // shows the three choices of decks

  const [deckDetails, setDeckDetails] = useState(false); // shows the clicked deck details

  const [liftWoodenSign, setLiftWoodenSign] = useState(false); // flag to signal sign to lift or descend

  const [deckSelected, setDeckSelected] = useState(''); // state that stores the player's deck choice

  // custom submit function
  function submitPlayerName(e) {
    e.preventDefault();

    // sending an action to create a brand new player object carrying its name
    dispatchPlayer({ type: 'create-player', payload: playerName });

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
    chainSound.volume = 0.3;
    chainSound.currentTime = 0;
    chainSound.play();
    setTimeout(() => {
      chainSound.pause();
    }, 1200);
    // plays the sound if the start button is hit or if the lift sign state changes
  }, [startWebPage, liftWoodenSign]);

  return (
    <div>
      <div
        className={`relative z-0 flex justify-center items-end ${deckSelection || deckDetails ? 'h-160' : 'h-120'}`}
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
          className={`myContainer absolute -z-1 ${deckSelection || deckDetails ? 'top-0 right-65' : 'top-0 right-9'}`}
          id='vertical-chains'
        ></div>
      </div>
    </div>
  );
}

// wooden sign for the player to enter its name
function EnterYourName({ submitPlayerName, playerName, setPlayerName }) {
  return (
    <form
      className={`z-2 w-115 h-70 px-10 py-14`}
      id='greetingContainer'
      onSubmit={(e) => submitPlayerName(e)}
    >
      <h1 className='text-center text-amber-100 mb-3 text-3xl font-bold fontUncial'>
        Welcome to MTG Simplified!
      </h1>
      <label className='flex flex-col text-amber-100 text-center font-bold text-2xl'>
        Tell us your name:
        <input
          type='text'
          placeholder='Name...'
          className='bg-gray-900 text-gray-300 p-2 rounded-sm text-xl w-3/4 m-auto border-1'
          value={playerName}
          onChange={(e) => {
            // 7 characters max
            if (e.target.value.length < 8) setPlayerName(e.target.value);
          }}
          required
        />
      </label>
    </form>
  );
}

function DeckSelection({ player, goBack, handleDeckSelection }) {
  const { angelDeck, resistanceDeck, vileDeck, setButtonSound, buttonSound } =
    useContext(globalContext);

  return (
    <div
      id='deckSelectionContainer'
      className='w-230 h-135 flex flex-col justify-start items-center'
    >
      <h1 className='text-center text-amber-100 text-2xl my-15 font-bold fontUncial'>
        Very well{' '}
        <strong className='text-amber-400 fontUncial'>{player.name}</strong>,
        select your deck wisely
      </h1>
      <div
        className='flex justify-between items-center w-3/4'
        id='decksWrapper'
      >
        <div
          className='active:opacity-50 border-2 flex flex-col justify-start w-50 h-55 bg-blue-200 rounded-sm transition-colors relative'
          id='angel-deck-box'
          onClick={() => {
            setButtonSound(!buttonSound);
            handleDeckSelection(angelDeck);
          }}
        >
          <h3 className='text-center fontUncial bg-amber-200 w-full border-b-2'>
            Angel Army
          </h3>

          <GiCurlyWing className='absolute text-9xl right-12 top-10 opacity-20' />

          <p className='text-center p-2 font-bold my-4 text-lg'>
            A deck with powerful forces of heaven that contains angels and will
            fight for your cause
          </p>
          <h4 className='text-center font-bold'>
            To check its cards, click on it.
          </h4>
        </div>

        <div
          className='active:opacity-50 border-2 flex flex-col justify-start w-50 h-55 bg-blue-200 rounded-sm transition-colors relative'
          id='human-deck-box'
          onClick={() => {
            setButtonSound(!buttonSound);
            handleDeckSelection(resistanceDeck);
          }}
        >
          <h3 className='text-center fontUncial bg-green-700 w-full border-b-2'>
            The Resistance
          </h3>

          <GiVikingShield className='absolute text-9xl right-8.5 top-12 opacity-20' />

          <p className='text-center p-2 font-bold my-4 text-lg'>
            Humans with souls forged for loyalty ready to give their heart in
            every battle
          </p>
          <h4 className='text-center font-bold'>
            To check its cards, click on it.
          </h4>
        </div>

        <div
          className='active:opacity-50 border-2 flex flex-col justify-start mr-1.5 w-50 h-55 bg-blue-200 rounded-sm transition-colors relative'
          id='vile-deck-box'
          onClick={() => {
            setButtonSound(!buttonSound);
            handleDeckSelection(vileDeck);
          }}
        >
          <h3 className='text-center fontUncial bg-red-900 w-full border-b-2'>
            Vile Force
          </h3>

          <GiDevilMask className='absolute text-9xl right-8 top-12 opacity-20' />

          <p className='text-center p-2 font-bold text-lg my-4'>
            An evil army from the underworld that will serve only doom on your
            behalf
          </p>
          <h4 className='text-center font-bold'>
            To check its cards, click on it.
          </h4>
        </div>
      </div>

      <button
        id='back-btn'
        className={`active:opacity-50 bg-amber-300 rounded-sm text-3xl font-bold p-2 border-2 transition-colors mt-8`}
        onClick={() => {
          setButtonSound(!buttonSound);
          goBack(true, false);
        }}
      >
        Go back
      </button>
    </div>
  );
}

// shows deck details for the selected deck
function DeckDetails({ deck, goBack, toBattle }) {

  const { setButtonSound, buttonSound } = useContext(globalContext);

  return (
    <div
      id='deckDetailsContainer'
      className='w-230 h-135 flex flex-col justify-start items-center'
    >
      <h1 className='text-center text-3xl mt-15 mb-8 text-amber-400 fontUncial'>
        {deck.name} Details
      </h1>
      <div className='flex justify-between items-center w-150'>
        <div
          className='border-2 rounded-sm backdrop-blur-2xl p-2 transition-all'
          id={
            deck.name === 'Angel Army'
              ? 'angel-deck'
              : deck.name === 'Vile Force'
                ? 'vile-deck'
                : 'human-deck'
          }
        >
          <ul>
            {deck.creatures.map((creature) => {
              if (creature.legendary) {
                return (
                  <p
                    key={creature.id}
                    className='flex items-center font-bold text-xl'
                  >
                    <MdOutlineStar className='text-blue-400 mr-1' /> (
                    {creature.quantity}) {creature.name}
                  </p>
                );
              } else {
                return (
                  <p
                    key={creature.id}
                    className='flex items-center font-bold text-xl'
                  >
                    <GiBroadsword className='mr-1' /> ({creature.quantity}){' '}
                    {creature.name}
                  </p>
                );
              }
            })}
            {deck.spells.map((spell) => {
              return (
                <p
                  key={spell.id}
                  className='flex items-center font-bold text-xl'
                >
                  <FaGripfire className='mr-1' /> ({spell.quantity}){' '}
                  {spell.name}
                </p>
              );
            })}
            {deck.lands.map((land) => {
              return (
                <p
                  key={land.id}
                  className='flex items-center font-bold text-xl'
                >
                  <GiMountaintop className='mr-1' /> ({land.quantity}){' '}
                  {land.name}
                </p>
              );
            })}
          </ul>
        </div>
        <span className='flex flex-col relative'>
          <h1 className='text-amber-400 fontUncial text-center text-2xl mb-2'>
            Icon Reference
          </h1>
          <GiBookmarklet className='absolute right-9 opacity-20 top-10 text-9xl' />
          <div className='border-2 rounded-sm bg-amber-300 p-2' id='box-shadow'>
            <p className='flex items-center font-bold text-xl'>
              <MdOutlineStar className='text-blue-400 mr-1' />
              Legendary Creature
            </p>
            <p className='flex items-center font-bold text-xl'>
              <GiBroadsword className='mr-1' />
              Vanilla Creature
            </p>
            <p className='flex items-center font-bold text-xl'>
              <FaGripfire className='mr-1' />
              Spells
            </p>
            <p className='flex items-center font-bold text-xl'>
              <GiMountaintop className='mr-1' />
              Lands
            </p>
          </div>
        </span>
      </div>
      <div className='flex items-center justify-center mt-4' id='btn-wrapper'>
        <button
          id='back-btn'
          className={`active:opacity-50 bg-amber-300 rounded-sm text-3xl font-bold p-2 border-2 transition-colors mr-4`}
          onClick={() => {
            setButtonSound(!buttonSound);
            goBack(false, true);
          }}
        >
          Go back
        </button>
        <button
          id='back-btn'
          className={`active:opacity-50 bg-amber-300 rounded-sm text-3xl font-bold p-2 border-2 transition-colors`}
          onClick={() => {
            setButtonSound(!buttonSound);
            toBattle(deck);
          }}
        >
          To Battle
        </button>
      </div>
    </div>
  );
}

export default MainMenu;
