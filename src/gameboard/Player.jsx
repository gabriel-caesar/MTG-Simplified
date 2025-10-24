import { useContext, useEffect, useState } from 'react';
import { gameboardContext } from '../contexts/gameboard-context.js';
import { globalContext } from '../contexts/global-context.js';
import Graveyard from './battlefield-ui/Graveyard.jsx';
import ManaBar from './battlefield-ui/ManaBar.jsx';
import Hands from './battlefield-ui/Hands.jsx';
import Battlefield from './Battlefield.jsx';
import HP from './battlefield-ui/HP.jsx';

export default // players battlefield component
function Player() {
  const { player, dispatchPlayer, gameTurn } = useContext(globalContext);
  const { isBotAttacking } = useContext(gameboardContext);

  // state that opens and closes the graveyard/hp container
  const [openGraveyard, setOpenGraveyard] = useState(false);

  useEffect(() => {
    setOpenGraveyard(false);
  }, [gameTurn])

  return (
    <>
      <div className='w-full h-full relative'>
        <Battlefield competitor={player} dispatch={dispatchPlayer} />

        <Hands competitor={player} dispatch={dispatchPlayer} />

        <ManaBar competitor={player} dispatch={dispatchPlayer} />

        <div
          className={`${openGraveyard ? 'bottom-0' : '-bottom-61.5'} absolute flex right-0 border-l-2 rounded-tl-sm transition-all z-15`}
          id='graveyard-hp-wrapper'
        >
          <Graveyard
            openGraveyard={openGraveyard}
            setOpenGraveyard={setOpenGraveyard}
            competitor={player}
            dispatch={dispatchPlayer}
          />
          <HP openGraveyard={openGraveyard} competitor={player} />
        </div>
      </div>
    </>
  );
}
