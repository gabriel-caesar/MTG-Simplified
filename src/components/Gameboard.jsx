import '../css/gameboard.css';
import '../css/scroll_bars.css';
import '../css/main_menu.css';
import 'mana-font/css/mana.min.css'; // npm install mana-font for mtg mana icons
import { useContext, useState, useEffect, createContext } from 'react';
import { globalContext } from './App';
import { IoMdArrowDropup, IoMdArrowDropdown } from 'react-icons/io';
import { MdOutlineStar } from 'react-icons/md';
import { FaGripfire } from 'react-icons/fa';
import { GiMountaintop, GiBroadsword } from 'react-icons/gi';
import { IoArrowRedoSharp } from 'react-icons/io5';
import { Cog } from 'lucide-react';

// a local file context to link states and functions to other components
const gameboardContext = createContext(null);

function Gameboard({ setBattleStarts, setLeaveBattlefield, setPlayMainTheme }) {
  const {
    battlePrep,
    player,
    dispatchPlayer,
    appTheme,
    buttonSound,
    setButtonSound,
  } = useContext(globalContext);

  // opens the menu from clicking the cog button
  const [openMenu, setOpenMenu] = useState(false);

  // pass the turn
  const [passTurn, setPassTurn] = useState(false);

  // wooden sign for the menu
  const [liftWoodenSign, setLiftWoodenSign] = useState(true);

  // confirmation state for quiting the game
  const [areYouSureQuit, setAreYouSureQuit] = useState(false);

  // erases the UI before quiting
  const [eraseUI, setEraseUI] = useState(false);

  // if false, player already deployed one mana
  const [oneManaPerTurn, setOneManaPerTurn] = useState(true);

  // state to serve as a prop for card component
  const [cardBeingClicked, setCardBeingClicked] = useState('');

  // handles the deployment of creatures/spells
  function deployCreatureOrSpell() {}

  // handles the deployment of mana
  function deployOneMana() {
    // searches for a single mana card
    const manaToBeDeployed = player.hands.find((handCard) =>
      handCard.type.match(/land/i)
    );

    // searches the that mana index inside the hands array
    const manaIndex = player.hands.indexOf(manaToBeDeployed);

    // splice it out from the hands array
    player.hands.splice(manaIndex, 1); // mutating player.hands

    // update the player's hands through an action
    dispatchPlayer({
      type: 'update_hands',
      payload: player.hands,
    });

    // send the selected mana to the mana bar
    dispatchPlayer({
      type: 'deploy_mana',
      payload: [...player.mana_bar, manaToBeDeployed],
    });

    // unselect the current mana being deployed
    setCardBeingClicked('');

    setOneManaPerTurn(false); // limit of one mana deployed per turn
  }

  // function to reverse the component to deck selection
  function handleQuit() {
    setLiftWoodenSign(true); // lift the wooden sign

    setTimeout(() => {
      // waiting the wooden sign lift

      setEraseUI(true); // erase battlefield for transition

      setLeaveBattlefield(true); // dark screen transition fades-in
    }, 900);

    setTimeout(() => {
      // wait the dark screen transition

      setLeaveBattlefield(false); // dark screen transition fades-out

      setBattleStarts(false); // transitions from Gameboard to MainMenu

      // reseting the player object, but maintaining its name
      dispatchPlayer({
        type: 'create_player',
        payload: player.name,
      });

      setEraseUI(false); // erases the battlefield UI

      setPlayMainTheme(true); // plays main theme
    }, 3000);
  }

  // play the chain sound for the greeting container
  useEffect(() => {
    const chainSound = new Audio('/soundfxs/chain-drag.mp3');
    chainSound.volume = 0.3;
    chainSound.currentTime = 0;
    chainSound.play();
    setTimeout(() => {
      chainSound.pause();
    }, 1200);
    // plays the sound if the start button is hit or if the lift sign state changes
  }, [liftWoodenSign]);

  return (
    <gameboardContext.Provider
      value={{
        oneManaPerTurn,
        setOneManaPerTurn,
        deployOneMana,
        deployCreatureOrSpell,
        cardBeingClicked,
        setCardBeingClicked,
      }}
    >
      {!eraseUI && (
        <>
          <div
            className={`w-full h-0.5 absolute top-86.5 ${appTheme === 'vile' ? 'bg-gray-400' : 'bg-black'} z-3`}
          ></div>
          <nav
            className={`absolute top-83.5 right-155 radialGradient rounded-sm w-80 flex justify-center items-center border-2 ${appTheme === 'vile' ? 'border-gray-400' : 'border-black'} z-3`}
          >
            <h1 className='fontUncial text-center'>
              {battlePrep
                ? 'The battle horn is blown...'
                : `${player.name}'s turn`}
            </h1>
          </nav>
          {!battlePrep && (
            <div className='flex flex-col w-full h-full overflow-hidden'>
              <Bot />
              <button
                onClick={() => {
                  setButtonSound(!buttonSound);
                  setOneManaPerTurn(true);
                }}
                className='active:bg-amber-600 absolute right-0 top-80 z-3 bg-amber-300 rounded-sm text-lg font-bold p-2 border-2 transition-colors'
                id='pass-btn'
              >
                Pass Turn
              </button>
              {openMenu && (
                <div
                  className='absolute left-190 z-5 flex justify-center items-end bg-amber-400'
                  id='wrapper-for-chains'
                  style={{
                    animation: !liftWoodenSign // tells the code to lift up or drag the wooden sign down
                      ? 'bounce-in 1s linear'
                      : 'bounce-out 1s linear',
                  }}
                >
                  <div
                    className='absolute w-100 h-60 top-50 z-6 flex flex-col justify-center items-center'
                    id='woodenSign'
                  >
                    <h1 className='text-amber-400 text-2xl fontUncial'>
                      {areYouSureQuit ? 'Leave the battlefield?' : 'Menu'}
                    </h1>
                    {!areYouSureQuit ? (
                      <>
                        <button
                          onClick={() => {
                            setButtonSound(!buttonSound);
                            setLiftWoodenSign(true);
                            setTimeout(() => setOpenMenu(false), 900);
                          }}
                          className='active:opacity-50 my-4 bg-amber-300 rounded-sm text-lg font-bold px-2 border-2 w-60 transition-colors'
                          id='resume-btn'
                        >
                          Resume
                        </button>
                        <button
                          className='active:opacity-50 bg-amber-300 rounded-sm text-lg font-bold px-2 border-2 w-60 transition-colors'
                          id='quit-btn'
                          onClick={() => {
                            setButtonSound(!buttonSound);
                            setAreYouSureQuit(true);
                          }}
                        >
                          Quit
                        </button>
                      </>
                    ) : (
                      <div className='active:opacity-50 flex flex-col justify-center items-center'>
                        <button
                          onClick={() => {
                            setButtonSound(!buttonSound);
                            handleQuit();
                          }}
                          className='active:opacity-50 my-4 bg-amber-300 rounded-sm text-lg font-bold px-2 w-60 border-2 transition-all'
                          id='yes-btn'
                        >
                          Yes
                        </button>
                        <button
                          onClick={() => {
                            setButtonSound(!buttonSound);
                            setAreYouSureQuit(false);
                          }}
                          className='active:opacity-50 bg-amber-300 rounded-sm text-lg font-bold px-2 w-60 border-2 transition-colors'
                          id='no-btn'
                        >
                          No
                        </button>
                      </div>
                    )}
                  </div>
                  <div className='absolute -top-50' id='vertical-chains'></div>
                </div>
              )}
              <button
                className='active:bg-amber-600 absolute top-81.5 z-3 bg-amber-300 rounded-sm text-3xl font-bold p-2 border-2 transition-colors'
                id='settings-btn'
                onClick={() => {
                  setButtonSound(!buttonSound);
                  if (liftWoodenSign) {
                    setOpenMenu(!openMenu);
                    setLiftWoodenSign(false);
                  } else {
                    setLiftWoodenSign(true);
                    setTimeout(() => setOpenMenu(false), 900);
                  }
                }}
              >
                <Cog />
              </button>
              <Player
                oneManaPerTurn={oneManaPerTurn}
                setOneManaPerTurn={setOneManaPerTurn}
              />
            </div>
          )}
        </>
      )}
    </gameboardContext.Provider>
  );
}

// players battlefield component
function Player() {
  const {
    player,
    setButtonSound,
    buttonSound,
    cardSound,
    setCardSound,
    manaSound,
    setManaSound,
    dispatchPlayer,
  } = useContext(globalContext);

  const { cardBeingClicked, setCardBeingClicked } =
    useContext(gameboardContext);

  console.log('PLAYER OBJECT', player);

  // state that opens and closes the graveyard/hp container
  const [openGraveyard, setOpenGraveyard] = useState(false);

  // state that opens and closes the player's hands container
  const [openHands, setOpenHands] = useState(false);

  // activates a mana
  function useMana(card, index) {
    if (card.activated) {
      // if the player clicked an activated mana
      player.mana_bar[index].activated = false;
      dispatchPlayer({
        type: 'deploy_mana',
        payload: player.mana_bar,
      });
    } else {
      // mana being activated by the first time
      player.mana_bar[index].activated = true;
      dispatchPlayer({
        type: 'deploy_mana',
        payload: player.mana_bar,
      });
    }
  }

  return (
    <>
      <div className='w-full h-full relative'>
        <div
          className={`${player.deck_name === 'Angel Army' ? 'angel-deck' : player.deck_name === 'Vile Force' ? 'vile-deck' : 'human-deck'} ${openHands ? 'top-1' : 'top-78.5'} absolute rounded-tr-sm w-80 h-85.5 border-r-2 transition-all z-4`}
          id='playerHandsContainer'
        >
          <span
            className='active:opacity-50 bg-gray-900 absolute h-8.5 flex items-center justify-center right-0 border-2 border-black text-amber-400 text-2xl rounded-t-sm hover:cursor-pointer hover:bg-amber-400 hover:text-black transition-colors'
            id='drawer-knob'
            onClick={() => {
              setButtonSound(!buttonSound);
              setOpenHands(!openHands);
              if (openHands) setCardBeingClicked('');
            }}
          >
            {openHands ? <IoMdArrowDropdown /> : <IoMdArrowDropup />}
          </span>
          <h1 className='text-center text-2xl rounded-tr-sm radialGradient border-2 border-r-0 fontUncial'>
            {player.name}'s hands
          </h1>

          <div
            className='bg-amber-400 w-full flex justify-between items-center px-4 border-b-2'
            id='deck-name-ui'
          >
            <p className='font-bold text-lg'>Deck: {player.deck_name}</p>
            <p className='font-bold text-2xl'>
              {player.deck_current_cards} cards
            </p>
          </div>

          <ul
            className='flex flex-col p-2 overflow-y-auto h-69.5'
            id='cardsContainer'
          >
            {player.hands.map((card, index) => {
              return (
                <div
                  className={`flex w-full justify-between items-center border-t-2 border-b-2 hover:cursor-pointer hover:border-b-black hover:border-t-black rounded-sm px-2 py-1 transition-all ${cardBeingClicked === card ? 'bg-amber-50 border-t-black border-b-black' : 'border-t-transparent border-b-transparent'}`}
                  key={index}
                  onClick={() => {
                    // if clicked in an already selected card, unselect it
                    cardBeingClicked !== card
                      ? setCardBeingClicked(card)
                      : setCardBeingClicked('');
                    setCardSound(!cardSound);
                  }}
                >
                  <li className='font-bold text-lg flex items-center'>
                    {card.type.match(/legendary/i) ? (
                      <>
                        <MdOutlineStar className='text-blue-400 mr-1' />
                        {card.name}
                      </>
                    ) : card.type.match(/^creature —/i) ? (
                      <>
                        <GiBroadsword className='mr-1' />
                        {card.name}
                      </>
                    ) : card.type.match(/land/i) ? (
                      <>
                        <GiMountaintop className='mr-1' />
                        {card.name}
                      </>
                    ) : (
                      <>
                        <FaGripfire className='mr-1' />
                        {card.name}
                      </>
                    )}
                  </li>

                  {card.type.match(/basic land/i) ? ( // if card is a mana generate a button instead
                    <button className='border-2 border-transparent rounded-sm hover:cursor-pointer text-lg hover:bg-black hover:text-white hover:border-white hover:shadow-2xl transition-all p-1'>
                      <IoArrowRedoSharp />
                    </button>
                  ) : (
                    <p className='flex justify-center items-center'>
                      <CardMana mana_cost={card.mana_cost} />
                    </p>
                  )}
                </div>
              );
            })}
          </ul>

          {cardBeingClicked && <CardPreview card={cardBeingClicked} />}
        </div>

        <div id='mana-bar-wrapper' className='absolute right-101 top-74.5'>
          <h1 className='-top-8.5 absolute rounded-t-sm fontUncial bg-gradient-to-bl from-blue-700 to-gray-900 text-amber-400 border-amber-400 text-2xl w-40 text-center border-2'>
            Mana bar
          </h1>
          <div
            className='w-200 h-12 border-2 border-amber-400 border-b-0 bg-gradient-to-bl from-blue-700 to-gray-900  rounded-t-sm p-1 flex justify-start items-center'
            id='mana-bar'
          >
            {player.mana_bar.map((card, index) => {
              return (
                <button
                  className={`flex justify-between items-center rounded-sm mr-2 w-22 p-1 font-bold text-lg  border-2 ${card.name === 'Plains' ? 'white-card-background text-black' : 'black-card-background text-amber-50'} hover:cursor-pointer hover:opacity-70 transition-all ${card.activated && 'activatedMana'}`}
                  id='mana-btn'
                  onClick={() => {useMana(card, index); setManaSound(!manaSound)}}
                  key={index}
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

        <div id='battlefield'></div>

        <div
          className={`${openGraveyard ? 'top-17' : 'top-78.5'} absolute flex right-0 border-l-2 rounded-tl-sm transition-all`}
        >
          <div
            className={`${player.deck_name === 'Angel Army' ? 'angel-deck' : player.deck_name === 'Vile Force' ? 'vile-deck' : 'human-deck'} w-80 h-70 border-r-2 rounded-tl-sm`}
            id='playerGraveyardContainer'
          >
            <span
              className='active:opacity-50 bg-gray-900 absolute h-8.5 flex justify-center items-center border-2 border-black text-amber-400 text-2xl rounded-t-sm hover:cursor-pointer hover:bg-amber-400 hover:text-black transition-colors'
              id='drawer-knob'
              onClick={() => {
                setButtonSound(!buttonSound);
                setOpenGraveyard(!openGraveyard);
              }}
            >
              {openGraveyard ? <IoMdArrowDropdown /> : <IoMdArrowDropup />}
            </span>
            <h1 className='text-center text-2xl rounded-tl-sm radialGradient border-2 border-l-0 border-r-0 fontUncial'>
              Graveyard
            </h1>
          </div>
          <div
            className={`${player.deck_name === 'Vile Force' ? 'bg-gradient-to-b from-green-600 to-green-950' : 'bg-gradient-to-b from-red-600 to-red-950'} ${openGraveyard ? 'items-center' : 'items-start'} border-t-2  flex justify-center`}
            id='playerHPContainer'
          >
            <h1 className='text-center text-2xl fontUncial'>{player.hp}hp</h1>
          </div>
        </div>
      </div>
    </>
  );
}

// bot battlefield component
function Bot() {
  const { player } = useContext(globalContext);

  return (
    <div className='w-full h-full relative'>
      <div
        className={`${player.deck_name === 'Angel Army' ? 'angel-deck' : player.deck_name === 'Vile Force' ? 'vile-deck' : 'human-deck'} absolute flex items-end rounded-br-sm w-80 h-30 top-0 border-r-2 overflow-auto`}
        id='botHandsContainer'
      >
        <h1 className='text-center w-full text-2xl rounded-br-sm radialGradient border-2 border-r-0 fontUncial'>
          Drulak's hands
        </h1>
      </div>

      <div id='mana-bar-wrapper'>
        <h1 className='right-101.5 top-7.5 absolute rounded-t-sm fontUncial bg-gradient-to-bl from-gray-900 to-blue-700 text-amber-400 border-amber-400 text-2xl w-40 text-center border-2'>
          Mana bar
        </h1>
        <div
          className='w-200 h-8 border-2 border-amber-400 border-t-0 bg-gradient-to-bl from-gray-900 to-blue-700 absolute right-101 top-0 rounded-b-sm'
          id='mana-bar'
        ></div>
      </div>

      <div className='absolute flex right-0 border-l-2 rounded-bl-sm'>
        <div
          className={`${player.deck_name === 'Angel Army' ? 'angel-deck' : player.deck_name === 'Vile Force' ? 'vile-deck' : 'human-deck'} flex items-end w-80 h-30 border-r-2 rounded-bl-sm`}
          id='botGraveyardContainer'
        >
          <h1 className='w-full text-center text-2xl rounded-bl-sm radialGradient border-2 border-l-0 border-r-0 fontUncial'>
            Graveyard
          </h1>
        </div>
        <div
          className={`${player.deck_name === 'Vile Force' ? 'bg-gradient-to-b from-green-600 to-green-950' : 'bg-gradient-to-b from-red-600 to-red-950'} border-b-2  flex justify-center items-center`}
          id='botHPContainer'
        >
          <h1 className='text-center text-2xl fontUncial'>{player.hp}hp</h1>
        </div>
      </div>
    </div>
  );
}

// function to display in the UI the amount of mana cost for cards
function CardMana({ mana_cost }) {
  return (
    <>
      {mana_cost.includes('{1}') && (
        <i class='ms ms-1 ms-cost ms-shadow'></i> // mana icon
      )}
      {mana_cost.includes('{2}') && (
        <i class='ms ms-2 ms-cost ms-shadow'></i> // mana icon
      )}
      {mana_cost.includes('{3}') && (
        <i class='ms ms-3 ms-cost ms-shadow'></i> // mana icon
      )}
      {mana_cost.includes('{6}') && (
        <i class='ms ms-6 ms-cost ms-shadow'></i> // mana icon
      )}
      {mana_cost.includes('{W}{W}') ? ( // mana icon
        <>
          <i class='ms ms-w ms-cost ms-shadow'></i>
          <i class='ms ms-w ms-cost ms-shadow'></i>
        </>
      ) : mana_cost.includes('{W}') ? ( // mana icon
        <>
          <i class='ms ms-w ms-cost ms-shadow'></i>
        </>
      ) : mana_cost.includes('{B}{B}') ? ( // mana icon
        <>
          <i class='ms ms-b ms-cost ms-shadow'></i>
          <i class='ms ms-b ms-cost ms-shadow'></i>
        </>
      ) : (
        mana_cost.includes('{B}') && <i class='ms ms-b ms-cost ms-shadow'></i> // mana icon
      )}
    </>
  );
}

function CardPreview({ card }) {
  // card is the only prop because it comes from the Player's deck directly

  // getting important data from Gameboard context
  const {
    oneManaPerTurn,
    setOneManaPerTurn,
    deployOneMana,
    deployCreatureOrSpell,
  } = useContext(gameboardContext);

  return (
    <div
      className={`white-card-background absolute -top-60 left-80 flex flex-col justify-start items-center rounded-2xl p-2 w-90 h-140 z-6 shadowing border-10 border-black`}
      id='cardPreviewContainer'
    >
      <span className='rounded-t-sm w-full flex justify-between items-center px-1'>
        <h1 className='text-black font-black text-lg text-center '>
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
      />

      <div className='flex w-full'>
        <p className='text-black font-bold text-lg'>{card.type}</p>
      </div>

      <div
        className={`absolute ${card.type.match(/land/i) ? 'opacity-80' : 'opacity-10'} text-9xl bottom-25`}
      >
        {card.color[0] === 'W' ? (
          <i class='ms ms-w'></i>
        ) : (
          <i class='ms ms-b'></i>
        )}
      </div>

      <div className='my-2 border-4 white-card-desc font-bold text-lg p-2 w-80 h-50'>
        {card.ability
          ? card.ability
          : card.description && `~${card.description}`}
      </div>

      <span className='flex justify-between items-center px-1 font-bold text-lg w-full'>
        <button
          className={`active:opacity-80 border-2 hover:opacity-60  transition-all text-black px-2 
            ${
              card.type.match(/land/i)
                ? oneManaPerTurn
                  ? 'radialGradient hover:cursor-pointer'
                  : 'bg-gradient-to-b from-blue-950 to-gray-500 hover:cursor-not-allowed'
                : 'bg-gradient-to-b from-blue-950 to-gray-500 hover:cursor-not-allowed'
            }`}
          id='deploy-btn'
          disabled={
            card.type.match(/land/i) ? (oneManaPerTurn ? false : true) : false
          }
          onClick={
            card.type.match(/land/i)
              ? () => deployOneMana()
              : () => deployCreatureOrSpell()
          }
        >
          Deploy Card
        </button>
        {card.power && card.toughness && (
          <p className='text-3xl font-bold'>
            {card.power}/{card.toughness}
          </p>
        )}
      </span>
    </div>
  );
}

export default Gameboard;
