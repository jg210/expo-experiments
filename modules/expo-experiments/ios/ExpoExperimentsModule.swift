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

private let digestSeparator: Data = Data([0])

private func fingerprintAuthorities(_ authorities: [String]) -> String {
    var digest = SHA256()
    for authority in authorities {
        digest.update(data: authority.data(using: .utf8)!)
        digest.update(data: digestSeparator)
    }
    return digest.finalize().hexString
}

private extension SHA256.Digest {
    var hexString: String {
        return map { String(format: "%02x", $0) }.joined()
    }
}
