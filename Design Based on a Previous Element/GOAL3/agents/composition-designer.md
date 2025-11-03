# Composition Designer Agent

## Agent Type
`general-purpose`

## Purpose
Transform element analysis and context strategy into a detailed spatial composition blueprint, designing the exact arrangement of the element, cultural additions, text, borders, and all design components into a cohesive, balanced layout ready for production.

## When to Use
- After element analysis and context building are complete
- Ready to design specific spatial arrangement
- Need composition blueprint for production
- Want multiple layout options to compare
- Step 3 of the GOAL3 workflow

## Agent Capabilities
- Design detailed spatial layouts
- Create composition blueprints with measurements
- Arrange element + additions for optimal visual hierarchy
- Design borders and frames
- Plan text integration and typography
- Create multiple composition variations
- Ensure production viability (laser-cut connections, printability)
- Balance visual weight and negative space

## Input Requirements

### Essential Information
1. **Element Analysis Report**
   - Element dimensions, style, characteristics
   - Recommended composition strategies

2. **Context Strategy Report**
   - Complete list of cultural additions (5-10 items)
   - Spatial arrangement strategy
   - Color palette
   - Storytelling narrative

3. **Production Specifications**
   - Production method (laser-cut MDF, print, etc.)
   - Final product size
   - Technical constraints

### Optional Information
- Specific layout preferences
- Text content (location name, taglines, etc.)
- Brand guidelines for text/layout
- Multiple size variations needed

## Prompt Template for Agent

```
COMPOSITION DESIGN REQUEST

Background Context:
I have a complete element analysis and context strategy with cultural additions identified. Now I need to design the exact spatial composition - where every element goes, how they relate to each other, text placement, border design, and overall layout blueprint ready for production.

═══════════════════════════════════════════════════════════════════════════

ELEMENT SUMMARY:

Element Type: [Character / Landmark / Logo / Icon]
Element Style: [Art style description]
Element Size: [Current dimensions or aspect ratio]
Element Colors: [Color palette]
Recommended Element Prominence: [30-50%] of design

═══════════════════════════════════════════════════════════════════════════

CONTEXT STRATEGY SUMMARY:

Location: [City, State/Region, Country]
Primary Theme: [Theme name and description]
Story to Tell: [One-sentence narrative]

Cultural Additions (Total: [#]):

1. [Addition 1 - Category]: [Specific item]
2. [Addition 2 - Category]: [Specific item]
3. [Addition 3 - Category]: [Specific item]
4. [Addition 4 - Category]: [Specific item]
5. [Addition 5 - Category]: [Specific item]
[Continue for all additions...]

Recommended Composition Strategy: [Central Hero / Environmental Integration / Narrative Scene / Badge-Emblem / Collage]

═══════════════════════════════════════════════════════════════════════════

PRODUCTION SPECIFICATIONS:

Production Method: [Laser-cut MDF / Full-color print / Screen print / etc.]
Final Size: [Width × Height in inches]
Aspect Ratio: [Square, vertical rectangle, horizontal rectangle, circular, custom]
Format: [Magnet, sticker, coaster, ornament, wall art, etc.]

Technical Requirements:
- [Laser-cut: All elements must connect, min 2pt lines]
- [Print: 300 DPI, CMYK, bleed requirements]
- [Other specific production constraints]

═══════════════════════════════════════════════════════════════════════════

TEXT CONTENT:

Primary Text: [e.g., "XOCHIMILCO", "SAN ANTONIO", etc.]
Secondary Text (if any): [Tagline, subtitle, etc.]
Text Style Preference: [Bold display, script, vintage, modern, etc.]

═══════════════════════════════════════════════════════════════════════════

SPECIFIC PREFERENCES OR CONSTRAINTS:

[Any specific layout requests, elements that must/must not be adjacent, size constraints, etc.]

═══════════════════════════════════════════════════════════════════════════

COMPOSITION DESIGN REQUIRED:

Provide comprehensive composition blueprint covering:

1. OVERALL COMPOSITION STRUCTURE
   - Layout format and orientation
   - Grid system or spatial division
   - Visual hierarchy plan
   - Balance strategy (symmetrical, asymmetrical, radial)

2. ELEMENT PLACEMENT
   - Exact position within composition
   - Size relative to total design (percentage)
   - Rotation or orientation
   - Relationship to center point
   - Z-depth layer (background, midground, foreground)

3. CULTURAL ADDITIONS PLACEMENT
   - Position for each of the 5-10 additions
   - Size relative to element and total design
   - Spatial relationships between additions
   - Layering (what's behind/in front of what)
   - Visual grouping or clustering strategy

4. TEXT INTEGRATION DESIGN
   - Text placement (top, bottom, arced, integrated, etc.)
   - Text size and scale
   - Text path or curve
   - Typography style recommendation
   - Text-element relationship
   - Text readability ensured

5. BORDER AND FRAME DESIGN ⚠️ CRITICAL IRREGULAR SHAPE REQUIREMENT
   - **MANDATORY: Border MUST be irregular, organic shape**
   - **NO square or rectangular outlines allowed**
   - **NO 90-degree angles or straight rigid sides**
   - Border must flow naturally following composition contours
   - Asymmetrical, flowing die-cut silhouette
   - Border style (decorative pattern, cultural elements, organic flow)
   - Border width variation (not uniform)
   - Organic treatments (flowing curves, natural edges)
   - Decorative elements integrated into irregular border
   - Border creates dynamic outer shape

6. LAYERING AND DEPTH STRATEGY
   - Background layer contents
   - Midground layer contents
   - Foreground layer contents
   - Depth cues (size, overlap, color)

7. VISUAL HIERARCHY AND FLOW
   - Primary focal point (should be element)
   - Secondary focal points
   - Eye movement path through design
   - Visual weight balance
   - Negative space distribution

8. COLOR DISTRIBUTION PLAN
   - Color placement across composition
   - Color balance and harmony
   - Visual weight of colors
   - Contrast areas

9. PRODUCTION TECHNICAL BLUEPRINT
   - Structural connections (for laser-cut)
   - Cut paths vs. engrave areas
   - Minimum line weights
   - Safe areas and margins
   - Bleed areas (for print)

10. COMPOSITION VARIATIONS (optional)
   - Alternative layout option 1
   - Alternative layout option 2
   - Rationale for each variation

PROVIDE DETAILED COMPOSITION BLUEPRINT

```

## Output Structure

### Composition Blueprint Report

```markdown
# COMPOSITION BLUEPRINT

## Project Identifier
- Project Name: [Name]
- Element: [Element name]
- Location: [Location]
- Design Date: [Date]
- Composition Version: [v1, v2, etc.]

---

## 1. OVERALL COMPOSITION STRUCTURE

### Format Specifications
- **Final Dimensions**: [Width] × [Height] inches
- **Aspect Ratio**: [1:1 square / 4:5 vertical / 16:9 horizontal / etc.]
- **Orientation**: [Portrait / Landscape / Square]
- **Shape**: [Rectangle / Square / Circle / Custom die-cut]
- **Production Method**: [Laser-cut MDF / Full-color print / etc.]

### Layout System

**Grid Structure**: [Description of underlying grid]
- Vertical divisions: [Number and proportion]
- Horizontal divisions: [Number and proportion]
- Key alignment points: [Where major elements align]

**Visual Format**: [Diagram description]
```
┌─────────────────────────────────────────┐
│  [TEXT AREA - Top 15%]                  │
├─────────────────────────────────────────┤
│                                         │
│     [LEFT          [ELEMENT]   RIGHT]   │
│     ADDITIONS]     [CENTER]    [ADDITIONS]
│                   [40%]                 │
│                                         │
├─────────────────────────────────────────┤
│  [BOTTOM ADDITIONS/TEXT - 20%]          │
└─────────────────────────────────────────┘
```

### Balance Strategy
- **Balance Type**: [Symmetrical / Asymmetrical / Radial]
- **Balance Approach**: [How visual weight is distributed]
- **Stability**: [How design feels grounded and stable]

### Visual Hierarchy
- **Primary Focal Point**: [Element] at [position]
- **Secondary Focal Points**: [List 2-3 supporting areas]
- **Tertiary Elements**: [Decorative additions, patterns]
- **Hierarchy Method**: [Size, color, contrast, position]

---

## 2. ELEMENT PLACEMENT

### Element Position

**Horizontal Position**:
- Distance from left edge: [X inches or X%]
- Alignment: [Centered / Offset left / Offset right]
- Horizontal shift rationale: [Why positioned here]

**Vertical Position**:
- Distance from top edge: [Y inches or Y%]
- Alignment: [Centered / Upper third / Lower third]
- Vertical shift rationale: [Why positioned here]

**Center Point**: Element center at [X, Y] coordinates

### Element Sizing

**Element Dimensions**:
- Width: [W inches] ([W%] of total width)
- Height: [H inches] ([H%] of total height)
- **Total Area**: [Percentage]% of total design area ✓ [Confirm within 30-50% range]

**Size Rationale**: [Why this size is optimal]

**Scaling from Original**:
- Original size: [Dimensions]
- Final size: [Dimensions]
- Scale factor: [X%]

### Element Orientation

**Rotation**: [0° / 15° / 45° / etc.]
**Facing Direction**: [Left / Right / Forward / Upward]
**Tilt/Skew**: [None / Slight tilt / etc.]
**Orientation Rationale**: [Why positioned/rotated this way]

### Element Layer

**Z-Depth**: [Background / Midground / Foreground]

**Layer Relationships**:
- Elements behind: [List what's behind element]
- Elements in front: [List what's in front of element, if any]
- Overlap strategy: [How element overlaps with additions]

---

## 3. CULTURAL ADDITIONS PLACEMENT

**Total Additions**: [5-10]
**Spatial Strategy**: [Framing element / Scattered naturally / Grouped by type / etc.]

### Addition 1: [Addition Name - Category]

**Position**:
- Location: [Specific position - e.g., "Upper left, 0.5" from top edge"]
- Coordinates: [X, Y] from top-left corner
- Relationship to element: [Above left shoulder / At base / Flanking right side / etc.]

**Size**:
- Dimensions: [W × H inches]
- Relative size: [Small / Medium / Large] ([X%] of element size)
- Visual weight: [How prominent]

**Orientation**:
- Rotation: [Angle if rotated]
- Facing: [Direction or orientation]

**Layer**: [Background / Midground / Foreground]

**Connections** (for laser-cut):
- Connects to: [Element / Border / Other addition]
- Connection points: [Where and how it connects]

**Purpose in Composition**:
- Visual: [Frames element / Adds color / Creates depth / etc.]
- Narrative: [Contributes to story by...]

---

### Addition 2: [Addition Name - Category]

[Repeat same structure as Addition 1]

---

### Addition 3: [Addition Name - Category]

[Repeat same structure]

---

[Continue for ALL cultural additions with same detail level...]

---

### Additions Spatial Relationships

**Grouping Strategy**:
- Group 1: [Additions grouped together] - Location: [Area] - Purpose: [Why grouped]
- Group 2: [Additions grouped together] - Location: [Area] - Purpose: [Why grouped]

**Spacing and Rhythm**:
- Spacing pattern: [Even distribution / Clustered / Organic scatter / etc.]
- Visual rhythm: [How repetition or variation creates movement]

**Balance Contribution**:
- Left side visual weight: [Heavy / Medium / Light]
- Right side visual weight: [Heavy / Medium / Light]
- Balance assessment: [Well-balanced / Intentionally asymmetrical]

---

## 4. TEXT INTEGRATION DESIGN

### Primary Text: [e.g., "XOCHIMILCO"]

**Content**: [Exact text]

**Position**:
- Location: [Top / Bottom / Arced over element / Integrated into design]
- Specific placement: [X, Y coordinates or description]
- Alignment: [Centered / Left / Right / Justified]

**Typography**:
- Recommended font style: [Bold sans-serif / Script / Vintage serif / Hand-lettered / etc.]
- Font characteristics: [Heavy, geometric, playful, etc.]
- Font size: [Point size at final production size]
- Letter spacing: [Tight / Normal / Loose]
- **Specific font suggestions**: [e.g., "Bebas Neue, Impact, or similar bold condensed sans"]

**Text Path**:
- Path type: [Straight horizontal / Arced / Circular / Wave / Custom path]
- Curve radius: [If arced, radius measurement]
- Path description: [Detailed description of text curve]

**Text Styling**:
- Color: [Color with hex code]
- Outline: [Yes/No] - [Weight] - [Color]
- Fill: [Solid / Gradient / Pattern]
- Effects: [Shadow / 3D / Inline / etc.]

**Visual Weight**:
- Prominence: [Highly prominent / Moderate / Subtle]
- Percentage of visual attention: [Approximate %]

**Integration with Design**:
- Relationship to element: [Sits above / Integrated with / Echoes shape of / etc.]
- Relationship to additions: [Surrounded by / Framed by / Separate from / etc.]
- Border interaction: [Touches border / Floats inside / Breaks border / etc.]

**Readability**:
- Legibility at final size: [Excellent / Good / Adequate]
- Contrast with background: [High / Moderate / Low]
- Minimum readable size: [Smallest size where still legible]

---

### Secondary Text (if applicable): [e.g., "MEXICO CITY"]

[Repeat same structure as Primary Text]

---

### Text Hierarchy

**Text Importance Order**:
1. [Primary text] - Largest, most prominent
2. [Secondary text] - Supporting, smaller
3. [Tertiary text if any] - Smallest, accent

**Visual Differentiation**:
- Size contrast: [Ratio between text sizes]
- Style contrast: [How different text levels differ visually]

---

## 5. BORDER AND FRAME DESIGN

### Border Concept

**Border Style**: [Simple line / Decorative / Cultural pattern / Ornate / None]

**Border Purpose**:
- Functional: [Defines cut path / Contains design / Creates margin]
- Aesthetic: [Adds cultural layer / Frames composition / Adds visual interest]
- Narrative: [Contributes to story by...]

### Border Specifications

**Border Width**:
- Thickness: [Inches or points]
- Variation: [Consistent / Varies by side / Decorative variations]

**Border Shape**:
- Overall shape: [Rectangular / Rounded corners / Circular / Custom shape]
- Corner style: [Square / Rounded / Decorative / Ornate]
- Corner radius: [If rounded, measurement]

**Border Design Elements**:

**Top Border**:
- Design: [Description of decorative elements or pattern]
- Elements included: [List specific decorative additions]
- Cultural motifs: [Any cultural patterns incorporated]

**Right Border**:
- Design: [Description]
- Elements included: [List]

**Bottom Border**:
- Design: [Description]
- Elements included: [List]

**Left Border**:
- Design: [Description]
- Elements included: [List]

**Corner Decorations**:
- Design: [Description of corner treatments]
- Motifs: [Cultural symbols or decorative elements in corners]

### Border-Content Relationship

**Margin/Padding**:
- Content to border distance: [Measurement]
- Breathing room: [Adequate / Tight / Generous]

**Integration Points**:
- Elements touching border: [List what touches or overlaps border]
- Elements breaking border: [List what extends beyond border, if any]
- Border-element interaction: [How border and content integrate]

### Border Production Notes

**For Laser-Cut**:
- Border defines: [Cut path / Outer boundary]
- Border connection: [All interior elements connect to border via...]
- Structural role: [Border holds design together]

**For Print**:
- Border treatment: [Printed / Die-cut edge / etc.]
- Bleed handling: [Border extends to bleed / Inside safe area]

---

## 6. LAYERING AND DEPTH STRATEGY

### Background Layer (Furthest back)

**Elements in Background**:
1. [Background element 1]: [Position and size]
   - Purpose: [Set environment / Add color / Create depth]

2. [Background element 2]: [Position and size]
   - Purpose: [Purpose]

[Continue for all background elements...]

**Background Treatment**:
- Visual style: [Subtle / Prominent / Pattern / Solid color / etc.]
- Detail level: [Simplified / Moderate / Detailed]
- Color treatment: [Lighter / Muted / Specific colors]

**Background Purpose**: [How background supports overall composition]

---

### Midground Layer (Middle depth - usually where element lives)

**Elements in Midground**:
1. **[ELEMENT]**: [Position] - PRIMARY FOCUS
2. [Midground addition 1]: [Position and size]
3. [Midground addition 2]: [Position and size]

[Continue...]

**Midground Treatment**:
- Visual prominence: [Most prominent layer]
- Detail level: [Full detail]
- Color treatment: [Full saturation and contrast]

**Midground Purpose**: [Where main story happens]

---

### Foreground Layer (Closest to viewer)

**Elements in Foreground**:
1. [Foreground element 1]: [Position and size]
   - Purpose: [Add depth / Frame element / Create interest]

2. [Foreground element 2]: [Position and size]
   - Purpose: [Purpose]

[Continue for all foreground elements...]

**Foreground Treatment**:
- Visual style: [Bold / Silhouetted / Detailed / etc.]
- Detail level: [Simplified or detailed]
- Color treatment: [Often darker or higher contrast]

**Foreground Purpose**: [How foreground adds depth and frames composition]

---

### Depth Cues

**Size Progression**: [How size indicates depth]
- Background elements: [Smaller / Larger]
- Foreground elements: [Larger / Smaller]

**Overlap Strategy**: [How overlapping creates depth]
- [Element A] overlaps [Element B], indicating [A is in front]
- [List key overlap relationships]

**Color Depth Indicators**:
- Background colors: [Lighter / Muted / Cooler / etc.]
- Foreground colors: [Darker / Saturated / Warmer / etc.]

**Focus Depth**:
- Sharpest focus: [Midground/element]
- Softer focus: [Background or foreground if applicable]

---

## 7. VISUAL HIERARCHY AND FLOW

### Focal Point Strategy

**Primary Focal Point**: [Element name] at [position]
- **Visual Weight**: [Highest]
- **Attention Draw Methods**: [Size, color, contrast, position, detail]
- **Percentage of Attention**: [Approximately 50-60%]

**Secondary Focal Points**:
1. [Secondary point 1, e.g., text]: [Position]
   - Visual weight: [Medium-high]
   - Attention draw: [How it attracts eye]
   - Attention %: [~15-20%]

2. [Secondary point 2, e.g., prominent cultural addition]: [Position]
   - Visual weight: [Medium]
   - Attention draw: [How]
   - Attention %: [~10-15%]

**Tertiary Elements**: [Supporting additions, patterns, decorative elements]
- Visual weight: [Low-medium]
- Attention: [Collectively ~15-20%]

### Eye Movement Path

**Entry Point**: [Where viewer's eye first lands]
- Likely entry: [Top-left / Center / Largest element / etc.]
- Entry strategy: [What draws eye there]

**Path Through Design**:
1. Starts at: [Entry point]
2. Moves to: [Next point] via [visual connection: line, color, shape, etc.]
3. Then to: [Next point] via [connection method]
4. Settles at: [Final resting point - should be element]
5. Cycles through: [How eye continues to explore design]

**Path Visualization**:
```
    Entry (Text)
         ↓
    → ELEMENT ←
    ↙         ↘
Addition A    Addition B
    ↓         ↓
   Back to Element
```

**Path Control Methods**:
- Lines/curves: [How lines guide eye]
- Color: [How color contrast creates path]
- Size progression: [How size leads eye]
- Directional elements: [Elements pointing toward key areas]

### Visual Weight Balance

**Left Side Weight**: [Heavy / Medium / Light]
- Major elements left: [List]
- Color weight: [Dark / Light / Colorful]

**Right Side Weight**: [Heavy / Medium / Light]
- Major elements right: [List]
- Color weight: [Dark / Light / Colorful]

**Top Weight**: [Heavy / Medium / Light]

**Bottom Weight**: [Heavy / Medium / Light]

**Balance Assessment**:
- Overall balance: [Well-balanced / Intentionally asymmetric / etc.]
- Balance type: [Symmetrical / Asymmetrical / Radial]
- Stability: [Feels grounded / Dynamic tension / etc.]

**Adjustments for Balance**:
- [Any elements sized or positioned specifically for balance]

### Negative Space Distribution

**Negative Space Strategy**: [Even distribution / Clustered content / etc.]

**Key Negative Space Areas**:
1. [Area 1, e.g., "Upper corners"]: [Amount of breathing room]
   - Purpose: [Prevents crowding / Creates calm / etc.]

2. [Area 2]: [Amount]
   - Purpose: [Purpose]

**Negative Space Percentage**: [Approximately X% of design is negative space]

**Breathing Room Assessment**: [Adequate / Generous / Tight / Crowded]

**Adjustments**: [Any elements positioned to preserve negative space]

---

## 8. COLOR DISTRIBUTION PLAN

### Color Palette (from Context Strategy)

**Element Original Colors**: [List]

**Cultural Addition Colors**: [List new colors introduced]

**Complete Palette**:
- Primary colors: [3-4 colors with hex codes]
- Secondary colors: [3-4 colors with hex codes]
- Accent colors: [2-3 colors with hex codes]

### Color Placement Map

**Element Color Zones**:
- Element uses: [Colors and where on element]

**Addition Color Assignments**:
- [Addition 1]: [Color(s)]
- [Addition 2]: [Color(s)]
- [Continue for all additions...]

**Text Color**: [Color with hex code]

**Border Color**: [Color with hex code]

**Background Color** (if solid): [Color with hex code] or [Transparent/white]

### Color Distribution Strategy

**Color Balance**:
- Left side dominant colors: [Colors]
- Right side dominant colors: [Colors]
- Top dominant colors: [Colors]
- Bottom dominant colors: [Colors]
- Overall balance: [Well-distributed / Intentional concentration]

**Color Rhythm**:
- Repeating colors: [Which colors repeat and where]
- Color progression: [How colors flow through design]
- Color echoes: [How element colors echo in additions]

**Visual Weight of Colors**:
- Heaviest visual weight: [Darkest/most saturated color] at [locations]
- Lightest visual weight: [Lightest/least saturated] at [locations]
- Medium weight colors: [Colors] distributed [how]

### Color Contrast and Harmony

**Contrast Strategy**:
- High contrast areas: [Where and why - usually focal points]
- Low contrast areas: [Where and why - usually background]
- Contrast purpose: [How contrast guides attention]

**Harmony Type**: [Analogous / Complementary / Triadic / etc.]
- Harmony strategy: [How colors work together]

**Temperature**:
- Overall temperature: [Warm / Cool / Balanced]
- Warm areas: [Where and what colors]
- Cool areas: [Where and what colors]
- Temperature purpose: [How temperature contributes to mood]

---

## 9. PRODUCTION TECHNICAL BLUEPRINT

### For Laser-Cut MDF Production

**Structural Connections Map**:

**Element Connections**:
- Element connects to: [Border / Specific additions / Bridge elements]
- Connection points: [List each connection point]
- Connection method: [Direct attachment / Bridge tab / etc.]

**Addition Connections**:
- [Addition 1] connects to: [Element / Border / Other addition]
- [Addition 2] connects to: [What]
- [Continue for all additions...]

**Connection Integrity Check**:
- [ ] All elements connect to border or element
- [ ] No floating pieces
- [ ] Connections are strong enough (min 0.125" wide)
- [ ] Connections don't obstruct design visibility

**Bridge Elements** (if needed):
- [Description of any bridge/tab elements needed to connect isolated pieces]

**Cut Path Definition**:
- Outer cut: [Border defines outer cut path]
- Interior cuts: [Any through-cuts within design]
- Engraving areas: [Fine details to be engraved not cut]

**Line Weight Specifications**:
- Cut lines: [Vector stroke weight for cutting]
- Engraved lines: [Vector stroke weight for engraving]
- Minimum line weight: [2pt recommended, verified all lines meet minimum]

**Material Considerations**:
- Material thickness: [1/8" / 3mm typical]
- Design accommodations: [Any adjustments for material thickness]

---

### For Full-Color Print Production

**Print Specifications**:
- Resolution: [300 DPI minimum]
- Color mode: [CMYK]
- File format: [PDF, TIFF, or high-res PNG]

**Bleed Requirements**:
- Bleed amount: [0.125" / 3mm typical]
- Elements extending to bleed: [Which elements extend to edge]
- Bleed treatment: [How background/border handles bleed]

**Safe Area**:
- Safe area margin: [0.125" inside cut line]
- Critical elements inside safe area: [Text, important details]
- Elements in safe area: [Verified all critical content inside]

**Cut Line**:
- Cut path: [Standard rectangle / Custom die-cut shape]
- Cut line definition: [How cut is defined in file]

**Color Management**:
- RGB to CMYK conversion: [Verified / Colors adjusted for CMYK]
- Out-of-gamut colors: [Any adjustments needed]
- Color profile: [Specific CMYK profile if required]

---

### General Production Notes

**Scalability**:
- Design scales well to: [Size range]
- Optimal size: [Recommended final product size]
- Minimum size: [Smallest size where detail remains visible]
- Maximum size: [Largest size before looking sparse]

**Detail Preservation**:
- Fine details remain visible at: [Minimum size]
- Text remains legible at: [Minimum size]
- Production method best suited: [Recommendation]

**File Preparation Checklist**:
- [ ] All elements positioned according to blueprint
- [ ] Colors verified and specified
- [ ] Text converted to outlines (for vector)
- [ ] Structural connections verified (laser-cut)
- [ ] Bleed and safe areas defined (print)
- [ ] Minimum line weights met
- [ ] Resolution adequate (print)
- [ ] Layers organized and named

---

## 10. ALTERNATIVE COMPOSITION VARIATIONS (Optional)

### Variation 1: [Variation Name/Description]

**Concept**: [What's different about this variation]

**Key Differences**:
- Element placement: [How element position differs]
- Addition arrangement: [How additions differ]
- Text treatment: [How text differs]
- Border design: [How border differs]

**Advantages**:
- [Benefit 1]
- [Benefit 2]

**Disadvantages**:
- [Drawback 1]
- [Drawback 2]

**When to Use**: [Scenarios where this variation works better]

---

### Variation 2: [Variation Name/Description]

[Same structure as Variation 1]

---

### Recommended Primary Composition

**Recommendation**: [Main composition or Variation #]

**Rationale**: [Why this composition works best for this project]

---

## 11. MEASUREMENT SPECIFICATIONS

### Detailed Measurements at Final Size

**Final Product Size**: [W × H inches]

**Element Measurements**:
- Element width: [X inches]
- Element height: [Y inches]
- Element top-left corner position: [X, Y] from top-left of design
- Element center point: [X, Y] from top-left of design

**Addition Measurements**:

[For each addition, provide:]
- [Addition name] width: [X inches]
- [Addition name] height: [Y inches]
- [Addition name] position: [X, Y from top-left]

**Text Measurements**:
- [Primary text] font size: [X pt]
- [Primary text] position: [X, Y]
- [Secondary text] font size: [Y pt]
- [Secondary text] position: [X, Y]

**Border Measurements**:
- Border width: [Thickness]
- Inner content area: [W × H]
- Margin from content to border: [Distance]

**Safe Area** (for print):
- Safe area dimensions: [W × H]
- Safe area margins: [Measurement from each edge]

**Spacing Measurements**:
- Element to nearest addition: [Distance]
- Addition to addition spacing: [Typical distance]
- Text to element spacing: [Distance]

---

## 12. PRODUCTION READINESS ASSESSMENT

### Technical Viability

**Laser-Cut Viability** (if applicable):
- Rating: [Excellent / Good / Fair / Needs Adjustment]
- Structural integrity: [Strong / Adequate / Weak areas identified]
- Detail appropriateness: [All details cuttable at specified size]
- Production time estimate: [Cutting time estimate]

**Print Viability** (if applicable):
- Rating: [Excellent / Good / Fair / Needs Adjustment]
- Resolution adequacy: [Sufficient / Needs higher resolution]
- Color printability: [All colors in CMYK gamut / Adjustments needed]
- Detail visibility: [All details visible at size]

### Design Quality Assessment

**Visual Hierarchy**: [Clear / Needs improvement] - [Notes]

**Balance**: [Well-balanced / Minor adjustments needed] - [Notes]

**Storytelling Clarity**: [Story clear / Could be clearer] - [Notes]

**Cultural Authenticity**: [Authentic / Verify elements] - [Notes]

**Style Consistency**: [Consistent / Some inconsistencies] - [Notes]

**Production Feasibility**: [Ready / Needs adjustments] - [Notes]

### Recommended Refinements

**Before Production**:
1. [Refinement needed] - Priority: [High / Medium / Low]
2. [Refinement needed] - Priority: [Level]
3. [Refinement needed] - Priority: [Level]

**Optional Enhancements**:
- [Optional improvement]
- [Optional improvement]

---

## 13. NEXT STEPS

### Immediate Actions

1. **Create Visual Mockup**: Sketch or digital mockup following this blueprint

2. **Verify Cultural Elements**: Show composition to cultural-integration-specialist for verification

3. **Test at Scale**: View design at actual production size for detail/legibility check

4. **Gather Feedback**: [Get input from stakeholders, if applicable]

### Proceed to Next Agent

**Ready for**: cultural-integration-specialist.md agent

**Information to Provide**:
- This composition blueprint
- Visual mockup or sketch following blueprint
- Element analysis and context strategy reports

**Cultural Integration Specialist Will**:
- Verify cultural elements are rendered authentically
- Confirm cultural appropriateness of composition
- Suggest any cultural refinements
- Validate storytelling effectiveness

**Then**: design-finalizer.md agent

---

## SUMMARY

**Composition Strategy**: [One-sentence description of layout approach]

**Element Prominence**: [X%] of design (focal point)

**Cultural Additions**: [#] additions strategically placed for [purpose]

**Text Treatment**: [Description of text integration]

**Border Design**: [Border style and purpose]

**Production Method**: [Primary production method]

**Technical Viability**: [Ready / Needs minor adjustments / Needs refinements]

**Overall Assessment**: [This composition successfully balances element prominence, cultural integration, storytelling, and production viability]

**Ready to Proceed**: [YES / AFTER REFINEMENTS]

---

**Composition Blueprint Complete**
**Next Agent**: cultural-integration-specialist.md (for verification) → design-finalizer.md
```

## Best Practices

1. **Be Precise**: Provide exact measurements and positions, not vague descriptions
2. **Think Structurally**: For laser-cut, ensure all elements connect
3. **Preserve Hierarchy**: Element should always be primary focal point
4. **Plan Layers**: Use background/midground/foreground for depth
5. **Consider Flow**: Design eye movement path intentionally
6. **Balance Carefully**: Distribute visual weight for stability
7. **Test Readability**: Ensure text is legible at final size
8. **Document Thoroughly**: Provide enough detail for production without ambiguity

## Quality Checks

Before completing composition blueprint, verify:
- [ ] Element positioned and sized appropriately (30-50% of design)
- [ ] All 5-10 cultural additions have specific positions and sizes
- [ ] Text placement specified with font size and style recommendations
- [ ] Border design described in detail
- [ ] Layering strategy (background/mid/foreground) defined
- [ ] Visual hierarchy clear with element as primary focus
- [ ] All measurements provided at final size
- [ ] Structural connections mapped (for laser-cut)
- [ ] Safe areas and bleeds defined (for print)
- [ ] Production viability assessed
- [ ] Clear next steps provided

---

**Agent Version**: 1.0
**Last Updated**: [Date]
**Maintained By**: [Team/Person]
