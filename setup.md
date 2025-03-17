I want to create a deck building game similar to dominion or slay the spire. Here are the basic rules/setup:

- There is the player and an enemy.
- The player has the following attributes
  - Actions: How many actions the player can take this turn. Starts at 1.
  - Buy: How many cards the player can buy this turn. Starts at 1.
  - Health: How much health the player has. This starts at 20 and carries over between turns.
  - Gold: How much gold is available to buy. Player starts at 0 each turn.
  - Card draw: How many cards will be drawn at the start of the turn. Starts at 5. This attribute stays constant.
- The enemy has the following attributes
  - Health: How much health the enemy has. This starts at 20 and carries over between turns.
  - Damage per turn: How much damage the enemy does to the player at the end of the turn. Starts at 1 and increases by 1 each round.
- The player has a deck of 10 cards. Each turn they draw according to the card draw attribute at the start of a round.
- Each card will have a set of which modify players or enemy attributes.
- Here are the 10 cards the player starts with
  - 7x Copper:
    - +1 gold to player
    - -0 action for player
  - 3x Punch:
    - -1 action for player
    - -1 health for enemy
- Here are the cards the player can buy
  - 10x Stab - Cost 3 gold
    - -1 action for player
    - -2 health for enemy
  - 10x Diamond - Cost 5 gold
    - +3 gold to player
    - -0 action for player
  - 10x Quick Hands - Cost 7 gold
    - +1 action for player
    - Draw 2 cards for player
  - 10x Med-kit - Cost 6 gold
    - -1 action for player
    - +3 health for player
- Each turn player:
  - Draws cards up to Card draw attribute
  - Use cards as long as you can pay the action cost
  - Buy cards, as long as you can pay the gold cost. Bought cards go into discard pile.
  - Discards any used and remaining cards
- Standard deck drawing rules apply, like you draw from the draw deck. When the draw deck is empty, the discard deck is shuffled.
- The enemy and player attributes should be displayed
- The round count should be displayed.
- The list of cards in hand should be shown.
- The player can click on a card to play it (ignored if they don't meet requirements).
- The player can click on the buyable card to buy it.
- The player can hit an end turn button.

Help build this game using react and typescript to set up the application.
This application will be deployed onto github pages.
Please keep the core logic of the game setup separate from the UI.
We will iterate further on this app after this initial prototype