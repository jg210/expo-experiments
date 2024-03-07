[![build status](https://github.com/jg210/expo-experiments/actions/workflows/checks.yml/badge.svg)](https://github.com/jg210/expo-experiments/actions/workflows/checks.yml)

A [react native](https://reactnative.dev/)/[Expo](https://expo.dev/) app for testing out new technologies. It shows data from the [spring-experiments](https://github.com/jg210/spring-experiments) API.

## Development Build Instructions

Install nodenv and node-build (or use any other way to put correct version of node on PATH):

* https://github.com/nodenv/nodenv#installation
* https://github.com/nodenv/node-build#installation

To run the app (on android), (setting environment variable to avoid problem from expo not using the adb reverse tunnel it sets up):

```
. environment
REACT_NATIVE_PACKAGER_HOSTNAME=localhost npm run android --localhost
```
