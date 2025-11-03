# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Overview

This repository contains a comprehensive prompt engineering library focused on AI-generated souvenir design workflows. The core content consists of five scenario-based prompt templates designed to guide generative AI in creating location-specific souvenir designs (t-shirts, mugs, postcards, etc.).

## Repository Structure

### Scenario Files (Prompt Templates)

The repository contains 5 markdown files, each documenting a specific prompt engineering scenario for souvenir design:

1. **scenario_1_from_scratch.md** - Creating complete designs from just a destination name
2. **scenario_2_reference_concept.md** - Adapting existing design aesthetics to new locations
3. **scenario_3_fixed_element.md** - Building designs around unchangeable elements (mascots, logos)
4. **scenario_4_replace_elements.md** - Precise surgical edits to existing designs
5. **scenario_5_variations.md** - Generating design variations from existing work

### File Structure Pattern

Each scenario file follows a consistent structure:
- **Purpose** section explaining the use case
- **Prompt Template** with placeholders for customization
- **Example Usage** with 2-4 concrete examples
- **Variables to Customize** listing all template parameters
- **Tips for Best Results** with practical guidance
- **Common Adjustments** for refining outputs

## Working with Scenario Files

### When Reading
- Each file is self-contained and can be understood independently
- Look for the prompt template sections (enclosed in triple backticks)
- Variables are marked with [BRACKETS] for easy identification

### When Editing
- Maintain the consistent section structure across all files
- Keep prompt templates in code blocks for clarity
- Ensure examples demonstrate real-world applications
- Update "Variables to Customize" section if adding new template parameters

### Cross-File Patterns
- All scenarios share common design requirements (style, format, color scheme, composition)
- Scenarios 2-5 build on Scenario 1's foundational concepts
- Typography, color palette, and composition guidelines are consistent across scenarios

## Content Architecture

### Scenario Relationships

```
Scenario 1 (From Scratch)
    └─> Scenario 2 (Reference Concept) - Uses Scenario 1 output as reference
    └─> Scenario 3 (Fixed Element) - Builds around existing elements
    └─> Scenario 4 (Replace Elements) - Edits Scenario 1-3 outputs
    └─> Scenario 5 (Variations) - Creates multiple versions of any scenario output
```

### Key Concepts Across Files

- **Style Consistency**: All scenarios emphasize matching artistic style
- **Local Research**: Each requires identifying 3-5 iconic destination elements
- **Technical Specs**: Print-ready, scalable, high-contrast requirements
- **Iteration Guidance**: Common adjustments sections for refinement

## Common Development Tasks

### Adding a New Scenario
1. Create new file following naming pattern: `scenario_N_description.md`
2. Include all standard sections (Purpose, Prompt Template, Examples, Variables, Tips, Adjustments)
3. Add 2-4 concrete examples demonstrating the scenario
4. Cross-reference related scenarios where applicable

### Updating Prompt Templates
- Template changes should maintain backward compatibility where possible
- Update all example usage sections to reflect template changes
- Keep variable placeholder format consistent: `[VARIABLE_NAME]`

### Expanding Examples
- Provide diverse destination types (cities, regions, landmarks, themes)
- Include different product formats (t-shirt, mug, postcard, tote bag, etc.)
- Show various style approaches (vintage, modern, minimalist, illustrative, etc.)

## Documentation Standards

- Use consistent markdown heading hierarchy
- Maintain the triple backtick format for all prompt templates
- Keep variable names in UPPERCASE within brackets
- Use descriptive section headers for easy navigation
- Include concrete examples rather than abstract descriptions
