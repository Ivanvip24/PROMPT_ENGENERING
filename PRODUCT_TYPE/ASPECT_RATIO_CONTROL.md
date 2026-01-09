# ASPECT RATIO CONTROL SYSTEM
*Ensuring proper aspect ratio adherence in design generation*

## IDENTIFIED ISSUES

The current system doesn't enforce aspect ratios strictly enough. When requesting a 2:1 horizontal design, the AI may:
- Create square or vertical compositions
- Ignore the specified dimensions
- Place elements that don't respect the format
- Generate designs that "float" without utilizing the full canvas

## ASPECT RATIO SPECIFICATIONS

### 2:1 HORIZONTAL (Wide Rectangle)
**Exact Dimensions**: 10" wide × 5" tall
**Visual Requirements**:
- Design MUST span the FULL WIDTH
- Elements distributed horizontally across entire canvas
- Text should flow LEFT TO RIGHT
- Vertical elements reduced in prominence
- Composition emphasizes horizontal movement

**Mandatory Instructions for 2:1**:
```
CRITICAL FORMAT REQUIREMENTS:
- Canvas is EXACTLY 10 inches wide by 5 inches tall (2:1 ratio)
- Design MUST use the FULL WIDTH of the canvas
- NO square composition in the center - elements must extend to edges
- Arrange elements HORIZONTALLY across the entire width
- Text elements should span horizontally, not stack vertically
- Background elements must fill the complete 10" × 5" space
```

### 1:1 SQUARE
**Exact Dimensions**: 8" × 8"
**Visual Requirements**:
- Centered, balanced composition
- Radial or symmetric arrangements work well
- Equal visual weight in all quadrants
- Can use circular motifs effectively

**Mandatory Instructions for 1:1**:
```
CRITICAL FORMAT REQUIREMENTS:
- Canvas is EXACTLY 8 inches by 8 inches (perfect square)
- Design should have balanced composition in all directions
- Center focal point with equal distribution
- No elongated vertical or horizontal bias
- Elements arranged to fill square format completely
```

### 1:2 VERTICAL (Tall Rectangle)
**Exact Dimensions**: 5" wide × 10" tall
**Visual Requirements**:
- Design MUST span the FULL HEIGHT
- Elements stacked vertically
- Text can be vertical or stacked
- Horizontal elements minimized
- Composition emphasizes vertical flow

**Mandatory Instructions for 1:2**:
```
CRITICAL FORMAT REQUIREMENTS:
- Canvas is EXACTLY 5 inches wide by 10 inches tall (1:2 ratio)
- Design MUST use the FULL HEIGHT of the canvas
- Stack elements VERTICALLY from top to bottom
- Text should flow TOP TO BOTTOM or be stacked
- Background elements must fill the complete 5" × 10" space
```

## ENFORCEMENT STRATEGIES

### 1. PRE-PROMPT VALIDATION
Before any design generation, include:
```
ASPECT RATIO ENFORCEMENT:
You are creating a [RATIO] design.
The canvas is EXACTLY [WIDTH] × [HEIGHT].
The design MUST fill the ENTIRE canvas.
DO NOT create a centered square/circle within the rectangle.
Elements MUST be distributed according to the format.
```

### 2. COMPOSITION GUIDELINES BY RATIO

#### For 2:1 Horizontal:
- Main text: Spans 80% of width minimum
- Supporting elements: Distributed left and right
- Background: Continuous horizontal landscape
- Borders: Follow rectangular format, not square
- Focus: Multiple focal points across width

#### For 1:1 Square:
- Main text: Centered or diagonal
- Supporting elements: Radial or corner placement
- Background: Concentric or quartered
- Borders: Equal on all sides
- Focus: Central with balanced surroundings

#### For 1:2 Vertical:
- Main text: Vertical orientation or stacked
- Supporting elements: Layered top to bottom
- Background: Vertical gradients or bands
- Borders: Emphasize vertical lines
- Focus: Sequential from top to bottom

### 3. EXPLICIT NEGATIVE INSTRUCTIONS

Add these to EVERY prompt to prevent common mistakes:

```
DO NOT:
- Create a square design when horizontal is requested
- Center everything in a small area leaving empty space
- Ignore the specified dimensions
- Make text too small for the format
- Create floating compositions that don't use full canvas
```

### 4. LAYOUT TEMPLATES BY ASPECT RATIO

#### 2:1 Horizontal Layout Template:
```
[LEFT THIRD]     [CENTER THIRD]     [RIGHT THIRD]
Element A        Main Text          Element B
Supporting       Continues          Supporting
Details          Across Width       Details
```

#### 1:1 Square Layout Template:
```
[CORNER]  [TOP]     [CORNER]
[SIDE]    CENTER    [SIDE]
          FOCUS
[CORNER]  [BOTTOM]  [CORNER]
```

#### 1:2 Vertical Layout Template:
```
[TOP ELEMENT]
[SECONDARY]
[MAIN TEXT]
[SUPPORTING]
[BASE ELEMENT]
```

## VALIDATION CHECKLIST

Before approving any design, verify:

### For 2:1 Horizontal:
- [ ] Design spans full 10" width
- [ ] No centered square composition
- [ ] Elements distributed horizontally
- [ ] Text reads left to right
- [ ] Background fills entire rectangle

### For 1:1 Square:
- [ ] Design fills 8" × 8" evenly
- [ ] Balanced in all directions
- [ ] No vertical/horizontal bias
- [ ] Centered or radial composition
- [ ] Equal visual weight

### For 1:2 Vertical:
- [ ] Design spans full 10" height
- [ ] Elements stacked vertically
- [ ] Vertical flow maintained
- [ ] Text orientation appropriate
- [ ] Background fills entire rectangle

## REVISED PROMPT STRUCTURE

When requesting a design, structure the prompt as:

```
1. CANVAS SPECIFICATION [FIRST]
   - Format: [2:1 horizontal / 1:1 square / 1:2 vertical]
   - Exact dimensions: [10"×5" / 8"×8" / 5"×10"]
   - MUST use entire canvas area

2. COMPOSITION REQUIREMENTS [SECOND]
   - Layout: [Horizontal flow / Centered / Vertical stack]
   - Element distribution: [Across width / Radial / Top to bottom]
   - Text orientation: [Horizontal span / Centered / Vertical]

3. DESIGN ELEMENTS [THIRD]
   [Regular design description]

4. FORMAT VALIDATION [LAST]
   - Confirm: Design fills ENTIRE [dimensions] canvas
   - Confirm: No empty spaces or centered floating elements
   - Confirm: Composition matches [ratio] format
```

## COMMON FAILURES AND FIXES

### Problem: Square composition in 2:1 canvas
**Fix**: Explicitly state "distribute elements from left edge to right edge"

### Problem: Vertical stacking in horizontal format
**Fix**: Specify "arrange elements side-by-side horizontally"

### Problem: Small centered design with empty borders
**Fix**: Add "design must extend to all edges of canvas"

### Problem: Text too small for format
**Fix**: Specify text should be "minimum 30% of canvas height"

### Problem: Ignoring aspect ratio completely
**Fix**: Repeat dimensions 3 times in prompt (beginning, middle, end)

## TESTING PROTOCOL

For each new prompt template:
1. Generate 3 test outputs
2. Verify aspect ratio adherence
3. Check full canvas utilization
4. Confirm composition matches format
5. Adjust prompt if any test fails

## INTEGRATION WITH EXISTING SYSTEM

Update these files to enforce aspect ratios:

1. **agents/creation-agent.md**: Add aspect ratio enforcement section
2. **settings/defaults.yaml**: Include strict dimension specifications
3. **generators/MASTER_PROMPT_BUILDER.md**: Add format validation
4. **reference/universal_prompt_template.md**: Include canvas specification as first section
5. **validation-agent.md**: Add aspect ratio checking

## SUCCESS METRICS

A properly formatted design will:
- Use 90%+ of the canvas area
- Have elements distributed according to aspect ratio
- Show clear horizontal/vertical/centered bias matching format
- Fill the specified dimensions completely
- Maintain visual balance within the format constraints