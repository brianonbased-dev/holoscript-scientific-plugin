# Python API Notes

**Week 1 - Day 1-2**
**Status**: To be filled after installation testing

## Narupa Python Server API

### Core Classes

#### `NanoVerImdApplication`

**Purpose**: Main application class for Narupa server

**Methods** (to be tested Day 1-2):
```python
# TODO: Test and document
app = NanoVerImdApplication.basic_server(simulation=None)
# - Parameters: TBD
# - Return type: TBD
# - Side effects: TBD
```

#### `OpenMMSimulation`

**Purpose**: Molecular dynamics simulation wrapper

**Methods** (to be tested Day 1-2):
```python
# TODO: Test and document
simulation = OpenMMSimulation.from_pdb(pdb_path)
# - Parameters: TBD
# - Return type: TBD
# - Atoms loaded: TBD
```

### Server Lifecycle

```python
# TODO: Document after testing

# 1. Create server
app = NanoVerImdApplication.basic_server()

# 2. Start server
app.server.start_server(port=38801)

# 3. Run (blocking)
app.run()

# 4. Cleanup
app.close()
```

### Performance Testing (Day 2)

**Test Cases**:
1. Small molecule (<100 atoms)
2. Protein (1,000-10,000 atoms)
3. Large complex (10,000+ atoms)

**Metrics to Record**:
- Load time (seconds)
- Frame update rate (FPS)
- Memory usage (MB)
- CPU usage (%)

### Data Structures

**Frame Data**:
```python
# TODO: Document frame structure
# - atom_positions: ?
# - atom_types: ?
# - bonds: ?
# - forces: ?
```

**Configuration**:
```python
# TODO: Document config options
# - temperature: Kelvin
# - timestep: femtoseconds
# - integrator: type?
```

## Integration Notes

### Process Communication

**Chosen Method**: stdin/stdout JSON-RPC

**Rationale**:
- Lowest latency
- No network overhead
- Simple protocol

**Message Format**:
```json
{
  "jsonrpc": "2.0",
  "method": "start_server",
  "params": {
    "pdb_path": "1ABC.pdb",
    "port": 38801
  },
  "id": 1
}
```

**Response Format**:
```json
{
  "jsonrpc": "2.0",
  "result": {
    "pid": 12345,
    "port": 38801,
    "num_atoms": 1234
  },
  "id": 1
}
```

## Week 1 Testing Checklist

- [ ] Install nanover-server
- [ ] Test basic_server()
- [ ] Test from_pdb()
- [ ] Measure load time for test PDB
- [ ] Measure frame rate
- [ ] Test server start/stop
- [ ] Document all method signatures
- [ ] Create example scripts

## Week 2 Implementation Plan

Based on Week 1 findings, implement:
1. Python bridge (`holoscript_narupa_bridge.py`)
2. JSON-RPC message handlers
3. Error handling
4. Logging
