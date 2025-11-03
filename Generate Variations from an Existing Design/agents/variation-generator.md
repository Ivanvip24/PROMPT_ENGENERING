# Variation Generator Agent

## Agent Type
`general-purpose`

## Purpose
Generate TRUE design variations of existing souvenir designs based on specified TRANSFORMETER level, variation type, and strategic goals. This is the primary creative agent for producing new design variations through deconstruction and reconstruction, not simple rearrangement.

## ⚠️ CRITICAL: Understanding TRUE Variations

**→ See `reference/TRUE_VARIATION_DEFINITION.md` for complete definition and validation checklist**

## ⚡ Output Format Options

**For rapid iteration** (user indicates "quick", "fast", or multiple variations needed):
- Use **Streamlined Template** (`reference/streamlined_prompt_template.md`)
- 4 sections, ~1,200 words, 5-7 minute creation time
- Copy-paste elements from `reference/sonoran_elements_detailed.md` or `reference/mexican_regional_elements_library.md`
- Copy production specs from `reference/production_specs_template.md`

**For final documentation** (user indicates "complete", "detailed", or "for production"):
- Use **Full Universal Template** (`reference/universal_prompt_template.md`)
- 7 sections, 3,000-4,000 words, complete specifications

**Default**: Use streamlined template unless user specifically requests full documentation.

## When to Use
- User requests design variations from an existing design
- Creating product line expansions
- Testing different design approaches (A/B testing)
- Seasonal or holiday adaptations
- Format-specific optimizations
- Style explorations

## Agent Capabilities
- Analyze original design and identify core elements
- Generate TRUE variations by deconstructing and reconstructing designs
- Create variations at specified TRANSFORMETER level with appropriate transformation intensity
- Add new creative/thematic elements not in original design
- Change poses, orientations, and styles of existing elements
- Reimagine spatial arrangements and compositional structures
- Maintain family cohesion while introducing meaningful differentiation
- Optimize for different formats and products
- Apply seasonal/thematic adaptations
- Ensure production feasibility (laser-cut MDF)

## Input Requirements

### Essential Information
1. **Original Design Description**
   - Complete description of the base design
   - Key visual elements
   - Current style and aesthetic
   - Color palette
   - Typography details
   - Format and dimensions

2. **Variation Specifications**
   - Variation type (color, style, composition, seasonal, format)
   - TRANSFORMETER level (1-10)
   - Number of variations requested
   - Specific goals or constraints

3. **Context**
   - Purpose of variation (product line, testing, seasonal, etc.)
   - Target audience or market
   - Brand guidelines (if any)
   - Production constraints

### Optional Information
- Reference images or inspiration
- Specific elements to preserve or change
- Color palette preferences
- Style references
- Market research data

## Prompt Template for Agent

```
DESIGN VARIATION BRIEF

Background Context:
This is a design variation project for souvenir merchandise. The variations will maintain core identity elements while exploring creative reinterpretations through spatial restructuring, element transformation, and thematic additions.

Understanding "True Variation":
A true variation involves deconstructing the original design into core elements and reconstructing them with completely new spatial arrangements, changed element poses/orientations, added creative elements, reimagined relationships, and transformed visual hierarchy. This is not simply rearranging or tilting an existing design.

For example: An original design with flamingos standing on sides with horizontal photos becomes a variation with flamingos in new poses (waving, holding cameras) with photos arranged in circular patterns, added elements (shells, starfish, palm trees), curved text, and different visual flow.

═══════════════════════════════════════════════════════════════════════════

ORIGINAL DESIGN DESCRIPTION:

[Complete description of base design including:
- Subject/destination
- Style and aesthetic
- Key visual elements with current poses/orientations
- Color palette (with hex codes if available)
- Typography details
- Format and dimensions
- Current spatial arrangement
- Current production specs]

VARIATION PARAMETERS:

Variation Type: [Color/Style/Composition/Seasonal/Format]
TRANSFORMETER Level: [1-10]

Level Reference:
- Level 1-3: SUBTLE (90-100% similarity) - Minor color/detail adjustments
- Level 4-6: MODERATE (55-85% similarity) - Noticeable changes while maintaining core
- Level 7-9: MAJOR (20-55% similarity) - Significant transformation, new arrangements
- Level 10: RADICAL (10-20% similarity) - Complete redesign, minimal similarity

VARIATION GOALS:

[Specific objectives for this variation, such as:
- Target audience
- Product format
- Market positioning
- Seasonal theme
- Testing hypothesis]

CORE ELEMENTS TO PRESERVE (can be reimagined in pose/position/style):

• [Element 1: Can change pose/position/style but must be present]
• [Element 2: Can change arrangement but must be recognizable]
• [Element 3: Core identity element]

ASPECTS TO TRANSFORM:

• Spatial arrangement and composition structure
• Element poses, orientations, accessories
• Add 3-7 new decorative/thematic elements appropriate to theme
• Photo frame shapes and arrangements (if applicable)
• Visual hierarchy and flow

DESIGN CONSTRAINTS:

• Maintain laser-cut MDF production compatibility (vector-based, connected elements)
• Preserve core elements listed above
• [Any brand guidelines to respect]
• [Any other specific constraints]

═══════════════════════════════════════════════════════════════════════════

OUTPUT REQUIRED:

For each variation, provide detailed specifications in this structure:

1. VARIATION OVERVIEW
   - Creative concept name
   - One-sentence compositional approach
   - TRANSFORMETER level used

2. COMPLETE VISUAL DESCRIPTION
   - Narrative description of the overall design
   - Compositional principle used (circular, diagonal, asymmetrical, radial, etc.)
   - Overall mood and atmosphere

3. ELEMENT-BY-ELEMENT SPECIFICATIONS
   [Main Subject Elements]
   - Number, poses, colors, sizes, positions
   - Actions and accessories
   - Interactions between elements

   [Text Elements]
   - Position and arrangement
   - Letter treatment and styling
   - Typography specifications
   - Integration with composition

   [Environment/Background]
   - Background treatment
   - Atmospheric elements
   - Environmental context

   [Decorative Elements]
   - Thematic accents
   - Cultural elements
   - Seasonal additions (if applicable)

   [New Elements Added]
   - 3-7 new creative additions with descriptions
   - Purpose and thematic fit for each

   [Border Treatment]
   - Shape and style
   - Integration with overall design

4. TRANSFORMATION ANALYSIS
   - Original composition structure
   - New composition structure
   - Specific element changes (poses, arrangements, additions)
   - Layout transformation explanation
   - Color changes (if applicable)
   - Sacred elements preservation method
   - How TRANSFORMETER level was achieved
   - Strategic reasoning for changes

5. FAMILY COHESION ANALYSIS
   - Recognizability score (percentage)
   - Shared DNA elements with original
   - Differentiation points
   - Family relationship description

6. STRATEGIC ASSESSMENT
   - How variation serves product line expansion
   - Expected viewer response
   - Market appeal
   - Suitable product formats
   - Use case scenarios

7. PRODUCTION SPECIFICATIONS
   - Material type (e.g., 1/8" MDF)
   - Recommended dimensions
   - Aspect ratio
   - Layers (if multi-layer design)
   - Cutting complexity rating (Simple/Moderate/High)
   - Line weight requirements
   - Finish recommendations
   - Structural connection notes
   - Special manufacturing considerations
   - Color palette reference (hex codes)

CREATE VARIATION(S)
```

## Output Structure

The agent should return structured information for each variation:

### Section 1: Quick Summary
- Variation name/ID
- TRANSFORMETER level used
- Primary transformation type
- One-sentence description

### Section 2: Complete Design Description
Detailed visual description as if instructing a designer:
- Overall composition and layout (NEW spatial structure)
- Compositional principle used (circular, diagonal, asymmetrical, radial, etc.)
- Every visual element and its treatment:
  * Character elements: NEW poses, actions, accessories, orientations
  * Photo elements: NEW arrangements, shapes, configurations
  * NEW decorative elements: Complete list with placement and purpose
  * Text elements: NEW integration and positioning
- Complete color specifications
- Typography details (fonts, sizes, hierarchy)
- Spatial relationships (how elements interact in new arrangement)
- Visual flow and hierarchy (how viewer's eye moves through redesign)

### Section 3: Transformation Analysis
- Compositional deconstruction/reconstruction explanation
- Element-by-element comparison to original:
  * Original poses → New poses (characters)
  * Original arrangement → New arrangement (photos)
  * Elements that didn't exist → NEW additions (decorative)
- Color mapping (old → new, if applicable)
- Layout changes explained (spatial structure transformation)
- Style shifts documented
- What was preserved (sacred elements) and why
- What changed (poses, positions, additions) and why
- NEW creative elements added and their purpose

### Section 4: Production Details
- Full technical specifications
- Laser-cut considerations
- Layer breakdown (if multi-layer)
- Material requirements
- Finishing instructions
- Estimated complexity/cost tier

### Section 5: Strategic Assessment
- Goal alignment confirmation
- Target audience fit
- Market positioning
- Recommended use cases
- Pricing tier recommendation

## Quality Checks

The agent should validate each variation against:

### Design Quality
- [ ] Professional design execution
- [ ] Visual balance and composition
- [ ] Color harmony
- [ ] Typography appropriateness
- [ ] Appropriate complexity for format
- [ ] Text legibility

### Production Feasibility
- [ ] Laser-cut compatible (vector-based)
- [ ] Structural integrity (connected elements)
- [ ] Appropriate line weights
- [ ] Feasible detail level for size
- [ ] Material efficiency
- [ ] Production cost reasonable

### Family Cohesion
- [ ] Recognizably related to original (feels like same family)
- [ ] Core identity preserved (sacred elements present)
- [ ] Appropriate TRANSFORMETER level (transformation intensity matches stated level)
- [ ] Sacred elements maintained (even if reimagined in pose/position)
- [ ] Brand consistency (personality and theme preserved)
- [ ] Family DNA evident (shared visual language)
- [ ] TRUE variation created (not just rearrangement)
- [ ] New creative elements enhance theme (additions are purposeful)

### Strategic Alignment
- [ ] Meets stated variation goals
- [ ] Appropriate for target audience
- [ ] Fits market positioning
- [ ] Serves clear purpose
- [ ] Differentiated appropriately

## Example Agent Invocation

```
I need to create seasonal variations of our San Francisco Golden Gate Bridge magnet design.

Original design: 6"x4" vertical vintage travel poster style magnet featuring the Golden Gate Bridge in center, orange bridge, teal water, cream background, "San Francisco" in script font, Art Deco border.

Please generate 4 seasonal variations (Spring, Summer, Fall, Winter) at TRANSFORMETER Level 4. The variations should maintain the vintage travel poster aesthetic but incorporate seasonal colors and subtle seasonal elements. Sacred elements: Golden Gate Bridge must stay recognizable, "San Francisco" text must remain, vintage aesthetic must be preserved.

Target audience: Tourists seeking seasonal souvenirs. These will all be produced as 6"x4" magnets using laser-cut MDF with full-color UV printing.
```

## Agent Task Breakdown

When invoked, the agent should:

1. **Analyze Original** (5 minutes)
   - Parse design description
   - Identify core elements and sacred components
   - Note current color palette, style, composition
   - Understand production specifications

2. **Plan Variations** (10 minutes)
   - Review TRANSFORMETER level requirements
   - Determine appropriate scope of changes
   - Plan color, style, or composition shifts
   - Ensure family cohesion strategy

3. **Generate Each Variation** (15-20 minutes per variation)
   - Create complete design description
   - Specify all colors, fonts, elements
   - Document transformations made
   - Validate against constraints

4. **Validate and Document** (10 minutes)
   - Check quality standards
   - Verify production feasibility
   - Confirm family cohesion
   - Assess strategic alignment

5. **Compile Output** (5 minutes)
   - Organize all variation documentation
   - Create summary comparison
   - Provide recommendations

## Common Variation Scenarios

### Scenario 1: Color Exploration
**Input**: Same design, 3 variations with different color palettes
**TRANSFORMETER**: Level 3-5
**Focus**: Color theory, mood shifts, accessibility
**Output**: Complete color specifications with hex codes and rationale

### Scenario 2: Seasonal Adaptation
**Input**: Base design adapted for 4 seasons
**TRANSFORMETER**: Level 4-6
**Focus**: Seasonal elements, appropriate colors, cultural relevance
**Output**: 4 cohesive seasonal variations with thematic consistency

### Scenario 3: Style Evolution
**Input**: Vintage design → modern minimalist version
**TRANSFORMETER**: Level 6-8
**Focus**: Aesthetic transformation while preserving identity
**Output**: Clear style shift with maintained recognizability

### Scenario 4: Format Optimization
**Input**: Vertical magnet design → horizontal postcard
**TRANSFORMETER**: Level 4-6
**Focus**: Compositional rearrangement, format-specific needs
**Output**: Optimized design for new product format

### Scenario 5: Market Segmentation
**Input**: One design → 3 versions for different demographics
**TRANSFORMETER**: Level 4-7
**Focus**: Audience appropriateness, different aesthetics
**Output**: Variations tailored to specific market segments

## Tips for Effective Agent Use

1. **Be Specific**: Provide complete original design description
2. **Set Clear Goals**: Explain why variations are needed
3. **Define Constraints**: Specify what must be preserved
4. **Choose Appropriate Level**: Match TRANSFORMETER to goals
5. **Request Multiple Options**: Ask for 2-3 variations to compare
6. **Iterate**: Use agent output to refine and re-generate
7. **Validate Output**: Check agent work against quality standards
8. **Document Results**: Save agent output to project files

## Integration with Other Agents

This agent works in conjunction with:
- **variation-validator**: To check quality and cohesion
- **family-coherence-checker**: To ensure family relationships
- **production-feasibility-analyzer**: To confirm laser-cut compatibility

Recommended workflow:
1. Use variation-generator to create designs
2. Use variation-validator to check quality
3. Use family-coherence-checker to verify relationships
4. Iterate as needed based on validation feedback

## Limitations

This agent:
- Cannot generate actual image files (produces detailed descriptions)
- Requires complete original design description
- Works best with clear, specific instructions
- May need iteration for optimal results
- Should be validated by human designer

## Best Practices

- Provide as much detail about original as possible
- Use TRANSFORMETER guide to set appropriate levels
- Request multiple variations for comparison
- Validate agent output against strategic goals
- Iterate based on feedback
- Document all variations for future reference
- Maintain original design index updated

---

**Agent Version**: 1.0
**Last Updated**: [Date]
**Maintained By**: [Team/Person]
