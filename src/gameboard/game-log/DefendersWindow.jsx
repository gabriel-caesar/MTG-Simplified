import { useContext } from 'react';
import { globalContext } from '../../contexts/global-context';
import { GiBroadsword } from 'react-icons/gi';
import { MdOutlineStar } from 'react-icons/md';

export default function DefendersWindow({
  attacker,
  populateDefenseDecisions,
  battlefieldCopy,
}) {
  const { buttonSound, setButtonSound } = useContext(globalContext);

  return (
    <div
      id='defenders-window'
      aria-label='defenders-window'
      className='absolute right-30 top-10 border-2 border-amber-200 w-90 h-fit max-h-50 text-gray-900 bg-amber-400 rounded-sm inset-shadow-button overflow-y-auto overflow-x-hidden z-2'
    >
      <h1
        id='attacker-name-header'
        aria-label='attacker-name-header'
        className='w-full text-center bg-gray-900 text-red-600 font-bold text-xl'
      >
        Defending {attacker.name}
      </h1>
      <span
        id='attack-defend-wrapper'
        aria-label='attack-defend-wrapper'
        className='flex w-full justify-around px-2 items-center bg-gray-900 border-b-2 border-red-600 pb-2 mb-2 text-amber-400'
      >
        <p>Power: {attacker.power}</p>
        <p>Toughness: {attacker.toughness}</p>
      </span>
      <div
        id='defender-selection-wrapper'
        aria-label='defender-selection-wrapper'
        className='p-2'
      >
        {battlefieldCopy.length > 0 &&
        battlefieldCopy.some(
          (c) =>
            !c.attack &&
            !c.defend &&
            !c.attackPhaseSickness &&
            !c.summoningSickness &&
            c.type.match(/creature/i)
        ) ? (
          battlefieldCopy.map((creature) => {
            if (
              !creature.attackPhaseSickness &&
              !creature.summoningSickness &&
              !creature.defend &&
              !creature.attack
            ) {
              return (
                <button
                  id='defender-creature-info'
                  aria-label='defender-creature-info'
                  key={creature.instanceId}
                  className='
                  flex justify-between items-center p-1 w-full border-2 h-10 rounded-md border-transparent hover:cursor-pointer hover:border-t-gray-900 hover:border-b-gray-900 [&>*:not(:last-child)]:mb-2 transition-all
                '
                  onClick={() => {
                    setButtonSound(!buttonSound);
                    populateDefenseDecisions(creature, attacker);
                  }}
                >
                  <p
                    id='creature-name'
                    aria-label='creature-name'
                    className='flex items-center'
                  >
                    {creature.legendary ? (
                      <MdOutlineStar className='text-blue-400 mr-1' />
                    ) : (
                      <GiBroadsword className='mr-1' />
                    )}
                    {creature.name}
                  </p>
                  <p id='creature-stats' aria-label='creature-stats'>
                    {creature.power}/{creature.toughness}
                  </p>
                </button>
              );
            }
          })
        ) : (
          <p className='text-center font-bold text-gray-900'>
            You don't have any cards to defend with
          </p>
        )}
      </div>
    </div>
  );
}
