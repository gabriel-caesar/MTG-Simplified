import '../css/app.css';
import { createContext, useEffect, useReducer, useRef, useState } from 'react';
import { fetchCard } from '../js/fetchCard';
import MainMenu from './MainMenu';
import Start from './Start';
import { Volume2, Palette, Headphones, HeadphoneOff } from 'lucide-react';
import Gameboard from './Gameboard';

// global store for context
export const globalContext = createContext(null);

// reducer function to purely change state (player)
function playerReducer(state, action) {
  switch (action.type) {
    case 'create-player': // creates a brand new instance of player
      return {
        name: action.payload,
        deck_name: '',
        deck_card_objects: [], // filtered between creatures, lands and spells (before battle starts)
        deck_current_cards: 21,
        hands: [],
        mana_bar: [],
        hp: 20,
        battlefield: [],
        graveyard: [],
      };
    case 'set_deck': // sets a brand new deck for the player
      return {
        ...state,
        deck_name: action.payload.name,
        deck_card_objects: action.payload.card_objects,
      };
    case 'set_hands': // draws seven cards to the players hands
      return {
        ...state,
        hands: action.payload.hands,
        deck_card_objects: action.payload.updated_deck,
        deck_current_cards: action.payload.number_of_cards,
      };
    case 'update_hands': // deploys one mana to the mana bar
      return {
        ...state,
        hands: action.payload,
      };
    case 'deploy_mana':
      return {
        ...state,
        mana_bar: action.payload,
      }
    default:
      return state;
  }
}

function App() {
  const [player, dispatchPlayer] = useReducer(playerReducer, {});

  const [appTheme, setAppTheme] = useState('forest'); // main app theme

  const [startWebPage, setStartWebPage] = useState(false); // toggling it enables music and sound fxs

  const [battleStarts, setBattleStarts] = useState(false); // state to toggle Gameboard

  const [battlePrep, setBattlePrep] = useState(false); // darken the screen while horn is being blown

  const [leaveBattlefield, setLeaveBattlefield] = useState(false); // when player quits the battlefield in Gameboard.jsx

  const [playMainTheme, setPlayMainTheme] = useState(false); // when user quits battlefield

  const [buttonSound, setButtonSound] = useState(false); // plays when a button is clicked

  const [cardSound, setCardSound] = useState(false); // plays when the card is previewed

  const [manaSound, setManaSound] = useState(false); // plays when the mana is activated


  // control bar for sound fxs, music and theme
  const [themeControl, setThemeControl] = useState(false);
  const [musicControl, setMusicControl] = useState(false);
  const [soundControl, setSoundControl] = useState(false);

  // state to control the theme volume
  const [themeSongVolumeController, setThemeSongVolumeController] =
    useState(0.3);

  // theme song ref to keep it away from being created from scratch every time react re-renders
  const songRef = useRef(null);

  // sound effects volume controller
  const [soundFXVolumeController, setSoundFXVolumeController] = useState(1);

  // buttons sound state
  const buttonSoundRef = useRef(null);

  // card sound effect when selected from hands container
  const previewCardSoundRef = useRef(null);

  // mana activation effect
  const manaSoundRef = useRef(null);

  // decks states
  const [angelDeck, setAngelDeck] = useState({});
  const [resistanceDeck, setResistanceDeck] = useState({});
  const [vileDeck, setVileDeck] = useState({});

  function openDeckObject() {
    // pseudo-code
    // iterate through every card object
    // figure out their quantity
    // make copies for every object for how much quantity they have

    // used to iterate through every cards without going through properties (creatures, spells...)
    const deck_9_cards = [
      ...player.deck_card_objects.creatures,
      ...player.deck_card_objects.lands,
      ...player.deck_card_objects.spells,
    ];

    // extracting every card that quantity > 1 and filtering the undefined results
    const deck_16_cards = deck_9_cards
      .map((card) => {
        const tmp = [];

        if (card.quantity > 1) {
          for (let i = 0; i < card.quantity; i++) {
            tmp.push({ ...card, quantity: 1 });
          }
        } else {
          return;
        }
        return tmp;
      })
      .filter((card) => card !== undefined);

    // extracting every card that quantity === 1 and filtering the undefined results
    const deck_7_cards = deck_9_cards
      .map((card) => {
        if (card.quantity === 1) {
          return { ...card, quantity: 1 };
        } else {
          return;
        }
      })
      .filter((card) => card !== undefined);

    let deck_21_cards = []; // full raw deck

    // since we have arrays of objects in deck_16_arrays, the arrays need to be spread into the raw deck
    for (let i = 0; i < deck_16_cards.length; i++) {
      deck_21_cards.push(...deck_16_cards[i]);
    }

    // final spread for the raw deck
    return [...deck_21_cards, ...deck_7_cards];
  }

  function drawSevenCards() {
    // turns the quantity oriented object to raw 21 object cards array/deck
    let deck_21_cards = openDeckObject();

    let hands_cards = []; // temporary array to hold 7 cards

    const map = new Map(); // map to keep track of already drawn cards from the deck

    // while loop to ensure that 7 cards are drawn to player's hands
    while (hands_cards.length < 7) {
      const randomIndex = Math.floor(Math.random() * 20); // random number from 0 to 20
      if (!map.has(randomIndex.toString())) {
        map.set(randomIndex.toString());
        hands_cards.push(deck_21_cards[randomIndex]);
      }
    }

    // removing the card objects from the deck that are now in the player's hands
    for (let i = 0; i < hands_cards.length; i++) {
      const filterIndex = deck_21_cards.indexOf(hands_cards[i]);

      deck_21_cards.splice(filterIndex, 1);
    }

    // dispatching all the updated deck and hand info
    dispatchPlayer({
      type: 'set_hands',
      payload: {
        hands: hands_cards.sort(),
        updated_deck: deck_21_cards.sort(),
        number_of_cards: deck_21_cards.length,
      },
    });
  }

  // decks are built at the website startup
  useEffect(() => {
    async function createDeck(deck, setState) {
      try {
        const response = await fetch(`/decks/${deck}.json`); // reads the decks files
        if (!response.ok) return;
        const data = await response.json(); // return the data on it

        // creating an array for land cards containing its descriptions
        const landsArray = await Promise.all(
          data.lands.map(async (land) => {
            const landData = await fetchCard(land.type);
            const landObject = { ...land, ...landData };
            return landObject;
          })
        );

        // creating an array for creature cards containing its descriptions
        const creaturesArray = await Promise.all(
          data.creatures.map(async (creature) => {
            const creatureData = await fetchCard(creature.name);
            const cardObject = { ...creature, ...creatureData };
            return cardObject;
          })
        );

        // creating an array of spell cards containing its descriptions
        const spellsArray = await Promise.all(
          data.spells.map(async (spell) => {
            const spellData = await fetchCard(spell.name);
            const spellObject = { ...spell, ...spellData };
            return spellObject;
          })
        );

        let name = '';
        deck === 'angel-army'
          ? (name = 'Angel Army')
          : deck === 'vile-force'
            ? (name = 'Vile Force')
            : (name = 'The Resistance');

        // setting the cards to a setter function (any of the three decks)
        return setState({
          name: name,
          lands: landsArray,
          creatures: creaturesArray,
          spells: spellsArray,
        });
      } catch (error) {
        throw new Error(`Couldn't create deck. ${error.message}`);
      }
    }

    // creating every deck at the component mount phase
    createDeck('angel-army', setAngelDeck);
    createDeck('the-resistance', setResistanceDeck);
    createDeck('vile-force', setVileDeck);
  }, []);

  // starts the main theme song and sound effects
  useEffect(() => {
    // if there is already a soundtrack going on, pause it
    if (songRef.current) {
      songRef.current.pause();
    }

    // if the page loaded the sounds and music
    songRef.current = new Audio('../../soundfxs/main-theme.mp3');
    if (startWebPage || playMainTheme) {
      if (songRef.current.volume) {
        // this condition forces the song default volume
        songRef.current.volume = themeSongVolumeController;
        songRef.current.loop = true;
        songRef.current.play();
      }
    }
  }, [startWebPage, playMainTheme]);

  // when battle starts, song changes (player clicked 'To Battle')
  useEffect(() => {
    if (battleStarts) {
      // main theme stops
      songRef.current.pause();

      // getting battle horn
      const battleHorn = new Audio('../../soundfxs/horn-sound.mp3');

      battleHorn.volume = 0.8;

      // blow the horn
      battleHorn.play();

      setTimeout(() => {
        // after ten seconds this code will run
        songRef.current = new Audio('../../soundfxs/battle-theme.mp3');
        if (songRef.current.volume) {
          // this condition forces the song default volume

          songRef.current.volume = themeSongVolumeController;

          songRef.current.loop = true;
          battleHorn.pause();
          setBattlePrep(false); // screen backs to normal
          songRef.current.play();

          drawSevenCards(); // draw cards to hands
        }
      }, 12000);
    }
  }, [battleStarts]);

  // hook to watch the song theme
  useEffect(() => {
    // if the page loaded the sounds and music
    if (startWebPage) {
      songRef.current.volume = themeSongVolumeController;
    }
  }, [themeSongVolumeController]);

  // hook to watch for button clicks and sounds
  useEffect(() => {
    buttonSoundRef.current = new Audio('../../soundfxs/button-sound.mp3');

    if (buttonSoundRef.current.volume && startWebPage) {
      buttonSoundRef.current.volume = soundFXVolumeController;
      buttonSoundRef.current.currentTime = 0;
      buttonSoundRef.current.play();
    }
  }, [buttonSound]);

  // plays a sound for when cards are previewed
  useEffect(() => {
    previewCardSoundRef.current = new Audio('../../soundfxs/draw-card.mp3');

    if (previewCardSoundRef.current.volume && startWebPage) {
      previewCardSoundRef.current.volume = soundFXVolumeController;
      previewCardSoundRef.current.currentTime = 0;
      previewCardSoundRef.current.play();
    };
  }, [cardSound]);

  // plays a sound for when mana is activated
  useEffect(() => {
    manaSoundRef.current = new Audio('../../soundfxs/mana-activation.mp3');

    if (manaSoundRef.current.volume && startWebPage) {
      manaSoundRef.current.volume = soundFXVolumeController;
      manaSoundRef.current.currentTime = 0;
      manaSoundRef.current.play();
    };
  }, [manaSound]);

  // adjust sound fx volume
  useEffect(() => {
    if (startWebPage) {
      buttonSoundRef.current.volume = soundFXVolumeController;
      previewCardSoundRef.current.volume = soundFXVolumeController;
    }
  }, [soundFXVolumeController]);

  return (
    <main
      className='mainContainerImage relative transition-all'
      style={{
        // depending on what state appTheme is, the theme changes
        backgroundImage:
          appTheme === 'forest'
            ? `url('/UI_themes/gameboard-forest.png')`
            : appTheme === 'vile'
              ? `url('/UI_themes/gameboard-underworld.png')`
              : appTheme === 'heaven' &&
                `url('/UI_themes/gameboard-heaven.png')`,
        boxShadow: battlePrep
          ? 'inset 0 0 80px 50px #000'
          : leaveBattlefield
            ? 'inset 0 0 380px 250px #000'
            : 'inset 0 0 1px 1px #000',
      }}
    >
      <globalContext.Provider
        value={{
          angelDeck,
          resistanceDeck,
          vileDeck,
          appTheme,
          setAppTheme,
          startWebPage,
          setStartWebPage,
          player,
          dispatchPlayer,
          battlePrep,
          songRef,
          setButtonSound,
          buttonSound,
          cardSound,
          setCardSound,
          manaSound,
          setManaSound
        }}
      >
        {startWebPage ? (
          <>
            <nav
              className={`absolute flex justify-around items-center border-r-2 border-t-2 border-l-2 p-1 w-40 ${appTheme === 'vile' ? 'bg-gray-400' : 'backdrop-blur-lg'} rounded-t-sm rounded-tl-sm top-5 left-6 z-2`}
            >
              <button
                className={`${musicControl ? 'border-black' : 'border-transparent'} active:opacity-50 hover:cursor-pointer border-2 rounded-sm hover:text-gray-300 hover:border-black p-1 transition-colors`}
                onClick={() => {
                  setButtonSound(!buttonSound);
                  setMusicControl(!musicControl);
                  setThemeControl(false);
                  setSoundControl(false);
                }}
              >
                {themeSongVolumeController === 0 ? (
                  <HeadphoneOff />
                ) : (
                  <Headphones />
                )}
              </button>
              <button
                className={`${themeControl ? 'border-black' : 'border-transparent'} active:opacity-50 hover:cursor-pointer border-2 rounded-sm hover:text-gray-300 hover:border-black p-1 transition-colors`}
                onClick={() => {
                  setButtonSound(!buttonSound);
                  setThemeControl(!themeControl);
                  setMusicControl(false);
                  setSoundControl(false);
                }}
              >
                <Palette />
              </button>
              <button
                className={`${soundControl ? 'border-black' : 'border-transparent'} active:opacity-50 hover:cursor-pointer border-2 rounded-sm hover:text-gray-300  hover:border-black p-1 transition-colors`}
                onClick={() => {
                  setButtonSound(!buttonSound);
                  setSoundControl(!soundControl);
                  setThemeControl(false);
                  setMusicControl(false);
                }}
              >
                <Volume2 />
              </button>
            </nav>
            <div
              className={`${(soundControl || themeControl || musicControl) && 'border-t-2'} absolute left-6 top-16 text-lg font-bold ${appTheme === 'vile' ? 'bg-gray-400' : 'backdrop-blur-lg'} w-40 p-1 border-r-2 border-l-2 border-b-2 rounded-b-sm rounded-bl-sm z-2`}
            >
              {musicControl ? (
                <div className='flex flex-col justify-center items-center'>
                  <p className='fontCizel text-center'>Music Volume</p>
                  <input
                    type='range'
                    min='0'
                    max='1'
                    step='0.01'
                    value={themeSongVolumeController}
                    onChange={(e) =>
                      setThemeSongVolumeController(parseFloat(e.target.value))
                    }
                  />
                </div>
              ) : soundControl ? (
                <div className='flex flex-col justify-center items-center'>
                  <p className='fontCizel text-center'>Sound Volume</p>
                  <input
                    type='range'
                    min='0'
                    max='1'
                    step='0.01'
                    value={soundFXVolumeController}
                    onChange={(e) =>
                      setSoundFXVolumeController(parseFloat(e.target.value))
                    }
                  />
                </div>
              ) : (
                themeControl && (
                  <>
                    <p className='text-center fontCizel'>Themes</p>
                    <span className='flex flex-col justify-center items-center'>
                      <button
                        onClick={() => {
                          setButtonSound(!buttonSound);
                          setAppTheme('forest');
                        }}
                        className={`bg-green-600 shadowBox hover:cursor-pointer hover:opacity-70 hover:border-gray-400 transition-all w-full mb-1 rounded-sm border-1`}
                      >
                        Forest
                      </button>
                      <button
                        onClick={() => {
                          setButtonSound(!buttonSound);
                          setAppTheme('vile');
                        }}
                        className={`bg-red-700 shadowBox hover:cursor-pointer hover:opacity-70 hover:border-gray-400 transition-all w-full mb-1 rounded-sm border-1`}
                      >
                        Vile
                      </button>
                      <button
                        onClick={() => {
                          setButtonSound(!buttonSound);
                          setAppTheme('heaven');
                        }}
                        className={`bg-amber-200 shadowBox hover:cursor-pointer hover:opacity-70 hover:border-gray-400 transition-all w-full mb-1 rounded-sm border-1`}
                      >
                        Heaven
                      </button>
                    </span>
                  </>
                )
              )}
            </div>
            {battleStarts ? (
              <Gameboard
                setBattleStarts={setBattleStarts}
                setLeaveBattlefield={setLeaveBattlefield}
                setPlayMainTheme={setPlayMainTheme}
              />
            ) : (
              <MainMenu
                setBattleStarts={setBattleStarts}
                setBattlePrep={setBattlePrep}
              />
            )}
          </>
        ) : (
          <div className='flex justify-center items-center h-screen'>
            <Start />
          </div>
        )}
      </globalContext.Provider>
    </main>
  );
}

export default App;
