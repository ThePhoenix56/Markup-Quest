/**
 * One choice the player can pick in a room, for example "Open the tomb".
 * In the story file it looks like:
 * <choice event="open" target="treasure" requires="crowbar" locked="...">Open the tomb</choice>
 */
export class Choice {
  /**
   * @param {object} options
   * @param {string} options.eventName - The choice's name, for example "open".
   * @param {string} options.target - The id of the room it leads to.
   * @param {string} options.label - The text on the button.
   * @param {string|null} [options.requiredItemId] - The id of the item needed, or null if none is needed.
   * @param {string|null} [options.lockedMessage] - The text shown if the player is missing the item.
   */
  constructor ({ eventName, target, label, requiredItemId = null, lockedMessage = null }) {
    this.eventName = eventName
    this.target = target

    // If there is no button text, use the event name instead.
    this.label = label || eventName
    this.requiredItemId = requiredItemId
    this.lockedMessage = lockedMessage

    // Makes the choice read-only, so it can't be changed later.
    Object.freeze(this)
  }

  /**
   * Checks if this choice needs an item.
   * @returns {boolean}
   */
  requiresItem () {
    return this.requiredItemId !== null
  }
}
