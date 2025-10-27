import { useContext, useEffect, useState } from 'react';
import {
  isEnoughMana,
  activateMana,
  activateAllManas,
  deactivateAllManas,
} from '../../gameplay-actions/mana.js';
import { globalContext } from '../../contexts/global-context.js';
import { gameboardContext } from '../../contexts/gameboard-context.js';
import { SiElement } from 'react-icons/si';
import { IoMdClose } from 'react-icons/io';

export default function ManaBar({ competitor, dispatch }) {
  return (
    <>
      <WideScreen competitor={competitor} dispatch={dispatch} />
      <NarrowScreen competitor={competitor} dispatch={dispatch} />
    </>
  );
}

// displays itself when screen width is at least 1280px
function WideScreen({ competitor, dispatch }) {
  // context APIs
  const { setManaSound, manaSound, gameWonBy } = useContext(globalContext);
  const { playerPassedTurn, isBotAttacking } = useContext(gameboardContext);

  // condition if the manabar is for Bot
  const isBot = competitor.name === 'Bot';

  return (
    <div
      id='mana-bar-wrapper-wide-screen'
      className={`
        ${!isBot ? 'bottom-0' : 'top-0'} absolute 
        left-1/2 -translate-x-1/2 xl:flex hidden
        2xl:left-8/18 2xl:-translate-x-8/18 z-5
        min-[1630px]:-translate-x-1/2 min-[1630px]:left-1/2
      `}
    >
      <h1
        id='mana-bar-header'
        className={`
        ${!isBot ? 'rounded-tl-sm -top-8.5' : 'rounded-b-sm top-11.5 right-0'} 
        absolute fontUncial bg-gradient-to-bl from-blue-700 to-gray-900
        border-amber-400 text-2xl w-40 text-center border-2 text-amber-400
      `}
      >
        Mana bar
      </h1>

      {!isBot && (
        <button
          className={`
            absolute text-2xl border-2 text-amber-400 rounded-tr-sm -top-8.5 left-40
            bg-gradient-to-bl from-red-700 to-gray-900 p-1 hover:cursor-pointer
            hover:from-amber-600 hover:to-gray-900 transition-all
          `}
          id='activate-all-manas-button'
          aria-label='activate-all-manas-button'
          disabled={
            gameWonBy !== ''
              ? true
              : playerPassedTurn || isBotAttacking
              ? true
              : false
          }
          onClick={() => {
            const hasUnactivatedMana = competitor.mana_bar.some(
              (mana) => !mana.activated && !mana.used
            );
            setManaSound(!manaSound);
            if (hasUnactivatedMana) {
              const updatedManabar = activateAllManas(competitor, dispatch);
              console.log(updatedManabar)
              isEnoughMana(competitor, dispatch, updatedManabar)
            } else {
              const updatedManabar = deactivateAllManas(competitor, dispatch);
              isEnoughMana(competitor, dispatch, updatedManabar)
            }
          }}
        >
          <SiElement />
        </button>
      )}

      <div
        className={`
          ${!isBot ? 'rounded-t-sm border-b-0' : 'rounded-b-sm border-t-0'}
          2xl:w-200 h-12 border-2 border-amber-400 bg-gradient-to-bl from-blue-700 lg:w-100
          to-gray-900 flex p-1 justify-start items-center overflow-x-auto overflow-y-hidden
        `}
        id='mana-bar'
      >
        {competitor.mana_bar.map((card, index) => {
          return (
            <button
              className={`flex justify-between items-center rounded-sm mr-2 w-22 p-1 font-bold text-lg  border-2 transition-all ${
                card.activated && 'activatedMana'
              } ${
                card.used
                  ? 'hover:cursor-not-allowed cardTapped'
                  : card.name === 'Plains'
                  ? `${
                      isBotAttacking
                        ? 'hover:cursor-not-allowed'
                        : 'hover:cursor-pointer'
                    } white-card-background text-black hover:opacity-70`
                  : `${
                      isBotAttacking
                        ? 'hover:cursor-not-allowed'
                        : 'hover:cursor-pointer'
                    } black-card-background text-amber-200 hover:cursor-pointer hover:opacity-70`
              }`}
              id='mana-btn'
              aria-label='mana-btn'
              onClick={() => {
                if (!isBot) {
                  const updatedManaBar = activateMana(card, index, competitor, dispatch);
                  isEnoughMana(competitor, dispatch, updatedManaBar); // updates if there is enough mana for cards in hand
                  setManaSound(!manaSound);
                }
              }}
              key={index}
              disabled={
                gameWonBy !== ''
                  ? true
                  : playerPassedTurn || isBotAttacking
                  ? true
                  : card.used
                  ? true
                  : false
              }
            >
              <p>{card.name}</p>

              <p>
                {card.color[0] === 'W' ? (
                  <i class='ms ms-w ms-cost ms-shadow'></i>
                ) : (
                  <i class='ms ms-b ms-cost ms-shadow'></i>
                )}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// displays itself up to 1280px of screen width
function NarrowScreen({ competitor, dispatch }) {
  // context APIs
  const { setManaSound, manaSound, gameWonBy } = useContext(globalContext);
  const { playerPassedTurn, isBotAttacking, openManaBar, setOpenManaBar } =
    useContext(gameboardContext);

  // how many activated manas there are
  const [activatedManas, setActivatedManas] = useState(0);

  // how many unsed and unactivated manas there are
  const [availabeManas, setAvailableManas] = useState(0);

  // updating the available and activated mana states promptly
  useEffect(() => {

    const available = competitor.mana_bar.map(mana => {
      if (!mana.activated && !mana.used) return mana
    }).filter(x => x !== undefined);

    const activated = competitor.mana_bar.map(mana => {
      if (mana.activated) return mana
    }).filter(x => x !== undefined);

    setActivatedManas(activated.length);
    setAvailableManas(available.length);

  }, [competitor.mana_bar])

  // condition if the manabar is for Bot
  const isBot = competitor.name === 'Bot';

  return (
    <div
      id='mana-bar-wrapper-narrow-screen'
      className={`
        ${!isBot ? 'bottom-0 items-end' : 'top-0 items-start'} 
        ${openManaBar === competitor.name ? 'z-16' : 'z-10'}
        absolute left-1/2 -translate-x-1/2 xl:hidden flex
      `}
    >
      <div 
        id="mana-count"
        className={`
          ${isBot ? 'rounded-bl-md border-t-0 border-r-0 items-end' : 'rounded-tl-md border-b-0 border-r-0 items-end'}
          bg-gradient-to-bl from-blue-700 to-gray-900 text-3xl font-bold border-2 overflow-hidden
          transition-all duration-400 text-amber-400 p-1 h-8 flex justify-center
        `}
      >
        <p 
          className={`
            transition-all duration-600 text-sm mr-1
            ${
              openManaBar === competitor.name
                ? 'opacity-100'
                : 'opacity-0 absolute pointer-events-none'
            } 
          `}
        >
          Available
        </p>
        {availabeManas}
      </div>

      <div
        id='mana-bar'
        className={`
          ${isBot ? 'rounded-b-md border-t-0' : 'rounded-t-md border-b-0'}
          ${
            openManaBar !== competitor.name
              ? 'hover:cursor-pointer hover:brightness-80 w-15 justify-center overflow-hidden'
              : 'w-130 justify-start overflow-x-auto overflow-y-hidden'
          }
          p-1 border-2 border-amber-400 transition-all duration-300 relative h-12  
          bg-gradient-to-bl from-blue-700 to-gray-900 flex items-center 
        `}
        onClick={() => {
          setOpenManaBar(competitor.name);
        }}
      >
        {competitor.mana_bar.length <= 0 ? (
          <p
            className={`
            fontUncial text-amber-300/50 text-2xl transition-all duration-400
            absolute left-1/2 -translate-x-1/4 w-full
            ${
              openManaBar === competitor.name
                ? 'opacity-100'
                : 'opacity-0 pointer-events-none'
            }
          `}
          >
            No mana deployed yet
          </p>
        ) : (
          competitor.mana_bar.map((card, index) => (
            <button
              className={`
                  flex justify-between items-center rounded-sm mr-2 w-22 
                  p-1 font-bold text-lg  border-2 transition-all duration-400
                  ${
                    openManaBar === competitor.name
                      ? 'opacity-100'
                      : 'opacity-0 absolute pointer-events-none'
                  }
                  ${card.activated && 'activatedMana'} 
                  ${
                    card.used
                      ? 'hover:cursor-not-allowed cardTapped'
                      : card.name === 'Plains'
                      ? `${
                          isBotAttacking
                            ? 'hover:cursor-not-allowed'
                            : 'hover:cursor-pointer'
                        } white-card-background text-black hover:opacity-70`
                      : `${
                          isBotAttacking
                            ? 'hover:cursor-not-allowed'
                            : 'hover:cursor-pointer'
                        } black-card-background text-amber-200 hover:cursor-pointer hover:opacity-70`
                  }
                `}
              id='mana-btn'
              aria-label='mana-btn'
              onClick={() => {
                if (!isBot) {
                  const updatedManaBar = activateMana(card, index, competitor, dispatch);
                  isEnoughMana(competitor, dispatch, updatedManaBar); // updates if there is enough mana for cards in hand
                  setManaSound(!manaSound);
                }
              }}
              key={index}
              disabled={
                gameWonBy !== ''
                  ? true
                  : playerPassedTurn || isBotAttacking
                  ? true
                  : card.used
                  ? true
                  : false
              }
            >
              <p>{card.name}</p>

              <p>
                {card.color[0] === 'W' ? (
                  <i class='ms ms-w ms-cost ms-shadow'></i>
                ) : (
                  <i class='ms ms-b ms-cost ms-shadow'></i>
                )}
              </p>
            </button>
          ))
        )}
        <span
          className={`
            text-4xl text-amber-500 transition-all duration-400
            flex justify-items-center
            ${
              openManaBar !== competitor.name
                ? 'opacity-100'
                : 'opacity-0 absolute pointer-events-none'
            }
          `}
        >
          {competitor.deck_name !== 'Vile Force' ? (
            <i class='ms ms-w ms-shadow'></i>
          ) : (
            <i class='ms ms-b ms-shadow'></i>
          )}
        </span>
      </div>
      <div 
        id="activated-mana-close-bar-wrapper"
        className='flex flex-col'
      >
        <button 
          id="close-mana-bar"
          aria-label="close-mana-bar"
          onClick={(e) => {
            e.stopPropagation();
            setOpenManaBar('');
          }}
          className={`
            text-2xl text-amber-500 bg-gray-900 border-2 rounded-sm w-fit
            hover:cursor-pointer hover:bg-gray-700 transition-all ml-1
            ${isBot ? 'order-1 mt-1' : 'mb-1'}
            ${
              openManaBar === competitor.name
                ? 'opacity-100'
                : 'opacity-0 absolute pointer-events-none'
            } 
          `}
        >
          <IoMdClose />
        </button>

        <div 
          id="activated-mana-count"
          className={`
            ${isBot ? 'rounded-br-md border-t-0 border-l-0 items-end' : 'rounded-tr-md border-b-0 border-l-0 items-end order-1'}
            bg-gradient-to-bl from-red-700 to-gray-900 text-3xl font-bold border-2
            transition-all duration-400 text-amber-400 p-1 h-8 flex justify-center overflow-hidden
          `}
        >
          {activatedManas}
          <p 
            className={`
              transition-all duration-600 text-sm ml-1
              ${
                openManaBar === competitor.name
                  ? 'opacity-100'
                  : 'opacity-0 absolute pointer-events-none'
              } 
            `}
          >
            Activated
          </p>
        </div>
        
      </div>
      
      {!isBot && (
        <button
          className={`
            text-lg border-2 text-amber-400 rounded-tr-sm border-l-0 border-b-0
            bg-gradient-to-bl from-red-700 to-gray-900 p-1 hover:cursor-pointer
            hover:from-amber-600 hover:to-gray-900 transition-all active:brightness-50
          `}
          id='activate-all-manas-button'
          aria-label='activate-all-manas-button'
          disabled={
            gameWonBy !== ''
              ? true
              : playerPassedTurn || isBotAttacking
              ? true
              : false
          }
          onClick={() => {
            const hasUnactivatedMana = competitor.mana_bar.some(
              (mana) => !mana.activated && !mana.used
            );
            setManaSound(!manaSound);
            if (hasUnactivatedMana) {
              const updatedManabar = activateAllManas(competitor, dispatch);
              isEnoughMana(competitor, dispatch, updatedManabar)
            } else {
              const updatedManabar = deactivateAllManas(competitor, dispatch);
              isEnoughMana(competitor, dispatch, updatedManabar)
            }
          }}
        >
          <SiElement />
        </button>
      )}

    </div>
  );
}
