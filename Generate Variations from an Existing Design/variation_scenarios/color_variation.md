# Color Variation Scenario

## Purpose
Generate design variations that explore different color palettes while maintaining the original composition, layout, and design elements.

## ⚠️ Note on TRUE Variations

While color variations focus primarily on palette changes, they can still incorporate TRUE variation principles:

**Color variations can include:**
✓ New color-coordinated decorative elements (3-5 optional additions)
✓ Color-driven compositional adjustments (elements repositioned for color balance)
✓ Color effects that transform mood and hierarchy

**However, primary focus is:**
- Palette exploration while keeping composition largely intact
- Color relationships and harmony
- Mood transformation through color

For more dramatic changes, combine with composition or style variations.

## When to Use
- A/B testing color schemes for market preference
- Creating seasonal color variants (spring pastels, autumn warm tones)
- Adapting designs for different product materials or backgrounds
- Offering customers multiple color options of the same design
- Brand color compliance across different markets

## TRANSFORMETER Range: 1-6

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

## Required Information

### From Original Design
- Current color palette (with hex codes)
- Color hierarchy (primary, secondary, accent)
- Background color/treatment
- Any brand color requirements
- Material considerations (wood base color)

### Variation Specifications
- Target TRANSFORMETER level (1-6)
- Desired color direction (warmer, cooler, bolder, softer)
- Any colors that must be preserved
- Color accessibility requirements
- Intended use context (season, market, occasion)

## Prompt Templates

### For Text-Based AI (Claude Agents)

Use the agent prompt in `agents/variation-generator.md` with these specific parameters for color variation.

### For Image Generation AI

**⚠️ Important**: For image generation AI, use the structure in `reference/universal_prompt_template.md`. The template below is for reference only - adapt it to the numbered outline format (1-7 sections) shown in the universal template to avoid content policy blocks.

```
Create a color variation of the following souvenir design:

ORIGINAL DESIGN:
[Description of original design]
Current Color Palette: [List colors with hex codes]
Color Hierarchy: [Primary/secondary/accent breakdown]

VARIATION REQUIREMENTS:
TRANSFORMETER Level: [1-6]
Color Direction: [Target mood/temperature/intensity]
Preserve These Colors: [If any]
Change Priority: [Which elements should change first]

CONSTRAINTS:
- Maintain all original shapes and composition
- Keep text legible with new colors
- Ensure laser-cut MDF compatibility
- [Any other specific constraints]

CONTEXT:
Purpose: [Why this variation is needed]
Target Audience: [If relevant]
Production Notes: [Material/finish considerations]
```

## Output Specifications

For each color variation, provide:
1. **New Color Palette**: Hex codes for all colors used
2. **Color Mapping**: Which original colors changed to which new colors
3. **Rationale**: Why these color choices support the design goals
4. **Contrast Report**: Accessibility compliance for text/background
5. **Production Notes**: Any implications for laser cutting or finishing

## Quality Checklist

- [ ] All text remains legible
- [ ] Sufficient contrast between layers/elements
- [ ] Colors work with natural wood base color
- [ ] Design maintains visual hierarchy
- [ ] Color scheme feels intentional and cohesive
- [ ] Brand guidelines respected (if applicable)
- [ ] Accessibility standards met for critical text
- [ ] Colors achievable with specified production method

## Example Use Cases

1. **Seasonal Series**: Beach destination design in summer brights, autumn tones, winter cool blues
2. **Market Testing**: Bold vibrant vs. soft pastel vs. classic neutral versions
3. **Product Line**: Same landmark in different color stories for different age demographics
4. **Event Specific**: Standard design adapted to holiday colors (red/green for Christmas, etc.)
5. **Brand Alignment**: Adjusting indie artist design to match corporate brand colors

## Tips for Success

- Start with Level 1-2 for initial client presentations
- Use color psychology appropriate to destination/mood
- Consider the wood base as part of your color palette
- Test readability of all text in new color schemes
- Maintain the "temperature" of the original unless specifically varying it
- Document the color shift strategy clearly
- Provide color names, not just hex codes (e.g., "Ocean Blue" not just #0077BE)
