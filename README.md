# Markup Quest

*The interactive story engine application that brings HTML stories to life!*

Markup Quest is a browser-based game written in JavaScript for the 1DV610 Laboration 3 assignment @ LNU. It utilizes two JS modules - my own and another student's module.

The game is primarily based on adding an HTML story and being able to play it. Collect items, explore unknown rooms, and finish a story.

## Requirements

- **R1**: The app needs to load a story written in HTML markup and show the start room.
- **R2**: Each room shows its title, description and one button per choice.
- **R3**: Clicking a choice moves the player to the room it leads to.
- **R4**: Items in a room are picked up automatically when entering and shown in the inventory.
- **R5**: A choice that needs an item is greyed out until the player has it.
- **R6**: Clicking a locked choice shows a message and the player stays put.
- **R7**: Reaching an ending room shows "The end" and a "Start over" button.
- **R8**: "Start over" resets the room and empties the inventory.
- **R9**: A broken story file shows a clear error message instead of a broken game.
- **R10**: The app is reachable via a public URL.

---

## Installation and usage

### Prerequisites

- [Node.js](https://nodejs.org/) 22 or later (npm comes with it)
- [Git](https://git-scm.com/)

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/ThePhoenix56/Markup-Quest.git
   ```

2. Enter the directory:

   ```bash
   cd Markup-Quest
   ```

3. Install the required dependencies:

   ```bash
   npm install
   ```

This project utilizes two JS modules, [flowstate-js](https://github.com/Abbas288/flowstate-js) and [HTML Parser](https://github.com/ThePhoenix56/HTML_Parser), which are both installed directly from GitHub.

### Starting the game

Run this command to start the game in a local browser:

```bash
npm start
```

Open the URL printed in the terminal.

---

## How to play

The user-friendly UI allows you to simply click around with the buttons provided. Please make sure that the HTML provided contains the necessary HTML tags such as `story`, `room`, `description` and `choice` if you'd like to make your own story.

For inspiration/example, see `the-mausoleum.html` under `public/stories`.

---

## Customization

To add your own story or otherwise change the currently existing story, navigate to the `public/stories` folder and either edit `the-mausoleum.html` directly, or add your own story file.

If you add a new file, change `STORY_URL` in `src/main.js` to its file name, since that is the story the game loads.

---

## Testing

To run all the automated tests, run:

```bash
npm test
```

This project uses [Vitest](https://vitest.dev/) as its test runner.

The test report is available in [TEST_REPORT.md](TEST_REPORT.md).
