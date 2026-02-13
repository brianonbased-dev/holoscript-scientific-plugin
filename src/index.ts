/**
 * @holoscript/narupa-plugin v1.0
 * Multi-agent orchestration for VR-based drug discovery
 *
 * @packageDocumentation
 */

export { NarupaProcessManager } from './narupa-process-manager';
export { NarupaOrchestrator, Task, TaskStatus, TaskResult, HITLCallback } from './narupa-orchestrator';
export { NarupaUnityTarget, HoloScriptObject, UnityGenerationOptions } from './narupa-unity-target';
export {
  NarupaServerConfig,
  NarupaServerStatus,
  MolecularDynamicsConfig
} from './types';

// Version
export const VERSION = '1.0.0';

// Default exports for convenience
export default {
  NarupaProcessManager,
  NarupaOrchestrator,
  NarupaUnityTarget,
  VERSION
};
