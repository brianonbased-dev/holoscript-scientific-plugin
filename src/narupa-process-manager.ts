/**
 * Narupa Process Manager
 * Manages lifecycle of Narupa server Python processes
 */

import { spawn, ChildProcess } from 'child_process';
import { NarupaServerConfig, NarupaServerStatus } from './types';

export class NarupaProcessManager {
  private processes: Map<number, ChildProcess> = new Map();
  private nextPort = 38801;

  /**
   * Start a new Narupa server process
   */
  async startServer(config: NarupaServerConfig): Promise<NarupaServerStatus> {
    // TODO: Implement server spawning logic
    throw new Error('Not implemented yet - Week 2');
  }

  /**
   * Stop a running Narupa server
   */
  async stopServer(pid: number): Promise<void> {
    // TODO: Implement server shutdown logic
    throw new Error('Not implemented yet - Week 2');
  }

  /**
   * Get status of a server process
   */
  getServerStatus(pid: number): NarupaServerStatus | null {
    // TODO: Implement status query logic
    return null;
  }

  /**
   * Stop all running servers
   */
  async stopAllServers(): Promise<void> {
    const pids = Array.from(this.processes.keys());
    await Promise.all(pids.map(pid => this.stopServer(pid)));
  }
}
