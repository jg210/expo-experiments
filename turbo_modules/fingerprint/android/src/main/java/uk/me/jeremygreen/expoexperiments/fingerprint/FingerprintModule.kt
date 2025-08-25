package uk.me.jeremygreen.expoexperiments.fingerprint

import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReadableArray
import com.facebook.react.module.annotations.ReactModule
import java.security.MessageDigest

@ReactModule(name = FingerprintModule.NAME)
class FingerprintModule(reactContext: ReactApplicationContext) :
  NativeFingerprintSpec(reactContext) {

  override fun getName(): String {
    return NAME
  }

  override fun fingerprintAuthorities(authorities: ReadableArray?, promise: Promise?) {
    val fingerprint = fingerprintAuthorities(authorities?.toArrayList() as List<String>);
    promise?.resolve(fingerprint);
  }

  companion object {
    const val NAME = "Fingerprint"

    // Ensures e.g. fingerprint of ["a", "bc"] is different to fingerprint of ["ab", "c"].
    private val DIGEST_SEPARATOR = byteArrayOf(0)

    // This wrapper only exists to add the @OptIn.
    @OptIn(ExperimentalStdlibApi::class)
    fun ByteArray.hexString() : String = this.toHexString()

    fun fingerprintAuthorities(authorities: List<String>): String {
      val digest = MessageDigest.getInstance("SHA-512")
      authorities.forEach { authority ->
        digest.update(authority.encodeToByteArray())
        digest.update(DIGEST_SEPARATOR)
      }
      val fingerprint = digest.digest().hexString()
      return fingerprint
    }

  }
}