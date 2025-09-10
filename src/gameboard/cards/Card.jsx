import { GiCrossedSwords, GiBoltSpellCast } from 'react-icons/gi';
import { useContext, useState } from 'react';
import { gameboardContext } from '../../contexts/gameboard-context.js';
import { globalContext } from '../../contexts/global-context.js';
import { X } from 'lucide-react';
import { playerAttacks } from '../../gameplay-actions/tap-cards.js';

export default function Card({ competitor, dispatch }) {
  // if the player clicks the card to inspect it further
  const {
    toEnlarge,
    setToEnlarge,
    setOriginalToughness,
    isAttacking,
    setIsAttacking,
    setCardBeingClicked,
  } = useContext(gameboardContext);

  // button sound for when the attack menu is opened
  const { buttonSound, setButtonSound, bot, dispatchBot } =
    useContext(globalContext);

  // attack menu that contains attack options when the card is inspected
  const [openAttackMenu, setOpenAttackMenu] = useState(false);

  // if the card is coming from the Bot competitor
  const isBot = competitor.name === 'Bot';

  return competitor.battlefield.map((card, index) => (
    <div
      id='cardContainer'
      className={`rounded-lg p-1 mx-2 cardTransition transition-all relative
            flex flex-col justify-start items-center
            ${(card.attack || card.defend) && 'creatureTurn'}
            ${
              card.color[0] === 'W'
                ? 'white-card-background text-black'
                : 'black-card-background text-amber-200 border-black'
            }
            ${card.summoningSickness && 'sickness'}
            ${
              toEnlarge === card.instanceId
                ? `z-10 w-80 large border-8 ${!isBot ? '-top-60' : 'top-10'} hover:cursor-default`
                : 'z-4 border-4 w-40 small top-0 hover:cursor-pointer'
            }
            ${isBot && 'mt-14'}`}
      key={index}
      onClick={() => {
        if (!isAttacking) { // if its not attack phase, enlarge the card
          setOpenAttackMenu(false); // making sure the attack menu reamins closed everytime user enlarge a card
          setCardBeingClicked(''); // if player had a card from the hands clicked, unclick it
          setToEnlarge(toEnlarge === card.instanceId ? '' : card.instanceId); // unenlarge a card if it is already
        }
      }}
    >
      <h1
        className={`${toEnlarge === card.instanceId && 'text-lg'} text-center font-bold`}
        id='cardNameHeader'
      >
        {card.name}
      </h1>
      <img
        src={card.image_uris.art_crop}
        alt='card-image'
        className={`border-2 ${toEnlarge === card.instanceId ? 'w-80 h-60' : 'w-40 h-30'} `}
      />

      <p
        className={`${toEnlarge === card.instanceId ? 'text-lg' : 'text-xs'} font-bold my-1 text-center`}
      >
        {card.type}
      </p>

      {toEnlarge !== card.instanceId && (
        <>
          <h1
            className={`text-center font-bold ${card.power ? 'text-3xl' : 'text-xs'} mt-1 overflow-hidden hover:overflow-auto h-15`}
            id='battlefieldCardDesc'
          >
            {card.power ? `${card.power}/${card.toughness}` : card.description}
          </h1>
          <div className='absolute right-10 bottom-2 opacity-20 text-7xl'>
            {card.color[0] === 'W' ? (
              <i class='ms ms-w'></i>
            ) : (
              <i class='ms ms-b'></i>
            )}
          </div>
        </>
      )}

      {toEnlarge === card.instanceId && (
        <>
          <div
            className={`border-2 flex justify-center p-2 w-full h-35 overflow-auto relative transition-all
                ${
                  card.color[0] !== 'W' ? 'black-card-desc' : 'white-card-desc'
                }`}
            id='battlefieldCardDesc'
          >
            <p className='font-bold text-lg'>
              {card.ability ? card.ability : card.description}
            </p>
            <div className='absolute right-22 bottom-0.5 opacity-20 text-9xl'>
              {card.color[0] === 'W' ? (
                <i class='ms ms-w'></i>
              ) : (
                <i class='ms ms-b'></i>
              )}
            </div>
          </div>

          <div
            id='bottomBarContainer'
            className='flex w-full justify-between items-center text-2xl mt-2'
          >
            {!isBot ? (
              openAttackMenu ? (
                <div
                  className={`radialGradient border-2 ${card.type.match(/creature/i) ? 'border-gray-900' : 'border-gray-400'} text-gray-900 flex justify-between items-center rounded-sm`}
                >
                  <button
                    className={`
                      ${
                        card.summoningSickness
                          ? 'hover:cursor-not-allowed hover:bg-red-900 hover:text-neutral-200 hover:border-red-900'
                          : 'hover:cursor-pointer hover:bg-gray-900 hover:text-amber-400 hover:border-gray-900 '
                      }
                      border-2 border-transparent h-8 transition-all bg-transparent font-bold rounded-l-sm w-22
                    `}
                    id='attack-or-spell-button'
                    aria-label='attack-or-spell-button'
                    disabled={
                      card.summoningSickness || isAttacking ? true : false
                    }
                    onClick={(e) => {
                      e.stopPropagation(); // doesn't let the click propagate to the card itself
                      setIsAttacking(true); // attacking phase starts

                      card.type.match(/creature/i)
                        ? playerAttacks(
                            card,
                            competitor,
                            dispatch,
                            bot,
                            dispatchBot,
                            setToEnlarge,
                            setOriginalToughness
                          )
                        : '';

                      setTimeout(() => {
                        // card goes back to its original size
                        setToEnlarge(null);
                      }, 800);
                      
                      setTimeout(() => {
                        setIsAttacking(false); // attack returns false by the end of its execution
                      }, 3500)
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
        </>
      )}
    </div>
  ));
}
