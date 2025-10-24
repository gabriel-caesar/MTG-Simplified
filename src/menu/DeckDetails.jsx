import { GiBookmarklet, GiBroadsword, GiMountaintop } from 'react-icons/gi';
import { globalContext } from '../contexts/global-context.js';
import { MdOutlineStar } from 'react-icons/md';
import { FaGripfire } from 'react-icons/fa';
import { useContext } from 'react';

// shows deck details for the selected deck
export default function DeckDetails({ deck, goBack, toBattle }) {
  const { setButtonSound, buttonSound } = useContext(globalContext);

  return (
    <div
      id='deckDetailsContainer'
      className='w-230 h-135 flex flex-col justify-start items-center'
    >
      <h1 className='text-center text-3xl mt-15 mb-8 text-amber-400 fontUncial'>
        {deck.name} Details
      </h1>
      <div className='flex justify-between items-center w-150'>
        <div
          className='border-2 rounded-sm backdrop-blur-2xl p-2 transition-all'
          id={
            deck.name === 'Angel Army'
              ? 'angel-deck'
              : deck.name === 'Vile Force'
                ? 'vile-deck'
                : 'human-deck'
          }
        >
          <ul>
            {deck.creatures.map((creature, index) => {
              if (creature.legendary) {
                return (
                  <p
                    key={creature.id}
                    className='flex items-center font-bold text-xl'
                  >
                    <MdOutlineStar className='text-blue-400 mr-1' /> (
                    {creature.quantity}) {creature.name}
                  </p>
                );
              } else {
                return (
                  <p
                    key={creature.id ? creature.id : index}
                    className='flex items-center font-bold text-xl'
                  >
                    <GiBroadsword className='mr-1' /> ({creature.quantity}){' '}
                    {creature.name}
                  </p>
                );
              }
            })}
            {deck.spells.map((spell) => {
              return (
                <p
                  key={spell.id}
                  className='flex items-center font-bold text-xl'
                >
                  <FaGripfire className='mr-1' /> ({spell.quantity}){' '}
                  {spell.name}
                </p>
              );
            })}
            {deck.lands.map((land) => {
              return (
                <p
                  key={land.name} // this doesn't matter since lands array has just one element
                  className='flex items-center font-bold text-xl'
                >
                  <GiMountaintop className='mr-1' /> ({land.quantity}){' '}
                  {land.name}
                </p>
              );
            })}
          </ul>
        </div>
        <span className='flex flex-col relative'>
          <h1 className='text-amber-400 fontUncial text-center text-2xl mb-2'>
            Icon Reference
          </h1>
          <GiBookmarklet className='absolute right-9 opacity-20 top-10 text-9xl' />
          <div className='border-2 rounded-sm bg-amber-300 p-2' id='box-shadow'>
            <p className='flex items-center font-bold text-xl'>
              <MdOutlineStar className='text-blue-400 mr-1' />
              Legendary Creature
            </p>
            <p className='flex items-center font-bold text-xl'>
              <GiBroadsword className='mr-1' />
              Vanilla Creature
            </p>
            <p className='flex items-center font-bold text-xl'>
              <FaGripfire className='mr-1' />
              Spells
            </p>
            <p className='flex items-center font-bold text-xl'>
              <GiMountaintop className='mr-1' />
              Lands
            </p>
          </div>
        </span>
      </div>
      <div className='flex items-center justify-center mt-4' id='btn-wrapper'>
        <button
          id='back-btn'
          className={`active:opacity-50 bg-amber-300 rounded-sm text-3xl font-bold p-2 border-2 transition-colors mr-4`}
          onClick={() => {
            setButtonSound(!buttonSound);
            goBack(false, true);
          }}
        >
          Go back
        </button>
        <button
          id='back-btn'
          className={`active:opacity-50 bg-amber-300 rounded-sm text-3xl font-bold p-2 border-2 transition-colors`}
          onClick={() => {
            setButtonSound(!buttonSound);
            toBattle(deck);
          }}
        >
          To Battle
        </button>
      </div>
    </div>
  );
}
