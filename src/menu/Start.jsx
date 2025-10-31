import { globalContext } from '../contexts/global-context.js';
import { useContext, useEffect } from 'react';
import '../css/main_menu.css';

function Start() {
  const { setStartWebPage, setButtonSound, buttonSound } =
    useContext(globalContext);

  // if user press enter, it will start the game
  useEffect(() => {
    function hitEnterToStart(e) {
      if (e.key === 'Enter') {
        setButtonSound(prev => !prev);
        setStartWebPage(true);
      }
    }

    window.addEventListener('keydown', hitEnterToStart);

    return () => {
      window.removeEventListener('keydown', hitEnterToStart);
    };
  }, []);

  return (
    <div
      className='flex flex-col justify-center items-center rounded-sm border-2 py-6 px-12'
      id='startContainer'
    >
      <h1 className='text-center text-3xl font-bold fontUncial min-[2000px]:text-5xl'>
        Magic: The Gathering Simplified
      </h1>
      <p className='text-center text-2xl text-gray-950 font-bold my-8 min-[2000px]:text-4xl'>
        A simplified version of the famous MTG card game
      </p>
      <button
        id='start-btn'
        className={`bg-amber-300 rounded-sm text-3xl font-bold p-2 border-2 active:brightness-50 transition-all min-[2000px]:text-5xl`}
        onClick={() => {
          setButtonSound(!buttonSound);
          setStartWebPage(true);
        }}
      >
        Start
      </button>
      <p className='text-amber-300 text-lg font-bold mt-6'>
        Press enter to start the game
      </p>
    </div>
  );
}

export default Start;
