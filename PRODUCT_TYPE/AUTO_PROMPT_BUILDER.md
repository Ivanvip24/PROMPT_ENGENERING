# AUTOMATIC VALIDATION INJECTION SYSTEM
*Intelligent prompt builder that auto-detects product type and injects appropriate checklist*

---

## HOW THIS SYSTEM WORKS

When you provide design instructions that include dimensions or product type keywords, the system automatically:

1. **Detects** the product type from your instructions
2. **Selects** the appropriate validation checklist
3. **Injects** it at the end of your prompt
4. **Outputs** complete ready-to-use prompt

**You never copy-paste anything. The system does it all.**

---

## DETECTION TRIGGERS

The system detects product type from these keywords/dimensions:

### 2:1 Horizontal Detection
**Triggers:**
- "10\" × 5\"" or "10 x 5" or "10 inches by 5 inches"
- "2:1 horizontal" or "2:1 ratio"
- "wall art" or "poster"
- "panoramic" or "wide rectangle"

**Auto-injects:** 2:1 Horizontal validation checklist

---

### 1:1 Square Detection
**Triggers:**
- "8\" × 8\"" or "8 x 8" or "8 inches square"
- "1:1 ratio" or "square format"
- "5\" × 5\"" or "5 x 5" (if you're using smaller square)
- "balanced all directions"

**Auto-injects:** 1:1 Square validation checklist

---

### 1:2 Vertical Detection
**Triggers:**
- "5\" × 10\"" or "5 x 10" or "5 inches by 10 inches"
- "1:2 vertical" or "1:2 ratio"
- "tall vertical" or "vertical format"

**Auto-injects:** 1:2 Vertical validation checklist

---

### Bottle Opener Detection
**Triggers:**
- "3\" × 6\"" or "3 x 6" or "3 inches by 6 inches"
- "bottle opener" or "destapador"
- "void areas" or "void circles"
- "rounded rectangle with holes"

**Auto-injects:** Bottle Opener validation checklist (with void warnings)

---

### Magnet Detection
**Triggers:**
- "3.5\" × 4\"" or "3.5 x 4" or "magnet"
- "refrigerator" or "fridge magnet"
- "small format" (with dimensions around 3-4")

**Auto-injects:** Magnet validation checklist

---

### Bookmark Detection
**Triggers:**
- "2.5\" × 7\"" or "2.5 x 7" or "bookmark"
- "narrow vertical" or "tassel hole"

**Auto-injects:** Bookmark validation checklist

---

### Ornament Detection
**Triggers:**
- "4\" diameter" or "4 inch circle" or "circular"
- "ornament" or "hanging decoration"
- "circle" or "round"

**Auto-injects:** Ornament validation checklist

---

### Coaster Detection
**Triggers:**
- "3.5\" × 3.5\"" or "coaster"
- "small square" (with 3-4" dimensions)

**Auto-injects:** Coaster validation checklist

---

### Keychain Detection
**Triggers:**
- "keychain" or "key chain"
- "1.5\" to 2.5\"" or "ultra small"
- "mini" or "tiny"

**Auto-injects:** Keychain validation checklist

---

## USAGE EXAMPLES

### Example 1: You Type This

```
Create a Hermosillo desert design, 10" × 5" horizontal format,
with saguaro cacti and "HERMOSILLO" text spanning the width.
Vibrant colors, laser-cut MDF.
```

### System Auto-Generates This

```
Create a Hermosillo desert design, 10" × 5" horizontal format,
with saguaro cacti and "HERMOSILLO" text spanning the width.
Vibrant colors, laser-cut MDF.

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

Reply "DIMENSIONS VERIFIED: 10\" WIDE × 5\" TALL - HORIZONTAL SPAN CONFIRMED"
before generating the image.
```

---

### Example 2: You Type This

```
Bottle opener design for Grutas de Tolantongo, 3" × 6",
thermal pools and canyon, text "GRUTAS" at top.
Remember the three void circles.
```

### System Auto-Generates This

```
Bottle opener design for Grutas de Tolantongo, 3" × 6",
thermal pools and canyon, text "GRUTAS" at top.
Remember the three void circles.

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

### Example 3: You Type This

```
Square format design, 8" × 8", Ciudad de México,
Ángel de la Independencia with floral decoration around all edges.
Balanced radial composition.
```

### System Auto-Generates This

```
Square format design, 8" × 8", Ciudad de México,
Ángel de la Independencia with floral decoration around all edges.
Balanced radial composition.

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

Reply "DIMENSIONS VERIFIED: 8\" × 8\" SQUARE - BALANCED COMPOSITION CONFIRMED"
before generating the image.
```

---

## DETECTION PRIORITY

If multiple triggers detected, system uses this priority order:

1. **Specific dimensions** (highest priority)
   - "3\" × 6\"" → Bottle Opener
   - "10\" × 5\"" → 2:1 Horizontal
   - etc.

2. **Product keywords**
   - "bottle opener" → Bottle Opener checklist
   - "magnet" → Magnet checklist

3. **Aspect ratio notation**
   - "2:1 horizontal" → 2:1 Horizontal checklist
   - "1:1 square" → Square checklist

4. **Format descriptors**
   - "wide panoramic" → 2:1 Horizontal
   - "tall vertical" → 1:2 Vertical

---

## EMBEDDED IN TEMPLATES

All these templates now have auto-detection built-in:

### Updated Files:
- ✅ `universal_prompt_template.md` - Auto-detects from Section 4 (Production Specs)
- ✅ `streamlined_prompt_template.md` - Auto-detects from dimensions
- ✅ `ENHANCED_CREATION_TEMPLATE.md` - Auto-detects from Section 0 (Canvas Spec)
- ✅ All product-specific templates in `/PRODUCT_TYPE/templates/`

---

## FOR CLAUDE/AI ASSISTANTS

### Detection Logic:

```python
def detect_product_type(user_input):
    """
    Scan user input for product type indicators
    Return appropriate validation checklist
    """

    # Check dimensions first (most specific)
    if "10" in input and "5" in input and ("x" in input or "×" in input):
        return CHECKLIST_2_1_HORIZONTAL

    if "8" in input and "8" in input and ("x" in input or "×" in input):
        return CHECKLIST_1_1_SQUARE

    if "3" in input and "6" in input and ("x" in input or "×" in input):
        return CHECKLIST_BOTTLE_OPENER

    if "3.5" in input and "4" in input:
        return CHECKLIST_MAGNET

    if "2.5" in input and "7" in input:
        return CHECKLIST_BOOKMARK

    if "4" in input and ("diameter" in input or "circle" in input):
        return CHECKLIST_ORNAMENT

    if "3.5" in input and "3.5" in input:
        return CHECKLIST_COASTER

    # Check product keywords
    if "bottle opener" in input.lower() or "destapador" in input.lower():
        return CHECKLIST_BOTTLE_OPENER

    if "magnet" in input.lower():
        return CHECKLIST_MAGNET

    if "bookmark" in input.lower():
        return CHECKLIST_BOOKMARK

    if "ornament" in input.lower():
        return CHECKLIST_ORNAMENT

    if "keychain" in input.lower():
        return CHECKLIST_KEYCHAIN

    # Check aspect ratio descriptors
    if "2:1" in input and "horizontal" in input:
        return CHECKLIST_2_1_HORIZONTAL

    if "1:1" in input or "square" in input:
        return CHECKLIST_1_1_SQUARE

    if "1:2" in input and "vertical" in input:
        return CHECKLIST_1_2_VERTICAL

    # Default: ask user to clarify
    return None


def build_complete_prompt(user_design_instructions):
    """
    Take user's design description
    Auto-detect product type
    Append appropriate validation checklist
    Return complete prompt
    """

    product_type = detect_product_type(user_design_instructions)

    if product_type:
        checklist = get_checklist(product_type)
        complete_prompt = user_design_instructions + "\n\n" + checklist
        return complete_prompt
    else:
        # Ask user to specify product type
        return ask_user_for_product_type()
```

---

## IMPLEMENTATION

### When Creating Prompts:

**Step 1:** User describes design naturally
```
"I need a wall art piece, 10×5 inches, showing Oaxaca..."
```

**Step 2:** System detects: **2:1 Horizontal**

**Step 3:** System auto-appends checklist

**Step 4:** Complete prompt ready to send to image AI

---

## BENEFITS

✅ **No manual copying** - System does it automatically
✅ **No forgetting** - Checklist always included
✅ **Correct format** - Right checklist for product type
✅ **Consistent** - Every prompt gets validation
✅ **Fast** - No searching for correct checklist

---

## ERROR HANDLING

**If multiple product types detected:**
```
⚠️ AMBIGUOUS INPUT DETECTED

Found triggers for:
- 2:1 Horizontal (keyword: "10×5")
- Bottle Opener (keyword: "bottle opener")

Which product type is this?
1. 2:1 Horizontal Wall Art
2. Bottle Opener

Reply with number or clarify dimensions.
```

**If no product type detected:**
```
⚠️ NO PRODUCT TYPE DETECTED

Please specify one of:
- Dimensions (e.g., "10\" × 5\"")
- Product type (e.g., "magnet", "bottle opener")
- Aspect ratio (e.g., "2:1 horizontal", "1:1 square")

Then I'll auto-inject the appropriate validation checklist.
```

---

## INTEGRATION WITH EXISTING WORKFLOW

This auto-detection works seamlessly with:

- ✅ Variation generation system
- ✅ Design from scratch workflow
- ✅ TRANSFORMETER level specifications
- ✅ RESEARCH.md element libraries
- ✅ Gemini safety guidelines
- ✅ Production feasibility checks

**Nothing changes except:** validation checklists now auto-append to every prompt.

---

**Status:** Ready for implementation
**Next Step:** Update Claude Code's CLAUDE.md to include auto-detection logic
