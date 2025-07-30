package uk.me.jeremygreen.expoexperiments.fingerprint;

import com.facebook.react.bridge.ReactApplicationContext;

public class NativeFingerprint extends NativeFingerprintSpec {

  public static final String NAME = "Fingerprint";

  public NativeFingerprint(ReactApplicationContext reactContext) {
    super(reactContext);
  }

  @Override
  public String getName() {
    return NAME;
  }

}
