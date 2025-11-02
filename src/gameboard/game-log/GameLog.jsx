import { playerDefends } from '../../gameplay-actions/player-defends.js';
import { gameboardContext } from '../../contexts/gameboard-context.js';
import { globalContext } from '../../contexts/global-context.js';
import { Expand, Shrink } from 'lucide-react';
import { useContext, useEffect, useRef, useState } from 'react';
import { GiHuntingHorn } from 'react-icons/gi';
import DefenseDecisions from './DefenseDecisions.jsx';
import LogMessages from './LogMessages.jsx';
import LoadingSpinner from '../LoadingSpinner.jsx';
import '../../css/gameboard.css';
import '../../css/pulse.css';

export default function GameLog() {
  const {
    gameTurn,
    playerPassedTurn,
    isPlayerAttacking,
    expandLog,
    setExpandLog,
    setToEnlarge,
    isBotAttacking,
    setIsBotAttacking,
    playerDefenseDecisions,
    setPlayerDefenseDecisions,
    botAttackingCards,
    setBotAttackingCards,
    setOriginalToughness,
    loadSpin,
    setLoadSpin,
    setGameState,
    gameState,
    setEndGameLog,
    endGameLog,
  } = useContext(gameboardContext);
  const {
    battlePrep,
    player,
    dispatchPlayer,
    bot,
    dispatchBot,
    appTheme,
    buttonSound,
    setButtonSound,
    gameWonBy,
    setGameWonBy,
  } = useContext(globalContext);

  // used in DefenseDecisions.jsx
  // this will act as a copy to not necessarily turn the defend prop from the
  // the defendant cards right away, because the player might change his
  // mind and we want to preserve the animation for when the log closes
  const [battlefieldCopy, setBattlefieldCopy] = useState(player.battlefield);

  // references the game log container
  const logRef = useRef(null);

  // if bot is attacking when turn is passed over, expand the gamelog
  // for the user to defend and shrink any battlefield card
  useEffect(() => {
    if (isBotAttacking) {
      setToEnlarge('');
      setBattlefieldCopy(player.battlefield); // certifying that battlefieldCopy copies the array
      setExpandLog(true);
    }
  }, [isBotAttacking]);

  // handles the mouse click off the log area, so it will close it
  useEffect(() => {

    const handleClickOff = e => {
      if (
        logRef.current &&
        !logRef.current.contains(e.target) && !endGameLog) {
        setExpandLog(false);
      }
    }

    if (!isBotAttacking) {
      window.addEventListener('click', handleClickOff);
    }

    return () => {
      window.removeEventListener('click', handleClickOff);
    };

  }, [expandLog])

  return (
    <div
      ref={logRef}
      id='game-log-wrapper'
      className={`
      bg-gray-900 rounded-sm justify-center items-center border-2
      overflow-hidden transition-all duration-300
      ${expandLog ? 'w-180 h-80' : 'w-80 h-[27px]'}
      ${appTheme === 'vile' ? 'border-gray-400' : 'border-black'} 
    `}
    >
      <nav
        className={`relative
        ${expandLog && 'border-b-2'}
        ${isPlayerAttacking || isBotAttacking ? 'reactionRadialGrandient' : 'radialGradient'}
      `}
        id='game-log-container'
        aria-label='game-log-container'
      >
        <h1 className='fontUncial text-center'>
          {gameWonBy 
            ? 'Game over' 
            : battlePrep
              ? 'The battle horn is blown...'
              : isBotAttacking && !expandLog
                ? 'Defending...'
                : isBotAttacking
                  ? 'Bot is attacking, choose your defense!'
                  : isPlayerAttacking
                    ? 'Attack Phase'
                    : !playerPassedTurn
                      ? `${player.name}'s turn`
                      : `Bot's turn`}
        </h1>
        <button
          className={`
            ${
              botAttackingCards.length !== playerDefenseDecisions.length ||
              (isBotAttacking && !expandLog)
                ? 'bg-gray-900 text-amber-600 active:bg-gray-700 text-xl font-bold'
                : isBotAttacking
                  ? 'text-xl font-bold text-gray-900 bg-amber-400 hover:bg-gray-900 hover:text-amber-400 px-2'
                  : `bg-gray-900 text-amber-400 rounded-br-sm ${!battlePrep && 'hover:bg-amber-400 hover:text-gray-900'}`
            }
            absolute right-0 bottom-0 h-[24px] flex items-center justify-center px-1 ${!battlePrep && 'hover:cursor-pointer'}
            transition-all border-r-transparent rounded-tr-sm border-l-2 border-gray-900 w-fit
          `}
          onClick={async (e) => {
            e.stopPropagation();
            if (!battlePrep) {
              // after the battle horn finishes blowing
              setButtonSound(!buttonSound);
              setToEnlarge(''); // shrinks enlarged card if there is any

              if (gameWonBy) {
                // if it's opened, close it
                if (expandLog) setEndGameLog(false);
              }

              // in taller screens, game log can be clickable
              // due to the wooden sign not covering it, so
              // I disable the opening button, leaving only
              // the shrink button working
              if (!expandLog && gameWonBy) {
                return
              }

              if (isBotAttacking) {
                // player defends if bot's attacking

                setLoadSpin(true); // spinning the spinner

                // using async to have more control over order of execution
                await playerDefends(
                  bot,
                  dispatchBot,
                  player,
                  dispatchPlayer,
                  setOriginalToughness,
                  playerDefenseDecisions,
                  botAttackingCards,
                  setBotAttackingCards,
                  battlefieldCopy,
                  setExpandLog,
                  expandLog,
                  setGameWonBy,
                  setGameState,
                  gameState,
                  gameTurn,
                  setIsBotAttacking,
                  setPlayerDefenseDecisions,
                  setLoadSpin
                );

                // bot is not attacking anymore up to this point
                setIsBotAttacking(false);
                // clearing the arrays that resolve the battle
                setPlayerDefenseDecisions([]);
                setBotAttackingCards([]);
                // spinner stops spinning
                setLoadSpin(false);
              } else {
                setExpandLog(!expandLog); // shrinks game log normally when bot is not attacking
              }
            }
          }}
          disabled={
            botAttackingCards.length !== playerDefenseDecisions.length || // if player didn't make all the defending decisions
            (isBotAttacking && !expandLog) || // this situation is true whenever the user clicks defend for the first time
            loadSpin // if loading spinner is spinning
              ? true
              : false
          }
          aria-label='expand-game-log-button'
          id='expand-game-log-button'
        >
          {battlePrep ? (
            <GiHuntingHorn className='text-2xl pulse' />
          ) : playerPassedTurn ||
            isPlayerAttacking ||
            (isBotAttacking && !expandLog) ? (
            <LoadingSpinner />
          ) : isBotAttacking ? (
            'Defend'
          ) : expandLog ? (
            <Shrink />
          ) : (
            <Expand />
          )}
        </button>
        <span
          className={`absolute bg-gray-900 text-amber-400 left-0 border-l-transparent border-r-2 border-gray-900 w-fit px-1 text-center text-lg bottom-0 font-bold height-full fontUncial`}
          id='game-turn-number'
          aria-label='game-turn-number'
        >
          {gameTurn}
        </span>
      </nav>
      {expandLog && (
        <div
          id='game-state-log'
          aria-label='game-state-log'
          className={`p-2 text-amber-400 text-lg font-bold overflow-y-auto overflow-x-hidden h-73 pb-30`}
        >
          <DefenseDecisions
            battlefieldCopy={battlefieldCopy}
            setBattlefieldCopy={setBattlefieldCopy}
          />
          <LogMessages />
        </div>
      )}
    </div>
  );
}
