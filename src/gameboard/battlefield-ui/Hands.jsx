import { IoMdArrowDropdown, IoMdArrowDropup } from 'react-icons/io';
import { GiBroadsword, GiMountaintop } from 'react-icons/gi';
import { gameboardContext } from '../Gameboard.jsx';
import { MdOutlineStar } from 'react-icons/md';
import { useContext, useState } from 'react';
import { FaGripfire } from 'react-icons/fa';
import { globalContext } from '../../App.jsx';
import CardPreview from '../cards/CardPreview.jsx';
import CardMana from '../cards/CardMana.jsx';

export default function Hands({ competitor, dispatch }) {
  // state that opens and closes the competitor's hands container
  const [openHands, setOpenHands] = useState(false);

  // condition if the Hands is for Bot
  const isBot = competitor.name === 'Bot';

  // context APIs
  const { setCardBeingClicked, cardBeingClicked, playerPassedTurn } =
    useContext(gameboardContext);
  const { setButtonSound, buttonSound, cardSound, setCardSound } =
    useContext(globalContext);

  return (
    <div
      className={`
        ${competitor.deck_name === 'Angel Army' ? 'angel-deck' : competitor.deck_name === 'Vile Force' ? 'vile-deck' : 'human-deck'} 
        ${!isBot && openHands ? 'top-1' : !isBot && !openHands && 'top-78.5'}
        ${isBot && openHands ? 'top-0' : isBot && !openHands && '-top-77.5'}
        ${isBot ? 'rounded-br-sm' : 'rounded-tr-sm'}
        absolute w-80 h-85.5 flex flex-col border-r-2 transition-all z-4
      `}
      id={`${competitor.name}HandsContainer`}
    >
      <span
        className={`
          ${isBot ? 'rounded-b-sm bottom-0' : 'rounded-t-sm'}
          active:opacity-50 bg-gray-900 absolute h-8.5 flex items-center justify-center right-0 border-2 border-black text-amber-400 text-2xl hover:cursor-pointer hover:bg-amber-400 hover:text-black transition-colors
        `}
        id='drawer-knob'
        onClick={() => {
          setButtonSound(!buttonSound);
          setOpenHands(!openHands);
          if (openHands) setCardBeingClicked('');
        }}
      >
        {
          !isBot ? 
            (openHands ? <IoMdArrowDropdown /> : <IoMdArrowDropup />) 
                : isBot && 
                 (openHands ? <IoMdArrowDropup /> : <IoMdArrowDropdown />)
        }
      </span>
      <h1 className={`${isBot ? 'order-3 rounded-br-sm' : 'rounded-tr-sm'} text-center text-2xl radialGradient border-2 border-r-0 fontUncial`}>
        {competitor.name}'s hands
      </h1>

      <div
        className={`${isBot ? 'order-2 border-t-2' : 'border-b-2'} bg-amber-400 w-full flex justify-between items-center px-4`}
        id='deck-name-ui'
      >
        <p className='font-bold text-lg'>Deck: {competitor.deck_name}</p>
        <p className='font-bold text-2xl'>
          {competitor.deck_current_cards} cards
        </p>
      </div>

      <ul
        className={`
          flex flex-col p-2 overflow-y-auto h-69.5
        `}
        id='cardsContainer'
      >
        {competitor.hands.map((card, index) => {
          return (
            <button
              className={`
                ${cardBeingClicked === card ? 'bg-amber-50 border-t-black border-b-black' : 'border-t-transparent border-b-transparent'}
                ${playerPassedTurn ? 'hover:cursor-not-allowed' : 'hover:cursor-pointer'}
                flex w-full justify-between items-center border-t-2 border-b-2  hover:border-b-black hover:border-t-black rounded-sm px-2 py-1 transition-all 
              `}
              key={index}
              onClick={() => {
                // if clicked in an already selected card, unselect it
                cardBeingClicked !== card
                  ? setCardBeingClicked(card)
                  : setCardBeingClicked('');
                setCardSound(!cardSound);
              }}
              disabled={playerPassedTurn || isBot ? true : false}
            >
              <li className='font-bold text-lg flex items-center'>
                {card.type.match(/legendary/i) ? (
                  <>
                    <MdOutlineStar className='text-blue-400 mr-1' />
                    {isBot ? 'Unknown' : card.name}
                  </>
                ) : card.type.match(/^creature —/i) ? (
                  <>
                    <GiBroadsword className='mr-1' />
                    {isBot ? 'Unknown' : card.name}
                  </>
                ) : card.type.match(/land/i) ? (
                  <>
                    <GiMountaintop className='mr-1' />
                    {isBot ? 'Unknown' : card.name}
                  </>
                ) : (
                  <>
                    <FaGripfire className='mr-1' />
                    {isBot ? 'Unknown' : card.name}
                  </>
                )}
              </li>

              {(!card.type.match(/basic land/i) && !isBot) && ( // if card is not a land
                <p className='flex justify-center items-center'>
                  <CardMana mana_cost={card.mana_cost} />
                </p>
              )}
            </button>
          );
        })}
        {competitor.battlefield.length >= 6 && (
          <p className='text-lg font-bold text-center text-black radialGradient border-2 rounded-sm mt-2'>
            Your battlefield reached its full capacity of cards
          </p>
        )}
      </ul>

      {(cardBeingClicked && !isBot) && <CardPreview card={cardBeingClicked} competitor={competitor} dispatch={dispatch} />}
    </div>
  );
}
