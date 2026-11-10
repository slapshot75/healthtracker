// Chart.js kommt in der App vom CDN. Damit die Tests nicht bei jedem Seitenaufruf vom
// Netz abhängen, wird die Datei einmal geladen, gegen den SRI-Hash aus index.html
// geprüft und im Temp-Ordner abgelegt. Die Tests liefern sie von dort aus (fixtures.js).
const fs = require('fs');
const os = require('os');
const path = require('path');
const crypto = require('crypto');

// URL und Hash stehen nur an einer Stelle: im <script>-Tag der App.
function chartScriptTag() {
  const html = fs.readFileSync(path.join(__dirname, '..', '..', 'index.html'), 'utf8');
  const m = html.match(/<script src="(https:\/\/cdnjs\.cloudflare\.com\/[^"]*chart[^"]*)" integrity="(sha384-[^"]+)"/i);
  if (!m) throw new Error('Chart.js-Skript-Tag mit SRI-Hash nicht in index.html gefunden');
  return { url: m[1], integrity: m[2] };
}

function cachePath() {
  const { integrity } = chartScriptTag();
  const name = 'chartjs-' + crypto.createHash('sha1').update(integrity).digest('hex').slice(0, 12) + '.js';
  return path.join(os.tmpdir(), 'healthtracker-e2e-cache', name);
}

function matches(buf, integrity) {
  return 'sha384-' + crypto.createHash('sha384').update(buf).digest('base64') === integrity;
}

async function ensureChartJs() {
  const { url, integrity } = chartScriptTag();
  const file = cachePath();
  if (fs.existsSync(file) && matches(fs.readFileSync(file), integrity)) return file;

  let lastError;
  for (let attempt = 1; attempt <= 4; attempt++) {
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error('HTTP ' + res.status);
      const buf = Buffer.from(await res.arrayBuffer());
      if (!matches(buf, integrity)) throw new Error('SRI-Hash aus index.html passt nicht zur CDN-Datei');
      fs.mkdirSync(path.dirname(file), { recursive: true });
      fs.writeFileSync(file, buf);
      return file;
    } catch (e) {
      lastError = e;
      await new Promise((r) => setTimeout(r, attempt * 1000));
    }
  }
  throw new Error(`Chart.js konnte nicht geladen werden (${url}): ${lastError.message}`);
}

module.exports = { chartScriptTag, cachePath, ensureChartJs };
