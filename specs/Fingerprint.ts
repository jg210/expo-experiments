import type {TurboModule} from 'react-native';
import {TurboModuleRegistry} from 'react-native';

export interface FingerprintSpec extends TurboModule {
  fingerprintAuthorities(authorities: string[]): Promise<string>;
}

export default TurboModuleRegistry.getEnforcing<FingerprintSpec>(
  'Fingerprint',
);
