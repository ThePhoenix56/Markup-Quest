/**
 * An item the player can pick up, for example a crowbar.
 * In the story file it looks like: <item name="crowbar">A rusty crowbar</item>
 */
export class Item {
  /**
   * @param {object} options
   * @param {string} options.id - The item's id, for example "crowbar". Choices use it in requires="...".
   * @param {string} options.label - The text the player sees, for example "A rusty crowbar".
   */
  constructor ({ id, label }) {
    this.id = id

    // If there is no text, show the id instead.
    this.label = label || id

    // Make the item read-only, so it can't be changed later.
    Object.freeze(this)
  }
}
