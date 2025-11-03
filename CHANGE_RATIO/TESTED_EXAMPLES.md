# Tested Transformation Examples

**Ready-to-use prompts for the two core transformations**

---

## Transformation 1: Square to Rectangular (1:1 → 2:1)

**Challenge:** Extend horizontally while keeping design balanced

**Prompt Structure:**

```
Transform this 1:1 square design to 2:1 rectangular format.

ASPECT RATIO TRANSFORMATION:
1:1 square → 2:1 rectangular
• Composition: Extend horizontally on both sides equally
• Main subject: Keep centered, maintain current size and position
• Extended areas: Continue background [sky/texture/gradient/pattern] naturally to left and right edges
• Side space: Add [complementary elements if needed - clouds/decorative elements/environmental details] maintaining visual balance

Preserve design DNA: All central elements, text, colors, character/subject details, artistic style, core composition.

Style: Match existing [illustrated/vector/photographic/etc] style.

CREATE DESIGN
```

**Word count:** ~155 words

**Fill-in fields:**
- `[sky/texture/gradient/pattern]` - What background extends
- `[complementary elements...]` - What fills sides if needed
- `[illustrated/vector/photographic/etc]` - Art style to match

**Success metrics to track:**
- Main subject remains centered
- Background extends naturally
- No distortion of original elements
- Text/logos remain intact

---

## Transformation 2: Rectangular to Square (2:1 → 1:1)

**Challenge:** Intelligently crop while preserving key elements

**Prompt Structure:**

```
Transform this 2:1 rectangular design to 1:1 square format.

ASPECT RATIO TRANSFORMATION:
2:1 rectangular → 1:1 square
• Composition: Reframe to square, centering main subject
• Crop strategy: Remove excess horizontal edges (left and right) while preserving all key elements
• Main subject: Ensure [main character/logo/focal element] remains fully visible and centered
• Balance: Redistribute remaining elements symmetrically within square frame

Preserve design DNA: Main subject entirely, all text, color palette, artistic style, essential visual elements.

Style: Match existing [illustrated/vector/photographic/etc] aesthetic.

CREATE DESIGN
```

**Word count:** ~148 words

**Fill-in fields:**
- `[main character/logo/focal element]` - What must stay visible
- `[illustrated/vector/photographic/etc]` - Art style to match

**Success metrics to track:**
- Main subject fully visible
- Smart cropping (removes non-essential areas)
- No text cut off
- Maintains visual hierarchy

---

## Usage Notes

1. **Test each prompt as-is first** - Don't modify until you see results
2. **Document failures** - Note what didn't work in ITERATION_LOG.md
3. **Adjust based on real data** - Not theory
4. **One change at a time** - Easier to track what works

---

## Next Steps After Testing

- Add new ratios only when needed
- Refine language based on actual results
- Document patterns that emerge
