import '../css/gameboard.css';
import '../css/scroll_bars.css';
import '../css/main_menu.css';
import 'mana-font/css/mana.min.css'; // npm install mana-font for mtg mana icons
import { useContext, useState, useEffect, useRef } from 'react';
import { gameboardContext } from '../contexts/gameboard-context.js';
import { globalContext } from '../contexts/global-context.js';
import { isEnoughMana } from '../gameplay-actions/mana.js';
import SettingsSign from './wooden-signs/SettingsSign.jsx';
import MiddleBar from './MiddleBar.jsx';
import Player from './Player.jsx';
import Bot from './Bot.jsx';
import GameWonBySign from './wooden-signs/GameWonBySign.jsx';

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
    bot,
    gameWonBy,
    setGameWonBy,
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

  // cards from Hands being clicked to be inspected
  const [cardBeingClicked, setCardBeingClicked] = useState('');

  // cards from player's Graveyard being clicked to be inspected
  const [playerGraveCard, setPlayerGraveCard] = useState(null);

  // cards from bot's Graveyard being clicked to be inspected
  const [botGraveCard, setBotGraveCard] = useState(null);

  // state that will disable every playing tool from player while bot plays
  const [playerPassedTurn, setPlayerPassedTurn] = useState(false);

  // if player is currently attacking with a card
  const [isPlayerAttacking, setIsPlayerAttacking] = useState(false);

  // if bot is currently attacking witha card
  const [isBotAttacking, setIsBotAttacking] = useState(false);

  // bot attacking cards will be stored here
  const [botAttackingCards, setBotAttackingCards] = useState([]);

  // either take damage on HP or defend with cards
  const [playerDefenseDecisions, setPlayerDefenseDecisions] = useState([]);

  // featured in the GameLog and PassTurnButton
  const [loadSpin, setLoadSpin] = useState(false);

  // array that will feed game log with data
  const [gameState, setGameState] = useState([]);

  // reference of bot state for the recursive botPlays() function
  const botRef = useRef(bot);

  // reference of player state for the recursive botPlays() function
  const playerRef = useRef(player);

  // what card is being currently enlarged in the battlefield
  const [toEnlarge, setToEnlarge] = useState('');

  // keeps track of turn the game is currently in
  const [gameTurn, setGameTurn] = useState(1);

  // keeping track of the original card toughness
  const [originalToughness, setOriginalToughness] = useState([]);

  // expands or shrinks the gamelog panel
  const [expandLog, setExpandLog] = useState(false);

  // opens the mana bar for the narrow screen mana bar
  const [openManaBar, setOpenManaBar] = useState('');

  // function to reverse the component to deck selection
  function handleQuit() {
    setLiftWoodenSign(liftWoodenSign ? false : true); // lift the wooden sign

    setTimeout(() => {
      // waiting the wooden sign lift

      setEraseUI(true); // erase battlefield for transition

      setLeaveBattlefield(true); // dark screen transition fades-in

      setGameWonBy(''); // reseting the winner
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
  }, [liftWoodenSign, gameWonBy]);

  // every time player clicks a card to preview it,
  // the code calculates if there is enough mana to deploy it
  useEffect(() => {
    isEnoughMana(player, dispatchPlayer, player.mana_bar);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cardBeingClicked]);

  const values = {
    expandLog,
    setExpandLog,
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
    isPlayerAttacking,
    setIsPlayerAttacking,
    gameTurn,
    setGameTurn,
    botRef,
    botAttackingCards,
    setBotAttackingCards,
    playerDefenseDecisions,
    setPlayerDefenseDecisions,
    isBotAttacking,
    setIsBotAttacking,
    loadSpin,
    setLoadSpin,
    playerGraveCard,
    setPlayerGraveCard,
    botGraveCard,
    setBotGraveCard,
    gameState,
    setGameState,
    openManaBar,
    setOpenManaBar,
  };

  return (
    <gameboardContext.Provider value={values}>
      {!eraseUI && (
        <>
          {/* Sign is dropped whenever a competitor wins the game */}
          {gameWonBy !== '' && (
            <GameWonBySign
              liftWoodenSign={liftWoodenSign}
              handleQuit={handleQuit}
            />
          )}
          {/* Will show as soon as player goes to battle */}
          <MiddleBar
            liftWoodenSign={liftWoodenSign}
            setLiftWoodenSign={setLiftWoodenSign}
            setOpenMenu={setOpenMenu}
            openMenu={openMenu}
            handleQuit={handleQuit}
          />
          {!battlePrep && ( // waits for the horn to be fully blown and the dark screen to fade out
            <div className='flex flex-col w-full h-full overflow-hidden'>
              <SettingsSign
                openMenu={openMenu}
                setOpenMenu={setOpenMenu}
                liftWoodenSign={liftWoodenSign}
                setLiftWoodenSign={setLiftWoodenSign}
                handleQuit={handleQuit}
                areYouSureQuit={areYouSureQuit}
                setAreYouSureQuit={setAreYouSureQuit}
              />
              <Bot />
              <Player />
            </div>
          )}
        </>
      )}
    </gameboardContext.Provider>
  );
}
