/**
 * A room in the story, for example the tomb.
 * In the story file it looks like: <room id="tomb" title="The Tomb">...</room>
 * In the state machine, each room is one state.
 */
export class Room {
  /**
   * @param {object} options
   * @param {string} options.id - The room's id, for example "tomb".
   * @param {string} options.title - The title the player sees.
   * @param {string} options.description - The text that describes the room.
   * @param {import('./Item.js').Item[]} [options.items] - The items in the room.
   * @param {import('./Choice.js').Choice[]} [options.choices] - The choices the player can pick here.
   * @param {boolean} [options.isEnding] - True if the story ends in this room.
   */
  constructor ({ id, title, description, items = [], choices = [], isEnding = false }) {
    this.id = id
    this.title = title || id
    this.description = description

    // Copies the lists and makes them read-only, so they can't be changed from outside.
    this.items = Object.freeze([...items])
    this.choices = Object.freeze([...choices])
    this.isEnding = isEnding

    // Make the room read-only, so it can't be changed later.
    Object.freeze(this)
  }

  /**
   * Finds the choice with a certain event name.
   * @param {string} eventName - For example "open".
   * @returns {import('./Choice.js').Choice|undefined} The choice, or undefined if there is none.
   */
  findChoiceFor (eventName) {
    return this.choices.find(choice => choice.eventName === eventName)
  }
}
