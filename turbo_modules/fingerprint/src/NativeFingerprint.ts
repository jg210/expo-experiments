import type {TurboModule} from 'react-native';
import {TurboModuleRegistry} from 'react-native';

export interface NativeFingerprintSpec extends TurboModule {
  fingerprintAuthorities(authorities: string[]): Promise<string>;
}

export default TurboModuleRegistry.getEnforcing<NativeFingerprintSpec>(
  'NativeFingerprint',
);
