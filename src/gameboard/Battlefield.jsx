import { useContext } from 'react';
import Card from './cards/Card';
import { gameboardContext } from '../contexts/gameboard-context';

// battlefield where cards are deployed to
export default function Battlefield({ competitor, dispatch }) {

  const { toEnlarge } = useContext(gameboardContext);

  // determine if this battlefield contains the currently enlarged card
  const hasEnlarged =
    toEnlarge &&
    competitor.battlefield &&
    competitor.battlefield.some((c) => c.instanceId === toEnlarge);
  
  /* 
  
  ### Why inspecting bot cards would not overlap properly ###

  Each battlefield uses transforms (Tailwind translate) which creates 
  its own stacking context. When both battlefields used the same elevated 
  z-index, DOM order decided which one was visually on top — Player being 
  later in the DOM covered Bot. By raising only the battlefield that actually 
  contains the enlarged card, its stacking context is placed above siblings 
  and will correctly overlap the rest of the UI whether it's the Bot or Player.
  
  */

  return (
    <div
      id='battlefieldWrapper'
      className={`
        ${hasEnlarged ? 'z-50' : toEnlarge === '' || toEnlarge === null ? 'z-4' : 'z-10'}
        absolute left-1/2 -translate-x-1/2 w-320 
        h-full p-5 flex justify-center items-center
      `}
    >
      <Card competitor={competitor} dispatch={dispatch} />
    </div>
  );
}
