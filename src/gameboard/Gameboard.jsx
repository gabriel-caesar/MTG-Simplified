import '../css/gameboard.css';
import '../css/scroll_bars.css';
import '../css/main_menu.css';
import 'mana-font/css/mana.min.css'; // npm install mana-font for mtg mana icons
import { useContext, useState, useEffect, createContext, useRef } from 'react';
import { globalContext } from '../App.jsx';
import { Cog } from 'lucide-react';
import { isEnoughMana } from '../gameplay-actions/mana.js';
import Bot from './Bot.jsx';
import Player from './Player.jsx';
import PassTurnButton from './PassTurnButton.jsx';
import GameLog from './GameLog.jsx';

// a gameboard context to link states and functions to other components
// eslint-disable-next-line react-refresh/only-export-components
export const gameboardContext = createContext(null);

export default function Gameboard({
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

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cardBeingClicked]);

  const values = {
    cardBeingClicked,
    setCardBeingClicked,
    playerPassedTurn,
    setPlayerPassedTurn,
    toEnlarge,
    setToEnlarge,
    oneManaPerTurn,
    setOneManaPerTurn,
    originalToughness,
    setOriginalToughness,
    gameTurn,
    setGameTurn,
    botRef,
  };

  return (
    <gameboardContext.Provider value={values}>
      {!eraseUI && (
        <>
          <div
            className={`w-full h-0.5 absolute top-86.5 ${appTheme === 'vile' ? 'bg-gray-400' : 'bg-black'} z-3`}
          ></div>
          <GameLog />
          {!battlePrep && ( // waits for the horn to be fully blown and the dark screen to fade out
            <div className='flex flex-col w-full h-full overflow-hidden'>
              <Bot />
              <PassTurnButton />
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
