import { useEffect, useReducer, useRef, useState } from 'react';
import { competitorObject, deckObject } from './reducers/definitions.js';
import { globalContext } from './contexts/global-context.js';
import drawSevenCards from './deck-management/draw-seven-cards.js';
import ControlBar from './menu/control-bar/ControlBar.jsx';
import createDeck from './deck-management/create-deck.js';
import playerReducer from './reducers/player-reducer.js';
import botReducer from './reducers/bot-reducer.js';
import MainMenu from './menu/MainMenu.jsx';
import Start from './menu/Start.jsx';
import Gameboard from './gameboard/Gameboard.jsx';
import './css/app.css';
import './css/legendary.css'

function App() {
  const [player, dispatchPlayer] = useReducer(playerReducer, competitorObject); // player state manager

  const [bot, dispatchBot] = useReducer(botReducer, competitorObject); // bot state manager

  const [gameWonBy, setGameWonBy] = useState(''); // game winning state

  const [appTheme, setAppTheme] = useState('forest'); // main app theme

  const [startWebPage, setStartWebPage] = useState(false); // toggling it enables music and sound fxs

  const [battleStarts, setBattleStarts] = useState(false); // state to toggle Gameboard

  const [battlePrep, setBattlePrep] = useState(false); // darken the screen while horn is being blown

  const [leaveBattlefield, setLeaveBattlefield] = useState(false); // when player quits the battlefield in Gameboard.jsx

  const [playMainTheme, setPlayMainTheme] = useState(false); // when user quits battlefield

  const [buttonSound, setButtonSound] = useState(false); // plays when a button is clicked

  const [cardSound, setCardSound] = useState(false); // plays when the card is previewed

  const [manaSound, setManaSound] = useState(false); // plays when the mana is activated

  // state to control the theme volume
  const [themeSongVolumeController, setThemeSongVolumeController] =
    useState(0.3);

  // sound effects volume controller
  const [soundFXVolumeController, setSoundFXVolumeController] = useState(0.5);

  // theme song ref to keep it away from being created from scratch every time react re-renders
  const songRef = useRef(null);

  // buttons sound state
  const buttonSoundRef = useRef(null);

  // card sound effect when selected from hands container
  const previewCardSoundRef = useRef(null);

  // mana activation effect
  const manaSoundRef = useRef(null);

  // decks states - used on DeckSelection.jsx
  const [angelDeck, setAngelDeck] = useState(deckObject);
  const [resistanceDeck, setResistanceDeck] = useState(deckObject);
  const [vileDeck, setVileDeck] = useState(deckObject);
  // used to decide what deck bot will choose
  const allDecks = [angelDeck, resistanceDeck, vileDeck];

  // decks are built at the website startup
  useEffect(() => {
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startWebPage, playMainTheme]);

  // hook to watch the song theme
  useEffect(() => {
    // if the page loaded the sounds and music
    if (songRef.current) {
      songRef.current.volume = themeSongVolumeController;
    }
  }, [themeSongVolumeController]);

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

          drawSevenCards(player, dispatchPlayer); // draw cards to player's hands
          drawSevenCards(bot, dispatchBot); // draw cards to bot's hands
        }
      }, 12000);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [battleStarts]);

  // change the music theme when the player gets defeated or defeats bot
  useEffect(() => {
    // if there is already a soundtrack going on, pause it
    if (songRef.current) {
      songRef.current.pause();
    }

    // if the page loaded the sounds and music
    songRef.current = new Audio(
      `../../soundfxs/${gameWonBy === 'Bot' ? 'defeat' : gameWonBy !== '' && gameWonBy === player.name && 'victory'}-theme.mp3`
    );
    if (startWebPage || playMainTheme) {
      if (songRef.current.volume) {
        // this condition forces the song default volume
        songRef.current.volume = themeSongVolumeController;
        songRef.current.loop = true;
        songRef.current.play();
      }
    }
  }, [gameWonBy]);

  // hook to watch for button clicks and sounds
  useEffect(() => {
    buttonSoundRef.current = new Audio('../../soundfxs/button-sound.mp3');

    if (buttonSoundRef.current.volume && startWebPage) {
      buttonSoundRef.current.volume = soundFXVolumeController;
      buttonSoundRef.current.currentTime = 0;
      buttonSoundRef.current.play();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [buttonSound]);

  // plays a sound for when cards are previewed
  useEffect(() => {
    previewCardSoundRef.current = new Audio('../../soundfxs/draw-card.mp3');

    if (previewCardSoundRef.current.volume && startWebPage) {
      previewCardSoundRef.current.volume = soundFXVolumeController;
      previewCardSoundRef.current.currentTime = 0;
      previewCardSoundRef.current.play();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cardSound]);

  // plays a sound for when mana is activated
  useEffect(() => {
    manaSoundRef.current = new Audio('../../soundfxs/mana-activation.mp3');

    if (manaSoundRef.current.volume && startWebPage) {
      manaSoundRef.current.volume = soundFXVolumeController;
      manaSoundRef.current.currentTime = 0;
      manaSoundRef.current.play();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [manaSound]);

  const contextValues = {
    angelDeck,
    resistanceDeck,
    vileDeck,
    appTheme,
    setAppTheme,
    startWebPage,
    setStartWebPage,
    player,
    dispatchPlayer,
    bot,
    dispatchBot,
    battlePrep,
    setButtonSound,
    buttonSound,
    cardSound,
    setCardSound,
    manaSound,
    setManaSound,
    allDecks,
    gameWonBy,
    setGameWonBy,
  };

  return (
    <> 
      <div
        id='blank-screen'
        className='
          w-full h-screen bg-gray-900 items-center justify-center flex-col
          flex p-2 min-[918px]:hidden 
        '
      >

        <h1 className='fontUncial text-2xl text-amber-300 text-center mb-6'>
          This game doesn't support small device displays
        </h1>

        <p className='text-amber-300/60 text-md text-center'>
          Try turning your device or use a desktop/laptop
        </p>

      </div>
      <main
        className='
          mainContainerImage relative transition-all overflow-hidden flex
        '
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
            : gameWonBy === 'Bot'
              ? 'inset 0 0 380px 100px #290000'
              : gameWonBy === player.name && gameWonBy !== ''
                ? 'inset 0 0 380px 80px #a68d02'
                : leaveBattlefield
                  ? 'inset 0 0 380px 250px #000'
                  : 'inset 0 0 1px 1px #000',
        }}
      >
        <globalContext.Provider value={contextValues}>
          {startWebPage ? ( // this flag determines if game can or cannot produce sound as the user first interact with the website
            <>
              <ControlBar
                soundFXVolumeController={soundFXVolumeController}
                themeSongVolumeController={themeSongVolumeController}
                setSoundFXVolumeController={setSoundFXVolumeController}
                setThemeSongVolumeController={setThemeSongVolumeController}
              />

              {battleStarts ? ( // this flag determines if player should be inside the gameboard or main menu UI
                <Gameboard
                  setBattleStarts={setBattleStarts}
                  setLeaveBattlefield={setLeaveBattlefield}
                  setPlayMainTheme={setPlayMainTheme}
                  playMainTheme={playMainTheme}
                />
              ) : (
                <MainMenu
                  setBattleStarts={setBattleStarts}
                  setBattlePrep={setBattlePrep}
                  soundFXVolumeController={soundFXVolumeController}
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
    </>
  );
}

export default App;
