package uk.me.jeremygreen.expoexperiments

import expo.modules.kotlin.Promise

import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition
import java.security.MessageDigest

class ExpoExperimentsModule : Module() {

  companion object {
    @OptIn(ExperimentalStdlibApi::class)
    private fun hexString(byteArray: ByteArray) : String = byteArray.toHexString()
  }

  // See https://docs.expo.dev/modules/module-api for more details about available components.
  override fun definition() = ModuleDefinition {
    Name("ExpoExperiments")

    AsyncFunction("fingerprintAuthorities") { authorities: List<String>, promise: Promise ->
      val digest = MessageDigest.getInstance("SHA-256")
      val separator = byteArrayOf(0)
      authorities.forEach  { authority ->
        digest.digest(authority.encodeToByteArray())
        digest.digest(separator)
      }
      val fingerprint = hexString(digest.digest())
      promise.resolve(fingerprint)
    }

  }
}
