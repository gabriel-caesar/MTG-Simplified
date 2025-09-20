import { gameboardContext } from '../../contexts/gameboard-context';
import { globalContext } from '../../contexts/global-context';
import { useContext, useState } from 'react';
import '../../css/gameboard.css';
import DefendersWindow from './DefendersWindow';
import { Undo2 } from 'lucide-react';

export default function DefenseDecisions({ battlefieldCopy, setBattlefieldCopy }) {
  const {
    botAttackingCards,
    playerDefenseDecisions,
    setPlayerDefenseDecisions,
    gameTurn,
  } = useContext(gameboardContext);
  const { setButtonSound, buttonSound, player } = useContext(globalContext);
  const [openDefendersWindow, setOpenDefendersWindow] = useState('');

  function undoDefendant(creature, HP) {

    // if user is not taking the damage on HP, update the defendant card back to have defend = false
    if (!HP) {
      // finding the defendant object for future reference
      const defendantObj = playerDefenseDecisions.find(
        (obj) => obj.attackerInstanceId === creature.instanceId
      );
  
      // getting the defendant card object from the battlefield
      const defendant = battlefieldCopy.find(
        (c) => c.instanceId === defendantObj.defenderInstanceId
      );
  
      // updating the battlefield copy by turning the defend prop false
      const updatedBattlefieldCopy = battlefieldCopy.map((c) => ({
        ...c,
        defend: c.instanceId === defendant.instanceId ? false : c.defend,
      }));
      setBattlefieldCopy(updatedBattlefieldCopy); // toggling the defend prop from the defendant card to false
    }

    // filtering the decision object from the state
    const updatedDecisions = playerDefenseDecisions.filter(
        (obj) => obj.attackerInstanceId !== creature.instanceId
      );

    setPlayerDefenseDecisions(updatedDecisions);
  }

  function populateDefenseDecisions(creature, attacker) {
    // if there is no creature, take damage on HP
    const defenseObject = {
      attackerInstanceId: attacker.instanceId,
      defenderName: !creature ? null : creature.name,
      defenderInstanceId: !creature ? null : creature.instanceId,
      takeOnHp: !creature ? true : false,
      gameTurn: gameTurn,
    };

    // appending the new defense obj into the playerDefenseDecisions array
    setPlayerDefenseDecisions((prev) => {
      return [...prev, defenseObject];
    });

    // filtering the battlefield copy to show the remaining defendable cards for other attackers
    if (creature) { // if not defending with a creature
      const updatedBattlefieldCopy = battlefieldCopy.map((c) => ({
        ...c,
        defend: c.instanceId === creature.instanceId ? true : c.defend,
      }));
      setBattlefieldCopy(updatedBattlefieldCopy);
    }
  }

  return (
    <>
      {botAttackingCards.length > 0 &&
        botAttackingCards.map((card) => {
          return (
            <div
              key={card.instanceId}
              id='attacking-card-log'
              aria-label='attacking-card-log'
              className='flex justify-between items-center w-full mb-2'
            >
              {card.name}
              <span className='flex relative items-center'>
                {playerDefenseDecisions.some(
                  (obj) => obj.attackerInstanceId === card.instanceId
                ) ? (
                  <>
                    <p>
                      Defendant:{' '}
                      <span className='text-red-500'>
                        {playerDefenseDecisions.find(
                          (obj) => obj.attackerInstanceId === card.instanceId
                        ).defenderName
                          ? playerDefenseDecisions.find(
                              (obj) =>
                                obj.attackerInstanceId === card.instanceId
                            ).defenderName
                          : 'HP'}
                      </span>
                    </p>
                    <button
                      id='reset-defendant-button'
                      aria-label='reset-defendant-button'
                      className='ml-2 inset-shadow-button rounded-sm p-1 bg-amber-300 text-gray-900 border-2 hover:cursor-pointer transition-all mr-2'
                      onClick={() => {
                        setButtonSound(!buttonSound);
                        undoDefendant(card, playerDefenseDecisions.find(
                          (obj) => obj.attackerInstanceId === card.instanceId
                        ).takeOnHp ? true : false);
                      }}
                    >
                      <Undo2 />
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      className='inset-shadow-button rounded-sm p-1 bg-amber-300 text-gray-900 border-2 hover:cursor-pointer transition-all mr-2'
                      id='defend-with-button'
                      aria-label='defend-with-button'
                      onClick={() => {
                        setButtonSound(!buttonSound);
                        // if clicked in a already selected button, unselect it
                        setOpenDefendersWindow(
                          openDefendersWindow !== card.instanceId
                            ? card.instanceId
                            : ''
                        );
                      }}
                    >
                      Defend with
                    </button>

                    <button
                      className='inset-shadow-button rounded-sm p-1 bg-red-500 text-gray-900 border-2 hover:cursor-pointer transition-all'
                      id='take-on-hp-button'
                      aria-label='take-on-hp-button'
                      onClick={() => {
                        setButtonSound(!buttonSound);
                        populateDefenseDecisions(null, card);
                      }}
                    >
                      Take on HP
                    </button>
                    {openDefendersWindow === card.instanceId && (
                      <DefendersWindow
                        attacker={card}
                        populateDefenseDecisions={populateDefenseDecisions}
                        battlefieldCopy={battlefieldCopy}
                        setBattlefieldCopy={setBattlefieldCopy}
                      />
                    )}
                  </>
                )}
              </span>
            </div>
          );
        })}
    </>
  );
}
