import Gameboard from '../../gameboard/Gameboard.jsx';
import ControlBar from '../control-bar/ControlBar.jsx';
import MainMenu from './MainMenu.jsx';

import { globalContext } from '../../contexts/contexts.js';
import { useContext } from 'react';

export default function SinglePlayerWrapper() {
  const { battleStarts } = useContext(globalContext);

  return (
    <>
      <ControlBar />

      {battleStarts ? ( // this flag determines if player should be inside the gameboard or main menu UI
        <Gameboard />
      ) : (
        <MainMenu />
      )}
    </>
  );
}
