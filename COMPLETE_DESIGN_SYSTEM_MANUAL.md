# COMPLETE DESIGN SYSTEM MANUAL
## All Instructions for AI-Powered Souvenir Design Generation

---

# PART 1: SYSTEM FUNDAMENTALS

---

## CLAUDE.MD - CORE SYSTEM INSTRUCTIONS

This file provides guidance to Claude Code when working with code in this repository.

### Repository Purpose

This is a **prompt engineering system** for generating variations of existing souvenir designs. It is NOT executable code - it's a documentation and framework repository that provides structured prompts, agents, and guidelines for creating design variations using AI (Claude).

**Key Point**: This repository contains markdown documentation that defines a design variation workflow system. Users interact with this system by reading the guides and using the documented agent prompts with Claude or other AI systems.

### CRITICAL: What "Variation" Means in This System

**→ See TRUE VARIATION DEFINITION section for complete definition and validation checklist**

### OPTIMIZED System Architecture

#### Quick Start Points
- **→ START_HERE.md** - Begin here for fastest results
- **→ CHEAT_SHEET.md** - Everything on 1 page
- **→ QUICK_COMMANDS.md** - Copy-paste commands for instant results

#### Core System Components

**Simplified 2-Agent System** (`agents/`)
- **creation-agent.md** - Generates variations + checks production (combines 2 former agents)
- **validation-agent.md** - Validates variations + checks family cohesion (combines 2 former agents)

**Core Concepts** (`core/`)
- **TRUE_VARIATION_DEFINITION.md** - Single source of truth (eliminates redundancy)
- **TRANSFORMETER_SCALE.md** - The 1-10 intensity scale
- **WORKFLOW.md** - Standard 6-step process

**Smart Generators** (`generators/`)
- **MASTER_PROMPT_BUILDER.md** - Single intelligent entry point (auto-detects everything)

**Configuration** (`settings/`)
- **defaults.yaml** - Smart defaults (70% less configuration needed)

**References** (`reference/`)
- Element libraries by region
- Prompt templates (streamlined & full)
- Production specifications

### Critical Concepts

**Sacred Elements**: Design components that must be preserved across variations to maintain identity (e.g., primary landmarks, destination names, core brand elements)

**Visual DNA**: Shared design language that makes a family recognizable (color approach, typography, style treatment, compositional patterns)

**Family Cohesion**: The balance between variation unity (feeling related) and differentiation (serving distinct purposes)

**Production Constraints**: All designs must be compatible with laser-cut MDF production (vector-based, appropriate line weights, structural connectivity)

### NEW TRANSFORMATION-FIRST WORKFLOW

#### CRITICAL UPDATE: 150-300 Word Formula Now Standard
After extensive testing, we've discovered that **brevity + transformation focus = 80-90% success rate**.

#### The Core Formula (3-4 minutes per variation)

```
FORMAT: [Size]
CONCEPT: [One-sentence creative hook]
SPATIAL RECONSTRUCTION: [How layout transforms]
CHARACTER TRANSFORMATION: [What they DO differently]
NEW ELEMENTS ADDED: [5-10 simple items]
CHANGES: [Before → After with arrows]
CREATE DESIGN
```

**Total: 150-300 words MAX**

#### Essential References for True Variations

1. **TRUE_VARIATION_DEFINITION.md** - What makes a true variation
2. **VARIATION_PROMPT_FORMULA.md** - The winning 150-300 word structure
3. **SPATIAL_RECONSTRUCTION_PATTERNS.md** - Proven compositional transformations
4. **ACTION_TRANSFORMATION_LIBRARY.md** - Dynamic verbs for character actions

#### Quick Workflow

**Step 1: Define Concept** (30 seconds)
- Pick from spatial patterns: container, journey, perspective, fragmentation

**Step 2: Spatial Reconstruction** (1 minute)
- Describe complete compositional change

**Step 3: Character Actions** (30 seconds)
- Choose from action library: swimming, holding, building, flying

**Step 4: List New Elements** (1 minute)
- Quick brainstorm 5-10 items

**Step 5: Summarize Changes** (1 minute)
- Use → arrows for clarity

#### What Changed from Old System

**OLD (Retired)**:
- 3,000-4,000 word prompts
- Heavy technical specifications
- Focus on preservation
- 20-30% success rate

**NEW (Use This)**:
- 150-300 word prompts
- Concept-driven transformation
- Focus on spatial reconstruction
- 80-90% success rate

#### When to Guide Users to Streamlined vs. Full

**Direct to Streamlined Template when**:
- User needs multiple variations quickly
- Initial concept exploration and client presentations
- A/B testing different compositional approaches
- Time-sensitive projects
- Iterative refinement process

**Direct to Full Universal Template when**:
- Final production documentation required
- Complex multi-layer designs with detailed specs
- Archival documentation for future reference
- Client deliverables requiring complete specifications

#### Key Efficiency Metrics

- **Streamlined prompt creation**: 5-7 minutes (vs. 15-20 minutes)
- **Element specification**: 2 minutes copy-paste (vs. 10 minutes research/writing)
- **Production specs**: 1 minute copy-paste (vs. 5 minutes writing)
- **Total time savings**: ~70% per variation
- **Quality maintained**: Same image generation output quality

### How to Work with This Repository

#### When Users Ask to Create Variations

1. **Use the 150-300 word formula** from VARIATION_PROMPT_FORMULA.md
2. **Pick a spatial reconstruction pattern** from SPATIAL_RECONSTRUCTION_PATTERNS.md
3. **Add character actions** from ACTION_TRANSFORMATION_LIBRARY.md
4. **Focus on transformation, not preservation** (80% change, 20% context)
5. **Deliver prompts directly in chat** separated by divider lines

#### When Users Ask About TRANSFORMETER Levels

Reference transformeter_guide.md for detailed level definitions. Key guidance:
- Match level to goal (testing similar options = 2-4, major style change = 6-8)
- Different variation types have different typical ranges (Color: 1-6, Style: 3-9)
- Can specify different levels for different aspects (Color: Level 6, Composition: Level 2)

#### When Users Need Strategic Guidance

Refer to variation_best_practices.md for:
- How many variations to create (start with 3-5, rarely exceed 7-8)
- Family structure strategies (gradient series, matrix, seasonal, format)
- Common mistakes and solutions
- Quality standards and success metrics

### Production Requirements

All variations must maintain laser-cut MDF compatibility:
- Vector-based artwork
- Line weights: 0.5pt minimum (1pt recommended) for 1/8" MDF
- All elements structurally connected (no floating parts)
- Detail level appropriate for material thickness
- Material efficiency target: >70% utilization

### Important Constraints

- Maximum 7-8 variations per family (without strong rationale)
- TRANSFORMETER levels within family should stay within 3-4 levels of each other
- Sacred elements must be preserved (except at Level 10)
- Family cohesion score should be ≥7/10
- All variations must pass production feasibility analysis
- Quality standards must be consistent across all variations

### Critical Design Requirements (Recent Updates)

#### Shape and Composition Rules

**NO SIMPLE GEOMETRIC SHAPES**: Designs must have COMPLEX, IRREGULAR, ASYMMETRIC silhouettes. BANNED: squares, rectangles, perfect circles, ovals, medallions, or any shape describable in one word.

**How to create truly irregular edges** (outline must be UNIQUE to each design):
- Let design elements DEFINE the edge — palm tree poking up = bump, waves along bottom = scallops, building = jagged section
- Each side should look DIFFERENT from the others
- Top edge: Shaped by tallest element (trees, towers, mountains)
- Side edges: Asymmetric — left follows foliage, right follows architecture
- Bottom edge: Waves, terrain, or organic curves — never straight
- **NO straight edges, NO 90° corners, NO uniform rounded edges** (uniform rounding = disguised circle/rectangle)
- SELF-CHECK: If the outline looks like a circle, oval, or rectangle — it is WRONG

**Protagonist must DOMINATE**:
- Main element (e.g., Ángel de la Independencia) should occupy 70-85% of composition
- Wings/arms should span nearly full width
- Everything else positioned AROUND and clearly secondary to protagonist
- User feedback: "the protagonist is not the element I told you to focus on" - avoid this!

#### Decoration Level Scale

When user specifies decoration level (e.g., "8/10"):
- **6/10**: Moderate decoration, some negative space
- **8/10**: Abundant decoration, most space filled
- **10/10**: Maximal decoration, every corner filled

**8/10 decoration means**:
- Multiple decoration systems layered (patterns, florals, wildlife, borders, etc.)
- 40-60+ individual decorative elements
- Every zone has detail but protagonist still clear
- Fills negative space generously without overwhelming hero element

### AUTO-VALIDATION SYSTEM (CRITICAL)

**MANDATORY**: When generating prompts, you MUST automatically inject validation checklists based on product type/aspect ratio.

#### How Auto-Validation Works

When user specifies dimensions or product type in their request (via Format/Ratio parameter or in instructions), you MUST:

1. **Detect** the product type from these triggers
2. **Select** the appropriate validation checklist
3. **Append** it to the END of your generated prompt
4. **Never skip** this step - it is critical for production success

#### Detection Rules

| Input Pattern | Product Type | Action |
|---------------|--------------|--------|
| "2:1" OR "Rectangular 2:1" OR contains "horizontal" | 2:1 Horizontal | Inject 2:1 checklist |
| "1:1" OR "Square 1:1" OR "square" | 1:1 Square | Inject square checklist |
| "bottle opener" OR "destapador" | Bottle Opener | Inject bottle opener checklist |

---

# PART 2: TRUE VARIATION DEFINITION

---

## THE TRANSFORMATION-FIRST APPROACH TO DESIGN VARIATIONS

### CORE PRINCIPLE: CONCEPT → SPATIAL → ACTION
Every true variation must have these three elements in order:
1. **Creative Concept** - A bold reimagining idea
2. **Spatial Reconstruction** - Complete compositional change
3. **Action Transformation** - Elements doing, not just being

---

## WHAT A TRUE VARIATION IS

### FUNDAMENTAL REQUIREMENT
**A true variation creates a DIFFERENT DESIGN that shares DNA with the original**

### THE THREE PILLARS OF TRUE VARIATION

#### 1. CONCEPTUAL TRANSFORMATION
Start with a creative hook that reimagines the entire design:
- "Message in a bottle with island inside"
- "Snow globe with inverted gravity"
- "Pop-up book page with 3D elements"
- "Coffee drip tower as brewing apparatus"
- "Surfboard shape with van riding wave"
- "Treasure map with journey path"

#### 2. SPATIAL RECONSTRUCTION (MANDATORY)
Completely change how elements are arranged in space:
- Horizontal → Circular wreath
- Centered → Diagonal dynamic
- Flat → Inside container
- Static → Journey path
- Single view → Multiple perspectives
- Ground level → Floating/aerial
- Rectangle → Organic shape

#### 3. ACTION-BASED ELEMENTS
Characters and elements actively DO things:
- Flamingo holding camera vs. standing
- Turtle swimming through tunnel vs. posed
- Van surfing on wave vs. parked
- Characters building/decorating vs. observing
- Iguana holding photo corner with foot
- Parrot arranging puzzle pieces

---

## WHAT A TRUE VARIATION IS NOT

### THESE ARE NOT VARIATIONS (CRITICAL TO AVOID)
- Changing background color/pattern only
- Moving elements slightly (left → right)
- Changing shapes but keeping same layout (circles → squares)
- Style change without spatial reconstruction
- Adding decorations without restructuring
- Tilting/rotating the entire composition
- Keeping same compositional structure with different colors

### THE LEVEL 3 TRAP
Even "subtle" variations (Level 3) need spatial reconstruction. Style-only changes produce the same design with different aesthetics - this is NOT a true variation.

---

## THE TRANSFORMATION TEST

### Ask These Questions:
1. **Does it have a clear creative concept?**
   - Can you describe the transformation in one sentence?
   - Is there a unifying creative idea?

2. **Is the spatial structure fundamentally different?**
   - Would the eye travel a different path?
   - Is the visual hierarchy changed?
   - Could you overlay them and they'd NOT align?

3. **Are elements actively doing something new?**
   - Do characters interact differently?
   - Are there new relationships between elements?

4. **Would a viewer see this as a different design?**
   - 40-60% recognizability is ideal
   - Should feel related but distinct

### QUICK VALIDATION
**If you can overlay the original and variation and they mostly align = NOT A TRUE VARIATION**

---

## PROVEN EXAMPLES

### SUCCESSFUL TRANSFORMATIONS

**Chignahuapan Example**:
- Original: Vertical stack of landmarks
- Variation 1: Circular wreath composition
- Variation 2: Snow globe concept
- Variation 3: Christmas tree shape
*Each has completely different spatial structure*

**Celestún Example**:
- Original: Horizontal flamingos with center text
- Variation: Polaroid photos scattered at angles
- Characters interacting with photos, not inside them

**Acapulco Example**:
- Original: Front-facing centered VW van
- Variation: Side view driving along coastal road
- Dynamic diagonal composition vs. static center

### FAILED TRANSFORMATIONS

**Cascadas Level 3 Fail**:
- Changed to sketch style BUT kept same composition
- Result: Same design with different rendering
- Missing: Spatial reconstruction

---

## THE WINNING FORMULA (150-300 WORDS)

```
FORMAT: [Size specification]

CONCEPT: [One-sentence creative hook describing transformation]

SPATIAL RECONSTRUCTION:
[2-3 sentences how layout completely changes]

CHARACTER TRANSFORMATION:
[How elements actively change behavior/poses]

NEW ELEMENTS ADDED:
- [5-10 simple items, no details needed]

CHANGES:
- Spatial: [Old structure] → [New structure]
- Characters: [Old pose] → [New action]
- Text: [Old placement] → [New arrangement]
- Style: [If applicable]

CREATE DESIGN
```

### WORD COUNT DISCIPLINE
- Concept: 10-15 words
- Spatial: 30-50 words
- Character: 30-50 words
- New Elements: 20-40 words
- Changes: 40-60 words
**TOTAL: 150-300 words MAX**

---

## CRITICAL ANTI-PATTERNS

### 1. THE PRESERVATION TRAP
❌ Spending 80% describing what to keep
✅ Spend 80% describing what changes

### 2. THE TECHNICAL OVERLOAD
❌ CMYK values, line weights, production specs
✅ Simple color names, creative descriptions

### 3. THE STATIC DESCRIPTION
❌ "Flamingo positioned at left side"
✅ "Flamingo waving, holding beach ball"

### 4. THE MISSING CONCEPT
❌ List of random changes
✅ Unified creative vision

### 5. THE VERBOSE EXPLANATION
❌ 3,000 word technical specification
✅ 150-300 word creative brief

---

## MINDSET SHIFT

**❌ OLD**: "How do I preserve DNA while making acceptable changes?"

**✅ NEW**: "What bold concept will completely reconstruct this design?"

The shift from preservation to transformation creates true variations.

---

## VALIDATION CHECKLIST

Before submitting any variation prompt, verify:

- [ ] **Creative concept stated in one sentence**
- [ ] **Spatial structure completely different**
- [ ] **Characters/elements doing new actions**
- [ ] **5-10 new elements added (simply listed)**
- [ ] **40-60% recognizability (not 85% similar)**
- [ ] **Could NOT overlay with original**
- [ ] **Prompt is 150-300 words total**
- [ ] **80% focuses on transformation, not preservation**
- [ ] **No technical specs (CMYK, line weights)**
- [ ] **Clear before → after changes listed**

---

# PART 3: TRANSFORMETER SCALE

---

## TRANSFORMETER SCALE OVERVIEW

The TRANSFORMETER is a 1-10 scale measuring transformation intensity.

### Level 1-2: MICRO ADJUSTMENTS
- Color temperature shifts (warm ↔ cool)
- Minor saturation adjustments
- Subtle brightness changes
- Small element repositioning
- Accent color modifications
**Result: 90-95% similarity to original**

### Level 3-4: SUBTLE VARIATIONS
- Noticeable color palette changes
- Small compositional tweaks
- Additional decorative details
- Minor style adjustments
- Typography refinements
**Result: 75-85% similarity to original**

### Level 5-6: MODERATE TRANSFORMATIONS
- Significant color scheme changes
- Notable compositional restructuring
- New element additions (3-5)
- Style direction shifts
- Different mood/atmosphere
**Result: 55-70% similarity to original**

### Level 7-8: MAJOR REIMAGINING
- Dramatic style transformation
- Complete compositional overhaul
- Many new elements (5-7+)
- Different visual approach
- New narrative or concept
**Result: 35-50% similarity to original**

### Level 9-10: NEAR-COMPLETE REDESIGN
- Only core subject remains
- Entirely new artistic approach
- Maximum creative freedom
- New format or structure
- Fresh visual language
**Result: 10-30% similarity to original**

---

## VARIATION TYPE DEFAULTS

| Type | Typical Range | Default | Notes |
|------|--------------|---------|-------|
| Color | 1-6 | 3 | Higher risks brand disconnect |
| Composition | 2-8 | 5 | Core of true variations |
| Style | 3-9 | 6 | Can go dramatic |
| Seasonal | 4-7 | 5 | Balance theme + recognition |
| Format | 3-6 | 4 | Constrained by dimensions |

---

## SMART DEFAULTS BY CONTEXT

### Conservative (Client Presentation)
- Level: 3-4
- Focus: Color and subtle composition
- Risk: Low

### Professional Standard
- Level: 5-6
- Focus: Balanced transformation
- Risk: Medium

### Bold Exploration
- Level: 7-8
- Focus: Major creative changes
- Risk: Higher

### Complete Reimagining
- Level: 9-10
- Focus: Only subject matter remains
- Risk: May lose brand recognition

---

# PART 4: SPATIAL RECONSTRUCTION PATTERNS

---

## CONTAINER PATTERNS

### Snow Globe
- **Concept**: Design exists inside spherical container
- **Transformation**: Flat → Enclosed 3D space
- **Elements**: Glass sphere, base, snow particles, contained scene
- **Best for**: Winter themes, magical scenes, nostalgic destinations

### Message in Bottle
- **Concept**: Entire design compressed inside glass bottle
- **Transformation**: Spread out → Condensed vertical
- **Elements**: Cork, glass distortion, floating elements
- **Best for**: Coastal destinations, romantic themes, vintage feel

### Open Book/Pop-up
- **Concept**: Design as 3D pop-up from book pages
- **Transformation**: Flat → Multi-plane depth
- **Elements**: Paper fold lines, standing elements, page edges
- **Best for**: Storybook destinations, educational themes

### Coffee Cup Surface
- **Concept**: Design floating in/on coffee
- **Transformation**: Solid → Liquid reflection
- **Elements**: Latte art, steam, cup rim framing
- **Best for**: Café culture, morning themes

### Puzzle Pieces
- **Concept**: Design fragmented across interlocking pieces
- **Transformation**: Unified → Intentionally separated
- **Elements**: Puzzle edges, some pieces displaced
- **Best for**: Discovery themes, interactive feel

---

## JOURNEY PATTERNS

### Treasure Map
- **Concept**: Dotted path connecting design elements
- **Transformation**: Static → Narrative journey
- **Elements**: X marks, compass rose, aged paper, path line
- **Best for**: Adventure destinations, exploration themes

### Winding Road
- **Concept**: Elements positioned along serpentine road
- **Transformation**: Scattered → Sequential journey
- **Elements**: Road curves, mile markers, perspective depth
- **Best for**: Road trip themes, scenic routes

### River Flow
- **Concept**: Water carries elements through composition
- **Transformation**: Static → Flowing movement
- **Elements**: Current lines, rocks, varied water speeds
- **Best for**: Waterfall destinations, nature themes

### Spiral Growth
- **Concept**: Elements grow outward from center spiral
- **Transformation**: Random → Organic progression
- **Elements**: Nautilus curve, size graduation
- **Best for**: Growth themes, natural progressions

### Circular Wreath
- **Concept**: Elements orbit around central focus
- **Transformation**: Linear → Radial arrangement
- **Elements**: Overlapping ring, varied element sizes
- **Best for**: Holiday themes, celebration designs

---

## PERSPECTIVE PATTERNS

### Bird's Eye View
- **Concept**: Looking down from above
- **Transformation**: Front view → Aerial view
- **Elements**: Foreshortening, map-like quality
- **Best for**: Geographic destinations, city overviews

### Worm's Eye View
- **Concept**: Looking up from ground level
- **Transformation**: Normal → Dramatic low angle
- **Elements**: Exaggerated height, sky prominence
- **Best for**: Monuments, towers, dramatic landmarks

### Split View
- **Concept**: Above and below surface shown
- **Transformation**: Single plane → Dual worlds
- **Elements**: Water line, sky/underwater division
- **Best for**: Coastal/marine destinations

### 3/4 Perspective
- **Concept**: Angled view showing depth
- **Transformation**: Flat → Dimensional
- **Elements**: Visible sides, perspective lines
- **Best for**: Architectural subjects, cityscapes

---

## FRAGMENTATION PATTERNS

### Polaroid Scatter
- **Concept**: Multiple snapshot photos arranged at angles
- **Transformation**: Single image → Photo collection
- **Elements**: White borders, slight shadows, overlapping
- **Best for**: Tourist destinations, memory themes

### Postcard Stack
- **Concept**: Overlapping travel postcards
- **Transformation**: Unified → Layered collection
- **Elements**: Stamp corners, postmark, varied sizes
- **Best for**: Travel themes, vintage aesthetics

### Comic Panels
- **Concept**: Sequential boxes telling story
- **Transformation**: Moment → Sequence
- **Elements**: Panel borders, varied sizes, flow
- **Best for**: Action sequences, narrative destinations

### Mosaic Tiles
- **Concept**: Design broken into organized grid
- **Transformation**: Smooth → Tessellated
- **Elements**: Grout lines, tile variation
- **Best for**: Artistic destinations, cultural patterns

### Floating Islands
- **Concept**: Separated land masses in sky
- **Transformation**: Connected → Fantastical separation
- **Elements**: Clouds between, varied heights
- **Best for**: Fantasy themes, imaginative destinations

---

## SHAPE TRANSFORMATION PATTERNS

### Circle/Mandala
- Rectangle → Radial circular design
- Elements arranged in concentric rings
- Central focus with radiating details

### Triangle/Pyramid
- Rectangle → Upward pointing structure
- Hierarchical element placement
- Base-heavy to apex progression

### Object Silhouette
- Rectangle → Recognizable object shape
- Design fills custom contour
- Examples: surfboard, bottle, guitar, tree

### Organic Natural
- Rectangle → Flowing natural edge
- Follows plant/water/cloud forms
- Irregular but intentional boundary

---

# PART 5: ACTION TRANSFORMATION LIBRARY

---

## MOVEMENT VERBS

### Water Actions
- Swimming through
- Diving into
- Surfing on
- Floating in
- Splashing through
- Paddling across
- Emerging from
- Submerging into

### Air Actions
- Flying between
- Soaring above
- Gliding through
- Hovering over
- Swooping down
- Fluttering around
- Drifting across
- Ascending toward

### Ground Actions
- Running along
- Climbing up
- Jumping between
- Dancing around
- Sliding down
- Walking through
- Hiking across
- Stepping over

---

## INTERACTION VERBS

### Holding Actions
- Holding (object)
- Carrying (item)
- Lifting (thing)
- Balancing (on)
- Juggling (items)
- Gripping (surface)
- Cradling (gently)
- Brandishing (proudly)

### Creating Actions
- Arranging (pieces)
- Building (structure)
- Painting (scene)
- Decorating (space)
- Assembling (parts)
- Crafting (item)
- Sculpting (form)
- Weaving (pattern)

### Manipulating Actions
- Pushing (object)
- Pulling (item)
- Turning (thing)
- Spinning (wheel)
- Opening (door/lid)
- Closing (container)
- Adjusting (setting)
- Positioning (element)

---

## EXPRESSIVE VERBS

### Greeting Actions
- Waving (with limb)
- Beckoning (toward)
- Pointing at
- Saluting (viewer)
- Bowing (to)
- Nodding (toward)
- Gesturing (welcome)

### Playful Actions
- Winking at
- Taking selfie with
- Photobombing
- Peeking from behind
- Playing (instrument/game)
- Laughing at
- Celebrating with

### Observing Actions
- Looking at
- Gazing toward
- Watching over
- Examining (closely)
- Discovering (new)
- Noticing (detail)
- Admiring (view)

---

## ACTION FORMULA

**Structure**: "[Character] [action verb]ing [object/direction] with [body part/tool]"

### Examples:
- "Flamingo waving with right wing while holding camera in left"
- "Turtle swimming through coral arch looking back at viewer"
- "Van surfing on giant wave with doors open like wings"
- "Iguana pushing puzzle piece into place with both hands"
- "Parrot arranging postcards with beak while standing on one foot"
- "Cactus character doing yoga pose while balancing sombrero"

---

## STATIC TO DYNAMIC CONVERSION

| Static (Avoid) | Dynamic (Use) |
|----------------|---------------|
| Positioned at | Running toward |
| Located in | Dancing inside |
| Placed near | Leaping over |
| Standing by | Celebrating at |
| Sitting next to | Playing guitar beside |
| Facing toward | Swimming toward |
| Resting on | Sliding down |

---

# PART 6: COMPOSITION FRAMEWORKS

---

## FRAMEWORK 1: CENTERED HERO

### Structure
```
┌────────────────────────────┐
│    [TEXT - Top Arc]        │
│                            │
│   [Small]  [HERO]  [Small] │
│   [Accent] [60-80%][Accent]│
│            [Center]        │
│                            │
│   [Decorative Border]      │
└────────────────────────────┘
```

### Key Characteristics
- **Hero placement:** Absolute center, 60-80% of design
- **Supporting elements:** Frame edges symmetrically (15-20%)
- **Text:** Arcs along top or curves bottom
- **Balance:** Symmetrical, stable, iconic
- **Visual flow:** Eye immediately centers on hero, then explores edges

### Best For
- Strong recognizable landmarks (towers, monuments, statues)
- Iconic character mascots
- Formal commemorative designs
- Badge/medallion styles
- When hero IS the entire story

### Prompt Language
"Centered composition with [HERO] dominating center occupying 70% of design. Supporting [elements] frame left and right edges symmetrically. [TEXT] arcs across top. Balanced radial decoration fills corners."

---

## FRAMEWORK 2: ENVIRONMENTAL INTEGRATION

### Structure
```
┌────────────────────────────┐
│  [Sky/Background Elements] │
│                            │
│[Landscape] [HERO]  [Flora] │
│  [Left]   [35-40%][Right]  │
│           [In Setting]     │
│  [Foreground Ground Layer] │
│     [Text Integrated]      │
└────────────────────────────┘
```

### Key Characteristics
- **Hero placement:** Center or off-center, 35-40% of design
- **Environment:** Equally important 40-50%, creates habitat/setting
- **Layers:** Clear foreground/midground/background depth
- **Integration:** Hero appears IN environment, not just ON it
- **Visual flow:** Eye enters through foreground, finds hero in midground, explores background

### Best For
- Animals in natural habitat
- Cultural scenes with context
- Landscape-focused designs
- Nature/wildlife themes
- When environment tells story equally

### Prompt Language
"Environmental integration composition with [HERO] positioned center-right occupying 35% within [SETTING]. [Background landscape] fills upper third, [foreground elements] anchor bottom. Layered depth with atmospheric [environmental details]."

---

## FRAMEWORK 3: DIAGONAL JOURNEY

### Structure
```
┌────────────────────────────┐
│  [Start]                   │
│    ↘                       │
│      [PATH]                │
│        ↘  [HERO]           │
│          ↘  [30-40%]       │
│            ↘  [On Path]    │
│   [TEXT]     ↘  [Goal]     │
└────────────────────────────┘
```

### Key Characteristics
- **Hero placement:** Mid-journey on diagonal path, 30-40%
- **Path/Trail:** Cuts diagonally (usually lower-left to upper-right)
- **Movement:** Implied direction/travel/exploration
- **Asymmetric:** Dynamic off-balance energy
- **Visual flow:** Eye follows path from start through hero to destination

### Best For
- Adventure/exploration themes
- Hiking/trail designs
- Journey narratives
- Pilgrimage/travel concepts
- When movement is key story element

### Prompt Language
"Diagonal journey composition with stone trail cutting from lower left to upper right. [HERO] positioned mid-trail occupying 35% suggesting exploration. [Starting elements] at origin, [destination elements] at terminus. Horizontal dynamic flow."

---

## FRAMEWORK 4: RADIAL MANDALA

### Structure
```
┌────────────────────────────┐
│  [Text Curve Top]          │
│                            │
│    ◉◉◉ [Ring 3] ◉◉◉        │
│   ◉◉◉◉◉◉◉◉◉◉◉◉◉◉           │
│   ◉◉ [Ring 2] ◉◉           │
│   ◉◉◉ [HERO] ◉◉◉           │
│   ◉◉ [25-35%] ◉◉           │
│   ◉◉◉◉◉◉◉◉◉◉◉◉◉◉           │
│  [Text Curve Bottom]       │
└────────────────────────────┘
```

### Key Characteristics
- **Hero placement:** Absolute center, 25-35%
- **Radial rings:** Concentric circles radiating outward
- **Symmetry:** Perfect circular balance
- **Sacred geometry:** Mathematical precision
- **Visual flow:** Eye centers, then spirals outward through rings

### Best For
- Spiritual/meditative themes
- Sacred cultural designs
- Symmetrical beauty focus
- Formal ceremonial concepts
- When circular format works

### Prompt Language
"Radial mandala composition with [HERO] at absolute center occupying 30% in [meditative pose]. Inner ring of [8 elements] creates first circle, middle ring of [12 elements] forms second layer, outer ring of [16 elements] creates frame. Perfect circular symmetry with [decorative patterns] connecting rings."

---

## FRAMEWORK 5: NARRATIVE SCENE

### Structure
```
┌────────────────────────────┐
│   [Text on Banner/Sign]    │
│                            │
│  [HERO]      [Interacting] │
│  [40%]       [With Props]  │
│  [Performing] [Cultural]   │
│  [Activity]   [Objects]    │
│  [Supporting Scene Elements]│
└────────────────────────────┘
```

### Key Characteristics
- **Hero placement:** Left or right third, 35-45%
- **Action focus:** Hero doing something specific
- **Props/objects:** Support the activity/narrative
- **Story-driven:** Clear "what's happening" moment
- **Visual flow:** Eye finds hero, then understands action through props/context

### Best For
- Cultural activities (cooking, weaving, dancing)
- Festival/celebration scenes
- Character interactions
- Market/vendor designs
- When activity tells the story

### Prompt Language
"Narrative scene composition with [HERO] positioned left occupying 40% [performing ACTIVITY]. [Props/objects] on right side support story. [Background elements] set scene context. Clear storytelling focus with [cultural details]."

---

## FRAMEWORK 6: LAYERED DEPTH

### Structure
```
┌────────────────────────────┐
│ [Far Background 30%]       │
│  [Mountains/Sky]           │
│                            │
│ [Midground 40%]            │
│   [HERO Element]           │
│                            │
│ [Foreground 20%]           │
│  [Close Details]           │
│ [Text Layer]               │
└────────────────────────────┘
```

### Key Characteristics
- **Hero placement:** Midground layer, 35-45%
- **Three planes:** Clear foreground (20%), midground (40%), background (30-40%)
- **Atmospheric depth:** Fog, mist, or atmospheric perspective
- **Spatial separation:** Each layer distinct
- **Visual flow:** Eye moves through depth planes like looking into scene

### Best For
- Landscape-heavy designs
- Atmospheric/moody scenes
- Mountain/valley compositions
- Scenes requiring depth and scale
- When environment scale matters

### Prompt Language
"Layered depth composition with clear spatial planes. Background [mountains/sky] fills upper 30%, midground [HERO] occupies center 40%, foreground [details] anchors bottom 20%. Atmospheric [fog/mist] creates separation between layers."

---

## FRAMEWORK 7: FRAME-WITHIN-FRAME

### Structure
```
┌────────────────────────────┐
│╔══════════════════════════╗│
│║ [Decorative Border]      ║│
│║  [Pattern/Cultural]      ║│
│║                          ║│
│║      [HERO]              ║│
│║      [35-40%]            ║│
│║      [Centered]          ║│
│║                          ║│
│║ [Border Pattern Cont.]   ║│
│╚══════════════════════════╝│
└────────────────────────────┘
```

### Key Characteristics
- **Hero placement:** Centered within frame, 35-40%
- **Border emphasis:** Thick decorative frame tells secondary story
- **Contained:** Hero medallion/icon within architectural or decorative frame
- **Ornamental:** Border is major design element (20-30%)
- **Visual flow:** Border draws eye inward to centered hero

### Best For
- Formal commemorative designs
- Badge/seal/medallion styles
- When border patterns tell cultural story
- Ornamental approaches
- Gift/souvenir presentation emphasis

### Prompt Language
"Frame-within-frame composition with [HERO] centered within decorative frame occupying 40% of interior space. Thick ornamental border (25% of design) features [cultural patterns/motifs] creating architectural frame. Text integrated into border elements."

---

## FRAMEWORK 8: ASYMMETRIC BALANCE

### Structure
```
┌────────────────────────────┐
│         [TEXT Top Right]   │
│                            │
│  [LARGE]              [Small]
│  [HERO]               [Counter]
│  [60%]                [Elements]
│  [Left]               [Right]
│                       [15%]
│  [TEXT Bottom Left]        │
└────────────────────────────┘
```

### Key Characteristics
- **Hero placement:** One side (usually left), 50-70%
- **Counter-balance:** Smaller elements opposite side (15-25%)
- **Asymmetric:** Intentionally unbalanced but stable
- **Dynamic:** More energy than symmetrical layouts
- **Visual flow:** Eye starts at large hero, balances to smaller counter-elements

### Best For
- Dynamic character poses
- When hero has strong directionality
- Modern contemporary aesthetics
- Breaking traditional symmetry
- When visual tension desired

### Prompt Language
"Asymmetric balanced composition with [LARGE HERO] dominating left side occupying 65%. Smaller [counter-elements] balance right side at 20%. Dynamic off-center energy with intentional visual tension."

---

## FRAMEWORK 9: VERTICAL STACKING

### Structure
```
┌────────────────────────────┐
│   [TEXT Banner Top 15%]    │
├────────────────────────────┤
│   [Upper Element 25%]      │
│   [Sky/Background]         │
├────────────────────────────┤
│   [HERO Center 35%]        │
│   [Main Focus]             │
├────────────────────────────┤
│   [Lower Element 25%]      │
│   [Ground/Base]            │
└────────────────────────────┘
```

### Key Characteristics
- **Hero placement:** Center vertical band, 30-40%
- **Stacked layers:** Clear horizontal divisions
- **Top-to-bottom:** Natural reading direction
- **Portrait format:** Works best in vertical rectangles
- **Visual flow:** Eye reads top to bottom in distinct sections

### Best For
- Portrait/vertical formats
- Tower/vertical monuments
- Hierarchical information
- Top-to-bottom narratives
- When vertical emphasis needed

### Prompt Language
"Vertical stacking composition with [TEXT] banner across top 15%, [upper background] fills 25%, [HERO] occupies center band 35%, [ground/base] anchors bottom 25%. Clear horizontal layer divisions."

---

## FRAMEWORK 10: HORIZONTAL SPREAD

### Structure
```
┌─────────────────────────────────────┐
│                                     │
│ [Left Scene]→[HERO Center]→[Right] │
│ [Element 25%] [35%] [Element 25%]  │
│                                     │
│ [TEXT Banner Bottom]                │
└─────────────────────────────────────┘
```

### Key Characteristics
- **Hero placement:** Center, 30-40%
- **Left-right flow:** Narrative moves horizontally
- **Landscape format:** Wide rectangular shape
- **Panoramic:** Emphasizes width over height
- **Visual flow:** Eye travels left to right like reading

### Best For
- Landscape/horizontal formats
- Journey narratives (left to right)
- Panoramic scenes
- Before-and-after concepts
- Wide scene compositions

### Prompt Language
"Horizontal spread composition in landscape format with [HERO] centered occupying 35%. [Left scene elements] fill left 25%, [right scene elements] balance right 25%. Panoramic horizontal flow with [TEXT] banner across bottom."

---

## QUICK SELECTION GUIDE

1. **Is hero THE ENTIRE focus with no competing elements?**
   → Framework 1: Centered Hero

2. **Is environment/habitat equally important as hero?**
   → Framework 2: Environmental Integration

3. **Does design suggest movement/journey/path?**
   → Framework 3: Diagonal Journey

4. **Is spiritual/meditative/circular symmetry desired?**
   → Framework 4: Radial Mandala

5. **Is hero performing specific activity/action?**
   → Framework 5: Narrative Scene

6. **Do you need strong foreground/midground/background depth?**
   → Framework 6: Layered Depth

7. **Should decorative border be major element?**
   → Framework 7: Frame-Within-Frame

8. **Want dynamic modern asymmetric energy?**
   → Framework 8: Asymmetric Balance

9. **Vertical portrait format with clear sections?**
   → Framework 9: Vertical Stacking

10. **Horizontal landscape with left-right flow?**
    → Framework 10: Horizontal Spread

---

# PART 7: STYLE DESCRIPTORS LIBRARY

---

## CARTOON & PLAYFUL STYLES

### Whimsical Cartoon
**Copy-paste descriptor:**
"Playful cartoon illustration with bold black outlines (3-4pt), flat vibrant colors, friendly character design, simple shapes with personality, cheerful approachable mood celebrating [location] through family-friendly joyful lens."

**Best for:** Family souvenirs, character-focused designs, playful cultural celebrations, children's appeal

---

### Cute Kawaii
**Copy-paste descriptor:**
"Adorable kawaii style with rounded shapes, pastel color palette, big expressive eyes, simplified cute forms, soft gentle aesthetic creating sweet memorable [location] charm with universal appeal."

**Best for:** Gift items, younger audiences, cute animal mascots, soft cultural interpretation

---

### Bold Pop Art
**Copy-paste descriptor:**
"Bold pop art illustration with strong graphic shapes, high contrast colors, thick outlines, Ben-Day dots or halftone patterns, energetic contemporary aesthetic bringing modern vibrant energy to [location]."

**Best for:** Modern urban destinations, contemporary art markets, young adult appeal, bold statements

---

## REALISTIC & DETAILED STYLES

### Realistic Illustrative
**Copy-paste descriptor:**
"Realistic illustrative style with photographic quality details, natural lighting and dimensional shading, authentic textures (fabric weave, bark, stone), atmospheric depth creating documentary-style celebration of [location] with lifelike authenticity."

**Best for:** Sophisticated audiences, nature/wildlife focus, educational souvenirs, premium quality feel

---

### Vintage Naturalist
**Copy-paste descriptor:**
"Vintage scientific botanical illustration style with detailed specimen rendering, cross-sections and labels, sepia-toned palette, scholarly aesthetic suggesting museum field guide quality documenting [location] heritage with educational reverence."

**Best for:** Educational products, museum gift shops, botanical gardens, sophisticated classic appeal

---

### Photographic Collage
**Copy-paste descriptor:**
"Photographic collage aesthetic combining realistic photo elements, layered composition, varied scale creating depth, authentic imagery of [location] arranged in artistic storytelling layout with contemporary mixed-media feel."

**Best for:** Modern souvenirs, Instagram-aesthetic products, contemporary galleries, photo-centric stories

---

## VINTAGE & NOSTALGIC STYLES

### Vintage Travel Poster
**Copy-paste descriptor:**
"Vintage 1950s travel poster aesthetic with bold simplified shapes, limited color palette (4-6 colors), hand-lettered typography, nostalgic charm, Art Deco or Mid-Century Modern influence celebrating [location] with classic National Parks poster romance."

**Best for:** Classic destinations, national parks, retro-loving audiences, timeless souvenir appeal

---

### Retro 1970s
**Copy-paste descriptor:**
"Groovy 1970s retro style with warm earthy palette, rounded typography, sunburst rays, rainbow arcs, vintage textures, nostalgic laid-back vibe bringing feel-good throwback energy to [location] with peace-and-love aesthetic."

**Best for:** Beach towns, desert destinations, bohemian markets, nostalgic hippie appeal

---

### Art Nouveau Ornamental
**Copy-paste descriptor:**
"Elegant Art Nouveau style with flowing organic curves, decorative floral motifs, ornate borders, sinuous lines, sophisticated turn-of-century aesthetic framing [location] with refined artistic heritage and timeless beauty."

**Best for:** Elegant destinations, floral themes, sophisticated gifts, artistic heritage sites

---

## FOLK ART & CULTURAL STYLES

### Decorative Folk Art
**Copy-paste descriptor:**
"Traditional folk art style with intricate pattern fills, ornamental borders, nature motifs densely repeated, rich decoration, handcrafted feel, vibrant cultural colors celebrating [location] through indigenous artistic traditions with abundant detail."

**Best for:** Cultural destinations, indigenous heritage, traditional craft markets, maximalist decoration

---

### Mexican Papel Picado
**Copy-paste descriptor:**
"Festive papel picado cut-paper style with perforated patterns, delicate lace-like details, banner composition, bright celebratory colors, traditional Mexican folk aesthetic bringing joyful fiesta energy to [location] with cultural authenticity."

**Best for:** Mexican destinations, festival themes, celebratory occasions, cultural authenticity

---

### Indigenous Textile Pattern
**Copy-paste descriptor:**
"Traditional woven textile aesthetic with geometric patterns, horizontal stripes, diamond motifs, natural dye colors, handwoven quality suggesting cultural textile heritage of [location] with respectful authentic representation."

**Best for:** Culturally sensitive designs, textile traditions, indigenous heritage, authentic representation

---

## MODERN & CONTEMPORARY STYLES

### Modern Flat Design
**Copy-paste descriptor:**
"Contemporary flat design with clean vector shapes, vibrant color blocking, minimal shading, geometric patterns, crisp edges, modern simplified aesthetic presenting [location] with fresh graphic design sophistication and current visual trends."

**Best for:** Tech-savvy audiences, modern urban destinations, contemporary aesthetic, clean design lovers

---

### Geometric Abstract
**Copy-paste descriptor:**
"Modern geometric abstract style with tessellating shapes, pattern-based composition, mathematical precision, color theory applications, contemporary art aesthetic representing [location] through abstract symbolic visual language with intellectual design sophistication."

**Best for:** Modern art markets, abstract interpretation, design-conscious buyers, intellectual appeal

---

### Minimalist Line Art
**Copy-paste descriptor:**
"Elegant minimalist line art with continuous single-line drawing, essential forms only, abundant negative space, refined simplicity, sophisticated restraint distilling [location] to its purest visual essence with modern artistic clarity."

**Best for:** Modern sophisticated markets, elegant gifts, contemporary art lovers, refined aesthetic

---

## ATMOSPHERIC & MYSTICAL STYLES

### Mystical Atmospheric
**Copy-paste descriptor:**
"Mystical enchanted illustration with atmospheric lighting effects, magical glow, ethereal mist, dreamlike quality, spiritual reverent mood, soft luminous palette honoring sacred aspects of [location] through fantasy-influenced respectful interpretation creating wonder."

**Best for:** Spiritual destinations, mystical themes, sacred sites, fantasy-influenced respectful designs

---

### Noir Dramatic
**Copy-paste descriptor:**
"Dramatic noir style with strong contrast lighting, deep shadows, limited color palette emphasizing mood, cinematic atmosphere, sophisticated mystery creating evocative theatrical presentation of [location] with film noir artistic drama and urban sophistication."

**Best for:** Urban destinations, evening/night themes, sophisticated dramatic appeal, artistic markets

---

### Watercolor Soft
**Copy-paste descriptor:**
"Soft watercolor style with flowing blended colors, gentle washes, organic bleeds, hand-painted texture, delicate artistic feel, pastel or muted tones creating dreamy romantic interpretation of [location] with painterly handmade charm and gentle sophistication."

**Best for:** Romantic destinations, gentle themes, artistic markets, handmade aesthetic appeal

---

## SPECIALTY & UNIQUE STYLES

### Stained Glass
**Copy-paste descriptor:**
"Stained glass window aesthetic with bold black leading lines, jewel-tone color sections, light-through-glass effect, geometric divisions, cathedral art influence celebrating [location] through sacred decorative art tradition with luminous colorful beauty."

**Best for:** Religious sites, historic destinations, artistic glass markets, decorative ornamental appeal

---

### Woodcut Print
**Copy-paste descriptor:**
"Traditional woodcut print style with bold carved lines, high contrast black and white (or limited colors), visible texture suggesting wood grain, graphic powerful forms, folk art printing tradition presenting [location] with rustic handcrafted artistic heritage and bold graphic impact."

**Best for:** Rustic destinations, traditional craft appeal, bold graphic lovers, artisanal markets

---

### Neon Glow
**Copy-paste descriptor:**
"Electric neon glow style with bright luminous colors, dark background contrast, glowing tube light effect, urban contemporary energy, vibrant nightlife aesthetic presenting [location] with modern electrifying excitement and bold visual impact."

**Best for:** Urban nightlife, modern cities, contemporary markets, young adult appeal, bold statements

---

# PART 8: PRODUCT TYPE SPECIFICATIONS

---

## 2:1 HORIZONTAL (10" × 5") - Wall Art / Posters

### Mandatory Requirements
- Canvas is EXACTLY 10 inches WIDE × 5 inches TALL (2:1 horizontal ratio)
- This is a WIDE RECTANGLE, NOT a square
- Design MUST span the FULL 10" WIDTH from left edge to right edge
- Elements distributed HORIZONTALLY across canvas (not centered in middle)
- Text MUST span minimum 8 inches of the 10" width (80% minimum)
- Background fills the ENTIRE 10" × 5" rectangle edge-to-edge
- NO centered 5"×5" square composition with empty side borders
- Composition emphasizes HORIZONTAL FLOW (panoramic landscape style)

**CRITICAL: If you create a centered square design, this will FAIL production.**

---

## 1:1 SQUARE (8" × 8") - Standard Square Products

### Mandatory Requirements
- Canvas is EXACTLY 8 inches × 8 inches (perfect 1:1 square)
- Design MUST have balanced composition in ALL FOUR DIRECTIONS
- All four corners should have visual interest (no empty corners)
- Use radial, symmetric, or centered focal arrangements
- Equal visual weight in all quadrants
- Background fills the ENTIRE 8" × 8" square edge-to-edge
- NO elongated horizontal or vertical bias
- Composition works when viewed from any rotation

**CRITICAL: This is a SQUARE format - avoid horizontal or vertical compositions.**

---

## 1:2 VERTICAL (5" × 10") - Tall Vertical Formats

### Mandatory Requirements
- Canvas is EXACTLY 5 inches WIDE × 10 inches TALL (1:2 vertical ratio)
- This is a TALL RECTANGLE, NOT a square or horizontal format
- Design MUST use the FULL 10" HEIGHT from top to bottom
- Elements STACKED VERTICALLY in layers (top → middle → bottom)
- Keep composition within 5" width (no horizontal spreading)
- Background fills the ENTIRE 5" × 10" rectangle edge-to-edge
- Text can flow vertically or be stacked horizontally in layers
- Create visual flow from TOP TO BOTTOM

**CRITICAL: This is a VERTICAL format - elements stack vertically, not horizontally.**

---

## BOTTLE OPENER (3" × 6") - WITH VOID AREAS

### Physical Structure
- Canvas is EXACTLY 3 inches WIDE × 6 inches TALL (1:2 vertical ratio)
- Outer shape is a ROUNDED RECTANGLE (0.25" corner radius)
- Background is NATURAL WOOD TEXTURE (not full color coverage)

### CRITICAL - THREE VOID AREAS (COMPLETELY EMPTY)
- TOP VOID: Large circle 1.2" diameter - for BOTTLE OPENING function
- MIDDLE VOIDS: Two small circles 0.3" diameter each - for MOUNTING HOLES
- These areas will be CUT OUT completely - NOTHING can be placed here
- Design elements MUST FLOW AROUND these three voids

### Layout Requirements
- Text curves ABOVE the large top void (not through it)
- Main scenic elements positioned BETWEEN and AROUND the middle voids
- Bottom section has full 3" width available for design
- All design elements avoid the three circular void areas
- Use vegetation/elements to naturally "frame" the void edges

**CRITICAL: If you place ANY design elements in the three void areas, they will be laser-cut away and lost in production.**

---

## MAGNET (3.5" × 4") - Small Format

### Mandatory Requirements
- Canvas is EXACTLY 3.5 inches WIDE × 4 inches TALL (small vertical format)
- This is a SMALL product viewed from REFRIGERATOR DISTANCE (5-10 feet)
- Design MUST be SIMPLIFIED with BOLD shapes and HIGH CONTRAST
- NO fine details smaller than 0.125" (won't be visible at viewing distance)
- Text minimum 0.5" tall with 2-3pt bold outlines
- Limit text to 2-4 words maximum
- Use bolder line weights (2-3pt) for all main elements
- High contrast essential for visibility
- Background fills the ENTIRE 3.5" × 4" area

**CRITICAL: Small size = simplified design. Complex details will be invisible.**

---

## BOOKMARK (2.5" × 7") - Ultra Narrow Vertical

### Mandatory Requirements
- Canvas is EXACTLY 2.5 inches WIDE × 7 inches TALL (very narrow vertical)
- Tassel hole: 0.1875" diameter, centered, 0.375" from top edge
- Design flows VERTICALLY in narrow column format
- Elements STACKED TOP TO BOTTOM along 7" height
- Text oriented vertically or stacked in narrow format
- Text sized to ~70-80% of 2.5" width maximum
- Narrow format requires HORIZONTAL REINFORCEMENTS for stability
- All vertical elements MUST connect at multiple points
- Background fills the ENTIRE 2.5" × 7" area
- Account for tassel hole at top (keep clear)

**CRITICAL: Ultra-narrow format - elements must stack vertically and connect.**

---

## ORNAMENT (4" DIAMETER) - Circular Format

### Mandatory Requirements
- Canvas is EXACTLY 4 inch DIAMETER CIRCLE (not square or rectangle)
- Hanging hole: 0.25" diameter at top center, 0.5" from edge
- Design MUST follow CIRCULAR composition (radial or concentric)
- All elements connect to outer circle or each other (no floating pieces)
- Text curves along circular path or centers in middle
- Radial designs need structural cross-connections for stability
- Background fills the ENTIRE 4" diameter circle edge-to-edge
- Account for hanging hole at top (keep text/main elements clear)
- Design readable when ornament hangs vertically

**CRITICAL: Circular format requires radial composition and structural connections.**

---

## COASTER (3.5" × 3.5") - Small Square

### Mandatory Requirements
- Canvas is EXACTLY 3.5 inches × 3.5 inches (small perfect square)
- This is a FUNCTIONAL surface (drinks placed on top)
- Design MUST be balanced in all four directions
- Centered or radial composition works best
- All four corners should have visual interest
- Background fills the ENTIRE 3.5" × 3.5" square
- Consider that center may be covered by glass/cup
- Important elements positioned around perimeter or in middle
- Simplified design appropriate for small viewing size

**CRITICAL: Small square format - balanced composition, functional surface.**

---

## KEYCHAIN (1.5-2.5") - Ultra Small Format

### Mandatory Requirements
- Canvas is EXACTLY 1.5-2.5 inches in largest dimension (ULTRA SMALL)
- Attachment hole: 0.125" diameter at top
- This is the SMALLEST product - MAXIMUM SIMPLIFICATION required
- BOLD shapes only - NO fine details whatsoever
- Text minimum 0.5" tall with 3pt BOLD outlines
- Limit to 1-2 words maximum OR iconic symbol only
- Line weights 2-3pt minimum for all elements
- Ultra-high contrast essential
- Durable design (thick connections, no thin elements)
- Design recognizable at arm's length distance

**CRITICAL: Ultra-small size = iconic symbols and bold text ONLY.**

---

# PART 9: VARIATION SCENARIOS

---

## COLOR VARIATION SCENARIO (LEVELS 1-6)

### Purpose
Generate design variations that explore different color palettes while maintaining the original composition, layout, and design elements.

### When to Use
- A/B testing color schemes for market preference
- Creating seasonal color variants (spring pastels, autumn warm tones)
- Adapting designs for different product materials or backgrounds
- Offering customers multiple color options of the same design
- Brand color compliance across different markets

### Level 1-2: Subtle Color Shifts
- Adjust hue by 10-30 degrees
- Modify saturation or brightness by 10-20%
- Shift to analogous colors on color wheel
- Maintain overall color temperature (warm/cool)
- Keep contrast ratios similar

### Level 3-4: Moderate Color Changes
- Introduce complementary color schemes
- Shift from warm to cool palette (or vice versa)
- Change 2-3 primary colors while keeping 1-2 anchors
- Adjust contrast significantly (high contrast to low, or reverse)
- Introduce or remove metallic/gradient effects

### Level 5-6: Major Color Reimagining
- Complete palette swap (warm to cool, vibrant to muted)
- Monochromatic to multicolor (or vice versa)
- Introduce entirely new color family
- Dramatic contrast changes (light to dark, pastel to bold)
- Add/remove special color effects (neon, vintage, duo-tone)

---

## SEASONAL VARIATION SCENARIO (LEVELS 2-7)

### Purpose
Generate design variations that adapt the original design to different seasons, holidays, or time-specific occasions while maintaining the core destination identity.

### CRITICAL: TRUE Variations Through Seasonal Adaptation

**Required for seasonal variation:**
- DECONSTRUCT original into core elements
- REIMAGINE spatial arrangement for seasonal context
- CHANGE element treatments (winter clothing, summer poses, holiday activities)
- ADD 3-7 season-specific decorative/thematic elements
- TRANSFORM color palette for seasonal mood
- RECONSTRUCT with integrated seasonal storytelling

**NOT valid seasonal variation:**
- Just adding Santa hat to unchanged design
- Placing snowflakes around existing composition
- Color swap without compositional changes
- Minimal seasonal stickers without integration

### Seasonal Theme Elements

#### Spring
- **Elements**: Cherry blossoms, tulips, baby animals, rain, rainbows, butterflies
- **Colors**: Pastels, soft pinks, light greens, sky blues, lavender
- **Mood**: Renewal, freshness, growth, hope
- **Activities**: Flower festivals, Easter, garden tours
- **Text Options**: "Spring in...", "Blossom Season", "Springtime"

#### Summer
- **Elements**: Sun, beach items, ice cream, swimwear, sunglasses, palm trees
- **Colors**: Bright blues, sunny yellow, hot pink, orange, turquoise
- **Mood**: Energy, fun, vacation, heat, relaxation
- **Activities**: Beach, festivals, outdoor concerts, hiking
- **Text Options**: "Summer Vibes", "Sun & Fun in...", "Summer"

#### Autumn/Fall
- **Elements**: Falling leaves, pumpkins, harvest items, acorns, warm scarves
- **Colors**: Orange, burgundy, golden yellow, brown, rust, deep red
- **Mood**: Cozy, nostalgic, harvesting, transition
- **Activities**: Leaf peeping, harvest festivals, Halloween, Thanksgiving
- **Text Options**: "Autumn in...", "Fall Colors", "Harvest Time"

#### Winter
- **Elements**: Snowflakes, snow-covered landscapes, icicles, mittens, hot cocoa
- **Colors**: Cool blues, white, silver, deep navy, icy purples
- **Mood**: Calm, magical, cozy, festive, quiet
- **Activities**: Skiing, snowman building, holiday markets
- **Text Options**: "Winter Wonderland", "Snowy...", "Winter"

#### Christmas
- **Elements**: Ornaments, holly, candy canes, wreaths, lights, stars
- **Colors**: Red, green, gold, silver, white
- **Mood**: Festive, joyful, generous, traditional
- **Cultural Note**: Christian holiday, consider market appropriateness

#### Halloween
- **Elements**: Jack-o'-lanterns, bats, ghosts, haunted themes, autumn leaves
- **Colors**: Orange, black, purple, green (eerie)
- **Mood**: Spooky-fun, playful, mysterious
- **Cultural Note**: Primarily US/UK market

#### Valentine's Day
- **Elements**: Hearts, roses, love birds, romantic couples
- **Colors**: Red, pink, white, rose gold
- **Mood**: Romantic, sweet, affectionate
- **Text Options**: "Love...", "Romance in...", "♥"

---

## STYLE VARIATION SCENARIO (LEVELS 3-9)

### Purpose
Transform the visual aesthetic and artistic approach of a design while maintaining core elements and composition.

### What Changes
- Rendering technique (cartoon → realistic)
- Line quality (bold outlines → soft edges)
- Color application (flat → gradient)
- Detail level (simplified → intricate)
- Overall aesthetic (modern → vintage)

### What Stays
- Core elements and their arrangement
- Text content
- Basic compositional structure

### Level 3-4: Subtle Style Shifts
- Adjust line weights
- Modify color saturation approach
- Shift detail density
- Change texture application

### Level 5-6: Moderate Style Changes
- Switch rendering approach (flat → dimensional)
- Change artistic period influence
- Modify complexity level
- Adjust mood through technique

### Level 7-9: Major Style Transformation
- Complete artistic approach change
- Different medium simulation
- Era/period shift
- Fundamentally different visual language

---

## COMPOSITION VARIATION SCENARIO (LEVELS 2-8)

### Purpose
Restructure the spatial arrangement and visual hierarchy of design elements while maintaining recognizable components.

### This Is the Core of TRUE Variations
Composition variation is MANDATORY for true variations. Without spatial reconstruction, you only have surface changes.

### Key Transformations
- Horizontal → Vertical
- Centered → Asymmetric
- Flat → Layered depth
- Static → Dynamic journey
- Rectangle → Organic shape
- Single view → Multiple views
- Contained → Expansive

---

## FORMAT VARIATION SCENARIO (LEVELS 3-6)

### Purpose
Adapt designs for different product types while maintaining design integrity.

### Format-Specific Considerations

**Magnet (3.5" × 4")**
- Simplify dramatically
- Bold shapes only
- Maximum 2-4 words
- High contrast essential

**Bookmark (2.5" × 7")**
- Vertical stacking
- Structural reinforcements
- Narrow column format
- Connected elements

**Ornament (4" diameter)**
- Radial composition
- Hanging hole consideration
- Circular text flow
- Structural connections

**Keychain (1.5-2.5")**
- Ultra-simplified
- 1-2 words maximum
- Iconic symbols only
- Bold outlines only

---

# PART 10: ELEMENT LIBRARIES

---

## SONORAN DESERT ELEMENTS (HERMOSILLO, ARIZONA)

### FLORA (Desert Plants)

#### 1. Saguaro Cactus
**Copy-Paste Description**:
Tall columnar saguaro cactus (12-15% of canvas height) with 2-3 upward-curving arms. Ribbed texture shown through vertical lines, white blooms clustered at top and arm tips. Deep cactus green body (CMYK: 50, 0, 100, 30) with cream-white flowers (CMYK: 0, 0, 10, 5). Desert floor base shown with small rocks. Bold 1.5pt outline for laser-cut structural integrity, vertical rib details rendered in UV print.

**Usage Notes**: Icon of Sonoran Desert. Use 1-3 cacti of varying heights for landscape depth. Always show at least one arm for species recognition.

---

#### 2. Palo Verde Tree
**Copy-Paste Description**:
Palo verde tree with distinctive lime-green bark and delicate branching structure. Branches extend gracefully with small compound leaves (shown as printed detail, too fine for cutting). Bright yellow spring blooms in clusters along branches. Bark: lime green (CMYK: 40, 0, 80, 0), flowers: sunny yellow (CMYK: 0, 10, 100, 0). Branches: 1.5pt line weight, connecting to trunk at naturalistic angles.

**Usage Notes**: Arizona/Sonora state tree. Works well as side element or overhead branch. Name means "green stick" - emphasize the green bark.

---

#### 3. Ocotillo Plant
**Copy-Paste Description**:
Ocotillo with 5-8 tall spiny stalks radiating from central base. Each stalk straight and slightly curved at top, covered in small thorns (printed detail). Bright red tubular flowers clustered at stalk tips. Stalks: gray-brown (CMYK: 0, 10, 30, 50), blooms: vibrant red (CMYK: 0, 100, 80, 0). Stalks: 1.5pt line weight, minimum 0.125" width for structural stability.

**Usage Notes**: Dramatic radiating shape. Appears dead until rain, then blooms - symbol of desert resilience.

---

#### 4. Agave Americana
**Copy-Paste Description**:
Large agave with symmetrical rosette of thick pointed leaves (8-12 leaves visible). Each leaf broad at base, tapering to sharp point, with serrated edges. Blue-gray coloration (CMYK: 30, 10, 30, 0) with subtle lighter stripes along leaf centers. Leaves overlap at base, creating structural connection. Central flower stalk optional (quiote). Leaf outlines: 2pt for cutting strength.

**Usage Notes**: Source of tequila/mezcal. Sacred to indigenous peoples. Symmetrical shape works well for centered compositions or corners.

---

#### 5. Prickly Pear/Nopal Cactus
**Copy-Paste Description**:
Prickly pear with 3-5 flat paddle-shaped segments (nopales) stacked and overlapping. Each pad oval-shaped with small spine dots across surface. Bright magenta fruit (tunas) at top edges. Pads: vibrant green (CMYK: 40, 0, 100, 10), fruit: magenta (CMYK: 10, 100, 0, 0). Pads overlap with 2pt outline at junctions for laser-cut connection. Spines as small printed dots, not cut.

**Usage Notes**: Mexican national symbol. Important traditional food. Each pad connects to next for structure.

---

#### 6. Barrel Cactus
**Copy-Paste Description**:
Round barrel cactus with cylindrical shape, top-down view shows circular form with radiating spines. Side view shows ribbed texture with hooked spines. Yellow or red flowers at crown. Body: deep green (CMYK: 50, 0, 100, 40), flowers: golden yellow (CMYK: 0, 20, 100, 0). Circular or oval silhouette, 1.5pt outline, rib pattern as printed detail.

**Usage Notes**: Ground-level accent. Round shape provides contrast to vertical saguaro. Often in groups of 2-3.

---

#### 7. Cholla Cactus
**Copy-Paste Description**:
Teddy bear cholla with fuzzy-appearing branching segments. Main trunk with 4-6 arms extending at angles. Dense spines give soft appearance (ironic - very sharp). Silvery golden-tan color (CMYK: 0, 20, 50, 10). Simplified branching structure, 1.5pt lines, spine texture as printed pattern creating fuzzy effect.

**Usage Notes**: "Teddy bear" or "jumping" cholla. Deceptively dangerous. Good mid-ground element.

---

#### 8. Mesquite Tree
**Copy-Paste Description**:
Mesquite tree with gnarled trunk and spreading canopy. Compound leaves in delicate fernlike arrangement. Bean pods hanging in clusters. Bark: dark brown (CMYK: 0, 40, 60, 60), leaves: olive green (CMYK: 40, 0, 60, 30), pods: tan (CMYK: 0, 20, 40, 20). Branching structure: 1.5-2pt lines, leaf detail printed.

**Usage Notes**: Drought-resistant native tree. Source of food/wood for indigenous peoples.

---

### FAUNA (Desert Animals)

#### 9. Roadrunner
**Copy-Paste Description**:
Greater roadrunner in dynamic running pose, leaning forward with long tail trailing horizontal. Distinctive crest feathers raised on head. Long legs in mid-stride. Body: brown/tan (CMYK: 0, 40, 60, 40) with cream belly, blue/red facial skin accents. Tail length equals body length. Bold 1.5pt silhouette outline, feather texture as printed detail, small footprint trail optional.

**Usage Notes**: State bird of New Mexico. Desert speed symbol. Always shown running or in alert pose.

---

#### 10. Desert Bighorn Sheep
**Copy-Paste Description**:
Bighorn sheep in profile showing distinctive curved spiral horns. Muscular body, sure-footed stance on rocky outcrop. Horns curl back from head in C-shape. Body: tan/brown (CMYK: 0, 30, 50, 20) with white rump patch. Horns: darker brown with ridged texture (printed). Standing on simple rock formation. 1.5pt outline, horn curl clearly visible.

**Usage Notes**: Symbol of desert wilderness. Endangered species. Usually shown on elevated rocks/mountains.

---

#### 11. White-winged Dove
**Copy-Paste Description**:
White-winged dove in flight or perched, showing distinctive white wing crescents. Rounded body, fan-shaped tail, red eye. Body: soft gray-brown (CMYK: 0, 20, 30, 40), white wing bars (CMYK: 0, 0, 0, 0). Flight pose: wings spread in V-shape showing white patches. Perched: wing bars visible at rest. Simplified silhouette, 1.5pt outline.

**Usage Notes**: Sonoran summer symbol. Important to Tohono O'odham culture.

---

#### 12. Javelina/Peccary
**Copy-Paste Description**:
Collared peccary (javelina) in side profile. Pig-like body with bristled coat, distinctive white collar stripe across shoulders. Small tusks, compact build. Body: dark gray-brown (CMYK: 0, 30, 40, 60), collar: cream (CMYK: 0, 10, 20, 10). Bristle texture as printed detail. Usually shown in group of 2-3. 1.5pt outline silhouette.

**Usage Notes**: Desert forager, travels in herds. Not actually pigs (different family).

---

#### 13. Gila Monster
**Copy-Paste Description**:
Gila monster lizard in profile showing distinctive beaded orange-and-black pattern. Stout body, thick tail, walking pose. Pattern: alternating orange (CMYK: 0, 70, 100, 10) and black (CMYK: 0, 0, 0, 100) in irregular bands. Beaded texture shown through small scale pattern (printed detail). Forked tongue optional. 2pt outline for body definition.

**Usage Notes**: Only venomous lizard in US. Protected species. Orange/black pattern is key identifier.

---

#### 14. Cactus Wren
**Copy-Paste Description**:
Cactus wren perched on cactus arm, tail cocked upward. Spotted breast, white eyebrow stripe, curved beak. Body: brown with black/white spotting (CMYK: 0, 40, 60, 40 with black spots), white belly. Tail angled up at 45°. Often shown on saguaro. 1.5pt outline, spot pattern printed.

**Usage Notes**: Arizona state bird. Nests in cholla/saguaro. Bold personality.

---

#### 15. Desert Tortoise
**Copy-Paste Description**:
Desert tortoise in side view, domed shell with geometric scute pattern. Four stumpy legs, small head extended. Shell: olive-brown (CMYK: 40, 40, 80, 40) with darker scute outlines. Carapace pattern: hexagonal plates. Slow walking pose. 1.5pt outline, scute pattern as printed detail.

**Usage Notes**: Threatened species. Lives 50-80 years. Symbol of desert endurance and patience.

---

### CULTURAL MOTIFS

#### 16. Seri Basketry Diamond Pattern
**Copy-Paste Description**:
Traditional Seri coiled basket pattern featuring repeating diamond shapes with stepped edges. Geometric design: central diamonds nested inside larger diamonds, connected by zigzag lines. Colors: natural tan/brown (CMYK: 0, 20, 40, 20) with dark brown accents (CMYK: 0, 40, 60, 60), traditional red highlights (CMYK: 0, 100, 100, 20). Pattern repeats 3-5 times for border or fill. Line weight: 1pt for geometric clarity.

**Usage Notes**: Seri (Comcaác) are coastal Sonoran indigenous people. Basketry is UNESCO heritage. Use for borders, letter fills, or background patterns.

---

#### 17. Seri Shell Necklace Motif
**Copy-Paste Description**:
Traditional Seri shell necklace with cowrie and cone shells alternating on curved strand. 8-12 shells shown, various sizes. Shells: cream/white (CMYK: 0, 5, 15, 5) with brown openings. Strand curves gently, shells oriented same direction. Each shell simple oval or cone shape, 1.5pt outline. Can form border or decorative arc.

**Usage Notes**: Seri are coastal people, shells represent Sea of Cortez connection. Use as border or decorative chain.

---

#### 18. Yaqui Deer Dance Symbol
**Copy-Paste Description**:
Stylized deer head with branching antlers, adorned with red flowers (representing sacred dance). Deer face simplified, alert ears, gentle eyes. Antlers branch 3-4 times with red hibiscus flowers at tips. Deer: white/cream (CMYK: 0, 5, 10, 5), flowers: red (CMYK: 0, 100, 80, 0), antlers: brown. Symmetrical frontal view. 1.5pt outline, flower details printed.

**Usage Notes**: Yaqui Easter ceremony (Pascola). Sacred dance representing nature/spirit world. Highly significant cultural symbol - use respectfully.

---

#### 19. Mission San Xavier del Bac Architecture
**Copy-Paste Description**:
Iconic white mission church facade with central dome and twin bell towers (one incomplete). Baroque Spanish colonial style with ornate carved entrance. Main dome centered, flanked by rectangular towers. White adobe (CMYK: 0, 0, 10, 5), terracotta roof tiles (CMYK: 0, 60, 80, 20). Arched entrance with decorative molding. Simplified facade showing key architectural elements. 1.5pt outlines.

**Usage Notes**: "White Dove of the Desert" south of Tucson. Active Tohono O'odham mission since 1700s.

---

#### 20. Traditional Arco (Adobe Arch)
**Copy-Paste Description**:
Southwest adobe architectural arch with thick walls tapering at top. Smooth rounded arch opening, visible adobe texture (printed detail). Wall color: terracotta/salmon pink (CMYK: 0, 40, 50, 10) or cream. Optional: small clay pots, hanging dried chiles, wooden beams (vigas) visible through arch. 2pt outline for arch definition.

**Usage Notes**: Traditional Sonoran architecture element. Can frame other design elements.

---

### GEOGRAPHY & LANDSCAPE

#### 21. Sea of Cortez Waves with Marine Life
**Copy-Paste Description**:
Stylized wave patterns with curling crests (Japanese wave influence) containing silhouettes of marine life. 2-3 waves in graduated sizes, turquoise to deep blue gradient (CMYK: 60, 0, 20, 0 to 100, 60, 0, 20). Swimming through waves: sea turtle, fish, shrimp, ray. White foam details at wave crests. Waves: 1.5pt outline, marine life: 1.5pt silhouettes.

**Usage Notes**: "World's Aquarium" (Cousteau). Rich biodiversity.

---

#### 22. Sonoran Mountain Ridges (Layered)
**Copy-Paste Description**:
Three layered mountain ridges creating depth: foreground (dark), middle (medium), background (light). Angular peaks suggesting Sierra Madre Occidental range. Colors: foreground: deep purple-brown (CMYK: 40, 60, 40, 40), middle: medium purple (CMYK: 30, 40, 20, 20), background: light lavender (CMYK: 20, 20, 10, 5). Each ridge: simplified angular silhouette, 1.5pt outline, separated for laser-cut layers.

**Usage Notes**: Creates atmospheric depth. Typical of Sonoran Desert horizons.

---

#### 23. Desert Sunrise/Sunset Sun
**Copy-Paste Description**:
Stylized sun with geometric Art Deco rays. Central circle with radiating alternating ray types: 8 long triangular rays (points outward) alternating with 8 short curved rays. Sun center: golden yellow (CMYK: 0, 15, 100, 0), rays: gradient from gold to orange (CMYK: 0, 50, 100, 0) to red (CMYK: 0, 100, 100, 0). Rays: 1.5pt outline, geometric precision.

**Usage Notes**: Sonoran Desert sun intensity symbol. Works as background or central medallion.

---

### DECORATIVE ELEMENTS

#### 24. Roadrunner Footprint Trail
**Copy-Paste Description**:
Series of 4-6 roadrunner track marks in walking pattern. Each footprint: X-shape showing two forward toes, two back toes at angles. Prints alternate left/right along diagonal or curved path. Dark brown or black (CMYK: 0, 40, 60, 80). Each print simplified to clear X-shape. 1pt lines for delicate trail effect.

**Usage Notes**: Suggests movement and desert wildlife. Fills negative space.

---

#### 25. Desert Wildflower Cluster (Spring Blooms)
**Copy-Paste Description**:
Small cluster of desert wildflowers: brittlebush (yellow daisy-like), desert lupine (purple spikes), Mexican gold poppy (orange cups). 3-5 flowers in natural grouping. Colors: bright yellow (CMYK: 0, 10, 100, 0), purple (CMYK: 60, 80, 0, 0), orange (CMYK: 0, 60, 100, 0). Simple flower shapes: 5-petal daisies, spike clusters, cup shapes. 1.5pt outlines.

**Usage Notes**: Sonoran spring wildflower "superbloom" when rains are good. Adds color and delicacy.

---

#### 26. Traditional Mexican Star (Estrella) Pattern
**Copy-Paste Description**:
Eight-pointed star (estrella) with geometric construction: two overlapping squares rotated 45°. Optional: small circle at center. Star outline in single color or alternating ray colors. Primary star: gold or terracotta (CMYK: 0, 40, 60, 10), outline: 1.5pt. Can be solid, outline-only, or patterned fill.

**Usage Notes**: Traditional Mexican decorative motif. Celestial symbol. Works as repeated pattern or single accent.

---

## COMBINATION SUGGESTIONS

**Desert Landscape Scene**: Saguaro + Palo Verde + Barrel Cactus + Desert Floor + Mountain Ridges + Sunset Sun

**Wildlife Focus**: Roadrunner + White-winged Dove + Prickly Pear + Footprint Trail

**Cultural Heritage**: Mission Architecture + Seri Basketry Pattern + Traditional Star + Adobe Arch

**Coastal Sonora**: Sea of Cortez Waves + Seri Shell Necklace + Marine Life + Prickly Pear

---

# PART 11: SAFETY & CONTENT GUIDELINES

---

## GEMINI SAFETY ALIGNMENT GUIDE

### Purpose
Ensure all design prompts align with Gemini's content policies while maintaining cultural authenticity and quality.

### Critical Principle
Gemini uses "Depiction is Not Endorsement" protocol. Our job is to create culturally authentic, respectful prompts that celebrate heritage without triggering safety blocks.

---

## CONTENT TO ABSOLUTELY AVOID

### 1. Child Safety
- No children in any design elements
- No imagery that could be interpreted as exploitative
- **Safe alternative**: Focus on adult cultural celebrations, landscapes, architecture

### 2. Dangerous Activities
- No weapons (even historical/cultural)
- No drug-related imagery (even traditional/ceremonial)
- No self-harm symbolism
- **Safe alternative**: Focus on celebrations, crafts, nature, architecture, food

### 3. Violent/Gory Content
- No blood or injury depictions
- No violent historical scenes (conquest, revolution, battles)
- No animal cruelty or hunting scenes
- **Safe alternative**: Peaceful cultural scenes, artisan work, festivals, landscapes

### 4. Harassment/Discrimination
- **CRITICAL**: No suggestions that any group is inferior, superior, or "less than human"
- No dehumanizing comparisons to animals (even playful)
- No stereotypes that demean or mock
- **Safe alternative**: Authentic, researched, respectful cultural representation

### 5. Explicit Sexual Content
- No sexual imagery or innuendo
- No explicit body parts
- **Safe alternative**: Family-friendly cultural celebrations, traditional dress (respectfully depicted)

---

## HIGH-RISK ELEMENTS FOR MEXICAN DESIGNS

### Symbols & Imagery That May Block:

**Revolutionary/Political Symbols**
- Che Guevara imagery
- Revolutionary rifles/weapons
- Zapata/Villa with weapons
- Political party symbols
- Protest imagery with aggressive stances

**Potentially Problematic Historical References**
- Conquest scenes (Spanish vs. Indigenous - shows violence/superiority)
- Aztec human sacrifice imagery
- Skull imagery (La Catrina is OK if celebratory, not violent)
- Revolutionary battle scenes

**Stereotypes That Suggest Inferiority**
- Sleeping person under cactus (lazy stereotype)
- Drunk/intoxicated depictions
- "Primitive" or "savage" indigenous portrayals
- Comparisons to animals (even if meant playfully)
- Servant/subservient positions

**Religious Imagery Concerns**
- Virgin of Guadalupe (sacred, commercial use may block)
- Catholic saints in irreverent contexts
- Indigenous sacred symbols used decoratively
- Crosses combined with violent imagery

**"Historical Propaganda Style" Triggers**
- Muralist style with political messages
- "Revolutionary poster" aesthetic
- Nationalist superiority messaging
- Any "us vs. them" visual narrative

---

## SAFE & EFFECTIVE CULTURAL ELEMENTS

### Landscapes & Nature (ALWAYS SAFE)
- Sonoran Desert flora (saguaro, palo verde, ocotillo, agave)
- Sea of Cortez marine life (turtles, fish, waves)
- Mountain ranges, beaches, natural formations
- Sunset/sunrise over landscapes
- Desert wildflowers, cacti in bloom
- Birds (roadrunners, hummingbirds, doves)
- Non-aggressive animals (deer, butterflies, monarch migration)

### Architecture & Crafts (SAFE)
- Mission architecture (arches, bell towers, adobe)
- Colonial hacienda facades (colorful walls, courtyards)
- Traditional pottery and ceramics
- Woven textiles and basketry patterns
- Talavera tile designs
- Papel picado (decorative cut paper)
- Artisan workshops (weaving, pottery-making)

### Celebrations & Culture (SAFE IF RESPECTFUL)
- Day of the Dead CELEBRATION (not macabre/violent skulls)
- Marigold flowers (cempasúchil)
- Colorful street festivals
- Traditional dance (WITHOUT revolutionary context)
- Musical instruments (guitars, marimbas, harps)
- Traditional food (NOT as stereotype, but celebration)
- Piñatas, decorative banners, festive elements

### Indigenous Elements (SAFE IF AUTHENTIC & RESPECTFUL)
- Geometric patterns from specific tribes (Seri, Zapotec, etc.)
- Traditional basketry and weaving designs
- Architectural elements (pyramids as monuments, not sacrifice sites)
- Astronomical/calendar symbols (factual, educational context)
- Traditional crafts being made by artisans
- Authentic traditional dress (NOT costumes or caricatures)

---

## PRE-SUBMISSION SAFETY CHECKLIST

### Content Check:
- [ ] No weapons, even historical/ceremonial ones
- [ ] No violent historical scenes (conquest, revolution, battles)
- [ ] No stereotypes suggesting laziness, inferiority, or primitiveness
- [ ] No political/revolutionary symbols or figures
- [ ] No comparisons of people to animals
- [ ] No suggestions of superiority/inferiority of any group
- [ ] No sacred religious imagery used commercially/irreverently
- [ ] No children depicted in any way
- [ ] No blood, gore, or violent imagery

### Language Check:
- [ ] Using descriptive language ("The design features...") not prescriptive ("You must create...")
- [ ] Avoiding "propaganda poster style" or similar politically-loaded terms
- [ ] Avoiding terms like "primitive," "savage," "exotic," "inferior," "superior"
- [ ] Using specific tribal/cultural names (Seri, Zapotec) not generalized terms
- [ ] Respecting cultural context (celebration, not exploitation)

### Cultural Authenticity Check:
- [ ] Elements are researched and regionally accurate
- [ ] Indigenous elements are specific and respectful, not generic
- [ ] Historical references are factual and non-violent
- [ ] Traditional dress/crafts shown in authentic context
- [ ] Avoiding tourist-trap stereotypes (sombrero + sleeping + cactus)

---

## HOW TO FIX BLOCKED PROMPTS

### Common Triggers & Fixes:

**TRIGGER: "Historical propaganda poster style"**
- ❌ Remove: Any reference to "propaganda," "revolutionary posters," "nationalist art"
- ✅ Replace with: "Vibrant vintage travel poster," "Art Deco design," "Mid-century modern illustration"

**TRIGGER: Indigenous peoples + historical context**
- ❌ Remove: References to conquest, subjugation, "native tribes" in colonial context
- ✅ Replace with: "Traditional Seri basketry patterns," "Zapotec geometric designs," focus on crafts/culture not history

**TRIGGER: Weapons/violence even if historical**
- ❌ Remove: Any guns, knives, swords, even ceremonial
- ✅ Replace with: Tools of craft (weaving shuttles, pottery tools), musical instruments, agricultural implements

**TRIGGER: Stereotypical imagery**
- ❌ Remove: Sleeping figures, excessive drinking, "lazy" depictions, sombrero as main element
- ✅ Replace with: Active artisans, festival dancers, musicians, craftspeople at work

**TRIGGER: Skulls/death imagery (context-dependent)**
- ❌ Avoid: Violent skulls, dark/macabre presentation, skull as threat
- ✅ Safe: Decorated La Catrina skulls in Day of Dead CELEBRATION context with flowers, bright colors, festive setting

**TRIGGER: Religious icons**
- ❌ Remove: Virgin of Guadalupe, specific saints, sacred indigenous symbols
- ✅ Replace with: Generic decorative elements, geometric patterns, natural symbols (sun, moon, stars)

---

## STYLE DESCRIPTORS THAT WORK

**SAFE Style References:**
- "Vintage travel poster aesthetic"
- "Mid-century modern illustration style"
- "Art Deco geometric design"
- "Contemporary Mexican graphic design"
- "Colorful collage aesthetic"
- "Folk art illustration style"
- "Retro postcard design"
- "Decorative badge/medallion style"

**AVOID Style References:**
- "Propaganda poster" ❌
- "Revolutionary art style" ❌
- "Nationalist design" ❌
- "Political muralism" ❌
- "Protest art aesthetic" ❌

---

## GOLDEN RULES FOR GEMINI SUCCESS

### DO:
1. Use specific, researched cultural elements
2. Celebrate beauty, craftsmanship, heritage, nature
3. Frame as celebration and cultural pride
4. Use "vintage travel poster" not "propaganda poster"
5. Be VERY specific (not "symbols" but "Talavera tile patterns")
6. Focus on landscapes, architecture, crafts, festivals
7. Respect sacred and indigenous elements
8. Use descriptive language about what design "features"
9. Verify against safety checklist before submission
10. Keep family-friendly, tourist-appropriate tone

### DON'T:
1. Include weapons, even historical/ceremonial
2. Depict violence, conquest, battles, blood
3. Use stereotypes (sleeping, lazy, primitive, inferior)
4. Reference political/revolutionary symbols or figures
5. Use "propaganda poster" or "revolutionary style" language
6. Compare people to animals
7. Suggest any group is superior or inferior
8. Use vague terms like "historical symbols" or "traditional banners"
9. Include children in any depiction
10. Show sacred religious imagery irreverently

---

# PART 12: VALIDATION CHECKLISTS

---

## MANDATORY PRE-GENERATION VERIFICATION

### 2:1 HORIZONTAL (10" × 5")

```
═══════════════════════════════════════════════════════════════
MANDATORY PRE-GENERATION VERIFICATION
═══════════════════════════════════════════════════════════════

Before generating this design, confirm you understand:

□ Canvas is EXACTLY 10 inches WIDE × 5 inches TALL (2:1 horizontal ratio)
□ This is a WIDE RECTANGLE, NOT a square
□ Design MUST span the FULL 10" WIDTH from left edge to right edge
□ Elements distributed HORIZONTALLY across canvas (not centered in middle)
□ Text MUST span minimum 8 inches of the 10" width (80% minimum)
□ Background fills the ENTIRE 10" × 5" rectangle edge-to-edge
□ NO centered 5"×5" square composition with empty side borders
□ Composition emphasizes HORIZONTAL FLOW (panoramic landscape style)

CRITICAL: If you create a centered square design, this will FAIL production.

Reply "DIMENSIONS VERIFIED: 10" WIDE × 5" TALL - HORIZONTAL SPAN CONFIRMED"
before generating the image.
```

---

### 1:1 SQUARE (8" × 8")

```
═══════════════════════════════════════════════════════════════
MANDATORY PRE-GENERATION VERIFICATION
═══════════════════════════════════════════════════════════════

Before generating this design, confirm you understand:

□ Canvas is EXACTLY 8 inches × 8 inches (perfect 1:1 square)
□ Design MUST have balanced composition in ALL FOUR DIRECTIONS
□ All four corners should have visual interest (no empty corners)
□ Use radial, symmetric, or centered focal arrangements
□ Equal visual weight in all quadrants
□ Background fills the ENTIRE 8" × 8" square edge-to-edge
□ NO elongated horizontal or vertical bias
□ Composition works when viewed from any rotation

CRITICAL: This is a SQUARE format - avoid horizontal or vertical compositions.

Reply "DIMENSIONS VERIFIED: 8" × 8" SQUARE - BALANCED COMPOSITION CONFIRMED"
before generating the image.
```

---

### BOTTLE OPENER (3" × 6")

```
═══════════════════════════════════════════════════════════════
MANDATORY PRE-GENERATION VERIFICATION - CRITICAL FUNCTIONAL REQUIREMENTS
═══════════════════════════════════════════════════════════════

Before generating this design, confirm you understand:

PHYSICAL STRUCTURE:
□ Canvas is EXACTLY 3 inches WIDE × 6 inches TALL (1:2 vertical ratio)
□ Outer shape is a ROUNDED RECTANGLE (0.25" corner radius)
□ Background is NATURAL WOOD TEXTURE (not full color coverage)

CRITICAL - THREE VOID AREAS (COMPLETELY EMPTY):
□ TOP VOID: Large circle 1.2" diameter - for BOTTLE OPENING function
□ MIDDLE VOIDS: Two small circles 0.3" diameter each - for MOUNTING HOLES
□ These areas will be CUT OUT completely - NOTHING can be placed here
□ Design elements MUST FLOW AROUND these three voids

LAYOUT REQUIREMENTS:
□ Text curves ABOVE the large top void (not through it)
□ Main scenic elements positioned BETWEEN and AROUND the middle voids
□ Bottom section has full 3" width available for design
□ All design elements avoid the three circular void areas
□ Use vegetation/elements to naturally "frame" the void edges

CRITICAL: If you place ANY design elements in the three void areas,
they will be laser-cut away and lost in production.

Reply "VOID AREAS CONFIRMED: 3 CIRCLES EMPTY - DESIGN FLOWS AROUND VOIDS"
before generating the image.
```

---

### MAGNET (3.5" × 4")

```
═══════════════════════════════════════════════════════════════
MANDATORY PRE-GENERATION VERIFICATION
═══════════════════════════════════════════════════════════════

Before generating this design, confirm you understand:

□ Canvas is EXACTLY 3.5 inches WIDE × 4 inches TALL (small vertical format)
□ This is a SMALL product viewed from REFRIGERATOR DISTANCE (5-10 feet)
□ Design MUST be SIMPLIFIED with BOLD shapes and HIGH CONTRAST
□ NO fine details smaller than 0.125" (won't be visible at viewing distance)
□ Text minimum 0.5" tall with 2-3pt bold outlines
□ Limit text to 2-4 words maximum
□ Use bolder line weights (2-3pt) for all main elements
□ High contrast essential for visibility
□ Background fills the ENTIRE 3.5" × 4" area

CRITICAL: Small size = simplified design. Complex details will be invisible.

Reply "DIMENSIONS VERIFIED: 3.5" × 4" MAGNET - SIMPLIFIED BOLD DESIGN CONFIRMED"
before generating the image.
```

---

### BOOKMARK (2.5" × 7")

```
═══════════════════════════════════════════════════════════════
MANDATORY PRE-GENERATION VERIFICATION
═══════════════════════════════════════════════════════════════

Before generating this design, confirm you understand:

□ Canvas is EXACTLY 2.5 inches WIDE × 7 inches TALL (very narrow vertical)
□ Tassel hole: 0.1875" diameter, centered, 0.375" from top edge
□ Design flows VERTICALLY in narrow column format
□ Elements STACKED TOP TO BOTTOM along 7" height
□ Text oriented vertically or stacked in narrow format
□ Text sized to ~70-80% of 2.5" width maximum
□ Narrow format requires HORIZONTAL REINFORCEMENTS for stability
□ All vertical elements MUST connect at multiple points
□ Background fills the ENTIRE 2.5" × 7" area
□ Account for tassel hole at top (keep clear)

CRITICAL: Ultra-narrow format - elements must stack vertically and connect.

Reply "DIMENSIONS VERIFIED: 2.5" × 7" BOOKMARK - VERTICAL STACK WITH REINFORCEMENTS CONFIRMED"
before generating the image.
```

---

### ORNAMENT (4" DIAMETER)

```
═══════════════════════════════════════════════════════════════
MANDATORY PRE-GENERATION VERIFICATION
═══════════════════════════════════════════════════════════════

Before generating this design, confirm you understand:

□ Canvas is EXACTLY 4 inch DIAMETER CIRCLE (not square or rectangle)
□ Hanging hole: 0.25" diameter at top center, 0.5" from edge
□ Design MUST follow CIRCULAR composition (radial or concentric)
□ All elements connect to outer circle or each other (no floating pieces)
□ Text curves along circular path or centers in middle
□ Radial designs need structural cross-connections for stability
□ Background fills the ENTIRE 4" diameter circle edge-to-edge
□ Account for hanging hole at top (keep text/main elements clear)
□ Design readable when ornament hangs vertically

CRITICAL: Circular format requires radial composition and structural connections.

Reply "DIMENSIONS VERIFIED: 4" DIAMETER CIRCLE - RADIAL COMPOSITION WITH HANGING HOLE CONFIRMED"
before generating the image.
```

---

### COASTER (3.5" × 3.5")

```
═══════════════════════════════════════════════════════════════
MANDATORY PRE-GENERATION VERIFICATION
═══════════════════════════════════════════════════════════════

Before generating this design, confirm you understand:

□ Canvas is EXACTLY 3.5 inches × 3.5 inches (small perfect square)
□ This is a FUNCTIONAL surface (drinks placed on top)
□ Design MUST be balanced in all four directions
□ Centered or radial composition works best
□ All four corners should have visual interest
□ Background fills the ENTIRE 3.5" × 3.5" square
□ Consider that center may be covered by glass/cup
□ Important elements positioned around perimeter or in middle
□ Simplified design appropriate for small viewing size

CRITICAL: Small square format - balanced composition, functional surface.

Reply "DIMENSIONS VERIFIED: 3.5" × 3.5" COASTER - BALANCED SQUARE CONFIRMED"
before generating the image.
```

---

### KEYCHAIN (1.5-2.5")

```
═══════════════════════════════════════════════════════════════
MANDATORY PRE-GENERATION VERIFICATION
═══════════════════════════════════════════════════════════════

Before generating this design, confirm you understand:

□ Canvas is EXACTLY 1.5-2.5 inches in largest dimension (ULTRA SMALL)
□ Attachment hole: 0.125" diameter at top
□ This is the SMALLEST product - MAXIMUM SIMPLIFICATION required
□ BOLD shapes only - NO fine details whatsoever
□ Text minimum 0.5" tall with 3pt BOLD outlines
□ Limit to 1-2 words maximum OR iconic symbol only
□ Line weights 2-3pt minimum for all elements
□ Ultra-high contrast essential
□ Durable design (thick connections, no thin elements)
□ Design recognizable at arm's length distance

CRITICAL: Ultra-small size = iconic symbols and bold text ONLY.

Reply "DIMENSIONS VERIFIED: 1.5-2.5" KEYCHAIN - ULTRA-SIMPLIFIED BOLD DESIGN CONFIRMED"
before generating the image.
```

---

## TRUE VARIATION VALIDATION CHECKLIST

Before submitting any variation prompt, verify:

- [ ] **Creative concept stated in one sentence**
- [ ] **Spatial structure completely different**
- [ ] **Characters/elements doing new actions**
- [ ] **5-10 new elements added (simply listed)**
- [ ] **40-60% recognizability (not 85% similar)**
- [ ] **Could NOT overlay with original**
- [ ] **Prompt is 150-300 words total**
- [ ] **80% focuses on transformation, not preservation**
- [ ] **No technical specs (CMYK, line weights)**
- [ ] **Clear before → after changes listed**

---

## QUALITY CHECKLIST (BEFORE SUBMITTING)

- [ ] Composition framework named
- [ ] Hero element 30-80% (appropriate to framework)
- [ ] 5-10 supporting elements listed
- [ ] Decoration density specified (6/10, 8/10, 10/10)
- [ ] Primary text 15-25% height (NEVER smaller)
- [ ] Style descriptor from library used
- [ ] Color palette: 4-6 simple names (NO CMYK)
- [ ] NO technical specs
- [ ] Edge treatment specified (organic irregular default)
- [ ] Production note at end
- [ ] Ends with "CREATE DESIGN"
- [ ] Total 200-350 words

---

# PART 13: COMPLETE PROMPT TEMPLATE

---

## SPEED-OPTIMIZED PROMPT TEMPLATE (200-350 WORDS)

```
**FORMAT:** [Square 1:1 / Portrait 4:5 / Landscape 5:4 / Circle / 2:1 Horizontal]

**SUBJECT:** [One sentence: Hero + action/state + setting + destination]

**COMPOSITION STRUCTURE:** [2-3 sentences: Framework name, hero placement %, visual flow, balance]

**PROTAGONIST ELEMENT:** [30-50 words: Hero details, size %, position, pose/action if character, defining features]

**SUPPORTING ELEMENTS (Regional/Cultural):**
• [Element 1 - name, position, size/role]
• [Element 2 - name, position, size/role]
• [Element 3 - name, position, size/role]
• [Element 4 - name, position, size/role]
• [Element 5 - name, position, size/role]
• [5-10 items total]

**DECORATIVE LAYER:** [20-30 words: Decoration density (6/10, 8/10, 10/10), what fills negative space, pattern systems]

**TEXT INTEGRATION:**
• Primary: "[DESTINATION NAME]" - [placement], [size: 15-25% height], [style: bold/hand-lettered/vintage/modern]
• Secondary: "[Subtitle/Region]" - [placement], [size: 6-8% height]

**STYLE & AESTHETIC:** [30-40 words: Copy from STYLE_DESCRIPTORS + mood/tone. Examples: Whimsical Cartoon, Realistic Illustrative, Vintage Travel Poster, Modern Flat Design, Vintage Naturalist, Decorative Folk Art, Mystical Atmospheric]

**COLOR PALETTE:** [15-20 words: 4-6 simple color names - NO CMYK. Example: "Bright turquoise water, coral pink flowers, deep forest green, golden sunset, warm browns"]

**EDGE TREATMENT:** [1 sentence: Organic irregular shape following natural contours / Perfect circle / Specific format. Default = organic irregular]

**PRODUCTION:** [1 sentence: All elements structurally connected for laser-cut MDF / High-resolution full-color print / Both]

**CREATE DESIGN**
```

---

## VARIATION PROMPT TEMPLATE (150-300 WORDS)

```
FORMAT: [Size specification]

CONCEPT: [One-sentence creative hook describing transformation]

SPATIAL RECONSTRUCTION:
[2-3 sentences how layout completely changes]

CHARACTER TRANSFORMATION:
[How elements actively change behavior/poses]

NEW ELEMENTS ADDED:
- [Item 1]
- [Item 2]
- [Item 3]
- [Item 4]
- [Item 5]
- [5-10 items total, no details needed]

CHANGES:
- Spatial: [Old structure] → [New structure]
- Characters: [Old pose] → [New action]
- Text: [Old placement] → [New arrangement]
- Style: [If applicable]

CREATE DESIGN
```

---

# PART 14: QUICK REFERENCE COMMANDS

---

## MASTER PROMPT BUILDER COMMANDS

### Fastest (10 seconds)
```
CREATE_VARIATION: "Hermosillo, Christmas, Professional"
```

### Standard (30 seconds)
```
CREATE_VARIATION:
  destination: "Hermosillo"
  theme: "Christmas"
  level: 6
  format: "2:1"
```

### Detailed (2 minutes)
```
CREATE_VARIATION:
  original: "[description]"
  destination: "Hermosillo"
  theme: "Christmas"
  type: "seasonal"
  level: 6
  format: "1:1 square"
  decoration: 8
  elements_count: 5
  output: "streamlined"
```

---

## ONE-LINE MAGIC COMMANDS

```
# Professional standard variation
QUICK_PRO: "[destination]" → Level 6, Streamlined, 5 elements

# Holiday seasonal
QUICK_HOLIDAY: "[destination] [holiday]" → Level 5, Seasonal elements

# Bold artistic
QUICK_BOLD: "[destination]" → Level 8, Style variation

# Testing set
QUICK_TEST: "[destination]" → Generates 3 variations at levels 3, 5, 7
```

---

## BATCH GENERATION

```
BATCH_CREATE:
  base: "Hermosillo design"
  variations:
    - level: 3 (subtle)
    - level: 5 (moderate)
    - level: 7 (bold)
  output_all: true
```

---

## FAMILY GENERATION

```
FAMILY_CREATE:
  original: "Hermosillo landmark"
  create:
    - type: "color", level: 3
    - type: "seasonal", theme: "Christmas", level: 5
    - type: "style", aesthetic: "modern", level: 6
```

---

## QUICK CHECKLIST CONFIRMATIONS

**Copy these checklist endings for each format:**

- **2:1 Horizontal**: `"DIMENSIONS VERIFIED: 10" WIDE × 5" TALL - HORIZONTAL SPAN CONFIRMED"`
- **1:1 Square**: `"DIMENSIONS VERIFIED: 8" × 8" SQUARE - BALANCED COMPOSITION CONFIRMED"`
- **1:2 Vertical**: `"DIMENSIONS VERIFIED: 5" WIDE × 10" TALL - VERTICAL STACK CONFIRMED"`
- **Bottle Opener**: `"VOID AREAS CONFIRMED: 3 CIRCLES EMPTY - DESIGN FLOWS AROUND VOIDS"`
- **Magnet**: `"DIMENSIONS VERIFIED: 3.5" × 4" MAGNET - SIMPLIFIED BOLD DESIGN CONFIRMED"`
- **Bookmark**: `"DIMENSIONS VERIFIED: 2.5" × 7" BOOKMARK - VERTICAL STACK WITH REINFORCEMENTS CONFIRMED"`
- **Ornament**: `"DIMENSIONS VERIFIED: 4" DIAMETER CIRCLE - RADIAL COMPOSITION WITH HANGING HOLE CONFIRMED"`
- **Coaster**: `"DIMENSIONS VERIFIED: 3.5" × 3.5" COASTER - BALANCED SQUARE CONFIRMED"`
- **Keychain**: `"DIMENSIONS VERIFIED: 1.5-2.5" KEYCHAIN - ULTRA-SIMPLIFIED BOLD DESIGN CONFIRMED"`

---

# END OF COMPLETE DESIGN SYSTEM MANUAL

---

**Document Version:** 1.0
**Total Parts:** 14
**Total Pages:** 40+
**Last Updated:** January 2025

This document contains ALL text instructions from the design generation repository consolidated into a single comprehensive reference manual.
