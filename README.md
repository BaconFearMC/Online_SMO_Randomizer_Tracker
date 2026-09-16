# Online_SMO_Randomizer_Tracker

This is a fork of the online version of the SMO Randomizer Tracker. Works on desktop ~~and mobile~~. Saves progress locally in each user's browser.

All supplemental features for including but not limited to connecting the Tracker to the game itself is NOT in this version. 
This version is specifically procured for easy and quick use of the Notes Tab. All other tabs still exist if you need them, but are unchanged and will NOT be updated.

## Features

| Feature            | Notes                                                            |
| ------------------ | ---------------------------------------------------------------- |
| Clear              | Resets all progress, keeps settings                              |

## How State Saves Work

Each visitor's progress is saved privately in their own browser's `localStorage` under the key `tracker_state`. Connecting to a sync room does not replace local storage; it merges remote state into the local copy.
