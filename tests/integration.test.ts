/**
 * Integration Tests for Narupa Plugin
 * Tests complete workflows from HoloScript to Narupa server execution
 */

import { describe, it, expect, beforeAll, afterAll } from '@jest/globals';
import { NarupaProcessManager } from '../src/narupa-process-manager';
import { NarupaOrchestrator, Task, TaskStatus } from '../src/narupa-orchestrator';
import { NarupaUnityTarget, HoloScriptObject } from '../src/narupa-unity-target';
import * as fs from 'fs';
import * as path from 'path';

describe('Narupa Integration Plugin', () => {
  let processManager: NarupaProcessManager;
  let orchestrator: NarupaOrchestrator;
  const testPdbPath = path.join(__dirname, 'fixtures', 'test.pdb');

  beforeAll(async () => {
    // Setup test fixtures
    if (!fs.existsSync(path.join(__dirname, 'fixtures'))) {
      fs.mkdirSync(path.join(__dirname, 'fixtures'), { recursive: true });
    }

    // Create minimal test PDB file
    if (!fs.existsSync(testPdbPath)) {
      const minimalPDB = `ATOM      1  CA  ALA A   1       0.000   0.000   0.000  1.00  0.00           C
ATOM      2  CA  ALA A   2       1.000   1.000   1.000  1.00  0.00           C
END
`;
      fs.writeFileSync(testPdbPath, minimalPDB);
    }

    processManager = new NarupaProcessManager();
    orchestrator = new NarupaOrchestrator(processManager);
  });

  afterAll(async () => {
    if (processManager) {
      await processManager.shutdown();
    }
    if (orchestrator) {
      await orchestrator.cleanup();
    }
  });

  describe('Process Manager', () => {
    it('should initialize bridge process', async () => {
      await processManager.initialize();
      expect(processManager.isRunning()).toBe(true);
    }, 10000);

    it('should start a Narupa server', async () => {
      const status = await processManager.startServer({
        pdbPath: testPdbPath,
        port: 38801,
        mdEngine: 'openmm',
        temperature: 300,
        timestep: 2.0
      });

      expect(status).toBeDefined();
      expect(status.running).toBe(true);
      expect(status.port).toBe(38801);
      expect(status.numAtoms).toBeGreaterThan(0);

      // Cleanup
      await processManager.stopServer(status.pid);
    }, 15000);

    it('should list active servers', async () => {
      const status1 = await processManager.startServer({
        pdbPath: testPdbPath,
        port: 38802,
        mdEngine: 'openmm',
        temperature: 300,
        timestep: 2.0
      });

      const status2 = await processManager.startServer({
        pdbPath: testPdbPath,
        port: 38803,
        mdEngine: 'openmm',
        temperature: 300,
        timestep: 2.0
      });

      const servers = await processManager.listServers();
      expect(servers.length).toBeGreaterThanOrEqual(2);

      // Cleanup
      await processManager.stopServer(status1.pid);
      await processManager.stopServer(status2.pid);
    }, 20000);

    it('should handle server shutdown gracefully', async () => {
      const status = await processManager.startServer({
        pdbPath: testPdbPath,
        port: 38804,
        mdEngine: 'openmm',
        temperature: 300,
        timestep: 2.0
      });

      await processManager.stopServer(status.pid);

      const statusAfter = await processManager.getServerStatus(status.pid);
      expect(statusAfter).toBeNull();
    }, 15000);
  });

  describe('Orchestrator', () => {
    it('should execute a single task', async () => {
      const task: Task = {
        id: 'test_task_1',
        name: 'Test Simulation',
        type: 'simulation',
        config: {
          protein: testPdbPath,
          mdEngine: 'openmm',
          temperature: 300,
          timestep: 2.0,
          steps: 1000
        }
      };

      orchestrator.addTask(task);
      const results = await orchestrator.executeAll();

      expect(results.size).toBe(1);
      const result = results.get('test_task_1');
      expect(result?.status).toBe(TaskStatus.COMPLETED);
    }, 30000);

    it('should execute parallel tasks', async () => {
      const configs = [
        {
          protein: testPdbPath,
          mdEngine: 'openmm' as const,
          temperature: 300,
          timestep: 2.0,
          steps: 1000
        },
        {
          protein: testPdbPath,
          mdEngine: 'openmm' as const,
          temperature: 310,
          timestep: 2.0,
          steps: 1000
        },
        {
          protein: testPdbPath,
          mdEngine: 'openmm' as const,
          temperature: 320,
          timestep: 2.0,
          steps: 1000
        }
      ];

      const results = await orchestrator.runParallelDocking(configs);

      expect(results.size).toBe(3);
      for (const result of results.values()) {
        expect(result.status).toBe(TaskStatus.COMPLETED);
      }
    }, 60000);

    it('should handle task dependencies', async () => {
      const task1: Task = {
        id: 'dep_task_1',
        name: 'Preparation',
        type: 'simulation',
        config: {
          protein: testPdbPath,
          mdEngine: 'openmm',
          temperature: 300,
          timestep: 2.0,
          steps: 500
        }
      };

      const task2: Task = {
        id: 'dep_task_2',
        name: 'Docking',
        type: 'docking',
        config: {
          protein: testPdbPath,
          mdEngine: 'openmm',
          temperature: 300,
          timestep: 2.0,
          steps: 500
        },
        dependencies: ['dep_task_1']
      };

      orchestrator.addTask(task1);
      orchestrator.addTask(task2);

      const results = await orchestrator.executeAll();

      expect(results.size).toBe(2);
      const result1 = results.get('dep_task_1');
      const result2 = results.get('dep_task_2');

      expect(result1?.status).toBe(TaskStatus.COMPLETED);
      expect(result2?.status).toBe(TaskStatus.COMPLETED);
      expect(result1?.endTime! < result2?.startTime!).toBe(true);
    }, 60000);

    it('should handle task retries on failure', async () => {
      const task: Task = {
        id: 'retry_task',
        name: 'Retry Test',
        type: 'simulation',
        config: {
          protein: '/nonexistent/path.pdb',  // Will fail
          mdEngine: 'openmm',
          temperature: 300,
          timestep: 2.0,
          steps: 1000
        },
        maxRetries: 2
      };

      orchestrator.addTask(task);

      const results = await orchestrator.executeAll();
      const result = results.get('retry_task');

      expect(result?.status).toBe(TaskStatus.FAILED);
      expect(result?.retryCount).toBe(2);
    }, 30000);

    it('should get task statistics', async () => {
      const task1: Task = {
        id: 'stat_task_1',
        name: 'Task 1',
        type: 'simulation',
        config: {
          protein: testPdbPath,
          mdEngine: 'openmm',
          temperature: 300,
          timestep: 2.0,
          steps: 500
        }
      };

      const task2: Task = {
        id: 'stat_task_2',
        name: 'Task 2',
        type: 'simulation',
        config: {
          protein: '/nonexistent/path.pdb',
          mdEngine: 'openmm',
          temperature: 300,
          timestep: 2.0,
          steps: 500
        }
      };

      orchestrator.addTask(task1);
      orchestrator.addTask(task2);

      await orchestrator.executeAll();

      const stats = orchestrator.getStatistics();
      expect(stats.total).toBe(2);
      expect(stats.completed).toBe(1);
      expect(stats.failed).toBe(1);
    }, 30000);
  });

  describe('Unity Target', () => {
    it('should generate Unity scene from HoloScript objects', async () => {
      const unityTarget = new NarupaUnityTarget();

      const objects: HoloScriptObject[] = [
        {
          name: 'Protein1',
          traits: ['narupa_integration', 'protein_visualization'],
          properties: {
            source: 'protein.pdb',
            server_port: 38801,
            render_mode: 'ball_and_stick',
            color_scheme: 'element'
          }
        },
        {
          name: 'Ligand1',
          traits: ['ligand_visualization', 'interactive_forces'],
          properties: {
            source: 'ligand.mol',
            render_mode: 'space_filling',
            force_scale: 1.5
          }
        }
      ];

      const result = await unityTarget.compile(objects, {
        outputDir: path.join(__dirname, 'output'),
        sceneName: 'TestScene',
        namespace: 'HoloScript.Test',
        includeVRRig: true
      });

      expect(result.scene).toBeDefined();
      expect(result.scripts.size).toBeGreaterThan(0);

      // Verify scene controller generated
      expect(result.scripts.has('NarupaSceneController.cs')).toBe(true);

      // Verify component scripts generated
      const sceneController = result.scripts.get('NarupaSceneController.cs');
      expect(sceneController).toContain('namespace HoloScript.Test');
      expect(sceneController).toContain('Protein1Object');
    });

    it('should generate visualizer components', async () => {
      const unityTarget = new NarupaUnityTarget();

      const objects: HoloScriptObject[] = [
        {
          name: 'TestProtein',
          traits: ['protein_visualization'],
          properties: {
            render_mode: 'ribbon',
            color_scheme: 'residue'
          }
        }
      ];

      const result = await unityTarget.compile(objects, {
        outputDir: path.join(__dirname, 'output'),
        sceneName: 'VisualizerTest',
        namespace: 'Test'
      });

      const visualizerScript = result.scripts.get('TestProteinVisualizer.cs');
      expect(visualizerScript).toBeDefined();
      expect(visualizerScript).toContain('RenderMode.Ribbon');
      expect(visualizerScript).toContain('ColorScheme.Residue');
    });

    it('should generate interactor components', async () => {
      const unityTarget = new NarupaUnityTarget();

      const objects: HoloScriptObject[] = [
        {
          name: 'InteractiveProtein',
          traits: ['interactive_forces'],
          properties: {
            force_scale: 2.0
          }
        }
      ];

      const result = await unityTarget.compile(objects, {
        outputDir: path.join(__dirname, 'output'),
        sceneName: 'InteractorTest',
        namespace: 'Test'
      });

      const interactorScript = result.scripts.get('InteractiveProteinInteractor.cs');
      expect(interactorScript).toBeDefined();
      expect(interactorScript).toContain('forceScale = 2.0f');
      expect(interactorScript).toContain('ApplyControllerForces');
    });

    it('should generate trajectory playback components', async () => {
      const unityTarget = new NarupaUnityTarget();

      const objects: HoloScriptObject[] = [
        {
          name: 'TrajectoryProtein',
          traits: ['trajectory_playback'],
          properties: {
            auto_play: true,
            loop: true
          }
        }
      ];

      const result = await unityTarget.compile(objects, {
        outputDir: path.join(__dirname, 'output'),
        sceneName: 'TrajectoryTest',
        namespace: 'Test'
      });

      const playerScript = result.scripts.get('TrajectoryProteinTrajectoryPlayer.cs');
      expect(playerScript).toBeDefined();
      expect(playerScript).toContain('autoPlay = true');
      expect(playerScript).toContain('loop = true');
      expect(playerScript).toContain('Play()');
      expect(playerScript).toContain('Pause()');
      expect(playerScript).toContain('Stop()');
    });
  });

  describe('End-to-End Workflow', () => {
    it('should execute complete workflow from HoloScript to VR scene', async () => {
      // Step 1: Parse HoloScript (simulated)
      const holoObjects: HoloScriptObject[] = [
        {
          name: 'DrugTarget',
          traits: ['narupa_integration', 'molecular_dynamics', 'protein_visualization'],
          properties: {
            source: testPdbPath,
            server_port: 38901,
            md_engine: 'openmm',
            temperature: 300,
            timestep: 2.0,
            steps: 1000,
            render_mode: 'ball_and_stick'
          }
        }
      ];

      // Step 2: Generate Unity scene
      const unityTarget = new NarupaUnityTarget(processManager);
      const unityResult = await unityTarget.compile(holoObjects, {
        outputDir: path.join(__dirname, 'output', 'e2e'),
        sceneName: 'DrugDiscoveryScene',
        namespace: 'HoloScript.DrugDiscovery'
      });

      expect(unityResult.scene).toBeDefined();
      expect(unityResult.scripts.size).toBeGreaterThan(0);

      // Step 3: Start Narupa servers
      const serverStatus = await processManager.startServer({
        pdbPath: testPdbPath,
        port: 38901,
        mdEngine: 'openmm',
        temperature: 300,
        timestep: 2.0,
        steps: 1000
      });

      expect(serverStatus.running).toBe(true);
      expect(serverStatus.port).toBe(38901);

      // Step 4: Verify server is accessible
      const status = await processManager.getServerStatus(serverStatus.pid);
      expect(status).toBeDefined();
      expect(status?.running).toBe(true);

      // Cleanup
      await processManager.stopServer(serverStatus.pid);

      // Step 5: Verify Unity scripts are complete
      const sceneController = unityResult.scripts.get('NarupaSceneController.cs');
      expect(sceneController).toContain('DrugTargetObject');
      expect(sceneController).toContain('basePort + 0');
    }, 40000);
  });
});
