import { useContext, useState } from 'react';
import { gameboardContext } from '../../contexts/gameboard-context';
import { GiBroadsword, GiCrossedSwords } from 'react-icons/gi';
import { CiSquareMinus, CiSquarePlus } from 'react-icons/ci';
import { globalContext } from '../../contexts/global-context';
import { TbPlayCardStar } from 'react-icons/tb';
import { IoFileTrayFull } from 'react-icons/io5';

export default function LogMessages() {
  const { gameState, setGameState } = useContext(gameboardContext);
  const { setButtonSound, buttonSound } = useContext(globalContext);

  // used to open the details window of a log
  const [openLogDetails, setOpenLogDetails] = useState('');

  return gameState.length > 0 ? (
    gameState.map((state) => {
      // creating the turn log bubbles
      return (
        <div
          className={`
              ${state.owner !== 'Bot' ? 'bg-purple-800/30 border-amber-400/50' : 'bg-red-800/30 border-gray-400/50'}
              rounded-md w-full mb-2 border-2
            `}
          key={state.id}
          id={`turn${state.turn}-log-bubble`}
          aria-label={`turn${state.turn}-log-bubble`}
        >
          <h1
            className={`
                ${state.owner !== 'Bot' ? 'border-amber-400/50' : 'border-gray-400/50'}
                text-lg w-full flex justify-start items-center border-b-2 shadow-[inset_0_2px_8px_rgba(0,0,0,0.3)] py-1 px-2
              `}
            id='game-turn-bubble-header'
            aria-label='game-turn-bubble-header'
          >
            Game Turn: {state.turn}
          </h1>

          <div
            id='log-container-wrapper'
            aria-label='log-container-wrapper'
          >
            {state.log.map(messageObj => (
              <div
                className={`
                p-2 flex items-center justify-between w-full
              `}
              key={messageObj.id}
              id='log-container'
              aria-label='log-container'
              >
                <h2 
                  className='text-lg flex items-center text-amber-100'
                  id='log-description'
                  aria-label='log-description'
                >
                  {messageObj.type === 'Take damage on HP' ? (
                    <>
                      <GiBroadsword className='mr-2' />
                      <span className={`${state.owner !== 'Bot' ? 'text-blue-400' : 'text-red-400'} mr-2`}>
                        {state.owner}
                      </span>
                      took
                      <span className='text-red-500 fontUncial mx-2 flex'>
                        {messageObj.totalDamage}
                      </span>
                      of damage
                    </>
                  ) : messageObj.type === 'Creature clash' ? (
                    <>
                      <GiCrossedSwords className='mr-2' />
                      <span className={`${state.owner !== 'Bot' ? 'text-blue-400' : 'text-red-400'} mr-2`}>
                        {messageObj.details.defender.name}
                      </span>
                        defended against
                      <span className={`text-red-500 mx-2 flex`}>
                        {messageObj.details.attacker.name}
                      </span>
                    </>
                  ) : messageObj.type === 'Deploy creature' ? (
                    <>
                      <TbPlayCardStar className='mr-2' />
                      <span className={`${state.owner !== 'Bot' ? 'text-blue-400' : 'text-red-500'} mr-2`}>
                        {state.owner}
                      </span>
                        deployed
                      <span className={`text-amber-400 mx-2 flex`}>
                        {messageObj.details.creature.name}
                      </span>
                    </>
                  ) : messageObj.type === 'Battlefield cap' && (
                    <>
                      <IoFileTrayFull className='mr-2' />
                      <span className={`${state.owner !== 'Bot' ? 'text-blue-400' : 'text-red-500'} mr-2`}>
                        {state.owner}
                      </span>
                        reached its full battlefield capacity
                    </>
                  )}
                  
                </h2>

                <button
                  className={`
                    text-3xl hover:cursor-pointer hover:text-amber-100 transition-all
                  `}
                  id='show-details-button'
                  aria-label='show-details-button'
                  onClick={() => {
                    setButtonSound(!buttonSound);
                    setOpenLogDetails(openLogDetails !== messageObj.id ? messageObj.id : '');
                  }}
                >
                  {openLogDetails === messageObj.id ? <CiSquareMinus /> : <CiSquarePlus />}
                </button>
              </div>
            ))}
          </div>
        </div>
      );
    })
  ) : (
    <p
      className='text-center text-lg'
      id='nothing-happened-text'
      aria-label='nothing-happened-text'
    >
      Nothing happened yet...
    </p>
  );
}
