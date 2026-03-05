const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;
const { spawn, exec } = require('child_process');
const app = express();
const PORT = 3001;

// Ensure PATH includes common tool locations (needed when launched via Automator/hotkey)
const extraPaths = [
  `${process.env.HOME}/.local/bin`,
  '/usr/local/bin',
  '/opt/homebrew/bin',
  `${process.env.HOME}/.nvm/versions/node/current/bin`
].join(':');
process.env.PATH = `${extraPaths}:${process.env.PATH}`;

// Configure multer for image uploads
const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    const uploadDir = path.join(__dirname, 'uploads');
    await fs.mkdir(uploadDir, { recursive: true });
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage });

app.use(express.json({ limit: '50mb' }));
app.use(express.static('public'));
app.use('/uploads', express.static('uploads'));

// Detect actual image format from file magic bytes and fix/convert if needed
// Claude API only supports: JPEG, PNG, GIF, WebP
async function fixImageExtension(filePath) {
  try {
    const buf = Buffer.alloc(12);
    const fd = await fs.open(filePath, 'r');
    await fd.read(buf, 0, 12, 0);
    await fd.close();

    let detectedFormat = null;
    if (buf[0] === 0xFF && buf[1] === 0xD8 && buf[2] === 0xFF) {
      detectedFormat = { ext: '.jpg', supported: true };
    } else if (buf[0] === 0x89 && buf[1] === 0x50 && buf[2] === 0x4E && buf[3] === 0x47) {
      detectedFormat = { ext: '.png', supported: true };
    } else if (buf[0] === 0x47 && buf[1] === 0x49 && buf[2] === 0x46) {
      detectedFormat = { ext: '.gif', supported: true };
    } else if (buf[0] === 0x52 && buf[1] === 0x49 && buf[2] === 0x46 && buf[3] === 0x46 &&
               buf[8] === 0x57 && buf[9] === 0x45 && buf[10] === 0x42 && buf[11] === 0x50) {
      detectedFormat = { ext: '.webp', supported: true };
    } else if ((buf[0] === 0x49 && buf[1] === 0x49 && buf[2] === 0x2A && buf[3] === 0x00) ||
               (buf[0] === 0x4D && buf[1] === 0x4D && buf[2] === 0x00 && buf[3] === 0x2A)) {
      detectedFormat = { ext: '.tiff', supported: false };
    } else if (buf[0] === 0x42 && buf[1] === 0x4D) {
      detectedFormat = { ext: '.bmp', supported: false };
    }

    if (!detectedFormat) return filePath;

    // If format is unsupported by Claude API, convert to PNG using macOS sips
    if (!detectedFormat.supported) {
      const pngPath = filePath.replace(/\.[^.]+$/, '.png');
      console.log(`🔄 Converting ${detectedFormat.ext} → .png (unsupported format): ${path.basename(filePath)}`);
      await new Promise((resolve, reject) => {
        exec(`sips -s format png "${filePath}" --out "${pngPath}"`, { timeout: 10000 }, (err) => {
          if (err) reject(err); else resolve();
        });
      });
      // Remove original file
      await fs.unlink(filePath).catch(() => {});
      return pngPath;
    }

    // If supported but extension is wrong, rename
    const currentExt = path.extname(filePath).toLowerCase();
    const normalize = ext => ext === '.jpeg' ? '.jpg' : ext;
    if (normalize(currentExt) === normalize(detectedFormat.ext)) return filePath;

    const newPath = filePath.replace(/\.[^.]+$/, detectedFormat.ext);
    await fs.rename(filePath, newPath);
    console.log(`🔧 Fixed image extension: ${path.basename(filePath)} → ${path.basename(newPath)}`);
    return newPath;
  } catch (e) {
    console.error(`⚠️ fixImageExtension error: ${e.message}`);
    return filePath;
  }
}

// Project configurations with folder mappings
const PROJECTS = {
  'variations': {
    name: 'Generate Variations from an Existing Design',
    color: '#4A90E2',
    icon: '🎨',
    folder: '../Generate Variations from an Existing Design'
  },
  'from-scratch': {
    name: 'Design from Scratch',
    color: '#7B68EE',
    icon: '✨',
    folder: '../Design from Scratch'
  },
  'previous-element': {
    name: 'Design Based on a Previous Element',
    color: '#50C878',
    icon: '🔄',
    folder: '../Design Based on a Previous Element'
  },
  'modify': {
    name: 'Modify Existing Design',
    color: '#FF6B6B',
    icon: '🔧',
    folder: '../MODIFY_DESIGN'
  }
};

// TURBO MODE: Ultra-fast function that skips documentation reading
async function invokeClaudeTurbo(instruction, params) {
  return new Promise(async (resolve, reject) => {
    // Check if this is a letter-fill magnet design
    const instructionLower = (instruction || '').toLowerCase();
    const isLetterFill = params.productType === 'magnet' && /\b(letter.?fill|photo.?fill|each\s+letter\s+(shows?|contains?|filled|has)|inside\s+(of\s+)?(the\s+)?letters?|uneven\s+letters?|block\s+letters?|3d\s+letters?|chunky\s+letters?|letras?\s+(rellenas?|con\s+fotos?|con\s+imagenes?))\b/i.test(instructionLower);

    let turboPrompt;

    if (isLetterFill) {
      // LETTER-FILL TURBO TEMPLATE
      const destination = params.destination || 'DESTINATION';
      const letters = destination.toUpperCase().split('');
      const letterList = letters.map((l, i) => `- ${l}: [Iconic ${destination} scene #${i + 1}]`).join('\n');

      turboPrompt = `⚡ TURBO LETTER-FILL MAGNET GENERATOR ⚡

OUTPUT EXACTLY THIS FORMAT (80-150 words MAX):

FORMAT: ${params.ratio || '2:1'}
PRODUCT: Letter-fill souvenir magnet — "${destination}"
LETTER STYLE: Bold chunky 3D letters with natural wood material, slightly uneven heights for handcrafted feel
LETTER ARRANGEMENT: "${destination}" spelled horizontally, each letter is a photo window
PHOTO FILLS — Each letter shows a DIFFERENT ${destination} scene:
${letterList}
MATERIAL: Natural wood border with subtly burned edges, vivid photos fill each letter edge-to-edge
BACKGROUND: Clean white or transparent, no frames or borders
STYLE: Photorealistic product shot of a physical souvenir magnet — looks like a real product from a gift shop

CREATE DESIGN

---
REQUEST: ${instruction}
DESTINATION: ${destination}
---

CRITICAL: Keep it SIMPLE. No decoration, no supporting elements, no text banners. Just photo-filled letters as a product.
RESPOND WITH ONLY THE FILLED PROMPT. NO EXPLANATIONS. START DIRECTLY WITH "FORMAT:"`;

    } else {
      // STANDARD TURBO TEMPLATE (visually rich version)
      turboPrompt = `⚡ TURBO PROMPT GENERATOR - MAXIMUM SPEED, MAXIMUM VISUAL IMPACT ⚡

OUTPUT EXACTLY THIS FORMAT (250-400 words):

FORMAT: ${params.ratio || '1:1'}
SUBJECT: [Describe main element + destination in ONE vivid sentence — make it EXCITING]
STYLE: ${(() => {
        const turboStyleMap = {
          'cartoon': 'Bold cartoon illustration with thick black outlines, highly saturated vibrant colors, dynamic shading, layered composition with depth — like a premium die-cut sticker product',
          'realistic': 'Detailed realistic illustration with rich textures, dramatic lighting, natural colors with punchy saturation, layered depth — like a premium art print',
          'collage': 'Rich mixed media collage with layered cutouts, torn paper edges, overlapping textures (fabric, paper, photos, patterns), dimensional depth — like a handcrafted art piece',
          'photography': 'Photography-based design with real photo elements integrated into richly illustrated decorative frames, cultural motifs, and layered compositions',
          'hybrid': 'Hybrid Real+Cartoon — real photographic elements (landmarks, objects, textures) seamlessly blended with bold cartoon illustrations, both styles interact naturally with overlapping layers and shared lighting'
        };
        return turboStyleMap[params.style] || (params.style ? params.style.charAt(0).toUpperCase() + params.style.slice(1) + ' style with rich details and layered depth' : 'Bold cartoon illustration with thick outlines, vibrant saturated colors, layered depth — premium die-cut sticker quality');
      })()}
COMPOSITION:
• [Hero element position, size %, and POSE/ACTION described vividly]
• [Supporting elements arrangement — describe LAYERING and OVERLAP]
• [Visual flow: where the eye enters, travels, and rests]
• [Depth: foreground details, midground subject, background atmosphere]
PROTAGONIST: [Main character/element — 40 words: specific details about appearance, expression, clothing/texture, pose, distinctive features]
ELEMENTS (10-15 items — be SPECIFIC, not generic):
• [Element 1 — specific species/type, color, position, how it interacts with other elements]
• [Element 2]
• [Element 3]
• [Element 4]
• [Element 5]
• [Element 6]
• [Element 7]
• [Element 8]
• [Element 9]
• [Element 10]
• [Add more if needed — FILL THE DESIGN with rich cultural details]
DECORATION: ${params.decorationLevel || 9}/10 — Fill ALL negative space with decorative details: scattered petals, cultural patterns, sparkles, micro-illustrations, confetti. NO large empty areas.
COLORS: [6-8 BOLD saturated color names — describe specific shades that create visual IMPACT and contrast]
TEXT: "${params.destination || 'DESTINATION'}" - [placement: must be BOLD and PROMINENT], [size: 18-25% height], [style: described vividly — dimensional, shadowed, decorated, integrated into design]
EDGE: MANDATORY — The outer silhouette must be IRREGULAR and ASYMMETRIC, shaped by the design elements themselves (a palm tree poking out one side, waves flowing along the bottom, flowers extending beyond borders). Think premium die-cut vinyl sticker with a COMPLEX, UNIQUE outline.
BACKGROUND: Clean white/transparent — the design floats as an irregular shape, NOT inside any frame, border, or circular badge
CREATE DESIGN

---
REQUEST: ${instruction}
${params.destination ? `DESTINATION: ${params.destination}` : ''}
${params.theme ? `THEME: ${params.theme}` : ''}
---

CRITICAL: The design must look like the BEST-SELLING souvenir product in a tourist shop — visually RICH, PACKED with details, LAYERED with depth, using BOLD saturated colors. NOT a sparse sketch.
RESPOND WITH ONLY THE FILLED PROMPT. NO EXPLANATIONS. NO INTRODUCTIONS. START DIRECTLY WITH "FORMAT:"`;
    }

    console.log(`\n⚡ TURBO MODE - Ultra-fast generation (no docs reading)`);

    let output = '';

    // ═══ ISOLATED TEMP DIRECTORY for turbo mode (prevents cross-contamination) ═══
    const turboHasImages = (params.images && params.images.length > 0) || params.styleReferenceImage;
    const turboTempDir = turboHasImages
      ? path.join(__dirname, 'tmp', `turbo-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`)
      : path.join(__dirname, 'tmp', 'turbo-empty');
    await fs.mkdir(turboTempDir, { recursive: true });
    const turboPath = turboTempDir;

    // Handle images for turbo mode — copy ONLY current images to isolated temp dir
    let turboImages = [];
    if (params.images && params.images.length > 0) {
      for (const imagePath of params.images) {
        const filename = path.basename(imagePath);
        const destPath = path.join(turboTempDir, filename);
        await fs.copyFile(imagePath, destPath);
        turboImages.push(filename);
      }
    }

    // Handle style reference image for turbo mode
    let turboStyleRef = null;
    if (params.styleReferenceImage) {
      turboStyleRef = path.basename(params.styleReferenceImage);
      const destPath = path.join(turboTempDir, turboStyleRef);
      await fs.copyFile(params.styleReferenceImage, destPath);
      turboImages.push(turboStyleRef); // Add to file list so Claude can read it
    }

    let finalPrompt = turboPrompt;

    // Style reference injection (takes priority)
    if (turboStyleRef) {
      finalPrompt = `FIRST: Read the STYLE REFERENCE image: ${turboStyleRef}
After reading, extract the EXACT art style (line work, shading, rendering, proportions), color palette (saturation, temperature), composition approach (density, layering), and decoration level.
⚠️ Use the style reference as INSPIRATION for the visual language — do NOT copy its quality. If the reference is low-res or blurry, IGNORE that. Only extract the STYLE.
Your generated prompt MUST begin with a 2-3 sentence STYLE BLOCK that precisely describes this visual style so the image AI can replicate it. This overrides any style selection.
ALSO include: "Crisp sharp ultra-detailed illustration, clean precise edges, no blur, no artifacts, high-resolution professional quality."
${turboImages.length > 1 ? `\nALSO read these reference images: ${turboImages.filter(f => f !== turboStyleRef).join(', ')}` : ''}

THEN: ${turboPrompt}`;
    } else if (turboImages.length > 0) {
      if (params.projectType === 'variations') {
        // Turbo + variations + reference image: structured analysis
        finalPrompt = `FIRST: Read image file(s): ${turboImages.join(', ')}

IMPORTANT — REFERENCE IMAGE VARIATION:
After reading the image, identify: the PROTAGONIST (character/animal/element), their POSE, CLOTHING, SUPPORTING ELEMENTS, COLORS, and STYLE.
Your generated prompt MUST describe the SAME protagonist and elements in a DIFFERENT pose/composition/context.
Do NOT create a completely unrelated design. Keep the same character, same destination, same style.
⚠️ If the reference image is low-quality/blurry — IGNORE the quality, only extract the STYLE and CONCEPT. Your prompt must produce a CRISP, SHARP result.
Include in your prompt: "Crisp sharp ultra-detailed illustration, clean precise edges, no blur, no artifacts, high-resolution professional quality, vivid saturated colors."

THEN: ${turboPrompt}`;
      } else {
        // ALL project types with reference images in turbo mode: analyze style
        finalPrompt = `FIRST: Read image file(s): ${turboImages.join(', ')}

IMPORTANT — REFERENCE IMAGE ANALYSIS (INSPIRATION ONLY):
After reading the image(s), analyze them as INSPIRATION — do NOT copy them literally. Extract:
• ART STYLE: line weight, shading approach, proportions, rendering technique
• COLOR PALETTE: dominant colors, saturation level, temperature
• COMPOSITION APPROACH: layout pattern, element density, depth layering
• KEY ELEMENTS: types of characters, flora, fauna, cultural objects

⚠️ CRITICAL QUALITY RULES:
• Treat reference images as MOOD/STYLE INSPIRATION — create something COMPLETELY NEW but inspired by their aesthetic
• NEVER describe the reference image literally — instead, create an ORIGINAL composition in the same visual spirit
• Your prompt MUST include these quality keywords: "crisp sharp vector illustration", "clean precise edges", "high-resolution detailed artwork", "professional product-quality rendering"
• If the reference image looks low-resolution or blurry, IGNORE the quality — only extract the STYLE and CONCEPT, then describe a PRISTINE high-quality version
• Add to your prompt: "ultra-detailed, sharp clean lines, vibrant saturated colors, no blur, no artifacts, no soft edges, professional illustration quality"

THEN: ${turboPrompt}`;
      }
    }

    const turboFlags = turboImages.length > 0 ? '--allowedTools "Read,Glob"' : '';
    const command = `echo ${JSON.stringify(finalPrompt)} | claude -p ${turboFlags}`;

    const claude = spawn(command, [], {
      cwd: turboPath,
      shell: true,
      env: { ...process.env }
    });

    // Cleanup turbo temp directory
    const cleanupTurbo = async () => {
      if (turboHasImages && turboTempDir) {
        try { await fs.rm(turboTempDir, { recursive: true, force: true }); } catch { /* ok */ }
      }
    };

    // Short timeout for turbo mode (30 seconds max)
    const timeoutTimer = setTimeout(async () => {
      claude.kill();
      await cleanupTurbo();
      if (output && output.length > 50) {
        resolve(output);
      } else {
        reject(new Error('Turbo timeout - try again'));
      }
    }, 30000);

    claude.stdout.on('data', (data) => {
      output += data.toString();
    });

    claude.stderr.on('data', (data) => {
      console.error('stderr:', data.toString());
    });

    claude.on('close', async (code) => {
      clearTimeout(timeoutTimer);
      console.log(`⚡ Turbo completed (exit: ${code})`);
      await cleanupTurbo();

      if (output && output.length > 50) {
        // Clean output - remove any greeting text
        let cleanOutput = output;
        const formatIndex = cleanOutput.indexOf('FORMAT:');
        if (formatIndex > 0) {
          cleanOutput = cleanOutput.substring(formatIndex);
        }
        resolve(cleanOutput.trim());
      } else {
        reject(new Error('Turbo failed to generate output'));
      }
    });

    claude.on('error', async (error) => {
      clearTimeout(timeoutTimer);
      await cleanupTurbo();
      reject(new Error(`Turbo error: ${error.message}`));
    });
  });
}

// Function to invoke Claude Code in the project directory
async function invokeClaude(projectType, instruction, params) {
  return new Promise(async (resolve, reject) => {
    const project = PROJECTS[projectType];
    if (!project) {
      reject(new Error('Invalid project type'));
      return;
    }

    const projectPath = path.join(__dirname, project.folder);

    // ═══ ISOLATED TEMP DIRECTORY (prevents cross-contamination between requests) ═══
    // Instead of copying images INTO the project directory (where old images accumulate),
    // create a fresh temp directory with ONLY: CLAUDE.md + reference files + current images.
    const hasImages = (params.images && params.images.length > 0) || params.styleReferenceImage;
    const tempDir = hasImages ? path.join(__dirname, 'tmp', `req-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`) : null;

    let projectImages = []; // tracks files for cleanup
    let styleRefProjectPath = null;

    if (tempDir) {
      try {
        await fs.mkdir(tempDir, { recursive: true });
        console.log(`📂 Created isolated temp dir: ${path.basename(tempDir)}`);

        // Copy CLAUDE.md and reference docs from project directory to temp dir
        const projectFiles = await fs.readdir(projectPath);
        for (const file of projectFiles) {
          // Only copy documentation files, NOT images
          if (file.endsWith('.md') || file.endsWith('.txt')) {
            await fs.copyFile(path.join(projectPath, file), path.join(tempDir, file));
          }
        }
        // Also copy reference subdirectory if it exists
        const refDir = path.join(projectPath, 'reference');
        try {
          const refFiles = await fs.readdir(refDir);
          const tempRefDir = path.join(tempDir, 'reference');
          await fs.mkdir(tempRefDir, { recursive: true });
          for (const file of refFiles) {
            if (file.endsWith('.md') || file.endsWith('.txt')) {
              await fs.copyFile(path.join(refDir, file), path.join(tempRefDir, file));
            }
          }
        } catch { /* no reference dir, that's fine */ }

        // Copy current request images to temp dir
        if (params.images && params.images.length > 0) {
          for (const imagePath of params.images) {
            const filename = path.basename(imagePath);
            const destPath = path.join(tempDir, filename);
            await fs.copyFile(imagePath, destPath);
            projectImages.push(destPath);
            console.log(`📁 Copied image to temp dir: ${filename}`);
          }
        }

        // Copy style reference image to temp dir
        if (params.styleReferenceImage) {
          const styleRefFilename = 'style-ref-' + path.basename(params.styleReferenceImage);
          styleRefProjectPath = path.join(tempDir, styleRefFilename);
          await fs.copyFile(params.styleReferenceImage, styleRefProjectPath);
          projectImages.push(styleRefProjectPath);
          console.log(`🎨 Copied style reference to temp dir: ${styleRefFilename}`);
        }
      } catch (error) {
        console.error('❌ Error setting up temp directory:', error);
        reject(new Error(`Failed to set up isolated directory: ${error.message}`));
        return;
      }
    }

    // Build the full instruction with parameters
    let fullInstruction = instruction;

    // ═══ VISUAL RICHNESS PREAMBLE (for from-scratch and previous-element) ═══
    // These modes were producing sparse, minimal designs. This injects a mandate
    // for visual density, layered details, and attention-grabbing richness.
    if (projectType === 'from-scratch' || projectType === 'previous-element') {
      fullInstruction += `\n\n${'='.repeat(50)}
⚡ MANDATORY VISUAL RICHNESS RULES (NON-NEGOTIABLE)
${'='.repeat(50)}

Your output prompt MUST produce a design that is VISUALLY RICH, DENSE, and ATTENTION-GRABBING. Think: the best-selling souvenir sticker/magnet in a tourist shop — the one that catches your eye from 10 feet away.

RICHNESS REQUIREMENTS:
1. **PACKED WITH DETAILS** — Every area of the design should have something interesting. No large empty zones. Fill negative space with decorative elements: flowers, patterns, butterflies, sparkles, cultural motifs, micro-details.
2. **LAYERED DEPTH** — Create at least 3 visual layers: foreground elements (close, detailed), midground (main subject), background (atmospheric, softer). Elements should OVERLAP and interact, not float in isolation.
3. **VIVID SATURATED COLORS** — Use BOLD, PUNCHY, highly saturated colors. No washed-out pastels or muted tones unless specifically requested. Colors should POP and be eye-catching.
4. **10+ SUPPORTING ELEMENTS** — Don't stop at 5 elements. Include 10-15 specific cultural/regional details: local flowers (by species name), animals, architectural details, food, patterns, textiles, landmarks. Each one described specifically, not generically.
5. **RICH TEXTURES** — Describe specific textures: embroidered fabric patterns, carved wood grain, glossy ceramics, hand-painted tile patterns, woven textile motifs, metallic accents.
6. **DECORATION DENSITY 8-10/10** — Default to HIGH decoration density. Every corner, edge, and gap should have decorative fills: scattered petals, tiny stars, confetti, cultural patterns, micro-illustrations.
7. **DYNAMIC COMPOSITION** — The design should have MOVEMENT and energy: flowing curves, diagonal elements, overlapping layers, elements that break out of boundaries.
8. **PREMIUM PRODUCT LOOK** — This should look like a HIGH-END professionally designed product, not a quick sketch or simple illustration. Think: award-winning travel poster meets premium die-cut sticker.

❌ NEVER produce a sparse design with 3-4 floating elements on a white background
❌ NEVER produce a flat, single-layer composition with no depth
❌ NEVER use generic descriptions like "local flowers" — name SPECIFIC species
❌ NEVER leave large empty areas unfilled
✅ ALWAYS aim for the WOW factor — the design someone would instantly want to buy
✅ ALWAYS make text integration bold and visually striking (not just floating text)
✅ ALWAYS describe specific color combinations that create visual IMPACT
${'='.repeat(50)}`;
    }

    // ═══ STYLE REFERENCE IMAGE ANALYSIS ═══
    if (styleRefProjectPath) {
      const styleRefFilename = path.basename(styleRefProjectPath);
      fullInstruction += `\n\n${'='.repeat(50)}
⚠️ MANDATORY STYLE REFERENCE IMAGE (NON-NEGOTIABLE)
${'='.repeat(50)}

BEFORE generating any prompt, you MUST read and deeply analyze this STYLE REFERENCE IMAGE:
File: ${styleRefFilename}

Use the Read tool to read this image file. Then extract and REPLICATE in your output prompt ALL of the following:

A) ART STYLE (copy EXACTLY from reference):
• Line style: thick/thin/no outlines? Black outlines? Line weight?
• Shading approach: flat colors? gradients? cell-shading? watercolor? soft shadows?
• Rendering: clean vector? hand-drawn? textured? digital painting? realistic?
• Overall aesthetic: cute/kawaii? vintage? modern? folk art? sticker-art? premium?

B) COLOR PALETTE (match EXACTLY from reference):
• Identify the 6-8 dominant colors and their exact saturation/temperature
• Note color relationships (complementary, analogous, triadic, etc.)
• Your output prompt MUST use the SAME color family and saturation level as the reference

C) COMPOSITION APPROACH (replicate from reference):
• Layout pattern: centered? layered? radial? diagonal? scattered?
• Element density: how packed/sparse is the reference?
• Depth layering: how many visual layers? How do they overlap?
• Negative space usage: minimal? balanced? generous?

D) TEXTURE & DETAIL LEVEL (match from reference):
• Surface textures: smooth? rough? embroidered? glossy? matte?
• Detail density: minimal? moderate? intricate? maximal?
• Decorative fills: what fills the gaps? patterns? petals? sparkles?

E) MOOD & ENERGY (capture from reference):
• Overall feeling: playful? sophisticated? festive? dramatic? warm?
• Visual energy: calm? dynamic? explosive? whimsical?

YOUR OUTPUT PROMPT MUST:
1. Begin with a 3-4 sentence STYLE BLOCK that describes this EXACT visual style so the image AI can replicate it
2. Use the SAME color palette, saturation, and temperature as the reference
3. Match the SAME level of detail density and decoration
4. Replicate the SAME art style and rendering approach
5. Include these MANDATORY quality keywords: "Crisp, sharp, ultra-detailed illustration. Clean precise edges, no blur, no artifacts, no soft unfocused areas. High-resolution professional product-quality rendering. Vivid saturated colors with strong contrast."

⚠️ IMPORTANT: If the style reference image is low-resolution, blurry, or has compression artifacts — COMPLETELY IGNORE the image quality. Extract ONLY the artistic style, color palette, and composition approach. Your prompt must produce a PRISTINE, SHARP, DETAILED result regardless of the reference's quality.

This style reference OVERRIDES the style dropdown selection. The reference image IS the style.
DO NOT deviate from this style. DO NOT use a different art style, color palette, or composition approach.
${'='.repeat(50)}`;
    }

    // Add context based on parameters
    if (params.destination) {
      fullInstruction += `\n\nDestination: ${params.destination}`;
    }
    if (params.theme) {
      fullInstruction += `\nTheme: ${params.theme}`;
    }
    // Only include Transformeter for 'variations' project type
    if (params.level && params.projectType === 'variations') {
      fullInstruction += `\n\n**MANDATORY TRANSFORMETER LEVEL: ${params.level}/10** - You MUST use exactly this transformation level in your output. Do not default to any other value.`;
    }
    // Only include Decoration Level for 'variations' project type (the only one with that slider)
    if (params.decorationLevel && params.projectType === 'variations') {
      fullInstruction += `\n**MANDATORY DECORATION LEVEL: ${params.decorationLevel}/10** - You MUST use exactly this decoration level in your output. Do not default to 8/10 or any other value.`;
    }
    // Only include Crazymeter for 'from-scratch' and 'previous-element' project types
    if (params.crazymeter && (params.projectType === 'from-scratch' || params.projectType === 'previous-element')) {
      fullInstruction += `\n\n**MANDATORY CRAZYMETER LEVEL: ${params.crazymeter}/10** - This controls how creative/unconventional the design should be:
  - 1-3: Traditional, safe, expected design concepts
  - 4-6: Balanced creativity with unique twists
  - 7-10: Wild, unexpected, boundary-pushing ideas
You MUST use exactly this creativity level. A level of ${params.crazymeter}/10 means ${params.crazymeter <= 3 ? 'keep designs traditional and safe' : params.crazymeter <= 6 ? 'add creative twists while staying grounded' : 'push boundaries with wild, unconventional ideas'}.`;
    }
    if (params.style) {
      const styleNames = {
        'cartoon': 'Cartoon - Playful cartoon style with bold outlines and vibrant colors',
        'realistic': 'Realistic - Detailed realistic illustration with natural colors and textures',
        'collage': 'Collage - CRITICAL: Create a true mixed media COLLAGE design with these specific requirements:\n  • Use layered cutout style with visible edges and overlapping elements\n  • Include varied textures (paper, fabric, photo fragments, patterns)\n  • Mix different art styles and media types (photos, illustrations, patterns, text)\n  • Create depth through overlapping layers with shadows/highlights\n  • Use irregular torn/cut edges on elements (NOT perfect vector shapes)\n  • Include decorative elements like tape, borders, stamps, or stitching effects\n  • Intentional composition that looks hand-assembled from multiple sources\n  • This should look like physical collage art, NOT a regular illustration',
        'photography': 'Photography - Photography-based design with real photo elements integrated into the composition. Combine real photography with illustrated elements, decorative frames, or use photos as texture fills for regional shapes.',
        'hybrid': 'Hybrid Real+Cartoon - CRITICAL: Create a design that seamlessly BLENDS real photographic elements with cartoon/illustrated elements so they complement each other:\n  • Use REAL photographic imagery for key elements (landmarks, animals, objects, food, nature, textures) — these should look like actual photographs\n  • Use CARTOON/ILLUSTRATED style for characters, decorative elements, borders, typography, and supporting graphics — bold outlines, vibrant flat colors\n  • The real and cartoon elements must INTERACT and OVERLAP naturally (e.g., a cartoon character sitting on a real photographed rock, illustrated flowers growing around a real building photo, cartoon birds flying over a real landscape)\n  • Create a cohesive composition where neither style dominates — they work together harmoniously\n  • Use shadows, lighting, and scale to make the blend feel intentional and polished, not like a lazy paste job\n  • Think: Who Framed Roger Rabbit meets travel poster — the real world and the illustrated world coexist beautifully'
      };
      fullInstruction += `\nStyle: ${styleNames[params.style] || params.style}`;
    }
    if (params.ratio) {
      const ratioFormats = {
        '1:1': 'Square 1:1',
        '2:1': 'Rectangular 2:1 (horizontal landscape)',
        '1:2': 'Vertical 1:2 (tall portrait)'
      };
      fullInstruction += `\nFormat/Ratio: ${ratioFormats[params.ratio] || params.ratio}`;
    }
    if (params.productType) {
      fullInstruction += `\nProduct Type: ${params.productType}`;

      // Add shape constraints if this is a bottle opener AND user has uploaded shape references
      if (params.productType === 'bottle-opener' && params.images && params.images.length > 0) {
        fullInstruction += `\n\nMANDATORY BOTTLE OPENER SHAPE (CRITICAL - NON-NEGOTIABLE):

EXACT SHAPE REQUIREMENTS - Study the reference images carefully:
• TOP SECTION: Large rounded opening (upside-down U or rounded rectangle) where bottle cap fits - this opening is ESSENTIAL and must be clearly visible
• OVERALL PROPORTIONS: Tall vertical format, approximately 6" height x 3" width ratio
• MIDDLE SECTION: Narrower "neck" area (2-2.5" wide) with gentle organic curves on sides
• BOTTOM SECTION: Wider rounded base (3.5-4" wide, occupying 35-40% of height) for stability
• ALL EDGES: Organic flowing curves following design elements - NO straight lines or hard corners
• STRUCTURAL INTEGRITY: All decorative elements connect to main composition, no floating parts

The reference images show EXACTLY how this should look. Your design MUST match this silhouette - it's a functional product, not a decorative rectangle or circle. The top opening and bottom base widening are the defining features that make this recognizable as a bottle opener.

VISUAL CHECK: If someone saw just the outline/silhouette, would they recognize it as a bottle opener? If not, fix the shape.`;
      }
    }

    console.log(`\n${'='.repeat(60)}`);
    console.log(`🎨 INVOKING CLAUDE CODE`);
    console.log(`Project: ${project.name}`);
    console.log(`Directory: ${projectPath}`);
    console.log(`Instruction: ${fullInstruction.substring(0, 200)}...`);
    if (projectImages.length > 0) {
      console.log(`Images: ${projectImages.length} file(s) (copied to project directory)`);
      projectImages.forEach((img, i) => {
        console.log(`  [${i + 1}] ${path.basename(img)}`);
      });
    }
    console.log(`${'='.repeat(60)}\n`);

    let output = '';
    let errorOutput = '';
    let lastOutputTime = Date.now();
    let hasReceivedOutput = false;

    // Add image file reading instruction if images are provided
    if (projectImages.length > 0) {
      const imageFilenames = projectImages.map(img => path.basename(img));

      // For VARIATIONS with reference images: structured two-phase analysis
      if (projectType === 'variations') {
        fullInstruction = `⚠️ OVERRIDE: When reference images are provided, the "fresh unique creation" and "NO cross-referencing" rules DO NOT APPLY. Your job is to create variations OF THE REFERENCE IMAGE, not ignore it.

PHASE 1 — DEEPLY ANALYZE THE REFERENCE IMAGE(S):
Use the Read tool to read these image file(s) in the current directory:
${imageFilenames.map((f, i) => `${i + 1}. ${f}`).join('\n')}

After reading, you MUST extract ALL of the following in detail:

A) PROTAGONIST IDENTITY:
• Exact character type (e.g., "chibi-style Lele doll with oversized head, tiny body")
• Exact clothing details (colors, patterns, embroidery, ribbons)
• Hair style, accessories, facial expression
• Body proportions (chibi? realistic? kawaii?)

B) SPECIFIC ART STYLE (THIS IS CRITICAL — describe precisely):
• Line style: thick/thin outlines? black outlines? no outlines? line weight?
• Shading: flat colors? gradients? cell-shading? watercolor? soft shadows?
• Proportions: chibi/kawaii? realistic? exaggerated?
• Color approach: saturated? pastel? muted? neon? specific color temperature?
• Rendering: clean vector? hand-drawn? textured? digital painting?
• Overall aesthetic: cute/kawaii? vintage? modern? folk art? sticker-art?

C) ELEMENTS & COMPOSITION:
• Supporting elements: exact flowers, animals, objects (species, colors)
• Layout: centered? diagonal? layered? symmetrical?
• Background treatment: white? colored? gradient? scene?
• Decorative details: borders, sparkles, confetti, patterns?
• Text placement and style if any

PHASE 2 — GENERATE A VARIATION PROMPT THAT REPLICATES THE EXACT STYLE:
Your output prompt MUST begin with a detailed STYLE BLOCK that describes the EXACT visual style from the reference so the image AI can replicate it. This is the most important part.

YOUR PROMPT MUST INCLUDE (in this order):
1. STYLE DESCRIPTION (2-3 sentences): Describe the exact rendering style, line work, shading, and proportions from the reference. Be hyper-specific. Use terms like: "crisp vector illustration", "sharp clean edges", "flat solid color fills", "no soft shading, no airbrush, no painterly effects", "like a professional die-cut sticker product". If the reference has a clean vector look, emphasize: "sharp vector art, NOT soft cartoon, NOT watercolor, NOT painterly — crisp clean edges like a vinyl sticker or enamel pin."
2. PROTAGONIST: Describe the SAME character with SAME clothing/accessories but in a DIFFERENT pose or action.
3. ELEMENTS: Use the SAME types of supporting elements (same flower species, same animals) but arranged differently.
4. COMPOSITION: Different layout than the reference.
5. PRODUCT-READY SILHOUETTE: The design MUST look like a FINISHED PRODUCT — a die-cut magnet/sticker with an IRREGULAR custom silhouette. It must NOT look like a wallpaper, poster, illustration, or image inside a rectangle. The design should float on white/transparent background with its own unique organic outline shaped by the elements themselves. If someone printed this and cut along the outer edge, it should have a complex, interesting shape.

WHAT TO KEEP (sacred — non-negotiable):
✅ EXACT same art style, line work, shading, and rendering approach
✅ EXACT same protagonist character with same clothing and accessories
✅ Same types of supporting elements (if reference has marigolds and hummingbirds, variation has marigolds and hummingbirds)
✅ Same color palette and saturation level
✅ Same overall aesthetic feel (if reference looks like a sticker, variation looks like a sticker too)

WHAT TO CHANGE (variation elements):
🔄 Protagonist pose, gesture, or action (sitting → standing, holding flowers → waving, etc.)
🔄 Composition layout (centered → off-center, horizontal → vertical, etc.)
🔄 Arrangement and placement of supporting elements
🔄 Small decorative detail differences (different flower arrangement, different butterfly positions)

WHAT TO NEVER DO:
🚫 Do NOT change the art style (if reference is kawaii chibi, don't output realistic or painterly)
🚫 Do NOT change the protagonist's identity or clothing
🚫 Do NOT use different types of elements (if reference has hummingbirds, don't replace with parrots)
🚫 Do NOT create a completely unrelated design
🚫 Do NOT output a generic "cartoon style" description — be SPECIFIC about the exact style
🚫 Do NOT create a design that looks like a wallpaper, poster, or rectangular image — it MUST look like a die-cut PRODUCT with a custom irregular silhouette on white/transparent background
🚫 Do NOT use badge, emblem, medallion, circle, or frame compositions — the silhouette must be ORGANIC and IRREGULAR
🚫 Do NOT add background gradients, sunset colors, textures, or atmospheric effects unless the reference image has them. If the reference has a WHITE/TRANSPARENT background, your prompt MUST have a white/transparent background too
🚫 Do NOT use terms like "gouache", "watercolor", "painterly", "screen-print texture" if the reference is clean flat vector
🚫 Do NOT write extremely long prompts. Keep the prompt between 150-350 words. Longer prompts confuse the image AI and dilute the style instructions
🚫 Do NOT reproduce the reference image's QUALITY — if it's blurry, low-res, or has artifacts, IGNORE that. Only extract the STYLE and CONCEPT.

MANDATORY QUALITY KEYWORDS (include in EVERY prompt you generate):
Your output prompt MUST include these quality instructions to ensure crisp results:
• "Crisp, sharp, ultra-detailed illustration"
• "Clean precise edges, no blur, no artifacts, no soft unfocused areas"
• "High-resolution professional product-quality rendering"
• "Vivid saturated colors with strong contrast"
These override any low quality from the reference image. The AI must generate SHARP output.

PROMPT FORMAT RULES:
• The prompt must be CONCISE (150-350 words max). Short, clear prompts produce better results than long verbose ones.
• The STYLE BLOCK must be the FIRST thing in the prompt and must be the STRONGEST instruction.
• Do NOT include "WHAT THIS IS NOT" sections, "CRAZYMETER NOTES", "CONCEPT SUMMARIES", or other meta-commentary — just the prompt itself.
• Do NOT include verification checklists or checkbox sections inside the prompt — those go AFTER the prompt.
• Background must be CLEAN WHITE or TRANSPARENT unless the reference specifically shows otherwise.
• Every instruction in the prompt must be CONSISTENT — do not say "white background" in one place and "sunset gradient" in another.

THEN GENERATE THE PROMPT BASED ON: ${fullInstruction}`;
      } else {
        // ALL other project types with reference images: INSPIRATION-BASED analysis
        fullInstruction = `FIRST: Use the Read tool to read these image file(s) in the current directory:
${imageFilenames.map((f, i) => `${i + 1}. ${f}`).join('\n')}

${'='.repeat(50)}
⚠️ CRITICAL: INSPIRATION ONLY — DO NOT COPY LITERALLY
${'='.repeat(50)}

These reference images are for INSPIRATION and STYLE EXTRACTION only. You must create a COMPLETELY NEW, ORIGINAL design that is INSPIRED BY the reference — NOT a reproduction of it.

STEP 1 — ANALYZE (extract these from the reference):

A) ART STYLE (the visual language to replicate):
• Line style: thick/thin outlines? black outlines? no outlines? line weight?
• Shading: flat colors? gradients? cell-shading? watercolor? soft shadows?
• Proportions: chibi/kawaii? realistic? exaggerated?
• Rendering: clean vector? hand-drawn? textured? digital painting?
• Overall aesthetic: cute/kawaii? vintage? modern? folk art? sticker-art?

B) COLOR PALETTE (the color family to use):
• Dominant colors, saturation level, color temperature
• Use the SAME color family but in your OWN original composition

C) MOOD & ENERGY (the feeling to capture):
• Playful? sophisticated? festive? dramatic? whimsical?
• Element density: packed? moderate? minimal?

STEP 2 — CREATE SOMETHING NEW (do NOT copy the image):

🚫 DO NOT describe what you see in the reference image literally
🚫 DO NOT reproduce the same composition or layout
🚫 DO NOT copy specific poses, arrangements, or element positions
🚫 If the reference image is blurry, low-res, or has artifacts — IGNORE the quality entirely

✅ DO create a FRESH, ORIGINAL design using the same VISUAL STYLE
✅ DO use the same COLOR FAMILY but in a new arrangement
✅ DO capture the same MOOD and ENERGY level
✅ DO imagine you are a professional illustrator who saw the reference once, then created something original from memory

STEP 3 — MANDATORY QUALITY KEYWORDS (include ALL of these in your output prompt):
Your generated prompt MUST include these quality instructions:
• "Crisp, sharp, ultra-detailed illustration"
• "Clean precise vector edges, no blur, no artifacts, no soft unfocused areas"
• "High-resolution professional product-quality rendering"
• "Vivid saturated colors with strong contrast"
• "Every element rendered with precision and clarity"

These quality keywords ensure the image AI generates SHARP, DETAILED output regardless of the reference image quality.

THEN: ${fullInstruction}`;
      }

      // Special handling for "Design Based on Previous Element" with photography
      if (projectType === 'previous-element' && params.style === 'photography' && params.photoStyle) {

        // ===== LETTER-FILL DETECTION =====
        // Check if this is a letter-shaped design (e.g., "TIJUANA letters with photos inside")
        const instructionLower = (instruction || '').toLowerCase();
        const isLetterDesign = /\b(letter.?fill|photo.?fill|each\s+letter\s+(shows?|contains?|filled|has)|inside\s+(of\s+)?(the\s+)?letters?|letters?\s+with\s+(photos?|images?|scenes?)|uneven\s+letters?|block\s+letters?|3d\s+letters?|chunky\s+letters?|letras?\s+(rellenas?|con\s+fotos?|con\s+imagenes?))\b/i.test(instructionLower)
          || /\b(letters?|letras?)\b/i.test((params.previousElement || '').toLowerCase());

        if (isLetterDesign && params.productType === 'magnet') {
          // ===== LETTER-FILL MAGNET OVERRIDE =====
          // This completely replaces the standard template for letter magnets
          const destination = params.destination || 'DESTINATION';
          const letters = destination.toUpperCase().split('');
          const letterList = letters.map((l, i) => `- ${l}: [Iconic ${destination} scene #${i + 1} — specific landmark, landscape, or cultural element]`).join('\n');

          fullInstruction += `\n\n${'='.repeat(60)}
⚠️ LETTER-FILL MAGNET OVERRIDE (THIS REPLACES ALL OTHER TEMPLATES)
${'='.repeat(60)}

You are creating a LETTER-FILL souvenir magnet. This is a SPECIALIZED product type.

🚫 DO NOT use the standard PROMPT_TEMPLATE.md composition framework.
🚫 DO NOT add 5-10 supporting elements, decoration layers, or ornamental borders.
🚫 DO NOT write a 200-350 word prompt. Keep it 80-150 words MAXIMUM.
🚫 DO NOT add heavy text integration (15-25% height banners).

✅ USE THIS SIMPLIFIED STRUCTURE INSTEAD:

\`\`\`
FORMAT: ${params.ratio || '2:1'}

PRODUCT: Letter-fill souvenir magnet — "${destination}"

LETTER STYLE: Bold, chunky 3D letters with [natural wood / brushed metal / glossy acrylic] material texture. Letters are [slightly uneven in height for a handcrafted feel / uniform and clean / playfully tilted].

LETTER ARRANGEMENT: "${destination}" spelled out in [horizontal row / slightly staggered heights / gentle arc], each letter acting as a photo window.

PHOTO FILLS — Each letter is a window/cutout showing a DIFFERENT ${destination} scene:
${letterList}

MATERIAL & FINISH: [Natural wood border with subtly burned/darkened edges / Brushed metal frame / Glossy acrylic with clean edges]. Each photo is vivid, high-resolution, fills the entire letter shape edge-to-edge.

BACKGROUND: Clean white or transparent. The letters sit as a group — no additional framing, badges, or borders around them.

STYLE: Photorealistic product photography of a physical souvenir magnet. The letters should look like a REAL product you could buy in a gift shop — tangible, three-dimensional, with realistic shadows and material textures.

CREATE DESIGN
\`\`\`

CRITICAL REQUIREMENTS:
- Each letter MUST show a DIFFERENT, SPECIFIC scene from ${destination} (not generic photos)
- Choose iconic, recognizable landmarks and scenes that a tourist would associate with ${destination}
- The photos inside letters must be vivid, sharp, and fill the ENTIRE letter shape
- Letters should look like a real physical product with depth and materiality
- Keep decoration MINIMAL (2-3/10 max) — the beauty is in the photos and letter shapes
- DO NOT add cartoon elements, decorative flowers, supporting animals, or text banners around the letters
- The reference image shows EXACTLY the style: simple, clean, photo-filled letters as a standalone product`;

        } else {
          // ===== STANDARD PHOTOGRAPHY HANDLING (non-letter designs) =====
          const approachInstructions = {
            'clipping-mask': `
MANDATORY APPROACH - CLIPPING MASK:
Create a design where the photograph is placed INSIDE a regional iconic shape (animal silhouette, cultural object, landmark silhouette, etc.). The photo becomes the texture/fill of this shape.

SPECIFIC REQUIREMENTS:
- Choose an iconic shape related to the destination (e.g., deer, coyote, saguaro, bird, building silhouette)
- The photograph should fill the ENTIRE interior of this shape
- Add minimal decorative elements around the shape (not inside it)
- Text should be integrated into the illustrated border/decorative elements, NOT overlaid on the photo
- The clipping mask shape should be bold and recognizable
- Style: Bold cartoon-style outline for the shape, clean clipping mask effect`,

            'decorative-frame': `
MANDATORY APPROACH - DECORATIVE FRAME:
Create a design where the photograph is centered in an ornamental frame/window, surrounded by illustrated cartoon-style regional elements.

SPECIFIC REQUIREMENTS:
- Place the photo in the center (30-40% of total composition)
- Create an ornamental frame around it (geometric pattern, organic vines, or architectural elements)
- Surround with illustrated regional elements: flora, fauna, cultural icons, food, landmarks
- These elements should be CARTOON STYLE with thick outlines and vibrant colors
- Text should be integrated into the decorative border layer
- The decorative elements should interact with the frame, not just float randomly
- Create depth and layering between frame, photo, and decorative elements`
          };

          fullInstruction += `\n\nIMPORTANT: After reading the image(s), determine if they are REAL PHOTOGRAPHS (not illustrations/designs). If they are photographs, you MUST create an illustrated design using this approach:

${approachInstructions[params.photoStyle]}

KEY REQUIREMENTS:
- Extract regional/cultural elements from the destination and instructions
- Use decoration level ${params.decorationLevel}/10 to control density of decorative elements
- The photo should be ONE ELEMENT in a larger illustrated composition
- DO NOT just add white text on top of the photo - that's lazy and unacceptable
- Create a detailed, specific prompt that clearly describes how the photo integrates with illustrated elements`;
        }
      }
    }

    // Letter-fill detection for cases WITHOUT uploaded images (text-only request)
    if (!projectImages.length && projectType === 'previous-element' && params.productType === 'magnet') {
      const instructionLower = (instruction || '').toLowerCase();
      const isLetterDesign = /\b(letter.?fill|photo.?fill|each\s+letter\s+(shows?|contains?|filled|has)|inside\s+(of\s+)?(the\s+)?letters?|letters?\s+with\s+(photos?|images?|scenes?)|uneven\s+letters?|block\s+letters?|3d\s+letters?|chunky\s+letters?|letras?\s+(rellenas?|con\s+fotos?|con\s+imagenes?))\b/i.test(instructionLower);

      if (isLetterDesign) {
        const destination = params.destination || 'DESTINATION';
        const letters = destination.toUpperCase().split('');
        const letterList = letters.map((l, i) => `- ${l}: [Iconic ${destination} scene #${i + 1} — specific landmark, landscape, or cultural element]`).join('\n');

        fullInstruction += `\n\n${'='.repeat(60)}
⚠️ LETTER-FILL MAGNET OVERRIDE (THIS REPLACES ALL OTHER TEMPLATES)
${'='.repeat(60)}

You are creating a LETTER-FILL souvenir magnet. This is a SPECIALIZED product type.

🚫 DO NOT use the standard PROMPT_TEMPLATE.md composition framework.
🚫 DO NOT add 5-10 supporting elements, decoration layers, or ornamental borders.
🚫 DO NOT write a 200-350 word prompt. Keep it 80-150 words MAXIMUM.
🚫 DO NOT add heavy text integration (15-25% height banners).

✅ USE THIS SIMPLIFIED STRUCTURE INSTEAD:

FORMAT: ${params.ratio || '2:1'}

PRODUCT: Letter-fill souvenir magnet — "${destination}"

LETTER STYLE: Bold, chunky 3D letters with natural wood / metal / acrylic material. Letters are slightly uneven in height for a handcrafted feel.

LETTER ARRANGEMENT: "${destination}" spelled horizontally, each letter acting as a photo window.

PHOTO FILLS — Each letter shows a DIFFERENT ${destination} scene:
${letterList}

MATERIAL & FINISH: Natural wood border with subtly burned/darkened edges. Vivid, high-resolution photos fill each letter edge-to-edge.

BACKGROUND: Clean white or transparent. No additional framing or borders.

STYLE: Photorealistic product shot of a physical souvenir magnet.

CREATE DESIGN

Keep decoration MINIMAL (2-3/10). Each letter must show a DIFFERENT, SPECIFIC, ICONIC scene from ${destination}.`;
      }
    }

    // Determine working directory:
    // If we have images, use the isolated temp directory (contains ONLY current images + docs)
    // For variations WITH images: use temp dir WITHOUT CLAUDE.md (structured instructions are enough)
    // For everything else: use project directory (no images = no contamination risk)
    let effectiveCwd = projectPath;
    if (tempDir) {
      effectiveCwd = tempDir;
      if (projectType === 'variations') {
        // For variations, remove CLAUDE.md from temp dir so our structured instructions dominate
        try { await fs.unlink(path.join(tempDir, 'CLAUDE.md')); } catch { /* ok */ }
        console.log(`📋 VARIATIONS + IMAGES: Running from isolated temp dir (no CLAUDE.md interference)`);
      } else {
        console.log(`📋 Running from isolated temp dir (clean, no old images)`);
      }
    }

    // Use echo piping for instruction (Claude Code will read images from working directory)
    // --allowedTools ensures Claude can read image files without asking for permission
    const claudeFlags = projectImages.length > 0 ? '--allowedTools "Read,Glob"' : '';
    const command = `echo ${JSON.stringify(fullInstruction)} | claude -p ${claudeFlags}`;

    // Spawn process using shell to allow piping
    const claude = spawn(command, [], {
      cwd: effectiveCwd,
      shell: true,
      env: { ...process.env }
    });

    // Early warning timer (20 seconds)
    const warningTimer = setTimeout(() => {
      if (!hasReceivedOutput) {
        console.log('⚠️  Still waiting for Claude Code response (20s elapsed)... This is normal for first request or large documentation.');
      }
    }, 20000);

    // Timeout after 120 seconds (increased for projects with heavy documentation)
    const timeoutTimer = setTimeout(async () => {
      clearTimeout(warningTimer); // Clean up warning timer
      claude.kill();
      await cleanupImages(); // Clean up copied images

      const timeSinceLastOutput = Date.now() - lastOutputTime;

      if (output && output.length > 50) {
        console.log('⚠️  Timeout reached, returning partial output');
        resolve(output);
      } else if (hasReceivedOutput) {
        reject(new Error(`Claude Code stalled after ${Math.round(timeSinceLastOutput/1000)}s with no new output. The generation may be incomplete.`));
      } else {
        reject(new Error('Claude Code timed out after 120 seconds with no output. Possible causes:\n• Large documentation files taking too long to read\n• Network latency to Anthropic API\n• Claude Code not properly installed\n\nTry: Simplify instruction, check internet connection, or restart the app.'));
      }
    }, 120000);

    // Capture stdout
    claude.stdout.on('data', (data) => {
      const text = data.toString();
      output += text;
      lastOutputTime = Date.now();
      hasReceivedOutput = true;
      clearTimeout(warningTimer); // Clear warning once we get output
      console.log(text);
    });

    // Capture stderr
    claude.stderr.on('data', (data) => {
      const text = data.toString();
      errorOutput += text;
      console.error('stderr:', text);
    });

    // Cleanup function: delete the entire temp directory (much more reliable than individual files)
    const cleanupImages = async () => {
      if (tempDir) {
        try {
          await fs.rm(tempDir, { recursive: true, force: true });
          console.log(`🗑️  Deleted temp directory: ${path.basename(tempDir)}`);
        } catch (error) {
          console.error(`⚠️ Cleanup warning: ${error.message}`);
        }
      }
      // NOTE: Do NOT delete from uploads/ — those are the originals needed across variations
    };

    // Handle completion
    claude.on('close', async (code) => {
      clearTimeout(warningTimer); // Clean up warning timer
      clearTimeout(timeoutTimer); // Clean up timeout timer
      console.log(`\n✓ Claude process completed (exit code: ${code})\n`);

      // Clean up copied images
      await cleanupImages();

      // Filter out Claude's greeting messages - we only want the actual response
      let filteredOutput = output;

      // Remove greeting and help text
      const greetingMarkers = [
        'Hello! I\'m Claude',
        'How can I help you today',
        'I can assist with:',
        'What would you like to work on?'
      ];

      // Find where the actual response starts (after all the greeting)
      let responseStart = 0;
      for (const marker of greetingMarkers) {
        const index = output.lastIndexOf(marker);
        if (index > responseStart) {
          responseStart = index;
        }
      }

      // Find the start of actual content after the greeting
      if (responseStart > 0) {
        // Look for the next substantial content after greetings
        const afterGreeting = output.substring(responseStart);
        const nextNewline = afterGreeting.indexOf('\n\n');
        if (nextNewline > 0) {
          filteredOutput = output.substring(responseStart + nextNewline).trim();
        }
      }

      if (filteredOutput && filteredOutput.length > 100) {
        resolve(filteredOutput);
      } else if (output && output.length > 100) {
        // Fallback to full output if filtering didn't work
        resolve(output);
      } else {
        reject(new Error(`Claude Code failed to generate output: ${errorOutput || 'No substantial output received'}`));
      }
    });

    // Handle errors
    claude.on('error', async (error) => {
      clearTimeout(warningTimer); // Clean up timers
      clearTimeout(timeoutTimer);
      await cleanupImages(); // Clean up copied images
      console.error('Failed to start Claude Code:', error);
      reject(new Error(`Failed to start Claude Code: ${error.message}. Make sure Claude Code is installed and the 'claude' command is available.`));
    });
  });
}

// Distribute styles across variations: returns an array of style names, one per variation
function distributeStyles(styles, count) {
  if (!styles || styles.length === 0) return new Array(count).fill('');
  const result = [];
  for (let i = 0; i < count; i++) {
    result.push(styles[i % styles.length]);
  }
  return result;
}

// Diversity seeds — each variation gets a different creative direction
// IMPORTANT: All compositions MUST produce IRREGULAR silhouettes (no circles, rectangles, badges, frames)
const DIVERSITY_ANGLES = [
  'Use a HERO-CENTRIC composition: one dominant central element takes 60%+ of the space, with supporting details orbiting around it. The silhouette must be IRREGULAR — shaped by the elements themselves (ribbons poking up, flowers extending at sides, etc.).',
  'Use a PANORAMIC SCENE composition: spread elements across a wide landscape view, telling a story from left to right. The top edge should be JAGGED and VARIED (trees, buildings, character heads at different heights), the bottom edge shaped by terrain/flowers — NOT a clean rectangle.',
  'Use a DYNAMIC DIAGONAL composition: strong diagonal flow from one corner to the opposite, creating movement and energy. Elements break out of the frame at multiple points creating an IRREGULAR sticker-like silhouette.',
  'Use a STACKED/LAYERED composition: elements piled and layered with the protagonist on top of a mound of flowers/nature, creating a PYRAMID-like organic shape. The silhouette is defined by the elements — palm trees, ribbons, flowers all poking out at different angles.',
  'Use a SCATTERED GARDEN composition: protagonist surrounded by a lush arrangement of flowers, animals, and nature that extends outward UNEVENLY in all directions, like a hand-picked bouquet — wider on one side, taller on another.',
  'Use an ASYMMETRIC SPLIT composition: protagonist positioned off-center with supporting elements weighted heavily on one side, creating an organic imbalanced silhouette like a sticker that is wider on one side than the other.',
  'Use a CASCADING/WATERFALL composition: elements flowing downward from the protagonist, with flowers and nature spilling from top to bottom in an organic cascade, creating a silhouette that is wider at the bottom than the top.',
  'Use a WRAPAROUND composition: supporting elements curve around the protagonist like a natural wreath but with IRREGULAR, BROKEN edges — NOT a perfect circle. Flowers, vines, and birds extend outward asymmetrically at different points.'
];

// Generate multiple variations using Claude Code with streaming callback
async function generateVariations(params, count, onVariationComplete) {
  const { projectType, instructions } = params;
  const variations = [];

  // Distribute styles evenly across all variations
  const styleAssignments = distributeStyles(params.styles, count);

  console.log(`\n${'*'.repeat(60)}`);
  console.log(`GENERATING ${count} VARIATION(S) USING CLAUDE CODE`);
  if (params.styles && params.styles.length > 0) {
    console.log(`STYLES: ${params.styles.join(', ')} → distributed as: ${styleAssignments.join(', ')}`);
  }
  console.log(`${'*'.repeat(60)}\n`);

  for (let i = 0; i < count; i++) {
    try {
      // Modify instruction for each variation to get different results
      let modifiedInstruction = instructions;
      const hasImages = params.images && params.images.length > 0;

      // Pick a diversity angle for this variation
      const diversityAngle = DIVERSITY_ANGLES[i % DIVERSITY_ANGLES.length];

      // Override the style for this specific variation
      const variationStyle = styleAssignments[i];
      if (variationStyle) {
        params.style = variationStyle;
      }

      // When reference images are provided: keep same elements AND SAME STYLE, vary only arrangement
      if (hasImages && count === 1) {
        modifiedInstruction = `${instructions}\n\nREFERENCE IMAGE VARIATION RULES:\n- You MUST create a variation OF the reference image, not a new design from scratch.\n- STYLE MATCH IS MANDATORY: Your prompt MUST start with a detailed style description that replicates the EXACT rendering style, line work, shading, proportions, and color approach from the reference image. Be hyper-specific (e.g., "kawaii chibi-style with bold 2px black outlines, flat color fills, no gradients" NOT just "cartoon style").\n- Keep the SAME protagonist character with SAME clothing, accessories, and proportions.\n- Keep the SAME types of supporting elements (same flower species, same animals).\n- Keep the SAME color palette and saturation level.\n- CHANGE ONLY: pose, gesture, action, composition layout, or element arrangement.\n- The result should look like it was drawn by the SAME ARTIST as the reference.`;
      } else if (count > 1) {
        if (hasImages) {
          // Reference image + multiple variations: same elements AND STYLE, different arrangements
          modifiedInstruction = `${instructions}\n\nREFERENCE IMAGE VARIATION ${i + 1} of ${count}:\n- STYLE MATCH IS MANDATORY: Start your prompt with a detailed description of the EXACT visual style from the reference (line work, shading, proportions, rendering). Be specific, not generic.\n- Keep the SAME protagonist with SAME clothing/accessories, SAME types of supporting elements, SAME color palette.\n- COMPOSITION CHANGE for variation ${i + 1}: ${diversityAngle}\n- The protagonist should have a DIFFERENT pose/gesture/action, but must be the SAME character with SAME style.\n- The result must look like it was drawn by the SAME ARTIST as the reference — only the arrangement changes.`;
        } else {
          modifiedInstruction = `${instructions}\n\nIMPORTANT: Create variation ${i + 1} of ${count}.\n\nDIVERSITY REQUIREMENT (variation ${i + 1}): ${diversityAngle}\nThis must be COMPLETELY DIFFERENT from other variations. Use a different composition layout, different hero element treatment, different color mood, and different visual storytelling approach. Do NOT produce a slight tweak of the same design — create a genuinely new concept.`;
        }
      }

      const styleLabel = variationStyle ? ` [${variationStyle.charAt(0).toUpperCase() + variationStyle.slice(1)}]` : '';
      console.log(`\n[${'='.repeat(10)} VARIATION ${i + 1}/${count}${styleLabel} ${'='.repeat(10)}]\n`);

      // Use TURBO mode for ultra-fast generation, or standard mode for full documentation
      let output;
      if (params.turboMode) {
        console.log(`⚡ Using TURBO mode - skipping documentation for maximum speed`);
        output = await invokeClaudeTurbo(modifiedInstruction, params);
      } else {
        // Invoke Claude Code - this will read all the project documentation
        output = await invokeClaude(projectType, modifiedInstruction, params);
      }

      // Append mandatory design rules to every prompt (Gemini must see these)
      // EXCEPTION: Letter-fill magnets have their own shape rules (letters are naturally rectangular)
      const instructionCheck = (modifiedInstruction || '').toLowerCase();
      const isLetterFillDesign = params.productType === 'magnet' && /\b(letter.?fill|photo.?fill|each\s+letter\s+(shows?|contains?|filled|has)|inside\s+(of\s+)?(the\s+)?letters?|uneven\s+letters?|block\s+letters?|3d\s+letters?|chunky\s+letters?|letras?\s+(rellenas?|con\s+fotos?|con\s+imagenes?))\b/i.test(instructionCheck);

      if (isLetterFillDesign) {
        const letterDesignRules = `\n\n⚠️ CRITICAL LETTER-FILL DESIGN RULES — MANDATORY:\n- SHAPE: The overall shape is defined by the LETTERS themselves — each letter is a bold 3D shape\n- LETTERS must look like REAL physical objects with depth, shadows, and material texture\n- Each letter is a PHOTO WINDOW — filled edge-to-edge with a vivid, sharp photograph\n- NO cartoon elements, NO decorative flowers, NO supporting animals around the letters\n- NO text banners or additional labels — the letters ARE the text\n- BACKGROUND: Clean white or transparent — letters float as a group\n- PRODUCT FEEL: Must look like a real souvenir magnet you could buy in a gift shop\n- QUALITY: Crisp, professional, sharp — like a product photo from an e-commerce site`;
        output += letterDesignRules;
      } else {
        const designRules = `\n\n⚠️ CRITICAL DESIGN RULES — MANDATORY (DO NOT IGNORE):\n- BANNED OUTER SHAPES: NEVER use a square, rectangle, perfect circle, oval, medallion, or any simple geometric shape as the overall silhouette. These are ALL wrong.\n- REQUIRED OUTER SHAPE: The design MUST have a COMPLEX, IRREGULAR, ASYMMETRIC silhouette — like a hand-cut vinyl sticker. The outline should be shaped BY the design elements themselves.\n- HOW TO ACHIEVE THIS: Let elements break out and define the edge — a palm tree extends upward creating a bump, waves flow along the bottom creating scallops, a character's arm pokes out one side, buildings create a jagged skyline. The silhouette should be UNIQUE to this specific design.\n- GOOD EXAMPLES: A travel design where the top edge is shaped by mountains and a palm tree, sides follow the curves of buildings and foliage, bottom has wave-shaped edges. Each design has a one-of-a-kind outline.\n- BAD EXAMPLES: Design crammed inside a circle. Design filling a square. Design inside a round badge/medallion. Design with uniform rounded edges all around (that's just a soft rectangle).\n- BACKGROUND: Clean white or transparent. The design floats freely — NO borders, NO frames, NO containers of any kind.\n- SELF-CHECK: Trace the outer edge with your finger. If it's a recognizable geometric shape (circle, square, rectangle, oval), it is WRONG. The outline should be complex and impossible to describe with one word.`;
        output += designRules;
      }

      const variation = {
        title: variationStyle ? `Variation ${i + 1} — ${variationStyle.charAt(0).toUpperCase() + variationStyle.slice(1)}` : `Variation ${i + 1}`,
        prompt: output,
        index: i,
        style: variationStyle || null
      };

      variations.push(variation);
      console.log(`\n✅ Variation ${i + 1} completed successfully\n`);

      // Call the callback immediately when this variation is ready
      if (onVariationComplete) {
        onVariationComplete(variation, i, count);
      }

    } catch (error) {
      console.error(`❌ Error generating variation ${i + 1}:`, error.message);
      const errorVariation = {
        title: `Variation ${i + 1} - Error`,
        prompt: `❌ Error generating prompt:\n\n${error.message}\n\n**Troubleshooting:**\n- Make sure Claude Code is installed (npm install -g @anthropics/claude-code)\n- Ensure the 'claude' command is available in your terminal\n- Check that you're in the correct directory\n- Verify the project documentation exists in: ${PROJECTS[projectType]?.folder}`,
        index: i
      };

      variations.push(errorVariation);

      // Call callback for error variations too
      if (onVariationComplete) {
        onVariationComplete(errorVariation, i, count);
      }
    }
  }

  console.log(`\n${'*'.repeat(60)}`);
  console.log(`COMPLETED ${variations.length} VARIATIONS`);
  console.log(`${'*'.repeat(60)}\n`);

  return variations;
}

// API Endpoints

// Server-Sent Events endpoint for streaming variations as they complete
app.post('/api/generate-prompt-stream', upload.fields([
  { name: 'images', maxCount: 10 },
  { name: 'styleReference', maxCount: 1 }
]), async (req, res) => {
  try {
    const { projectType, instructions, variationCount, destination, theme, level, decorationLevel, crazymeter, style, styles, ratio, productType, includeShapeConstraints, photoStyle, turboMode } = req.body;
    const images = req.files?.['images'] || [];
    const styleRefFiles = req.files?.['styleReference'] || [];
    const count = parseInt(variationCount) || 1;

    // Parse multi-style selection
    let parsedStyles = [];
    try {
      if (styles) parsedStyles = JSON.parse(styles);
    } catch (e) { /* ignore parse errors, fall back to single style */ }
    if (parsedStyles.length === 0 && style) parsedStyles = [style];

    if (!instructions || !instructions.trim()) {
      return res.status(400).json({
        success: false,
        error: 'Instructions are required'
      });
    }

    if (!projectType || !PROJECTS[projectType]) {
      return res.status(400).json({
        success: false,
        error: 'Invalid project type'
      });
    }

    // Set headers for Server-Sent Events
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    // Map uploaded images and fix extensions if MIME type doesn't match content
    const allImages = [];
    for (const img of images) {
      const fixedPath = await fixImageExtension(img.path);
      allImages.push(fixedPath);
    }

    // Process style reference image if provided
    let styleRefImagePath = null;
    if (styleRefFiles.length > 0) {
      styleRefImagePath = await fixImageExtension(styleRefFiles[0].path);
      console.log(`🎨 Style reference image: ${path.basename(styleRefImagePath)}`);
    }

    const params = {
      projectType,
      instructions,
      destination,
      theme,
      level: level || 5,
      decorationLevel: decorationLevel || 8,
      crazymeter: crazymeter || null,
      style: style || '',
      styles: parsedStyles,
      ratio: ratio || '1:1',
      productType: productType || 'bottle-opener',
      includeShapeConstraints: includeShapeConstraints === 'true',
      photoStyle: photoStyle || null,
      turboMode: turboMode === 'true',
      images: allImages,
      styleReferenceImage: styleRefImagePath
    };

    console.log('\n📥 Received streaming request:', {
      project: PROJECTS[projectType].name,
      variations: count,
      hasImages: images.length > 0,
      imageFiles: images.map(img => img.filename),
      hasStyleRef: !!styleRefImagePath,
      level: params.level,
      decorationLevel: params.decorationLevel,
      crazymeter: params.crazymeter,
      turboMode: params.turboMode
    });

    // Send initial message
    res.write(`data: ${JSON.stringify({ type: 'start', total: count })}\n\n`);

    // Generate variations with streaming callback
    generateVariations(params, count, (variation, index, total) => {
      // Send variation immediately when ready
      res.write(`data: ${JSON.stringify({
        type: 'variation',
        variation: variation,
        index: index,
        total: total
      })}\n\n`);
    }).then(() => {
      // Send completion message
      res.write(`data: ${JSON.stringify({ type: 'complete' })}\n\n`);
      res.end();
    }).catch((error) => {
      // Send error message
      res.write(`data: ${JSON.stringify({ type: 'error', error: error.message })}\n\n`);
      res.end();
    });

  } catch (error) {
    console.error('❌ Error in streaming endpoint:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Get project info
app.get('/api/projects', (req, res) => {
  const projectsInfo = {};
  for (const [key, value] of Object.entries(PROJECTS)) {
    projectsInfo[key] = {
      name: value.name,
      color: value.color,
      icon: value.icon
    };
  }
  res.json(projectsInfo);
});

// AI Instructions Analyzer endpoint
app.post('/api/analyze-instructions', upload.array('images'), async (req, res) => {
  try {
    const images = req.files || [];

    if (images.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'No images provided'
      });
    }

    console.log(`\n🤖 AI INSTRUCTIONS ANALYZER`);
    console.log(`Analyzing ${images.length} instruction image(s)...`);

    // Build the analysis prompt
    const analyzePrompt = `You are analyzing client instruction images (WhatsApp screenshots, emails, notes, etc.) to extract design requirements for souvenir products.

ANALYZE THE IMAGE(S) AND EXTRACT ALL OF THESE FIELDS:

1. **instructions** - The main design request/instructions from the client. Combine all relevant text into clear design instructions. Be specific and detailed.

2. **destination** - The location/place name if mentioned (e.g., "Trilobit Museo Restaurante", "Cancún", "Hermosillo", etc.)

3. **theme** - Any theme mentioned (e.g., "fossils", "beach", "desert", "tropical", "Christmas", "marine", etc.)

4. **style** - Art style. CHOOSE based on context clues:
   - "cartoon" - for playful, colorful, fun designs (most common for souvenirs)
   - "realistic" - for detailed, naturalistic designs
   - "collage" - for mixed media, layered, artistic designs
   - "photography" - if they mention photos, real images, or photographic elements
   If not specified, VARY your choice based on what fits the theme best.

5. **ratio** - Image format. CHOOSE based on product or context:
   - "1:1" - square format (good for magnets, most products)
   - "2:1" - horizontal/landscape (good for panoramic views, landscapes)
   If not specified, choose "1:1" for 60% of requests, "2:1" for 40%.

6. **productType** - Product type. CHOOSE one of: "magnet", "keychain", "bottle-opener"
   Infer from context if mentioned. If not specified, vary your choice.

7. **decorationLevel** - Decoration level (1-10). Infer from tone:
   - "mucha decoración/elaborado/detallado" = 8-10
   - "poca decoración/simple/limpio/minimalista" = 2-5
   - If not specified, choose a random value between 5-9

8. **transformeterLevel** - Transformation level (1-10). Infer from requests:
   - "cambios pequeños/similar/parecido" = 2-4
   - "cambios moderados" = 5-6
   - "cambios grandes/diferente/nuevo" = 7-10
   - If not specified, choose a random value between 4-7

9. **crazymeter** - Creativity level (1-10). Infer from tone:
   - "tradicional/clásico/normal" = 2-4
   - "creativo/único/original" = 5-7
   - "muy creativo/loco/diferente/atrevido" = 8-10
   - If not specified, choose a random value between 4-8

10. **variationCount** - Number of designs they want. Look for:
   - "X modelos", "X diseños", "X opciones" = that number
   - If not specified, default to 1

11. **photoStyle** - ONLY if style is "photography":
   - "clipping-mask" - photo fills a shape silhouette
   - "decorative-frame" - photo in an ornamental frame
   If photography style, pick one randomly if not specified.

IMPORTANT: DO NOT always use the same default values! Vary your choices based on context and when not specified, make intelligent varied selections.

RESPOND IN THIS EXACT JSON FORMAT ONLY (no other text):
{
  "instructions": "Complete design instructions extracted from the images...",
  "destination": "Place name or null",
  "theme": "Theme or null",
  "style": "cartoon",
  "ratio": "1:1",
  "productType": "magnet",
  "decorationLevel": 7,
  "transformeterLevel": 5,
  "crazymeter": 6,
  "variationCount": 1,
  "photoStyle": null
}

BE THOROUGH - read ALL text in the images including WhatsApp messages, handwriting, logos, signs, etc.`;

    // Fix image extensions and collect filenames for Claude to read
    const fixedImages = [];
    for (const img of images) {
      fixedImages.push(await fixImageExtension(img.path));
    }
    const imageFilenames = fixedImages.map(p => path.basename(p));
    const uploadPath = path.join(__dirname, 'uploads');

    // Build command with image reading
    const fullPrompt = `FIRST: Read these image files in the current directory:
${imageFilenames.map((f, i) => `${i + 1}. ${f}`).join('\n')}

THEN: ${analyzePrompt}`;

    const command = `echo ${JSON.stringify(fullPrompt)} | claude -p`;

    let output = '';

    const claude = spawn(command, [], {
      cwd: uploadPath,
      shell: true,
      env: { ...process.env }
    });

    // Timeout after 60 seconds
    const timeoutTimer = setTimeout(() => {
      claude.kill();
      res.json({
        success: false,
        error: 'Analysis timed out. Please try again.'
      });
    }, 60000);

    claude.stdout.on('data', (data) => {
      output += data.toString();
    });

    claude.stderr.on('data', (data) => {
      console.error('stderr:', data.toString());
    });

    claude.on('close', async (code) => {
      clearTimeout(timeoutTimer);
      console.log(`🤖 Analysis completed (exit: ${code})`);

      // Clean up uploaded images (use fixed paths since they may have been renamed)
      for (const imgPath of fixedImages) {
        try {
          await fs.unlink(imgPath);
        } catch (e) {}
      }

      try {
        // Extract JSON from output
        const jsonMatch = output.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const data = JSON.parse(jsonMatch[0]);
          console.log('📋 Extracted data:', data);
          res.json({
            success: true,
            data: data
          });
        } else {
          // Fallback: try to extract instructions from the raw output
          res.json({
            success: true,
            data: {
              instructions: output.trim().substring(0, 1000),
              destination: null,
              theme: null,
              style: null,
              decorationLevel: 8,
              variationCount: 1
            }
          });
        }
      } catch (parseError) {
        console.error('Parse error:', parseError);
        res.json({
          success: false,
          error: 'Could not parse analysis results'
        });
      }
    });

    claude.on('error', (error) => {
      clearTimeout(timeoutTimer);
      console.error('Claude error:', error);
      res.json({
        success: false,
        error: 'Analysis failed: ' + error.message
      });
    });

  } catch (error) {
    console.error('❌ Error in analyze endpoint:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// ============================================
// SEND TO GEMINI - Automated browser automation
// ============================================
const os = require('os');

app.post('/api/send-to-gemini', async (req, res) => {
  try {
    const { prompt, images } = req.body;

    if (!prompt) {
      return res.status(400).json({ success: false, error: 'No prompt provided' });
    }

    console.log(`\n🚀 Send to Gemini: prompt length=${prompt.length}, images=${images ? images.length : 0}`);

    const timestamp = Date.now();
    const tempDir = path.join(os.tmpdir(), `gemini-${timestamp}`);
    await fs.mkdir(tempDir, { recursive: true });

    // Save images as temp files
    const imagePaths = [];
    if (images && images.length > 0) {
      for (let i = 0; i < images.length; i++) {
        const img = images[i];
        if (img.dataUrl) {
          const matches = img.dataUrl.match(/^data:image\/(\w+);base64,(.+)$/s);
          if (matches) {
            const ext = matches[1] === 'jpeg' ? 'jpg' : matches[1];
            const buffer = Buffer.from(matches[2], 'base64');
            const filePath = path.join(tempDir, `ref-${i}.${ext}`);
            await fs.writeFile(filePath, buffer);
            imagePaths.push(filePath);
          }
        }
      }
    }

    // Write prompt to temp file
    const promptFile = path.join(tempDir, 'prompt.txt');
    await fs.writeFile(promptFile, prompt, 'utf8');

    // Python clipboard helper for images
    const clipboardHelperPath = path.join(tempDir, 'clipboard_image.py');
    await fs.writeFile(clipboardHelperPath, `#!/usr/bin/env python3
import sys
from AppKit import NSImage, NSPasteboard
image = NSImage.alloc().initWithContentsOfFile_(sys.argv[1])
if not image: sys.exit(1)
pb = NSPasteboard.generalPasteboard()
pb.clearContents()
pb.writeObjects_([image])
`, 'utf8');

    // Build fast image paste steps
    let imageSteps = '';
    for (const imgPath of imagePaths) {
      imageSteps += `
  do shell script "python3 " & quoted form of "${clipboardHelperPath}" & " " & quoted form of "${imgPath}"
  execute active tab of front window javascript "var el=document.querySelector('div[contenteditable=true][role=textbox]');if(el){el.focus();el.click();} 'ok'"
  tell application "System Events" to keystroke "v" using command down
  delay 0.5
`;
    }

    // FAST AppleScript: tight polling, minimal delays, JS text injection
    const appleScript = `
tell application "Google Chrome"
  activate
  tell front window to make new tab with properties {URL:"https://gemini.google.com/app"}
  -- Fast poll: page load
  repeat 40 times
    if not (loading of active tab of front window) then exit repeat
    delay 0.15
  end repeat
  -- Fast poll: editor ready
  repeat 30 times
    if (execute active tab of front window javascript "document.querySelector('div[contenteditable=true][role=textbox]')?'1':'0'") is "1" then exit repeat
    delay 0.15
  end repeat
  delay 0.2
  -- Focus editor
  execute active tab of front window javascript "var el=document.querySelector('div[contenteditable=true][role=textbox]');if(el){el.focus();el.click();} 'ok'"
${imageSteps}
  -- Paste text via clipboard (most reliable for Gemini)
  execute active tab of front window javascript "var el=document.querySelector('div[contenteditable=true][role=textbox]');if(el){el.focus();el.click();} 'ok'"
end tell
do shell script "cat " & quoted form of "${promptFile}" & " | pbcopy"
tell application "System Events" to keystroke "v" using command down
-- Wait for paste to register then press Enter to submit
delay 0.8
tell application "System Events"
  key code 36
end tell
return "done"
`;

    const scriptFile = path.join(tempDir, 'automate.scpt');
    await fs.writeFile(scriptFile, appleScript, 'utf8');

    exec(`osascript "${scriptFile}"`, { timeout: 30000 }, (error) => {
      setTimeout(() => { fs.rm(tempDir, { recursive: true }).catch(() => {}); }, 30000);
      if (error) console.error('  ❌ AppleScript error:', error.message);
      else console.log('  ✅ Gemini automation completed');
    });

    res.json({ success: true, message: 'Sending to Gemini...', hasImages: imagePaths.length > 0 });

  } catch (error) {
    console.error('❌ Send to Gemini error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// ═══ BULK SEND TO GEMINI (pre-open all tabs, then rapid-paste) ═══
app.post('/api/send-all-to-gemini', async (req, res) => {
  try {
    const { prompts, images } = req.body;

    if (!prompts || !Array.isArray(prompts) || prompts.length === 0) {
      return res.status(400).json({ success: false, error: 'No prompts provided' });
    }

    console.log(`\n🚀 BULK Send to Gemini: ${prompts.length} prompts, images=${images ? images.length : 0}`);

    const timestamp = Date.now();
    const tempDir = path.join(os.tmpdir(), `gemini-bulk-${timestamp}`);
    await fs.mkdir(tempDir, { recursive: true });

    // Save images as temp files
    const imagePaths = [];
    if (images && images.length > 0) {
      for (let i = 0; i < images.length; i++) {
        const img = images[i];
        if (img.dataUrl) {
          const matches = img.dataUrl.match(/^data:image\/(\w+);base64,(.+)$/s);
          if (matches) {
            const ext = matches[1] === 'jpeg' ? 'jpg' : matches[1];
            const buffer = Buffer.from(matches[2], 'base64');
            const filePath = path.join(tempDir, `ref-${i}.${ext}`);
            await fs.writeFile(filePath, buffer);
            imagePaths.push(filePath);
          }
        }
      }
    }

    // Write each prompt to its own temp file
    const promptFiles = [];
    for (let i = 0; i < prompts.length; i++) {
      const promptFile = path.join(tempDir, `prompt-${i}.txt`);
      await fs.writeFile(promptFile, prompts[i], 'utf8');
      promptFiles.push(promptFile);
    }

    // Python clipboard helper
    const clipboardHelperPath = path.join(tempDir, 'clipboard_image.py');
    await fs.writeFile(clipboardHelperPath, `#!/usr/bin/env python3
import sys
from AppKit import NSImage, NSPasteboard
image = NSImage.alloc().initWithContentsOfFile_(sys.argv[1])
if not image: sys.exit(1)
pb = NSPasteboard.generalPasteboard()
pb.clearContents()
pb.writeObjects_([image])
`, 'utf8');

    const tabCount = prompts.length;

    // ═══ FAST BULK SCRIPT: Open all tabs → parallel load → rapid paste ═══
    let script = `
tell application "Google Chrome"
  activate
  set w to front window
  -- Open ALL tabs at once (no delays between)
`;
    for (let i = 0; i < tabCount; i++) {
      script += `  tell w to make new tab with properties {URL:"https://gemini.google.com/app"}\n`;
    }
    script += `
  -- Fast parallel wait: poll ALL tabs until loaded
  set tabTotal to count of tabs of w
  repeat 50 times
    set allDone to true
    repeat with i from (tabTotal - ${tabCount - 1}) to tabTotal
      if (loading of tab i of w) then set allDone to false
    end repeat
    if allDone then exit repeat
    delay 0.15
  end repeat
  -- Quick editor init wait
  delay 0.5
end tell
`;

    // For each tab: switch + paste images + paste text (tight timing)
    for (let i = 0; i < tabCount; i++) {
      const promptFile = promptFiles[i];

      // Image paste steps for this tab
      let imgSteps = '';
      for (const imgPath of imagePaths) {
        imgSteps += `
    do shell script "python3 " & quoted form of "${clipboardHelperPath}" & " " & quoted form of "${imgPath}"
    execute active tab of w javascript "var el=document.querySelector('div[contenteditable=true][role=textbox]');if(el){el.focus();el.click();} 'ok'"
    tell application "System Events" to keystroke "v" using command down
    delay 0.4
`;
      }

      script += `
-- TAB ${i + 1}/${tabCount}
tell application "Google Chrome"
  set w to front window
  set tabTotal to count of tabs of w
  set active tab index of w to (tabTotal - ${tabCount - 1 - i})
  -- Fast poll editor ready
  repeat 20 times
    if (execute active tab of w javascript "document.querySelector('div[contenteditable=true][role=textbox]')?'1':'0'") is "1" then exit repeat
    delay 0.1
  end repeat
  execute active tab of w javascript "var el=document.querySelector('div[contenteditable=true][role=textbox]');if(el){el.focus();el.click();} 'ok'"
${imgSteps}
  execute active tab of w javascript "var el=document.querySelector('div[contenteditable=true][role=textbox]');if(el){el.focus();el.click();} 'ok'"
end tell
do shell script "cat " & quoted form of "${promptFile}" & " | pbcopy"
tell application "System Events" to keystroke "v" using command down
-- Wait for paste then press Enter to submit
delay 0.8
tell application "System Events"
  key code 36
end tell
delay 0.3
`;
    }

    script += `\nreturn "done"\n`;

    const scriptFile = path.join(tempDir, 'bulk_automate.scpt');
    await fs.writeFile(scriptFile, script, 'utf8');

    console.log(`  📝 Executing FAST bulk Gemini automation (${tabCount} tabs)...`);

    exec(`osascript "${scriptFile}"`, { timeout: 90000 }, (error) => {
      setTimeout(() => { fs.rm(tempDir, { recursive: true }).catch(() => {}); }, 30000);
      if (error) console.error('  ❌ Bulk error:', error.message);
      else console.log(`  ✅ Bulk Gemini done (${tabCount} tabs)`);
    });

    res.json({ success: true, message: `Opening ${tabCount} Gemini tabs...`, count: tabCount });

  } catch (error) {
    console.error('❌ Bulk Send to Gemini error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Function to open Chrome browser
function openChrome(url) {
  const platform = process.platform;
  let command;

  if (platform === 'darwin') {
    // macOS
    command = `open -a "Google Chrome" "${url}"`;
  } else if (platform === 'win32') {
    // Windows
    command = `start chrome "${url}"`;
  } else {
    // Linux
    command = `google-chrome "${url}" || chromium-browser "${url}"`;
  }

  exec(command, (error) => {
    if (error) {
      console.log(`⚠️  Could not auto-open Chrome: ${error.message}`);
      console.log(`💡 Please manually open: ${url}`);
    } else {
      console.log(`🌐 Opened Chrome at ${url}`);
    }
  });
}

app.listen(PORT, () => {
  const url = `http://localhost:${PORT}`;

  console.log(`
╔════════════════════════════════════════════════════════════╗
║                                                            ║
║        🎨 Design Prompt Generator - RUNNING! 🎨           ║
║                                                            ║
║        Open your browser and go to:                        ║
║                                                            ║
║        👉  http://localhost:${PORT}                          ║
║                                                            ║
║        ⚡ Now powered by Claude Code!                      ║
║        📚 Reads your project documentation automatically   ║
║                                                            ║
╚════════════════════════════════════════════════════════════╝
  `);
  console.log('\n✅ Server ready! Waiting for requests...\n');

  // Auto-open Chrome after a brief delay to ensure server is ready
  setTimeout(() => openChrome(url), 1000);
});
