# Test Suite

Week 1 integration tests for HoloScript Narupa Plugin.

## Running Tests

### Integration Test (TypeScript ↔ Python Bridge)

Tests end-to-end JSON-RPC communication:

```bash
npx tsx tests/integration-test.ts
```

**What it tests**:
- Bridge initialization
- JSON-RPC communication
- Server listing
- Error handling (without Narupa SDK)
- Graceful shutdown

**Expected result**: ✅ All tests pass (stub mode without Narupa SDK)

---

### Orchestrator Test (Dependency Graphs & HITL)

Tests advanced orchestration features:

```bash
npx tsx tests/orchestrator-test.ts
```

**What it tests**:
- Dependency graph construction
- Parallel task execution
- Human-in-the-loop (HITL) approval gates
- Event-driven monitoring
- Task retry logic
- Graceful error handling

**Expected result**: Demonstrates orchestration flow (tasks fail without Narupa SDK)

---

## Test Status

| Test | Status | Narupa Required |
|------|--------|-----------------|
| integration-test.ts | ✅ Passing | No (stub mode) |
| orchestrator-test.ts | ✅ Passing | No (demonstrates flow) |
| process-manager.test.ts | ⏳ Pending | Week 2 |
| python-bridge.test.py | ⏳ Pending | Week 2 |

## Week 1 Test Coverage

**Current**: Stub mode testing (no Narupa SDK required)
- ✅ JSON-RPC communication
- ✅ Process lifecycle
- ✅ Orchestration logic
- ✅ Error handling

**Week 2**: Full integration testing (with Narupa SDK)
- ⏳ Real Narupa server startup
- ⏳ PDB file loading
- ⏳ Unity client connection
- ⏳ Performance benchmarking

## Installing Narupa SDK

For full integration tests with real Narupa servers:

```bash
pip install nanover-server
```

Then re-run tests to see full functionality.

## Test Coverage Goals

- Week 1: Infrastructure & stub testing ✅
- Week 2: Full integration testing
- Week 3: Unity client integration
- Week 4: Performance benchmarking
- Week 5: Load testing (100K+ atoms)
