# CSQS comparison — LAST STOP 66 / THE PINK CITY

13 November 2026. Actual source audit preceded implementation; see [source-audit.md](source-audit.md). The USA HTML has SHA-256 `4e05b65d3ef8da5a2ac0bbb58291c1b5f4dabf5f166eda51b603f09a9a06ef8f` and was not modified. India replaces the existing small scene directly, with no separate old-scene backup. This is a fictional Jaipur-inspired district; the photographs inform its vocabulary, not measured dimensions.

## Required comparison

| Category | USA Baseline | India Implementation | Result |
|---|---|---|---|
| Geometry | 192,868 submitted triangles/frame; 92 renderer geometries. Diner, mart and canopy reviewed near/default. | 779,976 submitted triangles/frame; 63 renderer geometries. Real arch voids, bracket-supported jharokhas, lattice, open chhatris, stocked interiors and separate three-wheel bodies inspected near/default. | Pass for meaningful construction depth. Higher polygon count alone does not establish superior visual quality. |
| Lighting | Three interpolated modes, emissive/local lighting, 2048 primary shadow map; current source uses PCFShadowMap. | Day/Sunset/Night, sunset initially, PCFSoftShadowMap 2048 desktop / 1024 economy configuration; warm shop interiors and selective windows; daytime window emission measured at zero. | Pass. All three rendered and inspected; restrained bloom, no global orange filter. |
| Actors | 30 articulated people in high profile; original pose/batch system. | 28 high / 16 economy; contemporary and selected traditional dress, walking, shopping, seated tea, conversation and crossing activities. Minimum sampled separation 0.801 units. | Pass for observed movement and proportion. Not a guarantee against every possible continuous contact. |
| Traffic | 8 moving American vehicles; controller and actor source audited, live motion seen in baseline renders. | 7 vehicles: 4 green/yellow autos, 2 scooters, 1 compact car; parked scooters/bicycles. Inherited braking, safe spacing and clearance phases, plus all-route turn limiting and front-wheel steering. 120 s sample: zero vehicle/obstacle, pedestrian/vehicle or vehicle/vehicle envelope hits. | Pass in tested routes and samples. One controlled crossing, not a general-purpose Indian road simulator. |
| Performance | Average 60.0 FPS; low-percentile 59.5 FPS; 373 draw calls, 52 textures. | Average 60.0 FPS; low-percentile 59.5 FPS; 280 draw calls, 51 textures. Emulated economy: 163 calls; architecture retained. | Pass on test device. Physical phone performance, GPU time and texture-byte allocation unverified. |
| Interaction | Time, Orbit, three-state traffic/people, mouse zoom and Reset clicked/tested. | Actual pause/hide/restore, keyboard 1/2/3, Space/R, reset, reduced motion and safe deferred restoration tested. Homepage card, globe finder, passport and local backed likes tested. Offline HTML makes zero HTTP(S) requests. | Pass. 71 repository tests pass; no blocking browser errors in the recorded checks. |

## Test conditions and limits

Both desktop samples: installed Chrome headless, 1440 × 1000, device scale factor 1, high profile, preferred Sunset mode, same machine. India reports `ANGLE (Apple, ANGLE Metal Renderer: Apple M5, Unspecified Version)`. Frame rates come from requestAnimationFrame wall-clock intervals over 5–6 seconds, not GPU timings. Low-percentile FPS is 1000 divided by the 99th-percentile frame interval. Vsync limits both samples around 60 FPS; this does not establish equal GPU headroom. Renderer counters include shadow and post-processing submissions. Actual GPU byte allocation is unavailable through renderer.info and remains unverified.

India has more geometric detail and fewer draw calls, but the comparison also required near views, readable signs, mode-specific lighting and functioning behavior. No claim that every subjective aspect exceeds the American reference is made. Controls and typography were checked at 390 and 320 pixels; both retain all nine buildings with 16 actors. Real mobile hardware remains untested.

Representative evidence: default, haveli, bazaar, courtyard, rear and sixteen orbit positions; Day/Sunset/Night; close tea and vehicle views. Camera inspections keep the camera outside the scene at normal orbit distances. The sealed base was inspected from the rear and shallow angles. Raw machine-readable observations are in [validation.json](validation.json).

## Repairs made during verification

- True shop openings and modeled stock, rather than opaque window pictures; a real side doorway at the exterior stair landing.
- Local shop lights retargeted under arcades; day window emission remains zero.
- Sole-height grounding, registered parked-vehicle footprints, wider passing lanes, smooth pedestrian turns and front-wheel steering.
- Hidden people restore after a conflicting vehicle clears; the UI reports this waiting state instead of suggesting an inactive control.
- Canvas keyboard shortcuts corrected with anchored element-tag matching and three regression tests.
- Shadow maps and postprocessing passes explicitly disposed. The final disposal check reports zero geometries, zero textures and no remaining canvas in that renderer.
- Official Noto Sans Devanagari WOFF2 subsets embedded with their SIL OFL license; Hindi and Latin are loaded before drawing signs. No external runtime font dependency.

Economy retains every architectural block. It currently disables dynamic shadow rendering (the lower 1024 map setting remains available in the light rig), caps DPR at 1.25 and uses 16 people. The reported narrow-viewport sample used device scale factor 1.
