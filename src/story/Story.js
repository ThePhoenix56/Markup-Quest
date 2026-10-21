/**
 * A whole story: its title, the room it starts in, and all of its rooms.
 * StoryReader creates it from the story file, and StoryEngine plays it.
 */
export class Story {
  // Stores the rooms by their id, so a room can be found quickly.
  #roomsById

  /**
   * @param {object} options
   * @param {string} options.title - The story's title.
   * @param {string} options.startRoomId - The id of the room the player starts in.
   * @param {import('./Room.js').Room[]} options.rooms - All rooms, in the order they are written.
   */
  constructor ({ title, startRoomId, rooms }) {
    this.title = title
    this.startRoomId = startRoomId
    this.rooms = Object.freeze([...rooms])

    this.#roomsById = new Map(rooms.map(room => [room.id, room]))

    // Make the story read-only, so it can't be changed later.
    Object.freeze(this)
  }

  /**
   * Finds a room by its id.
   * @param {string} id - For example "tomb".
   * @returns {import('./Room.js').Room|undefined} The room, or undefined if there is none.
   */
  findRoomById (id) {
    return this.#roomsById.get(id)
  }
}
