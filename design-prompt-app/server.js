const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;
const { spawn, exec } = require('child_process');
const app = express();
const PORT = 3001;

// ═══ AUTOMATION ABORT SYSTEM (sentinel file + process kill) ═══
const ABORT_FILE = path.join(require('os').tmpdir(), 'axkan-abort-automation');
let _activeAutomation = null;

let _watchdogProc = null;
function trackAutomation(proc, label) {
  // Clear any stale abort file when starting new automation
  try { require('fs').unlinkSync(ABORT_FILE); } catch(e) {}
  _activeAutomation = { proc, label, startedAt: Date.now() };
  proc.on('exit', () => {
    if (_activeAutomation?.proc === proc) _activeAutomation = null;
    // Kill watchdog when automation ends
    if (_watchdogProc) { try { _watchdogProc.kill(); } catch(e) {} _watchdogProc = null; }
  });

  // Launch watchdog: a separate process that polls for abort file and kills the main osascript
  const watchdogScript = `
while true; do
  if [ -f "${ABORT_FILE}" ]; then
    killall -9 osascript 2>/dev/null
    killall -9 "System Events" 2>/dev/null
    pkill -9 -f clipboard_image 2>/dev/null
    rm -f "${ABORT_FILE}"
    exit 0
  fi
  sleep 0.3
done`;
  _watchdogProc = exec(`bash -c '${watchdogScript.replace(/'/g, "'\\''")}'`, () => {});
}

function killAutomation() {
  const { execSync } = require('child_process');

  // 1. Create sentinel file
  try { require('fs').writeFileSync(ABORT_FILE, 'abort'); } catch(e) {}

  // 2. Kill tracked process directly
  if (_activeAutomation) {
    try { _activeAutomation.proc.kill('SIGKILL'); } catch(e) {}
    _activeAutomation = null;
  }

  // 3. Nuclear kill — synchronous, blocks until done
  try { execSync('killall -9 osascript 2>/dev/null || true'); } catch(e) {}
  try { execSync('killall -9 "System Events" 2>/dev/null || true'); } catch(e) {}
  // Also kill any python clipboard helpers
  try { execSync('pkill -9 -f clipboard_image 2>/dev/null || true'); } catch(e) {}

  console.log('[!] ABORT: Killed osascript + System Events + clipboard helpers');

  // 4. Notification (delayed so the kills above take effect first)
  setTimeout(() => {
    try { exec(`/usr/bin/osascript -e 'display notification "All automation stopped" with title "ABORTED"'`); } catch(e) {}
  }, 500);

  return true;
}

// Check if abort was requested (used by scripts via shell)
app.get('/api/check-abort', (req, res) => {
  const aborted = require('fs').existsSync(ABORT_FILE);
  res.json({ aborted });
});

app.post('/api/abort-automation', (req, res) => {
  killAutomation();
  res.json({ success: true, killed: true });
});

// GET version — type localhost:3001/abort in URL bar
app.get('/abort', (req, res) => {
  killAutomation();
  res.send(`<html><head><meta http-equiv="refresh" content="2;url=/"></head><body style="background:#e72a88;color:white;font-family:sans-serif;display:flex;align-items:center;justify-content:center;height:100vh;font-size:32px;font-weight:bold;">ABORTED — All automation stopped</body></html>`);
});

// ═══ GLOBAL ABORT WATCHER: polls for Caps Lock rapid toggle as abort signal ═══
// Also watches for abort file created by any method
setInterval(() => {
  if (require('fs').existsSync(ABORT_FILE) && _activeAutomation) {
    console.log('[!] ABORT WATCHER: Sentinel file detected, killing automation');
    const { execSync } = require('child_process');
    try { execSync('killall -9 osascript 2>/dev/null || true'); } catch(e) {}
    try { _activeAutomation.proc.kill('SIGKILL'); } catch(e) {}
    _activeAutomation = null;
  }
}, 500);

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
    .replace(/\bnecked\b/gi, '')
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
    .replace(/\bnecked\b/gi, '')
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
const upload = multer({ storage, limits: { fileSize: 50 * 1024 * 1024 } }); // 50MB max per file

app.use(express.json({ limit: '200mb' }));
app.use(express.urlencoded({ limit: '200mb', extended: true }));
app.use(express.static('public'));
app.use('/uploads', express.static('uploads'));

// CORS-enabled static route for reference images (Envato page fetches cross-origin from localhost)
const tmpRefDir = path.join(__dirname, 'tmp-ref');
app.use('/tmp-ref', (req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    next();
}, express.static(tmpRefDir));

// Debug endpoint — injected JS posts here so we can see what's happening on the Envato page.
app.get('/envato-debug', (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    const { step, status, detail } = req.query;
    console.log(`  🐞 [envato-debug] step=${step} status=${status}${detail ? ' detail='+detail : ''}`);
    res.json({ ok: true });
});

// Write reference images from base64 data URLs to tmp-ref directory, return filenames
async function writeRefImages(referenceImages) {
    await fs.mkdir(tmpRefDir, { recursive: true });
    // Clean old files
    const oldFiles = await fs.readdir(tmpRefDir).catch(() => []);
    for (const f of oldFiles) await fs.unlink(path.join(tmpRefDir, f)).catch(() => {});
    const written = [];
    const maxImages = Math.min(referenceImages.length, 3);
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

// Generate JS code for reference image upload on Envato ImageGen (/image-gen).
// Flow: modal is ALREADY open (opened by caller). Find dropzone, drop files, close modal.
function generateRefUploadJS(filenames) {
    const urls = filenames.map(f => `http://localhost:${PORT}/tmp-ref/${f}`);
    const urlsJSON = JSON.stringify(urls);
    return `
window.__refUploadDone = false;
(async function() {
  function sleep(ms){ return new Promise(function(r){ setTimeout(r, ms); }); }
  function dbg(step, status, detail){
    try{
      var u = 'http://localhost:${PORT}/envato-debug?step='+encodeURIComponent(step)+'&status='+encodeURIComponent(status);
      if(detail !== undefined && detail !== null) u += '&detail='+encodeURIComponent(String(detail).slice(0,200));
      fetch(u).catch(function(){});
    }catch(e){}
  }
  function findDropzone(){
    // Primary: any element whose text contains "Sube hasta" or "Arrastra y suelta"
    var all = document.querySelectorAll('div, label, section, form');
    var best = null, bestArea = 0;
    for(var i=0;i<all.length;i++){
      var el = all[i];
      var t = (el.textContent || '');
      if(t.length > 200) continue;
      if(/Sube hasta|Arrastra y suelta|Upload up to|Drag and drop/i.test(t)){
        var r = el.getBoundingClientRect();
        var area = r.width * r.height;
        if(area > bestArea && area < 500000){
          best = el;
          bestArea = area;
        }
      }
    }
    return best;
  }
  function closeModal(){
    // Try explicit close button
    var closeBtn = document.querySelector('[aria-label*="close" i], [aria-label*="cerrar" i]');
    if(closeBtn){ try{ closeBtn.click(); return 'close-btn'; }catch(e){} }
    // Try clicking backdrop (element with role=dialog parent)
    var dialog = document.querySelector('[role="dialog"], [aria-modal="true"]');
    if(dialog){
      var parent = dialog.parentElement;
      if(parent){
        var r = parent.getBoundingClientRect();
        parent.dispatchEvent(new MouseEvent('mousedown', {bubbles:true, clientX:5, clientY:5}));
        parent.dispatchEvent(new MouseEvent('mouseup', {bubbles:true, clientX:5, clientY:5}));
        parent.dispatchEvent(new MouseEvent('click', {bubbles:true, clientX:5, clientY:5}));
      }
    }
    // Escape key fallback
    ['keydown','keyup'].forEach(function(et){
      document.dispatchEvent(new KeyboardEvent(et, { key:'Escape', code:'Escape', keyCode:27, which:27, bubbles:true }));
      document.body.dispatchEvent(new KeyboardEvent(et, { key:'Escape', code:'Escape', keyCode:27, which:27, bubbles:true }));
    });
    return 'escape';
  }
  try {
    dbg('ref','start');
    // Step 1: Click the "+" add-reference button. Anchor on window.__promptEl (set by focus step)
    // OR fall back to a contenteditable-aware search so we don't depend on <textarea>.
    var anchor = window.__promptEl
      || document.querySelector('textarea')
      || document.querySelector('[contenteditable="true"],[contenteditable=""],div[role=textbox],[role=textbox]')
      || document.querySelector('input[type=text]');
    if (anchor) {
      var container = anchor.closest('form') || anchor.parentElement;
      for (var up = 0; up < 8 && container && container.querySelectorAll('button').length < 2; up++) {
        container = container.parentElement;
      }
      var opened = false;
      if (container) {
        var btns = container.querySelectorAll('button');
        for (var i = 0; i < btns.length; i++) {
          var b = btns[i];
          var r = b.getBoundingClientRect();
          var txt = (b.textContent || '').trim();
          var aria = (b.getAttribute('aria-label') || '').toLowerCase();
          if (/gener/i.test(txt)) continue;
          if (/estilo|variaciones|cuadrado|vertical|horizontal|style|portrait|landscape|square|retrato|paisaje/i.test(txt)) continue;
          if (r.width < 18 || r.height < 18 || r.width > 90 || r.height > 90) continue;
          // icon-only button (empty/short text) or aria mentions reference
          if (txt.length <= 2 || /referenc|imagen|image|add|a[nñ]adir|upload|sub/i.test(aria)) {
            b.click();
            opened = true;
            dbg('ref','plus');
            break;
          }
        }
      }
      if(!opened) dbg('ref','no-plus');
    } else { dbg('ref','no-anchor'); }
    // Wait for modal to render.
    await sleep(700);
    // Fetch all images from local server as Blob → File.
    var urls = ${urlsJSON};
    var blobs = await Promise.all(urls.map(function(u) {
      return fetch(u).then(function(r) { return r.ok ? r.blob() : null; }).catch(function() { return null; });
    }));
    var files = [];
    blobs.forEach(function(blob, idx) {
      if (!blob) return;
      var ext = (blob.type && blob.type.split('/')[1]) || 'png';
      files.push(new File([blob], 'ref' + idx + '.' + ext, { type: blob.type || 'image/png' }));
    });
    dbg('ref','files',files.length);
    if (files.length === 0) {
      closeModal();
      window.__refUploadDone = true;
      return;
    }
    var dt = new DataTransfer();
    files.forEach(function(f){ dt.items.add(f); });
    // Strategy A: native <input type=file> setter via React prototype
    var inputs = document.querySelectorAll('input[type=file]');
    dbg('ref','inputs',inputs.length);
    if (inputs.length > 0) {
      var fileInput = inputs[inputs.length - 1];
      try {
        var desc = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'files');
        if (desc && desc.set) desc.set.call(fileInput, dt.files);
        else fileInput.files = dt.files;
        fileInput.dispatchEvent(new Event('input', { bubbles: true }));
        fileInput.dispatchEvent(new Event('change', { bubbles: true }));
      } catch(e) {}
    }
    // Strategy B: dispatch drop on the dropzone element (covers react-dropzone style handlers).
    var dz = findDropzone();
    dbg('ref','dz',dz?'y':'n');
    if (dz) {
      try {
        ['dragenter','dragover','drop'].forEach(function(t) {
          var ev = new DragEvent(t, { bubbles: true, cancelable: true, composed: true });
          try { Object.defineProperty(ev, 'dataTransfer', { value: dt }); } catch(e2) {}
          dz.dispatchEvent(ev);
        });
      } catch(e) {}
    }
    // Wait for thumbnails to register, then close modal.
    await sleep(2200);
    closeModal();
    await sleep(500);
    dbg('ref','done');
  } catch(e) { dbg('ref','err',e.message); }
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
// DISABLED: Quality block was making prompts too long. Short vivid prompts work better with Gemini.
function enforceImageQuality(promptText) {
  return promptText;
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
  'transform': {
    name: 'Transform / Adapt Design',
    color: '#FF9500',
    icon: '🔄',
    folder: '../TRANSFORM_DESIGN'
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
      // LETTER-FILL TURBO TEMPLATE - JSON FORMAT
      const destination = params.destination || 'DESTINATION';
      const letters = destination.toUpperCase().split('');
      const letterFills = letters.map((l, i) => `"${l}": "[Iconic ${destination} scene #${i + 1} - be specific]"`).join(',\n      ');

      turboPrompt = `You are a design prompt generator. Output a SHORT natural language prompt (150 words MAX) for Gemini image AI.

TYPE: Letter-fill magnet — each letter of "${destination}" is a photo window showing a different iconic scene.

GOOD EXAMPLE: "Create a letter-fill souvenir magnet. Bold chunky 3D letters spelling 'CANCUN' with natural wood texture and slightly uneven heights. Each letter is a photo window: C shows Chichen Itza pyramid, A shows turquoise Caribbean beach, N shows a colorful coral reef, C shows a cenote, U shows Isla Mujeres, N shows a whale shark. Vivid photos fill each letter edge-to-edge. Clean white background, no borders."

---
REQUEST: ${instruction}
DESTINATION: ${destination}
---

Output ONLY the short natural language prompt. 150 words MAX. Each letter must show a DIFFERENT iconic scene from ${destination}.`;

    } else if (params.projectType === 'transform') {
      // TRANSFORM / ADAPT DESIGN TEMPLATE
      // Extracts the "DNA" of an uploaded design and re-generates it for a different product type/ratio
      const targetProduct = params.targetProduct || params.productType || 'magnet';
      const targetRatio = params.targetRatio || params.ratio || '1:1';

      const transformProductDescriptions = {
        'bottle-opener': 'a flat, front-facing RECTANGULAR bottle opener souvenir with an arch/hole cutout at the top. ALL artwork CONTAINED WITHIN the rectangular shape — no elements extending outside. The illustration must FILL THE ENTIRE SURFACE with NO white/empty space.',
        'magnet': 'a flat, front-facing design for a souvenir magnet with an organic irregular silhouette shape (edges follow the contour of the design elements - die-cut look). NO border, NO outline, NO frame around the design.',
        'keychain': 'a flat, front-facing design for a keychain souvenir with a small organic shape and a metal ring at the top. NO border, NO outline, NO frame around the design.',
        'keyholder': 'a flat, front-facing keyholder souvenir. Rectangular text bar at bottom with hook holes, illustration bursts out the top with irregular organic silhouette. NO white space — every inch filled with artwork.',
        'portrait': 'a flat, front-facing RECTANGULAR portrait/frame souvenir design with a thick decorative border/frame. ALL artwork CONTAINED WITHIN the rectangular frame shape. The frame itself can be ornamental.'
      };
      const targetProductDesc = transformProductDescriptions[targetProduct] || transformProductDescriptions['magnet'];

      const ratioGuide = {
        '1:1': 'SQUARE format (1:1 ratio) — equal width and height',
        '2:1': 'HORIZONTAL RECTANGULAR format (2:1 ratio) — twice as wide as tall, panoramic/landscape layout',
        '1:2': 'VERTICAL RECTANGULAR format (1:2 ratio) — twice as tall as wide, portrait/tall layout'
      };
      const targetRatioDesc = ratioGuide[targetRatio] || ratioGuide['1:1'];

      turboPrompt = `You are a design prompt generator for Gemini image AI. You must TRANSFORM an existing design into a different product format.

TASK: Analyze the uploaded reference image and extract its complete design DNA:
- EXACT color palette (list the specific colors)
- Art/rendering style (cartoon, realistic, etc. — be hyper-specific about line work, shading, proportions)
- ALL text/lettering (exact words, font style, color treatment of each letter)
- ALL visual elements (characters, animals, flowers, landmarks, decorative elements)
- Composition approach and visual hierarchy
- Decorative details (borders, patterns, textures, effects)

Then generate a NEW prompt that recreates this SAME design but adapted for:
TARGET PRODUCT: ${targetProductDesc}
TARGET FORMAT: ${targetRatioDesc}

CRITICAL ADAPTATION RULES:
- Keep EVERY visual element, color, and text from the original — nothing removed, nothing added
- The STYLE must be identical (same artist, same rendering technique)
- ONLY change the LAYOUT to fit the new product shape and ratio
- If going from wide to square: stack elements or rearrange composition
- If going from square to wide: spread elements horizontally, use panoramic layout
- If going from magnet (irregular shape) to bottle-opener (rectangular): contain all elements within the rectangle
- If going from rectangular to magnet (irregular shape): let elements define the silhouette edge
- Text placement must adapt to the new format but keep the SAME text content and style
${instruction ? `\nADDITIONAL NOTES FROM USER: ${instruction}` : ''}

Output ONLY the short natural language prompt (200 words MAX). No rules, no bans, no labels, no bullet points. White background always.`;

    } else {
      // UNIVERSAL TURBO TEMPLATE — style comes from the reference image, not hardcoded
      turboPrompt = `You are a design prompt generator for Gemini image AI. Output a SHORT natural language prompt (150 words MAX).

The STYLE comes from the reference image (if provided). Analyze it and match the rendering style in your prompt.
${params.elementKeyValues ? `MANDATORY ELEMENTS: ${params.elementKeyValues}` : ''}

GOOD EXAMPLES:
"Create a cute cartoon souvenir magnet for Acapulco Mexico. A toucan with a huge colorful beak surrounded by hibiscus flowers and palm leaves. Bold glossy metallic emerald green letters spelling ACAPULCO with shiny lime chrome accents. Bright vivid colors, pure white background, irregular sticker-like silhouette shape."

"A massive great white shark with jaws wide open bursting through crashing turquoise ocean waves. Behind it a circular golden medallion frame with Acapulco hillside hotels on green hills. Beach scene with umbrella, surfer. Bold colorful 'Acapulco' text at bottom with splash accents. Vibrant cartoon sticker on white background."

---
REQUEST: ${instruction}
${params.destination ? `DESTINATION: ${params.destination}` : ''}
${params.theme ? `THEME: ${params.theme}` : ''}
---

Output ONLY the short natural language prompt. 150 words MAX. No rules, no bans, no labels, no bullet points.`;
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
        'bottle-opener': 'a flat, front-facing RECTANGULAR bottle opener souvenir with an arch/hole cutout at the top. ALL artwork CONTAINED WITHIN the rectangular shape — no elements extending outside. The illustration must FILL THE ENTIRE SURFACE with NO white/empty space — every inch covered with artwork, patterns, or colors.',
        'magnet': 'a flat, front-facing design for a souvenir magnet with an organic irregular silhouette shape (edges follow the contour of the design elements - die-cut look). NO border, NO outline, NO frame around the design.',
        'keychain': 'a flat, front-facing design for a keychain souvenir with a small organic shape and a metal ring at the top. NO border, NO outline, NO frame around the design.',
        'keyholder': 'a flat, front-facing keyholder souvenir. Rectangular text bar at bottom with hook holes, illustration bursts out the top with irregular organic silhouette. NO white space — every inch filled with artwork.',
        'portrait': 'a flat, front-facing RECTANGULAR portrait/frame souvenir design with a thick decorative border/frame. ALL artwork CONTAINED WITHIN the rectangular frame shape. The frame itself can be ornamental.'
      };
      const turboProductDesc = turboProductDescriptions[params.productType] || turboProductDescriptions['magnet'];

      finalPrompt = `CONTEXT (use to guide your thinking, do NOT include in output): This is ${turboProductDesc} Flat front-facing view on white background. No 3D, no mockup, no borders.

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
Extract ONLY the visual style (art style, colors, composition structure, rendering technique). Do NOT copy any subjects, characters, or objects from it — only HOW it looks.${_styleOverrideNote}
${turboImages.length > 1 ? `ALSO read these reference images: ${turboImages.filter(f => f !== turboStyleRef).join(', ')}` : ''}

THEN generate a SHORT prompt (150 words max) that uses the reference's visual style but with the user's requested content. Your output must be SHORT and VIVID — no rules, no bans, no format labels.

${turboPrompt}`;
    } else if (turboImages.length > 0) {
      if (params.projectType === 'variations') {
        // Turbo + variations + reference image: structured analysis
        const _varStyleNote = _isRealisticStyle
          ? `\n[!] STYLE CONSTRAINT: The user selected "${_effectiveStyle}" style. Extract the SUBJECT and COMPOSITION from the reference, but the rendering style must follow the STYLE field in the template below${_effectiveStyle === 'hybrid' ? ' (mix of PHOTOREALISTIC and CARTOON elements)' : ' (PHOTOREALISTIC rendering)'}.`
          : '\nKeep the same character, same destination, same style.';
        // Build turbo transformation context
        const _turboTLevel = parseInt(params.level) || 5;
        const _turboTDesc = _turboTLevel <= 2
          ? 'SUBTLE TWEAK — keep same pose, same layout, same elements in same positions. Only change tiny details (move a flower, shift a color). Design should look nearly identical to reference.'
          : _turboTLevel <= 4
          ? 'MODERATE — keep same character and elements from reference, but change the POSE/GESTURE and rearrange element positions. Same general composition style.'
          : _turboTLevel <= 6
          ? 'SIGNIFICANT — same character and element TYPES from reference but REBUILD the entire composition. New layout direction, new pose, new spatial arrangement. Different dish, same ingredients.'
          : _turboTLevel <= 8
          ? 'MAJOR REIMAGINING — same character identity from reference but in a COMPLETELY NEW context/action/scene. Add 2-3 NEW elements not in original. Remove/replace some original elements. Dramatically different composition. Write the character a new story.'
          : 'RADICAL — only keep character identity + destination. Everything else is new: concept, composition, color mood, elements. Bold and unexpected.';
        const _turboDLevel = parseInt(params.decorationLevel) || 5;
        const _turboDDesc = _turboDLevel <= 2
          ? 'MINIMAL — hero + text + only 1-2 tiny accents. Lots of white space. Strip away most reference elements.'
          : _turboDLevel <= 4
          ? 'LIGHT — hero + text + 3-5 elements only. Keep only the most important reference elements. Some white space visible.'
          : _turboDLevel <= 6
          ? 'MODERATE — hero + text + 5-8 elements. Half the space decorated, half breathing room.'
          : _turboDLevel <= 8
          ? 'ABUNDANT — hero + text + 10-15 elements. Fill most space. Add elements beyond what reference shows.'
          : 'MAXIMAL — hero + text + 20+ elements. Every corner filled. Baroque ornamentation.';

        finalPrompt = `FIRST: Read image file(s): ${turboImages.join(', ')}

IMPORTANT  - REFERENCE IMAGE VARIATION:
After reading the image, identify: the PROTAGONIST (character/animal/element), their POSE, CLOTHING, SUPPORTING ELEMENTS, COLORS, and COMPOSITION.${_varStyleNote}

TRANSFORMATION LEVEL: ${_turboTLevel}/10 — ${_turboTDesc}
DECORATION LEVEL: ${_turboDLevel}/10 — ${_turboDDesc}

Your generated prompt MUST describe the SAME protagonist and elements but transformed according to the TRANSFORMATION LEVEL above.
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

    // ═══ UNIVERSAL DESIGN GUIDELINES (for from-scratch and previous-element) ═══
    if (projectType === 'from-scratch' || projectType === 'previous-element') {
      fullInstruction += `\n\nDESIGN GUIDELINES (use to guide your thinking, but keep your OUTPUT under 150 words):
- ONE dominant hero element, destination-specific supporting elements
- Vivid saturated colors, white background, irregular sticker silhouette
- Bold destination text integrated into the composition
- Style comes from the reference image (if provided) — match it exactly
- Flat front-facing product design, not a 3D mockup or landscape scene`;
    }

    // ═══ STYLE REFERENCE IMAGE ANALYSIS ═══
    if (styleRefProjectPath) {
      const styleRefFilename = path.basename(styleRefProjectPath);
      fullInstruction += `\n\nSTYLE REFERENCE IMAGE: ${styleRefFilename}
Read this image. Extract ONLY: art style, rendering technique, color palette, composition structure, and detail level.
Do NOT copy any subjects, characters, or objects from it — only HOW it looks and HOW it's composed.
The user's DESTINATION and ELEMENT keys define WHAT to draw. The reference defines HOW to draw it.
Match the reference's rendering style exactly in your output prompt.`;
    }

    // Add context based on parameters
    if (params.destination) {
      fullInstruction += `\n\n[!] MANDATORY DESTINATION: "${params.destination}"
This is the ONLY destination name that should appear in the design. If the user's instruction mentions a different city or sub-location (like "Orizaba" when destination is "Veracruz"), use "${params.destination}" as the primary title text. The sub-location can appear as small secondary text only. Do NOT put two large destination names in the design.
Design elements must be specific to ${params.destination}.`;
    }
    // ═══ MANDATORY ELEMENT KEYS (shark, dolphin, etc.) ═══
    if (params.elementKeyValues) {
      fullInstruction += `\n\n[!] MANDATORY DESIGN ELEMENTS (NON-NEGOTIABLE): ${params.elementKeyValues}
These elements were explicitly requested by the user via the ELEMENT key. They MUST appear prominently in the design as major visual elements — not as tiny background details. These elements OVERRIDE any subjects from a style reference image. If the style reference shows a woman with buildings, but the user requested "shark, dolphin" — the design MUST feature a shark and dolphin as the main visual subjects, NOT the woman or buildings from the reference. The style reference contributes ONLY visual rendering style (colors, line work, textures), while the ELEMENT key defines WHAT the design actually shows.`;
    }

    if (params.theme) {
      fullInstruction += `\nTheme: ${params.theme}`;
    }
    // Only include Transformeter for 'variations' project type
    if (params.level && params.projectType === 'variations') {
      const tLevel = parseInt(params.level);
      const tDesc = tLevel <= 2
        ? `SUBTLE TWEAK: The output prompt must describe a design that is NEARLY IDENTICAL to the reference image. KEEP the same pose, same layout, same composition, same elements in the same positions. Only change tiny details: a flower moved slightly, a minor color shift, a butterfly repositioned. If someone saw both designs side by side, they should need to look closely to spot the difference. The reference image is your BLUEPRINT — follow it closely.`
        : tLevel <= 4
        ? `MODERATE VARIATION: The output prompt must describe the SAME character from the reference image with the SAME supporting elements, but change the character's POSE or GESTURE (e.g., if sitting→make them standing, if facing left→face right, if holding flowers→waving). Rearrange the supporting elements to different positions around the character. Keep the same general composition approach (if centered, stay centered). The reference image gives you the CHARACTER and ELEMENTS — rearrange them.`
        : tLevel <= 6
        ? `SIGNIFICANT TRANSFORMATION: The output prompt must keep the SAME character and element TYPES from the reference image, but COMPLETELY REBUILD the composition. New layout direction (if reference is centered→go diagonal, if horizontal→go vertical). Give the character a new pose AND a new action. Move ALL supporting elements to completely different positions. Change the spatial hierarchy (if element X was big, make it smaller; if Y was in background, bring it forward). The reference image gives you the INGREDIENTS — cook a different dish.`
        : tLevel <= 8
        ? `MAJOR REIMAGINING: The output prompt must keep the SAME character identity from the reference image (recognizable as the same character/vehicle/subject) but place them in a COMPLETELY DIFFERENT CONTEXT, SCENE, or ACTION. Examples: if the reference shows a VW Beetle parked → show it driving through the city, surfing on a wave, or being loaded onto a boat. Create a dramatically different composition and spatial layout. ADD 2-3 new supporting elements NOT in the original reference (new fruits, new animals, new cultural symbols). REMOVE or REPLACE some of the original supporting elements. The reference image gives you the MAIN CHARACTER — write them a new story.`
        : `RADICAL REINVENTION: The output prompt keeps ONLY the character identity and destination name from the reference image. Everything else must be NEW and BOLD — new creative concept, new composition philosophy, new color mood, new supporting elements, new narrative. If the reference shows a cute sticker → your prompt could describe the character in an epic dramatic composition. The reference image is just a STARTING POINT — take it somewhere unexpected and daring.`;
      fullInstruction += `\n\n**MANDATORY TRANSFORMETER LEVEL: ${tLevel}/10** — ${tDesc}`;
    }
    // Only include Decoration Level for 'variations' project type (the only one with that slider)
    if (params.decorationLevel && params.projectType === 'variations') {
      const dLevel = parseInt(params.decorationLevel);
      const dDesc = dLevel <= 2
        ? `MINIMAL DECORATION: Your output prompt must describe ONLY the hero/protagonist + destination text + maximum 1-2 tiny accent elements (e.g., one small leaf, one tiny star). The design has LOTS of white/empty space around it. Strip away most of the supporting elements you see in the reference image — keep it clean, simple, and breathable. Think: clean logo, not busy sticker.`
        : dLevel <= 4
        ? `LIGHT DECORATION: Your output prompt must describe the hero/protagonist + destination text + only 3-5 small supporting elements. Include only the MOST IMPORTANT elements from the reference image (e.g., the main palm tree and one fruit, not every leaf and flower). Leave some negative/white space visible. The design should feel CLEAN but not empty.`
        : dLevel <= 6
        ? `MODERATE DECORATION: Your output prompt must describe the hero/protagonist + destination text + 5-8 supporting elements. About HALF the space around the hero should be filled with elements, half left as breathing room. Include the key elements from the reference image and maybe 1-2 new ones. Balanced between decorated and clean.`
        : dLevel <= 8
        ? `ABUNDANT DECORATION: Your output prompt must describe the hero/protagonist + destination text + 10-15 supporting elements filling MOST of the space around the hero. Include all the elements from the reference image plus ADD new ones: flowers, tropical leaves, fruits, small icons, patterns. Multiple types of decoration layered together. Rich, lush, detailed — very little empty space.`
        : `MAXIMAL DECORATION: Your output prompt must describe an EXTREMELY ORNATE design. Hero + text + 20+ decorative elements packed into every corner. Every gap filled with flowers, leaves, patterns, tiny icons, cultural symbols. Layer decorations on top of decorations. The reference image's elements are just the starting point — add much more. Almost ZERO negative space. Think: baroque-level ornamentation.`;
      fullInstruction += `\n**MANDATORY DECORATION LEVEL: ${dLevel}/10** — ${dDesc}`;
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
      // Style is kept minimal — the reference image defines the actual style
      fullInstruction += `\nStyle hint: ${params.style} (but the reference image overrides this if provided)`;
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
      fullInstruction += `\nProduct: ${params.productType} (flat front-facing design on white background, irregular sticker silhouette)`;

      // Shape constraints for contained products
      if (params.productType === 'bottle-opener') {
        fullInstruction += ` Shape: tall vertical RECTANGULAR bottle opener with arch/hole cutout at top. ALL artwork must be CONTAINED WITHIN the rectangular shape — NO elements extending outside the edges. The illustration must FILL THE ENTIRE SURFACE with NO white/empty space — every square inch covered with artwork, patterns, colors, or design elements. No bare white areas visible.`;
      } else if (params.productType === 'keyholder') {
        fullInstruction += ` Shape: keyholder souvenir. Rectangular text bar at bottom with hook holes, illustration bursts out the top with irregular organic silhouette. NO white space — every inch filled with artwork.`;
      } else if (params.productType === 'portrait') {
        fullInstruction += ` Shape: RECTANGULAR portrait/frame with a thick decorative border/frame around the edges. ALL artwork must be CONTAINED WITHIN the rectangular frame. The frame itself can be ornamental.`;
      }
    }

    // ═══ MANDATORY OUTPUT FORMAT FOR ALL GENERATIONS ═══
    fullInstruction += `\n\n${'='.repeat(50)}
[!!!] MANDATORY OUTPUT FORMAT: NATURAL LANGUAGE PROMPT (150 WORDS MAX)
${'='.repeat(50)}

YOUR OUTPUT MUST BE 150 WORDS MAXIMUM. This is the most important rule. Gemini produces BETTER images from SHORT, VIVID, NATURAL LANGUAGE prompts than from long rule-heavy ones.

You MUST analyze all provided images (style references, material references) and use that analysis to INFORM your output — but your output itself must be SHORT.

Use all the rules and image analysis to guide your THINKING, but your OUTPUT is ONLY a short, vivid, natural language design description.

GOOD EXAMPLES:

"Create a cute cartoon souvenir magnet for Acapulco Mexico. A toucan with a huge colorful beak surrounded by hibiscus flowers and palm leaves. Bold glossy metallic emerald green letters spelling ACAPULCO with shiny lime chrome accents. Bright vivid colors, pure white background, irregular sticker-like silhouette shape."

"A massive great white shark with jaws wide open bursting through crashing turquoise ocean waves, dominating the center. Behind it a circular golden medallion frame with Acapulco hillside hotels on green hills. Bold colorful 'Acapulco' text at bottom with splash accents. Vibrant cartoon sticker on white background."

RULES:
- Output ONLY the natural language prompt. Nothing else.
- No rules, bans, "do not" instructions, format labels, JSON, bullet points, or numbered lists in output.
- No quality blocks, no banned word lists, no technical instructions.
- 150 words MAXIMUM. Count your words.
${'='.repeat(50)}`;

    console.log(`\n${'='.repeat(60)}`);
    console.log(`> INVOKING CLAUDE CODE`);
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

WHAT TO ALWAYS KEEP (sacred regardless of transformation level):
[OK] EXACT same art style, line work, shading, and rendering approach
[OK] EXACT same protagonist character identity (recognizable as the same character/subject)
[OK] Same destination context

WHAT TO CHANGE (controlled by the TRANSFORMETER LEVEL in the user's request below):
The TRANSFORMETER LEVEL determines HOW MUCH your output prompt deviates from the reference image. This is the MOST IMPORTANT parameter — read it carefully and MATCH your transformation intensity EXACTLY:

- Level 1-2 (SUBTLE): Your prompt describes a design almost IDENTICAL to the reference. Same pose, same layout, same elements in same positions. Only tiny detail changes (a flower moved slightly, a minor color shift). Someone comparing both should struggle to spot the difference.
- Level 3-4 (MODERATE): Your prompt keeps the same character + same elements from the reference, but changes the character's POSE/GESTURE and rearranges element positions. Same general composition approach.
- Level 5-6 (SIGNIFICANT): Your prompt keeps the same character + same element TYPES but COMPLETELY REBUILDS the composition. New layout direction, new pose, new action, all elements repositioned. Same ingredients, different dish.
- Level 7-8 (MAJOR REIMAGINING): Your prompt keeps the character identity but places them in a COMPLETELY DIFFERENT context, scene, or action (e.g., driving→surfing, standing→flying). ADD 2-3 new elements NOT in the reference. REMOVE/REPLACE some original elements. Dramatically different composition. Same character, new story.
- Level 9-10 (RADICAL): Your prompt keeps ONLY the character identity + destination name. Everything else is brand new — new concept, new composition, new color mood, new elements, new narrative. Bold and unexpected.

[!!!] CRITICAL: If the Transformeter level is 6+ and your output prompt still describes the same pose, same layout, and same elements in the same positions as the reference — you have FAILED. High transformation means VISIBLE, DRAMATIC differences from the reference.

WHAT TO NEVER DO:
[X] Do NOT change the art style (if reference is kawaii chibi, don't output realistic or painterly)
[X] Do NOT change the protagonist's core identity (keep same character/subject recognizable)
[X] Do NOT create a completely unrelated design that has nothing to do with the reference
[X] Do NOT output a generic "cartoon style" description  - be SPECIFIC about the exact style
[X] Do NOT create a design that looks like a wallpaper, poster, or rectangular image  - it MUST look like a die-cut PRODUCT with an organic irregular silhouette on white/transparent background
[X] Do NOT use badge, emblem, medallion, circle, or frame compositions  - the silhouette must be ORGANIC and IRREGULAR, following the contour of the design elements
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
  'Use a HERO-CENTRIC composition: one dominant central element takes 60%+ of the space, centered. 2-3 small supporting accents tucked around the hero. The silhouette is IRREGULAR - shaped by the hero and elements themselves. Everything feels unified with a clear center of gravity.',
  'Use a VERTICAL STACK composition: hero element at the top (largest), destination text below, 1-2 small accents flanking. Elements stacked along a central axis. The irregular silhouette is taller than wide, shaped by whatever extends (a palm tree top, the hero element, etc.).',
  'Use a LAYERED DEPTH composition: hero in the foreground (largest), one supporting element partially behind it, text integrated at the base. Elements overlap to create depth. The irregular silhouette follows the natural contours of the layered elements.',
  'Use a WRAPAROUND composition: supporting elements curve around the hero in a natural arrangement. The hero is clearly dominant at center. The irregular silhouette follows the contour of elements - a palm extending up, a flower poking out on one side, etc.',
  'Use a PEDESTAL composition: hero sits prominently on top, text forms the base below. 1-2 small destination-specific accents on the sides. The irregular silhouette is wider at top (shaped by the hero) and narrower at the text base.',
  'Use a TEXT-FORWARD composition: the destination text is BIG and BOLD as a primary visual element, with the hero element integrated INTO or BEHIND the letters. 1-2 small supporting accents. The irregular silhouette follows the combined shape of text + hero.',
  'Use a HERO-AND-TEXT-INTERLOCKED composition: hero and destination text overlap and interweave - text partially in front, hero partially behind, creating one unified cluster. 1-2 tiny accents. Irregular silhouette shaped by both text and hero together.',
  'Use a WIDE CLUSTER composition: hero centered with supporting elements arranged to create a composition that is wider than tall. Elements spread horizontally but stay CONNECTED and unified. Irregular silhouette follows the natural width of the cluster.'
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
          // Removed: suffix was making prompts too long
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
          // Removed: suffix was making prompts too long
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
    const { projectType, instructions, variationCount, destination, theme, level, decorationLevel, crazymeter, style, styles, ratio, productType, includeShapeConstraints, photoStyle, turboMode, permutedInstructions: permutedInstructionsRaw, elementKeyValues, targetProduct, targetRatio } = req.body;
    const images = req.files?.['images'] || [];
    const styleRefFiles = req.files?.['styleReference'] || [];
    const count = parseInt(variationCount) || 1;

    // Parse multi-style selection
    let parsedStyles = [];
    try {
      if (styles) parsedStyles = JSON.parse(styles);
    } catch (e) { /* ignore parse errors, fall back to single style */ }
    if (parsedStyles.length === 0 && style) parsedStyles = [style];

    if ((!instructions || !instructions.trim()) && projectType !== 'transform') {
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
      turboMode: turboMode === 'true' || projectType === 'transform',
      images: allImages,
      styleReferenceImage: styleRefImagePath,
      permutedInstructions: permutedInstructionsRaw ? JSON.parse(permutedInstructionsRaw) : null,
      elementKeyValues: elementKeyValues || null,
      targetProduct: targetProduct || null,
      targetRatio: targetRatio || null
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
  delay 0.3
  -- Inject abort listener (triple-ESC calls abort)
  execute active tab of front window javascript "if(!window.__abortInjected){window.__abortInjected=1;var _et=[];document.addEventListener('keydown',function(e){if(e.key==='Escape'){_et.push(Date.now());_et=_et.filter(function(t){return Date.now()-t<1000});if(_et.length>=3){_et=[];fetch('http://localhost:3001/abort').catch(function(){});var d=document.createElement('div');d.style.cssText='position:fixed;top:0;left:0;right:0;padding:16px;background:#e72a88;color:white;text-align:center;font-weight:bold;font-size:20px;z-index:999999';d.textContent='ABORTED';document.body.appendChild(d);setTimeout(function(){d.remove()},2000)}}});} 'ok'"
  -- Activate Image Mode: click "Create image" chip on the page
  execute active tab of front window javascript "var chips=document.querySelectorAll('button,a,div[role=button]');for(var c of chips){if(c.textContent.includes('Create image')){c.click();break;}} 'ok'"
  delay 0.6
  -- Focus editor in image mode
  execute active tab of front window javascript "var el=document.querySelector('div[contenteditable=true]');if(el){el.focus();el.click();} 'ok'"
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

    const proc = exec(`osascript "${scriptFile}"`, { timeout: 30000 }, (error) => {
      setTimeout(() => { fs.rm(tempDir, { recursive: true }).catch(() => {}); }, 30000);
      if (error) console.error('  [X] AppleScript error:', error.message);
      else console.log('  [OK] Gemini automation completed');
    });
    trackAutomation(proc, 'Gemini single');

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
    const BATCH_SIZE = 10;

    // ═══ BATCHED BULK: Open 10 tabs at once, wait, process all 10, then next batch ═══
    let script = `
tell application "Google Chrome"
  activate
  set w to front window
end tell
`;

    for (let batchStart = 0; batchStart < tabCount; batchStart += BATCH_SIZE) {
      const batchEnd = Math.min(batchStart + BATCH_SIZE, tabCount);
      const batchSize = batchEnd - batchStart;

      // Open all tabs in this batch simultaneously
      script += `\n-- ═══ BATCH ${Math.floor(batchStart / BATCH_SIZE) + 1}: tabs ${batchStart + 1}-${batchEnd} ═══\n`;
      script += `tell application "Google Chrome"\n  set w to front window\n`;
      for (let i = batchStart; i < batchEnd; i++) {
        script += `  tell w to make new tab with properties {URL:"https://gemini.google.com/app"}\n`;
      }
      script += `
  -- Wait for all ${batchSize} tabs to load
  set tabTotal to count of tabs of w
  repeat 50 times
    set allDone to true
    repeat with i from (tabTotal - ${batchSize - 1}) to tabTotal
      if (loading of tab i of w) then set allDone to false
    end repeat
    if allDone then exit repeat
    delay 0.15
  end repeat
  delay 0.5
end tell
`;

      // Now process each tab in this batch
      for (let i = batchStart; i < batchEnd; i++) {
        const promptFile = promptFiles[i];
        const idxInBatch = i - batchStart;

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
-- CHECK ABORT before tab ${i + 1}
try
  do shell script "test -f ${ABORT_FILE} && echo aborted || echo ok"
  set abortCheck to result
  if abortCheck is "aborted" then return "aborted by user"
end try
-- TAB ${i + 1}/${tabCount}
tell application "Google Chrome"
  set w to front window
  set tabTotal to count of tabs of w
  set active tab index of w to (tabTotal - ${batchSize - 1 - idxInBatch})
  repeat 20 times
    if (execute active tab of w javascript "document.querySelector('div[contenteditable=true][role=textbox]')?'1':'0'") is "1" then exit repeat
    delay 0.1
  end repeat
  -- Inject abort listener (triple-ESC)
  execute active tab of w javascript "if(!window.__abortInjected){window.__abortInjected=1;var _et=[];document.addEventListener('keydown',function(e){if(e.key==='Escape'){_et.push(Date.now());_et=_et.filter(function(t){return Date.now()-t<1000});if(_et.length>=3){_et=[];fetch('http://localhost:3001/abort').catch(function(){});var d=document.createElement('div');d.style.cssText='position:fixed;top:0;left:0;right:0;padding:16px;background:#e72a88;color:white;text-align:center;font-weight:bold;font-size:20px;z-index:999999';d.textContent='ABORTED';document.body.appendChild(d);setTimeout(function(){d.remove()},2000)}}});} 'ok'"
  -- Activate Image Mode
  execute active tab of w javascript "var chips=document.querySelectorAll('button,a,div[role=button]');for(var c of chips){if(c.textContent.includes('Create image')){c.click();break;}} 'ok'"
  delay 0.6
  execute active tab of w javascript "var el=document.querySelector('div[contenteditable=true][role=textbox]');if(el){el.focus();el.click();} 'ok'"
${imgSteps}
  execute active tab of w javascript "var el=document.querySelector('div[contenteditable=true][role=textbox]');if(el){el.focus();el.click();} 'ok'"
end tell
do shell script "cat " & quoted form of "${promptFile}" & " | pbcopy"
tell application "System Events" to keystroke "v" using command down
delay 0.8
tell application "System Events"
  key code 36
end tell
delay 0.3
`;
      }
    }

    script += `\nreturn "done"\n`;

    const scriptFile = path.join(tempDir, 'bulk_automate.scpt');
    await fs.writeFile(scriptFile, script, 'utf8');

    console.log(`  📝 Executing batched Gemini automation (${tabCount} tabs, batches of ${BATCH_SIZE})...`);

    const proc = exec(`osascript "${scriptFile}"`, { timeout: tabCount * 15000 }, (error) => {
      setTimeout(() => { fs.rm(tempDir, { recursive: true }).catch(() => {}); }, 30000);
      if (error) console.error('  [X] Bulk error:', error.message);
      else console.log(`  [OK] Bulk Gemini done (${tabCount} tabs)`);
    });
    trackAutomation(proc, 'Gemini bulk');

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

    // Write prompt to temp file (legacy pbcopy fallback)
    const promptFile = path.join(tempDir, 'prompt.txt');
    await fs.writeFile(promptFile, sanitizePrompt(prompt), 'utf8');
    // Also expose prompt over HTTP so the page can fetch & inject via React's native setter.
    await fs.mkdir(tmpRefDir, { recursive: true });
    const promptHttpName = `prompt-${timestamp}.txt`;
    await fs.writeFile(path.join(tmpRefDir, promptHttpName), sanitizePrompt(prompt), 'utf8');
    const promptHttpUrl = `http://localhost:${PORT}/tmp-ref/${promptHttpName}`;

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
  tell front window to make new tab with properties {URL:"https://app.envato.com/image-gen"}
  -- Wait for page to load
  repeat 50 times
    if not (loading of active tab of front window) then exit repeat
    delay 0.15
  end repeat
  -- Wait for the prompt input to be ready (textarea, contenteditable, or text input)
  repeat 40 times
    set inputReady to (execute active tab of front window javascript "(document.querySelector('textarea')||document.querySelector('[contenteditable=\\"true\\"],[contenteditable=\\"\\"],div[role=textbox],[role=textbox]')||document.querySelector('input[type=text]'))?'1':'0'")
    if inputReady is "1" then exit repeat
    delay 0.2
  end repeat
  delay 0.3
  -- Inject abort listener (triple-ESC)
  execute active tab of front window javascript "if(!window.__abortInjected){window.__abortInjected=1;var _et=[];document.addEventListener('keydown',function(e){if(e.key==='Escape'){_et.push(Date.now());_et=_et.filter(function(t){return Date.now()-t<1000});if(_et.length>=3){_et=[];fetch('http://localhost:3001/abort').catch(function(){});var d=document.createElement('div');d.style.cssText='position:fixed;top:0;left:0;right:0;padding:16px;background:#e72a88;color:white;text-align:center;font-weight:bold;font-size:20px;z-index:999999';d.textContent='ABORTED';document.body.appendChild(d);setTimeout(function(){d.remove()},2000)}}});} 'ok'"
  -- Locate the prompt input (textarea OR contenteditable div OR role=textbox) and focus it.
  execute active tab of front window javascript "window.__promptFocused=0;(function(){try{var el=document.querySelector('textarea');var k='ta';if(!el){el=document.querySelector('[contenteditable=\\"true\\"],[contenteditable=\\"\\"],div[role=textbox],[role=textbox]');k='ce';}if(!el){el=document.querySelector('input[type=text]');k='in';}if(!el){window.__promptFocused=1;return;}window.__promptEl=el;window.__promptKind=k;el.scrollIntoView({block:'center'});el.focus();el.click();window.__promptFocused=1;}catch(e){window.__promptFocused=1;}})();"
  repeat 20 times
    set isFocused to (execute active tab of front window javascript "window.__promptFocused?'yes':'no'")
    if isFocused is "yes" then exit repeat
    delay 0.1
  end repeat
  delay 0.3
end tell
-- Paste via real clipboard (reliable for both textareas and contenteditable rich editors).
do shell script "cat " & quoted form of "${promptFile}" & " | pbcopy"
tell application "System Events" to keystroke "v" using command down
delay 0.8
tell application "Google Chrome"
${refUploadSection}
  delay 0.3
  -- Select aspect ratio (English + Spanish labels)
  execute active tab of front window javascript "(function(){var map={'square':['square','cuadrado'],'portrait':['portrait','vertical','retrato'],'landscape':['landscape','horizontal','paisaje']};var targets=map['${envatoAspect}'.toLowerCase()]||['${envatoAspect}'.toLowerCase()];function clickMatch(){var items=document.querySelectorAll('li,label,button,div[role=option],[role=menuitem],span');for(var i=0;i<items.length;i++){var t=(items[i].textContent||'').trim().toLowerCase();if(t.length===0||t.length>20)continue;for(var k=0;k<targets.length;k++){if(t===targets[k]){items[i].click();return true;}}}return false;}if(clickMatch())return'ok';var btns=document.querySelectorAll('button');for(var j=0;j<btns.length;j++){var bt=(btns[j].textContent||'').trim().toLowerCase();if(bt==='cuadrado'||bt==='square'||bt==='vertical'||bt==='portrait'||bt==='horizontal'||bt==='landscape'||bt==='retrato'||bt==='paisaje'){btns[j].click();return'opened';}}return'nf';})();"
  delay 0.4
  execute active tab of front window javascript "(function(){var map={'square':['square','cuadrado'],'portrait':['portrait','vertical','retrato'],'landscape':['landscape','horizontal','paisaje']};var targets=map['${envatoAspect}'.toLowerCase()]||['${envatoAspect}'.toLowerCase()];var items=document.querySelectorAll('li,label,button,div[role=option],[role=menuitem],span');for(var i=0;i<items.length;i++){var t=(items[i].textContent||'').trim().toLowerCase();if(t.length===0||t.length>20)continue;for(var k=0;k<targets.length;k++){if(t===targets[k]){items[i].click();return'ok';}}}return'skip';})();"
  delay 0.3
end tell
-- Click the Generate button (supports English "Generate" and Spanish "Generar").
tell application "Google Chrome"
  execute active tab of front window javascript "
    (function(){
      var btns = document.querySelectorAll('button');
      for(var i=0;i<btns.length;i++){
        var t = (btns[i].textContent||'').trim().toLowerCase();
        if(t==='generate' || t==='generar'){
          if(btns[i].disabled) return 'disabled';
          btns[i].click();
          return 'clicked';
        }
      }
      return 'not-found';
    })();
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

    const BATCH_SIZE = 10;

    // Build bulk AppleScript: open in batches of 10
    let script = `
tell application "Google Chrome"
  activate
  set w to front window
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

    // Process in batches of 10
    for (let batchStart = 0; batchStart < tabCount; batchStart += BATCH_SIZE) {
      const batchEnd = Math.min(batchStart + BATCH_SIZE, tabCount);
      const batchSize = batchEnd - batchStart;

      // Open all tabs in this batch simultaneously
      script += `\n-- ═══ BATCH ${Math.floor(batchStart / BATCH_SIZE) + 1}: tabs ${batchStart + 1}-${batchEnd} ═══\n`;
      script += `tell application "Google Chrome"\n  set w to front window\n`;
      for (let i = batchStart; i < batchEnd; i++) {
        script += `  tell w to make new tab with properties {URL:"https://app.envato.com/image-gen"}\n`;
      }
      script += `
  -- Wait for all ${batchSize} tabs to load
  set tabTotal to count of tabs of w
  repeat 60 times
    set allDone to true
    repeat with i from (tabTotal - ${batchSize - 1}) to tabTotal
      if (loading of tab i of w) then set allDone to false
    end repeat
    if allDone then exit repeat
    delay 0.1
  end repeat
  delay 0.3
end tell
`;

      // Process each tab in this batch
      for (let i = batchStart; i < batchEnd; i++) {
        const promptFile = promptFiles[i];
        const idxInBatch = i - batchStart;

        script += `
-- CHECK ABORT before tab ${i + 1}
try
  do shell script "test -f ${ABORT_FILE} && echo aborted || echo ok"
  set abortCheck to result
  if abortCheck is "aborted" then return "aborted by user"
end try
-- TAB ${i + 1}/${tabCount}
tell application "Google Chrome"
  set w to front window
  set tabTotal to count of tabs of w
  set active tab index of w to (tabTotal - ${batchSize - 1 - idxInBatch})
  -- Inject abort listener (triple-ESC)
  execute active tab of w javascript "if(!window.__abortInjected){window.__abortInjected=1;var _et=[];document.addEventListener('keydown',function(e){if(e.key==='Escape'){_et.push(Date.now());_et=_et.filter(function(t){return Date.now()-t<1000});if(_et.length>=3){_et=[];fetch('http://localhost:3001/abort').catch(function(){});var d=document.createElement('div');d.style.cssText='position:fixed;top:0;left:0;right:0;padding:16px;background:#e72a88;color:white;text-align:center;font-weight:bold;font-size:20px;z-index:999999';d.textContent='ABORTED';document.body.appendChild(d);setTimeout(function(){d.remove()},2000)}}});} 'ok'"
  -- Wait for input ready
  repeat 30 times
    set inputReady to (execute active tab of w javascript "
      var ta = document.querySelector('textarea, input[type=text]');
      ta ? '1' : '0';
    ")
    if inputReady is "1" then exit repeat
    delay 0.1
  end repeat
${bulkRefSection}
  -- Select aspect ratio ONLY (exact match, no styles)
  execute active tab of w javascript "
    (function(){
      var target = '${envatoAspects[i]}'.toLowerCase();
      var items = document.querySelectorAll('label, button, div[role=option], span, li');
      for(var i=0;i<items.length;i++){
        var t = items[i].textContent.trim().toLowerCase();
        if(t===target && t.length < 15){ items[i].click(); break; }
      }
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
      } // end per-tab loop
    } // end batch loop

    script += `\nreturn "done"\n`;

    const scriptFile = path.join(tempDir, 'bulk_automate.scpt');
    await fs.writeFile(scriptFile, script, 'utf8');

    console.log(`  📝 Executing batched Envato automation (${tabCount} tabs, batches of ${BATCH_SIZE})...`);

    const proc = exec(`osascript "${scriptFile}"`, { timeout: tabCount * 15000 }, (error) => {
      setTimeout(() => { fs.rm(tempDir, { recursive: true }).catch(() => {}); }, 30000);
      if (error) console.error('  [X] Bulk Envato error:', error.message);
      else console.log(`  [OK] Bulk Envato done (${tabCount} tabs)`);
    });
    trackAutomation(proc, 'Envato bulk');

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
  tell w to make new tab with properties {URL:"https://app.envato.com/image-gen"}
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

    // PHASE A: Open ALL ImageGen tabs, set prompts via JS (background, no tab switching)
    let script = `
tell application "Google Chrome"
  if (count of windows) is 0 then
    make new window
    delay 1.0
  end if
  set w to front window
`;
    // Open N tabs
    for (let i = 0; i < clipCount; i++) {
      script += `  tell w to make new tab with properties {URL:"https://app.envato.com/image-gen"}\n`;
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

    // For each tab: upload refs, set Portrait, disable Auto style, set prompt via JS, Generate
    for (let i = 0; i < clipCount; i++) {
      // Escape prompt for JS embedding
      const imgPromptB64 = Buffer.from(await fs.readFile(imgPromptFiles[i], 'utf8')).toString('base64');

      script += `
-- === IMAGE TAB ${i + 1}/${clipCount} (background) ===
tell application "Google Chrome"
  set w to front window
  set tabTotal to count of tabs of w
  set myTab to (tabTotal - ${clipCount - 1 - i})
  -- Wait for textarea (no tab switch needed)
  repeat 40 times
    set inputReady to (execute tab myTab of w javascript "var ta = document.querySelector('textarea'); ta ? '1' : '0';")
    if inputReady is "1" then exit repeat
    delay 0.2
  end repeat
  delay 0.3
${refUploadSection}
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
  -- FORCE disable Auto style: always click it off (defaults to ON on fresh page)
  execute tab myTab of w javascript "
    (function(){
      var btns = document.querySelectorAll('button');
      for(var m=0;m<btns.length;m++){
        var t = btns[m].textContent.trim();
        if(t.includes('Auto style')){
          btns[m].click();
          return 'auto style toggled off';
        }
      }
      return 'not found';
    })();
  "
  delay 0.5
  -- Set prompt via JS using base64 decode (no clipboard, no escaping issues)
  execute tab myTab of w javascript "
    (function(){
      var ta = document.querySelector('textarea');
      if(!ta) return 'no textarea';
      var decoded = new TextDecoder().decode(Uint8Array.from(atob('${imgPromptB64}'), function(c){return c.charCodeAt(0);}));
      var ns = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, 'value').set;
      ns.call(ta, decoded);
      ta.dispatchEvent(new Event('input', {bubbles:true}));
      ta.dispatchEvent(new Event('change', {bubbles:true}));
      return 'prompt set: ' + decoded.length;
    })();
  "
  delay 0.3
  -- Tag existing images + Generate
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

    // PHASE C: For each ImageGen tab, click image → Video → configure → set video prompt via JS → Generate
    for (let i = 0; i < clipCount; i++) {
      // Escape video prompt for JS embedding
      const vidPromptB64 = Buffer.from(await fs.readFile(vidPromptFiles[i], 'utf8')).toString('base64');
      script += `
-- === VIDEO CONVERSION ${i + 1}/${clipCount} (background) ===
tell application "Google Chrome"
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

  -- Mark existing video-gen tabs so we can find the NEW one after clicking Video
  repeat with winIdx from 1 to (count of windows)
    repeat with tIdx from 1 to (count of tabs of window winIdx)
      if URL of tab tIdx of window winIdx contains "video-gen" then
        try
          execute tab tIdx of window winIdx javascript "window.__axkan_old_vid=true;"
        end try
      end if
    end repeat
  end repeat
  delay 0.2

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

  -- Find the NEW video-gen tab (skip ones marked __axkan_old_vid)
  set vidFound to false
  repeat 30 times
    repeat with winIdx from 1 to (count of windows)
      repeat with tIdx from 1 to (count of tabs of window winIdx)
        if URL of tab tIdx of window winIdx contains "video-gen" then
          try
            set isOld to (execute tab tIdx of window winIdx javascript "window.__axkan_old_vid ? 'old' : 'new'")
            if isOld is "new" then
              set w to window winIdx
              set myTab to tIdx
              set active tab index of w to myTab
              set vidFound to true
              exit repeat
            end if
          on error
            -- Tab may still be loading, treat as new
            set w to window winIdx
            set myTab to tIdx
            set active tab index of w to myTab
            set vidFound to true
            exit repeat
          end try
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

  -- Configure: 9:16, Sound, Speech (all via background JS)
  execute tab myTab of w javascript "
    (function(){
      var btns = document.querySelectorAll('button');
      for(var j=0;j<btns.length;j++){
        var t = btns[j].textContent.trim();
        if((t==='16:9' || t==='9:16' || t==='1:1') && btns[j].getBoundingClientRect().height>=40){
          btns[j].dispatchEvent(new MouseEvent('click',{bubbles:true,cancelable:true}));
          break;
        }
      }
      setTimeout(function(){
        var all = document.querySelectorAll('button');
        for(var k=0;k<all.length;k++){
          if(all[k].textContent.trim()==='9:16'){
            all[k].dispatchEvent(new MouseEvent('click',{bubbles:true,cancelable:true}));
            break;
          }
        }
      }, 300);
      // Settings icon
      setTimeout(function(){
        var all = document.querySelectorAll('button');
        for(var k=0;k<all.length;k++){
          var r = all[k].getBoundingClientRect();
          var t = all[k].textContent.trim();
          if(t==='' && !all[k].disabled && r.width>=40 && r.width<=60 && r.height>=40 && r.height<=60 && all[k].querySelector('svg')){
            all[k].dispatchEvent(new MouseEvent('click',{bubbles:true,cancelable:true}));
            break;
          }
        }
      }, 600);
      // Sound
      setTimeout(function(){
        var all = document.querySelectorAll('button');
        for(var k=0;k<all.length;k++){
          if(all[k].textContent.trim()==='Sound' && !all[k].disabled){
            all[k].dispatchEvent(new MouseEvent('click',{bubbles:true,cancelable:true})); break;
          }
        }
      }, 1000);
      // Speech
      setTimeout(function(){
        var all = document.querySelectorAll('button');
        for(var k=0;k<all.length;k++){
          if(all[k].textContent.trim()==='Speech' && !all[k].disabled){
            all[k].dispatchEvent(new MouseEvent('click',{bubbles:true,cancelable:true})); break;
          }
        }
      }, 1400);
      // Close dropdown
      setTimeout(function(){
        document.body.dispatchEvent(new MouseEvent('click',{bubbles:true,cancelable:true}));
      }, 1700);
    })();
  "
  delay 2.0
  -- Set video prompt via JS using base64 decode
  execute tab myTab of w javascript "
    (function(){
      var ta = document.querySelector('textarea');
      if(!ta) return 'no textarea';
      var decoded = new TextDecoder().decode(Uint8Array.from(atob('${vidPromptB64}'), function(c){return c.charCodeAt(0);}));
      var ns = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, 'value').set;
      ns.call(ta, decoded);
      ta.dispatchEvent(new Event('input', {bubbles:true}));
      ta.dispatchEvent(new Event('change', {bubbles:true}));
      return 'prompt set: ' + decoded.length;
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
    const { prompt, speech, referenceImages } = req.body;

    if (!prompt) {
      return res.status(400).json({ success: false, error: 'No prompt provided' });
    }

    // Write reference images to tmp-ref if provided
    let refFilenames = [];
    if (referenceImages && Array.isArray(referenceImages) && referenceImages.length > 0) {
      refFilenames = await writeRefImages(referenceImages);
    }

    console.log(`\n🎬 Send to Envato Video Gen (background): prompt length=${prompt.length}, speech length=${(speech || '').length}, refs=${refFilenames.length}`);

    const timestamp = Date.now();
    const tempDir = path.join(os.tmpdir(), `envato-video-${timestamp}`);
    await fs.mkdir(tempDir, { recursive: true });

    // Combine prompt + speech
    const hasSpeech = speech && speech.trim().length > 0;
    const combinedPrompt = hasSpeech
      ? `${prompt}\n\nVoiceover (Spanish): ${speech}`
      : prompt;

    // Escape the prompt for embedding in JS string
    const vidPromptB64Single = Buffer.from(sanitizeVideoPrompt(combinedPrompt)).toString('base64');

    // Build reference image upload section if we have images
    let refUploadSection = '';
    if (refFilenames.length > 0) {
      // Save ref-upload.js to tmp-ref so the page can fetch it
      await fs.writeFile(path.join(tmpRefDir, 'ref-upload.js'), generateRefUploadJS(refFilenames), 'utf8');
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
    }

    // BACKGROUND AppleScript: no activate, no tab switching, no clipboard paste
    // Everything done via "execute tab ... javascript" — user can keep working
    const appleScript = `
tell application "Google Chrome"
  set w to front window
  tell w to make new tab with properties {URL:"https://labs.envato.com/video-gen"}
  set myTab to (count of tabs of w)

  -- Wait for page to load (no tab switch needed)
  repeat 60 times
    if not (loading of tab myTab of w) then exit repeat
    delay 0.15
  end repeat
  delay 2.5

  -- ALL STEPS via background JS execution (no tab switching, no keyboard)

  -- STEP 1: Select 9:16 aspect ratio
  execute tab myTab of w javascript "
    (function(){
      var btns = document.querySelectorAll('button');
      for(var i=0;i<btns.length;i++){
        var t = btns[i].textContent.trim();
        if((t==='16:9' || t==='9:16' || t==='1:1') && btns[i].getBoundingClientRect().height>=40){
          btns[i].dispatchEvent(new MouseEvent('click',{bubbles:true,cancelable:true}));
          break;
        }
      }
      setTimeout(function(){
        var all = document.querySelectorAll('button');
        for(var j=0;j<all.length;j++){
          if(all[j].textContent.trim()==='9:16'){
            all[j].dispatchEvent(new MouseEvent('click',{bubbles:true,cancelable:true}));
            break;
          }
        }
      }, 300);
    })();
  "
  delay 1.0

  -- STEP 2: Open settings, enable Sound + Speech
  execute tab myTab of w javascript "
    (function(){
      var btns = document.querySelectorAll('button');
      for(var i=0;i<btns.length;i++){
        var r = btns[i].getBoundingClientRect();
        var t = btns[i].textContent.trim();
        if(t==='' && !btns[i].disabled && r.width>=40 && r.width<=60 && r.height>=40 && r.height<=60 && btns[i].querySelector('svg')){
          btns[i].dispatchEvent(new MouseEvent('click',{bubbles:true,cancelable:true}));
          break;
        }
      }
      setTimeout(function(){
        var all = document.querySelectorAll('button');
        for(var j=0;j<all.length;j++){
          if(all[j].textContent.trim()==='Sound' && !all[j].disabled){
            all[j].dispatchEvent(new MouseEvent('click',{bubbles:true,cancelable:true}));
            break;
          }
        }
      }, 400);
      setTimeout(function(){
        var all = document.querySelectorAll('button');
        for(var j=0;j<all.length;j++){
          if(all[j].textContent.trim()==='Speech' && !all[j].disabled){
            all[j].dispatchEvent(new MouseEvent('click',{bubbles:true,cancelable:true}));
            break;
          }
        }
      }, 800);
      setTimeout(function(){
        document.body.dispatchEvent(new MouseEvent('click',{bubbles:true,cancelable:true}));
      }, 1100);
    })();
  "
  delay 1.5
${refUploadSection}
  -- STEP 3: Set prompt text via JS using base64 decode
  execute tab myTab of w javascript "
    (function(){
      var ta = document.querySelector('textarea');
      if(!ta) return 'no textarea';
      var decoded = new TextDecoder().decode(Uint8Array.from(atob('${vidPromptB64Single}'), function(c){return c.charCodeAt(0);}));
      var nativeSetter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, 'value').set;
      nativeSetter.call(ta, decoded);
      ta.dispatchEvent(new Event('input', {bubbles:true}));
      ta.dispatchEvent(new Event('change', {bubbles:true}));
      return 'prompt set: ' + decoded.length;
    })();
  "
  delay 0.8

  -- STEP 4: Click Generate
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
      else console.log('  [OK] Envato Video background automation completed');
    });

    res.json({ success: true, message: 'Sending to Envato Video Gen (background)...' });

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
-- CHECK ABORT before tab ${i + 1}
try
  do shell script "test -f ${ABORT_FILE} && echo aborted || echo ok"
  set abortCheck to result
  if abortCheck is "aborted" then return "aborted by user"
end try
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

// Global error handler for multer, JSON parse, and other middleware errors
app.use((err, req, res, next) => {
  // Prevent double-response if headers already sent
  if (res.headersSent) {
    console.error('[!] Error after headers sent:', err.message);
    return next(err);
  }

  // Multer: file too large
  if (err.code === 'LIMIT_FILE_SIZE') {
    console.error(`[!] File too large: ${err.field || 'unknown'} — ${err.message}`);
    return res.status(413).json({ success: false, error: 'Image file too large (max 50MB). The image will be auto-compressed on retry.' });
  }
  // Multer: other errors (too many files, unexpected field, etc.)
  if (err.name === 'MulterError') {
    console.error(`[!] Multer error [${err.code}]: ${err.message}`);
    return res.status(400).json({ success: false, error: `Upload error: ${err.message}` });
  }
  // JSON parse errors
  if (err.type === 'entity.parse.failed') {
    console.error(`[!] JSON parse error: ${err.message}`);
    return res.status(400).json({ success: false, error: 'Invalid request format' });
  }
  // Payload too large (express body-parser)
  if (err.type === 'entity.too.large') {
    console.error(`[!] Payload too large: ${err.message}`);
    return res.status(413).json({ success: false, error: 'Request payload too large. Try reducing the number or size of images.' });
  }

  // Catch-all
  console.error('[!] Unhandled server error:', err.stack || err.message || err);
  res.status(500).json({ success: false, error: err.message || 'Internal server error' });
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
