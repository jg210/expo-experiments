[![build status](https://github.com/jg210/expo-experiments/actions/workflows/checks.yml/badge.svg)](https://github.com/jg210/expo-experiments/actions/workflows/checks.yml)

A [react native](https://reactnative.dev/)/[Expo](https://expo.dev/) app for testing out new technologies.

* It shows data from the [spring-experiments](https://github.com/jg210/spring-experiments) API.
* It has an [Expo module](https://docs.expo.dev/modules/overview/) (only tested and fully implemented on android).

For testing:

* Builds and tests are run with [GitHub Actions](https://github.com/jg210/expo-experiments/actions).
* On demand builds are configured with [Expo EAS Build](https://docs.expo.dev/build/introduction/). The free tier quota and long queue times mean need to rely on GitHub actions, not EAS.
* JavaScript unit tests use [React Native Testing Library](https://github.com/callstack/react-native-testing-library) and [Mock Service Worker](https://mswjs.io/).
* Native android tests test the android expo module.
* End-to-end tests use [Maestro](https://www.maestro.dev/).
* ...and are run for android on GitHub Actions using [emulators](https://github.com/marketplace/actions/android-emulator-runner).

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

## maestro end-to-end tests

https://docs.maestro.dev/

To run locally for android:

```
. environment
npm i
expo prebuild
npm run android-release-apk
npm run android-release-apk-install
npm run maestro
```

Guidance on assigning testIDs: https://wix.github.io/Detox/docs/guide/test-id/
