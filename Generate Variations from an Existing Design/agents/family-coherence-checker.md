# Family Coherence Checker Agent

## Agent Type
`general-purpose`

## Purpose
Analyze multiple design variations as a family to ensure they work together cohesively, maintain appropriate relationships, and create a unified product line while offering meaningful differentiation.

## ⚠️ CRITICAL: TRUE Variations vs. Simple Rearrangements

When checking family coherence, verify that each variation is a TRUE VARIATION:

**Each variation should demonstrate:**
✓ Deconstruction and reconstruction (not just repositioning)
✓ Changed element poses/orientations (not just moved)
✓ Added new thematic elements (3-7 per variation)
✓ Transformed spatial relationships and hierarchy
✓ Different design feeling while maintaining family DNA

**Red flags indicating invalid variations:**
✗ Variations that are just the original tilted or rotated
✗ Variations where elements are simply moved around
✗ Variations with no new creative elements added
✗ Variations that look identical except for minor position changes

**Family coherence includes**: Checking that all variations are TRUE variations with meaningful differentiation, not just minor rearrangements of the same composition.

## When to Use
- After creating 3+ variations from same original
- Before finalizing a product line
- When reviewing a complete variation series
- Quality check for family-based collections
- Ensuring brand consistency across variations

## Agent Capabilities
- Assess family-wide cohesion and unity
- Identify relationship patterns between variations
- Verify appropriate differentiation levels
- Check for redundant or too-similar variations
- Evaluate visual DNA consistency
- Recommend family structure improvements
- Validate TRANSFORMETER level distribution

## Input Requirements

### Essential Information
1. **Original Design Description**
   - Complete base design details
   - Sacred elements defined
   - Core brand/identity elements

2. **All Variations in Family**
   - Complete description of each variation
   - TRANSFORMETER level for each
   - Purpose/goal of each variation
   - Target format/audience for each

3. **Family Strategy**
   - Overall product line goals
   - Target market segments
   - Intended variation count
   - Brand guidelines

## Prompt Template for Agent

```
DESIGN FAMILY COHERENCE ANALYSIS REQUEST

Background Context:
This is an assessment of multiple design variations as a product family. The goal is to evaluate how well the variations work together as a unified collection while maintaining appropriate differentiation, and to ensure the family achieves its strategic objectives.

═══════════════════════════════════════════════════════════════════════════

ORIGINAL DESIGN DESCRIPTION:

[Complete description of base design including:
- Subject/destination
- Style and aesthetic
- Key visual elements
- Color palette
- Sacred elements
- Core brand/identity elements]

VARIATION FAMILY MEMBERS:

[For each variation in the family, provide:

Variation 1: [Name/ID]
- TRANSFORMETER Level: [1-10]
- Complete description: [Full visual description]
- Intended purpose: [Why this variation exists]
- Target audience/format: [Who it's for, what product]

Variation 2: [Name/ID]
- TRANSFORMETER Level: [1-10]
- Complete description: [Full visual description]
- Intended purpose: [Why this variation exists]
- Target audience/format: [Who it's for, what product]

[Continue for all variations...]]

FAMILY STRATEGY:

Product line goals: [What this family aims to achieve]
Market positioning: [How family is positioned in market]
Variation rationale: [Why these specific variations were created]
Brand considerations: [Any brand guidelines or requirements]
Target variation count: [Desired number of variations in family]

═══════════════════════════════════════════════════════════════════════════

ANALYSIS REQUIRED:

Evaluate the variation family across these dimensions:

1. FAMILY UNITY ASSESSMENT
   Questions to address:
   • Do all variations feel related to each other and the original?
   • Is visual DNA consistent across the family?
   • Are sacred elements preserved across all family members?
   • Does the family have a coherent, recognizable identity?
   • What specific elements create family unity?

2. DIFFERENTIATION BALANCE
   Questions to address:
   • Are variations sufficiently different from each other?
   • Are any variations too similar or redundant?
   • Is differentiation meaningful and purposeful?
   • Does each variation serve a distinct purpose?
   • Is there a clear reason for each variation to exist?

3. TRANSFORMETER LEVEL DISTRIBUTION
   Questions to address:
   • Are TRANSFORMETER levels appropriately distributed?
   • Is the range too narrow (all clustered) or too wide (scattered)?
   • Do the stated levels match the actual variation purposes?
   • Is there logical progression across the family?
   • Are levels appropriate for the variation types?

4. VISUAL DNA CONSISTENCY
   Questions to address:
   • What specific shared elements connect the family?
   • Are style, color, and composition patterns consistent?
   • Does the family have a recognizable signature?
   • Are quality standards consistent across all variations?
   • What makes this family instantly recognizable?

5. STRATEGIC COHERENCE
   Questions to address:
   • Does the family achieve its stated goals?
   • Do variations complement or compete with each other?
   • Is the family well-positioned for its target market?
   • Are there gaps in market coverage?
   • Are there redundancies that should be eliminated?
   • Does the family size feel appropriate (too few, just right, too many)?

6. PRODUCTION CONSISTENCY
   Questions to address:
   • Are all variations feasible with the same production method?
   • Is quality consistent across the family?
   • Are cost tiers logical and well-distributed?
   • Do variations work together as a product line?
   • Are there production conflicts or issues?

═══════════════════════════════════════════════════════════════════════════

OUTPUT FORMAT:

Provide comprehensive family analysis with:

SCORING:
• Cohesion Score: [1-10] (where 10 = perfect family unity)
• Differentiation Score: [1-10] (where 10 = optimally differentiated)
• Strategic Fit Score: [1-10] (where 10 = perfectly aligned with goals)

OVERALL FAMILY HEALTH: [Excellent / Good / Needs Work / Poor]

DETAILED ANALYSIS:
For each of the 6 dimensions above, provide:
• Assessment of current state
• Specific observations (what works well)
• Issues identified (what needs improvement)
• Recommendations (actionable suggestions)

FAMILY RELATIONSHIP MAP:
• How variations relate to each other
• Groupings or clusters within family
• Gaps in coverage
• Redundancies or overlaps

RECOMMENDATIONS:
• Should any variations be removed?
• Should any new variations be added?
• Should any variations be modified?
• What would improve overall family coherence?
• What would improve market effectiveness?

PROVIDE FAMILY COHERENCE ANALYSIS
```

## Output Structure

### Family Coherence Report Format

```markdown
# FAMILY COHERENCE ANALYSIS REPORT

## Family Overview
- Original Design: [Name/ID]
- Number of Variations: [Count]
- TRANSFORMETER Range: [Min] - [Max]
- Family Purpose: [Strategic goal]
- Analysis Date: [Date]

## OVERALL FAMILY HEALTH: [EXCELLENT / GOOD / NEEDS WORK / POOR]

### Quick Scores
- **Cohesion Score**: [#/10]
- **Differentiation Score**: [#/10]
- **Strategic Fit Score**: [#/10]
- **Overall Family Score**: [#/10]

---

## 1. FAMILY UNITY ASSESSMENT

### Score: [#/10]

#### Visual DNA Analysis
**Shared Elements Across Family**:
- Color approach: [Consistent/Variable/Random]
- Style treatment: [Unified/Similar/Divergent]
- Typography: [Consistent family/Related/Unrelated]
- Composition patterns: [Similar/Varied appropriately/Chaotic]
- Detail level: [Consistent/Appropriate variation/Inconsistent]

**Sacred Elements Preservation**:
- [Element 1]: [Preserved in all/Most/Some/Missing]
- [Element 2]: [Preserved in all/Most/Some/Missing]
- [Element 3]: [Preserved in all/Most/Some/Missing]

**Family Signature**:
[What makes this family recognizable? What's the unifying "DNA"?]

#### Unity Strengths
- [What strongly connects the family]
- [What strongly connects the family]

#### Unity Weaknesses
- [What breaks family cohesion]
- [What breaks family cohesion]

#### Recommendations
1. [How to strengthen family unity]
2. [How to strengthen family unity]

---

## 2. DIFFERENTIATION ANALYSIS

### Score: [#/10]

#### Variation Comparison Matrix

| Variation | TRANS Level | Primary Difference | Distinct from Others? | Purpose |
|-----------|-------------|-------------------|----------------------|---------|
| Var 1     | [#]         | [Main change]     | [Yes/Somewhat/No]    | [Goal]  |
| Var 2     | [#]         | [Main change]     | [Yes/Somewhat/No]    | [Goal]  |
| Var 3     | [#]         | [Main change]     | [Yes/Somewhat/No]    | [Goal]  |

#### Similarity Warnings
**Potentially Too Similar**:
- [Variation A] vs [Variation B]: [Why too similar, recommendation]
- [Variation C] vs [Variation D]: [Why too similar, recommendation]

**Potentially Redundant**:
- [Variation name]: [Why it may be unnecessary]

#### Differentiation Gaps
**Missing Opportunities**:
- [Type of variation that would fill gap]
- [Market segment not addressed]
- [Format or style not explored]

#### Differentiation Balance
[Overall assessment of whether variations are sufficiently different while maintaining cohesion]

#### Recommendations
1. [How to optimize differentiation]
2. [Variations to consolidate or remove]
3. [Gaps to fill with new variations]

---

## 3. TRANSFORMETER DISTRIBUTION

### Score: [#/10]

#### Level Distribution
- Level 1-2: [Count] variations
- Level 3-4: [Count] variations
- Level 5-6: [Count] variations
- Level 7-9: [Count] variations
- Level 10: [Count] variations

#### Distribution Analysis
**Range**: [Min] to [Max] = [Total spread]
**Average Level**: [#]
**Distribution Pattern**: [Clustered/Even/Scattered]

**Assessment**:
[Is distribution appropriate? Too narrow? Too wide? Well-balanced?]

#### Level Appropriateness Check
- [Variation 1]: States Level [#], Actually Level [#] → [Match/Mismatch]
- [Variation 2]: States Level [#], Actually Level [#] → [Match/Mismatch]
- [Variation 3]: States Level [#], Actually Level [#] → [Match/Mismatch]

#### Recommendations
1. [Optimal TRANSFORMETER distribution for this family]
2. [Any level adjustments needed]
3. [Whether to add variations at different levels]

---

## 4. VISUAL DNA CONSISTENCY

### Color Palette Relationships
**Pattern**: [Related palettes/Completely different/No pattern]

**Analysis**:
- Original: [Color approach]
- Var 1: [How colors relate to original]
- Var 2: [How colors relate to original]
- Var 3: [How colors relate to original]

**Assessment**: [Do color choices feel like family or random?]

### Style Consistency
**Pattern**: [Consistent style/Style variations/Style chaos]

**Analysis**:
[How style is maintained or varied across family]

**Assessment**: [Is style treatment appropriate for family?]

### Typography Consistency
**Pattern**: [Same font family/Related fonts/Unrelated fonts]

**Analysis**:
[How typography creates or breaks family unity]

**Assessment**: [Typography strengthens or weakens family?]

### Composition Patterns
**Pattern**: [Similar layouts/Varied but related/No relationship]

**Analysis**:
[How composition is handled across family]

**Assessment**: [Composition helps or hurts family cohesion?]

### Quality Consistency
**Assessment**: [All high quality/Mixed quality/Inconsistent]

**Issues**: [Any quality disparities between family members]

---

## 5. STRATEGIC COHERENCE

### Score: [#/10]

#### Goal Alignment Assessment
**Stated Goals**: [List family goals]

**Achievement Analysis**:
- Goal 1: [✓ Met / ⚠ Partially / ✗ Not met] → [Evidence]
- Goal 2: [✓ Met / ⚠ Partially / ✗ Not met] → [Evidence]
- Goal 3: [✓ Met / ⚠ Partially / ✗ Not met] → [Evidence]

#### Market Coverage
**Target Segments**: [List intended segments]

**Coverage Analysis**:
- Segment 1: [Addressed by Variation X] → [Effective/Weak]
- Segment 2: [Addressed by Variation Y] → [Effective/Weak]
- Segment 3: [Not addressed/Addressed by Z] → [Gap/Effective]

**Gaps**: [Market segments not covered]
**Overlaps**: [Segments over-served with redundant variations]

#### Product Line Logic
**Assessment**: [Does this family make sense as product line?]

**Strengths**:
- [What works well strategically]

**Weaknesses**:
- [Strategic gaps or misalignments]

#### Recommendations
1. [How to improve strategic alignment]
2. [Variations to add/remove for better coverage]
3. [Strategic positioning adjustments]

---

## 6. PRODUCTION & PRACTICAL CONSIDERATIONS

### Production Consistency
**Method**: [All laser-cut MDF / Mixed / Issues]
**Quality Tier**: [All same tier / Appropriate variation / Inconsistent]
**Complexity Range**: [Simple to Complex spread / Narrow / Issues]

**Assessment**: [Can all be produced with same method and quality?]

### Cost & Pricing Implications
**Cost Tiers**:
- Budget tier: [Variations]
- Mid tier: [Variations]
- Premium tier: [Variations]

**Assessment**: [Logical price differentiation?]

### Inventory & SKU Management
**Variation Count**: [#] = [Too many / Appropriate / Too few]
**Management Complexity**: [Simple / Moderate / Complex]

**Recommendations**: [Optimal family size for manageable inventory]

---

## FAMILY RELATIONSHIP MAP

### Visual Representation
```
ORIGINAL DESIGN
        |
        ├─── Variation 1 (Level [#]) - [Primary difference]
        |
        ├─── Variation 2 (Level [#]) - [Primary difference]
        |
        ├─── Variation 3 (Level [#]) - [Primary difference]
        |
        └─── Variation 4 (Level [#]) - [Primary difference]

Closest Relationship: [Var X ↔ Var Y]
Most Differentiated: [Var X ↔ Var Y]
```

### Family Subgroups
[If variations cluster into subgroups, identify them]

**Subgroup 1**: [Variations] - [Common characteristic]
**Subgroup 2**: [Variations] - [Common characteristic]

---

## RECOMMENDATIONS SUMMARY

### Critical Actions (Must Address)
1. [High priority recommendation]
2. [High priority recommendation]

### Important Improvements (Should Address)
1. [Medium priority recommendation]
2. [Medium priority recommendation]

### Optional Enhancements (Nice to Have)
1. [Low priority suggestion]
2. [Low priority suggestion]

### Family Optimization Plan

**Variations to Keep As-Is**:
- [Variation name]: [Why it works well]

**Variations to Modify**:
- [Variation name]: [What to change and why]

**Variations to Consider Removing**:
- [Variation name]: [Why it may be redundant]

**Variations to Add**:
- [Description of missing variation]: [Why it's needed]

---

## OVERALL FAMILY ASSESSMENT

### Strengths
[What this family does really well]

### Weaknesses
[Where this family falls short]

### Family Viability
[Can this family succeed as a product line? Why or why not?]

### Next Steps
1. [Immediate action]
2. [Next action]
3. [Follow-up action]

---

**Analyzed By**: [Agent name/version]
**Analysis Date**: [Date]
**Report Version**: 1.0
```

## Family Health Scoring Rubric

### Cohesion Score (1-10)
- **9-10**: Perfect family unity, all variations clearly related
- **7-8**: Strong cohesion, obvious family relationships
- **5-6**: Moderate cohesion, some disconnection
- **3-4**: Weak cohesion, family relationship unclear
- **1-2**: No cohesion, variations feel unrelated

### Differentiation Score (1-10)
- **9-10**: Optimal differentiation, each serves unique purpose
- **7-8**: Good differentiation, mostly distinct variations
- **5-6**: Moderate differentiation, some redundancy
- **3-4**: Poor differentiation, many similar variations
- **1-2**: No meaningful differentiation, mostly duplicates

### Strategic Fit Score (1-10)
- **9-10**: Perfectly aligned with all strategic goals
- **7-8**: Strong strategic alignment
- **5-6**: Moderate alignment, some gaps
- **3-4**: Poor alignment, misses goals
- **1-2**: Completely misaligned with strategy

## Common Family Issues

### Issue: "Variation Drift"
**Symptoms**: Each variation drifts further from original, losing connection
**Solution**: Strengthen shared visual DNA, enforce sacred elements

### Issue: "Clone Army"
**Symptoms**: All variations too similar, no meaningful differentiation
**Solution**: Increase TRANSFORMETER levels, vary different aspects

### Issue: "Identity Crisis"
**Symptoms**: Variations don't feel related, no family cohesion
**Solution**: Establish and maintain consistent visual DNA elements

### Issue: "Strategic Confusion"
**Symptoms**: Family doesn't serve clear purpose, redundant coverage
**Solution**: Define clear strategy, remove redundant variations

### Issue: "Quality Inconsistency"
**Symptoms**: Some variations polished, others rough
**Solution**: Apply consistent quality standards across all variations

## Integration with Workflow

**Recommended Process**:
1. Create 3+ variations with variation-generator
2. Validate each with variation-validator
3. **Analyze family with family-coherence-checker**
4. Implement family-level recommendations
5. Re-validate family after adjustments
6. Finalize family for production

## Tips for Family Coherence

1. **Plan the Family**: Define family strategy before creating all variations
2. **Maintain DNA**: Establish visual DNA elements that appear in all variations
3. **Vary Intentionally**: Each variation should serve distinct purpose
4. **Check Regularly**: Analyze family cohesion as you add variations
5. **Stay Focused**: Don't exceed 7-8 variations without strong rationale
6. **Document Relationships**: Map how variations relate to each other
7. **Think Like Product Line**: Consider retail display, marketing, inventory

---

**Agent Version**: 1.0
**Last Updated**: [Date]
**Maintained By**: [Team/Person]
