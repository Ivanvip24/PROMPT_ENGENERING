# EXACT DOCUMENTATION MAP - What Claude Code Reads

## How Claude Code Works

When you select a project and click "Generate", the app:
1. Opens a terminal in that project's folder
2. Runs `claude` command with your instruction
3. Claude Code **automatically reads** CLAUDE.md (if it exists) + all other .md files in that folder
4. Generates response based on those instructions

---

## PROJECT 1: 🎨 Generate Variations from an Existing Design

### Working Directory:
```
/Users/ivanvalenciaperez/Desktop/CLAUDE/PROMPT_ENGENERING/Generate Variations from an Existing Design
```

### ✅ HAS CLAUDE.md: YES (17,710 bytes)
Claude Code WILL read this automatically and know what to do!

### Key Documentation Files Found:
```
✓ CLAUDE.md                         (Main instructions for Claude Code)
✓ AI_INSTRUCTIONS.md               (System prompts and commands)
✓ CHEAT_SHEET.md                   (Quick reference)
✓ START_HERE.md                    (Getting started)
✓ QUICK_COMMANDS.md                (Quick command reference)
✓ VARIATION_PROMPT_FORMULA.md      (In reference/ folder)
✓ TRUE_VARIATION_DEFINITION.md     (In reference/ folder)
✓ SPATIAL_RECONSTRUCTION_PATTERNS.md
✓ ACTION_TRANSFORMATION_LIBRARY.md
✓ mexican_regional_elements_library.md
✓ sonoran_elements_detailed.md
```

### What Claude Code Knows:
- ✅ TRUE VARIATION requirements (3-7 new elements, poses changed, restructured composition)
- ✅ 150-300 word formula for 80-90% success rate
- ✅ Transformeter scale (1-10 levels)
- ✅ Decoration levels
- ✅ Production constraints (laser-cut MDF, 1pt line weights)
- ✅ Spatial reconstruction patterns
- ✅ Regional element libraries

---

## PROJECT 2: ✨ Design from Scratch

### Working Directory:
```
/Users/ivanvalenciaperez/Desktop/CLAUDE/PROMPT_ENGENERING/Design from Scratch
```

### ✅ HAS CLAUDE.md: YES (4,098 bytes)
Claude Code WILL read this automatically!

### Key Documentation Files Found:
```
✓ CLAUDE.md                        (Main instructions)
✓ scenario_1_from_scratch.md       (Creating designs from scratch)
✓ scenario_2_reference_concept.md  (Using reference concepts)
✓ scenario_3_fixed_element.md      (Designs with fixed elements)
✓ scenario_4_replace_elements.md   (Replacing design elements)
✓ scenario_5_variations.md         (Creating variations)
✓ souvenir_design_context.md       (Context about souvenir designs)
✓ common_design_elements.md        (Standard design elements)
✓ design_style_guidelines.md       (Style guidelines)
✓ design_styles_reference.md       (30KB of style references!)
✓ pueblos_magicos_list.md          (List of destinations)
```

### What Claude Code Knows:
- ✅ Souvenir design context and goals
- ✅ 5 different scenario workflows
- ✅ Common design elements
- ✅ Style guidelines and references
- ✅ Pueblos Mágicos destinations
- ✅ Production requirements

---

## PROJECT 3: 🔄 Design Based on a Previous Element

### Working Directory:
```
/Users/ivanvalenciaperez/Desktop/CLAUDE/PROMPT_ENGENERING/Design Based on a Previous Element
```

### ❌ HAS CLAUDE.md: NO
**PROBLEM: Claude Code won't know what to do automatically!**

### Key Documentation Files Found:
```
✗ CLAUDE.md                        (MISSING!)
✓ PROMPT_TEMPLATE.md               (15KB - but Claude won't know to use it)
✓ COMPOSITION_FRAMEWORKS.md        (18KB - composition patterns)
✓ STYLE_DESCRIPTORS.md             (17KB - style descriptions)
✓ DESIGN_EXAMPLES.md               (23KB - examples)
✓ QUICKSTART.md                    (Quick start guide)
✓ SPEED_OPTIMIZED_WORKFLOW.md      (Workflow guide)
✓ USER_INPUT_TEMPLATE.md           (User input templates)
✓ GOAL3/README.md                  (Subfolder documentation)
✓ GOAL3/agents/*                   (Agent definitions)
```

### What Claude Code Knows:
- ❌ **NOTHING AUTOMATICALLY** - No CLAUDE.md to tell it what to do
- ⚠️  It will just show a generic greeting asking "How can I help?"
- ⚠️  Won't know to use the PROMPT_TEMPLATE or COMPOSITION_FRAMEWORKS
- ⚠️  Won't follow your project-specific rules

**FIX NEEDED:** Create a CLAUDE.md file in this folder!

---

## PROJECT 4: 🔧 Modify Existing Design

### Working Directory:
```
/Users/ivanvalenciaperez/Desktop/CLAUDE/PROMPT_ENGENERING/MODIFY_DESIGN
```

### ❌ HAS CLAUDE.md: NO
**PROBLEM: Claude Code won't know what to do automatically!**

### Key Documentation Files Found:
```
✗ CLAUDE.md                        (MISSING!)
✓ PROMPT_FORMULA.md                (2.9KB - The 80-90% success formula)
✓ EXAMPLES.md                      (7.4KB - Example modifications)
✓ LESSONS_LEARNED.md               (7.9KB - Lessons from testing)
✓ README.md                        (3.4KB - Project readme)
```

### What Claude Code Knows:
- ❌ **NOTHING AUTOMATICALLY** - No CLAUDE.md to tell it what to do
- ⚠️  Won't know about the 150-200 word formula
- ⚠️  Won't know to use → transformation notation
- ⚠️  Won't follow the proven modification patterns

**FIX NEEDED:** Create a CLAUDE.md file in this folder!

---

## SUMMARY

| Project | Has CLAUDE.md? | Claude Code Behavior | Status |
|---------|---------------|----------------------|--------|
| **Generate Variations** | ✅ YES (17KB) | Reads all docs, follows rules | ✅ WORKING |
| **Design from Scratch** | ✅ YES (4KB) | Reads scenarios, follows guidelines | ✅ WORKING |
| **Previous Element** | ❌ NO | Shows generic greeting only | ⛔ BROKEN |
| **Modify Design** | ❌ NO | Shows generic greeting only | ⛔ BROKEN |

---

## WHY IT MATTERS

**CLAUDE.md is special!** When Claude Code starts in a directory:

1. **First**, it looks for `.claude/settings.local.json` (config)
2. **Second**, it looks for `CLAUDE.md` in the root folder
3. **If CLAUDE.md exists**, Claude Code reads it and treats it as instructions
4. **Then**, Claude Code has context about all other .md files in that directory

**Without CLAUDE.md:**
- Claude Code starts in "generic assistant" mode
- It shows "Hello! I'm Claude, how can I help?"
- It DOESN'T automatically read your other documentation
- It DOESN'T know about your project-specific rules
- Your instruction goes in, but WITHOUT the context of all your rules!

---

## WHAT NEEDS TO BE FIXED

### IMMEDIATE ACTION REQUIRED:

**Create CLAUDE.md files for:**
1. `Design Based on a Previous Element/CLAUDE.md`
2. `MODIFY_DESIGN/CLAUDE.md`

These files should:
- Explain what the project is about
- Tell Claude Code which other files to reference
- Provide the workflow/formula to follow
- Define the output format expected

---

## HOW TO VERIFY WHAT CLAUDE CODE SEES

Run this in terminal to test each project manually:

```bash
# Test Project 1
cd "/Users/ivanvalenciaperez/Desktop/CLAUDE/PROMPT_ENGENERING/Generate Variations from an Existing Design"
echo "Create a tiger variation" | claude

# Test Project 2
cd "/Users/ivanvalenciaperez/Desktop/CLAUDE/PROMPT_ENGENERING/Design from Scratch"
echo "Create design for Hermosillo" | claude

# Test Project 3 (will show generic greeting)
cd "/Users/ivanvalenciaperez/Desktop/CLAUDE/PROMPT_ENGENERING/Design Based on a Previous Element"
echo "Create design" | claude

# Test Project 4 (will show generic greeting)
cd "/Users/ivanvalenciaperez/Desktop/CLAUDE/PROMPT_ENGENERING/MODIFY_DESIGN"
echo "Modify design" | claude
```

The first two should give intelligent responses.
The last two will just say "Hello! I'm Claude, how can I help?"

---

**This document was auto-generated to show EXACTLY what the app sees.**
**Last updated:** 2025-10-23
