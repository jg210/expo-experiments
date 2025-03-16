import CryptoKit
import ExpoModulesCore
import Foundation

public class ExpoExperimentsModule: Module {
  public func definition() -> ModuleDefinition {
    Name("ExpoExperiments")

    AsyncFunction("fingerprintAuthorities") { (authorities: [String], promise: Promise) in
      promise.resolve(fingerprintAuthorities(authorities))
    }

  }
}

private static let digestSeparator: Data = Data([0])

private func fingerprintAuthorities(authorities: [String]) -> String {
    var digest = SHA256()
    for authority in authorities {
        digest.update(data: authority.data(using: .utf8)!)
        digest.update(data: digestSeparator)
    }
    digest.finalize().hexString
}

private extension Data {
    var hexString: String {
        return map { String(format: "%02x", $0) }.joined()
    }
}
