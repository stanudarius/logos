# Graph Report - .  (2026-07-03)

## Corpus Check
- cluster-only mode — file stats not available

## Summary
- 146 nodes · 181 edges · 14 communities
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 4 edges (avg confidence: 0.5)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `6062d95a`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- [[_COMMUNITY_ThoughtAtom.tsx|ThoughtAtom.tsx]]
- [[_COMMUNITY_types.ts|types.ts]]
- [[_COMMUNITY_compilerOptions|compilerOptions]]
- [[_COMMUNITY_dependencies|dependencies]]
- [[_COMMUNITY_App.tsx|App.tsx]]
- [[_COMMUNITY_package.json|package.json]]
- [[_COMMUNITY_server.ts|server.ts]]
- [[_COMMUNITY_devDependencies|devDependencies]]
- [[_COMMUNITY_ReadingTrailsDashboard.tsx|ReadingTrailsDashboard.tsx]]
- [[_COMMUNITY_ZenMode.tsx|ZenMode.tsx]]
- [[_COMMUNITY_SocraticChat.tsx|SocraticChat.tsx]]

## God Nodes (most connected - your core abstractions)
1. `compilerOptions` - 16 edges
2. `FeedCard` - 9 edges
3. `scripts` - 6 edges
4. `SavedVaultCard` - 6 edges
5. `supabase` - 4 edges
6. `LayoutVariant` - 4 edges
7. `Node` - 4 edges
8. `PhoneEmulatorProps` - 3 edges
9. `ThoughtAtomProps` - 3 edges
10. `GraphEdge` - 3 edges

## Surprising Connections (you probably didn't know these)
- `CommonplaceBookProps` --references--> `SavedVaultCard`  [EXTRACTED]
  src/components/CommonplaceBook.tsx → src/types.ts
- `ThoughtStreamProps` --references--> `FeedCard`  [EXTRACTED]
  src/components/ThoughtStream.tsx → src/types.ts
- `PhoneEmulatorProps` --references--> `FeedCard`  [EXTRACTED]
  src/components/PhoneEmulator.tsx → src/types.ts
- `PhoneEmulatorProps` --references--> `SavedVaultCard`  [EXTRACTED]
  src/components/PhoneEmulator.tsx → src/types.ts
- `ThoughtAtomProps` --references--> `FeedCard`  [EXTRACTED]
  src/components/ThoughtAtom.tsx → src/types.ts

## Import Cycles
- None detected.

## Communities (14 total, 0 thin omitted)

### Community 0 - "ThoughtAtom.tsx"
Cohesion: 0.14
Nodes (14): AnnotationInput, CommonplaceBookProps, PhoneEmulatorProps, descAnim, ParallaxBackground(), renderLayout(), ThoughtAtom(), ThoughtAtomProps (+6 more)

### Community 1 - "types.ts"
Cohesion: 0.13
Nodes (13): @types/node, ConstellationEdge, ConstellationMapProps, ConstellationNode, EDGES, NODES, INTERSTITIAL_CARDS, interstitialDeck (+5 more)

### Community 2 - "compilerOptions"
Cohesion: 0.11
Nodes (17): compilerOptions, allowImportingTsExtensions, allowJs, esModuleInterop, experimentalDecorators, isolatedModules, jsx, lib (+9 more)

### Community 3 - "dependencies"
Cohesion: 0.13
Nodes (15): dependencies, dotenv, express, express-rate-limit, @google/genai, helmet, lucide-react, motion (+7 more)

### Community 4 - "App.tsx"
Cohesion: 0.24
Nodes (5): AuthScreen(), AuthScreenProps, ConstellationMap, ResetPasswordScreenProps, supabase

### Community 5 - "package.json"
Cohesion: 0.18
Nodes (10): name, private, scripts, build, clean, dev, lint, start (+2 more)

### Community 6 - "server.ts"
Cohesion: 0.18
Nodes (9): ai, app, cardsDatabase, chatSchema, DB_PATH, exportSchema, geminiLimiter, generateSchema (+1 more)

### Community 7 - "devDependencies"
Cohesion: 0.20
Nodes (10): devDependencies, autoprefixer, cross-env, esbuild, tailwindcss, @tailwindcss/vite, tsx, @types/express (+2 more)

### Community 8 - "ReadingTrailsDashboard.tsx"
Cohesion: 0.24
Nodes (7): MiniConstellation, MiniConstellationProps, CATEGORIES, ReadingTrailsDashboard, ReadingTrailsDashboardProps, READING_TRAILS, ReadingTrail

### Community 9 - "ZenMode.tsx"
Cohesion: 0.33
Nodes (5): createSoundscape(), DURATION_PRESETS, getAudioContext(), SOUNDSCAPES, ZenModeProps

### Community 10 - "SocraticChat.tsx"
Cohesion: 0.50
Nodes (4): ChatMessage, nextMsgId(), SocraticChat(), SocraticChatProps

## Knowledge Gaps
- **79 isolated node(s):** `ReadingTrailsDashboardProps`, `CATEGORIES`, `ReadingTrailsDashboard`, `ResetPasswordScreenProps`, `NODES` (+74 more)
  These have ≤1 connection - possible missing edges or undocumented components.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `devDependencies` connect `devDependencies` to `types.ts`, `package.json`?**
  _High betweenness centrality (0.284) - this node is a cross-community bridge._
- **Why does `@types/node` connect `types.ts` to `devDependencies`?**
  _High betweenness centrality (0.262) - this node is a cross-community bridge._
- **What connects `ReadingTrailsDashboardProps`, `CATEGORIES`, `ReadingTrailsDashboard` to the rest of the system?**
  _79 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `ThoughtAtom.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.1383399209486166 - nodes in this community are weakly interconnected._
- **Should `types.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.12631578947368421 - nodes in this community are weakly interconnected._
- **Should `compilerOptions` be split into smaller, more focused modules?**
  _Cohesion score 0.1111111111111111 - nodes in this community are weakly interconnected._
- **Should `dependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.13333333333333333 - nodes in this community are weakly interconnected._