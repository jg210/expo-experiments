package uk.me.jeremygreen.expoexperiments

import expo.modules.kotlin.Promise

import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition
import java.security.MessageDigest

class ExpoExperimentsModule : Module() {

  companion object {

    // Ensures e.g. fingerprint of ["a", "bc"] is different to fingerprint of ["ab", "c"].
    private val DIGEST_SEPARATOR = byteArrayOf(0)

    // This wrapper only exists to add the @OptIn.
    @OptIn(ExperimentalStdlibApi::class)
    fun ByteArray.hexString() : String = this.toHexString()

    fun fingerprintAuthorities(authorities: List<String>): String {
      val digest = MessageDigest.getInstance("SHA-256")
      authorities.forEach { authority ->
        digest.update(authority.encodeToByteArray())
        digest.update(DIGEST_SEPARATOR)
      }
      val fingerprint = digest.digest().hexString()
      return fingerprint
    }

  }

  // See https://docs.expo.dev/modules/module-api for more details about available components.
  override fun definition() = ModuleDefinition {
    Name("ExpoExperiments")

    AsyncFunction("fingerprintAuthorities") { authorities: List<String>, promise: Promise ->
      val fingerprint = fingerprintAuthorities(authorities)
      promise.resolve(fingerprint)
    }

  }

}
