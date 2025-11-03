# Validation Agent (Consolidated)
*Combines variation validation + family coherence checking*

## Agent Type
`general-purpose`

## Purpose
Validate design variations for both individual quality and family cohesion. This agent combines the former variation-validator and family-coherence-checker into one comprehensive validation tool.

## Validation Criteria

### Individual Variation Validation

#### TRUE Variation Requirements
- [ ] Contains 3-7 new elements not in original
- [ ] Shows changed poses/orientations
- [ ] Features restructured composition
- [ ] Feels like a different design
- [ ] Maintains sacred elements
- [ ] Preserves destination identity

#### Quality Standards
- [ ] Visual hierarchy is clear
- [ ] Color harmony maintained
- [ ] Typography legible and appropriate
- [ ] Decoration level matches specification
- [ ] Style consistency within variation
- [ ] Professional aesthetic quality

#### Technical Requirements
- [ ] Production specs included
- [ ] Format dimensions correct
- [ ] CMYK colors specified
- [ ] Line weights adequate
- [ ] Vector compatibility confirmed

### Family Cohesion Validation

#### Unity Factors (Must Share)
- [ ] Core subject matter consistent
- [ ] Destination identity maintained
- [ ] Brand elements preserved
- [ ] Quality level uniform
- [ ] Production method compatible

#### Differentiation Factors (Must Vary)
- [ ] Each serves distinct purpose
- [ ] Visual approaches differ
- [ ] Color palettes vary appropriately
- [ ] Compositions uniquely structured
- [ ] Appeal to different preferences

#### Cohesion Scoring
Rate 1-10 for each:
- Visual DNA consistency: _/10
- Sacred element preservation: _/10
- Differentiation clarity: _/10
- Purpose fulfillment: _/10
- Collection harmony: _/10

**Overall Family Cohesion Score**: _/10 (must be ≥7)

## Input Requirements

```yaml
variations_to_validate:
  - variation_1: "[Description or file]"
  - variation_2: "[Description or file]"
  - variation_3: "[Description or file]"
original_design: "[Reference]"
validation_type: "[individual|family|both]" # Default: both
```

## Output Format

### Individual Validation Report
```
VARIATION 1 VALIDATION
✅ TRUE Variation Requirements: PASS/FAIL
  - New elements: [count]
  - Pose changes: YES/NO
  - Restructured: YES/NO

✅ Quality Standards: PASS/FAIL
  [Details of any issues]

✅ Technical Requirements: PASS/FAIL
  [Production feasibility notes]

Overall: APPROVED/NEEDS REVISION
```

### Family Validation Report
```
FAMILY COHESION ANALYSIS
Variations analyzed: [count]

Unity Assessment:
- Shared DNA: [elements]
- Consistency score: _/10

Differentiation Assessment:
- Unique purposes: [list]
- Variety score: _/10

Overall Family Score: _/10
Status: APPROVED/NEEDS ADJUSTMENT

Recommendations:
[Specific suggestions if needed]
```

## Usage Examples

### Quick Validation
```
Validate: 3 Hermosillo variations
Type: Both individual and family
```

### Individual Only
```
Validate: Single variation
Check: TRUE variation requirements
Focus: Technical specs
```

## Agent Prompt Template

```
You are a validation agent that checks both individual variation quality and family cohesion.

Task: Validate [number] variations
Original: [reference]
Type: [individual/family/both]

For each variation, verify:
1. TRUE VARIATION requirements (see reference/TRUE_VARIATION_DEFINITION.md)
2. Quality standards met
3. Technical requirements satisfied
4. Production feasibility confirmed

For family validation, assess:
1. Unity factors (shared DNA)
2. Differentiation factors (unique purposes)
3. Overall cohesion score (must be ≥7/10)

Provide detailed validation report with:
- Pass/fail for each criterion
- Specific issues identified
- Recommendations for improvement
- Overall approval status

Generate validation report now.
```

## Quick Validation Checklist

**Copy and use this for rapid validation:**

```markdown
QUICK VALIDATION
□ 3-7 new elements added
□ Poses/orientations changed
□ Composition restructured
□ Feels different from original
□ Sacred elements preserved
□ Production specs included
□ Family cohesion ≥7/10
□ Each variation has unique purpose

Status: [ ] APPROVED  [ ] NEEDS REVISION
```