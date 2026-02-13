# HoloScript Narupa Plugin - API Reference v1.0

**Version**: 1.0.0
**Last Updated**: February 13, 2026
**Status**: Complete Implementation

## TypeScript API

### `NarupaProcessManager`

Process lifecycle manager for Narupa servers.

#### Constructor

```typescript
constructor()
```

Creates a new process manager instance.

#### Methods

##### `startServer(config: NarupaServerConfig): Promise<NarupaServerStatus>`

Start a new Narupa server process.

**Parameters**:
- `config.pdbPath` - Path to PDB file
- `config.port` - Server port (default: auto-allocated)
- `config.mdEngine` - MD engine ('openmm' or 'ase')
- `config.temperature` - Temperature in Kelvin
- `config.timestep` - Timestep in femtoseconds
- `config.steps` - Number of simulation steps (optional)

**Returns**: Server status object

**Throws**: Error if server fails to start

**Example**:
```typescript
const manager = new NarupaProcessManager();
const status = await manager.startServer({
  pdbPath: '1ABC.pdb',
  port: 38801,
  mdEngine: 'openmm',
  temperature: 300,
  timestep: 2
});
console.log(`Server started on port ${status.port}`);
```

##### `stopServer(pid: number): Promise<void>`

Stop a running Narupa server.

**Parameters**:
- `pid` - Process ID of server to stop

**Returns**: Promise that resolves when server is stopped

**Example**:
```typescript
await manager.stopServer(12345);
```

##### `getServerStatus(pid: number): NarupaServerStatus | null`

Get status of a server process.

**Parameters**:
- `pid` - Process ID to query

**Returns**: Server status or null if not found

**Example**:
```typescript
const status = manager.getServerStatus(12345);
if (status?.running) {
  console.log('Server is running');
}
```

##### `stopAllServers(): Promise<void>`

Stop all running servers.

**Returns**: Promise that resolves when all servers stopped

---

### `NarupaOrchestrator`

Multi-agent coordination for parallel simulations.

#### Constructor

```typescript
constructor()
```

#### Methods

##### `startSimulation(config: MolecularDynamicsConfig): Promise<void>`

Start a single MD simulation.

**Parameters**:
- `config.protein` - Protein PDB file
- `config.ligand` - Ligand molecule file (optional)
- `config.mdEngine` - MD engine
- `config.temperature` - Temperature in Kelvin
- `config.timestep` - Timestep in femtoseconds
- `config.steps` - Total simulation steps

**Example**:
```typescript
const orchestrator = new NarupaOrchestrator();
await orchestrator.startSimulation({
  protein: 'receptor.pdb',
  ligand: 'compound.mol',
  mdEngine: 'openmm',
  temperature: 300,
  timestep: 2,
  steps: 100000
});
```

##### `runParallelDocking(configs: MolecularDynamicsConfig[]): Promise<void>`

Run multiple docking simulations in parallel.

**Parameters**:
- `configs` - Array of simulation configurations

**Example**:
```typescript
await orchestrator.runParallelDocking([
  { protein: 'receptor.pdb', ligand: 'compound_A.mol', ... },
  { protein: 'receptor.pdb', ligand: 'compound_B.mol', ... },
  { protein: 'receptor.pdb', ligand: 'compound_C.mol', ... }
]);
```

##### `cleanup(): Promise<void>`

Stop all simulations and cleanup resources.

---

## Python API

### `holoscript_narupa_bridge.py`

Python bridge for JSON-RPC communication.

#### Command Line

```bash
# JSON-RPC mode (stdin/stdout)
python holoscript_narupa_bridge.py --mode rpc

# Test mode
python holoscript_narupa_bridge.py --mode test
```

#### JSON-RPC Methods

##### `start_server`

Start a Narupa server.

**Request**:
```json
{
  "jsonrpc": "2.0",
  "method": "start_server",
  "params": {
    "pdb_path": "1ABC.pdb",
    "port": 38801,
    "md_engine": "openmm",
    "temperature": 300,
    "timestep": 2,
    "steps": 100000
  },
  "id": 1
}
```

**Response**:
```json
{
  "jsonrpc": "2.0",
  "result": {
    "pid": 12345,
    "port": 38801,
    "num_atoms": 1234,
    "status": "running"
  },
  "id": 1
}
```

**Error Response**:
```json
{
  "jsonrpc": "2.0",
  "error": {
    "code": -32000,
    "message": "PDB file not found: 1ABC.pdb"
  },
  "id": 1
}
```

##### `stop_server` (Week 2)

Stop a running server.

##### `get_status` (Week 2)

Query server status.

---

## Narupa Python Server API

### `NanoVerImdApplication`

To be documented after Week 1 testing.

**Key Methods** (preliminary):
- `basic_server()` - Create basic server instance
- `server.start_server(port)` - Start server on port
- `run()` - Run server (blocking)
- `close()` - Shutdown server

### `OpenMMSimulation`

To be documented after Week 1 testing.

**Key Methods** (preliminary):
- `from_pdb(path)` - Load PDB file
- `system.getNumParticles()` - Get atom count
- `positions` - Get atom positions

---

## Unity C# API

### `NarupaIMDClient`

To be documented after Week 1 Unity testing.

**Key Methods** (preliminary):
- `Connect(host, port)` - Connect to server
- `Disconnect()` - Disconnect from server
- `ApplyForce(atomIndex, position, force)` - Apply VR controller force

**Events**:
- `FrameReceived` - New frame data arrived
- `Connected` - Connected to server
- `Disconnected` - Disconnected from server

### `MoleculeRenderer`

To be documented after Week 1 Unity testing.

**Key Methods** (preliminary):
- `UpdatePositions(positions)` - Update atom positions
- `SetAtomTypes(types)` - Set atom type rendering
- `SetBonds(bonds)` - Update bond rendering

---

## Type Definitions

### `NarupaServerConfig`

```typescript
interface NarupaServerConfig {
  pdbPath: string;
  port: number;
  mdEngine: 'openmm' | 'ase';
  temperature: number;
  timestep: number;
  steps?: number;
}
```

### `NarupaServerStatus`

```typescript
interface NarupaServerStatus {
  pid: number;
  port: number;
  running: boolean;
  numAtoms?: number;
  error?: string;
}
```

### `MolecularDynamicsConfig`

```typescript
interface MolecularDynamicsConfig {
  protein: string;
  ligand?: string;
  mdEngine: 'openmm' | 'ase';
  temperature: number;
  timestep: number;
  steps: number;
}
```

---

## Error Codes

### JSON-RPC Errors

| Code | Message | Description |
|------|---------|-------------|
| -32700 | Parse error | Invalid JSON |
| -32600 | Invalid Request | JSON-RPC format error |
| -32601 | Method not found | Unknown method |
| -32602 | Invalid params | Parameter validation failed |
| -32603 | Internal error | Server error |
| -32000 | PDB load failed | PDB file error |
| -32001 | Server start failed | Narupa server startup error |
| -32002 | Port in use | Port already allocated |

---

## Week 2-3 Expansion Plan

After Week 1 API testing, expand this document with:
- [ ] Full Python API documentation (method signatures, return types)
- [ ] Full Unity C# API documentation
- [ ] Code examples for each method
- [ ] Performance benchmarks
- [ ] Advanced usage patterns

---

**Status**: Basic API structure documented ✅ | Awaiting Week 1 test results to expand
