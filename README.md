# Simple Grocery List

Simple cross-platform grocery list app, built with React Native (Expo) + TypeScript.

Syncing of grocery list data works via the Dropbox API.

## Running the App

Clone the repo and run `npm install`
Then run `npx expo start`
Note: if 'web' mode doesn't run by default, you can add a flag to allow it: `npx expo start --localhost`

This app uses Expo; to use this app on your phone, download the Expo Go app. For more information, check out the [React Native Quickstart Guide](https://reactnative.dev/docs/environment-setup?guide=quickstart).

## Syncing with Dropbox

In order to get syncing working correctly, you'll need a Dropbox account.

## TODO

Development of this app has just started; functional features are coming soon.

- Syncing grocery list to/from Dropbox
- Register redirect uri scheme with Android
- Configure store aisles
- Add grocery item to an aisle
- Allow grocery item to be deleted from list
- Allow grocery item to be checked off list (moved to 'Checkout')
- Allow user to clear list
- Allow user to reorder items
- Allow user to reorder aisles
- Welcome modal
- Add multiple stores, each with their own aisle configuration
- Allow user to mark certain items as 'Favorites'
- Allow user to add items from 'Favorites' List
- Themes
- Unit tests
