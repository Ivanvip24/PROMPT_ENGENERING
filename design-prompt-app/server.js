const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;
const { spawn, exec } = require('child_process');
const app = express();
const PORT = 3001;

// ═══ SANITIZE PROMPTS: Strip non-ASCII characters that garble in clipboard/Gemini ═══
function sanitizePrompt(text) {
  if (!text) return text;
  return text
    // Replace common Unicode punctuation with ASCII equivalents
    .replace(/[\u2022\u2023\u25E6\u2043\u2219]/g, '-')   // bullets -> -
    .replace(/[\u2013\u2014\u2015]/g, '-')                 // en/em dashes -> -
    .replace(/[\u2018\u2019\u201A]/g, "'")                 // smart single quotes -> '
    .replace(/[\u201C\u201D\u201E]/g, '"')                 // smart double quotes -> "
    .replace(/\u2026/g, '...')                             // ellipsis -> ...
    .replace(/\u00A0/g, ' ')                               // non-breaking space -> space
    .replace(/\u00D7/g, 'x')                               // multiplication sign -> x
    // Replace accented characters with ASCII equivalents
    .replace(/[\u00E1\u00E0\u00E2\u00E4\u00E3]/g, 'a')    // a variants
    .replace(/[\u00C1\u00C0\u00C2\u00C4\u00C3]/g, 'A')    // A variants
    .replace(/[\u00E9\u00E8\u00EA\u00EB]/g, 'e')           // e variants
    .replace(/[\u00C9\u00C8\u00CA\u00CB]/g, 'E')           // E variants
    .replace(/[\u00ED\u00EC\u00EE\u00EF]/g, 'i')           // i variants
    .replace(/[\u00CD\u00CC\u00CE\u00CF]/g, 'I')           // I variants
    .replace(/[\u00F3\u00F2\u00F4\u00F6\u00F5]/g, 'o')    // o variants
    .replace(/[\u00D3\u00D2\u00D4\u00D6\u00D5]/g, 'O')    // O variants
    .replace(/[\u00FA\u00F9\u00FB\u00FC]/g, 'u')           // u variants
    .replace(/[\u00DA\u00D9\u00DB\u00DC]/g, 'U')           // U variants
    .replace(/\u00F1/g, 'n')                               // n tilde -> n
    .replace(/\u00D1/g, 'N')                               // N tilde -> N
    .replace(/\u00E7/g, 'c')                               // c cedilla -> c
    .replace(/\u00C7/g, 'C')                               // C cedilla -> C
    // Replace common emoji/symbols with text
    .replace(/\u26A0\uFE0F?/g, '[!]')                      // warning sign
    .replace(/\u26A1\uFE0F?/g, '>')                        // lightning bolt
    .replace(/[\u2705\u2714\uFE0F?]/g, '[OK]')             // checkmarks
    .replace(/\u274C/g, '[X]')                              // cross mark
    .replace(/[\u2122\u00AE\u00A9]/g, '')                   // TM, R, C symbols
    // Strip any remaining non-ASCII characters
    .replace(/[^\x00-\x7F]/g, '')
    // Remove banned words (case-insensitive, whole word)
    .replace(/\bpunta\b/gi, '')
    .replace(/\bsexo\b/gi, '')
    .replace(/\brounded eyes\b/gi, 'expressive eyes')
    .replace(/\bround eyes\b/gi, 'expressive eyes')
    .replace(/\bslopes?\b/gi, '')
    // Strip city taglines/nicknames that shouldn't appear in designs
    .replace(/\bLa Sultana del Norte\b/gi, '')
    .replace(/\bLa Ciudad de la Eterna Primavera\b/gi, '')
    .replace(/\bLa Perla del Pacifico\b/gi, '')
    .replace(/\bLa Perla de Occidente\b/gi, '')
    .replace(/\bLa Ciudad Blanca\b/gi, '')
    .replace(/\bLa Heroica\b/gi, '')
    // Strip percentage numbers that Gemini renders as text in the image
    .replace(/\d{1,3}[-–]\d{1,3}%/g, '')
    .replace(/\d{1,3}%/g, '')
    // Strip style words that produce ugly results in Gemini
    // Only strip when NOT preceded by "NO " or "NOT " (preserve negation context)
    .replace(/(?<!NO |NOT |no |not )\bcrosshatch(ing|ed)?\b/gi, '')
    .replace(/(?<!NO |NOT |no |not )\bhand[- ]drawn\b/gi, '')
    .replace(/(?<!NO |NOT |no |not )\bink (illustration|drawing|style|sketch)\b/gi, '')
    .replace(/(?<!NO |NOT |no |not )\bpen[- ]and[- ]ink\b/gi, '')
    .replace(/(?<!NO |NOT |no |not )\bpen[- ]stroke\b/gi, '')
    .replace(/(?<!NO |NOT |no |not )\bsketchy\b/gi, '')
    .replace(/(?<!NO |NOT |no |not )\bsketch(ed|ing)?\b/gi, '')
    .replace(/(?<!NO |NOT |no |not )\blinework\b/gi, '')
    .replace(/(?<!NO |NOT |no |not )\bline ?work\b/gi, '')
    .replace(/(?<!NO |NOT |no |not )\bink[- ]line\b/gi, '')
    .replace(/(?<!NO |NOT |no |not )\bgouache\b/gi, '')
    .replace(/(?<!NO |NOT |no |not )\bpaint splatter(s|ed)?\b/gi, '')
    .replace(/(?<!NO |NOT |no |not )\bink bleed(s|ing)?\b/gi, '')
    .replace(/\bartisanal\b/gi, 'professional')
    // Strip marigold/cempasuchil references (banned unless user asks)
    .replace(/\bmarigold\w*\b/gi, 'bougainvillea')
    .replace(/\bcempas[uú]chil\b/gi, 'bougainvillea')
    .replace(/\borange flowers?\b/gi, 'pink flowers')
    .replace(/\bgolden flowers?\b/gi, 'bright flowers')
    .replace(/  +/g, ' ').trim();
}

// Video prompts: preserve Unicode accents, enforce AXKAN accent rules
function sanitizeVideoPrompt(text) {
  if (!text) return text;
  return text
    // Replace common Unicode punctuation with ASCII equivalents
    .replace(/[\u2022\u2023\u25E6\u2043\u2219]/g, '-')
    .replace(/[\u2013\u2014\u2015]/g, '-')
    .replace(/[\u2018\u2019\u201A]/g, "'")
    .replace(/[\u201C\u201D\u201E]/g, '"')
    .replace(/\u2026/g, '...')
    .replace(/\u00A0/g, ' ')
    // AXKAN accent rules: iman -> imán, axkan -> axkán (case-insensitive)
    .replace(/\biman\b/gi, (m) => m[0] === 'I' ? 'Imán' : 'imán')
    .replace(/\bimanes\b/gi, (m) => m[0] === 'I' ? 'Imánes' : 'imánes')
    .replace(/\baxkan\b/gi, (m) => m[0] === 'A' ? 'Axkán' : 'axkán')
    // Remove banned words
    .replace(/\bpunta\b/gi, '')
    .replace(/\bsexo\b/gi, '')
    .replace(/  +/g, ' ').trim();
}

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
    cb(null, Date.now() + '-' + path.basename(file.originalname));
  }
});
const upload = multer({ storage, limits: { fileSize: 20 * 1024 * 1024 } }); // 20MB max per file

app.use(express.json({ limit: '50mb' }));
app.use(express.static('public'));
app.use('/uploads', express.static('uploads'));

// CORS-enabled static route for reference images (Envato page fetches cross-origin from localhost)
const tmpRefDir = path.join(__dirname, 'tmp-ref');
app.use('/tmp-ref', (req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    next();
}, express.static(tmpRefDir));

// Write reference images from base64 data URLs to tmp-ref directory, return filenames
async function writeRefImages(referenceImages) {
    await fs.mkdir(tmpRefDir, { recursive: true });
    // Clean old files
    const oldFiles = await fs.readdir(tmpRefDir).catch(() => []);
    for (const f of oldFiles) await fs.unlink(path.join(tmpRefDir, f)).catch(() => {});
    const written = [];
    const maxImages = Math.min(referenceImages.length, 2);
    for (let i = 0; i < maxImages; i++) {
        const dataUrl = referenceImages[i];
        if (!dataUrl || !dataUrl.startsWith('data:')) continue;
        const matches = dataUrl.match(/^data:image\/([^;]+);base64,(.+)$/s);
        if (!matches) continue;
        const ext = matches[1] === 'jpeg' ? 'jpg' : matches[1];
        const buffer = Buffer.from(matches[2], 'base64');
        if (buffer.length > 20 * 1024 * 1024) { console.warn('Skipping oversized reference image'); continue; }
        const filename = `img-${i}.${ext}`;
        await fs.writeFile(path.join(tmpRefDir, filename), buffer);
        written.push(filename);
    }
    return written;
}

// Generate JS code for reference image upload via DragEvent on Envato page
function generateRefUploadJS(filenames) {
    const urls = filenames.map(f => `http://localhost:${PORT}/tmp-ref/${f}`);
    const urlsJSON = JSON.stringify(urls);
    return `
window.__refUploadDone = false;
(async function() {
  try {
    // Step 1: Click the "Upload image references" button (small icon-only button in bottom toolbar)
    var ta = document.querySelector('[placeholder*="Describe"]');
    if (!ta) { window.__refUploadDone = true; return; }
    var toolbar = ta.parentElement;
    while (toolbar && toolbar.getBoundingClientRect().height < 60) toolbar = toolbar.parentElement;
    if (toolbar) {
      var btns = toolbar.querySelectorAll('button');
      for (var b of btns) {
        var r = b.getBoundingClientRect();
        if (r.width > 20 && r.width < 55 && r.height > 20 && r.height < 55) {
          var txt = b.textContent.trim();
          if (!txt || txt.length < 3) { b.click(); break; }
        }
      }
    }
    // Step 2: Wait for modal with file inputs
    for (var a = 0; a < 30; a++) {
      if (document.querySelectorAll('input[type=file]').length >= 2) break;
      await new Promise(function(r) { setTimeout(r, 200); });
    }
    // Step 3: Fetch images from local server and drop into dropzones
    var urls = ${urlsJSON};
    var blobs = await Promise.all(urls.map(function(u) {
      return fetch(u).then(function(r) { return r.blob(); }).catch(function() { return null; });
    }));
    var inputs = document.querySelectorAll('input[type=file]');
    blobs.forEach(function(blob, idx) {
      if (!blob || !inputs[idx]) return;
      var file = new File([blob], 'ref' + idx + '.png', { type: 'image/png' });
      var dz = inputs[idx].parentElement;
      while (dz && (dz.offsetHeight < 100 || dz.offsetWidth < 100)) dz = dz.parentElement;
      if (!dz) return;
      var dt = new DataTransfer();
      dt.items.add(file);
      ['dragenter', 'dragover', 'drop'].forEach(function(t) {
        dz.dispatchEvent(new DragEvent(t, { bubbles: true, cancelable: true, dataTransfer: dt }));
      });
    });
    // Step 4: Wait for processing, then close modal
    await new Promise(function(r) { setTimeout(r, 2000); });
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', code: 'Escape', keyCode: 27, bubbles: true }));
  } catch(e) { console.error('ref upload error:', e); }
  window.__refUploadDone = true;
})();
`;
}

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
      console.log(`[~] Converting ${detectedFormat.ext} -> .png (unsupported format): ${path.basename(filePath)}`);
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
    console.log(`🔧 Fixed image extension: ${path.basename(filePath)} -> ${path.basename(newPath)}`);
    return newPath;
  } catch (e) {
    console.error(`[!] fixImageExtension error: ${e.message}`);
    return filePath;
  }
}

// Project configurations with folder mappings
// ═══════════════════════════════════════════════════════════════
// UNIVERSAL IMAGE QUALITY ENFORCEMENT
// Applied to EVERY generated prompt before returning to user.
// Ensures all outputs produce crisp, sharp, high-quality images
// regardless of reference image quality or style chosen.
// ═══════════════════════════════════════════════════════════════
function enforceImageQuality(promptText) {
  if (!promptText || promptText.length < 50) return promptText;
  // Prevent double-application
  if (promptText.includes('[MANDATORY IMAGE QUALITY')) return promptText;

  const QUALITY_BLOCK = `\n\n[MANDATORY IMAGE QUALITY - NON-NEGOTIABLE]\nRendering: Crisp, razor-sharp edges on every element. Ultra-high resolution (4K+ detail level). Every line, shape, and color boundary must be pixel-perfect with zero blur or softness.\nClarity: No blur, no soft focus, no fuzzy edges, no compression artifacts, no watercolor bleeding, no airbrushed softness. Clean precise vector-quality edges even on organic shapes.\nColors: Vivid, fully saturated, punchy colors with high contrast. Rich deep blacks, pure bright whites, intense chromatic colors. No washed-out, muddy, or desaturated tones.\nDetails: Ultra-detailed at every zoom level - fine textures visible, intricate patterns crisp, small text perfectly legible. Professional product design quality.\nLighting: Clean, even studio lighting that reveals all details. No dark muddy shadows that hide elements.\nBackground: PURE WHITE background - absolutely NO dark, black, grey, textured, gradient, or colored backgrounds. The design floats on CLEAN WHITE.\nText: Title text uses 1-2 colors ONLY - NEVER rainbow or multicolor letters. Text is INTEGRATED into the artwork, not a separate floating label.\nStyle: NO watercolor, NO painterly effects, NO paint splatters, NO ink bleeds. Clean crisp edges only. NO 3D mockup or physical product appearance.\nIMPORTANT: If using reference images as inspiration, IGNORE their resolution/quality entirely. Generate as if creating a brand-new master-quality image from scratch.`;

  // Check if prompt already ends with CREATE DESIGN
  const createDesignIdx = promptText.lastIndexOf('CREATE DESIGN');
  if (createDesignIdx > 0) {
    // Insert quality block BEFORE "CREATE DESIGN"
    return promptText.substring(0, createDesignIdx).trimEnd() + QUALITY_BLOCK + '\n\nCREATE DESIGN';
  }

  // Otherwise append at end
  return promptText.trimEnd() + QUALITY_BLOCK;
}

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
    icon: '[~]',
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
    try {
    // Check if this is a letter-fill magnet design
    const instructionLower = (instruction || '').toLowerCase();
    const isLetterFill = params.productType === 'magnet' && /\b(letter.?fill|photo.?fill|each\s+letter\s+(shows?|contains?|filled|has)|inside\s+(of\s+)?(the\s+)?letters?|uneven\s+letters?|block\s+letters?|3d\s+letters?|chunky\s+letters?|letras?\s+(rellenas?|con\s+fotos?|con\s+imagenes?))\b/i.test(instructionLower);

    let turboPrompt;

    // Hoist style detection so it's available for all code paths (turbo product realism, style ref injection, etc.)
    const _instructionLowerGlobal = (instruction || '').toLowerCase();
    const _hybridKeywordsGlobal = ['mix real', 'real elements', 'real and cartoon', 'real with cartoon', 'realistic and cartoon', 'photo and cartoon', 'photo with cartoon', 'real photos', 'actual photos', 'camera quality', 'photorealistic mix', 'blend real', 'real element', 'mezcla real', 'elementos reales'];
    const _detectedHybridGlobal = _hybridKeywordsGlobal.some(kw => _instructionLowerGlobal.includes(kw));
    const _effectiveStyle = _detectedHybridGlobal ? 'hybrid' : (params.style || '');

    if (isLetterFill) {
      // LETTER-FILL TURBO TEMPLATE
      const destination = params.destination || 'DESTINATION';
      const letters = destination.toUpperCase().split('');
      const letterList = letters.map((l, i) => `- ${l}: [Iconic ${destination} scene #${i + 1}]`).join('\n');

      turboPrompt = `> TURBO LETTER-FILL MAGNET GENERATOR >

OUTPUT EXACTLY THIS FORMAT (80-150 words MAX):

FORMAT: ${params.ratio || '2:1'}
PRODUCT: Letter-fill souvenir magnet  - "${destination}"
LETTER STYLE: Bold chunky 3D letters with natural wood material, slightly uneven heights for handcrafted feel
LETTER ARRANGEMENT: "${destination}" spelled horizontally, each letter is a photo window
PHOTO FILLS  - Each letter shows a DIFFERENT ${destination} scene:
${letterList}
MATERIAL: 3D letters with subtle texture. Vivid photos fill each letter edge-to-edge. NO external border or outline around the letters.
BACKGROUND: Clean white or transparent, no frames or borders
STYLE: Flat front-facing view of a souvenir magnet design. NO borders, NO outlines around the design.

CREATE DESIGN

---
REQUEST: ${instruction}
DESTINATION: ${destination}
---

CRITICAL: Keep it SIMPLE. No decoration, no supporting elements, no text banners. Just photo-filled letters as a product.
RESPOND WITH ONLY THE FILLED PROMPT. NO EXPLANATIONS. START DIRECTLY WITH "FORMAT:"`;

    } else {
      // STANDARD TURBO TEMPLATE (visually rich version)
      // _effectiveStyle is hoisted above the if/else block
      console.log(`> STYLE DEBUG: params.style="${params.style}", detected_hybrid=${_detectedHybridGlobal}, effective="${_effectiveStyle}", instruction="${instruction?.substring(0, 80)}..."`);

      // Branch template based on effective style
      if (_effectiveStyle === 'hybrid') {
        turboPrompt = `> TURBO PROMPT GENERATOR - HYBRID REAL+CARTOON DESIGN >

[!] ABSOLUTE RULE: This prompt MUST produce a design that MIXES photorealistic and cartoon elements. If your output describes everything in ONE style (all cartoon OR all realistic), you have FAILED.

OUTPUT EXACTLY THIS FORMAT (250-400 words):

FORMAT: ${params.ratio || '1:1'}
SUBJECT: [Describe main element + destination in ONE vivid sentence]
STYLE: HYBRID Real+Cartoon composition  - this design MIXES two rendering styles in ONE image. Some elements are PHOTOREALISTIC (camera-quality, real textures, real lighting, as if photographed) and other elements are BOLD CARTOON ILLUSTRATIONS (thick outlines, flat vibrant colors, stylized). The contrast and coexistence of both styles is the defining visual feature. Think "Who Framed Roger Rabbit" aesthetic  - real and cartoon in the same frame.
PHOTOREALISTIC ELEMENTS (these MUST look like real photographs  - camera quality, real textures, real lighting):
- [Real element 1  - describe with photographic language: "actual photograph of...", "camera-captured...", "real feather/fur/stone texture...", "natural sunlight on..."]
- [Real element 2  - landmark, animal, plant, or nature scene described as REAL]
- [Real element 3  - use words: photorealistic, camera-quality, real depth of field, natural lighting]
- [Add 2-4 more real elements]
CARTOON ELEMENTS (these MUST look illustrated  - bold outlines, flat colors, stylized):
- [Cartoon element 1  - describe with illustration language: "bold cartoon text...", "illustrated border...", "colorful cartoon flowers..."]
- [Cartoon element 2  - decorative patterns, stylized characters, illustrated frames]
- [Cartoon element 3  - use words: bold outlines, vibrant flat colors, cartoon style, illustrated]
- [Add 2-4 more cartoon elements]
COMPOSITION:
- [How the real and cartoon elements INTERACT  - cartoon elements framing real photos, illustrated borders around photographic subjects, etc.]
- [Visual flow and depth]
PROTAGONIST: [Main subject  - 40 words. If the main subject should be REAL (animal, landmark), describe it as PHOTOREALISTIC with camera-quality detail. If cartoon, describe with illustration language.]
COLORS: [6-8 colors  - real elements have natural/photographic colors, cartoon elements have bold saturated colors]
TEXT: "${params.destination || 'DESTINATION'}" - [placement: BOLD and PROMINENT], [size: 18-25% height], [style: CARTOON/ILLUSTRATED  - bold colorful letters with outlines, shadows, 3D effect]
DECORATION: ${params.decorationLevel || 7}/10  - Cartoon-style decorative fills (illustrated flowers, patterns, sparkles) around and between the photorealistic elements.
EDGE: IRREGULAR silhouette  - cartoon/illustrated elements define the outer edges while photorealistic elements sit within.
BACKGROUND: Clean white/transparent
CREATE DESIGN

---
REQUEST: ${instruction}
${params.destination ? `DESTINATION (MANDATORY — must appear as primary title text even if not mentioned in instructions): ${params.destination}` : ''}
${params.theme ? `THEME: ${params.theme}` : ''}
---

CRITICAL QUALITY CHECK: Before outputting, verify your prompt contains BOTH "photorealistic/camera-quality/real photograph" AND "cartoon/illustrated/bold outlines" language. If ALL elements are described the same way, REWRITE to ensure the mix. The viewer must clearly see BOTH photographic and illustrated elements in the final image.
RESPOND WITH ONLY THE FILLED PROMPT. NO EXPLANATIONS. NO INTRODUCTIONS. START DIRECTLY WITH "FORMAT:"`;

      } else if (_effectiveStyle === 'realistic' || _effectiveStyle === 'photography') {
        turboPrompt = `> TURBO PROMPT GENERATOR - PHOTOREALISTIC DESIGN >

[!] ABSOLUTE RULE: This is NOT an illustration or cartoon. Every element must look PHOTOREALISTIC  - like a professional photograph or high-end photo composite.

OUTPUT EXACTLY THIS FORMAT (250-400 words):

FORMAT: ${params.ratio || '1:1'}
SUBJECT: [Describe main element + destination in ONE vivid sentence]
STYLE: ${_effectiveStyle === 'photography' ? 'Photography-based design with REAL photo elements (actual photographic quality  - NOT illustrated) integrated into decorative frames and cultural compositions' : 'PHOTOREALISTIC  - real-world photographic quality with camera-lens depth of field, natural lighting, real material textures. This is NOT an illustration  - it must look like a HIGH-END PHOTOGRAPH or cinema-quality photomanipulation'}
COMPOSITION:
- [Composition described as a PHOTO COMPOSITE or PHOTOGRAPHIC SCENE  - not a sticker or illustration]
- [Camera angle, lighting direction, depth of field]
- [Real-world spatial relationships between elements]
PROTAGONIST: [Main subject  - 40 words with PHOTOGRAPHIC language: real feather texture, natural light catching fur, actual stone grain, genuine fabric texture. NO illustration language.]
ELEMENTS (8-12 items  - all PHOTOREALISTIC):
- [Element 1  - described as a real photograph: "actual photo of...", "camera-captured...", "real texture of..."]
- [Element 2  - natural colors, real lighting, genuine materials]
- [Element 3]
- [Element 4]
- [Element 5]
- [Element 6]
- [Element 7]
- [Element 8]
- [Add more as needed  - all must look REAL, not illustrated]
COLORS: [6-8 NATURAL photographic colors  - rich but realistic, not cartoon-saturated]
TEXT: "${params.destination || 'DESTINATION'}" - [placement: BOLD], [size: 18-25% height], [style: elegant dimensional text that fits the photographic aesthetic  - metallic, embossed, or naturally integrated]
DECORATION: ${params.decorationLevel || 6}/10  - Natural decorative elements (real flowers, real leaves, natural textures)  - NOT cartoon sparkles or illustrated confetti.
EDGE: IRREGULAR organic outline shaped by the photographic elements  - NOT a sticker or badge look.
BACKGROUND: Clean white/transparent
CREATE DESIGN

---
REQUEST: ${instruction}
${params.destination ? `DESTINATION (MANDATORY — must appear as primary title text even if not mentioned in instructions): ${params.destination}` : ''}
${params.theme ? `THEME: ${params.theme}` : ''}
---

CRITICAL: NO illustration language in your output. Do NOT use words like "cartoon", "illustrated", "bold outlines", "flat colors", "sticker", "vector". Use ONLY photographic language: "photorealistic", "camera-quality", "real texture", "natural lighting", "depth of field", "cinematic".
RESPOND WITH ONLY THE FILLED PROMPT. NO EXPLANATIONS. NO INTRODUCTIONS. START DIRECTLY WITH "FORMAT:"`;

      } else {
        // DEFAULT: Cartoon/Collage/Other styles  - original sticker-style template
        turboPrompt = `> TURBO PROMPT GENERATOR - MAXIMUM SPEED, MAXIMUM VISUAL IMPACT >

[!!!] ABSOLUTE RULES (NON-NEGOTIABLE):
1. BACKGROUND: "on a PURE WHITE background". NEVER dark, black, grey, textured, gradient, or colored backgrounds. WHITE ONLY.
2. PRODUCT NOT POSTER: This is a DIE-CUT SOUVENIR PRODUCT (like a sticker or magnet) floating on white — NOT a poster, NOT a landscape scene, NOT a full-bleed illustration. The design must have an IRREGULAR SILHOUETTE with white space around it. NEVER fill the entire square/rectangle.
3. NO SCENES: NEVER use these words: skyline, sunset, sunrise, horizon, panorama, vista, atmosphere, desert floor, golden sun, sun peeking. NEVER describe sky, ground, or environment. Describe OBJECTS clustered on white.
4. REAL SPECIFIC ELEMENTS: When the user mentions a landmark, building, volcano, mountain, etc. — describe the REAL, SPECIFIC one from that destination with its distinctive features. "Volcano" for Puebla = Popocatépetl (snow-capped, distinctive cone with saddle shape). "Church" for Puebla = Catedral de Puebla (twin bell towers, blue/white talavera dome). NEVER use generic versions.

OUTPUT EXACTLY THIS FORMAT (250-400 words):

FORMAT: ${params.ratio || '1:1'}
SUBJECT: [Describe main element + destination in ONE vivid sentence  - make it EXCITING]
STYLE: ${(() => {
          const turboStyleMap = {
            'cartoon': 'Clean, professional flat vector illustration with bold saturated colors, smooth gradients, cel-shading. Crisp sharp edges. Elements blend seamlessly using color contrast and shadows.',
            'collage': 'Rich mixed media collage with layered cutouts, torn paper edges, overlapping textures (fabric, paper, photos, patterns), dimensional depth  - like a handcrafted art piece. On PURE WHITE background.'
          };
          return turboStyleMap[_effectiveStyle] || (_effectiveStyle ? _effectiveStyle.charAt(0).toUpperCase() + _effectiveStyle.slice(1) + ' style. Clean, professional, crisp edges. NO black outlines, NO contour lines. Premium product design quality.' : 'Clean, professional flat vector illustration with bold saturated colors, smooth gradients, cel-shading. Crisp sharp edges, no outlines.');
        })()}
HERO + UNIFIED COMPOSITION (THIS IS THE MOST IMPORTANT SECTION):
[Describe ONE unified cluster where everything OVERLAPS and CONNECTS into a single cohesive shape. The hero element is the LARGEST piece (50-70% of design). Supporting elements grow FROM, wrap AROUND, cascade DOWN, or nestle INTO the hero — they are NOT floating separately. Everything touches or overlaps something else. Think of it as ONE connected object, not separate pieces placed near each other.

Example of GOOD description: "A massive talavera heart dominates the center, with bougainvillea cascading down its left side, a small church dome peeking from behind the upper right, and decorative swirls extending from the bottom — all overlapping into one unified cluster."

Describe your design as ONE CONNECTED PIECE with 50-70 words. The hero is [main element], with 2-4 smaller elements PHYSICALLY OVERLAPPING it.]
COLORS: [4-6 BOLD saturated color names from a COHESIVE palette  - 3-4 dominant colors max, NOT rainbow, NOT every color]
TEXT:
• Primary: "${(params.destination || 'DESTINATION').toUpperCase()}" in BOLD UPPERCASE LETTERS - [placement: OVERLAPPING the hero illustration, not below it], [size: 20-25% height — BIG and DOMINANT], [style: each letter is ONE SOLID FLAT COLOR — no gradients, no effects, no textures within letters. Use 1-2 colors total for the text. Bold clean block letters, PART of the artwork not a label]
• Secondary: "[State Name, México]" - [placement: near primary text], [size: 6-8% height]. LITERALLY ONLY "State Name, México" (e.g., "Nuevo León, México", "Puebla, México"). NEVER add city nicknames like "La Sultana del Norte", "La Ciudad Blanca", "La Perla del Pacífico", "Angelópolis" etc. NEVER add taglines, slogans, or cultural phrases. Just "[State], México".
EDGE: The outer silhouette must be IRREGULAR and ASYMMETRIC, shaped by the design elements themselves (a palm tree poking out one side, waves flowing along the bottom, flowers extending beyond borders). The design fades naturally into the white background  - NO black outline, NO contour border, NO sticker-edge line, NO white border around the design.
BACKGROUND: PURE WHITE  - absolutely NO dark backgrounds, NO black, NO grey, NO gradients, NO textures, NO colored backgrounds. The design floats as an irregular shape on CLEAN WHITE, NOT inside any frame, border, or circular badge.
CREATE DESIGN

---
REQUEST: ${instruction}
${params.destination ? `DESTINATION (MANDATORY — must appear as primary title text even if not mentioned in instructions): ${params.destination}` : ''}
${params.theme ? `THEME: ${params.theme}` : ''}
---

CRITICAL DESIGN RULES (YOUR PROMPT MUST FOLLOW ALL OF THESE):
1. PURE WHITE BACKGROUND: The prompt MUST say "on a pure white background" or "on a clean white background". NEVER dark, black, grey, textured, or gradient backgrounds. This is NON-NEGOTIABLE.
2. PROFESSIONAL QUALITY: Must look like it was designed by a professional graphic designer. Clean, polished, intentional. NOT cheap-looking AI collage or watercolor mess.
3. ONE CLEAR DOMINANT HERO (MOST IMPORTANT RULE): The main subject must occupy 50-70% of the design and be MUCH LARGER than everything else. This is NOT a collage of many equal-size objects. It's ONE BIG hero element with a few SMALL supporting accents around it. If the user says "talavera heart" then a GIANT talavera heart dominates the center. Supporting elements are tiny accents, not co-stars.
4. STYLE CONSISTENCY: ALL elements MUST share the SAME clean illustration style. No mixing watercolor with vector. No 3D/plush/felt textures. No painterly/watercolor effects.
5. FLAT DESIGN: Flat, front-facing product design. NOT a 3D object, NOT a photograph, NOT a scene.
6. COHESIVE COLOR PALETTE: Use 3-4 dominant colors that complement each other. NOT every color of the rainbow.
7. TEXT: Use 1-2 colors ONLY for title text. NEVER rainbow or multicolor letters where each letter is a different color. Text must be INTEGRATED into the composition, not a separate floating label.
8. NO FLOATING ELEMENTS: EVERY element and text must PHYSICALLY TOUCH or OVERLAP the main design cluster. NOTHING, floating in empty space — no tiles hovering in corners, no flowers scattered independently, no text sitting below the design in a separate area. Everything is ONE connected piece.
9. TEXT OVERLAPS THE HERO: The destination text must be ON TOP of or OVERLAPPING the illustration, not underneath it in a separate zone.
10. NO OUTLINES OR BORDERS: No black outlines, no white sticker-edge contour, no frame around the design.
11. NO WATERCOLOR/PAINTERLY: Do NOT use watercolor washes, paint splatters, ink bleeds, or painterly textures. Clean crisp edges only.
12. NO 3D MOCKUP: Do NOT describe the design as a physical object (plastic, rubber, embossed). It's a flat graphic design.
RESPOND WITH ONLY THE FILLED PROMPT. NO EXPLANATIONS. NO INTRODUCTIONS. START DIRECTLY WITH "FORMAT:"`;
      }
    }

    console.log(`\n> TURBO MODE - Haiku 4.5 | max-turns 1 | 15s timeout`);

    let output = '';

    // ═══ ISOLATED TEMP DIRECTORY for turbo mode (prevents cross-contamination) ═══
    const turboHasImages = (params.images && params.images.length > 0) || params.styleReferenceImage;
    const turboTempDir = turboHasImages
      ? path.join(__dirname, 'tmp', `turbo-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`)
      : path.join(__dirname, 'tmp', 'turbo-empty');
    await fs.mkdir(turboTempDir, { recursive: true });
    const turboPath = turboTempDir;

    // Handle images for turbo mode  - copy ONLY current images to isolated temp dir
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

    // INJECT PRODUCT PHOTOGRAPHY REALISM FOR ALL PRODUCT TYPES IN TURBO MODE
    if (params.productType) {
      const turboProductDescriptions = {
        'bottle-opener': 'a flat, front-facing design for a bottle opener souvenir with a tall vertical shape and an arch opening at the top. The design has an organic irregular silhouette. NO border, NO outline, NO frame around the design - the artwork goes edge to edge.',
        'magnet': 'a flat, front-facing design for a souvenir magnet with an organic irregular silhouette shape (NOT a rectangle or circle - edges follow the design elements). NO border, NO outline, NO frame around the design - the artwork goes edge to edge.',
        'keychain': 'a flat, front-facing design for a keychain souvenir with a small organic shape and a metal ring at the top. NO border, NO outline, NO frame around the design - the artwork goes edge to edge.'
      };
      const turboProductDesc = turboProductDescriptions[params.productType] || turboProductDescriptions['magnet'];

      finalPrompt = `[!!!] CRITICAL: FLAT FRONT-FACING DESIGN VIEW (NON-NEGOTIABLE) [!!!]

Your output prompt MUST describe a FLAT, FRONT-FACING design on a CLEAN WHITE BACKGROUND.
This is NOT product photography. This is NOT a 3D object. There is NO depth, NO shadow, NO angle, NO perspective.

The VERY FIRST LINE of your output (before FORMAT:) MUST be:
"${turboProductDesc} On a clean white background."

[!!!] MANDATORY VIEW RULES:
- The design is shown PERFECTLY FLAT - as if it were a sticker laid flat on a scanner
- PURE WHITE background - no shadows, no gradients, no textures behind the design
- NO 3D perspective, NO angled view, NO tilting, NO depth effect
- NO product photography language (no "studio lighting", no "85mm lens", no "f/2.8", no "drop shadow")
- NO physical object descriptions (no "glossy film", no "MDF wood", no "you could pick up")
- NO borders, NO outlines, NO frames around the design - the artwork goes edge to edge with NO external border of any color
- The viewer sees the design STRAIGHT ON from directly above/in front - completely flat
- Think of it as a FLAT DIGITAL STICKER FILE viewed on screen, not a physical product photo
- The design MUST feature BIG, BOLD title/text letters as the main visual element - text uses 1-2 colors only, never rainbow or multicolor letters
- Title text should be LARGE, PROMINENT, and use VIVID COLORS (not plain white or plain black text)

BANNED WORDS/PHRASES in your output: "product photography", "studio lighting", "drop shadow", "glossy finish", "physical product", "MDF", "wood edge", "pick up", "floating angle", "45-degree", "f/2.8", "85mm lens", "catches light", "light reflections", "tan border", "beige border", "#D4A574", "brown border", "wood border", "border around", "outline around", "frame around", "punta", "sexo"

NOW GENERATE THE PROMPT:

${finalPrompt}`;
    }

    // Style reference injection (takes priority, but respects selected style)
    const _isRealisticStyle = ['realistic', 'photography', 'hybrid'].includes(_effectiveStyle);
    const _qualityKeywords = _isRealisticStyle
      ? 'Crisp sharp ultra-detailed, clean precise edges, no blur, no artifacts, high-resolution professional quality'
      : 'Ultra-detailed, high-resolution professional quality, no compression artifacts  - match the EXACT rendering style of the reference image';

    if (turboStyleRef) {
      const _styleOverrideNote = _isRealisticStyle
        ? `\n[!] STYLE CONSTRAINT: The user selected "${_effectiveStyle}" style. Do NOT extract a cartoon/illustration style from the reference image. Instead, extract ONLY the composition approach, color palette, and rendering technique. Do NOT extract any subjects, characters, or objects from the style reference. The RENDERING STYLE must remain ${_effectiveStyle === 'hybrid' ? 'a MIX of PHOTOREALISTIC elements and CARTOON elements (see STYLE field in the template below)' : 'PHOTOREALISTIC (see STYLE field in the template below)'}.`
        : '';
      finalPrompt = `FIRST: Read the STYLE REFERENCE image: ${turboStyleRef}
After reading, extract ONLY the VISUAL STYLE: art style/rendering technique, color palette (saturation, temperature), composition approach (density, layering), and decoration level.${_styleOverrideNote}
[!] CRITICAL: This is a STYLE REFERENCE ONLY. Do NOT include any specific objects, characters, subjects, or content elements from this image in your prompt. Extract ONLY the visual style, colors, rendering technique, textures, and composition approach. The actual content/subject of the design comes from the user's description below, NOT from this reference image. If the reference is low-res or blurry, IGNORE that.
${_isRealisticStyle ? 'The STYLE/RENDERING must follow the STYLE field in the template below  - do NOT override it with the reference image style.' : 'Your generated prompt MUST begin with a 2-3 sentence STYLE BLOCK that precisely describes this visual style so the image AI can replicate it.'}
ALSO include: "${_qualityKeywords}."
${turboImages.length > 1 ? `\nALSO read these reference images: ${turboImages.filter(f => f !== turboStyleRef).join(', ')}` : ''}

THEN: ${turboPrompt}`;
    } else if (turboImages.length > 0) {
      if (params.projectType === 'variations') {
        // Turbo + variations + reference image: structured analysis
        const _varStyleNote = _isRealisticStyle
          ? `\n[!] STYLE CONSTRAINT: The user selected "${_effectiveStyle}" style. Extract the SUBJECT and COMPOSITION from the reference, but the rendering style must follow the STYLE field in the template below${_effectiveStyle === 'hybrid' ? ' (mix of PHOTOREALISTIC and CARTOON elements)' : ' (PHOTOREALISTIC rendering)'}.`
          : '\nKeep the same character, same destination, same style.';
        finalPrompt = `FIRST: Read image file(s): ${turboImages.join(', ')}

IMPORTANT  - REFERENCE IMAGE VARIATION:
After reading the image, identify: the PROTAGONIST (character/animal/element), their POSE, CLOTHING, SUPPORTING ELEMENTS, COLORS, and COMPOSITION.${_varStyleNote}
Your generated prompt MUST describe the SAME protagonist and elements in a DIFFERENT pose/composition/context.
Do NOT create a completely unrelated design. Keep the same character and destination.
[!] If the reference image is low-quality/blurry  - IGNORE the quality, only extract the CONCEPT. Your prompt must produce a CRISP, SHARP result.
[!] If the reference is a PHOTO of a physical product (on fabric, table, surface)  - IGNORE the photo background entirely. Extract ONLY the design concept. Your prompt MUST specify "clean pure white background" and describe a NEW flat graphic design, NOT a photo of a physical object.
Include in your prompt: "${_qualityKeywords}, vivid saturated colors, on a clean pure white background."

THEN: ${turboPrompt}`;
      } else {
        // ALL project types with reference images in turbo mode: analyze style
        const _refStyleNote = _isRealisticStyle
          ? `\n\n[!] STYLE CONSTRAINT: The user selected "${_effectiveStyle}" style. Do NOT extract a cartoon/illustration rendering style from the reference images. Extract ONLY the subject matter, color palette, composition, and elements. The RENDERING STYLE must follow the STYLE field in the template below${_effectiveStyle === 'hybrid' ? ' (some elements PHOTOREALISTIC, others CARTOON  - see STYLE field)' : ' (PHOTOREALISTIC rendering  - see STYLE field)'}.`
          : '';
        const _refQualityKw = _isRealisticStyle
          ? '"crisp sharp ultra-detailed", "clean precise edges", "high-resolution professional quality", "vivid saturated colors"'
          : '"crisp sharp vector illustration", "clean precise edges", "high-resolution detailed artwork", "professional product-quality rendering"';
        const _refQualityLine = _isRealisticStyle
          ? '"ultra-detailed, sharp clean edges, vivid saturated colors, no blur, no artifacts, professional quality"'
          : '"ultra-detailed, sharp clean lines, vibrant saturated colors, no blur, no artifacts, no soft edges, professional illustration quality"';
        finalPrompt = `FIRST: Read image file(s): ${turboImages.join(', ')}

IMPORTANT  - REFERENCE IMAGE ANALYSIS:
After reading the image(s), FAITHFULLY describe the specific subjects you see. These are the elements the user wants in their design. Extract:
- SUBJECT IDENTITY: What exactly is each image? (statue, monument, landmark, person, animal, etc.)
- PHYSICAL DETAILS: Exact pose, materials (bronze, stone), clothing, items held, distinctive features
- KEY CHARACTERISTICS: What makes each subject UNIQUE and recognizable — describe with precision
${_isRealisticStyle ? '- REALISTIC RENDERING: Describe subjects as they appear — real materials, textures, lighting' : '- ART STYLE: Translate the real subjects into the chosen illustration style while keeping them recognizable'}${_refStyleNote}

[!] CRITICAL RULES:
- The reference subjects are the HEROES — describe them with enough detail for accurate reproduction
- Do NOT replace specific subjects with generic versions
- Keep supporting elements MINIMAL and relevant — do NOT overwhelm the main subjects with filler
- Do NOT add marigolds, generic flowers, or cultural clichés unless the user asks for them
- Your prompt MUST include these quality keywords: ${_refQualityKw}
- If the reference image looks low-resolution or blurry, IGNORE the quality  - describe the SUBJECT in detail, then specify a PRISTINE high-quality version
- Add to your prompt: ${_refQualityLine}

[!!!] NEW DESIGN, NOT A PHOTO COPY (NON-NEGOTIABLE):
- The reference image is INSPIRATION ONLY. Your prompt must create a BRAND NEW, FRESH, HIGH-QUALITY design.
- NEVER reproduce the reference photo's background (fabric, table, grey surface, etc.) — ALWAYS specify "clean pure white background".
- NEVER reproduce the reference photo's quality issues (blur, grain, low resolution, compression artifacts, poor lighting).
- NEVER describe the physical product itself (plastic magnet, rubber texture, 3D embossed surface) — describe a FLAT GRAPHIC DESIGN.
- Extract ONLY the design concept, subjects, composition, and style — then describe a PRISTINE new version as if a professional designer created it from scratch.
- Your prompt MUST explicitly state: "on a clean pure white background" — NO EXCEPTIONS.

THEN: ${turboPrompt}`;
      }
    }

    // Log the final prompt for debugging style issues
    console.log(`\n> FINAL PROMPT PREVIEW (first 500 chars):\n${finalPrompt.substring(0, 500)}\n...`);
    console.log(`> PROMPT STYLE CHECK: contains "photorealistic"=${finalPrompt.toLowerCase().includes('photorealistic')}, "cartoon"=${finalPrompt.toLowerCase().includes('cartoon')}, "illustration"=${finalPrompt.toLowerCase().includes('illustration')}, "hybrid"=${finalPrompt.toLowerCase().includes('hybrid')}`);

    const hasImagesForTurbo = turboImages.length > 0;
    const turboFlags = hasImagesForTurbo ? '--allowedTools "Read,Glob"' : '';
    // With images: need extra turns for reading files then responding (1 per image + 1 for response). Without: single shot.
    const turboMaxTurns = hasImagesForTurbo ? `--max-turns ${turboImages.length + 2}` : '--max-turns 1';
    console.log(`> Turbo command: --model haiku ${turboMaxTurns} | images=${turboImages.length} | flags=${turboFlags || 'none'}`);
    const command = `echo ${JSON.stringify(finalPrompt)} | claude -p --model claude-haiku-4-5-20251001 ${turboMaxTurns} ${turboFlags}`;

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

    // Turbo timeout: 30s without images, 45s with images (Claude CLI cold start can take 10-15s)
    const turboTimeout = hasImagesForTurbo ? 45000 : 30000;
    const timeoutTimer = setTimeout(async () => {
      claude.kill();
      await cleanupTurbo();
      if (output && output.length > 50) {
        resolve(sanitizePrompt(enforceImageQuality(output)));
      } else {
        reject(new Error('Turbo timeout - try again'));
      }
    }, turboTimeout);

    claude.stdout.on('data', (data) => {
      output += data.toString();
    });

    claude.stderr.on('data', (data) => {
      console.error('stderr:', data.toString());
    });

    claude.on('close', async (code) => {
      clearTimeout(timeoutTimer);
      console.log(`> Turbo completed (exit: ${code})`);
      await cleanupTurbo();

      if (output && output.length > 50) {
        // Clean output - remove any greeting text
        let cleanOutput = output;
        const formatIndex = cleanOutput.indexOf('FORMAT:');
        if (formatIndex > 0) {
          cleanOutput = cleanOutput.substring(formatIndex);
        }
        resolve(enforceImageQuality(cleanOutput.trim()));
      } else {
        reject(new Error('Turbo failed to generate output'));
      }
    });

    claude.on('error', async (error) => {
      clearTimeout(timeoutTimer);
      await cleanupTurbo();
      reject(new Error(`Turbo error: ${error.message}`));
    });
    } catch (err) { reject(err); }
  });
}

// Function to invoke Claude Code in the project directory
async function invokeClaude(projectType, instruction, params) {
  return new Promise(async (resolve, reject) => {
    try {
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
          // Sanitize filename: remove non-ASCII chars that cause Claude Code to fail reading files
          const rawStyleName = path.basename(params.styleReferenceImage);
          const styleRefFilename = 'style-ref-' + rawStyleName.replace(/[^\x20-\x7E]/g, '-');
          styleRefProjectPath = path.join(tempDir, styleRefFilename);
          await fs.copyFile(params.styleReferenceImage, styleRefProjectPath);
          projectImages.push(styleRefProjectPath);
          console.log(`🎨 Copied style reference to temp dir: ${styleRefFilename}`);
        }
      } catch (error) {
        console.error('[X] Error setting up temp directory:', error);
        reject(new Error(`Failed to set up isolated directory: ${error.message}`));
        return;
      }
    }

    // Build the full instruction with parameters
    let fullInstruction = instruction;

    // ═══ AUTO-DETECT HYBRID INTENT from user instructions (non-turbo path) ═══
    const _ntInstructionLower = (instruction || '').toLowerCase();
    const _ntHybridKeywords = ['mix real', 'real elements', 'real and cartoon', 'real with cartoon', 'realistic and cartoon', 'photo and cartoon', 'photo with cartoon', 'real photos', 'actual photos', 'camera quality', 'photorealistic mix', 'blend real', 'real element', 'mezcla real', 'elementos reales'];
    const _ntDetectedHybrid = _ntHybridKeywords.some(kw => _ntInstructionLower.includes(kw));
    if (_ntDetectedHybrid) {
      params.style = 'hybrid'; // Force hybrid style when user mentions mixing real+cartoon
      console.log(`> NON-TURBO: AUTO-DETECTED HYBRID STYLE from user instruction keywords. Overriding style to "hybrid".`);
    }
    const _ntIsRealisticStyle = ['realistic', 'photography', 'hybrid'].includes(params.style);

    // ═══ VISUAL RICHNESS PREAMBLE (for from-scratch and previous-element) ═══
    // These modes were producing sparse, minimal designs. This injects a mandate
    // for visual density, layered details, and attention-grabbing richness.
    if (projectType === 'from-scratch' || projectType === 'previous-element') {
      if (_ntIsRealisticStyle) {
        // HYBRID / REALISTIC / PHOTOGRAPHY preamble — no sticker/illustration language
        fullInstruction += `\n\n${'='.repeat(50)}
> MANDATORY VISUAL RICHNESS RULES (NON-NEGOTIABLE)
${'='.repeat(50)}

[!!!] PURE WHITE BACKGROUND (NON-NEGOTIABLE): Your output prompt MUST specify "on a pure white background" or "on a clean white background". NEVER dark, black, grey, textured, gradient, or colored backgrounds. WHITE ONLY. NO EXCEPTIONS.

Your output prompt MUST produce a PROFESSIONAL, POLISHED product design.
${params.style === 'hybrid' ? `
[!!!] CRITICAL STYLE RULE  - HYBRID REAL+CARTOON:
This design MIXES two rendering styles: photorealistic elements (camera-quality, real textures) and cartoon elements (flat colors, stylized). The contrast is the key visual feature.
` : params.style === 'realistic' ? `
[!!!] CRITICAL STYLE RULE  - PHOTOREALISTIC:
Every element must look like a real photograph. Do NOT use "illustration", "cartoon", "outlines", "flat colors" in your output.
` : params.style === 'photography' ? `
[!!!] CRITICAL STYLE RULE  - PHOTOGRAPHY:
This design uses REAL photo elements  - actual photographic quality, NOT illustrations.
` : ''}
DESIGN REQUIREMENTS:
1. **ONE DOMINANT HERO (MOST IMPORTANT)**  - The main subject requested by the user MUST dominate 50-70% of the design. It should be MUCH LARGER than everything else. This is NOT a collage of equal-size objects. It's ONE BIG hero with small supporting accents around it.
2. **3-5 SMALL SUPPORTING ELEMENTS**  - Supporting elements are ACCENTS (10-20% the size of the hero each), not co-stars. They orbit the hero, they don't compete with it. Quality over quantity.
3. **VIVID MODERN COLORS**  - Bold, saturated, BRIGHT colors. NEVER default to vintage/sepia/warm brown/earth tone/muted palettes  - these make designs look OLD and CHEAP.
4. **FLAT PRODUCT DESIGN**  - NOT a 3D object or photo of a physical item. Flat graphic design.
5. **STYLE CONSISTENCY**  - ALL elements in the same rendering style. No mixing.${params.style === 'hybrid' ? ' Exception: hybrid intentionally mixes photo + cartoon.' : ''}
6. **IRREGULAR SILHOUETTE ON WHITE**  - Design floats on white background, NOT a wallpaper filling the entire area.
7. **TEXT SIZE HIERARCHY**  - Destination name (e.g., "PUEBLA") must be 2-3x LARGER than any subtitle. Clear hierarchy: BIG destination > medium subtitle > small location.
8. **NO EXTERNAL DECORATION**  - No decorative ribbons, scattered tiles, confetti, swirls, or ornamental filler the user didn't ask for.
9. **TEXT INTEGRATION (CRITICAL)**  - Text must feel like an INTEGRAL PART of the illustration, not a separate layer floating on top. Weave text INTO the composition: let illustrations overlap, wrap around, or interlock with the letters. Text and art should share colors, shadows, and visual weight so they read as ONE cohesive design, not "illustration + label slapped underneath."
10. **ARCHITECTURAL FAITHFULNESS**  - When depicting real buildings, monuments, churches, temples, or landmarks from reference images or known locations, preserve the EXACT structural details: number of towers, dome shapes, window patterns, facade elements, arches, and proportions. You may stylize the RENDERING (cartoon, flat, illustrated) but NEVER alter the architecture itself. The building must be recognizable as THAT specific building.

[X] NEVER add random filler elements the user didn't ask for
[X] NEVER mix rendering styles (unless hybrid)${params.style === 'hybrid' ? '' : `
[X] NEVER use 3D/plush/felt/glossy textures  - flat design only`}
[X] NEVER produce a flat, single-layer composition with no depth
[X] NEVER create LANDSCAPE SCENES with skies, sunsets, horizons, clouds, or atmospheric backgrounds  - NO orange sunset gradients, NO mountain panoramas, NO scenic vistas. Background is ALWAYS white.
[X] NEVER describe an environment or "scene"  - describe OBJECTS arranged in a shape on white, like a die-cut sticker product
[X] NEVER default to vintage/sepia/muted/earth tone colors  - use BRIGHT VIVID MODERN colors
[X] NEVER add decorative ribbons, scattered tiles, or ornamental filler not requested by the user
[X] NEVER place text as a disconnected label below or above the art  - text must be visually woven INTO the composition
[X] NEVER alter the architectural details of real buildings/monuments  - stylize the rendering, preserve the structure
[X] NEVER use watercolor washes, paint splatters, ink bleeds, or painterly textures  - clean crisp edges ONLY
[X] NEVER use dark, black, grey, or colored backgrounds  - ALWAYS pure white background
[X] NEVER use rainbow/multicolor text where each letter is a different color  - use 1-2 colors max for ALL text
[X] NEVER describe the design as a physical 3D object (plastic, rubber, embossed, sticker on surface)  - it is a FLAT graphic design
[OK] ALWAYS describe photorealistic elements with camera/photo language
[OK] ALWAYS describe cartoon elements with illustration/outline language
${'='.repeat(50)}`;
      } else {
        // CARTOON / COLLAGE / DEFAULT preamble — original sticker language
        fullInstruction += `\n\n${'='.repeat(50)}
> MANDATORY VISUAL RICHNESS RULES (NON-NEGOTIABLE)
${'='.repeat(50)}

[!!!] PURE WHITE BACKGROUND (NON-NEGOTIABLE): Your output prompt MUST specify "on a pure white background" or "on a clean white background". NEVER dark, black, grey, textured, gradient, or colored backgrounds. WHITE ONLY. NO EXCEPTIONS.

Your output prompt MUST produce a PROFESSIONAL, POLISHED souvenir product design.

DESIGN QUALITY REQUIREMENTS:
1. **ONE DOMINANT HERO (MOST IMPORTANT)**  - The user's requested subject is the HERO. It MUST dominate 50-70% of the design and be MUCH LARGER than everything else. This is NOT a collage of many equal-size objects  - it's ONE BIG central element with small accents around it. If the user says "talavera heart" then a GIANT talavera heart is the center of the design. If they say "iglesias" then ONE prominent church dominates.
2. **3-5 SMALL SUPPORTING ACCENTS**  - Supporting elements should be 10-20% the size of the hero each. They ORBIT the hero, they don't COMPETE with it. Do NOT clutter the design with many equal-size objects. Quality over quantity.
3. **STYLE CONSISTENCY (CRITICAL)**  - ALL elements MUST share the EXACT SAME rendering style. If cartoon: EVERYTHING is cartoon (same line weight, same shading, same proportions). If realistic: EVERYTHING is realistic. NEVER mix styles. No 3D/plush/felt textures mixed with flat illustrations. No photorealistic water mixed with cartoon characters. The design must look like ONE artist created the ENTIRE thing.
4. **FLAT PRODUCT DESIGN**  - This is a FLAT, FRONT-FACING graphic design printed on a product  - NOT a 3D object, NOT a photograph, NOT a scene with camera perspective. Think: professional vector illustration. No depth-of-field blur, no 3D shadows, no physical material textures (felt, plush, glossy plastic, embossed metal).
5. **DESIGN WITH BREATHING ROOM**  - The design must NOT span the entire white area like a wallpaper. It must have a clear IRREGULAR SILHOUETTE that floats on white background with visible white space around it. The design is a SHAPE, not a full-bleed image.
6. **ALL ELEMENTS FULLY VISIBLE**  - Every element 100% visible. Nothing cut off at edges.
7. **VIVID SATURATED COLORS**  - BOLD, PUNCHY, MODERN colors that POP. No washed-out tones. NEVER default to vintage/sepia/warm brown/earth tone/muted palettes  - these make designs look OLD and CHEAP. Use BRIGHT, CONTEMPORARY colors unless the user specifically asks for vintage.
8. **TEXT SIZE HIERARCHY (CRITICAL)**  - The destination name (e.g., "PUEBLA") must be the BIGGEST, BOLDEST text  - at least 2-3x larger than any subtitle. It should DOMINATE the text area. Secondary text like "Angelópolis" should be noticeably smaller. Tertiary text like "Puebla, Mexico" should be the smallest. Clear visual hierarchy: BIG destination > medium subtitle > small location.
9. **NO EXTERNAL DECORATION**  - Do NOT add decorative ribbons, scattered tiles, confetti, sparkles, swirls, or ornamental filler around the design. Only include elements that the user asked for or that directly represent the destination. Every element must have a PURPOSE.
10. **PREMIUM PRODUCT LOOK**  - Must look like a professionally designed product for mass production. Clean, polished, intentional.
11. **TEXT INTEGRATION (CRITICAL)**  - Text must feel like an INTEGRAL PART of the illustration, not a separate layer floating on top. Weave text INTO the composition: let illustrations overlap, wrap around, or interlock with the letters. Text and art should share colors, shadows, and visual weight so they read as ONE cohesive design, not "illustration + label slapped underneath."
12. **ARCHITECTURAL FAITHFULNESS**  - When depicting real buildings, monuments, churches, temples, or landmarks from reference images or known locations, preserve the EXACT structural details: number of towers, dome shapes, window patterns, facade elements, arches, and proportions. You may stylize the RENDERING (cartoon, flat, illustrated) but NEVER alter the architecture itself. The building must be recognizable as THAT specific building.

[X] NEVER add elements the user didn't ask for just to fill space  - if user asks for a butterfly, the design is ABOUT the butterfly with minimal supporting elements
[X] NEVER produce wallpaper-like designs that fill the entire rectangular area  - the design must be an irregular shape floating on white
[X] NEVER create LANDSCAPE SCENES with skies, sunsets, horizons, clouds, atmospheric gradients, or environmental backgrounds  - this produces travel postcards, NOT souvenir products
[X] NEVER describe a "sky" or "sunset" or "horizon" or "clouds" or "birds flying in the distance" in the background  - the background is ALWAYS pure white
[X] NEVER mix rendering styles (felt + cartoon, realistic + illustration, 3D + flat)
[X] NEVER produce 3D objects or photographs of physical items  - flat graphic design only
[X] NEVER add black outlines, contour lines, or sticker-edge borders
[X] NEVER default to marigolds/cempasúchil unless explicitly requested
[X] NEVER use generic filler (random toucans, suns, limes, ferns, gems) that don't relate to the user's specific request
[X] NEVER default to vintage, sepia, warm brown, earth tone, or muted color palettes  - these make designs look old, cheap, and unimpressive. Use BRIGHT VIVID MODERN colors.
[X] NEVER add decorative ribbons, scattered tiles, confetti, swirls, or ornamental filler that the user didn't ask for
[X] NEVER place text as a disconnected label below or above the art  - text must be visually woven INTO the composition
[X] NEVER alter the architectural details of real buildings/monuments  - stylize the rendering, preserve the structure
[X] NEVER use watercolor washes, paint splatters, ink bleeds, or painterly textures  - clean crisp edges ONLY
[X] NEVER use dark, black, grey, or colored backgrounds  - ALWAYS pure white background
[X] NEVER use rainbow/multicolor text where each letter is a different color  - use 1-2 colors max for ALL text
[X] NEVER describe the design as a physical 3D object (plastic, rubber, embossed, sticker on surface)  - it is a FLAT graphic design
[OK] ALWAYS make the main subject the dominant focus of the design
[OK] ALWAYS maintain one consistent rendering style throughout
[OK] ALWAYS create an organic irregular silhouette shape on white background
[OK] ALWAYS make ONE element the clear dominant HERO — it should be significantly larger than everything else
[OK] ALWAYS use a cohesive color palette (3-4 dominant colors max) — not every color of the rainbow

ANTI-PATTERNS TO AVOID (these produce cheap, unprofessional results):
[X] Rainbow/multicolor text where each letter is a different color — use 1-2 colors max for text
[X] Floating sparkles, water drops, hearts, gems, confetti scattered randomly — these look cheap
[X] Multiple elements of equal size competing for attention — ONE hero must dominate
[X] White sticker-edge contour/outline around the design shape — NO outlines at all
[X] Elements crammed together with no spacing — give elements room to breathe
[X] Generic tropical filler (random monstera leaves, generic flowers, sparkles) unrelated to the destination
[X] Text that blends into the design instead of standing out — text must have clear contrast and hierarchy
[X] LANDSCAPE/SCENIC compositions — orange sunsets, mountain ranges, village panoramas, sky gradients, horizon lines. These make POSTCARDS not SOUVENIRS. The design must be an isolated cluster of elements on white, like a die-cut sticker.
[X] Describing a "scene" or "environment" — describe OBJECTS and ELEMENTS arranged in a shape, not a window into a world
[X] VINTAGE/SEPIA/MUTED aesthetic — warm browns, golden yellows, earth tones, parchment textures, aged paper looks. Unless user asks for vintage, use MODERN VIVID colors.
[X] Decorative ribbons, scattered tiles, random ornamental filler — only include elements the user specifically asked for or that represent the destination
[X] Text where destination name and subtitle are similar size — "PUEBLA" must be MUCH BIGGER than "Angelópolis"
${hasImages ? `
[!] REFERENCE IMAGES: The subjects in the reference photos are the PRIORITY. Describe them faithfully. Keep supporting elements to 4-6 maximum.` : ''}
${'='.repeat(50)}`;
      }
    }

    // ═══ STYLE REFERENCE IMAGE ANALYSIS ═══
    if (styleRefProjectPath) {
      const styleRefFilename = path.basename(styleRefProjectPath);
      fullInstruction += `\n\n${'='.repeat(50)}
[!] MANDATORY STYLE REFERENCE IMAGE (NON-NEGOTIABLE)
${'='.repeat(50)}

BEFORE generating any prompt, you MUST read and deeply analyze this STYLE REFERENCE IMAGE:
File: ${styleRefFilename}

Use the Read tool to read this image file. Then extract ONLY the VISUAL STYLE ATTRIBUTES listed below.

[!] CRITICAL RULE: This is a STYLE REFERENCE ONLY. Do NOT include any specific objects, characters, subjects, figures, or content elements from this reference image in your generated prompt. The doll, animal, person, car, building, or ANY other subject you see in the reference image must be COMPLETELY IGNORED as content. Extract ONLY how it looks (the style), NOT what it shows (the content). The actual content/subject of the design comes ONLY from the user's description and project parameters below.

A) ART STYLE (copy EXACTLY from reference):
- Line style: thick/thin/no outlines? Black outlines? Line weight?
- Shading approach: flat colors? gradients? cell-shading? watercolor? soft shadows?
- Rendering: clean vector? hand-drawn? textured? digital painting? realistic?
- Overall aesthetic: cute/kawaii? vintage? modern? folk art? sticker-art? premium?

B) COLOR PALETTE (match EXACTLY from reference):
- Identify the 6-8 dominant colors and their exact saturation/temperature
- Note color relationships (complementary, analogous, triadic, etc.)
- Your output prompt MUST use the SAME color family and saturation level as the reference

C) COMPOSITION APPROACH (replicate from reference):
- Layout pattern: centered? layered? radial? diagonal? scattered?
- Element density: how packed/sparse is the reference?
- Depth layering: how many visual layers? How do they overlap?
- Negative space usage: minimal? balanced? generous?

D) TEXTURE & DETAIL LEVEL (match from reference):
- Surface textures: smooth? rough? embroidered? glossy? matte?
- Detail density: minimal? moderate? intricate? maximal?
- Decorative fills: what fills the gaps? patterns? petals? sparkles?

E) MOOD & ENERGY (capture from reference):
- Overall feeling: playful? sophisticated? festive? dramatic? warm?
- Visual energy: calm? dynamic? explosive? whimsical?

[!] REMINDER: Extract ONLY categories A-E above (the visual style). Do NOT extract or mention any specific subjects, characters, objects, or content from the reference image.

YOUR OUTPUT PROMPT MUST:
${_ntIsRealisticStyle ? `1. Begin with a 3-4 sentence STYLE BLOCK. ${params.style === 'hybrid' ? 'CRITICAL: The style is HYBRID  - your STYLE BLOCK must describe a MIX of photorealistic photo elements (camera-quality, real textures) AND cartoon illustrated elements (bold outlines, flat colors). Extract ONLY the COMPOSITION APPROACH and COLOR PALETTE from the reference  - do NOT extract any subjects, characters, or objects.' : 'CRITICAL: The style is PHOTOREALISTIC  - do NOT extract cartoon/illustration style from the reference. Extract only the composition approach and color palette  - NOT any subjects or objects.'}
2. Use a color palette inspired by the reference
3. Match the detail density and composition approach
4. ${params.style === 'hybrid' ? 'Describe photorealistic elements as "real photograph of...", "camera-captured...", "photo cutout of..." and cartoon elements as "bold cartoon illustrated...", "colorful drawn..."' : 'Use ONLY photographic language: "photorealistic", "camera-quality", "real photograph", "natural lighting"'}
5. Include these MANDATORY quality keywords: "Crisp, sharp, ultra-detailed. Clean precise edges, no blur, no artifacts, high-resolution professional quality."
6. Do NOT include any subjects, characters, figures, or objects from the style reference image  - content comes ONLY from the user's description.

[!] IMPORTANT: The user selected "${params.style}" style. ${params.style === 'hybrid' ? 'Extract ONLY the visual style and color approach from the reference  - NOT any subjects or content. The rendering style must be a MIX of real photographs and cartoon illustrations. Do NOT make everything one style.' : 'Do NOT convert photographic reference images into illustrations. Maintain photorealistic rendering.'} If the reference image is low-resolution or blurry, IGNORE the quality  - extract ONLY the style.

${params.style === 'hybrid' ? 'The style is HYBRID  - this OVERRIDES any tendency to make everything cartoon or everything realistic. You MUST mix both.' : 'The rendering style must be ' + params.style + '.'}` : `1. Begin with a 3-4 sentence STYLE BLOCK that describes this EXACT visual style so the image AI can replicate it  - if the reference is a 3D render, describe a 3D render. If it's a soft/fluffy style, describe soft/fluffy. If it's a cartoon, describe cartoon. MATCH the rendering technique EXACTLY as you see it.
2. Use the SAME color palette, saturation, and temperature as the reference
3. Match the SAME level of detail density and decoration
4. Replicate the SAME art style and rendering approach  - do NOT default to "cartoon illustration" if the reference is a different style (3D render, watercolor, realistic painting, etc.)
5. Include quality keywords that MATCH the reference style. Do NOT hard-code "illustration"  - instead, describe the actual rendering: "soft 3D render" for 3D, "bold cartoon illustration with thick outlines" for cartoon, "watercolor painting" for watercolor, etc. Always add: "high-resolution, professional quality, no compression artifacts, detailed."

[!] IMPORTANT: If the style reference image is low-resolution, blurry, or has compression artifacts  - COMPLETELY IGNORE the image quality. Extract ONLY the artistic style, color palette, and composition approach. Your prompt must produce a HIGH-QUALITY result in the SAME rendering style as the reference.

This style reference OVERRIDES the style dropdown selection. The reference image IS the style.
DO NOT deviate from this style. If the reference has SOFT edges, describe SOFT edges. If it has BOLD outlines, describe BOLD outlines. If it's a 3D render with volumetric lighting, describe a 3D render with volumetric lighting. MATCH the reference rendering EXACTLY  - do NOT default to any other style.`}
${'='.repeat(50)}`;
    }

    // Add context based on parameters
    if (params.destination) {
      fullInstruction += `\n\n[!] MANDATORY DESTINATION (NON-NEGOTIABLE): "${params.destination}"
The PRIMARY TEXT in the design MUST be "${params.destination}" — even if the user's instructions don't mention this name. This is the destination provided via the DESTINATION key field and it MUST appear prominently in the design as the main title text. Do NOT omit it. Do NOT replace it with anything else.`;
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
        'cartoon': 'Cartoon - Playful cartoon style with vibrant saturated colors, dynamic shading, NO black outlines, NO contour lines around elements  - elements blend seamlessly without borders',
        'realistic': 'Realistic - PHOTOREALISTIC rendering  - every element must look like a real photograph or high-end photo composite. Camera-quality depth of field, real material textures, natural lighting. This is NOT an illustration  - do NOT use words like illustration, cartoon, outlines, or sticker.',
        'collage': 'Collage - CRITICAL: Create a true mixed media COLLAGE design with these specific requirements:\n  - Use layered cutout style with visible edges and overlapping elements\n  - Include varied textures (paper, fabric, photo fragments, patterns)\n  - Mix different art styles and media types (photos, illustrations, patterns, text)\n  - Create depth through overlapping layers with shadows/highlights\n  - Use irregular torn/cut edges on elements (NOT perfect vector shapes)\n  - Include decorative elements like tape, borders, stamps, or stitching effects\n  - Intentional composition that looks hand-assembled from multiple sources\n  - This should look like physical collage art, NOT a regular illustration',
        'photography': 'Photography - Photography-based design with real photo elements integrated into the composition. Combine real photography with illustrated elements, decorative frames, or use photos as texture fills for regional shapes.',
        'hybrid': 'Hybrid Real+Cartoon - CRITICAL MANDATORY STYLE:\n  [!!!] This design MUST contain TWO VISUALLY DISTINCT rendering styles in ONE image:\n  REAL PHOTO ELEMENTS: Describe key subjects (animals, landmarks, waterfalls, nature) as ACTUAL PHOTOGRAPHS  - use these exact words in your prompt: "real photograph of...", "photo cutout of...", "camera-captured image of...", "stock photo quality image of...". These elements must have real camera depth of field, real natural lighting, real fur/feather/stone textures  - as if cut from a real photo and placed into the design.\n  CARTOON ELEMENTS: Describe text, borders, decorative elements, patterns as BOLD CARTOON ILLUSTRATIONS  - use words: "cartoon illustrated...", "bold black outlines...", "flat vibrant colors...", "hand-drawn...".\n  The VISUAL CONTRAST between the real photo cutouts and the cartoon drawings is what makes this style unique. The viewer must CLEARLY see both a real photograph and a cartoon illustration in the same image.\n  Think: a real photo of a parrot physically cut out and placed on a cartoon-drawn jungle background with illustrated colorful text.\n  [!!!] QUALITY CHECK: If your output describes ALL elements with the same rendering language (all "illustration" or all "photograph"), you have FAILED. REWRITE until both styles are present.'
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

      // MANDATORY: Flat front-facing design view for ALL product types
      const productDescriptions = {
        'bottle-opener': 'a flat, front-facing design for a bottle opener souvenir (approximately 3" x 6") with a tall vertical shape, a rounded arch opening at the top, a narrow neck, and a wider rounded base. NO border, NO outline, NO frame around the design - the artwork goes edge to edge.',
        'magnet': 'a flat, front-facing design for a souvenir magnet (approximately 3.5" x 4") with an organic, irregular silhouette shape (NOT a rectangle or circle - edges follow the design elements). NO border, NO outline, NO frame around the design - the artwork goes edge to edge.',
        'keychain': 'a flat, front-facing design for a keychain souvenir (approximately 1.5-2.5") with a small organic shape and a metal ring at the top. NO border, NO outline, NO frame around the design - the artwork goes edge to edge.'
      };

      const productDesc = productDescriptions[params.productType] || productDescriptions['magnet'];

      fullInstruction += `\n\n${'='.repeat(50)}
CRITICAL: FLAT FRONT-FACING DESIGN VIEW (NON-NEGOTIABLE)
${'='.repeat(50)}

Your generated prompt MUST describe a FLAT, FRONT-FACING design on a CLEAN WHITE BACKGROUND.
This is NOT product photography. This is NOT a 3D object.

The prompt you generate MUST START with:
"${productDesc} On a clean white background."

MANDATORY FLAT VIEW RULES:
1. The design is shown PERFECTLY FLAT - as if it were a sticker laid flat on a scanner
2. PURE WHITE background - no shadows, no gradients, no textures behind the design
3. NO 3D perspective, NO angled view, NO tilting, NO depth effect whatsoever
4. NO product photography language (no "studio lighting", no "85mm lens", no "f/2.8", no "drop shadow")
5. NO physical object descriptions (no "glossy film", no "MDF wood", no "you could pick up", no "physical depth")
6. NO borders, NO outlines, NO frames around the design - the artwork goes edge to edge with NO external border of any color
7. The viewer sees the design STRAIGHT ON from directly in front - completely flat
8. Think of it as a FLAT DIGITAL STICKER FILE viewed on screen, not a physical product photo
9. The design MUST feature BIG, BOLD title/text letters as the main visual element - text uses 1-2 colors only, never rainbow or multicolor letters
10. Title text should be LARGE, PROMINENT, and use VIVID COLORS (not plain white or plain black text)

BANNED WORDS/PHRASES in your output prompt (DO NOT USE ANY OF THESE):
"product photography", "studio lighting", "drop shadow", "glossy finish", "physical product", "MDF", "wood edge", "pick up", "floating angle", "45-degree", "f/2.8", "85mm lens", "catches light", "light reflections", "physical depth", "weight", "tan border", "beige border", "#D4A574", "brown border", "wood border", "border around", "outline around", "frame around", "punta", "sexo", "sunset sky", "orange sky", "sunset gradient", "dramatic sky", "sky above", "clouds above", "birds flying in the distance", "mountain range in the background", "panoramic view", "scenic vista", "horizon line", "atmospheric perspective", "environmental scene", "landscape background", "sepia toned", "vintage aged", "warm earth tones", "parchment texture", "aged paper", "antique finish", "muted palette", "faded colors"

DO generate prompts that describe a FLAT DESIGN viewed STRAIGHT-ON on a WHITE BACKGROUND.
${'='.repeat(50)}`;

      // Add shape constraints if this is a bottle opener AND user has uploaded shape references
      if (params.productType === 'bottle-opener' && params.images && params.images.length > 0) {
        fullInstruction += `\n\n${'!'.repeat(50)}
MANDATORY PRODUCT SILHOUETTE SHAPE (THIS IS THE #1 PRIORITY - NON-NEGOTIABLE)
${'!'.repeat(50)}

Your FORMAT line MUST say: "Tall vertical product shape  - NOT a rectangle, NOT a circle, NOT a badge."

The design MUST fit within this EXACT silhouette outline (describe this PRECISELY in your output prompt):

SILHOUETTE DESCRIPTION (put this at the VERY START of your output prompt):
"The entire design fits within a TALL VERTICAL custom silhouette shape: at the very top, there is a ROUNDED ARCH OPENING (like an upside-down U or horseshoe) which is a cutout/hole  - this is the most distinctive feature and MUST be clearly visible. Below the arch opening, the shape NARROWS into a slim neck section. Then the shape WIDENS into a large rounded base that contains the main artwork. The overall proportions are approximately 2:1 height-to-width ratio. Think of a guitar pick shape but taller, with an arch-shaped hole at the top."

CRITICAL SHAPE RULES:
1. The ARCH OPENING at the top is MANDATORY  - without it, the shape is wrong
2. The shape must be VERTICAL (taller than wide)  - NOT horizontal, NOT square
3. The neck must be NARROWER than the base
4. The base is the WIDEST part and holds most of the design content
5. One of the reference images shows this EXACT shape  - study it carefully
6. Do NOT produce a rectangular badge, circular emblem, or generic rounded shape

Your output prompt MUST begin the FORMAT/SHAPE section with this silhouette description. The AI image generator needs to understand this is a SPECIFIC PRODUCT SHAPE, not a standard rectangle.
${'!'.repeat(50)}`;
      }

      // Count content reference images (exclude shape templates and style references)
      if (params.images && params.images.length > 0) {
        const contentImageCount = params.images.filter(img => {
          const name = path.basename(img).toLowerCase();
          return !name.includes('bottle-opener-shape') && !name.includes('vertical bottle opener') && !name.includes('horizontal bottle opener') && !name.includes('shape-ref') && !name.includes('style-ref');
        }).length;
        if (contentImageCount > 0) {
          fullInstruction += `\n\n[!] REFERENCE IMAGE COUNT: There are ${contentImageCount} content reference images uploaded. Your generated prompt MUST describe and include ALL ${contentImageCount} of them in the design. Do NOT skip any reference image. Each one must appear as a visible element in the final design.`;
        }
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
    // IMPORTANT: Exclude style reference from content image list — it's handled separately above
    const contentImages = styleRefProjectPath
      ? projectImages.filter(img => img !== styleRefProjectPath)
      : projectImages;
    if (contentImages.length > 0) {
      const imageFilenames = contentImages.map(img => path.basename(img));

      // For VARIATIONS with reference images: structured two-phase analysis
      if (projectType === 'variations') {
        fullInstruction = `[!] OVERRIDE: When reference images are provided, the "fresh unique creation" and "NO cross-referencing" rules DO NOT APPLY. Your job is to create variations OF THE REFERENCE IMAGE, not ignore it.

PHASE 1  - DEEPLY ANALYZE THE REFERENCE IMAGE(S):
Use the Read tool to read these image file(s) in the current directory:
${imageFilenames.map((f, i) => `${i + 1}. ${f}`).join('\n')}

After reading, you MUST extract ALL of the following in detail:

A) PROTAGONIST IDENTITY:
- Exact character type (e.g., "chibi-style Lele doll with oversized head, tiny body")
- Exact clothing details (colors, patterns, embroidery, ribbons)
- Hair style, accessories, facial expression
- Body proportions (chibi? realistic? kawaii?)

B) SPECIFIC ART STYLE (THIS IS CRITICAL  - describe precisely):
- Line style: thick/thin outlines? black outlines? no outlines? line weight?
- Shading: flat colors? gradients? cell-shading? watercolor? soft shadows?
- Proportions: chibi/kawaii? realistic? exaggerated?
- Color approach: saturated? pastel? muted? neon? specific color temperature?
- Rendering: clean vector? hand-drawn? textured? digital painting?
- Overall aesthetic: cute/kawaii? vintage? modern? folk art? sticker-art?

C) ELEMENTS & COMPOSITION:
- Supporting elements: exact flowers, animals, objects (species, colors)
- Layout: centered? diagonal? layered? symmetrical?
- Background treatment: white? colored? gradient? scene?
- Decorative details: borders, sparkles, confetti, patterns?
- Text placement and style if any

PHASE 2  - GENERATE A VARIATION PROMPT THAT REPLICATES THE EXACT STYLE:
Your output prompt MUST begin with a detailed STYLE BLOCK that describes the EXACT visual style from the reference so the image AI can replicate it. This is the most important part.

YOUR PROMPT MUST INCLUDE (in this order):
1. STYLE DESCRIPTION (2-3 sentences): Describe the exact rendering style, line work, shading, and proportions from the reference. Be hyper-specific. Use terms like: "crisp vector illustration", "sharp clean edges", "flat solid color fills", "no soft shading, no airbrush, no painterly effects", "like a professional die-cut sticker product". If the reference has a clean vector look, emphasize: "sharp vector art, NOT soft cartoon, NOT watercolor, NOT painterly  - crisp clean edges like a vinyl sticker or enamel pin."
2. PROTAGONIST: Describe the SAME character with SAME clothing/accessories but in a DIFFERENT pose or action.
3. ELEMENTS: Use the SAME types of supporting elements (same flower species, same animals) but arranged differently.
4. COMPOSITION: Different layout than the reference.
5. PRODUCT-READY SILHOUETTE: The design MUST look like a FINISHED PRODUCT  - a die-cut magnet/sticker with an IRREGULAR custom silhouette. It must NOT look like a wallpaper, poster, illustration, or image inside a rectangle. The design should float on white/transparent background with its own unique organic outline shaped by the elements themselves. If someone printed this and cut along the outer edge, it should have a complex, interesting shape.

WHAT TO KEEP (sacred  - non-negotiable):
[OK] EXACT same art style, line work, shading, and rendering approach
[OK] EXACT same protagonist character with same clothing and accessories
[OK] Same types of supporting elements (if reference has marigolds and hummingbirds, variation has marigolds and hummingbirds)
[OK] Same color palette and saturation level
[OK] Same overall aesthetic feel (if reference looks like a sticker, variation looks like a sticker too)

WHAT TO CHANGE (variation elements):
[~] Protagonist pose, gesture, or action (sitting -> standing, holding flowers -> waving, etc.)
[~] Composition layout (centered -> off-center, horizontal -> vertical, etc.)
[~] Arrangement and placement of supporting elements
[~] Small decorative detail differences (different flower arrangement, different butterfly positions)

WHAT TO NEVER DO:
[X] Do NOT change the art style (if reference is kawaii chibi, don't output realistic or painterly)
[X] Do NOT change the protagonist's identity or clothing
[X] Do NOT use different types of elements (if reference has hummingbirds, don't replace with parrots)
[X] Do NOT create a completely unrelated design
[X] Do NOT output a generic "cartoon style" description  - be SPECIFIC about the exact style
[X] Do NOT create a design that looks like a wallpaper, poster, or rectangular image  - it MUST look like a die-cut PRODUCT with a custom irregular silhouette on white/transparent background
[X] Do NOT use badge, emblem, medallion, circle, or frame compositions  - the silhouette must be ORGANIC and IRREGULAR
[X] Do NOT add background gradients, sunset colors, textures, or atmospheric effects unless the reference image has them. If the reference has a WHITE/TRANSPARENT background, your prompt MUST have a white/transparent background too
[X] Do NOT use terms like "gouache", "watercolor", "painterly", "screen-print texture" if the reference is clean flat vector
[X] Do NOT write extremely long prompts. Keep the prompt between 150-350 words. Longer prompts confuse the image AI and dilute the style instructions
[X] Do NOT reproduce the reference image's QUALITY  - if it's blurry, low-res, or has artifacts, IGNORE that. Only extract the STYLE and CONCEPT.
[X] Do NOT reproduce the reference photo's BACKGROUND (fabric, table, surface, grey/dark backdrop)  - ALWAYS specify "clean pure white background"
[X] Do NOT describe the physical product (plastic, rubber, 3D embossed)  - describe a FLAT GRAPHIC DESIGN
[X] The reference is INSPIRATION  - create a BRAND NEW, PRISTINE design as if made from scratch by a professional designer

MANDATORY QUALITY KEYWORDS (include in EVERY prompt you generate):
Your output prompt MUST include these quality instructions to ensure crisp results:
- "Crisp, sharp, ultra-detailed ${_ntIsRealisticStyle ? 'photorealistic rendering' : 'illustration'}"
- "Clean precise edges, no blur, no artifacts, no soft unfocused areas"
- "High-resolution professional product-quality rendering"
- "Vivid saturated colors with strong contrast"
These override any low quality from the reference image. The AI must generate SHARP output.

PROMPT FORMAT RULES:
- The prompt must be CONCISE (150-350 words max). Short, clear prompts produce better results than long verbose ones.
- The STYLE BLOCK must be the FIRST thing in the prompt and must be the STRONGEST instruction.
- Do NOT include "WHAT THIS IS NOT" sections, "CRAZYMETER NOTES", "CONCEPT SUMMARIES", or other meta-commentary  - just the prompt itself.
- Do NOT include verification checklists or checkbox sections inside the prompt  - those go AFTER the prompt.
- Background must be CLEAN WHITE or TRANSPARENT unless the reference specifically shows otherwise.
- Every instruction in the prompt must be CONSISTENT  - do not say "white background" in one place and "sunset gradient" in another.

THEN GENERATE THE PROMPT BASED ON: ${fullInstruction}`;
      } else {
        // ALL other project types with reference images: INSPIRATION-BASED analysis
        fullInstruction = `FIRST: Use the Read tool to read these image file(s) in the current directory:
${imageFilenames.map((f, i) => `${i + 1}. ${f}`).join('\n')}

${'='.repeat(50)}
[!] REFERENCE IMAGE ANALYSIS — FAITHFULLY INCLUDE THESE SUBJECTS
${'='.repeat(50)}

These reference images show the SPECIFIC subjects/elements the user wants in their design. Your job is to FAITHFULLY DESCRIBE each subject so the image AI can reproduce them accurately.

STEP 1  - ANALYZE EACH REFERENCE IMAGE IN DETAIL:

For each uploaded image, extract and describe with EXTREME PRECISION:
A) SUBJECT IDENTITY: What exactly is this? (statue, monument, building, animal, landmark, person, object)
B) PHYSICAL DETAILS: Exact pose, clothing, items held, materials (bronze, stone, wood), textures, proportions
C) DISTINCTIVE FEATURES: What makes this specific subject unique? Describe the details that distinguish it from generic versions
D) SCALE & PRESENCE: How prominent/large should this be in the design?

[!] CRITICAL RULES FOR REFERENCE IMAGES:
- DESCRIBE each subject from the reference images with enough detail that the image AI can accurately reproduce it
- The reference subjects are the HEROES of the design — they must be PROMINENTLY featured and RECOGNIZABLE
- Do NOT replace them with generic versions (e.g., if the photo shows a specific bronze warrior statue, describe THAT warrior statue, not a generic warrior)
- Do NOT bury the reference subjects under excessive decoration — they should be the FOCUS
- ARCHITECTURAL FAITHFULNESS: If the reference shows a building, church, monument, or landmark, preserve its EXACT structural details (towers, domes, windows, arches, facade patterns, proportions). You may stylize the rendering but NEVER change the architecture itself.
- Keep supporting elements MINIMAL and RELEVANT to the location — only add elements that enhance, not overwhelm
- Do NOT default to adding marigolds, generic flowers, or cultural filler unless the user specifically asks for them
- If the reference image is blurry or low-res, still extract the subject details — IGNORE quality, describe the CONTENT

[!!!] NEW DESIGN, NOT A PHOTO COPY (NON-NEGOTIABLE):
- The reference image is INSPIRATION ONLY. Your prompt must create a BRAND NEW, FRESH, HIGH-QUALITY design.
- NEVER reproduce the reference photo's background (fabric, table, grey surface, etc.) — ALWAYS specify "clean pure white background".
- NEVER reproduce the reference photo's quality issues (blur, grain, low resolution, poor lighting).
- NEVER describe the physical product itself (plastic magnet, rubber texture, 3D embossed) — describe a FLAT GRAPHIC DESIGN.
- Extract ONLY the design concept, subjects, composition, and style — then describe a PRISTINE new version as a professional designer would create from scratch.
- Your prompt MUST explicitly state: "on a clean pure white background" — NO EXCEPTIONS.

STEP 3  - MANDATORY QUALITY KEYWORDS (include ALL of these in your output prompt):
Your generated prompt MUST include these quality instructions:
- "Crisp, sharp, ultra-detailed ${_ntIsRealisticStyle ? 'photorealistic rendering' : 'illustration'}"
- "Clean precise ${_ntIsRealisticStyle ? '' : 'vector '}edges, no blur, no artifacts, no soft unfocused areas"
- "High-resolution professional product-quality rendering"
- "Vivid saturated colors with strong contrast"
- "Every element rendered with precision and clarity"

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
          const letterList = letters.map((l, i) => `- ${l}: [Iconic ${destination} scene #${i + 1}  - specific landmark, landscape, or cultural element]`).join('\n');

          fullInstruction += `\n\n${'='.repeat(60)}
[!] LETTER-FILL MAGNET OVERRIDE (THIS REPLACES ALL OTHER TEMPLATES)
${'='.repeat(60)}

You are creating a LETTER-FILL souvenir magnet. This is a SPECIALIZED product type.

[X] DO NOT use the standard PROMPT_TEMPLATE.md composition framework.
[X] DO NOT add 5-10 supporting elements, decoration layers, or ornamental borders.
[X] DO NOT write a 200-350 word prompt. Keep it 80-150 words MAXIMUM.
[X] DO NOT add heavy text integration (15-25% height banners).

[OK] USE THIS SIMPLIFIED STRUCTURE INSTEAD:

\`\`\`
FORMAT: ${params.ratio || '2:1'}

PRODUCT: Letter-fill souvenir magnet  - "${destination}"

LETTER STYLE: Bold, chunky 3D letters with [natural wood / brushed metal / glossy acrylic] material texture. Letters are [slightly uneven in height for a handcrafted feel / uniform and clean / playfully tilted].

LETTER ARRANGEMENT: "${destination}" spelled out in [horizontal row / slightly staggered heights / gentle arc], each letter acting as a photo window.

PHOTO FILLS  - Each letter is a window/cutout showing a DIFFERENT ${destination} scene:
${letterList}

MATERIAL & FINISH: 3D letters with subtle texture [natural wood / brushed metal / glossy acrylic]. Each photo is vivid, high-resolution, fills the entire letter shape edge-to-edge. NO external border or outline around the letters or the overall design.

BACKGROUND: Clean white or transparent. The letters sit as a group  - no additional framing, badges, or borders around them.

STYLE: Photorealistic product photography of a physical souvenir magnet. The letters should look like a REAL product you could buy in a gift shop  - tangible, three-dimensional, with realistic shadows and material textures.

CREATE DESIGN
\`\`\`

CRITICAL REQUIREMENTS:
- Each letter MUST show a DIFFERENT, SPECIFIC scene from ${destination} (not generic photos)
- Choose iconic, recognizable landmarks and scenes that a tourist would associate with ${destination}
- The photos inside letters must be vivid, sharp, and fill the ENTIRE letter shape
- Letters should look like a real physical product with depth and materiality
- Keep decoration MINIMAL (2-3/10 max)  - the beauty is in the photos and letter shapes
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
        const letterList = letters.map((l, i) => `- ${l}: [Iconic ${destination} scene #${i + 1}  - specific landmark, landscape, or cultural element]`).join('\n');

        fullInstruction += `\n\n${'='.repeat(60)}
[!] LETTER-FILL MAGNET OVERRIDE (THIS REPLACES ALL OTHER TEMPLATES)
${'='.repeat(60)}

You are creating a LETTER-FILL souvenir magnet. This is a SPECIALIZED product type.

[X] DO NOT use the standard PROMPT_TEMPLATE.md composition framework.
[X] DO NOT add 5-10 supporting elements, decoration layers, or ornamental borders.
[X] DO NOT write a 200-350 word prompt. Keep it 80-150 words MAXIMUM.
[X] DO NOT add heavy text integration (15-25% height banners).

[OK] USE THIS SIMPLIFIED STRUCTURE INSTEAD:

FORMAT: ${params.ratio || '2:1'}

PRODUCT: Letter-fill souvenir magnet  - "${destination}"

LETTER STYLE: Bold, chunky 3D letters with natural wood / metal / acrylic material. Letters are slightly uneven in height for a handcrafted feel.

LETTER ARRANGEMENT: "${destination}" spelled horizontally, each letter acting as a photo window.

PHOTO FILLS  - Each letter shows a DIFFERENT ${destination} scene:
${letterList}

MATERIAL & FINISH: 3D letters with subtle texture. Vivid, high-resolution photos fill each letter edge-to-edge. NO external border or outline around the letters.

BACKGROUND: Clean white or transparent. No additional framing or borders.

STYLE: Flat front-facing view of a souvenir magnet design. NO borders, NO outlines around the design.

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

    // Cleanup function: delete the entire temp directory (must be defined before timers that reference it)
    const cleanupImages = async () => {
      if (tempDir) {
        try {
          await fs.rm(tempDir, { recursive: true, force: true });
          console.log(`🗑️  Deleted temp directory: ${path.basename(tempDir)}`);
        } catch (error) {
          console.error(`[!] Cleanup warning: ${error.message}`);
        }
      }
      // NOTE: Do NOT delete from uploads/ - those are the originals needed across variations
    };

    // Early warning timer (20 seconds)
    const warningTimer = setTimeout(() => {
      if (!hasReceivedOutput) {
        console.log('[!]  Still waiting for Claude Code response (20s elapsed)... This is normal for first request or large documentation.');
      }
    }, 20000);

    // Timeout after 180 seconds (increased for projects with images + heavy documentation)
    const timeoutTimer = setTimeout(async () => {
      clearTimeout(warningTimer); // Clean up warning timer
      claude.kill();
      await cleanupImages(); // Clean up copied images

      const timeSinceLastOutput = Date.now() - lastOutputTime;

      if (output && output.length > 50) {
        console.log('[!]  Timeout reached, returning partial output');
        resolve(sanitizePrompt(enforceImageQuality(output)));
      } else if (hasReceivedOutput) {
        reject(new Error(`Claude Code stalled after ${Math.round(timeSinceLastOutput/1000)}s with no new output. The generation may be incomplete.`));
      } else {
        reject(new Error('Claude Code timed out after 180 seconds with no output. Possible causes:\n- Large documentation files taking too long to read\n- Network latency to Anthropic API\n- Claude Code not properly installed\n\nTry: Simplify instruction, check internet connection, or restart the app.'));
      }
    }, 180000);

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
        resolve(enforceImageQuality(filteredOutput));
      } else if (output && output.length > 100) {
        // Fallback to full output if filtering didn't work
        resolve(sanitizePrompt(enforceImageQuality(output)));
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
    } catch (err) { reject(err); }
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

// Diversity seeds  - each variation gets a different creative direction
// IMPORTANT: All compositions MUST produce IRREGULAR silhouettes (no circles, rectangles, badges, frames)
const DIVERSITY_ANGLES = [
  'Use a HERO-CENTRIC composition: one dominant central element takes 60%+ of the space, with supporting details orbiting around it. The silhouette must be IRREGULAR  - shaped by the elements themselves (ribbons poking up, flowers extending at sides, etc.).',
  'Use a PANORAMIC SCENE composition: spread elements across a wide landscape view, telling a story from left to right. The top edge should be JAGGED and VARIED (trees, buildings, character heads at different heights), the bottom edge shaped by terrain/flowers  - NOT a clean rectangle.',
  'Use a DYNAMIC DIAGONAL composition: strong diagonal flow from one corner to the opposite, creating movement and energy. Elements break out of the frame at multiple points creating an IRREGULAR sticker-like silhouette.',
  'Use a STACKED/LAYERED composition: elements piled and layered with the protagonist on top of a mound of flowers/nature, creating a PYRAMID-like organic shape. The silhouette is defined by the elements  - palm trees, ribbons, flowers all poking out at different angles.',
  'Use a SCATTERED GARDEN composition: protagonist surrounded by a lush arrangement of flowers, animals, and nature that extends outward UNEVENLY in all directions, like a hand-picked bouquet  - wider on one side, taller on another.',
  'Use an ASYMMETRIC SPLIT composition: protagonist positioned off-center with supporting elements weighted heavily on one side, creating an organic imbalanced silhouette like a sticker that is wider on one side than the other.',
  'Use a CASCADING/WATERFALL composition: elements flowing downward from the protagonist, with flowers and nature spilling from top to bottom in an organic cascade, creating a silhouette that is wider at the bottom than the top.',
  'Use a WRAPAROUND composition: supporting elements curve around the protagonist like a natural wreath but with IRREGULAR, BROKEN edges  - NOT a perfect circle. Flowers, vines, and birds extend outward asymmetrically at different points.'
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
    console.log(`STYLES: ${params.styles.join(', ')} -> distributed as: ${styleAssignments.join(', ')}`);
  }
  console.log(`${'*'.repeat(60)}\n`);

  // TURBO PARALLEL MODE: Run all variations simultaneously for maximum speed
  if (params.turboMode && count > 1) {
    console.log(`\n> PARALLEL TURBO: Launching ${count} variations simultaneously\n`);

    const promises = Array.from({ length: count }, async (_, i) => {
      try {
        const baseInstruction = params.permutedInstructions ? params.permutedInstructions[i] : instructions;
        let modifiedInstruction = baseInstruction;
        const hasImages = params.images && params.images.length > 0;
        const diversityAngle = DIVERSITY_ANGLES[i % DIVERSITY_ANGLES.length];
        const variationStyle = styleAssignments[i];

        // Create a copy of params for this variation to avoid mutation conflicts
        const variationParams = { ...params, style: variationStyle || params.style };

        if (hasImages && count === 1) {
          modifiedInstruction = `${baseInstruction}\n\nREFERENCE IMAGE VARIATION RULES:\n- You MUST create a variation OF the reference image, not a new design from scratch.\n- STYLE MATCH IS MANDATORY: Your prompt MUST start with a detailed style description that replicates the EXACT rendering style, line work, shading, proportions, and color approach from the reference image. Be hyper-specific (e.g., "kawaii chibi-style with bold 2px black outlines, flat color fills, no gradients" NOT just "cartoon style").\n- Keep the SAME protagonist character with SAME clothing, accessories, and proportions.\n- Keep the SAME types of supporting elements (same flower species, same animals).\n- Keep the SAME color palette and saturation level.\n- CHANGE ONLY: pose, gesture, action, composition layout, or element arrangement.\n- The result should look like it was drawn by the SAME ARTIST as the reference.`;
        } else if (count > 1) {
          if (hasImages) {
            modifiedInstruction = `${baseInstruction}\n\nREFERENCE IMAGE VARIATION ${i + 1} of ${count}:\n- STYLE MATCH IS MANDATORY: Start your prompt with a detailed description of the EXACT visual style from the reference (line work, shading, proportions, rendering). Be specific, not generic.\n- Keep the SAME protagonist with SAME clothing/accessories, SAME types of supporting elements, SAME color palette.\n- COMPOSITION CHANGE for variation ${i + 1}: ${diversityAngle}\n- The protagonist should have a DIFFERENT pose/gesture/action, but must be the SAME character with SAME style.\n- The result must look like it was drawn by the SAME ARTIST as the reference  - only the arrangement changes.`;
          } else {
            modifiedInstruction = `${baseInstruction}\n\nIMPORTANT: Create variation ${i + 1} of ${count}.\n\nDIVERSITY REQUIREMENT (variation ${i + 1}): ${diversityAngle}\nThis must be COMPLETELY DIFFERENT from other variations. Use a different composition layout, different hero element treatment, different color mood, and different visual storytelling approach. Do NOT produce a slight tweak of the same design  - create a genuinely new concept.`;
          }
        }

        const styleLabel = variationStyle ? ` [${variationStyle.charAt(0).toUpperCase() + variationStyle.slice(1)}]` : '';
        console.log(`[${'='.repeat(10)} VARIATION ${i + 1}/${count}${styleLabel} (PARALLEL) ${'='.repeat(10)}]`);

        console.log(`> [V${i + 1}] TURBO launching...`);
        let output = await invokeClaudeTurbo(modifiedInstruction, variationParams);

        // Append mandatory design rules
        const instructionCheck = (modifiedInstruction || '').toLowerCase();
        const isLetterFillDesign = variationParams.productType === 'magnet' && /\b(letter.?fill|photo.?fill|each\s+letter\s+(shows?|contains?|filled|has)|inside\s+(of\s+)?(the\s+)?letters?|uneven\s+letters?|block\s+letters?|3d\s+letters?|chunky\s+letters?|letras?\s+(rellenas?|con\s+fotos?|con\s+imagenes?))\b/i.test(instructionCheck);

        if (isLetterFillDesign) {
          output += `\n\n[!] CRITICAL LETTER-FILL DESIGN RULES  - MANDATORY:\n- SHAPE: The overall shape is defined by the LETTERS themselves  - each letter is a bold 3D shape\n- LETTERS must look like REAL physical objects with depth, shadows, and material texture\n- Each letter is a PHOTO WINDOW  - filled edge-to-edge with a vivid, sharp photograph\n- NO cartoon elements, NO decorative flowers, NO supporting animals around the letters\n- NO text banners or additional labels  - the letters ARE the text\n- BACKGROUND: Clean white or transparent  - letters float as a group\n- PRODUCT FEEL: Must look like a real souvenir magnet you could buy in a gift shop\n- QUALITY: Crisp, professional, sharp  - like a product photo from an e-commerce site`;
        } else {
          output += `\n\nOn a pure white background. Irregular silhouette shaped by the design elements. NO borders, NO frames, NO colored background shapes.`;
        }

        const variation = {
          title: variationStyle ? `Variation ${i + 1}  - ${variationStyle.charAt(0).toUpperCase() + variationStyle.slice(1)}` : `Variation ${i + 1}`,
          prompt: sanitizePrompt(output),
          index: i,
          style: variationStyle || null
        };

        console.log(`\n[OK] Variation ${i + 1} completed (PARALLEL)\n`);
        if (onVariationComplete) {
          onVariationComplete(variation, i, count);
        }
        return variation;

      } catch (error) {
        console.error(`[X] Error generating variation ${i + 1}:`, error.message);
        const errorVariation = {
          title: `Variation ${i + 1} - Error`,
          prompt: `[X] Error generating prompt:\n\n${error.message}\n\n**Troubleshooting:**\n- Make sure Claude Code is installed (npm install -g @anthropics/claude-code)\n- Ensure the 'claude' command is available in your terminal\n- Check that you're in the correct directory\n- Verify the project documentation exists in: ${PROJECTS[projectType]?.folder}`,
          index: i
        };
        if (onVariationComplete) {
          onVariationComplete(errorVariation, i, count);
        }
        return errorVariation;
      }
    });

    const results = await Promise.all(promises);
    variations.push(...results);

  } else if (count > 1) {
    // PARALLEL MODE: Run ALL variations simultaneously (normal mode + multiple variations)
    console.log(`\n> PARALLEL MODE: Launching ${count} variations simultaneously\n`);

    const promises = Array.from({ length: count }, async (_, i) => {
      try {
        const baseInstruction = params.permutedInstructions ? params.permutedInstructions[i] : instructions;
        let modifiedInstruction = baseInstruction;
        const hasImages = params.images && params.images.length > 0;
        const diversityAngle = DIVERSITY_ANGLES[i % DIVERSITY_ANGLES.length];
        const variationStyle = styleAssignments[i];

        // Create a copy of params for this variation to avoid mutation conflicts
        const variationParams = { ...params, style: variationStyle || params.style };

        if (hasImages) {
          modifiedInstruction = `${baseInstruction}\n\nREFERENCE IMAGE VARIATION ${i + 1} of ${count}:\n- STYLE MATCH IS MANDATORY: Start your prompt with a detailed description of the EXACT visual style from the reference (line work, shading, proportions, rendering). Be specific, not generic.\n- Keep the SAME protagonist with SAME clothing/accessories, SAME types of supporting elements, SAME color palette.\n- COMPOSITION CHANGE for variation ${i + 1}: ${diversityAngle}\n- The protagonist should have a DIFFERENT pose/gesture/action, but must be the SAME character with SAME style.\n- The result must look like it was drawn by the SAME ARTIST as the reference  - only the arrangement changes.`;
        } else {
          modifiedInstruction = `${baseInstruction}\n\nIMPORTANT: Create variation ${i + 1} of ${count}.\n\nDIVERSITY REQUIREMENT (variation ${i + 1}): ${diversityAngle}\nThis must be COMPLETELY DIFFERENT from other variations. Use a different composition layout, different hero element treatment, different color mood, and different visual storytelling approach. Do NOT produce a slight tweak of the same design  - create a genuinely new concept.`;
        }

        const styleLabel = variationStyle ? ` [${variationStyle.charAt(0).toUpperCase() + variationStyle.slice(1)}]` : '';
        console.log(`[${'='.repeat(10)} VARIATION ${i + 1}/${count}${styleLabel} (PARALLEL) ${'='.repeat(10)}]`);

        let output;
        if (variationParams.turboMode) {
          console.log(`> [V${i + 1}] TURBO launching...`);
          output = await invokeClaudeTurbo(modifiedInstruction, variationParams);
        } else {
          console.log(`> [V${i + 1}] Normal mode launching...`);
          output = await invokeClaude(projectType, modifiedInstruction, variationParams);
        }

        // Append mandatory design rules
        const instructionCheck = (modifiedInstruction || '').toLowerCase();
        const isLetterFillDesign = variationParams.productType === 'magnet' && /\b(letter.?fill|photo.?fill|each\s+letter\s+(shows?|contains?|filled|has)|inside\s+(of\s+)?(the\s+)?letters?|uneven\s+letters?|block\s+letters?|3d\s+letters?|chunky\s+letters?|letras?\s+(rellenas?|con\s+fotos?|con\s+imagenes?))\b/i.test(instructionCheck);

        if (isLetterFillDesign) {
          output += `\n\n[!] CRITICAL LETTER-FILL DESIGN RULES  - MANDATORY:\n- SHAPE: The overall shape is defined by the LETTERS themselves  - each letter is a bold 3D shape\n- LETTERS must look like REAL physical objects with depth, shadows, and material texture\n- Each letter is a PHOTO WINDOW  - filled edge-to-edge with a vivid, sharp photograph\n- NO cartoon elements, NO decorative flowers, NO supporting animals around the letters\n- NO text banners or additional labels  - the letters ARE the text\n- BACKGROUND: Clean white or transparent  - letters float as a group\n- PRODUCT FEEL: Must look like a real souvenir magnet you could buy in a gift shop\n- QUALITY: Crisp, professional, sharp  - like a product photo from an e-commerce site`;
        } else {
          output += `\n\nOn a pure white background. Irregular silhouette shaped by the design elements. NO borders, NO frames, NO colored background shapes.`;
        }

        const variation = {
          title: variationStyle ? `Variation ${i + 1}  - ${variationStyle.charAt(0).toUpperCase() + variationStyle.slice(1)}` : `Variation ${i + 1}`,
          prompt: sanitizePrompt(output),
          index: i,
          style: variationStyle || null
        };

        console.log(`\n[OK] Variation ${i + 1} completed (PARALLEL)\n`);
        if (onVariationComplete) {
          onVariationComplete(variation, i, count);
        }
        return variation;

      } catch (error) {
        console.error(`[X] Error generating variation ${i + 1}:`, error.message);
        const errorVariation = {
          title: `Variation ${i + 1} - Error`,
          prompt: `[X] Error generating prompt:\n\n${error.message}\n\n**Troubleshooting:**\n- Make sure Claude Code is installed (npm install -g @anthropics/claude-code)\n- Ensure the 'claude' command is available in your terminal\n- Check that you're in the correct directory\n- Verify the project documentation exists in: ${PROJECTS[projectType]?.folder}`,
          index: i
        };
        if (onVariationComplete) {
          onVariationComplete(errorVariation, i, count);
        }
        return errorVariation;
      }
    });

    const results = await Promise.all(promises);
    variations.push(...results);

  } else {
    // SINGLE VARIATION: Sequential (only 1 variation, no need for parallel)
    try {
      const baseInstruction = params.permutedInstructions ? params.permutedInstructions[0] : instructions;
      let modifiedInstruction = baseInstruction;
      const hasImages = params.images && params.images.length > 0;
      const variationStyle = styleAssignments[0];
      if (variationStyle) {
        params.style = variationStyle;
      }

      if (hasImages) {
        modifiedInstruction = `${baseInstruction}\n\nREFERENCE IMAGE VARIATION RULES:\n- You MUST create a variation OF the reference image, not a new design from scratch.\n- STYLE MATCH IS MANDATORY: Your prompt MUST start with a detailed style description that replicates the EXACT rendering style, line work, shading, proportions, and color approach from the reference image. Be hyper-specific (e.g., "kawaii chibi-style with bold 2px black outlines, flat color fills, no gradients" NOT just "cartoon style").\n- Keep the SAME protagonist character with SAME clothing, accessories, and proportions.\n- Keep the SAME types of supporting elements (same flower species, same animals).\n- Keep the SAME color palette and saturation level.\n- CHANGE ONLY: pose, gesture, action, composition layout, or element arrangement.\n- The result should look like it was drawn by the SAME ARTIST as the reference.`;
      }

      const styleLabel = variationStyle ? ` [${variationStyle.charAt(0).toUpperCase() + variationStyle.slice(1)}]` : '';
      console.log(`\n[${'='.repeat(10)} VARIATION 1/1${styleLabel} ${'='.repeat(10)}]\n`);

      let output;
      if (params.turboMode) {
        console.log(`> Using TURBO mode - skipping documentation for maximum speed`);
        output = await invokeClaudeTurbo(modifiedInstruction, params);
      } else {
        output = await invokeClaude(projectType, modifiedInstruction, params);
      }

      const instructionCheck = (modifiedInstruction || '').toLowerCase();
      const isLetterFillDesign = params.productType === 'magnet' && /\b(letter.?fill|photo.?fill|each\s+letter\s+(shows?|contains?|filled|has)|inside\s+(of\s+)?(the\s+)?letters?|uneven\s+letters?|block\s+letters?|3d\s+letters?|chunky\s+letters?|letras?\s+(rellenas?|con\s+fotos?|con\s+imagenes?))\b/i.test(instructionCheck);

      if (isLetterFillDesign) {
        output += `\n\n[!] CRITICAL LETTER-FILL DESIGN RULES  - MANDATORY:\n- SHAPE: The overall shape is defined by the LETTERS themselves  - each letter is a bold 3D shape\n- LETTERS must look like REAL physical objects with depth, shadows, and material texture\n- Each letter is a PHOTO WINDOW  - filled edge-to-edge with a vivid, sharp photograph\n- NO cartoon elements, NO decorative flowers, NO supporting animals around the letters\n- NO text banners or additional labels  - the letters ARE the text\n- BACKGROUND: Clean white or transparent  - letters float as a group\n- PRODUCT FEEL: Must look like a real souvenir magnet you could buy in a gift shop\n- QUALITY: Crisp, professional, sharp  - like a product photo from an e-commerce site`;
      } else {
        output += `\n\n[!] CRITICAL DESIGN RULES  - MANDATORY (DO NOT IGNORE):\n- BANNED OUTER SHAPES: NEVER use a square, rectangle, perfect circle, oval, medallion, or any simple geometric shape as the overall silhouette. These are ALL wrong.\n- REQUIRED OUTER SHAPE: The design MUST have a COMPLEX, IRREGULAR, ASYMMETRIC silhouette  - like a hand-cut vinyl sticker. The outline should be shaped BY the design elements themselves.\n- HOW TO ACHIEVE THIS: Let elements break out and define the edge  - a palm tree extends upward creating a bump, waves flow along the bottom creating scallops, a character's arm pokes out one side, buildings create a jagged skyline. The silhouette should be UNIQUE to this specific design.\n- GOOD EXAMPLES: A travel design where the top edge is shaped by mountains and a palm tree, sides follow the curves of buildings and foliage, bottom has wave-shaped edges. Each design has a one-of-a-kind outline.\n- BAD EXAMPLES: Design crammed inside a circle. Design filling a square. Design inside a round badge/medallion. Design with uniform rounded edges all around (that's just a soft rectangle).\n- BACKGROUND: Clean white or transparent. The design floats freely  - NO borders, NO frames, NO containers of any kind.\n- SELF-CHECK: Trace the outer edge with your finger. If it's a recognizable geometric shape (circle, square, rectangle, oval), it is WRONG. The outline should be complex and impossible to describe with one word.`;
      }

      console.log(`\n> GENERATED PROMPT (full):\n${'='.repeat(60)}\n${output}\n${'='.repeat(60)}\n`);

      const variation = {
        title: variationStyle ? `Variation 1  - ${variationStyle.charAt(0).toUpperCase() + variationStyle.slice(1)}` : `Variation 1`,
        prompt: sanitizePrompt(output),
        index: 0,
        style: variationStyle || null
      };

      variations.push(variation);
      console.log(`\n[OK] Variation 1 completed successfully\n`);
      if (onVariationComplete) {
        onVariationComplete(variation, 0, count);
      }

    } catch (error) {
      console.error(`[X] Error generating variation 1:`, error.message);
      const errorVariation = {
        title: `Variation 1 - Error`,
        prompt: `[X] Error generating prompt:\n\n${error.message}\n\n**Troubleshooting:**\n- Make sure Claude Code is installed (npm install -g @anthropics/claude-code)\n- Ensure the 'claude' command is available in your terminal\n- Check that you're in the correct directory\n- Verify the project documentation exists in: ${PROJECTS[projectType]?.folder}`,
        index: 0
      };
      variations.push(errorVariation);
      if (onVariationComplete) {
        onVariationComplete(errorVariation, 0, count);
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
    const { projectType, instructions, variationCount, destination, theme, level, decorationLevel, crazymeter, style, styles, ratio, productType, includeShapeConstraints, photoStyle, turboMode, permutedInstructions: permutedInstructionsRaw } = req.body;
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
      styleReferenceImage: styleRefImagePath,
      permutedInstructions: permutedInstructionsRaw ? JSON.parse(permutedInstructionsRaw) : null
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
      turboMode: params.turboMode,
      permutedMode: !!params.permutedInstructions,
      permutedCount: params.permutedInstructions ? params.permutedInstructions.length : 0
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
    console.error('[X] Error in streaming endpoint:', error);
    if (!res.headersSent) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    } else {
      res.write(`data: ${JSON.stringify({ type: 'error', error: error.message })}\n\n`);
      res.end();
    }
  }
});

// ═══ QUICK API — Programmatic prompt generation (non-streaming, JSON response) ═══
// Usage: POST /api/quick-generate with JSON body
// Minimal: { "instructions": "Oaxaca magnet with alebrijes" }
// Full:    { "instructions": "...", "destination": "Oaxaca", "projectType": "from-scratch",
//            "style": "cartoon", "ratio": "1:1", "productType": "magnet",
//            "variationCount": 3, "turboMode": true, "level": 7, "decorationLevel": 9 }
app.post('/api/quick-generate', express.json(), async (req, res) => {
  try {
    const {
      instructions,
      destination,
      projectType = 'from-scratch',
      style = 'cartoon',
      styles,
      ratio = '1:1',
      productType = 'bottle-opener',
      variationCount = 1,
      turboMode = true,
      level = 7,
      decorationLevel = 8,
      crazymeter,
      theme
    } = req.body;

    if (!instructions || !instructions.trim()) {
      return res.status(400).json({ success: false, error: 'instructions is required' });
    }
    if (!PROJECTS[projectType]) {
      return res.status(400).json({ success: false, error: `Invalid projectType. Valid: ${Object.keys(PROJECTS).join(', ')}` });
    }

    const count = Math.min(parseInt(variationCount) || 1, 20);
    const parsedStyles = styles || (style ? [style] : []);

    const params = {
      projectType,
      instructions,
      destination: destination || '',
      theme: theme || '',
      level,
      decorationLevel,
      crazymeter: crazymeter || null,
      style: parsedStyles[0] || '',
      styles: parsedStyles,
      ratio,
      productType,
      includeShapeConstraints: false,
      photoStyle: null,
      turboMode,
      images: [],
      styleReferenceImage: null,
      permutedInstructions: null
    };

    console.log(`\n⚡ Quick API: "${instructions.substring(0, 80)}..." | ${count}x ${parsedStyles.join(',')||'auto'} | turbo=${turboMode}`);

    const prompts = [];

    if (count === 1) {
      // Single prompt
      const result = turboMode
        ? await invokeClaudeTurbo(instructions, params)
        : await invokeClaude(projectType, instructions, params);
      prompts.push(sanitizePrompt(enforceImageQuality(result)));
    } else {
      // Multiple — run sequentially (parallel would overload Claude CLI)
      const styleList = distributeStyles(parsedStyles, count);
      for (let i = 0; i < count; i++) {
        const variationParams = { ...params, style: styleList[i] };
        try {
          const result = turboMode
            ? await invokeClaudeTurbo(instructions, variationParams)
            : await invokeClaude(projectType, instructions, variationParams);
          prompts.push(sanitizePrompt(enforceImageQuality(result)));
          console.log(`  ✓ Variation ${i + 1}/${count} done`);
        } catch (err) {
          prompts.push(`[ERROR] Variation ${i + 1} failed: ${err.message}`);
        }
      }
    }

    res.json({
      success: true,
      count: prompts.length,
      prompts,
      params: { projectType, destination: params.destination, style: parsedStyles, ratio, productType, turboMode }
    });

  } catch (error) {
    console.error('[X] Quick API error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// ═══ RANDOM FILL — AI-powered random parameter generation ═══
app.post('/api/random-fill', express.json(), async (req, res) => {
  try {
    const hint = (req.body.hint || '').trim();
    const currentProject = req.body.currentProject || '';

    const prompt = `You are a creative souvenir design randomizer. ${hint ? `The user typed this hint: "${hint}". Use it as inspiration.` : 'Generate something completely random and creative.'}

Generate random parameters for a souvenir design. Pick a REAL tourist destination (city, not country) and create an exciting, specific design concept.

IMPORTANT: Be creative and specific. Don't be generic. Pick unusual destinations, unexpected themes, specific cultural elements.

Available styles: cartoon, realistic, watercolor, vintage, sticker-art, kawaii, photography, hybrid
Available products: bottle-opener, magnet, keychain
Available ratios: 1:1, 2:1
Available project types: from-scratch, previous-element${currentProject ? `\nCurrently selected project: ${currentProject}` : ''}

Respond with ONLY valid JSON, no other text:
{
  "instructions": "A vivid, specific 1-2 sentence design description with cultural elements, animals, landmarks, etc.",
  "destination": "City Name",
  "style": "one of the available styles",
  "productType": "one of the available products",
  "ratio": "1:1 or 2:1",
  "level": a number 4-9,
  "decorationLevel": a number 6-10,
  "variationCount": a number 1-4,
  "theme": "optional theme or empty string"
}`;

    const command = `echo ${JSON.stringify(prompt)} | claude -p --model claude-haiku-4-5-20251001 --max-turns 1`;
    let output = '';

    const claude = spawn(command, [], { cwd: __dirname, shell: true, env: { ...process.env } });

    const timeout = setTimeout(() => { claude.kill(); }, 20000);

    claude.stdout.on('data', (data) => { output += data.toString(); });
    claude.stderr.on('data', () => {});

    claude.on('close', () => {
      clearTimeout(timeout);
      try {
        const jsonMatch = output.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const data = JSON.parse(jsonMatch[0]);
          console.log(`🎲 Random fill: ${data.destination} — ${data.instructions?.substring(0, 60)}...`);
          res.json({ success: true, data });
        } else {
          res.json({ success: false, error: 'No JSON in response' });
        }
      } catch (e) {
        res.json({ success: false, error: 'Parse error' });
      }
    });

    claude.on('error', (err) => {
      clearTimeout(timeout);
      res.json({ success: false, error: err.message });
    });

  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
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

    const imageCount = imageFilenames.length;
    const command = `echo ${JSON.stringify(fullPrompt)} | claude -p --allowedTools "Read,Glob" --max-turns ${imageCount + 2}`;

    let output = '';

    const claude = spawn(command, [], {
      cwd: uploadPath,
      shell: true,
      env: { ...process.env }
    });

    // Guard against double response (timeout + close both firing)
    let responseSent = false;

    // Timeout after 60 seconds
    const timeoutTimer = setTimeout(() => {
      claude.kill();
      if (!responseSent) {
        responseSent = true;
        res.json({
          success: false,
          error: 'Analysis timed out. Please try again.'
        });
      }
    }, 60000);

    claude.stdout.on('data', (data) => {
      output += data.toString();
    });

    claude.stderr.on('data', (data) => {
      console.error('stderr:', data.toString());
    });

    claude.on('close', async (code) => {
      clearTimeout(timeoutTimer);
      if (responseSent) return;
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
    console.error('[X] Error in analyze endpoint:', error);
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
    await fs.writeFile(promptFile, sanitizePrompt(prompt), 'utf8');

    // Python clipboard helper - puts image as a NAMED FILE on pasteboard
    // Each image gets a unique name so Gemini doesn't reject duplicates
    const clipboardHelperPath = path.join(tempDir, 'clipboard_image.py');
    await fs.writeFile(clipboardHelperPath, `#!/usr/bin/env python3
import sys, os, shutil, tempfile
from AppKit import NSPasteboard, NSURL

src = sys.argv[1]
unique_name = sys.argv[2] if len(sys.argv) > 2 else os.path.basename(src)

# Copy to a temp file with the unique name so Gemini sees a distinct filename
tmp_dir = tempfile.mkdtemp()
dest = os.path.join(tmp_dir, unique_name)
shutil.copy2(src, dest)

file_url = NSURL.fileURLWithPath_(dest)
pb = NSPasteboard.generalPasteboard()
pb.clearContents()
pb.writeObjects_([file_url])
`, 'utf8');

    // Build fast image paste steps - each image gets a unique filename
    let imageSteps = '';
    for (let idx = 0; idx < imagePaths.length; idx++) {
      const imgPath = imagePaths[idx];
      const ext = path.extname(imgPath) || '.png';
      const uniqueName = `design-ref-${timestamp}-${idx}${ext}`;
      imageSteps += `
  do shell script "python3 " & quoted form of "${clipboardHelperPath}" & " " & quoted form of "${imgPath}" & " " & quoted form of "${uniqueName}"
  execute active tab of front window javascript "var el=document.querySelector('div[contenteditable=true][role=textbox]');if(el){el.focus();el.click();} 'ok'"
  tell application "System Events" to keystroke "v" using command down
  -- Wait for Gemini to process the image (poll for image chip or attachment)
  delay 0.3
  repeat 15 times
    set hasImg to (execute active tab of front window javascript "document.querySelectorAll('img[src*=blob],div[data-image-id],div.image-chip,.attachment-chip').length")
    if hasImg is not "0" then exit repeat
    delay 0.2
  end repeat
  delay 0.3
  -- Dismiss any duplicate-name error dialog if it appeared
  execute active tab of front window javascript "var d=document.querySelector('button[aria-label=Dismiss],button[aria-label=Close],.error-dismiss');if(d)d.click();"
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
      if (error) console.error('  [X] AppleScript error:', error.message);
      else console.log('  [OK] Gemini automation completed');
    });

    res.json({ success: true, message: 'Sending to Gemini...', hasImages: imagePaths.length > 0 });

  } catch (error) {
    console.error('[X] Send to Gemini error:', error);
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
      await fs.writeFile(promptFile, sanitizePrompt(prompts[i]), 'utf8');
      promptFiles.push(promptFile);
    }

    // Python clipboard helper - named file on pasteboard (unique names prevent Gemini duplicates)
    const clipboardHelperPath = path.join(tempDir, 'clipboard_image.py');
    await fs.writeFile(clipboardHelperPath, `#!/usr/bin/env python3
import sys, os, shutil, tempfile
from AppKit import NSPasteboard, NSURL

src = sys.argv[1]
unique_name = sys.argv[2] if len(sys.argv) > 2 else os.path.basename(src)

tmp_dir = tempfile.mkdtemp()
dest = os.path.join(tmp_dir, unique_name)
shutil.copy2(src, dest)

file_url = NSURL.fileURLWithPath_(dest)
pb = NSPasteboard.generalPasteboard()
pb.clearContents()
pb.writeObjects_([file_url])
`, 'utf8');

    const tabCount = prompts.length;

    // ═══ FAST BULK SCRIPT: Open all tabs -> parallel load -> rapid paste ═══
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

      // Image paste steps for this tab - each image gets unique name per tab
      let imgSteps = '';
      for (let imgIdx = 0; imgIdx < imagePaths.length; imgIdx++) {
        const imgPath = imagePaths[imgIdx];
        const ext = path.extname(imgPath) || '.png';
        const uniqueName = `design-ref-tab${i}-${timestamp}-${imgIdx}${ext}`;
        imgSteps += `
    do shell script "python3 " & quoted form of "${clipboardHelperPath}" & " " & quoted form of "${imgPath}" & " " & quoted form of "${uniqueName}"
    execute active tab of w javascript "var el=document.querySelector('div[contenteditable=true][role=textbox]');if(el){el.focus();el.click();} 'ok'"
    tell application "System Events" to keystroke "v" using command down
    delay 0.3
    repeat 15 times
      set hasImg to (execute active tab of w javascript "document.querySelectorAll('img[src*=blob],div[data-image-id],div.image-chip,.attachment-chip').length")
      if hasImg is not "0" then exit repeat
      delay 0.2
    end repeat
    delay 0.2
    execute active tab of w javascript "var d=document.querySelector('button[aria-label=Dismiss],button[aria-label=Close],.error-dismiss');if(d)d.click();"
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
      if (error) console.error('  [X] Bulk error:', error.message);
      else console.log(`  [OK] Bulk Gemini done (${tabCount} tabs)`);
    });

    res.json({ success: true, message: `Opening ${tabCount} Gemini tabs...`, count: tabCount });

  } catch (error) {
    console.error('[X] Bulk Send to Gemini error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// ═══ SEND TO ENVATO (single prompt, text-only, auto-submit) ═══
app.post('/api/send-to-envato', async (req, res) => {
  try {
    const { prompt, aspectRatio, referenceImages } = req.body;

    if (!prompt) {
      return res.status(400).json({ success: false, error: 'No prompt provided' });
    }

    // Map app ratio to Envato option: Square, Portrait, Landscape
    let envatoAspect = 'Square';
    if (aspectRatio === '1:2') envatoAspect = 'Portrait';
    else if (aspectRatio === '2:1') envatoAspect = 'Landscape';

    // Write reference images to tmp-ref if provided
    let refFilenames = [];
    if (referenceImages && Array.isArray(referenceImages) && referenceImages.length > 0) {
      refFilenames = await writeRefImages(referenceImages);
      console.log(`\n🚀 Send to Envato: prompt length=${prompt.length}, aspect=${envatoAspect}, refs=${refFilenames.length}`);
    } else {
      console.log(`\n🚀 Send to Envato: prompt length=${prompt.length}, aspect=${envatoAspect}`);
    }

    const timestamp = Date.now();
    const tempDir = path.join(os.tmpdir(), `envato-${timestamp}`);
    await fs.mkdir(tempDir, { recursive: true });

    // Write prompt to temp file
    const promptFile = path.join(tempDir, 'prompt.txt');
    await fs.writeFile(promptFile, sanitizePrompt(prompt), 'utf8');

    // Write reference upload JS to temp file if we have images
    let refJSFile = '';
    if (refFilenames.length > 0) {
      refJSFile = path.join(tempDir, 'ref-upload.js');
      await fs.writeFile(refJSFile, generateRefUploadJS(refFilenames), 'utf8');
    }

    // Build reference image upload AppleScript section
    let refUploadSection = '';
    if (refFilenames.length > 0) {
      refUploadSection = `
  -- Upload reference images
  set refJS to do shell script "cat " & quoted form of "${refJSFile}"
  execute active tab of front window javascript refJS
  -- Wait for ref upload to complete
  repeat 30 times
    set isDone to (execute active tab of front window javascript "window.__refUploadDone ? 'yes' : 'no'")
    if isDone is "yes" then exit repeat
    delay 0.5
  end repeat
  delay 0.5`;
    }

    // AppleScript: open Envato ImageGen, paste text, click Generate
    const appleScript = `
tell application "Google Chrome"
  activate
  tell front window to make new tab with properties {URL:"https://labs.envato.com/apps/image-gen/"}
  -- Wait for page to load
  repeat 50 times
    if not (loading of active tab of front window) then exit repeat
    delay 0.15
  end repeat
  -- Wait for the text input to be ready (textarea or input)
  repeat 40 times
    set inputReady to (execute active tab of front window javascript "
      var ta = document.querySelector('textarea, input[type=text]');
      ta ? '1' : '0';
    ")
    if inputReady is "1" then exit repeat
    delay 0.2
  end repeat
  delay 0.3
${refUploadSection}
  -- Select aspect ratio: click the dropdown then the option
  execute active tab of front window javascript "
    (function(){
      var labels = document.querySelectorAll('label, span, div, button');
      for(var i=0;i<labels.length;i++){
        var t = labels[i].textContent.trim().toLowerCase();
        if(t==='square'||t==='portrait'||t==='landscape'){
          var el = labels[i].closest('button') || labels[i].closest('label') || labels[i];
          if(el.querySelector('input[type=radio],input[type=checkbox]')){
            el.click();
          }
        }
      }
      // Try clicking the aspect ratio dropdown/selector first
      var triggers = document.querySelectorAll('button, [role=combobox], [role=listbox], select');
      for(var j=0;j<triggers.length;j++){
        var txt = triggers[j].textContent.trim().toLowerCase();
        if(txt.includes('square')||txt.includes('portrait')||txt.includes('landscape')){
          triggers[j].click();
          break;
        }
      }
    })();
    'ok';
  "
  delay 0.3
  -- Now click the specific aspect ratio option
  execute active tab of front window javascript "
    (function(){
      var target = '${envatoAspect}'.toLowerCase();
      var items = document.querySelectorAll('li, label, button, div[role=option], span');
      for(var i=0;i<items.length;i++){
        if(items[i].textContent.trim().toLowerCase()===target){
          items[i].click();
          return 'clicked';
        }
      }
      return 'not found';
    })();
  "
  delay 0.3
  -- Focus the text input
  execute active tab of front window javascript "
    var ta = document.querySelector('textarea, input[type=text]');
    if(ta){ta.focus();ta.click();} 'ok';
  "
end tell
-- Paste text via clipboard
do shell script "cat " & quoted form of "${promptFile}" & " | pbcopy"
tell application "System Events" to keystroke "v" using command down
-- Wait for paste to register
delay 0.8
-- Click the Generate button via JS injection
tell application "Google Chrome"
  execute active tab of front window javascript "
    var btns = document.querySelectorAll('button');
    for(var i=0;i<btns.length;i++){
      if(btns[i].textContent.trim().toLowerCase().includes('generate')){
        btns[i].click();
        break;
      }
    }
    'ok';
  "
end tell
return "done"
`;

    const scriptFile = path.join(tempDir, 'automate.scpt');
    await fs.writeFile(scriptFile, appleScript, 'utf8');

    exec(`osascript "${scriptFile}"`, { timeout: 30000 }, (error) => {
      setTimeout(() => { fs.rm(tempDir, { recursive: true }).catch(() => {}); }, 30000);
      if (error) console.error('  [X] Envato AppleScript error:', error.message);
      else console.log('  [OK] Envato automation completed');
    });

    res.json({ success: true, message: 'Sending to Envato...' });

  } catch (error) {
    console.error('[X] Send to Envato error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// ═══ BULK SEND TO ENVATO (pre-open all tabs, then rapid-paste) ═══
app.post('/api/send-all-to-envato', async (req, res) => {
  try {
    const { prompts, aspectRatios, referenceImages } = req.body;

    if (!prompts || !Array.isArray(prompts) || prompts.length === 0) {
      return res.status(400).json({ success: false, error: 'No prompts provided' });
    }

    // Map per-prompt aspect ratios
    function mapAspect(ratio) {
      if (ratio === '1:2') return 'Portrait';
      if (ratio === '2:1') return 'Landscape';
      return 'Square';
    }
    const envatoAspects = (aspectRatios && Array.isArray(aspectRatios))
      ? aspectRatios.map(mapAspect)
      : prompts.map(() => 'Square');

    // Write reference images to tmp-ref if provided
    let refFilenames = [];
    if (referenceImages && Array.isArray(referenceImages) && referenceImages.length > 0) {
      refFilenames = await writeRefImages(referenceImages);
      console.log(`\n🚀 BULK Send to Envato: ${prompts.length} prompts, aspects=[${envatoAspects.join(', ')}], refs=${refFilenames.length}`);
    } else {
      console.log(`\n🚀 BULK Send to Envato: ${prompts.length} prompts, aspects=[${envatoAspects.join(', ')}]`);
    }

    const timestamp = Date.now();
    const tempDir = path.join(os.tmpdir(), `envato-bulk-${timestamp}`);
    await fs.mkdir(tempDir, { recursive: true });

    // Write each prompt to its own temp file
    const promptFiles = [];
    for (let i = 0; i < prompts.length; i++) {
      const promptFile = path.join(tempDir, `prompt-${i}.txt`);
      await fs.writeFile(promptFile, sanitizePrompt(prompts[i]), 'utf8');
      promptFiles.push(promptFile);
    }

    // Write reference upload JS to temp file if we have images
    let refJSFile = '';
    if (refFilenames.length > 0) {
      refJSFile = path.join(tempDir, 'ref-upload.js');
      await fs.writeFile(refJSFile, generateRefUploadJS(refFilenames), 'utf8');
    }

    const tabCount = prompts.length;

    // Build bulk AppleScript: open all tabs -> wait -> paste each
    let script = `
tell application "Google Chrome"
  activate
  set w to front window
  -- Open ALL tabs at once
`;
    for (let i = 0; i < tabCount; i++) {
      script += `  tell w to make new tab with properties {URL:"https://labs.envato.com/apps/image-gen/"}\n`;
    }
    script += `
  -- Wait for all tabs to load
  set tabTotal to count of tabs of w
  repeat 60 times
    set allDone to true
    repeat with i from (tabTotal - ${tabCount - 1}) to tabTotal
      if (loading of tab i of w) then set allDone to false
    end repeat
    if allDone then exit repeat
    delay 0.1
  end repeat
  delay 0.3
end tell
`;

    // Build ref upload AppleScript section for bulk (same for all tabs)
    let bulkRefSection = '';
    if (refFilenames.length > 0) {
      bulkRefSection = `
  -- Upload reference images
  set refJS to do shell script "cat " & quoted form of "${refJSFile}"
  execute active tab of w javascript refJS
  -- Wait for ref upload to complete
  repeat 30 times
    set isDone to (execute active tab of w javascript "window.__refUploadDone ? 'yes' : 'no'")
    if isDone is "yes" then exit repeat
    delay 0.5
  end repeat
  delay 0.5`;
    }

    // For each tab: switch + paste text + click Generate
    for (let i = 0; i < tabCount; i++) {
      const promptFile = promptFiles[i];

      script += `
-- TAB ${i + 1}/${tabCount}
tell application "Google Chrome"
  set w to front window
  set tabTotal to count of tabs of w
  set active tab index of w to (tabTotal - ${tabCount - 1 - i})
  -- Wait for input ready (tight polling)
  repeat 30 times
    set inputReady to (execute active tab of w javascript "
      var ta = document.querySelector('textarea, input[type=text]');
      ta ? '1' : '0';
    ")
    if inputReady is "1" then exit repeat
    delay 0.1
  end repeat
${bulkRefSection}
  -- Select aspect ratio (combined: open dropdown + pick option in one call)
  execute active tab of w javascript "
    (function(){
      var triggers = document.querySelectorAll('button, [role=combobox], [role=listbox], select');
      for(var j=0;j<triggers.length;j++){
        var txt = triggers[j].textContent.trim().toLowerCase();
        if(txt.includes('square')||txt.includes('portrait')||txt.includes('landscape')){
          triggers[j].click();
          break;
        }
      }
      setTimeout(function(){
        var target = '${envatoAspects[i]}'.toLowerCase();
        var items = document.querySelectorAll('li, label, button, div[role=option], span');
        for(var k=0;k<items.length;k++){
          if(items[k].textContent.trim().toLowerCase()===target){
            items[k].click(); break;
          }
        }
      }, 150);
    })();
    'ok';
  "
  delay 0.25
  -- Focus input
  execute active tab of w javascript "
    var ta = document.querySelector('textarea, input[type=text]');
    if(ta){ta.focus();ta.click();} 'ok';
  "
end tell
-- Paste text
do shell script "cat " & quoted form of "${promptFile}" & " | pbcopy"
tell application "System Events" to keystroke "v" using command down
delay 0.5
-- Click Generate
tell application "Google Chrome"
  execute active tab of w javascript "
    var btns = document.querySelectorAll('button');
    for(var i=0;i<btns.length;i++){
      if(btns[i].textContent.trim().toLowerCase().includes('generate')){
        btns[i].click();
        break;
      }
    }
    'ok';
  "
end tell
delay 0.15
`;
    }

    script += `\nreturn "done"\n`;

    const scriptFile = path.join(tempDir, 'bulk_automate.scpt');
    await fs.writeFile(scriptFile, script, 'utf8');

    console.log(`  📝 Executing FAST bulk Envato automation (${tabCount} tabs)...`);

    exec(`osascript "${scriptFile}"`, { timeout: 90000 }, (error) => {
      setTimeout(() => { fs.rm(tempDir, { recursive: true }).catch(() => {}); }, 30000);
      if (error) console.error('  [X] Bulk Envato error:', error.message);
      else console.log(`  [OK] Bulk Envato done (${tabCount} tabs)`);
    });

    res.json({ success: true, message: `Opening ${tabCount} Envato tabs...`, count: tabCount });

  } catch (error) {
    console.error('[X] Bulk Send to Envato error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// ═══ IMAGE TO VIDEO: Generate image on ImageGen, wait, then convert to video ═══
app.post('/api/send-to-envato-image-to-video', async (req, res) => {
  try {
    const { imagePrompt, videoPrompt, speech, referenceImages } = req.body;

    if (!imagePrompt) {
      return res.status(400).json({ success: false, error: 'No image prompt provided' });
    }

    // Puppeteer disabled — no headless Chrome to close
    // await envatoPuppeteer.closeBrowser().catch(() => {});

    // Write reference images to tmp-ref if provided
    let refFilenames = [];
    if (referenceImages && Array.isArray(referenceImages) && referenceImages.length > 0) {
      refFilenames = await writeRefImages(referenceImages);
    }

    console.log(`\n🎬🖼️ Image→Video: imgPrompt=${imagePrompt.length} chars, vidPrompt=${(videoPrompt || '').length} chars, speech=${(speech || '').length} chars, refs=${refFilenames.length}`);

    const timestamp = Date.now();
    const tempDir = path.join(os.tmpdir(), `envato-img2vid-${timestamp}`);
    await fs.mkdir(tempDir, { recursive: true });

    // Write image prompt (ASCII for ImageGen)
    const imgPromptFile = path.join(tempDir, 'img_prompt.txt');
    await fs.writeFile(imgPromptFile, sanitizePrompt(imagePrompt), 'utf8');

    // Combine video prompt + speech (Unicode-safe for VideoGen)
    const hasSpeech = speech && speech.trim().length > 0;
    const vidText = videoPrompt || imagePrompt;
    const combinedVideo = hasSpeech
      ? `${vidText}\n\nVoiceover (Spanish): ${speech}`
      : vidText;
    const vidPromptFile = path.join(tempDir, 'vid_prompt.txt');
    await fs.writeFile(vidPromptFile, sanitizeVideoPrompt(combinedVideo), 'utf8');

    // Write reference upload JS if we have images
    let refJSFile = '';
    if (refFilenames.length > 0) {
      refJSFile = path.join(tempDir, 'ref-upload.js');
      await fs.writeFile(refJSFile, generateRefUploadJS(refFilenames), 'utf8');
    }

    // Build reference image upload AppleScript section
    // Use fetch() from the page to load and execute the JS (avoids do shell script which can break System Events auth)
    let refUploadSection = '';
    if (refFilenames.length > 0) {
      refUploadSection = `
  -- Upload reference images via fetch from local server
  execute tab myTab of w javascript "fetch('http://localhost:${PORT}/tmp-ref/ref-upload.js').then(r=>r.text()).then(js=>eval(js)).catch(e=>{ window.__refUploadDone=true; });"
  -- Wait for ref upload to complete
  repeat 30 times
    set isDone to (execute tab myTab of w javascript "window.__refUploadDone ? 'yes' : 'no'")
    if isDone is "yes" then exit repeat
    delay 0.5
  end repeat
  delay 0.5`;
      // Also save ref-upload.js to the CORS-enabled tmp-ref dir so the page can fetch it
      await fs.writeFile(path.join(tmpRefDir, 'ref-upload.js'), generateRefUploadJS(refFilenames), 'utf8');
    }

    // Full AppleScript pipeline:
    // 1. Open ImageGen → upload refs → paste image prompt → Generate
    // 2. Wait ~25s for image generation
    // 3. Click generated image → detail view
    // 4. Click "Video" button → opens VideoGen with image
    // 5. Configure 9:16, Sound, Speech
    // 6. Paste video prompt → React update → Generate
    const sessionMarker = `axkan_${Date.now()}`;
    const appleScript = `
tell application "Google Chrome"
  activate
  -- Ensure at least one window exists
  if (count of windows) is 0 then
    make new window
    delay 1.0
  end if
  set w to front window
  -- Open new tab and remember its index
  tell w to make new tab with properties {URL:"https://labs.envato.com/apps/image-gen/"}
  set myTab to (count of tabs of w)

  -- Wait for page load
  repeat 60 times
    if not (loading of tab myTab of w) then exit repeat
    delay 0.15
  end repeat
  delay 1.5

  -- Re-focus our tab (user may have switched)
  set active tab index of w to myTab

  -- Mark this tab with a unique session ID so we can find it later
  execute tab myTab of w javascript "window.__axkan_session='${sessionMarker}';"

  -- Wait for textarea
  repeat 40 times
    set inputReady to (execute tab myTab of w javascript "
      var ta = document.querySelector('textarea');
      ta ? '1' : '0';
    ")
    if inputReady is "1" then exit repeat
    delay 0.2
  end repeat
  delay 0.3
${refUploadSection}
  -- Select Portrait (9:16) aspect ratio for video-ready images
  -- Step 1: Click the current aspect ratio button to open dropdown
  execute tab myTab of w javascript "
    (function(){
      var btns = document.querySelectorAll('button');
      for(var i=0;i<btns.length;i++){
        var t = btns[i].textContent.trim();
        if(t==='Square' || t==='Portrait' || t==='Landscape'){
          btns[i].click();
          return 'opened: ' + t;
        }
      }
      return 'not found';
    })();
  "
  delay 0.5
  -- Step 2: Click Portrait
  execute tab myTab of w javascript "
    (function(){
      var btns = document.querySelectorAll('button');
      for(var i=0;i<btns.length;i++){
        if(btns[i].textContent.trim()==='Portrait'){
          btns[i].click();
          return 'portrait selected';
        }
      }
      return 'not found';
    })();
  "
  delay 0.5

  -- Focus textarea and select all
  set active tab index of w to myTab
  execute tab myTab of w javascript "
    var ta = document.querySelector('textarea');
    if(ta){ta.focus();ta.select();} 'ok';
  "
end tell

-- PHASE 1: Paste image prompt (re-focus our tab first)
tell application "Google Chrome"
  set active tab index of front window to myTab
end tell
do shell script "cat " & quoted form of "${imgPromptFile}" & " | pbcopy"
tell application "System Events" to keystroke "v" using command down
delay 1.0

-- Trigger React update for image prompt
tell application "Google Chrome"
  set w to front window
  set active tab index of w to myTab
  execute tab myTab of w javascript "
    (function(){
      var ta = document.querySelector('textarea');
      if(!ta) return 'no textarea';
      var nativeSetter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, 'value').set;
      nativeSetter.call(ta, ta.value);
      ta.dispatchEvent(new Event('input', {bubbles:true}));
      ta.dispatchEvent(new Event('change', {bubbles:true}));
      return 'ok: ' + ta.value.length;
    })();
  "
  delay 0.5

  -- Tag all existing images so we can distinguish them from the NEW one after generation
  execute tab myTab of w javascript "
    (function(){
      var imgs = document.querySelectorAll('img');
      for(var i=0;i<imgs.length;i++) imgs[i].setAttribute('data-axkan-old','1');
      return 'tagged ' + imgs.length + ' existing images';
    })();
  "
  delay 0.2

  -- Click Generate for image
  execute tab myTab of w javascript "
    (function(){
      var btns = document.querySelectorAll('button');
      for(var i=0;i<btns.length;i++){
        if(btns[i].textContent.trim().toLowerCase().includes('generate')){
          btns[i].disabled = false;
          btns[i].dispatchEvent(new MouseEvent('click',{bubbles:true,cancelable:true}));
          return 'generate clicked';
        }
      }
      return 'not found';
    })();
  "
end tell

-- PHASE 2: Wait for image generation (~25 seconds)
delay 25

-- Re-focus our SPECIFIC tab by session marker (not just any image-gen tab)
tell application "Google Chrome"
  activate
  set foundTab to false
  repeat with winIdx from 1 to (count of windows)
    repeat with tIdx from 1 to (count of tabs of window winIdx)
      if URL of tab tIdx of window winIdx contains "image-gen" then
        try
          set markerVal to (execute tab tIdx of window winIdx javascript "window.__axkan_session || ''")
          if markerVal is "${sessionMarker}" then
            set w to window winIdx
            set myTab to tIdx
            set active tab index of w to myTab
            set foundTab to true
            exit repeat
          end if
        end try
      end if
    end repeat
    if foundTab then exit repeat
  end repeat
  -- Fallback: if marker not found (page refreshed?), use last image-gen tab
  if not foundTab then
    repeat with winIdx from 1 to (count of windows)
      repeat with tIdx from (count of tabs of window winIdx) to 1 by -1
        if URL of tab tIdx of window winIdx contains "image-gen" then
          set w to window winIdx
          set myTab to tIdx
          set active tab index of w to myTab
          set foundTab to true
          exit repeat
        end if
      end repeat
      if foundTab then exit repeat
    end repeat
  end if

  -- Click the NEW generated image (skip images tagged data-axkan-old)
  set imgCoords to (execute tab myTab of w javascript "
    (function(){
      var imgs = document.querySelectorAll('img');
      var newImgs = [];
      var allImgs = [];
      for(var i=0;i<imgs.length;i++){
        var r = imgs[i].getBoundingClientRect();
        if(r.width > 120 && r.height > 120 && r.y > 80 && r.y < window.innerHeight){
          var entry = {el: imgs[i], y: r.y, x: r.x, area: r.width*r.height};
          allImgs.push(entry);
          if(!imgs[i].hasAttribute('data-axkan-old')) newImgs.push(entry);
        }
      }
      var candidates = newImgs.length > 0 ? newImgs : allImgs;
      if(candidates.length === 0) return '';
      candidates.sort(function(a,b){ return a.y - b.y || a.x - b.x; });
      var pick = candidates[0].el;
      pick.click();
      var r = pick.getBoundingClientRect();
      return Math.round(r.x + r.width/2) + ',' + Math.round(r.y + r.height/2);
    })();
  ")
  delay 1.5

  -- Physical click fallback (wrapped in try to avoid -25200 errors)
  if imgCoords is not "" then
    try
      set active tab index of w to myTab
      set AppleScript's text item delimiters to ","
      set imgParts to text items of imgCoords
      set AppleScript's text item delimiters to ""
      set winBounds to bounds of w
      set winX to item 1 of winBounds
      set winY to item 2 of winBounds
      set clickX to winX + (item 1 of imgParts as integer)
      set clickY to winY + 88 + (item 2 of imgParts as integer)
      tell application "System Events"
        click at {clickX, clickY}
      end tell
    end try
  end if
  delay 2.0

  -- PHASE 3: Click "Video" button — this opens a NEW tab
  -- Wait for the detail view to load and the "Video" button to appear (poll up to 15s)
  set vidBtnFound to false
  repeat 30 times
    set vidCheck to (execute tab myTab of w javascript "
      (function(){
        var btns = document.querySelectorAll('button');
        for(var i=0;i<btns.length;i++){
          var t = btns[i].textContent.trim();
          if(t==='Video' || t.includes('Video')){
            return 'found';
          }
        }
        return 'no';
      })();
    ")
    if vidCheck is "found" then
      set vidBtnFound to true
      exit repeat
    end if
    delay 0.5
  end repeat

  -- Close ALL existing video-gen tabs before clicking Video (prevents finding old ones)
  repeat
    set foundOld to false
    repeat with winIdx from 1 to (count of windows)
      repeat with tIdx from (count of tabs of window winIdx) to 1 by -1
        if URL of tab tIdx of window winIdx contains "video-gen" then
          close tab tIdx of window winIdx
          set foundOld to true
          exit repeat
        end if
      end repeat
      if foundOld then exit repeat
    end repeat
    if not foundOld then exit repeat
  end repeat
  delay 0.3

  -- Re-find our ImageGen tab by session marker (closing tabs shifted indices)
  repeat with winIdx from 1 to (count of windows)
    repeat with tIdx from 1 to (count of tabs of window winIdx)
      if URL of tab tIdx of window winIdx contains "image-gen" then
        try
          set mkVal to (execute tab tIdx of window winIdx javascript "window.__axkan_session || ''")
          if mkVal is "${sessionMarker}" then
            set w to window winIdx
            set myTab to tIdx
            set active tab index of w to myTab
            exit repeat
          end if
        end try
      end if
    end repeat
  end repeat

  -- JS click on Video button (this opens a NEW tab — Chrome auto-switches to it)
  execute tab myTab of w javascript "
    (function(){
      var btns = document.querySelectorAll('button');
      for(var i=0;i<btns.length;i++){
        var t = btns[i].textContent.trim();
        if(t==='Video' || t.includes('Video')){
          btns[i].click();
          return 'video clicked';
        }
      }
      return 'not found';
    })();
  "
  delay 3.0

  -- Find the NEW video-gen tab (old ones were closed, so this must be fresh)
  set vidFound to false
  repeat 30 times
    repeat with winIdx from 1 to (count of windows)
      repeat with tIdx from 1 to (count of tabs of window winIdx)
        if URL of tab tIdx of window winIdx contains "video-gen" then
          set w to window winIdx
          set myTab to tIdx
          set active tab index of w to myTab
          set vidFound to true
          exit repeat
        end if
      end repeat
      if vidFound then exit repeat
    end repeat
    if vidFound then exit repeat
    delay 0.5
  end repeat

  -- Wait for VideoGen page to load (textarea appears)
  repeat 40 times
    set vidReady to (execute tab myTab of w javascript "
      var ta = document.querySelector('textarea');
      ta ? '1' : '0';
    ")
    if vidReady is "1" then exit repeat
    delay 0.3
  end repeat
  delay 0.5

  -- PHASE 4: Configure video settings
  set active tab index of w to myTab

  -- Step A: Open aspect ratio dropdown
  execute tab myTab of w javascript "
    (function(){
      var btns = document.querySelectorAll('button');
      for(var i=0;i<btns.length;i++){
        var t = btns[i].textContent.trim();
        var r = btns[i].getBoundingClientRect();
        if((t==='16:9' || t==='9:16' || t==='1:1') && r.height>=40 && r.height<=60){
          btns[i].dispatchEvent(new MouseEvent('click',{bubbles:true,cancelable:true}));
          return 'opened ratio: ' + t;
        }
      }
      return 'ratio not found';
    })();
  "
  delay 0.5

  -- Step B: Select 9:16
  execute tab myTab of w javascript "
    (function(){
      var btns = document.querySelectorAll('button');
      for(var i=0;i<btns.length;i++){
        if(btns[i].textContent.trim()==='9:16'){
          btns[i].dispatchEvent(new MouseEvent('click',{bubbles:true,cancelable:true}));
          return 'selected 9:16';
        }
      }
      return 'not found';
    })();
  "
  delay 0.5

  -- Step C: Click settings icon
  execute tab myTab of w javascript "
    (function(){
      var btns = document.querySelectorAll('button');
      for(var i=0;i<btns.length;i++){
        var r = btns[i].getBoundingClientRect();
        var t = btns[i].textContent.trim();
        if(t==='' && !btns[i].disabled && r.width>=40 && r.width<=60 && r.height>=40 && r.height<=60){
          if(btns[i].querySelector('svg')){
            btns[i].dispatchEvent(new MouseEvent('click',{bubbles:true,cancelable:true}));
            return 'opened settings';
          }
        }
      }
      return 'not found';
    })();
  "
  delay 0.5

  -- Step D: Click Sound
  execute tab myTab of w javascript "
    (function(){
      var btns = document.querySelectorAll('button');
      for(var i=0;i<btns.length;i++){
        if(btns[i].textContent.trim()==='Sound' && !btns[i].disabled){
          btns[i].dispatchEvent(new MouseEvent('click',{bubbles:true,cancelable:true}));
          return 'sound on';
        }
      }
      return 'not found';
    })();
  "
  delay 0.5

  -- Step E: Click Speech
  execute tab myTab of w javascript "
    (function(){
      var btns = document.querySelectorAll('button');
      for(var i=0;i<btns.length;i++){
        if(btns[i].textContent.trim()==='Speech' && !btns[i].disabled){
          btns[i].dispatchEvent(new MouseEvent('click',{bubbles:true,cancelable:true}));
          return 'speech on';
        }
      }
      return 'not found';
    })();
  "
  delay 0.3

  -- Step F: Close settings dropdown
  execute tab myTab of w javascript "
    document.body.dispatchEvent(new MouseEvent('click',{bubbles:true,cancelable:true}));
    'ok';
  "
  delay 0.3

  -- Step G: Focus video textarea and select all
  set active tab index of w to myTab
  execute tab myTab of w javascript "
    var ta = document.querySelector('textarea');
    if(ta){ta.focus();ta.select();} 'ok';
  "
end tell

-- PHASE 5: Paste video prompt (re-focus video-gen tab first)
tell application "Google Chrome"
  activate
  set active tab index of w to myTab
end tell
do shell script "cat " & quoted form of "${vidPromptFile}" & " | pbcopy"
tell application "System Events" to keystroke "v" using command down
delay 1.5

-- Trigger React update and Generate (w and myTab still reference the video-gen tab)
tell application "Google Chrome"
  set active tab index of w to myTab
  execute tab myTab of w javascript "
    (function(){
      var ta = document.querySelector('textarea');
      if(!ta) return 'no textarea';
      var nativeSetter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, 'value').set;
      nativeSetter.call(ta, ta.value);
      ta.dispatchEvent(new Event('input', {bubbles:true}));
      ta.dispatchEvent(new Event('change', {bubbles:true}));
      return 'react update: ' + ta.value.length;
    })();
  "
  delay 0.5

  -- PHASE 6: Click Generate for video
  execute tab myTab of w javascript "
    (function(){
      var btns = document.querySelectorAll('button');
      for(var i=0;i<btns.length;i++){
        if(btns[i].textContent.trim().toLowerCase().includes('generate')){
          btns[i].disabled = false;
          btns[i].dispatchEvent(new MouseEvent('click',{bubbles:true,cancelable:true}));
          return 'video generate clicked';
        }
      }
      return 'not found';
    })();
  "
end tell
return "done"
`;

    const scriptFile = path.join(tempDir, 'img2vid_automate.scpt');
    await fs.writeFile(scriptFile, appleScript, 'utf8');

    // Long timeout: ~50s image gen + ~20s video setup
    exec(`osascript "${scriptFile}"`, { timeout: 120000 }, (error) => {
      setTimeout(() => { fs.rm(tempDir, { recursive: true }).catch(() => {}); }, 60000);
      if (error) console.error('  [X] Image→Video AppleScript error:', error.message);
      else console.log('  [OK] Image→Video automation completed');
    });

    res.json({ success: true, message: 'Image→Video pipeline started (image gen ~50s, then auto-converts to video)...' });

  } catch (error) {
    console.error('[X] Image→Video error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// ═══ BULK IMAGE→VIDEO: All clips in ONE script (parallel image gen, sequential video setup) ═══
app.post('/api/send-bulk-image-to-video', async (req, res) => {
  try {
    const { clips, referenceImages } = req.body;
    // clips = [{imagePrompt, videoPrompt, speech}, ...]

    if (!clips || !Array.isArray(clips) || clips.length === 0) {
      return res.status(400).json({ success: false, error: 'No clips provided' });
    }

    // Puppeteer disabled — no headless Chrome to close
    // await envatoPuppeteer.closeBrowser().catch(() => {});

    // Write reference images
    let refFilenames = [];
    if (referenceImages && Array.isArray(referenceImages) && referenceImages.length > 0) {
      refFilenames = await writeRefImages(referenceImages);
    }

    const clipCount = clips.length;
    console.log(`\n🎬🚀 BULK Image→Video: ${clipCount} clips, refs=${refFilenames.length}`);

    const timestamp = Date.now();
    const tempDir = path.join(os.tmpdir(), `envato-bulk-img2vid-${timestamp}`);
    await fs.mkdir(tempDir, { recursive: true });

    // Write all prompt files
    const imgPromptFiles = [];
    const vidPromptFiles = [];
    for (let i = 0; i < clipCount; i++) {
      const c = clips[i];
      const imgFile = path.join(tempDir, `img_prompt_${i}.txt`);
      await fs.writeFile(imgFile, sanitizePrompt(c.imagePrompt), 'utf8');
      imgPromptFiles.push(imgFile);

      const hasSpeech = c.speech && c.speech.trim().length > 0;
      const vidText = c.videoPrompt || c.imagePrompt;
      const combined = hasSpeech ? `${vidText}\n\nVoiceover (Spanish): ${c.speech}` : vidText;
      const vidFile = path.join(tempDir, `vid_prompt_${i}.txt`);
      await fs.writeFile(vidFile, sanitizeVideoPrompt(combined), 'utf8');
      vidPromptFiles.push(vidFile);
    }

    // Write ref upload JS
    let refUploadSection = '';
    if (refFilenames.length > 0) {
      await fs.writeFile(path.join(tmpRefDir, 'ref-upload.js'), generateRefUploadJS(refFilenames), 'utf8');
      refUploadSection = `
  -- Upload reference images via fetch
  execute tab myTab of w javascript "fetch('http://localhost:${PORT}/tmp-ref/ref-upload.js').then(r=>r.text()).then(js=>eval(js)).catch(e=>{ window.__refUploadDone=true; });"
  repeat 30 times
    set isDone to (execute tab myTab of w javascript "window.__refUploadDone ? 'yes' : 'no'")
    if isDone is "yes" then exit repeat
    delay 0.5
  end repeat
  delay 0.5`;
    }

    // ─── BUILD APPLESCRIPT ───
    // Session markers for each tab (so Phase C can reliably find them)
    const bulkMarkers = [];
    for (let i = 0; i < clipCount; i++) {
      bulkMarkers.push(`axkan_bulk_${Date.now()}_${i}`);
    }

    // PHASE A: Open ALL ImageGen tabs, paste all image prompts, click Generate on each
    let script = `
tell application "Google Chrome"
  activate
  if (count of windows) is 0 then
    make new window
    delay 1.0
  end if
  set w to front window
`;
    // Open N tabs
    for (let i = 0; i < clipCount; i++) {
      script += `  tell w to make new tab with properties {URL:"https://labs.envato.com/apps/image-gen/"}\n`;
    }
    script += `
  -- Wait for all tabs to load
  set tabTotal to count of tabs of w
  set firstTab to (tabTotal - ${clipCount - 1})
  repeat 60 times
    set allDone to true
    repeat with i from firstTab to tabTotal
      if (loading of tab i of w) then set allDone to false
    end repeat
    if allDone then exit repeat
    delay 0.15
  end repeat
  delay 1.5
`;
    // Mark each tab with its unique session marker
    for (let i = 0; i < clipCount; i++) {
      script += `  execute tab (tabTotal - ${clipCount - 1 - i}) of w javascript "window.__axkan_session='${bulkMarkers[i]}';"
`;
    }
    script += `end tell
`;

    // For each tab: set Portrait, upload refs, paste prompt, Generate
    for (let i = 0; i < clipCount; i++) {
      script += `
-- === IMAGE TAB ${i + 1}/${clipCount} ===
tell application "Google Chrome"
  set w to front window
  set tabTotal to count of tabs of w
  set myTab to (tabTotal - ${clipCount - 1 - i})
  set active tab index of w to myTab
  -- Wait for textarea
  repeat 40 times
    set inputReady to (execute tab myTab of w javascript "var ta = document.querySelector('textarea'); ta ? '1' : '0';")
    if inputReady is "1" then exit repeat
    delay 0.2
  end repeat
  delay 0.3
${i === 0 ? refUploadSection : ''}
  -- Select Portrait
  execute tab myTab of w javascript "
    (function(){
      var btns = document.querySelectorAll('button');
      for(var j=0;j<btns.length;j++){
        var t = btns[j].textContent.trim();
        if(t==='Square' || t==='Portrait' || t==='Landscape'){ btns[j].click(); break; }
      }
      setTimeout(function(){
        var items = document.querySelectorAll('button');
        for(var k=0;k<items.length;k++){
          if(items[k].textContent.trim()==='Portrait'){ items[k].click(); break; }
        }
      }, 200);
    })(); 'ok';
  "
  delay 0.5
  -- Focus textarea
  execute tab myTab of w javascript "var ta = document.querySelector('textarea'); if(ta){ta.focus();ta.select();} 'ok';"
end tell
do shell script "cat " & quoted form of "${imgPromptFiles[i]}" & " | pbcopy"
tell application "Google Chrome"
  set active tab index of front window to (count of tabs of front window) - ${clipCount - 1 - i}
end tell
tell application "System Events" to keystroke "v" using command down
delay 0.5
-- React update + Generate
tell application "Google Chrome"
  set w to front window
  set myTab to (count of tabs of w) - ${clipCount - 1 - i}
  execute tab myTab of w javascript "
    (function(){
      var ta = document.querySelector('textarea');
      if(!ta) return 'no textarea';
      var ns = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, 'value').set;
      ns.call(ta, ta.value);
      ta.dispatchEvent(new Event('input', {bubbles:true}));
      ta.dispatchEvent(new Event('change', {bubbles:true}));
      return 'ok';
    })();
  "
  delay 0.3
  -- Tag all existing images before generating
  execute tab myTab of w javascript "
    (function(){
      var imgs = document.querySelectorAll('img');
      for(var i=0;i<imgs.length;i++) imgs[i].setAttribute('data-axkan-old','1');
      return 'tagged ' + imgs.length;
    })();
  "
  delay 0.2
  execute tab myTab of w javascript "
    (function(){
      var btns = document.querySelectorAll('button');
      for(var j=0;j<btns.length;j++){
        if(btns[j].textContent.trim().toLowerCase().includes('generate')){
          btns[j].disabled = false;
          btns[j].dispatchEvent(new MouseEvent('click',{bubbles:true,cancelable:true}));
          return 'generate clicked';
        }
      }
      return 'not found';
    })();
  "
end tell
delay 0.3
`;
    }

    // PHASE B: Wait for ALL images to generate in parallel (~25s)
    script += `
-- === WAIT FOR ALL IMAGES TO GENERATE (parallel, ~25s) ===
delay 28
`;

    // PHASE C: For each ImageGen tab, click image → Video → configure → paste video prompt → Generate
    for (let i = 0; i < clipCount; i++) {
      script += `
-- === VIDEO CONVERSION ${i + 1}/${clipCount} ===
tell application "Google Chrome"
  activate
  set w to front window
  -- Find the ImageGen tab for clip ${i + 1} using session marker
  set foundImg to false
  repeat with winIdx from 1 to (count of windows)
    repeat with tIdx from 1 to (count of tabs of window winIdx)
      if URL of tab tIdx of window winIdx contains "image-gen" then
        try
          set markerVal to (execute tab tIdx of window winIdx javascript "window.__axkan_session || ''")
          if markerVal is "${bulkMarkers[i]}" then
            set w to window winIdx
            set myTab to tIdx
            set active tab index of w to myTab
            set foundImg to true
            exit repeat
          end if
        end try
      end if
    end repeat
    if foundImg then exit repeat
  end repeat
  -- Fallback: use (i+1)th image-gen tab by count
  if not foundImg then
    set imgTabCount to 0
    repeat with winIdx from 1 to (count of windows)
      repeat with tIdx from 1 to (count of tabs of window winIdx)
        if URL of tab tIdx of window winIdx contains "image-gen" then
          set imgTabCount to imgTabCount + 1
          if imgTabCount is ${i + 1} then
            set w to window winIdx
            set myTab to tIdx
            set active tab index of w to myTab
            set foundImg to true
            exit repeat
          end if
        end if
      end repeat
      if foundImg then exit repeat
    end repeat
  end if
  if not foundImg then return "no image-gen tab for clip ${i + 1}"

  -- Click the NEW generated image (skip images tagged data-axkan-old)
  set imgCoords to (execute tab myTab of w javascript "
    (function(){
      var imgs = document.querySelectorAll('img');
      var newImgs = [];
      var allImgs = [];
      for(var j=0;j<imgs.length;j++){
        var r = imgs[j].getBoundingClientRect();
        if(r.width > 120 && r.height > 120 && r.y > 80 && r.y < window.innerHeight){
          var entry = {el: imgs[j], y: r.y, x: r.x, area: r.width*r.height};
          allImgs.push(entry);
          if(!imgs[j].hasAttribute('data-axkan-old')) newImgs.push(entry);
        }
      }
      var candidates = newImgs.length > 0 ? newImgs : allImgs;
      if(candidates.length === 0) return '';
      candidates.sort(function(a,b){ return a.y - b.y || a.x - b.x; });
      var pick = candidates[0].el;
      pick.click();
      var r = pick.getBoundingClientRect();
      return Math.round(r.x + r.width/2) + ',' + Math.round(r.y + r.height/2);
    })();
  ")
  delay 1.5

  -- Physical click fallback (wrapped in try to avoid -25200 errors)
  if imgCoords is not "" then
    try
      set active tab index of w to myTab
      set AppleScript's text item delimiters to ","
      set imgParts to text items of imgCoords
      set AppleScript's text item delimiters to ""
      set winBounds to bounds of w
      set winX to item 1 of winBounds
      set winY to item 2 of winBounds
      set clickX to winX + (item 1 of imgParts as integer)
      set clickY to winY + 88 + (item 2 of imgParts as integer)
      tell application "System Events"
        click at {clickX, clickY}
      end tell
    end try
  end if
  delay 2.0

  -- Wait for Video button
  set vidBtnFound to false
  repeat 30 times
    set vidCheck to (execute tab myTab of w javascript "
      (function(){
        var btns = document.querySelectorAll('button');
        for(var j=0;j<btns.length;j++){
          var t = btns[j].textContent.trim();
          if(t==='Video' || t.includes('Video')) return 'found';
        }
        return 'no';
      })();
    ")
    if vidCheck is "found" then
      set vidBtnFound to true
      exit repeat
    end if
    delay 0.5
  end repeat

  -- Close ALL existing video-gen tabs before clicking Video
  repeat
    set foundOldVid to false
    repeat with winIdx from 1 to (count of windows)
      repeat with tIdx from (count of tabs of window winIdx) to 1 by -1
        if URL of tab tIdx of window winIdx contains "video-gen" then
          close tab tIdx of window winIdx
          set foundOldVid to true
          exit repeat
        end if
      end repeat
      if foundOldVid then exit repeat
    end repeat
    if not foundOldVid then exit repeat
  end repeat
  delay 0.3

  -- Re-find our ImageGen tab by session marker (closing tabs shifted indices)
  repeat with winIdx from 1 to (count of windows)
    repeat with tIdx from 1 to (count of tabs of window winIdx)
      if URL of tab tIdx of window winIdx contains "image-gen" then
        try
          set mkVal to (execute tab tIdx of window winIdx javascript "window.__axkan_session || ''")
          if mkVal is "${bulkMarkers[i]}" then
            set w to window winIdx
            set myTab to tIdx
            set active tab index of w to myTab
            exit repeat
          end if
        end try
      end if
    end repeat
  end repeat

  -- Click Video button (opens new tab)
  execute tab myTab of w javascript "
    (function(){
      var btns = document.querySelectorAll('button');
      for(var j=0;j<btns.length;j++){
        var t = btns[j].textContent.trim();
        if(t==='Video' || t.includes('Video')){ btns[j].click(); return 'video clicked'; }
      }
      return 'not found';
    })();
  "
  delay 3.0

  -- Find the NEW video-gen tab (old ones were closed)
  set vidFound to false
  repeat 30 times
    repeat with winIdx from 1 to (count of windows)
      repeat with tIdx from 1 to (count of tabs of window winIdx)
        if URL of tab tIdx of window winIdx contains "video-gen" then
          set w to window winIdx
          set myTab to tIdx
          set active tab index of w to myTab
          set vidFound to true
          exit repeat
        end if
      end repeat
      if vidFound then exit repeat
    end repeat
    if vidFound then exit repeat
    delay 0.5
  end repeat

  -- Wait for VideoGen textarea
  repeat 40 times
    set vidReady to (execute tab myTab of w javascript "var ta = document.querySelector('textarea'); ta ? '1' : '0';")
    if vidReady is "1" then exit repeat
    delay 0.3
  end repeat
  delay 0.5

  -- Configure: 9:16, Sound, Speech
  set active tab index of w to myTab
  execute tab myTab of w javascript "
    (function(){
      var btns = document.querySelectorAll('button');
      for(var j=0;j<btns.length;j++){
        var t = btns[j].textContent.trim();
        var r = btns[j].getBoundingClientRect();
        if((t==='16:9' || t==='9:16' || t==='1:1') && r.height>=40 && r.height<=60){
          btns[j].dispatchEvent(new MouseEvent('click',{bubbles:true,cancelable:true}));
          break;
        }
      }
    })();
  "
  delay 0.4
  execute tab myTab of w javascript "
    (function(){
      var btns = document.querySelectorAll('button');
      for(var j=0;j<btns.length;j++){
        if(btns[j].textContent.trim()==='9:16'){
          btns[j].dispatchEvent(new MouseEvent('click',{bubbles:true,cancelable:true}));
          break;
        }
      }
    })();
  "
  delay 0.4
  -- Settings: Sound + Speech
  execute tab myTab of w javascript "
    (function(){
      var btns = document.querySelectorAll('button');
      for(var j=0;j<btns.length;j++){
        var r = btns[j].getBoundingClientRect();
        var t = btns[j].textContent.trim();
        if(t==='' && !btns[j].disabled && r.width>=40 && r.width<=60 && r.height>=40 && r.height<=60){
          if(btns[j].querySelector('svg')){ btns[j].dispatchEvent(new MouseEvent('click',{bubbles:true,cancelable:true})); break; }
        }
      }
    })();
  "
  delay 0.4
  execute tab myTab of w javascript "
    (function(){
      var btns = document.querySelectorAll('button');
      for(var j=0;j<btns.length;j++){
        if(btns[j].textContent.trim()==='Sound' && !btns[j].disabled){
          btns[j].dispatchEvent(new MouseEvent('click',{bubbles:true,cancelable:true})); break;
        }
      }
    })();
  "
  delay 0.3
  execute tab myTab of w javascript "
    (function(){
      var btns = document.querySelectorAll('button');
      for(var j=0;j<btns.length;j++){
        if(btns[j].textContent.trim()==='Speech' && !btns[j].disabled){
          btns[j].dispatchEvent(new MouseEvent('click',{bubbles:true,cancelable:true})); break;
        }
      }
    })();
  "
  delay 0.3
  execute tab myTab of w javascript "document.body.dispatchEvent(new MouseEvent('click',{bubbles:true,cancelable:true})); 'ok';"
  delay 0.3
  execute tab myTab of w javascript "var ta = document.querySelector('textarea'); if(ta){ta.focus();ta.select();} 'ok';"
end tell
-- Paste video prompt
do shell script "cat " & quoted form of "${vidPromptFiles[i]}" & " | pbcopy"
tell application "Google Chrome"
  activate
  set active tab index of w to myTab
end tell
tell application "System Events" to keystroke "v" using command down
delay 1.0
-- React update + Generate video
tell application "Google Chrome"
  set active tab index of w to myTab
  execute tab myTab of w javascript "
    (function(){
      var ta = document.querySelector('textarea');
      if(!ta) return 'no textarea';
      var ns = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, 'value').set;
      ns.call(ta, ta.value);
      ta.dispatchEvent(new Event('input', {bubbles:true}));
      ta.dispatchEvent(new Event('change', {bubbles:true}));
      return 'ok';
    })();
  "
  delay 0.3
  execute tab myTab of w javascript "
    (function(){
      var btns = document.querySelectorAll('button');
      for(var j=0;j<btns.length;j++){
        if(btns[j].textContent.trim().toLowerCase().includes('generate')){
          btns[j].disabled = false;
          btns[j].dispatchEvent(new MouseEvent('click',{bubbles:true,cancelable:true}));
          return 'video generate clicked';
        }
      }
      return 'not found';
    })();
  "
end tell
delay 1.0
`;
    }

    script += `return "done"\n`;

    const scriptFile = path.join(tempDir, 'bulk_img2vid.scpt');
    await fs.writeFile(scriptFile, script, 'utf8');

    console.log(`  📝 Executing BULK Image→Video (${clipCount} clips, parallel image gen)...`);

    exec(`osascript "${scriptFile}"`, { timeout: 300000 }, (error) => {
      setTimeout(() => { fs.rm(tempDir, { recursive: true }).catch(() => {}); }, 60000);
      if (error) console.error(`  [X] Bulk Image→Video error: ${error.message}`);
      else console.log(`  [OK] Bulk Image→Video completed (${clipCount} clips)`);
    });

    res.json({ success: true, message: `Bulk Image→Video started: ${clipCount} clips (parallel image gen, ~${25 + clipCount * 15}s total)`, count: clipCount });

  } catch (error) {
    console.error('[X] Bulk Image→Video error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// ═══ SEND TO ENVATO VIDEO GEN (single prompt — video, 9:16, Sound+Speech) ═══
app.post('/api/send-to-envato-video', async (req, res) => {
  try {
    const { prompt, speech } = req.body;

    if (!prompt) {
      return res.status(400).json({ success: false, error: 'No prompt provided' });
    }

    console.log(`\n🎬 Send to Envato Video Gen: prompt length=${prompt.length}, speech length=${(speech || '').length}`);

    const timestamp = Date.now();
    const tempDir = path.join(os.tmpdir(), `envato-video-${timestamp}`);
    await fs.mkdir(tempDir, { recursive: true });

    // Combine prompt + speech into one text (Envato has only 1 textarea, Speech toggle = AI voiceover)
    const hasSpeech = speech && speech.trim().length > 0;
    const combinedPrompt = hasSpeech
      ? `${prompt}\n\nVoiceover (Spanish): ${speech}`
      : prompt;

    const promptFile = path.join(tempDir, 'prompt.txt');
    await fs.writeFile(promptFile, sanitizeVideoPrompt(combinedPrompt), 'utf8');

    // AppleScript: open Envato Video Gen, select 9:16, enable Sound+Speech, paste prompt
    // DOM sequence verified via live browser inspection:
    // 1. Click ratio button (text "16:9") to open dropdown -> click "9:16"
    // 2. Click settings icon (empty 48x48 btn after ratio) to open Sound/Speech panel
    // 3. Click Sound btn -> enables Speech btn
    // 4. Click Speech btn
    // 5. Close dropdown -> paste prompt -> Generate
    const appleScript = `
tell application "Google Chrome"
  activate
  set w to front window
  tell w to make new tab with properties {URL:"https://labs.envato.com/video-gen"}
  set myTab to (count of tabs of w)

  -- Wait for page to load
  repeat 60 times
    if not (loading of tab myTab of w) then exit repeat
    delay 0.15
  end repeat
  delay 2.0

  -- Re-focus our tab
  set active tab index of w to myTab

  -- STEP 1: Open aspect ratio dropdown
  execute tab myTab of w javascript "
    (function(){
      var btns = document.querySelectorAll('button');
      for(var i=0;i<btns.length;i++){
        var t = btns[i].textContent.trim();
        var r = btns[i].getBoundingClientRect();
        if((t==='16:9' || t==='9:16' || t==='1:1') && r.height>=40 && r.height<=60){
          btns[i].dispatchEvent(new MouseEvent('click',{bubbles:true,cancelable:true}));
          return 'opened ratio dropdown: ' + t;
        }
      }
      return 'ratio button not found';
    })();
  "
  delay 0.5

  -- STEP 2: Click 9:16
  execute tab myTab of w javascript "
    (function(){
      var btns = document.querySelectorAll('button');
      for(var i=0;i<btns.length;i++){
        if(btns[i].textContent.trim()==='9:16'){
          btns[i].dispatchEvent(new MouseEvent('click',{bubbles:true,cancelable:true}));
          return 'selected 9:16';
        }
      }
      return '9:16 not found';
    })();
  "
  delay 0.5

  -- STEP 3: Click settings icon
  execute tab myTab of w javascript "
    (function(){
      var btns = document.querySelectorAll('button');
      for(var i=0;i<btns.length;i++){
        var r = btns[i].getBoundingClientRect();
        var t = btns[i].textContent.trim();
        if(t==='' && !btns[i].disabled && r.width>=40 && r.width<=60 && r.height>=40 && r.height<=60){
          if(btns[i].querySelector('svg')){
            btns[i].dispatchEvent(new MouseEvent('click',{bubbles:true,cancelable:true}));
            return 'opened settings';
          }
        }
      }
      return 'settings icon not found';
    })();
  "
  delay 0.5

  -- STEP 4: Click Sound
  execute tab myTab of w javascript "
    (function(){
      var btns = document.querySelectorAll('button');
      for(var i=0;i<btns.length;i++){
        if(btns[i].textContent.trim()==='Sound' && !btns[i].disabled){
          btns[i].dispatchEvent(new MouseEvent('click',{bubbles:true,cancelable:true}));
          return 'sound clicked';
        }
      }
      return 'sound not found';
    })();
  "
  delay 0.5

  -- STEP 5: Click Speech
  execute tab myTab of w javascript "
    (function(){
      var btns = document.querySelectorAll('button');
      for(var i=0;i<btns.length;i++){
        if(btns[i].textContent.trim()==='Speech' && !btns[i].disabled){
          btns[i].dispatchEvent(new MouseEvent('click',{bubbles:true,cancelable:true}));
          return 'speech clicked';
        }
      }
      return 'speech not found or disabled';
    })();
  "
  delay 0.3

  -- STEP 6: Close the settings dropdown
  execute tab myTab of w javascript "
    document.body.dispatchEvent(new MouseEvent('click',{bubbles:true,cancelable:true}));
    'closed dropdown';
  "
  delay 0.3

  -- STEP 7: Focus textarea and select all
  set active tab index of w to myTab
  execute tab myTab of w javascript "
    var ta = document.querySelector('textarea');
    if(ta){ta.focus();ta.select();} 'ok';
  "
end tell
-- Paste prompt via clipboard (re-focus tab first)
tell application "Google Chrome"
  set active tab index of front window to myTab
end tell
do shell script "cat " & quoted form of "${promptFile}" & " | pbcopy"
tell application "System Events" to keystroke "v" using command down
delay 1.5
-- STEP 8: Trigger React state update
tell application "Google Chrome"
  set w to front window
  set active tab index of w to myTab
  execute tab myTab of w javascript "
    (function(){
      var ta = document.querySelector('textarea');
      if(!ta) return 'no textarea';
      var nativeSetter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, 'value').set;
      nativeSetter.call(ta, ta.value);
      ta.dispatchEvent(new Event('input', {bubbles:true}));
      ta.dispatchEvent(new Event('change', {bubbles:true}));
      return 'react update: ' + ta.value.length;
    })();
  "
  delay 0.5
  -- STEP 9: Click Generate (now enabled)
  execute tab myTab of w javascript "
    (function(){
      var btns = document.querySelectorAll('button');
      for(var i=0;i<btns.length;i++){
        if(btns[i].textContent.trim().toLowerCase().includes('generate')){
          btns[i].disabled = false;
          btns[i].dispatchEvent(new MouseEvent('click',{bubbles:true,cancelable:true}));
          return 'generate clicked';
        }
      }
      return 'generate not found';
    })();
  "
end tell
return "done"
`;

    const scriptFile = path.join(tempDir, 'automate.scpt');
    await fs.writeFile(scriptFile, appleScript, 'utf8');

    exec(`osascript "${scriptFile}"`, { timeout: 45000 }, (error) => {
      setTimeout(() => { fs.rm(tempDir, { recursive: true }).catch(() => {}); }, 30000);
      if (error) console.error('  [X] Envato Video AppleScript error:', error.message);
      else console.log('  [OK] Envato Video automation completed');
    });

    res.json({ success: true, message: 'Sending to Envato Video Gen...' });

  } catch (error) {
    console.error('[X] Send to Envato Video error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// ═══ BULK SEND TO ENVATO VIDEO GEN (each prompt = one video) ═══
app.post('/api/send-all-to-envato-video', async (req, res) => {
  try {
    const { prompts, speeches } = req.body;

    if (!prompts || !Array.isArray(prompts) || prompts.length === 0) {
      return res.status(400).json({ success: false, error: 'No prompts provided' });
    }

    const speechList = (speeches && Array.isArray(speeches)) ? speeches : prompts.map(() => '');

    console.log(`\n🎬 BULK Send to Envato Video Gen: ${prompts.length} videos`);

    const timestamp = Date.now();
    const tempDir = path.join(os.tmpdir(), `envato-video-bulk-${timestamp}`);
    await fs.mkdir(tempDir, { recursive: true });

    // Write each combined prompt+speech to temp files
    const promptFiles = [];
    for (let i = 0; i < prompts.length; i++) {
      const hasSpeech = speechList[i] && speechList[i].trim().length > 0;
      const combined = hasSpeech
        ? `${prompts[i]}\n\nVoiceover (Spanish): ${speechList[i]}`
        : prompts[i];
      const pf = path.join(tempDir, `prompt-${i}.txt`);
      await fs.writeFile(pf, sanitizeVideoPrompt(combined), 'utf8');
      promptFiles.push(pf);
    }

    const tabCount = prompts.length;

    // Build bulk AppleScript: open all tabs -> wait -> configure each
    let script = `
tell application "Google Chrome"
  activate
  set w to front window
  -- Open ALL tabs at once
`;
    for (let i = 0; i < tabCount; i++) {
      script += `  tell w to make new tab with properties {URL:"https://labs.envato.com/video-gen"}\n`;
    }
    script += `
  -- Wait for all tabs to load
  set tabTotal to count of tabs of w
  repeat 80 times
    set allDone to true
    repeat with i from (tabTotal - ${tabCount - 1}) to tabTotal
      if (loading of tab i of w) then set allDone to false
    end repeat
    if allDone then exit repeat
    delay 0.15
  end repeat
  delay 2.0
end tell
`;

    // For each tab: switch + select 9:16 + Sound + Speech + paste prompt
    for (let i = 0; i < tabCount; i++) {
      script += `
-- TAB ${i + 1}/${tabCount}
tell application "Google Chrome"
  set w to front window
  set tabTotal to count of tabs of w
  set active tab index of w to (tabTotal - ${tabCount - 1 - i})
  -- Wait for textarea ready
  repeat 40 times
    set inputReady to (execute active tab of w javascript "
      var ta = document.querySelector('textarea');
      ta ? '1' : '0';
    ")
    if inputReady is "1" then exit repeat
    delay 0.2
  end repeat
  delay 0.3

  -- STEP 1: Open aspect ratio dropdown
  execute active tab of w javascript "
    (function(){
      var btns = document.querySelectorAll('button');
      for(var i=0;i<btns.length;i++){
        var t = btns[i].textContent.trim();
        var r = btns[i].getBoundingClientRect();
        if((t==='16:9' || t==='9:16' || t==='1:1') && r.height>=40 && r.height<=60){
          btns[i].dispatchEvent(new MouseEvent('click',{bubbles:true,cancelable:true}));
          return 'opened: ' + t;
        }
      }
      return 'not found';
    })();
  "
  delay 0.4

  -- STEP 2: Click 9:16
  execute active tab of w javascript "
    (function(){
      var btns = document.querySelectorAll('button');
      for(var i=0;i<btns.length;i++){
        if(btns[i].textContent.trim()==='9:16'){
          btns[i].dispatchEvent(new MouseEvent('click',{bubbles:true,cancelable:true}));
          return 'selected';
        }
      }
      return 'not found';
    })();
  "
  delay 0.4

  -- STEP 3: Click settings icon (empty ~48x48 button with SVG)
  execute active tab of w javascript "
    (function(){
      var btns = document.querySelectorAll('button');
      for(var i=0;i<btns.length;i++){
        var r = btns[i].getBoundingClientRect();
        var t = btns[i].textContent.trim();
        if(t==='' && !btns[i].disabled && r.width>=40 && r.width<=60 && r.height>=40 && r.height<=60){
          if(btns[i].querySelector('svg')){
            btns[i].dispatchEvent(new MouseEvent('click',{bubbles:true,cancelable:true}));
            return 'opened settings';
          }
        }
      }
      return 'not found';
    })();
  "
  delay 0.4

  -- STEP 4: Click Sound
  execute active tab of w javascript "
    (function(){
      var btns = document.querySelectorAll('button');
      for(var i=0;i<btns.length;i++){
        if(btns[i].textContent.trim()==='Sound' && !btns[i].disabled){
          btns[i].dispatchEvent(new MouseEvent('click',{bubbles:true,cancelable:true}));
          return 'sound on';
        }
      }
      return 'not found';
    })();
  "
  delay 0.4

  -- STEP 5: Click Speech
  execute active tab of w javascript "
    (function(){
      var btns = document.querySelectorAll('button');
      for(var i=0;i<btns.length;i++){
        if(btns[i].textContent.trim()==='Speech' && !btns[i].disabled){
          btns[i].dispatchEvent(new MouseEvent('click',{bubbles:true,cancelable:true}));
          return 'speech on';
        }
      }
      return 'not found';
    })();
  "
  delay 0.3

  -- STEP 6: Close dropdown
  execute active tab of w javascript "
    document.body.dispatchEvent(new MouseEvent('click',{bubbles:true,cancelable:true}));
    'ok';
  "
  delay 0.3

  -- STEP 7: Focus textarea and select all
  execute active tab of w javascript "
    var ta = document.querySelector('textarea');
    if(ta){ta.focus();ta.select();} 'ok';
  "
end tell
-- Paste prompt via clipboard
do shell script "cat " & quoted form of "${promptFiles[i]}" & " | pbcopy"
tell application "System Events" to keystroke "v" using command down
delay 1.5
-- STEP 8: Trigger React state update
tell application "Google Chrome"
  set w to front window
  execute active tab of w javascript "
    (function(){
      var ta = document.querySelector('textarea');
      if(!ta) return 'no textarea';
      var nativeSetter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, 'value').set;
      nativeSetter.call(ta, ta.value);
      ta.dispatchEvent(new Event('input', {bubbles:true}));
      ta.dispatchEvent(new Event('change', {bubbles:true}));
      return 'react update: ' + ta.value.length;
    })();
  "
  delay 0.5
  -- STEP 9: Click Generate
  execute active tab of w javascript "
    (function(){
      var btns = document.querySelectorAll('button');
      for(var i=0;i<btns.length;i++){
        if(btns[i].textContent.trim().toLowerCase().includes('generate')){
          btns[i].disabled = false;
          btns[i].dispatchEvent(new MouseEvent('click',{bubbles:true,cancelable:true}));
          return 'generate clicked';
        }
      }
      return 'generate not found';
    })();
  "
end tell
delay 0.5
`;
    }

    script += `\nreturn "done"\n`;

    const scriptFile = path.join(tempDir, 'bulk_video_automate.scpt');
    await fs.writeFile(scriptFile, script, 'utf8');

    console.log(`  📝 Executing BULK Envato Video automation (${tabCount} tabs)...`);

    exec(`osascript "${scriptFile}"`, { timeout: 120000 }, (error) => {
      setTimeout(() => { fs.rm(tempDir, { recursive: true }).catch(() => {}); }, 30000);
      if (error) console.error('  [X] Bulk Envato Video error:', error.message);
      else console.log(`  [OK] Bulk Envato Video done (${tabCount} tabs)`);
    });

    res.json({ success: true, message: `Opening ${tabCount} Envato Video tabs...`, count: tabCount });

  } catch (error) {
    console.error('[X] Bulk Send to Envato Video error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

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
║        > Now powered by Claude Code!                      ║
║        📚 Reads your project documentation automatically   ║
║                                                            ║
╚════════════════════════════════════════════════════════════╝
  `);
  console.log('\n[OK] Server ready! Waiting for requests...\n');

  // Startup cleanup: remove stale temp dirs and old uploads
  (async () => {
    try {
      const tmpDir = path.join(__dirname, 'tmp');
      const dirs = await fs.readdir(tmpDir).catch(() => []);
      const cutoff = Date.now() - 60 * 60 * 1000; // 1 hour
      let cleaned = 0;
      for (const d of dirs) {
        const match = d.match(/^req-(\d+)-/);
        if (match && parseInt(match[1]) < cutoff) {
          await fs.rm(path.join(tmpDir, d), { recursive: true, force: true }).catch(() => {});
          cleaned++;
        }
      }
      // Clean turbo-empty
      await fs.rm(path.join(tmpDir, 'turbo-empty'), { recursive: true, force: true }).catch(() => {});
      if (cleaned > 0) console.log(`🗑️  Startup cleanup: removed ${cleaned} stale temp dirs`);
    } catch {}
    // Clean uploads older than 24h
    try {
      const uploadsDir = path.join(__dirname, 'uploads');
      const files = await fs.readdir(uploadsDir).catch(() => []);
      const cutoff24h = Date.now() - 24 * 60 * 60 * 1000;
      let removed = 0;
      for (const f of files) {
        const ts = parseInt(f.split('-')[0]);
        if (ts && ts < cutoff24h) { await fs.unlink(path.join(uploadsDir, f)).catch(() => {}); removed++; }
      }
      if (removed > 0) console.log(`🗑️  Startup cleanup: removed ${removed} old uploads`);
    } catch {}
  })();
});
