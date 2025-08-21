[![build status](https://github.com/jg210/expo-experiments/actions/workflows/checks.yml/badge.svg)](https://github.com/jg210/expo-experiments/actions/workflows/checks.yml)

A [react native](https://reactnative.dev/)/[Expo](https://expo.dev/) app for testing out new technologies.

* Shows data from the [spring-experiments](https://github.com/jg210/spring-experiments) API.
* Has a Kotlin/Swift [Expo module](https://docs.expo.dev/modules/overview/) [here](modules/expo-experiments).
* Uses [TanStack Query](https://tanstack.com/query/latest) (AKA React Query) for network requests.
* Uses [Sentry][https://sentry.io] for crash reporting.

For testing:

* Builds and tests are run with [GitHub Actions](https://github.com/jg210/expo-experiments/actions).
* On demand builds are configured with [Expo EAS Build](https://docs.expo.dev/build/introduction/). The free tier quota and long queue times mean need to rely on GitHub actions, not EAS.
* JavaScript unit tests use [React Native Testing Library](https://github.com/callstack/react-native-testing-library) and [Mock Service Worker](https://mswjs.io/).
* Native android tests test the android expo module.
* End-to-end tests use [Maestro](https://www.maestro.dev/).
* ...run on android [emulators](https://github.com/marketplace/actions/android-emulator-runner).
* ...run on iOS simulators on GitHub Actions macOS runners.
* shell scripts are checked using [shellcheck](https://www.shellcheck.net/)

## Notes on adding Turbo Native Module

* Initially, just for android.
* https://reactnative.dev/docs/turbo-native-modules-introduction.
* The docs talk about adding specs file to the top-level of the app, which would work for a non-expo RN app, since can easily add code to the app. For an expo app with CNG, can't easily add the native code to the app. Instead, I tried putting the native code into an android library project, adding a dependency on this library using Expo's [patch-project](https://github.com/expo/expo/tree/main/packages/patch-project#readme) plugin to automatically apply checked-in patches after running `expo prebuild`. This was the wrong approach, since the auto-generated code isn't visible to the library.
* The correct approach is to put all the specs and native code into a separate node module. https://reactnative.dev/docs/the-new-architecture/using-codegen#android suggests this indirectly, by explaining that codegen output goes into a node_modules/ sub-directory.

## Development Build Instructions

Install nodenv and node-build (or use any other way to put correct version of node on PATH):

* https://github.com/nodenv/nodenv#installation
* https://github.com/nodenv/node-build#installation

Create a `.env.local` containing:

```
SENTRY_AUTH_TOKEN=<real token downloaded from sentry.io>
SENTRY_DSN=<sentry DSN>
```

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
install_maestro
expo prebuild
npm run android-release-apk
npm run android-release-apk-install
npm run maestro
```

Guidance on assigning testIDs: https://wix.github.io/Detox/docs/guide/test-id/

## Github Actions

* Configure SENTRY_AUTH_TOKEN and SENTRY DSN as repository secrets.