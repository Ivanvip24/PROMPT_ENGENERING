# Irregular Shape Requirement - System-Wide Update Guide

## Critical New Requirement

**All design variations MUST have irregular, organic shapes with flowing borders - NOT perfect squares or rectangles.**

This document provides the exact text to add to each file in the GOAL2 system.

---

## 1. Update: `agents/variation-generator.md`

### Location: Add after "CONSTRAINTS:" section in the Prompt Template

```markdown
SHAPE & BORDER REQUIREMENTS (CRITICAL):

⚠️ DO NOT create a perfectly squared or rectangular design with hard edges.

REQUIRED APPROACH:
✓ Irregular, organic shape boundaries
✓ Flowing, curved edges that follow the design elements
✓ Natural contours that complement the composition
✓ Die-cut style borders (shaped around key elements)
✓ Soft, rounded corners or custom silhouette edges
✓ Cloud-like, wave-like, or element-following perimeters

EXAMPLES OF GOOD IRREGULAR SHAPES:
- Circular/oval with organic variations
- Cloud-shaped with flowing curves
- Splash/wave-shaped following water elements
- Silhouette-cut around main elements (dolphins, vehicle, flamingos, etc.)
- Badge/emblem shapes with decorative edges
- Scalloped, wavy, or custom contoured borders
- Asymmetric organic shapes that feel natural

AVOID:
✗ Perfect squares or rectangles
✗ Hard 90-degree corners
✗ Rigid geometric borders
✗ Box-like frames

The design should feel like it's been custom-cut to fit the artwork,
not placed in a standard rectangular frame. Borders should enhance
the design's visual appeal and create a more dynamic, attractive
souvenir product.
```

### Location: Update OUTPUT REQUIREMENTS section

Add this to Section 2 "DETAILED DESIGN DESCRIPTION":

```markdown
- SHAPE & BORDER: Irregular, organic border treatment (describe the custom shape and how it follows/complements the design elements)
```

---

## 2. Update: `agents/variation-validator.md`

### Location: Add to "Design Quality" checklist

```markdown
### Design Quality
- [ ] Professional design execution
- [ ] Visual balance and composition
- [ ] Color harmony
- [ ] Typography appropriateness
- [ ] Appropriate complexity for format
- [ ] Text legibility
- [ ] **Irregular, organic shape borders (NOT perfect squares/rectangles)**
- [ ] **Border shape complements and enhances the design**
```

### Location: Add new validation section

```markdown
#### Shape & Border Treatment
- Status: [✓ Pass / ⚠ Needs Improvement / ✗ Fail]
- Shape type: [Organic/Irregular/Custom - describe]
- Observations: [How border complements design]
- Issues: [If design has rigid rectangular borders]
- Recommendations: [How to create more organic shape]
```

---

## 3. Update: `agents/production-feasibility-analyzer.md`

### Location: Add to "Structural Integrity" section

```markdown
#### Border & Shape Considerations
- Shape type: [Irregular organic / Custom die-cut / Circular / etc.]
- Border complexity: [Simple curves / Complex organic / etc.]
- Cutting path implications: [How irregular shape affects laser cutting]
- Edge finish: [Smooth curves / Intricate details / etc.]
- Recommendations: [Optimal irregular shape for production efficiency]
```

### Location: Add to "Laser-Cut Compatibility" section

```markdown
#### Irregular Shape Cutting
- Status: [✓ Feasible / ⚠ Complex / ✗ Too intricate]
- Border cut path: [Smooth organic curves / Complex die-cut / etc.]
- Cutting time impact: [Minimal / Moderate / Significant increase vs. rectangle]
- Recommendations: [Balance visual appeal with production efficiency]

NOTE: Irregular shapes are MORE attractive and preferred by customers,
but may increase cutting time slightly. This is acceptable and expected.
The visual appeal benefit outweighs minor production time increase.
```

---

## 4. Update: `agents/family-coherence-checker.md`

### Location: Add to "Visual DNA Consistency" section

```markdown
### Shape & Border Consistency
**Pattern**: [Consistent irregular approach / Varied organic shapes / Mixed]

**Analysis**:
[How shape treatments create or support family unity while maintaining variety]

**Assessment**: [Do shapes feel related while offering variety?]
```

---

## 5. Update: `variation_scenarios/color_variation.md`

### Location: Add to "Quality Checklist" section

```markdown
- [ ] Irregular, organic shape borders (not perfect rectangle)
- [ ] Border shape complements color choices and design
```

---

## 6. Update: `variation_scenarios/style_variation.md`

### Location: Add to "Quality Checklist" section

```markdown
- [ ] Irregular, organic shape borders appropriate for chosen style
- [ ] Border treatment enhances style aesthetic
```

---

## 7. Update: `variation_scenarios/composition_variation.md`

### Location: Add to "Quality Checklist" section

```markdown
- [ ] Irregular, organic shape borders that follow/complement composition
- [ ] Border shape enhances visual flow and hierarchy
```

---

## 8. Update: `variation_scenarios/seasonal_variation.md`

### Location: Add to "Quality Checklist" section

```markdown
- [ ] Irregular, organic shape borders appropriate for season/holiday
- [ ] Border treatment enhances seasonal theme
```

---

## 9. Update: `variation_scenarios/format_variation.md`

### Location: Add to "Quality Checklist" section

```markdown
- [ ] Irregular, organic shape borders optimized for product format
- [ ] Border shape works for intended product type
```

### Location: Add to "Common Product Formats" section

For each product type, add:

```markdown
- **Border treatment**: Organic irregular shape, die-cut style (not rectangular frame)
```

---

## 10. Update: `reference/true_variations_guide.md`

### Location: Add new section after "🔑 Key Requirements for TRUE Variations"

```markdown
## 🎨 Shape & Border Requirements

### Critical Aesthetic Rule: Irregular Shapes Only

**Why Irregular Shapes?**
- More visually appealing and attractive to customers
- Creates premium, custom-designed look
- Feels modern and professional
- Stands out from generic rectangular souvenirs
- Enhances the overall design composition

**Required Border Treatment**:
✓ Irregular, organic shape boundaries
✓ Flowing curved edges that follow design elements
✓ Natural contours that complement the artwork
✓ Die-cut style borders shaped around key elements
✓ Soft rounded corners or custom silhouette edges
✓ Cloud-like, wave-like, or element-following perimeters

**Forbidden Border Treatments**:
✗ Perfect squares or rectangles
✗ Hard 90-degree corners
✗ Rigid geometric borders
✗ Simple box frames

**Examples of Excellent Irregular Shapes**:
- Circular with organic edge variations (not perfect circle)
- Cloud-shaped with flowing curves
- Splash/wave-shaped following water elements
- Silhouette-cut around main characters/landmarks
- Badge/emblem with decorative scalloped edges
- Asymmetric organic shape that follows composition flow
- Custom die-cut following natural elements (palms, waves, etc.)

**How to Apply**:
1. Design the composition first
2. Let the border follow and enhance the design
3. Make edges flow organically, not rigidly
4. Consider how border shape reinforces visual hierarchy
5. Ensure shape is production-feasible for laser cutting

**Production Note**:
Irregular shapes may add slight cutting time, but the visual appeal
benefit far outweighs this minor consideration. Customers strongly
prefer organic shapes over rectangles.
```

---

## 11. Update: `reference/variation_best_practices.md`

### Location: Add to "Quality Consistency" section

```markdown
### Shape & Border Treatment
**Standard**: All variations use irregular, organic shape borders
**Assessment**: [Organic shapes enhance design / Rectangles diminish appeal]

**Best Practice**: Design borders that flow with and complement the
composition. Never use perfect rectangles or squares. Think die-cut,
custom-shaped products that feel premium and intentional.
```

---

## 12. Update: `CLAUDE.md`

### Location: Add to "Production Constraints" section

```markdown
### Shape & Border Requirements
**Critical aesthetic rule**: All designs must have irregular, organic shape borders.

- NO perfect squares or rectangles
- NO hard 90-degree corners
- YES to flowing, curved, organic edges
- YES to die-cut style borders following design elements
- YES to custom silhouette shapes

**Why**: Irregular shapes are significantly more attractive to customers and
create a premium, modern aesthetic. Perfect rectangles look generic and dated.

**Production note**: Irregular shapes are compatible with laser-cut MDF and
add minimal cutting time while providing major visual appeal benefit.
```

---

## 13. Update: `INIT.md`

### Location: Add to "Key Concepts" section

```markdown
### Shape & Border Treatment
All design variations must feature irregular, organic shape borders:
- Flowing curved edges that complement the composition
- Die-cut style borders shaped around key elements
- Custom silhouettes that enhance visual appeal
- NO perfect squares or rectangles (these look generic and unappealing)

This creates more attractive, premium-looking souvenir products that
customers find significantly more appealing than rigid rectangular designs.
```

---

## Quick Reference Summary

**The Core Message to Add Everywhere**:

> Design variations MUST have irregular, organic shape borders with flowing
> curves that complement the composition. Perfect squares and rectangles are
> NOT acceptable. Think die-cut, custom-shaped borders that make the design
> feel premium and intentional. This is a critical aesthetic requirement
> that significantly increases customer appeal.

---

## Files to Update (Complete List)

1. ✅ `agents/variation-generator.md`
2. ✅ `agents/variation-validator.md`
3. ✅ `agents/family-coherence-checker.md`
4. ✅ `agents/production-feasibility-analyzer.md`
5. ✅ `variation_scenarios/color_variation.md`
6. ✅ `variation_scenarios/style_variation.md`
7. ✅ `variation_scenarios/composition_variation.md`
8. ✅ `variation_scenarios/seasonal_variation.md`
9. ✅ `variation_scenarios/format_variation.md`
10. ✅ `reference/true_variations_guide.md`
11. ✅ `reference/variation_best_practices.md`
12. ✅ `CLAUDE.md`
13. ✅ `INIT.md`

---

## Testing the Update

After updates, test with this prompt addition:

```
SHAPE & BORDER (CRITICAL):
Create an irregular, organic shape border - NOT a perfect square or rectangle.
The border should flow naturally with the design elements and create a custom
die-cut appearance. Use flowing curves, organic edges, or shapes that follow
the main elements. This is essential for visual appeal.
```

Expected result: Designs with beautiful flowing borders that enhance the composition, not rigid rectangular frames.

---

**Implementation Status**: Ready for manual update
**Priority**: High - Critical aesthetic requirement
**Impact**: Significantly improves customer appeal of all variations
