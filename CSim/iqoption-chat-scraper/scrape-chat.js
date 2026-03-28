const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

// ── CONFIG ────────────────────────────────────────────────────────────────────
const OUTPUT_FILE = './chat-messages.jsonl';  // one JSON object per line
// Persistent profile dir — login is remembered across all runs
const PROFILE_DIR = path.join(__dirname, '.browser-profile');
// Prefer regular installed Chrome instead of Playwright's Chrome for Testing
const CHROME_CHANNEL = process.env.PW_CHROME_CHANNEL || 'chrome';
const TARGET_URL = 'https://km.iqoption.com/traderoom';
const ATTACHED_MARK = '__wsHookAttached';
// ─────────────────────────────────────────────────────────────────────────────

async function launchBrowserContext() {
  const baseOptions = {
    headless: false,
    args: [
      '--no-sandbox',
      '--disable-blink-features=AutomationControlled',
      '--no-first-run',
      '--no-default-browser-check',
      '--disable-features=ChromeWhatsNewUI',
    ],
    ignoreDefaultArgs: ['--enable-automation'],
  };

  try {
    // Uses locally installed Chrome/Edge channels when available.
    return await chromium.launchPersistentContext(PROFILE_DIR, {
      ...baseOptions,
      channel: CHROME_CHANNEL,
    });
  } catch (err) {
    console.warn(`[WARN] Could not launch channel "${CHROME_CHANNEL}". Falling back to bundled Chromium.`);
    return chromium.launchPersistentContext(PROFILE_DIR, baseOptions);
  }
}

function isIqOptionPage(url) {
  return /iqoption\.com/i.test(url || '');
}

function isLikelyNoisePage(url, title) {
  const lowUrl = (url || '').toLowerCase();
  const lowTitle = (title || '').toLowerCase();
  return (
    lowTitle.includes("what's new") ||
    lowTitle.includes('welcome') ||
    lowUrl.includes('chrome://') ||
    lowUrl.includes('whats-new') ||
    lowUrl.includes('welcome')
  );
}

async function closeIfNoisePage(page) {
  try {
    const url = page.url();
    const title = await page.title().catch(() => '');
    if (isLikelyNoisePage(url, title) && !isIqOptionPage(url)) {
      console.log(`[POPUP] Closing non-target page: ${title || url}`);
      await page.close({ runBeforeUnload: true }).catch(() => {});
      return true;
    }
  } catch (_) {}
  return false;
}

async function dismissWhatsNewModal(page) {
  try {
    const hasWhatsNew = await page
      .locator('text=/what\\s*new/i')
      .first()
      .isVisible({ timeout: 250 })
      .catch(() => false);

    if (!hasWhatsNew) return;

    const closeSelectors = [
      'button[aria-label="Close"]',
      '[role="dialog"] button:has-text("Close")',
      '[role="dialog"] button:has-text("Got it")',
      '[role="dialog"] button:has-text("OK")',
    ];

    for (const selector of closeSelectors) {
      const btn = page.locator(selector).first();
      if (await btn.isVisible({ timeout: 200 }).catch(() => false)) {
        await btn.click({ timeout: 500 }).catch(() => {});
        console.log('[POPUP] Closed a "What\'s New" modal.');
        return;
      }
    }
  } catch (_) {}
}

function attachWebSocketInterceptor(page, chatMessages) {
  if (page[ATTACHED_MARK]) return;
  page[ATTACHED_MARK] = true;

  page.on('websocket', (ws) => {
    console.log(`[WS] Connected: ${ws.url()}`);

    ws.on('framereceived', ({ payload }) => {
      try {
        const text = typeof payload === 'string' ? payload : payload.toString();
        const data = JSON.parse(text);

        // IQ Option WS messages have a "name" field — filter for chat
        const name = data?.name || data?.msg || '';
        const isChatMsg =
          name.includes('chat') ||
          name.includes('Chat') ||
          JSON.stringify(data).toLowerCase().includes('"chat"') ||
          JSON.stringify(data).toLowerCase().includes('"message"');

        if (isChatMsg) {
          const entry = {
            timestamp: new Date().toISOString(),
            wsUrl: ws.url(),
            data,
          };
          chatMessages.push(entry);
          fs.appendFileSync(OUTPUT_FILE, JSON.stringify(entry) + '\n');
          console.log(`[CHAT] ${JSON.stringify(data).substring(0, 200)}`);
        }
      } catch (_) {
        // binary / non-JSON frame — skip
      }
    });

    ws.on('framesent', ({ payload }) => {
      try {
        const text = typeof payload === 'string' ? payload : payload.toString();
        const data = JSON.parse(text);
        if (JSON.stringify(data).toLowerCase().includes('chat')) {
          console.log(`[WS SENT] ${text.substring(0, 200)}`);
        }
      } catch (_) {}
    });

    ws.on('close', () => console.log(`[WS] Closed: ${ws.url()}`));
  });
}

async function main() {
  // launchPersistentContext stores cookies, localStorage, IndexedDB on disk.
  // After the first login it never asks again — just like a real browser.
  const context = await launchBrowserContext();

  const page = context.pages().find((p) => isIqOptionPage(p.url())) || await context.newPage();
  const chatMessages = [];
  let activePage = page;

  // Attach interceptor to all current/future pages so popups do not break capture.
  for (const p of context.pages()) {
    attachWebSocketInterceptor(p, chatMessages);
    await closeIfNoisePage(p);
  }

  context.on('page', async (p) => {
    attachWebSocketInterceptor(p, chatMessages);
    const wasClosed = await closeIfNoisePage(p);
    if (!wasClosed && isIqOptionPage(p.url())) {
      activePage = p;
    }
  });

  console.log('Navigating to IQ Option traderoom...');
  await activePage.goto(TARGET_URL, { waitUntil: 'domcontentloaded' });

  // If not logged in yet, wait for manual login once (profile saves it permanently)
  if (activePage.url().includes('login')) {
    console.log('\n⚠️  First run: please log in manually in the browser window.');
    console.log('After this, the session is saved and you will never need to log in again.\n');
    await activePage.waitForURL('**/traderoom', { timeout: 120_000 });
  }

  console.log('✅ Traderoom loaded. Listening for chat messages...');
  console.log(`📝 Saving to: ${OUTPUT_FILE}\n`);
  console.log(`🔒 Session stored in: ${PROFILE_DIR}\n`);
  console.log(`🌐 Browser channel: ${CHROME_CHANNEL} (fallback to bundled Chromium if unavailable)\n`);

  // Keep session on target and close interruptions if popups appear later.
  const guard = setInterval(async () => {
    try {
      for (const p of context.pages()) {
        await closeIfNoisePage(p);
      }

      if (!activePage || activePage.isClosed()) {
        const candidate = context.pages().find((p) => isIqOptionPage(p.url()));
        activePage = candidate || await context.newPage();
      }

      if (!isIqOptionPage(activePage.url())) {
        await activePage.goto(TARGET_URL, { waitUntil: 'domcontentloaded', timeout: 20_000 }).catch(() => {});
      }

      await dismissWhatsNewModal(activePage);
    } catch (_) {}
  }, 10_000);

  // Keep running until Ctrl+C
  process.on('SIGINT', async () => {
    clearInterval(guard);
    console.log(`\n\nStopped. ${chatMessages.length} chat messages saved to ${OUTPUT_FILE}`);
    await context.close();
    process.exit(0);
  });

  await new Promise(() => {});
}

main().catch(console.error);
