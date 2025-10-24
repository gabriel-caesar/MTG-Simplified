import { useContext } from 'react';
import { globalContext } from '../../contexts/global-context';

export default function SettingsSign({
  openMenu,
  setOpenMenu,
  liftWoodenSign,
  setLiftWoodenSign,
  handleQuit,
  areYouSureQuit,
  setAreYouSureQuit,
}) {
  const { buttonSound, setButtonSound } = useContext(globalContext);

  return (
    openMenu && (
      <div
        className='absolute min-[2000px]:scale-150 left-1/2 top-0 z-20 flex justify-center items-end bg-amber-400'
        id='wrapper-for-chains'
        style={{
          animation: !liftWoodenSign // tells the code to lift up or drag the wooden sign down
            ? 'bounce-in 1s linear'
            : 'bounce-out 1s linear'
        }}
      >
        <div
          className='absolute top-40 w-100 h-60 z-6 flex flex-col justify-center items-center'
          id='woodenSign'
        >
          <h1
            className='text-amber-400 text-2xl fontUncial'
            id='menu-header-text'
            aria-label='menu-header-text'
          >
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
                className='active:opacity-50 my-4 bg-amber-300 rounded-sm text-lg font-bold px-2 border-2 w-60 transition-colors inset-shadow-button'
                id='resume-btn'
              >
                Resume
              </button>
              <button
                className='active:opacity-50 bg-amber-300 rounded-sm text-lg font-bold px-2 border-2 w-60 transition-colors inset-shadow-button'
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
                className='active:opacity-50 my-4 bg-amber-300 rounded-sm text-lg font-bold px-2 w-60 border-2 transition-all inset-shadow-button'
                id='yes-btn'
              >
                Yes
              </button>
              <button
                onClick={() => {
                  setButtonSound(!buttonSound);
                  setAreYouSureQuit(false);
                }}
                className='active:opacity-50 bg-amber-300 rounded-sm text-lg font-bold px-2 w-60 border-2 transition-colors inset-shadow-button'
                id='no-btn'
              >
                No
              </button>
            </div>
          )}
        </div>
        <div className='absolute -top-50' id='vertical-chains'></div>
      </div>
    )
  );
}
