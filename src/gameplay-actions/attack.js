import { botDefends } from './bot-defends.js';
import { tapCard } from './tap-cards.js';

// main attack function for player
export default function attack(
  card,
  attacker,
  attackerDispatch,
  defender,
  defenderDispatch,
  setToEnlarge,
  setOriginalToughness
) {
  // if who's attacking is Bot
  const isBot = attacker.name === 'Bot';

  // tapping attacking card
  tapCard(attacker, attackerDispatch, card, true, false);

  // bot defends
  if (!isBot)
    botDefends(
      card,
      defender,
      defenderDispatch,
      attacker,
      attackerDispatch,
      setToEnlarge,
      setOriginalToughness
    );
}
