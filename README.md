# @holoscript/holoscript-scientific-plugin

HoloScript plugin for VR-based molecular dynamics and scientific simulation — part of the [HoloScript ecosystem](https://holoscript.net).

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Bridge HoloScript with interactive molecular dynamics via [Narupa/NanoVer](https://irl2.github.io/nanover-server-py/). Visualize proteins, run drug-docking simulations, and manipulate molecular systems in immersive 3D.

## Features

- VR molecular visualization (proteins, ligands, small molecules)
- Interactive ligand docking — manually guide molecules to binding sites
- Parallel simulation runs across multiple Narupa servers
- Real-time molecular dynamics with force feedback
- Multi-agent orchestration for coordinated simulation workflows

## Installation

```bash
git clone https://github.com/brianonbased-dev/holoscript-scientific-plugin
cd holoscript-scientific-plugin
npm install
pip install nanover-server
npm run build
```

## Usage

```holoscript
object "Protein Viewer" @narupa_integration {
  source: "1ABC.pdb",
  server_port: 38801,
  position: [0, 1.5, -2],
}
```

```holoscript
object "Target Protein" @narupa_integration @interactive_forces {
  source: "target_protein.pdb",
  server_port: 38801,
  force_enabled: true,
}

object "Drug Ligand" @molecular_dynamics @grabbable {
  protein: "target_protein.pdb",
  ligand: "drug_candidate.mol",
  user_controlled: true,
}
```

## Requirements

- Node.js 18+
- Python 3.8+
- [NanoVer server](https://irl2.github.io/nanover-server-py/)

## Status

Experimental. Core Narupa integration and trait scaffolding are in place. Expect breaking changes while the API stabilizes.

## License

MIT © HoloScript Contributors