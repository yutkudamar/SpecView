const API_URL = 'http://localhost:3000/api/specs';

const $ = id => document.getElementById(id);
const dot = $('status-dot');

const stateEls = {
  idle:    $('idle-state'),
  loading: $('loading-state'),
  result:  $('result-state'),
  error:   $('error-state'),
};

function show(name) {
  Object.values(stateEls).forEach(el => el.classList.remove('active'));
  stateEls[name].classList.add('active');
}

function bar(pct) {
  const cls = pct >= 90 ? 'crit' : pct >= 70 ? 'warn' : '';
  return `
    <div class="usage-row">
      <div class="bar-track">
        <div class="bar-fill ${cls}" data-target="${pct}"></div>
      </div>
      <div class="bar-pct">${pct}%</div>
    </div>`;
}

function card(iconTxt, iconClass, label, title, metaHTML, usagePct) {
  return `
    <div class="card">
      <div class="card-header">
        <div class="card-icon ${iconClass}">${iconTxt}</div>
        <div class="card-label">${label}</div>
      </div>
      <div class="card-title">${title}</div>
      <div class="card-meta">${metaHTML}</div>
      ${usagePct != null ? bar(usagePct) : ''}
    </div>`;
}

function render({ cpu, ram, gpu, os, disk, battery }) {
  const ramPct = Math.round((ram.used / ram.total) * 100);
  let html = '';

  // CPU
  html += card(
    'CPU', '',
    'Processor', cpu.brand,
    `<b>${cpu.manufacturer}</b> &nbsp;·&nbsp; ${cpu.physicalCores} cores / ${cpu.cores} threads<br>
     Base <b>${cpu.speed} GHz</b> &nbsp;·&nbsp; Max <b>${cpu.speedMax} GHz</b>`
  );

  // RAM
  html += card(
    'MEM', 'green',
    'Memory', `${ram.total} GB`,
    `<b>${ram.used} GB</b> used &nbsp;·&nbsp; <b>${ram.free} GB</b> free`,
    ramPct
  );

  // GPU(s)
  gpu.forEach((g, i) => {
    html += card(
      'GPU', 'purple',
      i === 0 ? 'Graphics' : `Graphics ${i + 1}`,
      g.model || 'Unknown GPU',
      [
        g.vendor ? `<b>${g.vendor}</b>` : null,
        g.vram   ? `${g.vram} MB VRAM` : null,
      ].filter(Boolean).join(' &nbsp;·&nbsp; ')
    );
  });

  // OS — full width
  html += `
    <div class="card full">
      <div class="card-header">
        <div class="card-icon amber">OS</div>
        <div class="card-label">Operating System</div>
      </div>
      <div class="card-title">${os.distro} ${os.release}</div>
      <div class="card-meta">
        <b>${os.arch}</b> &nbsp;·&nbsp; ${os.platform} &nbsp;·&nbsp; hostname: <b>${os.hostname}</b>
      </div>
    </div>`;

  // Disk(s)
  disk.forEach((d, i) => {
    html += card(
      'DSK', '',
      i === 0 ? 'Storage' : `Disk ${i + 1}`,
      `${d.size} GB ${d.type || ''}`.trim(),
      [d.name, d.vendor].filter(Boolean).join(' &nbsp;·&nbsp; ')
    );
  });

  // Battery
  if (battery.hasBattery) {
    html += card(
      'BAT', 'green',
      'Battery',
      `${battery.percent}% ${battery.isCharging ? '⚡' : ''}`,
      battery.isCharging ? 'Charging' : 'On battery',
      battery.percent
    );
  }

  $('specs-grid').innerHTML = html;
  show('result');
  dot.className = 'status-dot active';

  requestAnimationFrame(() => setTimeout(() => {
    document.querySelectorAll('.bar-fill').forEach(el => {
      el.style.width = el.dataset.target + '%';
    });
  }, 60));
}

async function fetchSpecs() {
  show('loading');
  dot.className = 'status-dot';
  try {
    const res  = await fetch(API_URL);
    if (!res.ok) throw new Error('HTTP ' + res.status);
    const data = await res.json();
    if (!data.success) throw new Error(data.error);
    render(data.specs);
  } catch (e) {
    console.error(e);
    show('error');
    dot.className = 'status-dot error';
  }
}

$('scan-btn').addEventListener('click',   fetchSpecs);
$('rescan-btn').addEventListener('click', fetchSpecs);
$('retry-btn').addEventListener('click',  fetchSpecs);