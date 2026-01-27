import { soundContext, gameboardContext, globalContext } from '../../contexts/contexts';
import { useContext } from 'react';

export default function GameWonBySign({ handleQuit }) {
  const { setEndGameLog, setExpandLog } = useContext(gameboardContext);
  const { buttonSound, setButtonSound } = useContext(soundContext);
  const { gameWonBy, liftWoodenSign } = useContext(globalContext);

  return (
    <div className='z-20'>
      <div
        className='left-1/2 -translate-x-1/2 flex justify-center items-center absolute
            min-[2000px]:scale-200 translate-y-50 scale-170'
        id='wrapper-for-wooden-sign'
        style={{
          animation: liftWoodenSign // tells the code to lift up or drag the wooden sign down
            ? 'bounce-in 1s linear'
            : 'bounce-out 1s linear',
        }}
      >
        <div
          className={`
            ${gameWonBy !== 'Bot' ? 'victory-wooden-sign-bg' : 'defeat-wooden-sign-bg'}
            w-full h-full p-16 wooden-sign-bg flex flex-col items-center justify-center
          `}
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
      </div>
      <VerticalChains liftWoodenSign={liftWoodenSign} />
    </div>
  );
}

function VerticalChains({ liftWoodenSign }) {
  return (
    <div
      className='chains-img absolute -z-1 top-0 right-1/2 translate-x-1/2'
      id='vertical-chains'
      style={{
        animation: liftWoodenSign // tells the code to lift up or drag the wooden sign down
          ? 'bounce-out 1s linear'
          : 'bounce-in 1s linear',
      }}
    ></div>
  )
}
