[![build status](https://github.com/jg210/expo-experiments/actions/workflows/checks.yml/badge.svg)](https://github.com/jg210/expo-experiments/actions/workflows/checks.yml)

Expo is setting up an adb reverse tunnel, but doesn't use it unless tell it to with this env. var.:

```
. environment
REACT_NATIVE_PACKAGER_HOSTNAME=localhost npm run android --localhost
```