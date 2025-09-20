import { IoMdArrowDropdown, IoMdArrowDropup } from 'react-icons/io';
import { GiBroadsword, GiMountaintop } from 'react-icons/gi';
import { gameboardContext } from '../../contexts/gameboard-context.js';
import { globalContext } from '../../contexts/global-context.js';
import { MdOutlineStar } from 'react-icons/md';
import { useContext } from 'react';
import { FaGripfire } from 'react-icons/fa';
import CardPreview from '../cards/CardPreview.jsx';
import '../../css/scroll_bars.css';

export default function Graveyard({
  openGraveyard,
  setOpenGraveyard,
  competitor,
  dispatch,
}) {
  const { buttonSound, setButtonSound, setCardSound, cardSound } =
    useContext(globalContext);
  const {
    playerPassedTurn,
    setToEnlarge,
    playerGraveCard,
    setPlayerGraveCard,
    botGraveCard,
    setBotGraveCard,
  } = useContext(gameboardContext);

  // condition if the graveyard is for Bot
  const isBot = competitor.name === 'Bot';

  return (
    <div
      className={`
        ${competitor.deck_name === 'Angel Army' ? 'angel-deck' : competitor.deck_name === 'Vile Force' ? 'vile-deck' : 'human-deck'} 
        ${isBot ? 'rounded-bl-sm' : 'rounded-tl-sm'}
        flex flex-col w-80 h-70 border-r-2 relative z-15
      `}
      id={`${competitor.name}GraveyardContainer`}
    >
      <span
        className={`
          ${isBot ? 'rounded-b-sm bottom-0 z-2' : 'rounded-t-sm'}
          active:opacity-50 bg-gray-900 absolute h-8.5 flex justify-center items-center border-2 border-black text-amber-400 text-2xl hover:cursor-pointer hover:bg-amber-400 hover:text-black transition-colors z-15
        `}
        id='drawer-knob'
        onClick={() => {
          setButtonSound(!buttonSound);
          setOpenGraveyard(!openGraveyard);
        }}
      >
        {!isBot ? (
          openGraveyard ? (
            <IoMdArrowDropdown />
          ) : (
            <IoMdArrowDropup />
          )
        ) : (
          isBot && (openGraveyard ? <IoMdArrowDropup /> : <IoMdArrowDropdown />)
        )}
      </span>
      <h1
        className={`
        ${isBot ? 'absolute bottom-0 z-1 w-full rounded-bl-sm' : 'rounded-tl-sm'}
        text-center text-2xl radialGradient border-2  border-l-0 border-r-0 fontUncial
      `}
      >
        Graveyard
      </h1>

      <ul
        className={`
          ${isBot ? 'h-61.5' : 'h-69.5'}
          flex flex-col p-2 overflow-y-auto
        `}
        id='graveyardContainer'
        aria-label='graveyardContainer'
      >
        {competitor.graveyard.map((card, index) => {
          return (
            <button
              className={`
                ${
                  isBot 
                    && botGraveCard === card || playerGraveCard === card
                      ? 'bg-amber-50 border-t-black border-b-black' 
                      : 'border-t-transparent border-b-transparent'
                }
                ${playerPassedTurn ? 'hover:cursor-not-allowed' : 'hover:cursor-pointer'}
                flex w-full justify-between items-center border-t-2 border-b-2  hover:border-b-black
                hover:border-t-black rounded-sm px-2 py-1 transition-all 
              `}
              key={index}
              id='graveyard-card-button'
              aria-label='graveyard-card-button'
              disabled={playerPassedTurn ? true : false}
              onClick={() => {

                // if clicked in an already selected card, unselect it
                if (isBot) {
                  setBotGraveCard(botGraveCard !== card ? card : '')
                  setPlayerGraveCard('') // unselect opponent's graveyard card 
                } else {
                  setPlayerGraveCard(playerGraveCard !== card ? card : '')
                  setBotGraveCard('') // unselect opponent's graveyard card 
                }

                setCardSound(!cardSound);
                setToEnlarge(''); // if player had an enlarged card in the battlefield, make it original size
              }}
            >
              <li className='w-full font-bold text-lg flex items-center'>
                {card.type.match(/legendary/i) ? (
                  <div className='w-full flex justify-between items-center'>
                    <span className='flex items-center justify-center'>
                      <MdOutlineStar className='text-blue-400 mr-1' />
                      {card.name}
                    </span>

                    <span className='text-xl'>
                      {card.type.match(/creature/i)
                        ? card.power + '/' + card.toughness
                        : 'Spell'}
                    </span>
                  </div>
                ) : card.type.match(/^creature —/i) ? (
                  <div className='w-full flex justify-between items-center'>
                    <span className='flex items-center justify-center'>
                      <GiBroadsword className='mr-1' />
                      {card.name}
                    </span>

                    <span className='text-xl'>
                      {card.type.match(/creature/i)
                        ? card.power + '/' + card.toughness
                        : 'Spell'}
                    </span>
                  </div>
                ) : card.type.match(/land/i) ? (
                  <div className='w-full flex justify-between items-center'>
                    <span className='flex items-center justify-center'>
                      <GiMountaintop className='mr-1' />
                      {card.name}
                    </span>

                    <span className='text-xl'>
                      {card.type.match(/creature/i)
                        ? card.power + '/' + card.toughness
                        : 'Spell'}
                    </span>
                  </div>
                ) : (
                  <div className='w-full flex justify-between items-center'>
                    <FaGripfire className='mr-1' />
                    {card.name}

                    <span>
                      {card.type.match(/creature/i)
                        ? card.power / card.toughness
                        : 'Spell'}
                    </span>
                  </div>
                )}
              </li>
            </button>
          );
        })}
      </ul>

      {(isBot ? botGraveCard : playerGraveCard) && ( // distinguishing who's inspecting cards in the graveyard
        <CardPreview
          card={isBot ? botGraveCard : playerGraveCard}
          competitor={competitor}
          dispatch={dispatch}
          isGraveyard={true}
        />
      )}
    </div>
  );
}
