# Variation Validator Agent

## Agent Type
`general-purpose`

## Purpose
Validate design variations against quality standards, production feasibility, family cohesion, and strategic goals. Provides detailed feedback and recommendations for improvement.

## ⚠️ CRITICAL: What Qualifies as a TRUE Variation

When validating, verify that the variation is a TRUE VARIATION, not just a rearrangement:

**A TRUE VARIATION means:**
✓ Core elements deconstructed and reconstructed with NEW spatial arrangements
✓ Element poses, orientations, styles CHANGED (not just moved)
✓ NEW decorative/thematic elements ADDED (3-7 minimum)
✓ Colors, relationships, hierarchy TRANSFORMED
✓ Feels like a DIFFERENT DESIGN while maintaining family DNA

**NOT a valid variation:**
✗ Just tilting or rotating the existing design
✗ Moving the whole composition slightly
✗ Minor tweaks with everything else identical
✗ Rearranging without reimagining

**Validation checkpoint**: If the variation looks like the original design with elements just moved around, REJECT it and request true deconstruction/reconstruction.

## When to Use
- After variation-generator creates new designs
- Before finalizing variations for production
- When reviewing client-submitted variations
- Quality assurance checkpoint in workflow
- Before presenting variations to stakeholders

## Agent Capabilities
- Assess design quality and professional execution
- Validate production feasibility for laser-cut MDF
- Check family cohesion and recognizability
- Verify TRANSFORMETER level accuracy
- Evaluate strategic alignment with goals
- Identify potential issues and improvements
- Provide actionable feedback

## Input Requirements

### Essential Information
1. **Original Design Description**
   - Complete description of base design
   - All metadata (colors, dimensions, elements, etc.)
   - Sacred elements that must be preserved

2. **Variation Description(s)**
   - Complete description of variation
   - Stated TRANSFORMETER level
   - Claimed transformations made
   - Production specifications

3. **Validation Context**
   - Original variation goals/objectives
   - Target audience/market
   - Intended product format
   - Brand guidelines (if any)
   - Quality standards to apply

## Prompt Template for Agent

```
DESIGN VARIATION VALIDATION REQUEST

Background Context:
This is a quality assurance review for a souvenir design variation. The goal is to assess the variation against design quality standards, production feasibility, family cohesion with the original, and strategic alignment with project goals.

═══════════════════════════════════════════════════════════════════════════

ORIGINAL DESIGN DESCRIPTION:

[Complete description of base design including:
- Subject/destination
- Style and aesthetic
- Key visual elements
- Color palette
- Typography details
- Format and dimensions
- Sacred elements that define identity]

VARIATION TO VALIDATE:

[Complete description of variation including:
- All visual elements and specifications
- Compositional approach
- Color palette
- Typography
- Element transformations from original
- New elements added
- Production specifications]

VARIATION PARAMETERS:

Stated TRANSFORMETER Level: [1-10]
Variation Type: [Color/Style/Composition/Seasonal/Format]

Variation Goals:
[What this variation was intended to achieve:
- Target audience
- Product format
- Market positioning
- Specific objectives]

═══════════════════════════════════════════════════════════════════════════

VALIDATION ASSESSMENT REQUIRED:

Evaluate the variation against these criteria and provide detailed feedback:

1. DESIGN QUALITY ASSESSMENT
   Areas to evaluate:
   • Professional execution and polish
   • Visual balance and composition
   • Color harmony and intentionality
   • Typography appropriateness
   • Element integration and cohesion
   • Overall aesthetic quality

2. TRANSFORMETER LEVEL ACCURACY
   Verification needed:
   • Does the variation match its stated TRANSFORMETER level?
   • Are the changes appropriate for that transformation intensity?
   • Is the scope of changes correct (too similar, appropriate, or too different)?
   • Level verification with reasoning

3. PRODUCTION FEASIBILITY
   Technical assessment:
   • Laser-cut MDF compatibility (vector-based, structural integrity)
   • Line weights appropriate for cutting (minimum 1pt, ideally 1.5-2pt)
   • Detail level feasible for stated dimensions
   • All elements structurally connected (no floating parts)
   • Material efficiency considerations
   • Cost reasonableness for product format

4. FAMILY COHESION
   Relationship evaluation:
   • Is variation recognizably related to original?
   • Are core identity elements preserved?
   • Are sacred elements maintained (even if reimagined)?
   • Is visual DNA present (shared design language)?
   • Is differentiation appropriate (neither too similar nor unrecognizable)?
   • Family recognizability score (percentage estimate)

5. STRATEGIC ALIGNMENT
   Goal achievement assessment:
   • Does variation meet stated objectives?
   • Is it appropriate for target audience?
   • Does it fit intended market positioning?
   • Does it serve a clear purpose in product line?
   • Is format optimization effective?
   • Will it achieve desired business outcomes?

6. TECHNICAL SPECIFICATIONS COMPLETENESS
   Documentation review:
   • Are all specifications complete and accurate?
   • Is documentation production-ready?
   • Are all necessary details included (materials, dimensions, colors, layers)?
   • Are specifications consistent with standards?

═══════════════════════════════════════════════════════════════════════════

OUTPUT FORMAT:

For each criterion above, provide:

• Rating: PASS / NEEDS IMPROVEMENT / FAIL
• Specific observations (what works well)
• Issues identified (what doesn't work)
• Recommendations for improvement (actionable steps)
• Priority level: CRITICAL / IMPORTANT / OPTIONAL

Final Assessment:
• Overall Verdict: APPROVED / APPROVED WITH CHANGES / REJECTED
• Summary of strengths
• Summary of issues to address
• Next steps recommended

PROVIDE VALIDATION REPORT
```

## Output Structure

### Validation Report Format

```markdown
# VARIATION VALIDATION REPORT

## Variation Identifier
- Name/ID: [Variation identifier]
- TRANSFORMETER Level Stated: [Level]
- Variation Type: [Color/Style/Composition/etc.]
- Validated Date: [Date]

## OVERALL VERDICT: [APPROVED / APPROVED WITH CHANGES / REJECTED]

---

## 1. DESIGN QUALITY ASSESSMENT

### Rating: [PASS / NEEDS IMPROVEMENT / FAIL]

#### Professional Execution
- Status: [✓ Pass / ⚠ Needs Improvement / ✗ Fail]
- Observations: [Specific feedback]
- Issues: [List any problems]
- Recommendations: [How to improve]

#### Visual Balance & Composition
- Status: [✓ Pass / ⚠ Needs Improvement / ✗ Fail]
- Observations: [Specific feedback]
- Issues: [List any problems]
- Recommendations: [How to improve]

#### Color Harmony
- Status: [✓ Pass / ⚠ Needs Improvement / ✗ Fail]
- Observations: [Color palette analysis]
- Issues: [Color conflicts, accessibility, etc.]
- Recommendations: [Color adjustments needed]

#### Typography
- Status: [✓ Pass / ⚠ Needs Improvement / ✗ Fail]
- Observations: [Font choices, hierarchy, legibility]
- Issues: [Any typography problems]
- Recommendations: [Improvements needed]

#### Overall Polish
- Status: [✓ Pass / ⚠ Needs Improvement / ✗ Fail]
- Observations: [Overall design finish quality]
- Issues: [Anything feeling incomplete]
- Recommendations: [Final polish needed]

---

## 2. TRANSFORMETER ACCURACY

### Rating: [ACCURATE / SLIGHTLY OFF / SIGNIFICANTLY OFF]

#### Level Verification
- Stated Level: [#]
- Actual Level Assessed: [#]
- Match: [Yes/No]

#### Transformation Scope Analysis
- Changes Made: [List major changes]
- Expected for Level: [What should change at this level]
- Alignment: [How well actual matches expected]

#### Recommendation
- [Keep level as stated / Adjust to level X / Recalibrate changes]

---

## 3. PRODUCTION FEASIBILITY

### Rating: [PRODUCTION READY / MINOR ISSUES / MAJOR CONCERNS]

#### Laser-Cut Compatibility
- Status: [✓ Pass / ⚠ Needs Improvement / ✗ Fail]
- Vector-based: [Yes/No]
- Line weights appropriate: [Yes/No/Issues]
- Issues: [Any production concerns]
- Recommendations: [Adjustments needed]

#### Structural Integrity
- Status: [✓ Pass / ⚠ Needs Improvement / ✗ Fail]
- Elements connected: [Yes/No]
- Stability: [Good/Concerns]
- Issues: [Weak points, floating elements]
- Recommendations: [Structural improvements]

#### Detail Feasibility
- Status: [✓ Pass / ⚠ Needs Improvement / ✗ Fail]
- Detail appropriate for size: [Yes/No]
- Cutting complexity: [Simple/Medium/Complex]
- Issues: [Too detailed, too simple, etc.]
- Recommendations: [Detail adjustments]

#### Material Efficiency
- Status: [✓ Pass / ⚠ Needs Improvement / ✗ Fail]
- Observations: [Nesting, waste considerations]
- Cost tier: [Budget/Mid/Premium]
- Recommendations: [Efficiency improvements]

---

## 4. FAMILY COHESION

### Rating: [STRONG COHESION / MODERATE / WEAK / DISCONNECTED]

#### Recognizability Analysis
- Family resemblance: [Strong/Moderate/Weak]
- Recognizability score: [%]
- Core subject clear: [Yes/No]

#### Sacred Elements Check
- [Element 1]: [✓ Preserved / ✗ Compromised]
- [Element 2]: [✓ Preserved / ✗ Compromised]
- [Element 3]: [✓ Preserved / ✗ Compromised]

#### Visual DNA Assessment
- Shared design language: [Strong/Moderate/Weak]
- Style consistency: [Yes/No/Partial]
- Color palette relationship: [Related/Unrelated]
- Typography family: [Consistent/Different]

#### Issues & Recommendations
- Issues: [What breaks family cohesion]
- Recommendations: [How to strengthen relationships]

---

## 5. STRATEGIC ALIGNMENT

### Rating: [FULLY ALIGNED / PARTIALLY ALIGNED / MISALIGNED]

#### Goal Achievement
- Goal 1: [State goal] → [✓ Met / ⚠ Partially / ✗ Not met]
- Goal 2: [State goal] → [✓ Met / ⚠ Partially / ✗ Not met]
- Overall: [How well variation achieves stated goals]

#### Target Audience Fit
- Status: [✓ Appropriate / ⚠ Questionable / ✗ Mismatch]
- Observations: [How well it suits target audience]
- Recommendations: [Audience-specific adjustments]

#### Market Positioning
- Status: [✓ Correct / ⚠ Unclear / ✗ Wrong]
- Positioning: [Budget/Mid/Premium]
- Fit: [How well variation fits intended position]

#### Format Optimization
- Status: [✓ Optimized / ⚠ Adequate / ✗ Poor]
- Format-specific considerations: [Met/Not met]
- Recommendations: [Format improvements]

---

## 6. TECHNICAL SPECIFICATIONS

### Rating: [COMPLETE / INCOMPLETE / INCORRECT]

#### Specification Completeness
- Dimensions: [✓ Provided / ✗ Missing]
- Materials: [✓ Provided / ✗ Missing]
- Colors (hex codes): [✓ Provided / ✗ Missing]
- Typography specs: [✓ Provided / ✗ Missing]
- Production notes: [✓ Provided / ✗ Missing]

#### Specification Accuracy
- Issues: [Any errors or inconsistencies]
- Recommendations: [Corrections needed]

---

## PRIORITY ISSUES

### Critical (Must Fix Before Approval)
1. [Issue description and fix needed]
2. [Issue description and fix needed]

### Important (Should Fix)
1. [Issue description and improvement]
2. [Issue description and improvement]

### Optional (Nice to Have)
1. [Suggestion for enhancement]
2. [Suggestion for enhancement]

---

## SUMMARY & RECOMMENDATIONS

### Strengths
- [What works well]
- [What works well]
- [What works well]

### Weaknesses
- [What needs improvement]
- [What needs improvement]
- [What needs improvement]

### Required Actions (if any)
1. [Specific action needed]
2. [Specific action needed]

### Overall Assessment
[Paragraph summarizing overall evaluation and verdict]

### Next Steps
[What should happen next with this variation]

---

**Validator**: [Agent name/version]
**Validation Date**: [Date]
**Report Version**: 1.0
```

## Validation Criteria Details

### Design Quality Standards

**Professional Execution**:
- Clean, intentional design decisions
- No accidental or sloppy elements
- Cohesive visual language
- Appropriate complexity

**Visual Balance**:
- Elements distributed appropriately
- Visual weight balanced
- Negative space used well
- Composition feels complete

**Color Harmony**:
- Colors work together
- Appropriate contrast
- Accessibility compliant
- Intentional palette

**Typography**:
- Fonts appropriate for style
- Hierarchy clear
- Legibility at intended size
- Consistent treatment

### TRANSFORMETER Level Assessment

**Level 1-2 Expectations**:
- Very minor changes only
- 90-100% similarity
- Tweaks, not transformations

**Level 3-4 Expectations**:
- Noticeable but moderate changes
- 75-90% similarity
- Clear variations, same family

**Level 5-6 Expectations**:
- Significant changes
- 55-75% similarity
- Different execution, same subject

**Level 7-9 Expectations**:
- Major transformations
- 20-55% similarity
- Radical reinterpretation

**Level 10 Expectations**:
- Complete redesign
- 10-20% similarity
- Only subject connects designs

### Production Feasibility Checks

**Laser-Cut Requirements**:
- Vector-based artwork (not raster)
- Line weights 0.5pt minimum
- No gaps in outlines
- Appropriate detail for material
- Structurally sound

**Material Considerations**:
- Works with 1/8" or 1/4" MDF
- Cuts cleanly without breaking
- Efficient material usage
- Reasonable cutting time

**Cost Implications**:
- Complexity affects price
- Material waste affects cost
- Finishing requirements
- Assembly complexity

### Family Cohesion Metrics

**Recognizability Score**:
- 90-100%: Clearly same design family
- 75-90%: Related, obviously similar
- 55-75%: Connected but distinct
- 35-55%: Same subject, different approach
- Below 35%: Weak family connection

**Sacred Elements**:
- Must be identifiable
- Cannot be eliminated (unless Level 10)
- Maintain recognizability
- Core to design identity

**Visual DNA**:
- Shared style elements
- Related color approach
- Similar complexity level
- Consistent quality

## Common Issues & Solutions

### Issue: Variation doesn't match TRANSFORMETER level
**Diagnosis**: Changes too extreme or too minor for stated level
**Solution**: Either adjust TRANSFORMETER level or modify variation to match

### Issue: Loses family cohesion
**Diagnosis**: Sacred elements compromised, too different from original
**Solution**: Strengthen connection through color, style, or key element preservation

### Issue: Production infeasible
**Diagnosis**: Too complex, structural problems, material issues
**Solution**: Simplify detail, fix connections, adjust for material constraints

### Issue: Poor design quality
**Diagnosis**: Unpolished, poor composition, color conflicts
**Solution**: Refine design, improve balance, fix color harmony

### Issue: Misses strategic goals
**Diagnosis**: Doesn't serve intended purpose or audience
**Solution**: Realign variation with stated objectives

## Integration with Workflow

**Recommended Process**:
1. variation-generator creates variation
2. variation-validator assesses quality
3. If APPROVED: Proceed to production
4. If APPROVED WITH CHANGES: Make edits, re-validate
5. If REJECTED: Return to variation-generator with feedback

## Tips for Effective Validation

1. **Be Thorough**: Check every criterion systematically
2. **Be Specific**: Identify exact issues, not vague concerns
3. **Be Constructive**: Provide solutions, not just criticisms
4. **Prioritize**: Distinguish critical vs. nice-to-have fixes
5. **Be Consistent**: Apply same standards to all variations
6. **Document**: Create clear validation reports
7. **Iterate**: Expect multiple rounds of refinement

---

**Agent Version**: 1.0
**Last Updated**: [Date]
**Maintained By**: [Team/Person]
