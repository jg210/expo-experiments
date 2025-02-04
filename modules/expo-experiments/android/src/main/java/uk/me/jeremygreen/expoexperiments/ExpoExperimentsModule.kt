package uk.me.jeremygreen.expoexperiments

import expo.modules.kotlin.Promise

import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition
import java.net.URL

class ExpoExperimentsModule : Module() {

  // See https://docs.expo.dev/modules/module-api for more details about available components.
  override fun definition() = ModuleDefinition {
    Name("ExpoExperiments")

    AsyncFunction("fingerprintAuthorities") { authorities: List<String>, promise: Promise ->
      promise.resolve("1234")
    }

  }
}
