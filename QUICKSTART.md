# Quick Start Guide

Get started with the HoloScript Narupa Plugin in 5 minutes.

## Prerequisites

- Node.js 18+
- Python 3.8+
- Git

## Installation

```bash
# Clone repository
git clone https://github.com/brianonbased-dev/holoscript-scientific-plugin
cd holoscript-scientific-plugin

# Install Node dependencies
npm install

# Build TypeScript
npm run build
```

## Running Tests (No Narupa SDK Required)

The plugin includes integration tests that work **without installing Narupa SDK** (stub mode):

### Test 1: TypeScript ↔ Python Communication

```bash
npx tsx tests/integration-test.ts
```

**Expected output**: ✅ All tests pass
- JSON-RPC communication working
- Bridge lifecycle working
- Error handling working

### Test 2: Orchestrator Workflow

```bash
npx tsx tests/orchestrator-test.ts
```

**Expected output**: Demonstrates dependency graph execution
- Shows task dependencies
- HITL approval gates
- Parallel execution logic

## Installing Narupa SDK (Optional for Week 1)

For full integration with real molecular dynamics:

```bash
# Create virtual environment
python -m venv narupa-env
source narupa-env/bin/activate  # Windows: narupa-env\Scripts\activate

# Install Narupa
pip install nanover-server

# Verify installation
python python/holoscript_narupa_bridge.py --mode test
```

## Project Structure

```
holoscript-scientific-plugin/
├── src/                          # TypeScript source
│   ├── narupa-process-manager.ts # Process lifecycle manager ✅
│   ├── narupa-orchestrator.ts    # Multi-agent orchestrator ✅
│   └── types.ts                  # Type definitions ✅
├── python/                       # Python bridge
│   └── holoscript_narupa_bridge.py # JSON-RPC server ✅
├── tests/                        # Integration tests
│   ├── integration-test.ts       # Communication test ✅
│   └── orchestrator-test.ts      # Workflow test ✅
├── examples/                     # HoloScript examples
│   ├── simple-narupa.holo        # Basic viewer
│   ├── parallel-docking.holo     # Parallel sims
│   └── hitl-docking.holo         # Interactive docking
└── docs/                         # Documentation (7 files)
```

## Example Usage (Week 2+)

### Basic Process Manager

```typescript
import { NarupaProcessManager } from './src/narupa-process-manager';

const manager = new NarupaProcessManager();
await manager.initialize();

const status = await manager.startServer({
  pdbPath: '1ABC.pdb',
  port: 38801,
  mdEngine: 'openmm',
  temperature: 300,
  timestep: 2
});

console.log(`Server running on port ${status.port}`);
```

### Advanced Orchestrator

```typescript
import { NarupaOrchestrator } from './src/narupa-orchestrator';

const orchestrator = new NarupaOrchestrator();

// Add tasks with dependencies
orchestrator.addTask({
  id: 'prep',
  name: 'Prepare Protein',
  type: 'simulation',
  config: { protein: 'receptor.pdb', ... }
});

orchestrator.addTask({
  id: 'docking',
  name: 'Docking Simulation',
  type: 'docking',
  config: { protein: 'receptor.pdb', ligand: 'drug.mol', ... },
  dependencies: ['prep'],  // Runs after prep
  hitlGate: true,          // Requires approval
  maxRetries: 3,           // Auto-retry on failure
  parallel: true           // Can run in parallel with siblings
});

const results = await orchestrator.executeAll();
```

## Development

### Watch Mode

```bash
npm run dev  # TypeScript watch mode
```

### Build

```bash
npm run build  # Compile TypeScript
```

### Clean

```bash
npm run clean  # Remove build artifacts
```

## Next Steps

1. **Week 1 (Current)**: Install Narupa SDK and test real server startup
2. **Week 2**: Implement HoloScript trait integration
3. **Week 3**: Unity client integration
4. **Week 4**: Production deployment

## Documentation

- [README.md](README.md) - Project overview
- [IMPLEMENTATION_SUMMARY.md](IMPLEMENTATION_SUMMARY.md) - Complete implementation details
- [WEEK1_KICKOFF_CHECKLIST.md](WEEK1_KICKOFF_CHECKLIST.md) - Week 1 progress
- [docs/](docs/) - 7 detailed documentation files

## Support

- Repository: https://github.com/brianonbased-dev/holoscript-scientific-plugin
- Issues: https://github.com/brianonbased-dev/holoscript-scientific-plugin/issues
- Documentation: `/docs` directory

## License

MIT
