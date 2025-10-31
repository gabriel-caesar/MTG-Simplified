import { gameboardContext } from '../../contexts/gameboard-context';
import { globalContext } from '../../contexts/global-context';
import { CiSquareMinus, CiSquarePlus } from 'react-icons/ci';
import { shortenName } from '../../deck-management/utils';
import { IoFileTrayFull } from 'react-icons/io5';
import { GiCrossedSwords } from 'react-icons/gi';
import { useContext, useState } from 'react';
import '../../css/legendary.css';

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
              ${
                state.owner !== 'Bot'
                  ? 'bg-purple-800/30 border-amber-400/50'
                  : 'bg-red-800/30 border-gray-400/50'
              }
              rounded-md w-full mb-2 border-2
            `}
          key={state.id}
          id={`turn${state.turn}-log-bubble`}
          aria-label={`turn${state.turn}-log-bubble`}
        >
          <h1
            className={`
                ${
                  state.owner !== 'Bot'
                    ? 'border-amber-400/50'
                    : 'border-gray-400/50'
                }
                text-lg w-full flex justify-start items-center border-b-2 shadow-[inset_0_2px_8px_rgba(0,0,0,0.3)] py-1 px-2
              `}
            id='game-turn-bubble-header'
            aria-label='game-turn-bubble-header'
          >
            Game Turn: {state.turn}
          </h1>

          <div id='log-container-wrapper' aria-label='log-container-wrapper'>
            {state.log.map((messageObj) => (
              <div
                className={`
                p-2 flex items-center justify-between w-full
              `}
                key={messageObj.id}
                id='log-container'
                aria-label='log-container'
              >
                <h2
                  className='text-lg flex items-center justify-center text-amber-100'
                  id='log-description'
                  aria-label='log-description'
                >
                  {messageObj.type === 'Take damage on HP' ? (
                    <>
                      <span
                        className='
                          text-lg text-amber-500 
                          rounded-sm border-2 p-1 mr-2 
                          flex justify-items-center
                        '
                      >
                        <i class='ms ms-power-mtga ms-shadow'></i>
                      </span>
                      <span
                        className={`${
                          state.owner !== 'Bot'
                            ? 'text-blue-400'
                            : 'text-red-500'
                        } mr-2`}
                      >
                        {state.owner}
                      </span>
                      took
                      <span className='text-red-500 fontUncial mx-2 flex'>
                        {messageObj.totalDamage}
                      </span>
                      of damage and was left with
                      <span className={`${messageObj.competitorHP <= 10 ? 'text-red-500' : 'text-green-500'} fontUncial ml-2 flex`}>
                        {messageObj.competitorHP}
                      </span>
                      hp
                    </>
                  ) : messageObj.type === 'Creature clash' ? (
                    <>
                      <span
                        className='
                          text-lg text-amber-500 
                          rounded-sm border-2 p-1 mr-2 
                          flex justify-items-center
                        '
                      >
                        <GiCrossedSwords />
                      </span>
                      <span
                        className={`${
                          state.owner !== 'Bot'
                            ? 'text-blue-400'
                            : 'text-red-500'
                        } mr-2`}
                      >
                        {messageObj.details.defender.name}
                      </span>
                      defended against
                      <span className={`mx-2 flex ${state.owner === 'Bot' ? 'text-blue-400' : 'text-red-500'}`}>
                        {messageObj.details.attacker.name}
                      </span>
                    </>
                  ) : messageObj.type === 'Deploy creature' ? (
                    <>
                      <span
                        className={`
                          ${
                            messageObj.details.creature.legendary
                              ? 'text-green-500'
                              : 'text-amber-500 '
                          }
                          rounded-sm border-2 p-1 mr-2 
                          flex justify-items-center text-lg
                        `}
                      >
                        <i class='ms ms-creature ms-shadow'></i>
                      </span>
                      <span
                        className={`${
                          state.owner !== 'Bot'
                            ? 'text-blue-400'
                            : 'text-red-500'
                        } mr-2`}
                      >
                        {state.owner}
                      </span>
                      deployed
                      <span
                        className={`${
                          messageObj.details.creature.legendary
                            ? 'legendary-shimmer-log'
                            : 'text-amber-500 '
                        } mx-2 flex`}
                      >
                        {messageObj.details.creature.name}
                      </span>
                    </>
                  ) : messageObj.type === 'Battlefield cap' ? (
                    <>
                      <span
                        className='
                          text-lg text-amber-500 
                          rounded-sm border-2 p-1 mr-2 
                          flex justify-items-center
                        '
                      >
                        <IoFileTrayFull />
                      </span>
                      <span
                        className={`${
                          state.owner !== 'Bot'
                            ? 'text-blue-400'
                            : 'text-red-500'
                        } mr-2`}
                      >
                        {state.owner}
                      </span>
                      reached its full battlefield capacity
                    </>
                  ) : messageObj.type === 'Deploy mana' ? (
                    <>
                      <span
                        className='
                          text-lg text-amber-500 
                          rounded-sm border-2 p-1 mr-2 
                          flex justify-items-center
                        '
                      >
                        {messageObj.details.mana.color.some(
                          (x) => x === 'W'
                        ) ? (
                          <i class='ms ms-w ms-shadow'></i>
                        ) : (
                          <i class='ms ms-b ms-shadow'></i>
                        )}
                      </span>
                      <span
                        className={`${
                          state.owner !== 'Bot'
                            ? 'text-blue-400'
                            : 'text-red-500'
                        } mr-2`}
                      >
                        {state.owner}
                      </span>
                      deployed
                      <span className={`text-amber-400 mx-2 flex`}>
                        {messageObj.details.mana.name}
                      </span>
                    </>
                  ) : messageObj.type === 'Deploy spell' ? (
                    <>
                      <span
                        className={`
                          text-amber-500 text-lg
                          rounded-sm border-2 p-1 mr-2 
                          flex justify-items-center 
                        `}
                      >
                        <i class='ms ms-sorcery ms-shadow'></i>
                      </span>
                      <span
                        className={`${
                          state.owner !== 'Bot'
                            ? 'text-blue-400'
                            : 'text-red-500'
                        } mr-2`}
                      >
                        {state.owner}
                      </span>
                      deployed
                      <span className={`text-amber-400 mx-2 flex`}>
                        {messageObj.details.creature.name}
                      </span>
                    </>
                  ) : (
                    messageObj.type === 'Creature attack' ? (
                      <>
                        <span
                          className='
                          text-lg text-amber-500 
                          rounded-sm border-2 p-1 mr-2 
                          flex justify-items-center
                        '
                        >
                          <i class='ms ms-power-mtga ms-shadow'></i>
                        </span>
                        <span
                          className={`${
                            state.owner !== 'Bot'
                              ? 'text-blue-400'
                              : 'text-red-500'
                          } mr-2`}
                        >
                          {state.owner}
                        </span>
                        attacked with
                        <span className='mx-2 flex'>
                          {messageObj.details.attackingCreatures
                            .slice(0, 2)
                            .map((creature, index, arr) => {
                              const isLast = index === arr.length - 1;
                              const isSecondToLast = index === arr.length - 2;
                              const creatureName = creature.legendary
                                ? shortenName(creature.name)
                                : creature.name;

                              if (
                                isLast &&
                                messageObj.details.attackingCreatures.length > 2
                              )
                                return (
                                  <div key={index} className='flex'>
                                    <p
                                      className={`text-xl text-red-500 ${
                                        creature.legendary
                                          ? 'legendary-shimmer-log-log'
                                          : 'text-red-500'
                                      }`}
                                    >
                                      {creatureName}
                                    </p>
                                    <span className='text-amber-100 mx-1'>
                                      {' '}
                                      and others...
                                    </span>
                                  </div>
                                );

                              if (isLast)
                                return (
                                  <p
                                    key={index}
                                    className={`text-xl text-red-500 ${
                                      creature.legendary
                                        ? 'legendary-shimmer-log'
                                        : 'text-red-500'
                                    }`}
                                  >
                                    {creatureName}
                                  </p>
                                );
                              if (isSecondToLast && messageObj.details.attackingCreatures.length === 2)
                                return (
                                  <div key={index} className='flex'>
                                    <p
                                      className={`text-xl text-red-500 ${
                                        creature.legendary
                                          ? 'legendary-shimmer-log'
                                          : 'text-red-500'
                                      }`}
                                    >
                                      {creatureName}
                                    </p>
                                    <span className='text-amber-100 mx-2'>
                                      and
                                    </span>{' '}
                                  </div>
                                );

                              return (
                                <div key={index} className='flex'>
                                  <p
                                    className={`text-xl text-red-500 ${
                                      creature.legendary
                                        ? 'legendary-shimmer-log'
                                        : 'text-red-500'
                                    }`}
                                  >
                                    {creatureName}
                                  </p>
                                  <span className='text-amber-100 mr-2'>,</span>
                                </div>
                              );
                            })}
                        </span>
                      </>
                    ) : (
                     messageObj.type === 'Game won' && (
                      <>
                      <span
                        className={`
                          text-green-500 text-lg
                          rounded-sm border-2 p-1 mr-2 
                          flex justify-items-center 
                        `}
                      >
                        <i class='ms ms-planeswalker ms-shadow'></i>
                      </span>
                      <span
                        className={`${
                          messageObj.winner !== 'Bot'
                            ? 'text-blue-400'
                            : 'text-red-500'
                        } mr-2`}
                      >
                        {messageObj.winner}
                      </span>
                      won the game
                    </>
                     )
                    )
                  )}
                </h2>

                {/* Log details will be considered in a future version update */}
                {/* <button
                  className={`
                    text-3xl hover:cursor-pointer hover:text-amber-100 transition-all
                  `}
                  id='show-details-button'
                  aria-label='show-details-button'
                  onClick={() => {
                    setButtonSound(!buttonSound);
                    setOpenLogDetails(
                      openLogDetails !== messageObj.id ? messageObj.id : ''
                    );
                  }}
                >
                  {openLogDetails === messageObj.id ? (
                    <CiSquareMinus />
                  ) : (
                    <CiSquarePlus />
                  )}
                </button> */}
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
