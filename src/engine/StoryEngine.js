import { StateMachine, BlockedTransitionError } from 'flowstate-js'
import { Inventory } from './Inventory.js'

/**
 * Runs the game. It turns the story into a state machine:
 * - each room is a state
 * - each choice is a transition (a way from one room to another)
 * - a choice that needs an item only works if the player has that item
 *
 */
export class StoryEngine {
  // The story being played (all rooms, the start room, etc).
  #story

  // The flowstate state machine. Keeps track of which room the player is in.
  #machine

  // Items the player found when they walked into the current room.
  #itemsFoundOnArrival = []

  /**
   * Sets up the game and puts the player in the start room.
   * @param {import('../story/Story.js').Story} story - The story to play.
   */
  constructor (story) {
    this.#story = story
    this.#machine = new StateMachine(story.startRoomId)

    this.#machine.context.inventory = new Inventory()

    this.#defineStates()
    this.#defineTransitions()
    this.#pickUpItemsIn(this.getCurrentRoom())
  }

  /**
   * Gets the room the player is in.
   * @returns {import('../story/Room.js').Room}
   */
  getCurrentRoom () {
    return this.#story.findRoomById(this.#machine.currentStateName)
  }

  /**
   * Gets the choices in the current room, and whether each one can be picked right now.
   * @returns {{ eventName: string, label: string, isAvailable: boolean }[]}
   */
  getChoices () {
    const room = this.getCurrentRoom()
    return this.#machine.listEventNamesFrom(room.id).map(eventName => ({
      eventName,

      label: room.findChoiceFor(eventName).label,

      isAvailable: this.#machine.canSend(eventName)
    }))
  }

  /**
   * Tries to pick a choice in the current room.
   * @param {string} eventName - The choice's event name.
   * @returns {{ outcome: 'moved' } | { outcome: 'locked', lockedMessage: string|null, requiredItemId: string }}
   *   'moved' if the player went to a new room, 'locked' if they are missing an item.
   */
  choose (eventName) {
    const choice = this.getCurrentRoom().findChoiceFor(eventName)

    try {
      this.#machine.send(eventName)
      return { outcome: 'moved' }
    } catch (error) {
      // A locked door is a normal part of the game, so return "locked" instead of crashing
      if (error instanceof BlockedTransitionError) {
        return { outcome: 'locked', lockedMessage: choice.lockedMessage, requiredItemId: choice.requiredItemId }
      }

      throw error
    }
  }

  /**
   * Gets the items the player just found in this room.
   * @returns {import('../story/Item.js').Item[]}
   */
  getItemsFoundOnArrival () {
    return [...this.#itemsFoundOnArrival]
  }

  /**
   * Gets every item the player is carrying.
   * @returns {import('../story/Item.js').Item[]}
   */
  getInventoryItems () {
    return this.#getInventory().getItems()
  }

  /**
   * Checks if the player has reached an ending.
   * @returns {boolean}
   */
  isFinished () {
    return this.getCurrentRoom().isEnding
  }

  /**
   * Adds one state for each room.
   */
  #defineStates () {
    for (const room of this.#story.rooms) {
      this.#machine.defineState(room.id, {
        onEnter: () => this.#pickUpItemsIn(room)
      })
    }
  }

  /**
   * Adds one transition for each choice.
   */
  #defineTransitions () {
    for (const room of this.#story.rooms) {
      for (const choice of room.choices) {
        this.#machine.defineTransition({
          from: room.id,
          to: choice.target,
          on: choice.eventName,

          guard: choice.requiresItem()
            ? context => context.inventory.has(choice.requiredItemId)
            : undefined
        })
      }
    }
  }

  /**
   * Puts a room's items in the inventory and remembers which ones were new.
   * @param {import('../story/Room.js').Room} room
   */
  #pickUpItemsIn (room) {
    this.#itemsFoundOnArrival = room.items.filter(item => this.#getInventory().add(item))
  }

  /**
   * Gets the inventory from the machine's context.
   * @returns {Inventory}
   */
  #getInventory () {
    return this.#machine.context.inventory
  }
}
