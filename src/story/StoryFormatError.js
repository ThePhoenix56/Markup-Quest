/**
 * The error thrown when a story file is written wrong,
 * for example when a choice leads to a room that doesn't exist.
 */
export class StoryFormatError extends Error {
  /**
   * @param {string} message - What is wrong with the story.
   */
  constructor (message) {
    super(message)

    // Makes the error show up as "StoryFormatError" instead of just "Error"
    this.name = 'StoryFormatError'
  }
}
