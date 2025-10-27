import {
  deployOneMana,
  deployCreatureOrSpell,
} from '../../gameplay-actions/deploy-cards';
import { gameboardContext } from '../../contexts/gameboard-context.js';
import { globalContext } from '../../contexts/global-context.js';
import { useContext } from 'react';
import CardMana from './CardMana';

export default function CardPreview({
  card,
  competitor,
  dispatch,
  isGraveyard = false,
  cardRef = null,
}) {
  // context API
  const {
    oneManaPerTurn,
    setOneManaPerTurn,
    setCardBeingClicked,
    gameTurn,
    setGameState,
    gameState,
  } = useContext(gameboardContext);

  const { buttonSound, setButtonSound } = useContext(globalContext);

  const isBot = competitor.name === 'Bot';

  return (
    <div
      className={`
        ${
          card.color[0] === 'W'
            ? 'white-card-background text-black'
            : 'black-card-background text-amber-200'
        } 
        ${
          isGraveyard && isBot
            ? 'top-10 right-80'
            : isGraveyard && !isBot
            ? '-top-76 right-80'
            : '-top-60 left-80'
        }
        absolute flex flex-col justify-start items-center rounded-2xl p-2 w-90 h-140 shadowing border-10 border-black
      `}
      id='cardPreviewContainer'
      aria-label='cardPreviewContainer'
      ref={cardRef || null}
    >
      <span className='rounded-t-sm w-full flex justify-between items-center px-1'>
        <h1
          className={`${
            card.color[0] === 'W' ? 'text-black' : 'text-amber-200'
          } font-bold text-lg text-center `}
        >
          {card.name}
        </h1>
        <p className='flex justify-center items-center'>
          <CardMana mana_cost={card.mana_cost} />
        </p>
      </span>

      <img
        className='w-80 h-50 border-4 my-1'
        src={card.image_uris.art_crop}
        alt='card-image'
        aria-label='card-image'
      />

      <div
        className='flex justify-center items-center w-full'
        id='card-type-text'
        aria-label='card-type-text'
      >
        <p
          className={`
            ${card.type.match(/legendary/i) && 'legendary-shimmer'}
            ${card.color[0] === 'W' ? 'text-black' : 'text-amber-200'} 
            font-bold text-center text-lg
          `}
        >
          {card.type}
        </p>
      </div>

      <div
        className={`absolute ${
          card.type.match(/land/i) ? 'opacity-80' : 'opacity-10'
        } text-9xl bottom-25`}
        id='colorSymbol'
        aria-label='colorSymbol'
      >
        {card.color[0] === 'W' ? (
          <i class='ms ms-w'></i>
        ) : (
          <i class='ms ms-b'></i>
        )}
      </div>

      <div
        className={`my-2 border-4 ${
          card.color[0] === 'W'
            ? 'white-card-desc text-black'
            : 'black-card-desc text-amber-200'
        } font-bold text-lg p-2 w-80 h-50`}
        id='cardDescription'
        aria-label='cardDescription'
      >
        {card.ability
          ? card.ability
          : card.description && `~${card.description}`}
      </div>

      <span className='flex justify-between items-center px-1 font-bold text-lg w-full'>
        <button
          className={`active:opacity-80 border-2 hover:opacity-60  transition-all text-black px-2 
            ${isGraveyard && 'hidden'}
            ${
              card.type.match(/land/i)
                ? oneManaPerTurn
                  ? 'radialGradient hover:cursor-pointer'
                  : 'bg-gradient-to-b from-blue-950 to-gray-500 hover:cursor-not-allowed'
                : card.enoughManaToDeploy
                ? 'radialGradient hover:cursor-pointer'
                : 'bg-gradient-to-b from-blue-950 to-gray-500 hover:cursor-not-allowed'
            }`}
          id='deploy-btn'
          aria-label='deploy-btn'
          disabled={
            card.type.match(/land/i)
              ? oneManaPerTurn
                ? false
                : true
              : card.enoughManaToDeploy
              ? false
              : true
          }
          onClick={() => {
            // clicking command to deploy a card
            if (card.type.match(/land/i)) {
              deployOneMana(
                competitor,
                dispatch,
                gameState,
                setGameState,
                gameTurn
              );
              setOneManaPerTurn(false); // limit of one mana deployed per turn
            } else {
              deployCreatureOrSpell(
                competitor,
                dispatch,
                card,
                gameTurn,
                setGameState,
                gameState
              );
            }
            setButtonSound(!buttonSound); // release the button sound
            setCardBeingClicked(''); // unselect card from hands
          }}
        >
          Deploy Card
        </button>
        {card.type.match(/creature/i) && (
          <p
            className='text-3xl font-bold'
            id='card-power-toughness-text'
            aria-label='card-power-toughness-text'
          >
            {card.power}/{card.toughness}
          </p>
        )}
      </span>
    </div>
  );
}
