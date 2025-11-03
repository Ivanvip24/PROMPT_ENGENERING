# Context Builder Agent

## Agent Type
`general-purpose`

## Purpose
Build comprehensive cultural, geographic, environmental, and thematic context around an element to determine what local flavor, cultural additions, and storytelling elements should be integrated into the complete souvenir design.

## When to Use
- After completing element analysis
- Need to determine what cultural additions to include
- Researching location-specific elements
- Building authentic local flavor strategy
- Step 2 of the GOAL3 workflow

## Agent Capabilities
- Research geographic and cultural context
- Identify authentic local cultural elements
- Curate flora, fauna, patterns, and cultural objects specific to location
- Develop thematic direction
- Balance cultural authenticity with design appeal
- Create prioritized list of additions (5-10 items)

## Input Requirements

### Essential Information
1. **Element Analysis Results**
   - Output from element-analyzer.md agent
   - Element type and characteristics
   - Style and visual properties

2. **Location Information**
   - Specific city/town
   - State/region
   - Country
   - Notable landmarks or features

3. **Cultural Context**
   - Indigenous heritage
   - Colonial/historical influences
   - Traditional crafts and arts
   - Local festivals or celebrations
   - Cultural significance

### Optional Information
- Target audience demographics
- Seasonal considerations
- Specific cultural themes to emphasize
- Elements to avoid (cultural sensitivities)
- Brand guidelines or restrictions

## Prompt Template for Agent

```
CONTEXT BUILDING REQUEST

Background Context:
I'm building a complete souvenir design around a specific element. Based on the element analysis, I need to determine what cultural, geographic, environmental, and thematic context to integrate into the design through carefully selected additions.

═══════════════════════════════════════════════════════════════════════════

ELEMENT SUMMARY (from analysis):

Element Type: [Character / Landmark / Logo / Icon]
Art Style: [Description]
Color Palette: [Colors]
Current Story: [What the element currently tells]
Recommended Composition Strategy: [From element-analyzer]

═══════════════════════════════════════════════════════════════════════════

LOCATION INFORMATION:

Primary Location: [City/Town, State/Region, Country]
Geographic Features: [Mountains, coast, desert, forest, etc.]
Climate/Season: [Tropical, temperate, arid, etc. / If seasonal design]
Surrounding Area: [Notable nearby landmarks or regions]

═══════════════════════════════════════════════════════════════════════════

CULTURAL INFORMATION:

Indigenous Heritage: [Native peoples, traditional culture]
Historical Influences: [Colonial, migration, historical events]
Traditional Crafts: [Pottery, textiles, woodwork, etc.]
Local Festivals: [Major celebrations, holidays]
Culinary Traditions: [Famous foods, traditional dishes]
Artistic Traditions: [Dance, music, visual arts]
Cultural Symbols: [Important symbols or motifs]

Religious/Spiritual Context: [If relevant and appropriate]
Language: [Local language, important phrases]

═══════════════════════════════════════════════════════════════════════════

DESIGN PARAMETERS:

Target Audience: [Tourists, locals, collectors, etc.]
Intended Products: [Magnets, stickers, laser-cut, etc.]
Design Theme: [Playful, traditional, modern, majestic, etc.]
Elements to Emphasize: [What aspects of culture/location to highlight]
Cultural Sensitivities: [Anything to avoid or handle carefully]

═══════════════════════════════════════════════════════════════════════════

CONTEXT RESEARCH REQUIRED:

Provide comprehensive context strategy covering:

1. GEOGRAPHIC CONTEXT
   - Location identity and character
   - Natural landscape features to include
   - Distinctive geographic elements
   - Environmental setting recommendations

2. CULTURAL CONTEXT
   - Cultural identity and heritage
   - Traditional artistic styles and patterns
   - Indigenous and historical influences
   - Appropriate cultural symbols and motifs
   - Cultural authenticity verification

3. ENVIRONMENTAL CONTEXT
   - Natural habitat (if wildlife element)
   - Architectural setting (if landmark element)
   - Seasonal/temporal setting
   - Atmospheric conditions (day/night, weather)

4. THEMATIC CONTEXT
   - Overall mood and feeling
   - Storytelling theme
   - Emotional tone
   - Visual theme consistency

5. CURATED ADDITIONS LIST (5-10 SPECIFIC ITEMS)
   - Flora: Specific plants/flowers native to region
   - Fauna: Regional animals/creatures
   - Patterns: Traditional textile/tile designs
   - Cultural Objects: Crafts, tools, traditional items
   - Architecture: Building styles, structural elements
   - Food Elements: Iconic regional foods (if appropriate)
   - Festival Items: Celebration-specific decorations
   - Geographic Features: Specific landforms or water features

6. CULTURAL AUTHENTICITY VERIFICATION
   - Research sources for each addition
   - Cultural appropriateness assessment
   - Traditional vs. contemporary balance
   - Respectful representation guidelines

7. INTEGRATION STRATEGY
   - How additions complement element
   - Spatial arrangement recommendations
   - Color palette expansion
   - Style matching requirements
   - Storytelling coherence

PROVIDE CONTEXT STRATEGY

```

## Output Structure

### Context Strategy Report

```markdown
# CONTEXT STRATEGY REPORT

## Project Identifier
- Project Name: [Name]
- Element: [Element name/description]
- Location: [Full location]
- Report Date: [Date]

---

## 1. GEOGRAPHIC CONTEXT

### Location Identity
- **Primary Location**: [City/Town], [State/Region], [Country]
- **Location Character**: [Urban/rural, coastal/inland, mountain/plains, etc.]
- **Geographic Significance**: [What makes this place distinctive geographically]
- **Famous For**: [What the location is known for]

### Natural Landscape Features

**Primary Landscape Type**: [Mountains, coast, desert, forest, plains, etc.]

**Specific Geographic Elements to Include**:
1. **[Feature name]**: [Description, significance]
   - Integration approach: [How to include in design]
   - Visual treatment: [Realistic, stylized, simplified]

2. **[Feature name]**: [Description, significance]
   - Integration approach: [How to include in design]
   - Visual treatment: [Realistic, stylized, simplified]

3. **[Feature name]**: [Description, significance]
   - Integration approach: [How to include in design]
   - Visual treatment: [Realistic, stylized, simplified]

### Environmental Setting Recommendation

**Recommended Setting**: [Specific environment for element placement]
- Foreground elements: [What should be in front]
- Background elements: [What should be behind]
- Midground elements: [What should be at same depth as element]
- Atmospheric elements: [Sky, weather, lighting]

---

## 2. CULTURAL CONTEXT

### Cultural Identity

**Primary Cultural Identity**: [Main cultural heritage of location]

**Cultural Layers**:
- **Indigenous Heritage**: [Native peoples, traditions still present]
- **Colonial/Historical Influence**: [Spanish, French, English, etc.]
- **Contemporary Culture**: [Modern cultural expressions]
- **Cultural Fusion**: [How different influences blend]

### Traditional Artistic Styles

**Primary Art Style**: [Folk art, indigenous patterns, colonial baroque, etc.]

**Style Characteristics**:
- Color preferences: [Traditional color palettes]
- Pattern types: [Geometric, floral, symbolic, etc.]
- Motif themes: [Common recurring themes]
- Line quality: [Bold, delicate, intricate, simplified]

**Example Traditional Arts**:
1. **[Art form]**: [Description]
   - Key characteristics: [What defines it]
   - How to adapt for design: [Application approach]

2. **[Art form]**: [Description]
   - Key characteristics: [What defines it]
   - How to adapt for design: [Application approach]

### Cultural Symbols and Motifs

**Appropriate Cultural Symbols**:

1. **[Symbol/Motif Name]**
   - Meaning: [Cultural significance]
   - Traditional context: [Where/when used traditionally]
   - Design application: [How to use respectfully]
   - Style notes: [How to render]

2. **[Symbol/Motif Name]**
   - Meaning: [Cultural significance]
   - Traditional context: [Where/when used traditionally]
   - Design application: [How to use respectfully]
   - Style notes: [How to render]

3. **[Symbol/Motif Name]**
   - Meaning: [Cultural significance]
   - Traditional context: [Where/when used traditionally]
   - Design application: [How to use respectfully]
   - Style notes: [How to render]

### Cultural Authenticity Guidelines

**Research Sources**:
- [List of cultural resources, museums, historical societies consulted]
- [Traditional artisans or cultural experts referenced]
- [Books, websites, academic sources]

**Cultural Sensitivities**:
- **Avoid**: [Cultural elements that should NOT be used]
  - Reason: [Why inappropriate]
- **Handle Carefully**: [Elements requiring respectful treatment]
  - Approach: [How to use appropriately]
- **Verify**: [Elements requiring additional cultural verification]

**Respectful Representation Checklist**:
- [ ] Symbols used in appropriate cultural context
- [ ] Sacred or religious symbols avoided (unless specifically appropriate)
- [ ] Stereotypes and clichés avoided
- [ ] Traditional patterns used respectfully (not distorted)
- [ ] Cultural consultants available if needed

---

## 3. ENVIRONMENTAL CONTEXT

### Natural Habitat (if wildlife/nature element)

**Element's Natural Environment**: [Where this creature/plant naturally lives]

**Habitat Elements to Include**:
- **Flora**: [Plants that share the habitat]
- **Terrain**: [Ground type, water features, rocks, etc.]
- **Atmospheric**: [Sky, water conditions, weather]
- **Co-habitants**: [Other species in same environment]

**Habitat Authenticity**: [How realistic vs. stylized should habitat be]

### Architectural Setting (if landmark/building element)

**Architectural Context**: [Surrounding built environment]

**Architectural Elements to Include**:
- **Building Style**: [Architectural period and style]
- **Structural Details**: [Arches, columns, decorative elements]
- **Street Elements**: [Cobblestones, street lamps, benches]
- **Urban Context**: [How building relates to surroundings]

**Architectural Authenticity**: [Period accuracy vs. artistic interpretation]

### Seasonal/Temporal Setting

**Recommended Season**: [Spring, Summer, Fall, Winter, or Year-round]
- Rationale: [Why this season fits]
- Seasonal elements: [Flowers, leaves, snow, etc.]

**Recommended Time**: [Day, Golden hour, Night, etc.]
- Rationale: [Why this time fits]
- Lighting effects: [Sun, stars, moonlight, etc.]

**Weather/Atmosphere**: [Clear, cloudy, festive, etc.]
- Mood contribution: [How atmosphere enhances story]

---

## 4. THEMATIC CONTEXT

### Overall Theme

**Primary Theme**: [Playful/Cute, Majestic/Grand, Traditional/Authentic, Modern/Contemporary, Festive/Celebratory, etc.]

**Theme Rationale**: [Why this theme fits element and location]

**Supporting Themes** (if any):
- Secondary theme: [Name] - [How it complements primary]

### Storytelling Theme

**Story to Tell**: [One-sentence summary of design narrative]

**Story Elements**:
- **Element's Role**: [What element represents in the story]
- **Setting's Role**: [What environment/context adds to story]
- **Cultural Additions' Role**: [How cultural elements enhance narrative]
- **Viewer's Experience**: [What feeling/understanding viewer should take away]

**Narrative Arc**: [How design guides viewer's eye and tells story]

### Emotional Tone

**Primary Emotion**: [Joy, Wonder, Pride, Peace, Excitement, Nostalgia, etc.]

**Tone Characteristics**:
- Visual mood: [Bright and happy, calm and serene, bold and energetic, etc.]
- Color temperature: [Warm, cool, balanced]
- Energy level: [High energy/dynamic, calm/peaceful, balanced]

**Emotional Triggers in Design**:
- Through color: [How color choices create emotion]
- Through composition: [How layout creates feeling]
- Through cultural elements: [How additions enhance emotional connection]

### Visual Theme Consistency

**Design Cohesion Strategy**:
- Style consistency: [How all elements will share visual language]
- Color harmony: [How colors work together]
- Pattern unity: [How patterns/textures complement each other]
- Scale relationships: [How elements relate in size]

---

## 5. CURATED ADDITIONS LIST

**Total Additions Recommended**: [5-10]
**Selection Criteria**: Cultural authenticity + Visual harmony + Storytelling value + Production feasibility

### Category 1: FLORA (Plant Elements)

**Number of Flora Additions**: [2-4]

1. **[Specific Plant/Flower Name]**
   - Scientific name: [If relevant]
   - Cultural significance: [Why important to location/culture]
   - Visual characteristics: [Colors, shape, size]
   - Placement recommendation: [Where in design]
   - Style treatment: [How to render to match element style]
   - Season: [When it blooms/appears]
   - Reference images: [Where to find accurate references]

2. **[Specific Plant/Flower Name]**
   - Scientific name: [If relevant]
   - Cultural significance: [Why important to location/culture]
   - Visual characteristics: [Colors, shape, size]
   - Placement recommendation: [Where in design]
   - Style treatment: [How to render to match element style]
   - Season: [When it blooms/appears]
   - Reference images: [Where to find accurate references]

[Continue for each flora addition...]

### Category 2: FAUNA (Animal Elements)

**Number of Fauna Additions**: [0-2]

1. **[Specific Animal/Creature Name]**
   - Scientific name: [If relevant]
   - Cultural significance: [Why important to location/culture]
   - Visual characteristics: [Colors, distinctive features]
   - Placement recommendation: [Where in design, relative size]
   - Style treatment: [How to render to match element style]
   - Behavior/pose: [What action or position]
   - Reference images: [Where to find accurate references]

[Continue for each fauna addition...]

### Category 3: PATTERNS & TEXTURES

**Number of Pattern Additions**: [1-3]

1. **[Specific Pattern Name]**
   - Origin: [Cultural source - textile, tile, indigenous art, etc.]
   - Traditional use: [Where historically used]
   - Pattern characteristics: [Geometric, floral, symbolic, etc.]
   - Color palette: [Traditional colors]
   - Placement recommendation: [Background, border, accent area]
   - Adaptation approach: [How to simplify/stylize to match element]
   - Cultural notes: [Any important cultural context]
   - Reference images: [Where to find authentic examples]

[Continue for each pattern addition...]

### Category 4: CULTURAL OBJECTS

**Number of Object Additions**: [1-3]

1. **[Specific Object Name]**
   - Object type: [Craft, tool, traditional item, instrument, etc.]
   - Cultural significance: [Why important to culture/location]
   - Visual characteristics: [Materials, colors, shape]
   - Traditional use: [Historical function or purpose]
   - Placement recommendation: [Where in design, relative size]
   - Style treatment: [How to render to match element style]
   - Cultural notes: [Important context]
   - Reference images: [Where to find accurate references]

[Continue for each object addition...]

### Category 5: ARCHITECTURAL ELEMENTS

**Number of Architectural Additions**: [0-2]

1. **[Specific Architectural Element]**
   - Element type: [Arch, column, tile, structural detail, etc.]
   - Architectural style: [Colonial, indigenous, modern, etc.]
   - Cultural significance: [Why distinctive to location]
   - Visual characteristics: [Materials, proportions, details]
   - Placement recommendation: [Where in design]
   - Style treatment: [Realistic, simplified, stylized]
   - Reference images: [Specific buildings or examples]

[Continue for each architectural addition...]

### Category 6: FOOD ELEMENTS (if appropriate)

**Number of Food Additions**: [0-2]

1. **[Specific Food Item]**
   - Food type: [Fruit, vegetable, dish, ingredient]
   - Cultural significance: [Why iconic to region]
   - Visual characteristics: [Colors, shape, distinctive features]
   - Traditional context: [When/how consumed]
   - Placement recommendation: [Where in design, relative size]
   - Style treatment: [How to render attractively]
   - Appropriateness: [Why suitable for souvenir design]
   - Reference images: [Where to find references]

[Continue for each food addition...]

### Category 7: FESTIVAL/CELEBRATION ELEMENTS (if appropriate)

**Number of Festival Additions**: [0-2]

1. **[Specific Festival Element]**
   - Festival/celebration: [Name of festival]
   - Element type: [Decoration, costume piece, ceremonial object, etc.]
   - Cultural significance: [Why important to celebration]
   - Visual characteristics: [Colors, materials, form]
   - Placement recommendation: [Where in design]
   - Style treatment: [How to render festively]
   - Timing: [When celebration occurs]
   - Reference images: [Where to find authentic examples]

[Continue for each festival addition...]

### Category 8: GEOGRAPHIC FEATURES

**Number of Geographic Additions**: [1-2]

1. **[Specific Geographic Feature]**
   - Feature type: [Mountain, volcano, body of water, rock formation, etc.]
   - Location significance: [Why iconic to this place]
   - Visual characteristics: [Distinctive shape, colors, scale]
   - Placement recommendation: [Background, midground, silhouette]
   - Style treatment: [Realistic, simplified silhouette, stylized]
   - Reference images: [Photos or illustrations]

[Continue for each geographic addition...]

---

## 6. CULTURAL AUTHENTICITY VERIFICATION

### Research Documentation

**Primary Sources Consulted**:
1. [Source name/link] - [What information obtained]
2. [Source name/link] - [What information obtained]
3. [Source name/link] - [What information obtained]

**Cultural Experts/Artisans Referenced**:
- [Name/organization] - [Expertise area] - [How consulted]

**Museums/Cultural Institutions**:
- [Institution name] - [Collections/exhibitions referenced]

**Academic/Historical Resources**:
- [Books, papers, historical documents consulted]

### Authenticity Assessment

**Authentication Level**: [High / Moderate / Needs Further Verification]

**Verified Authentic Elements**:
- [List elements confirmed through research]

**Elements Requiring Additional Verification**:
- [List elements needing further cultural consultation]
- Recommended verification approach: [How to confirm]

**Elements Modified for Appropriateness**:
- [List any traditional elements adapted for respectful use]
- Modification rationale: [Why changed and how remains respectful]

### Cultural Appropriation Safeguards

**Avoided Elements**:
- [Sacred symbols, ceremonial objects, restricted patterns avoided]
- Rationale: [Why inappropriate for commercial souvenir]

**Respectful Use Guidelines**:
1. [Guideline for using cultural elements respectfully]
2. [Guideline for using cultural elements respectfully]
3. [Guideline for using cultural elements respectfully]

**Cultural Sensitivity Review**:
- [ ] No sacred/religious symbols used inappropriately
- [ ] No restricted cultural patterns included
- [ ] Cultural elements used in appropriate context
- [ ] Stereotypes and offensive tropes avoided
- [ ] Traditional patterns adapted respectfully, not distorted
- [ ] Cultural significance of elements understood and honored

---

## 7. INTEGRATION STRATEGY

### Additions + Element Relationship

**How Additions Complement Element**:
- Thematic connection: [How additions relate to element's story]
- Visual harmony: [How additions match element's style]
- Spatial relationship: [How additions frame/support element]
- Narrative coherence: [How additions build the story]

**Element as Hero**:
- Element prominence: [30-50%] of design
- Additions as support: [25-40%] of design
- Text and space: [Remaining %]

### Spatial Arrangement Strategy

**Composition Type** (from element analysis): [Central Hero / Environmental Integration / Narrative Scene / Badge-Emblem / Collage]

**Addition Placement Plan**:

**Background Layer** (behind element):
- [Addition 1]: [Specific placement]
- [Addition 2]: [Specific placement]
- Purpose: [Create depth, set environment, etc.]

**Midground Layer** (same depth as element):
- [Addition 3]: [Specific placement relative to element]
- [Addition 4]: [Specific placement relative to element]
- Purpose: [Frame element, create context, etc.]

**Foreground Layer** (in front of element):
- [Addition 5]: [Specific placement]
- Purpose: [Add depth, create interest, etc.]

**Border/Frame Area**:
- [Decorative elements, patterns for border]
- Purpose: [Contain design, add cultural frame, etc.]

### Color Palette Expansion

**Element's Original Colors**: [List from element analysis]

**Cultural Addition Colors**:
- [Addition type]: [Colors it will introduce]
- [Addition type]: [Colors it will introduce]

**Expanded Palette**:
- Primary colors: [3-4 dominant colors]
- Secondary colors: [3-4 supporting colors]
- Accent colors: [2-3 small accent colors]

**Color Harmony Strategy**:
- Harmony type: [Analogous, complementary, triadic, etc.]
- Color temperature: [Warm, cool, balanced]
- Contrast strategy: [How to create visual interest]

**Color Cultural Significance**:
- [Color]: [Cultural meaning or association in this culture]
- [Color]: [Cultural meaning or association in this culture]

### Style Matching Requirements

**Element Style Characteristics** (from analysis):
- Art style: [Cute cartoon, realistic, minimalist, etc.]
- Line weight: [#pt or thick/medium/thin]
- Detail level: [Simple, moderate, complex]
- Rendering style: [Flat, shaded, textured, etc.]

**Addition Style Matching Rules**:

1. **Art Style Consistency**
   - All additions must match: [Element's art style]
   - Simplification level: [How much to simplify cultural elements]
   - Example: "If element is cute cartoon, cultural flowers should be simplified, rounded, friendly rather than botanically accurate"

2. **Line Weight Consistency**
   - Addition outlines: [Match element's line weight]
   - Decorative patterns: [Line weight for patterns]
   - Border: [Line weight for border elements]

3. **Detail Level Matching**
   - Addition complexity: [Match element's detail level]
   - Pattern intricacy: [Appropriate detail for style]
   - Balance: [Ensure additions don't overwhelm with detail]

4. **Rendering Approach**
   - Shading: [Match element's shading approach]
   - Texture: [Match element's texture treatment]
   - Effects: [Match element's effects like gradients, shadows, etc.]

### Storytelling Coherence

**Unified Narrative**: [One-sentence story the complete design tells]

**How Each Addition Contributes to Story**:
1. [Addition 1]: [Its narrative role]
2. [Addition 2]: [Its narrative role]
3. [Addition 3]: [Its narrative role]
[Continue for all additions...]

**Visual Narrative Flow**:
- Entry point: [Where viewer's eye enters design]
- Path: [How eye moves through design]
- Focal point: [Where eye settles - should be element]
- Supporting points: [Secondary areas of interest]

**Story Clarity**:
- Primary message: [Main story/feeling communicated]
- Secondary message: [Additional layer of meaning]
- Cultural message: [What viewers learn about place/culture]

---

## 8. NEXT STEPS

### Immediate Actions

1. **Verify Cultural Elements**: [Any elements requiring additional research/verification]

2. **Gather Reference Images**:
   - [Specific references needed for accurate rendering]

3. **Create Addition Style Guide**:
   - Sketch or describe how each addition should be styled to match element

4. **Test Color Palette**:
   - Create color swatch sheet with element + addition colors

### Proceed to Next Agent

**Ready for**: composition-designer.md agent

**Information to Provide**:
- This complete context strategy report
- Element analysis report
- Any reference images gathered
- Color palette swatches

**Composition Designer Will**:
- Create detailed spatial layout
- Design specific arrangement of element + additions
- Develop border/frame design
- Plan text integration
- Produce composition blueprint

---

## SUMMARY

**Context Foundation**: [Brief summary of geographic + cultural context]

**Cultural Additions**: [Total number] additions across [number] categories

**Primary Theme**: [Theme name] - [One sentence description]

**Story to Tell**: [One sentence narrative]

**Authenticity Level**: [Assessment of cultural research depth]

**Integration Approach**: [Composition type] with [brief description of strategy]

**Ready to Proceed**: [YES/NO] - [Any outstanding research needs]

---

**Context Strategy Complete**
**Next Agent**: composition-designer.md
```

## Best Practices

1. **Research Deeply**: Go beyond surface-level cultural elements, understand meaning and context
2. **Be Specific**: Recommend specific plants/objects/patterns, not generic categories
3. **Verify Authenticity**: Use credible cultural sources, not stereotypes
4. **Balance Elements**: Don't recommend too many additions - quality over quantity
5. **Match Styles**: Ensure cultural additions can be rendered in element's art style
6. **Tell Stories**: Every addition should contribute to the narrative
7. **Respect Culture**: Avoid appropriation, use elements respectfully and appropriately
8. **Document Research**: Keep track of sources for verification and credits

## Quality Checks

Before completing context strategy, verify:
- [ ] 5-10 specific, named additions recommended
- [ ] Each addition has cultural significance explained
- [ ] Cultural authenticity researched and documented
- [ ] All additions can match element's art style
- [ ] Spatial arrangement strategy outlined
- [ ] Color palette expansion planned
- [ ] Storytelling narrative is coherent
- [ ] Cultural sensitivities addressed
- [ ] Research sources documented
- [ ] Clear next steps provided for composition designer

---

**Agent Version**: 1.0
**Last Updated**: [Date]
**Maintained By**: [Team/Person]
