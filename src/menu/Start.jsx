import '../css/main_menu.css';
import { useContext } from 'react';
import { globalContext } from '../App.jsx';

function Start() {
  const { setStartWebPage, setButtonSound, buttonSound } =
    useContext(globalContext);

  return (
    <div
      className='flex flex-col justify-center items-center rounded-sm border-2 py-6 px-12'
      id='startContainer'
    >
      <h1 className='text-center text-3xl font-bold fontUncial'>
        Magic: The Gathering Simplified
      </h1>
      <p className='text-center text-2xl text-gray-950 font-bold my-8'>
        A simplified version of the famous MTG card game
      </p>
      <button
        id='start-btn'
        className={`bg-amber-300 rounded-sm text-3xl font-bold p-2 border-2 transition-all`}
        onClick={() => {
          setButtonSound(!buttonSound);
          setStartWebPage(true);
        }}
      >
        Start
      </button>
    </div>
  );
}

export default Start;
