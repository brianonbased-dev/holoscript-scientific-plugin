/**
 * Integration Test - TypeScript ↔ Python Bridge Communication
 * Tests end-to-end JSON-RPC communication without Narupa SDK
 */

import { NarupaProcessManager } from '../src/narupa-process-manager';

async function runIntegrationTest() {
  console.log('🧪 Integration Test: TypeScript ↔ Python Bridge\n');

  const manager = new NarupaProcessManager();

  // Setup event listeners
  manager.on('initialized', () => {
    console.log('✅ Bridge initialized');
  });

  manager.on('log', ({ level, message }) => {
    console.log(`📋 [${level}] ${message}`);
  });

  manager.on('error', (err) => {
    console.error(`❌ Error: ${err.message}`);
  });

  try {
    // Test 1: Initialize bridge
    console.log('Test 1: Initializing bridge...');
    await manager.initialize();
    console.log('✅ Bridge initialized successfully\n');

    // Test 2: List servers (should be empty)
    console.log('Test 2: Listing servers...');
    const servers = await manager.listServers();
    console.log(`✅ Active servers: ${servers.length}\n`);

    // Test 3: Attempt to start server (will fail gracefully without Narupa SDK)
    console.log('Test 3: Testing server start (stub mode)...');
    try {
      await manager.startServer({
        pdbPath: 'test.pdb',
        port: 38801,
        mdEngine: 'openmm',
        temperature: 300,
        timestep: 2
      });
    } catch (err) {
      const error = err as Error;
      if (error.message.includes('Narupa SDK not installed')) {
        console.log('✅ Expected error: Narupa SDK not installed (stub mode)\n');
      } else {
        throw err;
      }
    }

    // Test 4: Shutdown
    console.log('Test 4: Shutting down bridge...');
    await manager.shutdown();
    console.log('✅ Bridge shutdown successfully\n');

    console.log('🎉 All integration tests passed!');
    console.log('\n📝 Summary:');
    console.log('  - JSON-RPC communication: ✅ Working');
    console.log('  - Bridge lifecycle: ✅ Working');
    console.log('  - Error handling: ✅ Working');
    console.log('  - Graceful shutdown: ✅ Working');
    console.log('\n💡 Next step: Install Narupa SDK with `pip install nanover-server`');

  } catch (err) {
    const error = err as Error;
    console.error(`\n❌ Test failed: ${error.message}`);
    console.error(error.stack);
    process.exit(1);
  }
}

// Run the test
runIntegrationTest().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
