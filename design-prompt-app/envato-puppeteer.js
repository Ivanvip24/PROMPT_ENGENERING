// Envato ImageGen automation via Puppeteer (runs in background)
// Uses the user's real Chrome (not bundled Chromium) so Google OAuth works
const puppeteer = require('puppeteer-core');
const path = require('path');

const PROFILE_DIR = path.join(__dirname, '.puppeteer-profile');
const CHROME_PATH = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
let browser = null;

async function getBrowser(headless = true) {
  if (browser && browser.isConnected()) return browser;
  browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: headless ? 'new' : false,
    userDataDir: PROFILE_DIR,
    ignoreDefaultArgs: ['--enable-automation'],
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--window-size=1280,900',
      '--disable-blink-features=AutomationControlled'
    ]
  });
  browser.on('disconnected', () => { browser = null; });
  return browser;
}

// Open browser visibly so user can log in to Envato once
async function envLoginVisible() {
  // Close any existing headless browser (can't share profile)
  if (browser && browser.isConnected()) {
    await browser.close().catch(() => {});
    browser = null;
  }
  const b = await getBrowser(false); // visible
  const page = await b.newPage();
  await page.goto('https://app.envato.com/image-gen', { waitUntil: 'networkidle2', timeout: 60000 });
  console.log('[Puppeteer] Login browser opened. User should log in and close when done.');
  // Wait for user to close the browser manually
  return new Promise((resolve) => {
    b.on('disconnected', () => {
      browser = null;
      console.log('[Puppeteer] Login browser closed by user.');
      resolve();
    });
  });
}

// Generate JS for reference image upload (reuses same logic as AppleScript flow)
function generateRefUploadJS(filenames, port) {
  const urls = filenames.map(f => `http://localhost:${port}/tmp-ref/${f}`);
  const urlsJSON = JSON.stringify(urls);
  return `
window.__refUploadDone = false;
(async function() {
  try {
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
    for (var a = 0; a < 30; a++) {
      if (document.querySelectorAll('input[type=file]').length >= 1) break;
      await new Promise(function(r) { setTimeout(r, 200); });
    }
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
    await new Promise(function(r) { setTimeout(r, 2000); });
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', code: 'Escape', keyCode: 27, bubbles: true }));
  } catch(e) { console.error('ref upload error:', e); }
  window.__refUploadDone = true;
})();
`;
}

// Core automation: fill and submit one Envato ImageGen page
async function automateEnvatoPage(page, { prompt, aspectRatio, refFilenames, port }) {
  // 1. Navigate
  await page.goto('https://app.envato.com/image-gen', { waitUntil: 'networkidle2', timeout: 60000 });

  // 2. Wait for textarea (confirms logged in + page ready)
  await page.waitForSelector('textarea, input[type=text]', { timeout: 30000 });
  await new Promise(r => setTimeout(r, 500));

  // 3. Upload reference images
  if (refFilenames && refFilenames.length > 0) {
    const refJS = generateRefUploadJS(refFilenames, port);
    await page.evaluate(refJS);
    await page.waitForFunction(() => window.__refUploadDone === true, { timeout: 20000 }).catch(() => {
      console.warn('[Puppeteer] Ref upload timed out, continuing...');
    });
    await new Promise(r => setTimeout(r, 500));
  }

  // 4. Select aspect ratio
  await page.evaluate((ratio) => {
    // Click current ratio to open dropdown
    var triggers = document.querySelectorAll('button, [role=combobox], [role=listbox]');
    for (var j = 0; j < triggers.length; j++) {
      var txt = triggers[j].textContent.trim().toLowerCase();
      if (txt.includes('square') || txt.includes('portrait') || txt.includes('landscape')) {
        triggers[j].click();
        break;
      }
    }
    // Also try radio/checkbox style
    var labels = document.querySelectorAll('label, span, div, button');
    for (var i = 0; i < labels.length; i++) {
      var t = labels[i].textContent.trim().toLowerCase();
      if (t === 'square' || t === 'portrait' || t === 'landscape') {
        var el = labels[i].closest('button') || labels[i].closest('label') || labels[i];
        if (el.querySelector('input[type=radio],input[type=checkbox]')) el.click();
      }
    }
  }, aspectRatio);

  await new Promise(r => setTimeout(r, 400));

  // Click the target option
  await page.evaluate((ratio) => {
    var target = ratio.toLowerCase();
    var items = document.querySelectorAll('li, label, button, div[role=option], span');
    for (var i = 0; i < items.length; i++) {
      if (items[i].textContent.trim().toLowerCase() === target) {
        items[i].click();
        return;
      }
    }
  }, aspectRatio);

  await new Promise(r => setTimeout(r, 400));

  // 5. Type prompt into textarea (React-compatible)
  await page.evaluate((text) => {
    var ta = document.querySelector('textarea, input[type=text]');
    if (!ta) return;
    ta.focus();
    ta.click();
    // Use React-compatible setter
    var nativeSetter = Object.getOwnPropertyDescriptor(
      window.HTMLTextAreaElement.prototype, 'value'
    ).set;
    nativeSetter.call(ta, text);
    ta.dispatchEvent(new Event('input', { bubbles: true }));
    ta.dispatchEvent(new Event('change', { bubbles: true }));
  }, prompt);

  await new Promise(r => setTimeout(r, 800));

  // 6. Click Generate
  await page.evaluate(() => {
    var btns = document.querySelectorAll('button');
    for (var i = 0; i < btns.length; i++) {
      if (btns[i].textContent.trim().toLowerCase().includes('generate')) {
        btns[i].click();
        break;
      }
    }
  });

  console.log(`[Puppeteer] Envato generation started: "${prompt.substring(0, 60)}..."`);
}

// Single send
async function sendToEnvato({ prompt, aspectRatio, refFilenames, port }) {
  const b = await getBrowser(true);
  const page = await b.newPage();
  try {
    await automateEnvatoPage(page, { prompt, aspectRatio, refFilenames, port });
    // Don't close page — let image generate in background
  } catch (err) {
    console.error('[Puppeteer] Single send failed:', err.message);
    await page.close().catch(() => {});
    throw err;
  }
}

// Bulk send — open all pages in parallel
async function sendAllToEnvato({ prompts, aspectRatios, refFilenames, port }) {
  const b = await getBrowser(true);
  const results = await Promise.allSettled(
    prompts.map(async (prompt, i) => {
      const page = await b.newPage();
      try {
        const aspectRatio = aspectRatios[i] || 'Square';
        await automateEnvatoPage(page, { prompt, aspectRatio, refFilenames, port });
        console.log(`[Puppeteer] Tab ${i + 1}/${prompts.length} done`);
      } catch (err) {
        console.error(`[Puppeteer] Tab ${i + 1} failed:`, err.message);
        await page.close().catch(() => {});
        throw err;
      }
    })
  );
  const succeeded = results.filter(r => r.status === 'fulfilled').length;
  console.log(`[Puppeteer] Bulk complete: ${succeeded}/${prompts.length} tabs`);
  return { succeeded, total: prompts.length };
}

async function closeBrowser() {
  if (browser && browser.isConnected()) {
    await browser.close().catch(() => {});
    browser = null;
  }
}

module.exports = { envLoginVisible, sendToEnvato, sendAllToEnvato, closeBrowser };
