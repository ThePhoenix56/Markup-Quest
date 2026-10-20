/**
 * Keeps track of the items the player is carrying.
 */
export class Inventory {
  // Stores the items by their id, for example "crowbar". Items stay in the order they were found.
  #itemsById = new Map()

  /**
   * Adds an item, unless the player already has it.
   * @param {import('../story/Item.js').Item} item
   * @returns {boolean} True if the item was new, false if the player already had it.
   */
  add (item) {
    if (this.has(item.id)) {
      return false
    }

    this.#itemsById.set(item.id, item)
    return true
  }

  /**
   * Checks if the player has an item.
   * @param {string} itemId - For example "crowbar".
   * @returns {boolean}
   */
  has (itemId) {
    return this.#itemsById.has(itemId)
  }

  /**
   * Gets all items the player is carrying.
   * @returns {import('../story/Item.js').Item[]} A copy of the list.
   */
  getItems () {
    return [...this.#itemsById.values()]
  }
}
