import { useContext, useState } from 'react';
import { globalContext } from '../contexts/global-context.js';
import Graveyard from './battlefield-ui/Graveyard.jsx';
import ManaBar from './battlefield-ui/ManaBar.jsx';
import Hands from './battlefield-ui/Hands.jsx';
import Battlefield from './Battlefield.jsx';
import HP from './battlefield-ui/HP.jsx';

export default // players battlefield component
function Player() {
  const { player, dispatchPlayer } = useContext(globalContext);

  // state that opens and closes the graveyard/hp container
  const [openGraveyard, setOpenGraveyard] = useState(false);

  return (
    <>
      <div className='w-full h-full relative'>
        <Battlefield competitor={player} dispatch={dispatchPlayer} />

        <Hands competitor={player} dispatch={dispatchPlayer} />

        <ManaBar competitor={player} dispatch={dispatchPlayer} />

        <div
          className={`${openGraveyard ? 'top-17' : 'top-78.5'} absolute flex right-0 border-l-2 rounded-tl-sm transition-all`}
          id='graveyard-hp-wrapper'
        >
          <Graveyard
            openGraveyard={openGraveyard}
            setOpenGraveyard={setOpenGraveyard}
            competitor={player}
          />
          <HP openGraveyard={openGraveyard} competitor={player} />
        </div>
      </div>
    </>
  );
}
