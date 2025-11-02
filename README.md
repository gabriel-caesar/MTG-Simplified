# Magic: The Gathering Simplified

**Demo video**: https://www.youtube.com/watch?v=gsKFKFzA6_A

**Game link**: https://mtg-simplified.vercel.app/

**Repo**: https://github.com/gabriel-caesar/MTG-Simplified

This project started only as a cool idea for Harvard's CS50x course final project, but ended up being one of the most fun programs that I've ever coded.

## How it works
Since this is a simplified version of the amazing MTG game, I will explain some core rules that are included in the game and how different they are from the original version.

- ### Decks
  > There are only three decks in the game: **Angel Army** (Angel), **The Resistance** (Human) and **Vile Force** (Demon). All decks have 21 cards including 2 legendary creatures, 10 lands, 6 regular creatures and 3 non-castable spells each.

- ### Single-player only
  > No multiplayer options were added, so you play against an average AI bot.
  
- ### Mana
  > Competitors use the default MTG mana rule, which you can only deploy one mana per turn.

- ### Creature and spells
  > Although there are spells to be deployed, you unfortunately can't cast them. I will add this functionally in the far future. However creatures attack and defend normally as you would expect. 

- ### Attack and defense phase
  > Here is where it really got simplified. Since there are no perks (such as haste, trample, etc...) and no spells to be cast, there won't be decision windows throughout the attack and defense phases. When choosing to attack, the bot side will always turn all the cards it can before the user can decide which one to defend, however for the player side, the bot competitor will defend each card that is being turned to attack as the user chooses it.

- ### Winning
  > Whoever gets the opponent under 20 hit points wins the battle.

  <br></br>


## Code
In this section I will summarize a little bit the game engine (fancy...) I have come up with.

Main things to consider is that the game works on top of Reducers and Context APIs:
  - **Reducer**: takes care of the player and bot states, providing dispatch functions with payloads to create the competitor object, update the competitor's hands, deck, mana bar, battlefield, cards, hp and turns.
  
  - **Two main context APIs exist**:
    1. **Global Context**: provides top-level values to feed the application such as sound effects, background theme, important states that dictates what's available to interact or not, all decks and the player/bot states already initialized.
   
    2. **Gameboard Context**: by far the context with the most values that controls mainly the front-end such as the game turn, game log, what card is being inspected from the battlefield or from the hands drawer, one mana per turn rule, attacking states, defense decisions, etc...
   
  <br></br>

---

### Deck management
For this project I used the **Scryfall** API that contains all cards informations from MTG and provides an URL which I could dynamically change its endpoint to get the cards info through json objects.  
**Scryfall** website link: https://scryfall.com/

  - **Deck creation**: All three decks are initially plain json objects with the card names and quantities. Out of this data the `App.jsx` component calls the `createDeck()` function on mount with the `useEffect()` hook.

  - **Card fetching**: the function `fetchCard()` is then called within `createDeck()` to fetch each deck card from **Scryfall**'s API by card name. As the function fetches the card from the API, it also adds additional properties to the creature and spell cards, such as `attack`, `defend`, `cast` and `enoughManaToDeploy`.

  - **Drawing cards and deck final set up**: finally `drawSevenCards()` function is called within the `App.jsx` component when the player chooses a deck to play and `battlePrep` is false (which means the battle horn finished being blown).  
  Since until now the deck didn't become 21 cards yet, the `openDeckObject()` function will be called to turn the deck returned from `createDeck()`, which at the current moment has 9 cards only, to 21 cards by looping through each card's quantity. Once this step is done, then `drawSevenCards()` function finishes drawing 7 cards for each competitor and update their decks through a dispatch function.

  <br></br>

---

### Bot algorithm
This algorithm was based fully in recursive loops. Its main function is `botPlays()` inside `PassTurnButton.jsx` component at the **line 63**. I tried migrating this function to the `bot.js` file which is inside the `gameplay-actions` directory, but since it depends so much on different states, I ended up just leaving it there. As I said earlier, since this function lives inside the pass turn button component, it is easy to guess that bot starts playing as soon as the player passes its turn foward, let me guide you through some steps I programmed it to go through:

  - The function receives **5 different** arguments (`bot`, `hasDeployedMana`, `newTurn`, `gameState`, `defenseMode`).
  
  - Note that I will be ordering loops as we progress in the function logic, but in reality the bot can skip some choices if they are impossible to make at the moment or were already done.

  - In the **first loop**, the bot checks if it needs to go **defense mode** which depends on the condition of having 10 or less hit points and the player has to have creatures in its battlefield. The defense mode is controlled by the `defenseMode` state created in the `PassTurnButton.jsx`.
  
  - While in the **first loop** the bot checks if there is mana to deploy. If there is, deploy it, record this action in the `gameState` and call `botPlays()` again turning `hasDeployedMana` to true, otherwise continue.

  - In the **second loop**, the bot checks if there are unactivated manas, calling `activateAllManas()` to activate all of the activatable manas and then recursively calls `botPlays()` again with an updated bot state value.

  - In the **third loop**, the bot starts by calling `isEnoughMana()` to check what cards in its hands are deployable and stores it in the variable `deployableCards`. Then it filters out what cards from its battlefield can attack and stores it in the variable `attackableCards`. Afterwards, the bot proceeds to check the base condition which is two levels of conditions: 
    1. **First condition**: if there is no cards to attack with **or** defense mode is active.
    2. **Second condition**: if the first condition passes, the algorithm checks if the bot ran out of cards to deploy **or** the battlefield reached its full capacity of cards (6).
 
    Let's say, for now, that the base condition wasn't satisfied for simplicity sake. So the bot now will choose what card to deploy, calling `deployPriority()` function, feeding `deployableCards` into its only argument so that it returns `cardToDeploy`. Bot will do the same thing when choosing the card to attack, so it will call `botCardToAttack()` function, feeding `attackableCards` into its only argument so that it returns `cardToAttack`.  
    Now, if `cardToDeploy` is valid and its battlefield is not full, it will call the `deployCreatureOrSpell()` function that updates the bot's battlefield array with the new card object, updates `gameState` with the deployed card and returns an updated version of the `gameState` state (`gameState` is part of the game log logic). Bot will then call `botPlays()` recursively with an updated version of itself and `gameState`.

  - In the **fourth loop**, the bot will check if `cardToAttack` is valid and call the `tapCard()` function that will tap the `cardToAttack`'s object and return it freshly modified (as `updatedAttackingCard`) so it doesn't get lost in React's batch updates. Now, `botAttackingCards`, which is an array with all attacking cards of that turn, gets updated with the new card that's attacking.  
  Lastly the `gameState` is updated, recording that the bot attacked with a card and the bot recursively calls `botPlays()` again checking for the base condition.

  - In the **fifth loop**, the bot, for simplicity sake, satisfies all base conditions, so if there are attacking cards in its battlefield, the `isBotAttacking` state is turned **true**, which then when the turn is passed, that state will give the player ability to choose a defense against that attack. Afterwards, the game turn is updated, the turn is passed over and the opponent gets reset for its new turn.

  <br></br>

  ---
  
  ### Game state
  After all, what is the `gameState` that is so much talked about in the **Bot algorithm**? It is nothing less than the array that rules the game log and presents all updates from what happened in each turn in real time.  
  `gameState` has a quite mind-tangling structure, let's look it carefully. Inside `game-state-manager.js` we have two main functions: `gameStateManager()` that creates a new turn state from scratch or returns the existing turn state for the current turn we are querying it for and `gameStateUpdater()` that updates turn states inside the `gameState` array:
  
  ```js
  turnState = {
    turn: number,
    log: [],
    owner: string,
    id: uniqueId(), // my custom id generator
  }
  ```

  Now, inside the code (specifically in `LogMessages.jsx`) when the `gameState` is mapped to render all `turnStates` we need to also map and render each `log` property from each `turnState`.  
  `log` objects can have 8 different types and also different specifications within then as follows:

  ```js
  log = {
    id: uniqueId(),
    type: 'Creature attack' |
    'Creature clash' |
    'Deploy creature' |
    'Deploy spell' |
    'Deploy mana' |
    'Take damage on HP' |
    'Battlefield cap' |
    'Game won',
    details: [],
  }
  ```

  For the `details` of each `log` object, there would live objects or arrays of what is relevant to be displayed about the gameplay action that occurred.

  ---

  ### Player actions
  Let's start explaining some player logic under the hood:

  - **Deploying mana**: the player is able to check the cards in its hands by playing with the `Hands.jsx` drawer component which contains all 7 cards drawn from the start of the game. Whenever the player clicks one mana to inspect it, the `CardPreview.jsx` component pops up, showing dynamically all the details of that mana, including the **Deploy Card** button that, if clicked, will call the `deployOneMana()` function that will update the player's `mana_bar` property with the new deployed mana. Also, the state `oneManaPerTurn` will be toggled to true, preventing the player to deploy more than one mana in that specific turn.

  - **Deploying a creature or spell**: the player is able to deploy a creature or spell just as deploying mana, however the **Deploy Card** button would be unresponsive if the `mana_cost` of the card being previewed is not satisfied. So firstly, the player needs to activate some manas by toggling them from its mana bar which they are nothing but button elements rendered out of the `mana_bar` property from the competitor's object in the `ManaBar.jsx` component. Once the card's `mana_cost` is satisfied, the **Deploy Card** button will respond to its purpose and call the `deployCreatureOrSpell()` function which will update the player's `battlefield` with the creature or spell that was deployed.  
  Also, a really important change that I came up with is the `attackPhaseSickness` property for all player's creatures and spells that are deployed. It works like the `summoningSickness` prop but it's always turned off when the next bot attack phase ends. This is needed because, since the player defends in his turn and the bot passes the turn so the player can defend, all creatures that the player deployed in its previous turn would not be **sick** anymore, therefore they would be able to defend right away. So, `attackPhaseSickness` balances it off and keeps true with the MTG original rules.

  - **Attacking with a creature**: as from the original MTG game, recent deployed creatures have summoning sickness which in the card's object is named as `summoningSickness` and is always true as it is first deployed. As the competitor is reset, the summoning sickness fades away and the card is ready to attack, so the `playerAttacks()` function is called from the `Card.jsx` component and the attacking card gets its `attack` property toggled to true. In the front-end, any card with its `attack` or `defend` properties toggled to true, will be turned to 180deg. Once the player attacks with the card, bot instantly defends with the `botDefends()` function (more on that later).
    > The `botDefends()` function: when fired, if there are creatures available to defend, it will prioritize regular creatures over the legendary ones and will always get the toughest one. Once it determines the defender, the game log gets updated with it, calculations are done to check which card died (if any creature died, they will be sent to the graveyard) and original toughness values are stored for future reset.

  - **Defending against bot attacks**: as the bot passes the turn, the game expands the **Game Log** automatically and is fed with the `botAttackingCards` state, that is nothing more than all bot's attacking cards. So with that material, the **Game Log** can render all the attacking cards from bot and provide the player with two options: **Defend with** and **Take on HP**.  
  If the player chooses the first option, the `DefenseDecisions.jsx` window will pop up with all cards that are able to defend that attack and whenever a defendant is chosen and the **Defend** button is clicked, the `playerDefends()` function is called and the defendant defends against the attacker. The second option will take the damage on the player's HP through a `take_damage_on_hp` dispatch function from the reducer.

  - **Passing the turn**: `PassTurnButton.jsx` is the button element that calls the `passTurn()` function. As from now this function, when fired, will close any distractions enlarged or opened in the current moment, update the game turn and reset the bot for its new turn with the `resetPlayerForNewTurn()` function.
    > The reset function `resetPlayerForNewTurn()`: when fired, will untap all cards for the competitor being reset by toggling its `attack` or `defend` properties to false, will also toggle the `summoningSickness` and the `attackPhaseSickness` (if competitor's player) off cards that were deployed in the competitor's previous turn and update the original toughness from cards that defended or attacked the turn before.

    <br></br>
---

### Creatures' toughness
One unique feature from MTG is that cards don't have hit points, instead they have toughness. If the toughness gets low by one turn, the next time the the turn is passed over to the competitor, the low toughness cards from the previous attack or defense gets reset to its original value.  
This is how I came up with this logic:

Inside `Gameboard.jsx` component I created the `originalToughness` state to keep track of all creatures' original toughnesses if they get involved in a creature clash. The state array is populated with toughness objects:

```js
toughnessObj = {
  deck_name: string, // competitor's deck name
  toughness: string, // creature's toughness
  id: string, // creature's instance id
};
```

Whenever the competitor is reset for a new turn, the `resetPlayerForNewTurn()` function will try to find what are the creatures that survived an attack in the battlefield and, by comparing the `instanceId` prop, update its toughness with the original value.  
Just right after this logic, the code needs to filter out the old toughness values from the previous turn, so `originalToughness` is filtered out based on what competitor is being reset and what `deck_name` the toughness objects contain.




  

  

  
    
    