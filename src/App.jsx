import './css/app.css';
import './css/legendary.css'

import drawSevenCards from './deck-management/draw-seven-cards.js';
import createDeck from './deck-management/create-deck.js';

import { useEffect, useReducer, useState } from 'react';
import { botReducer, playerReducer } from './reducers/reducers.js';
import { globalContext } from './contexts/contexts.js';

export default function App({ children }) {
  const [player, dispatchPlayer] = useReducer(playerReducer, {}); // player state manager

  const [bot, dispatchBot] = useReducer(botReducer, {}); // bot state manager

  const [gameWonBy, setGameWonBy] = useState(''); // game winning state

  const [appTheme, setAppTheme] = useState('forest'); // main app theme

  const [startWebPage, setStartWebPage] = useState(false); // toggling it enables music and sound fxs

  const [battleStarts, setBattleStarts] = useState(false); // state to toggle Gameboard

  const [battlePrep, setBattlePrep] = useState(false); // darken the screen while horn is being blown

  const [leaveBattlefield, setLeaveBattlefield] = useState(false); // when player quits the battlefield in Gameboard.jsx

  const [liftWoodenSign, setLiftWoodenSign] = useState(false); // flag to signal sign to lift or descend

  // what card is being currently enlarged in the battlefield
  const [toEnlarge, setToEnlarge] = useState('');

  // decks states - used on DeckSelection.jsx
  const [resistanceDeck, setResistanceDeck] = useState({});
  const [angelDeck, setAngelDeck] = useState({});
  const [vileDeck, setVileDeck] = useState({});
  // used to decide what deck bot will choose
  const allDecks = [angelDeck, resistanceDeck, vileDeck];

  // decks are built at the website startup
  useEffect(() => {
    // creating every deck at the component mount phase
    createDeck('angel-army', setAngelDeck);
    createDeck('the-resistance', setResistanceDeck);
    createDeck('vile-force', setVileDeck);
  }, []);

  useEffect(() => {
    if (battleStarts) {
      drawSevenCards(player, dispatchPlayer); // draw cards to player's hands
      drawSevenCards(bot, dispatchBot); // draw cards to bot's hands
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [battleStarts]);

  function handleChains() {
    if (startWebPage) {
      setLiftWoodenSign(true); // chains goes up
      // time that the chain takes to lift up
      setTimeout(() => setLiftWoodenSign(false), 900); // animation is 1s, timeout is 0.9s
    }
  }

  const contextValues = {
    appTheme,
    setAppTheme,
    startWebPage,
    setStartWebPage,
    gameWonBy,
    setGameWonBy,
    player,
    dispatchPlayer,
    bot,
    dispatchBot,
    battlePrep,
    setBattlePrep,
    leaveBattlefield, 
    setLeaveBattlefield,
    battleStarts, 
    setBattleStarts,
    liftWoodenSign,
    setLiftWoodenSign,
    toEnlarge,
    setToEnlarge,
    allDecks,
    angelDeck,
    resistanceDeck,
    vileDeck,
    handleChains
  };

  return (
    <> 
      <UnplayableScreen />

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

          { children }

        </globalContext.Provider>
      </main>
    </>
  );
}

function UnplayableScreen() {
  return (
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
        Try turning your device sideways or use a desktop/laptop
      </p>

    </div>
  )
}