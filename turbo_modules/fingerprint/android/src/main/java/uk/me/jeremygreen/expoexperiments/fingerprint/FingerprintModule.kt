package uk.me.jeremygreen.expoexperiments.fingerprint

import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReadableArray
import com.facebook.react.module.annotations.ReactModule

@ReactModule(name = FingerprintModule.NAME)
class FingerprintModule(reactContext: ReactApplicationContext) :
  NativeFingerprintSpec(reactContext) {

  override fun getName(): String {
    return NAME
  }

  override fun fingerprintAuthorities(authorities: ReadableArray?, promise: Promise?) {
    promise?.resolve("not implemented")
  }

  companion object {
    const val NAME = "Fingerprint"
  }
}