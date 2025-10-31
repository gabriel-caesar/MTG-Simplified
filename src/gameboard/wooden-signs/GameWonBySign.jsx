import { useContext } from 'react';
import { globalContext } from '../../contexts/global-context';
import { gameboardContext } from '../../contexts/gameboard-context';

export default function GameWonBySign({ liftWoodenSign, handleQuit }) {
  const { buttonSound, setButtonSound, gameWonBy } = useContext(globalContext);
  const { setEndGameLog, setExpandLog } = useContext(gameboardContext);

  return (
    <div
      className='
        min-[2000px]:scale-125
        absolute top-0 left-1/2 -translate-x-1/2 z-20 flex justify-center items-end bg-amber-400
      '
      id='wrapper-for-chains'
      style={{
        animation: liftWoodenSign // tells the code to lift up or drag the wooden sign down
          ? 'bounce-in 1s linear'
          : 'bounce-out 1s linear',
      }}
    >
      <div
        className='absolute w-100 h-60 top-50 z-6 flex flex-col justify-center items-center'
        id={`${gameWonBy !== 'Bot' ? 'victoryWoodenSign' : 'defeatWoodenSign'}`}
      >
        <h1
          className='text-amber-400 text-2xl fontUncial mt-10'
          id={`${gameWonBy !== 'Bot' ? 'victory' : 'defeat'}-header-text`}
          aria-label={`${
            gameWonBy !== 'Bot' ? 'victory' : 'defeat'
          }-header-text`}
        >
          {gameWonBy !== 'Bot' ? 'Victory' : 'Defeat'}
        </h1>

        <button
          className='active:brightness-50 bg-amber-300 rounded-sm text-lg my-2 font-bold px-2 w-60 border-2 transition-colors inset-shadow-button'
          id='open-log-button'
          aria-label='open-log-button'
          onClick={() => {
            setButtonSound(!buttonSound);
            setEndGameLog(true);
            setExpandLog(true)
          }}
        >
          Open Game Log
        </button>

        <button
          className='active:brightness-50 bg-amber-300 rounded-sm text-lg font-bold px-2 w-60 border-2 transition-colors inset-shadow-button'
          id='return-menu-button'
          aria-label='return-menu-button'
          onClick={() => {
            setButtonSound(!buttonSound);
            handleQuit();
          }}
        >
          Return to Menu
        </button>
      </div>
      <div className='absolute -top-50' id='vertical-chains'></div>
    </div>
  );
}
