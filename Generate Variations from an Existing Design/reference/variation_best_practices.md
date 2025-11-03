# Variation Best Practices

## Important: Prompt Formatting for Image Generation AI

When creating prompts for image generation AI (not text-based Claude agents), use the template in `universal_prompt_template.md`. This structure has been validated to avoid AI content policy blocks.

### Critical Formatting Rules

**✅ DO**:
- Use numbered outline format (1, 2, 3, 4, 5, 6, 7)
- Write descriptively: "The design features..." not "You must generate..."
- Use bullet points (•) naturally in lists
- Place technical specs in production section at END
- Frame as design specifications/project brief
- End with simple "CREATE DESIGN"

**❌ DON'T**:
- Start with "You are generating..." or similar AI role framing
- Use "MUST", "CRITICAL", "REQUIRED" as command language
- Create "SYSTEM CONTEXT" or instruction blocks
- Use ✓ checkmarks and ✗ X marks with prescriptive rules
- Front-load technical constraints as "rules to follow"
- End with "BEGIN THE IMAGE GENERATION NOW"

### Why This Matters

Image generation AI systems have content policies that block prompts appearing to "jailbreak" or reprogram the AI. The working template treats the AI as a creative collaborator receiving a design brief, not a system being reprogrammed.

**Structure that WORKS**: Design specification (like briefing a designer)
**Structure that BLOCKS**: System instructions (like programming code)

📖 **Full template and examples**: `universal_prompt_template.md`

---

## Core Principles

### 1. Intentional Variation
Every variation should have a clear purpose and strategic rationale. Never create variations just for the sake of variety.

**Good Reasons**:
- A/B testing market preferences
- Expanding product line for different price points
- Seasonal/holiday adaptations
- Different demographic targeting
- Format-specific optimizations

**Poor Reasons**:
- "Let's just make it different"
- Creating variations without market research
- Changing things randomly
- Making variations because you're bored with original

### 2. Family Cohesion
All variations should feel like they belong to the same family while serving their unique purpose.

**Cohesion Strategies**:
- Maintain consistent core elements across variations
- Use related color palettes (not random colors each time)
- Keep typography family consistent
- Preserve key visual DNA
- Use similar level of detail/quality
- Maintain brand voice and personality

**Test**: If you showed 5 variations without location names, would people know they're related?

### 3. Preservation of Identity
The destination or subject matter must remain clearly identifiable in every variation (except Level 10).

**Identity Anchors**:
- Key landmarks must be recognizable
- Location name clearly visible
- Signature elements preserved
- Brand elements maintained
- Cultural authenticity respected

**Warning Signs**:
- "Is this San Francisco or Seattle?"
- Landmark unrecognizable in variation
- Lost cultural context
- Generic design could be anywhere

### 4. Quality Consistency
Every variation should meet the same quality standards as the original, regardless of transformation level.

**Quality Standards**:
- Professional design execution
- Technical production feasibility
- Appropriate complexity for format
- Text legibility and hierarchy
- Visual balance and composition
- Color harmony and intention

**Remember**: "Different" ≠ "Lower Quality"

## Strategic Variation Planning

### Creating a Variation Series

**Step 1: Define Strategy**
- What's the goal? (product line, testing, seasonal, etc.)
- Who are the different audiences?
- What formats/products needed?
- What's the budget/timeline?

**Step 2: Map the Family**
- Choose 3-7 variations (sweet spot for most projects)
- Assign TRANSFORMETER levels (keep within 3-4 levels of each other)
- Define what varies and what stays constant
- Plan relationship between variations

**Step 3: Establish Rules**
- Which elements MUST stay in every variation?
- What's the acceptable range of change?
- Brand guidelines to respect
- Production constraints to maintain

**Step 4: Create and Validate**
- Design variations according to plan
- Check family cohesion
- Validate against strategy
- Test with target audience if possible

### Variation Family Structures

#### The Gradient Series (Recommended)
Variations that progress smoothly across one dimension.

**Example - Color Gradient**:
- Variation 1: Warm palette (reds, oranges, yellows)
- Variation 2: Neutral palette (grays, tans, whites)
- Variation 3: Cool palette (blues, greens, purples)

**Example - Style Gradient**:
- Variation 1: Detailed realistic (Level 3)
- Variation 2: Stylized illustrated (Level 5)
- Variation 3: Minimalist abstract (Level 7)

#### The Matrix Series
Variations across two dimensions simultaneously.

**Example - Color × Style Matrix**:
```
              Vintage Style    Modern Style    Minimalist Style
Warm Colors   Variation 1      Variation 2     Variation 3
Cool Colors   Variation 4      Variation 5     Variation 6
```

#### The Seasonal Series
Four variations, one per season or key holidays.

**Example**:
- Spring: Pastel colors, cherry blossoms (Level 4)
- Summer: Bright colors, beach elements (Level 4)
- Fall: Warm colors, autumn leaves (Level 4)
- Winter: Cool colors, snow elements (Level 4)

#### The Format Series
Same design optimized for different products.

**Example**:
- Magnet: Bold, simplified (Level 4)
- Bookmark: Vertical composition (Level 5)
- Ornament: Circular, festive (Level 6)
- Poster: Detailed, complex (Level 3)

## Common Variation Mistakes

### Mistake 1: Too Many Variations
**Problem**: Creating 15 variations when 4 would suffice
**Impact**: Dilutes brand, confuses customers, inventory nightmare
**Fix**: Start with 3-5 core variations, expand only if data supports it

### Mistake 2: Random Variation
**Problem**: No clear logic connecting variations
**Impact**: Looks unprofessional, confuses market positioning
**Fix**: Create intentional variation strategy with clear rationale

### Mistake 3: Losing the Original
**Problem**: Every variation changes so much nothing ties back to original
**Impact**: No family cohesion, scattered brand identity
**Fix**: Establish "sacred elements" that must stay consistent

### Mistake 4: Inconsistent Quality
**Problem**: Original is Level A, variations are Level B or C quality
**Impact**: Devalues entire line, customer dissatisfaction
**Fix**: Maintain quality standards across all variations

### Mistake 5: Format Incompatibility
**Problem**: Creating variation that doesn't work for intended format
**Impact**: Poor user experience, production issues
**Fix**: Optimize each variation for its specific format/use case

### Mistake 6: Cultural Insensitivity
**Problem**: Adding seasonal/holiday elements inappropriate to location
**Impact**: Offensive, inauthentic, reduces trust
**Fix**: Research cultural appropriateness before adding themed elements

### Mistake 7: Over-Transformation
**Problem**: Using Level 9 when Level 5 would achieve goal
**Impact**: Wasted effort, lost family connection
**Fix**: Use minimum TRANSFORMETER level needed to achieve goal

### Mistake 8: Production Ignorance
**Problem**: Creating variations that can't be produced with same method
**Impact**: Added cost, quality inconsistency, delays
**Fix**: Maintain production compatibility (laser-cut MDF) across all variations

## Variation Testing Strategies

### Market Testing Approach
1. Create 3 variations at different TRANSFORMETER levels (e.g., 3, 5, 7)
2. Test with sample audience
3. Identify which level resonates best
4. Create full family at optimal level range

### A/B Testing Approach
1. Create 2 variations at similar level (both Level 4)
2. Vary one aspect (color vs. composition vs. style)
3. Test with real customers
4. Use data to inform future variations

### Portfolio Approach
1. Create variations spanning wide level range (2, 5, 8)
2. Offer all to market simultaneously
3. Track which performs best
4. Expand successful variations, phase out underperformers

## Production Considerations

### Laser-Cut MDF Requirements
All variations must maintain compatibility with laser-cutting process:

**Essential**:
- Vector-based artwork
- Appropriate line weights (not too thin)
- Structural integrity (elements connected, not floating)
- Suitable complexity for cut detail
- Consideration of wood grain direction
- Proper nesting for material efficiency

**Variable by Format**:
- Larger formats can have more detail
- Smaller formats need simpler designs
- Thin elements may need reinforcement
- Consider assembly if multi-layer

### Cost Implications
Track how variations affect production costs:

**Cost Factors**:
- Cutting time (more complex = more expensive)
- Material usage (efficient nesting saves money)
- Finishing requirements (paint, stain, etc.)
- Assembly complexity
- Quality control time

**Strategy**: Keep variation family within similar cost range for consistent pricing

## Family Cohesion Checklist

Use this checklist to ensure variation family works together:

- [ ] All variations serve clear strategic purpose
- [ ] TRANSFORMETER levels within 3-4 levels of each other
- [ ] Core subject/destination recognizable in each
- [ ] Consistent quality level across all variations
- [ ] Related color palette approach (not random colors)
- [ ] Typography family maintained or intentionally varied
- [ ] Similar level of detail/complexity for format
- [ ] Production method consistent across family
- [ ] Brand guidelines respected in all variations
- [ ] Cultural sensitivity maintained
- [ ] Designs feel related when viewed together
- [ ] Each variation optimized for its specific purpose
- [ ] Clear visual DNA connects all family members
- [ ] Price points logical for variation differences

## Documentation Standards

For every variation project, document:

### Variation Brief
- Project goal and strategy
- Target audience for each variation
- TRANSFORMETER levels chosen and why
- Number of variations and rationale
- Timeline and budget

### Variation Specifications
For each variation:
- TRANSFORMETER level used
- What changed from original
- What stayed constant
- Specific purpose of this variation
- Target format/product
- Production specifications

### Family Map
- Visual showing all variations together
- Relationship diagram
- Production specs comparison
- Cost comparison
- Market positioning for each

## Scaling Variations

### Starting Small
- Begin with 3-4 core variations
- Test with real market/customers
- Gather data on performance
- Iterate based on feedback

### Expanding Strategically
- Add variations only when data supports
- Maintain family cohesion as you grow
- Don't exceed 10 variations without strong rationale
- Consider sub-families for large lines

### Managing Large Families
- Group into sub-families (by color, style, season, etc.)
- Maintain clear documentation
- Create variation naming system
- Plan inventory and production carefully
- Consider SKU management complexity

## Success Metrics

How to know if your variations are working:

### Design Quality Metrics
- Family cohesion maintained (subjective assessment)
- Production feasibility confirmed
- Quality standards met across all variations
- Client/stakeholder approval

### Market Performance Metrics
- Sales data by variation
- Customer preference feedback
- A/B test results
- Return/satisfaction rates
- Social media engagement by variation

### Business Metrics
- Cost efficiency across family
- Production ease/speed
- Inventory turnover
- Profit margins by variation
- Market share growth

## Conclusion

Successful variation design requires:
1. **Strategic thinking** - Know why you're creating each variation
2. **Family cohesion** - Maintain visual DNA across variations
3. **Quality consistency** - Every variation meets high standards
4. **Production awareness** - Ensure feasibility and cost-effectiveness
5. **Market focus** - Create variations that serve real customer needs

The best variation families feel intentional, cohesive, and strategically sound while offering meaningful choices to customers.
