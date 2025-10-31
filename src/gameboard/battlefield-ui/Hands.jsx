import { IoMdArrowDropdown, IoMdArrowDropup } from 'react-icons/io';
import { GiBroadsword, GiMountaintop } from 'react-icons/gi';
import { MdOutlineStar } from 'react-icons/md';
import { useContext, useEffect, useRef, useState } from 'react';
import { FaGripfire } from 'react-icons/fa';
import { globalContext } from '../../contexts/global-context.js';
import CardPreview from '../cards/CardPreview.jsx';
import CardMana from '../cards/CardMana.jsx';
import { gameboardContext } from '../../contexts/gameboard-context.js';

export default function Hands({ competitor, dispatch }) {
  // state that opens and closes the competitor's hands container
  const [openHands, setOpenHands] = useState(false);

  // condition if the Hands is for Bot
  const isBot = competitor.name === 'Bot';

  // card ref to unselect it whenever player clicks out of the card area
  const cardRef = useRef(null);

  // hands ref to unselect it whenever player clicks out of the card area 
  const handsRef = useRef(null);

  // context APIs
  const {
    setCardBeingClicked,
    cardBeingClicked,
    playerPassedTurn,
    setToEnlarge,
    isPlayerAttacking,
    isBotAttacking,
    gameTurn,
  } = useContext(gameboardContext);
  const { setButtonSound, buttonSound, cardSound, setCardSound, gameWonBy } =
    useContext(globalContext);

  // hands drawer closes if the bot is attacking of if player passes the turn
  useEffect(() => {
    const playerTurn = gameTurn % 2 !== 0;
    if (!isBotAttacking && playerTurn && !isBot) {
      setOpenHands(true);
    } else {
      setOpenHands(false);
    }
  }, [gameTurn]);

  // handles the mouse click off the card area, so it will close it
  useEffect(() => {

    const handleClickOff = e => {

      // will close only the card preview
      if (
        cardRef.current &&
        handsRef.current &&
        !cardRef.current.contains(e.target) &&
        !handsRef.current.contains(e.target)) {
        setCardBeingClicked('');
      }

      if (handsRef.current && !handsRef.current.contains(e.target)) {
        setOpenHands(false);
      }
    }

    window.addEventListener('click', handleClickOff);

    return () => {
      window.removeEventListener('click', handleClickOff);
    };

  }, [cardBeingClicked, openHands])

  return (
    <div
      className={`
        ${competitor.deck_name === 'Angel Army' ? 'angel-deck' : competitor.deck_name === 'Vile Force' ? 'vile-deck' : 'human-deck'} 
        ${!isBot && openHands ? 'bottom-0' : !isBot && !openHands && '-bottom-77.5'}
        ${isBot && openHands ? 'top-0' : isBot && !openHands && '-top-77.5'}
        ${isBot ? 'rounded-br-sm' : 'rounded-tr-sm'}
        absolute w-80 h-85.5 flex flex-col border-r-2 transition-all z-15
      `}
      id={`${competitor.name}HandsContainer`}
      ref={handsRef}
    >
      <span
        className={`
          ${isBot ? 'rounded-b-sm bottom-0' : 'rounded-t-sm'}
          active:opacity-50 bg-gray-900 absolute h-8.5 flex items-center justify-center right-0 border-2 border-black text-amber-400 text-2xl hover:cursor-pointer hover:bg-amber-400 hover:text-black transition-colors
        `}
        id='drawer-knob'
        onClick={(e) => {
          e.stopPropagation()
          if (!isPlayerAttacking) {
            // if player is attacking disable the button
            setButtonSound(!buttonSound);
            setOpenHands(!openHands);
            if (openHands) setCardBeingClicked('');
          }
        }}
      >
        {!isBot ? (
          openHands ? (
            <IoMdArrowDropdown />
          ) : (
            <IoMdArrowDropup />
          )
        ) : (
          isBot && (openHands ? <IoMdArrowDropup /> : <IoMdArrowDropdown />)
        )}
      </span>
      <h1
        className={`${isBot ? 'order-3 rounded-br-sm' : 'rounded-tr-sm'} text-center text-2xl radialGradient border-2 border-r-0 fontUncial`}
      >
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
              id='hands-card-button'
              aria-label='hands-card-button'
              disabled={
                gameWonBy !== ''
                  ? true
                  : playerPassedTurn || isBotAttacking || isBot
                    ? true
                    : false
              }
              onClick={(e) => {
                e.stopPropagation()
                // if clicked in an already selected card, unselect it
                setCardBeingClicked(cardBeingClicked !== card ? card : '');
                setCardSound(!cardSound);
                setToEnlarge(''); // if player had an enlarged card in the battlefield, make it original size
              }}
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

              {!card.type.match(/basic land/i) &&
                !isBot && ( // if card is not a land
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

      {cardBeingClicked && !isBot && (
        <CardPreview
          card={cardBeingClicked}
          competitor={competitor}
          dispatch={dispatch}
          cardRef={cardRef}
        />
      )}
    </div>
  );
}
