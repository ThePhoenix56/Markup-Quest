import { describe, it, expect } from 'vitest'
import { StoryReader } from '../src/story/StoryReader.js'
import { StoryFormatError } from '../src/story/StoryFormatError.js'

const VALID_STORY_MARKUP = `
<story title="Test Story" start="cellar">
  <room id="cellar" title="The Cellar">
    <description>A damp cellar.</description>
    <item name="key">A brass key</item>
    <choice event="climb" target="hall">Climb the ladder</choice>
  </room>
  <room id="hall" title="The Hall">
    <description>A long hall.</description>
    <choice event="descend" target="cellar">Go back down</choice>
    <choice event="unlock" target="vault" requires="key" locked="The door is locked.">Open the door</choice>
  </room>
  <room id="vault" title="The Vault" ending="true">
    <description>Gold everywhere.</description>
  </room>
</story>`

/**
 * Puts rooms inside a <story> tag, so each test only has to write the part it cares about.
 * @param {string} roomsMarkup - The rooms.
 * @param {string} [startRoomId] - The room to start in.
 * @returns {string}
 */
function buildStoryMarkup (roomsMarkup, startRoomId = 'a') {
  return `<story start="${startRoomId}">${roomsMarkup}</story>`
}

describe('StoryReader', () => {
  const reader = new StoryReader()

  describe('reading a valid story', () => {
    const story = reader.read(VALID_STORY_MARKUP)

    it('reads the title and start room', () => {
      expect(story.title).toBe('Test Story')
      expect(story.startRoomId).toBe('cellar')
    })

    it('reads every room in order', () => {
      expect(story.rooms.map(room => room.id)).toEqual(['cellar', 'hall', 'vault'])
    })

    it('reads a room title and description', () => {
      const cellar = story.findRoomById('cellar')
      expect(cellar.title).toBe('The Cellar')
      expect(cellar.description).toBe('A damp cellar.')
    })

    it('reads items with id and label', () => {
      const [key] = story.findRoomById('cellar').items
      expect(key.id).toBe('key')
      expect(key.label).toBe('A brass key')
    })

    it('reads an open choice', () => {
      const climb = story.findRoomById('cellar').findChoiceFor('climb')
      expect(climb.target).toBe('hall')
      expect(climb.label).toBe('Climb the ladder')
      expect(climb.requiresItem()).toBe(false)
    })

    it('reads a locked choice with its needed item and message', () => {
      const unlock = story.findRoomById('hall').findChoiceFor('unlock')
      expect(unlock.requiredItemId).toBe('key')
      expect(unlock.lockedMessage).toBe('The door is locked.')
      expect(unlock.requiresItem()).toBe(true)
    })

    it('marks ending rooms', () => {
      expect(story.findRoomById('vault').isEnding).toBe(true)
      expect(story.findRoomById('cellar').isEnding).toBe(false)
    })

    it('joins a description written over several lines into one line', () => {
      const multiLineStory = reader.read(buildStoryMarkup(`<room id="a"><description>
        First line.
        Second line.
      </description></room>`))
      expect(multiLineStory.findRoomById('a').description).toBe('First line. Second line.')
    })

    it('uses the id as the title when a room has no title', () => {
      const untitledStory = reader.read(buildStoryMarkup('<room id="a"></room>'))
      expect(untitledStory.findRoomById('a').title).toBe('a')
    })
  })

  describe('rejecting broken stories', () => {
    it.each([
      ['empty input', ''],
      ['no <story> tag', '<room id="a"></room>'],
      ['two <story> tags', `${buildStoryMarkup('<room id="a"></room>')}${buildStoryMarkup('<room id="a"></room>')}`],
      ['no start attribute', '<story><room id="a"></room></story>'],
      ['no rooms', buildStoryMarkup('')],
      ['a room without an id', buildStoryMarkup('<room></room>')],
      ['two rooms with the same id', buildStoryMarkup('<room id="a"></room><room id="a"></room>')],
      ['a start room that does not exist', buildStoryMarkup('<room id="a"></room>', 'nowhere')],
      ['a choice without an event', buildStoryMarkup('<room id="a"><choice target="a">Go</choice></room>')],
      ['a choice without a target', buildStoryMarkup('<room id="a"><choice event="go">Go</choice></room>')],
      ['a choice leading to a missing room', buildStoryMarkup('<room id="a"><choice event="go" target="nowhere">Go</choice></room>')],
      ['two choices with the same event in one room', buildStoryMarkup(`<room id="a">
        <choice event="go" target="a">One</choice>
        <choice event="go" target="a">Two</choice>
      </room>`)],
      ['a needed item that no room has', buildStoryMarkup('<room id="a"><choice event="go" target="a" requires="ghost">Go</choice></room>')],
      ['an item without a name', buildStoryMarkup('<room id="a"><item>Something</item></room>')]
    ])('rejects %s', (_problem, markup) => {
      expect(() => reader.read(markup)).toThrow(StoryFormatError)
    })

    it('names the missing room in the error message', () => {
      const markup = buildStoryMarkup('<room id="a"><choice event="go" target="nowhere">Go</choice></room>')
      expect(() => reader.read(markup)).toThrow(/"nowhere"/)
    })
  })
})
