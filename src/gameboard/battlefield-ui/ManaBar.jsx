import { useContext } from 'react';
import {
  isEnoughMana,
  activateMana,
  activateAllManas,
} from '../../gameplay-actions/mana.js';
import { globalContext } from '../../contexts/global-context.js';
import { gameboardContext } from '../../contexts/gameboard-context.js';
import { SiElement } from 'react-icons/si';

export default function ManaBar({ competitor, dispatch }) {
  // context APIs
  const { setManaSound, manaSound, gameWonBy } = useContext(globalContext);
  const { playerPassedTurn, isBotAttacking } = useContext(gameboardContext);

  // condition if the manabar is for Bot
  const isBot = competitor.name === 'Bot';

  return (
    <div
      id='mana-bar-wrapper'
      className={`${!isBot ? 'top-74.5' : 'top-0'} absolute right-101 `}
    >
      <h1
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
            if (hasUnactivatedMana) {
              setManaSound(!manaSound);
              activateAllManas(competitor, dispatch, hasUnactivatedMana);
            }
          }}
        >
          <SiElement />
        </button>
      )}

      <div
        className={`${!isBot ? 'rounded-t-sm border-b-0' : 'rounded-b-sm border-t-0'} w-200 h-12 border-2 border-amber-400 bg-gradient-to-bl from-blue-700 to-gray-900  p-1 flex justify-start items-center overflow-x-auto overflow-y-hidden`}
        id='mana-bar'
      >
        {competitor.mana_bar.map((card, index) => {
          return (
            <button
              className={`flex justify-between items-center rounded-sm mr-2 w-22 p-1 font-bold text-lg  border-2 transition-all ${card.activated && 'activatedMana'} ${
                card.used
                  ? 'hover:cursor-not-allowed cardTapped'
                  : card.name === 'Plains'
                    ? `${isBotAttacking ? 'hover:cursor-not-allowed' : 'hover:cursor-pointer'} white-card-background text-black hover:opacity-70`
                    : `${isBotAttacking ? 'hover:cursor-not-allowed' : 'hover:cursor-pointer'} black-card-background text-amber-200 hover:cursor-pointer hover:opacity-70`
              }`}
              id='mana-btn'
              aria-label='mana-btn'
              onClick={() => {
                activateMana(card, index, competitor, dispatch);
                isEnoughMana(competitor, dispatch); // updates if there is enough mana for cards in hand
                setManaSound(!manaSound);
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
