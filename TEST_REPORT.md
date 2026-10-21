# Test Report

## Summary

This project/application was tested using mostly automated tests but also through a series of manual tests.

The automated tests were primarily written using Vitest (Vite's built in test-runner). The tests mainly the app logic and that it reads a valid story file, picking up items, locking/unlocking choices and reaching an ending.

The manual testing covered parts that the automatic tests did not - for example checking the UI, checking all the buttons, and essentially everything that involved the frontend. This test was done by running `npm test` in the terminal and opening the browser manually.

The hardest thing to test was the whole game logic manually. Even though it was handled by the automatic test, manual testing was also done to ensure that the game played smoothly. Going back and forth did indeed work without any further problems in the latest test result, but in the beginning, it did become a bit exhausting to fix.

## Test Results


| Test case | Requirement | Input | Expected outcome | Actual outcome |
| --------- | ----------- | ----- | ---------------- | -------------- |
| Start room is shown on load | R1, R2 | Opened the app | The heading "The Mausoleum Entrance", its description and one button, "push open the gate" | ✅ As expected. |
| Story title is shown | R1 | Opened the app and looked at the top of the page and the browser tab | "THE MAUSOLEUM" above the room, and the tab says "The Mausoleum - Markup Quest" | ✅ As expected |
| Inventory starts empty | R4 | Opened the app and looked at the inventory panel | The inventory shows "Nothing yet" | ✅ As expected |
| Moving to another room | R3 | Clicked "Push open the gate" | The hallway's title and description, with two buttons: "Walk down the hallway" and "Go back to the entrance". | ✅ As expected |
| Going back to a previous room | R3 | In the hallway, clicked "Go back to the entrance" | Back at "The Mausoleum Entrance" | ✅ As expected |
| Locked choice looks locked | R5 | Went to the gate then hallway then chamber and pressed "Explore the tombs" without visiting the chest | "Attempt to open the tomb" is gray with a dashed border and the text "(locked)". "Go back to the chamber" looks normal. | ✅ As expected |
| Clicking a locked choice | R6 | In the tomb without the crowbar, clicked "Attempt to open the tomb" | The message "The stone lid will not move with bare hands. Something to pry it open would help." appears, and the player stays inside of the tomb. | ✅ As expected |
| Picking up an item | R4 | Went back to the chamber and clicked "Search the chests along the wall" | The message "You picked up: A rusty crowbar." appears, and the inventory shows "A rusty crowbar". | ✅ As expected |
| Item isn't picked up twice | R4 | Clicked "Go back to the chamber", then clicking "Search the chests along the wall" again. | No "picked up" message, and the inventory still shows the crowbar only once. | ✅ As expected |
| Choice unlocks once the item is carried | R5 | With the crowbar, go into chamber then press "Explore the tombs" | "Attempt to open the tomb" looks like a normal button (not greyed out) without the "locked" text. | ✅ As expected |
| Reaching the ending | R3, R7 | Clicked "Attempt to open the tomb" with the crowbar | The treasure room is shown, the message says "The end", and a "start over" button appears. | ✅ As expected |
| Starting over | R8 | Clicked "Start over". | Back at the entrance, the inventory shows "Nothing yet." and the "Start over" button is gone. | ✅ As expected |
| Playing with the keyboard only | R3 | Pressed Tab until a choice button was highlighted, then pressed enter | The button gets a visible outline, and pressing "Enter" moves the player like a click would. | ✅ As expected |
| Choice leading to a missing room | R9 | Changed the gate's choice to "target="nowhere"" in the story file and reloaded | No game is shown, instead an error message saying "Something went wrong" and a message naming the room "Nowhere" is shown. | ✅ As expected |
| Missing story file | R9 | Renamed "the-mausoleum.html" and reloaded. | "Something went wrong" and a message saying the story could not be loaded because of a HTTP 404 error. | ✅ As expected |
| Two rooms with the same id | R9 | Changed the hallway's id to id="gate" and reloaded. | "Something went wrong" and a message saying two rooms contain the id "gate". | ✅ As expected |
| Story reading (automatic test) | R1, R2, R9 | Ran "npm test" and looked at test/StoryReader.test.js. | All 24 tests pass and check that a valid story is read correctly. | ✅ As expected (passed automatic test) |
| Game rules (automatic test) | R3, R8 | Ran "npm test" and looked at test/StoryEngine.test.js. | All 12 tests pass and check that moving, locked choices, picking up items, ending work and each new game gets its own new inventory. | ✅ As expected (passed automatic test) |
| Description written over several lines (automatic test) | R2 | The test "joins a description written over several lines into one line". | The description comes out as one line with single spaces. | ✅ As expected (passed automatic test) |
| Works on a computer via the public URL | R10 | Opened the Github Page URL on a phone (https://thephoenix56.github.io/Markup-Quest/). | The game loads and can be played, the text is readable and the page doesn't scroll sideways. | ✅ As expected |

## Known Issues in Third-Party Modules

`onEnter` does not run for the starting state. The state machine starts in the start room without "entering" it. This means that no items were picked up. A workaround I found was to use the `StoryEngine` to pick them up by hand in the constructor. Whilst this might be intended behavior by the original module, this did affect the application's development and therefore will be counted as an issue.

Other than this, no other major issues were found during testing.