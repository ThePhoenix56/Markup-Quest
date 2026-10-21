import { HtmlParser } from 'html_parser'
import { Story } from './Story.js'
import { Room } from './Room.js'
import { Choice } from './Choice.js'
import { Item } from './Item.js'
import { StoryFormatError } from './StoryFormatError.js'

export class StoryReader {
  // The HTML parser that turns the text into elements.
  #parser

  /**
   * @param {HtmlParser} [parser] - The parser to use. By default it uses the built in HTML Parser by Phoenix.
   */
  constructor (parser = new HtmlParser()) {
    this.#parser = parser
  }

  /**
   * Reads a story file and creates a Story from it.
   * The story is checked here, so mistakes show up right away instead of in the middle of the game.
   * @param {string} markup - The text of the story file.
   * @returns {Story}
   * @throws {StoryFormatError} If the story file is written wrong.
   */
  read (markup) {
    const storyElement = this.#findStoryElement(markup)
    const rooms = this.#findChildrenNamed(storyElement, 'room').map(roomElement => this.#readRoom(roomElement))

    const story = new Story({
      title: storyElement.getAttribute('title') || 'Untitled story',
      startRoomId: this.#requireAttribute(storyElement, 'start', 'The <story> tag'),
      rooms
    })

    this.#validate(story)
    return story
  }

  /**
   * Parses the text and finds the <story> tag. There must be exactly one.
   * @param {string} markup
   * @returns {import('html_parser').HtmlElement}
   */
  #findStoryElement (markup) {
    const document = this.#parser.parse(markup)
    const storyElements = document.getElementsByTagName('story')

    if (storyElements.length !== 1) {
      throw new StoryFormatError(`A story must have exactly one <story> tag, but ${storyElements.length} were found.`)
    }

    return storyElements[0]
  }

  /**
   * Creates a Room from a <room> tag.
   * @param {import('html_parser').HtmlElement} roomElement
   * @returns {Room}
   */
  #readRoom (roomElement) {
    const id = this.#requireAttribute(roomElement, 'id', 'A <room> tag')

    // A room has one description at most. If it has none, use an empty text.
    const descriptionElement = this.#findChildrenNamed(roomElement, 'description')[0]

    return new Room({
      id,
      title: roomElement.getAttribute('title'),
      description: descriptionElement ? this.#getTextOf(descriptionElement) : '',
      items: this.#findChildrenNamed(roomElement, 'item').map(itemElement => this.#readItem(itemElement, id)),
      choices: this.#findChildrenNamed(roomElement, 'choice').map(choiceElement => this.#readChoice(choiceElement, id)),

      isEnding: roomElement.getAttribute('ending') === 'true'
    })
  }

  /**
   * Creates an Item from an <item> tag.
   * @param {import('html_parser').HtmlElement} itemElement
   * @param {string} roomId - The room the item is in. Only used in error messages.
   * @returns {Item}
   */
  #readItem (itemElement, roomId) {
    return new Item({
      id: this.#requireAttribute(itemElement, 'name', `An <item> in room "${roomId}"`),
      label: this.#getTextOf(itemElement)
    })
  }

  /**
   * Creates a Choice from a <choice> tag.
   * @param {import('html_parser').HtmlElement} choiceElement
   * @param {string} roomId - The room the choice is in. Only used in error messages.
   * @returns {Choice}
   */
  #readChoice (choiceElement, roomId) {
    const location = `A <choice> in room "${roomId}"`

    return new Choice({
      eventName: this.#requireAttribute(choiceElement, 'event', location),
      target: this.#requireAttribute(choiceElement, 'target', location),
      label: this.#getTextOf(choiceElement),

      requiredItemId: choiceElement.getAttribute('requires'),
      lockedMessage: choiceElement.getAttribute('locked')
    })
  }

  /**
   * Checks the rules that need the whole story,
   * for example that every choice leads to a room that exists.
   * @param {Story} story
   * @throws {StoryFormatError}
   */
  #validate (story) {
    if (story.rooms.length === 0) {
      throw new StoryFormatError('A story must have at least one <room>.')
    }

    this.#checkRoomIdsAreUnique(story)

    if (!story.findRoomById(story.startRoomId)) {
      throw new StoryFormatError(`The story starts in room "${story.startRoomId}", but no room has that id.`)
    }

    const itemIds = new Set(story.rooms.flatMap(room => room.items.map(item => item.id)))

    for (const room of story.rooms) {
      this.#checkChoices(room, story, itemIds)
    }
  }

  /**
   * Checks that no two rooms have the same id.
   * @param {Story} story
   */
  #checkRoomIdsAreUnique (story) {
    const seenIds = new Set()

    for (const room of story.rooms) {
      if (seenIds.has(room.id)) {
        throw new StoryFormatError(`Two rooms have the id "${room.id}". Room ids must be unique.`)
      }
      seenIds.add(room.id)
    }
  }

  /**
   * Checks every choice in a room.
   * @param {Room} room
   * @param {Story} story
   * @param {Set<string>} itemIds - The ids of all items in the story.
   */
  #checkChoices (room, story, itemIds) {
    const seenEventNames = new Set()

    for (const choice of room.choices) {
      // Two choices with the same event name in one room would be impossible to tell apart.
      if (seenEventNames.has(choice.eventName)) {
        throw new StoryFormatError(`Room "${room.id}" has two choices with the event "${choice.eventName}".`)
      }
      seenEventNames.add(choice.eventName)

      if (!story.findRoomById(choice.target)) {
        throw new StoryFormatError(`The choice "${choice.eventName}" in room "${room.id}" leads to room "${choice.target}", which does not exist.`)
      }

      // If the needed item doesn't exist anywhere, the choice could never be unlocked.
      if (choice.requiresItem() && !itemIds.has(choice.requiredItemId)) {
        throw new StoryFormatError(`The choice "${choice.eventName}" in room "${room.id}" requires the item "${choice.requiredItemId}", but no room contains it.`)
      }
    }
  }

  /**
   * Gets an attribute that must be there and must not be empty.
   * @param {import('html_parser').HtmlElement} element
   * @param {string} attributeName - For example "id".
   * @param {string} location - Says which tag it is in the error message, for example "A <room> tag".
   * @returns {string}
   */
  #requireAttribute (element, attributeName, location) {
    const value = element.getAttribute(attributeName)

    if (!value) {
      throw new StoryFormatError(`${location} is missing its "${attributeName}" attribute.`)
    }

    return value
  }

  /**
   * Gets an element's text as one clean line.
   * The parser keeps line breaks inside the text, so we turn all spaces, tabs and line breaks in a row into a single space.
   * @param {import('html_parser').HtmlElement} element
   * @returns {string}
   */
  #getTextOf (element) {
    return element.getTextContent().replace(/\s+/g, ' ').trim()
  }

  /**
   * Finds the children of an element with a certain tag name.
   * Only looks one level down, so a <choice> always belongs to the room it is written in.
   * @param {import('html_parser').HtmlElement} element
   * @param {string} tagName - For example "room".
   * @returns {import('html_parser').HtmlElement[]}
   */
  #findChildrenNamed (element, tagName) {
    return element.children.filter(child => child.tagName === tagName)
  }
}
