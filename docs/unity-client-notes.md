# Unity Client Notes

**Week 1 - Day 1-2**
**Status**: To be filled after Unity installation testing

## Narupa Unity VR Client

### Repository
- **GitHub**: https://github.com/IRL2/nanover-imd-vr
- **Unity Version**: 2021.3+ LTS
- **VR Support**: OpenXR, Oculus, SteamVR

## Installation Checklist

- [ ] Unity Hub installed
- [ ] Unity 2021.3 LTS installed
- [ ] Repository cloned
- [ ] Project opens without errors
- [ ] `NarupaIMD.unity` scene loads
- [ ] Desktop mode tested
- [ ] VR mode tested (if headset available)

## Key C# Classes

### `NarupaIMDClient`

**Purpose**: Network client for connecting to Narupa server

**Methods** (to be tested Day 2):
```csharp
// TODO: Test and document
var client = new NarupaIMDClient();
client.Connect(hostname, port);
// - Connection timeout: ?
// - Reconnection strategy: ?
```

**Events**:
```csharp
// TODO: Document event signatures
client.FrameReceived += OnFrameReceived;
client.Connected += OnConnected;
client.Disconnected += OnDisconnected;
```

### `MoleculeRenderer`

**Purpose**: Renders 3D molecule in Unity

**Methods** (to be tested Day 2):
```csharp
// TODO: Test and document
renderer.UpdatePositions(positions);
renderer.SetAtomTypes(types);
renderer.SetBonds(bonds);
// - Rendering performance: ?
```

### `ForceController`

**Purpose**: VR controller force feedback

**Methods** (to be tested Day 2):
```csharp
// TODO: Test and document
controller.ApplyForce(atomIndex, position, force);
// - Force magnitude limits: ?
// - Update frequency: ?
```

## Performance Benchmarks

### Latency Measurement (Day 2-3)

**Target**: <16ms (60 FPS VR requirement)

**Test Cases**:
1. VR controller input → Narupa server → visual update
2. Atom position change → renderer update
3. Force feedback loop

**Results** (to be filled):
- [ ] Input latency: TBD
- [ ] Rendering latency: TBD
- [ ] Total round-trip: TBD

### Frame Rate (Day 2)

**Target**: 60-90 FPS (VR requirement)

**Test with**:
- [ ] 100 atoms: TBD FPS
- [ ] 1,000 atoms: TBD FPS
- [ ] 10,000 atoms: TBD FPS
- [ ] 100,000 atoms: TBD FPS

## Scene Hierarchy

```
NarupaIMD Scene
├── [VRCamera] - Player head tracking
├── [LeftController] - Left VR controller
├── [RightController] - Right VR controller
├── [MoleculeRenderer] - 3D molecule visualization
├── [NetworkClient] - Narupa connection
└── [UI Canvas] - Connection status
```

## Unity Build Settings

### Desktop Mode (No VR)

```
Platform: PC, Mac & Linux Standalone
Architecture: x64
Target: Standalone
```

### VR Mode

```
XR Plugin Management:
- OpenXR ✓
- Oculus ✓
- Windows Mixed Reality ✓
```

## Integration Strategy

### Option A: Bundle Unity Client in npm Package ✅ RECOMMENDED

**Pros**:
- Better UX - one-step install
- Version synchronization
- Easier updates

**Cons**:
- Larger package size (~50-100 MB)

**Implementation**:
1. Build Unity client as Standalone
2. Include binary in `dist/unity-client/`
3. HoloScript compiler spawns client on demand

### Option B: Separate Unity Project

**Pros**:
- Smaller npm package
- Easier Unity customization

**Cons**:
- Users must install separately
- Version mismatch risk

## Week 1 Testing Screenshots

To be added after installation:
- [ ] Unity Editor with molecule loaded
- [ ] Desktop mode gameplay
- [ ] VR headset view (if available)
- [ ] Connection UI

## Week 2 Integration Tasks

Based on Week 1 findings:
1. Build Unity client as standalone
2. Create distribution package
3. Automate client spawning from HoloScript
4. Handle client lifecycle (start/stop)

## Desktop Controls (No VR Headset)

**Movement**:
- W/A/S/D - Move camera
- Mouse - Look around
- Mouse wheel - Zoom

**Interaction**:
- Left click - Select atom
- Right click - Apply force
- Shift + drag - Rotate molecule

## VR Controls

**Movement**:
- Thumbstick - Teleport
- Grip buttons - Grab molecule

**Interaction**:
- Trigger - Select atom
- Grip + move - Apply force to atom

## Common Issues

### Issue: Unity won't open project

**Solution**:
```bash
# Delete Library folder and reopen
rm -rf Library/
# Unity will rebuild metadata
```

### Issue: VR headset not detected

**Solution**:
1. Edit → Project Settings → XR Plugin Management
2. Ensure OpenXR is enabled
3. Restart Unity

### Issue: Molecule doesn't render

**Solution**:
1. Check server is running on port 38801
2. Verify connection status in Console
3. Check for shader errors

## Performance Optimization Notes

**To test Day 3**:
- [ ] Instanced rendering for atoms
- [ ] Level of detail (LOD) system
- [ ] Frustum culling
- [ ] Occlusion culling

## Next Steps

After Week 1 Unity testing:
1. Document all C# API signatures
2. Measure performance benchmarks
3. Create screenshot gallery
4. Design Unity client distribution strategy
5. Plan Week 2 integration work
