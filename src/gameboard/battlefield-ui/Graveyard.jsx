import { useContext } from 'react';
import { globalContext } from '../../App.jsx';
import { IoMdArrowDropdown, IoMdArrowDropup } from 'react-icons/io';

export default function Graveyard({ openGraveyard, setOpenGraveyard, competitor }) {

  const { buttonSound, setButtonSound } = useContext(globalContext);

  // condition if the graveyard is for Bot
  const isBot = competitor.name === 'Bot';

  return (
    <div
      className={`
        ${competitor.deck_name === 'Angel Army' ? 'angel-deck' : competitor.deck_name === 'Vile Force' ? 'vile-deck' : 'human-deck'} 
        ${isBot ? 'rounded-bl-sm' : 'rounded-tl-sm'}
        flex flex-col w-80 h-70 border-r-2 relative
      `}
      id={`${competitor.name}GraveyardContainer`}
    >
      <span
        className={`
          ${isBot ? 'rounded-b-sm bottom-0 z-2' : 'rounded-t-sm'}
          active:opacity-50 bg-gray-900 absolute h-8.5 flex justify-center items-center border-2 border-black text-amber-400 text-2xl hover:cursor-pointer hover:bg-amber-400 hover:text-black transition-colors
        `}
        id='drawer-knob'
        onClick={() => {
          setButtonSound(!buttonSound);
          setOpenGraveyard(!openGraveyard);
        }}
      >
         {
          !isBot ? 
            (openGraveyard ? <IoMdArrowDropdown /> : <IoMdArrowDropup />) 
                : isBot && 
                 (openGraveyard ? <IoMdArrowDropup /> : <IoMdArrowDropdown />)
        }
      </span>
      <h1 className={`
        ${isBot ? 'absolute bottom-0 z-1 w-full rounded-bl-sm' : 'rounded-tl-sm'}
        text-center text-2xl radialGradient border-2  border-l-0 border-r-0 fontUncial
      `}>
        Graveyard
      </h1>
    </div>
  );
}
