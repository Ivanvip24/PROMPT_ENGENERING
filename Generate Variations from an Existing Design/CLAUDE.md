# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Purpose

This is a **prompt engineering system** for generating variations of existing souvenir designs. It is NOT executable code - it's a documentation and framework repository that provides structured prompts, agents, and guidelines for creating design variations using AI (Claude).

**Key Point**: This repository contains markdown documentation that defines a design variation workflow system. Users interact with this system by reading the guides and using the documented agent prompts with Claude or other AI systems.

## ⚠️ CRITICAL: What "Variation" Means in This System

**→ See `reference/TRUE_VARIATION_DEFINITION.md` for complete definition and validation checklist**

## 🚀 OPTIMIZED System Architecture

### Quick Start Points
- **→ START_HERE.md** - Begin here for fastest results
- **→ CHEAT_SHEET.md** - Everything on 1 page
- **→ QUICK_COMMANDS.md** - Copy-paste commands for instant results

### Core System Components

**🎯 Simplified 2-Agent System** (`agents/`)
- **creation-agent.md** - Generates variations + checks production (combines 2 former agents)
- **validation-agent.md** - Validates variations + checks family cohesion (combines 2 former agents)

**📚 Core Concepts** (`core/`)
- **TRUE_VARIATION_DEFINITION.md** - Single source of truth (eliminates redundancy)
- **TRANSFORMETER_SCALE.md** - The 1-10 intensity scale
- **WORKFLOW.md** - Standard 6-step process

**⚡ Smart Generators** (`generators/`)
- **MASTER_PROMPT_BUILDER.md** - Single intelligent entry point (auto-detects everything)

**⚙️ Configuration** (`settings/`)
- **defaults.yaml** - Smart defaults (70% less configuration needed)

**📖 References** (`reference/`)
- Element libraries by region
- Prompt templates (streamlined & full)
- Production specifications

### Critical Concepts

**Sacred Elements**: Design components that must be preserved across variations to maintain identity (e.g., primary landmarks, destination names, core brand elements)

**Visual DNA**: Shared design language that makes a family recognizable (color approach, typography, style treatment, compositional patterns)

**Family Cohesion**: The balance between variation unity (feeling related) and differentiation (serving distinct purposes)

**Production Constraints**: All designs must be compatible with laser-cut MDF production (vector-based, appropriate line weights, structural connectivity)

## Workflow for Users

**→ See `INIT.md` for the complete 6-step workflow and quick start instructions**

## 🎯 NEW TRANSFORMATION-FIRST WORKFLOW

### CRITICAL UPDATE: 150-300 Word Formula Now Standard
After extensive testing, we've discovered that **brevity + transformation focus = 80-90% success rate**.

### The Core Formula (3-4 minutes per variation)

**→ See `reference/VARIATION_PROMPT_FORMULA.md` for the complete formula**

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

### Essential References for True Variations

1. **`reference/TRUE_VARIATION_DEFINITION.md`** - What makes a true variation
2. **`reference/VARIATION_PROMPT_FORMULA.md`** - The winning 150-300 word structure
3. **`reference/SPATIAL_RECONSTRUCTION_PATTERNS.md`** - Proven compositional transformations
4. **`reference/ACTION_TRANSFORMATION_LIBRARY.md`** - Dynamic verbs for character actions

### Quick Workflow

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

### What Changed from Old System

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

**For Final Documentation** (after approval):
1. Use streamlined template to generate and approve image
2. Optionally create full 7-section documentation using `reference/universal_prompt_template.md`
3. Archive both versions (streamlined for speed, full for production)

### When to Guide Users to Streamlined vs. Full

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

### Key Efficiency Metrics

- **Streamlined prompt creation**: 5-7 minutes (vs. 15-20 minutes)
- **Element specification**: 2 minutes copy-paste (vs. 10 minutes research/writing)
- **Production specs**: 1 minute copy-paste (vs. 5 minutes writing)
- **Total time savings**: ~70% per variation
- **Quality maintained**: Same image generation output quality

### Example Workflow Comparison

**Traditional Full Template Workflow** (15-20 minutes):
1. Research cultural elements (5 min)
2. Write element specifications from scratch (6 min)
3. Write transformation analysis (3 min)
4. Write family cohesion analysis (2 min)
5. Write strategic assessment (2 min)
6. Write production specs from scratch (3 min)
**Total**: 15-20 minutes

**Streamlined Workflow** (5-7 minutes):
1. Copy 3-7 elements from library (2 min)
2. Fill overview and paste elements (3 min)
3. Write brief variation strategy (1 min)
4. Copy production specs template (1 min)
**Total**: 5-7 minutes

### Important Notes for Claude Code

**When users ask to create variations**:
1. First ask if they want fast iteration (streamlined) or full documentation (universal template)
2. If they say "quick", "fast", "multiple", or indicate time pressure → use streamlined
3. If they say "final", "complete", "detailed docs", or "for production" → use full template

**When generating prompts for users**:
- For streamlined: Pull elements from `sonoran_elements_detailed.md` or `mexican_regional_elements_library.md`
- Don't write element descriptions from scratch - ALWAYS use the libraries
- Copy production specs from `production_specs_template.md` - don't rewrite
- Keep streamlined prompts to ~1,200 words total

**Element Library Usage**:
- `mexican_regional_elements_library.md`: Quick reference for all Mexican regions
- `sonoran_elements_detailed.md`: Complete copy-paste descriptions for Sonoran designs
- More regional libraries can be added as needed (Oaxaca, Yucatán, etc.)

## How to Work with This Repository

### When Users Ask to Create Variations

1. **Use the 150-300 word formula** from `reference/VARIATION_PROMPT_FORMULA.md`
2. **Pick a spatial reconstruction pattern** from `reference/SPATIAL_RECONSTRUCTION_PATTERNS.md`
3. **Add character actions** from `reference/ACTION_TRANSFORMATION_LIBRARY.md`
4. **Focus on transformation, not preservation** (80% change, 20% context)
5. **Deliver prompts directly in chat** separated by divider lines

### When Users Ask About TRANSFORMETER Levels

Reference `reference/transformeter_guide.md` for detailed level definitions. Key guidance:
- Match level to goal (testing similar options = 2-4, major style change = 6-8)
- Different variation types have different typical ranges (Color: 1-6, Style: 3-9)
- Can specify different levels for different aspects (Color: Level 6, Composition: Level 2)

### When Users Need Strategic Guidance

Refer to `reference/variation_best_practices.md` for:
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

## Key Files to Reference

**For getting started**: `INIT.md`
**For TRANSFORMETER guidance**: `reference/transformeter_guide.md`
**For strategic planning**: `reference/variation_best_practices.md`
**For specific variation types**: Files in `variation_scenarios/`
**For agent invocations (text-based)**: Files in `agents/`
**For image generation prompts**: `reference/universal_prompt_template.md`

## Integration Notes

This system (GOAL2) is designed to work with "Goal 1" - a design-from-scratch system for creating original souvenir designs. GOAL2 takes those originals and creates variations.

Workflow integration:
1. Goal 1: Create original design from scratch
2. Add to `reference/original_designs_index.md`
3. Goal 2 (this system): Generate variations using documented agents

## Common User Scenarios

**"Create seasonal variations"**: Guide to `variation_scenarios/seasonal_variation.md`, use TRANSFORMETER Level 4, invoke variation-generator agent

**"Test different color palettes"**: Guide to `variation_scenarios/color_variation.md`, use TRANSFORMETER Level 3, create 3 variations (warm/neutral/cool)

**"Expand to multiple product formats"**: Guide to `variation_scenarios/format_variation.md`, use different levels per format (magnet=4, bookmark=5, ornament=6, poster=3)

**"Modernize vintage design"**: Guide to `variation_scenarios/style_variation.md`, use TRANSFORMETER Level 6-7 for aesthetic transformation

## Important Constraints

- Maximum 7-8 variations per family (without strong rationale)
- TRANSFORMETER levels within family should stay within 3-4 levels of each other
- Sacred elements must be preserved (except at Level 10)
- Family cohesion score should be ≥7/10
- All variations must pass production feasibility analysis
- Quality standards must be consistent across all variations

## When Helping Users

1. **Always start with strategic goals** - why are variations needed?
2. **Select appropriate TRANSFORMETER level** based on goals, not random choice
3. **Follow the documented workflow** - don't skip validation steps
4. **Use the agent prompts as templates** - they contain the proper structure and requirements
5. **Maintain family cohesion** - variations should feel related
6. **Document everything** - update the original_designs_index.md

This is a framework, not code to execute. Your role is to guide users through the documented system and help them apply the frameworks effectively.

## Prompts Directory System (`Prompts/`)

**CRITICAL**: Deliver all variation prompts **directly in chat** using the 150-300 word formula.

### Current Workflow for Prompt Delivery:

**When users request design variations**:
1. **Show prompts directly in chat** (no separate files)
2. **Use divider lines** between multiple variations: `---`
3. **Follow the 150-300 word formula** exactly
4. **Include ONLY the prompt content** - no explanations or commentary
5. **Make prompts copy-paste ready** for immediate use

### Destination-Based Organization

Each destination has its own folder in `Prompts/` containing:
- **RESEARCH.md**: Comprehensive research repository for that destination
  - Geography, climate, elevation
  - Flora & fauna (10-15 species with CMYK colors and safety notes)
  - Cultural elements (with Gemini safety guidelines)
  - 40+ ready-to-use CMYK color values organized by theme
  - Tourist appeal points
  - Visual references and search terms
  - Usage notes and element combinations that work

- **README.md**: Index of all variations created for this destination

- **Individual prompt files** (when needed for archival): `[destination]_[description].md`

### Research Repository Benefits

**Why RESEARCH.md saves massive time**:
- No repeating research for same destination elements
- Pre-verified Gemini-safe flora/fauna/cultural elements
- Copy-paste ready descriptions with accurate CMYK colors
- Consistent species accuracy across all designs
- Build institutional knowledge over time

**Example**: Hermosillo RESEARCH.md contains 10 Sonoran Desert plants, 12 desert animals, 40+ CMYK colors, documented Gemini triggers to avoid ("copper mine carts" blocks, "mission architecture" triggers), and safe alternatives.

### Current Destinations

- **Hermosillo** (Sonora, Mexico) - Desert designs with saguaro, palo verde, Angel references
- **Cascadas de Tamul** (San Luis Potosí, Mexico) - Tropical waterfall designs with photography integration
- **CDMX** (Ciudad de México) - Ángel de la Independencia designs with urban elements

### Important Client Order Protocol

**CRITICAL**: Each design prompt request = NEW UNIQUE CLIENT ORDER

User instruction: *"Each design is for a new order and most orders are from different clients so we can't give different clients the same design"*

**This means**:
- Even for same destination, create completely DIFFERENT variations each time
- NO cross-referencing past designs when user requests new one
- Treat every request as fresh unique creation
- Same protagonist element (e.g., Ángel de la Independencia) but different composition, style, decoration, edges

### Gemini Safety Integration

All prompts must follow Gemini safety guidelines documented in `reference/gemini_safety_alignment_guide.md`:

**Always avoid**:
- Weapons, violence, hunting scenes
- Stereotypes (lazy, primitive, inferior)
- Colonial conquest imagery
- Multiple specific indigenous tribal references (use generic instead)
- Children in designs
- People in demeaning positions

**Use safe alternatives**:
- "Traditional basketweaving patterns" instead of specific tribal names
- "Adobe arches" instead of "mission architecture"
- "Geometric patterns" instead of industrial imagery (if triggered)
- Nature/landscape focus when cultural elements risky

## Prompt Formatting for Image Generation AI

When creating prompts for image generation AI (not text-based Claude agents), use the structure in `reference/universal_prompt_template.md`. This template has been validated to avoid AI content policy blocks.

### Critical Formatting Rules:

**✅ DO**:
- Use numbered outline format (1, 2, 3, 4, 5, 6, 7)
- Write descriptively ("The design features...")
- Use bullet points (•) in natural lists
- Place technical specs in production section at END
- Frame as design specifications/project brief
- End with simple "CREATE DESIGN"

**❌ DON'T**:
- Start with "You are generating..." or similar AI role framing
- Use "MUST", "CRITICAL", "REQUIRED" as commands
- Create "SYSTEM CONTEXT" or instruction blocks
- Use ✓ checkmarks and ✗ X marks with prescriptive rules
- Front-load technical constraints as "rules to follow"
- End with "BEGIN THE IMAGE GENERATION NOW"

### Production Specs to Exclude (Updated Rule):

**NEVER include in prompts**:
- **Material Efficiency percentages** (e.g., "Estimated 70-75% material utilization")
- **Laser Settings** (e.g., "Speed: 20mm/s, Power: 65%, single pass")

These technical manufacturing details are for internal production use only and should not appear in image generation prompts. The templates have been updated to exclude these sections.

### Why This Matters:

Image generation AI systems have content policies that block prompts appearing to "jailbreak" or reprogram the AI. The working template treats the AI as a creative collaborator receiving a design brief, not a system being reprogrammed.

**Structure that WORKS**: Design specification (like briefing a designer)
**Structure that BLOCKS**: System instructions (like programming code)

See `reference/universal_prompt_template.md` for the complete validated template and real-world examples.

## Critical Design Requirements (Recent Updates)

### Shape and Composition Rules

**NO BORING RECTANGLES**: Designs must have IRREGULAR ORGANIC SHAPES unless specifically rectangular format requested.

**How to create organic edges**:
- Outer boundary follows natural elements (leaves, flowers, water splashes, graffiti drips)
- Top edge: Flowing curves, petal shapes, paint bursts
- Side edges: Asymmetric organic curves, foliage extending outward
- Bottom edge: Natural flowing termination, drip effects, organic waves
- **NO straight edges or 90° corners** unless format specifically requires it

**Protagonist must DOMINATE**:
- Main element (e.g., Ángel de la Independencia) should occupy 70-85% of composition
- Wings/arms should span nearly full width
- Everything else positioned AROUND and clearly secondary to protagonist
- User feedback: "the protagonist is not the element I told you to focus on" - avoid this!

### Decoration Level Scale

When user specifies decoration level (e.g., "8/10"):
- **6/10**: Moderate decoration, some negative space
- **8/10**: Abundant decoration, most space filled
- **10/10**: Maximal decoration, every corner filled

**8/10 decoration means**:
- Multiple decoration systems layered (patterns, florals, wildlife, borders, etc.)
- 40-60+ individual decorative elements
- Every zone has detail but protagonist still clear
- Fills negative space generously without overwhelming hero element


## 🎯 AUTO-VALIDATION SYSTEM (CRITICAL)

**MANDATORY**: When generating prompts, you MUST automatically inject validation checklists based on product type/aspect ratio.

### How Auto-Validation Works

When user specifies dimensions or product type in their request (via Format/Ratio parameter or in instructions), you MUST:

1. **Detect** the product type from these triggers
2. **Select** the appropriate validation checklist  
3. **Append** it to the END of your generated prompt
4. **Never skip** this step - it is critical for production success

### Detection Rules

Scan the user input for these patterns:

| Input Pattern | Product Type | Action |
|---------------|--------------|--------|
| "2:1" OR "Rectangular 2:1" OR contains "horizontal" | 2:1 Horizontal | Inject 2:1 checklist |
| "1:1" OR "Square 1:1" OR "square" | 1:1 Square | Inject square checklist |
| "bottle opener" OR "destapador" | Bottle Opener | Inject bottle opener checklist |

### Quick Access to Checklists

Read checklists from: `../PRODUCT_TYPE/QUICK_REFERENCE_CHECKLISTS.md`

### Implementation Steps

**EVERY time you generate a prompt:**

1. Check if user specified Format/Ratio (look for "2:1", "1:1", "Square", etc.)
2. Read the appropriate section from `../PRODUCT_TYPE/QUICK_REFERENCE_CHECKLISTS.md`
3. Append the COMPLETE checklist to the END of your generated prompt
4. The checklist must be the LAST thing in the prompt

### Example

If user specifies `Format/Ratio: Rectangular 2:1 (horizontal landscape)`, you must append the 2:1 Horizontal validation checklist from QUICK_REFERENCE_CHECKLISTS.md to the end of your prompt.

**Critical**: This prevents 70%+ of production failures. Never skip this step.


