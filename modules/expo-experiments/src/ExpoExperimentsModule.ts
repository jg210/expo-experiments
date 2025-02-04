import { NativeModule, requireNativeModule } from 'expo';

import { ExpoExperimentsModuleEvents } from './ExpoExperiments.types';

declare class ExpoExperimentsModule extends NativeModule<ExpoExperimentsModuleEvents> {
  setValueAsync(authorities: string[]): Promise<string>;
}

// This call loads the native module object from the JSI.
export default requireNativeModule<ExpoExperimentsModule>('ExpoExperiments');
