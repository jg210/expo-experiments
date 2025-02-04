import ExpoModulesCore

public class ExpoExperimentsModule: Module {
  public func definition() -> ModuleDefinition {
    Name("ExpoExperiments")

    AsyncFunction("fingerprintAuthorities") { (authorities: String[], promise: Promise) in
      promise.resolve("1234") // TODO implement fingerprinting
    }

  }
}
