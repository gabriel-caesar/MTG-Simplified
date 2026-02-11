import { NavLink } from 'react-router';
import WoodenSign from '../WoodenSign';

// wooden sign for the player to enter its name
export default function EnterYourName({ submitPlayerName, playerName, setPlayerName }) {
  return (
    <WoodenSign
      animate={false}
      w='w-[785.25px]'
      h='h-[768px]'
      style='z-2 p-20 flex items-center justify-center'
    >
      <form
        className='flex flex-col items-center justify-center'
        id='singleplayer-name-form'
        onSubmit={(e) => submitPlayerName(e)}
      >
        <h1 className='text-center text-amber-100 mb-10 text-5xl font-bold fontUncial'>
          Welcome to MTG Simplified!
        </h1>
        <label htmlFor='player-name' className='text-amber-100 text-center font-bold text-4xl'>
          Tell us your name:
        </label>
        <input
          type='text'
          id='player-name'
          placeholder='Name...'
          className='bg-gray-900 text-gray-300 p-2 rounded-sm text-3xl font-bold w-100 border-1'
          value={playerName}
          onChange={(e) => {
            // 7 characters max
            if (e.target.value.length < 8) setPlayerName(e.target.value);
          }}
          autoFocus={true}
          required
        />

        <div
          id='button-container'
          className='mt-8 w-1/2 flex flex-col items-center justify-center'
        >
          <button
            id='submit-btn'
            arial-label='submit-button'
            className='button-shadow active:brightness-50 bg-amber-300 rounded-sm text-3xl font-bold p-2 border-2 transition-all hover:cursor-pointer hover:brightness-50 w-100 text-center mb-4'
          >
            Submit
          </button>
        </div>

        <NavLink 
          to='/'
          id='back-btn'
          arial-label='back-button'
          className='button-shadow active:brightness-50 bg-amber-100 rounded-sm text-3xl font-bold p-2 border-2 transition-all hover:cursor-pointer hover:brightness-50 w-100 text-center'
          onClick={() => setButtonSound(!buttonSound)}
        >
          Back
        </NavLink>
      </form>
    </WoodenSign>
  );
}