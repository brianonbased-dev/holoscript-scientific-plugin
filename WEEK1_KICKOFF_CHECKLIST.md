# Week 1 Kickoff Checklist - Narupa Integration Plugin

**Start Date**: February 13, 2026
**Goal**: Complete infrastructure setup and API exploration by Feb 18

---

## Day 1: Feb 13, 2026 ✅ COMPLETED

### Morning: Project Infrastructure ✅

- [x] **Create GitHub repository**: `holoscript-scientific-plugin`
  - Repository: https://github.com/brianonbased-dev/holoscript-scientific-plugin
  - First commit: 57e8e9c "Week 1 Day 1: Complete infrastructure setup"

- [x] **Set up project structure**:
  - [x] src/ directory with TypeScript files
  - [x] python/ directory with bridge script
  - [x] docs/ directory with 7 documentation files
  - [x] examples/ directory with 3 .holo files
  - [x] tests/ directory with test stubs

- [x] **Initialize npm package**:
  - [x] package.json configured
  - [x] TypeScript 5.3.3 installed
  - [x] @types/node installed
  - [x] Build successful ✅

- [x] **Create initial README**:
  - [x] Project overview
  - [x] Installation guide
  - [x] Usage examples
  - [x] Development roadmap

### Afternoon: Narupa Installation & Testing ⏳ NEXT

**Backend Tasks** (Python):
- [ ] **Install Narupa server**:
  ```bash
  pip install nanover-server
  # Or from source:
  git clone https://github.com/IRL2/nanover-server-py
  cd nanover-server-py
  pip install -e .
  ```

- [ ] **Test basic server**:
  ```bash
  # Download test PDB
  wget https://files.rcsb.org/download/1ABC.pdb

  # Start server
  python -m nanover.app --pdb 1ABC.pdb --port 38801
  ```

- [ ] **Document Python API**:
  - [ ] Test `NanoVerImdApplication.basic_server()`
  - [ ] Test `OpenMMSimulation.from_pdb()`
  - [ ] Record method signatures in `docs/python-api-notes.md`

**Frontend Tasks** (Unity):
- [ ] **Install Narupa Unity client**:
  ```bash
  git clone https://github.com/IRL2/nanover-imd-vr
  cd nanover-imd-vr
  # Open in Unity Hub (2021.3+)
  ```

- [ ] **Build and test VR client**:
  - [ ] Open `NarupaIMD.unity` scene
  - [ ] Press Play in Unity Editor
  - [ ] Connect to `localhost:38801`
  - [ ] Verify 3D molecule appears

- [ ] **Document Unity client**:
  - [ ] Screenshot of molecule rendering
  - [ ] Note C# classes in `docs/unity-client-notes.md`

---

## Day 2-3: Feb 14-15 (API Documentation)

### Day 2: Python Server API Deep Dive

- [ ] **Document server lifecycle**
- [ ] **Profile simulation performance**:
  - [ ] 1K atoms: ___ atoms/sec, ___ FPS
  - [ ] 10K atoms: ___ atoms/sec, ___ FPS
  - [ ] 100K atoms: ___ atoms/sec, ___ FPS
- [ ] **Test PDB loading variations**:
  - [ ] Small molecule (<100 atoms)
  - [ ] Protein (1K-10K atoms)
  - [ ] Large complex (10K+ atoms)

### Day 3: Data Flow Mapping

- [ ] **Create data flow diagram**
- [ ] **Implement PDB → JSON helper**
- [ ] **Complete `docs/narupa-api-reference.md`** (20-30 pages)

---

## Day 4-5: Feb 16-17 (Architecture Design)

### Day 4: Integration Architecture

- [x] **Process management strategy**: Node.js `child_process.spawn()` ✅
- [x] **API contract design**: stdin/stdout JSON-RPC ✅
- [x] **Data schema design**: TypeScript interfaces ✅

### Day 5: Trait System Design

- [x] **`@narupa_integration` trait defined** ✅
- [x] **`@molecular_dynamics` trait defined** ✅
- [x] **`@interactive_forces` trait defined** ✅
- [x] **Trait specifications complete** ✅

---

## Success Criteria for Week 1

By Friday Feb 18, 2026:

| Criterion | Status |
|-----------|--------|
| ✅ GitHub repo created and initialized | ✅ DONE |
| ⏳ Narupa server runs locally | ⏳ PENDING |
| ⏳ Unity VR client connects to server | ⏳ PENDING |
| 🟡 API documentation started (20+ pages drafted) | 🟡 PARTIAL (framework done) |
| ✅ Architecture design document complete | ✅ DONE |
| ✅ Trait specifications defined | ✅ DONE |
| 🟡 Week 2 tasks planned | ✅ DONE |

**Overall Progress**: 60% complete (infrastructure done, testing pending)

---

## Files Created (Day 1)

### Source Code (5 files)
- [x] `src/types.ts` - Type definitions
- [x] `src/narupa-process-manager.ts` - Process lifecycle manager
- [x] `src/narupa-orchestrator.ts` - Multi-agent coordinator
- [x] `python/holoscript_narupa_bridge.py` - JSON-RPC bridge
- [x] `package.json` + `tsconfig.json` - Configuration

### Documentation (7 files, ~8,000 words)
- [x] `README.md` - Project overview
- [x] `docs/architecture-design.md` - System architecture
- [x] `docs/trait-specifications.md` - HoloScript traits
- [x] `docs/api-reference.md` - API documentation
- [x] `docs/narupa-installation.md` - Installation guide
- [x] `docs/python-api-notes.md` - Python API notes
- [x] `docs/unity-client-notes.md` - Unity client notes
- [x] `docs/week1-progress.md` - Progress tracking

### Examples (3 files)
- [x] `examples/simple-narupa.holo` - Basic viewer
- [x] `examples/parallel-docking.holo` - 4x parallel sims
- [x] `examples/hitl-docking.holo` - Interactive docking

### Tests (2 files)
- [x] `tests/process-manager.test.ts` - TypeScript tests
- [x] `tests/python-bridge.test.py` - Python tests

---

## Next Actions (Priority Order)

1. **Install Narupa server** (1-2 hours)
2. **Test basic server** (30 min)
3. **Clone Unity client** (30 min)
4. **Test Unity connection** (1 hour)
5. **Document findings** (1 hour)

**Estimated Time to Complete Week 1**: 8-12 hours remaining

---

## Blockers

**Current**: None
**Potential**:
- Narupa server installation issues → Solution: Use virtual environment
- Unity version mismatch → Solution: Use Unity 2021.3 LTS
- VR headset not available → Solution: Use desktop mode

---

## Week 2 Preview (Feb 19-25)

Based on completed architecture:
- [ ] Implement `holoscript_narupa_bridge.py` JSON-RPC handlers
- [ ] Implement `NarupaProcessManager.startServer()`
- [ ] First integration test (spawn Python process)
- [ ] End-to-end test (HoloScript → Python → Narupa)

---

**Repository**: https://github.com/brianonbased-dev/holoscript-scientific-plugin
**Latest Commit**: 57e8e9c
**TypeScript Build**: ✅ Passing
**Status**: Week 1 Day 1 Complete ✅
