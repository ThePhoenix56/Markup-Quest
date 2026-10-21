# Markup Quest - the interactive story engine application that brings HTML stories to life!
---
Markup Quest is a browser-based game written in JavaScript for the 1DV610 Laboration 3 assignment @ LNU. It utilizes two JS modules - my own and another student's module.

The game is primarily based on uploading an HTML story and being able to play it. Collect items, explore unknown rooms, and finish a story.

## Requirements
---
**R1**: The app needs to load a story written in HTML markup and show the start room.
**R2**: Each room shows its title, description and one button per choice.
**R3**: Clicking a choice moves the player to the room it leads to.
**R4**: Items in a room are picked up automatically when entering and shown in the inventory.
**R5**: A choice that needs an item is greyed out until the player has it.
**R6**: Clicking a locked choice shows a message and the player stays put.
**R7**: Reaching an ending room shows "The end" and a "Start over" button.
**R8**: "Start over" resets the room and empties the inventory.
**R9**: A broken story file shows a clear error message instead of a broken game.
**R10**: The app is reachable via a public URL.
---
## Installation and usage
### Prerequisites
* npm
* Git
* Node.js 22+

### Installation
1. Clone the repository:
```
git clone git@github.com:ThePhoenix56/Markup-Quest.git
```
2. Enter the directory: 
```
cd Markup-Quest
```
3. Install required dependencies:
```
npm i
```
This project utilizes two JS Modules - [flowstate-js](https://github.com/Abbas288/flowstate-js) and [HTML Parser](https://github.com/ThePhoenix56/Markup-Quest) which are both found on GitHub.
### Starting the game
Run this command to start the game in a local browser:
```
npm start
```
---
## How to play
The user-friendly UI allows you to simply click around with the buttons provided. Please make sure that the HTML provided contains the necessary HTML tags such as choice, room and description if you'd like to make your own story. 

For inspiration/example, see `the-mausoleum` under public/stories.

---
## Customization
To upload your own story or otherwise change the currently existing story, navigate to the public/stories folder and either remove the default story (`the-mausoleum`) and upload your own or edit the file directly.
---
## Testing
To run all the automated tests, you can run the automatic test command:
```
npm test
```
This project uses NodeJS's built in test runner.

Test report is available in `TEST_REPORT.md`