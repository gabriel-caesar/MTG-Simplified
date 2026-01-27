import { globalContext, soundContext } from '../../contexts/contexts';
import { useContext } from 'react';

export default function SettingsSign({
  openMenu,
  setOpenMenu,
  handleQuit,
  areYouSureQuit,
  setAreYouSureQuit,
}) {
  const { buttonSound, setButtonSound } = useContext(soundContext);
  const { liftWoodenSign, setLiftWoodenSign } = useContext(globalContext)

  return (
    openMenu && (
      <div className='z-19'>
        {/* 
          This sign has absolute positioning because of the Player and Bot components.
          Also, this sign is styled differently if compared against the menu signs since it shares
          the same space with Player and Bot components, so if this sign is not absolute it will
          wrongly push the Bot component downwards, breaking the UI
        */}
        <div
          className='z-6 left-1/2 -translate-x-1/2 flex justify-center items-center absolute
            min-[2000px]:scale-200 translate-y-50' 
          id='wrapper-for-wooden-sign'
          style={{
            animation: !liftWoodenSign // tells the code to lift up or drag the wooden sign down
              ? 'bounce-in 1s linear'
              : 'bounce-out 1s linear'
          }}
        >
          <div
            className='w-3/4 h-full p-24 wooden-sign-bg flex flex-col items-center justify-center'
            id='woodenSign'
          >
            <h1
              className='text-amber-400 text-5xl fontUncial text-center'
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
                  className='active:brightness-50 my-4 bg-amber-300 rounded-sm text-2xl font-bold px-2 border-2 w-60 transition-colors inset-shadow-button'
                  id='resume-btn'
                >
                  Resume
                </button>
                <button
                  className='active:brightness-50 bg-amber-300 rounded-sm text-2xl font-bold px-2 border-2 w-60 transition-colors inset-shadow-button'
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
              <div className='active:brightness-50 flex flex-col justify-center items-center'>
                <button
                  onClick={() => {
                    setButtonSound(!buttonSound);
                    handleQuit();
                  }}
                  className='active:brightness-50 my-4 bg-amber-300 rounded-sm text-2xl font-bold px-2 w-60 border-2 transition-all inset-shadow-button'
                  id='yes-btn'
                >
                  Yes
                </button>
                <button
                  onClick={() => {
                    setButtonSound(!buttonSound);
                    setAreYouSureQuit(false);
                  }}
                  className='active:brightness-50 bg-amber-300 rounded-sm text-2xl font-bold px-2 w-60 border-2 transition-colors inset-shadow-button'
                  id='no-btn'
                >
                  No
                </button>
              </div>
            )}
          </div>
        </div>
        <VerticalChains liftWoodenSign={liftWoodenSign} />
      </div>
    )
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