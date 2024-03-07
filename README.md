Expo is setting up an adb reverse tunnel, but doesn't use it unless tell it to with this env. var.:

```
. environment
REACT_NATIVE_PACKAGER_HOSTNAME=localhost npm run android --localhost
```