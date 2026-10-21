# Test Report

## Summary

This project/application was tested using mostly automated tests but also through a series of manual tests.

The automated tests were primarily written using Vitest (Vite's built in test-runner). The tests mainly the app logic and that it reads a valid story file, picking up items, locking/unlocking choices and reaching an ending.

The manual testing covered parts that the automatic tests did not - for example checking the UI, checking all the buttons, and essentially everything that involved the frontend. This test was done by running `npm test` in the terminal and opening the browser manually.

The hardest thing to test was the whole game logic manually. Even though it was handled by the automatic test, manual testing was also done to ensure that the game played smoothly. Going back and forth did indeed work without any further problems in the latest test result, but in the beginning, it did become a bit exhausting to fix.

## Test Results

| Test case                            | Requirement | Input                                                     | Expected outcome                                                   | Actual outcome                                                               |
| ------------------------------------ | ----------- | --------------------------------------------------------- | ------------------------------------------------------------------ | ---------------------------------------------------------------------------- |
| Show temperature chart for a city    | R1          | Selected "Växjö" in the city list and clicked "Show".     | A bar chart of the last seven days' temperatures for Växjö.         | ✅ As expected.                                                              |
| Unknown city name                    | R3          | Typed "Atlantis" in the search field and pressed Enter.   | A clear message that the city wasn't found; no chart is drawn.      | ❌ An empty chart was drawn – fixed, the message is now shown instead.       |

**Your test results:**

| Test case | Requirement | Input | Expected outcome | Actual outcome |
| --------- | ----------- | ----- | ---------------- | -------------- |
|           |             |       |                  |                |
|           |             |       |                  |                |
|           |             |       |                  |                |
|           |             |       |                  |                |
|           |             |       |                  |                |

## Known Issues in Third-Party Modules

`onEnter` does not run for the starting state. The state machine starts in the start room without "entering" it. This means that no items were picked up. A workaround I found was to use the `StoryEngine` to pick them up by hand in the constructor. Whilst this might be intended behavior by the original module, this did affect the application's development and therefore will be counted as an issue.

Other than this, no other major issues were found during testing.