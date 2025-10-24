import { useContext } from 'react';
import Card from './cards/Card';
import { gameboardContext } from '../contexts/gameboard-context';

// battlefield where cards are deployed to
export default function Battlefield({ competitor, dispatch }) {

  const { toEnlarge } = useContext(gameboardContext);

  // bot check
  const isBot = competitor.name === 'Bot';

  return (
    <div
      id='battlefieldWrapper'
      className={`
        ${toEnlarge === '' || toEnlarge === null ? 'z-4' : 'z-10' }
        absolute ${isBot && 'top-1.5'} left-1/2 -translate-x-1/2 w-320 
        h-full p-5 flex justify-center items-center
      `}
    >
      <Card competitor={competitor} dispatch={dispatch} />
    </div>
  );
}
