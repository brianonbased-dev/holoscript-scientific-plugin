# HoloScript Scientific Plugin - Narupa Integration

Multi-agent orchestration for VR-based drug discovery using Narupa molecular dynamics.

## Status: Week 1 - Infrastructure Setup

**Current Week**: Week 1 (Feb 12-18, 2026)
**Focus**: Infrastructure setup and API exploration
**Progress**: ✅ Repository created, project structure initialized

## Overview

This plugin bridges HoloScript with Narupa, enabling VR-based interactive molecular dynamics simulations. Scientists can visualize and manipulate proteins, run drug docking simulations, and explore molecular interactions in immersive 3D environments.

### Key Features (Planned)

- **VR Molecular Visualization**: View proteins and molecules in 3D VR
- **Interactive Docking**: Manually guide ligands to binding sites
- **Parallel Simulations**: Run multiple docking simulations simultaneously
- **Real-time MD**: Live molecular dynamics with force feedback
- **Multi-agent Orchestration**: Coordinate multiple Narupa servers

## Project Structure

```
holoscript-scientific-plugin/
├── src/                          # TypeScript source
│   ├── narupa-process-manager.ts # Python process lifecycle
│   ├── narupa-orchestrator.ts    # Multi-agent coordination
│   └── types.ts                  # TypeScript definitions
├── python/                       # Python bridge
│   └── holoscript_narupa_bridge.py
├── docs/                         # Documentation
│   ├── api-reference.md          # API documentation
│   ├── architecture-design.md    # Architecture decisions
│   └── trait-specifications.md   # HoloScript trait specs
├── examples/                     # Example .holo files
│   ├── simple-narupa.holo        # Basic protein viewer
│   ├── parallel-docking.holo     # 4x parallel docking
│   └── hitl-docking.holo         # Human-in-the-loop
└── tests/                        # Test suite
```

## Installation

### Prerequisites

- Node.js 18+
- Python 3.8+
- Unity 2021.3+ (for VR client)
- VR Headset (optional, can test in desktop mode)

### Quick Start (Week 2+)

```bash
# Clone repository
git clone https://github.com/brianonbased-dev/holoscript-scientific-plugin
cd holoscript-scientific-plugin

# Install Node dependencies
npm install

# Install Python dependencies
pip install nanover-server  # Week 1 - installation testing phase

# Build TypeScript
npm run build
```

## Usage (Week 3+)

### Simple Protein Visualization

```holoscript
// examples/simple-narupa.holo
object "Protein Viewer" @narupa_integration {
  source: "1ABC.pdb",
  server_port: 38801,
  position: [0, 1.5, -2]
}
```

### Interactive Docking

```holoscript
// examples/hitl-docking.holo
object "Target Protein" @narupa_integration @interactive_forces {
  source: "target_protein.pdb",
  server_port: 38801,
  force_enabled: true
}

object "Drug Ligand" @molecular_dynamics @grabbable {
  protein: "target_protein.pdb",
  ligand: "drug_candidate.mol",
  user_controlled: true
}
```

## Development Roadmap

### Week 1 (Feb 12-18) - ✅ IN PROGRESS
- [x] Repository setup
- [x] Project structure
- [x] npm initialization
- [ ] Narupa server installation testing
- [ ] API documentation started
- [ ] Architecture design

### Week 2 (Feb 19-25)
- [ ] Python bridge implementation
- [ ] Process manager (TypeScript)
- [ ] First integration test

### Week 3 (Feb 26 - Mar 4)
- [ ] Basic trait implementation (`@narupa_integration`)
- [ ] Unity client integration
- [ ] Simple VR test

### Week 4 (Mar 5-11)
- [ ] Advanced traits (`@molecular_dynamics`, `@interactive_forces`)
- [ ] Multi-agent orchestration

### Week 5-8
- [ ] Parallel docking
- [ ] Performance optimization
- [ ] Production deployment

## Documentation

- [API Reference](docs/api-reference.md) - Python and TypeScript APIs
- [Architecture Design](docs/architecture-design.md) - System architecture
- [Trait Specifications](docs/trait-specifications.md) - HoloScript trait definitions

## Contributing

This project is in active development (Week 1). Contributions welcome after initial implementation is complete.

## License

MIT

## Acknowledgments

- [Narupa](https://irl2.github.io/nanover-server-py/) - Interactive molecular dynamics framework
- [HoloScript](https://github.com/brianonbased-dev/HoloScript) - Spatial computing language
- Research supported by University of Bristol Interactive Realities Lab

---

**Week 1 Status**: Infrastructure complete ✅ | API testing in progress 🔄
