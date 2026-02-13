# Architecture Design Document

**Week 1 - Day 4-5**
**Last Updated**: Feb 13, 2026
**Status**: Initial draft based on Week 1 findings

## Executive Summary

This document describes the architecture for integrating Narupa molecular dynamics with HoloScript, enabling VR-based drug discovery workflows.

## System Overview

### Components

```
┌─────────────────────────────────────────────────────────────┐
│                     HoloScript Compiler                      │
│  (Parses .holo files, detects @narupa_integration traits)   │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│              Narupa Process Manager (TypeScript)             │
│  - Spawns Python processes via child_process.spawn()        │
│  - Manages server lifecycle                                  │
│  - JSON-RPC communication via stdin/stdout                   │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│           holoscript_narupa_bridge.py (Python)               │
│  - Starts Narupa server (nanover-server)                    │
│  - Handles JSON-RPC requests                                 │
│  - Manages OpenMM simulations                                │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│                    Narupa Server (Python)                    │
│  - Runs molecular dynamics (OpenMM/ASE)                      │
│  - Serves atom positions/forces over network                 │
│  - Port: 38801+ (configurable)                               │
└────────────────────┬────────────────────────────────────────┘
                     │ Network (TCP/IP)
                     │ Protocol: Custom binary/JSON
                     ▼
┌─────────────────────────────────────────────────────────────┐
│                Unity VR Client (C#)                          │
│  - Connects to Narupa server                                 │
│  - Renders molecules in 3D VR                                │
│  - Sends force feedback from controllers                     │
└─────────────────────────────────────────────────────────────┘
```

## Data Flow

### Compilation Phase

1. **HoloScript → AST**
   ```holoscript
   object "Protein" @narupa_integration {
     source: "1ABC.pdb",
     server_port: 38801
   }
   ```

2. **AST → Process Spawn**
   ```typescript
   const manager = new NarupaProcessManager();
   await manager.startServer({
     pdbPath: '1ABC.pdb',
     port: 38801,
     mdEngine: 'openmm',
     temperature: 300,
     timestep: 2
   });
   ```

3. **TypeScript → Python Bridge**
   ```json
   {
     "jsonrpc": "2.0",
     "method": "start_server",
     "params": {
       "pdb_path": "1ABC.pdb",
       "port": 38801,
       "md_engine": "openmm",
       "temperature": 300,
       "timestep": 2
     },
     "id": 1
   }
   ```

4. **Python → Narupa Server**
   ```python
   app = NanoVerImdApplication.basic_server()
   simulation = OpenMMSimulation.from_pdb('1ABC.pdb')
   app.server.start_server(port=38801)
   app.run()
   ```

### Runtime Phase

1. **Unity Client Connects**
   ```
   Unity → TCP → localhost:38801
   ```

2. **Frame Updates (30-60 FPS)**
   ```
   Narupa Server → Frame Data → Unity Client
   {
     "positions": [[x, y, z], ...],
     "atom_types": ["C", "N", "O", ...],
     "bonds": [[0, 1], [1, 2], ...]
   }
   ```

3. **Force Feedback (VR Controllers)**
   ```
   Unity Client → Force Data → Narupa Server
   {
     "atom_index": 42,
     "force": [fx, fy, fz]
   }
   ```

## Architecture Decisions

### Decision 1: Process Management Strategy

**Options Considered**:
- ✅ **Option A: Node.js child_process.spawn()** (RECOMMENDED)
- ❌ Option B: Python.NET bindings (too complex, compatibility issues)
- ❌ Option C: Separate microservice (unnecessary network overhead)

**Rationale**:
- `child_process.spawn()` is well-tested and reliable
- Keeps Python and TypeScript loosely coupled
- Easy debugging (separate processes)
- Clean shutdown/cleanup

**Implementation**:
```typescript
import { spawn } from 'child_process';

const pythonProcess = spawn('python', [
  'python/holoscript_narupa_bridge.py',
  '--mode', 'rpc'
]);

// stdin/stdout JSON-RPC communication
pythonProcess.stdin.write(JSON.stringify(request) + '\n');
pythonProcess.stdout.on('data', handleResponse);
```

### Decision 2: Communication Protocol

**Options Considered**:
- ✅ **stdin/stdout JSON-RPC** (RECOMMENDED)
- ❌ REST API (higher latency, more complex)
- ❌ gRPC (overkill for local processes)
- ❌ ZeroMQ (additional dependency)

**Rationale**:
- Lowest latency (~1-2ms)
- No network stack overhead
- Simple protocol (JSON-RPC 2.0)
- Built into Node.js/Python

**Message Format**:
```json
{
  "jsonrpc": "2.0",
  "method": "start_server",
  "params": { ... },
  "id": 1
}
```

### Decision 3: Unity Client Distribution

**Options Considered**:
- ✅ **Bundle pre-built client in npm package** (RECOMMENDED)
- ❌ Require separate Unity project (poor UX)

**Rationale**:
- Better user experience (one install)
- Version synchronization guaranteed
- Automatic updates with npm
- Size: ~50-100 MB (acceptable)

**Implementation**:
```
npm package structure:
├── dist/
│   ├── index.js (TypeScript compiled)
│   └── unity-client/
│       ├── narupa-vr-client.exe (Windows)
│       ├── narupa-vr-client.app (macOS)
│       └── narupa-vr-client (Linux)
```

### Decision 4: Multi-agent Orchestration

**Use Case**: Parallel docking simulations

**Strategy**:
- Each Narupa server = separate process + port
- `NarupaOrchestrator` coordinates multiple servers
- Port allocation: 38801, 38802, 38803, ...

**Example**:
```typescript
const orchestrator = new NarupaOrchestrator();
await orchestrator.runParallelDocking([
  { protein: 'receptor.pdb', ligand: 'compound_A.mol', port: 38801 },
  { protein: 'receptor.pdb', ligand: 'compound_B.mol', port: 38802 },
  { protein: 'receptor.pdb', ligand: 'compound_C.mol', port: 38803 },
  { protein: 'receptor.pdb', ligand: 'compound_D.mol', port: 38804 }
]);
```

## Trait System Design

### `@narupa_integration` Trait

**Purpose**: Basic Narupa server integration

**Schema**:
```typescript
interface NarupaIntegrationTrait {
  source: string;       // PDB file path
  server_port: number;  // Port number (default: 38801)
}
```

**Compilation**:
```typescript
// HoloScript compiler detects trait and calls:
await processManager.startServer({
  pdbPath: trait.source,
  port: trait.server_port || 38801,
  mdEngine: 'openmm',
  temperature: 300,
  timestep: 2
});
```

### `@molecular_dynamics` Trait

**Purpose**: Advanced MD simulation control

**Schema**:
```typescript
interface MolecularDynamicsTrait {
  protein: string;      // Protein PDB
  ligand?: string;      // Ligand molecule
  md_engine: 'openmm' | 'ase';
  temperature: number;  // Kelvin
  timestep: number;     // femtoseconds
  steps: number;        // Total simulation steps
}
```

### `@interactive_forces` Trait

**Purpose**: Enable VR controller force feedback

**Schema**:
```typescript
interface InteractiveForcesTrait {
  force_enabled: boolean;
  force_scale: number;  // Force multiplier (default: 1.0)
}
```

## Performance Considerations

### Target Metrics

- **Frame Rate**: 30-60 FPS (VR requirement)
- **Latency**: <16ms (VR requirement)
- **Startup Time**: <5 seconds per server
- **Memory**: <200 MB per 10,000 atoms

### Optimization Strategies

1. **Lazy Loading**: Only start servers when VR client connects
2. **Connection Pooling**: Reuse servers across scenes
3. **Atom Culling**: Only send visible atoms to client
4. **LOD System**: Lower detail for distant molecules

## Error Handling

### Python Process Crashes

```typescript
pythonProcess.on('exit', (code) => {
  if (code !== 0) {
    console.error(`Narupa server crashed with code ${code}`);
    // Attempt restart
    await restartServer(config);
  }
});
```

### Network Disconnections

```csharp
// Unity client
client.Disconnected += () => {
  ShowReconnectDialog();
  AttemptReconnect();
};
```

### PDB Loading Failures

```python
try:
    simulation = OpenMMSimulation.from_pdb(pdb_path)
except Exception as e:
    return {
        'jsonrpc': '2.0',
        'error': {'code': -32000, 'message': f'PDB load failed: {e}'}
    }
```

## Security Considerations

### Week 1 - NOT YET IMPLEMENTED

**Planned for Week 5**:
- [ ] Validate PDB file paths (no directory traversal)
- [ ] Limit port range (38801-38900)
- [ ] Process sandboxing
- [ ] Resource limits (CPU/memory)

## Testing Strategy

### Unit Tests

- `NarupaProcessManager.startServer()`
- `NarupaProcessManager.stopServer()`
- JSON-RPC message parsing
- PDB file validation

### Integration Tests

- HoloScript → Python bridge communication
- Python bridge → Narupa server startup
- Unity client → Narupa server connection
- Full end-to-end workflow

### Performance Tests

- Load 100, 1K, 10K, 100K atoms
- Measure frame rate at each scale
- Measure latency under load
- Memory profiling

## Deployment

### npm Package

```bash
npm install holoscript-scientific-plugin
```

**Contents**:
- TypeScript process manager
- Python bridge script
- Pre-built Unity client
- Example .holo files
- Documentation

### Python Dependencies

```bash
# Auto-installed by npm postinstall hook
pip install nanover-server
```

## Week 2-8 Implementation Plan

### Week 2: Python Bridge
- Implement JSON-RPC handlers
- Test server spawning
- Error handling

### Week 3: Basic Integration
- `@narupa_integration` trait
- Unity client auto-spawn
- Simple VR test

### Week 4: Advanced Features
- `@molecular_dynamics` trait
- `@interactive_forces` trait
- Multi-agent orchestration

### Week 5-8: Production
- Performance optimization
- Security hardening
- Documentation
- npm publishing

## References

- [Narupa Documentation](https://irl2.github.io/nanover-server-py/)
- [HoloScript Trait System](https://github.com/brianonbased-dev/HoloScript/docs/traits.md)
- [JSON-RPC 2.0 Spec](https://www.jsonrpc.org/specification)

---

**Status**: Architecture design complete ✅ | Ready for Week 2 implementation
