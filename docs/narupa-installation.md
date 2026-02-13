# Narupa Installation Guide

**Week 1 - Day 1 Afternoon**
**Last Updated**: Feb 13, 2026

## Overview

This guide covers the installation and basic testing of Narupa server (Python) and client (Unity).

## Python Server Installation

### Option 1: Install from PyPI (Recommended)

```bash
# Create virtual environment
python -m venv narupa-env
source narupa-env/bin/activate  # Windows: narupa-env\Scripts\activate

# Install nanover-server
pip install nanover-server
```

### Option 2: Install from Source

```bash
# Clone repository
git clone https://github.com/IRL2/nanover-server-py
cd nanover-server-py

# Install in development mode
pip install -e .
```

### Verify Installation

```bash
# Check version
python -c "import nanover; print(nanover.__version__)"

# Expected output: 0.x.x
```

## Basic Server Test

### Step 1: Download Test PDB File

```bash
# Download a small protein structure
wget https://files.rcsb.org/download/1ABC.pdb

# Or use curl
curl -O https://files.rcsb.org/download/1ABC.pdb
```

### Step 2: Start Narupa Server

```bash
# Start server with PDB file
python -m nanover.app --pdb 1ABC.pdb --port 38801

# Expected output:
# "Server started on port 38801"
# "Loaded 1234 atoms from 1ABC.pdb"
# "Waiting for client connections..."
```

### Step 3: Test Server Connectivity

```bash
# In another terminal, test connection
curl http://localhost:38801/health

# Or use Python
python -c "import socket; s = socket.socket(); s.connect(('localhost', 38801)); print('Connected!')"
```

## Unity Client Installation

### Prerequisites

- Unity Hub installed
- Unity 2021.3 LTS or newer
- VR headset (optional - can test in desktop mode)

### Installation Steps

```bash
# Clone Narupa VR client
git clone https://github.com/IRL2/nanover-imd-vr
cd nanover-imd-vr
```

### Open in Unity

1. Open Unity Hub
2. Click "Add" → Select `nanover-imd-vr` folder
3. Choose Unity version 2021.3+
4. Click project to open

### Build and Test

1. Open scene: `Assets/Scenes/NarupaIMD.unity`
2. Press Play button in Unity Editor
3. In Game view, click "Connect"
4. Enter: `localhost:38801`
5. Verify 3D molecule appears

### Desktop Mode Testing (No VR Headset)

If no VR headset available:
1. File → Build Settings → Platform → PC, Mac & Linux Standalone
2. Build and run
3. Use mouse/keyboard controls

## Python API Documentation

### Key Classes to Test

```python
from nanover.app import NanoVerImdApplication
from nanover.omm import OpenMMSimulation

# Basic server
app = NanoVerImdApplication.basic_server()
app.server.start_server(port=38801)

# Load PDB file
simulation = OpenMMSimulation.from_pdb('1ABC.pdb')
app.run()  # Blocking call

# Cleanup
app.close()
```

### Method Signatures (Week 1 - Day 2)

To be documented after testing:
- [ ] `NanoVerImdApplication.basic_server()`
- [ ] `OpenMMSimulation.from_pdb()`
- [ ] `app.server.start_server()`
- [ ] `app.run()`
- [ ] Frame update rate API
- [ ] Force feedback API

## Common Installation Issues

### Issue: `nanover` module not found

**Solution**:
```bash
# Ensure virtual environment is activated
source narupa-env/bin/activate

# Reinstall
pip install --upgrade nanover-server
```

### Issue: PDB file won't load

**Solution**:
```bash
# Verify PDB format
head -n 5 1ABC.pdb

# Should see:
# HEADER    ...
# TITLE     ...
# ATOM      1  N   ...
```

### Issue: Unity won't connect to server

**Solution**:
1. Check server is running: `netstat -an | grep 38801`
2. Verify firewall allows port 38801
3. Try `127.0.0.1:38801` instead of `localhost:38801`

## Performance Benchmarks (Week 1 - Day 2)

To be filled after testing:
- [ ] Atoms/second for 1K atoms: TBD
- [ ] Atoms/second for 10K atoms: TBD
- [ ] Atoms/second for 100K atoms: TBD
- [ ] Frame update rate: TBD (target 30-60 FPS)
- [ ] Memory per atom: TBD
- [ ] VR latency: TBD (target <16ms)

## Next Steps

After successful installation:
1. Document Python API (Day 2)
2. Measure performance benchmarks (Day 2-3)
3. Test PDB loading variations (Day 2)
4. Document Unity C# API (Day 2)
5. Create data flow diagram (Day 3)

## References

- [Narupa Documentation](https://irl2.github.io/nanover-server-py/)
- [Narupa GitHub](https://github.com/IRL2/nanover-server-py)
- [Unity VR Client](https://github.com/IRL2/nanover-imd-vr)
- [PDB File Format](https://www.rcsb.org/pdb/static.do?p=file_formats/pdb/index.html)
