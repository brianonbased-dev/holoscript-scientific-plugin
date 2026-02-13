# HoloScript Trait Specifications

**Week 1 - Day 5**
**Last Updated**: Feb 13, 2026
**Status**: Initial specification draft

## Overview

This document defines the HoloScript traits for Narupa molecular dynamics integration.

## Core Traits

### `@narupa_integration`

**Purpose**: Integrate a Narupa server for molecular visualization

**Category**: Scientific Computing

**Parameters**:

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `source` | string | Yes | - | Path to PDB file |
| `server_port` | number | No | 38801 | Narupa server port |

**Example Usage**:
```holoscript
object "Protein Viewer" @narupa_integration {
  source: "1ABC.pdb",
  server_port: 38801,
  position: [0, 1.5, -2]
}
```

**Compilation Behavior**:
1. Validate PDB file exists
2. Allocate port (default: 38801)
3. Spawn Python process
4. Start Narupa server
5. Wait for server ready signal
6. Spawn Unity client (if not already running)

**Validation Rules**:
- `source` must be a valid PDB file path
- `server_port` must be in range 1024-65535
- Port must not be already in use

**Error Cases**:
- PDB file not found → Compilation error
- Port already in use → Auto-increment to next available
- Python bridge failed → Compilation error with details

---

### `@molecular_dynamics`

**Purpose**: Run molecular dynamics simulation with custom parameters

**Category**: Scientific Computing

**Parameters**:

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `protein` | string | Yes | - | Protein PDB file |
| `ligand` | string | No | - | Ligand molecule file |
| `md_engine` | 'openmm' \| 'ase' | No | 'openmm' | MD engine |
| `temperature` | number | No | 300 | Temperature (Kelvin) |
| `timestep` | number | No | 2 | Timestep (femtoseconds) |
| `steps` | number | No | 100000 | Total simulation steps |
| `server_port` | number | No | auto | Server port (auto-allocated) |

**Example Usage**:
```holoscript
object "Docking Simulation" @molecular_dynamics {
  protein: "receptor.pdb",
  ligand: "compound_A.mol",
  md_engine: "openmm",
  temperature: 300,
  timestep: 2,
  steps: 100000,
  position: [-2, 1.5, -3]
}
```

**Compilation Behavior**:
1. Validate protein and ligand files
2. Auto-allocate port if not specified
3. Spawn Python process with MD config
4. Start simulation in background
5. Emit progress events

**Validation Rules**:
- `protein` must be valid PDB file
- `ligand` (if provided) must be .mol or .sdf format
- `temperature` must be > 0 Kelvin
- `timestep` must be > 0 femtoseconds
- `steps` must be > 0

**Error Cases**:
- Invalid protein/ligand file → Compilation error
- Unsupported `md_engine` → Compilation error
- Invalid parameter range → Compilation error with suggestion

---

### `@interactive_forces`

**Purpose**: Enable VR controller force feedback on molecules

**Category**: VR Interaction

**Parameters**:

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `force_enabled` | boolean | No | true | Enable force feedback |
| `force_scale` | number | No | 1.0 | Force multiplier |

**Example Usage**:
```holoscript
object "Interactive Protein" @narupa_integration @interactive_forces {
  source: "target.pdb",
  force_enabled: true,
  force_scale: 1.0
}
```

**Compilation Behavior**:
1. Enable force feedback in Narupa server
2. Configure Unity client to send force data
3. Set force scaling parameters

**Validation Rules**:
- `force_scale` must be > 0
- Can only be used with `@narupa_integration` or `@molecular_dynamics`

**Error Cases**:
- Used without Narupa trait → Compilation error
- Invalid force_scale → Compilation warning, default to 1.0

---

## Trait Combinations

### `@narupa_integration` + `@interactive_forces`

**Use Case**: Interactive VR protein manipulation

```holoscript
object "VR Protein" @narupa_integration @interactive_forces {
  source: "protein.pdb",
  force_enabled: true,
  force_scale: 0.5
}
```

### `@molecular_dynamics` + `@grabbable`

**Use Case**: Human-in-the-loop docking

```holoscript
object "Drug Ligand" @molecular_dynamics @grabbable {
  protein: "receptor.pdb",
  ligand: "drug.mol",
  user_controlled: true
}
```

### `@molecular_dynamics` + `@glowing` + `@translucent`

**Use Case**: Highlight active site

```holoscript
object "Active Site" @molecular_dynamics @glowing @translucent {
  protein: "enzyme.pdb",
  color: "#00ff00",
  opacity: 0.3
}
```

---

## Advanced Traits (Week 4+)

### `@parallel_docking` (Future)

**Purpose**: Run multiple docking simulations in parallel

```holoscript
object "Parallel Docking" @parallel_docking {
  protein: "receptor.pdb",
  ligands: ["compound_A.mol", "compound_B.mol", "compound_C.mol"],
  max_parallel: 4
}
```

### `@trajectory_replay` (Future)

**Purpose**: Replay saved MD trajectory

```holoscript
object "Trajectory Viewer" @trajectory_replay {
  trajectory_file: "simulation.dcd",
  topology_file: "protein.pdb",
  playback_speed: 1.0
}
```

### `@energy_monitor` (Future)

**Purpose**: Display binding energy in real-time

```holoscript
object "Energy Display" @energy_monitor @ui_panel {
  target_object: "Docking Simulation",
  update_frequency: 10  // Hz
}
```

---

## Implementation Notes

### Week 3 Implementation Priority

1. ✅ `@narupa_integration` (basic)
2. ✅ `@molecular_dynamics` (core functionality)
3. ⏳ `@interactive_forces` (depends on Unity integration)

### Week 4 Implementation Priority

4. ⏳ `@parallel_docking` (multi-agent orchestration)
5. ⏳ `@trajectory_replay` (playback system)

### Week 5+ Implementation

6. ⏳ `@energy_monitor` (analysis features)
7. ⏳ Advanced parameter tuning
8. ⏳ Performance optimizations

---

## Trait Metadata

### Trait Registry (HoloScript Compiler)

```typescript
export const NARUPA_TRAITS = {
  narupa_integration: {
    category: 'scientific-computing',
    version: '0.1.0',
    requires: ['python', 'narupa-server'],
    conflicts: [],
    schema: NarupaIntegrationSchema
  },
  molecular_dynamics: {
    category: 'scientific-computing',
    version: '0.1.0',
    requires: ['python', 'narupa-server', 'openmm'],
    conflicts: [],
    schema: MolecularDynamicsSchema
  },
  interactive_forces: {
    category: 'vr-interaction',
    version: '0.1.0',
    requires: ['narupa_integration'],
    conflicts: [],
    schema: InteractiveForcesSchema
  }
};
```

### Schema Definitions

```typescript
const NarupaIntegrationSchema = z.object({
  source: z.string(),
  server_port: z.number().min(1024).max(65535).optional()
});

const MolecularDynamicsSchema = z.object({
  protein: z.string(),
  ligand: z.string().optional(),
  md_engine: z.enum(['openmm', 'ase']).default('openmm'),
  temperature: z.number().positive().default(300),
  timestep: z.number().positive().default(2),
  steps: z.number().positive().default(100000),
  server_port: z.number().min(1024).max(65535).optional()
});

const InteractiveForcesSchema = z.object({
  force_enabled: z.boolean().default(true),
  force_scale: z.number().positive().default(1.0)
});
```

---

## Testing Strategy

### Trait Parsing Tests

```typescript
describe('@narupa_integration', () => {
  it('should parse basic usage', () => {
    const ast = parseHoloScript(`
      object "Test" @narupa_integration {
        source: "test.pdb"
      }
    `);
    expect(ast.objects[0].traits).toContain('narupa_integration');
  });

  it('should validate PDB file exists', () => {
    expect(() => compile(`
      object "Test" @narupa_integration {
        source: "nonexistent.pdb"
      }
    `)).toThrow('PDB file not found');
  });
});
```

### Integration Tests

```typescript
describe('Narupa integration', () => {
  it('should start server with @narupa_integration', async () => {
    const scene = await compileAndRun('simple-narupa.holo');
    const server = scene.narupaServers[0];
    expect(server.running).toBe(true);
    expect(server.port).toBe(38801);
  });
});
```

---

## API Reference

### TypeScript Compiler Hooks

```typescript
// Called when @narupa_integration is detected
async function onNarupaIntegrationTrait(
  object: HoloScriptObject,
  trait: NarupaIntegrationTrait
): Promise<void> {
  const server = await processManager.startServer({
    pdbPath: trait.source,
    port: trait.server_port || 38801
  });
  object.metadata.narupaServer = server;
}
```

### Python Bridge API

```python
# JSON-RPC method for @molecular_dynamics
def start_md_simulation(params):
    """
    Start molecular dynamics simulation

    Args:
        params: {
            'protein': str,
            'ligand': str | None,
            'md_engine': 'openmm' | 'ase',
            'temperature': float,
            'timestep': float,
            'steps': int,
            'port': int
        }

    Returns:
        {
            'pid': int,
            'port': int,
            'status': 'running'
        }
    """
```

---

## Roadmap

### Week 1 (Current)
- ✅ Trait specifications defined
- ✅ Schema validation rules written

### Week 3
- [ ] Implement `@narupa_integration` trait
- [ ] Implement `@molecular_dynamics` trait
- [ ] Basic compiler integration

### Week 4
- [ ] Implement `@interactive_forces` trait
- [ ] Trait composition rules
- [ ] Error message improvements

### Week 5+
- [ ] Advanced traits (`@parallel_docking`, etc.)
- [ ] Performance optimization
- [ ] Documentation polish

---

**Status**: Trait specifications complete ✅ | Ready for Week 3 implementation
