import { GiCrossedSwords, GiBoltSpellCast } from 'react-icons/gi';
import { useContext, useEffect, useRef, useState } from 'react';
import { gameboardContext } from '../../contexts/gameboard-context.js';
import { globalContext } from '../../contexts/global-context.js';
import { playerAttacks } from '../../gameplay-actions/tap-cards.js';
import { shortenName } from '../../deck-management/utils.js';
import { X } from 'lucide-react';
import '../../css/legendary.css';

export default function Card({ competitor, dispatch }) {
  // if the player clicks the card to inspect it further
  const {
    toEnlarge,
    setToEnlarge,
    setOriginalToughness,
    isPlayerAttacking,
    setIsPlayerAttacking,
    setCardBeingClicked,
    setExpandLog,
    isBotAttacking,
    setLoadSpin,
    gameState,
    setGameState,
    gameTurn
  } = useContext(gameboardContext);

  // button sound for when the attack menu is opened
  const {
    buttonSound,
    setButtonSound,
    bot,
    dispatchBot,
    gameWonBy,
    setGameWonBy,
  } = useContext(globalContext);

  // attack menu that contains attack options when the card is inspected
  const [openAttackMenu, setOpenAttackMenu] = useState(false);

  // if the card is coming from the Bot competitor
  const isBot = competitor.name === 'Bot';

  // card ref to check if the user is clicking in or not in it
  const cardRef = useRef(null);

  // handles the mouse click off the card area, so it will shrink it
  useEffect(() => {

    const handleClickOff = e => {
      if (cardRef.current && !cardRef.current.contains(e.target) && toEnlarge !== '') {
        setToEnlarge('');
      }
    }

    window.addEventListener('click', handleClickOff);

    return () => {
      window.removeEventListener('click', handleClickOff);
    };

  }, [toEnlarge])

  return competitor.battlefield.map((card, index) => (
    <div
      id='cardContainer'
      className={`
        rounded-lg p-1 mx-2 cardTransition transition-all relative
        flex flex-col justify-start items-center overflow-hidden
        ${
          card.color[0] === 'W'
            ? 'white-card-background text-black'
            : 'black-card-background text-amber-200 border-black'
        }
        ${
          toEnlarge === card.instanceId
            ? `z-16 w-80 large border-8 ${!isBot ? '-top-1/2' : 'top-1/2'} hover:cursor-default`
            : `${isPlayerAttacking || isBotAttacking ? 'hover:cursor-not-allowed' : 'hover:cursor-pointer'} border-4 w-40 small top-0`
        }
        ${(card.attack || card.defend) && 'creatureTurn'}
        ${(card.summoningSickness || card.attackPhaseSickness) && 'sickness'}
        ${isBot && 'mt-14'}
      `}
      key={index}
      ref={cardRef}
      onClick={(e) => {
        // helps the click off function work
        e.stopPropagation();
        if (!isPlayerAttacking && !isBotAttacking && gameWonBy === '') {
          // if its not attack phase or anybody won the game yet, enlarge the card
          setOpenAttackMenu(false); // making sure the attack menu reamins closed everytime user enlarge a card
          setCardBeingClicked(''); // if player had a card from the hands clicked, unclick it
          setExpandLog(false); // gamelog shrinks if it's expanded
          setToEnlarge(toEnlarge === card.instanceId ? '' : card.instanceId); // unenlarge a card if it is already
        }
      }}
    >
      <h1
        className={`
          ${toEnlarge === card.instanceId && 'text-lg'} text-center font-bold
        `}
        id='cardNameHeader'
      >
        {toEnlarge === card.instanceId ? card.name : shortenName(card.name)}
      </h1>
      <img
        src={card.image_uris.art_crop}
        alt='card-image'
        className={`border-2 ${toEnlarge === card.instanceId ? 'w-80 h-full max-h-55' : 'w-40 h-30'} transition-all duration-200`}
      />

      <p
        className={`
          ${toEnlarge === card.instanceId ? 'text-xl' : 'text-sm'} 
          ${card.type.match(/legendary/i) && 'legendary-shimmer'}
          font-bold my-1 text-center 
        `}
      >
        {card.type.match(/legendary/i)
          ? 'Legendary Creature'
          : card.type.match(/instant/i)
            ? 'Instant'
            : card.type.match(/enchantment/i)
              ? 'Enchantment'
              : 'Creature'}
      </p>

      <div
        className={``}
        id='card-info-container'
        aria-label='card-info-container'
      >
        <span
          className={`${toEnlarge !== card.instanceId ? 'opacity-100' : 'opacity-0 absolute -top-100'} transition-all duration-800`}
          id='not-inspected-card-description'
          aria-label='not-inspected-card-description'
        >
          <h1
            className={`text-center font-bold ${card.power ? 'text-3xl' : 'text-xs'} overflow-hidden hover:overflow-auto h-15`}
            id='battlefieldCardDesc'
          >
            {card.power ? `${card.power}/${card.toughness}` : card.description}
          </h1>
          <div
            className={`
            ${toEnlarge !== card.instanceId ? 'opacity-20' : 'opacity-0'}
            absolute right-10 bottom-2 text-7xl transition-all duration-1000
          `}
          >
            {card.color[0] === 'W' ? (
              <i class='ms ms-w'></i>
            ) : (
              <i class='ms ms-b'></i>
            )}
          </div>
        </span>

        <span
          className={`
            ${toEnlarge === card.instanceId ? 'opacity-100 w-[296px] duration-800' : 'opacity-0 w-[0px] duration-300'} 
            ${card.color[0] !== 'W' ? 'black-card-desc' : 'white-card-desc'}
            border-2 flex flex-col items-center justify-start h-33
            transition-all overflow-auto relative
          `}
          id='inspected-card-description'
          aria-label='inspected-card-description'
        >
          <p
            className={`
            ${toEnlarge === card.instanceId ? 'opacity-100' : 'opacity-0'} 
            font-bold text-lg transition-all duration-1000 p-2
          `}
          >
            {card.ability ? card.ability : card.description}
          </p>

          <div
            className={`
            ${toEnlarge === card.instanceId ? 'opacity-20' : 'opacity-0'} 
            absolute right-21 bottom-0.5 text-9xl transition-all duration-1000
          `}
          >
            {card.color[0] === 'W' ? (
              <i class='ms ms-w'></i>
            ) : (
              <i class='ms ms-b'></i>
            )}
          </div>
        </span>

        <div
          id='combat-bar-container'
          aria-label='combat-bar-container'
          className={`
              ${toEnlarge === card.instanceId ? 'opacity-100' : 'opacity-0 absolute'}
              flex w-full justify-between items-center text-2xl mt-1 transition-all duration-500 px-1
            `}
        >
          {!isBot ? (
            openAttackMenu ? (
              <div
                className={`
                    ${card.type.match(/creature/i) ? 'border-gray-900' : 'border-gray-400'}
                    radialGradient border-2 text-gray-900 flex justify-between items-center rounded-sm
                  `}
              >
                <button
                  className={`
                      ${
                        card.summoningSickness || card.attackPhaseSickness
                          ? 'hover:cursor-not-allowed hover:bg-red-900 hover:text-neutral-200 hover:border-red-900'
                          : 'hover:cursor-pointer hover:bg-gray-900 hover:text-amber-400 hover:border-gray-900 active:brightness-70'
                      }
                      border-2 border-transparent h-8 transition-all bg-transparent font-bold rounded-l-sm w-22
                    `}
                  id='attack-or-spell-button'
                  aria-label='attack-or-spell-button'
                  disabled={
                    card.summoningSickness ||
                    isPlayerAttacking ||
                    card.attackPhaseSickness
                      ? true
                      : false
                  }
                  onClick={(e) => {
                    e.stopPropagation(); // doesn't let the click propagate to the card itself
                    setIsPlayerAttacking(true); // attacking phase starts
                    setLoadSpin(true);

                    card.type.match(/creature/i)
                      ? playerAttacks(
                          card,
                          competitor,
                          dispatch,
                          bot,
                          dispatchBot,
                          setToEnlarge,
                          setOriginalToughness,
                          gameWonBy,
                          setGameWonBy,
                          setGameState,
                          gameState,
                          gameTurn
                        )
                      : '';

                    setTimeout(() => {
                      // card goes back to its original size
                      setToEnlarge(null);
                    }, 800);

                    setTimeout(() => {
                      setIsPlayerAttacking(false); // attack returns false by the end of its execution
                      setLoadSpin(false); // spinner stops spinning
                    }, 3500);
                  }}
                >
                  {card.type.match(/creature/i) ? 'Attack' : 'Cast'}
                </button>
                <button
                  className='hover:cursor-pointer hover:bg-gray-900 hover:text-amber-400 hover:border-gray-900 border-2 border-transparent h-8 transition-all bg-transparent rounded-r-sm w-10 flex justify-center items-center'
                  id='cancel-attack-button'
                  aria-label='cancel-attack-button'
                  onClick={(e) => {
                    e.stopPropagation(); // doesn't let the click propagate to the card itself
                    setButtonSound(!buttonSound);
                    setOpenAttackMenu(false);
                  }}
                >
                  <X />
                </button>
              </div>
            ) : (
              <button
                className={`
                    ${card.attack || card.defend ? 'hover:cursor-not-allowed' : 'hover:cursor-pointer hover:opacity-50'}
                    border-2 w-10 flex items-center justify-center radialGradient text-gray-900 transition-all rounded-sm
                  `}
                id='crossed-swords-button'
                aria-label='crossed-swords-button'
                disabled={card.attack || card.defend ? true : false}
                onClick={(e) => {
                  e.stopPropagation(); // doesn't let the click propagate to the card itself
                  setButtonSound(!buttonSound);
                  setOpenAttackMenu(true);
                }}
              >
                {card.type.match(/creature/i) ? (
                  <GiCrossedSwords />
                ) : (
                  <GiBoltSpellCast />
                )}
              </button>
            )
          ) : (
            ''
          )}
          <h1 className='font-bold text-3xl'>
            {card.power && `${card.power}/${card.toughness}`}
          </h1>
        </div>
      </div>
    </div>
  ));
}
