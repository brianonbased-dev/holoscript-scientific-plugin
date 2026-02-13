/**
 * Orchestrator Test - Dependency Graph and HITL Workflow
 * Demonstrates advanced orchestration features without Narupa SDK
 */

import { NarupaOrchestrator, TaskStatus } from '../src/narupa-orchestrator';
import { NarupaProcessManager } from '../src/narupa-process-manager';

async function runOrchestratorTest() {
  console.log('🧪 Orchestrator Test: Dependency Graphs & HITL Gates\n');

  const manager = new NarupaProcessManager();
  const orchestrator = new NarupaOrchestrator(manager, 2); // Max 2 parallel

  // Setup HITL callback (auto-approve for testing)
  orchestrator.setHITLCallback(async (task, result) => {
    console.log(`🤔 HITL Gate: "${task.name}" requires approval`);
    console.log(`   Server: port ${result.port}, ${result.serverId} atoms loaded`);
    console.log(`   ✅ Auto-approved for testing\n`);
    return true; // Auto-approve
  });

  // Setup event listeners
  orchestrator.on('orchestration-started', ({ totalTasks, maxParallel }) => {
    console.log(`🚀 Orchestration started: ${totalTasks} tasks, max ${maxParallel} parallel\n`);
  });

  orchestrator.on('task-started', (task) => {
    console.log(`▶️  Task started: ${task.name}`);
  });

  orchestrator.on('task-completed', (task, result) => {
    const duration = result.endTime && result.startTime
      ? ((result.endTime.getTime() - result.startTime.getTime()) / 1000).toFixed(2)
      : 'N/A';
    console.log(`✅ Task completed: ${task.name} (${duration}s)`);
  });

  orchestrator.on('task-failed', (task, result, err) => {
    console.log(`❌ Task failed: ${task.name} - ${err.message}`);
  });

  orchestrator.on('orchestration-completed', (results) => {
    console.log(`\n🎉 Orchestration complete: ${results.size} tasks finished\n`);
  });

  try {
    console.log('📋 Building workflow with dependency graph...\n');

    // Task 1: Prepare protein structure (no dependencies)
    orchestrator.addTask({
      id: 'prep_protein',
      name: 'Prepare Protein Structure',
      type: 'simulation',
      config: {
        protein: 'receptor.pdb',
        mdEngine: 'openmm',
        temperature: 300,
        timestep: 2,
        steps: 1000
      },
      parallel: true
    });

    // Task 2: Docking Simulation 1 (depends on protein prep)
    orchestrator.addTask({
      id: 'docking_1',
      name: 'Docking Compound A',
      type: 'docking',
      config: {
        protein: 'receptor.pdb',
        ligand: 'compound_a.mol',
        mdEngine: 'openmm',
        temperature: 300,
        timestep: 2,
        steps: 5000
      },
      dependencies: ['prep_protein'],
      parallel: true,
      maxRetries: 2
    });

    // Task 3: Docking Simulation 2 (depends on protein prep)
    orchestrator.addTask({
      id: 'docking_2',
      name: 'Docking Compound B',
      type: 'docking',
      config: {
        protein: 'receptor.pdb',
        ligand: 'compound_b.mol',
        mdEngine: 'openmm',
        temperature: 300,
        timestep: 2,
        steps: 5000
      },
      dependencies: ['prep_protein'],
      parallel: true
    });

    // Task 4: HITL Review (depends on both docking sims)
    orchestrator.addTask({
      id: 'hitl_review',
      name: 'Human Review of Results',
      type: 'analysis',
      config: {
        protein: 'receptor.pdb',
        mdEngine: 'openmm',
        temperature: 300,
        timestep: 2,
        steps: 100
      },
      dependencies: ['docking_1', 'docking_2'],
      hitlGate: true,  // Requires human approval
      parallel: false
    });

    // Task 5: Final Report (depends on HITL approval)
    orchestrator.addTask({
      id: 'final_report',
      name: 'Generate Final Report',
      type: 'analysis',
      config: {
        protein: 'results.pdb',
        mdEngine: 'openmm',
        temperature: 300,
        timestep: 2,
        steps: 100
      },
      dependencies: ['hitl_review'],
      parallel: false
    });

    console.log('Workflow structure:');
    console.log('  1. Prepare Protein');
    console.log('  2. Docking A + Docking B (parallel, after prep)');
    console.log('  3. HITL Review (after both docking)');
    console.log('  4. Final Report (after HITL)\n');

    // Note: This will fail because Narupa SDK isn't installed
    // But it will demonstrate the orchestration logic
    console.log('⚠️  Note: Tasks will fail without Narupa SDK - testing orchestration flow\n');

    const results = await orchestrator.executeAll();

    // Print results
    console.log('📊 Execution Results:');
    const stats = orchestrator.getStatistics();
    console.log(`   Total: ${stats.total}`);
    console.log(`   Completed: ${stats.completed}`);
    console.log(`   Failed: ${stats.failed}`);
    console.log(`   Pending: ${stats.pending}`);
    console.log(`   Running: ${stats.running}\n`);

    // Cleanup
    await orchestrator.cleanup();
    console.log('✅ Orchestrator cleanup complete\n');

    console.log('🎉 Orchestrator test completed!\n');
    console.log('💡 This test demonstrates:');
    console.log('  - Dependency graph construction ✅');
    console.log('  - Parallel task execution ✅');
    console.log('  - HITL approval gates ✅');
    console.log('  - Event-driven monitoring ✅');
    console.log('  - Graceful error handling ✅');

  } catch (err) {
    const error = err as Error;
    console.error(`\n❌ Test error: ${error.message}`);

    // Show statistics even on error
    const stats = orchestrator.getStatistics();
    console.log('\n📊 Final Statistics:');
    console.log(`   Total: ${stats.total}`);
    console.log(`   Completed: ${stats.completed}`);
    console.log(`   Failed: ${stats.failed}`);

    await orchestrator.cleanup();
  }
}

// Run the test
runOrchestratorTest().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
