import Card from './cards/Card';

// battlefield where cards are deployed to
export default function Battlefield({ competitor, dispatch }) {

  // bot check
  const isBot = competitor.name === 'Bot';

  return (
    <div
      className={`absolute ${isBot && 'top-1.5'} left-30 w-320 h-85 p-5 flex justify-center`}
    >
      <Card competitor={competitor} dispatch={dispatch} />
    </div>
  );
}
