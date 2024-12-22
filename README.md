# Forge  Confluence Macro Memory

Memory Game is a fun and engaging macro for Confluence that allows users to take a quick break from their work to refresh their minds by playing a classic memory card game. With configurable themes, a leaderboard, and motivational messages, the game offers a short yet effective mental exercise to improve focus and memory

---

### 🌟 Game Features
- **Classic Memory Gameplay**: Flip cards to find matching pairs.
- **Timer and Move Counter**: Tracks your time and number of moves to complete the game.
- **Dynamic Backgrounds**: Themed backgrounds that change based on the selected topic.
- **Leaderboard**: Top 10 players are ranked based on time and moves.
- **Motivational Messages**: Random motivational messages at the end of each game to encourage focus.
- **Integrated Confluence Macro**: Easily accessible in the **Media** and **Visuals & Images** sections of the Confluence Macro Browser.


### 🛠 Configuration Options
- **Themes**: Choose from three image themes:
   - Flowers
   - Animals
   - Landscapes
- **Leaderboard**: View the top 10 players and challenge yourself to beat their scores.

### 🎯 User Interaction
- **Add to Leaderboard**: Players can add their name to the leaderboard if they qualify for the top 10.
- **Randomized Cards**: Cards are shuffled dynamically for a unique game experience every time.

---

## Quick Setup

### Prerequisites
1. **Atlassian Forge CLI** installed.
2. **Node.js** version 14+ installed.
3. Confluence account with permissions to install Forge apps.

### Steps to Set Up
1. Clone the Repository
2. Install Dependencies in static/hello-world: `npm install`
3. Build static app (custom App): `npm run build`
4. Place the images into the build folder of the static app, organized by themes.
5. Register the app with Forge to generate a unique App ID. Run this in the root directory of the project: `forge register`
6. Deploy the Forge App Deploy the app to Forge: `forge deploy`
7. Install App on your Confluence: `forge install` 
8. Add the Memory Game to a Confluence Page
- Go to a Confluence page where you want to add the game.
- Insert the Memory Game Macro from the macro browser.
- Configure the game theme in the macro settings.

Optional: If you do not want to have the development version, deploy and install as production app
```
forge deploy -e production
forge install -e production
```

## How to play

1. Click on the "Start Game" button to begin.
2. Flip two cards to find a matching pair.
3. Continue flipping cards until all pairs are matched.
4. After completing the game:
5. If you qualify for the top 10, enter your name to save your score.
6. If not, try again to improve your performance!
7. View the leaderboard to see how you rank against others.

Enjoy your game and keep your mind sharp! 
