export default function HP({ openGraveyard, competitor }) {
  // condition if the competitor is the bot
  const isBot = competitor.name === 'Bot';

  return (
    <div
      className={`
        ${
          competitor.deck_name === 'Vile Force'
            ? !isBot // reverting the gradient color for the bot HP
              ? 'bg-gradient-to-b from-green-600 to-green-950'
              : 'bg-gradient-to-b from-green-950 to-green-600'
            : !isBot // reverting the gradient color for the bot HP
              ? 'bg-gradient-to-b from-red-600 to-red-950'
              : 'bg-gradient-to-b from-red-950 to-red-600'
        } 
        ${openGraveyard ? 'items-center' : !isBot ? 'items-start' : 'items-end'} flex justify-center
        ${isBot ? 'border-b-2' : 'border-t-2'}
      `}
      id={`${competitor}HPContainer`}
    >
      <h1 className='text-center text-2xl fontUncial'>{competitor.hp}hp</h1>
    </div>
  );
}
