# Prompts Directory

**Purpose**: Organized storage of all design variation prompts by destination

## Structure

```
Prompts/
├── _RESEARCH_TEMPLATE.md          # Template for new destination research
├── [Destination_Name]/
│   ├── RESEARCH.md                # Research repository for this destination
│   ├── README.md                  # Index of variations for this destination
│   ├── [destination]_[variation_type].md
│   ├── [destination]_[variation_type]_v2.md
│   └── ...
└── README.md (this file)
```

## Research Repository System

**NEW**: Each destination folder now includes a `RESEARCH.md` file containing:
- Geography & climate
- Flora & fauna (with CMYK colors and safety notes)
- Cultural elements (with Gemini safety guidelines)
- Color palettes (ready-to-use CMYK values)
- Tourist appeal points
- Visual references
- Usage notes and element combinations

**Why This Saves Time**:
- No need to research the same elements repeatedly
- Pre-verified Gemini-safe elements
- Copy-paste ready descriptions with colors
- Consistent accuracy across all designs for a destination
- Build knowledge base over time

## Naming Convention

**Format**: `[destination]_[description].md`

**Examples**:
- `hermosillo_horizontal_banner.md`
- `hermosillo_circular_medallion.md`
- `oaxaca_vertical_letters.md`
- `merida_art_deco_style.md`

## Organization

Each destination gets its own folder containing all prompt variations for that location. This allows:
- Easy access to all variations for a specific destination
- Version control (v2, v3, etc. for iterations)
- Clear comparison between different compositional approaches
- Simple prompt retrieval for image generation

## Usage

1. Navigate to destination folder
2. Open the desired prompt file
3. Copy the entire prompt (from Overview through "CREATE DESIGN")
4. Submit to image generation AI (Gemini, etc.)

## Current Destinations

- **Hermosillo** (Sonora, Mexico)
  - `hermosillo_horizontal_banner.md` - Clear horizontal letter layout with desert landscape
  - `hermosillo_circular_medallion.md` - Circular badge with central sun, desert/ocean sides

- **Cascadas de Tamul** (San Luis Potosí, Mexico)
  - `tamul_playful_letters_photo.md` - 3D playful letters with real waterfall photography and tropical elements

## Version History

- **v1.0** (2025-01-XX): Initial structure created
- Prompts optimized for Gemini safety guidelines
- Uses streamlined template format (~1,200 words)
