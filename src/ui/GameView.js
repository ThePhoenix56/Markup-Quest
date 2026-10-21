/**
 * Shows the game on the web page and tells main.js when the player clicks something.
 */
export class GameView {
  // The elements from index.html that this class fills in.
  #storyTitleElement
  #roomTitleElement
  #roomDescriptionElement
  #messageElement
  #choicesContainer
  #inventoryList
  #restartButton

  /**
   * @param {HTMLElement} rootElement - The element that holds the game, <main id="game"> in index.html.
   */
  constructor (rootElement) {
    this.#storyTitleElement = this.#find(rootElement, '#story-title')
    this.#roomTitleElement = this.#find(rootElement, '#room-title')
    this.#roomDescriptionElement = this.#find(rootElement, '#room-description')
    this.#messageElement = this.#find(rootElement, '#message')
    this.#choicesContainer = this.#find(rootElement, '#choices')
    this.#inventoryList = this.#find(rootElement, '#inventory')
    this.#restartButton = this.#find(rootElement, '#restart')
  }

  /**
   * Sets what happens when the player clicks a choice.
   * @param {(eventName: string) => void} handler - Gets the event name of the clicked choice.
   */
  onChoose (handler) {
    this.#choicesContainer.addEventListener('click', clickEvent => {
      const button = clickEvent.target.closest('button[data-event-name]')

      if (button) {
        handler(button.dataset.eventName)
      }
    })
  }

  /**
   * Sets what happens when the player clicks "Start over".
   * @param {() => void} handler
   */
  onRestart (handler) {
    this.#restartButton.addEventListener('click', handler)
  }

  /**
   * Shows the story's title on the page and in the browser tab.
   * @param {string} title
   */
  showStoryTitle (title) {
    this.#storyTitleElement.textContent = title
    document.title = `${title} – Markup Quest`
  }

  /**
   * Shows the current room: its text, its choices and the player's items.
   * @param {object} state
   * @param {import('../story/Room.js').Room} state.room - The room the player is in.
   * @param {{ eventName: string, label: string, isAvailable: boolean }[]} state.choices - The room's choices.
   * @param {import('../story/Item.js').Item[]} state.inventoryItems - Every item the player carries.
   * @param {import('../story/Item.js').Item[]} state.foundItems - Items just picked up in this room.
   * @param {boolean} state.isFinished - True if the story has ended.
   */
  render ({ room, choices, inventoryItems, foundItems, isFinished }) {
    // textContent shows text as plain text, so nothing in a story can run as code.
    this.#roomTitleElement.textContent = room.title
    this.#roomDescriptionElement.textContent = room.description

    this.#showFoundItems(foundItems)
    this.#renderChoices(choices)
    this.#renderInventory(inventoryItems)

    // Only show "Start over" when the story has ended.
    this.#restartButton.hidden = !isFinished
    if (isFinished) {
      this.#appendMessage('The end.')
    }
  }

  /**
   * Tells the player that a choice is locked.
   * @param {string|null} lockedMessage - The story's own message, if it has one.
   * @param {string} requiredItemId - The missing item. Used if the story has no message.
   */
  showLocked (lockedMessage, requiredItemId) {
    this.#setMessage(lockedMessage || `It will not budge. You need: ${requiredItemId}.`, 'locked')
  }

  /**
   * Shows an error instead of the game, for example when the story file is broken.
   * @param {string} text
   */
  showError (text) {
    this.#roomTitleElement.textContent = 'Something went wrong'
    this.#roomDescriptionElement.textContent = ''
    this.#choicesContainer.replaceChildren()
    this.#setMessage(text, 'error')
  }

  /**
   * Tells the player which items they just found, or clears the message if there are none.
   * @param {import('../story/Item.js').Item[]} foundItems
   */
  #showFoundItems (foundItems) {
    if (foundItems.length === 0) {
      this.#setMessage('')
      return
    }

    const labels = foundItems.map(item => item.label).join(', ')
    this.#setMessage(`You picked up: ${labels}.`, 'found')
  }

  /**
   * Creates one button per choice.
   * Locked choices are greyed out but can still be clicked because clicking them is how the player sees the "locked" message.
   * @param {{ eventName: string, label: string, isAvailable: boolean }[]} choices
   */
  #renderChoices (choices) {
    const buttons = choices.map(choice => {
      const button = document.createElement('button')
      button.type = 'button'
      button.textContent = choice.label

      button.dataset.eventName = choice.eventName
      button.classList.toggle('locked', !choice.isAvailable)
      return button
    })

    this.#choicesContainer.replaceChildren(...buttons)
  }

  /**
   * Shows the list of items the player carries.
   * @param {import('../story/Item.js').Item[]} items
   */
  #renderInventory (items) {
    if (items.length === 0) {
      const emptyEntry = document.createElement('li')
      emptyEntry.textContent = 'Nothing yet.'
      emptyEntry.className = 'empty'
      this.#inventoryList.replaceChildren(emptyEntry)
      return
    }

    const entries = items.map(item => {
      const entry = document.createElement('li')
      entry.textContent = item.label
      return entry
    })
    this.#inventoryList.replaceChildren(...entries)
  }

  /**
   * Replaces the message under the room text.
   * @param {string} text
   * @param {string} [kind] - "found", "locked" or "error". Mainly used for the css to color the actual text.
   */
  #setMessage (text, kind = '') {
    this.#messageElement.textContent = text
    this.#messageElement.className = kind
  }

  /**
   * Adds text to the end of the message.
   * @param {string} text
   */
  #appendMessage (text) {
    this.#messageElement.textContent = `${this.#messageElement.textContent} ${text}`.trim()
  }

  /**
   * Finds an element that must be in index.html, and gives a clear error if it is missing.
   * @param {HTMLElement} rootElement
   * @param {string} selector - For example "#choices".
   * @returns {HTMLElement}
   */
  #find (rootElement, selector) {
    const element = rootElement.querySelector(selector)

    if (!element) {
      throw new Error(`index.html is missing the element ${selector}.`)
    }

    return element
  }
}
