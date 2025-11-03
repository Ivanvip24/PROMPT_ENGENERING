# Production Feasibility Analyzer Agent

## Agent Type
`general-purpose`

## Purpose
Analyze design variations specifically for laser-cut MDF production feasibility, cost implications, structural integrity, and manufacturing efficiency. Ensures variations can actually be produced at scale with consistent quality.

## ⚠️ CRITICAL: Verify TRUE Variation Before Production Analysis

Before analyzing production feasibility, confirm the design is a TRUE VARIATION:

**A producible TRUE VARIATION should have:**
✓ Deconstructed and reconstructed composition (not just repositioned elements)
✓ New element poses/orientations requiring different cut paths
✓ Added new decorative elements (3-7) that may affect production complexity
✓ Transformed spatial relationships creating different structural connections
✓ Different design approach while maintaining laser-cut compatibility

**Production red flags for invalid variations:**
✗ Design is just the original rotated or tilted (no production value)
✗ Elements only moved around (same cut paths, no differentiation)
✗ No new elements added (missed opportunity for product line expansion)
✗ Identical composition with minor tweaks (redundant for production)

**Note**: If the variation is not a TRUE variation (just a rearrangement), note this in the production analysis and recommend returning to variation-generator for proper deconstruction/reconstruction.

## When to Use
- Before finalizing any variation for production
- When variations have complex or detailed elements
- Before cost estimation or pricing decisions
- When structural integrity is questionable
- Quality assurance for production readiness

## Agent Capabilities
- Assess laser-cut compatibility and feasibility
- Identify structural weak points or failures
- Estimate cutting complexity and time
- Analyze material efficiency and waste
- Recommend production optimizations
- Validate multi-layer designs
- Assess finishing requirements

## Input Requirements

### Essential Information
1. **Design Variation Description**
   - Complete visual description
   - All elements and their relationships
   - Line weights and detail levels
   - Dimensions and format

2. **Production Specifications**
   - Material type and thickness
   - Number of layers (if multi-layer)
   - Intended finish (paint, stain, UV print, natural)
   - Quantity expected (small batch, medium run, large production)

3. **Production Context**
   - Quality tier (budget, mid, premium)
   - Target retail price point
   - Production timeline constraints
   - Equipment capabilities

## Prompt Template for Agent

```
PRODUCTION FEASIBILITY ANALYSIS REQUEST

Background Context:
This is a manufacturing assessment for a laser-cut MDF souvenir design variation. The goal is to evaluate production feasibility, identify potential manufacturing issues, estimate costs, and ensure the design can be efficiently produced at scale with consistent quality.

═══════════════════════════════════════════════════════════════════════════

DESIGN VARIATION DESCRIPTION:

[Complete description including:
- All visual elements and their specifications
- Overall dimensions (width x height)
- Line weights and detail levels
- Layering structure (single or multi-layer)
- Text elements and sizing
- Decorative details and complexity
- Border treatment
- Element connections and structural relationships]

PRODUCTION SPECIFICATIONS:

Material: [e.g., "1/8 inch (3mm) Baltic Birch MDF" or "1/4 inch (6mm) MDF"]
Layers: [Single layer / Multi-layer with layer count and description]
Finish: [Full-color UV print / Hand painting / Stain / Natural wood / Other]
Expected Quantity: [Small batch (<100 units) / Medium run (100-1000) / Large production (>1000)]
Target Cost Tier: [Budget / Mid-range / Premium]

EQUIPMENT CONSTRAINTS:

[Specify any laser cutter limitations:
- Bed size (e.g., 24"x36")
- Power (e.g., 80W CO2 laser)
- Maximum material thickness
- Any other relevant constraints]

═══════════════════════════════════════════════════════════════════════════

ANALYSIS REQUIRED:

Evaluate the design across these production dimensions:

1. LASER-CUT COMPATIBILITY
   Assessment areas:
   • Is the design vector-compatible (or easily convertible)?
   • Are line weights appropriate for clean cutting (minimum 1pt, ideally 1.5-2pt)?
   • Is detail level feasible for the material thickness specified?
   • Are there any elements that won't cut cleanly (raster effects, gradients)?
   • Will intricate details survive the cutting process?

2. STRUCTURAL INTEGRITY
   Assessment areas:
   • Are all elements properly connected (no floating parts)?
   • Are there any weak points or breaking risks (thin connections, delicate features)?
   • Will the design hold together during and after cutting?
   • Are there elements that need additional support or bridging?
   • Will the piece be durable enough for handling and shipping?

3. CUTTING COMPLEXITY
   Assessment areas:
   • Estimated cutting time per unit
   • Complexity rating: Simple / Moderate / Complex / Very Complex
   • Problem areas requiring slow speeds or multiple passes
   • Risk of charring or burn marks on delicate sections
   • Internal cutouts vs. external perimeter complexity

4. MATERIAL EFFICIENCY
   Assessment areas:
   • Nesting efficiency estimate (how many pieces per standard sheet)
   • Material waste percentage
   • Optimal sheet layout considerations
   • Cost per unit for material usage
   • Opportunities for waste reduction

5. MULTI-LAYER CONSIDERATIONS (if applicable)
   Assessment areas:
   • Layer alignment feasibility and tolerance requirements
   • Assembly complexity (ease of stacking and gluing)
   • Adhesive and spacing requirements
   • Dimensional tolerance issues between layers
   • Registration mark needs

6. FINISHING REQUIREMENTS
   Assessment areas:
   • Finish compatibility with design complexity
   • Pre-finish vs. post-finish cutting recommendations
   • Masking or surface prep requirements
   • Special finishing challenges (tight spaces, intricate details)
   • Estimated finishing time and complexity

7. QUALITY CONTROL
   Assessment areas:
   • Consistency achievable across production run
   • Tolerance sensitivity (how precise does cutting need to be?)
   • Likely defect points (where issues will occur)
   • Rejection rate estimate
   • Quality assurance checkpoints needed

8. COST IMPLICATIONS
   Assessment areas:
   • Material cost per unit (based on efficiency)
   • Labor/cutting time cost estimate
   • Finishing cost estimate
   • Total estimated production cost per unit
   • Does cost align with target cost tier?
   • Profitability at expected retail price point

═══════════════════════════════════════════════════════════════════════════

OUTPUT FORMAT:

Provide detailed production analysis with:

PRODUCTION READINESS RATING: [READY / READY WITH MODIFICATIONS / NOT READY]

FEASIBILITY SCORE: [1-10] (where 10 = perfect production feasibility, 1 = not producible)

DETAILED ASSESSMENT:
For each of the 8 analysis areas above, provide:
• Status: Compatible / Minor Issues / Major Issues
• Specific observations and measurements
• Problems identified with severity ratings
• Recommendations for optimization
• Required modifications (if any)

CRITICAL ISSUES (if any):
• List any showstopper problems
• Required changes before production
• Redesign recommendations

OPTIMIZATION OPPORTUNITIES:
• Ways to improve production efficiency
• Cost reduction possibilities
• Quality enhancement suggestions

PRODUCTION RECOMMENDATIONS:
• Best practices for manufacturing this design
• Equipment settings recommendations
• Quality control checkpoints
• Finishing sequence

COST ESTIMATE:
• Material cost per unit: $[amount]
• Labor/cutting cost per unit: $[amount]
• Finishing cost per unit: $[amount]
• Total production cost: $[amount]
• Recommended retail price range: $[range]

PROVIDE PRODUCTION FEASIBILITY ANALYSIS
```

## Output Structure

### Production Feasibility Report Format

```markdown
# PRODUCTION FEASIBILITY ANALYSIS

## Design Identifier
- Variation Name/ID: [Name]
- Format: [Dimensions]
- Material: [Type and thickness]
- Analysis Date: [Date]

## PRODUCTION READINESS: [READY / READY WITH MODIFICATIONS / NOT READY]

## FEASIBILITY SCORE: [#/10]
*(10 = Perfect production feasibility, 1 = Not producible)*

---

## 1. LASER-CUT COMPATIBILITY

### Rating: [✓ COMPATIBLE / ⚠ MINOR ISSUES / ✗ MAJOR ISSUES]

#### Vector Compatibility
- Status: [✓ Yes / ✗ No / ⚠ Needs conversion]
- Issues: [Any raster elements or non-vector components]
- Recommendations: [How to vectorize or fix]

#### Line Weight Analysis
- Thinnest line: [measurement]
- Status: [✓ Appropriate / ⚠ Too thin / ✗ Won't cut]
- Problem areas: [Specific elements with line weight issues]
- Recommendations: [Minimum line weights needed]

#### Detail Level Assessment
- Detail density: [Low/Medium/High/Very High]
- Status: [✓ Appropriate for material / ⚠ Challenging / ✗ Too detailed]
- Problem areas: [Over-detailed sections]
- Recommendations: [Detail simplification needed]

#### Cut Path Analysis
- Total cut length: [Approximate length]
- Complexity: [Simple/Medium/Complex/Very Complex]
- Problem areas: [Tight corners, intricate sections, delicate features]
- Recommendations: [Path optimizations]

---

## 2. STRUCTURAL INTEGRITY

### Rating: [✓ STRUCTURALLY SOUND / ⚠ WEAK POINTS / ✗ STRUCTURAL FAILURE]

#### Element Connection Analysis
- Status: [✓ All connected / ⚠ Some floating / ✗ Many disconnected]
- Connected elements: [List properly connected parts]
- Floating elements: [List disconnected parts]
- Recommendations: [How to connect floating elements]

#### Weak Point Identification
**Critical Weak Points** (likely to break):
1. [Location/element] - [Why weak] - [Priority: High/Critical]
2. [Location/element] - [Why weak] - [Priority: High/Critical]

**Moderate Concerns**:
1. [Location/element] - [Why concerning] - [Priority: Medium]
2. [Location/element] - [Why concerning] - [Priority: Medium]

#### Structural Reinforcement Recommendations
1. [Specific reinforcement needed]
2. [Specific reinforcement needed]

#### Handling & Durability
- Handling risk: [Low/Medium/High]
- Fragility assessment: [Robust/Moderate/Delicate/Very Fragile]
- Recommendations: [Handling precautions or design changes]

---

## 3. CUTTING COMPLEXITY & TIME

### Complexity Rating: [SIMPLE / MEDIUM / COMPLEX / VERY COMPLEX]

#### Cutting Time Estimate
- Estimated time per unit: [minutes]
- Production speed: [units per hour]
- Batch time for 100 units: [hours]

#### Complexity Factors
- **Path length**: [Short/Medium/Long/Very Long]
- **Corner count**: [Approximate number of direction changes]
- **Detail density**: [Low/Medium/High/Very High]
- **Intricate sections**: [Count and description]

#### Speed-Limited Sections
**Areas requiring slow cutting**:
1. [Section] - [Reason] - [Speed reduction: %]
2. [Section] - [Reason] - [Speed reduction: %]

#### Multi-Pass Requirements
- Standard cuts: [Yes/No]
- Multi-pass sections: [Locations requiring multiple passes]

#### Charring/Burn Risk
- Risk level: [Low/Medium/High]
- High-risk areas: [Locations prone to burn marks]
- Mitigation: [Recommendations to reduce charring]

---

## 4. MATERIAL EFFICIENCY

### Efficiency Rating: [EXCELLENT / GOOD / MODERATE / POOR]

#### Nesting Analysis
- Shape efficiency: [Regular/Irregular]
- Nesting ease: [Easy/Moderate/Difficult]
- Estimated nesting efficiency: [%]

#### Material Waste
- Waste percentage: [%]
- Waste assessment: [✓ Acceptable / ⚠ High / ✗ Excessive]
- Waste reduction opportunities: [Recommendations]

#### Sheet Layout
- Optimal orientation: [Horizontal/Vertical/Diagonal]
- Units per standard sheet: [Count]
- Sheet utilization: [%]

#### Material Cost per Unit
- Material cost: $[amount] per unit
- Cost tier: [Budget/Mid/Premium appropriate]

---

## 5. MULTI-LAYER CONSIDERATIONS

*(Skip this section if single-layer design)*

### Rating: [✓ FEASIBLE / ⚠ CHALLENGING / ✗ PROBLEMATIC]

#### Layer Structure
- Total layers: [Count]
- Layer 1: [Description]
- Layer 2: [Description]
- Layer 3: [Description]
[Continue for all layers]

#### Alignment Feasibility
- Alignment precision required: [Low/Medium/High/Very High]
- Registration method: [How layers will align]
- Tolerance sensitivity: [Forgiving/Moderate/Tight/Very Tight]

#### Assembly Complexity
- Assembly difficulty: [Simple/Moderate/Complex/Very Complex]
- Assembly time per unit: [minutes]
- Adhesive requirements: [Type and application]
- Spacer requirements: [If needed]

#### Dimensional Concerns
- Material thickness variations: [Impact assessment]
- Warping risk: [Low/Medium/High]
- Recommendations: [How to ensure consistent assembly]

---

## 6. FINISHING REQUIREMENTS

### Rating: [STRAIGHTFORWARD / MODERATE / COMPLEX]

#### Finish Type Analysis
- Specified finish: [UV print/Paint/Stain/Natural]
- Compatibility: [✓ Compatible / ⚠ Challenging / ✗ Problematic]

#### Pre-Cut vs. Post-Cut Finishing
- Recommended approach: [Pre-cut finish / Post-cut finish]
- Rationale: [Why this approach is better]

#### Finishing Complexity
- Masking required: [Yes/No]
- Color count: [Number of colors]
- Detail level: [Simple/Moderate/Intricate]
- Hand-finishing needed: [None/Minimal/Extensive]

#### Special Finishing Challenges
1. [Challenge] - [How to address]
2. [Challenge] - [How to address]

#### Finishing Time & Cost
- Finishing time per unit: [minutes]
- Finishing cost per unit: $[amount]

---

## 7. QUALITY CONTROL

### Rating: [EASY / MODERATE / DIFFICULT]

#### Consistency Factors
- Design consistency: [Easy to replicate / Moderate / Challenging]
- Tolerance sensitivity: [Forgiving / Moderate / Tight]

#### Likely Defect Points
1. [Location/element] - [Type of defect likely] - [Frequency: Low/Med/High]
2. [Location/element] - [Type of defect likely] - [Frequency: Low/Med/High]

#### Rejection Rate Estimate
- Expected rejection rate: [%]
- Assessment: [✓ Acceptable / ⚠ High / ✗ Unacceptable]

#### QC Recommendations
1. [Specific quality check needed]
2. [Specific quality check needed]

#### Inspection Points
- Critical dimensions to check: [List]
- Visual inspection needs: [What to look for]

---

## 8. COST ANALYSIS

### Total Production Cost per Unit

| Cost Component | Amount | Notes |
|----------------|--------|-------|
| Material | $[amount] | [Material type and quantity] |
| Cutting time | $[amount] | [Minutes × rate] |
| Finishing | $[amount] | [Finish type and complexity] |
| Assembly | $[amount] | [If multi-layer] |
| QC/Overhead | $[amount] | [Estimated overhead] |
| **TOTAL** | **$[total]** | |

#### Cost Tier Assessment
- Calculated cost tier: [Budget/Mid/Premium]
- Target cost tier: [Budget/Mid/Premium]
- Alignment: [✓ Matches / ⚠ Close / ✗ Mismatched]

#### Cost Optimization Opportunities
1. [Specific way to reduce cost]
2. [Specific way to reduce cost]

#### Retail Price Implications
- Recommended wholesale: $[amount]
- Recommended retail: $[amount]
- Market competitiveness: [Good/Moderate/Poor]

---

## 9. PRODUCTION SCALING

### Small Batch (<100 units)
- Feasibility: [✓ Good / ⚠ Acceptable / ✗ Problematic]
- Special considerations: [Setup time, testing, etc.]

### Medium Run (100-1000 units)
- Feasibility: [✓ Good / ⚠ Acceptable / ✗ Problematic]
- Efficiency: [Improves/Stays same/Degrades]

### Large Production (>1000 units)
- Feasibility: [✓ Good / ⚠ Acceptable / ✗ Problematic]
- Considerations: [Tooling, consistency, automation opportunities]

---

## CRITICAL ISSUES

### Blocking Issues (Must Fix)
1. [Issue that prevents production]
2. [Issue that prevents production]

### Significant Concerns (Should Fix)
1. [Issue that impacts quality or cost significantly]
2. [Issue that impacts quality or cost significantly]

### Minor Optimizations (Nice to Have)
1. [Small improvement opportunity]
2. [Small improvement opportunity]

---

## RECOMMENDATIONS

### Design Modifications Required
1. [Specific design change needed] - [Priority: Critical/High/Medium]
2. [Specific design change needed] - [Priority: Critical/High/Medium]

### Production Process Recommendations
1. [Process optimization or special handling]
2. [Process optimization or special handling]

### Equipment/Tooling Needs
- [Any special equipment or jigs needed]

### Testing Recommendations
- Prototype testing needed: [Yes/No]
- Test areas: [What to test before full production]

---

## PRODUCTION READINESS SUMMARY

### Strengths
- [What works well for production]
- [What works well for production]

### Weaknesses
- [Production challenges]
- [Production challenges]

### Overall Assessment
[Paragraph summarizing production feasibility and key considerations]

### Approval Status
- [ ] Approved for production as-is
- [ ] Approved with minor modifications
- [ ] Requires significant changes before production
- [ ] Not feasible for production, redesign needed

### Next Steps
1. [Immediate action required]
2. [Follow-up action]
3. [Final preparation before production]

---

**Analyzed By**: [Agent name/version]
**Analysis Date**: [Date]
**Report Version**: 1.0
```

## Production Feasibility Standards

### Line Weight Minimums
- **1/8" MDF**: 0.5pt minimum, 1pt recommended
- **1/4" MDF**: 0.75pt minimum, 1.5pt recommended
- **Fine details**: 1-2pt for consistent cutting

### Detail Density Limits
- **Maximum detail**: Features should be ≥ 2x material thickness
- **Minimum spacing**: 1.5x material thickness between cuts
- **Small holes**: Minimum 3mm diameter for clean cutting

### Structural Requirements
- All elements must connect to main structure
- Minimum connection width: 3mm
- Aspect ratios: Avoid >10:1 (long thin elements)
- Support bridges for delicate sections

### Material Efficiency Targets
- **Excellent**: >85% material utilization
- **Good**: 70-85% utilization
- **Acceptable**: 60-70% utilization
- **Poor**: <60% utilization (redesign recommended)

## Common Production Issues

### Issue: Too Much Detail
**Symptom**: Intricate patterns won't cut cleanly
**Solution**: Simplify detail, increase line weights, reduce density

### Issue: Floating Elements
**Symptom**: Parts not connected to main structure
**Solution**: Add connection bridges, redesign to integrate

### Issue: Structural Weakness
**Symptom**: Thin connections likely to break
**Solution**: Reinforce weak points, add support structures

### Issue: Excessive Waste
**Symptom**: Poor nesting efficiency, high material cost
**Solution**: Optimize shape, adjust dimensions, better nesting

### Issue: Multi-Layer Misalignment
**Symptom**: Layers won't align consistently
**Solution**: Add registration holes, loosen tolerances, simplify assembly

## Integration with Workflow

**Recommended Process**:
1. variation-generator creates design
2. **production-feasibility-analyzer checks manufacturability**
3. If issues found: return to generator with feedback
4. variation-validator checks quality
5. family-coherence-checker validates family
6. Final production approval

---

**Agent Version**: 1.0
**Last Updated**: [Date]
**Maintained By**: [Team/Person]
