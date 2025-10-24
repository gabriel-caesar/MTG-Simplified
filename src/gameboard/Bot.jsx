import { useContext, useEffect, useState } from 'react';
import { globalContext } from '../contexts/global-context.js'
import Graveyard from './battlefield-ui/Graveyard.jsx';
import ManaBar from './battlefield-ui/ManaBar.jsx';
import Hands from './battlefield-ui/Hands.jsx';
import Battlefield from './Battlefield.jsx';
import HP from './battlefield-ui/HP.jsx';
import { gameboardContext } from '../contexts/gameboard-context.js';

// bot battlefield component
export default function Bot() {
  const { bot, dispatchBot, gameTurn } = useContext(globalContext);
  const { isBotAttacking } = useContext(gameboardContext);

  // state that opens and closes the graveyard/hp container
  const [openGraveyard, setOpenGraveyard] = useState(false);

  useEffect(() => {
    setOpenGraveyard(false);
  }, [gameTurn])

  return (
    <div className='w-full h-full relative'>
      <Battlefield competitor={bot} dispatch={dispatchBot} />

      <Hands competitor={bot} dispatch={dispatchBot} />

      <ManaBar competitor={bot} dispatch={dispatchBot} />

      <div
        className={`${openGraveyard ? 'top-0' : '-top-61.5'} absolute flex right-0 border-l-2 rounded-bl-sm transition-all z-15`}
        id='graveyard-hp-wrapper'
      >
        <Graveyard
          openGraveyard={openGraveyard}
          setOpenGraveyard={setOpenGraveyard}
          competitor={bot}
          dispatch={dispatchBot}
        />
        <HP openGraveyard={openGraveyard} competitor={bot} />
      </div>
    </div>
  );
}
