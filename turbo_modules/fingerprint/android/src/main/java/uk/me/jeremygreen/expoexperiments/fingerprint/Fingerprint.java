package uk.me.jeremygreen.expoexperiments.fingerprint;

public class Fingerprint extends FingerprintSpec {

  public static final String NAME = "Fingerprint";

  public Fingerprint(ReactApplicationContext reactContext) {
    super(reactContext);
  }

  @Override
  public String getName() {
    return NAME;
  }

}
