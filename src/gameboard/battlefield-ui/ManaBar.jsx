import { useContext } from 'react';
import { isEnoughMana, activateMana } from '../../gameplay-actions/mana.js';
import { globalContext } from '../../contexts/global-context.js';
import { gameboardContext } from '../../contexts/gameboard-context.js';

export default function ManaBar({ competitor, dispatch }) {

  // context APIs
  const { setManaSound, manaSound } = useContext(globalContext);
  const { playerPassedTurn } = useContext(gameboardContext);

  // condition if the manabar is for Bot
  const isBot = competitor.name === 'Bot';

  return (
    <div id='mana-bar-wrapper' className={`${!isBot ? 'top-74.5' : 'top-0'} absolute right-101 `}>
      <h1 className={`${!isBot ? 'rounded-t-sm -top-8.5' : 'rounded-b-sm top-11.5 right-0'} absolute fontUncial bg-gradient-to-bl from-blue-700 to-gray-900 text-amber-400 border-amber-400 text-2xl w-40 text-center border-2`}>
        Mana bar
      </h1>
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
                    ? 'white-card-background text-black hover:cursor-pointer hover:opacity-70'
                    : 'black-card-background text-amber-200 hover:cursor-pointer hover:opacity-70'
              }`}
              id='mana-btn'
              onClick={() => {
                activateMana(card, index, competitor, dispatch);
                isEnoughMana(competitor, dispatch); // updates if there is enough mana for cards in hand
                setManaSound(!manaSound);
              }}
              key={index}
              disabled={playerPassedTurn ? true : card.used ? true : false}
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
