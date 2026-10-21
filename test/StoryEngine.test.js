import { describe, it, expect, beforeEach } from 'vitest'
import { NoTransitionError } from 'flowstate-js'
import { StoryReader } from '../src/story/StoryReader.js'
import { StoryEngine } from '../src/engine/StoryEngine.js'

const STORY = new StoryReader().read(`
<story start="hall">
  <room id="hall" title="The Hall">
    <choice event="down" target="cellar">Go down</choice>
    <choice event="unlock" target="vault" requires="key" locked="The door is locked.">Open the door</choice>
  </room>
  <room id="cellar" title="The Cellar">
    <item name="key">A brass key</item>
    <choice event="up" target="hall">Go up</choice>
  </room>
  <room id="vault" title="The Vault" ending="true"></room>
</story>`)

describe('StoryEngine', () => {
  let engine

  // A new engine before every test, so the tests don't affect each other
  beforeEach(() => {
    engine = new StoryEngine(STORY)
  })

  it('starts in the start room', () => {
    expect(engine.getCurrentRoom().id).toBe('hall')
  })

  it('starts with an empty inventory', () => {
    expect(engine.getInventoryItems()).toEqual([])
  })

  it('lists the choices of the current room, with locked ones unavailable', () => {
    expect(engine.getChoices()).toEqual([
      { eventName: 'down', label: 'Go down', isAvailable: true },
      { eventName: 'unlock', label: 'Open the door', isAvailable: false }
    ])
  })

  it('moves the player when an open choice is picked', () => {
    const result = engine.choose('down')

    expect(result).toEqual({ outcome: 'moved' })
    expect(engine.getCurrentRoom().id).toBe('cellar')
  })

  it('keeps the player in place when a locked choice is picked', () => {
    const result = engine.choose('unlock')

    expect(result).toEqual({ outcome: 'locked', lockedMessage: 'The door is locked.', requiredItemId: 'key' })
    expect(engine.getCurrentRoom().id).toBe('hall')
  })

  it('picks up items when entering a room', () => {
    engine.choose('down')

    expect(engine.getInventoryItems().map(item => item.id)).toEqual(['key'])
    expect(engine.getItemsFoundOnArrival().map(item => item.id)).toEqual(['key'])
  })

  it('does not say an item was found again when coming back', () => {
    engine.choose('down')
    engine.choose('up')
    engine.choose('down')

    expect(engine.getItemsFoundOnArrival()).toEqual([])
    expect(engine.getInventoryItems()).toHaveLength(1)
  })

  it('unlocks a choice once the player has the needed item', () => {
    engine.choose('down')
    engine.choose('up')

    expect(engine.getChoices().find(choice => choice.eventName === 'unlock').isAvailable).toBe(true)
    expect(engine.choose('unlock')).toEqual({ outcome: 'moved' })
    expect(engine.getCurrentRoom().id).toBe('vault')
  })

  it('knows when an ending room is reached', () => {
    expect(engine.isFinished()).toBe(false)

    engine.choose('down')
    engine.choose('up')
    engine.choose('unlock')

    expect(engine.isFinished()).toBe(true)
  })

  it('picks up items lying in the start room', () => {
    const storyStartingWithKey = new StoryReader().read(`
      <story start="a">
        <room id="a"><item name="key">A key</item></room>
      </story>`)

    const engineStartingWithKey = new StoryEngine(storyStartingWithKey)

    expect(engineStartingWithKey.getInventoryItems().map(item => item.id)).toEqual(['key'])
  })

  it('throws for an event the current room does not have', () => {
    expect(() => engine.choose('fly')).toThrow(NoTransitionError)
  })

  it('gives every engine its own inventory', () => {
    engine.choose('down')
    const freshEngine = new StoryEngine(STORY)

    expect(freshEngine.getInventoryItems()).toEqual([])
  })
})
