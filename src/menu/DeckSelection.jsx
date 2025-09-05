import { useContext } from 'react';
import { globalContext } from '../App';
import { GiCurlyWing, GiDevilMask, GiVikingShield } from 'react-icons/gi';

// deck selection panel after the user wrote his name on the wooden sign
export default function DeckSelection({ player, goBack, handleDeckSelection }) {
  const { angelDeck, resistanceDeck, vileDeck, setButtonSound, buttonSound } =
    useContext(globalContext);

  return (
    <div
      id='deckSelectionContainer'
      className='w-230 h-135 flex flex-col justify-start items-center'
    >
      <h1 className='text-center text-amber-100 text-2xl my-15 font-bold fontUncial'>
        Very well{' '}
        <strong className='text-amber-400 fontUncial'>{player.name}</strong>,
        select your deck wisely
      </h1>
      <div
        className='flex justify-between items-center w-3/4'
        id='decksWrapper'
      >
        <div
          className='active:opacity-50 border-2 flex flex-col justify-start w-50 h-55 bg-blue-200 rounded-sm transition-colors relative'
          id='angel-deck-box'
          onClick={() => {
            setButtonSound(!buttonSound);
            handleDeckSelection(angelDeck);
          }}
        >
          <h3 className='text-center fontUncial bg-amber-200 w-full border-b-2'>
            Angel Army
          </h3>

          <GiCurlyWing className='absolute text-9xl right-12 top-10 opacity-20' />

          <p className='text-center p-2 font-bold my-4 text-lg'>
            A deck with powerful forces of heaven that contains angels and will
            fight for your cause
          </p>
          <h4 className='text-center font-bold'>
            To check its cards, click on it.
          </h4>
        </div>

        <div
          className='active:opacity-50 border-2 flex flex-col justify-start w-50 h-55 bg-blue-200 rounded-sm transition-colors relative'
          id='human-deck-box'
          onClick={() => {
            setButtonSound(!buttonSound);
            handleDeckSelection(resistanceDeck);
          }}
        >
          <h3 className='text-center fontUncial bg-green-700 w-full border-b-2'>
            The Resistance
          </h3>

          <GiVikingShield className='absolute text-9xl right-8.5 top-12 opacity-20' />

          <p className='text-center p-2 font-bold my-4 text-lg'>
            Humans with souls forged for loyalty ready to give their heart in
            every battle
          </p>
          <h4 className='text-center font-bold'>
            To check its cards, click on it.
          </h4>
        </div>

        <div
          className='active:opacity-50 border-2 flex flex-col justify-start mr-1.5 w-50 h-55 bg-blue-200 rounded-sm transition-colors relative'
          id='vile-deck-box'
          onClick={() => {
            setButtonSound(!buttonSound);
            handleDeckSelection(vileDeck);
          }}
        >
          <h3 className='text-center fontUncial bg-red-900 w-full border-b-2'>
            Vile Force
          </h3>

          <GiDevilMask className='absolute text-9xl right-8 top-12 opacity-20' />

          <p className='text-center p-2 font-bold text-lg my-4'>
            An evil army from the underworld that will serve only doom on your
            behalf
          </p>
          <h4 className='text-center font-bold'>
            To check its cards, click on it.
          </h4>
        </div>
      </div>

      <button
        id='back-btn'
        className={`active:opacity-50 bg-amber-300 rounded-sm text-3xl font-bold p-2 border-2 transition-colors mt-8`}
        onClick={() => {
          setButtonSound(!buttonSound);
          goBack(true, false);
        }}
      >
        Go back
      </button>
    </div>
  );
}
