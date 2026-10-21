import { StoryReader } from './story/StoryReader.js'
import { StoryEngine } from './engine/StoryEngine.js'
import { GameView } from './ui/GameView.js'

const STORY_URL = `${import.meta.env.BASE_URL}stories/the-mausoleum.html`

const view = new GameView(document.querySelector('#game'))

try {
  const story = new StoryReader().read(await downloadText(STORY_URL))
  startGame(story)
} catch (error) {
  // Happens if the download fails or the story file is written wrong.
  console.error(error)
  view.showError(error.message)
}

/**
 * Connects the engine and the view, and shows the first room.
 * @param {import('./story/Story.js').Story} story
 */
function startGame (story) {
  // Use let datatype instead of const, because "Start over" replaces the engine with a new one.
  let engine = new StoryEngine(story)

  view.showStoryTitle(story.title)

  view.onChoose(eventName => {
    const result = engine.choose(eventName)

    if (result.outcome === 'moved') {
      showCurrentRoom(engine)
    } else {
      // The player stays in the same room, so we only show the "locked" message.
      view.showLocked(result.lockedMessage, result.requiredItemId)
    }
  })

  view.onRestart(() => {
    // A new engine means the player starts over with an empty inventory.
    engine = new StoryEngine(story)
    showCurrentRoom(engine)
  })

  showCurrentRoom(engine)
}

/**
 * Gets everything about the current room from the engine and shows it.
 * @param {StoryEngine} engine
 */
function showCurrentRoom (engine) {
  view.render({
    room: engine.getCurrentRoom(),
    choices: engine.getChoices(),
    inventoryItems: engine.getInventoryItems(),
    foundItems: engine.getItemsFoundOnArrival(),
    isFinished: engine.isFinished()
  })
}

/**
 * Downloads a file as text.
 * @param {string} url
 * @returns {Promise<string>}
 * @throws {Error} If the file can't be downloaded, for example if it doesn't exist (404).
 */
async function downloadText (url) {
  const response = await fetch(url)

  // Check if download failed because fetch doesn't fail by itself on a 404
  if (!response.ok) {
    throw new Error(`Could not load the story from ${url} (HTTP ${response.status}).`)
  }

  return response.text()
}
