import { gameboardContext } from '../contexts/gameboard-context';
import { globalContext } from '../contexts/global-context';
import { useContext } from 'react';
import { Cog } from 'lucide-react';
import PassTurnButton from './PassTurnButton';
import GameLog from './game-log/GameLog';

export default function MiddleBar({
  handleQuit,
  liftWoodenSign,
  setLiftWoodenSign,
  openMenu,
  setOpenMenu,
}) {
  const { 
    appTheme, 
    gameWonBy,
    battlePrep,
  } = useContext(globalContext);

  const { toEnlarge } = useContext(gameboardContext)

  return (
    <div
      id='middle-bar-separator'
      className={`
        ${toEnlarge === '' || toEnlarge === null ? 'z-5' : 'z-3'}
        ${battlePrep ? 'justify-center' : 'justify-between'}
        w-full absolute top-1/2 -translate-y-1/2
        flex items-center 
      `}
    >
      <div
        id='separator-hr'
        className={`w-full h-0.5 absolute
          ${appTheme === 'vile' ? 'bg-gray-400' : 'bg-black'} -z-1`}
      ></div>

      {/* Render after the horn is blown */}
      {!battlePrep && (
        <SettingsButton
          setLiftWoodenSign={setLiftWoodenSign}
          liftWoodenSign={liftWoodenSign}
          setOpenMenu={setOpenMenu}
          openMenu={openMenu}
        />
      )}

      <GameLog />

      {/* Render after the horn is blown */}
      {!battlePrep && (
        <PassTurnButton />
      )}

    </div>
  );
}

function SettingsButton({
  setLiftWoodenSign = { setLiftWoodenSign },
  liftWoodenSign = { liftWoodenSign },
  setOpenMenu = { setOpenMenu },
  openMenu = { openMenu },
}) {
  const { setButtonSound, buttonSound, gameWonBy } = useContext(globalContext);

  return (
    <button
      className='active:bg-amber-300/60 z-3 bg-amber-300 rounded-sm text-3xl font-bold p-2 border-2 transition-all inset-shadow-button'
      id='settings-btn'
      aria-label='settings-btn'
      disabled={gameWonBy !== '' ? true : false}
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
  );
}
