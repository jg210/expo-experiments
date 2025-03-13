[![build status](https://github.com/jg210/expo-experiments/actions/workflows/checks.yml/badge.svg)](https://github.com/jg210/expo-experiments/actions/workflows/checks.yml)

A [react native](https://reactnative.dev/)/[Expo](https://expo.dev/) app for testing out new technologies.

* It shows data from the [spring-experiments](https://github.com/jg210/spring-experiments) API.
* It has an [Expo module](https://docs.expo.dev/modules/overview/) (only tested and fully implemented on android).

For testing:

* Builds and tests are run with [GitHub Actions](https://github.com/jg210/expo-experiments/actions).
* On demand builds are configured with [Expo EAS Build](https://docs.expo.dev/build/introduction/). The free tier quota and long queue times mean need to rely on GitHub actions, not EAS.
* End-to-end tests use [Maestro](https://www.maestro.dev/).

It's using [React Native Testing Library](https://github.com/callstack/react-native-testing-library) and [Mock Service Worker](https://mswjs.io/).

## Development Build Instructions

Install nodenv and node-build (or use any other way to put correct version of node on PATH):

* https://github.com/nodenv/nodenv#installation
* https://github.com/nodenv/node-build#installation

To run the app on android:

```
. environment
npm i
expo prebuild
npm run android
```
