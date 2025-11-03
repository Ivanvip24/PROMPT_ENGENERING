# Format Variation Scenario

## Purpose
Generate design variations optimized for different product formats, dimensions, and physical applications while maintaining design cohesion and recognizability across the product line.

## ⚠️ CRITICAL: TRUE Variations Through Format Optimization

Format variations must be TRUE VARIATIONS optimized for new dimensions:

**Required for format variation:**
✓ DECONSTRUCT original for new aspect ratio/shape
✓ COMPLETELY REIMAGINE layout for new format (vertical→horizontal requires full restructuring)
✓ CHANGE element arrangements, sizes, and orientations for format
✓ ADD format-appropriate decorative elements (3-7)
✓ TRANSFORM visual hierarchy for format's viewing context
✓ RECONSTRUCT composition optimized for new product

**NOT valid format variation:**
✗ Just squishing/stretching existing design into new dimensions
✗ Cropping parts of original to fit format
✗ Same composition crammed into different shape
✗ Simple scaling without format optimization

**Strong format variations include:**
- Complete spatial reorganization for new aspect ratio
- Element priorities adjusted for format (bookmark = vertical flow, coaster = circular)
- Format-specific element additions (bookmark tassel, ornament hole, coaster ring)
- Viewing distance considerations (small magnet = simpler, poster = detailed)
- Product function integration (horizontal for bumper sticker)

## When to Use
- Expanding single design into full product line (magnet, bookmark, ornament, coaster)
- Adapting vertical design to horizontal format or vice versa
- Creating size variations for different price points
- Optimizing designs for specific product shapes (circular, rectangular, custom)
- Ensuring design works across merchandise formats

## TRANSFORMETER Range: 3-8

### Level 3-4: Minor Format Adaptation
- Adjust to similar format (4x6" to 5x7" rectangle)
- Reflow elements for slightly different aspect ratio
- Crop or extend background for new dimensions
- Adjust margins and spacing for new format
- Minimal element repositioning

### Level 5-6: Moderate Format Change
- Transform orientation (vertical to horizontal)
- Adapt to significantly different shape (rectangle to circle)
- Recompose for very different dimensions (bookmark to coaster)
- Add or remove elements to fit format appropriately
- Significant layout restructuring for new format

### Level 7-8: Major Format Transformation
- Redesign for drastically different product (flat design to 3D ornament layers)
- Create format-specific variations (keychain vs. wall art)
- Optimize for unique shapes (state outline, landmark silhouette)
- Complete spatial reorganization for new format
- Format-driven design evolution

## Required Information

### From Original Design
- Current format and dimensions
- Original aspect ratio
- Element relationships and hierarchy
- Design density (busy vs. sparse)
- Structural elements (borders, frames, backgrounds)

### Variation Specifications
- Target product format(s)
- New dimensions and aspect ratio
- TRANSFORMETER level (3-8)
- Physical product considerations
- Priority elements for each format

## Prompt Templates

### For Text-Based AI (Claude Agents)

Use the agent prompt in `agents/variation-generator.md` with these specific parameters for format variation.

### For Image Generation AI

**⚠️ Important**: For image generation AI, use the structure in `reference/universal_prompt_template.md`. The template below is for reference only - adapt it to the numbered outline format (1-7 sections) shown in the universal template to avoid content policy blocks.

```
Create a format variation of the following souvenir design:

ORIGINAL DESIGN:
[Description of original design]
Current Format: [e.g., "6x4" vertical rectangle"]
Aspect Ratio: [Current ratio]
Key Elements: [Main visual components]
Layout Structure: [How elements are arranged]

FORMAT VARIATION REQUIREMENTS:
TRANSFORMETER Level: [3-8]
Target Product: [Specific product type]
New Dimensions: [Width x Height]
New Shape: [Rectangle, circle, custom, etc.]
Orientation: [Vertical, horizontal, or n/a]

CONSTRAINTS:
- Maintain design recognizability
- Keep laser-cut MDF compatibility
- Preserve core visual identity
- [Any other specific constraints]

CONTEXT:
Purpose: [Why this format variation is needed]
Product Line Strategy: [How formats relate to each other]
Price Points: [Different formats for different prices]
```

## Output Specifications

For each format variation, provide:
1. **Format Analysis**: How design was optimized for new format
2. **Layout Adaptations**: Specific changes made to fit format
3. **Element Adjustments**: What was resized, moved, or modified
4. **Product-Specific Considerations**: Special needs for this format
5. **Production Specifications**: Dimensions, cutting requirements, layers
6. **Family Cohesion Notes**: How this relates to other formats

## Quality Checklist

- [ ] Design optimized for specific product use case
- [ ] All elements fit comfortably in new format
- [ ] Visual hierarchy maintained in new dimensions
- [ ] Text legible at new scale
- [ ] Laser-cut structural integrity for new format
- [ ] Product-specific functional requirements met
- [ ] Design recognizable as part of same family
- [ ] Format enhances design, doesn't compromise it
- [ ] Physical product considerations addressed

## Common Product Formats

### Magnets
- **Typical Size**: 2.5x3.5" to 4x6"
- **Considerations**: Refrigerator viewing distance, must work small
- **Optimization**: Bold elements, clear focal point, readable text
- **Format**: Usually rectangle or square, occasionally custom shape

### Bookmarks
- **Typical Size**: 2x6" to 2.5x8" (very vertical)
- **Considerations**: Narrow format, vertical design flow
- **Optimization**: Stack elements vertically, use full length
- **Format**: Tall rectangle with possible top hole/tassel

### Ornaments
- **Typical Size**: 3-4" diameter or 3x4" rectangle
- **Considerations**: Hangs from top, viewed from both sides, needs hole/loop
- **Optimization**: Centered design, top space for hanging, circular flow
- **Format**: Circle, oval, or classic ornament shapes

### Coasters
- **Typical Size**: 3.5-4" square or circle
- **Considerations**: Holds drinks, gets wet, functional surface
- **Optimization**: Centered design, account for glass covering center
- **Format**: Square or circular, occasionally hexagon

### Wall Art/Prints
- **Typical Size**: 8x10" to 16x20"
- **Considerations**: Viewed from distance, frameable, focal wall piece
- **Optimization**: Can be detailed, complex compositions work
- **Format**: Standard frame sizes (8x10, 11x14, 16x20)

### Keychains
- **Typical Size**: 1.5-2.5" (very small)
- **Considerations**: Pocket-sized, high durability needed, must work tiny
- **Optimization**: Simple bold elements, minimal text, strong contrast
- **Format**: Circle, rectangle, or custom shape with ring hole

### Postcards
- **Typical Size**: 4x6" horizontal
- **Considerations**: Mailable, back needs address space
- **Optimization**: Front-facing design, horizontal composition
- **Format**: Standard postcard rectangle (4x6 or 5x7)

## Format Transformation Strategies

### Vertical to Horizontal
- Rearrange stacked elements to side-by-side
- Reorient tall landmarks to fit width
- Convert vertical text flow to horizontal
- Adjust background elements for new aspect
- Consider rule of thirds horizontally

### Rectangle to Circle
- Move corner elements toward center
- Create radial or concentric composition
- Adapt border to circular format
- Account for curved edges in design
- Consider circular flow of elements

### Large to Small (Wall Art to Keychain)
- Simplify complex elements
- Increase line weights for visibility
- Reduce number of elements
- Make text bolder and larger proportionally
- Focus on single strong focal point
- Remove fine details that won't read small

### Small to Large (Magnet to Poster)
- Add supporting elements and details
- Develop more complex composition
- Include additional visual interest
- Expand color palette if desired
- Add depth and layering
- Include more contextual elements

### Flat to Layered (Magnet to 3D Ornament)
- Separate design into depth layers
- Create foreground, middle, background
- Add dimensional spacing considerations
- Account for shadow/depth effects
- Consider viewing angle variations

## Product Line Strategy

### Cohesive Family Approach
- Maintain consistent color palette across all formats
- Keep core visual elements in every variation
- Use same or related typography throughout
- Similar level of detail/complexity appropriate to size
- Shared design language (borders, patterns, style)

### Format-Optimized Variations
- Each format has version perfectly suited to its use
- Magnet: Simplified, bold, fridge-friendly
- Bookmark: Vertical flow, stacked elements
- Ornament: Centered, circular, festive
- Poster: Detailed, complex, wall-worthy

### Price Point Differentiation
- Small formats (keychain, magnet): Budget-friendly, simplified
- Medium formats (ornament, coaster): Mid-price, balanced detail
- Large formats (wall art): Premium, full detail and complexity

## Example Product Line Expansion

**Original**: 6x4" vertical vintage travel poster - "San Francisco"

**Level 4 Adaptations**:
- 4x6" Horizontal Postcard: Rearranged elements side-by-side
- 2x6" Bookmark: Stacked elements vertically with Golden Gate at top
- 3.5" Circle Coaster: Centered Golden Gate with city name circular border

**Level 6 Transformations**:
- 1.5" Keychain: Golden Gate Bridge icon only with "SF" text, ultra simplified
- 4" Ornament: Circular design with bridge in snow globe effect
- 11x14" Wall Art: Expanded with additional SF landmarks and detailed background

## Tips for Success

- Start with most important format, then adapt to others
- Test each format at actual size for legibility and impact
- Consider how product will be used (functional vs. decorative)
- Maintain visual DNA even when format changes drastically
- Document which elements are essential across all formats
- Plan product line as system, not individual pieces
- Account for production feasibility in each format
- Consider retail display - do formats work together visually?
- Think about customer journey (buy magnet, then poster later)
- Verify structural integrity for laser cutting in each format
- Test text readability at actual product size
- Consider material/finish options for different formats
- Plan for packaging needs for each format type
